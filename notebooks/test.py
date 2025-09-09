import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score, roc_auc_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
import xgboost as xgb
import h2o
from h2o.estimators import H2OGradientBoostingEstimator
from h2o.grid import H2OGridSearch
import lightgbm as lgb
import warnings
warnings.filterwarnings('ignore')

def prepare_data(df, target_column, sample_fraction=0.02, test_size=0.2, random_state=42, task_type='classification'):
    """
    Prepare data by sampling and splitting
    
    Args:
        df: Full dataset
        target_column: Name of target column
        sample_fraction: Fraction of data to use (default 0.2 = 20%)
        test_size: Test split ratio (default 0.2 = 20%)
        random_state: Random seed for reproducibility
        task_type: 'classification' or 'regression'
    
    Returns:
        X_train, X_test, y_train, y_test
    """
    # Create a copy to avoid modifying original data
    df_work = df.copy()
    
    # For classification, convert continuous ARRIVAL_DELAY to binary classification
    # US standard: >15 minutes = delayed (1), <=15 minutes = on-time (0)
    if task_type == 'classification' and target_column == 'ARRIVAL_DELAY':
        print("Converting ARRIVAL_DELAY to binary classification (US standard: >15 min = delayed)")
        df_work['DELAY_BINARY'] = (df_work[target_column] > 15).astype(int)
        target_column = 'DELAY_BINARY'
        
        # Print distribution
        delayed_count = df_work[target_column].sum()
        total_count = len(df_work)
        print(f"Delayed flights (>15 min): {delayed_count:,} ({delayed_count/total_count*100:.2f}%)")
        print(f"On-time flights (<=15 min): {total_count-delayed_count:,} ({(total_count-delayed_count)/total_count*100:.2f}%)")
    
    # Sample the data
    df_sample = df_work.sample(frac=sample_fraction, random_state=random_state)
    print(f"Original data size: {len(df_work)}")
    print(f"Sample data size: {len(df_sample)}")
    
    # Separate features and target
    X = df_sample.drop(columns=[target_column])
    # Remove original ARRIVAL_DELAY if we created DELAY_BINARY
    if 'DELAY_BINARY' in df_sample.columns and target_column == 'DELAY_BINARY':
        X = X.drop(columns=['ARRIVAL_DELAY'])
    
    y = df_sample[target_column]
    
    # Handle categorical variables for LightGBM
    categorical_columns = ['AIRLINE', 'TAIL_NUMBER', 'ORIGIN_AIRPORT', 'DESTINATION_AIRPORT', 'ROUTE']
    label_encoders = {}
    
    print("Encoding categorical variables...")
    for col in categorical_columns:
        if col in X.columns:
            le = LabelEncoder()
            # Fit on the entire column and transform
            X[col] = le.fit_transform(X[col].astype(str))
            label_encoders[col] = le
            print(f"  {col}: {len(le.classes_)} unique values encoded")
    
    # Handle the DISTANCE_BUCKET categorical column if present
    if 'DISTANCE_BUCKET' in X.columns:
        le_distance = LabelEncoder()
        X['DISTANCE_BUCKET'] = le_distance.fit_transform(X['DISTANCE_BUCKET'].astype(str))
        label_encoders['DISTANCE_BUCKET'] = le_distance
        print(f"  DISTANCE_BUCKET: {len(le_distance.classes_)} unique values encoded")
    
    # Split into train/test (80/20 of the sampled data)
    # Only stratify for classification tasks
    stratify_param = y if task_type == 'classification' else None
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=stratify_param
    )
    
    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    if task_type == 'classification':
        print(f"Training set - Delayed: {y_train.sum()}, On-time: {len(y_train) - y_train.sum()}")
        print(f"Test set - Delayed: {y_test.sum()}, On-time: {len(y_test) - y_test.sum()}")
    
    return X_train, X_test, y_train, y_test

def h2o_grid_search(X_train, X_test, y_train, y_test, task_type='classification'):
    """
    Perform grid search with H2O GBM
    
    Args:
        X_train, X_test, y_train, y_test: Train/test splits
        task_type: 'classification' or 'regression'
    
    Returns:
        best_model, results_dict
    """
    # Initialize H2O
    h2o.init()
    
    # Convert to H2O frames
    train_df = pd.concat([X_train, y_train], axis=1)
    test_df = pd.concat([X_test, y_test], axis=1)
    
    h2o_train = h2o.H2OFrame(train_df)
    h2o_test = h2o.H2OFrame(test_df)
    
    # Define features and target
    features = X_train.columns.tolist()
    target = y_train.name
    
    # Convert target to factor for classification
    if task_type == 'classification':
        # Type ignore comments to suppress static analyzer warnings for H2O-specific methods
        h2o_train[target] = h2o_train[target].asfactor()  # type: ignore
        h2o_test[target] = h2o_test[target].asfactor()  # type: ignore
    
    # Define hyperparameter grid for H2O GBM (reduced for faster execution)
    hyper_params = {
        'ntrees': [50, 100],
        'max_depth': [3, 5],
        'learn_rate': [0.1, 0.2],
        'sample_rate': [0.8, 0.9],
        'col_sample_rate': [0.8, 1.0],
        'min_rows': [1, 5]
    }
    
    # Create GBM estimator
    gbm = H2OGradientBoostingEstimator(
        nfolds=5,
        seed=42,
        keep_cross_validation_predictions=True
    )
    
    # Define search criteria (reduced for faster execution)
    search_criteria = {
        'strategy': 'RandomDiscrete',
        'max_models': 10,  # Reduced for faster execution
        'seed': 42,
        'stopping_rounds': 3,
        'stopping_tolerance': 0.01,
        'stopping_metric': 'AUC' if task_type == 'classification' else 'RMSE'
    }
    
    # Perform grid search
    print("Starting H2O Grid Search...")
    grid = H2OGridSearch(
        model=gbm,
        hyper_params=hyper_params,
        search_criteria=search_criteria
    )
    
    grid.train(
        x=features,
        y=target,
        training_frame=h2o_train
    )
    
    # Get best model
    best_model = grid.get_grid(sort_by='auc' if task_type == 'classification' else 'rmse',
                              decreasing=(task_type == 'classification'))[0]
    
    # Make predictions
    predictions = best_model.predict(h2o_test)
    
    # Calculate metrics
    if task_type == 'classification':
        y_pred = predictions.as_data_frame()['predict'].values
        accuracy = accuracy_score(y_test, y_pred)
        print(f"H2O Best Model - Accuracy: {accuracy:.4f}")
        print(f"H2O Best Model - AUC: {best_model.auc(valid=False):.4f}")
        results = {
            'accuracy': accuracy,
            'auc': best_model.auc(valid=False),
            'predictions': y_pred
        }
    else:
        y_pred = predictions.as_data_frame()['predict'].values
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        print(f"H2O Best Model - MSE: {mse:.4f}")
        print(f"H2O Best Model - R²: {r2:.4f}")
        results = {
            'mse': mse,
            'r2': r2,
            'predictions': y_pred
        }
    
    # Print best parameters
    print("H2O Best Parameters:")
    best_params = best_model.get_params()
    for key, value in best_params.items():
        if key in hyper_params.keys():
            print(f"  {key}: {value}")
    
    return best_model, results

def lightgbm_grid_search(X_train, X_test, y_train, y_test, task_type='classification'):
    """
    Perform grid search with LightGBM
    
    Args:
        X_train, X_test, y_train, y_test: Train/test splits
        task_type: 'classification' or 'regression'
    
    Returns:
        best_model, results_dict
    """
    # Define parameter grid (reduced for faster execution)
    param_grid = {
        'n_estimators': [50, 100],
        'max_depth': [3, 5],
        'learning_rate': [0.1, 0.2],
        'subsample': [0.8, 1.0],
        'colsample_bytree': [0.8, 1.0],
        'min_child_samples': [1, 5],
        'num_leaves': [31, 50]
    }
    
    # Create LightGBM estimator
    if task_type == 'classification':
        lgb_estimator = lgb.LGBMClassifier(
            random_state=42,
            n_jobs=-1,
            verbose=-1
        )
        scoring = 'roc_auc'
    else:
        lgb_estimator = lgb.LGBMRegressor(
            random_state=42,
            n_jobs=-1,
            verbose=-1
        )
        scoring = 'neg_mean_squared_error'
    
    # Perform grid search
    print("Starting LightGBM Grid Search...")
    grid_search = GridSearchCV(
        estimator=lgb_estimator,  # type: ignore
        param_grid=param_grid,
        cv=3,  # Reduced CV folds for faster execution
        scoring=scoring,
        n_jobs=-1,
        verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    
    # Get best model
    best_model = grid_search.best_estimator_
    
    # Make predictions
    y_pred = best_model.predict(X_test)  # type: ignore
    
    # Calculate metrics
    if task_type == 'classification':
        accuracy = accuracy_score(y_test, y_pred)
        y_pred_proba = best_model.predict_proba(X_test)[:, 1]  # type: ignore
        from sklearn.metrics import roc_auc_score
        auc = roc_auc_score(y_test, y_pred_proba)
        print(f"LightGBM Best Model - Accuracy: {accuracy:.4f}")
        print(f"LightGBM Best Model - AUC: {auc:.4f}")
        print(f"LightGBM Best CV Score: {grid_search.best_score_:.4f}")
        results = {
            'accuracy': accuracy,
            'auc': auc,
            'cv_score': grid_search.best_score_,
            'predictions': y_pred
        }
    else:
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        print(f"LightGBM Best Model - MSE: {mse:.4f}")
        print(f"LightGBM Best Model - R²: {r2:.4f}")
        print(f"LightGBM Best CV Score: {-grid_search.best_score_:.4f}")  # Convert back from negative
        results = {
            'mse': mse,
            'r2': r2,
            'cv_score': -grid_search.best_score_,
            'predictions': y_pred
        }
    
    # Print best parameters
    print("LightGBM Best Parameters:")
    for key, value in grid_search.best_params_.items():
        print(f"  {key}: {value}")
    
    return best_model, results

def random_forest_grid_search(X_train, X_test, y_train, y_test, task_type='classification'):
    """
    Perform grid search with Random Forest
    """
    # Define parameter grid
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [5, 10, 15, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'max_features': ['sqrt', 'log2', None]
    }
    
    # Create Random Forest estimator
    if task_type == 'classification':
        rf_estimator = RandomForestClassifier(random_state=42, n_jobs=-1)
        scoring = 'roc_auc'
    else:
        rf_estimator = RandomForestRegressor(random_state=42, n_jobs=-1)
        scoring = 'neg_mean_squared_error'
    
    print("Starting Random Forest Grid Search...")
    grid_search = GridSearchCV(
        estimator=rf_estimator,
        param_grid=param_grid,
        cv=3,
        scoring=scoring,
        n_jobs=-1,
        verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test)
    
    # Calculate metrics
    if task_type == 'classification':
        accuracy = accuracy_score(y_test, y_pred)
        y_pred_proba = best_model.predict_proba(X_test)[:, 1]  # type: ignore
        auc = roc_auc_score(y_test, y_pred_proba)
        print(f"Random Forest - Accuracy: {accuracy:.4f}")
        print(f"Random Forest - AUC: {auc:.4f}")
        results = {'accuracy': accuracy, 'auc': auc, 'predictions': y_pred}
    else:
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        print(f"Random Forest - MSE: {mse:.4f}")
        print(f"Random Forest - R²: {r2:.4f}")
        results = {'mse': mse, 'r2': r2, 'predictions': y_pred}
    
    print("Random Forest Best Parameters:")
    for key, value in grid_search.best_params_.items():
        print(f"  {key}: {value}")
    
    return best_model, results

def decision_tree_grid_search(X_train, X_test, y_train, y_test, task_type='classification'):
    """
    Perform grid search with Decision Tree
    """
    # Define parameter grid
    param_grid = {
        'max_depth': [3, 5, 10, 15, None],
        'min_samples_split': [2, 5, 10, 20],
        'min_samples_leaf': [1, 2, 5, 10],
        'criterion': ['gini', 'entropy'] if task_type == 'classification' else ['squared_error', 'absolute_error']
    }
    
    # Create Decision Tree estimator
    if task_type == 'classification':
        dt_estimator = DecisionTreeClassifier(random_state=42)
        scoring = 'roc_auc'
    else:
        dt_estimator = DecisionTreeRegressor(random_state=42)
        scoring = 'neg_mean_squared_error'
    
    print("Starting Decision Tree Grid Search...")
    grid_search = GridSearchCV(
        estimator=dt_estimator,
        param_grid=param_grid,
        cv=3,
        scoring=scoring,
        n_jobs=-1,
        verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test)
    
    # Calculate metrics
    if task_type == 'classification':
        accuracy = accuracy_score(y_test, y_pred)
        y_pred_proba = best_model.predict_proba(X_test)[:, 1]  # type: ignore
        auc = roc_auc_score(y_test, y_pred_proba)
        print(f"Decision Tree - Accuracy: {accuracy:.4f}")
        print(f"Decision Tree - AUC: {auc:.4f}")
        results = {'accuracy': accuracy, 'auc': auc, 'predictions': y_pred}
    else:
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        print(f"Decision Tree - MSE: {mse:.4f}")
        print(f"Decision Tree - R²: {r2:.4f}")
        results = {'mse': mse, 'r2': r2, 'predictions': y_pred}
    
    print("Decision Tree Best Parameters:")
    for key, value in grid_search.best_params_.items():
        print(f"  {key}: {value}")
    
    return best_model, results

def xgboost_grid_search(X_train, X_test, y_train, y_test, task_type='classification'):
    """
    Perform grid search with XGBoost
    """
    # Define parameter grid
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [3, 5, 7],
        'learning_rate': [0.01, 0.1, 0.2],
        'subsample': [0.8, 0.9, 1.0],
        'colsample_bytree': [0.8, 0.9, 1.0]
    }
    
    # Create XGBoost estimator
    if task_type == 'classification':
        xgb_estimator = xgb.XGBClassifier(
            random_state=42,
            n_jobs=-1,
            eval_metric='logloss'
        )
        scoring = 'roc_auc'
    else:
        xgb_estimator = xgb.XGBRegressor(
            random_state=42,
            n_jobs=-1
        )
        scoring = 'neg_mean_squared_error'
    
    print("Starting XGBoost Grid Search...")
    grid_search = GridSearchCV(
        estimator=xgb_estimator,
        param_grid=param_grid,
        cv=3,
        scoring=scoring,
        n_jobs=-1,
        verbose=1
    )
    
    grid_search.fit(X_train, y_train)
    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test)
    
    # Calculate metrics
    if task_type == 'classification':
        accuracy = accuracy_score(y_test, y_pred)
        y_pred_proba = best_model.predict_proba(X_test)[:, 1]  # type: ignore
        auc = roc_auc_score(y_test, y_pred_proba)
        print(f"XGBoost - Accuracy: {accuracy:.4f}")
        print(f"XGBoost - AUC: {auc:.4f}")
        results = {'accuracy': accuracy, 'auc': auc, 'predictions': y_pred}
    else:
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        print(f"XGBoost - MSE: {mse:.4f}")
        print(f"XGBoost - R²: {r2:.4f}")
        results = {'mse': mse, 'r2': r2, 'predictions': y_pred}
    
    print("XGBoost Best Parameters:")
    for key, value in grid_search.best_params_.items():
        print(f"  {key}: {value}")
    
    return best_model, results

def compare_models(h2o_results, lgb_results, task_type='classification'):
    """
    Compare results from both models
    """
    print("\n" + "="*50)
    print("MODEL COMPARISON")
    print("="*50)
    
    if task_type == 'classification':
        print(f"H2O GBM - Accuracy: {h2o_results['accuracy']:.4f}, AUC: {h2o_results['auc']:.4f}")
        print(f"LightGBM - Accuracy: {lgb_results['accuracy']:.4f}, AUC: {lgb_results['auc']:.4f}")
        
        if h2o_results['auc'] > lgb_results['auc']:
            print("Winner: H2O GBM (Higher AUC)")
        else:
            print("Winner: LightGBM (Higher AUC)")
    else:
        print(f"H2O GBM - MSE: {h2o_results['mse']:.4f}, R²: {h2o_results['r2']:.4f}")
        print(f"LightGBM - MSE: {lgb_results['mse']:.4f}, R²: {lgb_results['r2']:.4f}")
        
        if h2o_results['r2'] > lgb_results['r2']:
            print("Winner: H2O GBM (Higher R²)")
        else:
            print("Winner: LightGBM (Higher R²)")

# Main execution function
def main(df, target_column, task_type='classification'):
    """
    Main function to run the complete pipeline
    
    Args:
        df: Your dataset
        target_column: Name of target column
        task_type: 'classification' or 'regression'
    """
    # Prepare data
    X_train, X_test, y_train, y_test = prepare_data(df, target_column, task_type=task_type)
    
    # Run H2O Grid Search
    h2o_model, h2o_results = h2o_grid_search(X_train, X_test, y_train, y_test, task_type)
    
    # Run LightGBM Grid Search
    lgb_model, lgb_results = lightgbm_grid_search(X_train, X_test, y_train, y_test, task_type)
    
    # Compare models
    compare_models(h2o_results, lgb_results, task_type)
    
    return {
        'h2o_model': h2o_model,
        'lgb_model': lgb_model,
        'h2o_results': h2o_results,
        'lgb_results': lgb_results
    }

# Example usage:
if __name__ == "__main__":
    print("COMPREHENSIVE FLIGHT DELAY PREDICTION COMPARISON")
    print("="*80)
    print("Using 2% of the data for faster execution")
    print("Testing multiple algorithms on two datasets")
    print()
    
    # Initialize H2O
    h2o.init()
    
    try:
        # Load main dataset
        print("Loading main dataset: flights_processed_with_extra_features.parquet")
        df_main = pd.read_parquet('data/flights_processed_with_extra_features.parquet')
        print(f"Main dataset shape: {df_main.shape}")
        
        # Load additional dataset for classification analysis
        print("Loading additional dataset: flights_processed.parquet")
        df_additional = pd.read_parquet('data/flights_processed.parquet')
        print(f"Additional dataset shape: {df_additional.shape}")
        
        # CLASSIFICATION COMPARISON - MAIN DATASET
        print("\n" + "="*80)
        print("CLASSIFICATION COMPARISON - MAIN DATASET (5 algorithms)")
        print("="*80)
        
        # Prepare data for classification - main dataset
        X_train_main, X_test_main, y_train_class_main, y_test_class_main = prepare_data(
            df_main, 'ARRIVAL_DELAY', task_type='classification'
        )
        
        classification_results_main = {}
        
        print("\n--- H2O GBM Classification (Main Dataset) ---")
        _, classification_results_main['h2o'] = h2o_grid_search(
            X_train_main, X_test_main, y_train_class_main, y_test_class_main, 'classification'
        )
        
        print("\n--- LightGBM Classification (Main Dataset) ---")
        _, classification_results_main['lightgbm'] = lightgbm_grid_search(
            X_train_main, X_test_main, y_train_class_main, y_test_class_main, 'classification'
        )
        
        print("\n--- Random Forest Classification (Main Dataset) ---")
        _, classification_results_main['random_forest'] = random_forest_grid_search(
            X_train_main, X_test_main, y_train_class_main, y_test_class_main, 'classification'
        )
        
        print("\n--- Decision Tree Classification (Main Dataset) ---")
        _, classification_results_main['decision_tree'] = decision_tree_grid_search(
            X_train_main, X_test_main, y_train_class_main, y_test_class_main, 'classification'
        )
        
        print("\n--- XGBoost Classification (Main Dataset) ---")
        _, classification_results_main['xgboost'] = xgboost_grid_search(
            X_train_main, X_test_main, y_train_class_main, y_test_class_main, 'classification'
        )
        
        # CLASSIFICATION COMPARISON - ADDITIONAL DATASET
        print("\n" + "="*80)
        print("CLASSIFICATION COMPARISON - ADDITIONAL DATASET (5 algorithms)")
        print("="*80)
        
        # Prepare data for classification - additional dataset
        X_train_add, X_test_add, y_train_class_add, y_test_class_add = prepare_data(
            df_additional, 'ARRIVAL_DELAY', task_type='classification'
        )
        
        classification_results_add = {}
        
        print("\n--- H2O GBM Classification (Additional Dataset) ---")
        _, classification_results_add['h2o'] = h2o_grid_search(
            X_train_add, X_test_add, y_train_class_add, y_test_class_add, 'classification'
        )
        
        print("\n--- LightGBM Classification (Additional Dataset) ---")
        _, classification_results_add['lightgbm'] = lightgbm_grid_search(
            X_train_add, X_test_add, y_train_class_add, y_test_class_add, 'classification'
        )
        
        print("\n--- Random Forest Classification (Additional Dataset) ---")
        _, classification_results_add['random_forest'] = random_forest_grid_search(
            X_train_add, X_test_add, y_train_class_add, y_test_class_add, 'classification'
        )
        
        print("\n--- Decision Tree Classification (Additional Dataset) ---")
        _, classification_results_add['decision_tree'] = decision_tree_grid_search(
            X_train_add, X_test_add, y_train_class_add, y_test_class_add, 'classification'
        )
        
        print("\n--- XGBoost Classification (Additional Dataset) ---")
        _, classification_results_add['xgboost'] = xgboost_grid_search(
            X_train_add, X_test_add, y_train_class_add, y_test_class_add, 'classification'
        )
        
        # REGRESSION COMPARISON - MAIN DATASET ONLY
        print("\n" + "="*80)
        print("REGRESSION COMPARISON - MAIN DATASET (5 algorithms)")
        print("="*80)
        
        # Prepare data for regression - main dataset
        X_train_reg, X_test_reg, y_train_reg, y_test_reg = prepare_data(
            df_main, 'ARRIVAL_DELAY', task_type='regression'
        )
        
        regression_results = {}
        
        print("\n--- H2O GBM Regression ---")
        _, regression_results['h2o'] = h2o_grid_search(
            X_train_reg, X_test_reg, y_train_reg, y_test_reg, 'regression'
        )
        
        print("\n--- LightGBM Regression ---")
        _, regression_results['lightgbm'] = lightgbm_grid_search(
            X_train_reg, X_test_reg, y_train_reg, y_test_reg, 'regression'
        )
        
        print("\n--- Random Forest Regression ---")
        _, regression_results['random_forest'] = random_forest_grid_search(
            X_train_reg, X_test_reg, y_train_reg, y_test_reg, 'regression'
        )
        
        print("\n--- Decision Tree Regression ---")
        _, regression_results['decision_tree'] = decision_tree_grid_search(
            X_train_reg, X_test_reg, y_train_reg, y_test_reg, 'regression'
        )
        
        print("\n--- XGBoost Regression ---")
        _, regression_results['xgboost'] = xgboost_grid_search(
            X_train_reg, X_test_reg, y_train_reg, y_test_reg, 'regression'
        )
        
        # FINAL COMPARISON SUMMARY
        print("\n" + "="*80)
        print("FINAL COMPARISON SUMMARY")
        print("="*80)
        
        print("\n📊 CLASSIFICATION RESULTS - MAIN DATASET:")
        print("-" * 50)
        for algo, results in classification_results_main.items():
            print(f"{algo.upper():15} - Accuracy: {results['accuracy']:.4f}, AUC: {results['auc']:.4f}")
        
        print("\n📊 CLASSIFICATION RESULTS - ADDITIONAL DATASET:")
        print("-" * 50)
        for algo, results in classification_results_add.items():
            print(f"{algo.upper():15} - Accuracy: {results['accuracy']:.4f}, AUC: {results['auc']:.4f}")
        
        print("\n📈 REGRESSION RESULTS - MAIN DATASET:")
        print("-" * 50)
        for algo, results in regression_results.items():
            print(f"{algo.upper():15} - MSE: {results['mse']:.4f}, R²: {results['r2']:.4f}")
        
        # BEST MODEL ANALYSIS
        print("\n" + "="*60)
        print("🏆 BEST MODEL ANALYSIS")
        print("="*60)
        
        # Best classification model - main dataset
        best_class_main = max(classification_results_main.items(), key=lambda x: x[1]['auc'])
        print(f"\n🥇 Best Classification Model (Main Dataset): {best_class_main[0].upper()}")
        print(f"   Accuracy: {best_class_main[1]['accuracy']:.4f}, AUC: {best_class_main[1]['auc']:.4f}")
        
        # Best classification model - additional dataset
        best_class_add = max(classification_results_add.items(), key=lambda x: x[1]['auc'])
        print(f"\n🥇 Best Classification Model (Additional Dataset): {best_class_add[0].upper()}")
        print(f"   Accuracy: {best_class_add[1]['accuracy']:.4f}, AUC: {best_class_add[1]['auc']:.4f}")
        
        # Best regression model
        best_reg = max(regression_results.items(), key=lambda x: x[1]['r2'])
        print(f"\n🥇 Best Regression Model: {best_reg[0].upper()}")
        print(f"   MSE: {best_reg[1]['mse']:.4f}, R²: {best_reg[1]['r2']:.4f}")
        
        print("\n" + "="*80)
        print("✅ COMPREHENSIVE COMPARISON COMPLETED SUCCESSFULLY!")
        print("="*80)
        
    except Exception as e:
        print(f"\n❌ Error during execution: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Clean up H2O cluster
        try:
            h2o.shutdown()
            print("\n🔧 H2O cluster shutdown complete.")
        except:
            pass
    print("✓ Classification: Binary delay prediction (0=On-time ≤15min, 1=Delayed >15min)")
    print("✓ Regression: Continuous delay prediction (actual minutes)")
    print("Both models trained and evaluated on 5% sample of the dataset")
    print("="*80)
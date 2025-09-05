import h2o
from h2o.estimators import H2ORandomForestEstimator, H2OGradientBoostingEstimator
from h2o.estimators import H2OGeneralizedLinearEstimator, H2OXGBoostEstimator
import pandas as pd
import numpy as np


# Initialize H2O cluster
print("Initializing H2O...")
h2o.init(max_mem_size='15G')  

df = pd.read_parquet("data/flights_preprocessed_no_delay.parquet")

print("Converting data to H2O format...")
h2o_df = h2o.H2OFrame(df)

print(f"H2O DataFrame shape: {h2o_df.shape}")
print("H2O DataFrame info:")
print(h2o_df.describe())


target = "ARRIVAL_DELAY" 
features = h2o_df.columns
features.remove(target)

print(f"Target: {target}")
print(f"Number of features: {len(features)}")

print("Splitting data...")
train, test = h2o_df.split_frame(ratios=[0.9], seed=42)
print(f"Training set shape: {train.shape}")
print(f"Test set shape: {test.shape}")


def calculate_adjusted_r2(r2, n_samples, n_features):
    """
    Calculate adjusted R² given R², number of samples, and number of features
    Adjusted R² = 1 - (1 - R²) * (n - 1) / (n - p - 1)
    where n = number of samples, p = number of features
    """
    if r2 < 0:
        return r2  
    
    adjusted_r2 = 1 - (1 - r2) * (n_samples - 1) / (n_samples - n_features - 1)
    return adjusted_r2

# =============================================================================
# MODEL 1: Random Forest (Fast and usually good baseline)
# =============================================================================
print("\n" + "="*50)
print("TRAINING RANDOM FOREST")
print("="*50)

rf = H2ORandomForestEstimator(
    ntrees=100,                    # Number of trees
    max_depth=20,                  # Maximum depth
    min_rows=2,                    # Minimum observations for a leaf
    sample_rate=0.8,               # Row sampling rate
    col_sample_rate_change_per_level=0.8,           # Column sampling rate
    seed=42,
    nfolds=5,                      # Built-in cross-validation
    fold_assignment="Modulo",      # CV assignment method
    keep_cross_validation_predictions=True
)

# Train the model
rf.train(x=features, y=target, training_frame=train)


rf_cv_r2 = rf.r2(xval=True)
rf_cv_adj_r2 = calculate_adjusted_r2(rf_cv_r2, train.shape[0], len(features))

print("Random Forest Training Complete!")
print(f"Cross-validation R²: {rf_cv_r2:.4f}")
print(f"Cross-validation Adjusted R²: {rf_cv_adj_r2:.4f}")
print(f"Cross-validation RMSE: {rf.rmse(xval=True):.4f}")
print(f"Cross-validation MAE: {rf.mae(xval=True):.4f}")

# =============================================================================
# MODEL 2: Gradient Boosting Machine (Often more accurate)
# =============================================================================
print("\n" + "="*50)
print("TRAINING GRADIENT BOOSTING MACHINE")
print("="*50)

gbm = H2OGradientBoostingEstimator(
    ntrees=100,                    # Number of trees
    max_depth=6,                   # Maximum depth
    learn_rate=0.1,                # Learning rate
    sample_rate=0.8,               # Row sampling rate
    col_sample_rate=0.8,           # Column sampling rate
    seed=42,
    nfolds=5,                      # Built-in cross-validation
    fold_assignment="Modulo",
    keep_cross_validation_predictions=True,
    stopping_rounds=10,            # Early stopping
    stopping_tolerance=0.001
)

gbm.train(x=features, y=target, training_frame=train)

# Calculate adjusted R² for cross-validation
gbm_cv_r2 = gbm.r2(xval=True)
gbm_cv_adj_r2 = calculate_adjusted_r2(gbm_cv_r2, train.shape[0], len(features))

print("GBM Training Complete!")
print(f"Cross-validation R²: {gbm_cv_r2:.4f}")
print(f"Cross-validation Adjusted R²: {gbm_cv_adj_r2:.4f}")
print(f"Cross-validation RMSE: {gbm.rmse(xval=True):.4f}")
print(f"Cross-validation MAE: {gbm.mae(xval=True):.4f}")

# =============================================================================
# MODEL 3: XGBoost (Often the best performer)
# =============================================================================
print("\n" + "="*50)
print("TRAINING XGBOOST")
print("="*50)

xgb_cv_adj_r2 = None
try:
    xgb = H2OXGBoostEstimator(
        ntrees=100,
        max_depth=6,
        learn_rate=0.1,
        sample_rate=0.8,
        col_sample_rate=0.8,
        reg_alpha=0.0,               
        reg_lambda=1.0,              
        seed=42,
        nfolds=5,
        fold_assignment="Modulo",
        keep_cross_validation_predictions=True,
        stopping_rounds=10,
        stopping_tolerance=0.001
    )
    
    xgb.train(x=features, y=target, training_frame=train)
    
    # Calculate adjusted R² for cross-validation
    xgb_cv_r2 = xgb.r2(xval=True)
    xgb_cv_adj_r2 = calculate_adjusted_r2(xgb_cv_r2, train.shape[0], len(features))
    
    print("XGBoost Training Complete!")
    print(f"Cross-validation R²: {xgb_cv_r2:.4f}")
    print(f"Cross-validation Adjusted R²: {xgb_cv_adj_r2:.4f}")
    print(f"Cross-validation RMSE: {xgb.rmse(xval=True):.4f}")
    print(f"Cross-validation MAE: {xgb.mae(xval=True):.4f}")
    
except Exception as e:
    print(f"XGBoost not available: {e}")
    xgb = None

# =============================================================================
# MODEL COMPARISON AND EVALUATION
# =============================================================================
print("\n" + "="*50)
print("MODEL COMPARISON")
print("="*50)

models = [("Random Forest", rf), ("GBM", gbm)]
adj_r2_values = [("Random Forest", rf_cv_adj_r2), ("GBM", gbm_cv_adj_r2)]

if xgb is not None:
    models.append(("XGBoost", xgb))
    adj_r2_values.append(("XGBoost", xgb_cv_adj_r2))

results = []
for i, (name, model) in enumerate(models):
    r2 = model.r2(xval=True)
    rmse = model.rmse(xval=True)
    mae = model.mae(xval=True)
    adj_r2 = adj_r2_values[i][1]
    
    results.append({
        'Model': name,
        'CV_R2': r2,
        'CV_Adjusted_R2': adj_r2,
        'CV_RMSE': rmse,
        'CV_MAE': mae
    })

# Create comparison DataFrame
comparison_df = pd.DataFrame(results)
comparison_df = comparison_df.sort_values('CV_Adjusted_R2', ascending=False)
print(comparison_df.to_string(index=False))

# Select best model (by adjusted R²)
best_model_name = comparison_df.iloc[0]['Model']
best_model = dict(models)[best_model_name]
best_cv_r2 = comparison_df.iloc[0]['CV_R2']
best_adj_r2 = comparison_df.iloc[0]['CV_Adjusted_R2']

print(f"\nBest Model: {best_model_name}")
print(f"Best CV R²: {best_cv_r2:.4f}")
print(f"Best CV Adjusted R²: {best_adj_r2:.4f}")

# =============================================================================
# TEST SET EVALUATION
# =============================================================================
print("\n" + "="*50)
print("TEST SET EVALUATION")
print("="*50)

# Evaluate on test set
test_performance = best_model.model_performance(test)
test_r2 = test_performance.r2()
test_rmse = test_performance.rmse()
test_mae = test_performance.mae()

# Calculate adjusted R² for test set
test_adj_r2 = calculate_adjusted_r2(test_r2, test.shape[0], len(features))

print(f"Test R²: {test_r2:.4f}")
print(f"Test Adjusted R²: {test_adj_r2:.4f}")
print(f"Test RMSE: {test_rmse:.4f}")
print(f"Test MAE: {test_mae:.4f}")

# =============================================================================
# FEATURE IMPORTANCE
# =============================================================================
print("\n" + "="*50)
print("TOP 20 FEATURE IMPORTANCE")
print("="*50)

# Get variable importance
importance = best_model.varimp(use_pandas=True)
print(importance.head(20).to_string(index=False))

# =============================================================================
# PREDICTIONS
# =============================================================================
print("\n" + "="*50)
print("GENERATING PREDICTIONS")
print("="*50)

# Make predictions on test set
predictions = best_model.predict(test)
print(f"Predictions shape: {predictions.shape}")

# Convert predictions back to pandas if needed
predictions_df = predictions.as_data_frame()
print("Predictions sample:")
print(predictions_df.head())

# =============================================================================
# MEMORY CLEANUP
# =============================================================================
print("\n" + "="*50)
print("MEMORY USAGE")
print("="*50)

# Check H2O cluster status
print("H2O Cluster Info:")
print(h2o.cluster_status())

# Optional: Remove frames to free memory
# h2o.remove_all()

print(f"""
FINAL RESULTS SUMMARY:
======================
📊 Dataset: {h2o_df.shape[0]:,} rows × {h2o_df.shape[1]} columns
🏆 Best Model: {best_model_name}
📈 Best CV R²: {best_cv_r2:.4f}
📈 Best CV Adjusted R²: {best_adj_r2:.4f}
🎯 Test R²: {test_r2:.4f}
🎯 Test Adjusted R²: {test_adj_r2:.4f}
📉 Test RMSE: {test_rmse:.4f}
📉 Test MAE: {test_mae:.4f}

MODEL RANKINGS (by Adjusted R²):
{comparison_df[['Model', 'CV_Adjusted_R2', 'CV_R2', 'CV_RMSE']].to_string(index=False)}

✅ Training completed successfully!

Notes:
- Adjusted R² is better for comparing across different datasets
- Adjusted R² = 1 - (1 - R²) × (n - 1) / (n - p - 1)
- All models used 5-fold cross-validation
- Models ranked by Adjusted R² (accounts for number of features)

To shutdown H2O cluster: h2o.shutdown(prompt=False)
""")

# =============================================================================
# SAVE BEST MODEL
# =============================================================================
print("\n" + "="*50)
print("SAVING BEST MODEL")
print("="*50)

# Save the model in a local directory
model_path = h2o.save_model(model=best_model, path="saved_models1", force=True)
print(f"Best model '{best_model_name}' saved at: {model_path}")

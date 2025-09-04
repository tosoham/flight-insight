import h2o
from h2o.estimators import H2ORandomForestEstimator, H2OGradientBoostingEstimator
from h2o.estimators import H2OGeneralizedLinearEstimator, H2OXGBoostEstimator
import pandas as pd

# Initialize H2O cluster
print("Initializing H2O...")
h2o.init(max_mem_size='8G')  # Adjust based on your available RAM

df = pd.read_parquet("data/flights_processed.parquet")

# Convert your pandas DataFrame to H2O Frame
print("Converting data to H2O format...")
h2o_df = h2o.H2OFrame(df)

print(f"H2O DataFrame shape: {h2o_df.shape}")
print("H2O DataFrame info:")
print(h2o_df.describe())

# Set target and feature columns
target = "ARRIVAL_DELAY" 
features = h2o_df.columns
features.remove(target)

print(f"Target: {target}")
print(f"Number of features: {len(features)}")

# Split the data (H2O handles this very efficiently)
print("Splitting data...")
train, test = h2o_df.split_frame(ratios=[0.8], seed=42)
print(f"Training set shape: {train.shape}")
print(f"Test set shape: {test.shape}")

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

print("Random Forest Training Complete!")
print(f"Cross-validation R²: {rf.r2(xval=True):.4f}")
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

print("GBM Training Complete!")
print(f"Cross-validation R²: {gbm.r2(xval=True):.4f}")
print(f"Cross-validation RMSE: {gbm.rmse(xval=True):.4f}")
print(f"Cross-validation MAE: {gbm.mae(xval=True):.4f}")

# =============================================================================
# MODEL 3: XGBoost (Often the best performer)
# =============================================================================
print("\n" + "="*50)
print("TRAINING XGBOOST")
print("="*50)

try:
    xgb = H2OXGBoostEstimator(
        ntrees=100,
        max_depth=6,
        learn_rate=0.1,
        sample_rate=0.8,
        col_sample_rate=0.8,
        reg_alpha=0,               # L1 regularization
        reg_lambda=1,              # L2 regularization
        seed=42,
        nfolds=5,
        fold_assignment="Modulo",
        keep_cross_validation_predictions=True,
        stopping_rounds=10,
        stopping_tolerance=0.001
    )
    
    xgb.train(x=features, y=target, training_frame=train)
    
    print("XGBoost Training Complete!")
    print(f"Cross-validation R²: {xgb.r2(xval=True):.4f}")
    print(f"Cross-validation RMSE: {xgb.rmse(xval=True):.4f}")
    print(f"Cross-validation MAE: {xgb.rmse(xval=True):.4f}")
    
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
if xgb is not None:
    models.append(("XGBoost", xgb))

results = []
for name, model in models:
    r2 = model.r2(xval=True)
    rmse = model.rmse(xval=True)
    mae = model.mae(xval=True)
    results.append({
        'Model': name,
        'CV_R2': r2,
        'CV_RMSE': rmse,
        'CV_MAE': mae
    })

# Create comparison DataFrame
comparison_df = pd.DataFrame(results)
comparison_df = comparison_df.sort_values('CV_R2', ascending=False)
print(comparison_df.to_string(index=False))

# Select best model
best_model_name = comparison_df.iloc[0]['Model']
best_model = dict(models)[best_model_name]

print(f"\nBest Model: {best_model_name}")
print(f"Best CV R²: {comparison_df.iloc[0]['CV_R2']:.4f}")

# =============================================================================
# TEST SET EVALUATION
# =============================================================================
print("\n" + "="*50)
print("TEST SET EVALUATION")
print("="*50)

# Evaluate on test set
test_performance = best_model.model_performance(test)
print(f"Test R²: {test_performance.r2():.4f}")
print(f"Test RMSE: {test_performance.rmse():.4f}")
print(f"Test MAE: {test_performance.mae():.4f}")

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
print(h2o.cluster())

# Optional: Remove frames to free memory
# h2o.remove_all()

print(f"""
SUMMARY:
========
- Dataset size: {h2o_df.shape[0]:,} rows, {h2o_df.shape[1]} columns
- Best model: {best_model_name}
- Best CV R²: {comparison_df.iloc[0]['CV_R2']:.4f}
- Test R²: {test_performance.r2():.4f}
- Training completed successfully with H2O!

To shutdown H2O cluster when done:
h2o.shutdown(prompt=False)
""")
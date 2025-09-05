import h2o
from h2o.estimators import H2OXGBoostEstimator
import pandas as pd

# Initialize H2O cluster
print("Initializing H2O...")
h2o.init(max_mem_size='14G')  # Adjust memory if needed

# Load dataset
df = pd.read_parquet("data/flights_processed.parquet")

# Convert pandas DataFrame to H2O Frame
print("Converting data to H2O format...")
h2o_df = h2o.H2OFrame(df)

# Define target and features
target = "ARRIVAL_DELAY"
features = h2o_df.columns
features.remove(target)

# Train/test split
train, test = h2o_df.split_frame(ratios=[0.8], seed=42)

# Helper: Adjusted R²
def calculate_adjusted_r2(r2, n_samples, n_features):
    if r2 < 0:
        return r2
    return 1 - (1 - r2) * (n_samples - 1) / (n_samples - n_features - 1)

# Define XGBoost model with CV
xgb = H2OXGBoostEstimator(
    ntrees=200,
    max_depth=6,
    learn_rate=0.1,
    sample_rate=0.8,
    col_sample_rate=0.8,
    reg_alpha=0.0,
    reg_lambda=1.0,
    seed=42,
    nfolds=5,                        # 5-fold CV
    fold_assignment="Modulo",
    keep_cross_validation_predictions=True,
    stopping_rounds=10,
    stopping_tolerance=0.001
)

# Train model
print("Training XGBoost with 5-fold CV...")
xgb.train(x=features, y=target, training_frame=train)

# =============================
# CV PERFORMANCE
# =============================
cv_r2 = xgb.r2(xval=True)
cv_rmse = xgb.rmse(xval=True)
cv_mae = xgb.mae(xval=True)
cv_adj_r2 = calculate_adjusted_r2(cv_r2, train.shape[0], len(features))

print("\n=== XGBoost Cross-Validation Performance ===")
print(f"CV R²         : {cv_r2:.4f}")
print(f"CV Adjusted R²: {cv_adj_r2:.4f}")
print(f"CV RMSE       : {cv_rmse:.4f}")
print(f"CV MAE        : {cv_mae:.4f}")

# =============================
# TEST SET PERFORMANCE
# =============================
test_perf = xgb.model_performance(test)
test_r2 = test_perf.r2()
test_rmse = test_perf.rmse()
test_mae = test_perf.mae()
test_adj_r2 = calculate_adjusted_r2(test_r2, test.shape[0], len(features))

print("\n=== XGBoost Test Set Performance ===")
print(f"Test R²         : {test_r2:.4f}")
print(f"Test Adjusted R²: {test_adj_r2:.4f}")
print(f"Test RMSE       : {test_rmse:.4f}")
print(f"Test MAE        : {test_mae:.4f}")

# =============================
# SAVE MODEL
# =============================
print("\nSaving XGBoost model...")
model_path = h2o.save_model(model=xgb, path="saved_models_no_geo", force=True)
print(f"✅ XGBoost model saved at: {model_path}")

# =============================
# SAMPLE PREDICTIONS
# =============================
preds = xgb.predict(test)
print("\nSample predictions:")
print(preds.head().as_data_frame())

import h2o
from h2o.estimators import H2OXGBoostEstimator
import pandas as pd

# Initialize H2O cluster
print("Initializing H2O...")
h2o.init(max_mem_size='14G')  # Adjust memory based on your system

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

# Define XGBoost model
xgb = H2OXGBoostEstimator(
    ntrees=200,
    max_depth=6,
    learn_rate=0.1,
    sample_rate=0.8,
    col_sample_rate=0.8,
    reg_alpha=0.0,                # L1 regularization
    reg_lambda=1.0,             # L2 regularization
    seed=42,
    nfolds=5,
    fold_assignment="Modulo",
    keep_cross_validation_predictions=True,
    stopping_rounds=10,
    stopping_tolerance=0.001
)

# Train model
print("Training XGBoost...")
xgb.train(x=features, y=target, training_frame=train)

# Evaluate on test set
perf = xgb.model_performance(test)
print("\n=== XGBoost Performance on Test Set ===")
print(f"R²   : {perf.r2():.4f}")
print(f"RMSE : {perf.rmse():.4f}")
print(f"MAE  : {perf.mae():.4f}")

# Save model
print("\nSaving XGBoost model...")
model_path = h2o.save_model(model=xgb, path="saved_models", force=True)
print(f"XGBoost model saved at: {model_path}")

# Example prediction
preds = xgb.predict(test)
print("\nSample predictions:")
print(preds.head().as_data_frame())

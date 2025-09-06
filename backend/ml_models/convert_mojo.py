import h2o


h2o.init()


model_path = "./XGBoost_model_python_1757147613340_1"
loaded_model = h2o.load_model(model_path)

# Now, download the MOJO for deployment
# This is the file you will use in your Docker container
mojo_path = loaded_model.download_mojo(path=".")

print(f"MOJO file saved to: {mojo_path}")
print("Use this file for your Docker deployment.")

h2o.cluster().shutdown()
import os
import sys
import h2o
from h2o.exceptions import H2OError

BINARY_MODEL_PATH = "./XGBoost_model_python_1757147613340_1"   
OUTPUT_DIR = "."                                   

def main():
    h2o.init()  
    try:
        print("Loading model from:", BINARY_MODEL_PATH)
        model = h2o.load_model(BINARY_MODEL_PATH)
    except H2OError as e:
        print("Failed to load model:", e)
        sys.exit(1)

    try:
        mojo_path = model.download_mojo(path=OUTPUT_DIR, get_genmodel_jar=True)
        print("MOJO exported to:", mojo_path)
    except Exception as e:
        print("Failed to export MOJO:", e)
        sys.exit(2)
    finally:
        h2o.shutdown(prompt=False)

if __name__ == "__main__":
    main()

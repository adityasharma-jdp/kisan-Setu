"""
FarmPulse AI - Machine Learning Model Training and Evaluation Pipeline
Trains:
1. Random Forest Classifier for Fault Detection & Category Classification
2. Random Forest Regressor for Remaining Useful Life (RUL in hours)
Validates:
- Machine-aware cross validation (GroupKFold on machine_id to strictly prevent data leakage)
- Evaluation metrics: Precision, Recall, F1-Score, Confusion Matrix, R2, MAE
Saves serialized models and evaluation metrics artifact.
"""

import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    precision_score, recall_score, f1_score, accuracy_score,
    confusion_matrix, mean_absolute_error, r2_score
)
from sklearn.model_selection import GroupKFold

from ml.features import preprocess_telemetry_dataframe, FEATURE_COLUMNS
from ml.dataset_generator import build_fleet_dataset

MODELS_DIR = "ml/saved_models"
DATASET_PATH = "dataset/fleet_telemetry.csv"

def train_models():
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    if not os.path.exists(DATASET_PATH):
        print("Dataset not found. Generating synthetic fleet telemetry...")
        build_fleet_dataset(n_machines=24, output_dir="dataset")
        
    print(f"Loading telemetry from {DATASET_PATH}...")
    raw_df = pd.read_csv(DATASET_PATH)
    processed_df = preprocess_telemetry_dataframe(raw_df)
    
    X = processed_df[FEATURE_COLUMNS]
    y_fault = processed_df["is_developing_fault"]
    y_mode = processed_df["fault_mode"]
    y_rul = processed_df["time_to_failure_hours"].clip(0, 500)
    groups = processed_df["machine_id"]
    
    # Machine-aware GroupKFold validation (ensures no test machine ever appears in train set)
    gkf = GroupKFold(n_splits=4)
    train_idx, test_idx = next(gkf.split(X, y_fault, groups=groups))
    
    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    y_fault_train, y_fault_test = y_fault.iloc[train_idx], y_fault.iloc[test_idx]
    y_mode_train, y_mode_test = y_mode.iloc[train_idx], y_mode.iloc[test_idx]
    y_rul_train, y_rul_test = y_rul.iloc[train_idx], y_rul.iloc[test_idx]
    
    print(f"Training set: {len(X_train)} samples across {len(np.unique(groups.iloc[train_idx]))} machines")
    print(f"Test set: {len(X_test)} samples across {len(np.unique(groups.iloc[test_idx]))} machines (Zero Machine Leakage)")
    
    # 1. Train Fault Detection Classifier
    print("Training Random Forest Fault Classifier...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=4,
        random_state=42,
        class_weight="balanced"
    )
    clf.fit(X_train, y_fault_train)
    
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_fault_test, y_pred)
    prec = precision_score(y_fault_test, y_pred, zero_division=0)
    rec = recall_score(y_fault_test, y_pred, zero_division=0)
    f1 = f1_score(y_fault_test, y_pred, zero_division=0)
    cm = confusion_matrix(y_fault_test, y_pred).tolist()
    
    # 2. Train Fault Mode Multiclass Classifier
    print("Training Multiclass Fault Mode Classifier...")
    mode_clf = RandomForestClassifier(
        n_estimators=80,
        max_depth=10,
        random_state=42
    )
    mode_clf.fit(X_train, y_mode_train)
    
    # 3. Train RUL (Remaining Useful Life) Regressor
    print("Training RUL Regressor...")
    rul_reg = RandomForestRegressor(
        n_estimators=80,
        max_depth=12,
        random_state=42
    )
    rul_reg.fit(X_train, y_rul_train)
    y_rul_pred = rul_reg.predict(X_test)
    mae = mean_absolute_error(y_rul_test, y_rul_pred)
    r2 = r2_score(y_rul_test, y_rul_pred)
    
    # Feature importances
    feature_importances = dict(zip(FEATURE_COLUMNS, [round(float(val), 4) for val in clf.feature_importances_]))
    
    metrics = {
        "dataset_rows": len(processed_df),
        "fleet_machines": int(len(np.unique(groups))),
        "train_machines": int(len(np.unique(groups.iloc[train_idx]))),
        "test_machines": int(len(np.unique(groups.iloc[test_idx]))),
        "validation_strategy": "Machine-Aware GroupKFold (Zero Data Leakage)",
        "fault_detection": {
            "accuracy": round(float(acc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1_score": round(float(f1), 4),
            "confusion_matrix": cm,
        },
        "rul_regression": {
            "mae_hours": round(float(mae), 2),
            "r2_score": round(float(r2), 4),
        },
        "feature_importances": feature_importances,
        "features": FEATURE_COLUMNS
    }
    
    # Save models
    clf_path = os.path.join(MODELS_DIR, "fault_classifier.joblib")
    mode_path = os.path.join(MODELS_DIR, "mode_classifier.joblib")
    rul_path = os.path.join(MODELS_DIR, "rul_regressor.joblib")
    metrics_path = os.path.join(MODELS_DIR, "model_metrics.json")
    
    joblib.dump(clf, clf_path)
    joblib.dump(mode_clf, mode_path)
    joblib.dump(rul_reg, rul_path)
    
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"Training Complete! Models saved to {MODELS_DIR}")
    print(f"Metrics: Precision={prec:.3f}, Recall={rec:.3f}, F1={f1:.3f}, RUL MAE={mae:.2f} hrs")
    return metrics

if __name__ == "__main__":
    train_models()

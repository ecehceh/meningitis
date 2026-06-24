# ── Library Imports ─────────────────────────────────────────
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns
import warnings
warnings.filterwarnings("ignore")

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)
from sklearn.utils.class_weight import compute_sample_weight

# ── Plot Style ───────────────────────────────────────────────
plt.rcParams.update({
    "figure.facecolor": "#0f1117",
    "axes.facecolor":   "#1a1d27",
    "axes.edgecolor":   "#3a3d4d",
    "axes.labelcolor":  "#e0e0e0",
    "xtick.color":      "#b0b0b0",
    "ytick.color":      "#b0b0b0",
    "text.color":       "#e0e0e0",
    "grid.color":       "#2a2d3a",
    "grid.linestyle":   "--",
    "grid.alpha":       0.5,
    "font.family":      "monospace",
})

ACCENT   = ["#7c6af7", "#00c8a0", "#f7a35c"]   # purple, teal, orange
PURPLE   = "#7c6af7"
TEAL     = "#00c8a0"
ORANGE   = "#f7a35c"

# STEP 1 ─ DATA UNDERSTANDING
def step1_data_understanding(path: str) -> pd.DataFrame:
    print("\n" + "═"*60)
    print("  STEP 1 │ DATA UNDERSTANDING")
    print("═"*60)

    df = pd.read_csv(path)

    print(f"\n▸ Shape          : {df.shape[0]} rows × {df.shape[1]} columns")
    print(f"\n▸ Data Types:\n{df.dtypes.to_string()}")
    print(f"\n▸ Missing Values:\n{df.isnull().sum().to_string()}")
    print(f"\n▸ Duplicate Rows : {df.duplicated().sum()}")
    print(f"\n▸ Descriptive Statistics:\n{df.describe().round(2).to_string()}")
    print(f"\n▸ Target Distribution:\n{df['Outcome'].value_counts().to_string()}")

    return df


# STEP 2 ─ DATA CLEANING
def step2_data_cleaning(df: pd.DataFrame) -> pd.DataFrame:
    print("\n" + "═"*60)
    print("  STEP 2 │ DATA CLEANING")
    print("═"*60)

    # Hapus data dengan Diagnosis "Unknown"
    if "Diagnosis" in df.columns:
        before_diag = len(df)
        df = df[df["Diagnosis"] != "Unknown"]
        print(f"\n▸ Diagnosis 'Unknown' dihapus: {before_diag - len(df)} baris")

    # Hapus kolom ID yang tidak relevan
    irrelevant = [c for c in ["Patient_ID", "patient_id"] if c in df.columns]
    df.drop(columns=irrelevant, inplace=True)
    print(f"▸ Kolom dihapus   : {irrelevant}")

    # Hapus baris duplikat
    before = len(df)
    df.drop_duplicates(inplace=True)
    print(f"▸ Duplikat dihapus: {before - len(df)} baris")

    # Tangani missing values
    missing = df.isnull().sum()
    cols_with_na = missing[missing > 0]
    if cols_with_na.empty:
        print("▸ Missing values  : tidak ada")
    else:
        for col in cols_with_na.index:
            if df[col].dtype == "object":
                df[col].fillna(df[col].mode()[0], inplace=True)
                print(f"▸ Imputed '{col}' dengan modus")
            else:
                df[col].fillna(df[col].median(), inplace=True)
                print(f"▸ Imputed '{col}' dengan median")

    print(f"\n▸ Shape setelah cleaning: {df.shape}")
    return df


# STEP 3 ─ DATA PREPROCESSING
def step3_preprocessing(df: pd.DataFrame):
    print("\n" + "═"*60)
    print("  STEP 3 │ DATA PREPROCESSING")
    print("═"*60)

    df = df.copy()
    le = LabelEncoder()
    le_target = LabelEncoder()

    # Fitur yang digunakan
    features = [
        "Gender", "Age", "WBC_Count", "Protein_Level", 
        "Glucose_Level", "Pathogen_Present", "Hemoglobin", "WBC_Blood_Count"
    ]
    target = "Risk_Level"
    
    # Check present features
    available_features = [f for f in features if f in df.columns]

    # Filter dataframe sesuai fitur dan target
    df = df[available_features + [target]].dropna()

    # Encode target
    df["Target_enc"] = le_target.fit_transform(df[target])
    target_mapping = dict(zip(le_target.classes_, le_target.transform(le_target.classes_)))
    print(f"\n▸ Target mapping           : {target_mapping}")

    # Encode fitur kategorikal (Gender, Pathogen_Present)
    cat_cols = [c for c in available_features if df[c].dtype == "object"]
    print(f"▸ Kolom kategorikal (fitur): {cat_cols}")
    for col in cat_cols:
        df[col] = le.fit_transform(df[col].astype(str))

    # Pisahkan X dan y
    X = df[available_features]
    y = df["Target_enc"]

    print(f"▸ Fitur (X)  : {X.shape[1]} kolom")
    print(f"▸ Target (y) : {y.nunique()} kelas")

    # Feature Scaling
    scaler = StandardScaler()
    X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)

    # Train-Test Split 80:20
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\n▸ Train set  : {X_train.shape[0]} sampel")
    print(f"▸ Test set   : {X_test.shape[0]} sampel")

    return X_train, X_test, y_train, y_test, X.columns.tolist(), list(le_target.classes_)


# STEP 4 ─ MODEL TRAINING
def step4_train_models(X_train, y_train) -> dict:
    print("\n" + "═"*60)
    print("  STEP 4 │ MODEL TRAINING")
    print("═"*60)

    models = {
        "Logistic Regression":    LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'),
        "Random Forest":          RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'),
        "Gradient Boosting":      GradientBoostingClassifier(n_estimators=100, random_state=42),
    }

    sample_weights = compute_sample_weight('balanced', y_train)

    trained = {}
    for name, model in models.items():
        if name == "Gradient Boosting":
            model.fit(X_train, y_train, sample_weight=sample_weights)
        else:
            # Although LR and RF have class_weight="balanced" inside their constructor,
            model.fit(X_train, y_train)
        trained[name] = model
        print(f"▸ ✔ {name} — selesai dilatih")

    return trained


# STEP 5 ─ MODEL EVALUATION
def step5_evaluate(trained: dict, X_test, y_test, target_classes) -> pd.DataFrame:
    print("\n" + "═"*60)
    print("  STEP 5 │ MODEL EVALUATION")
    print("═"*60)

    results = []
    predictions = {}

    for name, model in trained.items():
        y_pred = model.predict(X_test)
        predictions[name] = y_pred

        acc  = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
        rec  = recall_score(y_test, y_pred, average="weighted", zero_division=0)
        f1   = f1_score(y_test, y_pred, average="weighted", zero_division=0)
        
        # Buat composite score (rata-rata dari ke-4 metrik)
        # composite_score = (acc + prec + rec + f1) / 4.0
        composite_score = (acc * 0.2) + (prec * 0.2) + (rec * 0.3) + (f1 * 0.3)
        results.append({
            "Model":     name,
            "Accuracy":  round(acc,  4),
            "Precision": round(prec, 4),
            "Recall":    round(rec,  4),
            "F1-Score":  round(f1,   4),
            "Composite Score": round(composite_score, 4),
        })

        print(f"\n{'─'*50}")
        print(f"  {name}")
        print(f"{'─'*50}")
        print(classification_report(y_test, y_pred,
              target_names=target_classes))

    return pd.DataFrame(results), predictions


# STEP 6 ─ MODEL COMPARISON
def step6_comparison(results_df: pd.DataFrame):
    print("\n" + "═"*60)
    print("  STEP 6 │ MODEL COMPARISON")
    print("═"*60)
    print(f"\n{results_df.to_string(index=False)}")

    best = results_df.loc[results_df["Composite Score"].idxmax()]
    print(f"   Model Terbaik : {best['Model']}")
    print(f"   Composite Score: {best['Composite Score']}")
    print(f"   F1-Score       : {best['F1-Score']}")
    print(f"   Accuracy       : {best['Accuracy']}")

# STEP 7 ─ VISUALIZATION
def step7_visualize(trained, predictions, results_df, y_test, feature_names, target_classes, out_path):
    print("\n" + "═"*60)
    print("  STEP 7 │ VISUALIZATION")
    print("═"*60)

    fig = plt.figure(figsize=(22, 26), facecolor="#0f1117")
    fig.suptitle("Meningitis ML Pipeline — Model Evaluation Dashboard",
                 fontsize=18, fontweight="bold", color="#e0e0e0", y=0.98)

    gs = gridspec.GridSpec(3, 3, figure=fig,
                           hspace=0.55, wspace=0.4,
                           top=0.94, bottom=0.04)

    # Confusion Matrix
    model_names = list(trained.keys())
    colors_cm   = [PURPLE, TEAL, ORANGE]

    for i, name in enumerate(model_names):
        ax = fig.add_subplot(gs[0, i])
        cm = confusion_matrix(y_test, predictions[name])
        sns.heatmap(cm, annot=True, fmt="d", cmap="Purples",
                    linewidths=1, linecolor="#0f1117",
                    xticklabels=target_classes,
                    yticklabels=target_classes,
                    cbar=False, ax=ax,
                    annot_kws={"size": 13, "weight": "bold", "color": "#0f1117"})
        ax.set_title(f"Confusion Matrix\n{name}", fontsize=10,
                     fontweight="bold", color=colors_cm[i], pad=8)
        ax.set_xlabel("Predicted", fontsize=9)
        ax.set_ylabel("Actual",    fontsize=9)

    # ── 7b: Bar Chart — Metric Comparison (row 1, full width) ─
    ax_bar = fig.add_subplot(gs[1, :])
    metrics  = ["Accuracy", "Precision", "Recall", "F1-Score", "Composite Score"]
    x        = np.arange(len(metrics))
    bar_w    = 0.22
    offsets  = [-bar_w, 0, bar_w]

    for idx, (name, color) in enumerate(zip(model_names, ACCENT)):
        vals = [results_df.loc[results_df["Model"]==name, m].values[0] for m in metrics]
        bars = ax_bar.bar(x + offsets[idx], vals, bar_w,
                          label=name, color=color, alpha=0.88, zorder=3)
        for bar, val in zip(bars, vals):
            ax_bar.text(bar.get_x() + bar.get_width()/2,
                        bar.get_height() + 0.005,
                        f"{val:.3f}", ha="center", va="bottom",
                        fontsize=8, color=color, fontweight="bold")

    ax_bar.set_xticks(x)
    ax_bar.set_xticklabels(metrics, fontsize=11)
    ax_bar.set_ylim(0, 1.12)
    ax_bar.set_title("Perbandingan Metrik Evaluasi — Semua Model",
                     fontsize=13, fontweight="bold", pad=10)
    ax_bar.legend(fontsize=9, framealpha=0.2, loc="lower right")
    ax_bar.grid(axis="y", zorder=0)

    ax_tbl = fig.add_subplot(gs[2, :])
    ax_tbl.axis("off")

    tbl_data = results_df.copy()
    tbl_data = tbl_data.sort_values("Composite Score", ascending=False).reset_index(drop=True)
    tbl_data.insert(0, "Rank", ["1", "2", "3"])

    col_labels = tbl_data.columns.tolist()
    cell_vals  = tbl_data.values.tolist()

    table = ax_tbl.table(
        cellText=cell_vals,
        colLabels=col_labels,
        cellLoc="center",
        loc="center",
        bbox=[0.0, 0.0, 1.0, 1.0]
    )
    table.auto_set_font_size(False)
    table.set_fontsize(11)

    header_color = "#2a2d3a"
    row_colors   = ["#1a1d27", "#141620"]

    for (r, c), cell in table.get_celld().items():
        cell.set_edgecolor("#3a3d4d")
        cell.set_linewidth(0.8)
        if r == 0:
            cell.set_facecolor(header_color)
            cell.set_text_props(color=TEAL, fontweight="bold", fontsize=11)
        else:
            cell.set_facecolor(row_colors[(r-1) % 2])
            cell.set_text_props(color="#e0e0e0", fontsize=10)

    ax_tbl.set_title("Ranking Model Berdasarkan Composite Score",
                     fontsize=13, fontweight="bold", pad=12, color="#e0e0e0")

    plt.savefig(out_path, dpi=150, bbox_inches="tight",
                facecolor="#0f1117")
    plt.close()
    print(f"▸ Visualisasi disimpan: {out_path}")


def main():
    DATA_PATH = "meningitis.csv"
    OUT_IMG   = "meningitis_ml_dashboard.png"


    # 1. Data Understanding
    df = step1_data_understanding(DATA_PATH)

    # 2. Data Cleaning
    df = step2_data_cleaning(df)

    # 3. Preprocessing
    X_train, X_test, y_train, y_test, feat_names, target_classes = step3_preprocessing(df)

    # 4. Train Models
    trained = step4_train_models(X_train, y_train)

    # 5. Evaluate
    results_df, predictions = step5_evaluate(trained, X_test, y_test, target_classes)

    # 6. Compare
    step6_comparison(results_df)

    # 7. Visualization
    step7_visualize(trained, predictions, results_df,
                    y_test, feat_names, target_classes, OUT_IMG)

    print("\n" + "═"*60)
    print("END")
    print("═"*60 + "\n")


if __name__ == "__main__":
    main()
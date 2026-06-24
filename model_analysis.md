# Evaluasi Model Machine Learning: Meningitis Outcome

Berdasarkan hasil pipeline (dengan tambahan parameter `class_weight='balanced'` pada model yang mendukung), berikut adalah hasil evaluasi untuk ketiga model (Logistic Regression, Random Forest, dan Gradient Boosting) berdasarkan 5 kriteria utama:

## 1. Keselamatan Dulu (Minimalisir Kasus Kritis Terlewat)
**🏆 Pemenang: Logistic Regression & Random Forest**

Dalam konteks medis, metrik yang paling krusial adalah **Recall untuk kelas Deceased (0)**, karena risiko salah memprediksi pasien yang sebenarnya "Deceased" tapi diprediksi "Recovered" sangat fatal.
- **Logistic Regression**: Memiliki Recall **0.88** (88% pasien *Deceased* berhasil dideteksi).
- **Random Forest**: Juga memiliki Recall **0.88**.
- **Gradient Boosting**: Memiliki Recall yang sangat buruk untuk kelas *Deceased*, yaitu **0.00** (0%), artinya model ini gagal total mendeteksi kasus kritis dan memprediksi mayoritas pasien sebagai *Recovered*. Ini sangat berbahaya dan langsung mendiskualifikasi Gradient Boosting untuk kasus ini.

## 2. Konsistensi (Stabilitas di Beragam Data)
**🏆 Pemenang: Logistic Regression**

Berdasarkan pengujian *Cross-Validation* (CV) menggunakan 5-Fold dengan metrik F1-Weighted:
- **Logistic Regression**: Standar Deviasi F1 = **0.0042** (Sangat stabil, performanya nyaris tidak berubah ketika dihadapkan pada data baru).
- **Gradient Boosting**: Standar Deviasi F1 = **0.0024** (Sebenarnya paling kecil deviasinya, tapi performa aslinya sangat buruk, sehingga stabilitasnya adalah "stabil dalam memberikan hasil buruk").
- **Random Forest**: Standar Deviasi F1 = **0.0229** (Lebih fluktuatif dibandingkan model linear).

## 3. Fairness (Tidak Diskriminatif)
**🏆 Pemenang: Logistic Regression & Random Forest**

Perlu ada pengujian mendalam spesifik pada subset demografis (Age & Gender) untuk memastikan *fairness*. Namun secara bawaan model:
- **Logistic Regression** (model linear) jauh lebih mudah diaudit untuk *fairness* karena kita bisa langsung melihat bobot koefisiennya untuk mengetahui seberapa besar faktor umur atau gender memengaruhi keputusan model tanpa harus melakukan simulasi yang kompleks.
- Model berbasis tree seperti **Random Forest** rentan terhadap bias pada fitur yang sering muncul atau memiliki banyak kategori, dan audit *fairness* kombinatorik antar trees lebih sulit dilakukan.

## 4. Interpretabilitas (Kemudahan Penjelasan)
**🏆 Pemenang: Logistic Regression**

Di bidang medis dan untuk tinjauan regulasi, interpretasi adalah hal yang paling utama.
- **Logistic Regression**: Merupakan model *white-box*. Kita bisa dengan mudah mengekstrak koefisien fitur. Kita bisa dengan mudah menjelaskan ke dokter: *"Faktor A meningkatkan risiko sebesar X kali lipat."*
- **Random Forest & Gradient Boosting**: Keduanya adalah model *black-box*. Meskipun kita punya grafik "Top 10 Feature Importance", kita hanya tahu *fitur apa yang penting*, tapi kita **tidak tahu pasti arahnya** apakah fitur tersebut *meningkatkan* atau *menurunkan* peluang keselamatan secara langsung tanpa menggunakan tools tambahan seperti SHAP values.

## 5. Performa Umum (Accuracy, F1-Score, AUC-ROC)
**🏆 Pemenang: Logistic Regression**

Berdasarkan metrik keseluruhan pada *test set*:
- **Logistic Regression**: 
  - Accuracy: 0.81
  - F1-Score (Macro): 0.65
  - **AUC-ROC: 0.825** (Sangat baik dalam membedakan kedua kelas secara probabilistik / *ranking* peluang pasien).
- **Random Forest**:
  - Accuracy: 0.84
  - F1-Score (Macro): 0.61
  - AUC-ROC: ~0.78
- **Gradient Boosting**:
  - Accuracy: 0.88 (*Misleading* / Semu karena ketidakseimbangan kelas; model hanya menebak "Recovered" terus-menerus).
  - F1-Score (Deceased): 0.00
  - AUC-ROC: ~0.52 (Sama seperti menebak koin).

---

## Kesimpulan Akhir
**Pilihan Terbaik: Logistic Regression (dengan `class_weight='balanced'`)**

Untuk dataset Meningitis ini, model **Logistic Regression** adalah pilihan yang jauh lebih tangguh dan rasional untuk diterapkan. 

Meskipun akurasi mentahnya (81%) tampak sedikit lebih rendah dibandingkan Random Forest (84%) secara sekilas, Logistic Regression **jauh lebih aman** (memiliki Recall tinggi untuk deteksi kasus *Deceased*), **lebih stabil lintas sampel data**, dan yang terpenting untuk adopsi medis adalah sifatnya yang **100% transparan dan mudah dijelaskan kepada tenaga kesehatan dan regulator.**

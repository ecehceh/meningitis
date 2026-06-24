# Prediksi Risiko Meningitis (Meningitis Risk Predictor)

Proyek ini adalah sebuah aplikasi web yang dirancang untuk memprediksi tingkat risiko penyakit meningitis pada seorang individu. Berdasarkan input kondisi fisik dan hasil lab (seperti usia, jenis kelamin, sel darah putih, kadar protein, gula, dll), aplikasi ini menebak seberapa parah potensinya secara otomatis dan cepat.

Aplikasi ini ditujukan sebagai gambaran (prototipe) bagaimana sistem cerdas dapat membantu memberikan gambaran awal layaknya dokter virtual.

---

## Teknologi yang Digunakan (Tech Stack)

Meskipun Anda tidak harus paham pemrogramannya untuk menggunakan web ini, berikut adalah mesin-mesin penggerak utama di balik layar:

1. **Python & Scikit-Learn:** Ini adalah "otak" utama sistem kami. Digunakan untuk membuat dan melatih model Kecerdasan Buatan (AI) agar pintar mengenali pola penyakit.
2. **Flask API (Bagian Backend):** Ini adalah petugas pengantar pesan atau "pelayan di dapur". Flask bertugas mendengarkan pertanyaan dari halaman website, memberikannya ke mesin AI untuk dihitung, lalu mengantarkan jawabannya kembali ke layar Anda.
3. **Next.js & React (Bagian Frontend):** Ini adalah teknologi yang membangun "wajah" dari website. Teknologi ini menangani tampilan grafis, kotak isian (*form*), animasi, dan semua yang Anda klik serta lihat di layar.

---

## 1. Bagaimana Model Machine Learning Dibuat?

Pembuatan model ini mengikuti alur kerja (*pipeline*) *Machine Learning* standar yang umum dijumpai di mata kuliah Data Science, yaitu:

*   **Data Preparation (Preprocessing):** Pertama, kita membaca dataset `meningitis.csv` menggunakan *library* Pandas. Kita kemudian membersihkan data kotor, misalnya membuang baris diagnosis "Unknown", membuang kolom penanda seperti `Patient_ID`, serta menambal data yang kosong (*missing values*) dengan nilai rata-rata tengah (*median*) atau nilai yang paling sering muncul (modus).
*   **Feature Engineering & Scaling:** Model algoritma hanya paham angka, jadi data berformat teks (seperti "Male" atau "Yes") diubah menjadi kode numerik menggunakan **Label Encoding**. Setelah itu, karena fitur-fitur lab punya rentang angka yang beda jauh (misal: umur puluhan, WBC ratusan), skalanya kita seragamkan menggunakan **Standard Scaler** dari *Scikit-Learn* supaya bobot pelatihannya adil dan tidak bias.
*   **Model Training:** AI kita dilatih menggunakan **Gradient Boosting Classifier**, salah satu cabang dari *Ensemble Learning*. Secara sederhana, logika ini membangun 100 *decision trees* (pohon keputusan) secara berurutan, di mana pohon yang baru ditugaskan secara khusus untuk mengoreksi letak kesalahan prediksi dari pohon sebelumnya. Kita juga memasang fungsi `class_weight='balanced'` untuk memastikan model tidak 'menganaktirikan' kasus penyakit langka.
*   **Model Evaluation:** Kita melakukan *Train-Test Split* 80:20. Untuk melihat seberapa bagus model ini menebak, kita tidak bisa cuma bergantung pada *Accuracy*. Maka dari itu, kita merumuskan sebuah *Composite Score* (skor kombinasi gabungan) yang menimbang seberapa jago poin *Precision*, *Recall*, dan *F1-Score*-nya secara bersamaan.
*   **Model Export (Pickling):** File pemrograman (*script*) dan hasil latihan tersebut tidak efisien jika diulang terus menerus. Oleh karena itu, kita membungkusnya ke dalam sebuah objek siap saji (format `.pkl`) menggunakan modul **Joblib**. Anggap file ini sebagai "otak matang" yang bisa dipanggil kapan saja oleh *backend endpoint* ke dalam *website* via URL.

---

## 2. Bagaimana Website Ini Dibuat?

Sistem AI yang sangat pintar akan percuma jika tidak mudah diakses oleh tenaga medis maupun pasien awam. Oleh karena itu, kami membangun wujud websitenya:

*   **Membangun Rangka Tampilan (Frontend):** Dengan Next.js, kami menyusun layar interaktif seperti menyusun blok lego. Kami membuat sisi kanan untuk area kotak mengetik (nomor usia, kadar gula, dll), dan area kiri khusus untuk menampilkan kotak jawaban yang berwarna-warni.
*   **Proses Penyambungan (Integrasi):** Kotak-kotak di layar itu aslinya kosong. Saat Anda memencet tombol prediksi, website akan melakukan semacam *panggilan telepon* ke "pelayan dapur" (Flask backend). Website mengirimkan bungkusan hasil tes medis yang Anda ketik tadi, lalu menunggu sepersekian detik. Backend dengan segera memasukkannya ke mesin AI yang telah dibungkus sebelumnya, dan mengembalikan hasil hitung-hitungannya ke website, menghasilkan tampilan persentase risiko (Rendah, Sedang, atau Tinggi) pada halaman Anda.

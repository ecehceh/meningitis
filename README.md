# Prediksi Risiko Meningitis

Aplikasi web ini berfungsi untuk memprediksi tingkat risiko penyakit meningitis berdasarkan input kondisi fisik dan hasil lab (seperti usia, jenis kelamin, sel darah putih, kadar protein, gula, dll). Aplikasi ini bekerja seperti asisten dokter virtual untuk memberikan gambaran awal potensi penyakit dengan cepat.

## Techstack

Aplikasi ini dibangun menggunakan beberapa teknologi utama:

1. **Python & Scikit-Learn (AI):** "Otak" sistem yang dilatih untuk mengenali pola penyakit meningitis.
2. **Flask API (Backend):** Jembatan yang menghubungkan tampilan website dengan mesin cerdas AI.
3. **Next.js & React (Frontend):** Tampilan antarmuka website interaktif yang Anda lihat dan gunakan di layar.

## Cara Kerja Sistem

Secara garis besar, aplikasi ini bekerja melalui dua tahap utama:

### 1. Pelatihan Model AI
- **Penyiapan Data:** Data medis historis dibersihkan dan diubah menjadi format angka yang dapat dipahami komputer.
- **Pelatihan:** Model dilatih menggunakan algoritma *Gradient Boosting* agar pintar membedakan pola kasus meningitis.
- **Penyimpanan:** Model yang sudah dilatih disimpan (*export*) sehingga siap digunakan kapan saja untuk memprediksi data baru.

### 2. Proses Prediksi di Website
- **Input Data:** Pengguna memasukkan data medis pasien pada formulir di website.
- **Proses:** Saat tombol prediksi ditekan, data tersebut dikirim ke *backend* (Flask API).
- **Hasil:** *Backend* meneruskan data ke model AI untuk dihitung. Hasil persentase risiko (Rendah, Sedang, atau Tinggi) kemudian dikembalikan dan ditampilkan di layar pengguna.

"use client";

import { useState } from "react";

interface BlogItem {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  readTime: string;
  url: string;
}

const recommendationBlogs: Record<string, BlogItem[]> = {
  default: [
    {
      id: "def-1",
      badge: "Edukasi Meningitis",
      badgeColor: "bg-blue-100 text-blue-700",
      title: "Mengenal Gejala Khas Meningitis",
      description: "Meningitis adalah radang selaput otak yang sering kali ditandai dengan demam tinggi secara mendadak, sakit kepala hebat, dan kekakuan pada leher (kaku kuduk). Mengenali gejala awal ini dapat menyelamatkan nyawa.",
      readTime: "3 mnt baca",
      url: "https://www.halodoc.com/artikel/waspada-ini-gejala-meningitis-yang-perlu-segera-ditangani"
    },
    {
      id: "def-2",
      badge: "Pencegahan",
      badgeColor: "bg-teal-100 text-teal-700",
      title: "Pentingnya Menjaga Higienitas Personal",
      description: "Bakteri dan virus penyebab meningitis dapat menular melalui cairan pernapasan atau air liur. Rajin mencuci tangan, tidak berbagi alat makan, serta menjaga jarak dengan orang sakit sangat membantu pencegahan.",
      readTime: "4 mnt baca",
      url: "https://www.cdc.gov/meningitis/index.html"
    },
    {
      id: "def-3",
      badge: "Vaksinasi",
      badgeColor: "bg-purple-100 text-purple-700",
      title: "Perlindungan Melalui Vaksin Meningokokus",
      description: "Vaksinasi adalah cara paling efektif untuk melindungi diri dari berbagai jenis meningitis bakteri. Sangat disarankan bagi anak-anak, jamaah haji/umrah, serta individu yang tinggal di lingkungan padat.",
      readTime: "5 mnt baca",
      url: "https://www.halodoc.com/artikel/ini-jenis-vaksin-meningitis-yang-perlu-diketahui"
    }
  ],
  "Low Risk": [
    {
      id: "low-1",
      badge: "Tindakan Pencegahan",
      badgeColor: "bg-green-100 text-green-700",
      title: "Langkah Preventif & Pola Hidup Sehat",
      description: "Meskipun hasil analisis menunjukkan risiko rendah, tetap jaga daya tahan tubuh dengan pola makan bergizi, tidur cukup 7-8 jam sehari, dan berolahraga teratur untuk menghindari potensi infeksi musiman.",
      readTime: "3 mnt baca",
      url: "https://www.halodoc.com/artikel/ini-cara-mencegah-penularan-meningitis-yang-perlu-diketahui"
    },
    {
      id: "low-2",
      badge: "Imunisasi",
      badgeColor: "bg-teal-100 text-teal-700",
      title: "Lengkapi Jadwal Vaksinasi Anda",
      description: "Pastikan Anda dan keluarga telah mendapatkan vaksinasi lengkap seperti vaksin PCV (Pneumokokus) dan Hib. Ini merupakan tameng terkuat terhadap risiko meningitis bakteri di masa depan.",
      readTime: "4 mnt baca",
      url: "https://www.halodoc.com/artikel/ini-jenis-vaksin-meningitis-yang-perlu-diketahui"
    },
    {
      id: "low-3",
      badge: "Saran Dokter",
      badgeColor: "bg-blue-100 text-blue-700",
      title: "Pemantauan Gejala Mandiri",
      description: "Jika Anda mengalami gejala ringan seperti pusing biasa atau demam ringan, istirahatlah yang cukup. Segera lakukan konsultasi medis jika demam tidak kunjung turun dalam waktu 3 hari.",
      readTime: "3 mnt baca",
      url: "https://www.alodokter.com/meningitis/gejala"
    }
  ],
  "Moderate Risk": [
    {
      id: "mod-1",
      badge: "Rekomendasi Klinis",
      badgeColor: "bg-yellow-100 text-yellow-800",
      title: "Pemeriksaan Diagnostik Lanjutan",
      description: "Pasien dengan risiko sedang disarankan untuk menjalani tes laboratorium lanjutan. Kultur cairan otak (CSF) atau tes PCR virus (seperti HSV/Enterovirus) diperlukan untuk menentukan pengobatan spesifik.",
      readTime: "4 mnt baca",
      url: "https://www.mayoclinic.org/tests-procedures/lumbar-puncture/about/pac-20394631"
    },
    {
      id: "mod-2",
      badge: "Pemantauan Ketat",
      badgeColor: "bg-orange-100 text-orange-700",
      title: "Waspadai Perubahan Gejala Neurologis",
      description: "Awasi munculnya gejala klinis baru secara berkala, seperti sensitivitas berlebih terhadap cahaya (fotofobia), mual muntah proyektil, atau kebingungan ringan. Laporkan segera ke dokter.",
      readTime: "4 mnt baca",
      url: "https://ayosehat.kemkes.go.id/topik-penyakit/infeksi-saraf-dan-otak/meningitis"
    },
    {
      id: "mod-3",
      badge: "Terapi Pendukung",
      badgeColor: "bg-blue-100 text-blue-700",
      title: "Hidrasi dan Istirahat Total (Bedrest)",
      description: "Untuk kasus terduga meningitis virus ringan hingga sedang, terapi suportif berupa pemberian cairan intravena yang memadai, obat pereda nyeri/demam, serta istirahat total sangat penting dalam masa pemulihan.",
      readTime: "3 mnt baca",
      url: "https://www.cdc.gov/meningitis/viral.html"
    }
  ],
  "High Risk": [
    {
      id: "high-1",
      badge: "TINDAKAN DARURAT",
      badgeColor: "bg-red-100 text-red-700 font-bold",
      title: "Segera Cari Pertolongan Medis di IGD",
      description: "Meningitis risiko tinggi (terutama bakteri) adalah keadaan darurat medis yang fatal. Pasien harus segera dibawa ke instalasi gawat darurat (IGD) rumah sakit terdekat untuk penanganan dalam hitungan jam.",
      readTime: "2 mnt baca",
      url: "https://www.who.int/news-room/fact-sheets/detail/meningitis"
    },
    {
      id: "high-2",
      badge: "Terapi Klinis Utama",
      badgeColor: "bg-red-100 text-red-700",
      title: "Terapi Antibiotik & Steroid Intravena",
      description: "Pemberian antibiotik spektrum luas (seperti Ceftriaxone) harus segera dimulai secara intravena setelah pungsi lumbal dilakukan. Steroid (seperti Dexamethasone) diberikan guna menekan risiko ketulian dan kerusakan saraf.",
      readTime: "5 mnt baca",
      url: "https://www.alodokter.com/meningitis/pengobatan"
    },
    {
      id: "high-3",
      badge: "Karantina & Profilaksis",
      badgeColor: "bg-orange-100 text-orange-700",
      title: "Pencegahan Penularan Kontak Erat",
      description: "Beberapa meningitis bakteri sangat mudah menular. Pasien harus dirawat di ruang isolasi selama 24 jam pertama, dan kontak erat (keluarga/rekan serumah) disarankan meminum obat profilaksis (seperti Rifampicin).",
      readTime: "4 mnt baca",
      url: "https://www.cdc.gov/meningitis/bacterial/prevention.html"
    }
  ]
};

export default function Home() {
  const [formData, setFormData] = useState({
    Age: "",
    Gender: "Male",
    WBC_Count: "",
    Protein_Level: "",
    Glucose_Level: "",
    Pathogen_Present: "Yes",
    Hemoglobin: "",
    WBC_Blood_Count: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showPredictor, setShowPredictor] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Ensure numerical columns are sent properly
      const payload = {
        ...formData,
        Age: parseInt(formData.Age) || 0,
        WBC_Count: parseFloat(formData.WBC_Count) || 0,
        Protein_Level: parseFloat(formData.Protein_Level) || 0,
        Glucose_Level: parseFloat(formData.Glucose_Level) || 0,
        Hemoglobin: parseFloat(formData.Hemoglobin) || 0,
        WBC_Blood_Count: parseFloat(formData.WBC_Blood_Count) || 0,
      };

      // Flask API runs on port 5000
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "An error occurred during prediction.");
      }
    } catch (err) {
      setError("Cannot connect to the prediction server. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 glass-panel border-b border-[--color-border-main] rounded-none px-6 md:px-12 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-brand-gradient-end" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span className="font-bold text-xl text-[--color-text-main] tracking-wide">
            Meningi<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end">Care</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-[--color-text-muted]">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowPredictor(false);
            }}
            className={`transition-colors ${!showPredictor ? "text-brand-blue" : "hover:text-brand-blue"}`}
          >
            Home
          </a>
          {showPredictor && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
              }}
              className="text-brand-blue transition-colors font-bold"
            >
              Predictor
            </a>
          )}
        </nav>
      </header>

      {!showPredictor ? (
        <main className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-slide-up">
          <div className="max-w-4xl w-full flex flex-col items-center text-center gap-10">

            {/* Hero Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Deteksi Dini Risiko <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end">Meningitis</span> Berbasis AI
              </h1>
              <p className="max-w-2xl mx-auto text-slate-600 text-base md:text-lg leading-relaxed">
                Meningitis adalah penyakit infeksi selaput otak kritis yang memerlukan penanganan medis darurat. <strong>MeningiCare</strong> membantu Anda mendeteksi potensi risiko secara cepat menggunakan biomarker klinis.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowPredictor(true)}
              className="bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end hover:from-brand-blue hover:to-brand-dark-blue text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-brand-blue/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center gap-3"
            >
              Coba Sekarang (Try Now)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Explanation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left mt-8">
              <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-brand-blue bg-white/60">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-brand-light-blue text-brand-blue">🧠</span>
                  Apa itu Meningitis?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Meningitis adalah peradangan pada selaput pelindung yang menutupi otak dan saraf tulang belakang (meninges). Penyakit ini sering kali disebabkan oleh infeksi bakteri, virus, atau jamur. Deteksi cepat sangat krusial karena meningitis bakteri dapat berakibat fatal atau menyebabkan kerusakan otak permanen dalam hitungan jam.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-slate-400 bg-white/60">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">🔬</span>
                  Bagaimana MeningiCare Membantu?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  MeningiCare menggunakan kecerdasan buatan (Machine Learning) untuk mendeteksi tingkat keparahan risiko meningitis berdasarkan data biomarker pasien, seperti usia, jenis kelamin, serta analisis cairan otak (CSF) meliputi hitung sel darah putih (WBC), kadar glukosa, protein, hemoglobin, dan keberadaan patogen.
                </p>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="min-h-screen pt-32 pb-12 px-8 md:px-12 lg:px-24 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">

          <div className={`w-full grid grid-cols-1 gap-8 items-start animate-slide-up transition-all duration-500 ${
            result ? "max-w-7xl lg:grid-cols-12" : "max-w-4xl lg:grid-cols-2"
          }`}>

            {/* Left Column: Title & Result */}
            <div className={`flex flex-col gap-6 transition-all duration-500 ${result ? "lg:col-span-4" : "lg:col-span-1"}`}>
              <div className="glass-panel p-8 rounded-2xl">
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end mb-2">
                  Meningitis Risk Predictor
                </h1>
                <p className="text-[--color-text-muted] text-sm md:text-base leading-relaxed">
                  Enter patient biometric details to predict the meningitis severity risk level.
                </p>
              </div>

              {error && (
                <div className="glass-panel border-red-300 p-6 rounded-2xl bg-red-50 text-red-700">
                  <p className="font-semibold">⚠️ Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              )}

              {result && !error && (
                <div className={`glass-panel p-8 rounded-2xl border-t-4 transition-all duration-500 ${result.prediction === "Low Risk" ? "border-t-green-500" :
                  result.prediction === "Moderate Risk" ? "border-t-yellow-500" :
                    "border-t-red-500"
                  } animate-slide-up`}>
                  <h2 className="text-xl text-[--color-text-muted] mb-2 uppercase tracking-wider font-semibold">
                    Predicted Risk Level
                  </h2>
                  <div className="flex items-end gap-3 mb-6">
                    <span className={`text-4xl md:text-5xl font-bold ${result.prediction === "Low Risk" ? "text-green-500" :
                      result.prediction === "Moderate Risk" ? "text-yellow-500" :
                        "text-red-500"
                      }`}>
                      {result.prediction}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* High Risk Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[--color-text-muted]">High Risk Probability</span>
                        <span className="font-bold text-red-400">{result.prob_high}%</span>
                      </div>
                      <div className="w-full bg-[--color-border-main] rounded-full h-2.5">
                        <div className="h-2.5 rounded-full bg-red-500 transition-all duration-1000" style={{ width: `${result.prob_high}%` }}></div>
                      </div>
                    </div>

                    {/* Moderate Risk Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[--color-text-muted]">Moderate Risk Probability</span>
                        <span className="font-bold text-yellow-400">{result.prob_moderate}%</span>
                      </div>
                      <div className="w-full bg-[--color-border-main] rounded-full h-2.5">
                        <div className="h-2.5 rounded-full bg-yellow-500 transition-all duration-1000" style={{ width: `${result.prob_moderate}%` }}></div>
                      </div>
                    </div>

                    {/* Low Risk Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[--color-text-muted]">Low Risk Probability</span>
                        <span className="font-bold text-green-400">{result.prob_low}%</span>
                      </div>
                      <div className="w-full bg-[--color-border-main] rounded-full h-2.5">
                        <div className="h-2.5 rounded-full bg-green-500 transition-all duration-1000" style={{ width: `${result.prob_low}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Center/Right Column: Form Input */}
            <div className={`glass-panel p-8 rounded-2xl transition-all duration-500 ${result ? "lg:col-span-4" : "lg:col-span-1"}`}>
              <h2 className="text-xl font-bold mb-6 text-[--color-text-main] border-b border-[--color-border-main] pb-4">
                Patient Observation
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Demographic Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[--color-text-muted] mb-1">Age</label>
                    <input
                      type="number"
                      name="Age"
                      required
                      min="0"
                      max="120"
                      value={formData.Age}
                      onChange={handleChange}
                      className="w-full input-field rounded-lg px-4 py-2"
                      placeholder="e.g. 45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[--color-text-muted] mb-1">Gender</label>
                    <select
                      name="Gender"
                      value={formData.Gender}
                      onChange={handleChange}
                      className="w-full input-field rounded-lg px-4 py-2 appearance-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Biometric Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-5 pt-2">
                  <div>
                    <label className="block text-sm font-semibold text-[--color-text-muted] mb-1">WBC Count</label>
                    <input
                      type="number"
                      step="0.01"
                      name="WBC_Count"
                      required
                      value={formData.WBC_Count}
                      onChange={handleChange}
                      className="w-full input-field rounded-lg px-4 py-2"
                      placeholder="e.g. 500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[--color-text-muted] mb-1">WBC Blood Count</label>
                    <input
                      type="number"
                      step="0.01"
                      name="WBC_Blood_Count"
                      required
                      value={formData.WBC_Blood_Count}
                      onChange={handleChange}
                      className="w-full input-field rounded-lg px-4 py-2"
                      placeholder="e.g. 12.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[--color-text-muted] mb-1">Protein Level</label>
                    <input
                      type="number"
                      step="0.01"
                      name="Protein_Level"
                      required
                      value={formData.Protein_Level}
                      onChange={handleChange}
                      className="w-full input-field rounded-lg px-4 py-2"
                      placeholder="e.g. 150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[--color-text-muted] mb-1">Glucose Level</label>
                    <input
                      type="number"
                      step="0.01"
                      name="Glucose_Level"
                      required
                      value={formData.Glucose_Level}
                      onChange={handleChange}
                      className="w-full input-field rounded-lg px-4 py-2"
                      placeholder="e.g. 35"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[--color-text-muted] mb-1">Hemoglobin</label>
                    <input
                      type="number"
                      step="0.01"
                      name="Hemoglobin"
                      required
                      value={formData.Hemoglobin}
                      onChange={handleChange}
                      className="w-full input-field rounded-lg px-4 py-2"
                      placeholder="e.g. 14"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[--color-text-muted] mb-1">Pathogen Present</label>
                    <select
                      name="Pathogen_Present"
                      value={formData.Pathogen_Present}
                      onChange={handleChange}
                      className="w-full input-field rounded-lg px-4 py-2 appearance-none"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-8 py-3 px-4 rounded-lg font-bold text-white transition-all transform hover:-translate-y-1 ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end hover:from-brand-blue hover:to-brand-dark-blue hover:shadow-[0_0_20px_rgba(0,102,255,0.4)]"
                    }`}
                >
                  {loading ? "Analyzing..." : "Generate Prediction"}
                </button>
              </form>
            </div>

            {/* Right Column: Recommendations Blog (Only show when prediction exists) */}
            {result && (
              <div className="lg:col-span-4 flex flex-col gap-6 animate-slide-up">
                <div className="glass-panel p-8 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 className="text-xl font-bold text-[--color-text-main]">
                      Rekomendasi & Edukasi
                    </h2>
                  </div>
                  <p className="text-[--color-text-muted] text-sm leading-relaxed mb-4">
                    Panduan medis berdasarkan tingkat {result.prediction === "Low Risk" ? "Risiko Rendah" : result.prediction === "Moderate Risk" ? "Risiko Sedang" : "Risiko Tinggi"}.
                  </p>
                  <div className="border-t border-[--color-border-main] pt-4 space-y-4">
                    {(recommendationBlogs[result.prediction] || recommendationBlogs.default).map((blog) => (
                      <a
                        key={blog.id}
                        href={blog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-xl border border-[--color-border-main] bg-white/50 hover:bg-white/90 hover:shadow-md hover:border-brand-blue/30 transition-all duration-300 hover:scale-[1.01] transform group cursor-pointer"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${blog.badgeColor}`}>
                            {blog.badge}
                          </span>
                          <span className="text-[11px] text-[--color-text-muted]">
                            {blog.readTime}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[--color-text-main] group-hover:text-brand-blue transition-colors mb-1">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-[--color-text-muted] leading-relaxed">
                          {blog.description}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      )}
    </>
  );
}

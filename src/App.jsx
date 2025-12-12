// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Play, Pause, Facebook, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

/* ================== KONFIGURACJA EMAILJS ==================
  - Zarejestruj się w https://www.emailjs.com (darmowe konto)
  - Utwórz Service ID (np. service_xxx)
  - Utwórz Template ID (np. template_xxx)
  - Skopiuj Public Key (user_xxx lub publicKey)
  - Wklej wartości poniżej ORAZ w instrukcji niżej
=========================================================== */
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
/* ========================================================= */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "O nas", href: "#about" },
    { label: "Wartości", href: "#values" },
    { label: "Wydarzenia", href: "#events" },
    { label: "Galeria", href: "#gallery" },
    { label: "Partnerzy", href: "#partners" },
    { label: "Statut", href: "#statut" },
    { label: "Kontakt", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Symbol ΑΩ + logo + name */}
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-extrabold text-blue-400 neon-glow select-none">ΑΩ</span>
          <img src="/logo.png" alt="ALFA Logo" className="h-10 w-10 rounded-full shadow-md" />
          <div className="leading-none">
            <div className="text-sm text-gray-300">ALFA</div>
            <div className="text-base font-bold text-white">Chrześcijański Klub Motocyklowy</div>
          </div>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 font-medium text-gray-200">
          {menuItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-blue-400 transition">
              {item.label}
            </a>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-gray-200 p-2 hover:bg-gray-800 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-black/95 text-gray-200 backdrop-blur-md border-t border-gray-700 shadow-md"
          >
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 border-b border-gray-700 hover:bg-gray-800 transition"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ================== GALERIA (pełna, z kategoriami i lightbox) ================== */
function Gallery() {
  const baseGallery = [
    { src: "/alfa-website/assets/gal10.JPG", category: "Rajdy", caption: "Rajd Wiosenny — Polkowice 2024", date: "2024-05-10" },
    { src: "/alfa-website/assets/gal9.JPG", category: "Spotkania", caption: "Spotkanie Klubowe — Legnica 2023", date: "2023-08-21" },
    { src: "/alfa-website/assets/gal8.JPG", category: "Rajdy", caption: "Rajd Pokoju — Wrocław 2023", date: "2023-07-05" },
    { src: "/alfa-website/assets/gal7.JPG", category: "Inne", caption: "Przystanek na trasie — Sudety 2022", date: "2022-09-15" },
    { src: "/alfa-website/assets/gal6.JPG", category: "Spotkania", caption: "Zlot Braterstwa — Głogów 2022", date: "2022-05-19" },
    { src: "/alfa-website/assets/gal5.jpg", category: "Inne", caption: "Wieczorne ognisko — 2021", date: "2021-08-10" },
    { src: "/alfa-website/assets/gal4.jpg", category: "Rajdy", caption: "Wyprawa górska — Karpacz 2021", date: "2021-06-12" },
    { src: "/alfa-website/assets/gal3.jpg", category: "Spotkania", caption: "Zbiórka — Polkowice 2020", date: "2020-07-03" },
    { src: "/alfa-website/assets/gal2.jpg", category: "Inne", caption: "Przegląd techniczny — Warsztat 2020", date: "2020-04-11" },
    { src: "/alfa-website/assets/gal1.jpg", category: "Rajdy", caption: "Wyjazd na Jasną Górę — 2019", date: "2019-09-02" },
  ];

  const sorted = [...baseGallery].sort((a, b) => new Date(b.date) - new Date(a.date));
  const categories = ["Wszystkie", "Rajdy", "Spotkania", "Inne"];
  const [activeCategory, setActiveCategory] = useState("Wszystkie");
  const filtered = activeCategory === "Wszystkie" ? sorted : sorted.filter((g) => g.category === activeCategory);

  const [selected, setSelected] = useState(null);
  const [index, setIndex] = useState(0);
  const [slideshow, setSlideshow] = useState(false);

  useEffect(() => {
    if (!slideshow || !selected) return;
    const t = setInterval(() => {
      setIndex((prev) => {
        const next = prev >= filtered.length - 1 ? 0 : prev + 1;
        setSelected(filtered[next]);
        return next;
      });
    }, 4000);
    return () => clearInterval(t);
  }, [slideshow, selected, filtered]);

  useEffect(() => {
    const onKey = (e) => {
      if (!selected) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, index, filtered]);

  const openAt = (realIndex) => {
    setIndex(realIndex);
    setSelected(filtered[realIndex]);
  };

  const prev = () => {
    const newIdx = index === 0 ? filtered.length - 1 : index - 1;
    setIndex(newIdx);
    setSelected(filtered[newIdx]);
  };

  const next = () => {
    const newIdx = index === filtered.length - 1 ? 0 : index + 1;
    setIndex(newIdx);
    setSelected(filtered[newIdx]);
  };

  const close = () => {
    setSelected(null);
    setSlideshow(false);
  };

  return (
    <section id="gallery" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Galeria</h2>

        {/* Kategorie */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border transition ${
                activeCategory === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Miniatury – 5 najnowszych */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filtered.slice(0, 5).map((g) => {
            const realIndex = filtered.findIndex((x) => x.src === g.src);
            return (
              <div
                key={g.src}
                className="relative overflow-hidden rounded-xl shadow-md group cursor-pointer"
                onClick={() => openAt(realIndex)}
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  className="rounded-lg w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 rounded-lg">
                  <p className="text-white text-sm font-medium opacity-90 mb-1">{g.caption}</p>
                  <span className="text-white text-xs opacity-75">Powiększ 🔍</span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length > 5 && (
          <button
            onClick={() => {
              const el = document.getElementById("full-gallery");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition mt-6"
          >
            Zobacz pełną galerię
          </button>
        )}
      </div>

      {/* Pełna galeria */}
      <div id="full-gallery" className="max-w-6xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filtered.map((g, i) => (
            <div
              key={g.src}
              className="relative overflow-hidden rounded-lg group cursor-pointer"
              onClick={() => openAt(i)}
            >
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                className="w-full h-32 object-cover rounded-lg transform group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {g.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            {/* Zamknij */}
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="absolute top-6 left-6 text-white/80 hover:text-white text-3xl font-bold"
              title="Zamknij"
            >
              ✕
            </button>

            {/* Sterowanie */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSlideshow((s) => !s);
                }}
                className="text-white/90"
                title={slideshow ? "Zatrzymaj pokaz" : "Uruchom pokaz"}
              >
                {slideshow ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div className="text-white/80 text-sm">
                {index + 1} / {filtered.length}
              </div>
            </div>

            {/* Nawigacja */}
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-6 top-1/2 text-white/80 hover:text-white">
              <ChevronLeft size={44} />
            </button>

            <motion.img
              key={selected.src}
              src={selected.src}
              alt={selected.caption}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="max-h-[78vh] rounded-2xl shadow-2xl mb-4"
              onClick={(e)=>e.stopPropagation()}
            />

            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-6 top-1/2 text-white/80 hover:text-white">
              <ChevronRight size={44} />
            </button>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-200 italic mt-3 text-center max-w-2xl leading-relaxed"
            >
              {selected.caption}
            </motion.p>

            {/* Miniatury w lightboxie */}
            <div className="flex gap-2 mt-6 overflow-x-auto max-w-[90vw] pb-2" onClick={(e) => e.stopPropagation()}>
              {filtered.map((g, i) => (
                <img
                  key={g.src}
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  onClick={() => { setIndex(i); setSelected(filtered[i]); }}
                  className={`h-16 w-24 object-cover rounded-md cursor-pointer transition-all duration-200 ${
                    i === index ? "ring-2 ring-blue-500 scale-105" : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function App() {
  // kontakt (emailjs)
  const formRef = useRef();
  const [sending, setSending] = useState(false);

  // inicjalizacja emailjs (opcjonalnie można wywołać init, ale sendForm przyjmuje publicKey)
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      alert("Formularz kontaktowy nie jest skonfigurowany. Skonfiguruj EmailJS (SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY).");
      return;
    }
    setSending(true);
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
      .then((res) => {
        setSending(false);
        alert("Dziękujemy — wiadomość została wysłana.");
        formRef.current.reset();
      })
      .catch((err) => {
        setSending(false);
        console.error(err);
        alert("Wystąpił błąd podczas wysyłania. Spróbuj później.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-gray-200">
  <Navbar />
  <main className="pt-20">
    {/* HERO */}
    <section id="hero" className="relative h-[80vh] md:h-[90vh] flex items-center justify-center text-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/alfa-website/assets/baner_bike.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/65" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 px-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.7)] mb-4">ALFA CKM</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6">Wiara, Braterstwo i Wolność na Dwóch Kołach</p>
            <div className="flex justify-center gap-3">
              <a href="#about" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white font-semibold shadow-lg">Poznaj nas</a>
              <a href="#gallery" className="border border-gray-600 px-6 py-3 rounded-full text-gray-200 hover:border-blue-400">Galeria</a>
            </div>
          </motion.div>
        </section>

        {/* O NAS */}
        <section id="about" className="py-16 px-6">
          <div className="max-w-5xl mx-auto bg-gray-800/60 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">O nas</h2>
            <p className="text-gray-300 leading-relaxed">
              ALFA – Chrześcijański Klub Motocyklowy to lokalna wspólnota motocyklistów, która łączy pasję do jednośladów z żywą wiarą w Jezusa Chrystusa.
              Spotykamy się, aby dzielić się doświadczeniem, wspierać wzajemnie, uczyć bezpiecznej jazdy i służyć lokalnej społeczności. Zapraszamy wszystkich, którzy chcą połączyć
              motocyklową przygodę z wartościami biblijnymi.
            </p>
          </div>
        </section>

        {/* WARTOŚCI */}
        <section id="values" className="py-16 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
            {[
              { title: "Wiara", desc: "Biblia i osobista relacja z Jezusem w centrum naszej wspólnoty." },
              { title: "Służba", desc: "Pomagamy lokalnie — wolontariat, wsparcie potrzebujących." },
              { title: "Braterstwo", desc: "Wspólnota i wzajemne wsparcie, także poza trasą." },
              { title: "Bezpieczeństwo", desc: "Szkolenia i kultura odpowiedzialnej jazdy." },
            ].map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-blue-400 mb-2">{v.title}</h3>
                <p className="text-gray-300">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WYDARZENIA */}
        <section id="events" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Wydarzenia</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <article className="bg-gray-800/60 p-6 rounded-xl shadow">
                <h4 className="font-semibold text-lg">Rajd Wiosenny – Polkowice</h4>
                <p className="text-sm text-blue-400">2026-05-10</p>
                <p className="text-gray-300 mt-2">Spotkanie i przejazd — zapraszamy wszystkich chętnych.</p>
              </article>
              <article className="bg-gray-800/60 p-6 rounded-xl shadow">
                <h4 className="font-semibold text-lg">Szkolenie Bezpieczeństwa</h4>
                <p className="text-sm text-blue-400">2026-06-21</p>
                <p className="text-gray-300 mt-2">Warsztaty z techniki jazdy i pierwszej pomocy.</p>
              </article>
            </div>
          </div>
        </section>

        {/* GALERIA (komponent) */}
        <Gallery />

        {/* PARTNERZY */}
        <section id="partners" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Partnerzy</h2>
            <div className="flex flex-wrap gap-3">
              {["MotoPolkowice", "Warsztat Piotra", "Nowe Życie", "Warsztat Marcina"].map((p, i) => (
                <a key={p} href="#" className="px-4 py-2 bg-gray-800/60 rounded-full shadow hover:bg-blue-600 hover:text-white transition">{p}</a>
              ))}
            </div>
          </div>
        </section>

        {/* STATUT */}
        <section id="statut" className="py-16 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Statut / Regulamin</h2>
            <p className="text-gray-300 mb-6">Regulamin określa zasady działania ALFA — sposób przyjmowania członków, cele, władze, zasady finansowania i ustanie członkostwa.</p>
            <a href="/assets/Regulamin_ALFA.pdf" download className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">📥 Pobierz regulamin (PDF)</a>
          </div>
        </section>

        {/* MEDIA */}
        <section id="media" className="py-12 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Media</h2>
            <p className="text-gray-300 mb-4">Znajdź nas na Facebooku i Instagramie — dołącz do społeczności.</p>
            <div className="flex justify-center gap-6 text-xl">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-blue-600 transition">
                <Facebook /> Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-pink-500 transition">
                <Instagram /> Instagram
              </a>
            </div>
          </div>
        </section>

        {/* KONTAKT */}
        <section id="contact" className="py-16 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
            <form ref={formRef} className="bg-gray-800/60 p-6 rounded-xl shadow-lg" onSubmit={handleSend}>
              <h3 className="text-xl font-semibold text-blue-400 mb-4">Napisz do nas</h3>
              <label className="block text-sm text-gray-300">Imię i nazwisko</label>
              <input name="from_name" className="w-full p-2 border border-gray-700 rounded mb-3 bg-gray-900 text-gray-100" required />
              <label className="block text-sm text-gray-300">E-mail</label>
              <input name="reply_to" type="email" className="w-full p-2 border border-gray-700 rounded mb-3 bg-gray-900 text-gray-100" required />
              <label className="block text-sm text-gray-300">Temat</label>
              <input name="subject" className="w-full p-2 border border-gray-700 rounded mb-3 bg-gray-900 text-gray-100" required />
              <label className="block text-sm text-gray-300">Wiadomość</label>
              <textarea name="message" rows={6} className="w-full p-2 border border-gray-700 rounded mb-3 bg-gray-900 text-gray-100" required />
              <div className="flex items-center justify-between">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" disabled={sending}>
                  {sending ? "Wysyłanie..." : "Wyślij"}
                </button>
                <div className="text-xs text-gray-400">Odpowiedź otrzymasz na podany e-mail.</div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Formularz wysyła wiadomość przez EmailJS (bezpieczne, nie przechowujemy danych).</p>
            </form>

            <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold text-xl text-blue-400 mb-2">Dane kontaktowe</h3>
              <p>📧 <a href="mailto:kontakt@alfaccm.pl" className="text-blue-400">kontakt@alfaccm.pl</a></p>
              <p>📍 Polkowice, Polska</p>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Media społecznościowe</p>
                <div className="flex gap-3 mt-2">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-blue-400">Facebook</a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-pink-400">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STOPKA */}
        <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-700 mt-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p>ΑΩ {new Date().getFullYear()} ALFA Chrześcijański Klub Motocyklowy. Wszelkie prawa zastrzeżone.</p>
            <p>Strona: <a href="https://www.alfaccm.pl" className="text-blue-400">www.alfaccm.pl</a> • Email: <a href="mailto:kontakt@alfaccm.pl" className="text-blue-400">kontakt@alfaccm.pl</a></p>
          </div>
        </footer>
      </main>
    </div>
  );
}

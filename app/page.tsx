"use client";

import { useState } from "react";

const content = {
  en: {
    name: "Luis Sandoval",
    tagline: "Building an AI-powered trading bot from scratch — and documenting every step of the journey.",
    about: "About",
    blog: "Blog",
    stats: "Stats",
    toggle: "🇲🇽 Español",
  },
  es: {
    name: "Luis Sandoval",
    tagline: "Construyendo un bot de trading con IA desde cero — y documentando cada paso del camino.",
    about: "Acerca de",
    blog: "Blog",
    stats: "Estadísticas",
    toggle: "🇺🇸 English",
  },
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const t = content[lang];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24 relative">
      {/* Language toggle button */}
      <button
        onClick={() => setLang(lang === "en" ? "es" : "en")}
        className="absolute top-6 right-6 text-sm bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700"
      >
        {t.toggle}
      </button>

      <h1 className="text-5xl font-bold">{t.name}</h1>
      <p className="text-xl text-gray-400 max-w-lg text-center">{t.tagline}</p>

      <div className="flex gap-6">
        <a href="/about" className="text-blue-400 hover:underline">{t.about}</a>
        <a href="/blog" className="text-blue-400 hover:underline">{t.blog}</a>
        <a href="/stats" className="text-blue-400 hover:underline">{t.stats}</a>
      </div>
    </main>
  );
}
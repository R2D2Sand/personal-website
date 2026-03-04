"use client";

import { useState } from "react";

const content = {
  en: {
    toggle: "🇲🇽 Español",
    title: "About Me",
    intro: "I'm Luis Sandoval — a systems-minded problem solver based in San Diego, working at the intersection of operations, data, and emerging technology.",
    section1Title: "What I Do",
    section1: "By day I work in electronics repair and RMA operations at a technology hardware company, managing complex return and repair workflows for advanced computing hardware used by global customers. I coordinate between customers, vendors, and engineering teams while using tools like SQL, Python, SAP, and Excel to find bottlenecks and improve turnaround times.",
    section2Title: "What This Site Is",
    section2: "This site documents my journey building real technical projects using AI tools. I'm not a traditional developer — I'm someone who uses every tool available to build things that matter. If that inspires a hiring manager, great. If it helps someone else learn, even better.",
    section3Title: "Side Projects",
    section3: "Outside of work I'm constantly experimenting — algorithmic trading bots, sports analytics models, hardware prototyping with 3D printing and laser engraving. I pick up hobbies fast. I'm also a big European football fan.",
    section4Title: "The Bigger Picture",
    section4: "I'm self-taught, self-driven, and building toward a career that blends operations expertise, data science, and AI systems — while creating long-term stability for my growing family here in San Diego.",
    back: "← Back to Home",
  },
  es: {
    toggle: "🇺🇸 English",
    title: "Sobre Mí",
    intro: "Soy Luis Sandoval — un solucionador de problemas con mentalidad de sistemas, basado en San Diego, trabajando en la intersección de operaciones, datos y tecnología emergente.",
    section1Title: "Lo Que Hago",
    section1: "De día trabajo en una empresa de hardware tecnológico, gestionando flujos complejos de reparación para hardware de cómputo avanzado utilizado por clientes globales. Coordino entre clientes, proveedores y equipos de ingeniería usando herramientas como SQL, Python, SAP y Excel para encontrar cuellos de botella y mejorar tiempos de respuesta.",
    section2Title: "De Qué Trata Este Sitio",
    section2: "Este sitio documenta mi camino construyendo proyectos técnicos reales usando herramientas de IA. No soy un desarrollador tradicional — soy alguien que usa todas las herramientas disponibles para construir cosas que importan. Si eso le interesa a alguien que contrata, genial. Si ayuda a alguien más a aprender, mejor aún.",
    section3Title: "Proyectos Paralelos",
    section3: "Fuera del trabajo experimento constantemente — bots de trading algorítmico, modelos de análisis deportivo, prototipado de hardware con impresión 3D y grabado láser. Aprendo hobbies rápido. También soy un gran fanático del fútbol europeo.",
    section4Title: "El Panorama General",
    section4: "Soy autodidacta, automotivado, y estoy construyendo hacia una carrera que combina experiencia en operaciones, ciencia de datos y sistemas de IA — mientras creo estabilidad a largo plazo para mi familia en San Diego.",
    back: "← Volver al Inicio",
  },
};

export default function About() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const t = content[lang];

  return (
    <main className="flex min-h-screen flex-col items-center p-12 relative">
      {/* Language toggle */}
      <button
        onClick={() => setLang(lang === "en" ? "es" : "en")}
        className="absolute top-6 right-6 text-sm bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700"
      >
        {t.toggle}
      </button>

      <div className="max-w-2xl w-full mt-12">
        <a href="/" className="text-blue-400 hover:underline text-sm">{t.back}</a>

        <h1 className="text-4xl font-bold mt-6 mb-8">{t.title}</h1>

        <p className="text-lg text-gray-300 mb-8">{t.intro}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">{t.section1Title}</h2>
          <p className="text-gray-400">{t.section1}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">{t.section2Title}</h2>
          <p className="text-gray-400">{t.section2}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">{t.section3Title}</h2>
          <p className="text-gray-400">{t.section3}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">{t.section4Title}</h2>
          <p className="text-gray-400">{t.section4}</p>
        </section>
      </div>
    </main>
  );
}
'use client';

import { useEffect } from "react";
import type { EntireArticle } from "@/lib/types";
import DOMPurify from 'dompurify';
import JsSimulation from "./SimulationLogic/JsSimulation"
import Prism from "prismjs";

// Prism-Theme laden (andere Optionen: okaidia, solarizedlight, etc.)
import "prismjs/themes/prism-tomorrow.css";

// Benötigte Sprachen laden
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

type Props = {
  block: EntireArticle;
};

function youtubeToEmbed(url: string) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
  );

  if (!match) return null;

  return `https://www.youtube.com/embed/${match[1]}`;
}

export default function ArticleBlock({ block }: Props) {
  // Syntax-Highlighting triggern, wenn der Block geladen oder geändert wird
  useEffect(() => {
    Prism.highlightAll();
  }, [block]);

  switch (block.type) {
    case "SubHeader":
      return <h2 className="text-2xl font-bold mt-8 mb-4 text-zinc-500">{block.content}</h2>;

    case "TextAbschnitt":
      return <p className="mb-6 leading-8 text-stone-700">{block.content}</p>;

    case "Image":
      return (
        <img
          src={block.src}
          alt={block.alt}
        />
      );
      case "Video":
      const embedUrl = youtubeToEmbed(block.url);
      if (!embedUrl) return (
        <div className="p-4 border rounded bg-red-50 text-red-600 text-sm">
          Ungültige Video-URL. Nur YouTube-Links sind erlaubt.
        </div>
      );
      return (
        <iframe
          src={embedUrl}
          className="w-full aspect-video rounded-lg my-6"
            allowFullScreen
            title="Video"
        />
      );

    case "Quote":
      return (
        <blockquote className="border-l-4 pl-4 italic my-6 text-stone-600">
          {block.content}
        </blockquote>
      );

     case "CodeBlock":
      return (
        <div className="my-6">
          <pre className={`language-${block.language || 'javascript'} w-full p-4 rounded-lg border font-mono text-sm shadow-sm`}>
            <code className={`language-${block.language || 'javascript'}`}>{block.code}</code>
          </pre>
        </div>
  ); 

  case "Simulation":{
    // Nur noch externe Apps via URL sind erlaubt
    if (!block.url) {
      return (
        <div className="my-6 p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded-xl">
          <p className="font-semibold">Fehler: Keine Simulations-URL angegeben.</p>
          <p className="text-sm">Bitte bearbeite den Artikel und füge einen gültigen Link ein.</p>
        </div>
      );
    }

    // Falls es eine Streamlit App ist, hängen wir automatisch das Embed-Flag an
    const targetUrl = block.url.includes("streamlit.app") && !block.url.includes("embed=true")
      ? `${block.url}${block.url.includes("?") ? "&" : "?"}embed=true`
      : block.url;

    return (
      <div className="my-6 border rounded-xl overflow-hidden shadow-sm bg-stone-50 border-stone-200">
        <div className="bg-stone-100 px-4 py-2 text-xs font-mono text-stone-500 border-b border-stone-200 flex justify-between items-center">
          <span>📈 Eingebettete App-Simulation</span>
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium text-[11px]"
          >
            In neuem Tab öffnen ↗
          </a>
        </div>
        <iframe
          src={targetUrl}
          className="w-full h-[550px] bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms" // Diese Sandbox-Attribute sind für externe URLs immer noch sinnvoll
          allowFullScreen
          title="External App Simulation"
        />
      </div>
    );
  }
    default:
      return null;
  }
} 

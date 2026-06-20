"use client";

import { useEffect } from "react";
import type { EntireArticle } from "@/lib/types";
import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css";
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
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);

  if (!match) return null;

  return `https://www.youtube.com/embed/${match[1]}`;
}

export default function ArticleBlock({ block }: Props) {
  useEffect(() => {
    Prism.highlightAll();
  }, [block]);

  switch (block.type) {
    case "SubHeader":
      return (
        <h2 className="text-2xl font-bold mt-8 mb-4 text-zinc-500">
          {block.content}
        </h2>
      );

    case "TextAbschnitt":
      return (
        <p className="mb-6 leading-8 text-stone-700">{block.content}</p>
      );

    case "Image":
      return (
        <figure className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} className="rounded-lg max-w-full" />
          {block.caption && (
            <figcaption className="text-sm text-stone-500 mt-2 text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "Video": {
      const embedUrl = youtubeToEmbed(block.url);
      if (!embedUrl) {
        return (
          <div className="p-4 border rounded bg-red-50 text-red-600 text-sm">
            Ungültige Video-URL. Nur YouTube-Links sind erlaubt.
          </div>
        );
      }
      return (
        <iframe
          src={embedUrl}
          className="w-full aspect-video rounded-lg my-6"
          allowFullScreen
          title="Video"
        />
      );
    }

    case "Quote":
      return (
        <blockquote className="border-l-4 pl-4 italic my-6 text-stone-600">
          {block.content}
          {block.author && (
            <footer className="mt-2 text-sm not-italic text-stone-500">
              — {block.author}
            </footer>
          )}
        </blockquote>
      );

    case "CodeBlock":
      return (
        <div className="my-6">
          <pre
            className={`language-${block.language || "javascript"} w-full p-4 rounded-lg border font-mono text-sm shadow-sm`}
          >
            <code className={`language-${block.language || "javascript"}`}>
              {block.code}
            </code>
          </pre>
        </div>
      );

    case "Simulation": {
      if (!block.url) {
        return (
          <div className="my-6 p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded-xl">
            <p className="font-semibold">
              Fehler: Keine Simulations-URL angegeben.
            </p>
            <p className="text-sm">
              Bitte bearbeite den Artikel und füge einen gültigen Link ein.
            </p>
          </div>
        );
      }

      const targetUrl =
        block.url.includes("streamlit.app") &&
        !block.url.includes("embed=true")
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
            sandbox="allow-scripts allow-same-origin allow-forms"
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

import type { Content, EntireArticle } from "./types";

function blockToText(block: EntireArticle): string {
  switch (block.type) {
    case "TextAbschnitt":
    case "SubHeader":
    case "Quote":
      return block.content;
    case "Image":
      return [block.alt, block.caption].filter(Boolean).join(" ");
    case "Video":
    case "Simulation":
      return block.url;
    case "CodeBlock":
      return block.code;
    default:
      return "";
  }
}

export function extractSearchText(title: string, contentState: Content): string {
  const blockTexts = contentState.Article.map(blockToText).join(" ");
  return `${title} ${blockTexts}`.trim();
}

export function blockPreviewText(block: EntireArticle): string {
  if ("content" in block) return block.content;
  if (block.type === "CodeBlock") return block.code;
  return "";
}

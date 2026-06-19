export type TextAbschnitt = {
    type: "TextAbschnitt";
    content: string;
}

export type SubHeader = {
    type: "SubHeader";
    content: string;
}

export type Image = {
    type: "Image";
    src: string;
    alt: string;
    caption?: string;
}

export type Video = {
    type: "Video";
    url: string;
}

export type Quote = {
    type : "Quote"
    content: string;
    author?: string;
}

export type CodeBlock = {
  type: "CodeBlock";
  language: string;
  code: string;
};

export type Simulation = {
    type : "Simulation";
    url: string;
};


export type EntireArticle = TextAbschnitt | SubHeader | Image |Video | Quote | CodeBlock | Simulation

export type Content = {Article : EntireArticle[]}
export type TextAbschnitt = {
  type: "TextAbschnitt";
  content: string;
};

export type SubHeader = {
  type: "SubHeader";
  content: string;
};

export type Image = {
  type: "Image";
  src: string;
  alt: string;
  caption?: string;
};

export type Video = {
  type: "Video";
  url: string;
};

export type Quote = {
  type: "Quote";
  content: string;
  author?: string;
};

export type CodeBlock = {
  type: "CodeBlock";
  language: string;
  code: string;
};

export type Table = {
  type: "Table";
  rows: string[][];
  headers: string[];
}

export type Diagram = {
  type: "Diagram";
  chartType: ChartType;
  title?: string;
  labels: string[];
  series: DiagramSeries[];
};

export type Simulation = {
  type: "Simulation";
  url: string;
};



export type EntireArticle =
  | TextAbschnitt
  | SubHeader
  | Image
  | Video
  | Quote
  | CodeBlock
  | Simulation
  | Table
  | Diagram;

export type Content = { Article: EntireArticle[] };

export const REVISION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUPERSEDED: "SUPERSEDED",
} as const;

export type RevisionStatus =
  (typeof REVISION_STATUS)[keyof typeof REVISION_STATUS];

export type ArticleRevisionWithAuthor = {
  articleId: string;
  title: string;
  createdAt: Date;
  content: Content;
  author: {
    username: string;
  };
};

export type CommentWithUser = {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: {
    username: string;
  };
};

export type ChartType = "line" | "bar" | "pie";

export type DiagramSeries = {
  name: string;
  values: number[];
};
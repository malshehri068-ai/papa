export interface GenerationOptions {
  contentType: string;
  topic: string;
  prompt: string;
  model: string;
  tone: string;
  length: string;
  language?: string;
  targetAudience: string;
  aspects: string[];
}

export interface GeneratedArticle {
  id: string;
  title: string;
  content: string;
  model: string;
  wordCount: number;
  readingTimeMinutes: number;
  createdAt: string;
  prompt: string;
}

export interface MarketingTopic {
  id: string;
  title: string;
  prompt: string;
  category: string;
  badge: string;
}

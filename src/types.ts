export interface GenerationOptions {
  contentType: string;
  topic: string;
  subject: string;
  gradeLevel: string;
  prompt: string;
  model: string;
  tone: string;
  length: string;
  learningStrategy?: string;
  language?: string;
  targetAudience?: string;
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
  category?: string;
  quotaNotice?: string;
}

export interface EducationalTopic {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  contentType: string;
  prompt: string;
  category: string;
  badge: string;
}

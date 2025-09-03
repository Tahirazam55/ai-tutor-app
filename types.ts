export enum Role {
  User = 'user',
  AI = 'ai',
}

export interface Message {
  id: number;
  role: Role;
  text: string;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export enum InputMode {
  Text = 'text',
  Image = 'image',
  Voice = 'voice',
}

export enum Language {
  English = 'en',
  Urdu = 'ur',
}
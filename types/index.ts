export interface Message {
  role: Role;
  content: string;
}

export type Role = "assistant" | "user";

export type Session = {
  user: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
  };
} | null;

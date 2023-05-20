import { Chat } from "@/components/chat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Chat",
};

export default function Home() {
  return <Chat />;
}

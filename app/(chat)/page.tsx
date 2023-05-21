import { Metadata } from "next";

import { Chat } from "@/components/chat";

export const metadata: Metadata = {
  title: "New Chat",
};

export default function Home() {
  return <Chat />;
}

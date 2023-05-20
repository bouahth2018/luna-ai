import { Chat } from "@/components/chat";

interface Params {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Params) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const href = `/api/conversations/${params.id}`;
  const pathname = baseUrl + href;

  // fetch data
  const conversation = await fetch(pathname).then((res) => res.json());

  return {
    title: conversation.name,
  };
}

export default function ChatRoom() {
  return <Chat />;
}

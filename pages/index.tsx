import { Chat } from "@/components/Chat";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Luna AI Powered by ChatGPT</title>
        <meta name="description" content="Luna AI Powered by ChatGPT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Chat />
      </main>
    </>
  );
}

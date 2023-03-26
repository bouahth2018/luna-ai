import { Layout, Text, Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";
import Head from "next/head";

function Home() {
  return (
    <div>
      <Head>
        <title>Luna AI Powered by ChatGPT</title>
      </Head>
      <div className="h-screen bg-[#111]">
        <Chat />
      </div>
    </div>
  );
}

Home.Layout = Layout;

export default Home;

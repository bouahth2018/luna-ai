import { Layout, Text, Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";

function Home() {
  return (
    <div className="h-screen bg-[#111]">
      <Chat />
    </div>
  );
}

Home.Layout = Layout;

export default Home;

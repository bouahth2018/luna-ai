import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import Layout from "@/components/Sidebar/Layout";
import { GetServerSideProps } from "next";
import { Chat } from "@/components/Chat/Chat";

export default function ChatHome() {
  return (
    <Layout>
      <Chat />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

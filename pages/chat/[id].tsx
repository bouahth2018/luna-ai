import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import Layout from "@/components/Layout";
import { GetServerSideProps } from "next";
import { ChatLayout } from "@/components/ChatLayout";

export default function ChatRoom() {
  return (
    <Layout>
      <ChatLayout />
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

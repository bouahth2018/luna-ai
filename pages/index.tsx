import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Loader } from "tabler-icons-react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      console.log(session);
      if (!session) {
        router.replace("/auth/signin");
      } else {
        router.replace("/chat");
        setLoading(false);
      }
    }
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <>
        <Head>
          <title>Luna AI | Astrant</title>
          <meta
            name="description"
            content="A friendly and knowledgeable AI designed to assist and interact with humans."
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col justify-center min-h-full">
          <div className="flex justify-center items-center w-full flex-1 self-center p-6 flex-col relative">
            <Loader className="h-8 w-8 text-white animate-spin" />
            <span className="text-[#777] mt-6">
              Please stand by, while we are checking your browser...
            </span>
          </div>
        </div>
      </>
    );
  }

  return;
}

import { getServerSession } from "next-auth";
import Head from "next/head";
import { authOptions } from "./api/auth/[...nextauth]";
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
            {/* <span className="text-white">Please stand by...</span> */}
            <Loader className="h-8 w-8 text-white animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return;
}

// export async function getServerSideProps(context: any) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/auth/signin",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       session,
//     },
//     redirect: {
//       destination: "/chat",
//       permanent: false,
//     },
//   };
// }

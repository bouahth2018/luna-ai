import type { InferGetServerSidePropsType } from "next";
import { getProviders, getSession, signIn } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader } from "tabler-icons-react";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      console.log(session);
      if (session) {
        router.replace("/chat");
      } else {
        setLoading(false);
      }
    }
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Luna AI | Astrant</title>
        <meta
          name="description"
          content="A friendly and knowledgeable AI designed to assist and interact with humans."
        />
      </Head>
      <div className="flex flex-col justify-center min-h-full">
        <div className="flex justify-center items-center w-full flex-1 self-center p-6 flex-col relative">
          <div className="max-w-md text-center mb-1 block">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Log in to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Luna AI
              </span>
            </h1>
          </div>
          <span className="block w-[1px] h-[1px] min-w-[1px] min-h-[1px] ml-6 mt-6"></span>
          {loading ? (
            <Loader className="h-8 w-8 animate-spin text-white" />
          ) : (
            <>
              {Object.values(providers).map((provider) => (
                <div
                  key={provider.name}
                  className="w-full max-w-xs self-center block"
                >
                  {provider.name === "Google" && (
                    <>
                      <span className="block relative box-border">
                        <button
                          onClick={() => signIn(provider.id)}
                          className="min-w-full max-w-full h-12 px-3 flex justify-center items-center rounded-md bg-[#333] hover:bg-[#444] text-white"
                        >
                          <span className="flex mr-2">
                            <svg
                              fill="#fff"
                              width="20"
                              height="20"
                              viewBox="-2 -2 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              preserveAspectRatio="xMinYMin"
                            >
                              <path d="M4.376 8.068A5.944 5.944 0 0 0 4.056 10c0 .734.132 1.437.376 2.086a5.946 5.946 0 0 0 8.57 3.045h.001a5.96 5.96 0 0 0 2.564-3.043H10.22V8.132h9.605a10.019 10.019 0 0 1-.044 3.956 9.998 9.998 0 0 1-3.52 5.71A9.958 9.958 0 0 1 10 20 9.998 9.998 0 0 1 1.118 5.401 9.998 9.998 0 0 1 10 0c2.426 0 4.651.864 6.383 2.302l-3.24 2.652a5.948 5.948 0 0 0-8.767 3.114z" />
                            </svg>
                          </span>
                          Continue with {provider.name}
                        </button>
                      </span>
                      <span className="mt-[11px] block w-[1px] h-[1px] min-w-[1px] min-h-[1px] ml-6"></span>
                    </>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

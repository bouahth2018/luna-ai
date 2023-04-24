import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Log in to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Luna AI
              </span>
            </h1>
          </div>
          <span className="block w-[1px] h-[1px] min-w-[1px] min-h-[1px] ml-6 mt-6"></span>
          {Object.values(providers).map((provider) => (
            <div
              key={provider.name}
              className="w-full max-w-xs self-center block"
            >
              {provider.name === "Discord" && (
                <>
                  <span className="block relative box-border">
                    <button
                      onClick={() => signIn(provider.id)}
                      className="min-w-full max-w-full h-12 px-3 flex justify-center items-center rounded-md bg-[#333] hover:bg-[#444] text-white"
                    >
                      <span className="flex mr-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="#fff"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028ZM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38Zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38Z" />
                        </svg>
                      </span>
                      Continue with {provider.name}
                    </button>
                  </span>
                  <span className="mt-[11px] block w-[1px] h-[1px] min-w-[1px] min-h-[1px] ml-6"></span>
                </>
              )}
              {/* {provider.name === "Facebook" && (
              <>
                <span className="block relative box-border">
                  <button
                    onClick={() => signIn(provider.id)}
                    className="min-w-full max-w-full h-12 px-3 flex justify-center items-center rounded-md bg-[#333] hover:bg-[#444] text-white"
                  >
                    <span className="flex mr-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                      >
                        <path
                          fill="#fff"
                          d="M15 8a7 7 0 0 0-7-7 7 7 0 0 0-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0 0 15 8z"
                        />
                      </svg>
                    </span>
                    Continue with {provider.name}
                  </button>
                </span>
                <span className="mt-[11px] block w-[1px] h-[1px] min-w-[1px] min-h-[1px] ml-6"></span>
              </>
            )} */}
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
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/chat" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

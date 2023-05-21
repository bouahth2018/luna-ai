"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { IconLoader } from "@tabler/icons-react";

export function UserAuthForm() {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  return (
    <div className="w-full max-w-xs self-center block">
      <span className="block relative box-border">
        <button
          type="button"
          className="min-w-full max-w-full h-12 px-3 flex justify-center items-center rounded-md bg-[#333] hover:bg-[#444] text-white"
          onClick={() => {
            setIsGoogleLoading(true);
            signIn("google");
          }}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <IconLoader className="h-5 w-5 animate-spin text-white mr-2" />
          ) : (
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
          )}
          Continue with Google
        </button>
      </span>
      <span className="mt-[11px] block w-[1px] h-[1px] min-w-[1px] min-h-[1px] ml-6"></span>
    </div>
  );
}

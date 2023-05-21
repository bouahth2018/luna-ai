"use client";

import { SessionProvider } from "next-auth/react";

import { ContextProvider } from "@/context";

interface Props {
  children?: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ContextProvider>{children}</ContextProvider>
    </SessionProvider>
  );
}

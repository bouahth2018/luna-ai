"use client";

import { ContextProvider } from "@/context";
import { SessionProvider } from "next-auth/react";

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

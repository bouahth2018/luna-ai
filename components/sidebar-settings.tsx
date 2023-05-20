// "use client";

interface Props {
  handleRefresh: () => void;
  conversations: Conversation[];
}

import {
  ArrowRightOnRectangleIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { SupportModal } from "./support-modal";
import { signOut } from "next-auth/react";
import { Conversation } from "@prisma/client";
import { useConversation } from "@/context";
import { useRouter } from "next/navigation";
import { ClearConversations } from "./clear-conversations";

export function SidebarSettings({ handleRefresh, conversations }: Props) {
  const { breakChatRef, setCurrentConversationId, setMessages } =
    useConversation();
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  async function handleClearConversations() {
    const response = await fetch(`/api/conversations`, {
      method: "DELETE",
    });
    if (response.ok) {
      breakChatRef.current = true;
      setTimeout(() => {
        breakChatRef.current = false;
      }, 100);
      router.push("/");
      setCurrentConversationId(null);
      setMessages([]);
      handleRefresh();
      // console.log("Cleared all conversations");
    } else {
      console.error("An error occurred while clearing conversations.");
    }
  }

  function handleOpenModal() {
    setOpen(true);
  }

  return (
    <>
      <SupportModal open={open} setOpen={setOpen} />
      {conversations?.length > 0 ? (
        <ClearConversations
          handleClearConversations={handleClearConversations}
        />
      ) : null}
      <button
        type="button"
        className="hidden md:flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#222] transition-colors duration-200 text-white cursor-pointer text-sm"
        onClick={handleOpenModal}
      >
        <HeartIcon className="h-4 w-4" />
        Support us
      </button>
      <button
        type="button"
        className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#222] transition-colors duration-200 text-white cursor-pointer text-sm"
        onClick={() => signOut()}
      >
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
        Log out
      </button>
    </>
  );
}

import {
  ArrowRightOnRectangleIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { Refresh } from "tabler-icons-react";
import { signOut } from "next-auth/react";
import { FC, useState } from "react";
import { SidebarButton } from "../Buttons/SidebarButton";
import { ClearConversations } from "./ClearConversations";
import { useRouter } from "next/router";
import { useConversation } from "@/context";
import { Modal } from "../Modal";

interface Props {
  handleRefresh: () => void;
  conversations: any;
}

export const Settings: FC<Props> = ({ handleRefresh, conversations }) => {
  const { breakChatRef, setCurrentConversationId, setMessages } =
    useConversation();
  const [open, setOpen] = useState<Boolean>(false);

  const router = useRouter();

  async function handleClearConversations() {
    const response = await fetch(`/api/conversations/delete`, {
      method: "DELETE",
    });
    if (response.ok) {
      breakChatRef.current = true;
      setTimeout(() => {
        breakChatRef.current = false;
      }, 100);
      router.push("/chat");
      setCurrentConversationId(null);
      setMessages([]);
      handleRefresh();
      console.log("Cleared all conversations");
    } else {
      console.error("An error occurred while clearing conversations.");
    }
  }

  function handleOpenModal() {
    setOpen(true);
  }

  return (
    <>
      <Modal open={open} setOpen={setOpen} />
      {conversations?.length > 0 ? (
        <ClearConversations
          handleClearConversations={handleClearConversations}
        />
      ) : null}
      {/* <SidebarButton
        text={"Refresh"}
        icon={<Refresh className="h-5 w-5" />}
        onClick={handleRefresh}
      /> */}
      <SidebarButton
        text={"Support us"}
        icon={<HeartIcon className="h-5 w-5" />}
        onClick={handleOpenModal}
      />
      <SidebarButton
        text={"Log out"}
        icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
        onClick={() => signOut()}
      />
    </>
  );
};

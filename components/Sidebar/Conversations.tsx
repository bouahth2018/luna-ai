import { useConversation } from "@/context";
import {
  ChatBubbleLeftIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";

export function Conversations({
  conversations,
  currentConversationId,
  setCurrentConversationId,
  handleRefresh,
}: any) {
  const { breakChatRef, setMessages } = useConversation();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const router = useRouter();

  const handleEnterDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRename();
    }
  };

  async function handleDelete() {
    const response = await fetch(
      `/api/conversations/delete/${currentConversationId}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      breakChatRef.current = true;
      setTimeout(() => {
        breakChatRef.current = false;
      }, 100);
      router.push("/chat");
      setCurrentConversationId(null);
      setMessages([]);
      handleRefresh();
      console.log("Conversation deleted.");
    } else {
      console.error("An error occurred while deleting the conversation.");
    }
  }

  async function handleRename() {
    if (renameValue.trim().length > 0) {
      const response = await fetch("/api/conversations/name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: renameValue,
          conversationId: currentConversationId,
        }),
      });

      if (response.ok) {
        handleRefresh();
        console.log("Conversation renamed to: ", renameValue);
      } else if (!response.ok) {
        console.error("An error ocuured while renaming conversation.");
      }

      setRenameValue("");
      setIsRenaming(false);
    }
  }

  function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    if (isDeleting) {
      handleDelete();
    } else if (isRenaming) {
      handleRename();
    }
    setIsDeleting(false);
    setIsRenaming(false);
  }

  function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleting(false);
    setIsRenaming(false);
  }

  function handleOpenRenameModal(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setIsRenaming(true);
  }

  function handleOpenDeleteModal(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleting(true);
  }

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  return (
    <>
      {conversations.map((conversation: any) => (
        <div
          key={conversation.id}
          className="flex flex-col gap-2 pb-2 text-[#999] text-sm"
        >
          <Link
            href={`/chat/${conversation.id}`}
            passHref
            className={clsx(
              conversation.id === currentConversationId
                ? "bg-[#333] text-white pr-14"
                : "text-[#999] hover:text-white hover:bg-[#222] hover:pr-4",
              "group flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all"
            )}
            onClick={() => {
              setCurrentConversationId(conversation.id);
              breakChatRef.current = true;
              setTimeout(() => {
                breakChatRef.current = false;
              }, 100);
            }}
          >
            {(isDeleting || isRenaming) &&
            conversation.id === currentConversationId ? (
              <>
                {isDeleting && (
                  <>
                    <TrashIcon className="h-5 w-5" />
                    <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                      Delete &quot;{conversation.name}&quot;?
                      <div
                        className={clsx(
                          conversation.id === currentConversationId
                            ? "from-[#333]"
                            : "group-hover:from-[#222] from-[#111]",
                          "absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l"
                        )}
                      />
                    </div>
                  </>
                )}
                {isRenaming && (
                  <>
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                      <input
                        className="flex-1 w-full max-h-5 overflow-hidden overflow-ellipsis bg-transparent text-left text-sm leading-5 text-white outline-none focus:border focus:border-indigo-500"
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={handleEnterDown}
                        autoFocus
                      />
                      <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l"></div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                  {conversation.name}
                  <div
                    className={clsx(
                      conversation.id === currentConversationId
                        ? "from-[#333]"
                        : "group-hover:from-[#222] from-[#111]",
                      "absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l"
                    )}
                  ></div>
                </div>
              </>
            )}

            {(isDeleting || isRenaming) &&
              conversation.id === currentConversationId && (
                <div className="absolute flex right-1 z-10 text-[#999] visible">
                  <button
                    type="button"
                    className="p-1 hover:text-white"
                    onClick={handleConfirm}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-white"
                    onClick={handleCancel}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            {conversation.id === currentConversationId &&
              !isDeleting &&
              !isRenaming && (
                <div className="absolute flex right-1 z-10 text-[#999] visible">
                  <button
                    type="button"
                    className="p-1 hover:text-white"
                    onClick={handleOpenRenameModal}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-white"
                    onClick={handleOpenDeleteModal}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
          </Link>
        </div>
      ))}
    </>
  );
}

export default memo(Conversations);

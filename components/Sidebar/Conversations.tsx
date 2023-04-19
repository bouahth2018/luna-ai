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
import { memo, useEffect, useState } from "react";

export function Conversations({
  conversations,
  currentConversationId,
  setCurrentConversationId,
  handleDelete,
}: any) {
  const { breakChatRef } = useConversation();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setrenameValue] = useState("");

  function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    if (isDeleting) {
      handleDelete();
    } else if (isRenaming) {
      // handleRename(conversation);
      // handle renaming here
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
    // Rename conversation here
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
            {isDeleting && conversation.id === currentConversationId ? (
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
                  ></div>
                </div>
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
                  <button type="button" className="p-1 hover:text-white">
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

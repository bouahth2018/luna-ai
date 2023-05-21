import { SidebarButton } from "./sidebar-button";
import { FC, useState } from "react";

import { CheckIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  handleClearConversations: () => Promise<void>;
}

export const ClearConversations: FC<Props> = ({ handleClearConversations }) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  function handleClear() {
    handleClearConversations();
    setIsConfirming(false);
  }

  return isConfirming ? (
    <div className="text-white w-full text-sm flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all hover:bg-[#222]">
      <TrashIcon className="h-4 w-4" />
      <div className="flex-1">Are you sure?</div>

      <div className="flex right-1 z-10 text-[#999] visible">
        <button
          type="button"
          className="px-1 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
        >
          <CheckIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="px-1 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setIsConfirming(false);
          }}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  ) : (
    <SidebarButton
      text={"Clear conversations"}
      icon={<TrashIcon className="h-4 w-4" />}
      onClick={() => setIsConfirming(true)}
    />
  );
};

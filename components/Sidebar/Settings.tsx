import {
  ArrowRightOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Refresh } from "tabler-icons-react";
import { signOut } from "next-auth/react";
import { FC } from "react";
import { SidebarButton } from "../Buttons/SidebarButton";
import { ClearConversations } from "./ClearConversations";

interface Props {
  handleRefresh: () => void;
  handleClearConversations: () => Promise<void>;
  conversations: any;
}

export const Settings: FC<Props> = ({
  handleRefresh,
  handleClearConversations,
  conversations,
}) => {
  return (
    <>
      <SidebarButton
        text={"Refresh"}
        icon={<Refresh className="h-5 w-5" />}
        onClick={handleRefresh}
      />
      {conversations?.length > 0 ? (
        <ClearConversations
          handleClearConversations={handleClearConversations}
        />
      ) : null}
      {/* <SidebarButton
        text={"Clear conversations"}
        icon={<TrashIcon className="h-5 w-5" />}
        onClick={handleClearConversations}
      /> */}
      <SidebarButton
        text={"Log out"}
        icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
        onClick={() => signOut()}
      />
    </>
  );
};

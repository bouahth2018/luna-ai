import { FC } from "react";

interface Props {
  text: string;
  icon: JSX.Element;
  onClick: (() => void) | (() => Promise<void>);
}

export const SidebarButton: FC<Props> = ({ text, icon, onClick }: Props) => {
  return (
    <button
      type="button"
      className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-[#222] transition-colors duration-200 text-white cursor-pointer text-sm"
      onClick={onClick}
    >
      {icon}
      {text}
    </button>
  );
};

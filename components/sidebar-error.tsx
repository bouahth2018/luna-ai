interface Props {
  handleRefresh: () => void;
}

export function SidebarError({ handleRefresh }: Props) {
  return (
    <div className="flex flex-col gap-2 pb-2 text-[#999] text-sm h-full justify-center items-center">
      <div className="p-3 text-center italic text-[#999]">
        Unable to load history
        <div className="mt-1">
          <button
            type="button"
            className="relative m-auto mt-2 rounded-md px-3 py-2 ring-1 ring-inset ring-white/20 hover:bg-[#222]"
            onClick={handleRefresh}
          >
            <div className="flex w-full items-center justify-center gap-2">
              Retry
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

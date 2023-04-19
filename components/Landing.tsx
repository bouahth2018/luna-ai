import { memo, useState } from "react";
import Modal from "./Modal";

export function Landing() {
  const [open, setOpen] = useState<Boolean>(false);

  function handleOpenModal() {
    setOpen(true);
  }

  return (
    <div className="flex flex-col items-center">
      <Modal open={open} setOpen={setOpen} />
      <div className="w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col mt-20 px-6 md:mt-40">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Luna AI
            </span>
            . Powered by ChatGPT
          </h1>
          <p className="mt-6 text-md sm:text-base text-[#eaeaea]">
            A friendly and knowledgeable AI designed to assist and interact with
            humans.
          </p>
        </div>
        <div className="mt-8 flex justify-center text-center">
          <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-[#eaeaea]">
            We rely on your support to keep this service running.{" "}
            <div className="mt-4">
              <button
                type="button"
                className="font-bold text-lg text-cyan-400 cursor-pointer rounded-full py-2 px-6 ring-1 ring-white/20 hover:ring-white/40 hover:bg-[#222]"
                onClick={handleOpenModal}
              >
                <span className="absolute inset-0" aria-hidden="true" />
                Donate <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Landing);

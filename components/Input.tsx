import { Button } from "./Button";

export function InputMessage({
  input,
  setInput,
  setLanding,
  sendMessage,
  isGenerating,
}: any) {
  return (
    <div>
      <div className="mx-auto justify-center px-4 flex sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <input
          type="text"
          aria-label="chat input"
          required
          className="flex-auto appearance-none rounded-md bg-[#222] px-3 py-2 focus:outline-none focus:ring-0 caret-white text-white sm:text-sm"
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage(input);
              setInput("");
              setLanding(false);
            }
          }}
          disabled={isGenerating}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <Button
          type="submit"
          className="ml-2 flex-none"
          onClick={() => {
            sendMessage(input);
            setInput("");
            setLanding(false);
          }}
          disabled={isGenerating}
        >
          Say
        </Button>
      </div>
      <div className="mx-auto justify-center flex sm:max-w-xl md:max-w-2xl lg:max-w-3xl pb-6">
        <p className="text-xs font-light text-white/40">
          Luna AI uses OpenAI&apos;s GPT3.5-turbo language model.
        </p>
      </div>
    </div>
  );
}

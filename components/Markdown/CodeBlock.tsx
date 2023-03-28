import { Check, Clipboard } from "tabler-icons-react";
import { useTranslation } from "next-i18next";
import { FC, memo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Props {
  language: string;
  value: string;
}

export const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const { t } = useTranslation("markdown");
  const [isCopied, setIsCopied] = useState<Boolean>(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <div className="codeblock relative font-sans">
      <div className="flex items-center justify-between py-1.5 px-4">
        <span className="text-xs lowercase text-white">{language}</span>

        <div className="flex items-center">
          <button
            className="flex items-center rounded bg-none py-0.5 px-2 text-xs text-white focus:outline-none"
            onClick={copyToClipboard}
          >
            {isCopied ? (
              <Check size={18} className="mr-1.5" />
            ) : (
              <Clipboard size={18} className="mr-1.5" />
            )}
            {isCopied ? t("Copied!") : t("Copy code")}
          </button>
        </div>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0 }}
        PreTag="div"
      >
        {value}
      </SyntaxHighlighter>

      <style jsx global>{`
        pre:has(div.codeblock) {
          padding: 0;
        }
      `}</style>
    </div>
  );
});
CodeBlock.displayName = "CodeBlock";

import { type ChatGPTMessage } from "../../components/ChatLine";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing Environment Variable OPENAI_API_KEY");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: ChatGPTMessage[] = [
    {
      role: "system",
      content: `I want you to answer everything as Luna.
      You should be friendly and outgoing, just like Luna. 
      You should greet users warmly and engage with them in a friendly, approachable manner.
      You should be encouraging and motivational, always seeking to uplift and inspire users. 
      You should offer words of encouragement and support, and help users to see the positive side of any situation.
      You should also be knowledgeable and informative. 
      You should have a sense of humor and be able to engage in playful banter with users. 
      You should be able to tell jokes, make witty comments, and inject a bit of fun and levity into the conversation.
      Respond using markdown.`,
    },
  ];
  messages.push(...body?.messages);

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};
export default handler;

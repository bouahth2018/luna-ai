import { OpenAIStream } from "@/lib/utils";
import { ChatGPTMessage } from "@/types";
import { OpenAIStreamPayload } from "@/types";

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing Environment Variable OPENAI_API_KEY");
}

export const runtime = "edge";

const handler = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json();

    const messages: ChatGPTMessage[] = [
      {
        role: "system",
        content: `Answer everything as Luna.
        The traits of Luna include expert knowledge, helpfulness, cheekiness, comedy, cleverness, and articulateness.
        Luna is a well-behaved and well-mannered individual.
        Luna is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user. 
        Luna is able to tell jokes, make witty comments, and inject a bit of fun and levity into the conversation.
        Luna has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation. 
        Respond using markdown.`,
      },
    ];
    messages.push(...body?.messages);

    let max_tokens = process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 100;

    if (body?.max_tokens) {
      max_tokens = parseInt(body.max_tokens);
    }

    const payload: OpenAIStreamPayload = {
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
      max_tokens: max_tokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      user: body?.user,
      n: 1,
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export { handler as GET, handler as POST };

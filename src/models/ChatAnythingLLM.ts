import { BaseLanguageModel } from "langchain/base_language";
import { AIMessage, HumanMessage } from "langchain/schema";
import { ChatResult, ModelProvider } from "./types";

export class ChatAnythingLLM extends BaseLanguageModel implements ModelProvider {
  private apiUrl: string;
  private apiKey: string;
  private workspaceSlug: string;

  constructor(apiUrl: string, apiKey: string, workspaceSlug: string) {
    super({});
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.workspaceSlug = workspaceSlug;
  }

  _llmType(): string {
    return "anythingllm";
  }

  async generatePrompt(
    messages: (AIMessage | HumanMessage)[],
    options: { sessionId?: string } = {}
  ): Promise<ChatResult> {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !(lastMessage instanceof HumanMessage)) {
      throw new Error("No human message found");
    }

    const endpoint = `${this.apiUrl}/api/v1/workspace/${this.workspaceSlug}/chat`;
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: lastMessage.content,
          mode: "chat",
          sessionId: options.sessionId || "default-session",
          attachments: []
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`AnythingLLM API error: ${error}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`AnythingLLM error: ${data.error}`);
      }

      return {
        text: data.textResponse,
        sources: data.sources || [],
      };
    } catch (error) {
      console.error("AnythingLLM chat error:", error);
      throw error;
    }
  }

  async *_call(messages: (AIMessage | HumanMessage)[], options: any): AsyncGenerator<ChatResult> {
    const response = await this.generatePrompt(messages, options);
    yield response;
  }
}

import { ChatOllama } from "./ChatOllama";
import { ChatChromeAi } from "./ChatChromeAi";
import { ChatAnythingLLM } from "./ChatAnythingLLM";
import { ModelProvider } from "./types";
import { getAnythingLLMSettings } from "../db/anythingllm";

export async function getModelProvider(): Promise<ModelProvider> {
  // Check for AnythingLLM settings first
  const anythingLLMSettings = await getAnythingLLMSettings();
  if (anythingLLMSettings?.apiUrl && anythingLLMSettings?.apiKey && anythingLLMSettings?.workspaceSlug) {
    return new ChatAnythingLLM(
      anythingLLMSettings.apiUrl,
      anythingLLMSettings.apiKey,
      anythingLLMSettings.workspaceSlug
    );
  }

  // Fallback to existing providers
  try {
    return new ChatOllama();
  } catch {
    return new ChatChromeAi();
  }
}

export * from "./types";

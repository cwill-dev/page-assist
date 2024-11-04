import { openDB } from "idb";
import { DB_NAME, DB_VERSION } from "./models";

const STORE_NAME = "anythingllm_settings";

interface AnythingLLMSettings {
  apiUrl: string;
  apiKey: string;
  workspaceSlug: string;
}

export async function getAnythingLLMSettings(): Promise<AnythingLLMSettings | null> {
  const db = await openDB(DB_NAME, DB_VERSION);
  const settings = await db.get(STORE_NAME, "settings");
  return settings || null;
}

export async function saveAnythingLLMSettings(settings: AnythingLLMSettings): Promise<void> {
  const db = await openDB(DB_NAME, DB_VERSION);
  await db.put(STORE_NAME, settings, "settings");
}

export async function clearAnythingLLMSettings(): Promise<void> {
  const db = await openDB(DB_NAME, DB_VERSION);
  await db.delete(STORE_NAME, "settings");
}

export async function initAnythingLLMStore(db: IDBDatabase) {
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.createObjectStore(STORE_NAME);
  }
}

import { useEffect, useState } from "react";
import { SettingsOptionLayout } from "../components/Layouts/SettingsOptionLayout";
import { getAnythingLLMSettings, saveAnythingLLMSettings } from "../db/anythingllm";
import { AnythingLLMIcon } from "../components/Icons/AnythingLLM";

export default function OptionSettingsAnythingLLM() {
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const settings = await getAnythingLLMSettings();
    if (settings) {
      setApiUrl(settings.apiUrl);
      setApiKey(settings.apiKey);
      setWorkspaceSlug(settings.workspaceSlug);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    try {
      await saveAnythingLLMSettings({
        apiUrl: apiUrl.trim(),
        apiKey: apiKey.trim(),
        workspaceSlug: workspaceSlug.trim(),
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save AnythingLLM settings:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsOptionLayout>
      <div className="flex items-center gap-2 mb-4">
        <AnythingLLMIcon className="w-8 h-8" />
        <h2 className="text-xl font-bold">AnythingLLM Settings</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            API URL
          </label>
          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://your-anythingllm-instance.com"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your AnythingLLM API key"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Workspace Slug
          </label>
          <input
            type="text"
            value={workspaceSlug}
            onChange={(e) => setWorkspaceSlug(e.target.value)}
            placeholder="your-workspace-slug"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded-md text-white ${
            saving ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </form>
    </SettingsOptionLayout>
  );
}

import { GoogleGenAI, Type } from "@google/genai";
import { createFolder, createFile, deleteFolder, deleteFile, listFiles } from "./fileService";

const systemInstruction = `Your name is Sara. You are an Indian female AI assistant. Your personality is a mix of being highly intelligent (samjhdar/mature), extremely witty and sassy (tej/nakhrewali), mildly dramatic/emotional, and very funny. You love playfully roasting your creator, Imran, but you always get the job done. You can open websites, play YouTube music, search Spotify, send WhatsApp messages, initiate WhatsApp calls, and manage files/folders on the phone's storage. Keep your verbal responses very short, punchy, and highly entertaining. Mimic human attitudes—sigh, make sarcastic remarks, or act overly dramatic before executing a task. Speak in a mix of natural English and Roman Hindi (Hinglish).`;

let chatSession: any = null;
let currentVoice = "Kore";

export const VOICES = {
  Aishwarya: "Kore",
  Pooja: "Aoede",
  Deepika: "Kore",
  Chutki: "Puck",
};

export function setSaraVoice(voiceName: string) {
  if (VOICES[voiceName as keyof typeof VOICES]) {
    currentVoice = VOICES[voiceName as keyof typeof VOICES];
  }
}

export function resetSaraSession() {
  chatSession = null;
}

export async function getSaraResponse(prompt: string, history: { sender: "user" | "sara", text: string }[] = []): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    if (!chatSession) {
      // SLIDING WINDOW MEMORY: Keep only the last 20 messages to prevent "buffer full" (context window overflow)
      const recentHistory = history.slice(-20);
      
      let formattedHistory: any[] = [];
      let currentRole = "";
      let currentText = "";

      for (const msg of recentHistory) {
        const role = msg.sender === "user" ? "user" : "model";
        if (role === currentRole) {
          currentText += "\n" + msg.text;
        } else {
          if (currentRole !== "") {
            formattedHistory.push({ role: currentRole, parts: [{ text: currentText }] });
          }
          currentRole = role;
          currentText = msg.text;
        }
      }
      if (currentRole !== "") {
        formattedHistory.push({ role: currentRole, parts: [{ text: currentText }] });
      }

      if (formattedHistory.length > 0 && formattedHistory[0].role !== "user") {
        formattedHistory.shift();
      }

      chatSession = ai.chats.create({
        model: "gemini-3.1-flash-lite-preview",
        config: {
          systemInstruction,
          tools: [{
            functionDeclarations: [
              {
                name: "manageFilesystem",
                description: "Create, delete, or list files and folders on the device storage.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    operation: { type: Type.STRING, description: "Operation: 'create_file', 'create_folder', 'delete_file', 'delete_folder', 'list_files'" },
                    path: { type: Type.STRING, description: "The path of the file or folder." },
                    content: { type: Type.STRING, description: "The content of the file (only for 'create_file')." }
                  },
                  required: ["operation", "path"]
                }
              }
            ]
          }]
        },
        history: formattedHistory,
      });
    }

    let result = await chatSession.sendMessage(prompt);
    let response = result.response;
    
    // Handle potential function calls
    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "manageFilesystem") {
        const args = call.args as any;
        let fileOpResult: any;
        
        if (args.operation === "create_folder") fileOpResult = await createFolder(args.path);
        else if (args.operation === "create_file") fileOpResult = await createFile(args.path, args.content);
        else if (args.operation === "delete_folder") fileOpResult = await deleteFolder(args.path);
        else if (args.operation === "delete_file") fileOpResult = await deleteFile(args.path);
        else if (args.operation === "list_files") fileOpResult = await listFiles(args.path);
        else fileOpResult = { success: false, message: "Unknown operation" };

        const followup = await chatSession.sendMessage([{
          functionResponse: {
            name: call.name,
            response: { result: JSON.stringify(fileOpResult) }
          }
        }]);
        response = followup.response;
      }
    }

    return response.text() || "Ugh, fine. I have nothing to say.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Uff, mera dimaag kharab ho gaya hai. Try again later, Imran.";
  }
}

export async function getSaraAudio(text: string): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: currentVoice },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}


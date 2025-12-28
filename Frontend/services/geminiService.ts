
import { GoogleGenAI } from "@google/genai";

export async function askSupport(question: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: "Você é um assistente técnico especialista em Segurança e Saúde no Trabalho (SST) para o sistema SST Pro. Responda dúvidas técnicas de forma clara, objetiva e profissional em português brasileiro. Fale sobre normas regulamentadoras (NRs), EPIs e procedimentos de visita técnica.",
      },
    });
    return response.text || "Desculpe, não consegui processar sua dúvida no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com o assistente inteligente. Tente novamente mais tarde.";
  }
}

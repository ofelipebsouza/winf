export async function generateGeminiResponse(
  prompt: string | any[], 
  systemPrompt: string, 
  tools?: any[],
  responseMimeType?: string,
  responseSchema?: any,
  model?: string
): Promise<{ text: string, toolCalls?: any[], groundingMetadata?: any, inlineData?: any }> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: typeof prompt === 'string' ? prompt : undefined,
        contents: typeof prompt === 'object' ? prompt : undefined,
        systemPrompt, 
        tools, 
        responseMimeType, 
        responseSchema, 
        model 
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Server error');
    }

    const data = await response.json();
    
    return { 
      text: data.text, 
      toolCalls: data.functionCalls?.map((call: any) => ({
        id: Math.random().toString(36).substring(7),
        name: call.name,
        input: call.args
      })),
      groundingMetadata: data.groundingMetadata,
      inlineData: data.inlineData
    };
  } catch (error) {
    console.error("Gemini API Proxy Error:", error);
    return { text: 'ERRO DE CONEXÃO NEURAL. FALHA NA INTEGRAÇÃO COM GEMINI PROXY.' };
  }
}


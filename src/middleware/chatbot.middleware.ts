import { GoogleGenAI } from "@google/genai";

export async function chat(ai: GoogleGenAI,prompt: string,combinedTicks: any) {
    try {
        // console.log(prompt);
        // console.log(combinedTicks);
        const json_string = JSON.stringify(combinedTicks)
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    "parts": [
                        {
                            "text": `Analyse the following data and answer the prompt ${prompt} with data "${json_string}"`
                        }
                    ]
                }
            ]
          });
          console.log(response.text);
          return {
            status: 200,
            response: response.text
          };
    } catch (error) {
        return {
            status: 404,
            response: error
        };
    }
}


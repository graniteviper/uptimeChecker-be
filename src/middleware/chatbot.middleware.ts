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
                            "text": `Analyze the following ${json_string} and answer ${prompt} in a direct, concise, and polished manner. Avoid restating the data or giving unnecessary context. Respond as if replying to the user's question naturally.`
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


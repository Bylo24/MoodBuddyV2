import axios from 'axios';

const API_KEY = 'AIzaSyDUUxDUGBZjshZvXL20WAcK3Xy3HvJBCw8';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface Quote {
  quote: string;
  author: string;
}

export async function fetchInspirationalQuote(): Promise<Quote> {
  try {
    const response = await axios.post<GeminiResponse>(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Generate a short inspirational quote about mental health, wellness, or self-care. Return it in JSON format with 'quote' and 'author' fields. Keep the quote under 120 characters. Make it uplifting and motivational."
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    // Extract the text from the response
    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    // Parse the JSON from the text
    // The response might include markdown formatting or extra text, so we need to extract just the JSON part
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const parsedQuote = JSON.parse(jsonStr) as Quote;
      return parsedQuote;
    }
    
    // Fallback in case we can't parse the JSON
    return {
      quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      author: "Unknown"
    };
  } catch (error) {
    console.error('Error fetching quote from Gemini API:', error);
    
    // Return a default quote if the API call fails
    return {
      quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      author: "Unknown"
    };
  }
}
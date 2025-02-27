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
    // Simplified prompt that explicitly asks for JSON format
    const prompt = `Generate a short inspirational quote about mental health, wellness, or self-care. 
    
    The response should be in this exact JSON format:
    {"quote": "The quote text here", "author": "Author name here"}
    
    Keep the quote under 100 characters. Make it uplifting and motivational. Do not include any markdown formatting or additional text outside the JSON.`;
    
    console.log('Sending prompt to Gemini API:', prompt);
    
    const response = await axios.post<GeminiResponse>(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
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

    // Log the raw response for debugging
    console.log('Raw Gemini API response:', JSON.stringify(response.data));

    // Extract the text from the response
    const generatedText = response.data.candidates[0]?.content?.parts[0]?.text;
    
    if (!generatedText) {
      console.error('No text in Gemini response');
      return getDefaultQuote();
    }
    
    console.log('Generated text from Gemini:', generatedText);
    
    // Try to extract JSON from the response
    // First, try to parse the entire response as JSON
    try {
      const parsedQuote = JSON.parse(generatedText.trim()) as Quote;
      if (parsedQuote.quote && parsedQuote.author) {
        return parsedQuote;
      }
    } catch (parseError) {
      console.log('Failed to parse entire response as JSON, trying to extract JSON portion');
    }
    
    // If that fails, try to extract just the JSON part using regex
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[0];
        console.log('Extracted JSON string:', jsonStr);
        const parsedQuote = JSON.parse(jsonStr) as Quote;
        
        if (parsedQuote.quote && parsedQuote.author) {
          return parsedQuote;
        }
      } catch (jsonError) {
        console.error('Failed to parse extracted JSON:', jsonError);
      }
    }
    
    // If all parsing attempts fail, try to extract quote and author manually
    const quoteMatch = generatedText.match(/"quote":\s*"([^"]*)"/);
    const authorMatch = generatedText.match(/"author":\s*"([^"]*)"/);
    
    if (quoteMatch && authorMatch) {
      return {
        quote: quoteMatch[1],
        author: authorMatch[1]
      };
    }
    
    console.error('Could not parse quote from Gemini response');
    return getDefaultQuote();
  } catch (error) {
    console.error('Error fetching quote from Gemini API:', error);
    return getDefaultQuote();
  }
}

function getDefaultQuote(): Quote {
  // Array of default quotes to use as fallbacks
  const defaultQuotes = [
    {
      quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      author: "Unknown"
    },
    {
      quote: "Self-care is not selfish. You cannot serve from an empty vessel.",
      author: "Eleanor Brown"
    },
    {
      quote: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, or frustrated.",
      author: "Lori Deschene"
    },
    {
      quote: "Be gentle with yourself, you're doing the best you can.",
      author: "Unknown"
    }
  ];
  
  // Return a random quote from the defaults
  return defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
}
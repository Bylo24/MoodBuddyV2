import axios from 'axios';

const API_KEY = 'AIzaSyDUUxDUGBZjshZvXL20WAcK3Xy3HvJBCw8';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface QuoteResponse {
  quote: string;
  author: string;
}

export async function fetchMentalHealthQuote(): Promise<QuoteResponse> {
  try {
    const prompt = "give me a quote about mental health within 2 sentences with the author aswell. put the quote in normal text and the author in bold. I dont want you to say anything expect the quote, and make sure its a real quote e.g Your mental health is a priority. Your happiness is essential. Your self-care is a necessity Unknown";
    
    const response = await axios.post(
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
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 100,
        }
      }
    );

    // Extract the text from the response
    const responseText = response.data.candidates[0].content.parts[0].text;
    
    // Parse the quote and author from the response
    return parseQuoteAndAuthor(responseText);
  } catch (error) {
    console.error('Error fetching quote from Gemini API:', error);
    // Return a fallback quote if the API call fails
    return {
      quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      author: "Unknown"
    };
  }
}

function parseQuoteAndAuthor(text: string): QuoteResponse {
  // Try different parsing strategies
  
  // Strategy 1: Look for bold markdown format
  const boldPattern = /(.*?)(?:\*\*|__)(.*?)(?:\*\*|__)/s;
  const boldMatch = text.match(boldPattern);
  
  if (boldMatch) {
    return {
      quote: boldMatch[1].trim(),
      author: boldMatch[2].trim()
    };
  }
  
  // Strategy 2: Look for a pattern with a dash or em-dash followed by a name
  const dashPattern = /(.*?)(?:—|–|-)\s*(.*)/s;
  const dashMatch = text.match(dashPattern);
  
  if (dashMatch) {
    return {
      quote: dashMatch[1].trim(),
      author: dashMatch[2].trim()
    };
  }
  
  // Strategy 3: Split by newline and assume last line is author
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length >= 2) {
    const lastLine = lines[lines.length - 1];
    const quoteLines = lines.slice(0, lines.length - 1);
    
    // Check if the last line looks like an author (short, no punctuation at end)
    if (lastLine.length < 50 && !lastLine.match(/[.!?]$/)) {
      return {
        quote: quoteLines.join(' ').trim(),
        author: lastLine.replace(/^[-—–]/, '').trim()
      };
    }
  }
  
  // Strategy 4: Look for common author attribution patterns
  const attributionPatterns = [
    /[""](.+?)[""](?:\s*[-—–]\s*|\s+by\s+|\s+from\s+)(.+)/i,
    /(.+?)(?:\s*[-—–]\s*|\s+by\s+|\s+from\s+)(.+)/i
  ];
  
  for (const pattern of attributionPatterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        quote: match[1].trim().replace(/^[""]|[""]$/g, ''),
        author: match[2].trim()
      };
    }
  }
  
  // Fallback: If we can't parse it properly, return the whole text as quote
  return {
    quote: text.trim(),
    author: "Unknown"
  };
}
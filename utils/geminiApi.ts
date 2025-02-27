import axios from 'axios';

const API_KEY = 'AIzaSyDUUxDUGBZjshZvXL20WAcK3Xy3HvJBCw8';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface QuoteResponse {
  quote: string;
  author: string;
}

export async function fetchMentalHealthQuote(): Promise<QuoteResponse> {
  try {
    console.log('Fetching quote from Gemini API...');
    
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
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Gemini API response received');
    
    // Log the structure of the response to debug
    console.log('Response structure:', JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
    
    // Extract the text from the response
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0] && 
        response.data.candidates[0].content.parts[0].text) {
      
      const responseText = response.data.candidates[0].content.parts[0].text;
      console.log('Raw quote text:', responseText);
      
      // Parse the quote and author from the response
      const result = parseQuoteAndAuthor(responseText);
      console.log('Parsed quote:', result);
      return result;
    } else {
      console.error('Unexpected API response structure:', response.data);
      throw new Error('Invalid API response structure');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching quote:', error.message);
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Error fetching quote from Gemini API:', error);
    }
    
    // Return a fallback quote if the API call fails
    return {
      quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      author: "Unknown"
    };
  }
}

function parseQuoteAndAuthor(text: string): QuoteResponse {
  console.log('Parsing quote text:', text);
  
  // Try different parsing strategies
  
  // Strategy 1: Look for bold markdown format
  const boldPattern = /(.*?)(?:\*\*|__)(.*?)(?:\*\*|__)/s;
  const boldMatch = text.match(boldPattern);
  
  if (boldMatch) {
    console.log('Matched bold pattern');
    return {
      quote: boldMatch[1].trim(),
      author: boldMatch[2].trim()
    };
  }
  
  // Strategy 2: Look for a pattern with a dash or em-dash followed by a name
  const dashPattern = /(.*?)(?:—|–|-)\s*(.*)/s;
  const dashMatch = text.match(dashPattern);
  
  if (dashMatch) {
    console.log('Matched dash pattern');
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
      console.log('Matched newline pattern');
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
      console.log('Matched attribution pattern');
      return {
        quote: match[1].trim().replace(/^[""]|[""]$/g, ''),
        author: match[2].trim()
      };
    }
  }
  
  // Fallback: If we can't parse it properly, return the whole text as quote
  console.log('No pattern matched, using fallback');
  return {
    quote: text.trim(),
    author: "Unknown"
  };
}
export function extractQuoteAndAuthor(text: string) {
  console.log('Raw text to extract from:', text);
  
  // Try to find patterns like "Quote" - Author or similar
  const patterns = [
    // Bold markdown: Quote **Author**
    /^(.*?)\s*\*\*(.*?)\*\*\s*$/,
    // Quote - Author
    /^(.*?)\s*[-–—]\s*(.*?)$/,
    // "Quote" - Author
    /^["'](.+?)["']\s*[-–—]\s*(.*?)$/,
    // Quote by Author
    /^(.*?)\s+by\s+(.*?)$/i,
    // Quote from Author
    /^(.*?)\s+from\s+(.*?)$/i,
    // Quote. Author
    /^(.*?)[.!?]\s+(.*?)$/,
    // Newline separation
    /^(.*)\n+(.*)$/s
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const quote = match[1].trim().replace(/^["']|["']$/g, '');
      const author = match[2].trim();
      console.log('Extracted quote:', quote);
      console.log('Extracted author:', author);
      return { quote, author };
    }
  }
  
  // If no pattern matches, check if there's a dash anywhere
  const dashIndex = text.lastIndexOf('-');
  if (dashIndex > 0) {
    const quote = text.substring(0, dashIndex).trim();
    const author = text.substring(dashIndex + 1).trim();
    console.log('Extracted using dash index:', { quote, author });
    return { quote, author };
  }
  
  // Last resort: return the whole text as quote
  console.log('No pattern matched, returning whole text as quote');
  return { 
    quote: text.trim(),
    author: 'Unknown'
  };
}
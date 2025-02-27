// ... (keep all the imports and other code the same)

export default function HomeScreen() {
  // ... (keep all the state variables and other code the same)
  
  // State for error tracking
  const [quoteError, setQuoteError] = useState<string | null>(null);
  
  // Function to fetch a new quote
  const getNewQuote = useCallback(async () => {
    setIsLoadingQuote(true);
    setQuoteError(null);
    
    try {
      console.log('Fetching new quote...');
      const newQuote = await fetchInspirationalQuote();
      console.log('Received quote:', newQuote);
      
      if (newQuote.quote && newQuote.author) {
        setDailyQuote(newQuote);
      } else {
        setQuoteError('Received incomplete quote data');
        console.error('Incomplete quote data:', newQuote);
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error);
      setQuoteError('Failed to fetch a new quote');
    } finally {
      setIsLoadingQuote(false);
    }
  }, []);
  
  // ... (keep the rest of the code the same)
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ... (keep the StatusBar and ScrollView the same) */}
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.card}
          />
        }
      >
        {/* ... (keep the header the same) */}
        
        <View style={styles.quoteContainer}>
          <DailyAffirmation 
            quote={quoteError ? `Error: ${quoteError}` : dailyQuote.quote} 
            author={quoteError ? 'Please try again' : dailyQuote.author} 
            isLoading={isLoadingQuote}
          />
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={getNewQuote}
            disabled={isLoadingQuote}
          >
            <Text style={styles.refreshButtonText}>New Quote</Text>
          </TouchableOpacity>
        </View>
        
        {/* ... (keep the rest of the JSX the same) */}
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (keep the rest of the code the same)
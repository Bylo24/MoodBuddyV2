// Add this at the top of your imports
import { supabase } from '../utils/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, TouchableOpacity, Text } from 'react-native';

// Add this function inside your HomeScreen component
const emergencySignOut = async () => {
  try {
    // Clear all AsyncStorage
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared");
    
    // Force sign out from Supabase
    await supabase.auth.signOut();
    console.log("Signed out from Supabase");
    
    // Force app reload by calling onLogout
    onLogout();
  } catch (error) {
    console.error("Emergency sign out error:", error);
  }
};

// Add this button somewhere visible in your HomeScreen's return JSX
// For example, right after the Header component
<TouchableOpacity
  style={{
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  }}
  onPress={emergencySignOut}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>EMERGENCY SIGN OUT</Text>
</TouchableOpacity>
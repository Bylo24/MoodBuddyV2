import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  Keyboard
} from 'react-native';
import { theme } from '../theme/theme';
import { signInWithEmail, signUpWithEmail, resetPassword } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Clear error message when form changes
  useEffect(() => {
    setErrorMessage(null);
  }, [email, password, isSignUp, resetMode]);
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password: string): boolean => {
    // At least 6 characters
    return password.length >= 6;
  };
  
  const handleAuth = async () => {
    Keyboard.dismiss();
    setErrorMessage(null);
    
    // Validate inputs
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }
    
    if (isSignUp && !validatePassword(password)) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        console.log('Starting sign up process...');
        const result = await signUpWithEmail(email, password);
        console.log('Sign up result:', result);
        
        // If we have a session, login was successful
        if (result.session) {
          console.log('Sign up successful with session, proceeding to app');
          onLogin();
        } else {
          // If no session but user was created, try to sign in
          if (result.user) {
            console.log('User created, attempting to sign in');
            try {
              await signInWithEmail(email, password);
              console.log('Sign in after signup successful');
              onLogin();
            } catch (signInError: any) {
              console.error('Error signing in after signup:', signInError);
              setErrorMessage('Account created but unable to sign in automatically. Please try signing in.');
              setIsSignUp(false);
            }
          } else {
            setErrorMessage('Failed to create account. Please try again.');
          }
        }
      } else {
        console.log('Starting sign in process...');
        await signInWithEmail(email, password);
        console.log('Sign in successful, proceeding to app');
        onLogin();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setErrorMessage(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async () => {
    Keyboard.dismiss();
    setErrorMessage(null);
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for instructions to reset your password.',
        [{ text: 'OK', onPress: () => setResetMode(false) }]
      );
    } catch (error: any) {
      console.error('Reset password error:', error);
      setErrorMessage(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage(null);
    setPassword('');
  };
  
  const toggleResetMode = () => {
    setResetMode(!resetMode);
    setErrorMessage(null);
    setPassword('');
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Mood Buddy</Text>
          <Text style={styles.tagline}>Track your mood, improve your wellbeing</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {resetMode 
              ? 'Reset Password' 
              : isSignUp 
                ? 'Create Account' 
                : 'Welcome Back'}
          </Text>
          
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.subtext}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />
          </View>
          
          {!resetMode && (
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.subtext} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.subtext}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete={isSignUp ? "new-password" : "password"}
                textContentType={isSignUp ? "newPassword" : "password"}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={theme.colors.subtext} 
                />
              </TouchableOpacity>
            </View>
          )}
          
          {isSignUp && (
            <Text style={styles.passwordHint}>
              Password must be at least 6 characters long
            </Text>
          )}
          
          {resetMode ? (
            <TouchableOpacity 
              style={styles.button}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.button}
              onPress={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
              )}
            </TouchableOpacity>
          )}
          
          {!resetMode && (
            <TouchableOpacity 
              style={styles.switchButton}
              onPress={switchMode}
              disabled={isLoading}
            >
              <Text style={styles.switchButtonText}>
                {isSignUp ? 'Already have an account? Log In' : 'New user? Create Account'}
              </Text>
            </TouchableOpacity>
          )}
          
          {!isSignUp && !resetMode && (
            <TouchableOpacity 
              style={styles.forgotButton}
              onPress={toggleResetMode}
              disabled={isLoading}
            >
              <Text style={styles.forgotButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
          
          {resetMode && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={toggleResetMode}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.subtext,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: theme.colors.error + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    ...theme.shadows.small,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.text,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 8,
  },
  passwordHint: {
    fontSize: 12,
    color: theme.colors.subtext,
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 4,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...theme.shadows.medium,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  switchButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  forgotButtonText: {
    color: theme.colors.subtext,
    fontSize: 14,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
  },
});
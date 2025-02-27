import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Primary Button" 
          onPress={() => console.log('Primary button pressed')}
          style={styles.button}
        />
        <Button 
          title="Secondary Button" 
          variant="secondary"
          onPress={() => console.log('Secondary button pressed')}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 16,
  },
});
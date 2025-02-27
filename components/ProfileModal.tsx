import React from 'react';
import { Modal, StyleSheet, View, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import { theme } from '../theme/theme';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const { height } = Dimensions.get('window');

export default function ProfileModal({ visible, onClose, onLogout }: ProfileModalProps) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  
  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);
  
  // Direct logout handler
  const handleDirectLogout = () => {
    onClose();
    setTimeout(() => {
      onLogout();
    }, 300);
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Add a direct logout button at the top */}
        <TouchableOpacity 
          style={styles.directLogoutButton}
          onPress={handleDirectLogout}
        >
          <Text style={styles.directLogoutText}>Direct Sign Out</Text>
        </TouchableOpacity>
        
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <ProfileScreen 
            onClose={onClose} 
            onLogout={onLogout} 
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '95%',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  directLogoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 1000,
  },
  directLogoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
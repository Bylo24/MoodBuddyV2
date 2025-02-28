import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileModal({ visible, onClose, onLogout }: ProfileModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ProfileScreen onClose={onClose} onLogout={onLogout} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
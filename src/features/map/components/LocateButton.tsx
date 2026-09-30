import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../../shared/theme';

interface Props {
  onPress: () => void;
  isLoading: boolean;
}

export const LocateButton: React.FC<Props> = ({ onPress, isLoading }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} disabled={isLoading} activeOpacity={0.8}>
    {isLoading ? (
      <ActivityIndicator size="small" color={colors.primary} />
    ) : (
      <Ionicons name="locate" size={22} color={colors.primary} />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 60,
    left: 25,
    width: 46,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
});
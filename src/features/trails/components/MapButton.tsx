import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { typography, spacing, colors, radius } from '@/shared/theme';
import { useMapStore } from '@/features/map/store/mapStore';


interface Props {
  handlePress: () => void
}

export const MapButton: React.FC<Props> = ({ handlePress }) => {
  const { t } = useTranslation();




  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Ionicons name="navigate" size={20} color="#FFFFFF" />
      <Text style={typography.buttonText}>{t('trailDetail.openInMaps')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
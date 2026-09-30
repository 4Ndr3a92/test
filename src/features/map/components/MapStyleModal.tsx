import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/shared/theme';
import { MAP_STYLES, MapStyleKey } from '../store/mapStore';

interface MapStyleModalProps {
  visible: boolean;
  onClose: () => void;
  selected: MapStyleKey;
  onSelect: (style: MapStyleKey) => void;
}

export const MapStyleModal: React.FC<MapStyleModalProps> = ({
  visible,
  onClose,
  selected,
  onSelect,
}) => {
  const handleSelect = (key: MapStyleKey) => {
    onSelect(key);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <SafeAreaView style={styles.picker}>
          <Text style={styles.pickerTitle}>Tipo di mappa</Text>
          <View style={styles.optionsRow}>
            {MAP_STYLES.map((style) => {
              const isActive = style.key === selected;
              return (
                <TouchableOpacity
                  key={style.key}
                  style={styles.option}
                  onPress={() => handleSelect(style.key)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.optionIcon, isActive && styles.optionIconActive]}>
                    <Ionicons
                      name={style.icon as any}
                      size={22}
                      color={isActive ? '#FFFFFF' : colors.textSecondary}
                    />
                  </View>
                  <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                    {style.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionIconActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionLabelActive: {
    color: colors.primary,
  },
});
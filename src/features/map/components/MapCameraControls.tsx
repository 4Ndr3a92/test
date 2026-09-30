import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/theme';
import { MAP_STYLES, MapStyleKey } from '../store/mapStore';
import { MapStyleModal } from './MapStyleModal';

interface MapCameraControlsProps {
  zoomIn: () => void;
  zoomOut: () => void;
  togglePerspective: (currentIs3D: boolean, setIs3D: (val: boolean) => void) => void;
  onPress: () => void;
  isLoading: boolean;
  selected: MapStyleKey;
  onSelect: (style: MapStyleKey) => void;
}

export const MapCameraControls: React.FC<MapCameraControlsProps> = ({
  zoomIn,
  zoomOut,
  togglePerspective,
  onPress,
  isLoading,
  selected,
  onSelect,
}) => {
  const [is3D, setIs3D] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const currentStyle = MAP_STYLES.find((s) => s.key === selected) ?? MAP_STYLES[0];

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={zoomIn}>
          <FontAwesome6 name="plus" size={16} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={zoomOut}>
          <FontAwesome6 name="minus" size={16} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, is3D ? styles.button3DActive : styles.button2D]}
          onPress={() => togglePerspective(is3D, setIs3D)}
        >
          <Text style={[styles.buttonText, is3D && styles.buttonTextActive]}>
            {is3D ? '2D' : '3D'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="locate" size={22} color={colors.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalOpen(true)}
          activeOpacity={0.85}
        >
          <Ionicons
            name={currentStyle.icon as any}
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <MapStyleModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        selected={selected}
        onSelect={onSelect}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 6,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 99,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EBF0F3',
  },
  button2D: { backgroundColor: '#FFFFFF' },
  button3DActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  buttonText: { fontSize: 12, fontWeight: 'bold', color: colors.primary },
  buttonTextActive: { color: '#FFFFFF' },
});
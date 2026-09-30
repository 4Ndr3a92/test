import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MarkerView } from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/shared/theme';

interface Props {
  latitude: number;
  longitude: number;
}

export const UserLocationMarker: React.FC<Props> = ({ latitude, longitude }) => (
  <MarkerView
    id="user-location-marker"
    coordinate={[longitude, latitude]}
    anchor={{ x: 0.5, y: 0.5 }}
  >
    <View style={styles.container}>
      <Ionicons
        name="navigate-circle"
        size={26}
        color={colors.primary}
      />
      <View style={styles.outerRing} />
    </View>
  </MarkerView>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  outerRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: spacing.xxl,
    backgroundColor: 'rgba(45,106,45,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
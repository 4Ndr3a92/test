import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { colors, spacing } from '../../../shared/theme/';

interface Props {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  range: [number, number];
  bounds: { min: number; max: number; step: number; unit: string };
  onChange: (range: [number, number]) => void;
}

export const RangeFilterRow: React.FC<Props> = ({ label, icon, range, bounds, onChange }) => {
  const handleChange = useCallback((values: number[]) => {
    onChange([values[0], values[1]]);
  }, [onChange]);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.labelLeft}>
          <Ionicons name={icon} size={16} color={colors.primary} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.valueText}>
          {range[0]}{bounds.unit} – {range[1]}{bounds.unit}
        </Text>
      </View>

      <View style={styles.sliderWrap}>
        <MultiSlider
          values={[range[0], range[1]]}
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          onValuesChange={handleChange}
          allowOverlap={false}
          snapped
          sliderLength={280}
          selectedStyle={{ backgroundColor: colors.primary }}
          unselectedStyle={{ backgroundColor: colors.border }}
          trackStyle={{ height: 4, borderRadius: 2 }}
          markerStyle={styles.marker}
          pressedMarkerStyle={styles.markerPressed}
        />
      </View>

      <View style={styles.boundsRow}>
        <Text style={styles.boundLabel}>{bounds.min}{bounds.unit}</Text>
        <Text style={styles.boundLabel}>{bounds.max}{bounds.unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.xl },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  labelLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  valueText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  sliderWrap: { alignItems: 'center', marginVertical: spacing.xs },
  marker: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  markerPressed: {
    height: 26,
    width: 26,
    borderRadius: 13,
  },
  boundsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: -spacing.xs,
  },
  boundLabel: { fontSize: 11, color: colors.textMuted },
});
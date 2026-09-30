import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  rating: number;
  size?: number;
  color?: string;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export const StarRating: React.FC<Props> = ({
  rating, size = 16, color = '#F5A623', interactive = false, onChange,
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row}>
      {stars.map((value) => {
        const filled = value <= Math.round(rating);
        const StarComponent = interactive ? TouchableOpacity : View;

        return (
          <StarComponent
            key={value}
            onPress={interactive ? () => onChange?.(value) : undefined}
            hitSlop={interactive ? 8 : undefined}
          >
            <Ionicons
              name={filled ? 'star' : 'star-outline'}
              size={size}
              color={filled ? color : '#D9D9D9'}
            />
          </StarComponent>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
});
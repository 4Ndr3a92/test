import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../shared/theme';
import { useTranslation } from 'react-i18next';

export const ResultsHeader: React.FC<{ count: number }> = ({ count }) => {
    const { t } = useTranslation();
    return(
        <View style={styles.row}>
            <Text style={[typography.sectionTitle, { color: colors.textPrimary }]}>
            {t(count === 1 ? 'explore.resultsCountOne' : 'explore.resultsCount', { count })}:
            </Text>
        </View>
        );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: spacing.lg, marginBottom: spacing.xs, },
});
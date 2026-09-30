import { colors } from "./colors";


export const typography = {
  heroTitle: { fontSize: 32, fontWeight: '800' as const, lineHeight: 38 },
  sectionTitle: { fontSize: 18, fontWeight: '700' as const },
  cardTitle: { fontSize: 15, fontWeight: '700' as const },
  body: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 11, fontWeight: '600' as const },
  appName: { fontSize: 30, fontWeight: '800' as const, color: colors.textPrimary },
  tagline: { fontSize: 15, fontWeight: '500' as const, color: colors.textSecondary },
  tabLabel: { fontSize: 15, fontWeight: '700' as const },
  inputText: { fontSize: 15, color: colors.textPrimary },
  buttonText: { fontSize: 16, fontWeight: '700' as const, color: '#FFFFFF' },
  socialText: { fontSize: 14, fontWeight: '600' as const, color: colors.textPrimary },
  caption: { fontSize: 12, color: colors.textSecondary },
};
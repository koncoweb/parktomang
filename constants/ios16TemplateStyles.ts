import { Platform, StyleSheet } from 'react-native';

/**
 * Palet warna dan token desain yang diambil dari referensi UI iOS 16
 * (template1.png & template2.png). File ini menyediakan gaya siap pakai
 * yang dapat dipakai lintas komponen tanpa perlu menebak-nebak nilai.
 */

const baseSanSerif = Platform.select({
  ios: 'SF Pro Display',
  web: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  default: 'System',
});

export const ios16Palette = {
  backgroundPrimary: '#050505',
  backgroundMuted: '#0F0F12',
  backgroundCardDark: '#1C1C1E',
  backgroundCardLight: '#F2F2F7',
  backgroundWidget: '#2C2C2E',
  overlayGlass: 'rgba(29,29,31,0.52)',
  textPrimaryDark: '#FFFFFF',
  textSecondaryDark: 'rgba(235,235,245,0.6)',
  textTertiaryDark: 'rgba(235,235,245,0.4)',
  textPrimaryLight: '#000000',
  textSecondaryLight: '#3A3A3C',
  // Light theme dengan 80% opacity
  textPrimaryLight80: 'rgba(0, 0, 0, 0.8)',
  textSecondaryLight80: 'rgba(0, 0, 0, 0.8)',
  textTertiaryLight: 'rgba(0, 0, 0, 0.6)',
  textQuaternaryLight: 'rgba(0, 0, 0, 0.4)',
  backgroundLight: '#FFFFFF',
  backgroundCardLightNew: '#FFFFFF',
  backgroundMutedLight: '#F8F9FA',
  borderLight: 'rgba(0, 0, 0, 0.1)',
  accentBlue: '#0A84FF',
  accentGreen: '#30D158',
  accentOrange: '#FF9F0A',
  accentPurple: '#BF5AF2',
  accentPink: '#FF2D55',
  accentTeal: '#64D2FF',
  accentYellow: '#FFD60A',
  destructive: '#FF453A',
  strokeDark: 'rgba(255,255,255,0.18)',
  strokeLight: 'rgba(60,60,67,0.36)',
  fillMuted: 'rgba(118,118,128,0.24)',
  fillElevated: 'rgba(72,72,74,0.65)',
  progressTrack: 'rgba(235,235,245,0.18)',
};

export const ios16Spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  hero: 32,
  giant: 44,
};

export const ios16Radii = {
  soft: 12,
  card: 18,
  widget: 24,
  modal: 32,
  chip: 999,
};

export const ios16Lines = {
  hairlineDark: ios16Palette.strokeDark,
  hairlineLight: ios16Palette.strokeLight,
  dividerMuted: 'rgba(255,255,255,0.08)',
};

export const ios16Shadows = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 18,
  },
  toggleThumb: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
};

export const ios16Gradients = {
  lockScreen: ['#0A81FF', '#3F5FFB', '#8A49F7'],
  heroCard: ['#0F0F12', '#111C2B', '#1E1842'],
  widgetSunset: ['#FBD85D', '#F9774C'],
  widgetAurora: ['#64D2FF', '#5E5CE6'],
};

export const ios16Typography = {
  largeTitle: {
    fontFamily: baseSanSerif,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700' as const,
    letterSpacing: 0,
    color: ios16Palette.textPrimaryLight80,
  },
  title1: {
    fontFamily: baseSanSerif,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0,
    color: ios16Palette.textPrimaryLight80,
  },
  title2: {
    fontFamily: baseSanSerif,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0,
    color: ios16Palette.textPrimaryLight80,
  },
  headline: {
    fontFamily: baseSanSerif,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0,
    color: ios16Palette.textPrimaryLight80,
  },
  body: {
    fontFamily: baseSanSerif,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    color: ios16Palette.textPrimaryLight80,
  },
  subheadline: {
    fontFamily: baseSanSerif,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0,
    color: ios16Palette.textPrimaryLight80,
  },
  caption: {
    fontFamily: baseSanSerif,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0,
    color: ios16Palette.textPrimaryLight80,
  },
  monoBadge: {
    fontFamily: Platform.select({
      ios: 'SF Mono',
      web: "'SF Mono', 'JetBrains Mono', monospace",
      default: 'monospace',
    }),
    fontSize: 11,
    letterSpacing: 0.2,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    color: ios16Palette.textPrimaryLight80,
  },
};

export const ios16Layout = {
  statusBarHeight: 56,
  navBarHeight: 44,
  tabBarHeight: 88,
  sectionSpacing: ios16Spacing.xxl,
  horizontalPadding: ios16Spacing.xxl,
  gridGap: ios16Spacing.md,
  widgetMinHeight: 156,
};

export const ios16Components = StyleSheet.create({
  screenDark: {
    flex: 1,
    backgroundColor: ios16Palette.backgroundPrimary,
    paddingHorizontal: ios16Layout.horizontalPadding,
    paddingTop: ios16Layout.statusBarHeight,
    gap: ios16Spacing.xxl,
  },
  screenLight: {
    flex: 1,
    backgroundColor: ios16Palette.backgroundLight,
    paddingHorizontal: ios16Layout.horizontalPadding,
    paddingTop: ios16Layout.statusBarHeight,
    gap: ios16Spacing.xxl,
  },
  largeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  searchInput: {
    backgroundColor: ios16Palette.fillMuted,
    borderRadius: ios16Radii.chip,
    paddingHorizontal: ios16Spacing.lg,
    paddingVertical: ios16Spacing.sm,
    color: ios16Palette.textPrimaryDark,
  },
  glassCard: {
    backgroundColor: ios16Palette.overlayGlass,
    borderRadius: ios16Radii.widget,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ios16Palette.strokeDark,
    padding: ios16Spacing.xl,
    ...ios16Shadows.subtle,
  },
  frostedWidget: {
    backgroundColor: ios16Palette.backgroundCardDark,
    borderRadius: ios16Radii.widget,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ios16Palette.strokeDark,
    padding: ios16Spacing.xl,
    gap: ios16Spacing.md,
    ...ios16Shadows.floating,
  },
  insetCard: {
    backgroundColor: ios16Palette.backgroundWidget,
    borderRadius: ios16Radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ios16Palette.strokeDark,
    paddingHorizontal: ios16Spacing.lg,
    paddingVertical: ios16Spacing.xl,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: ios16Lines.dividerMuted,
    marginVertical: ios16Spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ios16Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ios16Lines.dividerMuted,
    gap: ios16Spacing.sm,
  },
  listItemLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ios16Spacing.md,
  },
  primaryButton: {
    backgroundColor: ios16Palette.accentBlue,
    borderRadius: ios16Radii.chip,
    paddingVertical: ios16Spacing.md,
    alignItems: 'center',
    ...ios16Shadows.floating,
  },
  compactButton: {
    backgroundColor: ios16Palette.accentBlue,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtleButton: {
    backgroundColor: 'transparent',
    borderRadius: ios16Radii.chip,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ios16Palette.strokeDark,
    paddingVertical: ios16Spacing.md,
    alignItems: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: ios16Palette.fillMuted,
    borderRadius: ios16Radii.chip,
    padding: ios16Spacing.xxs,
    gap: ios16Spacing.xxs,
  },
  segmentedThumb: {
    flex: 1,
    borderRadius: ios16Radii.chip,
    paddingVertical: ios16Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ios16Palette.backgroundCardLight,
    ...ios16Shadows.subtle,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: ios16Spacing.sm,
    paddingVertical: ios16Spacing.xxs,
    borderRadius: ios16Radii.chip,
    backgroundColor: ios16Palette.fillMuted,
  },
  toggleTrack: {
    width: 52,
    height: 32,
    borderRadius: 16,
    padding: 2,
    backgroundColor: ios16Palette.fillMuted,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ios16Palette.backgroundCardLight,
    ...ios16Shadows.toggleThumb,
  },
  tabBar: {
    height: ios16Layout.tabBarHeight,
    borderRadius: ios16Radii.modal,
    backgroundColor: ios16Palette.backgroundCardDark,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ios16Palette.strokeDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: ios16Spacing.xl,
    ...ios16Shadows.floating,
  },
  tabBarLight: {
    height: 60,
    borderRadius: 0,
    backgroundColor: ios16Palette.backgroundLight,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: ios16Palette.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: ios16Spacing.xl,
  },
});

export type IOS16ComponentStyle = keyof typeof ios16Components;



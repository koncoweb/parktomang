import { View, StyleSheet, type ViewProps } from 'react-native';
import { ios16Palette, ios16Radii, ios16Spacing } from '@/constants/ios16TemplateStyles';

type CardProps = ViewProps & {
  children: React.ReactNode;
};

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: ios16Spacing.lg,
    borderRadius: ios16Radii.card,
    backgroundColor: ios16Palette.backgroundCardLightNew,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ios16Palette.borderLight,
  },
});


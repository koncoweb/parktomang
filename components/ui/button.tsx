import { Pressable, StyleSheet, Text, ActivityIndicator, Platform } from 'react-native';
import { ios16Components, ios16Palette, ios16Typography } from '@/constants/ios16TemplateStyles';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
};

export function Button({ title, onPress, variant = 'primary', disabled, loading, style }: ButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : ios16Palette.accentBlue} />
      ) : (
        <Text
          style={[
            variant === 'primary' ? styles.primaryText : styles.secondaryText,
            (disabled || loading) && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    ...ios16Components.compactButton,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#0051D5', // Biru tua
    borderWidth: 1,
    borderColor: 'rgba(0, 81, 213, 0.2)', // Border subtle
    ...Platform.select({
      ios: {
        shadowColor: '#0051D5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0, 81, 213, 0.3)',
      },
    }),
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0051D5', // Biru tua untuk border
    ...Platform.select({
      ios: {
        shadowColor: '#0051D5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 81, 213, 0.15)',
      },
    }),
  },
  disabled: {
    opacity: 0.6,
  },
  primaryText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  secondaryText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    color: '#0051D5', // Biru tua
  },
  disabledText: {
    opacity: 0.6,
  },
});


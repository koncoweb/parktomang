import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
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
    backgroundColor: ios16Palette.accentBlue,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: ios16Palette.accentBlue,
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
    color: ios16Palette.accentBlue,
  },
  disabledText: {
    opacity: 0.6,
  },
});


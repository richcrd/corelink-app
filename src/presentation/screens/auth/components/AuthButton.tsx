import { Pressable, StyleSheet, Text } from 'react-native';

import type Colors from '@/src/presentation/constants/Colors';

export function AuthButton({
  theme,
  label,
  loadingLabel,
  loading,
  disabled,
  onPress,
}: {
  theme: (typeof Colors)['light'];
  label: string;
  loadingLabel: string;
  loading: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const isDisabled = !!disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.submitBtn,
        {
          backgroundColor: theme.success,
          opacity: isDisabled ? 0.55 : pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text style={[styles.submitBtnText, { color: theme.textOnPrimary }]}>
        {loading ? loadingLabel : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  submitBtn: {
    marginTop: 4,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '900',
  },
});

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type Colors from '@/src/presentation/constants/Colors';

type IconName = ComponentProps<typeof FontAwesome>['name'];

export function AuthTextField({
  theme,
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  inputProps,
  right,
}: {
  theme: (typeof Colors)['light'];
  label: string;
  icon: IconName;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  inputProps?: Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText' | 'placeholder'>;
  right?: ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.group}>
      <Text style={[styles.label, { color: theme.tabIconDefault }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.card,
            borderColor: focused ? theme.primary : 'transparent',
          },
        ]}
      >
        <FontAwesome
          name={icon}
          size={18}
          color={theme.tabIconDefault}
          style={styles.inputIcon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor ?? theme.tabIconDefault}
          style={[styles.inputField, { color: theme.text }]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...(inputProps ?? {})}
        />
        {right}
      </View>
    </View>
  );
}

export function PasswordRightToggle({
  theme,
  visible,
  onToggle,
  iconVisible = 'unlock',
  iconHidden = 'lock',
}: {
  theme: (typeof Colors)['light'];
  visible: boolean;
  onToggle: () => void;
  iconVisible?: IconName;
  iconHidden?: IconName;
}) {
  return (
    <Pressable onPress={onToggle} style={styles.rightBtn}>
      <FontAwesome
        name={visible ? iconVisible : iconHidden}
        size={18}
        color={theme.tabIconDefault}
      />
    </Pressable>
  );
}

export function RightChevron({
  theme,
}: {
  theme: (typeof Colors)['light'];
}) {
  return (
    <View style={styles.rightBtn}>
      <FontAwesome name="chevron-down" size={16} color={theme.tabIconDefault} />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  inputWrapper: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
  },
  inputField: {
    height: 48,
    paddingLeft: 44,
    paddingRight: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  rightBtn: {
    position: 'absolute',
    right: 10,
    height: 48,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

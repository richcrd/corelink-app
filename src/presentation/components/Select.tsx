import React, { useRef, useMemo } from "react";
import { Pressable, Text } from "react-native";
import { AppBottomSheet } from "./AppBottomSheet";
import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";

export type SelectOption<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  label: string;
  value?: T;
  options: SelectOption<T>[];
  onOpen?: () => void;
  onChange: (value: T) => void;
  theme: {
    card: string;
    text: string;
    primary: string;
    border?: string;
    placeholder?: string;
  };
};

export function Select<T>({
  theme,
  label,
  value,
  options,
  onChange,
  onOpen,
}: Props<T>) {
  const sheetRef = useRef<BottomSheetModal>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  function open() {
    onOpen?.();
    sheetRef.current?.present();
  }

  function close() {
    sheetRef.current?.dismiss();
  }

  return (
    <>
      <Pressable
        onPress={open}
        style={{
          height: 48,
          justifyContent: "center",
          paddingHorizontal: 12,
          borderRadius: 12,
          backgroundColor: theme.card,
          borderColor: theme.border ?? "transparent",
        }}
      >
        <Text
          style={{
            color: selected ? theme.text : (theme.placeholder ?? "#999"),
            fontWeight: "600",
          }}
        >
          {selected?.label ?? label}
        </Text>
      </Pressable>

      <AppBottomSheet ref={sheetRef} snapPoints={["60%"]} theme={theme}>
        <BottomSheetFlatList<SelectOption<T>>
          data={options}
          keyExtractor={(item: SelectOption<T>) => String(item.value)}
          renderItem={({ item }: { item: SelectOption<T>}) => {
            const isSelected = item.value === value;

            return (
              <Pressable
                onPress={() => {
                  onChange(item.value);
                  close();
                }}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  backgroundColor: isSelected
                    ? theme.primary + "20"
                    : "transparent",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontWeight: isSelected ? "800" : "600",
                    color: theme.text,
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </AppBottomSheet>
    </>
  );
}

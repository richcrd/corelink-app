import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import type Colors from "@/src/presentation/constants/Colors";
import { Banner } from "@/src/features/banners";
import { toPx, getComponentPixelSize } from "@/src/presentation/utils/common";

type Theme = typeof Colors.light;

type AdsCarouselProps = {
  data: Banner[];
  width: number;
  theme: Theme;
};

export function AdsCarousel({ data, width, theme }: AdsCarouselProps) {
  const listRef = useRef<FlatList<Banner>>(null);
  const displayIndexRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isMomentumRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const bannerWidth = width;
  const displayAds = data.length > 1 ? [...data, data[0]] : data;

  useEffect(() => {
    if (data.length <= 1) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        if (!isDraggingRef.current && !isMomentumRef.current) {
          const nextDisplayIndex = displayIndexRef.current + 1;
          listRef.current?.scrollToIndex({ index: nextDisplayIndex, animated: true });
        }
        scheduleNext();
      }, 4500);
    };

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [data.length]);

  function onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    isMomentumRef.current = false;

    const offsetX = event.nativeEvent.contentOffset.x;
    const displayIndex = Math.round(offsetX / bannerWidth);
    displayIndexRef.current = displayIndex;

    if (data.length > 1 && displayIndex === data.length) {
      displayIndexRef.current = 0;
      setActiveIndex(0);
      listRef.current?.scrollToIndex({ index: 0, animated: false });
      return;
    }

    setActiveIndex(displayIndex);
  }

  return (
    <View style={styles.section}>
      <FlatList
        ref={listRef}
        data={displayAds}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="normal"
        onScrollBeginDrag={() => {
          isDraggingRef.current = true;
        }}
        onScrollEndDrag={() => {
          isDraggingRef.current = false;
        }}
        onMomentumScrollBegin={() => {
          isMomentumRef.current = true;
        }}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.cardWrap,
              {
                width: bannerWidth,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <ImageBackground 
              source={{ uri: item.imageUrl }} 
              imageStyle={styles.image} 
              style={styles.card}  
              onLayout={() => {
                const widthPx = toPx(width);
                const heightPx = toPx(160);
                // console.log({ widthPx, heightPx });
              }}
            />
          </Pressable>
        )}
      />

      <View style={styles.dotsRow}>
        {data.map((ad, index) => (
          <View
            key={ad.id}
            style={[
              styles.dot,
              {
                width: index === activeIndex ? 18 : 8,
                backgroundColor: index === activeIndex ? theme.primary : theme.border,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 16,
  },
  cardWrap: {
    paddingHorizontal: 16,
  },
  card: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    borderRadius: 12,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.95,
  },
  dotsRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 999,
  },
});

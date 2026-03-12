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

type Theme = typeof Colors.light;

export type AdItem = {
  id: string;
  image: number;
};

type AdsCarouselProps = {
  ads: AdItem[];
  width: number;
  theme: Theme;
  onPressAd: (ad: AdItem) => void;
};

export function AdsCarousel({ ads, width, theme, onPressAd }: AdsCarouselProps) {
  const listRef = useRef<FlatList<AdItem>>(null);
  const displayIndexRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isMomentumRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const bannerWidth = width;
  const displayAds = ads.length > 1 ? [...ads, ads[0]] : ads;

  useEffect(() => {
    if (ads.length <= 1) {
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
  }, [ads.length]);

  function onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    isMomentumRef.current = false;

    const offsetX = event.nativeEvent.contentOffset.x;
    const displayIndex = Math.round(offsetX / bannerWidth);
    displayIndexRef.current = displayIndex;

    if (ads.length > 1 && displayIndex === ads.length) {
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
            onPress={() => onPressAd(item)}
            style={({ pressed }) => [
              styles.cardWrap,
              {
                width: bannerWidth,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <ImageBackground source={item.image} imageStyle={styles.image} style={styles.card} />
          </Pressable>
        )}
      />

      <View style={styles.dotsRow}>
        {ads.map((ad, index) => (
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

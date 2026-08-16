import { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Linking,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui';
import { RezzidentLogo } from '@/components/ui/RezzidentLogo';
import { cn } from '@/lib/cn';

// Hero image — use PNG for reliable Expo Go rendering.
// SVG hero works after running `expo start -c` with react-native-svg-transformer installed.
const HERO_IMAGE = require('@/assets/LoginHeroImageTest1.png');

const SLIDES = [
  {
    title: 'Your residence,\nreimagined.',
    description: 'Smart community living at your fingertips',
  },
  {
    title: 'Stay connected,\nstay secure.',
    description: 'Manage bills, visitors, and votes in one place',
  },
  {
    title: 'Your community,\nin your pocket.',
    description: 'Report issues, and chat instantly',
  },
];

const AUTO_SCROLL_INTERVAL = 4500;
const CREATE_ESTATE_URL = 'https://rezzident.app/registration-criteria';

/**
 * Welcome screen — Rezzident Design System v1.0.0
 *
 * Uses NativeWind for all spacing / typography / color classes.
 * Explicit numeric style only where NativeWind tokens can't express
 * the exact value (e.g. insets.bottom, animated transforms).
 */
export function WelcomeScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = screenWidth >= 768;

  const [currentSlide, setCurrentSlide] = useState(0);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ── Smooth text transition (fade + spring) ──
  const animateToSlide = useCallback(
    (nextIdx: number) => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -12, duration: 250, useNativeDriver: true }),
      ]).start(() => {
        setCurrentSlide(nextIdx);
        slideAnim.setValue(12);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
        ]).start();
      });
    },
    [fadeAnim, slideAnim]
  );

  // ── Auto-scroll ──
  const startAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    autoScrollTimer.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % SLIDES.length;
        animateToSlide(next);
        return prev;
      });
    }, AUTO_SCROLL_INTERVAL);
  }, [animateToSlide]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, [startAutoScroll, stopAutoScroll]);

  const handleDotPress = (idx: number) => {
    if (idx === currentSlide) return;
    stopAutoScroll();
    animateToSlide(idx);
    startAutoScroll();
  };

  return (
    <View
      className="flex-1 bg-lightCream"
      style={{ paddingTop: insets.top }}
    >
      {/* ── Hero Image (SVG) with Centered Logo + Dark Overlay ── */}
      <View
        className={cn('mt-3 overflow-hidden', isTablet && 'self-center')}
        style={{
          marginHorizontal: 24,
          width: isTablet ? 480 : screenWidth - 48,
          height: 350,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Image
          source={HERO_IMAGE}
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* Semi-transparent overlay */}
        <View className="absolute inset-0 items-center justify-center bg-black/30">
          <View className="flex-row items-center gap-2">
            <RezzidentLogo width={32} height={28} />
            <Text className="font-dmsans text-[28px] font-bold text-white">
              rezzident
            </Text>
          </View>
        </View>
      </View>

      {/* ── Page Indicator Dots ── */}
      <View className="flex-row items-center justify-center gap-2 py-5">
        {SLIDES.map((_, idx) => (
          <Pressable key={idx} onPress={() => handleDotPress(idx)} hitSlop={8}>
            <View
              className={cn(
                'h-[3px] rounded-full',
                idx === currentSlide ? 'w-6 bg-actionDark' : 'w-3 bg-stoneEdge'
              )}
            />
          </Pressable>
        ))}
      </View>

      {/* ── Animated Text Carousel ── */}
      <Animated.View
        className="flex-1 items-center justify-center px-6"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={{ maxWidth: isTablet ? 480 : undefined, width: '100%' }}>
          <Text className="text-center font-dmsans text-[28px] leading-[34px] text-actionDark">
            {SLIDES[currentSlide].title}
          </Text>
          <Text className="mt-3 text-center font-dmsans text-body-base text-warmGray">
            {SLIDES[currentSlide].description}
          </Text>
        </View>
      </Animated.View>

      {/* ── CTA Buttons ── */}
      <View
        className={cn('px-6', isTablet && 'self-center')}
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
          maxWidth: isTablet ? 480 + 48 : undefined,
          width: '100%',
        }}
      >
        <Button variant="default" onPress={() => router.push('/(application)/join')}>
          Create Account
        </Button>
        <View className="h-3" />
        <Button variant="secondary" onPress={() => router.push('/(auth)/login')}>
          I already have an account
        </Button>
        <View className="h-3" />
        <Button variant="ghost" onPress={() => Linking.openURL(CREATE_ESTATE_URL)}>
          Create Estate
        </Button>
        <Text className="mt-8 text-center font-dmsans text-caption text-slateGray">
          By continuing, you agree to our{' '}
          <Text
            className="text-actionDark underline"
            onPress={() => Linking.openURL('https://rezzident.app/terms')}
          >
            Terms
          </Text>
          {' & '}
          <Text
            className="text-actionDark underline"
            onPress={() => Linking.openURL('https://rezzident.app/privacy')}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
}


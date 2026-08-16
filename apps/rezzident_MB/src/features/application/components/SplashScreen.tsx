import { useEffect, useRef } from 'react';
import { View, Text, Animated, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RezzidentLogo } from '@/components/ui/RezzidentLogo';

// LogoIcon extracted as PNG for reliable Expo Go rendering
const LOGO_ICON_PNG = require('@/assets/logoIcon.png');

/**
 * Splash screen — built-in Animated API (no Reanimated).
 *
 * Exact Figma spec for "rezzident" text:
 *   Font: DM Sans Bold (weight 700)
 *   Size: 38px
 *   Line-height: 40px
 *   Letter-spacing: -4% (≈ -1.52px at 38px → RN uses em-relative letterSpacing)
 *   Color: #FFFFFF
 *
 * Footer: "Powered | [LogoIcon] Poietes"
 */
export function SplashScreen() {
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconTranslateY = useRef(new Animated.Value(16)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(iconOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(iconTranslateY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(textTranslateX, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 300);

    const timer = setTimeout(() => router.replace('/(application)/welcome'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center justify-between bg-actionDark px-6 py-10">
      {/* Spacer */}
      <View />

      {/* Brand mark + wordmark */}
      <View className="flex-row items-center gap-2.5">
        <Animated.View
          style={{
            opacity: iconOpacity,
            transform: [{ translateY: iconTranslateY }],
          }}
        >
          <RezzidentLogo width={40} height={35} fill="#FFE022" />
        </Animated.View>
        <Animated.Text
          className="font-dmsans text-[38px] font-bold text-white"
          style={{
            opacity: textOpacity,
            transform: [{ translateX: textTranslateX }],
            lineHeight: 40,
            letterSpacing: -1.52,
          }}
        >
          rezzident
        </Animated.Text>
      </View>

      {/* Footer: Powered | [icon] Poietes */}
      <View className="flex-row items-center gap-2">
        <Text className="font-dmsans text-[14px] leading-4 text-offWhite">
          Powered
        </Text>
        <Text className="font-dmsans text-[14px] leading-4 text-offWhite">|</Text>
        {/* LogoIcon PNG */}
        <Image
          source={LOGO_ICON_PNG}
          style={{ width: 14, height: 14 }}
          resizeMode="contain"
        />
        <Text className="font-dmsans text-[14px] leading-4 text-offWhite">
          Poietes
        </Text>
      </View>
    </SafeAreaView>
  );
}

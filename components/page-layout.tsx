import React from 'react';
import { View, StyleSheet, ImageBackground, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { ios16Palette, ios16Radii } from '@/constants/ios16TemplateStyles';

const BANNER_HEIGHT = Platform.OS === 'web' ? 200 : 180;
const CONTENT_OFFSET = Platform.OS === 'web' ? 160 : 140;

type PageLayoutProps = {
  children: React.ReactNode;
  showBanner?: boolean;
};

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function PageLayout({ children, showBanner = true }: PageLayoutProps) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const bannerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, CONTENT_OFFSET],
      [0, -BANNER_HEIGHT],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const marginTop = interpolate(
      scrollY.value,
      [0, CONTENT_OFFSET],
      [CONTENT_OFFSET, 0],
      Extrapolate.CLAMP
    );
    return {
      marginTop,
    };
  });

  return (
    <View style={styles.container}>
      {showBanner && (
        <Animated.View style={[styles.bannerContainer, bannerAnimatedStyle]}>
          <ImageBackground
            source={require('@/assets/images/banner.jpg')}
            style={styles.bannerImage}
            imageStyle={styles.bannerImageStyle}
            resizeMode="cover"
          />
        </Animated.View>
      )}
      <SafeAreaView style={styles.safeArea} edges={showBanner ? ['bottom'] : ['top', 'bottom']}>
        <AnimatedScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
        >
          <Animated.View style={[styles.contentContainer, showBanner && contentAnimatedStyle]}>
            {children}
          </Animated.View>
        </AnimatedScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BANNER_HEIGHT,
    zIndex: 1,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerImageStyle: {
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: ios16Palette.backgroundLight,
    borderTopLeftRadius: ios16Radii.widget,
    borderTopRightRadius: ios16Radii.widget,
    minHeight: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
});


import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtitle entrance (delayed)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Pulse animation loop for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ring expand animation loop
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1.6,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Loading dots animation
    const animateDots = () => {
      const createDotAnim = (dot: Animated.Value, delay: number) =>
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]);

      Animated.loop(
        Animated.parallel([
          createDotAnim(dot1Opacity, 0),
          createDotAnim(dot2Opacity, 200),
          createDotAnim(dot3Opacity, 400),
        ])
      ).start();
    };

    setTimeout(animateDots, 800);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f5238',
      }}
    >
      {/* Background decorative elements */}
      <View
        style={{
          position: 'absolute',
          top: -height * 0.15,
          right: -width * 0.2,
          width: width * 0.7,
          height: width * 0.7,
          borderRadius: width * 0.35,
          backgroundColor: 'rgba(177, 240, 206, 0.08)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -height * 0.1,
          left: -width * 0.15,
          width: width * 0.5,
          height: width * 0.5,
          borderRadius: width * 0.25,
          backgroundColor: 'rgba(168, 231, 197, 0.06)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: height * 0.3,
          left: -width * 0.1,
          width: width * 0.3,
          height: width * 0.3,
          borderRadius: width * 0.15,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
        }}
      />

      {/* Logo + Ring */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* Expanding ring */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: 70,
            borderWidth: 2,
            borderColor: 'rgba(177, 240, 206, 0.4)',
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          }}
        />

        {/* Icon container */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }],
            width: 120,
            height: 120,
            borderRadius: 36,
            backgroundColor: 'rgba(177, 240, 206, 0.15)',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(177, 240, 206, 0.2)',
          }}
        >
          <MaterialIcons name="favorite" size={56} color="#b1f0ce" />
        </Animated.View>
      </View>

      {/* Title */}
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
          marginTop: 32,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 38,
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: -1,
            fontFamily: 'PlusJakartaSans_ExtraBold',
          }}
        >
          All Ong's
        </Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View
        style={{
          opacity: subtitleOpacity,
          transform: [{ translateY: subtitleTranslateY }],
          marginTop: 8,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: 'rgba(177, 240, 206, 0.7)',
            fontFamily: 'Manrope_Medium',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Doações com propósito
        </Text>
      </Animated.View>

      {/* Loading dots */}
      <View
        style={{
          position: 'absolute',
          bottom: 80,
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {[dot1Opacity, dot2Opacity, dot3Opacity].map((dotAnim, i) => (
          <Animated.View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#b1f0ce',
              opacity: dotAnim,
            }}
          />
        ))}
      </View>
    </View>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import { View, StatusBar, Dimensions, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
let LottieView: any;
if (Platform.OS === 'web') {
  LottieView = require('lottie-react').default;
} else {
  LottieView = require('lottie-react-native').default;
}
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Container = styled(Animated.View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
`;

const GradientBackground = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Logo = styled(Animated.View)`
  width: 200px;
  height: 200px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const AppName = styled(Animated.Text)`
  font-size: 32px;
  font-weight: bold;
  color: #FFFFFF;
  margin-top: 20px;
  text-align: center;
`;

const Tagline = styled(Animated.Text)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
  text-align: center;
`;

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const animationRef = useRef<LottieView>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const logoScaleAnim = useRef(new Animated.Value(1)).current;
  const textFadeAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for the logo
  useEffect(() => {
    // Create a pulsing effect for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScaleAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [logoScaleAnim]);

  // Set timer for splash duration and animate out
  useEffect(() => {
    // Set minimum display time for splash screen
    const minDisplayTimer = setTimeout(() => {
      // Start parallel animations for fade out and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Once animations are complete, signal we're ready to move on
        setIsReady(true);
      });
    }, 1000);
    
    return () => clearTimeout(minDisplayTimer);
  }, [fadeAnim, scaleAnim, textFadeAnim]);
  
  // Only proceed if animation has completed and minimum time has passed
  useEffect(() => {
    if (isReady) {
      onAnimationComplete();
    }
  }, [isReady, onAnimationComplete]);

  return (
    <Container 
      style={{ 
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <GradientBackground
        colors={['#3B82F6', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Logo
        style={{
          transform: [{ scale: logoScaleAnim }]
        }}
      >
        <LottieView
          ref={animationRef}
          {...(Platform.OS === 'web'
            ? { animationData: require('../../assets/loader.json') }
            : { source: require('../../assets/loader.json') })}
          autoPlay
          loop
          speed={0.8}
          style={{ width: 200, height: 200 }}
        />
      </Logo>
      <AppName style={{ opacity: textFadeAnim }}>
        Fashionista
      </AppName>
      <Tagline style={{ opacity: textFadeAnim }}>
        Your personal fashion assistant
      </Tagline>
    </Container>
  );
};

export default SplashScreen; 
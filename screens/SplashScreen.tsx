import React, { useRef, useEffect } from 'react';
import { View, StatusBar, Dimensions } from 'react-native';
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

const Container = styled.View`
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

const Logo = styled.View`
  width: 200px;
  height: 200px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const AppName = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #FFFFFF;
  margin-top: 20px;
  text-align: center;
`;

const Tagline = styled.Text`
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

  useEffect(() => {
    // Make sure we call onAnimationComplete after animation finishes
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2500); // Give enough time for animation to complete once

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <GradientBackground
        colors={['#3B82F6', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Logo>
        <LottieView
          ref={animationRef}
          source={require('../assets/loader.json')}
          autoPlay
          loop={false}
          speed={0.8}
          style={{ width: 200, height: 200 }}
        />
      </Logo>
      <AppName>Fashionista</AppName>
      <Tagline>Your personal fashion assistant</Tagline>
    </Container>
  );
};

export default SplashScreen; 
import React, { useEffect, useState } from 'react';
import { Modal, Dimensions, Animated, Easing, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
let LottieView: any;
if (Platform.OS === 'web') {
  LottieView = require('lottie-react').default;
} else {
  LottieView = require('lottie-react-native').default;
}

const { width, height } = Dimensions.get('window');

const ModalBackground = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.View`
  width: ${width * 0.85}px;
  padding: 0;
  border-radius: 20px;
  overflow: hidden;
  background-color: #fff;
  elevation: 20;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 20px;
`;

const GradientHeader = styled(LinearGradient)`
  width: 100%;
  height: 130px;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.View`
  padding: 24px;
  align-items: center;
`;

const WelcomeText = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #1E293B;
  margin-bottom: 8px;
  text-align: center;
`;

const UserName = styled.Text`
  font-size: 22px;
  font-weight: 600;
  color: #3B82F6;
  margin-bottom: 20px;
  text-align: center;
`;

const MessageText = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: #64748B;
  text-align: center;
  margin-bottom: 24px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
`;

const Button = styled.TouchableOpacity`
  background-color: #3B82F6;
  padding: 14px 30px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

interface WelcomeModalProps {
  userName: string;
  onDismiss: () => void;
}

// This key should match the one in App.tsx
const WELCOME_MODAL_SHOWN_KEY = 'welcome_modal_shown';

const WelcomeModal: React.FC<WelcomeModalProps> = ({ userName, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Always show the modal if it's rendered (the parent component controls visibility now)
    setVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDismiss = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <ModalBackground>
        <Animated.View
          style={{
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height * 0.2, 0],
                }),
              },
            ],
            opacity: animation,
            width: width * 0.85,
          }}
        >
          <ModalContainer>
            <GradientHeader
              colors={['#3B82F6', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LottieView
                source={require('../../assets/h6y36oamNH.json')}
                autoPlay
                loop
                style={{ width: 120, height: 120 }}
              />
              <CloseButton onPress={handleDismiss}>
                <Ionicons name="close" size={20} color="#fff" />
              </CloseButton>
            </GradientHeader>

            <ContentContainer>
              <WelcomeText>Welcome to Fashionista!</WelcomeText>
              <UserName>{userName}</UserName>
              <MessageText>
                We're excited to have you join our community. Discover amazing fashion, try on clothes virtually, and shop from top designers.
              </MessageText>
              <ButtonContainer>
                <Button onPress={handleDismiss}>
                  <ButtonText>Get Started</ButtonText>
                </Button>
              </ButtonContainer>
            </ContentContainer>
          </ModalContainer>
        </Animated.View>
      </ModalBackground>
    </Modal>
  );
};

export default WelcomeModal; 
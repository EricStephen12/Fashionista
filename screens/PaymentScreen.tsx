import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#6c63ff', '#48c6ef'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Illustration = styled.Image`
  width: ${width * 0.6}px;
  height: ${width * 0.6}px;
  margin-bottom: 32px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 16px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 20px;
  color: #f8f8ff;
  margin-bottom: 24px;
  text-align: center;
`;

const ComingSoon = styled.Text`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  background-color: #6c63ff;
  padding: 10px 28px;
  border-radius: 24px;
  overflow: hidden;
  text-align: center;
`;

const PaymentScreen = () => {
  return (
    <GradientBackground>
      <Illustration
        source={{ uri: 'https://cdn.dribbble.com/users/1022854/screenshots/15602431/media/2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e.png?auto=format&fit=crop&w=800&q=80' }}
        resizeMode="contain"
      />
      <Title>Secure Payments</Title>
      <Subtitle>
        Experience seamless and secure transactions powered by Paystack.
      </Subtitle>
      <ComingSoon>Coming Soon</ComingSoon>
    </GradientBackground>
  );
};

export default PaymentScreen; 
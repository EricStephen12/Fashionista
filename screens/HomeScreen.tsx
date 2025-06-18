import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#6c63ff', '#48c6ef'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
`;

const HeroImage = styled(ImageBackground)`
  width: ${width}px;
  height: 260px;
  justify-content: flex-end;
`;

const Overlay = styled.View`
  background-color: rgba(26, 26, 46, 0.3);
  flex: 1;
  justify-content: flex-end;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 36px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 20px;
  color: #f8f8ff;
  margin-bottom: 32px;
  text-align: left;
`;

const Card = styled.View`
  background-color: #fff;
  margin: 0 20px;
  margin-top: -40px;
  border-radius: 24px;
  padding: 28px 20px;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  shadow-offset: 0px 8px;
  elevation: 8;
  align-items: center;
`;

const CardTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
`;

const CardText = styled.Text`
  color: #888;
  font-size: 16px;
  text-align: center;
`;

const HomeScreen = () => {
  return (
    <GradientBackground>
      <HeroImage
        source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' }}
        imageStyle={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <Overlay>
          <Title>Welcome to Fashionista!</Title>
          <Subtitle>See the latest from top designers and discover your next look.</Subtitle>
        </Overlay>
      </HeroImage>
      <Card>
        <CardTitle>Timeline / Feed</CardTitle>
        <CardText>Stunning fashion posts and updates from your favorite designers will appear here soon!</CardText>
      </Card>
    </GradientBackground>
  );
};

export default HomeScreen; 
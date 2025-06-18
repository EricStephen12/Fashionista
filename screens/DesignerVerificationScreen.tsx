import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../UserContext';
import RatingSummary from '../components/RatingSummary';

const Container = styled.View`
  flex: 1;
  background-color: #f8f8ff;
`;

const Header = styled(LinearGradient).attrs({
  colors: ['#6c63ff', '#48c6ef'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  padding: 60px 20px 30px 20px;
  align-items: center;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
`;

const HeaderSubtitle = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: ${Platform.OS === 'ios' ? '50px' : '20px'};
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const Section = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
  elevation: 4;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 15px;
`;

const SectionContent = styled.View``;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const InfoIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f1f5f9;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const InfoTextContainer = styled.View`
  flex: 1;
`;

const InfoTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1a1a2e;
  margin-bottom: 4px;
`;

const InfoDescription = styled.Text`
  font-size: 14px;
  color: #64748B;
  line-height: 20px;
`;

const FormGroup = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1a1a2e;
  margin-bottom: 8px;
`;

const Input = styled.TextInput`
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 12px 15px;
  font-size: 16px;
  color: #1a1a2e;
`;

const TextArea = styled.TextInput`
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 15px;
  font-size: 16px;
  color: #1a1a2e;
  min-height: 120px;
  text-align-vertical: top;
`;

const UploadButton = styled.TouchableOpacity`
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 15px;
  align-items: center;
  justify-content: center;
  border: 1px dashed #cbd5e1;
`;

const UploadText = styled.Text`
  font-size: 14px;
  color: #64748B;
  margin-top: 8px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #6c63ff;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  margin-top: 20px;
`;

const SubmitText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;

const RatingExampleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #f1f5f9;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
`;

const RatingExampleText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1a1a2e;
`;

const ReviewExample = styled.View`
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
`;

const ReviewHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ReviewerImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
`;

const ReviewerInfo = styled.View``;

const ReviewerName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1a1a2e;
`;

const ReviewDate = styled.Text`
  font-size: 12px;
  color: #64748B;
`;

const ReviewText = styled.Text`
  font-size: 14px;
  color: #374151;
  line-height: 20px;
`;

const DesignerVerificationScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandName: user?.brandName || '',
    bio: user?.bio || '',
    specialization: '',
    experience: '',
    taxId: '',
    idType: 'national_id',
  });

  const handleSubmit = () => {
    // Validate form
    if (!formData.brandName.trim()) {
      Alert.alert('Missing Information', 'Please enter your brand name.');
      return;
    }

    if (!formData.bio.trim()) {
      Alert.alert('Missing Information', 'Please provide a bio for your brand.');
      return;
    }

    // Submit verification request
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Verification Request Submitted',
        'Your verification request has been submitted successfully. We will review your information and get back to you within 2-3 business days.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    }, 2000);
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </BackButton>
        <HeaderTitle>Designer Verification</HeaderTitle>
        <HeaderSubtitle>
          Get verified to build trust with customers and increase your sales
        </HeaderSubtitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <Section>
          <SectionTitle>Benefits of Verification</SectionTitle>
          <SectionContent>
            <InfoRow>
              <InfoIcon>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </InfoIcon>
              <InfoTextContainer>
                <InfoTitle>Verified Badge</InfoTitle>
                <InfoDescription>
                  Display a verified badge on your profile and products to build customer trust
                </InfoDescription>
              </InfoTextContainer>
            </InfoRow>
            
            <InfoRow>
              <InfoIcon>
                <Ionicons name="star" size={24} color="#FFB800" />
              </InfoIcon>
              <InfoTextContainer>
                <InfoTitle>Customer Reviews & Ratings</InfoTitle>
                <InfoDescription>
                  Verified designers can receive ratings and reviews from customers to build reputation
                </InfoDescription>
              </InfoTextContainer>
            </InfoRow>
            
            <InfoRow>
              <InfoIcon>
                <Ionicons name="trending-up" size={24} color="#6c63ff" />
              </InfoIcon>
              <InfoTextContainer>
                <InfoTitle>Higher Visibility</InfoTitle>
                <InfoDescription>
                  Verified designers appear higher in search results and may be featured in promotions
                </InfoDescription>
              </InfoTextContainer>
            </InfoRow>
            
            <InfoRow>
              <InfoIcon>
                <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
              </InfoIcon>
              <InfoTextContainer>
                <InfoTitle>Trust & Credibility</InfoTitle>
                <InfoDescription>
                  Customers are more likely to purchase from verified designers with good ratings
                </InfoDescription>
              </InfoTextContainer>
            </InfoRow>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Rating & Review System</SectionTitle>
          <SectionContent>
            <InfoDescription style={{ marginBottom: 15 }}>
              After verification, customers can leave ratings and reviews on your designer profile. Here's how it works:
            </InfoDescription>
            
            <RatingExampleContainer>
              <RatingExampleText>Your Overall Rating</RatingExampleText>
              <RatingSummary rating={4.8} count={24} size="medium" />
            </RatingExampleContainer>
            
            <ReviewExample>
              <ReviewHeader>
                <ReviewerImage 
                  source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' }} 
                />
                <ReviewerInfo>
                  <ReviewerName>Sarah Johnson</ReviewerName>
                  <ReviewDate>March 15, 2024</ReviewDate>
                </ReviewerInfo>
              </ReviewHeader>
              <RatingSummary rating={5} showCount={false} size="small" />
              <ReviewText>
                "Absolutely love the designs from this store! The quality is exceptional and the customer service was outstanding. Will definitely be ordering more pieces in the future."
              </ReviewText>
            </ReviewExample>
            
            <InfoDescription>
              Higher ratings lead to better visibility in search results and more customer trust. Respond to reviews to build relationships with your customers.
            </InfoDescription>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Verification Information</SectionTitle>
          <FormGroup>
            <Label>Brand Name *</Label>
            <Input 
              value={formData.brandName}
              onChangeText={(text) => setFormData({...formData, brandName: text})}
              placeholder="Enter your brand name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Brand Bio *</Label>
            <TextArea 
              value={formData.bio}
              onChangeText={(text) => setFormData({...formData, bio: text})}
              placeholder="Describe your brand, style, and what makes you unique"
              multiline
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Specialization</Label>
            <Input 
              value={formData.specialization}
              onChangeText={(text) => setFormData({...formData, specialization: text})}
              placeholder="E.g., Streetwear, Formal, Sustainable fashion"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Years of Experience</Label>
            <Input 
              value={formData.experience}
              onChangeText={(text) => setFormData({...formData, experience: text})}
              placeholder="How many years of experience do you have?"
              keyboardType="number-pad"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Tax ID Number</Label>
            <Input 
              value={formData.taxId}
              onChangeText={(text) => setFormData({...formData, taxId: text})}
              placeholder="Enter your tax ID number"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Government ID</Label>
            <UploadButton>
              <Ionicons name="cloud-upload-outline" size={32} color="#64748B" />
              <UploadText>Upload a photo of your ID</UploadText>
            </UploadButton>
          </FormGroup>
          
          <FormGroup>
            <Label>Portfolio Images</Label>
            <UploadButton>
              <Ionicons name="images-outline" size={32} color="#64748B" />
              <UploadText>Upload 3-5 images of your work</UploadText>
            </UploadButton>
          </FormGroup>
          
          <SubmitButton onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <SubmitText>Submit for Verification</SubmitText>
            )}
          </SubmitButton>
        </Section>
      </Content>
    </Container>
  );
};

export default DesignerVerificationScreen; 
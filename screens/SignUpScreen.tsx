import React, { useState, useEffect } from 'react';
import { 
  Dimensions, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Keyboard,
  ScrollView,
  Text
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useUser } from '../UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// Platform already imported above, do not import again
let LottieView: any;
if (Platform.OS === 'web') {
  LottieView = require('lottie-react').default;
} else {
  LottieView = require('lottie-react-native').default;
}
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

// Define the navigation type
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  Timeline: undefined;
  Explore: undefined;
  Dashboard: undefined;
  DesignerStores: undefined;
};

type SignUpScreenNavigationProp = NavigationProp<RootStackParamList>;

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: #fff;
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

const GradientHeader = styled(LinearGradient)`
  height: ${height * 0.28}px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  padding-top: ${Platform.OS === 'ios' ? 50 : 30}px;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.View`
  width: 120px;
  height: 120px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const HeaderText = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #1E293B;
  margin-bottom: 8px;
  text-align: center;
`;

const LottieAnimation = styled(LottieView)`
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
`;

const FormContainer = styled(Animated.View)`
  margin-top: -40px;
  background-color: white;
  margin-horizontal: 20px;
  border-radius: 20px;
  padding: 30px 20px;
  elevation: 5;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 20px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #1E293B;
  margin-bottom: 24px;
  text-align: center;
`;

const InputGroup = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: #64748B;
  margin-bottom: 8px;
  font-weight: 500;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #F1F5F9;
  border-radius: 12px;
  padding: 0 15px;
  height: 56px;
`;

const Input = styled(TextInput)`
  flex: 1;
  font-size: 16px;
  color: #1E293B;
  padding-left: 10px;
`;

const RoleSelectorContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 24px;
  margin-top: 8px;
`;

const RoleButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${({ selected }) => (selected ? '#3B82F6' : '#F1F5F9')};
  border-radius: 12px;
  padding: 12px 20px;
  margin: 0 8px;
  align-items: center;
  justify-content: center;
  width: 45%;
`;

const RoleButtonText = styled.Text<{ selected: boolean }>`
  color: ${({ selected }) => (selected ? '#fff' : '#64748B')};
  font-size: 15px;
  font-weight: 600;
`;

const SignUpButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#94A3B8' : '#3B82F6'};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const LoginContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`;

const LoginText = styled.Text`
  color: #64748B;
  font-size: 14px;
`;

const LoginLink = styled.TouchableOpacity`
  margin-left: 5px;
`;

const LoginLinkText = styled.Text`
  color: #3B82F6;
  font-size: 14px;
  font-weight: 600;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: ${Platform.OS === 'ios' ? 50 : 30}px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const LoadingContainer = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 999;
`;

const PolicyText = styled.Text`
  color: #64748B;
  font-size: 12px;
  text-align: center;
  margin-bottom: 24px;
`;

const HighlightedText = styled.Text`
  color: #3B82F6;
  font-weight: 500;
`;

// New styled components for designer verification
const DesignerVerificationContainer = styled(Animated.View)`
  margin-top: 10px;
  background-color: #F8FAFC;
  padding: 15px;
  border-radius: 12px;
  border: 1px dashed #CBD5E1;
`;

const VerificationTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 10px;
`;

const VerificationText = styled.Text`
  font-size: 13px;
  color: #64748B;
  margin-bottom: 15px;
`;

const UploadContainer = styled.TouchableOpacity`
  background-color: #EFF6FF;
  border-radius: 10px;
  padding: 15px;
  align-items: center;
  justify-content: center;
  border: 1px dashed #93C5FD;
  margin-bottom: 15px;
`;

const UploadText = styled.Text`
  color: #3B82F6;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
`;

const ImagePreviewContainer = styled.View`
  margin-bottom: 15px;
`;

const ImagePreview = styled.Image`
  width: 100%;
  height: 150px;
  border-radius: 10px;
  margin-bottom: 5px;
`;

const RemoveButton = styled.TouchableOpacity`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
`;

const CheckboxContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const CheckboxText = styled.Text`
  font-size: 14px;
  color: #64748B;
  margin-left: 10px;
  flex: 1;
`;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { setUser, updateDesignerProfile } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'designer'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
  // New designer verification states
  const [brandName, setBrandName] = useState('');
  const [designerBio, setDesignerBio] = useState('');
  const [portfolioImage, setPortfolioImage] = useState<string | null>(null);
  const [yearsExperience, setYearsExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Additional verification fields
  const [taxId, setTaxId] = useState('');
  const [taxIdType, setTaxIdType] = useState<'ssn' | 'tin'>('tin');
  const [governmentId, setGovernmentId] = useState<string | null>(null);
  const [governmentIdType, setGovernmentIdType] = useState<'national_id' | 'passport' | 'drivers_license'>('national_id');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload your portfolio image.');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setPortfolioImage(result.assets[0].uri);
    }
  };

  const pickGovernmentId = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload your ID.');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setGovernmentId(result.assets[0].uri);
    }
  };

  const handleSignUp = () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }
    
    // Additional validation for designers
    if (role === 'designer') {
      if (!brandName || !designerBio || !specialization || !yearsExperience) {
        Alert.alert('Error', 'Please complete all designer information fields.');
        return;
      }
      
      if (!portfolioImage) {
        Alert.alert('Error', 'Please upload at least one portfolio image.');
        return;
      }
      
      if (!taxId) {
        Alert.alert('Error', 'Please provide your TIN/SSN for verification.');
        return;
      }
      
      if (!governmentId) {
        Alert.alert('Error', 'Please upload a government-issued ID for verification.');
        return;
      }
      
      if (!acceptedTerms) {
        Alert.alert('Error', 'You must accept the designer terms and conditions.');
        return;
      }
    }
    
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Set the user context after sign-up
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role,
        ...(role === 'designer' ? {
          brandName,
          bio: designerBio,
          verificationStatus: 'pending',
          designerTier: 'standard',
          designerProfile: {
            brandName,
            bio: designerBio,
            specialization,
            yearsExperience,
            portfolioImages: [portfolioImage],
            taxIdNumber: taxId,
            taxIdType: taxIdType,
            governmentIdType: governmentIdType,
            governmentIdImage: governmentId,
            verificationStatus: 'pending',
            submissionDate: new Date()
          }
        } : {})
      };
      setUser(newUser);
      
      // If designer, update the designer profile with additional info
      if (role === 'designer' && portfolioImage && governmentId) {
        updateDesignerProfile({
          brandName,
          bio: designerBio,
          specialization,
          yearsExperience,
          portfolioImages: [portfolioImage],
          taxIdNumber: taxId,
          taxIdType: taxIdType,
          governmentIdType: governmentIdType,
          governmentIdImage: governmentId,
          verificationStatus: 'pending',
          submissionDate: new Date()
        });
      }
      
      setLoading(false);
      
      if (role === 'designer') {
        // For designers, show a verification pending message
        Alert.alert(
          'Verification Pending',
          'Your designer account has been created! Our team will review your information and verify your account within 1-3 business days.',
          [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
        );
      } else {
        // Navigate to Main tab navigator for customers
      navigation.navigate('Main');
      }
    }, 1500);
  };

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollContainer contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <GradientHeader
          colors={['#10B981', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Logo>
            <LottieView
              {...(Platform.OS === 'web'
                ? { animationData: require('../assets/switch.json') }
                : { source: require('../assets/switch.json') })}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
          </Logo>
          <HeaderText>Create Account</HeaderText>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </BackButton>
          
          {!isKeyboardVisible && (
            <Logo>
              <LottieView
                source={require('../assets/switch.json')}
                autoPlay
                loop
                style={{ width: 120, height: 120 }}
              />
            </Logo>
          )}
        </GradientHeader>
        
        <FormContainer entering={FadeInUp.duration(500).delay(100)}>
      <Title>Create Account</Title>
          
          <InputGroup>
            <Label>Full Name</Label>
            <InputContainer>
              <Ionicons name="person-outline" size={20} color="#64748B" />
      <Input
                placeholder="Enter your full name"
                placeholderTextColor="#94A3B8"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
            </InputContainer>
          </InputGroup>
          
          <InputGroup>
            <Label>Email</Label>
            <InputContainer>
              <Ionicons name="mail-outline" size={20} color="#64748B" />
      <Input
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
            </InputContainer>
          </InputGroup>
          
          <InputGroup>
            <Label>Password</Label>
            <InputContainer>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
      <Input
                placeholder="Create a password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#64748B" 
                />
              </TouchableOpacity>
            </InputContainer>
          </InputGroup>
          
          <InputGroup>
            <Label>Confirm Password</Label>
            <InputContainer>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
              <Input
                placeholder="Confirm your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
            </InputContainer>
          </InputGroup>
          
          <Label style={{ textAlign: 'center', marginTop: 8 }}>I want to join as:</Label>
      <RoleSelectorContainer>
            <RoleButton
              selected={role === 'customer'}
              onPress={() => setRole('customer')}
              disabled={loading}
            >
              <RoleButtonText selected={role === 'customer'}>
                Customer
              </RoleButtonText>
            </RoleButton>
            
          <RoleButton
              selected={role === 'designer'}
              onPress={() => setRole('designer')}
            disabled={loading}
          >
              <RoleButtonText selected={role === 'designer'}>
                Designer
            </RoleButtonText>
          </RoleButton>
      </RoleSelectorContainer>
          
          {/* Designer verification section */}
          {role === 'designer' && (
            <DesignerVerificationContainer entering={FadeInDown.duration(300)}>
              <VerificationTitle>Designer Verification</VerificationTitle>
              <VerificationText>
                To become a verified designer, please provide additional information about your brand and experience.
              </VerificationText>
              
              <InputGroup>
                <Label>Brand Name</Label>
                <InputContainer>
                  <Ionicons name="business-outline" size={20} color="#64748B" />
                  <Input
                    placeholder="Your brand or studio name"
                    placeholderTextColor="#94A3B8"
                    value={brandName}
                    onChangeText={setBrandName}
                    editable={!loading}
                  />
                </InputContainer>
              </InputGroup>
              
              <InputGroup>
                <Label>Bio / Description</Label>
                <InputContainer style={{ height: 100, alignItems: 'flex-start', paddingVertical: 10 }}>
                  <Ionicons name="create-outline" size={20} color="#64748B" style={{ marginTop: 5 }} />
                  <Input
                    placeholder="Tell us about your design experience and style"
                    placeholderTextColor="#94A3B8"
                    value={designerBio}
                    onChangeText={setDesignerBio}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={{ height: 80 }}
                    editable={!loading}
                  />
                </InputContainer>
              </InputGroup>
              
              <InputGroup>
                <Label>Specialization</Label>
                <InputContainer>
                  <MaterialIcons name="category" size={20} color="#64748B" />
                  <Input
                    placeholder="e.g. Women's Wear, Accessories, etc."
                    placeholderTextColor="#94A3B8"
                    value={specialization}
                    onChangeText={setSpecialization}
                    editable={!loading}
                  />
                </InputContainer>
              </InputGroup>
              
              <InputGroup>
                <Label>Years of Experience</Label>
                <InputContainer>
                  <Ionicons name="time-outline" size={20} color="#64748B" />
                  <Input
                    placeholder="Number of years in fashion industry"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    value={yearsExperience}
                    onChangeText={setYearsExperience}
                    editable={!loading}
                  />
                </InputContainer>
              </InputGroup>
              
              <InputGroup>
                <Label>Tax Identification</Label>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: taxIdType === 'tin' ? '#3B82F6' : '#F1F5F9',
                      borderRadius: 8,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      marginRight: 10
                    }}
                    onPress={() => setTaxIdType('tin')}
                    disabled={loading}
                  >
                    <Text style={{ 
                      color: taxIdType === 'tin' ? '#FFF' : '#64748B',
                      fontWeight: '500',
                      fontSize: 14
                    }}>
                      TIN
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={{
                      backgroundColor: taxIdType === 'ssn' ? '#3B82F6' : '#F1F5F9',
                      borderRadius: 8,
                      paddingVertical: 6,
                      paddingHorizontal: 12
                    }}
                    onPress={() => setTaxIdType('ssn')}
                    disabled={loading}
                  >
                    <Text style={{ 
                      color: taxIdType === 'ssn' ? '#FFF' : '#64748B',
                      fontWeight: '500',
                      fontSize: 14
                    }}>
                      SSN
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <InputContainer>
                  <MaterialIcons name="assignment-ind" size={20} color="#64748B" />
                  <Input
                    placeholder={taxIdType === 'tin' ? "Enter your TIN number" : "Enter your SSN"}
                    placeholderTextColor="#94A3B8"
                    value={taxId}
                    onChangeText={setTaxId}
                    keyboardType="number-pad"
                    editable={!loading}
                    secureTextEntry={true}
                  />
                </InputContainer>
                <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontStyle: 'italic' }}>
                  For tax purposes only. Your information is securely encrypted.
                </Text>
              </InputGroup>
              
              <InputGroup>
                <Label>Government ID Type</Label>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: governmentIdType === 'national_id' ? '#3B82F6' : '#F1F5F9',
                      borderRadius: 8,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      marginRight: 10,
                      marginBottom: 10
                    }}
                    onPress={() => setGovernmentIdType('national_id')}
                    disabled={loading}
                  >
                    <Text style={{ 
                      color: governmentIdType === 'national_id' ? '#FFF' : '#64748B',
                      fontWeight: '500',
                      fontSize: 14
                    }}>
                      National ID
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={{
                      backgroundColor: governmentIdType === 'passport' ? '#3B82F6' : '#F1F5F9',
                      borderRadius: 8,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      marginRight: 10,
                      marginBottom: 10
                    }}
                    onPress={() => setGovernmentIdType('passport')}
                    disabled={loading}
                  >
                    <Text style={{ 
                      color: governmentIdType === 'passport' ? '#FFF' : '#64748B',
                      fontWeight: '500',
                      fontSize: 14
                    }}>
                      Passport
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={{
                      backgroundColor: governmentIdType === 'drivers_license' ? '#3B82F6' : '#F1F5F9',
                      borderRadius: 8,
                      paddingVertical: 6,
                      paddingHorizontal: 12
                    }}
                    onPress={() => setGovernmentIdType('drivers_license')}
                    disabled={loading}
                  >
                    <Text style={{ 
                      color: governmentIdType === 'drivers_license' ? '#FFF' : '#64748B',
                      fontWeight: '500',
                      fontSize: 14
                    }}>
                      Driver's License
                    </Text>
                  </TouchableOpacity>
                </View>
              </InputGroup>
              
              <Label>Upload Government ID</Label>
              {governmentId ? (
                <ImagePreviewContainer>
                  <ImagePreview source={{ uri: governmentId }} />
                  <RemoveButton onPress={() => setGovernmentId(null)}>
                    <Ionicons name="close" size={18} color="#EF4444" />
                  </RemoveButton>
                </ImagePreviewContainer>
              ) : (
                <UploadContainer onPress={pickGovernmentId} disabled={loading}>
                  <Ionicons name="card-outline" size={30} color="#3B82F6" />
                  <UploadText>Upload {governmentIdType === 'national_id' ? 'National ID' : governmentIdType === 'passport' ? 'Passport' : "Driver's License"}</UploadText>
                </UploadContainer>
              )}
              <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 0, marginBottom: 15, fontStyle: 'italic' }}>
                Your ID will be used for verification only and stored securely.
              </Text>
              
              <Label>Portfolio Image</Label>
              {portfolioImage ? (
                <ImagePreviewContainer>
                  <ImagePreview source={{ uri: portfolioImage }} />
                  <RemoveButton onPress={() => setPortfolioImage(null)}>
                    <Ionicons name="close" size={18} color="#EF4444" />
                  </RemoveButton>
                </ImagePreviewContainer>
              ) : (
                <UploadContainer onPress={pickImage} disabled={loading}>
                  <Ionicons name="cloud-upload-outline" size={30} color="#3B82F6" />
                  <UploadText>Upload portfolio image</UploadText>
                </UploadContainer>
              )}
              
              <CheckboxContainer onPress={() => setAcceptedTerms(!acceptedTerms)} disabled={loading}>
                <View style={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: 4, 
                  borderWidth: 2, 
                  borderColor: acceptedTerms ? '#3B82F6' : '#CBD5E1',
                  backgroundColor: acceptedTerms ? '#3B82F6' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {acceptedTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <CheckboxText>
                  I agree to the designer terms and verification process. I understand my account will be reviewed before being verified.
                </CheckboxText>
              </CheckboxContainer>
              
              <View style={{ backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, marginTop: 10 }}>
                <Text style={{ fontSize: 13, color: '#92400E', lineHeight: 18 }}>
                  <Text style={{ fontWeight: 'bold' }}>Note:</Text> By providing your tax information and government ID, you are authorizing us to perform identity verification. Your information is encrypted and securely stored.
                </Text>
              </View>
            </DesignerVerificationContainer>
          )}
          
          <PolicyText>
            By signing up, you agree to our{' '}
            <HighlightedText>Terms of Service</HighlightedText> and{' '}
            <HighlightedText>Privacy Policy</HighlightedText>
          </PolicyText>
          
          <SignUpButton onPress={handleSignUp} disabled={loading}>
            <ButtonText>Create Account</ButtonText>
          </SignUpButton>
          
          <LoginContainer>
            <LoginText>Already have an account?</LoginText>
            <LoginLink onPress={() => navigation.navigate('Login')}>
              <LoginLinkText>Log In</LoginLinkText>
            </LoginLink>
          </LoginContainer>
        </FormContainer>
      </ScrollContainer>
      
      {loading && (
        <LoadingContainer>
          <LottieView
            source={require('../assets/loader.json')}
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
        </LoadingContainer>
      )}
    </Container>
  );
};

export default SignUpScreen; 
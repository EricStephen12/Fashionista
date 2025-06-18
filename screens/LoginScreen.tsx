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
  ActivityIndicator
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from '../UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, VerificationStatus } from '../UserContext';

const { width, height } = Dimensions.get('window');

// Keys for AsyncStorage
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

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

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: #fff;
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

const GradientHeader = styled(LinearGradient)`
  height: ${height * 0.35}px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  padding-top: ${Platform.OS === 'ios' ? 50 : 30}px;
  align-items: center;
  justify-content: center;
`;

let LottieView: any;
if (Platform.OS === 'web') {
  LottieView = require('lottie-react').default;
} else {
  LottieView = require('lottie-react-native').default;
}

const Logo = styled.View`
  width: 120px;
  height: 120px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const LottieContainer = styled.View`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
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

const ForgotPassword = styled.TouchableOpacity`
  align-self: flex-end;
  margin-bottom: 24px;
`;

const ForgotPasswordText = styled.Text`
  color: #3B82F6;
  font-size: 14px;
  font-weight: 500;
`;

const RoleSelectorContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 24px;
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

const LoginButton = styled.TouchableOpacity<{ disabled?: boolean }>`
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

const SignUpContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`;

const SignUpText = styled.Text`
  color: #64748B;
  font-size: 14px;
`;

const SignUpLink = styled.TouchableOpacity`
  margin-left: 5px;
`;

const SignUpLinkText = styled.Text`
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

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'designer'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Clear error when inputs change
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [email, password, role]);

  const handleLogin = () => {
    // Reset error message
    setErrorMessage(null);
    
    // Validate inputs
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Simulate random login failures (20% chance)
      const simulateFailure = Math.random() < 0.2;
      
      if (simulateFailure) {
        setLoading(false);
        setErrorMessage('Invalid email or password. Please try again.');
        return;
      }
      
      // Create mock user data
      const mockUser: User = {
        id: `user-${Math.random().toString(36).substring(2, 10)}`,
        name: role === 'designer' ? 'John Designer' : 'Sarah Customer',
        email: email,
        role: role,
        profileImage: `https://randomuser.me/api/portraits/${role === 'designer' ? 'men' : 'women'}/32.jpg`,
        brandName: role === 'designer' ? 'JD Fashion' : undefined,
        bio: role === 'designer' ? 'Creating sustainable fashion since 2020' : undefined,
        verificationStatus: role === 'designer' ? 'pending' as VerificationStatus : undefined,
        designerTier: role === 'designer' ? 'standard' : undefined
      };
      
      // Set user in context
      setUser(mockUser);
      setLoading(false);
      
      // Navigate to MainTabs
      navigation.navigate('MainTabs');
    }, 1500);
  };

  // Mark onboarding as completed and auto-login the user
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      // No longer auto-login after onboarding
    } catch (error) {
      console.error('Error marking onboarding as completed:', error);
    }
  };

  const ErrorMessage = styled.Text`
    color: #EF4444;
    font-size: 14px;
    margin-bottom: 16px;
    text-align: center;
  `;

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollContainer contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <GradientHeader
          colors={['#3B82F6', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </BackButton>
          
          {!isKeyboardVisible && (
            <Logo>
              <View style={{ width: 150, height: 150, justifyContent: 'center', alignItems: 'center' }}>
                <LottieView
  {...(Platform.OS === 'web'
    ? { animationData: require('../assets/6hrjrTd79j.json') }
    : { source: require('../assets/6hrjrTd79j.json') })}
  autoPlay
  loop
  style={{ width: 100, height: 100 }}
/>
              </View>
            </Logo>
          )}
        </GradientHeader>
        
        <FormContainer entering={FadeInUp.duration(500).delay(100)}>
          <Title>Welcome back</Title>
          
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          
          <InputGroup>
            <Label>Email</Label>
            <InputContainer style={{ borderColor: errorMessage && !email.trim() ? '#EF4444' : 'transparent', borderWidth: 1 }}>
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
            <InputContainer style={{ borderColor: errorMessage && !password ? '#EF4444' : 'transparent', borderWidth: 1 }}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
              <Input
                placeholder="Enter your password"
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
          
          <ForgotPassword>
            <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
          </ForgotPassword>
          
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
          
          <LoginButton onPress={handleLogin} disabled={loading}>
            <ButtonText>{loading ? 'Logging in...' : 'Log In'}</ButtonText>
          </LoginButton>
          
          <SignUpContainer>
            <SignUpText>Don't have an account?</SignUpText>
            <SignUpLink onPress={() => navigation.navigate('SignUp')}>
              <SignUpLinkText>Sign Up</SignUpLinkText>
            </SignUpLink>
          </SignUpContainer>
        </FormContainer>
      </ScrollContainer>
      
      {loading && (
        <LoadingContainer>
          <ActivityIndicator size="large" color="#3B82F6" />
        </LoadingContainer>
      )}
    </Container>
  );
};

export default LoginScreen; 
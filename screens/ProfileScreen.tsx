import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal,
  
  Image,
  ActivityIndicator
} from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useUser } from '../UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../src/MainTabs';

type ProfileScreenNavigationProp = NavigationProp<RootStackParamList>;

interface User {
  id: string;
  name: string;
  role: 'designer' | 'customer';
  avatar?: string;
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 65;

const Container = styled.View`
  flex: 1;
  background-color: #f8fafd;
`;

const Header = styled(LinearGradient)`
  padding: 20px;
  padding-top: ${Platform.OS === 'ios' ? '60px' : '40px'};
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const ProfileSection = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const AvatarContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 15px;
  border-width: 3px;
  border-color: white;
  overflow: hidden;
`;

const Avatar = styled.Image`
  width: 100%;
  height: 100%;
`;

const Name = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
`;

const Role = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: capitalize;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const Section = styled(Animated.View)`
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 15px;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
  border-bottom-width: ${(props: { isLast?: boolean }) => props.isLast ? '0' : '1px'};
  border-bottom-color: #f3f4f6;
`;

const MenuIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props: { color: string }) => props.color};
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const MenuText = styled.Text`
  font-size: 16px;
  color: #1a1a2e;
  flex: 1;
`;

const Badge = styled.View`
  background-color: #FF4757;
  padding: 4px 8px;
  border-radius: 12px;
  margin-left: 10px;
`;

const BadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const StatItem = styled.View`
  align-items: center;
`;

const StatValue = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 5px;
`;

const StatLabel = styled.Text`
  font-size: 14px;
  color: #64748B;
`;

const BottomSpacer = styled.View`
  height: ${TAB_BAR_HEIGHT}px;
`;

const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
`;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const isDesigner = user?.role === 'designer';

  const handleLogout = () => {
    console.log('[ProfileScreen] Logout button pressed');
    setLogoutModalVisible(true);
  };

  const handleCustomerSupport = () => {
    navigation.navigate('CustomerSupport');
  };

  const renderCustomerContent = () => (
    <>
      <Section entering={FadeInDown.delay(200)}>
        <SectionTitle>My Activity</SectionTitle>
        <StatsContainer>
          <StatItem>
            <StatValue>12</StatValue>
            <StatLabel>Orders</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>5</StatValue>
            <StatLabel>Reviews</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>8</StatValue>
            <StatLabel>Wishlist</StatLabel>
          </StatItem>
        </StatsContainer>
        <MenuItem onPress={() => navigation.navigate('Orders')}>
          <MenuIcon color="#E8DEF8">
            <Ionicons name="receipt-outline" size={22} color="#7c4dff" />
          </MenuIcon>
          <MenuText>My Orders</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </MenuItem>
        <MenuItem>
          <MenuIcon color="#DCF8EF">
            <Ionicons name="heart-outline" size={22} color="#10B981" />
          </MenuIcon>
          <MenuText>Wishlist</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </MenuItem>
        <MenuItem isLast>
          <MenuIcon color="#FFE4E5">
            <Ionicons name="star-outline" size={22} color="#FF4757" />
          </MenuIcon>
          <MenuText>My Reviews</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </MenuItem>
      </Section>

      <Section entering={FadeInDown.delay(300)}>
        <SectionTitle>Measurements & Preferences</SectionTitle>
        <MenuItem>
          <MenuIcon color="#E8DEF8">
            <Ionicons name="body-outline" size={22} color="#7c4dff" />
          </MenuIcon>
          <MenuText>My Measurements</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </MenuItem>
        <MenuItem isLast>
          <MenuIcon color="#DCF8EF">
            <Ionicons name="color-palette-outline" size={22} color="#10B981" />
          </MenuIcon>
          <MenuText>Style Preferences</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </MenuItem>
      </Section>
    </>
  );

  const renderDesignerContent = () => (
    <>
      <Section entering={FadeInDown.delay(200)}>
        <SectionTitle>Store Performance</SectionTitle>
        <StatsContainer>
          <StatItem>
            <StatValue>45</StatValue>
            <StatLabel>Products</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>128</StatValue>
            <StatLabel>Orders</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>4.8</StatValue>
            <StatLabel>Rating</StatLabel>
          </StatItem>
        </StatsContainer>
        <MenuItem onPress={() => navigation.navigate('MyProducts')}>
          <MenuIcon color="#10B981">
            <Ionicons name="shirt-outline" size={20} color="white" />
          </MenuIcon>
          <MenuText>My Products</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </MenuItem>
        <MenuItem onPress={() => navigation.navigate('Orders')}>
          <MenuIcon color="#DCF8EF">
            <Ionicons name="receipt-outline" size={22} color="#10B981" />
          </MenuIcon>
          <MenuText>Orders</MenuText>
          <Badge>
            <BadgeText>3</BadgeText>
          </Badge>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </MenuItem>
        <MenuItem isLast>
          <MenuIcon color="#FFE4E5">
            <Ionicons name="stats-chart-outline" size={22} color="#FF4757" />
          </MenuIcon>
          <MenuText>Analytics</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </MenuItem>
      </Section>

      <Section entering={FadeInDown.delay(300)}>
        <SectionTitle>Store Management</SectionTitle>
        <MenuItem>
          <MenuIcon color="#E8DEF8">
            <Ionicons name="storefront-outline" size={22} color="#7c4dff" />
          </MenuIcon>
          <MenuText>Store Settings</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </MenuItem>
        <MenuItem isLast>
          <MenuIcon color="#DCF8EF">
            <Ionicons name="card-outline" size={22} color="#10B981" />
          </MenuIcon>
          <MenuText>Payment Settings</MenuText>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </MenuItem>
      </Section>
    </>
  );

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Header colors={['#7c4dff', '#6c3dff']}>
        <ProfileSection>
          <AvatarContainer>
            <Avatar source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }} />
          </AvatarContainer>
          <Name>{user?.name || 'User'}</Name>
          <Role>{user?.role || 'customer'}</Role>
        </ProfileSection>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        {isDesigner ? renderDesignerContent() : renderCustomerContent()}
        <Section entering={FadeInDown.delay(400)}>
          <SectionTitle>Settings & Support</SectionTitle>
          <MenuItem onPress={handleCustomerSupport}>
            <MenuIcon color="#10B981">
              <Ionicons name="headset-outline" size={20} color="white" />
            </MenuIcon>
            <MenuText>Customer Support</MenuText>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          </MenuItem>
          <MenuItem onPress={handleLogout} isLast>
            <MenuIcon color="#FF4757">
              <Ionicons name="log-out-outline" size={20} color="white" />
            </MenuIcon>
            <MenuText>Logout</MenuText>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          </MenuItem>
        </Section>
        <BottomSpacer />
      </Content>

      {/* Logout Confirmation Modal */}
      <Modal
        transparent
        visible={logoutModalVisible}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <ModalBackdrop>
          <ModalBox>
            <ModalTitle>Are you sure you want to logout?</ModalTitle>
            <ModalButtons>
              <CancelButton onPress={() => setLogoutModalVisible(false)}>
                <ButtonText>No</ButtonText>
              </CancelButton>
              <ConfirmButton onPress={async () => {
                setLogoutModalVisible(false);
                setIsLoading(true);
                await logout();
                navigation.reset({ index:0, routes:[{ name: 'Login' }] });
                setIsLoading(false);
              }}>
                <ButtonText style={{color:'white'}}>Yes</ButtonText>
              </ConfirmButton>
            </ModalButtons>
          </ModalBox>
        </ModalBackdrop>
      </Modal>

      {isLoading && (
        <LoadingOverlay>
          <ActivityIndicator size="large" color="#7c4dff" />
        </LoadingOverlay>
      )}
    </Container>
  );
};

// Modal styled components
const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.4);
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.View`
  width: 90%;
  background-color: white;
  border-radius: 24px;
  padding: 30px 25px 20px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  elevation: 6;
`;


const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #1a1a2e;
  text-align: center;
  margin-bottom: 20px;
`;

const ModalButtons = styled.View`
  flex-direction: row;
  width: 100%;
  margin-top: 10px;
  flex-direction: row;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px 0;
  border-radius: 10px;
  background-color: #f3f4f6;
  margin-right: 8px;
  align-items: center;
`;


const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px 0;
  border-radius: 10px;
  background-color: #7c4dff;
  align-items: center;
`;


const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
`;

export default ProfileScreen;

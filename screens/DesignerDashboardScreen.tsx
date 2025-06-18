import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { 
  ScrollView, 
  Dimensions, 
  View as RNView,
  Text as RNText,
  TouchableOpacity, 
  StatusBar,
  Platform,
  Image,
  FlatList,
  TextProps,
  Switch,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useUser } from '../UserContext';
import { PieChart, LineChart } from 'react-native-chart-kit';
import NotificationBell from '../components/NotificationBell';
import mockService from '../src/services/mockData';

const { width, height } = Dimensions.get('window');

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f8fafd;
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const Header = styled(LinearGradient).attrs({
  colors: ['#7c4dff', '#9254de'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  padding: 20px;
  padding-top: ${Platform.OS === 'ios' ? '60px' : '30px'};
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const WelcomeContainer = styled.View`
  flex: 1;
`;

const GreetingText = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
`;

const DesignerName = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: white;
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border-width: 2px;
  border-color: white;
`;

const InsightTabs = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`;

const InsightTab = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 16px;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border-radius: 20px;
  margin-right: 10px;
`;

const InsightTabText = styled.Text<{ active: boolean }>`
  color: white;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const OverviewCards = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px;
  margin-top: -30px;
`;

const StatCard = styled(Animated.View)`
  width: 48%;
  background-color: white;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
`;

const StatCardRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StatIconBg = styled.View<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.color + '15'}; /* 15 is for opacity */
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1a1a2e;
  margin: 8px 0;
`;

const StatLabel = styled.Text`
  font-size: 14px;
  color: #64748B;
`;

const StatChange = styled.View<{ positive: boolean }>`
  flex-direction: row;
  align-items: center;
`;

const StatChangeValue = styled.Text<{ positive: boolean }>`
  font-size: 12px;
  color: ${props => props.positive ? '#10B981' : '#EF4444'};
  margin-left: 4px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1a1a2e;
  margin: 20px;
  margin-bottom: 10px;
`;

const ChartContainer = styled.View`
  background-color: white;
  margin: 0 20px;
  border-radius: 20px;
  padding: 20px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
`;

const ChartHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ChartTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1a1a2e;
`;

const PeriodSelector = styled.View`
  flex-direction: row;
  background-color: #f1f5f9;
  border-radius: 15px;
  padding: 2px;
`;

const PeriodOption = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${props => props.active ? '#7c4dff' : 'transparent'};
  padding: 6px 12px;
  border-radius: 12px;
`;

const PeriodText = styled.Text<{ active: boolean }>`
  color: ${props => props.active ? 'white' : '#64748B'};
  font-size: 12px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const QuickActions = styled.View`
  flex-direction: row;
  padding: 0 10px;
  margin-bottom: 20px;
`;

const QuickActionButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: white;
  margin: 0 10px;
  border-radius: 15px;
  padding: 15px 0;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
`;

const QuickActionIcon = styled.View<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => props.color + '15'};
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const QuickActionText = styled.Text`
  font-size: 14px;
  color: #1a1a2e;
  font-weight: 500;
`;

const RecentOrdersCard = styled.View`
  background-color: white;
  margin: 20px;
  border-radius: 20px;
  overflow: hidden;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
`;

const OrderHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f1f5f9;
`;

const ViewAllButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const ViewAllText = styled.Text`
  color: #7c4dff;
  font-size: 14px;
  margin-right: 4px;
`;

const OrderItem = styled.TouchableOpacity`
  flex-direction: row;
  padding: 15px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f1f5f9;
`;

const OrderImageContainer = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 15px;
`;

const OrderImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const OrderInfo = styled.View`
  flex: 1;
`;

const OrderTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1a1a2e;
  margin-bottom: 4px;
`;

const OrderMeta = styled.View`
  flex-direction: row;
  align-items: center;
`;

const OrderMetaText = styled.Text`
  font-size: 14px;
  color: #64748B;
  margin-right: 10px;
`;

const OrderStatus = styled.View<{ status: 'pending' | 'shipped' | 'delivered' }>`
  background-color: ${props => {
    switch(props.status) {
      case 'pending': return '#FEF3C7';
      case 'shipped': return '#DBEAFE';
      case 'delivered': return '#D1FAE5';
      default: return '#F3F4F6';
    }
  }};
  padding: 4px 8px;
  border-radius: 8px;
`;

const OrderStatusText = styled.Text<{ status: 'pending' | 'shipped' | 'delivered' }>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => {
    switch(props.status) {
      case 'pending': return '#D97706';
      case 'shipped': return '#2563EB';
      case 'delivered': return '#059669';
      default: return '#6B7280';
    }
  }};
`;

const OrderPrice = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #7c4dff;
`;

const VerificationBadge = styled.View<{ status: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${props => {
    switch (props.status) {
      case 'verified': return 'rgba(34, 197, 94, 0.2)';
      case 'pending': return 'rgba(234, 179, 8, 0.2)';
      case 'rejected': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(148, 163, 184, 0.2)';
    }
  }};
  padding: 4px 8px;
  border-radius: 12px;
  margin-top: 5px;
`;

const VerificationText = styled.Text<{ status: string }>`
  color: ${props => {
    switch (props.status) {
      case 'verified': return '#16a34a';
      case 'pending': return '#ca8a04';
      case 'rejected': return '#dc2626';
      default: return '#64748B';
    }
  }};
  font-size: 12px;
  font-weight: 500;
  margin-left: 4px;
`;

const AvailabilityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 20px;
  margin-top: 10px;
`;

const AvailabilityText = styled.Text`
  color: white;
  font-size: 14px;
  margin-right: 10px;
`;

const AvailabilityStatus = styled.Text<{ isAvailable: boolean }>`
  color: ${props => props.isAvailable ? '#10B981' : '#EF4444'};
  font-weight: bold;
  font-size: 14px;
  margin-right: 10px;
`;

// Mock data
const mockRecentOrders = [
  {
    id: 'o1',
    productName: 'Summer Floral Dress',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1534302634951-e87d02139c0b?auto=format&fit=crop&w=800&q=80',
    customer: 'Sarah Johnson',
    date: '2 hours ago',
    status: 'pending' as const
  },
  {
    id: 'o2',
    productName: 'Elegant Silk Blouse',
    price: '$80',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec314c5?auto=format&fit=crop&w=800&q=80',
    customer: 'Michael Brown',
    date: '5 hours ago',
    status: 'shipped' as const
  },
  {
    id: 'o3',
    productName: 'Classic Linen Pants',
    price: '$95',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    customer: 'Emily Davis',
    date: 'Yesterday',
    status: 'delivered' as const
  },
];

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(124, 77, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false
};

// Mock data for recent messages
const mockRecentMessages = [
  {
    id: 'msg1',
    customerName: 'Sarah Johnson',
    customerAvatar: 'https://i.pravatar.cc/150?img=32',
    message: 'I have a question about the Summer Floral Dress sizing...',
    time: '2 hours ago',
    productId: 'p1',
    productName: 'Summer Floral Dress',
    unread: true
  },
  {
    id: 'msg2',
    customerName: 'Emily Wilson',
    customerAvatar: 'https://i.pravatar.cc/150?img=29',
    message: 'When will my Elegant Silk Blouse be shipped?',
    time: '5 hours ago',
    orderId: 'ord2',
    productName: 'Elegant Silk Blouse',
    unread: false
  },
  {
    id: 'msg3',
    customerName: 'Michael Brown',
    customerAvatar: 'https://i.pravatar.cc/150?img=59',
    message: 'Thank you for the quick delivery!',
    time: 'Yesterday',
    orderId: 'ord3',
    productName: 'Classic Linen Pants',
    unread: false
  },
];

// Define navigation type
type RootStackParamList = {
  AddProduct: undefined;
  Chat: { contactId: string; productId?: string; orderId?: string; initialMessage?: string };
};

type DashboardNavigationProp = NavigationProp<RootStackParamList>;

const Text = styled(RNText)``;
const View = styled(RNView)``;

const DesignerDashboardScreen = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user } = useUser();
  const [activeInsight, setActiveInsight] = useState('week');
  const [activePeriod, setActivePeriod] = useState('week');
  const [isAvailable, setIsAvailable] = useState(true);
  
  useEffect(() => {
    // Fetch designer data including availability status
    const fetchDesignerData = async () => {
      if (user && user.id) {
        try {
          const designerData = await mockService.getDesignerById(user.id);
          if (designerData && designerData.availability) {
            setIsAvailable(designerData.availability === 'available');
          }
        } catch (error) {
          console.error('Error fetching designer data:', error);
        }
      }
    };
    
    fetchDesignerData();
  }, [user]);
  
  const handleToggleAvailability = async () => {
    if (user && user.id) {
      try {
        const updatedDesigner = await mockService.toggleDesignerAvailability(user.id);
        if (updatedDesigner) {
          setIsAvailable(updatedDesigner.availability === 'available');
          Alert.alert(
            'Status Updated',
            `You are now ${updatedDesigner.availability === 'available' ? 'available' : 'unavailable'} for new customer inquiries.`,
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error toggling availability:', error);
      }
    }
  };
  
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };
  
  const getVerificationStatus = () => {
    if (!user) return 'unverified';
    return user.verificationStatus || 'unverified';
  };
  
  const getVerificationText = () => {
    const status = getVerificationStatus();
    switch (status) {
      case 'verified': return 'Verified Designer';
      case 'pending': return 'Verification Pending';
      case 'rejected': return 'Verification Rejected';
      default: return 'Unverified';
    }
  };
  
  const getVerificationIcon = () => {
    const status = getVerificationStatus();
    switch (status) {
      case 'verified': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'rejected': return 'close-circle';
      default: return 'alert-circle';
    }
  };
  
  // Sample data for charts
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        color: (opacity = 1) => `rgba(124, 77, 255, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };

  const handleMessagePress = (message: typeof mockRecentMessages[0]) => {
    navigation.navigate('Chat', {
      contactId: `customer-${message.id}`,
      productId: message.productId,
      orderId: message.orderId,
      initialMessage: message.orderId 
        ? `Hello ${message.customerName}, I'm messaging you about your order for ${message.productName}.`
        : undefined
    });
  };

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Content showsVerticalScrollIndicator={false}>
        <Header>
          <TopBar>
            <WelcomeContainer>
              <GreetingText>Good {getTimeOfDay()},</GreetingText>
              <DesignerName>{user?.name || 'Designer'}</DesignerName>
              <VerificationBadge status={getVerificationStatus()}>
                <Ionicons 
                  name={getVerificationIcon()} 
                  size={12} 
                  color={
                    getVerificationStatus() === 'verified' ? '#16a34a' : 
                    getVerificationStatus() === 'pending' ? '#ca8a04' : 
                    getVerificationStatus() === 'rejected' ? '#dc2626' : '#64748B'
                  } 
                />
                <VerificationText status={getVerificationStatus()}>
                  {getVerificationText()}
                </VerificationText>
              </VerificationBadge>
              <AvailabilityContainer>
                <AvailabilityText>Status:</AvailabilityText>
                <AvailabilityStatus isAvailable={isAvailable}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </AvailabilityStatus>
                <Switch
                  value={isAvailable}
                  onValueChange={handleToggleAvailability}
                  trackColor={{ false: '#EF444430', true: '#10B98130' }}
                  thumbColor={isAvailable ? '#10B981' : '#EF4444'}
                />
              </AvailabilityContainer>
            </WelcomeContainer>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <NotificationBell />
              <Avatar 
                source={{ uri: user?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              />
            </View>
          </TopBar>
          
          <InsightTabs>
            <InsightTab 
              active={activeInsight === 'week'} 
              onPress={() => setActiveInsight('week')}
            >
              <InsightTabText active={activeInsight === 'week'}>This Week</InsightTabText>
            </InsightTab>
            <InsightTab 
              active={activeInsight === 'month'} 
              onPress={() => setActiveInsight('month')}
            >
              <InsightTabText active={activeInsight === 'month'}>This Month</InsightTabText>
            </InsightTab>
            <InsightTab 
              active={activeInsight === 'year'} 
              onPress={() => setActiveInsight('year')}
            >
              <InsightTabText active={activeInsight === 'year'}>This Year</InsightTabText>
            </InsightTab>
          </InsightTabs>
        </Header>
        
        <OverviewCards>
          <StatCard entering={FadeInDown.delay(100).duration(500)} style={{ marginRight: '4%' }}>
            <StatCardRow>
              <StatIconBg color="#7c4dff">
                <Ionicons name="wallet-outline" size={24} color="#7c4dff" />
              </StatIconBg>
              <StatChange positive={true}>
                <Ionicons name="arrow-up" size={14} color="#10B981" />
                <StatChangeValue positive={true}>12%</StatChangeValue>
              </StatChange>
            </StatCardRow>
            <StatValue>$1,250</StatValue>
            <StatLabel>Revenue</StatLabel>
          </StatCard>
          
          <StatCard entering={FadeInDown.delay(200).duration(500)}>
            <StatCardRow>
              <StatIconBg color="#10B981">
                <Ionicons name="cart-outline" size={24} color="#10B981" />
              </StatIconBg>
              <StatChange positive={true}>
                <Ionicons name="arrow-up" size={14} color="#10B981" />
                <StatChangeValue positive={true}>5%</StatChangeValue>
              </StatChange>
            </StatCardRow>
            <StatValue>32</StatValue>
            <StatLabel>Orders</StatLabel>
          </StatCard>
          
          <StatCard entering={FadeInDown.delay(300).duration(500)} style={{ marginRight: '4%' }}>
            <StatCardRow>
              <StatIconBg color="#F59E0B">
                <Ionicons name="eye-outline" size={24} color="#F59E0B" />
              </StatIconBg>
              <StatChange positive={true}>
                <Ionicons name="arrow-up" size={14} color="#10B981" />
                <StatChangeValue positive={true}>18%</StatChangeValue>
              </StatChange>
            </StatCardRow>
            <StatValue>1,420</StatValue>
            <StatLabel>Views</StatLabel>
          </StatCard>
          
          <StatCard entering={FadeInDown.delay(400).duration(500)}>
            <StatCardRow>
              <StatIconBg color="#EF4444">
                <Ionicons name="heart-outline" size={24} color="#EF4444" />
              </StatIconBg>
              <StatChange positive={false}>
                <Ionicons name="arrow-down" size={14} color="#EF4444" />
                <StatChangeValue positive={false}>3%</StatChangeValue>
              </StatChange>
            </StatCardRow>
            <StatValue>86</StatValue>
            <StatLabel>Likes</StatLabel>
          </StatCard>
        </OverviewCards>
        
        <SectionTitle>Quick Actions</SectionTitle>
        
        <QuickActions>
          <QuickActionButton onPress={() => navigation.navigate('AddProduct')}>
            <QuickActionIcon color="#7c4dff">
              <Ionicons name="add" size={28} color="#7c4dff" />
            </QuickActionIcon>
            <QuickActionText>Add Product</QuickActionText>
          </QuickActionButton>
          
          <QuickActionButton>
            <QuickActionIcon color="#10B981">
              <Ionicons name="stats-chart" size={24} color="#10B981" />
            </QuickActionIcon>
            <QuickActionText>Analytics</QuickActionText>
          </QuickActionButton>
          
          <QuickActionButton>
            <QuickActionIcon color="#F59E0B">
              <Ionicons name="card" size={24} color="#F59E0B" />
            </QuickActionIcon>
            <QuickActionText>Earnings</QuickActionText>
          </QuickActionButton>
        </QuickActions>
        
        <SectionTitle>Sales Overview</SectionTitle>
        
        <ChartContainer>
          <ChartHeader>
            <ChartTitle>Revenue</ChartTitle>
            <PeriodSelector>
              <PeriodOption 
                active={activePeriod === 'week'} 
                onPress={() => setActivePeriod('week')}
              >
                <PeriodText active={activePeriod === 'week'}>Week</PeriodText>
              </PeriodOption>
              <PeriodOption 
                active={activePeriod === 'month'} 
                onPress={() => setActivePeriod('month')}
              >
                <PeriodText active={activePeriod === 'month'}>Month</PeriodText>
              </PeriodOption>
              <PeriodOption 
                active={activePeriod === 'year'} 
                onPress={() => setActivePeriod('year')}
              >
                <PeriodText active={activePeriod === 'year'}>Year</PeriodText>
              </PeriodOption>
            </PeriodSelector>
          </ChartHeader>
          
          <LineChart
            data={lineData}
            width={width - 80}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              borderRadius: 16,
              paddingRight: 0,
            }}
          />
        </ChartContainer>
        
        <SectionTitle>Recent Messages</SectionTitle>
        
        <RecentOrdersCard>
          <OrderHeader>
            <ChartTitle>Customer Messages</ChartTitle>
            <ViewAllButton>
              <ViewAllText>View All</ViewAllText>
              <Ionicons name="chevron-forward" size={14} color="#7c4dff" />
            </ViewAllButton>
          </OrderHeader>
          
          {mockRecentMessages.map(message => (
            <OrderItem 
              key={message.id} 
              onPress={() => handleMessagePress(message)}
            >
              <OrderImageContainer>
                <OrderImage source={{ uri: message.customerAvatar }} />
              </OrderImageContainer>
              <OrderInfo>
                <OrderTitle>{message.customerName}</OrderTitle>
                <OrderMeta>
                  <OrderMetaText numberOfLines={1}>
                    {message.message}
                  </OrderMetaText>
                </OrderMeta>
              </OrderInfo>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 5 }}>{message.time}</Text>
                {message.unread && (
                  <View style={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: 5, 
                    backgroundColor: '#7c4dff' 
                  }} />
                )}
              </View>
            </OrderItem>
          ))}
        </RecentOrdersCard>
        
        <RecentOrdersCard>
          <OrderHeader>
            <ChartTitle>Recent Orders</ChartTitle>
            <ViewAllButton>
              <ViewAllText>View All</ViewAllText>
              <Ionicons name="chevron-forward" size={14} color="#7c4dff" />
            </ViewAllButton>
          </OrderHeader>
          
          {mockRecentOrders.map(order => (
            <OrderItem key={order.id} onPress={() => console.log(`View order ${order.id}`)}>
              <OrderImageContainer>
                <OrderImage source={{ uri: order.image }} />
              </OrderImageContainer>
              <OrderInfo>
                <OrderTitle>{order.productName}</OrderTitle>
                <OrderMeta>
                  <OrderMetaText>{order.customer}</OrderMetaText>
                  <OrderMetaText>{order.date}</OrderMetaText>
                </OrderMeta>
              </OrderInfo>
              <View>
                <OrderPrice>{order.price}</OrderPrice>
                <OrderStatus status={order.status}>
                  <OrderStatusText status={order.status}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </OrderStatusText>
                </OrderStatus>
              </View>
            </OrderItem>
          ))}
        </RecentOrdersCard>
      </Content>
    </Container>
  );
};

export default DesignerDashboardScreen; 
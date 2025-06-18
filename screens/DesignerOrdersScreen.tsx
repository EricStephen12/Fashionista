import React, { useState } from 'react';
import styled from 'styled-components/native';
import { 
  View, 
  Text, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  FlatList,
  Image,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useUser } from '../UserContext';
import { RootStackParamList } from '../src/MainTabs';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: #f8fafd;
`;

const StatusBarBg = styled.View`
  height: ${StatusBar.currentHeight || 0}px;
  background-color: #7c4dff;
`;

const Header = styled.View`
  padding: 20px;
  padding-top: ${Platform.OS === 'ios' ? '60px' : '20px'};
  background-color: #7c4dff;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PageTitle = styled.Text`
  font-size: 24px;
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

const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StatBox = styled.View`
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 15px;
  width: 48%;
  align-items: center;
`;

const StatValue = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const StatLabel = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
`;

const TabsContainer = styled.View`
  flex-direction: row;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 10px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  background-color: ${props => props.active ? 'white' : 'transparent'};
  padding: 10px 0;
  border-radius: 8px;
  align-items: center;
`;

const TabText = styled.Text<{ active: boolean }>`
  color: ${props => props.active ? '#7c4dff' : 'white'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  font-size: 14px;
`;

const ContentSection = styled.View`
  flex: 1;
  padding: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 15px;
`;

const OrderCard = styled(Animated.View)`
  background-color: white;
  border-radius: 16px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
  elevation: 3;
  overflow: hidden;
`;

const OrderHeader = styled.View`
  flex-direction: row;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f1f5f9;
  align-items: center;
`;

const OrderImageContainer = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 12px;
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
  font-weight: 600;
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
  margin-right: 8px;
`;

const OrderPrice = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #7c4dff;
  margin-left: auto;
`;

const OrderBody = styled.View`
  padding: 16px;
`;

const CustomerInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const CustomerAvatar = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  margin-right: 10px;
`;

const CustomerName = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: #1a1a2e;
`;

const OrderDetail = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const OrderDetailLabel = styled.Text`
  width: 100px;
  font-size: 14px;
  color: #64748B;
`;

const OrderDetailValue = styled.Text`
  flex: 1;
  font-size: 14px;
  color: #1a1a2e;
  font-weight: 500;
`;

const OrderStatus = styled.View<{ status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }>`
  background-color: ${props => {
    switch(props.status) {
      case 'pending': return '#FEF3C7';
      case 'processing': return '#E0E7FF';
      case 'shipped': return '#DBEAFE';
      case 'delivered': return '#D1FAE5';
      case 'cancelled': return '#FEE2E2';
      default: return '#F3F4F6';
    }
  }};
  padding: 6px 12px;
  border-radius: 8px;
  align-self: flex-start;
  margin-bottom: 12px;
`;

const OrderStatusText = styled.Text<{ status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => {
    switch(props.status) {
      case 'pending': return '#D97706';
      case 'processing': return '#4F46E5';
      case 'shipped': return '#2563EB';
      case 'delivered': return '#059669';
      case 'cancelled': return '#DC2626';
      default: return '#6B7280';
    }
  }};
`;

const ActionButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-top-width: 1px;
  border-top-color: #f1f5f9;
  padding-top: 12px;
  margin-top: 12px;
`;

const ActionButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const ActionButtonText = styled.Text`
  color: #64748B;
  font-size: 14px;
  margin-left: 6px;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

const EmptyStateIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #f1f5f9;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const EmptyStateTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 8px;
  text-align: center;
`;

const EmptyStateDescription = styled.Text`
  font-size: 14px;
  color: #64748B;
  text-align: center;
  margin-bottom: 20px;
  max-width: 250px;
`;

// Mock data for orders
const mockOrders = [
  {
    id: 'ord1',
    productName: 'Summer Floral Dress',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1534302624301-d6897b45d108?auto=format&fit=crop&w=800&q=80',
    customer: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=32',
      address: '123 Main Street, New York, NY 10001'
    },
    orderDate: '2023-08-15',
    requestedDelivery: '2023-08-30',
    status: 'processing' as const,
    notes: 'Please ensure the correct measurements are used as discussed in chat',
    orderNumber: 'ORD-2023-0015'
  },
  {
    id: 'ord2',
    productName: 'Elegant Silk Blouse',
    price: '$85',
    image: 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&w=800&q=80',
    customer: {
      name: 'Emily Wilson',
      avatar: 'https://i.pravatar.cc/150?img=29',
      address: '456 Park Avenue, Boston, MA 02108'
    },
    orderDate: '2023-08-12',
    requestedDelivery: '2023-08-25',
    status: 'shipped' as const,
    notes: 'Gift wrapping requested',
    orderNumber: 'ORD-2023-0014'
  },
  {
    id: 'ord3',
    productName: 'Classic Linen Pants',
    price: '$95',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    customer: {
      name: 'Michael Brown',
      avatar: 'https://i.pravatar.cc/150?img=59',
      address: '789 Lake Street, Chicago, IL 60601'
    },
    orderDate: '2023-08-10',
    requestedDelivery: '2023-08-20',
    status: 'delivered' as const,
    notes: '',
    orderNumber: 'ORD-2023-0013'
  },
  {
    id: 'ord4',
    productName: 'Designer Evening Gown',
    price: '$320',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    customer: {
      name: 'Jessica Parker',
      avatar: 'https://i.pravatar.cc/150?img=42',
      address: '321 Oak Drive, Los Angeles, CA 90001'
    },
    orderDate: '2023-08-05',
    requestedDelivery: '2023-09-05',
    status: 'pending' as const,
    notes: 'Custom alterations needed - see chat for details',
    orderNumber: 'ORD-2023-0012'
  }
];

const DesignerOrdersScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');
  
  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeTab);
  
  const handleUpdateStatus = (orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    Alert.alert(
      'Update Order Status',
      `Are you sure you want to mark this order as ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: () => {
            console.log(`Order ${orderId} status updated to ${newStatus}`);
            // In a real app, update the order status in the database
          } 
        }
      ]
    );
  };
  
  const handleContactCustomer = (customerName: string) => {
    // Find the order associated with this customer
    const order = mockOrders.find(order => order.customer.name === customerName);
    
    if (order) {
      // Navigate to chat screen with order context
      navigation.navigate('Chat', { 
        contactId: `customer-${order.id}`,
        orderId: order.id,
        initialMessage: `Hello ${customerName}, I'm messaging you about your order #${order.orderNumber.split('-').pop()} for ${order.productName}.`
      });
    } else {
      Alert.alert('Contact Customer', `Opening chat with ${customerName}`);
    }
  };

  const renderEmptyState = () => (
    <EmptyState>
      <EmptyStateIcon>
        <Ionicons name="receipt-outline" size={40} color="#7c4dff" />
      </EmptyStateIcon>
      <EmptyStateTitle>No Orders Yet</EmptyStateTitle>
      <EmptyStateDescription>
        You don't have any orders in this category right now.
      </EmptyStateDescription>
    </EmptyState>
  );

  const renderOrderCard = ({ item, index }: { item: typeof mockOrders[0], index: number }) => (
    <OrderCard entering={FadeInDown.delay(index * 100).duration(400)}>
      <OrderHeader>
        <OrderImageContainer>
          <OrderImage source={{ uri: item.image }} />
        </OrderImageContainer>
        <OrderInfo>
          <OrderTitle>{item.productName}</OrderTitle>
          <OrderMeta>
            <OrderMetaText>Order #{item.orderNumber.split('-').pop()}</OrderMetaText>
          </OrderMeta>
        </OrderInfo>
        <OrderPrice>{item.price}</OrderPrice>
      </OrderHeader>
      
      <OrderBody>
        <CustomerInfo>
          <CustomerAvatar source={{ uri: item.customer.avatar }} />
          <CustomerName>{item.customer.name}</CustomerName>
        </CustomerInfo>
        
        <OrderStatus status={item.status}>
          <OrderStatusText status={item.status}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </OrderStatusText>
        </OrderStatus>
        
        <OrderDetail>
          <OrderDetailLabel>Order Date:</OrderDetailLabel>
          <OrderDetailValue>{item.orderDate}</OrderDetailValue>
        </OrderDetail>
        
        <OrderDetail>
          <OrderDetailLabel>Delivery:</OrderDetailLabel>
          <OrderDetailValue>{item.requestedDelivery}</OrderDetailValue>
        </OrderDetail>
        
        <OrderDetail>
          <OrderDetailLabel>Address:</OrderDetailLabel>
          <OrderDetailValue>{item.customer.address}</OrderDetailValue>
        </OrderDetail>
        
        {item.notes ? (
          <OrderDetail>
            <OrderDetailLabel>Notes:</OrderDetailLabel>
            <OrderDetailValue>{item.notes}</OrderDetailValue>
          </OrderDetail>
        ) : null}
        
        <ActionButtonsRow>
          <ActionButton onPress={() => handleUpdateStatus(item.id, 
            item.status === 'pending' ? 'processing' : 
            item.status === 'processing' ? 'shipped' : 
            item.status === 'shipped' ? 'delivered' : 'delivered'
          )}>
            <Ionicons 
              name={
                item.status === 'pending' ? 'construct-outline' : 
                item.status === 'processing' ? 'car-outline' : 
                item.status === 'shipped' ? 'checkmark-circle-outline' : 
                'checkmark-done-outline'
              } 
              size={18} 
              color="#64748B" 
            />
            <ActionButtonText>
              {item.status === 'pending' ? 'Start Processing' : 
               item.status === 'processing' ? 'Mark Shipped' : 
               item.status === 'shipped' ? 'Mark Delivered' : 
               'Completed'}
            </ActionButtonText>
          </ActionButton>
          
          <ActionButton onPress={() => handleContactCustomer(item.customer.name)}>
            <Ionicons name="chatbubble-outline" size={18} color="#64748B" />
            <ActionButtonText>Message</ActionButtonText>
          </ActionButton>
        </ActionButtonsRow>
      </OrderBody>
    </OrderCard>
  );

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <StatusBarBg />
      
      <Header>
        <TopBar>
          <PageTitle>Orders</PageTitle>
          <Avatar 
            source={{ uri: user?.profileImage || 'https://i.pravatar.cc/150?img=11' }}
          />
        </TopBar>
        
        <StatsRow>
          <StatBox>
            <StatValue>{mockOrders.length}</StatValue>
            <StatLabel>Active Orders</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{mockOrders.filter(o => o.status === 'delivered').length}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatBox>
        </StatsRow>
        
        <TabsContainer>
          <TabButton active={activeTab === 'all'} onPress={() => setActiveTab('all')}>
            <TabText active={activeTab === 'all'}>All</TabText>
          </TabButton>
          <TabButton active={activeTab === 'pending'} onPress={() => setActiveTab('pending')}>
            <TabText active={activeTab === 'pending'}>Pending</TabText>
          </TabButton>
          <TabButton active={activeTab === 'processing'} onPress={() => setActiveTab('processing')}>
            <TabText active={activeTab === 'processing'}>Processing</TabText>
          </TabButton>
          <TabButton active={activeTab === 'shipped'} onPress={() => setActiveTab('shipped')}>
            <TabText active={activeTab === 'shipped'}>Shipped</TabText>
          </TabButton>
          <TabButton active={activeTab === 'delivered'} onPress={() => setActiveTab('delivered')}>
            <TabText active={activeTab === 'delivered'}>Delivered</TabText>
          </TabButton>
        </TabsContainer>
      </Header>
      
      <ContentSection>
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={renderOrderCard}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ 
            paddingBottom: 20,
            flexGrow: filteredOrders.length === 0 ? 1 : undefined
          }}
        />
      </ContentSection>
    </Container>
  );
};

export default DesignerOrdersScreen; 
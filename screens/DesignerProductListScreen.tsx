import React, { useState } from 'react';
import styled from 'styled-components/native';
import { 
  FlatList, 
  Dimensions, 
  Image, 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useUser } from '../UserContext';

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

const WelcomeContainer = styled.View`
  flex: 1;
`;

const GreetingText = styled.Text`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
`;

const DesignerName = styled.Text`
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

const StatsBar = styled.View`
  flex-direction: row;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 15px;
`;

const StatItem = styled.View`
  flex: 1;
  align-items: center;
  border-right-width: ${(props: { isLast?: boolean }) => props.isLast ? '0' : '1px'};
  border-right-color: rgba(255, 255, 255, 0.2);
`;

const StatValue = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
`;

const ContentHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #1a1a2e;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #f1f5f9;
  padding: 8px 12px;
  border-radius: 12px;
  margin-left: 10px;
`;

const FilterText = styled.Text`
  color: #64748B;
  font-size: 14px;
  margin-left: 4px;
`;

const AddButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 100px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #7c4dff;
  align-items: center;
  justify-content: center;
  shadow-color: #7c4dff;
  shadow-opacity: 0.3;
  shadow-radius: 10px;
  elevation: 8;
  z-index: 999;
`;

const ProductCard = styled(Animated.View)`
  background-color: white;
  border-radius: 20px;
  margin: 10px 20px;
  overflow: hidden;
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 15px;
  shadow-offset: 0px 5px;
  elevation: 5;
`;

const ProductImageContainer = styled.View`
  height: 200px;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const StatusBadge = styled.View<{status: 'active' | 'draft'}>`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${props => props.status === 'active' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(156, 163, 175, 0.8)'};
  padding: 5px 10px;
  border-radius: 12px;
`;

const StatusText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const ProductInfo = styled.View`
  padding: 15px;
`;

const ProductTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 5px;
`;

const MetaRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProductPrice = styled.Text`
  color: #7c4dff;
  font-size: 18px;
  font-weight: bold;
`;

const StockText = styled.Text`
  color: #64748B;
  font-size: 14px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #f1f5f9;
  padding-top: 12px;
`;

const StatisticItem = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StatisticText = styled.Text`
  margin-left: 6px;
  color: #64748B;
  font-size: 14px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  margin-top: 10px;
  border-top-width: 1px;
  border-top-color: #f1f5f9;
  padding-top: 12px;
`;

const ActionButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const ActionText = styled.Text`
  color: #64748B;
  font-size: 14px;
  margin-left: 6px;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const EmptyStateImage = styled.View`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  border-radius: 60px;
`;

const EmptyStateTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 10px;
  text-align: center;
`;

const EmptyStateText = styled.Text`
  font-size: 16px;
  color: #64748B;
  text-align: center;
  margin-bottom: 20px;
`;

const EmptyStateButton = styled.TouchableOpacity`
  background-color: #7c4dff;
  padding: 16px 24px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
`;

const EmptyStateButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
  margin-left: 8px;
`;

const ProductItem = styled.TouchableOpacity`
  background-color: white;
  border-radius: 15px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  shadow-offset: 0px 2px;
  elevation: 3;
  overflow: hidden;
`;

const ProductName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 5px;
`;

const ProductMeta = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const ProductStats = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProductStat = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 15px;
`;

const ProductStatText = styled.Text`
  font-size: 14px;
  color: #64748B;
  margin-left: 5px;
`;

const ProductActions = styled.View`
  flex-direction: row;
`;



const ChatBadge = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #7c4dff;
  border-radius: 12px;
  padding: 5px 10px;
  flex-direction: row;
  align-items: center;
`;

const ChatBadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
  margin-left: 4px;
`;

// Enhanced mock data for a designer's products
const mockDesignerProducts = [
  {
    id: 'dp1',
    title: 'Summer Floral Dress',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1534302634951-e87d02139c0b?auto=format&fit=crop&w=800&q=80',
    status: 'active' as const,
    stock: 15,
    views: 234,
    likes: 42,
    orders: 8
  },
  {
    id: 'dp2',
    title: 'Elegant Silk Blouse',
    price: '$80',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec314c5?auto=format&fit=crop&w=800&q=80',
    status: 'active' as const,
    stock: 7,
    views: 187,
    likes: 23,
    orders: 5
  },
  {
    id: 'dp3',
    title: 'Classic Linen Pants',
    price: '$95',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    status: 'draft' as const,
    stock: 0,
    views: 0,
    likes: 0,
    orders: 0
  },
];

// Define navigation type
type RootStackParamList = {
  EditProduct: { productId: string };
  AddProduct: undefined;
  Chat: { contactId: string; productId: string; initialMessage?: string };
};

const DesignerProductListScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useUser();
  const [filter, setFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [products, setProducts] = useState(mockDesignerProducts);

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.status === filter);

  const handleEditProduct = (productId: string) => {
    navigation.navigate('EditProduct', { productId });
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setProducts(products.filter(product => product.id !== productId));
          }
        }
      ]
    );
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleChatPress = (productId: string, productName: string) => {
    navigation.navigate('Chat', {
      contactId: `product-${productId}`,
      productId: productId,
      initialMessage: `Hello! I'm responding to your inquiry about ${productName}.`
    });
  };

  const renderEmptyState = () => (
    <EmptyState>
      <EmptyStateImage>
        <Ionicons name="shirt-outline" size={60} color="#7c4dff" />
      </EmptyStateImage>
      <EmptyStateTitle>No Products Yet</EmptyStateTitle>
      <EmptyStateText>
        Your catalog is empty. Start by adding your first fashion item to showcase your design talent.
      </EmptyStateText>
      <EmptyStateButton onPress={handleAddProduct}>
        <Ionicons name="add-circle-outline" size={20} color="white" />
        <EmptyStateButtonText>Create First Product</EmptyStateButtonText>
      </EmptyStateButton>
    </EmptyState>
  );

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <StatusBarBg />
      
      <Header>
        <TopBar>
          <WelcomeContainer>
            <GreetingText>Welcome back,</GreetingText>
            <DesignerName>{user?.name || 'Designer'}</DesignerName>
          </WelcomeContainer>
          <Avatar 
            source={{ uri: user?.profileImage || 'https://i.pravatar.cc/150?img=11' }}
          />
        </TopBar>
        
        <StatsBar>
          <StatItem>
            <StatValue>{products.length}</StatValue>
            <StatLabel>Products</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{products.filter(p => p.status === 'active').length}</StatValue>
            <StatLabel>Active</StatLabel>
          </StatItem>
          <StatItem isLast>
            <StatValue>${products.reduce((sum, p) => sum + parseInt(p.price.replace('$', '')), 0)}</StatValue>
            <StatLabel>Inventory Value</StatLabel>
          </StatItem>
        </StatsBar>
      </Header>
      
      <ContentHeader>
        <SectionTitle>Your Collection</SectionTitle>
        <FilterContainer>
          <FilterButton onPress={() => setFilter('all')}>
            <FilterText style={{ color: filter === 'all' ? '#7c4dff' : '#64748B' }}>All</FilterText>
          </FilterButton>
          <FilterButton onPress={() => setFilter('active')}>
            <FilterText style={{ color: filter === 'active' ? '#7c4dff' : '#64748B' }}>Active</FilterText>
          </FilterButton>
          <FilterButton onPress={() => setFilter('draft')}>
            <FilterText style={{ color: filter === 'draft' ? '#7c4dff' : '#64748B' }}>Drafts</FilterText>
          </FilterButton>
        </FilterContainer>
      </ContentHeader>
      
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ProductCard entering={FadeInDown.delay(index * 100).duration(500)}>
            <ProductImageContainer>
              <ProductImage source={{ uri: item.image }} resizeMode="cover" />
              <StatusBadge status={item.status}>
                <StatusText>{item.status === 'active' ? 'Active' : 'Draft'}</StatusText>
              </StatusBadge>
              {item.chatCount > 0 && (
                <ChatBadge>
                  <Ionicons name="chatbubble-outline" size={12} color="white" />
                  <ChatBadgeText>{item.chatCount}</ChatBadgeText>
                </ChatBadge>
              )}
            </ProductImageContainer>
            
            <ProductInfo>
              <ProductTitle>{item.title}</ProductTitle>
              
              <MetaRow>
                <PriceContainer>
                  <ProductPrice>{item.price}</ProductPrice>
                </PriceContainer>
                <StockText>Stock: {item.stock} pcs</StockText>
              </MetaRow>
              
              <BottomRow>
                <StatisticItem>
                  <Ionicons name="eye-outline" size={16} color="#64748B" />
                  <StatisticText>{item.views}</StatisticText>
                </StatisticItem>
                <StatisticItem>
                  <Ionicons name="heart-outline" size={16} color="#64748B" />
                  <StatisticText>{item.likes}</StatisticText>
                </StatisticItem>
                <StatisticItem>
                  <Ionicons name="cart-outline" size={16} color="#64748B" />
                  <StatisticText>{item.orders}</StatisticText>
                </StatisticItem>
              </BottomRow>
              
              <ActionRow>
                {item.chatCount > 0 && (
                  <ActionButton onPress={() => handleChatPress(item.id, item.title)}>
                    <Ionicons name="chatbubble-outline" size={18} color="#7c4dff" />
                    <ActionText style={{ color: '#7c4dff' }}>Messages</ActionText>
                  </ActionButton>
                )}
                <ActionButton onPress={() => handleEditProduct(item.id)}>
                  <Ionicons name="create-outline" size={18} color="#64748B" />
                  <ActionText>Edit</ActionText>
                </ActionButton>
                <ActionButton>
                  <Ionicons name="copy-outline" size={18} color="#64748B" />
                  <ActionText>Duplicate</ActionText>
                </ActionButton>
                <ActionButton onPress={() => handleDeleteProduct(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#FF4D4F" />
                  <ActionText style={{ color: '#FF4D4F' }}>Delete</ActionText>
                </ActionButton>
              </ActionRow>
            </ProductInfo>
          </ProductCard>
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{ 
          paddingBottom: 100,
          flexGrow: filteredProducts.length === 0 ? 1 : undefined
        }}
      />
      
      <AddButton 
        activeOpacity={0.8} 
        onPress={handleAddProduct}
      >
        <Ionicons name="add" size={30} color="white" />
      </AddButton>
    </Container>
  );
};

export default DesignerProductListScreen; 
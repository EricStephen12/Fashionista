import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { 
  FlatList, 
  Dimensions, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  RefreshControl,
  StatusBar,
  Image as RNImage,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { mockService, Product } from '../src/services/mockData';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import NotificationBell from '../components/NotificationBell';
import { useNotifications } from '../NotificationContext';
import { RootStackParamList } from '../src/MainTabs';

const { width } = Dimensions.get('window');

const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #FFFFFF;
`;

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  padding: 50px 20px 16px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #F3F4F6;
`;

const HeaderLeft = styled.View`
  flex: 1;
`;

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #1E293B;
  letter-spacing: -0.5px;
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: #64748B;
  margin-top: 4px;
`;

const SearchButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #F1F5F9;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  elevation: 2;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
`;

const Card = styled(Animated.View)`
  background-color: #FFFFFF;
  border-radius: 16px;
  margin: 12px 16px;
  overflow: hidden;
  elevation: 4;
  shadow-opacity: 0.15;
  shadow-radius: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
`;

const CardTouchable = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
`;

const ProductImageContainer = styled.View`
  width: 100%;
  height: 320px;
  position: relative;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const PriceTag = styled.View`
  position: absolute;
  right: 12px;
  top: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 20px;
  elevation: 2;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
`;

const PriceText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const BadgesContainer = styled.View`
  position: absolute;
  top: 12px;
  left: 12px;
  flex-direction: row;
`;

const Badge = styled.View<{ primary?: boolean }>`
  background-color: ${props => props.primary ? '#3B82F6' : '#F59E0B'};
  padding: 6px 12px;
  border-radius: 20px;
  margin-right: 8px;
  elevation: 2;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
`;

const BadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const Info = styled.View`
  padding: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DesignerRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const DesignerDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #3B82F6;
  margin-right: 8px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1E293B;
  margin-bottom: 4px;
  flex: 1;
  margin-right: 8px;
`;

const Designer = styled.Text`
  font-size: 14px;
  color: #3B82F6;
  font-weight: 500;
`;

const Description = styled.Text`
  color: #64748B;
  font-size: 14px;
  line-height: 20px;
  margin-top: 8px;
`;

const ActionButtonsRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: #3B82F6;
  padding: 8px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-left: 10px;
`;

const CategoryTag = styled.View`
  background-color: #EBF5FF;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 8px;
  align-self: flex-start;
`;

const CategoryText = styled.Text`
  color: #3B82F6;
  font-size: 12px;
  font-weight: 500;
`;

const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const EmptyStateText = styled.Text`
  font-size: 16px;
  color: #64748B;
  text-align: center;
  margin-top: 16px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  color: #EF4444;
  text-align: center;
  margin-top: 20px;
  padding: 16px;
`;

type TimelineScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const TimelineScreen = () => {
  const navigation = useNavigation<TimelineScreenNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [designers, setDesigners] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

    const fetchProducts = async () => {
      try {
        const data = await mockService.getProducts();
        setProducts(data);
      
      // Fetch all designers and create a mapping of id to name
      const designersData = await mockService.getDesigners();
      const designerMap: {[key: string]: string} = {};
      designersData.forEach(designer => {
        designerMap[designer.id] = designer.name;
      });
      setDesigners(designerMap);
      
        setError(null);
      
      // Generate customer notifications based on products
      if (data.length > 0) {
        // Price drop notification
        const randomProduct = data[Math.floor(Math.random() * data.length)];
        addNotification({
          type: 'price_drop',
          title: 'Price Drop Alert!',
          message: `${randomProduct.title} is now on sale! Limited time offer.`,
          data: { productId: randomProduct.id }
        });
        
        // Restock notification
        const anotherProduct = data[Math.floor(Math.random() * data.length)];
        addNotification({
          type: 'restock',
          title: 'Back in Stock',
          message: `${anotherProduct.title} is back in stock and ready to ship!`,
          data: { productId: anotherProduct.id }
        });
        
        // Designer new product
        if (designersData.length > 0) {
          const randomDesigner = designersData[Math.floor(Math.random() * designersData.length)];
          addNotification({
            type: 'designer_new_product',
            title: `New from ${randomDesigner.name}`,
            message: `${randomDesigner.name} just added new items to their collection. Check them out!`,
            data: { designerId: randomDesigner.id, designerName: randomDesigner.name }
          });
        }
      }
      } catch (e) {
        console.error('Failed to fetch products:', e);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  // Helper function to get designer name
  const getDesignerName = (designerId: string) => {
    return designers[designerId] || "Unknown Designer";
  };

  useEffect(() => {
    fetchProducts();
  }, []); 

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handlePressProduct = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleAddToCart = (productId: string) => {
    // Add to cart logic here
    console.log(`Add to cart: ${productId}`);
  };
  
  const handleFavorite = (productId: string) => {
    // Favorite product logic here
    console.log(`Favorited product: ${productId}`);
  };

  const renderEmptyState = () => (
    <EmptyStateContainer>
      <Ionicons name="shirt-outline" size={80} color="#ccc" />
      <EmptyStateText>No products found. Check back later for new arrivals.</EmptyStateText>
    </EmptyStateContainer>
  );

  if (loading && !refreshing) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 12, color: "#64748B" }}>Finding the perfect styles for you...</Text>
      </LoadingContainer>
    );
  }

  const getRandomBadges = (productId: string) => {
    // This is just for demo purposes to randomly assign badges to products
    const badges = [];
    
    if (['p1', 'p3', 'p5'].includes(productId)) {
      badges.push({ text: 'NEW', primary: true });
    }
    
    if (['p2', 'p4'].includes(productId)) {
      badges.push({ text: 'TRENDING', primary: false });
    }
    
    if (['p6'].includes(productId)) {
      badges.push({ text: 'EXCLUSIVE', primary: true });
    }
    
    return badges;
  };

  return (
    <SafeArea>
      <StatusBar barStyle="dark-content" />
      <Container>
        <Header>
          <HeaderLeft>
          <HeaderTitle>Discover</HeaderTitle>
            <HeaderSubtitle>Find your perfect style</HeaderSubtitle>
          </HeaderLeft>
          <HeaderRight>
            <SearchButton onPress={() => navigation.navigate('Search')}>
              <Ionicons name="search" size={22} color="#333" />
          </SearchButton>
            <NotificationBell lightMode={true} />
          </HeaderRight>
        </Header>

        {error ? (
          <ErrorText>{error}</ErrorText>
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={handleRefresh}
                tintColor="#3B82F6"
                colors={["#3B82F6"]}
              />
            }
            renderItem={({ item, index }) => (
              <Card 
                entering={FadeInDown.delay(index * 100).duration(400)}
              >
                <CardTouchable activeOpacity={0.95} onPress={() => handlePressProduct(item.id)}>
                  <ProductImageContainer>
                    <ProductImage 
                      source={{ uri: item.image }} 
                      resizeMode="cover" 
                    />
                    <PriceTag>
                      <PriceText>{item.price}</PriceText>
                    </PriceTag>
                    
                    <BadgesContainer>
                      {getRandomBadges(item.id).map((badge, idx) => (
                        <Badge key={idx} primary={badge.primary}>
                          <BadgeText>{badge.text}</BadgeText>
                        </Badge>
                      ))}
                    </BadgesContainer>
                  </ProductImageContainer>
                  
                  <Info>
                    <CategoryTag>
                      <CategoryText>{item.category}</CategoryText>
                    </CategoryTag>
                    
                    <DesignerRow>
                      <DesignerDot />
                      <Designer>by {getDesignerName(item.designerId)}</Designer>
                    </DesignerRow>
                    
                    <Row>
                      <Title numberOfLines={1}>{item.title}</Title>
                      <ActionButtonsRow>
                        <ActionButton onPress={() => handleFavorite(item.id)}>
                          <Ionicons name="heart-outline" size={20} color="white" />
                        </ActionButton>
                        <ActionButton onPress={() => handleAddToCart(item.id)}>
                          <Ionicons name="cart-outline" size={20} color="white" />
                        </ActionButton>
                      </ActionButtonsRow>
                    </Row>
                    
                    <Description numberOfLines={2}>
                      {item.description}
                    </Description>
                  </Info>
                </CardTouchable>
              </Card>
            )}
          />
        )}
      </Container>
    </SafeArea>
  );
};

export default TimelineScreen; 
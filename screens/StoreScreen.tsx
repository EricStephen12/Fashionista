import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { 
  FlatList, 
  Dimensions, 
  Image, 
  View, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import DesignerReviews from '../components/DesignerReviews';

const { width } = Dimensions.get('window');

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

const StoreLogo = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 16px;
  background-color: #e0e0e0;
  border-width: 3px;
  border-color: rgba(255, 255, 255, 0.5);
`;

const StoreName = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
`;

const StoreDescription = styled.Text`
  font-size: 16px;
  color: #f8f8ff;
  text-align: center;
  max-width: 90%;
`;

const ProductsHeader = styled.View`
  padding: 16px 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ProductsTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
`;

const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #f1f5f9;
  padding: 8px 12px;
  border-radius: 12px;
`;

const FilterText = styled.Text`
  color: #64748B;
  font-size: 14px;
  margin-left: 4px;
`;

const ProductCard = styled(Animated.View)`
  background-color: #fff;
  border-radius: 16px;
  margin: 8px 20px;
  overflow: hidden;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
  elevation: 4;
`;

const ProductImage = styled.Image`
  width: ${width - 40}px;
  height: 220px;
`;

const ProductInfo = styled.View`
  padding: 16px;
`;

const ProductTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 8px;
`;

const PriceRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ProductPrice = styled.Text`
  color: #48c6ef;
  font-size: 18px;
  font-weight: bold;
`;

const ActionRow = styled.View`
  flex-direction: row;
  margin-top: 12px;
  border-top-width: 1px;
  border-top-color: #f1f5f9;
  padding-top: 12px;
`;

const ActionButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const ActionText = styled.Text`
  font-size: 14px;
  color: #64748B;
  margin-left: 4px;
`;

const LikeButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f1f5f9;
  justify-content: center;
  align-items: center;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  color: red;
  text-align: center;
  margin-top: 20px;
`;

const FollowButton = styled.TouchableOpacity<{ following: boolean }>`
  background-color: ${props => props.following ? 'rgba(255, 255, 255, 0.3)' : 'white'};
  padding: 8px 20px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const FollowButtonText = styled.Text<{ following: boolean }>`
  color: ${props => props.following ? 'white' : '#6c63ff'};
  font-weight: bold;
  font-size: 14px;
  margin-left: 5px;
`;

const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyStateText = styled.Text`
  color: #64748B;
  font-size: 16px;
  margin-top: 10px;
`;

// Define types for our data
type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
  designerId: string;
  liked?: boolean;
};

type StoreData = {
  name: string;
  description: string;
  logo: string;
};

type StoreMap = {
  [key: string]: StoreData;
};

// Mock data for products
const mockProducts: Product[] = [
  {
    id: 'p1',
    title: 'Elegant Summer Dress',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1534302634951-e87d02139c0b?auto=format&fit=crop&w=800&q=80',
    designerId: 'd1',
    liked: false,
  },
  {
    id: 'p2',
    title: 'Stylish Blouse',
    price: '$80',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec314c5?auto=format&fit=crop&w=800&q=80',
    designerId: 'd2',
    liked: false,
  },
  {
    id: 'p3',
    title: 'Chic Evening Gown',
    price: '$250',
    image: 'https://images.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=800&q=80',
    designerId: 'd1',
    liked: true,
  },
  {
    id: 'p4',
    title: 'Casual T-Shirt',
    price: '$45',
    image: 'https://images.unsplash.com/photo-1521572178398-88706276c9cd?auto=format&fit=crop&w=800&q=80',
    designerId: 'd2',
    liked: false,
  },
  {
    id: 'p5',
    title: 'Designer Jeans',
    price: '$95',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    designerId: 'd3',
    liked: false,
  },
];

// Mock store data by ID
const mockStores: StoreMap = {
  'd1': {
    name: 'Luna Couture',
    description: 'Elegant and modern designs for the sophisticated woman.',
    logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
  },
  'd2': {
    name: 'Urban Edge',
    description: 'Streetwear with a unique twist for the fashion-forward individual.',
    logo: 'https://images.unsplash.com/photo-1469398715555-76331a6c7fa0?auto=format&fit=crop&w=100&q=80',
  },
  'd3': {
    name: 'Bella Moda',
    description: 'Sophisticated evening wear that makes a statement.',
    logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=100&q=80',
  },
};

const StoreScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { storeId } = route.params as { storeId: string };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Get store data from mock data
  const storeData = mockStores[storeId] || {
    name: 'Designer Store',
    description: 'Browse our latest collection.',
    logo: 'https://via.placeholder.com/150',
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      try {
        // For demo purposes, show all products regardless of storeId
        // In a real app, we would filter by storeId
        setProducts(mockProducts);
        setLoading(false);
      } catch (e) {
        console.error('Error loading mock products:', e);
        setError('Failed to load store products. Please try again later.');
        setLoading(false);
      }
    }, 1000); // Simulate a network delay
  }, [storeId]);

  const handlePressProduct = (productId: string) => {
    console.log(`Pressed product with ID: ${productId}`);
    navigation.navigate('ProductDetail', { productId });
  };

  const handleLike = (productId: string) => {
    setProducts(
      products.map(product => 
        product.id === productId 
          ? { ...product, liked: !product.liked } 
          : product
      )
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Handle follow/unfollow
  const toggleFollow = () => {
    setIsFollowing(prev => !prev);
    // In a real app, we would make an API call to follow/unfollow the store
    const message = isFollowing ? 'Unfollowed' : 'Now following';
    Alert.alert('Success', `${message} ${storeData.name}`);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#6c63ff" />
        <Text>Loading Store...</Text>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorText>{error}</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </BackButton>
        <StoreLogo source={{ uri: storeData.logo }} />
        <StoreName>{storeData.name}</StoreName>
        <StoreDescription>{storeData.description}</StoreDescription>
        <FollowButton following={isFollowing} onPress={toggleFollow}>
          <Ionicons 
            name={isFollowing ? "checkmark-circle" : "person-add-outline"} 
            size={16} 
            color={isFollowing ? "white" : "#6c63ff"} 
          />
          <FollowButtonText following={isFollowing}>
            {isFollowing ? 'Following' : 'Follow'}
          </FollowButtonText>
        </FollowButton>
      </Header>
      
      <ScrollView showsVerticalScrollIndicator={false}>
      <ProductsHeader>
          <ProductsTitle>Products</ProductsTitle>
        <FilterButton>
            <Ionicons name="options-outline" size={18} color="#64748B" />
          <FilterText>Filter</FilterText>
        </FilterButton>
      </ProductsHeader>
      
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#6c63ff" />
          </LoadingContainer>
        ) : error ? (
          <ErrorText>{error}</ErrorText>
        ) : products.length === 0 ? (
          <EmptyStateContainer>
            <Ionicons name="shirt-outline" size={80} color="#ccc" />
            <EmptyStateText>No products available yet.</EmptyStateText>
          </EmptyStateContainer>
        ) : (
          <>
            {products.map((product, index) => (
          <ProductCard 
                key={product.id}
                entering={FadeInDown.delay(index * 100).duration(400)}
          >
                <ProductImage source={{ uri: product.image }} />
            <ProductInfo>
                  <ProductTitle>{product.title}</ProductTitle>
                <PriceRow>
                    <ProductPrice>{product.price}</ProductPrice>
                    <LikeButton onPress={() => handleLike(product.id)}>
                    <Ionicons
                        name={product.liked ? "heart" : "heart-outline"} 
                      size={20}
                        color={product.liked ? "#FF4757" : "#64748B"} 
                    />
                  </LikeButton>
                </PriceRow>
                <ActionRow>
                    <ActionButton onPress={() => handlePressProduct(product.id)}>
                    <Ionicons name="eye-outline" size={18} color="#64748B" />
                    <ActionText>View Details</ActionText>
                  </ActionButton>
                  <ActionButton>
                    <Ionicons name="cart-outline" size={18} color="#64748B" />
                    <ActionText>Add to Cart</ActionText>
                  </ActionButton>
                </ActionRow>
            </ProductInfo>
          </ProductCard>
            ))}
            
            <DesignerReviews 
              designerId={storeId} 
              designerName={storeData.name}
            />
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default StoreScreen; 
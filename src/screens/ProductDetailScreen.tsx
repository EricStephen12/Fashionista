import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../context/CartContext';
import mockService, { Product, Designer } from '../services/mockData';
import { RootStackParamList } from '../MainTabs';

const { width, height } = Dimensions.get('window');

// Styled components
const Container = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

const HeaderContainer = styled.View`
  width: 100%;
  height: ${height * 0.55}px;
  position: relative;
`;

const ProductImageScrollView = styled.ScrollView`
  width: 100%;
  height: 100%;
`;

const ProductImage = styled.Image`
  width: ${width}px;
  height: ${height * 0.55}px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: ${Platform.OS === 'ios' ? 50 : 30}px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const ActionButtonsContainer = styled.View`
  position: absolute;
  top: ${Platform.OS === 'ios' ? 50 : 30}px;
  right: 20px;
  flex-direction: column;
  align-items: center;
  z-index: 10;
`;

const ActionButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const DesignerTag = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  left: 20px;
  flex-direction: row;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 20px;
  z-index: 10;
`;

const DesignerAvatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 8px;
`;

const DesignerName = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

const AvailabilityIndicator = styled.View<{ isAvailable: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.isAvailable ? '#10B981' : '#EF4444'};
  margin-left: 8px;
`;

const PaginationContainer = styled.View`
  position: absolute;
  bottom: 20px;
  right: 20px;
  flex-direction: row;
  z-index: 10;
`;

const PaginationDot = styled.View<{ active: boolean }>`
  width: ${props => props.active ? '24px' : '8px'};
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? '#7c4dff' : 'rgba(255, 255, 255, 0.5)'};
  margin: 0 4px;
`;

const ContentContainer = styled.View`
  flex: 1;
  background-color: white;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  margin-top: -30px;
  padding: 30px 20px;
  padding-bottom: ${Platform.OS === 'ios' ? '120px' : '100px'};
  z-index: 20;
`;

const ProductHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const ProductTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #1a1a2e;
  flex: 1;
`;

const PriceContainer = styled.View`
  background-color: #7c4dff;
  padding: 8px 16px;
  border-radius: 16px;
`;

const PriceText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const BadgesContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

const Badge = styled.View`
  padding: 6px 12px;
  border-radius: 8px;
  margin-right: 8px;
  background-color: #F3F4F6;
`;

const BadgeText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: #4B5563;
`;

const Description = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: #4B5563;
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 15px;
`;

const ColorContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const ColorButton = styled.TouchableOpacity<{ selected: boolean; color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
  margin-bottom: 10px;
  border-width: 2px;
  border-color: ${props => props.selected ? '#7c4dff' : 'transparent'};
  background-color: ${props => props.color};
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #F3F4F6;
  justify-content: center;
  align-items: center;
`;

const QuantityText = styled.Text`
  font-size: 18px;
  margin: 0 20px;
  font-weight: 600;
  color: #1a1a2e;
`;

const ARPreviewButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #E8DEF8;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 2px solid #7c4dff;
`;

const ARIcon = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: rgba(124, 77, 255, 0.1);
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const ARText = styled.View`
  flex: 1;
`;

const ARTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 4px;
`;

const ARDescription = styled.Text`
  font-size: 14px;
  color: #4B5563;
`;

const ARArrow = styled.View`
  margin-left: 10px;
`;

const InfoSection = styled.View`
  margin-bottom: 20px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #F3F4F6;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  color: #6B7280;
  width: 120px;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: #1a1a2e;
  flex: 1;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const AddToCartButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #7c4dff;
  padding: 18px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-right: 10px;
`;

const AddToCartText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
`;

const ChatWithDesignerButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #F3F4F6;
  padding: 18px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const ChatText = styled.Text`
  color: #1a1a2e;
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 50px;
  background-color: #fff;
`;

// Extended Product type to include additional fields needed for UI
interface ExtendedProduct extends Product {
  images?: string[];
  tags?: string[];
  designer?: {
    id: string;
    name: string;
    avatar: string;
    availability?: 'available' | 'unavailable';
  };
  details?: {
    material: string;
    care: string;
    style: string;
    occasion: string;
    designFeatures: string;
  };
}

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailNavigationProp = NavigationProp<RootStackParamList>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const { addItem } = useCart();
  const { productId } = route.params;
  
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        console.log('Fetching product data for ID:', productId);
        const productData = await mockService.getProductById(productId);
        if (productData) {
          // Fetch designer data
          const designerData = await mockService.getDesignerById(productData.designerId);
          console.log('Retrieved designer data:', designerData);
          
          // Create extended product with additional UI fields
          const extendedProduct: ExtendedProduct = {
            ...productData,
            images: [productData.image], // Default to single image in array
            tags: [productData.category || 'Fashion'], // Default tag
            designer: designerData ? {
              id: designerData.id,
              name: designerData.name,
              avatar: designerData.logo,
              availability: designerData.availability || 'available'
            } : undefined,
            details: {
              material: 'Premium Silk',
              care: 'Dry Clean Only',
              style: 'Asymmetric Drape',
              occasion: 'Formal Evening Events',
              designFeatures: 'Hand-beaded details, Open back design'
            }
          };
          
          console.log('Extended product data:', extendedProduct);
          setProduct(extendedProduct);
          setDesigner(designerData || null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // Handle image scroll
  const handleImageScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentImageIndex(index);
  };

  const handleARMeasurement = () => {
    console.log('AR Button pressed');
    console.log('Product ID being passed:', productId);
    
    try {
      navigation.navigate('ARMeasurement', { productId });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Could not open AR screen. Please try again.');
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor && product?.colors?.length) {
      Alert.alert('Select Color', 'Please select a color before adding to cart.');
      return;
    }

    if (product) {
      // Create a product object with the selected options
      const productToAdd = {
        ...product,
        id: `${product.id}-${selectedColor}`,
        color: selectedColor
      } as Product;

      // Call addItem with the product and quantity
      addItem(productToAdd, quantity);

      Alert.alert(
        'Added to Cart',
        'Item has been added to your cart.',
        [
          {
            text: 'Continue Shopping',
            style: 'cancel'
          },
          {
            text: 'Go to Cart',
            onPress: () => navigation.navigate('Cart')
          }
        ]
      );
    }
  };

  const handleChatWithDesigner = () => {
    if (product?.designer) {
      // Check if designer is available
      if (product.designer.availability === 'unavailable') {
        // Check if this is an existing customer with an order from this designer
        // For now, we'll use a mock check. In a real app, this would query the user's orders
        const hasExistingOrder = false; // This would be determined by checking orders
        
        if (!hasExistingOrder) {
          Alert.alert(
            'Designer Unavailable',
            'Sorry, this designer is not available at the moment. Please check back later.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
      
      navigation.navigate('Chat', { 
        contactId: product.designer.id,
        initialMessage: `Hi, I'm interested in the ${product.title} (Product ID: ${productId}). Can you tell me more about it?`
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    Alert.alert('Share', 'Sharing this beautiful design...');
  };

  const handleDesignerProfile = () => {
    if (product?.designer) {
      navigation.navigate('Store', { storeId: product.designer.id });
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#7c4dff" />
      </LoadingContainer>
    );
  }

  if (!product) {
    return (
      <Container>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </BackButton>
        <ContentContainer style={{marginTop: 80}}>
          <ProductTitle>Product not found</ProductTitle>
        </ContentContainer>
      </Container>
    );
  }

  // Ensure we have images array
  const productImages = product.images || [product.image];
  
  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 120 : 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <HeaderContainer>
          <ProductImageScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
          >
            {productImages.map((image: string, index: number) => (
              <ProductImage key={index} source={{ uri: image }} resizeMode="cover" />
            ))}
          </ProductImageScrollView>
          
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'transparent', 'rgba(0,0,0,0.3)']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1
            }}
          />
          
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </BackButton>
          
          <ActionButtonsContainer>
            <ActionButton onPress={handleLike}>
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={24} 
                color={isLiked ? "#FF4D4F" : "#FFF"} 
              />
            </ActionButton>
            <ActionButton onPress={handleShare}>
              <Ionicons name="share-social-outline" size={24} color="#FFF" />
            </ActionButton>
          </ActionButtonsContainer>
          
          {product.designer && (
            <DesignerTag onPress={handleDesignerProfile}>
              <DesignerAvatar source={{ uri: product.designer.avatar }} />
              <DesignerName>{product.designer.name}</DesignerName>
              <AvailabilityIndicator isAvailable={product.designer.availability === 'available'} />
            </DesignerTag>
          )}
          
          <PaginationContainer>
            {productImages.map((_: string, index: number) => (
              <PaginationDot 
                key={index} 
                active={currentImageIndex === index} 
              />
            ))}
          </PaginationContainer>
        </HeaderContainer>
        
        <ContentContainer>
          <ProductHeader>
            <ProductTitle>{product.title}</ProductTitle>
            <PriceContainer>
              <PriceText>{product.price}</PriceText>
            </PriceContainer>
          </ProductHeader>
          
          {product.tags && (
            <BadgesContainer>
              {product.tags.map((tag: string, index: number) => (
                <Badge key={index}>
                  <BadgeText>{tag}</BadgeText>
                </Badge>
              ))}
            </BadgesContainer>
          )}
          
          <Description>{product.description}</Description>
          
          <ARPreviewButton onPress={handleARMeasurement}>
            <ARIcon>
              <Ionicons name="camera" size={28} color="#7c4dff" />
            </ARIcon>
            <ARText>
              <ARTitle>Try Using Camera</ARTitle>
              <ARDescription>Take measurements with your camera for a perfect fit</ARDescription>
            </ARText>
            <ARArrow>
              <Ionicons name="chevron-forward" size={24} color="#7c4dff" />
            </ARArrow>
          </ARPreviewButton>
          
          <SectionTitle>Product Details</SectionTitle>
          <InfoSection>
            {product.details && (
              <>
                <InfoRow>
                  <InfoLabel>Material</InfoLabel>
                  <InfoValue>{product.details.material}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Care</InfoLabel>
                  <InfoValue>{product.details.care}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Style</InfoLabel>
                  <InfoValue>{product.details.style}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Occasion</InfoLabel>
                  <InfoValue>{product.details.occasion}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Design Features</InfoLabel>
                  <InfoValue>{product.details.designFeatures}</InfoValue>
                </InfoRow>
              </>
            )}
          </InfoSection>

          {product.colors && product.colors.length > 0 && (
            <>
              <SectionTitle>Select Color</SectionTitle>
              <ColorContainer>
                {product.colors.map((color: string) => (
                  <ColorButton
                    key={color}
                    selected={selectedColor === color}
                    color={color.toLowerCase()}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </ColorContainer>
            </>
          )}

          <SectionTitle>Quantity</SectionTitle>
          <QuantityContainer>
            <QuantityButton onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Ionicons name="remove" size={24} color="#4B5563" />
            </QuantityButton>
            <QuantityText>{quantity}</QuantityText>
            <QuantityButton onPress={() => setQuantity(quantity + 1)}>
              <Ionicons name="add" size={24} color="#4B5563" />
            </QuantityButton>
          </QuantityContainer>
          
          <ButtonsContainer>
            <AddToCartButton onPress={handleAddToCart}>
              <Ionicons name="cart-outline" size={20} color="#FFF" />
              <AddToCartText>Add to Cart</AddToCartText>
            </AddToCartButton>
            
            <ChatWithDesignerButton onPress={handleChatWithDesigner}>
              <Ionicons name="chatbubble-outline" size={20} color="#1a1a2e" />
              <ChatText>Chat</ChatText>
            </ChatWithDesignerButton>
          </ButtonsContainer>
        </ContentContainer>
      </ScrollView>
    </Container>
  );
};

export default ProductDetailScreen; 
import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Alert,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { mockService } from '../src/services/mockData';
import { LinearGradient } from 'expo-linear-gradient';

const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Container = styled.View`
  flex: 1;
  padding: 0 16px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 4px;
  margin-bottom: 8px;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const EmptyCartContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

const EmptyCartImage = styled.Image`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  opacity: 0.8;
`;

const EmptyCartText = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 30px;
`;

const ShopButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 16px 32px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const ShopButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const CartItemContainer = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: 16px;
  margin-bottom: 16px;
  padding: 16px;
  flex-direction: row;
  ${props => props.theme.shadow.sm};
`;

const ItemImage = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.border};
`;

const ItemDetails = styled.View`
  flex: 1;
  margin-left: 16px;
  justify-content: space-between;
`;

const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ItemDesigner = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 8px;
`;

const VariantInfo = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const PriceRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const ItemPrice = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const QuantityControl = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 4px;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${props => props.disabled ? props.theme.colors.border : props.theme.colors.card};
  justify-content: center;
  align-items: center;
`;

const QuantityText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  margin: 0 12px;
  color: ${props => props.theme.colors.text};
`;

const RemoveButton = styled.TouchableOpacity`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.05);
  justify-content: center;
  align-items: center;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin: 20px 0;
`;

const SummaryContainer = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  ${props => props.theme.shadow.sm};
`;

const SummaryTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SummaryLabel = styled.Text`
  font-size: 15px;
  color: ${props => props.theme.colors.textSecondary};
`;

const SummaryValue = styled.Text`
  font-size: 15px;
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
  color: ${props => props.theme.colors.text};
`;

const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
`;

const TotalLabel = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const TotalValue = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 18px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;

const CheckoutButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const PromoCodeContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

const PromoInput = styled.TextInput`
  flex: 1;
  background-color: ${props => props.theme.colors.card};
  height: 50px;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  margin-right: 12px;
  ${props => props.theme.shadow.sm};
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.background};
  height: 50px;
  border-radius: 12px;
  padding: 0 20px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ApplyButtonText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: 16px;
  font-weight: bold;
`;

const mockCartItems = [
  {
    id: 'ci1',
    productId: 'p1',
    title: 'Casual Linen Shirt',
    designer: 'Modern Essentials',
    price: '$75',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1594938298603-c9148ed42a5a?auto=format&fit=crop&w=200&q=80',
    size: 'M',
    color: 'Blue',
  },
  {
    id: 'ci2',
    productId: 'p2',
    title: 'Slim Fit Jeans',
    designer: 'Urban Trends',
    price: '$95',
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=200&q=80',
    size: '32',
    color: 'Dark Blue',
  },
];

const CartScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // In a real app, fetch cart from an API or local storage
    setTimeout(() => {
      setCartItems(mockCartItems);
      setLoading(false);
    }, 1000);
  }, []);

  const handleIncreaseQuantity = (id) => {
    setCartItems(
      cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems(
      cartItems.map(item => 
        item.id === id && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          onPress: () => {
            setCartItems(cartItems.filter(item => item.id !== id));
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before checking out.");
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(20);
      Alert.alert("Success", "Promo code applied successfully!");
    } else {
      setDiscount(0);
      Alert.alert("Invalid Code", "Please enter a valid promo code.");
    }
    setPromoCode('');
  };

  const handleContinueShopping = () => {
    navigation.navigate('Timeline');
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price.replace('$', '')) * item.quantity, 
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + shipping - discountAmount;

  if (cartItems.length === 0 && !loading) {
    return (
      <SafeArea>
        <StatusBar barStyle="dark-content" />
        <Container>
          <Header>
            <HeaderTitle>Cart</HeaderTitle>
          </Header>
          <EmptyCartContainer>
            <EmptyCartImage 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2038/2038854.png' }}
              resizeMode="contain"
            />
            <EmptyCartText>Your cart is empty. Start shopping to add items to your cart.</EmptyCartText>
            <ShopButton onPress={handleContinueShopping}>
              <ShopButtonText>Continue Shopping</ShopButtonText>
            </ShopButton>
          </EmptyCartContainer>
        </Container>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <StatusBar barStyle="dark-content" />
      <Container>
        <Header>
          <HeaderTitle>Cart</HeaderTitle>
          <TouchableOpacity onPress={handleContinueShopping}>
            <Ionicons name="add-circle-outline" size={28} color="#3B82F6" />
          </TouchableOpacity>
        </Header>

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CartItemContainer>
              <ItemImage source={{ uri: item.image }} resizeMode="cover" />
              <ItemDetails>
                <View>
                  <ItemTitle numberOfLines={1}>{item.title}</ItemTitle>
                  <ItemDesigner>{item.designer}</ItemDesigner>
                  <VariantInfo>Size: {item.size} • Color: {item.color}</VariantInfo>
                </View>
                <PriceRow>
                  <ItemPrice>{item.price}</ItemPrice>
                  <QuantityControl>
                    <QuantityButton 
                      onPress={() => handleDecreaseQuantity(item.id)}
                      disabled={item.quantity <= 1}
                    >
                      <Ionicons 
                        name="remove" 
                        size={16} 
                        color={item.quantity <= 1 ? "#A0A0A0" : "#333333"} 
                      />
                    </QuantityButton>
                    <QuantityText>{item.quantity}</QuantityText>
                    <QuantityButton onPress={() => handleIncreaseQuantity(item.id)}>
                      <Ionicons name="add" size={16} color="#333333" />
                    </QuantityButton>
                  </QuantityControl>
                </PriceRow>
              </ItemDetails>
              <RemoveButton onPress={() => handleRemoveItem(item.id)}>
                <Ionicons name="close" size={16} color="#666" />
              </RemoveButton>
            </CartItemContainer>
          )}
          ListFooterComponent={
            <View>
              <PromoCodeContainer>
                <PromoInput
                  placeholder="Promo Code"
                  value={promoCode}
                  onChangeText={setPromoCode}
                  placeholderTextColor="#A0A0A0"
                />
                <ApplyButton onPress={handleApplyPromoCode}>
                  <ApplyButtonText>Apply</ApplyButtonText>
                </ApplyButton>
              </PromoCodeContainer>

              <SummaryContainer>
                <SummaryTitle>Order Summary</SummaryTitle>
                <SummaryRow>
                  <SummaryLabel>Subtotal</SummaryLabel>
                  <SummaryValue>${subtotal.toFixed(2)}</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Shipping</SummaryLabel>
                  <SummaryValue>${shipping.toFixed(2)}</SummaryValue>
                </SummaryRow>
                {discount > 0 && (
                  <SummaryRow>
                    <SummaryLabel>Discount ({discount}%)</SummaryLabel>
                    <SummaryValue>-${discountAmount.toFixed(2)}</SummaryValue>
                  </SummaryRow>
                )}
                <TotalRow>
                  <TotalLabel>Total</TotalLabel>
                  <TotalValue>${total.toFixed(2)}</TotalValue>
                </TotalRow>
              </SummaryContainer>

              <CheckoutButton activeOpacity={0.8} onPress={handleCheckout}>
                <CheckoutButtonText>Proceed to Checkout</CheckoutButtonText>
              </CheckoutButton>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </Container>
    </SafeArea>
  );
};

export default CartScreen; 
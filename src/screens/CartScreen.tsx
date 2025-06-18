import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { theme } from '../theme';
import { RootStackParamList } from '../types/navigation';
import { CartItem } from '../services/mockData';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 65;
const BottomSpacer = styled.View`
  height: ${TAB_BAR_HEIGHT}px;
`;

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const CartItem = styled.View`
  flex-direction: row;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const ItemImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

const ItemDetails = styled.View`
  flex: 1;
  margin-left: 15px;
  justify-content: space-between;
`;

const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ItemPrice = styled.Text`
  font-size: 16px;
  color: #666;
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #f0f0f0;
  justify-content: center;
  align-items: center;
`;

const QuantityText = styled.Text`
  font-size: 16px;
  margin-horizontal: 10px;
`;

const RemoveButton = styled.TouchableOpacity`
  padding: 5px;
`;

const SummaryContainer = styled.View`
  padding: 20px;
  background-color: #f8f8f8;
  border-top-width: 1px;
  border-top-color: #eee;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SummaryText = styled.Text`
  font-size: 16px;
  color: #333;
`;

const SummaryTotal = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: #000;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const CheckoutButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const EmptyCartContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyCartText = styled.Text`
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-top: 10px;
`;

const CartScreen = () => {
  const { items, updateItem, removeItem, total, itemCount } = useCart();
  const navigation = useNavigation<CartScreenNavigationProp>();

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateItem(itemId, newQuantity);
      } else {
        removeItem(itemId);
      }
    }
  };

  const getPrice = (priceString: string) => {
    return parseFloat(priceString.replace('$', ''));
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some items to proceed to checkout.');
      return;
    }
    navigation.navigate('Checkout');
  };

  if (items.length === 0) {
    return (
      <EmptyCartContainer>
        <Ionicons name="cart-outline" size={64} color="#ccc" />
        <EmptyCartText>Your cart is empty</EmptyCartText>
        <TouchableOpacity
          style={{ marginTop: 20, padding: 15, backgroundColor: '#000', borderRadius: 8 }}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
        <BottomSpacer />
      </EmptyCartContainer>
    );
  }

  return (
    <Container>
      <FlatList<CartItem>
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem>
            <ItemImage source={{ uri: item.image }} />
            <ItemDetails>
              <View>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemPrice>${getPrice(item.price).toFixed(2)}</ItemPrice>
              </View>
              <QuantityContainer>
                <QuantityButton onPress={() => handleQuantityChange(item.id, -1)}>
                  <Ionicons name="remove" size={20} color="#333" />
                </QuantityButton>
                <QuantityText>{item.quantity}</QuantityText>
                <QuantityButton onPress={() => handleQuantityChange(item.id, 1)}>
                  <Ionicons name="add" size={20} color="#333" />
                </QuantityButton>
                <RemoveButton onPress={() => removeItem(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </RemoveButton>
              </QuantityContainer>
            </ItemDetails>
          </CartItem>
        )}
        ListFooterComponent={
          <>
            <SummaryContainer>
              <SummaryRow>
                <SummaryText>Subtotal ({itemCount} items)</SummaryText>
                <SummaryText>${total.toFixed(2)}</SummaryText>
              </SummaryRow>
              <SummaryRow>
                <SummaryText>Shipping</SummaryText>
                <SummaryText>Free</SummaryText>
              </SummaryRow>
              <SummaryRow>
                <SummaryTotal>Total</SummaryTotal>
                <SummaryTotal>${total.toFixed(2)}</SummaryTotal>
              </SummaryRow>
              <CheckoutButton onPress={handleCheckout}>
                <CheckoutButtonText>Proceed to Checkout</CheckoutButtonText>
              </CheckoutButton>
            </SummaryContainer>
            <BottomSpacer />
          </>
        }
      />
    </Container>
  );
};

export default CartScreen; 
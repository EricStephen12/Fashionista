import React, { useState } from 'react';
import { ScrollView, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useUser } from '../../UserContext';
import mockService from '../services/mockData';

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: #f8fafd;
`;

const Header = styled.View`
  padding: 20px;
  padding-top: ${Platform.OS === 'ios' ? '60px' : '40px'};
  background-color: white;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1a1a2e;
  flex: 1;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 20px;
  padding-bottom: ${Platform.OS === 'ios' ? '120px' : '100px'};
`;

const Section = styled.View`
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
  font-size: 16px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Label = styled.Text`
  font-size: 16px;
  color: #666;
`;

const Value = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const Total = styled.Text`
  font-size: 20px;
  color: #000;
  font-weight: 600;
`;

const PaymentMethodButton = styled.TouchableOpacity<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  border-width: 1px;
  border-color: ${props => props.selected ? '#000' : '#ddd'};
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: ${props => props.selected ? '#f8f8f8' : '#fff'};
`;

const PaymentMethodText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-left: 10px;
`;

const PlaceOrderButton = styled.TouchableOpacity`
  background-color: #000;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin: 20px;
`;

const PlaceOrderText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

type PaymentMethod = 'credit_card' | 'paypal';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { items, total, clearCart } = useCart();
  const { user } = useUser();
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateAddress = () => {
    const requiredFields: (keyof ShippingAddress)[] = [
      'fullName',
      'address',
      'city',
      'state',
      'zipCode',
      'country',
      'phone'
    ];

    for (const field of requiredFields) {
      if (!shippingAddress[field].trim()) {
        Alert.alert('Missing Information', `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      return;
    }

    setIsProcessing(true);

    try {
      // In a real app, this would be an API call
      const order = {
        id: `order-${Date.now()}`,
        userId: user?.id || 'guest',
        items,
        total: total.toFixed(2),
        status: 'pending',
        date: new Date().toISOString(),
        shippingAddress,
        paymentMethod: selectedPaymentMethod,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear cart and show success
      clearCart();
      Alert.alert(
        'Order Placed',
        'Your order has been placed successfully!',
        [
          {
            text: 'View Orders',
            onPress: () => navigation.navigate('Profile')
          },
          {
            text: 'Continue Shopping',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'There was an error placing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <Header>
        <BackButton onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#1a1a2e" />
        </BackButton>
        <HeaderTitle>Checkout</HeaderTitle>
      </Header>

      <Content 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Order Summary */}
        <Section>
          <SectionTitle>Order Summary</SectionTitle>
          {items.map((item) => (
            <Row key={item.id}>
              <Label>{item.title} (x{item.quantity})</Label>
              <Value>${(parseFloat(item.price) * item.quantity).toFixed(2)}</Value>
            </Row>
          ))}
          <Row style={{ marginTop: 10 }}>
            <Label>Subtotal</Label>
            <Value>${total.toFixed(2)}</Value>
          </Row>
          <Row>
            <Label>Shipping</Label>
            <Value>Free</Value>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Total>Total</Total>
            <Total>${total.toFixed(2)}</Total>
          </Row>
        </Section>

        {/* Shipping Address */}
        <Section>
          <SectionTitle>Shipping Address</SectionTitle>
          <Input
            placeholder="Full Name"
            value={shippingAddress.fullName}
            onChangeText={(value) => handleAddressChange('fullName', value)}
          />
          <Input
            placeholder="Address"
            value={shippingAddress.address}
            onChangeText={(value) => handleAddressChange('address', value)}
          />
          <Input
            placeholder="City"
            value={shippingAddress.city}
            onChangeText={(value) => handleAddressChange('city', value)}
          />
          <Input
            placeholder="State"
            value={shippingAddress.state}
            onChangeText={(value) => handleAddressChange('state', value)}
          />
          <Input
            placeholder="ZIP Code"
            value={shippingAddress.zipCode}
            onChangeText={(value) => handleAddressChange('zipCode', value)}
            keyboardType="numeric"
          />
          <Input
            placeholder="Country"
            value={shippingAddress.country}
            onChangeText={(value) => handleAddressChange('country', value)}
          />
          <Input
            placeholder="Phone Number"
            value={shippingAddress.phone}
            onChangeText={(value) => handleAddressChange('phone', value)}
            keyboardType="phone-pad"
          />
        </Section>

        {/* Payment Method */}
        <Section>
          <SectionTitle>Payment Method</SectionTitle>
          <PaymentMethodButton
            selected={selectedPaymentMethod === 'credit_card'}
            onPress={() => setSelectedPaymentMethod('credit_card')}
          >
            <Ionicons name="card-outline" size={24} color="#333" />
            <PaymentMethodText>Credit Card</PaymentMethodText>
          </PaymentMethodButton>
          <PaymentMethodButton
            selected={selectedPaymentMethod === 'paypal'}
            onPress={() => setSelectedPaymentMethod('paypal')}
          >
            <Ionicons name="logo-paypal" size={24} color="#003087" />
            <PaymentMethodText>PayPal</PaymentMethodText>
          </PaymentMethodButton>
        </Section>

        {/* Place Order Button */}
        <PlaceOrderButton
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          <PlaceOrderText>
            {isProcessing ? 'Processing...' : 'Place Order'}
          </PlaceOrderText>
        </PlaceOrderButton>
      </Content>
    </Container>
  );
};

export default CheckoutScreen; 
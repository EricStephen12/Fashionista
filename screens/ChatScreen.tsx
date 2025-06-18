import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { 
  View as RNView, 
  Text as RNText, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions, 
  StatusBar,
  Image,
  Alert
} from 'react-native';
import { useRoute, useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../UserContext';
import { RootStackParamList } from '../src/MainTabs';
import { validateContent } from '../src/utils/ContentFilter';
import ContentFilterWrapper from '../src/components/ContentFilterWrapper';

const { width, height } = Dimensions.get('window');

const Text = styled(RNText)``;
const View = styled(RNView)``;

const Container = styled(View)`
  flex: 1;
  background-color: #f8fafd;
`;

const StatusBarBg = styled(View)`
  height: ${StatusBar.currentHeight || 0}px;
  background-color: #7c4dff;
`;

const Header = styled(View)`
  padding: 15px 20px;
  padding-top: ${Platform.OS === 'ios' ? '60px' : '20px'};
  background-color: #7c4dff;
  flex-direction: row;
  align-items: center;
`;

const BackButton = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const UserInfo = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled(Image)`
  width: 45px;
  height: 45px;
  border-radius: 22.5px;
  margin-right: 12px;
  border-width: 2px;
  border-color: white;
`;

const UserDetails = styled(View)`
  flex: 1;
`;

const UserName = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const OnlineStatus = styled(Text)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const OptionsButton = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
`;

const MessagesContainer = styled(View)`
  flex: 1;
  padding: 5px;
`;

const MessageBubble = styled(View)<{ isMine: boolean }>`
  max-width: 90%;
  padding: 16px 20px;
  border-radius: 20px;
  margin-bottom: 12px;
  margin-left: 4px;
  margin-right: 4px;
  background-color: ${props => props.isMine ? '#7c4dff' : 'white'};
  align-self: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const MessageText = styled(Text)<{ isMine: boolean }>`
  font-size: 16px;
  line-height: 22px;
  color: ${props => props.isMine ? 'white' : '#1a1a2e'};
`;

const MessageTime = styled(Text)<{ isMine: boolean }>`
  font-size: 12px;
  color: ${props => props.isMine ? 'rgba(255, 255, 255, 0.8)' : '#64748B'};
  align-self: flex-end;
  margin-top: 4px;
`;

const InputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border-top-width: 1px;
  border-top-color: #E5E7EB;
  margin: 0 12px 8px;
  border-radius: 28px;
`;

const MessageInput = styled(TextInput)`
  flex: 1;
  min-height: 44px;
  max-height: 120px;
  min-width: 0;
  background-color: #f1f5f9;
  border-radius: 24px;
  padding: 12px 20px;
  font-size: 16px;
  margin-right: 4px;
  color: #1a1a2e;
`;

const SendButton = styled(TouchableOpacity)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #7c4dff;
  align-items: center;
  justify-content: center;
  margin-left: 0px;
  shadow-color: #7c4dff;
  shadow-opacity: 0.25;
  shadow-radius: 6px;
  shadow-offset: 0px 2px;
  elevation: 4;
`;

const DateSeparator = styled(View)`
  align-items: center;
  margin-vertical: 20px;
`;

const DateText = styled(Text)`
  font-size: 14px;
  color: #64748B;
  background-color: #f1f5f9;
  padding: 6px 12px;
  border-radius: 10px;
`;

const ProductPreviewCard = styled(TouchableOpacity)`
  flex-direction: row;
  background-color: white;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  shadow-offset: 0px 2px;
  elevation: 2;
  align-self: center;
  width: 90%;
`;

const ProductImage = styled(Image)`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 10px;
`;

const ProductInfo = styled(View)`
  flex: 1;
  justify-content: center;
`;

const ProductName = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  color: #1a1a2e;
  margin-bottom: 4px;
`;

const ProductPrice = styled(Text)`
  font-size: 14px;
  color: #7c4dff;
  font-weight: bold;
`;

const SystemMessage = styled(View)`
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-radius: 10px;
  align-self: center;
  margin-vertical: 10px;
`;

const SystemMessageText = styled(Text)`
  font-size: 14px;
  color: #64748B;
  text-align: center;
`;

const ErrorMessage = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 8px 15px;
  background-color: #FFE9EC;
  border-top-width: 1px;
  border-top-color: #FFCCD1;
`;

const ErrorText = styled(Text)`
  color: #FF4757;
  font-size: 12px;
  margin-left: 6px;
  flex: 1;
`;

// Add ChatBadge styled component
const ChatBadge = styled(View)`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #EF4444;
  border-radius: 10px;
  padding: 2px 6px;
  align-items: center;
  justify-content: center;
`;

const ChatBadgeText = styled(Text)`
  color: white;
  font-size: 10px;
  font-weight: bold;
`;

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

// Mock data for the chat
const mockMessages = [
  {
    id: 'm1',
    text: "Hello! I'm interested in ordering the Summer Floral Dress. Do you offer customizations?",
    sentAt: '2023-08-15T10:30:00',
    sender: 'customer',
  },
  {
    id: 'm2',
    text: "Hi there! Yes, we do offer customizations for this dress. What specific changes are you looking for?",
    sentAt: '2023-08-15T10:32:00',
    sender: 'designer',
  },
  {
    id: 'm3',
    text: "I would like to adjust the length and possibly change the sleeve style. Is that possible?",
    sentAt: '2023-08-15T10:35:00',
    sender: 'customer',
  },
  {
    id: 'm4',
    text: "Absolutely! We can adjust the length to your preference. For the sleeves, we offer several options: cap sleeves, short sleeves, or 3/4 sleeves. Which would you prefer?",
    sentAt: '2023-08-15T10:40:00',
    sender: 'designer',
  },
  {
    id: 'm5',
    type: 'product',
    productId: 'p1',
    productName: 'Summer Floral Dress',
    productImage: 'https://images.unsplash.com/photo-1534302624301-d6897b45d108?auto=format&fit=crop&w=800&q=80',
    productPrice: '$120',
    sentAt: '2023-08-15T10:45:00',
    sender: 'designer',
  },
  {
    id: 'm6',
    text: "I think I would prefer the cap sleeves. Also, can I get this in a different color?",
    sentAt: '2023-08-15T10:48:00',
    sender: 'customer',
  },
  {
    id: 'm7',
    text: "We have this design available in blue, pink, and green floral patterns as well. Would you like to see images of those options?",
    sentAt: '2023-08-15T10:52:00',
    sender: 'designer',
  },
  {
    id: 'm8',
    type: 'system',
    text: "Measurement information requested",
    sentAt: '2023-08-15T10:55:00',
  },
  {
    id: 'm9',
    text: "I've just sent you a measurement request form. Once you fill that out, I can ensure the dress fits you perfectly!",
    sentAt: '2023-08-15T10:57:00',
    sender: 'designer',
  },
  {
    id: 'm10',
    text: "Perfect! I'll fill that out right away. How long would it take to make the dress with these customizations?",
    sentAt: '2023-08-15T11:00:00',
    sender: 'customer',
  },
  {
    id: 'm11',
    text: "With the customizations, it would take approximately 2-3 weeks to complete the dress. We'll keep you updated on the progress throughout the process.",
    sentAt: '2023-08-15T11:05:00',
    sender: 'designer',
  },
  {
    id: 'm12',
    text: "That sounds great! I'll proceed with the order once I submit the measurements.",
    sentAt: '2023-08-15T11:08:00',
    sender: 'customer',
  },
];

// Mock contact data
const mockContact = {
  id: 'c1',
  name: 'Sarah Johnson',
  avatar: 'https://i.pravatar.cc/150?img=32',
  isOnline: true,
  lastSeen: 'Online'
};

// Mock order data
const mockOrders: Record<string, {
  id: string;
  productName: string;
  orderNumber: string;
  status: string;
  price: string;
  image: string;
}> = {
  'order-123': {
    id: 'order-123',
    productName: 'Summer Floral Dress',
    orderNumber: 'ORD-2023-0015',
    status: 'processing',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1534302624301-d6897b45d108?auto=format&fit=crop&w=800&q=80',
  }
};

// Mock product data
const mockProducts: Record<string, {
  id: string;
  name: string;
  price: string;
  image: string;
}> = {
  'p1': {
    id: 'p1',
    name: 'Summer Floral Dress',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1534302624301-d6897b45d108?auto=format&fit=crop&w=800&q=80',
  }
};

const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<ChatScreenRouteProp>();
  const { user } = useUser();
  const flatListRef = useRef<FlatList>(null);
  
  const [messages, setMessages] = useState(mockMessages);
  const [messageText, setMessageText] = useState('');
  const [isContentValid, setIsContentValid] = useState(true);
  const [contentError, setContentError] = useState(null);
  const [contactInfo, setContactInfo] = useState(mockContact);
  const [unreadCount, setUnreadCount] = useState(3);
  
  const isDesigner = user?.role === 'designer';
  
  // Get context information from route params
  const { contactId, productId, orderId } = route.params;
  
  // Set up chat context
  useEffect(() => {
    // If we have a product ID, add product context to the chat
    if (productId && mockProducts[productId]) {
      const product = mockProducts[productId];
      
      // Update contact name if we're a designer (showing customer name)
      if (isDesigner) {
        setContactInfo({
          ...contactInfo,
          name: mockContact.name,
          avatar: mockContact.avatar
        });
      }
      
      // Add product context if not already in messages
      const hasProductContext = messages.some(m => m.type === 'product' && m.productId === productId);
      
      if (!hasProductContext) {
        const productMessage = {
          id: `product-${productId}`,
          type: 'product',
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          productPrice: product.price,
          sentAt: new Date().toISOString(),
          sender: isDesigner ? 'designer' : 'system',
        };
        
        setMessages(prevMessages => [productMessage, ...prevMessages]);
      }
    }
    
    // If we have an order ID, add order context to the chat
    if (orderId && mockOrders[orderId]) {
      const order = mockOrders[orderId];
      
      // Add system message about the order if not already in messages
      const hasOrderContext = messages.some(m => 
        m.type === 'system' && 
        m.text && 
        m.text.includes(order.orderNumber)
      );
      
      if (!hasOrderContext) {
        const orderMessage = {
          id: `order-${orderId}`,
          type: 'system',
          text: `Conversation about Order #${order.orderNumber} - ${order.productName}`,
          sentAt: new Date().toISOString(),
        };
        
        setMessages(prevMessages => [orderMessage, ...prevMessages]);
      }
    }
  }, [productId, orderId, isDesigner]);
  
  // Handle initialMessage if provided
  useEffect(() => {
    // Check if an initial message was provided (e.g., from AR measurements)
    if (route.params.initialMessage) {
      // Add the initial message to the chat
      const newMessage = {
        id: `m${messages.length + 1}`,
        text: route.params.initialMessage,
        sentAt: new Date().toISOString(),
        sender: isDesigner ? 'designer' : 'customer',
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [route.params.initialMessage]);
  
  useEffect(() => {
    // Scroll to bottom when component mounts
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 200);
    }
  }, []);
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handleSend = () => {
    if (messageText.trim() === '') return;
    
    // Validate message content
    const validation = validateContent(messageText);
    if (!validation.isValid) {
      setContentError(validation.errorMessage || null);
      Alert.alert(
        "Message Blocked", 
        validation.errorMessage || "Your message contains content that is not allowed on our platform.",
        [{ text: "OK", onPress: () => setContentError(null) }]
      );
      return;
    }
    
    const newMessage = {
      id: `m${messages.length + 1}`,
      text: messageText.trim(),
      sentAt: new Date().toISOString(),
      sender: isDesigner ? 'designer' : 'customer',
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    setContentError(null);
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };
  
  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      // Format: August 15, 2023
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.sentAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);
  
  // Flatten the grouped messages with date separators
  const flattenedMessages = Object.entries(groupedMessages).flatMap(([date, msgs]) => {
    return [
      { id: `date-${date}`, type: 'date', date },
      ...msgs
    ];
  });
  
  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'date') {
      return (
        <DateSeparator>
          <DateText>{formatDay(item.date)}</DateText>
        </DateSeparator>
      );
    } else if (item.type === 'product') {
      return (
        <ProductPreviewCard onPress={() => handleProductPress(item.productId)}>
          <ProductImage source={{ uri: item.productImage }} />
          <ProductInfo>
            <ProductName>{item.productName}</ProductName>
            <ProductPrice>{item.productPrice}</ProductPrice>
          </ProductInfo>
        </ProductPreviewCard>
      );
    } else if (item.type === 'system') {
      return (
        <SystemMessage>
          <SystemMessageText>{item.text}</SystemMessageText>
        </SystemMessage>
      );
    } else {
      const isMine = (isDesigner && item.sender === 'designer') || (!isDesigner && item.sender === 'customer');
      
      return (
        <MessageBubble isMine={isMine}>
          <MessageText isMine={isMine}>{item.text}</MessageText>
          <MessageTime isMine={isMine}>{formatDate(item.sentAt)}</MessageTime>
        </MessageBubble>
      );
    }
  };
  
  const renderInputContainer = () => (
    <InputContainer>
      <ContentFilterWrapper
        onValidationChange={(isValid) => {
          // You can handle validation state here
          setIsContentValid(isValid);
           setContentError(isValid ? null : 'Your message contains prohibited information.');
        }}
      >
        <MessageInput
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
      </ContentFilterWrapper>
      <SendButton onPress={handleSend} activeOpacity={0.8} disabled={!isContentValid || messageText.trim()===''} style={{ opacity: !isContentValid || messageText.trim()==='' ? 0.4 : 1 }}>
        <Ionicons name="paper-plane" size={22} color="white" />
      </SendButton>
    </InputContainer>
  );
  
  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <StatusBarBg />
      
      <Header>
        <BackButton onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </BackButton>
        
        <UserInfo>
          <UserAvatar source={{ uri: mockContact.avatar }} />
          <UserDetails>
            <UserName>{mockContact.name}</UserName>
            <OnlineStatus>{mockContact.lastSeen}</OnlineStatus>
          </UserDetails>
        </UserInfo>
        
        <OptionsButton>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
          {unreadCount > 0 && (
            <ChatBadge>
              <ChatBadgeText>{unreadCount}</ChatBadgeText>
            </ChatBadge>
          )}
        </OptionsButton>
      </Header>
      
      <MessagesContainer>
        <FlatList
          ref={flatListRef}
          data={flattenedMessages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </MessagesContainer>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {renderInputContainer()}
        {contentError && (
          <ErrorMessage>
            <ErrorText>{contentError}</ErrorText>
          </ErrorMessage>
        )}
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ChatScreen; 
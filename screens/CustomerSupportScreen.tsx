import React, { useState, useRef, useEffect } from 'react';
import { 
  View as RNView,
  Text as RNText,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Image,
  Alert
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../UserContext';
import { RootStackParamList } from '../src/MainTabs';
import { useNotifications } from '../NotificationContext';

const { width, height } = Dimensions.get('window');

// Create styled components with proper typing
const View = styled(RNView)``;
const Text = styled(RNText)``;

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

const HeaderTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: white;
  flex: 1;
`;

const MessagesContainer = styled(View)`
  flex: 1;
  padding: 15px;
`;

const MessageBubble = styled(View)<{ isMine: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  margin-bottom: 10px;
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
  padding: 10px 15px;
  background-color: white;
  border-top-width: 1px;
  border-top-color: #E5E7EB;
`;

const MessageInput = styled(TextInput)`
  flex: 1;
  background-color: #f1f5f9;
  border-radius: 24px;
  padding: 12px 20px;
  font-size: 16px;
  margin-right: 10px;
  color: #1a1a2e;
`;

const SendButton = styled(TouchableOpacity)`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #7c4dff;
  align-items: center;
  justify-content: center;
  shadow-color: #7c4dff;
  shadow-opacity: 0.2;
  shadow-radius: 5px;
  shadow-offset: 0px 2px;
  elevation: 3;
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

const SupportTopicContainer = styled(View)`
  padding: 15px;
`;

const SupportTopicTitle = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 15px;
`;

const SupportTopicButton = styled(TouchableOpacity)`
  background-color: white;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const SupportTopicIcon = styled(View)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f0f9ff;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const SupportTopicText = styled(Text)`
  font-size: 16px;
  color: #1a1a2e;
  flex: 1;
`;

const SupportAgentInfo = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background-color: white;
  margin: 15px;
  border-radius: 12px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const SupportAgentAvatar = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 15px;
`;

const SupportAgentDetails = styled(View)`
  flex: 1;
`;

const SupportAgentName = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: #1a1a2e;
`;

const SupportAgentRole = styled(Text)`
  font-size: 14px;
  color: #64748B;
`;

const SupportAgentStatus = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const SupportAgentStatusIndicator = styled(View)`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #10B981;
  margin-right: 6px;
`;

const SupportAgentStatusText = styled(Text)`
  font-size: 12px;
  color: #10B981;
`;

// Define message types for proper typing
interface BaseMessage {
  id: string;
  sentAt: string;
}

interface SystemMessage extends BaseMessage {
  type: 'system' | 'date';
  text: string;
}

interface UserMessage extends BaseMessage {
  sender: 'user' | 'agent';
  text: string;
}

type Message = SystemMessage | UserMessage;

// Update the support agent to represent official company support
const supportAgent = {
  id: 'agent1',
  name: 'Sarah Thompson',
  role: 'Fashionista Support Team',
  avatar: 'https://i.pravatar.cc/150?img=48',
  status: 'online',
};

// Update support topics to be more company-focused
const supportTopics = [
  { id: 'order', title: 'Order Issues', icon: 'cube-outline' },
  { id: 'payment', title: 'Payment Problems', icon: 'card-outline' },
  { id: 'shipping', title: 'Shipping & Delivery', icon: 'car-outline' },
  { id: 'returns', title: 'Returns & Refunds', icon: 'refresh-outline' },
  { id: 'account', title: 'Account Help', icon: 'person-outline' },
  { id: 'designer', title: 'Designer Verification', icon: 'shield-checkmark-outline' },
  { id: 'other', title: 'Other Questions', icon: 'help-circle-outline' },
];

// Update initial messages to reflect official company support
const initialMessages: Message[] = [
  {
    id: 'sys1',
    type: 'system',
    text: 'Welcome to Fashionista Official Customer Support',
    sentAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'sys2',
    type: 'system',
    text: 'Our support team is here to help you. Please select a topic or describe your issue.',
    sentAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

const CustomerSupportScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const flatListRef = useRef<FlatList>(null);
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [messageText, setMessageText] = useState('');
  const [showTopics, setShowTopics] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [agentConnected, setAgentConnected] = useState(false);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  // Update the agent connecting message
  useEffect(() => {
    if (selectedTopic && !agentConnected) {
      // Add system message that agent is connecting
      const connectingMessage: SystemMessage = {
        id: `sys-${Date.now()}`,
        type: 'system',
        text: 'Connecting you with a Fashionista support representative...',
        sentAt: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, connectingMessage]);
      
      // Simulate delay for agent connecting
      const timer = setTimeout(() => {
        // Add agent connected message
        const agentMessage: UserMessage = {
          id: `msg-${Date.now()}`,
          text: `Hi there! I'm ${supportAgent.name} from the Fashionista Support Team. I'll be helping you with your ${getTopicTitle(selectedTopic)} inquiry today. How can I assist you?`,
          sender: 'agent',
          sentAt: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, agentMessage]);
        setAgentConnected(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedTopic]);
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  // Update the agent response for more official support tone
  const handleSend = () => {
    if (messageText.trim() === '') return;
    
    // Add user message
    const newMessage: UserMessage = {
      id: `msg-${Date.now()}`,
      text: messageText.trim(),
      sender: 'user',
      sentAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    
    // If this is the first user message after selecting a topic, simulate agent typing
    if (selectedTopic && agentConnected && messages.filter(m => 'sender' in m && m.sender === 'user').length === 0) {
      // Simulate typing delay
      setTimeout(() => {
        let responseText = "";
        
        // Customize responses based on topic
        switch(selectedTopic) {
          case 'order':
            responseText = "I understand you're having an issue with your order. Could you please provide your order number so I can look into this for you?";
            break;
          case 'payment':
            responseText = "I'd be happy to help with your payment concern. To better assist you, could you tell me more about the issue you're experiencing?";
            break;
          case 'shipping':
            responseText = "I'll help you with your shipping inquiry. Could you please share your order number and the specific shipping concern you have?";
            break;
          case 'returns':
            responseText = "I can assist with your return or refund request. Please provide your order details and tell me which items you'd like to return.";
            break;
          case 'designer':
            responseText = "I can help with questions about our designer verification process. Are you a designer looking to get verified, or do you have questions about a specific designer?";
            break;
          default:
            responseText = "Thank you for reaching out to Fashionista Support. Could you please provide more details about your inquiry so I can assist you better?";
        }
        
        const agentResponse: UserMessage = {
          id: `msg-${Date.now()}`,
          text: responseText,
          sender: 'agent',
          sentAt: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, agentResponse]);
        
        // Add a notification for demo purposes
        addNotification({
          type: 'message_received',
          title: 'New Support Message',
          message: 'Fashionista Support Team has responded to your inquiry.',
          data: { contactId: 'support-agent1' }
        });
      }, 2000);
    } else if (selectedTopic && agentConnected) {
      // For subsequent messages, provide a generic helpful response
      setTimeout(() => {
        const agentResponse: UserMessage = {
          id: `msg-${Date.now()}`,
          text: "Thank you for providing that information. Our team is reviewing your request and will get back to you shortly. Is there anything else you'd like to add while we look into this matter?",
          sender: 'agent',
          sentAt: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, agentResponse]);
      }, 3000);
    }
  };
  
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setShowTopics(false);
    
    // Add system message about topic selection
    const topicMessage: SystemMessage = {
      id: `sys-${Date.now()}`,
      type: 'system',
      text: `You selected: ${getTopicTitle(topicId)}`,
      sentAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, topicMessage]);
  };
  
  const getTopicTitle = (topicId: string): string => {
    const topic = supportTopics.find(t => t.id === topicId);
    return topic ? topic.title : 'Help';
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
  }, {} as Record<string, Message[]>);
  
  // Flatten the grouped messages with date separators
  const flattenedMessages = Object.entries(groupedMessages).flatMap(([date, msgs]) => {
    const dateMessage: SystemMessage = {
      id: `date-${date}`,
      type: 'date',
      text: date,
      sentAt: new Date(date).toISOString()
    };
    return [dateMessage, ...msgs];
  });
  
  const renderItem = ({ item }: { item: Message }) => {
    if ('type' in item && item.type === 'date') {
      return (
        <DateSeparator>
          <DateText>{formatDay(item.sentAt)}</DateText>
        </DateSeparator>
      );
    } else if ('type' in item && item.type === 'system') {
      return (
        <SystemMessage>
          <SystemMessageText>{item.text}</SystemMessageText>
        </SystemMessage>
      );
    } else if ('sender' in item) {
      const isMine = item.sender === 'user';
      
      return (
        <MessageBubble isMine={isMine}>
          <MessageText isMine={isMine}>{item.text}</MessageText>
          <MessageTime isMine={isMine}>{formatDate(item.sentAt)}</MessageTime>
        </MessageBubble>
      );
    }
    
    return null;
  };
  
  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <StatusBarBg />
      
      <Header>
        <BackButton onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </BackButton>
        <HeaderTitle>Fashionista Support</HeaderTitle>
      </Header>
      
      {agentConnected && (
        <SupportAgentInfo>
          <SupportAgentAvatar source={{ uri: supportAgent.avatar }} />
          <SupportAgentDetails>
            <SupportAgentName>{supportAgent.name}</SupportAgentName>
            <SupportAgentRole>{supportAgent.role}</SupportAgentRole>
            <SupportAgentStatus>
              <SupportAgentStatusIndicator />
              <SupportAgentStatusText>Online</SupportAgentStatusText>
            </SupportAgentStatus>
          </SupportAgentDetails>
        </SupportAgentInfo>
      )}
      
      {showTopics ? (
        <SupportTopicContainer>
          <SupportTopicTitle>How can we help you today?</SupportTopicTitle>
          {supportTopics.map(topic => (
            <SupportTopicButton 
              key={topic.id} 
              onPress={() => handleTopicSelect(topic.id)}
            >
              <SupportTopicIcon>
                <Ionicons name={topic.icon as any} size={24} color="#7c4dff" />
              </SupportTopicIcon>
              <SupportTopicText>{topic.title}</SupportTopicText>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </SupportTopicButton>
          ))}
        </SupportTopicContainer>
      ) : (
        <>
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
          
          <InputContainer>
            <MessageInput
              placeholder="Type a message..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            <SendButton onPress={handleSend} activeOpacity={0.8}>
              <Ionicons name="paper-plane" size={22} color="white" />
            </SendButton>
          </InputContainer>
        </>
      )}
    </Container>
  );
};

export default CustomerSupportScreen; 
import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useNotifications, Notification, NotificationType } from '../NotificationContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../src/MainTabs';

interface NotificationBellProps {
  lightMode?: boolean;
}

const BellContainer = styled.TouchableOpacity<{ lightMode?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.lightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.2)'};
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;

const Badge = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #EF4444;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 4px;
`;

const BadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-start;
`;

const NotificationsContainer = styled.View`
  background-color: white;
  margin-top: 60px;
  margin-horizontal: 20px;
  border-radius: 15px;
  max-height: 70%;
  overflow: hidden;
`;

const NotificationHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #E5E7EB;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1E293B;
`;

const ClearButton = styled.TouchableOpacity`
  padding: 5px 10px;
`;

const ClearText = styled.Text`
  color: #3B82F6;
  font-size: 14px;
  font-weight: 500;
`;

const NotificationItem = styled.TouchableOpacity<{ read: boolean }>`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #E5E7EB;
  background-color: ${props => props.read ? '#FFFFFF' : '#F0F9FF'};
`;

const NotificationTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 5px;
`;

const NotificationMessage = styled.Text`
  font-size: 14px;
  color: #64748B;
`;

const NotificationTime = styled.Text`
  font-size: 12px;
  color: #94A3B8;
  margin-top: 5px;
`;

const EmptyContainer = styled.View`
  padding: 30px;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #94A3B8;
  text-align: center;
`;

type NavigationProp = StackNavigationProp<RootStackParamList>;

const NotificationBell = ({ lightMode = false }: NotificationBellProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
  };
  
  const handleNotificationPress = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    markAsRead(id);
    
    if (notification) {
      // Navigate based on notification type
      switch (notification.type) {
        case 'price_drop':
        case 'restock':
          if (notification.data?.productId) {
            navigation.navigate('ProductDetail', { 
              productId: notification.data.productId 
            });
          }
          break;
          
        case 'designer_new_product':
          if (notification.data?.designerName) {
            // Navigate to designer store if available, otherwise just close modal
            // Assuming there's a way to find designer by name
            navigation.navigate('Explore');
          }
          break;
          
        case 'order_placed':
        case 'order_confirmed':
        case 'order_shipped':
        case 'order_delivered':
          // Navigate to order tracking/details
          navigation.navigate('Profile');
          break;
          
        case 'message_received':
        case 'designer_chat_message':
          if (notification.data?.contactId) {
            navigation.navigate('Chat', { 
              contactId: notification.data.contactId,
              productId: notification.data.productId,
              orderId: notification.data.orderId
            });
          }
          break;
          
        case 'order_status_change':
          // For designers, navigate to orders screen
          if (notification.data?.orderId) {
            navigation.navigate('Orders');
          }
          break;
          
        default:
          // For other notification types, just close the modal
          break;
      }
    }
    
    setModalVisible(false);
  };
  
  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem 
      read={item.read}
      onPress={() => handleNotificationPress(item.id)}
    >
      <NotificationTitle>{item.title}</NotificationTitle>
      <NotificationMessage>{item.message}</NotificationMessage>
      <NotificationTime>{formatDate(new Date(item.createdAt))}</NotificationTime>
    </NotificationItem>
  );
  
  return (
    <>
      <BellContainer lightMode={lightMode} onPress={() => setModalVisible(true)}>
        <Ionicons 
          name="notifications-outline" 
          size={24} 
          color={lightMode ? "#333" : "white"} 
        />
        {unreadCount > 0 && (
          <Badge>
            <BadgeText>{unreadCount > 9 ? '9+' : unreadCount}</BadgeText>
          </Badge>
        )}
      </BellContainer>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContainer>
          <NotificationsContainer>
            <NotificationHeader>
              <HeaderTitle>Notifications</HeaderTitle>
              <View style={{ flexDirection: 'row' }}>
                {notifications.length > 0 && (
                  <>
                    <ClearButton onPress={() => markAllAsRead()}>
                      <ClearText>Mark all read</ClearText>
                    </ClearButton>
                    <ClearButton onPress={() => clearNotifications()}>
                      <ClearText>Clear all</ClearText>
                    </ClearButton>
                  </>
                )}
                <ClearButton onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </ClearButton>
              </View>
            </NotificationHeader>
            
            {notifications.length === 0 ? (
              <EmptyContainer>
                <Ionicons name="notifications-off-outline" size={50} color="#CBD5E1" />
                <EmptyText>No notifications yet</EmptyText>
              </EmptyContainer>
            ) : (
              <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id}
              />
            )}
          </NotificationsContainer>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default NotificationBell; 
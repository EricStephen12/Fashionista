import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

export type NotificationType = 
  // Designer notifications
  | 'verification_approved'
  | 'verification_rejected'
  | 'product_approved'
  | 'product_rejected'
  | 'product_featured'
  | 'designer_payment_received'
  | 'designer_chat_message'
  
  // Customer notifications
  | 'order_placed'
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'payment_processed'
  | 'promotion'
  | 'designer_new_product'
  | 'price_drop'
  | 'restock'
  | 'support_message'
  | 'support_ticket_update'
  
  // Common notifications
  | 'order_status_change'
  | 'payment_received'
  | 'message_received'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any; // Additional data related to the notification
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useUser();
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  // Mock some initial notifications for demo purposes
  useEffect(() => {
    if (user?.role === 'designer') {
      // For designers
      if (user.verificationStatus === 'pending') {
        addNotification({
          type: 'system',
          title: 'Verification In Progress',
          message: 'Your designer verification is being reviewed by our team. This usually takes 1-2 business days.'
        });
      } else if (user.verificationStatus === 'verified') {
        addNotification({
          type: 'verification_approved',
          title: 'Verification Approved',
          message: 'Congratulations! Your designer account has been verified. You can now list products on our platform.'
        });
      }
      
      // Add a sample order notification for designers
      addNotification({
        type: 'order_status_change',
        title: 'New Order Received',
        message: 'You have received a new order for "Summer Floral Dress". Check your orders for details.',
        data: { orderId: 'order-123', productName: 'Summer Floral Dress' }
      });
      
      // Add a sample chat notification for designers
      addNotification({
        type: 'designer_chat_message',
        title: 'New Message from Sarah',
        message: 'I have a question about the Summer Floral Dress sizing...',
        data: { 
          contactId: 'c1', 
          customerName: 'Sarah Johnson',
          productId: 'p1',
          productName: 'Summer Floral Dress'
        }
      });
    } else if (user?.role === 'customer') {
      // For customers
      addNotification({
        type: 'system',
        title: 'Welcome to Fashionista',
        message: 'Discover unique designs from talented designers around the world.'
      });
      
      // Add sample order notifications for customers
      addNotification({
        type: 'order_shipped',
        title: 'Order Shipped',
        message: 'Your order #12345 has been shipped and is on its way!',
        data: { orderId: 'order-12345', trackingNumber: 'TRK123456789' }
      });
      
      addNotification({
        type: 'promotion',
        title: 'Summer Sale',
        message: 'Enjoy 20% off on all summer collection items. Use code SUMMER20.',
        data: { promoCode: 'SUMMER20', expiryDate: '2023-08-31' }
      });
      
      addNotification({
        type: 'designer_new_product',
        title: 'New from JD Fashion',
        message: 'JD Fashion just added new items to their collection. Check them out!',
        data: { designerId: 'designer-123', designerName: 'JD Fashion' }
      });
    }
  }, [user?.id]);
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        addNotification, 
        markAsRead, 
        markAllAsRead, 
        clearNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 
import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TimelineScreen from '../screens/TimelineScreen';
import DesignerStoresScreen from '../screens/DesignerStoresScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { View, StyleSheet, Platform, Text, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useUser } from '../UserContext';
import DesignerProductListScreen from '../screens/DesignerProductListScreen';
import DesignerDashboardScreen from '../screens/DesignerDashboardScreen';
import DesignerOrdersScreen from '../screens/DesignerOrdersScreen';
import DesignerCallScreen from '../screens/DesignerCallScreen';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define navigation types
export type RootStackParamList = {
  // Auth screens
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  
  // Common screens
  Store: { storeId: string };
  Profile: undefined;
  Chat: { contactId: string; initialMessage?: string; productId?: string; orderId?: string };
  Search: undefined;
  CustomerSupport: undefined;
  
  // Designer screens
  Dashboard: undefined;
  MyProducts: undefined;
  Orders: undefined;
  AddProduct: undefined;
  EditProduct: { productId: string };
  DesignerVerification: undefined;
  DesignerCalls: undefined;
  MessageCustomer: { customerId: string };
  
  // Customer screens
  Timeline: undefined;
  Explore: undefined;
  Cart: undefined;
  ProductDetail: { productId: string };
  ARMeasurement: { productId: string };
  Checkout: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const MainTabs = () => {
  const { user } = useUser();
  
  // Check if user is a designer
  const isDesigner = user?.role === 'designer';
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={50}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: isDesigner ? '#7c4dff' : '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarItemStyle: {
          padding: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'ellipse';
          
          if (route.name === 'Timeline') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Explore') iconName = focused ? 'compass' : 'compass-outline';
          if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
          if (route.name === 'Orders') iconName = focused ? 'receipt' : 'receipt-outline';
          if (route.name === 'MyProducts') iconName = focused ? 'shirt' : 'shirt-outline';
          if (route.name === 'DesignerCalls') iconName = focused ? 'videocam' : 'videocam-outline';
          
          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName as any} size={24} color={color} />
              {focused && <View style={[styles.indicator, { backgroundColor: isDesigner ? '#7c4dff' : '#3B82F6' }]} />}
            </View>
          );
        },
      })}
    >
      {isDesigner ? (
        // Designer Tabs
        <>
          <Tab.Screen 
            name="Dashboard" 
            component={DesignerDashboardScreen}
            options={{
              title: 'Dashboard'
            }}
          />
          <Tab.Screen 
            name="MyProducts" 
            component={DesignerProductListScreen}
            options={{
              title: 'Products'
            }}
          />
          <Tab.Screen 
            name="Orders" 
            component={DesignerOrdersScreen}
            options={{
              title: 'Orders'
            }}
          />
          <Tab.Screen 
            name="DesignerCalls" 
            component={DesignerCallScreen}
            options={{
              title: 'Calls'
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              title: 'Profile'
            }}
          />
        </>
      ) : (
        // Customer Tabs
        <>
          <Tab.Screen 
            name="Timeline" 
            component={TimelineScreen}
            options={{
              title: 'Home'
            }}
          />
          <Tab.Screen 
            name="Explore" 
            component={DesignerStoresScreen} 
            options={{
              title: 'Explore'
            }}
          />
          <Tab.Screen 
            name="Cart" 
            component={CartScreen}
            options={{
              title: 'Cart'
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              title: 'Profile'
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 30 : 20,
    height: 70,
    borderRadius: 25,
    paddingBottom: Platform.OS === 'ios' ? 0 : 8,
    paddingTop: 8,
    borderTopWidth: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  }
});

export default MainTabs; 
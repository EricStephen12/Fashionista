import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';


// Screens
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import MainTabs from './src/MainTabs';
import SplashScreen from './src/components/SplashScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ARMeasurementScreen from './screens/ARMeasurementScreen';
import SearchScreen from './screens/SearchScreen';
import ChatScreen from './screens/ChatScreen';
import CustomerSupportScreen from './screens/CustomerSupportScreen';
import StoreScreen from './screens/StoreScreen';
import AddProductScreen from './screens/AddProductScreen';
import EditProductScreen from './screens/EditProductScreen';
import DesignerVerificationScreen from './screens/DesignerVerificationScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import DesignerCallScreen from './screens/DesignerCallScreen';

// Context Providers
import { UserProvider, useUser } from './UserContext';
import { CartProvider } from './src/context/CartContext';
import { NotificationProvider } from './NotificationContext';

// Theme
import { theme } from './src/theme';

const Stack = createNativeStackNavigator();

// Simple loading component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <LottieView
      source={require('./assets/loader.json')}
      autoPlay
      loop
      style={{ width: 200, height: 200 }}
    />
  </View>
);

const AppContent = () => {
  const { user } = useUser();
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Any initialization logic can go here
        setIsAppReady(true);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  // Show splash screen first
  if (!isSplashDone) {
    return (
      <SplashScreen 
        onAnimationComplete={() => setIsSplashDone(true)}
      />
    );
  }

  // Show loading while checking app state
  if (!isAppReady) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent 
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: 'white' },
        }}
      >
        {!user ? (
          // Auth screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
          </>
        ) : (
          // Main app screens
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="ARMeasurement" 
              component={ARMeasurementScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Search" 
              component={SearchScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="CustomerSupport" 
              component={CustomerSupportScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Store" 
              component={StoreScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="AddProduct" 
              component={AddProductScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="EditProduct" 
              component={EditProductScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="DesignerVerification" 
              component={DesignerVerificationScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Checkout" 
              component={CheckoutScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="DesignerCall" 
              component={DesignerCallScreen} 
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <UserProvider>
      <NotificationProvider>
        <CartProvider>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </CartProvider>
      </NotificationProvider>
    </UserProvider>
  );
};

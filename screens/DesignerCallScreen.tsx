import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Modal,
  Animated,
  Vibration,
  Platform,
  Alert
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const DesignerCallScreen = () => {
  // Refs
  const cameraRef = useRef(null);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // States
  const [hasPermission, setHasPermission] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle, incoming, ongoing
  const [showCallScreen, setShowCallScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [recentCalls, setRecentCalls] = useState([
    {
      id: '1',
      customerName: 'Emma Johnson',
      customerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      product: 'Silk Evening Gown',
      time: '2 hours ago',
      duration: '14:23',
      status: 'completed'
    },
    {
      id: '2',
      customerName: 'Michael Brown',
      customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      product: 'Custom Suit',
      time: 'Yesterday',
      duration: '18:05',
      status: 'completed'
    }
  ]);
  
  const navigation = useNavigation();
  
  // Initialize
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    
    // Simulate incoming call after 5 seconds (for demo purposes)
    const callTimer = setTimeout(() => {
      simulateIncomingCall();
    }, 5000);
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
    
    // Pulse animation for incoming calls
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    );
    
    if (showIncomingCall) {
      pulseAnimation.start();
    }
    
    return () => {
      clearTimeout(callTimer);
      pulseAnimation.stop();
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [showIncomingCall]);
  
  // Simulate incoming call
  const simulateIncomingCall = () => {
    const mockCall = {
      id: '3',
      customerName: 'Sarah Williams',
      customerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
      product: 'Custom Dress',
      time: 'Now',
      productImage: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=100&q=80'
    };
    
    setIncomingCall(mockCall);
    setShowIncomingCall(true);
    setCallStatus('incoming');
    
    // Vibrate phone for incoming call
    if (Platform.OS === 'android') {
      Vibration.vibrate([500, 1000, 500, 1000], true);
    } else {
      Vibration.vibrate([0, 500, 1000, 500, 1000], true);
    }
  };
  
  // Accept call
  const acceptCall = () => {
    Vibration.cancel();
    setShowIncomingCall(false);
    setCallStatus('ongoing');
    setShowCallScreen(true);
    
    // Start recording timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setRecordingInterval(interval);
    
    // Simulate customer messages
    simulateCustomerInteraction();
  };
  
  // Decline call
  const declineCall = () => {
    Vibration.cancel();
    setShowIncomingCall(false);
    setCallStatus('idle');
    
    Alert.alert(
      'Call Declined',
      'You can call the customer back later from your recent calls list.',
      [{ text: 'OK' }]
    );
    
    // Add to recent calls
    if (incomingCall) {
      setRecentCalls(prev => [
        {
          ...incomingCall,
          status: 'missed',
          time: 'Just now',
          duration: '0:00'
        },
        ...prev
      ]);
    }
  };
  
  // End call
  const endCall = () => {
    if (recordingInterval) {
      clearInterval(recordingInterval);
    }
    
    setShowCallScreen(false);
    setCallStatus('idle');
    setRecordingTime(0);
    
    // Add to recent calls
    if (incomingCall) {
      setRecentCalls(prev => [
        {
          ...incomingCall,
          status: 'completed',
          time: 'Just now',
          duration: formatTime(recordingTime)
        },
        ...prev
      ]);
    }
    
    Alert.alert(
      'Call Ended',
      'Measurement session has been saved. Would you like to send a summary to the customer?',
      [
        { text: 'Later', style: 'cancel' },
        { 
          text: 'Send Summary', 
          style: 'default',
          onPress: () => navigation.navigate('MessageCustomer', { customerId: incomingCall?.id })
        }
      ]
    );
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Toggle video
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };
  
  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Simulate customer interaction
  const simulateCustomerInteraction = () => {
    const messages = [
      "Hi, I'm interested in getting this dress custom-made",
      "I'm ready for the measurement session",
      "Should I stand further back from the camera?",
      "Like this?",
      "Should I turn to the side now?",
      "Is this the right position?",
      "Got it, thank you for your help!"
    ];
    
    let messageIndex = 0;
    
    const showNextMessage = () => {
      if (messageIndex < messages.length) {
        setCurrentMessage(messages[messageIndex]);
        setShowMessage(true);
        
        setTimeout(() => {
          setShowMessage(false);
          messageIndex++;
          
          if (messageIndex < messages.length) {
            setTimeout(showNextMessage, 5000);
          }
        }, 4000);
      }
    };
    
    // Start after 2 seconds
    setTimeout(showNextMessage, 2000);
  };
  
  // Render incoming call modal
  const renderIncomingCallModal = () => (
    <Modal
      visible={showIncomingCall}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.incomingCallCard,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <LinearGradient
            colors={['#1a1a2e', '#16213e']}
            style={styles.callCardGradient}
          >
            <Text style={styles.incomingCallTitle}>Incoming Measurement Call</Text>
            
            <View style={styles.customerInfoContainer}>
              <Image 
                source={{ uri: incomingCall?.customerImage }} 
                style={styles.customerImage} 
              />
              <Text style={styles.customerName}>{incomingCall?.customerName}</Text>
              <Text style={styles.productName}>Product: {incomingCall?.product}</Text>
            </View>
            
            <View style={styles.productImageContainer}>
              <Image 
                source={{ uri: incomingCall?.productImage }} 
                style={styles.productImage} 
              />
            </View>
            
            <View style={styles.callActionButtons}>
              <TouchableOpacity 
                style={[styles.callActionButton, styles.declineButton]}
                onPress={declineCall}
              >
                <Ionicons name="close" size={30} color="white" />
                <Text style={styles.callActionText}>Decline</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.callActionButton, styles.acceptButton]}
                onPress={acceptCall}
              >
                <Ionicons name="videocam-outline" size={30} color="white" />
                <Text style={styles.callActionText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
  
  // Render call screen
  const renderCallScreen = () => (
    <Modal
      visible={showCallScreen}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.callScreenContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        
        {/* Customer video (full screen) */}
        {hasPermission && (
          <View style={StyleSheet.absoluteFill}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80' }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          </View>
        )}
        
        {/* Call header */}
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.callHeader}
        >
          <View style={styles.callHeaderContent}>
            <Text style={styles.callCustomerName}>{incomingCall?.customerName}</Text>
            <View style={styles.callTimerContainer}>
              <View style={styles.recordingDot} />
              <Text style={styles.callTimer}>{formatTime(recordingTime)}</Text>
            </View>
          </View>
        </LinearGradient>
        
        {/* Customer message */}
        {showMessage && (
          <View style={styles.customerMessageContainer}>
            <View style={styles.customerMessage}>
              <Text style={styles.customerMessageText}>{currentMessage}</Text>
            </View>
          </View>
        )}
        
        {/* Designer video (PiP) */}
        <View style={styles.designerVideoContainer}>
          {hasPermission ? (
            <Camera
              style={styles.designerVideo}
              type={CameraType.front}
              ratio="16:9"
              ref={cameraRef}
            />
          ) : (
            <View style={[styles.designerVideo, { backgroundColor: '#1a1a2e' }]}>
              <Ionicons name="videocam-off-outline" size={24} color="#fff" />
            </View>
          )}
          
          {isVideoOff && (
            <View style={styles.videoOffOverlay}>
              <Ionicons name="eye-off-outline" size={24} color="#fff" />
            </View>
          )}
        </View>
        
        {/* Guidance tools */}
        <View style={styles.guidanceToolsContainer}>
          <TouchableOpacity style={styles.guidanceTool}>
            <Ionicons name="body-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.guidanceTool}>
            <Ionicons name="resize-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.guidanceTool}>
            <Ionicons name="grid-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Call controls */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.callControls}
        >
          <TouchableOpacity 
            style={[styles.controlButton, isMuted && styles.activeControlButton]} 
            onPress={toggleMute}
          >
            <Ionicons 
              name={isMuted ? "mic-off-outline" : "mic-outline"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, isVideoOff && styles.activeControlButton]}
            onPress={toggleVideo}
          >
            <Ionicons 
              name={isVideoOff ? "videocam-off-outline" : "videocam-outline"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="chatbubble-outline" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
            <Ionicons name="call-outline" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Measurement Calls</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="settings-outline" size={24} color="#1a1a2e" />
        </TouchableOpacity>
      </View>
      
      {/* Status card */}
      <Animated.View 
        style={[
          styles.statusCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={['#7c4dff', '#9c27b0']}
          style={styles.statusCardGradient}
        >
          <View style={styles.statusIconContainer}>
            <Ionicons name="videocam-outline" size={28} color="white" />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>You're Available</Text>
            <Text style={styles.statusDescription}>
              Customers can request measurement calls
            </Text>
          </View>
          <TouchableOpacity style={styles.statusToggle}>
            <View style={styles.toggleTrack}>
              <View style={styles.toggleThumb} />
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
      
      {/* Recent calls */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Calls</Text>
        
        {recentCalls.map(call => (
          <View key={call.id} style={styles.callItem}>
            <Image source={{ uri: call.customerImage }} style={styles.callItemImage} />
            <View style={styles.callItemInfo}>
              <Text style={styles.callItemName}>{call.customerName}</Text>
              <Text style={styles.callItemProduct}>{call.product}</Text>
              <View style={styles.callItemMeta}>
                <Text style={styles.callItemTime}>{call.time}</Text>
                <Text style={styles.callItemDuration}>{call.duration}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callItemButton}>
              <Ionicons 
                name="call-outline" 
                size={20} 
                color={call.status === 'missed' ? '#ef4444' : '#10b981'} 
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      {/* Render modals */}
      {renderIncomingCallModal()}
      {renderCallScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#7c4dff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  statusCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  statusIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  statusToggle: {
    marginLeft: 10,
  },
  toggleTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  sectionContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 15,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  callItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  callItemInfo: {
    flex: 1,
  },
  callItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  callItemProduct: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  callItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callItemTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginRight: 10,
  },
  callItemDuration: {
    fontSize: 12,
    color: '#9ca3af',
  },
  callItemButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomingCallCard: {
    width: '90%',
    maxWidth: 350,
    borderRadius: 16,
    overflow: 'hidden',
  },
  callCardGradient: {
    padding: 20,
    alignItems: 'center',
  },
  incomingCallTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  customerInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  customerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  customerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  productName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  productImageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  callActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  callActionButton: {
    alignItems: 'center',
    padding: 10,
  },
  declineButton: {
    backgroundColor: '#ef4444',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#10b981',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
  },
  callActionText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
  callScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  callHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  callHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callCustomerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  callTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 5,
  },
  callTimer: {
    color: 'white',
    fontSize: 12,
  },
  customerMessageContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    alignItems: 'flex-start',
    zIndex: 10,
  },
  customerMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    maxWidth: '80%',
  },
  customerMessageText: {
    color: '#1a1a2e',
    fontSize: 14,
  },
  designerVideoContainer: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 10,
  },
  designerVideo: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOffOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidanceToolsContainer: {
    position: 'absolute',
    top: '50%',
    right: 20,
    transform: [{ translateY: -50 }],
    zIndex: 10,
  },
  guidanceTool: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  callControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControlButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  endCallButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DesignerCallScreen; 
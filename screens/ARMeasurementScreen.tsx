import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  Animated,
  ScrollView,
  Vibration
} from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../src/MainTabs';
import mockService from '../src/services/mockData';

const { width, height } = Dimensions.get('window');

// Types
type ARMeasurementRouteProp = RouteProp<RootStackParamList, 'ARMeasurement'>;
type ARMeasurementNavigationProp = NavigationProp<RootStackParamList>;

const ARMeasurementScreen = () => {
  const navigation = useNavigation<ARMeasurementNavigationProp>();
  const route = useRoute<ARMeasurementRouteProp>();
  const productId = route.params?.productId || 'default';
  const cameraRef = useRef<Camera>(null);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  
  // States
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [designer, setDesigner] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'declined'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  const [designerSpeaking, setDesignerSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  // Designer messages for the call
  const designerMessages = [
    "Hi there! I'm ready to help you with measurements today.",
    "First, let's make sure you're in a well-lit area with enough space to move.",
    "Could you stand about 6 feet away from the camera so I can see your full silhouette?",
    "Perfect! Now let's start with your shoulder width. Could you face the camera directly?",
    "Great! I'm capturing your shoulder measurements now.",
    "Now turn to your side so I can see your profile for chest and waist measurements.",
    "Excellent! I'm recording these measurements in our system.",
    "Could you extend your arms to the sides for sleeve length measurement?",
    "Perfect, thank you. Now I need to measure your inseam. Could you stand with your feet shoulder-width apart?",
    "Let me take a few more measurements. This will just take a moment.",
    "For the most accurate measurements, please stand with your arms slightly away from your body.",
    "I'm getting all the data I need. These measurements will help create a perfect fit.",
    "Almost done! Just a few more calculations...",
    "Perfect! I've completed all the measurements. Would you like me to explain any of them in detail?",
    "These measurements have been saved to your profile. You can use them for any future orders.",
    "Thank you for your patience. Your custom measurements will ensure a perfect fit for your order."
  ];
  
  // Initialize app
  useEffect(() => {
    console.log('ARMeasurementScreen mounted');
    let mounted = true;
    
    const initializeApp = async () => {
      try {
        console.log('Initializing app and requesting permissions');
        // Request camera permission
        const { status } = await Camera.requestCameraPermissionsAsync();
        console.log('Camera permission status:', status);
        
        if (mounted) {
          setHasPermission(status === 'granted');
        }
        
        // Simulate loading with smooth transition
        setTimeout(() => {
          if (mounted) {
            console.log('Loading complete, starting intro animation');
            setLoading(false);
            startIntroAnimation();
          }
        }, 2000);
        
        // Load designer data
        loadDesignerData();
        
      } catch (error) {
        console.error('Initialization error:', error);
        if (mounted) {
          setHasPermission(false);
          setLoading(false);
        }
      }
    };
    
    initializeApp();
    
    return () => {
      console.log('ARMeasurementScreen unmounting');
      mounted = false;
      if (recordingInterval) {
        console.log('Clearing recording interval');
        clearInterval(recordingInterval);
      }
    };
  }, []);
  
  // Load designer data
  const loadDesignerData = async () => {
    try {
      // Simulate API call with mock data
      const mockDesigner = {
        id: 'designer1',
        name: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200&q=80',
        specialization: 'Custom Tailoring & Design',
        rating: 4.9,
        reviews: 342,
        status: 'online',
        experience: '8+ years',
        languages: ['English', 'Spanish'],
        responseTime: '< 2 min'
      };
      setDesigner(mockDesigner);
    } catch (error) {
      console.error('Error loading designer:', error);
    }
  };
  
  // Start intro animation
  const startIntroAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  // Breathing animation for call button
  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    breathingAnimation.start();
    
    return () => breathingAnimation.stop();
  }, []);
  
  // Calling animation
  useEffect(() => {
    if (callStatus === 'calling') {
      // Pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      
      // Rotate animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );
      
      pulseAnimation.start();
      rotateAnimation.start();
      
      return () => {
        pulseAnimation.stop();
        rotateAnimation.stop();
      };
    } else {
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
    }
  }, [callStatus]);
  
  // Handle video call button press
  const handleVideoCall = () => {
    console.log('Video call button pressed');
    Vibration.vibrate(50);
    
    Alert.alert(
      'Video Call Guidelines',
      'This call will be recorded for quality purposes. Please do not share personal contact information or payment details during the call.',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => {
            console.log('Call canceled');
            Vibration.vibrate(30);
          }
        },
        { 
          text: 'Start Call', 
          style: 'default',
          onPress: () => {
            console.log('Call accepted, initiating...');
            initiateCall();
          }
        }
      ]
    );
  };
  
  // Initiate call
  const initiateCall = () => {
    console.log('Initiating call...');
    setCallStatus('calling');
    setShowIncomingCall(true);
    Vibration.vibrate([100, 50, 100]);
    
    // Simulate realistic connection time
    const connectionDelay = Math.random() * 2000 + 3000; // 3-5 seconds
    console.log(`Connection will complete in ${connectionDelay}ms`);
    
    // Simulate connection stages
    const stages = [
      { time: connectionDelay * 0.3, action: () => {
        console.log('Stage 1: Establishing secure connection...');
        // Show first stage of connection
        setCurrentMessage("Establishing secure connection...");
        setShowMessage(true);
      }},
      { time: connectionDelay * 0.6, action: () => {
        console.log('Stage 2: Designer is being notified...');
        // Show second stage of connection
        setCurrentMessage("Designer is being notified...");
      }},
      { time: connectionDelay * 0.9, action: () => {
        console.log('Stage 3: Designer accepted call!');
        // Show final stage of connection
        setCurrentMessage("Designer accepted your call!");
        // Simulate vibration for accepted call
        Vibration.vibrate(100);
      }},
      { time: connectionDelay, action: () => {
        console.log('Stage 4: Connection complete, starting video call');
        // Complete connection
        setCallStatus('connected');
        setShowMessage(false);
        
        // Small delay before closing the calling screen
        setTimeout(() => {
          console.log('Starting video call modal');
          setShowIncomingCall(false);
          startVideoCall();
          // Vibrate to indicate call connected
          Vibration.vibrate([50, 100, 50, 100]);
        }, 1000);
      }}
    ];
    
    // Schedule the connection stages
    stages.forEach(stage => {
      setTimeout(stage.action, stage.time);
    });
  };
  
  // Start video call
  const startVideoCall = () => {
    console.log('Video call starting');
    setShowVideoCallModal(true);
    setIsRecording(true);
    
    // Start recording timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setRecordingInterval(interval as any);
    
    // Simulate designer interaction
    setTimeout(() => {
      console.log('Starting designer interaction');
      simulateDesignerInteraction();
    }, 1500);
    
    // Simulate connection quality changes
    setTimeout(() => {
      console.log('Connection quality changed to good');
      setConnectionQuality('good');
    }, 10000);
    setTimeout(() => {
      console.log('Connection quality changed to excellent');
      setConnectionQuality('excellent');
    }, 20000);
  };
  
  // Simulate designer speaking and messages
  const simulateDesignerInteraction = () => {
    let messageIndex = 0;
    
    const showNextMessage = () => {
      if (messageIndex < designerMessages.length) {
        setDesignerSpeaking(true);
        setCurrentMessage(designerMessages[messageIndex]);
        setShowMessage(true);
        
        // Show message for 4-6 seconds depending on length
        const messageLength = designerMessages[messageIndex].length;
        const displayTime = Math.min(Math.max(messageLength * 60, 4000), 6000);
        
        setTimeout(() => {
          setShowMessage(false);
          setDesignerSpeaking(false);
          
          // Pause between messages
          setTimeout(() => {
            messageIndex++;
            if (messageIndex < designerMessages.length) {
              showNextMessage();
            }
          }, 2000);
        }, displayTime);
      }
    };
    
    // Start the message sequence
    showNextMessage();
  };
  
  // End video call
  const endVideoCall = () => {
    if (recordingInterval) {
      clearInterval(recordingInterval);
    }
    
    setIsRecording(false);
    setRecordingTime(0);
    setCallStatus('idle');
    setShowVideoCallModal(false);
    setShowIncomingCall(false);
    setIsMuted(false);
    setIsVideoOff(false);
    
    Vibration.vibrate(100);
    
    Alert.alert(
      '✅ Measurement Complete',
      'Your measurement session has been completed successfully!\n\n• All measurements have been saved to your profile\n• Designer will send a detailed summary within 24 hours\n• You can now proceed with your custom order',
      [{ 
        text: 'Continue Shopping', 
        onPress: () => {
          // Navigate back to product detail
          navigation.goBack();
        }
      }]
    );
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    Vibration.vibrate(30);
  };
  
  // Toggle video
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    Vibration.vibrate(30);
  };
  
  // Switch camera
  const switchCamera = () => {
    Vibration.vibrate(30);
    // Camera switch logic would go here
  };
  
  // Show measurement guide
  const showGuide = () => {
    setShowMeasurementGuide(true);
    Vibration.vibrate(30);
  };
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get connection quality color
  const getQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return '#10b981';
      case 'good': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#10b981';
    }
  };
  
  // Handle back navigation
  const handleBack = () => {
    if (showVideoCallModal) {
      Alert.alert(
        '⚠️ End Call?',
        'Are you sure you want to end the video call session?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'End Call', 
            style: 'destructive', 
            onPress: endVideoCall 
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };
  
  // Permission denied screen
  if (hasPermission === false) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.permissionContainer}
      >
        <View style={styles.permissionContent}>
          <Ionicons name="camera-outline" size={80} color="white" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera permission to enable video calls with designers for measurement assistance.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={handleBack}>
            <Text style={styles.permissionButtonText}>Go to Settings</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Background Camera */}
      {hasPermission && !loading && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          type={CameraType.front}
          ratio="16:9"
        />
      )}
      
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.7)']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Designer Consultation</Text>
          <Text style={styles.headerSubtitle}>AR Measurement Session</Text>
        </View>
        <TouchableOpacity style={styles.helpButton} onPress={showGuide}>
          <Ionicons name="help-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Main Content */}
      <Animated.View 
        style={[
          styles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <LinearGradient
            colors={['rgba(124, 77, 255, 0.2)', 'rgba(124, 77, 255, 0.05)']}
            style={styles.welcomeGradient}
          >
            <Ionicons name="videocam-outline" size={32} color="#7c4dff" />
            <Text style={styles.welcomeTitle}>Ready for your session?</Text>
            <Text style={styles.welcomeText}>
              Connect with a professional designer for personalized measurement guidance
            </Text>
            
            {/* Test Button - This is the one that works */}
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: '#7c4dff',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 25,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#7c4dff',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              onPress={() => {
                console.log('TEST BUTTON PRESSED');
                initiateCall();
              }}
            >
              <Ionicons name="videocam-outline" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Start Measurement Call</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        
        {/* Designer Card */}
        {designer && (
          <View style={styles.designerCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
              style={styles.designerGradient}
            >
              <View style={styles.designerHeader}>
                <View style={styles.designerAvatarContainer}>
                  <Image source={{ uri: designer.avatar }} style={styles.designerAvatar} />
                  <View style={[styles.statusIndicator, { backgroundColor: '#10b981' }]} />
                </View>
                <View style={styles.designerInfo}>
                  <Text style={styles.designerName}>{designer.name}</Text>
                  <Text style={styles.designerRole}>{designer.specialization}</Text>
                  <View style={styles.designerMeta}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#fbbf24" />
                      <Text style={styles.rating}>{designer.rating}</Text>
                      <Text style={styles.reviews}>({designer.reviews})</Text>
                    </View>
                    <Text style={styles.experience}>{designer.experience}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.designerStats}>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <Text style={styles.statText}>{designer.responseTime}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="language-outline" size={16} color="#6b7280" />
                  <Text style={styles.statText}>{designer.languages.join(', ')}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}
        
        {/* Stats Container */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="timer-outline" size={24} color="#7c4dff" />
            <Text style={styles.statNumber}>15min</Text>
            <Text style={styles.statLabel}>Avg. Session</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Secure</Text>
          </View>
        </View>
      </Animated.View>
      
      {/* Loading Screen */}
      {loading && (
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingTitle}>Initializing Camera</Text>
            <Text style={styles.loadingText}>Please wait while we set up your session...</Text>
          </View>
        </View>
      )}
      
      {/* Video Call Modal */}
      <Modal
        visible={showVideoCallModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          console.log('Modal back button pressed');
          Alert.alert(
            'End Call?', 
            'Are you sure you want to end this call?', 
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'End Call', onPress: endVideoCall, style: 'destructive' }
            ]
          );
        }}
        hardwareAccelerated={true}
        statusBarTranslucent={true}
      >
        <View style={styles.videoCallContainer}>
          {/* Main video (user) */}
          {hasPermission && !isVideoOff && (
            <Camera
              style={StyleSheet.absoluteFillObject}
              type={CameraType.front}
              ratio="16:9"
            />
          )}
          
          {/* Video off overlay */}
          {isVideoOff && (
            <View style={styles.videoOffOverlay}>
              <Ionicons name="videocam-outline" size={60} color="white" />
              <Text style={styles.videoOffText}>Camera is off</Text>
            </View>
          )}
          
          {/* Call Header */}
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'transparent']}
            style={styles.videoCallHeader}
          >
            <View style={styles.callHeaderLeft}>
              <Text style={styles.callerName}>{designer?.name || 'Designer'}</Text>
              <View style={styles.callStatusContainer}>
                <View style={[styles.connectionDot, { backgroundColor: getQualityColor() }]} />
                <Text style={styles.callStatus}>
                  {connectionQuality} • {formatTime(recordingTime)}
                </Text>
              </View>
            </View>
            
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingLabel}>REC</Text>
              </View>
            )}
          </LinearGradient>
          
          {/* Designer Message Bubble */}
          {showMessage && (
            <Animated.View 
              style={{
                position: 'absolute',
                top: 100,
                left: 20,
                right: 20,
                zIndex: 10,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }}
            >
              <LinearGradient
                colors={['rgba(124, 77, 255, 0.9)', 'rgba(124, 77, 255, 0.7)']}
                style={{
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '500',
                }}>{currentMessage}</Text>
              </LinearGradient>
            </Animated.View>
          )}
          
          {/* Video call instructions */}
          <View style={styles.instructionsOverlay}>
            <Text style={styles.instructionText}>
              📐 Follow the designer's guidance for accurate measurements
            </Text>
          </View>
          
          {/* Warning Banner - Less overwhelming */}
          <View style={{
            position: 'absolute',
            bottom: 180,
            left: 20,
            right: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: 8,
            borderRadius: 8,
            borderLeftWidth: 3,
            borderLeftColor: '#ef4444',
            zIndex: 5,
          }}>
            <Text style={{
              color: 'white',
              fontSize: 12,
              fontWeight: '400',
              textAlign: 'left',
            }}>
              ⚠️ Remember: Do not share personal contact or payment information
            </Text>
          </View>
          
          {/* Designer Video (PiP) */}
          <View style={styles.designerVideo}>
            <Image 
              source={{ uri: designer?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200&q=80' }}
              style={styles.designerVideoImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.designerVideoOverlay}
            >
              <Text style={styles.designerVideoName}>
                {designer?.name?.split(' ')[0] || 'Designer'}
              </Text>
            </LinearGradient>
            {designerSpeaking && (
              <View style={styles.speakingIndicator}>
                <Ionicons name="volume-high-outline" size={12} color="white" />
              </View>
            )}
          </View>
          
          {/* Call Controls */}
          <View style={styles.callControls}>
            <TouchableOpacity 
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={toggleMute}
            >
              <Ionicons 
                name={isMuted ? "mic-off-outline" : "mic-outline"} 
                size={24} 
                color={isMuted ? "#ef4444" : "white"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
              onPress={toggleVideo}
            >
              <Ionicons 
                name={isVideoOff ? "eye-off-outline" : "videocam-outline"} 
                size={24} 
                color={isVideoOff ? "#ef4444" : "white"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={showGuide}>
              <Ionicons name="help-circle" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.endCallButton]} 
              onPress={endVideoCall}
            >
              <Ionicons name="call" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Calling Modal */}
      <Modal
        visible={showIncomingCall}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowIncomingCall(false)}
      >
        <View style={styles.callingContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.9)', 'rgba(124,77,255,0.3)']}
            style={StyleSheet.absoluteFillObject}
          />
          
          <Animated.View 
            style={[
              styles.callingCard,
              {
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.callingCardGradient}
            >
              <Text style={styles.callingTitle}>
                {callStatus === 'calling' ? 'Connecting to Designer' : 'Designer Connected'}
              </Text>
              
              <Animated.View 
                style={{
                  transform: [
                    { scale: pulseAnim },
                    { 
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })
                    }
                  ],
                  marginVertical: 30
                }}
              >
                <View style={styles.callingAvatarContainer}>
                  <Image 
                    source={{ uri: designer?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200&q=80' }}
                    style={styles.callingAvatar}
                  />
                  <View style={[
                    styles.pulseRing1,
                    { opacity: callStatus === 'calling' ? 1 : 0 }
                  ]} />
                  <View style={[
                    styles.pulseRing2,
                    { opacity: callStatus === 'calling' ? 1 : 0 }
                  ]} />
                  <View style={[
                    styles.pulseRing3,
                    { opacity: callStatus === 'calling' ? 1 : 0 }
                  ]} />
                  
                  {callStatus === 'connected' && (
                    <View style={styles.connectedIndicator}>
                      <Ionicons name="checkmark-circle" size={32} color="#10b981" />
                    </View>
                  )}
                </View>
              </Animated.View>
              
              <Text style={styles.callingName}>{designer?.name || 'Designer'}</Text>
              <Text style={styles.callingStatus}>
                {callStatus === 'calling' 
                  ? 'Establishing secure connection...'
                  : 'Connection established! Starting call...'}
              </Text>
              
              <View style={styles.callingProgress}>
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      {
                        width: callStatus === 'connected' 
                          ? '100%' 
                          : pulseAnim.interpolate({
                              inputRange: [1, 1.3],
                              outputRange: ['20%', '80%']
                            })
                      }
                    ]}
                  />
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setCallStatus('idle');
                  setShowIncomingCall(false);
                }}
              >
                <LinearGradient
                  colors={['rgba(239,68,68,0.2)', 'rgba(239,68,68,0.1)']}
                  style={styles.cancelButtonGradient}
                >
                  <Ionicons name="close" size={20} color="#ef4444" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
      
      {/* Measurement Guide Modal */}
      <Modal
        visible={showMeasurementGuide}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMeasurementGuide(false)}
      >
        <View style={styles.guideContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(124,77,255,0.2)']}
            style={StyleSheet.absoluteFillObject}
          />
          
          <View style={styles.guideContent}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideTitle}>Measurement Guide</Text>
              <TouchableOpacity 
                style={styles.guideCloseButton}
                onPress={() => setShowMeasurementGuide(false)}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.guideScroll}>
              <View style={styles.guideTip}>
                <Ionicons name="bulb" size={24} color="#fbbf24" />
                <Text style={styles.guideTipText}>
                  Ensure good lighting and stand in an open space for best results
                </Text>
              </View>
              
              <View style={styles.guideTip}>
                <Ionicons name="body" size={24} color="#10b981" />
                <Text style={styles.guideTipText}>
                  Wear fitted clothing to help the designer see your body shape
                </Text>
              </View>
              
              <View style={styles.guideTip}>
                <Ionicons name="phone-portrait" size={24} color="#7c4dff" />
                <Text style={styles.guideTipText}>
                  Hold your phone steady and follow the designer's instructions
                </Text>
              </View>
              
              <View style={styles.guideTip}>
                <Ionicons name="shield-checkmark" size={24} color="#ef4444" />
                <Text style={styles.guideTipText}>
                  Your privacy is protected - recordings are encrypted and secure
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  
  // Main Content Styles
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  welcomeCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  welcomeGradient: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Designer Card Styles
  designerCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  designerGradient: {
    padding: 20,
  },
  designerHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  designerAvatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  designerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  designerInfo: {
    flex: 1,
  },
  designerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  designerRole: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },
  designerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 2,
  },
  experience: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  designerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  
  // Stats Container Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  
  // Loading Styles
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
  },
  
  // Permission Styles
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 30,
    borderRadius: 20,
    maxWidth: 400,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  permissionButtonText: {
    color: '#7c4dff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Video Call Styles
  videoCallContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoOffOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  videoOffText: {
    color: 'white',
    fontSize: 18,
    marginTop: 16,
  },
  videoCallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  callHeaderLeft: {
    flex: 1,
  },
  callerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  callStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  callStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  recordingLabel: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  instructionsOverlay: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(124, 77, 255, 0.8)',
    padding: 15,
    borderRadius: 12,
    zIndex: 10,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  designerVideo: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 100,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#1a1a2e',
    zIndex: 10,
  },
  designerVideoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  designerVideoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  designerVideoName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  speakingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  endCallButton: {
    backgroundColor: '#ef4444',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  
  // Calling Modal Styles
  callingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  callingCard: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 350,
  },
  callingCardGradient: {
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  callingTitle: {
    color: '#7c4dff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  callingAvatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callingAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#7c4dff',
  },
  pulseRing1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(124, 77, 255, 0.3)',
  },
  pulseRing2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(124, 77, 255, 0.5)',
  },
  pulseRing3: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(124, 77, 255, 0.2)',
  },
  callingName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
  },
  callingStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginBottom: 20,
  },
  callingProgress: {
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7c4dff',
    borderRadius: 3,
  },
  cancelButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cancelButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  
  // Guide Modal Styles
  guideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  guideContent: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.3)',
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  guideTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  guideCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideScroll: {
    padding: 20,
  },
  guideTip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
  },
  guideTipText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
    lineHeight: 22,
  },
  connectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ARMeasurementScreen;
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://10.0.0.173:5001';

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-200)).current; // Starts hidden off-screen

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -200, // Slide in or out
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  const handleConnectSplitwise = async () => {
    try {
       // 1. The redirect URI that we want Splitwise to call after user logs in:
       const redirectUri = encodeURIComponent('myapp://home'); 
      
       // 2. Ask your backend to generate the Splitwise OAuth URL:
       const response = await fetch(`${BACKEND_URL}/authsplitwise?redirect_uri=${redirectUri}`);
       if (!response.ok) throw new Error('Failed to initiate Splitwise OAuth');
       
       const data = await response.json();
       const { url, state } = data; // `url` is the Splitwise authorize link
 
       // 3. Save the 'state' in AsyncStorage for later verification if needed
       await AsyncStorage.setItem('splitwiseOAuthState', state);

       console.log('Opening Splitwise authorize URL:', url);
 
       // 4. Open the Splitwise authorize URL in the device browser
       const supported = await Linking.canOpenURL(url);
       if (supported) {
         Linking.openURL(url);
       } else {
         Alert.alert('Error', "Can't open the URL");
       }
    } catch (error) {
      console.error('Error connecting to Splitwise:', error);
      Alert.alert('Error', 'There was a problem connecting to Splitwise.');
    }
  };
  

  return (
    <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
      <TouchableOpacity style={styles.menuItem} onPress={handleConnectSplitwise}>
        <Text style={styles.menuText}>Connect Splitwise</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    top: 60, // Ensures it does NOT cover the App Bar
    width: '40%',
    height: '100%',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 5,
    zIndex: 10, // Ensures it appears above content
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b9cd3',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  closeText: {
    color: '#333',
  },
});

export default MenuDrawer;

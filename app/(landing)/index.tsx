import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import React, { useEffect } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import AuthPage from '../(auth)/sign-in';
import Home from '@/components/home';
import { useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://10.0.0.173:5001'; // Replace with your actual backend URL

export default function Page() {
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const handleDeepLink = async (event: { url: string }) => {
      const url = new URL(event.url);
      console.log('Deep link received:', url.toString());

      // e.g. "myapp://home?code=123&state=abc"
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (code && state) {
        // (Optional) Compare `state` with what you stored in AsyncStorage
        const storedState = await AsyncStorage.getItem('splitwiseOAuthState');
        if (storedState !== state) {
          console.error('State mismatch! Potential security risk.');
          return;
        }

        // Now exchange the `code` for an access token via your backend
        try {
          console.log(`Url is ${BACKEND_URL}/callback?code=${code}&state=${state}&email=${email}`);
          const tokenResponse = await fetch(
            `${BACKEND_URL}/callback?code=${code}&state=${state}&email=${email}`
          );
          const tokenData = await tokenResponse.json();

          if (tokenData.access_token) {
            console.log('Splitwise token stored successfully:', tokenData.access_token);
            router.replace('/');
          } else {
            console.error('Error fetching token:', tokenData.error);
          }
        } catch (error) {
          console.error('Error exchanging code for token:', error);
        }
      }
    };

    // Subscribe to deep link events
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if the app was opened via a deep link while it was closed
    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SignedIn>
        <Home />
      </SignedIn>
      <SignedOut>
        <View style={styles.authPage}>
          <AuthPage />
        </View>
      </SignedOut>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  authPage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

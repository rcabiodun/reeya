
import React, { useCallback, useEffect, useState, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from './fontloader';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Image, View, Platform, Alert, Text } from 'react-native';

import OnboardingStack from './stacks/OnboardingStack';
import TabNavigator from './stacks/MainTabStack';


export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [badge_no, setBadgeNO] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [appIsReady, setAppIsReady] = useState(false);

  const handleURL = (url) => {
    const { hostname, path, queryParams } = Linking.parse(url);
    if (path === 'alert') {
      console.log(queryParams.str);
    } else {
      console.log(path, queryParams);
    }
  }



  const Stack = createNativeStackNavigator()

  const config = {
    screens: {
      TabNav: {
        screens: {
          More: {
            screens: {
              FoodItemsofVendor: {
                path: 'vendors/:vendorname/:vendorid',
              },
            },
          }


        },
      },
    }
  }
  const linking = {
    prefixes: ['mychat://', 'https://eathub.live'],
    config
  };

  useEffect(() => {
    async function prepare() {
      try {

        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await _loadMyFonts();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        //await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        console.log('Loading app...')
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);



  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name='OnboardingStack' component={OnboardingStack} />
        <Stack.Screen options={{ headerShown: false }} name='MainTab' component={TabNavigator} />

      </Stack.Navigator>
    </NavigationContainer>

  );

}
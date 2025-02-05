import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNavigationContainerRef } from '@react-navigation/native';

import FeedScreen from './screens/FeedScreen';
import LiveScreen from './screens/LiveScreen';
import PlayerScreen from './screens/PlayerScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

import branch, { BranchParams } from 'react-native-branch';
import { StreamLayer, StreamLayerTheme } from 'react-native-streamlayer';
import Config from "react-native-config";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Live" component={LiveScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {

  const navigationRef = createNavigationContainerRef()

  const [isInitialized, setInitialized] = useState(false);

  useEffect(() => { checkInitialized() });

  useEffect(() => {
    const subscription = branch.subscribe({
      onOpenStart: ({ uri, cachedInitialEvent }) => {
        // cachedInitialEvent is true if the event was received by the
        // native layer before JS loaded.
        console.log(
          'Branch subscribe onOpenStart, will open ' +
          uri +
          ' cachedInitialEvent is ' +
          cachedInitialEvent,
        );
      },
      onOpenComplete: ({ error, params, uri }) => {
        if (error) {
          console.error(
            'Branch subscribe onOpenComplete, Error from opening uri: ' +
            uri +
            ' error: ' +
            error,
          );
          return;
        }
        if (params !== undefined) {
          processBranchLink(params)
        }
      },
    });
    return () => subscription();
  });

  const processBranchLink = async (params: BranchParams) => {
    try {
      const invite = await StreamLayer.getInvite(params);
      console.log(`Invite: ${JSON.stringify(invite)}`)
      if (invite !== undefined && invite !== null) {
        checkAuth(() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate('Player', { hocMode: false, invite: invite });
          }
        })
      }
    } catch (e) {
      console.error(`Error: ${JSON.stringify(e)}`);
    }
  };

  const checkAuth = async (block: () => void) => {
    try {
      const isUserAuthorized = await StreamLayer.isUserAuthorized()
      if (!isUserAuthorized) {
        await StreamLayer.useAnonymousAuth();
      }
      block()
    } catch (e) {
      console.error(e);
    }
  };

  const checkInitialized = async () => {
    try {
      if (!isInitialized) {
        await StreamLayer.initSdk({
          sdkKey: Config.SL_SDK_API_KEY,
          theme: StreamLayerTheme.Green,
          isLoggingEnabled: true
        }, false)
        setInitialized(true)
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Player" component={PlayerScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
/*
* FILE        : App.js
* 
* Description : The router of the app where all different screens and tabs are refrenced to be accessed by the app
* 
* Author      : Abdurrahman Almouna, Yafet Tekleab
* Date        : October 31, 2024
* Version     : 1.0
* 
*/

import React from 'react';
import { Image, View, Text } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';

// Screens
import { Profile } from './screens/Profile';
import { HomeScreen } from './screens/Home';
import { AnnouncementsScreen } from './screens/Announcements';
import { Documents } from './screens/Documents';
import { Contact } from './screens/Contact';
import {Maintenances} from './screens/Maintenances';
import {SignOutScreen} from './screens/SignOut';
import {SignUpScreen} from './screens/Signup';
import { LoginScreen } from './screens/Login';
import { Events } from './screens/Events';
import { Dashboard } from './screens/Dashboard';
import ChatScreen from './screens/chat';

const primaryColor = "#3e1952";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


// Screen Header options
const defaultScreenOptions = 
{
  headerStyle: { backgroundColor: primaryColor, height:85},
  headerTintColor: '#fff',
};

// Custom tab bar icon component
const TabIcon = ({ name, label, focused }) =>
  {
  const iconSize = focused ? 30 : 24;
  return (
    <View style={{ alignItems: 'center'}}>
        <Feather name={name} size={24} color="black" />
      <Text style={{ fontSize: 10, color: focused ? primaryColor : 'black', fontWeight:"700" }}>{label}</Text>
    </View>
  );
};


// BOTTOM TAB NAVIGATOR
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        let name;
        switch (route.name) {
          case 'Home':
            name = 'home';
            break;
          case 'Documents':
            name = 'file';
            break;
            case 'Events':
              name = 'calendar';
              break;
          case 'Contact':
            name = 'mail';
            break;
          case 'Profile':
            name = 'user';
            break;
          default:
            name = 'home';
        }
        return <TabIcon name={name} label={route.name} focused={focused} />;
      },
      tabBarShowLabel: false,
      //tabBarActiveTintColor: primaryColor, (styling keep here for later)
      //tabBarInactiveTintColor: '#888',
      tabBarStyle: 
      {
        paddingTop:'2%',
        height:"10%",
        backgroundColor: '#ffffff',
        borderTopColor: 'transparent',
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 10,
        borderRadius: 0
      }
    })}>
    
    {/* NAVBAR BUTTONS */}
    <Tab.Screen name="Home" component={HomeScreen} options={defaultScreenOptions} />
    <Tab.Screen name="Events" component={Events} options={defaultScreenOptions} />
    <Tab.Screen name="Documents" component={Documents} options={defaultScreenOptions} />
    <Tab.Screen name="Contact" component={Contact} options={defaultScreenOptions} />
    <Tab.Screen name="Profile" component={Profile} options={defaultScreenOptions} />

  </Tab.Navigator>
);

// SCREEN STACK
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>

        <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName='Login'>
          <Stack.Screen name="Back" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Maintenances" component={Maintenances} options={{ title: 'Maintenances', headerBackTitleVisible: false }} />
          <Stack.Screen name="Announcements" component={AnnouncementsScreen} options={{ title: 'Announcements', headerBackTitleVisible: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Signup" component={SignUpScreen} options={{ title: 'Sign Up' }} />
          <Stack.Screen name="SignOut" component={SignOutScreen} options={{ title: 'Sign Out', headerShown: false }} />
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ title: 'Dashboard'}} />
          <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat'}} />
        </Stack.Navigator>

      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

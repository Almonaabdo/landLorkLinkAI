/*
* FILE        : SignOut.js
* 
* Description : The SignOut Screen. Very minimal just for confirmation with user
* 
* Author      : Abdurrahman Almouna, Yafet Tekleab
* Date        : October 31, 2024
* Version     : 1.0
* 
*/


import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { auth } from '../firebaseConfig'; 
import { signOut } from 'firebase/auth';
import { CommonActions } from '@react-navigation/native';
import { PrimaryButton } from "../components/Buttons";
import Feather from '@expo/vector-icons/Feather';

export function SignOutScreen({ navigation }) {
  
  const handleSignOut = async () => 
  {
    try 
    {
      // Firebase sign out function
      await signOut(auth); 
      
      // clears navigation stack to not allow user to go back
      navigation.dispatch
      (
        CommonActions.reset
        ({
          index: 0, 
          routes: [{ name: 'Login' }], 
        })
      );
    } 
    catch (error) 
    {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white", gap:"3%" }}>

      <StatusBar barStyle="dark-content" />

      <Text>Are you sure you want to sign out?</Text>

      {/* Logout button */}
      <PrimaryButton onPress={handleSignOut} text="Sign Out" component={<Feather name="log-out" size={24} color="white"/>} color="#c31d1d"/>

      {/* Cancel button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
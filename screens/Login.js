/*
* FILE        : Login.js
* 
* Description : Login page allows user to login and redirects them to Home page on success. Includes styling
* 
* Author      : Abdurrahman Almouna, Yafet Tekleab
* Date        : October 31, 2024
* Version     : 1.0
* 
*/

import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StatusBar, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { PrimaryButton } from "../components/Buttons";
import Feather from '@expo/vector-icons/Feather';
import { Dimensions, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = screenWidth > 768; //tablets, desktops

// Logo
const logoImg = require("../assets/landlordlink.jpg");

// global variables
const invalidEmailError = -2;
const invalidInformationError = -1;


export function LoginScreen({ navigation }) 
{

  // fields for user info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewError, setViewError] = useState(0);

  // function to validate user sign in in databse
  const handleSignIn = async () => 
  {
    try 
    {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // redirect user to home page
      navigation.replace("Back", { isUserLoggedIn: true });
      setViewError(0);
    } 
    catch (error) 
    {
      setViewError(invalidInformationError);
    }
  };

  return (
    <ScrollView style={styles.container} >
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
        <StatusBar barStyle="light-content" />

        {/*COMPANY LOGO */}
        <Image source={logoImg} style={styles.logo} />

        {/*Loading icon */}
        <ActivityIndicator size={"large"} color={"blue"} animating={viewError === 1} />

        {/* Header Title */}
        <Text style={styles.titleHeader}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Log Into your Account</Text>


        <View style={{padding:20}}>
        {/* EMAIL ADDRESS */}
        <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Email"
            placeholderTextColor={"black"}
            onChangeText={(text) => { setEmail(text); setViewError(0); }}
            value={email} />

          {/* PASSWORD */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.textInput}
            placeholder="Enter Password"
            placeholderTextColor={"black"}
            onChangeText={(text) => { setPassword(text); setViewError(0); }}
            value={password} />
        </View>

        {/* LOGIN BUTTON */}
        <PrimaryButton text="Login" onPress={() => { if (isFormValid()) { handleSignIn(); } }} component={<Feather name="log-in" size={24} color="white" />} />


        {/* Error Message */}
        {viewError === invalidInformationError && <Text style={styles.errorText}>Invalid Email or Password</Text>}
        {viewError === invalidEmailError && <Text style={styles.errorText}>Invalid Email Address</Text>}

        {/* NOT A MEMBER */}
        <TouchableOpacity style={styles.signUpContainer} onPress={() => navigation.replace("Signup")}>
          <Text style={styles.signUpText}>Not A Member?</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </ScrollView>
  );


  // front end function to validate input values
  function isFormValid() 
  {
    if (!email.includes("@")) 
    {
      setViewError(invalidEmailError);
      return false;
    }
    if (email === "" || password.length < 8) 
    {
      setViewError(invalidInformationError);
      return false;
    }
    setViewError(1);
    return true;
  }
}



// styling
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    paddingTop: isWeb ? 40 : 0,
    paddingHorizontal: 18,
  },

  logo: {
    width: '105%',
    height: isLargeScreen ? 200 : 145,
    resizeMode: 'stretch',
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 30,
  },

  titleHeader: {
    fontSize: isLargeScreen ? 36 : 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },

  subHeader: {
    color: "gray",
    textAlign: 'center',
    fontSize: isLargeScreen ? 18 : 14,
    marginBottom: 20,
  },

  label: {
    fontSize: isLargeScreen ? 18 : 16,
    marginBottom: 6,
    marginTop: 10,
  },

  textInput: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: isLargeScreen ? 18 : 16,
    backgroundColor: '#fafafa',
    marginBottom: 20,
  },

  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontSize: isLargeScreen ? 16 : 14,
  },

  signUpContainer: {
    alignSelf: "center",
    marginTop: 25,
  },

  signUpText: {
    color: '#2c4c9c',
    fontSize: isLargeScreen ? 16 : 14,
    fontWeight: '500',
  },
});
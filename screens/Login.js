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
import { LoginButton } from "../components/Buttons";

// Logo
const logoImg = require("../assets/Accommod8u.jpg");

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
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior="position">
        <StatusBar barStyle="light-content" />

        {/*COMPANY LOGO */}
        <Image source={logoImg} style={styles.logo} />

        {/*Loading icon */}
        <ActivityIndicator size={"large"} color={"purple"} animating={viewError === 1} />

        {/* Header Title */}
        <Text style={styles.titleHeader}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Log Into your Account</Text>

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


        {/* LOGIN BUTTON */}
        <LoginButton text="Login" onPress={() => { if (isFormValid()) { handleSignIn(); } }} />


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
    flex: 1,
    backgroundColor: "#ffffff",
    padding: '4%',
  },
  logo: {
    width: '100%',
    height: 150,
    marginTop: '5%',
    resizeMode: 'stretch',
    borderRadius: 20,
    alignSelf: 'center',
  },
  titleHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subHeader: {
    color: "gray",
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  signUpContainer: {
    alignSelf: "center",
    marginTop: 10,
  },
  signUpText: {
    color: '#3e1952',
  },
});
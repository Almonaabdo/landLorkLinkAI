/*
* FILE        : Signup.js
* 
* Description : The Signup Screen. Includes functionality and styling.
* 
* Author      : Abdurrahman Almouna, Yafet Tekleab
* Date        : October 31, 2024
* Version     : 1.0
* 
*/

import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StatusBar, ActivityIndicator, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { LoginButton } from "../components/Buttons";
import { addDocument} from "../Functions";

// Logo
const logoImg = require(".././assets/Accommod8u.jpg");

// global variables
const emailInUseError = -3;
const passwordsDismatchError = -2;
const invalidInformationError = -1;


export function SignUpScreen({ navigation }) {

  // fields for user info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [viewError, setViewError] = useState(0);


  // function to submit signup request on the databse
  const handleSignUp = async () => 
  {
    if (!isFormValid()) 
    {
      return;
    }
    try
    {
      // submit to database and take user to home page
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace("Back", { isUserLoggedIn: true });
    } 
    catch (error) 
    {
      if (error.code === "auth/email-already-in-use") 
      {
        setViewError(emailInUseError);
      } 
      else 
      {
        setViewError(invalidInformationError);
      }
    }

    const newUser = {
      first:firstName,
      last:lastName,
      email:email,
      password: password,
      apartmentID:null,
    }

    addDocument("users", newUser);

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
        <Text style={styles.titleHeader}>Create Your Account</Text>
        <Text style={styles.subHeader}>Sign Up to Get Started</Text>


        {/* FIRST NAME */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter First Name"
          onChangeText={(text) => { setFirstName(text); setViewError(0); }}
          value={firstName} />

        {/* LAST NAME */}
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Last Name"
          onChangeText={(text) => { setLastName(text); setViewError(0); }}
          value={lastName} />


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


        {/* CONFIRM PASSWORD */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Confirm Password"
          placeholderTextColor={"black"}
          onChangeText={(text) => { setConfirmPassword(text); setViewError(0); }}
          value={confirmPassword} />

        {/* Signup Button */}
        <LoginButton text="Sign Up" onPress={() => { if (isFormValid()) { handleSignUp(); } }} />

        {/* Error Message */}
        {viewError === invalidInformationError && <Text style={styles.errorText}>Invalid User Information</Text>}
        {viewError === passwordsDismatchError && <Text style={styles.errorText}>Passwords Don't Match</Text>}
        {viewError === emailInUseError && <Text style={styles.errorText}>Email is Already in use</Text>}

        {/* Already a Member? */}
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.signInText}>Already A Member?</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </ScrollView>
  );


  // front end function to validate input values
  function isFormValid() 
  {
    if (firstName === "" || lastName === "" || email === "" || password.length < 8)
    {
      setViewError(invalidInformationError);
      return false;
    }
    if (password !== confirmPassword) 
    {
      setViewError(passwordsDismatchError);
      return false;
    }
    setViewError(0);
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
    resizeMode: 'stretch',
    borderRadius: 20,
    marginTop: '5%',
    alignSelf: 'center',
  },

  titleHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeader: {
    color: "gray",
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
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  signInText: {
    color: '#3e1952',
    alignSelf: 'center',
    marginTop: '2%'
  },
});
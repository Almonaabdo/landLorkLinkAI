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
import { Text, Image, TouchableOpacity, StatusBar, ActivityIndicator, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet, Platform, Alert, View } from "react-native";
import { auth, db, storage } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { PrimaryButton } from "../components/Buttons";
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
// Logo
const logoImg = require(".././assets/landlordlink.jpg");
const defaultProfilePicture = "https://firebasestorage.googleapis.com/v0/b/accommod8u-4a0a4.appspot.com/o/defaultProfilePicture.jpg?alt=media";

// global variables
const emailInUseError = -3;
const passwordsDismatchError = -2;
const invalidInformationError = -1;
const networkError = -4;

export function SignUpScreen({ navigation }) {
  // fields for user info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [viewError, setViewError] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // function to get profile picture URL from storage
  const getProfilePictureUrl = async (firstName, lastName) => {
    try {
      const imageRef = ref(storage, `gs://accommod8u-dc7cc.firebasestorage.app/ProfilePictures/${firstName.toLowerCase()}-${lastName.toLowerCase()}.jpeg`);
      const url = await getDownloadURL(imageRef);
      console.log('Profile picture URL:', url);
      return url;
    } catch (error) {
      console.log('Unexpected error in profile picture retrieval:', error);
      return defaultProfilePicture;
    }
  };

  // function to submit signup request on the database
  const handleSignUp = async () => {
    if (!isFormValid()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Starting signup process...');
    setIsLoading(true);
    setViewError(0);

    try {
      console.log('Creating user in Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created in Firebase Auth:', user.uid);

      console.log('Attempting to get profile picture URL...');
      const profilePictureUrl = await getProfilePictureUrl(firstName, lastName);
      console.log('Profile picture URL retrieved:', profilePictureUrl);

      console.log('Creating user document in Firestore...');
      const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        apartmentID: null,
        createdAt: new Date(),
        lastLogin: new Date(),
        role: 'tenant',
        status: 'active',
        uid: user.uid,
        profilePicture: profilePictureUrl
      };
      console.log('User document data prepared:', newUser);

      await setDoc(doc(db, "users", user.uid), newUser);
      console.log('User document created in Firestore');

      console.log('Signup process completed successfully');
      navigation.replace("Back", { isUserLoggedIn: true });
    }
    catch (error) {
      console.error("Signup error occurred:", error);
      console.log('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });

      if (error.code === "auth/email-already-in-use") {
        console.log('Email already in use error');
        setViewError(emailInUseError);
      } else if (error.code === "auth/network-request-failed") {
        console.log('Network error');
        setViewError(networkError);
      } else {
        console.log('General error');
        setViewError(invalidInformationError);
      }
    } finally {
      console.log('Signup process completed');
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={{ flex: 1 }}>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
      //showsVerticalScrollIndicator={false}
      >

        <StatusBar barStyle="light-content" />

        {/*COMPANY LOGO */}
        <Image source={logoImg} style={styles.logo} />

        {/*Loading icon */}
        <ActivityIndicator size={"large"} color={"purple"} animating={isLoading} />

        {/* Header Title */}
        <Text style={styles.titleHeader}>Create Your Account</Text>
        <Text style={styles.subHeader}>Sign Up to Get Started</Text>

        {/* Form Fields */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter First Name"
          placeholderTextColor={"black"}
          onChangeText={(text) => { setFirstName(text); setViewError(0); }}
          value={firstName}
          editable={!isLoading}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Last Name"
          placeholderTextColor={"black"}
          onChangeText={(text) => { setLastName(text); setViewError(0); }}
          value={lastName}
          editable={!isLoading}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Email"
          placeholderTextColor={"black"}
          onChangeText={(text) => { setEmail(text); setViewError(0); }}
          value={email}
          editable={!isLoading}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Enter Password"
          placeholderTextColor={"black"}
          onChangeText={(text) => { setPassword(text); setViewError(0); }}
          value={password}
          editable={!isLoading}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Confirm Password"
          placeholderTextColor={"black"}
          onChangeText={(text) => { setConfirmPassword(text); setViewError(0); }}
          value={confirmPassword}
          editable={!isLoading}
        />

        {/* Signup Button */}
        <PrimaryButton
          text={isLoading ? "Creating Account..." : "Sign Up"}
          onPress={handleSignUp}
          disabled={isLoading}
          component={<Feather name="user-plus" size={24} color="white" />}
          style={{marginTop:"10%"}}
        />

        {/* Error Messages */}
        {viewError === invalidInformationError &&
          <Text style={styles.errorText}>Please check your information and try again</Text>
        }
        {viewError === passwordsDismatchError &&
          <Text style={styles.errorText}>Passwords don't match</Text>
        }
        {viewError === emailInUseError &&
          <Text style={styles.errorText}>This email is already registered</Text>
        }
        {viewError === networkError &&
          <Text style={styles.errorText}>Network error. Please check your connection</Text>
        }

        {/* Already a Member? */}
        <TouchableOpacity
          style={{ marginTop: '5%' }}
          onPress={() => navigation.replace("Login")}
          disabled={isLoading}
        >
          <Text style={styles.signInText}>Already A Member?</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );

  // front end function to validate input values
  function isFormValid() {
    if (firstName.trim() === "" || lastName.trim() === "" || email.trim() === "") {
      setViewError(invalidInformationError);
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setViewError(invalidInformationError);
      return false;
    }

    if (password.length < 8) {
      setViewError(invalidInformationError);
      return false;
    }

    if (password !== confirmPassword) {
      setViewError(passwordsDismatchError);
      return false;
    }

    setViewError(0);
    return true;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  logo: {
    width: '105%',
    height: 145,
    resizeMode: 'stretch',
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical:30
  },

  titleHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  subHeader: {
    color: "gray",
    textAlign: 'center',
    fontSize: 14,
  },

  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },

  textInput: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },

  signInText: {
    color: '#2c4c9c',
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '500',
  },

  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },

  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },

  changePictureButton: {
    backgroundColor: '#2c4c9c',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  changePictureText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});
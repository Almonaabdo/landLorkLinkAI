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
import { Text, Image, TouchableOpacity, StatusBar, ActivityIndicator, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet, Platform } from "react-native";
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { LoginButton } from "../components/Buttons";

// Logo
const logoImg = require(".././assets/Accommod8u.jpg");
const defaultProfilePicture = require(".././assets/person2.jpg");

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

  // function to submit signup request on the database
  const handleSignUp = async () => {
    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);
    setViewError(0);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        apartmentID: null,
        createdAt: new Date(),
        lastLogin: new Date(),
        role: 'tenant', // Default role
        status: 'active',
        uid: user.uid,
        profilePicture: defaultProfilePicture
      };

      // Store user data in Firestore using the auth UID as document ID
      await setDoc(doc(db, "users", user.uid), newUser);

      // Navigate to home screen
      navigation.replace("Back", { isUserLoggedIn: true });
    }
    catch (error) {
      console.error("Signup error:", error);

      if (error.code === "auth/email-already-in-use") {
        setViewError(emailInUseError);
      } else if (error.code === "auth/network-request-failed") {
        setViewError(networkError);
      } else {
        setViewError(invalidInformationError);
      }
    } finally {
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
        <LoginButton
          text={isLoading ? "Creating Account..." : "Sign Up"}
          onPress={handleSignUp}
          disabled={isLoading}
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
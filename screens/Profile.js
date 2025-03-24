/*
* FILE        : Profile.js
* 
* Description : The Profile Screen. Allows user to view, change thier info such as email and password
* 
* Author      : Abdurrahman Almouna, Yafet Tekleab
* Date        : October 31, 2024
* Version     : 1.0
* 
*/


import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet, TextInput, ScrollView } from "react-native";
import { LoginButton } from "../components/Buttons.js";
import { auth } from '../firebaseConfig.js';
import { Checkbox } from 'expo-checkbox';

const profileImage = require("../assets/profileUser.png");
const buildingIcon = require(".././assets/buildingIcon.png");
const phoneIcon = require(".././assets/phoneIcon.png");


const ProfileCard = ({ icon, text }) => {
  return (
    <View style={styles.profileCard}>
      <Image source={icon} style={styles.icon}></Image>
      <Text style={{ fontSize: 18 }}>{text}</Text>
    </View>
  )
}

export function Profile({ navigation }) {
  // State hooks
  const [userFullName, setFirstName] = useState("Yafet Tekleab");
  const [email, setEmail] = useState(auth.currentUser?.email || "user@example.com");
  const [isNotificationsChecked, setIsNotificationsChecked] = useState(false);


  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.textHeader}>Account Settings</Text>

      {/* profile Image */}
      <Image source={profileImage} style={styles.profileImage} />

      {/* User Name */}
      <Text style={styles.name}>{userFullName}</Text>


      {/* Email Input */}
      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        editable={false} />

      <View style={{ margin: '3%' }} />

      {/* Password Input */}
      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        style={styles.input}
        value="*********"
        editable={false} />


      {/* Notifications Checkbox */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: "5%" }}>
        <Text style={{ fontSize: 18 }}>Notifications</Text>
        <Checkbox value={isNotificationsChecked} onValueChange={setIsNotificationsChecked} color={"purple"} />
      </View>

      <ProfileCard icon={buildingIcon} text={"13C9"} />

      <ProfileCard icon={phoneIcon} text={"226-898-4470"} />


      {/* SPACING */}
      <View style={{ margin: '10%' }} />

      {/* Logout BUTTON */}
      <LoginButton text="Sign Out" onPress={() => navigation.navigate("SignOut")} />
    </ScrollView>
  );
}


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  textHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '3%',
    alignSelf: 'center',
  },
  ProfileImage:{
    width: 30,
    height: 30,
    margin:10,
},
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#1560BD',
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  icon:{
    width: 30,
    height: 30,
    margin:10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  spacer: {
    height: 60,
  },

  profileCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: "3%",
    backgroundColor:"#f3ebf5",
    padding:5,
    borderRadius:10,
  },
});
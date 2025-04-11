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

// Import necessary React and React Native components for UI elements and functionality
import React, { useState } from "react";
import { View, Text, Image, StatusBar, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { PrimaryButton } from "../components/Buttons.js";
import { auth } from '../firebaseConfig.js';
import { Checkbox } from 'expo-checkbox';
import { doc, updateDoc } from 'firebase/firestore';
import { fetchDocumentByID } from '../Functions.js';
import { db } from '../firebaseConfig.js';
import { updateEmail, updatePassword } from 'firebase/auth';
import Feather from '@expo/vector-icons/Feather';


// Import required assets for icons and images
const buildingIcon = require(".././assets/buildingIcon.png");
const phoneIcon = require(".././assets/phoneIcon.png");

/**
 * SectionContainer Component
 * Creates a consistent container for different sections of the profile
 * @param {string} title - The title of the section
 * @param {ReactNode} children - The content to be displayed in the section
 */
const SectionContainer = ({ title, children }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

/**
 * EditableField Component
 * Creates a field that can be edited with an edit button
 * @param {string} label - The label for the field
 * @param {string} value - The current value of the field
 * @param {boolean} isEditing - Whether the field is in edit mode
 * @param {function} onEdit - Function to handle edit button press
 * @param {function} onChangeText - Function to handle text changes
 * @param {boolean} secureTextEntry - Whether to hide the text (for passwords)
 */
const EditableField = ({ label, value, isEditing, onEdit, onChangeText, secureTextEntry }) => {
  return (
    <View style={styles.editableField}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, !isEditing && styles.inputDisabled]}
          value={value}
          editable={isEditing}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Feather name="edit" size={24} color="#3e1952" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * ContactCard Component
 * Displays contact information with an icon
 * @param {ImageSource} icon - The icon to display
 * @param {string} text - The text to display next to the icon
 */
const ContactCard = ({ icon, text }) => {
  return (
    <View style={styles.contactCard}>
      <Image source={icon} style={styles.icon}></Image>
      <Text style={{ fontSize: 18 }}>{text}</Text>
    </View>
  )
}

/**
 * Profile Component
 * Main profile screen component that displays and manages user information
 * @param {Object} navigation - Navigation object for screen navigation
 */
export function Profile({ navigation }) {
  // State management for user information and UI states
  const [email, setEmail] = useState(auth.currentUser?.email || "user@example.com");
  const [isNotificationsChecked, setIsNotificationsChecked] = useState(false);
  const [fullName, setFullName] = useState("Full Name");
  const [profilePicture, setProfilePicture] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const currentUser = auth.currentUser;

  // Fetch user data from Firestore when component mounts
  if (currentUser) {
    const userId = currentUser.uid;
    const table = "users";
    const userDocRef = doc(db, table, userId);

    // Load user data and update state
    fetchDocumentByID(userDocRef)
      .then((data) => {
        setFullName(data.firstName + " " + data.lastName);
        setProfilePicture(data.profilePicture);
        setIsNotificationsChecked(data.notifications || false);
      })
      .catch((error) => {
        console.error('Error loading user data:', error);
      });
  }





  /**
   * Handles the notification preference toggle
   */
  const handleNotificationToggle = async () => {
    //TODO: Implement notification toggle functionality
  };

  // Render the profile screen
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Profile section with picture and name */}
      <SectionContainer title="">
        <Image style={styles.profileImage} source={require('../assets/person2.jpg')} />
        <Text style={styles.name}>{fullName}</Text>
      </SectionContainer>

      {/* Personal information section with editable email and password */}
      <SectionContainer title="Information">
        <EditableField
          label="Email"
          value={isEditingEmail ? newEmail : email}
          isEditing={isEditingEmail}
          onEdit={() => {
            //TODO: Implement email update functionality
          }}
          onChangeText={setNewEmail}/>

        <View style={{ margin: '3%' }} />

        <EditableField
          label="Password"
          value={isEditingPassword ? newPassword : "*********"}
          isEditing={isEditingPassword}
          onEdit={() => {
            // TODO: Implement password update functionality
          }}
          onChangeText={setNewPassword}
          secureTextEntry={true} />

        <View style={{ margin: '2%' }} />

        <ContactCard icon={buildingIcon} text={"13C9"} />
        <ContactCard icon={phoneIcon} text={"226-898-4470"} />

      </SectionContainer>

      {/* Settings section with notification toggle */}
      <SectionContainer title="Settings">
        <View style={styles.settingRow}>
          <Text style={{ fontSize: 16 }}>Notifications</Text>
          <Checkbox
            value={isNotificationsChecked}
            onValueChange={handleNotificationToggle} />
        </View>
      </SectionContainer>

      {/* Sign out section */}
      <View style={styles.signOutSection}>
        <PrimaryButton style={{ marginBottom: '10%'}} text="Sign Out" onPress={() => navigation.navigate("SignOut")} component={<Feather name="log-out" size={24} color="white" />} />
      </View>
    </ScrollView>
  );
}

// Styles for the profile screen
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  // Section container styles with shadow and elevation
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  // Section title styles
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  // Section content styles
  sectionContent: {
    paddingTop: 8,
  },
  // Setting row styles for notification toggle
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Profile image styles
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: '-15%',
    borderWidth: 1,
    borderColor: '#1560BD',
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'cover',
  },
  // Name text styles
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  // Input label styles
  inputLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  // Icon styles
  icon: {
    width: 30,
    height: 30,
    margin: 10,
  },
  // Input field styles
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  // Disabled input styles
  inputDisabled: {
    backgroundColor: '#f5f5f5',
  },
  // Input container styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Edit button styles with background and border radius
  editButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#f3ebf5',
    borderRadius: 8,
  },
  // Edit icon styles with tint color
  editIcon: {
    width: 24,
    height: 24,
    tintColor: '#3e1952',
  },
  // Profile card styles
  contactCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: "3%",
    backgroundColor: "#f3ebf5",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
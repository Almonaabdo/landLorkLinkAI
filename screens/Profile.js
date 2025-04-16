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
import { View, Text, Image, StatusBar, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Animated } from "react-native";
import { PrimaryButton } from "../components/Buttons.js";
import { auth } from '../firebaseConfig.js';
import { Checkbox } from 'expo-checkbox';
import { doc, updateDoc } from 'firebase/firestore';
import { fetchDocumentByID } from '../Functions.js';
import { db } from '../firebaseConfig.js';
import { updateEmail, updatePassword } from 'firebase/auth';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Constants
const primaryColor = "#2c4c9c";
const secondaryColor = "#6a3093";
const backgroundColor = "#f8f9fa";
const textColor = "#2c3e50";
const borderColor = "#e9ecef";

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
          placeholder={secureTextEntry ? "Enter new password" : ""}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={onEdit}
          style={[styles.editButton, isEditing && styles.editButtonActive]}
          activeOpacity={0.7}
        >
          <Feather
            name={isEditing ? "check" : "edit-2"}
            size={20}
            color={isEditing ? "#4CAF50" : primaryColor}
          />
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
      <Image source={icon} style={styles.icon} />
      <Text style={styles.contactText}>{text}</Text>
    </View>
  );
};

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
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const currentUser = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  // Fetch user data from Firestore when component mounts
  if (currentUser) {
    const userId = currentUser.uid;
    const table = "users";
    const userDocRef = doc(db, table, userId);

    // Load user data and update state
    fetchDocumentByID(userDocRef)
      .then((data) => {
        setFullName(data.firstName + " " + data.lastName);
        // If profilePicture is a URL, use it directly, otherwise use the default image
        setProfilePicture(data.profilePicture || require('../assets/person2.jpg'));
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

  // Function to validate password
  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*]/.test(password)) return "Password must contain at least one special character (!@#$%^&*)";
    return "";
  };

  // Function to handle password update
  const handlePasswordUpdate = async () => {
    const error = validatePassword(newPassword);
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await updatePassword(auth.currentUser, newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setIsEditingPassword(false);
      Alert.alert('Success', 'Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the profile screen
  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" />

      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={typeof profilePicture === 'string' ? { uri: profilePicture } : profilePicture}
          />
        </View>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Personal Information Section */}
      <SectionContainer title="Personal Information">
        <View style={styles.editableField}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {isEditingPassword ? (
          <>
            <EditableField
              label="New Password"
              value={newPassword}
              isEditing={true}
              onEdit={() => { }}
              onChangeText={setNewPassword}
              secureTextEntry={true}
            />

            <View style={styles.divider} />

            <EditableField
              label="Confirm Password"
              value={confirmPassword}
              isEditing={true}
              onEdit={() => { }}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => {
                  setIsEditingPassword(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handlePasswordUpdate}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <EditableField
            label="Password"
            value="*********"
            isEditing={false}
            onEdit={() => setIsEditingPassword(true)}
            secureTextEntry={true}
          />
        )}
      </SectionContainer>

      {/* Contact Information Section */}
      <SectionContainer title="Contact Information">
        <ContactCard icon={buildingIcon} text="13C9" />
        <View style={styles.divider} />
        <ContactCard icon={phoneIcon} text="226-898-4470" />
      </SectionContainer>

      {/* Settings Section */}
      <SectionContainer title="Settings">
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.settingSubtext}>Receive updates about your account</Text>
          </View>
          <Checkbox
            value={isNotificationsChecked}
            onValueChange={handleNotificationToggle}
            color={isNotificationsChecked ? primaryColor : undefined}
          />
        </View>
      </SectionContainer>

      {/* Sign Out Button */}
      <View style={styles.signOutContainer}>
        <PrimaryButton
          style={styles.signOutButton}
          text="Sign Out"
          onPress={() => navigation.navigate("SignOut")}
          component={<Feather name="log-out" size={24} color="white" />}
        />
      </View>

      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      )}
    </Animated.ScrollView>
  );
}

// Styles for the profile screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: primaryColor,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: textColor,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: textColor,
    marginBottom: 20,
  },
  editableField: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: borderColor,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: textColor,
    backgroundColor: 'white',
  },
  inputDisabled: {
    backgroundColor: '#f8f9fa',
  },
  editButton: {
    padding: 12,
    marginLeft: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  editButtonActive: {
    backgroundColor: '#e8f5e9',
  },
  divider: {
    height: 1,
    backgroundColor: borderColor,
    marginVertical: 15,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: primaryColor,
  },
  contactText: {
    fontSize: 16,
    color: textColor,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: textColor,
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
  },
  saveButton: {
    backgroundColor: primaryColor,
  },
  cancelButtonText: {
    color: textColor,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutContainer: {
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  signOutButton: {
    marginBottom: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
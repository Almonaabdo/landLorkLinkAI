/*
* FILE        : Home.js
* 
* Description : The Main page of the app. Complex page to handld different modal screens and the main dashboard
* 
* Author      : Abdurrahman Almouna, Yafet Tekleab
* Date        : October 31, 2024
* Version     : 1.0
* 
*/

import React, { useState } from "react";
import { RefreshControl, Text,Linking, Image, Animated, TouchableOpacity, Modal, TextInput, StatusBar, ScrollView, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SelectList } from 'react-native-dropdown-select-list';
import { addDocument, fetchDocuments } from "../Functions.js";
import { useFocusEffect } from "@react-navigation/native";
import HomeCard from "../components/HomeCard.js";
import { LoginButton } from "../components/Buttons.js";
import AnnouncementsList from "../components/AnnouncementsList.js";
import { LinearGradient } from 'expo-linear-gradient';
import MiniCard from "../components/MiniCard.js";
import Feather from '@expo/vector-icons/Feather';
// Icons
const icons = {
  WrenchIcon: require(".././assets/wrenchIcon.png"),
  NfcScannerScreen: require(".././assets/nfcScannerScreen.png"),
  DoorHandleIcon: require(".././assets/doorHandleIcon.png"),
  announcementIcon: require(".././assets/announcementIcon.png"),
  maintainenceBackground: require(".././assets/maintainancebackground.jpg"),
  dashboardIcon: require(".././assets/dashboardIcon.png"),
  emergencyIcon: require(".././assets/emergency.png"),
  exitIcon: require(".././assets/exitIcon.png"),
  shelterIcon: require(".././assets/shelterIcon.png"),
  helpIcon: require(".././assets/helpIcon.png"),
  incidentIcon: require(".././assets/incidentIcon.png"),
  King_Street_North: require(".././assets/308 King Street North.jpg"),
  packageIcon: require(".././assets/packageIcon.png"),
};

export function HomeScreen({ navigation }) {
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [selected, setSelected] = useState("");
  const [image, setImage] = useState();
  const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(false);
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = useState(false);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const [isNfcModalVisible, setIsNfcModalVisible] = useState(false);
  const [isIncidentModalVisible, setIsIncidentModalVisible] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedPriority, setSelectedPriority] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);


  // function to fetch announcements data from database
  useFocusEffect(
    React.useCallback(() => {
      const getRecentAnnouncements = async () => {
        try {
          const fetchedAnnouncements = await fetchDocuments("announcements");
          fetchedAnnouncements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setAnnouncements(fetchedAnnouncements);
        }
        catch (error) {
          1 + 1; //TOBEREPLACED
        }
      };

      loadRequests();
      getRecentAnnouncements();
    }, [])
  );

  // function to fetch maintanence requests number from database
  const loadRequests = async () => {
    try {
      setLoading(true);
      const fetchedRequests = await fetchDocuments("repairRequests");
      setRequestCount(fetchedRequests.length);
    }
    catch (error) {
      1 + 1; //TOBEREPLACED
    }
    finally {
      setLoading(false);
    }
  };

  const handleRepairRequestSubmit = async () => {
    if (!issueTitle || !issueDescription || !selected) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const repairRequestData = {
      title: issueTitle,
      description: issueDescription,
      type: selected,
      priority: selectedPriority,
      status: 'Pending',
      import: image || null,
      createdAt: new Date(),
    };

    try {
      await addDocument("repairRequests", repairRequestData);
      alert("Repair request submitted successfully.");
      // Reset fields after submission
      setIssueTitle("");
      setIssueDescription("");
      setSelected("");
      setImage(null);
      setIsMaintenanceModalVisible(false);
      loadRequests();
    } catch (error) {
      alert("Failed to submit repair request. Please try again.");
    }
  };

  const maintainenceList = [
    { key: '1', value: 'Pest control' },
    { key: '2', value: 'Electrical' },
    { key: '3', value: 'Water Leakage' },
    { key: '4', value: 'HVAC' },
    { key: '5', value: 'Appliances' },
    { key: '6', value: 'Flooring' },
    { key: '7', value: 'Doors/Windows' },
  ];

  const priorityLevels = [
    { key: '1', value: 'High' },
    { key: '2', value: 'Medium' },
    { key: '3', value: 'Low' },
  ];

  // Animating function that allows a component to fade in and out
  const startFading = () => {
    Animated.loop(
      Animated.sequence
        ([
          // time in ms
          Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        ])
    ).start();
  };

  const EmergencyModalCard = ({ icon, title, description }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, padding: 15, backgroundColor: '#fff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 }}>
        <Image source={icon} style={{ width: 50, height: 50, marginRight: 15 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{title}</Text>
          <Text style={{ fontSize: 14, color: 'red' }}>{description}</Text>
        </View>
      </View>
    );
  };
  // function to handle the NFS modal screen
  const handleNfcModalOpen = () => {
    setIsNfcModalVisible(true);
    startFading();
    setTimeout(() => setIsNfcModalVisible(false), 6000);
  };

  // function to handle Image/Camera Uploads
  const uploadImage = async (mode) => {
    try {
      let imageResult = {};

      // GALLERY UPLOAD
      if (mode === "Gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        imageResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });
      }
      else
      // CAMERA UPLOAD
      {
        await ImagePicker.requestCameraPermissionsAsync();
        imageResult = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        });
      }

      // hide media upload modal if cancelled
      if (!imageResult.canceled) {
        setImage(imageResult.assets[0].uri);
      }

      // close media upload modal
      setImagePickerModalVisible(false);
    }
    catch (error) {
      1 + 1; //TOBEREPLACED
    }
  };
  /////////////////////////////////////////////////////VIEW///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{ paddingBottom: "50%" }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadRequests} />}>
      <StatusBar barStyle="light-content" />

      {/* APPARTMENT NAME AND IMAGE */}
      {/** // Start gradient at the left and end it at right // remove to make it top to bottom*/}
      <LinearGradient colors={['#7e658c', 'white']} start={{ x: 0, y: 0.7 }} end={{ x: 0, y: 1.1 }} style={{ height: "30%", paddingHorizontal: 0 }}>

        <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <Image source={icons.King_Street_North} style={{ width: '100%', height: "65%", borderRadius: 5, resizeMode: "stretch" }} />
          <Text style={{ fontSize: 28, fontWeight: "500", color: 'white', fontFamily: 'Avenir' }}>308 King Street North </Text>
        </View>

      </LinearGradient>

      {/* Modal Menu ICONS */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginVertical: "2%" }}>

        <View style={{ backgroundColor: '#e6e6fa', padding: 5, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.50, shadowRadius: 2, elevation: 6 }}>
          <TouchableOpacity onPress={() => setIsMaintenanceModalVisible(true)}>
            <Image source={icons.WrenchIcon} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: '#e6e6fa', padding: 5, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.50, shadowRadius: 2, elevation: 6 }}>
          <TouchableOpacity onPress={() => { setIsIncidentModalVisible(true) }}>
            <Image source={icons.incidentIcon} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: '#e6e6fa', padding: 5, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.50, shadowRadius: 2, elevation: 6 }}>
          <TouchableOpacity onPress={() => { setIsEmergencyModalVisible(true) }}>
            <Image source={icons.emergencyIcon} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: '#e6e6fa', padding: 5, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.50, shadowRadius: 2, elevation: 6 }}>
          <TouchableOpacity onPress={handleNfcModalOpen}>
            <Image source={icons.DoorHandleIcon} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Announcements LIST */}
      <AnnouncementsList announcements={announcements} navigation={navigation} />


      {/* Mini cards */}
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", marginVertical: "1%" }}>
        <MiniCard title="Packages" detail="0" icon={icons.packageIcon} />
        <MiniCard title="Announcements" detail={announcements.length} icon={icons.announcementIcon} />
      </View>

      {/* Maintaincence Card */}
      <TouchableOpacity onPress={() => navigation.navigate("Maintenances")}>
        <HomeCard
          title="Maintenance"
          description={`Open Requests: ${requestCount}`}
          imageUrl={icons.maintainenceBackground} />
      </TouchableOpacity>

      {/* Dashboard Card */}
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
        <HomeCard
          title="Dashboard"
          description="Review latest data"
          imageUrl={icons.dashboardIcon} />
      </TouchableOpacity>

      {/* Maintenance Modal */}
      <Modal
        visible={isMaintenanceModalVisible}
        onRequestClose={() => { setIsMaintenanceModalVisible(false) }}
        onDismiss={() => setImagePickerModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet">

        <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 15 }}>
            <View style={{ width: 4, height: 24, backgroundColor: '#3e1952', borderRadius: 2, marginRight: 15 }} />
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', flex: 1 }}>Request Maintenance</Text>
            <TouchableOpacity onPress={() => setIsMaintenanceModalVisible(false)}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView>

            {/* Issue Title */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Feather name="edit-3" size={20} color="#2D3748" />
                <Text style={{ fontSize: 16, color: '#333', fontWeight: '500', marginLeft: 8 }}>Issue Title</Text>
              </View>
              <TextInput
                placeholder="Enter issue title"
                placeholderTextColor="grey"
                style={{
                  borderColor: '#e0e0e0',
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "#f8f8f8",
                  fontSize: 16
                }}
                onChangeText={setIssueTitle}
                value={issueTitle}/>
            </View>

            {/* Issue Description */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Feather name="align-left" size={20} color="#4A5568" />
                <Text style={{ fontSize: 16, color: '#333', fontWeight: '500', marginLeft: 8 }}>Issue Description</Text>
              </View>
              <TextInput
                placeholder="Describe the problem"
                multiline
                numberOfLines={4}
                placeholderTextColor="grey"
                style={{
                  height: 120,
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  padding: 12,
                  borderRadius: 8,
                  fontSize: 16,
                  textAlignVertical: 'top',
                  backgroundColor: "#f8f8f8"
                }}
                onChangeText={setIssueDescription}
                value={issueDescription}
              />
            </View>

            {/* Maintenance Type */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Feather name="tag" size={20} color="#805AD5" />
                <Text style={{ fontSize: 16, color: '#333', fontWeight: '500', marginLeft: 8 }}>Maintenance Type</Text>
              </View>
              <SelectList
                setSelected={setSelected}
                data={maintainenceList}
                placeholder="Select Issue Type"
                searchPlaceholder="Search"
                dropdownStyles={{ borderRadius: 8, borderColor: '#e0e0e0' }}
                boxStyles={{ borderRadius: 8, borderColor: '#e0e0e0', backgroundColor: "#f8f8f8" }}
                save="value"
              />
            </View>

            {/* Priority Level */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Feather name="alert-circle" size={20} color="#E53E3E" />
                <Text style={{ fontSize: 16, color: '#333', fontWeight: '500', marginLeft: 8 }}>Priority Level</Text>
              </View>
              <SelectList
                setSelected={setSelectedPriority}
                data={priorityLevels}
                placeholder="Select Priority"
                searchPlaceholder="Search"
                dropdownStyles={{ borderRadius: 8, borderColor: '#e0e0e0' }}
                boxStyles={{ borderRadius: 8, borderColor: '#e0e0e0', backgroundColor: "#f8f8f8" }}
                save="value"
              />
            </View>

            {/* Add Image */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Feather name="image" size={20} color="#3182CE" />
                <Text style={{ fontSize: 16, color: '#333', fontWeight: '500', marginLeft: 8 }}>Add Image</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setImagePickerModalVisible(true)} 
                style={{ 
                  height: 100, 
                  borderWidth: 1, 
                  borderColor: '#e0e0e0', 
                  borderRadius: 8, 
                  backgroundColor: "#f8f8f8",
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                {image ? (
                  <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                ) : (
                  <Feather name="plus" size={40} color="#3e1952" />
                )}
              </TouchableOpacity>
            </View>

            {/* Submit and Cancel Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, gap: 12 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: '#f0f0f0',
                }}
                onPress={() => setIsMaintenanceModalVisible(false)}>
                <Text style={{ color: '#666', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: '#3e1952',
                }}
                onPress={handleRepairRequestSubmit}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* IMAGE UPLOAD MODAL */}
          <Modal
            visible={imagePickerModalVisible}
            animationType="fade"
            transparent={true}
            onDismiss={() => setImagePickerModalVisible(false)}
            onRequestClose={() => setImagePickerModalVisible(false)}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ width: '70%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>

                {/* Image Upload Buttons */}
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}>
                  <TouchableOpacity 
                    onPress={() => uploadImage("Camera")}
                    style={{ alignItems: 'center' }}>
                    <Feather name="camera" size={40} color="#3182CE" />
                    <Text style={{ marginTop: 8, color: '#333' }}>Camera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => uploadImage("Gallery")}
                    style={{ alignItems: 'center' }}>
                    <Feather name="image" size={40} color="#3182CE" />
                    <Text style={{ marginTop: 8, color: '#333' }}>Gallery</Text>
                  </TouchableOpacity>
                </View>

                {/* Close Button */}
                <TouchableOpacity 
                  onPress={() => setImagePickerModalVisible(false)} 
                  style={{ 
                    padding: 10, 
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0'
                  }}>
                  <Text style={{ color: '#666' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </Modal>

      {/* NFC Scanner Modal */}
      <Modal
        visible={isNfcModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsNfcModalVisible(false)}>
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: "#2c2c2c" }}>


          {/*Down Arrow Icon*/}
          <TouchableOpacity onPress={() => setIsNfcModalVisible(false)} style={{ marginTop: "25%" }}>
            <Feather name="arrow-down" size={64} color="white" />
          </TouchableOpacity>


          {/*Animated SCAN IMAGE*/}
          <Animated.Image
            style={{
              width: 400,
              height: 300,
              opacity: fadeAnim,
              marginTop: '50%',
              borderRadius: 20
            }}
            source={icons.NfcScannerScreen} />

        </View>
      </Modal>

      {/* EMERGENCY  Modal */}
      <Modal
        visible={isEmergencyModalVisible}
        animationType="slide"
        onRequestClose={() => setIsEmergencyModalVisible(false)}
        presentationStyle="pageSheet">
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: "#FFFFF", padding: "4%" }}>

          {/* Fire Safety Guide Title */}
          <View style={{ backgroundColor: "red", padding: 10, borderRadius: 7 }}>
            <Text style={{ fontSize: 34 }}>Fire Safety Guide</Text>
          </View>
          <View style={{ marginVertical: "10%" }} />

          <EmergencyModalCard
            icon={icons.exitIcon}
            title="Step 1: Evacuate"
            description="Go to the nearest exit and leave the building. Avoid Elvators" />

          <EmergencyModalCard
            icon={icons.shelterIcon}
            title="Step 2: Shelter in Place"
            description="If you can't exit safely, close doors, seal gaps." />


          <EmergencyModalCard
            icon={icons.helpIcon}
            title="Step 3: Signal for help"
            description="Open the window and signal for help after calling 911." />

          <View style={{ marginVertical: "20%" }} />

          {/* CALL 9 1 1 BUTTON */}
          <LoginButton text={"CALL 9 1 1 "} onPress={() => Linking.openURL(`tel:911`)} component={<Feather name="phone" size={24} color="white" />} />

        </View>
      </Modal>

    </ScrollView>
  );
}
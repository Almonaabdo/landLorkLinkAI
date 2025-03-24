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

// Icons
const darkBlue = "#2e395d";
const icons = {
  WrenchIcon: require(".././assets/wrenchIcon.png"),
  CloseIcon: require(".././assets/close.png"),
  AddImagesLogo: require(".././assets/addImagesLogo.png"),
  CameraLogo: require(".././assets/cameraLogo.png"),
  GalleryLogo: require(".././assets/galleryLogo.png"),
  ArrowDownIcon: require(".././assets/arrowDownIcon.png"),
  HouseImage: require(".././assets/houseImage.png"),
  NfcScannerScreen: require(".././assets/nfcScannerScreen.png"),
  DoorHandleIcon: require(".././assets/doorHandleIcon.png"),
  announcementsBackground: require(".././assets/announcementsBackground.jpg"),
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
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", marginVertical: "4%" }}>
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

        <View style={{ padding: "4%", gap: "1.5%" }}>

          {/*Down Arrow Icon*/}
          {/* <TouchableOpacity onPress={() => setIsMaintenanceModalVisible(false)}>
            <Image source={icons.ArrowDownIcon} style={{ width: 35, height: 35, marginVertical: '2%', alignSelf: "center" }} />
          </TouchableOpacity> */}

          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Request Maintenance</Text>

          {/* Issue Title */}
          <Text>Issue Title</Text>
          <TextInput
            placeholder="Issue Title"
            placeholderTextColor="grey"
            style={{
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#f9f9f9"
            }}
            onChangeText={setIssueTitle}
            value={issueTitle}
          />
          {/* Issue Description */}
          <Text>Describe the problem</Text>
          <TextInput
            placeholder="Issue Description"
            multiline
            numberOfLines={4}
            placeholderTextColor="grey"
            style={{
              height: 120,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              borderRadius: 10,
              fontSize: 16,
              textAlignVertical: 'top',
            }}
            onChangeText={setIssueDescription}
            value={issueDescription}
          />

          {/* Issue Type Dropdown */}
          <Text>Maintenance Type</Text>
          <SelectList
            setSelected={setSelected}
            data={maintainenceList}
            placeholder="Select Issue Type"
            searchPlaceholder="Search"
            dropdownStyles={{ borderRadius: 5 }}
            boxStyles={{ borderRadius: 8 }}
          />

          {/* Priority Dropdown */}
          <Text>How Urgent</Text>
          <SelectList
            setSelected={setSelectedPriority}
            data={priorityLevels}
            placeholder="Select Priority"
            searchPlaceholder="Search"
            dropdownStyles={{ borderRadius: 5 }}
            boxStyles={{ borderRadius: 8 }}
          />

          {/* Add Image Button */}
          <TouchableOpacity onPress={() => setImagePickerModalVisible(true)} style={{ alignItems: 'center' }}>
            <Image source={icons.AddImagesLogo} style={{ width: 100, height: 100 }} />
          </TouchableOpacity>

          {/* IMAGE UPLOAD MODAL */}
          <Modal
            visible={imagePickerModalVisible}
            animationType="fade"
            transparent={true}
            onDismiss={() => setImagePickerModalVisible(false)}
            onRequestClose={() => setImagePickerModalVisible(false)}>

            {/* Centering the modal content */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              {/*White background */}

              <View style={{ width: '70%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>

                <View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-around" }}>
                  {/* Camera Logo */}
                  <TouchableOpacity onPress={() => uploadImage("Camera")}>
                    <Image source={icons.CameraLogo} style={{ width: 50, height: 50, borderRadius: 15 }} />
                  </TouchableOpacity>

                  {/* Gallery Logo */}
                  <TouchableOpacity onPress={() => uploadImage("Gallery")}>
                    <Image source={icons.GalleryLogo} style={{ width: 50, height: 50, borderRadius: 15 }} />
                  </TouchableOpacity>
                </View>

                {/* Close button */}
                <TouchableOpacity onPress={() => setImagePickerModalVisible(false)} style={{ marginTop: 20 }}>
                  <Text style={{ color: 'red', alignSelf: "center" }}>Close</Text>
                </TouchableOpacity>
              </View>

            </View>
          </Modal>


          {/* Submit request Button */}
          <LoginButton text="Submit" onPress={handleRepairRequestSubmit} />

        </View>
      </Modal>

      {/* NFC Scanner Modal */}
      <Modal
        visible={isNfcModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsNfcModalVisible(false)}>
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: "#2c2c2c" }}>


          {/*Down Arrow Icon*/}
          <TouchableOpacity onPress={() => setIsNfcModalVisible(false)} style={{ marginTop: 20 }}>
            <Image source={icons.ArrowDownIcon} style={{ width: 35, height: 35, marginTop: '20%' }} />
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

          {/*Down Arrow Icon*/}
          {/* <TouchableOpacity onPress={() => setIsEmergencyModalVisible(false)}>
            <Image source={icons.ArrowDownIcon} style={{ width: 35, height: 35, marginBottom: '10%', alignSelf: "center" }} />
          </TouchableOpacity> */}

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
          <LoginButton text={"CALL 9 1 1 "} onPress={() => Linking.openURL(`tel:911`)}/>

        </View>
      </Modal>

    </ScrollView>
  );
}
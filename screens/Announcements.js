import { React, useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, TextInput, StatusBar, Alert } from "react-native";
import { Swipeable } from 'react-native-gesture-handler';
import AnnouncementCard from "../components/AnnouncementCard.js";
import { StylesHome } from "../styles/stylesHome.js";
import { stylesLogin } from "../styles/stylesLogin.js";
import { LoginButton } from "../components/Buttons.js";
import { addDocument, fetchDocuments, deleteDocument, updateDocument } from "../Functions.js"; // Ensure deleteDocument is included
import { useFocusEffect } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';


const personImage = require(".././assets/person.jpg");

export function AnnouncementsScreen({ navigation }) {

  const [isCreatePost, setIsCreatePost] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDetails, setAnnouncementDetails] = useState("");
  const [viewError, setViewError] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editId, setEditId] = useState(null);    

  // fetch announcements from database table
  useFocusEffect(() => {
    const getAnnouncements = async () => {
      try {
        const fetchedAnnouncements = await fetchDocuments("announcements");

        // sort and store announcements in local array  
        fetchedAnnouncements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setAnnouncements(fetchedAnnouncements);
      }
      catch (error) {
        console.error("Error fetching announcements: ", error);
      }
    };

    getAnnouncements();
  });

  const handleAnnouncementSubmit = async () => {
    // check for empty fields  
    if (!announcementTitle || !announcementDetails) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const announcementData =
    {
      title: announcementTitle,
      details: announcementDetails,
      createdAt: new Date(),
    };

    // submitting announcement to databse
    try {
      await addDocument("announcements", announcementData);
      setAnnouncementTitle("");
      setAnnouncementDetails("");

      const fetchedAnnouncements = await fetchDocuments("announcements");
      setAnnouncements(fetchedAnnouncements);

      setIsCreatePost(false);                     // close modal window
    }
    catch (error) {
      alert("Failed to submit announcement. Please try again later.");
    }
  };

  const handleEdit = (id) => {
    const announcement = announcements.find(announcement => announcement.id === id);
    if(announcement)
    {
      setAnnouncementTitle(announcement.title);
      setAnnouncementDetails(announcement.details);
      setEditId(id);
      setIsEditPost(true);
    }
  };

  const handleEditSubmit = async () => {
    if(!announcementTitle || !announcementDetails)
    {
      alert("Please fill in all fields before updating.");
      return;
    }

    const updatedAnnouncements = {
      title: announcementTitle,
      details: announcementDetails,
      updatedAt: new Date(),
    };

    try
    {
      await updateDocument("announcements", editId, updatedAnnouncements);
      alert("Announcement updated successfully!!");
      setAnnouncementTitle("");
      setAnnouncementDetails("");
      setEditId(null);
      setIsEditPost(false); // Close edit modal
      const fetchedAnnouncements = await fetchDocuments("announcements");
      setAnnouncements(fetchedAnnouncements); // Refresh announcements
    }
    catch(error)
    {
      alert("Failed to update announcement. Please try again later.");
    }
  };


  // function to delete Announcement from DB
  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Announcement will be deleted',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Ok',
          onPress: async () => {
            try {
              await deleteDocument("announcements", id);
              const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
              setAnnouncements(updatedAnnouncements);
            }
            catch (error) {
              console.error("Error deleting announcement: ", error);
            }
          },
        },
      ],
      //{ cancelable: false }
    );
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
      <TouchableOpacity onPress={() => { setIsCreatePost(true) }} style={{alignItems:'center'}}>
        <Feather name="edit" size={32} color={'black'}/>
      </TouchableOpacity>

      {announcements.map((announcement) => (
        <Swipeable
          key={announcement.id}

          // SWIPE RIGHT (EDIT)
          renderLeftActions=
          {() => (
            <TouchableOpacity onPress={() => handleEdit(announcement.id)}>
              <Text style={{ color: '#007BFF', padding: 20, marginVertical: '25%' }}>Edit</Text>
            </TouchableOpacity>
          )}

          // SWIPE LEFT (DELETE)
          renderRightActions=
          {() => (
            <TouchableOpacity onPress={() => handleDelete(announcement.id)}>
              <Text style={{ color: 'red', padding: 20, marginVertical: '25%' }}>Delete</Text>
            </TouchableOpacity>
          )}>

          <AnnouncementCard
            title={announcement.title}
            details={announcement.details}
            timeAgo={announcement.createdAt.toLocaleString()}
            image={personImage}/>
        </Swipeable>
      ))}


      {/* CREATE POST MODAL */}
      <Modal visible={isCreatePost} onRequestClose={() => setIsCreatePost(false)} animationType="slide" presentationStyle="pageSheet">
        <TouchableOpacity onPress={() => { setIsCreatePost(false) }}>
          <Feather style={{alignSelf:"flex-end", padding:10}} name="x" size={24} color={'#000000'}/>
          <Text style={StylesHome.TextHeader}>Write Announcement</Text>
        </TouchableOpacity>

        <View style={stylesLogin.container}>
          <TextInput
            placeholder="Announcement Title"
            style={stylesLogin.textInput}
            placeholderTextColor="black"
            onChangeText={(text) => {
              setAnnouncementTitle(text);
              setViewError(0);
            }}
            value={announcementTitle} />

          <TextInput
            placeholder="Announcement Details"
            style={[stylesLogin.textInput, { height: 150 }]}
            placeholderTextColor="black"
            onChangeText={(text) => {
              setAnnouncementDetails(text);
              setViewError(0);
            }}
            value={announcementDetails} />

          <LoginButton text="Post" onPress={handleAnnouncementSubmit} />

          {viewError === -1 && <Text style={stylesLogin.textError}>Please fill in required fields</Text>}
        </View>
      </Modal>

      {/*Edit post modal*/}
      <Modal visible={isEditPost} onRequestClose={() => setIsEditPost(false)} animationType="slide" presentationStyle="pageSheet">
        
        <TouchableOpacity onPress={() => { setIsEditPost(false); setAnnouncementTitle(""); setAnnouncementDetails(""); }}>
          <Feather style={{alignSelf:"flex-end", padding:10}} name="x" size={24} color={'#000000'}/>
          
          <Text style={StylesHome.TextHeader}>Edit Announcement</Text>
        </TouchableOpacity>

        <View style={stylesLogin.container}>
          <TextInput
            placeholder="Announcement Title"
            style={stylesLogin.textInput}
            placeholderTextColor="black"
            onChangeText={(text) => setAnnouncementTitle(text)}
            value={announcementTitle}/>

          <TextInput
            placeholder="Announcement Details"
            style={[stylesLogin.textInput, { height: 150 }]}
            placeholderTextColor="black"
            onChangeText={(text) => setAnnouncementDetails(text)}
            value={announcementDetails}/>

          <LoginButton text="Update" onPress={handleEditSubmit} />

          {viewError === -1 && <Text style={stylesLogin.textError}>Please fill in required fields</Text>}
        </View>
      </Modal>
    </ScrollView>
  );
}
/*
* FILE        : Contact.js
* 
* Description : The Contact Screen is for displaying all Company related contact ways such as social media and office locations
* 
* Author      : Abdurrahman Almouna, Yafet Tekleab
* Date        : October 31, 2024
* Version     : 1.0
* 
*/


import { React } from "react";
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet, Linking } from "react-native";
import { LoginButton } from "../components/Buttons";

// icons
const emailIcon = require(".././assets/emailIcon.png");
const callIcon = require(".././assets/callIcon.png");
const mapsIcon = require(".././assets/mapsIcon.png");
const personImage = require(".././assets/person.jpg");
const instagramIcon = require(".././assets/instagramIcon.png");
const facebookIcon = require(".././assets/facebookIcon.png");
const googleIcon = require(".././assets/googleIcon.png");

// Divider component
const Divider = () => (
  <View style={styles.divider} />
);

export function Contact({ navigation }) {
  const leasingOfficeAddress = "150 University Ave W. - Unit 4, Waterloo";
  const propertyManagementOffice = "The HUB - 130 Columbia St W, Waterloo";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />


      {/*Contact Person Section */}
      <View style={styles.header}>
        <Image source={personImage} style={styles.profileImage} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName}>Paul S</Text>
          <Text style={styles.headerRole}>Building Manager</Text>
          <Text style={styles.headerName}>226-898-0000</Text>
        </View>
      </View>
      
      <View style={{margin:'5%'}}/>


      {/*MANAGMENT OFFICE */}
      <Section title="Management Office" hours="Monday - Friday: 10am - 5pm">
        <ContactLink
          icon={emailIcon}
          text="maintenance@accommod8u.com"
          onPress={() => Linking.openURL('mailto:support@example.com?subject=Property Inspection Request&body=Hello Accommod8u, hope this email finds you well')}/>
        
        <Divider />

        <ContactLink
          icon={mapsIcon}
          text="The HUB - 130 Columbia St W, Waterloo"
          onPress={() => openGoogleMaps(propertyManagementOffice)}/>
      </Section>

      {/* SPACING */}
      <View style={{marginVertical:'7%'}}></View>

      {/*LEASING OFFICE */}
      <Section title="Leasing Office" hours="Monday - Friday: 10am - 6pm">
        <ContactLink
          icon={callIcon}
          text="+1 (226) 898-0000"
          onPress={() => Linking.openURL(`tel:2268980000`)}/>
        <Divider />

        <ContactLink
          icon={emailIcon}
          text="leasing@accommod8u.com"
          onPress={() => Linking.openURL('mailto:support@example.com?subject=Property Inspection Request&body=Hello Accommod8u, hope this email finds you well')}/>
        <Divider />

        <ContactLink
          icon={mapsIcon}
          text="150 University Ave W. - Unit 4, Waterloo"
          onPress={() => openGoogleMaps(leasingOfficeAddress)}/>
      </Section>

      {/* SPACING */}
      <View style={{marginVertical:'5%'}}/>
      

      <LoginButton text={"Accommd8u.com"} onPress={()=>{Linking.openURL('https://www.accommod8u.com/')}} />


      {/*SOCIAL MEDIA ICONS*/}
      <View style={{ height: '3%', flexDirection: 'row', marginVertical: '10%', alignSelf: 'center', justifyContent: 'space-between' }}>
        <Image source={facebookIcon} style={{ width: '10%', height: '185%', marginRight: '10%' }} />
        <Image source={instagramIcon} style={{ width: '10%', height: '185%', marginRight: '10%' }} />
        <Image source={googleIcon} style={{ width: '10%', height: '185%' }} />
      </View>

    </View>
  );
}

// Contact link component
const ContactLink = ({ icon, text, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.contactLink}>
    <Image source={icon} style={styles.linkIcon} />
    <Text style={styles.linkText}>{text}</Text>
  </TouchableOpacity>
);


// Section component
const Section = ({ title, hours, children }) => (
  <View>
    <Text style={[styles.sectionTitle]}>{title}</Text>
    <Text style={styles.sectionHours}>{hours}</Text>
    {children}
  </View>
);


// Function to open Google Maps
const openGoogleMaps = (address) => 
{
  const formattedAddress = encodeURIComponent(address);
  const url = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
  Linking.openURL(url);
};


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: '3%',
    paddingVertical: '5%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: '25%',
    height: "135%",
    borderRadius: 99,
    marginRight: '5%',
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRole: {
    fontSize: 18,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    width:'300',
    color: '#333',
    backgroundColor: '#f0eff5',
    padding: "2%",
    width:"100%"
  },
  sectionHours: {
    fontSize: 16,
    color: '#888',
    marginVertical: "1%",
  },
  contactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '3%',
  },
  linkIcon: {
    width: '6%',
    height: '150%',
    marginRight: '3%',
  },
  linkText: {
    fontSize: 14,
    color: '#0D47A1',
  },
});
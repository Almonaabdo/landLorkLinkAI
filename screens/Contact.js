/*
* FILE        : Contact.js
* Description : Premium-feel Contact Screen with refined UI and professional layout.
* Author      : Abdurrahman Almouna, Yafet Tekleab
* Updated     : April 13, 2025
*/

import React, { useState } from "react";
import {View,Text,Image, TouchableOpacity, StatusBar, StyleSheet, Linking, ScrollView} from "react-native";
import { PrimaryButton } from "../components/Buttons";
import MapView from "react-native-maps";

// icons
const emailIcon = require("../assets/emailIcon.png");
const callIcon = require("../assets/callIcon.png");
const mapsIcon = require("../assets/mapsIcon.png");
const personImage = require("../assets/person.jpg");
const instagramIcon = require("../assets/instagramIcon.png");
const facebookIcon = require("../assets/facebookIcon.png");
const googleIcon = require("../assets/googleIcon.png");

// Google Maps Handler
const openGoogleMaps = (address) => {
  const formatted = encodeURIComponent(address);
  Linking.openURL(
    `https://www.google.com/maps/search/?api=1&query=${formatted}`
  );
};

export const Contact = ({ navigation }) => {
  const leasingOfficeAddress = "Accommod8u 150 University Ave W. - Unit 4, Waterloo";
  const propertyManagementOffice = "The HUB 130 Columbia St W, Waterloo";

  const [showManagmentMap, setShowManagmentMap] = useState(false);
  const [showLeasingMap, setShowLeasingMap] = useState(false);

  const [leasingOfficeMap, setLeasingOfficeMap] = useState({
    latitude: 43.4778939,
    longitude: -80.5374425,
    latitudeDelta: 0.0007,
    longitudeDelta: 0.0007,
  });
  const [propertyManagementOfficeMap, setPropertyManagmentOfficeMap] = useState({
    latitude: 43.478583,
    longitude: -80.537472,
    latitudeDelta: 0.0007,
    longitudeDelta: 0.0007,
  });

  return (
    <ScrollView
      style={{flex:1, padding:12}}
      contentContainerStyle={{ paddingBottom: 20 }}>
      <StatusBar barStyle="light-content" />

      {/* Header Contact Person */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Image source={personImage} style={styles.profileImage} />
          <View>
            <Text style={styles.name}>Paul S</Text>
            <Text style={styles.role}>Building Manager</Text>
            <Text style={styles.phone}>226-898-0000</Text>
          </View>
        </View>
      </View>

      {/* Management Office */}
      <ContactSection
        title="Management Office"
        hours="Mon - Fri: 10am - 5pm"
        showMap={showManagmentMap}
        toggleMap={() => setShowManagmentMap((prev) => !prev)}
        mapRegion={leasingOfficeMap}
        address= {propertyManagementOffice}
        links={[
          {
            icon: emailIcon,
            text: "maintenance@accommod8u.com",
            action: () =>
              Linking.openURL(
                "mailto:maintenance@accommod8u.com?subject=Maintenance Request&body=Hello, I need assistance with..."
              ),
          },
          {
            icon: mapsIcon,
            text: propertyManagementOffice,
          },
        ]}
      />

      {/* Leasing Office */}
      <ContactSection
        title="Leasing Office"
        hours="Mon - Fri: 10am - 6pm"
        showMap={showLeasingMap}
        toggleMap={() => setShowLeasingMap((prev) => !prev)}
        mapRegion={leasingOfficeMap}
        address= {leasingOfficeAddress}
        links={[
          {
            icon: callIcon,
            text: "+1 (226) 898-0000",
            action: () => Linking.openURL(`tel:2268980000`),
          },
          {
            icon: emailIcon,
            text: "leasing@accommod8u.com",
            action: () =>
              Linking.openURL(
                "mailto:leasing@accommod8u.com?subject=Leasing Inquiry&body=Hello, I’m interested in..."
              ),
          },
          {
            icon: mapsIcon,
            text: leasingOfficeAddress,
          },
        ]}
      />

      {/* Website redirect Button */}
      <PrimaryButton text="Accommod8u.com" onPress={() => { Linking.openURL("https://www.accommod8u.com/");}} style={{marginVertical:20}}/>

      {/* Social Media */}
      <View style={styles.socialContainer}>
        <TouchableOpacity>
          <Image source={facebookIcon} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={instagramIcon} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={googleIcon} style={styles.socialIcon} />
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const ContactSection = ({ title, hours, links, showMap, toggleMap, mapRegion, address }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionHours}>{hours}</Text>
    {links.map((link, index) =>
     {
      const isMapLink = link.icon === mapsIcon;
      return (
        <TouchableOpacity key={index}style={styles.linkRow} onPress={isMapLink ? toggleMap : link.action} activeOpacity={0.7}>
          <Image source={link.icon} style={styles.linkIcon} />
          <Text style={styles.linkText}>{link.text}</Text>
        </TouchableOpacity>
      );
    })}

    {showMap && (
      <TouchableOpacity onPress={() => openGoogleMaps(address)}>
        <MapView style={styles.map} initialRegion={mapRegion} showsUserLocation/>
      </TouchableOpacity>
    )}
  </View>
);

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  role: {
    color: "#666",
  },
  phone: {
    fontSize: 16,
    color: "#1E88E5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  sectionHours: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  linkIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  linkText: {
    color: "#0D47A1",
    flexShrink: 1,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    alignItems:'center'
  },
  socialIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
});

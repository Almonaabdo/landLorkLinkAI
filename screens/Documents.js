import React, { useState } from 'react';
import { View, Text, StatusBar, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Modal, Button, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import { LoginButton } from '../components/Buttons';
import RoomatesListCard from '../components/RoomatesListCard';

const primaryColor = "#3e1952";

const budgetIcon = require(".././assets/budgetIcon.png");
const historyIcon = require(".././assets/historyIcon.png");
const paymentMethodsImage = require(".././assets/paymentsMethod.jpg");
const personImage = require(".././assets/person.jpg");

const documentsList = [
  { key: '1', value: 'Lease Document', uri: 'https://css4.pub/2015/icelandic/dictionary.pdf', expiryDate: '2025-12-31' },
  { key: '2', value: 'Contract Document', uri: 'https://css4.pub/2015/icelandic/dictionary.pdf', expiryDate: '2024-12-31' },
  { key: '3', value: 'Agreement Document', uri: 'https://besjournals.onlinelibrary.wiley.com/doi/pdf/10.1111/2041-210X.13500', expiryDate: '2024-11-30' },
];

const billsList = [
  { key: '1', value: 'Hydro Bill', uri: 'https://css4.pub/2015/icelandic/dictionary.pdf', startDate: '2024-01-01', endDate: '2024-01-31' },
  { key: '2', value: 'Water Bill', uri: 'https://css4.pub/2015/icelandic/dictionary.pdf', startDate: '2024-02-01', endDate: '2024-02-28' },
  { key: '3', value: 'AC Bill', uri: 'https://css4.pub/2015/icelandic/dictionary.pdf', startDate: '2024-03-01', endDate: '2024-03-31' },
];

export function Documents({ navigation }) {
  const [selectedUri, setSelectedUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDocumentsVisible, setIsDocumentsVisible] = useState(true);
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  // Function to toggle the documents open and close based on current state
  const documentToggle = (uri) => {
    if (selectedUri === uri) {
      setSelectedUri("");
    }
    else {
      setSelectedUri(uri);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Title */}
      {/* <Text style={styles.header}>Documents & Bills</Text>
      <Text style={styles.description}>Select a document or bill to view or download. </Text> */}


      {/* Conditional Rendering DOCUMENTS/BILLS */}
      {isDocumentsVisible ? (
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Documents</Text>
            {documentsList.map(doc => (
              <Card key={doc.key} title={doc.value} onPress={() => documentToggle(doc.uri)} expiryDate={doc.expiryDate} />
            ))}
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.section}>

            <Text style={styles.header}>Roomates</Text>
            <RoomatesListCard profilePicture={personImage} name="John Doe" paymentStatus="paid" />
            <RoomatesListCard profilePicture={personImage} name="Yafet Tekleab" paymentStatus="Not paid" />
            <RoomatesListCard profilePicture={personImage} name="Abdurrahman Almouna" paymentStatus="Not paid" />
            
            <Text style={styles.sectionHeader}>Bills</Text>
            {billsList.map(bill => (
              <Card key={bill.key} title={bill.value} onPress={() => documentToggle(bill.uri)} expiryDate={"SEP-2024 - OCT-2024"} />
            ))}
          </View>
        </View>
      )}

      {/* WEB VIEW PDF */}
      {selectedUri && (
        <View style={styles.webViewContainer}>
          {loading && <ActivityIndicator size="large" color={primaryColor} />}
          <WebView
            originWhitelist={['*']}
            source={{ uri: selectedUri }}
            style={styles.webView}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>
      )}

      {/* View Toggle Buttons */}
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <ToggleButton text="Documents" onPress={() => setIsDocumentsVisible(true)} style={{ backgroundColor: isDocumentsVisible ? primaryColor : 'gray' }} />
        <ToggleButton text="Bills" onPress={() => setIsDocumentsVisible(false)} style={{ backgroundColor: !isDocumentsVisible ? primaryColor : 'gray' }} />
        {!isDocumentsVisible && <ToggleButton text="Pay Bill" onPress={() => setIsPaymentModalVisible(true)} style={{ backgroundColor: "#345635" }} />}
      </View>

      <View style={{ height: 50, width: 120, alignSelf: "center", marginVertical: "5%" }}>
      </View>

      {/* History and budget buttons */}
      <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: "space-evenly" }}>

        <TouchableOpacity onPress={() => { setIsBudgetModalVisible(true) }}>
          <Image style={styles.icon} source={budgetIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image style={styles.icon} source={historyIcon} />
        </TouchableOpacity>

      </View>

      {/* Budget Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isBudgetModalVisible}
        onRequestClose={() => { setIsBudgetModalVisible(false) }}>

        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aug-2024 - Sep-2024</Text>

            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>RENT:</Text>
              <Text style={styles.modalStatValue}>$1,200.18</Text>
            </View>

            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>ELECTRICITY:</Text>
              <Text style={styles.modalStatValue}>$150.45</Text>
            </View>

            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>WATER BILL:</Text>
              <Text style={styles.modalStatValue}>$50.12</Text>
            </View>

            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>AC BILL:</Text>
              <Text style={styles.modalStatValue}>$100.00</Text>
            </View>

            <View style={styles.modalStat}>
              <Text style={styles.modalStatLabel}>TOTAL</Text>
              <Text style={styles.modalStatValue}>$1450.00</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => { setIsBudgetModalVisible(false) }}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={isPaymentModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={{ flex: 1, backgroundColor: "white" }}>

          {/* TOP HEADER SECTION */}
          <View style={styles.paymentModalHeader}>
            <Text style={[styles.headerText, { marginLeft: "40%", marginTop:"10%" }]}> Payments </Text>
            <TouchableOpacity onPress={() => {setIsPaymentModalVisible(false)}} style={{marginTop:"10%"}}>
              <Text style={styles.headerText}> Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: "5%", padding: "4%" }}>
            <Text style={{ fontSize: 24, alignSelf: "center" }}>Secure Payment</Text>

            <Text style={{ textAlign: "center", color: "grey", fontSize: 15, alignSelf: "center" }}>Your credit or debit information will be kept{'\n'} encrypted and secure</Text>

            <Text style={{ backgroundColor: "#ededed", textAlign: "center", paddingVertical: "4%", width: "100%", borderRadius: "2%", fontSize: 18, alignSelf: "center" }}>Account: 924371244</Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 18, alignSelf: "center" }}>Amount</Text>
              <Text style={{ fontSize: 18, borderWidth: 1, padding: 5, borderRadius: 5, borderColor: "grey", width: "25%" }}>$80.01</Text>
            </View>
            <View style={{ marginBottom: "10%", height: 2, backgroundColor: "#E0E0E0" }}></View>

            <Text style={{ alignSelf: "center" }}>Enter your card details</Text>
            <Image source={paymentMethodsImage} style={{ alignSelf: "center", height: "5%", width: "70%" }}></Image>

            <LoginButton text={"Confirm Payment"}></LoginButton>

          </View>
        </View>
      </Modal>


    </View>
  );
}

// Documents Card
const Card = ({ title, onPress, expiryDate, startDate, endDate }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>{title}</Text>
    {expiryDate && <Text style={styles.expiryText}>{expiryDate}</Text>}
    {startDate && endDate && <Text style={styles.periodText}>Period: {startDate} - {endDate}</Text>}
  </TouchableOpacity>
);

// Toggle Button
const ToggleButton = ({ text, onPress, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: primaryColor,
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  webViewContainer: {
    marginTop: 20,
    flex: 0,
    height: '45%',
  },
  expiryText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 20,
  },
  modalStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  modalStatLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
    flex: 1,
  },
  modalStatValue: {
    fontSize: 18,
    color: '#555',
    flex: 1,
    textAlign: 'right',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: primaryColor,
    padding: 10,
    borderRadius: 8,
  },

  // PAYMENT MODAL STYLING
  paymentModalHeader: {
    padding: "3%",
    backgroundColor: primaryColor,
    height: "10%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    alignContent: "center",
    color: "white",
    fontWeight: "500",
  },

  icon:{
    width: 30,
    height: 30,
    margin:10,
  },


});
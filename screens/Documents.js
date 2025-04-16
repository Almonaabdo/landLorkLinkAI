import React, { useState } from 'react';
import { View, Text, StatusBar, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Modal, Button, TextInput, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { PrimaryButton } from '../components/Buttons';
import RoomatesListCard from '../components/RoomatesListCard';

const primaryColor = "#2c4c9c";
const secondaryColor = "#6a3093";
const accentColor = "#a044ff";


const paymentMethodsImage = require(".././assets/paymentsMethod.jpg");
const personImage = require(".././assets/person.jpg");

const documentsList = [
  { key: '1', value: 'Lease Document', uri: 'https://css4.pub/2015/icelandic/dictionary.pdf', expiryDate: '2025-12-31' },
  { key: '2', value: 'Contract Document', uri: 'https://css4.pub/2015/icelandic/dictionary.pdf', expiryDate: '2024-12-31' },
  { key: '3', value: 'Agreement Document', uri: 'https://besjournals.onlinelibrary.wiley.com/doi/pdf/10.1111/2041-210X.13500', expiryDate: '2024-11-30' },
];

const billsList = [
  { key: '1', value: 'Hydro Bill', uri: 'https://css4.pub/2015/icelandic/dictionary.pdf', startDate: '2024-01-01', endDate: '2024-01-31', amount: '$150.45' },
  { key: '2', value: 'Water Bill', uri: 'https://css4.pub/2015/icelandic/dictionary.pdf', startDate: '2024-02-01', endDate: '2024-02-28', amount: '$50.12' },
  { key: '3', value: 'AC Bill', uri: 'https://css4.pub/2015/icelandic/dictionary.pdf', startDate: '2024-03-01', endDate: '2024-03-31', amount: '$100.00' },
];

const roommates = [
  { id: '1', name: 'John Doe', paymentStatus: 'paid', amount: '$500', profilePicture: personImage },
  { id: '2', name: 'Yafet Tekleab', paymentStatus: 'pending', amount: '$500', profilePicture: personImage },
  { id: '3', name: 'Abdurrahman Almouna', paymentStatus: 'overdue', amount: '$500', profilePicture: personImage },
];

export function Documents({ navigation }) {
  const [selectedUri, setSelectedUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [showDocuments, setShowDocuments] = useState(false);

  const documentToggle = (uri) => {
    if (selectedUri === uri) {
      setSelectedUri("");
    } else {
      setSelectedUri(uri);
    }
  };

  return (
    <View style={{flex: 1, padding: 15}}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView>

        {/* Roommates Section */}
        <Text style={styles.sectionHeader}>Roommates</Text>
          {roommates.map(roommate => (
            <View key={roommate.id} style={styles.roommateCard}>
              <Image source={roommate.profilePicture} style={styles.profileImage} />
              <View style={styles.roommateInfo}>
                <Text style={styles.roommateName}>{roommate.name}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: roommate.paymentStatus === 'paid' ? '#4CAF50' : 
                                    roommate.paymentStatus === 'pending' ? '#FFC107' : '#F44336' }
                ]}>
                  <Text style={styles.statusText}>{roommate.paymentStatus.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.amountText}>{roommate.amount}</Text>
            </View>
          ))}

        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>

          <TouchableOpacity style={[styles.toggleButton, !showDocuments && styles.activeToggleButton]} onPress={() => setShowDocuments(false)} >
            <Text style={[styles.toggleText, !showDocuments && styles.activeToggleText]}>Current Bills</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.toggleButton, showDocuments && styles.activeToggleButton]} onPress={() => setShowDocuments(true)}>
            <Text style={[styles.toggleText, showDocuments && styles.activeToggleText]}>Documents</Text>
          </TouchableOpacity>
        </View>

        {/* Documents or Bills Section */}
        {showDocuments ? (
          <View>
            <Text style={styles.sectionHeader}>Documents</Text>
            {documentsList.map(doc => (
              <TouchableOpacity key={doc.key} style={styles.billCard} onPress={() => documentToggle(doc.uri)}>
                <View style={styles.billInfo}>
                  <Text style={styles.billTitle}>{doc.value}</Text>
                  <Text style={styles.billPeriod}>Expires: {doc.expiryDate}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>Current Bills</Text>
              <TouchableOpacity onPress={() => setIsPaymentModalVisible(true)}>
                <Text style={styles.payAllButton}>Pay All</Text>
              </TouchableOpacity>
            </View>
            {billsList.map(bill => (
              <TouchableOpacity key={bill.key} style={styles.billCard} onPress={() => documentToggle(bill.uri)}>
                <View style={styles.billInfo}>
                  <Text style={styles.billTitle}>{bill.value}</Text>
                  <Text style={styles.billPeriod}>{bill.startDate} - {bill.endDate}</Text>
                </View>
                <View style={styles.billAmountContainer}>
                  <Text style={styles.billAmount}>{bill.amount}</Text>
                  <TouchableOpacity style={styles.payButton} onPress={() => setIsPaymentModalVisible(true)}>
                    <Text style={styles.payButtonText}>Pay</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* PDF Viewer */}
      {selectedUri && (
        <View style={styles.pdfViewerContainer}>
          <TouchableOpacity 
            style={styles.closePdfButton} 
            onPress={() => setSelectedUri("")}
          >
            <Text style={{fontSize: 36, color: 'white'}}>×</Text>
          </TouchableOpacity>
          {loading && (
            <View>
              <ActivityIndicator size="large" color={primaryColor} />
            </View>
          )}
          <WebView
            originWhitelist={['*']}
            source={{ uri: selectedUri }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>
      )}

      {/* Payment Modal */}
      <Modal visible={isPaymentModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Secure Payment</Text>
              <TouchableOpacity onPress={() => setIsPaymentModalVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{padding: 20}}>
              <Text style={styles.paymentDescription}>
                Your payment information will be kept encrypted and secure
              </Text>
              
              <View style={styles.accountInfo}>
                <Text>Account Number</Text>
                <Text style={styles.accountNumber}>924371244</Text>
              </View>

              <View>
                <Text>Amount</Text>
                <TextInput
                  style={styles.amountField}
                  placeholder="$84.30"
                  value={amount}
                  onChangeText={setAmount}
                  editable={false}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <Image source={paymentMethodsImage} style={styles.paymentMethods} />
              
              <PrimaryButton text="Confirm Payment" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: primaryColor,
  },
  payAllButton: {
    color: secondaryColor,
    fontSize: 16,
    fontWeight: '600',
  },
  roommateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  roommateInfo: {
    flex: 1,
    marginLeft: 15,
  },
  roommateName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
  },
  billCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  billInfo: {
    flex: 1,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  billPeriod: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  billAmountContainer: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
  },
  payButton: {
    backgroundColor: primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  payButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: primaryColor,
  },
  closeButton: {
    fontSize: 32,
    color: '#666',
  },
  paymentDescription: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  accountInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  paymentMethods: {
    width: '100%',
    height: 50,
    resizeMode: 'contain',
  },
  pdfViewerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
  },
  closePdfButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001, // make sure the close button is on top of the pdf viewer
  },

  toggleContainer: {
    flexDirection: 'row',
    margin: 15,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: primaryColor,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeToggleText: {
    color: 'white',
  },
});
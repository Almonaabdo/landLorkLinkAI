import { StyleSheet } from "react-native";

export const primaryColor = "#5E3A87";
const borderColor = "#DDD";
const inputBackground = "#dde2ed";
const fontPrimary = "System";


import { Dimensions, Platform } from 'react-native';
import { ScrollView } from "react-native-web";

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = screenWidth > 768; //tablets, desktops

export const globalStyles = StyleSheet.create({
  companyLogo: {
    width: '105%',
    height: isLargeScreen ? 200 : 170,
    resizeMode: 'stretch',
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 30,
  },

  ScrollViewContainer:{
    flex:1,
    paddingHorizontal:"5%",
    paddingVertical: '1%',
    backgroundColor: "#ffffff",
    width: isLargeScreen ? 750 : '100%',
    alignSelf:"center"
  },

  container: {
    margin: "4%",
    padding: "5%",
    borderWidth: 1,
    borderColor: borderColor,
    borderRadius: 16,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: "center",
  },

  inputLabel: {
    marginBottom: "3%",
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },

  textInput: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: isLargeScreen ? 18 : 16,
    backgroundColor: '#fafafa',
    marginBottom: 10,
  },


  textHeader:{
    fontSize: 24,
    color:primaryColor,
    alignSelf:"center",
    marginVertical:5,
    fontFamily: 'Avenir'
},

  textLabel: {
    color: primaryColor,
    fontSize: 13,
    padding: "5%",
    alignSelf: "center",
    fontWeight: "600",
  },

  textError: {
    color: "#D32F2F",
    fontSize: 13,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 8,
  },
});

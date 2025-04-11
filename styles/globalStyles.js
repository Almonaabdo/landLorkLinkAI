import { StyleSheet } from "react-native";

const primaryColor = "#5E3A87"; // purple
const borderColor = "#DDD";
const inputBackground = "#F9F6FC"; // input background
const fontPrimary = "System";

export const globalStyles = StyleSheet.create({
  companyImage: {
    width: "100%",
    resizeMode: "cover",
    alignSelf: "center",
    height: 140,
    borderRadius: 16,
    marginBottom: 20,
  },

  smallLogo: {
    width: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: -16,
    marginBottom: 10,
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
    width: "100%",
    height: 50,
    borderColor: borderColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: inputBackground,
    fontSize: 15,
    color: "#333",
    marginBottom: 16,
  },

  textInputSignup: {
    width: "100%",
    height: 45,
    borderColor: borderColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: inputBackground,
    fontSize: 15,
    color: "#333",
    marginBottom: 14,
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

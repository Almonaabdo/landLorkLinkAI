import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";


const primaryColor = "#60099c"


export function LoginButton({ text, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.LoginButton}>
        <Text style={[styles.ButtonText]}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({

  LoginButton:
  {
    borderRadius: 8,
    padding: 10,
    backgroundColor: primaryColor,
    width: '50%',
    alignSelf: 'center'
  },


  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center'
  },
})
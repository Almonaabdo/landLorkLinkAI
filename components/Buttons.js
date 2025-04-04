import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";


const primaryColor = "#60099c"
export function LoginButton({ text, onPress, style, component, color }) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <View style={[styles.LoginButton, { backgroundColor: color ? color : primaryColor }]}>
        <Text style={[styles.ButtonText]}>{text}</Text>
        {component}
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
    alignSelf: 'center', // horizontal center
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center' // vertical center
  },


  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center'
  },
})
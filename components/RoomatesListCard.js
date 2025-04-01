import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useState } from 'react';

const RoomatesListCard = ({ profilePicture, name, paymentStatus }) => {

  const paymentStatusColor = paymentStatus === "paid" ? "green" : "red";
  
    return (
        <View style={styles.container}>
            <Image source={profilePicture} style={styles.profilePicture} />
            <Text style={styles.name}>{name}</Text>
            <Text style={[styles.paymentStatus, { color: paymentStatusColor }]}>{paymentStatus}</Text>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        borderRadius: 10,
        padding: '3%',
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        //shadow box
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
    },

    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    paymentStatus: {
        fontSize: 16,
    }
});


export default RoomatesListCard;
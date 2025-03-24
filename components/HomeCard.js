import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

const HomeCard = ({ title, description, imageUrl }) => {
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Button title="Get Started" color="green" onPress={() => { /* Handle button press */ }} />
      </View>
      <Image 
        source={ imageUrl }
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: '2%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.33,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: '#fafafa',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: 'grey',
    marginVertical: 5,
  },
  image: {
    width: '30%',
    height: '120%',
    borderRadius: 10,
  },
});

export default HomeCard;

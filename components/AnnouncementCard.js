import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';


// announcement card component
const AnnouncementCard = ({ title, details, timeAgo, image }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => 
  {
    setExpanded(prev => !prev);
  };

  return (
    <TouchableOpacity onPress={toggleExpand} style={styles.card}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>


      <Text style={styles.details}>
        {expanded ? details : (details.length > 15 ? `${details.slice(0, 30)} read more...` : details)}
      </Text>
    <View style={{flexDirection:'row' }}>
      <Image source={image} style={styles.image}/>
      <Text style={[styles.details, {color:"#3e1952"}]}> Andy Robinson</Text>
    </View>


    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: 
  {
    backgroundColor: '#fff',
    borderRadius: 7,
    padding: 15,
    marginVertical: 10,
    elevation: 3,         // for Android shadow
    shadowColor: '#000',  // for iOS shadow
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#9453b8', // #9453b8 might change back to this #3A8DFF
    elevation: 1,
  },
  header: 
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: 
  {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  details: 
  {
    fontSize: 16,
    color: '#555',
    marginTop: 15,
  },
  timeAgo: 
  {
    fontSize: 12,
    color: '#aaa',
  },
  image:{
    width:47, height:47, 
    borderRadius:1000,
    marginRight:10,
    marginTop:5
  },
});

export default AnnouncementCard;
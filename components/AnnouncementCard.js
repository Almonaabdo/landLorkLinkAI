import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { primaryColor } from '../styles/globalStyles';

const AnnouncementCard = ({ title, details, timeAgo, image }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(prev => !prev);

  return (
    <TouchableOpacity onPress={toggleExpand} style={styles.card}>
      {/* Icon + Header Row */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NOTICE</Text>
        </View>
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Details */}
      <Text style={styles.details}>
        {expanded ? details : details.length > 70 ? `${details.slice(0, 70)}...  tap to read more` : details}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        {image && <Image source={image} style={styles.image} />}
        <View>
          <Text style={styles.managerName}>Andy Robinson</Text>
          <Text style={styles.managerTitle}>Property Manager</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fdf8f3', 
    borderRadius: 4,
    padding: 18,
    marginVertical: 12,
    borderLeftWidth: 5,
    borderLeftColor: primaryColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#646870',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  },
  details: {
    fontSize: 15,
    color: 'black',
    lineHeight: 22,
    marginBottom: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ececec',
    paddingTop: 12,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  managerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  managerTitle: {
    fontSize: 12,
    color: '#888',
  },
});

export default AnnouncementCard;
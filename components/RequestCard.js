import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RequestCard = ({ title, type, details, status, createdAt, priority }) => {
  return (
    <View style={styles.cardContainer}>
      {/* Title of the request */}
      <Text style={styles.title}>{title}</Text>

      {/* Type and Priority */}
      <View style={styles.row}>
        <Text style={styles.type}>Type: {type}</Text>
        <Text style={[styles.priority, getPriorityStyle(priority)]}>
          Priority: {priority}
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.details}>{details}</Text>

      {/* Status and Created At */}
      <View style={styles.row}>
        <Text style={styles.status}>Status: {status}</Text>
        <Text style={styles.createdAt}>
          Created: {new Date(createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

// Dynamic style based on priority level
const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'High':
      return { color: '#ff4d4d' }; // Red for high priority
    case 'Medium':
      return { color: '#ffcc00' }; // Yellow for medium priority
    case 'Low':
      return { color: '#00cc66' }; // Green for low priority
    default:
      return { color: '#000' }; // Default black
  }
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    color: '#555',
  },
  priority: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  status: {
    fontSize: 14,
    color: '#007BFF',
  },
  createdAt: {
    fontSize: 14,
    color: '#999',
  },
});

export default RequestCard;

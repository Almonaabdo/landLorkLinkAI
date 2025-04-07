import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from 'react-native';

const RequestCard = ({ title, type, details, status, createdAt, priority, navigation }) => {
  return (
    <View style={styles.cardContainer}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Type and Priority */}
      <View style={styles.metaRow}>
        <View style={styles.typeContainer}>
        </View>
        <View style={[styles.priorityBadge, getPriorityStyle(priority)]}>
          <Text style={styles.priorityText}>
            {priority}
          </Text>
        </View>
        
      </View>

      {/* Description */}
      <Text style={styles.details}>{details}</Text>

      {/* Status and Created At */}
      <View style={styles.row}>
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{status}</Text>
        </View>
        <Text style={styles.createdAt}>
          {new Date(createdAt).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
        <Feather name="message-square" size={24} color="black" />
      </TouchableOpacity>

    </View>
  );
};

// Dynamic style based on priority level
const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'High':
      return { backgroundColor: '#FFE5E5', borderColor: '#FF4D4D' };
    case 'Medium':
      return { backgroundColor: '#FFF4E5', borderColor: '#FFA94D' };
    case 'Low':
      return { backgroundColor: '#E5FFE5', borderColor: '#4DCC4D' };
    default:
      return { backgroundColor: '#F5F5F5', borderColor: '#CCCCCC' };
  }
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  type: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  details: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 8,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    backgroundColor: '#E5F2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  status: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500',
  },
  createdAt: {
    fontSize: 14,
    color: '#999999',
  },
});

export default RequestCard;

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const AnnouncementsList = ({ announcements, navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Announcements")}>
        <View style={styles.card}>
          <Text style={styles.title}>Recent updates</Text>

          {announcements.length > 0 ? (
            announcements.slice(0, 2).map((announcement) => (
              <View key={announcement.id} style={styles.announcementCard}>
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
                <Text style={styles.announcementDate}>
                  {new Date(announcement.createdAt).toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noAnnouncements}>No announcements available</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:"4%",
    marginVertical:"3%",
  },
  card: 
  {
    alignSelf:"start",
    width:"100%",
    backgroundColor: '#e6e6fa',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  title: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    alignSelf:"center",
    marginBottom: 12,
  },
  announcementCard: {
    backgroundColor: '#F4F6F9',
    borderRadius: 8,
    marginBottom: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#b066b3', // #9453b8 might change back to this #3A8DFF
    elevation: 1,
  },
  announcementTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  announcementDate: {
    color: '#A5A5A5',
    fontSize: 12,
    fontStyle: 'italic',
  },
  noAnnouncements: {
    color: '#A5A5A5',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AnnouncementsList;

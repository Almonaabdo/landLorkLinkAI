import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather } from 'react-native-vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDocument, fetchDocuments, updateDocument, deleteDocument } from '../Functions';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const primaryColor = "#3e1952"



const EVENT_CATEGORIES = {
  COMMUNITY: { label: 'Community', color: '#4CAF50' },
  MAINTENANCE: { label: 'Maintenance', color: '#2196F3' },
  SOCIAL: { label: 'Social', color: '#9C27B0' },
  EMERGENCY: { label: 'Emergency', color: '#F44336' },
};

export function Events({ navigation }) {
  const [upcomingEvents, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'category'
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [userInfoMap, setUserInfoMap] = useState(new Map()); // Store user information
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    displayDate: '',
    details: '',
    category: 'COMMUNITY',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Get current date in local timezone
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [tempDate, setTempDate] = useState(new Date());

  const scrollViewRef = useRef(null);
  const searchInputRef = useRef(null);

  // Update useFocusEffect to use the new getCurrentDate function
  useFocusEffect(
    React.useCallback(() => {
      setSelectedDate(getCurrentDate());
    }, [])
  );

  // Fetch user information once when component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const creatorName = `${userData.firstName} ${userData.lastName}`;
          setUserInfoMap(prev => new Map(prev).set(user.uid, creatorName));
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const events = await fetchDocuments('events');

        // Add creator names to events using the stored userInfoMap
        const eventsWithUserInfo = events.map(event => ({
          ...event,
          creatorName: userInfoMap.get(event.createdBy) || 'Unknown User'
        }));

        setEvents(eventsWithUserInfo);
        updateMarkedDates(eventsWithUserInfo);
      } catch (error) {
        console.error('Error in fetchEvents:', error);
        Alert.alert('Error', 'Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [userInfoMap]); // Re-fetch events when userInfoMap changes

  const updateMarkedDates = (events) => {
    const newMarkedDates = {};
    events.forEach(event => {
      newMarkedDates[event.date] = {
        marked: true,
        selected: true,
        selectedColor: EVENT_CATEGORIES[event.category].color,
      };
    });
    setMarkedDates(newMarkedDates);
  };

  const filteredEvents = upcomingEvents
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = selectedDate ? event.date === selectedDate : true;
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date) - new Date(b.date);
      }
      return a.category.localeCompare(b.category);
    });

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.details) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'Please login to add an event');
      return;
    }

    try {
      // Get creator name from the map
      const creatorName = userInfoMap.get(user.uid) || 'Unknown User';

      // Add the event with both the user ID and name
      const eventId = await addDocument('events', {
        title: newEvent.title,
        date: newEvent.date,
        details: newEvent.details,
        category: newEvent.category || 'COMMUNITY',
        createdBy: user.uid,
        creatorName: creatorName,
        createdAt: new Date(),
        reminder: false,
      });

      // Fetch updated events list
      const updatedEvents = await fetchDocuments('events');
      const eventsWithUserInfo = updatedEvents.map(event => ({
        ...event,
        creatorName: userInfoMap.get(event.createdBy) || 'Unknown User'
      }));

      setEvents(eventsWithUserInfo);
      updateMarkedDates(eventsWithUserInfo);

      // Reset form and close modal
      setShowAddModal(false);
      setNewEvent({ title: '', date: '', details: '', category: 'COMMUNITY' });
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Failed to add event');
    }
  };

  const toggleReminder = (eventId) => {
    const updatedEvents = upcomingEvents.map(event =>
      event.id === eventId
        ? { ...event, reminder: !event.reminder }
        : event
    );
    setEvents(updatedEvents);
  };

  // Deletes an event from both the database and local state
  // @param {string} eventId - The unique identifier of the event to delete
  const deleteEvent = async (eventId) => {
    // Show confirmation dialog to prevent accidental deletions
    Alert.alert(
      'Confirm Delete',
      'Event will be deleted',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Ok',
          onPress: async () => {
            try {
              // Delete the event from Firebase database
              await deleteDocument("events", eventId);

              // Update local state by removing the event from the list
              const updatedEvents = upcomingEvents.filter(event => event.id !== eventId);
              setEvents(updatedEvents);

              // Update calendar markers to remove the event's date
              updateMarkedDates(updatedEvents);
            } catch (error) {
              // Handle any errors during deletion process
              console.error("Error deleting event: ", error);
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const renderRightActions = (event) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={[styles.swipeAction, { backgroundColor: event.reminder ? '#FF9800' : '#4CAF50' }]}
        onPress={() => toggleReminder(event.id)}>
        <Text style={styles.swipeActionText}>
          {event.reminder ? 'Disable Reminder' : 'Enable Reminder'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.swipeAction, { backgroundColor: '#F44336' }]}
        onPress={() => deleteEvent(event.id)}>
        <Text style={styles.swipeActionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const eventCard = ({ item }) => {
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <TouchableOpacity onPress={() => openModal(item)}>
          <View style={[styles.card, { borderLeftColor: EVENT_CATEGORIES[item.category].color, borderLeftWidth: 5 }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={[styles.categoryTag, { backgroundColor: EVENT_CATEGORIES[item.category].color }]}>
                <Text style={styles.categoryText}>{EVENT_CATEGORIES[item.category].label}</Text>
              </View>
            </View>
            <Text style={styles.cardDate}>{item.date}</Text>
            <Text style={styles.cardDate}>Created by: {isLoading ? 'Loading...' : item.creatorName}</Text>
            {item.reminder && <Text style={styles.reminderText}>🔔 Reminder Set</Text>}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleSearchFocus = () => {
    // Give time for keyboard to show up before scrolling
    setTimeout(() => {
      searchInputRef.current?.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({
          y: pageY - 100, // Scroll to position with some padding
          animated: true,
        });
      });
    }, 100);
  };

  const handleDateChange = (date) => {
    // Parse the date string directly to avoid timezone issues
    const [year, month, day] = date.split('-');
    const selectedDate = new Date(year, month - 1, day); // month is 0-based in JS Date
    setSelectedDate(date);

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    setNewEvent({ ...newEvent, date: date, displayDate: formattedDate });
  };

  const handleConfirmDate = () => {
    setShowDatePicker(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Calendar
          current={selectedDate}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: primaryColor,
            },
          }}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          theme={{
            calendarBackground: '#fff',
            todayTextColor: primaryColor,
            dayTextColor: primaryColor,
            monthTextColor: primaryColor,
            arrowColor: primaryColor,
            textSectionTitleColor: primaryColor,
            selectedDayBackgroundColor: primaryColor,
            selectedDayTextColor: '#ffffff',
            'stylesheet.day.basic': {
              base: {
                width: 32,
                height: 26,
                alignItems: 'center',
                justifyContent: 'center',
              },
              text: {
                color: primaryColor,
              },
            },
            'stylesheet.day.selected': {
              base: {
                backgroundColor: primaryColor,
                borderRadius: 16,
              },
              text: {
                color: '#fff',
              },
            },
            'stylesheet.day.marked': {
              base: {
                borderColor: primaryColor,
                borderWidth: 1,
                borderRadius: 16,
              },
              text: {
                color: '#fff',
              },
            },
          }}
        />
        <View style={{ marginVertical: 20 }} />

        <View style={styles.searchContainer}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortBy(sortBy === 'date' ? 'category' : 'date')}>
            <Text style={styles.sortButtonText}>
              {sortBy === 'date' ? 'Date' : 'Category'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredEvents}
          renderItem={eventCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={<View />}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />

        {/* Event Details Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="fade">
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <View style={[styles.categoryIndicator, { backgroundColor: EVENT_CATEGORIES[selectedEvent?.category]?.color }]} />
                    <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
                    <TouchableOpacity
                      style={styles.closeModalButton}
                      onPress={() => setModalVisible(false)}>
                      <Feather name="x" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <View style={styles.modalInfoRow}>
                      <Feather name="calendar" size={20} color={primaryColor} />
                      <Text style={styles.modalDate}>{selectedEvent?.date}</Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Feather name="tag" size={20} color={primaryColor} />
                      <View style={[styles.modalCategoryTag, { backgroundColor: EVENT_CATEGORIES[selectedEvent?.category]?.color }]}>
                        <Text style={styles.modalCategoryText}>
                          {EVENT_CATEGORIES[selectedEvent?.category]?.label}
                        </Text>
                      </View>
                    </View>

                    {selectedEvent?.reminder && (
                      <View style={styles.modalInfoRow}>
                        <Feather name="bell" size={20} color="#FF9800" />
                        <Text style={styles.modalReminderText}>Reminder Set</Text>
                      </View>
                    )}

                    <View style={styles.modalDetailsContainer}>
                      <Text style={styles.modalDetailsTitle}>Details</Text>
                      <Text style={styles.modalDetails}>{selectedEvent?.details}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalCloseButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Add Event Modal */}
        <Modal
          transparent={true}
          visible={showAddModal}
          onRequestClose={() => setShowAddModal(false)}
          animationType="fade">
          <TouchableWithoutFeedback onPress={() => setShowAddModal(false)}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <View style={[styles.categoryIndicator, { backgroundColor: EVENT_CATEGORIES[newEvent.category]?.color }]} />
                    <Text style={styles.modalTitle}>Add New Event</Text>
                    <TouchableOpacity
                      style={styles.closeModalButton}
                      onPress={() => setShowAddModal(false)}>
                      <Feather name="x" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <View style={styles.inputGroup}>
                      <View style={styles.inputLabel}>
                        <Feather name="edit-3" size={20} color={primaryColor} />
                        <Text style={styles.inputLabelText}>Event Title</Text>
                      </View>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Enter event title"
                        value={newEvent.title}
                        onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <View style={styles.inputLabel}>
                        <Feather name="calendar" size={20} color={primaryColor} />
                        <Text style={styles.inputLabelText}>Event Date</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.datePickerButtonText}>
                          {newEvent.displayDate || 'Select Date'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Custom Date Picker Modal */}
                    <Modal
                      visible={showDatePicker}
                      transparent={true}
                      animationType="slide"
                      onRequestClose={() => setShowDatePicker(false)}>
                      <View style={styles.datePickerModalContainer}>
                        <View style={styles.datePickerModalContent}>
                          <View style={styles.datePickerHeader}>
                            <Text style={styles.datePickerTitle}>Select Date</Text>
                            <TouchableOpacity
                              onPress={() => setShowDatePicker(false)}
                              style={styles.datePickerCloseButton}>
                              <Feather name="x" size={24} color="#666" />
                            </TouchableOpacity>
                          </View>
                          <Calendar
                            current={selectedDate}
                            onDayPress={(day) => {
                              handleDateChange(day.dateString);
                            }}
                            markedDates={{
                              [selectedDate]: {
                                selected: true,
                                selectedColor: primaryColor,
                              },
                            }}
                            minDate={new Date().toISOString().split('T')[0]}
                            theme={{
                              selectedDayBackgroundColor: primaryColor,
                              selectedDayTextColor: '#ffffff',
                              todayTextColor: primaryColor,
                              dayTextColor: '#2d4150',
                              textDisabledColor: '#d9e1e8',
                              dotColor: primaryColor,
                            }}
                          />
                          <View style={styles.datePickerFooter}>
                            <TouchableOpacity
                              style={[styles.datePickerButton, styles.datePickerCancelButton]}
                              onPress={() => setShowDatePicker(false)}>
                              <Text style={styles.datePickerCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.datePickerButton, styles.datePickerConfirmButton]}
                              onPress={handleConfirmDate}>
                              <Text style={styles.datePickerConfirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>

                    <View style={styles.inputGroup}>
                      <View style={styles.inputLabel}>
                        <Feather name="tag" size={20} color={primaryColor} />
                        <Text style={styles.inputLabelText}>Category</Text>
                      </View>
                      <View style={styles.categorySelector}>
                        {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
                          <TouchableOpacity
                            key={key}
                            style={[
                              styles.categoryOption,
                              {
                                backgroundColor: value.color,
                                opacity: newEvent.category === key ? 1 : 0.5
                              }
                            ]}
                            onPress={() => setNewEvent({ ...newEvent, category: key })}>
                            <Text style={styles.categoryOptionText}>{value.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <View style={styles.inputLabel}>
                        <Feather name="align-left" size={20} color={primaryColor} />
                        <Text style={styles.inputLabelText}>Event Details</Text>
                      </View>
                      <TextInput
                        style={[styles.modalInput, styles.modalInputMultiline]}
                        placeholder="Enter event details"
                        value={newEvent.details}
                        onChangeText={(text) => setNewEvent({ ...newEvent, details: text })}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                    </View>
                  </View>

                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonSecondary]}
                      onPress={() => setShowAddModal(false)}>
                      <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonPrimary]}
                      onPress={handleAddEvent}>
                      <Text style={styles.modalButtonTextPrimary}>Create Event</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: primaryColor,
    padding: 15,
    borderRadius: 7,
    marginBottom: '5%',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Avenir',
  },
  card: {
    backgroundColor: '#dbceeb',
    borderRadius: 4,
    padding: 15,
    marginBottom: 10,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },

  // MODAL STYLING
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeModalButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  modalDate: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  modalCategoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalCategoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modalReminderText: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: '500',
  },
  modalDetailsContainer: {
    marginTop: 20,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
  },
  modalDetailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  modalCloseButton: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 15,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: primaryColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  sortButton: {
    backgroundColor: primaryColor,
    padding: 10,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  sortButtonText: {
    color: 'white',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: primaryColor,
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  inputLabelText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  modalInputMultiline: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  categoryOptionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: primaryColor,
  },
  modalButtonSecondary: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    padding: 4,
    borderRadius: 3,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
  },
  reminderText: {
    color: '#FF9800',
    fontSize: 12,
    marginTop: 5,
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeAction: {
    justifyContent: 'center',
    padding: 15,
    marginLeft: 5,
    borderRadius: 4,
  },
  swipeActionText: {
    color: 'white',
    fontSize: 12,
  },
  listContainer: {
    paddingHorizontal: 5,
    flexGrow: 1,
  },
  datePickerButton: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  datePickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  datePickerCloseButton: {
    padding: 5,
  },
  datePickerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  datePickerCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  datePickerConfirmButton: {
    backgroundColor: primaryColor,
  },
  datePickerCancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerConfirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
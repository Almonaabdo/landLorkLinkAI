import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather } from 'react-native-vector-icons';
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
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    details: '',
    category: 'COMMUNITY',
  });

  const scrollViewRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchedEvents = [
      {
        id: '1',
        date: '2024-10-10',
        title: 'Community Meeting',
        details: 'Discuss community initiatives.',
        category: 'COMMUNITY',
        reminder: true
      },
      {
        id: '2',
        date: '2024-10-15',
        title: 'Maintenance Day',
        details: 'Regular maintenance of community areas.',
        category: 'MAINTENANCE',
        reminder: false
      },
      {
        id: '3',
        date: '2024-10-31',
        title: 'Halloween Party',
        details: 'Fun activities and treats for all ages!',
        category: 'SOCIAL',
        reminder: true
      },
    ];

    setEvents(fetchedEvents);
    updateMarkedDates(fetchedEvents);
  }, []);

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
    .filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.details.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date) - new Date(b.date);
      }
      return a.category.localeCompare(b.category);
    });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.details) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newEventObj = {
      id: String(upcomingEvents.length + 1),
      ...newEvent,
      reminder: false,
    };

    const updatedEvents = [...upcomingEvents, newEventObj];
    setEvents(updatedEvents);
    updateMarkedDates(updatedEvents);
    setShowAddModal(false);
    setNewEvent({ title: '', date: '', details: '', category: 'COMMUNITY' });
  };

  const toggleReminder = (eventId) => {
    const updatedEvents = upcomingEvents.map(event =>
      event.id === eventId
        ? { ...event, reminder: !event.reminder }
        : event
    );
    setEvents(updatedEvents);
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = upcomingEvents.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    updateMarkedDates(updatedEvents);
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

  const eventCard = ({ item }) => (
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
          {item.reminder && <Text style={styles.reminderText}>🔔 Reminder Set</Text>}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Calendar
          markedDates={markedDates}
          theme={{
            calendarBackground: '#fff',
            todayTextColor: primaryColor,
            dayTextColor: primaryColor,
            monthTextColor: primaryColor,
            arrowColor: primaryColor,
            textSectionTitleColor: primaryColor,
            selectedDayBackgroundColor: primaryColor,
            selectedDayTextColor: primaryColor,
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
                      <TextInput
                        style={styles.modalInput}
                        placeholder="YYYY-MM-DD"
                        value={newEvent.date}
                        onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
                      />
                    </View>

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
});
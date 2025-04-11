import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, addDoc, query, orderBy, onSnapshot, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { addDocument } from '../Functions';

// Main ChatScreen component that handles the chat interface for maintenance requests
const ChatScreen = ({ route }) => {
    // Extract requestId from navigation route params
    const { requestId } = route.params;

    // State management for messages and UI
    const [messages, setMessages] = useState([]); // Stores all messages for the current request
    const [newMessage, setNewMessage] = useState(''); // Current message being typed
    const [refreshing, setRefreshing] = useState(false); // Controls pull-to-refresh state

    // Get current user's ID from Firebase Authentication
    const currentUserId = auth.currentUser?.uid;

    // Effect hook to set up real-time message listener
    useEffect(() => {
        // Create a reference to the ticket document and its messages subcollection
        const ticketRef = doc(db, 'tickets', `Ticket${requestId}`);
        const messagesRef = collection(ticketRef, 'messages');

        // Create a query for the messages subcollection
        const q = query(messagesRef);

        // Set up real-time listener for message updates
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            // Transform Firestore documents into message objects
            const fetchedMessages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                text: doc.data().text,
                sender: doc.data().sender,
                timestamp: doc.data().timestamp,
            }));

            // Sort messages by timestamp locally
            fetchedMessages.sort((a, b) => a.timestamp - b.timestamp);

            // Update messages state with sorted messages
            setMessages(fetchedMessages);

            // If no messages exist, add initial welcome message
            if (fetchedMessages.length === 0) {
                try {
                    const initialMessage = {
                        text: "Welcome to the maintenance chat! How can we help you today?",
                        sender: "system",
                        timestamp: new Date()
                    };
                    await addDocument(messagesRef, initialMessage);
                } catch (error) {
                    console.error('Error adding initial message:', error);
                }
            }
        }, (error) => {
            console.error('Error fetching messages:', error);
        });

        // Cleanup function to unsubscribe from listener when component unmounts
        return () => unsubscribe();
    }, [requestId]); // Re-run effect when requestId changes

    // Function to handle pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);  // Show refresh indicator
        setRefreshing(false); // Hide refresh indicator
    };

    // Function to handle sending new messages
    const handleSend = async () => {
        // Only send if message is not empty
        if (newMessage.trim()) {
            try {
                // Create references to the ticket document and its messages subcollection
                const ticketRef = doc(db, 'tickets', `Ticket${requestId}`);
                const messagesRef = collection(ticketRef, 'messages');

                // Create message object with all necessary data
                const message = {
                    text: newMessage,
                    sender: currentUserId,
                    timestamp: new Date()
                };

                // Add message to the subcollection
                await addDoc(messagesRef, message);

                // Clear input field after sending
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    // Render the chat interface
    return (
        <SafeAreaView style={styles.container}>
            {/* Chat header showing request ID */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Maintenance Chat</Text>
                <Text style={styles.ticketId}>Ticket #{requestId}</Text>
            </View>

            {/* Keyboard-aware view to handle keyboard appearance */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                {/* Scrollable message list with pull-to-refresh */}
                <ScrollView
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {/* Map through messages and render each one */}
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={[
                                styles.messageBubble,
                                // Style message bubble differently based on sender
                                message.sender === currentUserId
                                    ? styles.userMessage
                                    : styles.otherMessage
                            ]}
                        >
                            <Text style={[
                                styles.messageText,
                                // Style text differently based on sender
                                message.sender === currentUserId
                                    ? styles.userMessageText
                                    : styles.otherMessageText
                            ]}>
                                {message.text}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Message input area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type your message..."
                        placeholderTextColor="#666"
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Ionicons name="send" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Styles for the chat interface
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    ticketId: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messagesContent: {
        paddingBottom: 16,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 8,
    },
    // Styles for messages sent by current user
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF', // Blue bubble
    },
    userMessageText: {
        color: '#fff', // White text
    },
    // Styles for messages sent by others
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#333', // Black bubble
    },
    otherMessageText: {
        color: '#fff', // White text
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        paddingVertical: 30,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        marginBottom: '-7%',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
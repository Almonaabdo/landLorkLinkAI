import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { addDocument } from '../Functions';

const ChatScreen = () => {
    // State for storing messages and new message input
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const { ticketId } = "Qwe";
    // Get current user's ID from Firebase Auth
    const currentUserId = auth.currentUser?.uid;

    // Fetch messages when component mounts or ticketId changes
    useEffect(() => {
        getMessages();
    }, [ticketId]);

    // Function to fetch messages from Firestore
    const getMessages = async () => {
        try {
            // Get reference to messages collection
            const messagesRef = collection(db, 'messages');
            // Create query to order messages by timestamp
            const q = query(messagesRef, orderBy('timestamp', 'asc'));
            // Fetch documents from the collection
            const querySnapshot = await getDocs(q);
            // Transform Firestore documents into message objects
            const fetchedMessages = querySnapshot.docs.map(doc => ({
                id: doc.id,
                text: doc.data().text,
                sender: doc.data().sender,
                timestamp: doc.data().timestamp
            }));
            // Update messages state with fetched messages
            setMessages(fetchedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Function to handle pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);  // Show refresh indicator
        await getMessages();  // Fetch latest messages
        setRefreshing(false); // Hide refresh indicator
    };

    // Function to handle sending new messages
    const handleSend = async () => {
        if (newMessage.trim()) {
            try {
                // Create message object with timestamp
                const message = {
                    text: newMessage,
                    sender: currentUserId,
                    timestamp: new Date()
                };

                // Add message to Firestore
                const messagesRef = collection(db, 'messages');
                await addDoc(messagesRef, message);

                // Update local state with new message
                setMessages([...messages, { ...message, id: messages.length + 1 }]);
                setNewMessage(''); // Clear input field
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Maintenance Chat</Text>
                <Text style={styles.ticketId}>Ticket #{ticketId}</Text>
            </View>

            {/* Use KeyboardAvoidingView to avoid the keyboard covering the input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust for iOS devices
            >
                <ScrollView
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                //keyboardShouldPersistTaps="handled" // To prevent input loss when tapping outside
                //ref={ref => this.scrollView = ref}
                //onContentSizeChange={() => 
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={[
                                styles.messageBubble,
                                // Style based on whether message is from current user
                                message.sender === currentUserId
                                    ? styles.userMessage
                                    : styles.otherMessage
                            ]}
                        >
                            <Text style={[
                                styles.messageText,
                                // Text color based on message type
                                message.sender === currentUserId
                                    ? styles.userMessageText
                                    : styles.otherMessageText
                            ]}>
                                {message.text}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

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
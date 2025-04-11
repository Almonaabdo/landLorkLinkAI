import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, addDoc, query, orderBy, onSnapshot, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { addDocument } from '../Functions';

const ChatScreen = ({ route }) => {

    const { requestId } = route.params;

    // state management
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false); 

    // user's ID from Firebase
    const currentUserId = auth.currentUser?.uid;

    useEffect(() => {

        // Refrences to ticket table and its messages subcollection
        const ticketTableRef = doc(db, 'tickets', `Ticket${requestId}`);
        const messagesTableRef = collection(ticketTableRef, 'messages');
        // query for the messages subcollection
        const q = query(messagesTableRef);

        // real-time listener for messages updates
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {

            // array of messages grabbed from database table
            const fetchedMessages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                text: doc.data().text,
                sender: doc.data().sender,
                timestamp: doc.data().timestamp,
            }));

            // Sort messages by timestamp locally
            fetchedMessages.sort((a, b) => a.timestamp - b.timestamp);

            // store messages in a local array
            setMessages(fetchedMessages);

            // If no messages exist, add initial system message
            if (fetchedMessages.length === 0) {
                try {
                    const initialMessage = {
                        text: "Welcome to the maintenance chat! How can we help you today?",
                        sender: "system",
                        timestamp: new Date()
                    };
                    await addDocument(messagesTableRef, initialMessage);
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


    const onRefresh = async () => {
        setIsRefreshing(true); 
        setIsRefreshing(false);
    };

    // handles sending new messages
    const handleSend = async () => {

        // send if message has data
        if (newMessage.trim()) {
            try {
                // References to ticket table and its messages subcollection
                const ticketRef = doc(db, 'tickets', `Ticket${requestId}`);
                const messagesRef = collection(ticketRef, 'messages');

                const message = {
                    text: newMessage,
                    sender: currentUserId,
                    timestamp: new Date()
                };

                // send message to database table
                await addDoc(messagesRef, message);
                setNewMessage('');

            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Chat header showing request ID */}
            <View style={styles.header}>
                <Text style={{fontSize: 20}}>Maintenance Chat</Text>
                <Text style={styles.ticketId}>Ticket #{requestId}</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <ScrollView style={{padding:'2%'}} refreshControl={ <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />} >

                    {/* Map through messages and render each one */}
                    {messages.map((message) => (

                        <View key={message.id} style={[ styles.messageBubble, message.sender === currentUserId? styles.userMessage : styles.otherMessage]}>
                            <Text style={{color:'white'}}>{message.text}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* text input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type your message..."
                        placeholderTextColor="#666"
                        multiline
                    />

                    {/* send button */}
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
    ticketId: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },

    // MESSAGES TYLING
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#0051CC',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#333',
    },

    // TEXT INPUT STYLING

    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        paddingVertical: 30,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        marginBottom: '-7%',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
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
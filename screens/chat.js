import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { addDocument } from '../Functions';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const { ticketId } = "Qwe";

    useEffect(() => {
        getMessages();
    }, [ticketId]);

    const getMessages = async () => {
        try {
            const messagesRef = collection(db, 'messages');
            const querySnapshot = await getDocs(messagesRef);
            const fetchedMessages = querySnapshot.docs.map(doc => ({
                id: doc.id,
                text: doc.data().text,
                sender: doc.data().sender
            }));
            setMessages(fetchedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await getMessages();
        setRefreshing(false);
    };

    const handleSend = async () => {
        if (newMessage.trim()) {
            try {
                const message = {
                    text: newMessage,
                    sender: 'user',
                    timestamp: new Date()
                };

                // Add to Firestore
                const messagesRef = collection(db, 'messages');
                await addDoc(messagesRef, message);

                // Update local state
                setMessages([...messages, { ...message, id: messages.length + 1 }]);
                setNewMessage('');
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
                                message.sender === 'user' ? styles.userMessage : styles.supportMessage,
                            ]}
                        >
                            <Text style={styles.messageText}>{message.text}</Text>
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
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    supportMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
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
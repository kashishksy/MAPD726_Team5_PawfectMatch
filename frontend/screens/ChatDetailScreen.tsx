// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../config/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';

const ChatDetailScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const user = useSelector((state: any) => state.auth.userData);
  
  const { chatId, shelterName, chatData } = route.params || {};
  // Use the owner/org name from params
  const ownerName = shelterName || chatData?.ownerName || 'Pet Owner';

  useEffect(() => {
    console.log('ChatDetailScreen mounted with params:', { chatId, shelterName, chatData });
    console.log('Current user:', user);

    if (!chatId) {
      console.log('No chatId provided');
      setLoading(false);
      return;
    }

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));

      console.log('Setting up messages listener for chat:', chatId);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Received message snapshot with size:', snapshot.size);
        
        const messageList = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Message data:', data);
          
          return {
            id: doc.id,
            text: data.text || '',
            createdAt: data.createdAt ? new Date(data.createdAt.toDate()) : new Date(),
            senderId: data.senderId || 'unknown',
            senderName: data.senderName || 'Unknown User',
            senderAvatar: data.senderAvatar || undefined
          };
        });

        console.log('Processed messages:', messageList.length);
        setMessages(messageList);
        setLoading(false);
      }, (error) => {
        console.error('Error in messages snapshot:', error);
        setLoading(false);
      });

      return () => {
        console.log('Cleaning up messages listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up messages listener:', error);
      setLoading(false);
    }
  }, [chatId]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    try {
      console.log('Sending new message:', inputText);

      if (!chatId) {
        console.error('No chatId available');
        return;
      }

      if (!user?.userId) {
        console.error('No user ID available');
        return;
      }

      // Check if chat document exists
      const chatDocRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatDocRef);
      
      // If chat document doesn't exist, create it
      if (!chatDoc.exists()) {
        console.log('Creating new chat document');
        await setDoc(chatDocRef, {
          participants: [user.userId, chatData?.ownerId || ''],
          participantNames: {
            [user.userId]: user.fullName || 'User',
            [chatData?.ownerId || '']: ownerName
          },
          createdAt: serverTimestamp(),
          lastMessage: inputText,
          lastMessageTime: serverTimestamp(),
          unreadCount: {
            [user.userId]: 0
          },
          petInfo: chatData?.petInfo || null
        });
      } else {
        // Update the existing chat document
        await updateDoc(chatDocRef, {
          lastMessage: inputText,
          lastMessageTime: serverTimestamp(),
          [`unreadCount.${user.userId}`]: 0
        });
      }

      // Add the message to the messages subcollection
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: inputText,
        createdAt: serverTimestamp(),
        senderId: user.userId,
        senderName: user.fullName || 'User',
        senderAvatar: user.profileImage || '',
        read: false
      });

      setInputText('');
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderPetBanner = () => {
    if (!chatData?.petInfo) return null;

    return (
      <View style={[styles.petBanner, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Image
          source={{ uri: chatData.petInfo?.image || 'https://via.placeholder.com/100' }}
          style={styles.petImage}
        />

        <View style={styles.petInfo}>
          <Text style={[styles.petName, { color: colors.text }]}>
            {chatData.petInfo.name}
          </Text>
          <Text style={[styles.petAdoptionText, { color: colors.secondaryText }]}>
            Adoption Inquiry
          </Text>
        </View>
      </View>
    );
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === user?.userId;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isCurrentUser 
            ? [styles.currentUserBubble, { backgroundColor: colors.primary }]
            : [styles.otherUserBubble, { backgroundColor: colors.card }]
        ]}>
          <Text style={[
            styles.messageText,
            { color: isCurrentUser ? '#fff' : colors.text }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isCurrentUser ? 'rgba(255,255,255,0.7)' : colors.secondaryText }
          ]}>
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: colors.text }}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{ownerName}</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading messages...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: colors.text }}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{ownerName}</Text>
        <View style={styles.headerRight} />
      </View>
      
      {renderPetBanner()}
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          inverted
        />
        
        <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: colors.card }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.secondaryText}
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { 
                backgroundColor: inputText.trim() ? colors.primary : colors.disabled,
                opacity: inputText.trim() ? 1 : 0.7
              }
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  petBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  petInfo: {
    marginLeft: 12,
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
  },
  petAdoptionText: {
    fontSize: 14,
    marginTop: 4,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  currentUserBubble: {
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
    height: 40,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabled: {
    backgroundColor: '#cccccc',
  },
});

export default ChatDetailScreen;

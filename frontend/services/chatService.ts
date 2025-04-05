import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Create a new chat between user and shelter
export const createChat = async (userId: string, shelterId: string, shelterData: any) => {
  try {
    // Check if chat already exists
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId)
    );
    
    const querySnapshot = await getDocs(q);
    let existingChatId = null;
    
    querySnapshot.forEach((doc) => {
      const chatData = doc.data();
      if (chatData.participants.includes(shelterId)) {
        existingChatId = doc.id;
      }
    });
    
    // If chat exists, return the existing chat ID
    if (existingChatId) {
      return { id: existingChatId, isNew: false };
    }
    
    // Create a new chat
    const newChat = await addDoc(chatsRef, {
      participants: [userId, shelterId],
      createdAt: serverTimestamp(),
      lastMessageTimestamp: serverTimestamp(),
      lastMessage: '',
      shelterName: shelterData.name,
      shelterImage: shelterData.profileImage || 'https://via.placeholder.com/100',
      unreadCount: {
        [userId]: 0,
        [shelterId]: 0
      }
    });
    
    return { id: newChat.id, isNew: true };
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

// Send a message in a chat
export const sendMessage = async (chatId: string, senderId: string, text: string, recipientId: string, senderData: any) => {
  try {
    // Add message to the chat
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const newMessage = await addDoc(messagesRef, {
      text,
      createdAt: serverTimestamp(),
      senderId,
      senderName: senderData.name || 'User',
      senderAvatar: senderData.profileImage || '',
      read: false
    });
    
    // Update the chat with last message info
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTimestamp: serverTimestamp(),
      [`unreadCount.${recipientId}`]: 1
    });
    
    return newMessage.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (chatId: string, userId: string) => {
  try {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      [`unreadCount.${userId}`]: 0
    });
    
    // TODO: You could also mark individual messages as read here
    return true;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Start a chat about a specific pet
export const startPetChat = async (userId: string, shelterId: string, userData: any, petData: any) => {
  try {
    // Create a unique chat ID based on user, shelter, and pet
    // This ensures one chat per user-shelter-pet combination
    const chatId = `${userId}_${shelterId}_${petData.id || petData._id}`;
    
    // Check if chat already exists
    const chatDocRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatDocRef);
    
    // If chat doesn't exist, create it
    if (!chatDoc.exists()) {
      await setDoc(chatDocRef, {
        participants: [userId, shelterId],
        participantNames: {
          [userId]: userData.fullName || 'User',
          [shelterId]: petData.ownerName || 'Pet Owner'
        },
        createdAt: new Date(),
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: {
          [userId]: 0,
          [shelterId]: 0
        },
        petInfo: {
          id: petData.id || petData._id,
          name: petData.name,
          image: petData.image || petData.images?.[0]
        }
      });
    }
    
    return chatId;
  } catch (error) {
    console.error('Error starting pet chat:', error);
    throw error;
  }
};

export default {
  createChat,
  sendMessage,
  markMessagesAsRead,
  startPetChat
}; 
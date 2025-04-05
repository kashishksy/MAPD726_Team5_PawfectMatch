//@ts-check
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import BottomNavigation from '../components/common/BottomNavigation';
import { useTheme } from '../context/ThemeContext';

const MessagesScreen = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Chats');
  const navigation = useNavigation();
  const { colors } = useTheme();
  const user = useSelector((state: any) => state.auth.userData);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userId = user.userId || user._id;
    if (!userId) {
      setLoading(false);
      return;
    }

    console.log('Loading chats for user:', userId);

    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Received chats snapshot with size:', snapshot.size);
        
        const chatList = snapshot.docs.map(doc => {
          const data = doc.data();
          
          // Find the other participant (not the current user)
          const otherParticipantId = data.participants.find((id: string) => id !== userId);
          const otherParticipantName = data.participantNames?.[otherParticipantId] || 'Unknown';
          
          return {
            id: doc.id,
            lastMessage: data.lastMessage || 'No messages yet',
            lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
            unreadCount: data.unreadCount?.[userId] || 0,
            otherParticipantId,
            otherParticipantName,
            petInfo: data.petInfo || null
          };
        });

        setChats(chatList as never[]);
        setLoading(false);
      }, (error) => {
        console.error('Error in chats snapshot:', error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up chats listener:', error);
      setLoading(false);
    }
  }, [user]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === now.toDateString()) {
      // Today - show time
      return moment(messageDate).format('HH.mm');
    } else if (
      messageDate.toDateString() === 
      new Date(now.setDate(now.getDate() - 1)).toDateString()
    ) {
      // Yesterday
      return 'Yesterday';
    } else {
      // Older - show date
      return moment(messageDate).format('MMM DD, YYYY');
    }
  };

  const renderChatItem = ({ item }: { item: any }) => {
    const placeholderImage = 'https://via.placeholder.com/100';
    const imageSource = item.petInfo?.image || placeholderImage;
  
    return (
      <TouchableOpacity 
        style={[styles.chatItem, { borderBottomColor: colors.border }]} 
        onPress={() => navigateToChat(item)}
      >
        <Image source={{ uri: imageSource }} style={styles.avatar} />
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.shelterName, { color: colors.text }]}>{item.otherParticipantName}</Text>
            <Text style={[styles.timestamp, { color: colors.secondaryText }]}>{formatTime(item.lastMessageTime)}</Text>
          </View>
          <Text style={[styles.lastMessage, { color: colors.secondaryText }]} numberOfLines={1}>
            {item.petInfo?.name ? `${item.petInfo.name}: ` : ''}
            {item.lastMessage}
          </Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  const navigateToChat = (chat: any) => {
    (navigation as any).navigate('ChatDetail', {
      chatId: chat.id,
      shelterName: chat.otherParticipantName,
      chatData: {
        petInfo: chat.petInfo,
        ownerId: chat.otherParticipantId
      }
    });
  };
  
  const renderHeader = () => (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/logo.png')} 
          style={[styles.logo, { tintColor: colors.primary }]} 
        />
      </View>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
      <TouchableOpacity style={styles.searchButton}>
        <Ionicons name="search" size={24} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'Chats' && [styles.activeTab, { backgroundColor: colors.primary }]
        ]}
        onPress={() => setActiveTab('Chats')}
      >
        <Text style={[
          styles.tabText, 
          { color: activeTab === 'Chats' ? '#FFFFFF' : colors.secondaryText }
        ]}>
          Chats {chats.length > 0 && `(${chats.length})`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.tab, 
          activeTab === 'Calls' && [styles.activeTab, { backgroundColor: colors.primary }]
        ]}
        onPress={() => setActiveTab('Calls')}
      >
        <Text style={[
          styles.tabText, 
          { color: activeTab === 'Calls' ? '#FFFFFF' : colors.secondaryText }
        ]}>
          Calls
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      {renderTabs()}
      
      {activeTab === 'Chats' ? (
        chats.length > 0 ? (
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={60} color={colors.secondaryText} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No messages yet</Text>
            <Text style={[styles.emptySubText, { color: colors.secondaryText }]}>
              When you chat with shelters about pets,
              your conversations will appear here
            </Text>
          </View>
        )
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="call-outline" size={60} color={colors.secondaryText} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No calls yet</Text>
          <Text style={[styles.emptySubText, { color: colors.secondaryText }]}>
            Calls feature coming soon
          </Text>
        </View>
      )}
      
      <BottomNavigation />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logoContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#F5A623',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatsList: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  shelterName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 14,
  },
  lastMessage: {
    fontSize: 15,
  },
  unreadBadge: {
    backgroundColor: '#F5A623',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MessagesScreen; 
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ContactItem } from '../components/ContactItem';
import { BOT_NAME } from '../constants/botResponses';

interface Props {
  userId: string;
  isConnected: boolean;
  onlineUsers: string[];
  botEnabled: boolean;
  selectedContact: string;
  onSelectContact: (contact: string) => void;
  onLogout: () => void;
}

export const ContactsScreen: React.FC<Props> = ({
  userId,
  isConnected,
  onlineUsers,
  botEnabled,
  selectedContact,
  onSelectContact,
  onLogout,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Выберите собеседника</Text>
        <Text style={styles.headerSubtitle}>
          Вы: {userId} {isConnected ? '🟢' : '🔴'}
        </Text>
      </View>
      
      {onlineUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Нет онлайн пользователей</Text>
          <Text style={styles.emptySubtext}>
            {botEnabled 
              ? `Включён бот-помощник — выберите ${BOT_NAME}` 
              : 'Попросите друга запустить приложение или включите бота'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={onlineUsers}
          renderItem={({ item }) => (
            <ContactItem
              item={item}
              isSelected={selectedContact === item}
              onPress={() => onSelectContact(item)}
            />
          )}
          keyExtractor={item => item}
          style={styles.contactList}
          contentContainerStyle={styles.contactListContent}
          showsVerticalScrollIndicator={true}
        />
      )}
      
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Выйти</Text>
      </TouchableOpacity>
      
      {Platform.OS === 'ios' ? (
        <View style={{ height: 34, backgroundColor: '#f5f5f5' }} />
      ) : (
        <View style={{ height: 20, backgroundColor: '#f5f5f5' }} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0055CC',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  contactList: {
    flex: 1,
  },
  contactListContent: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    margin: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
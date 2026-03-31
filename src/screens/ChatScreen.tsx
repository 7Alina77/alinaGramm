import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { MessageBubble } from '../components/MessageBubble';
import { BOT_NAME } from '../constants/botResponses';

interface Props {
  selectedContact: string;
  isConnected: boolean;
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  isMe: boolean;
  from?: string;
  timestamp?: number;
}

export const ChatScreen: React.FC<Props> = ({
  selectedContact,
  isConnected,
  messages,
  inputText,
  setInputText,
  onSend,
  onBack,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Мягкий скролл к последнему сообщению
  const scrollToBottom = (animated = true) => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated });
    }
  };

  // При загрузке и при каждом изменении сообщений - скролл вниз
  useEffect(() => {
    // Небольшая задержка для гарантии рендера
    const timer = setTimeout(() => {
      scrollToBottom(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [messages.length]);

  // Отслеживаем позицию скролла для показа кнопки
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    
    setShowScrollButton(offsetY > 100 && contentHeight > layoutHeight);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Заголовок */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{selectedContact}</Text>
          <Text style={styles.headerSubtitle}>
            {selectedContact === BOT_NAME ? 'онлайн 🤖' : (isConnected ? 'онлайн' : 'подключение...')}
          </Text>
        </View>
        <View style={styles.backButtonPlaceholder} />
      </View>

      {/* Список сообщений */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <MessageBubble item={item} />}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Кнопка "Вниз" */}
      {showScrollButton && (
        <TouchableOpacity style={styles.scrollButton} onPress={() => scrollToBottom(true)}>
          <Text style={styles.scrollButtonText}>↓</Text>
        </TouchableOpacity>
      )}

      {/* Поле ввода */}
      <View style={[
        styles.inputContainer,
        { paddingBottom: Platform.OS === 'ios' ? 34 : 20 }
      ]}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Введите сообщение..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={onSend}>
          <Text style={styles.sendButtonText}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007AFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
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
  backButton: {
    padding: 5,
    width: 40,
  },
  backButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  backButtonPlaceholder: {
    width: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 8,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
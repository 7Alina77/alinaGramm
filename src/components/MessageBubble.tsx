import React, { memo, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Modal,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Message } from '../types';

interface Props {
  item: Message;
}

export const MessageBubble = memo(({ item }: Props) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const openImage = (url: string) => {
    setSelectedImage(url);
    setImageModalVisible(true);
  };

  const downloadAndShare = async (url: string, name: string) => {
    try {
      // @ts-ignore - игнорируем ошибку TypeScript
      const fileUri = FileSystem.documentDirectory + name;
      
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);
      
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert('Ошибка', 'Шаринг не доступен на этом устройстве');
      }
    } catch (error) {
      console.error('Ошибка скачивания:', error);
      Alert.alert('Ошибка', 'Не удалось скачать файл');
    }
  };

  return (
    <>
      <View style={[styles.messageBubble, item.isMe ? styles.myMessage : styles.theirMessage]}>
        {!item.isMe && item.from && (
          <Text style={styles.senderName}>{item.from}</Text>
        )}
        
        {item.file && item.file.url && (
          <TouchableOpacity onPress={() => {
            if (item.file?.type === 'image') {
              openImage(item.file!.url);
            } else {
              downloadAndShare(item.file!.url, item.file!.name);
            }
          }}>
            {item.file.type === 'image' ? (
              <Image 
                source={{ uri: item.file.url }} 
                style={styles.fileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.fileDocument}>
                <Text style={styles.fileIcon}>📄</Text>
                <Text style={styles.fileName}>{item.file.name || 'Файл'}</Text>
                <Text style={styles.downloadIcon}>⬇️</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        
        {item.text && item.text.length > 0 && (
          <Text style={[styles.messageText, item.isMe ? styles.myMessageText : styles.theirMessageText]}>
            {item.text}
          </Text>
        )}
        
        {item.timestamp && (
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>

      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setImageModalVisible(false)}
        >
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.modalImage}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginVertical: 4,
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#000000',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  fileImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  fileDocument: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
  },
  fileIcon: {
    fontSize: 30,
  },
  fileName: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  downloadIcon: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
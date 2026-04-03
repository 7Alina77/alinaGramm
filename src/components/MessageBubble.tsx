import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import { Message } from '../types';

interface Props {
  item: Message;
}

export const MessageBubble = memo(({ item }: Props) => {
  const openFile = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.messageBubble, item.isMe ? styles.myMessage : styles.theirMessage]}>
      {!item.isMe && item.from && (
        <Text style={styles.senderName}>{item.from}</Text>
      )}
      
      {item.file && (
        <TouchableOpacity onPress={() => openFile(item.file!.url)}>
          {item.file.type === 'image' ? (
            <Image 
              source={{ uri: item.file.url }} 
              style={styles.fileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.fileDocument}>
              <Text style={styles.fileIcon}>📄</Text>
              <Text style={styles.fileName}>{item.file.name}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      
      {item.text.length > 0 && (
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
  },
  fileIcon: {
    fontSize: 30,
    marginRight: 10,
  },
  fileName: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
});
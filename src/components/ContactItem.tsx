import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BOT_NAME } from '../constants/botResponses';

interface Props {
  item: string;
  isSelected: boolean;
  onPress: () => void;
}

export const ContactItem: React.FC<Props> = ({ item, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.contactItem,
        isSelected && styles.contactItemSelected,
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.contactName,
        isSelected && styles.contactNameSelected,
      ]}>
        {item}
      </Text>
      <View style={[styles.onlineDot, item === BOT_NAME && styles.botDot]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  contactItemSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  contactName: {
    fontSize: 16,
    color: '#000',
  },
  contactNameSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759',
  },
  botDot: {
    backgroundColor: '#FF9500',
  },
});
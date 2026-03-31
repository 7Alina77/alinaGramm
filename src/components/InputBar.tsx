import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Platform } from 'react-native';

interface Props {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const InputBar: React.FC<Props> = ({ 
  inputText, 
  setInputText, 
  onSend, 
  disabled 
}) => {
  return (
    <View style={{ 
      backgroundColor: '#FFFFFF', 
      borderTopWidth: 1, 
      borderTopColor: '#E5E5EA', 
      padding: 10,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#E5E5EA',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            fontSize: 16,
            backgroundColor: '#F8F9FA',
            maxHeight: 100,
          }}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Введите сообщение..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={onSend}
          disabled={!inputText.trim() || disabled}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
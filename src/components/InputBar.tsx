import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { FilePicker } from './FilePicker';

interface Props {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  onFileSelected: (file: any) => void;
  disabled?: boolean;
}

export const InputBar: React.FC<Props> = ({ 
  inputText, 
  setInputText, 
  onSend, 
  onFileSelected,
  disabled 
}) => {
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.inputContainer}>
        <FilePicker onFileSelected={onFileSelected} disabled={disabled} />
        
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Введите сообщение..."
          placeholderTextColor="#999"
          multiline
        />
        
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || disabled) && styles.sendButtonDisabled]}
          onPress={() => onSend()}
          disabled={!inputText.trim() || disabled}
        >
          <Text style={styles.sendButtonText}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#B3D4FF',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
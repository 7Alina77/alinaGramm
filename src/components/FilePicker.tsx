import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface Props {
  onFileSelected: (file: any) => void;
  disabled?: boolean;
}

export const FilePicker: React.FC<Props> = ({ onFileSelected, disabled }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onFileSelected({
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: asset.fileName || `image_${Date.now()}.jpg`,
        size: asset.fileSize,
      });
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets[0]) {
      const asset = result.assets[0];
      onFileSelected({
        uri: asset.uri,
        type: asset.mimeType || 'application/octet-stream',
        name: asset.name,
        size: asset.size,
      });
    }
  };

  const showOptions = () => {
    Alert.alert(
      'Выберите файл',
      'Что хотите отправить?',
      [
        { text: '📷 Фото/Видео', onPress: pickImage },
        { text: '📄 Документ', onPress: pickDocument },
        { text: 'Отмена', style: 'cancel' },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={showOptions}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>📎</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 25,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
  disabled: {
    opacity: 0.5,
  },
});
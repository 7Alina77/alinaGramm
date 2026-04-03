import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { registerUser, loginUser } from '../services/api';
import { saveUser } from '../services/storage';

interface Props {
  onLogin: (username: string) => void;
  botEnabled: boolean;
  setBotEnabled: (value: boolean) => void;
}

export const LoginScreen: React.FC<Props> = ({ onLogin, botEnabled, setBotEnabled }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    
    if (username.length < 3) {
      Alert.alert('Ошибка', 'Имя должно содержать минимум 3 символа');
      return;
    }
    
    if (password.length < 4) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 4 символа');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }
    
    setIsLoading(true);
    
    const result = await registerUser(username, password);
    
    if (result.success) {
      Alert.alert('Успех', 'Регистрация прошла успешно! Теперь войдите.', [
        { text: 'OK', onPress: () => {
          setIsRegisterMode(false);
          setPassword('');
          setConfirmPassword('');
          // Очищаем состояние загрузки
          setIsLoading(false);
        }}
      ]);
    } else {
      Alert.alert('Ошибка', result.error || 'Что-то пошло не так');
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Введите имя и пароль');
      return;
    }
    
    setIsLoading(true);
    
    const result = await loginUser(username, password);
    
    if (result.success) {
      await saveUser(username, password);
      // Небольшая задержка перед переходом, чтобы индикатор успел показаться
      setTimeout(() => {
        setIsLoading(false);
        onLogin(username);
      }, 200);
    } else {
      Alert.alert('Ошибка', result.error || 'Неверное имя или пароль');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Как тебе такое РКН</Text>
          <Text style={styles.loginSubtitle}>
            {isRegisterMode ? 'Создайте аккаунт' : 'Войдите в аккаунт'}
          </Text>
          
          <TextInput
            style={styles.loginInput}
            value={username}
            onChangeText={setUsername}
            placeholder="Имя пользователя"
            placeholderTextColor="#999"
            autoCapitalize="none"
            editable={!isLoading}
          />
          
          <TextInput
            style={styles.loginInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Пароль"
            placeholderTextColor="#999"
            secureTextEntry
            editable={!isLoading}
          />
          
          {isRegisterMode && (
            <TextInput
              style={styles.loginInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Подтвердите пароль"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!isLoading}
            />
          )}
          
          <View style={styles.botToggleContainer}>
            <Text style={styles.botToggleLabel}>🤖 Бот-помощник</Text>
            <Switch
              value={botEnabled}
              onValueChange={setBotEnabled}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
              thumbColor={'white'}
              disabled={isLoading}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.disabledButton]} 
            onPress={isRegisterMode ? handleRegister : handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>
                {isRegisterMode ? 'Зарегистрироваться' : 'Войти'}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => {
              setIsRegisterMode(!isRegisterMode);
              setUsername('');
              setPassword('');
              setConfirmPassword('');
            }}
            disabled={isLoading}
          >
            <Text style={styles.switchModeText}>
              {isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
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
  container: {
    flex: 1,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  loginInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  botToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  botToggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#B3D4FF',
  },
  switchModeText: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 10,
  },
});
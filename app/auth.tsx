import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext'; // Fixed import path
import { useRouter } from 'expo-router'; // Added for navigation

function LoginScreen({ setIsLogin }: { setIsLogin: (value: boolean) => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Use router for navigation

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert('Login Successful', 'Welcome back!');
      router.replace('/(tabs)'); // Navigate to the main app
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(false)}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

export function SignupScreen({ setIsLogin }: { setIsLogin: (value: boolean) => void }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Use router for navigation

  const handleSignup = async () => {
    try {
      await register(name, email, password);
      Alert.alert('Signup Successful', 'You can now log in.');
      setIsLogin(true); // Switch to login screen
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Signup Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(true)}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Main Auth component that handles both login and signup
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginScreen setIsLogin={setIsLogin} />
  ) : (
    <SignupScreen setIsLogin={setIsLogin} />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#2563EB', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
  link: { color: '#2563EB', textAlign: 'center', marginTop: 10 },
});
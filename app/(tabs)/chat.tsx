import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Lightbulb, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'diagnosis' | 'warning';
}

const PYTHON_API_URL = process.env.EXPO_PUBLIC_AI_API_URL || 'http://127.0.0.1:8000';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. I can help diagnose problems, provide repair guidance, and connect you with the right professionals. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [threadId, setThreadId] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  const quickSuggestions = [
    "My sink is leaking",
    "Power outlet not working",
    "AC making noise",
    "Need emergency help"
  ];

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch(`${PYTHON_API_URL}/send-message-gpt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadID: threadId,  // Use threadId from state
          content: text.trim()
        })
      });

      if (!response.ok) {
        // Handle HTTP errors from the backend
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();

      if (data.threadID) {
        setThreadId(data.threadID); // Save the threadID
      }
  
      const aiResponse: Message = {
        id: Date.now().toString(),
        text: data.message2 || "Sorry, I couldn't process your request.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
  
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      // Show specific error message from backend or a generic one
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: error.message || "Sorry, there was an error processing your message. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  // const generateAIResponse = (userInput: string): Message => {
  //   const lowerInput = userInput.toLowerCase();
    
  //   if (lowerInput.includes('leak') || lowerInput.includes('drip')) {
  //     return {
  //       id: Date.now().toString(),
  //       text: "I can help with that leak! First, turn off the water supply to prevent damage. Can you tell me where exactly it's leaking? Is it from a faucet, pipe, or fixture? Also, when did you first notice it?",
  //       sender: 'ai',
  //       timestamp: new Date(),
  //       type: 'diagnosis'
  //     };
  //   } else if (lowerInput.includes('electrical') || lowerInput.includes('outlet') || lowerInput.includes('power')) {
  //     return {
  //       id: Date.now().toString(),
  //       text: "⚠️ Safety first! If it's an electrical issue, please don't touch any exposed wires. Check your circuit breaker first - has it tripped? For outlet issues, try testing with different devices. If the problem persists, I recommend calling a licensed electrician.",
  //       sender: 'ai',
  //       timestamp: new Date(),
  //       type: 'warning'
  //     };
  //   } else if (lowerInput.includes('emergency') || lowerInput.includes('urgent')) {
  //     return {
  //       id: Date.now().toString(),
  //       text: "I understand this is urgent. Can you describe the emergency? For immediate safety concerns like gas leaks, electrical hazards, or flooding, please call emergency services first. I can help you find 24/7 emergency technicians in your area.",
  //       sender: 'ai',
  //       timestamp: new Date(),
  //       type: 'warning'
  //     };
  //   } else if (lowerInput.includes('ac') || lowerInput.includes('air') || lowerInput.includes('hvac')) {
  //     return {
  //       id: Date.now().toString(),
  //       text: "Let's troubleshoot your AC issue. Is it not turning on, not cooling properly, or making unusual noises? Here are some quick checks: 1) Check your thermostat settings, 2) Replace air filter if dirty, 3) Check circuit breaker. What specific problem are you experiencing?",
  //       sender: 'ai',
  //       timestamp: new Date(),
  //       type: 'suggestion'
  //     };
  //   } else {
  //     return {
  //       id: Date.now().toString(),
  //       text: "Thanks for sharing that information. To better assist you, could you provide more details about the problem? For example: When did it start? What have you tried already? Any unusual sounds, smells, or visible damage?",
  //       sender: 'ai',
  //       timestamp: new Date(),
  //       type: 'text'
  //     };
  //   }
  // };

  const handleImageUpload = async () => {
    // Ask for permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied!');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      // No base64 needed for FormData
    });

    // If user cancels
    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log('No image selected');
      return;
    }

    const image = result.assets[0];
    const localUri = image.uri;
    const filename = image.fileName || `image_${Date.now()}.jpg`;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: `Uploading ${filename}...`,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };
  
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
  
    try {
      // Convert image URI to blob to ensure it's sent as a file
      const fileResponse = await fetch(localUri);
      const blob = await fileResponse.blob();

      // Prepare form data, which works like a curl request for file uploads
      const formData = new FormData();
      formData.append('image', blob, filename);
      formData.append('threadID', threadId);
  
      // Use the /analyze-image/ endpoint with FormData
      const response = await fetch(`${PYTHON_API_URL}/analyze-image/`, {
        method: 'POST',
        body: formData,
        // When using FormData, do not set 'Content-Type' header.
        // Fetch will automatically set it to 'multipart/form-data' with the correct boundary.
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
      }
  
      const data = await response.json();

      // Save threadID from response
      if (data.gemini_result && data.gemini_result.threadID) {
        setThreadId(data.gemini_result.threadID);
      }
  
      // Add the AI's response to the chat
      const aiResponse: Message = {
        id: Date.now().toString(),
        // Parse the correct response field
        text: data.gemini_result.message2 || "Sorry, I couldn't analyze the image.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'diagnosis', // Or another appropriate type
      };
      setMessages(prev => [...prev, aiResponse]);
  
    } catch (error: any) {
      console.error('Image upload failed:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: error.message || "Sorry, there was an error uploading your image. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <View key={message.id} style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
        <View style={styles.messageHeader}>
          <View style={[styles.avatar, isUser ? styles.userAvatar : styles.aiAvatar]}>
            {isUser ? <User size={16} color="#FFFFFF" /> : <Bot size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.sender}>{isUser ? 'You' : 'AI Assistant'}</Text>
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble, getMessageTypeStyle(message.type)]}>
          {message.type && message.type !== 'text' && (
            <View style={styles.messageTypeIndicator}>
              {getMessageTypeIcon(message.type)}
              <Text style={styles.messageTypeText}>{getMessageTypeLabel(message.type)}</Text>
            </View>
          )}
          <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
            {message.text}
          </Text>
        </View>
      </View>
    );
  };

  const getMessageTypeStyle = (type?: string) => {
    switch (type) {
      case 'warning':
        return styles.warningMessage;
      case 'suggestion':
        return styles.suggestionMessage;
      case 'diagnosis':
        return styles.diagnosisMessage;
      default:
        return {};
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle size={14} color="#DC2626" />;
      case 'suggestion':
        return <Lightbulb size={14} color="#059669" />;
      case 'diagnosis':
        return <CheckCircle size={14} color="#2563EB" />;
      default:
        return null;
    }
  };

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case 'warning':
        return 'Safety Alert';
      case 'suggestion':
        return 'Troubleshooting';
      case 'diagnosis':
        return 'Diagnosis';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Bot size={24} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Text style={styles.headerSubtitle}>Available 24/7 • Instant Help</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cameraButton} onPress={handleImageUpload}>
          <Camera size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.messageHeader}>
                <View style={[styles.avatar, styles.aiAvatar]}>
                  <Bot size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.sender}>AI Assistant</Text>
              </View>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
          
          {messages.length === 1 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Quick suggestions:</Text>
              <View style={styles.suggestions}>
                {quickSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => sendMessage(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="Describe your problem..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
            >
              <Send size={20} color={inputText.trim() ? "#FFFFFF" : "#9CA3AF"} />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHint}>
            Be specific about the problem for better assistance
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#10B981',
  },
  cameraButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userAvatar: {
    backgroundColor: '#2563EB',
  },
  aiAvatar: {
    backgroundColor: '#10B981',
  },
  sender: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#9CA3AF',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#2563EB',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  warningMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  suggestionMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  diagnosisMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  messageTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageTypeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#111827',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  suggestionsContainer: {
    marginTop: 20,
  },
  suggestionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#2563EB',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#2563EB',
  },
  sendButtonInactive: {
    backgroundColor: '#E5E7EB',
  },
  inputHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
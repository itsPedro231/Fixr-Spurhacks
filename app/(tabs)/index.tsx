import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Upload, Zap, MapPin, Star, Clock } from 'lucide-react-native';
import { CameraComponent } from '@/components/CameraComponent';
import { ProblemForm } from '@/components/ProblemForm';
import { TechnicianCard } from '@/components/TechnicianCard';

interface Technician {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  distance: string;
  hourlyRate: number;
  avatar: string;
  responseTime: string;
}

export default function HomeScreen() {
  const [currentView, setCurrentView] = useState<'home' | 'camera' | 'form' | 'results'>('home');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);

  const mockTechnicians: Technician[] = [
    {
      id: '1',
      name: 'Mike Johnson',
      specialties: ['Plumbing', 'Electrical'],
      rating: 4.8,
      distance: '0.5 miles',
      hourlyRate: 85,
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      responseTime: '15 min'
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      specialties: ['HVAC', 'Electrical'],
      rating: 4.9,
      distance: '1.2 miles',
      hourlyRate: 95,
      avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      responseTime: '20 min'
    },
    {
      id: '3',
      name: 'David Chen',
      specialties: ['Appliance Repair'],
      rating: 4.7,
      distance: '2.1 miles',
      hourlyRate: 75,
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      responseTime: '30 min'
    }
  ];

  const handleImageCaptured = (imageUri: string) => {
    setCapturedImage(imageUri);
    setCurrentView('form');
  };

  const handleProblemSubmitted = (problemData: any) => {
    // Mock AI diagnosis
    setDiagnosis("Based on the image analysis, this appears to be a leaky pipe connection. The water stains and pipe corrosion suggest a joint replacement is needed. This is a common plumbing issue that requires professional attention to prevent water damage.");
    setCurrentView('results');
  };

  const handleBookTechnician = (technician: Technician) => {
    Alert.alert(
      'Book Service',
      `Would you like to book ${technician.name} for this service?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => Alert.alert('Success', 'Booking request sent!') }
      ]
    );
  };

  if (currentView === 'camera') {
    return (
      <CameraComponent
        onImageCaptured={handleImageCaptured}
        onCancel={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'form') {
    return (
      <ProblemForm
        capturedImage={capturedImage}
        onSubmit={handleProblemSubmitted}
        onBack={() => setCurrentView('camera')}
      />
    );
  }

  if (currentView === 'results') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentView('home')}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Diagnosis & Recommendations</Text>
          </View>

          {capturedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            </View>
          )}

          <View style={styles.diagnosisCard}>
            <View style={styles.diagnosisHeader}>
              <Zap size={24} color="#2563EB" />
              <Text style={styles.diagnosisTitle}>AI Diagnosis</Text>
            </View>
            <Text style={styles.diagnosisText}>{diagnosis}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Technicians</Text>
            <Text style={styles.sectionSubtitle}>Based on your location and issue type</Text>
          </View>

          {mockTechnicians.map((technician) => (
            <TechnicianCard
              key={technician.id}
              technician={technician}
              onBook={() => handleBookTechnician(technician)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.headerTitle}>What can we help you fix today?</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setCurrentView('camera')}
          >
            <Camera size={28} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Take Photo</Text>
            <Text style={styles.primaryButtonSubtext}>Snap a picture of your problem</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setCurrentView('form')}
          >
            <Upload size={24} color="#2563EB" />
            <Text style={styles.secondaryButtonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.steps}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Capture the Problem</Text>
                <Text style={styles.stepDescription}>Take a photo or describe your issue</Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get AI Diagnosis</Text>
                <Text style={styles.stepDescription}>Our AI analyzes and provides insights</Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Connect with Experts</Text>
                <Text style={styles.stepDescription}>Get matched with local technicians</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <View style={styles.serviceGrid}>
            <View style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>🔧</Text>
              <Text style={styles.serviceName}>Plumbing</Text>
            </View>
            <View style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>⚡</Text>
              <Text style={styles.serviceName}>Electrical</Text>
            </View>
            <View style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>❄️</Text>
              <Text style={styles.serviceName}>HVAC</Text>
            </View>
            <View style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>🔨</Text>
              <Text style={styles.serviceName}>Handyman</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#111827',
    lineHeight: 36,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#2563EB',
  },
  actionButtons: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  primaryButtonSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#BFDBFE',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2563EB',
    marginLeft: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  steps: {
    gap: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  serviceIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  serviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#111827',
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  capturedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  diagnosisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  diagnosisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  diagnosisTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
    marginLeft: 8,
  },
  diagnosisText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
});
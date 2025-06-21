import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, MapPin, Bell, CreditCard, Star, Clock, Settings, CircleHelp as HelpCircle, Shield, LogOut, ChevronRight, CreditCard as Edit3, Award, Calendar } from 'lucide-react-native';
import { useAuth } from 'src/context/AuthContext'; // Fix import path
import { useRouter } from 'expo-router'; // Add router for navigation

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const { logout } = useAuth();
  const router = useRouter(); // Initialize router

  const userStats = {
    totalBookings: 12,
    completedJobs: 10,
    totalSaved: 247,
    avgRating: 4.8,
  };

  const recentBookings = [
    {
      id: '1',
      service: 'Plumbing Repair',
      technician: 'Mike Johnson',
      date: '2024-01-15',
      status: 'completed',
      rating: 5,
    },
    {
      id: '2',
      service: 'Electrical Work',
      technician: 'Sarah Martinez',
      date: '2024-01-12',
      status: 'completed',
      rating: 4,
    },
    {
      id: '3',
      service: 'HVAC Maintenance',
      technician: 'David Chen',
      date: '2024-01-08',
      status: 'pending',
      rating: null,
    },
  ];

  const menuItems = [
    {
      id: 'bookings',
      title: 'My Bookings',
      subtitle: 'View booking history',
      icon: <Calendar size={20} color="#6B7280" />,
      action: () => Alert.alert('Feature', 'Bookings history coming soon!')
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      subtitle: 'Manage cards and billing',
      icon: <CreditCard size={20} color="#6B7280" />,
      action: () => Alert.alert('Feature', 'Payment management coming soon!')
    },
    {
      id: 'addresses',
      title: 'Saved Addresses',
      subtitle: 'Home, work, and more',
      icon: <MapPin size={20} color="#6B7280" />,
      action: () => Alert.alert('Feature', 'Address management coming soon!')
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'FAQs and contact support',
      icon: <HelpCircle size={20} color="#6B7280" />,
      action: () => Alert.alert('Support', 'Contact support at support@servicepro.com')
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Data and privacy settings',
      icon: <Shield size={20} color="#6B7280" />,
      action: () => Alert.alert('Feature', 'Privacy settings coming soon!')
    },
  ];

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: async () => {
            await logout();
            router.replace('../auth/LoginScreen'); // Navigate to LoginScreen after logout
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Edit3 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@email.com</Text>
            <View style={styles.userLocation}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.locationText}>San Francisco, CA</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Edit3 size={16} color="#2563EB" />
            <Text style={styles.editProfileText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Calendar size={20} color="#2563EB" />
              </View>
              <Text style={styles.statValue}>{userStats.totalBookings}</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Award size={20} color="#10B981" />
              </View>
              <Text style={styles.statValue}>{userStats.completedJobs}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Star size={20} color="#F59E0B" />
              </View>
              <Text style={styles.statValue}>{userStats.avgRating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <CreditCard size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.statValue}>${userStats.totalSaved}</Text>
              <Text style={styles.statLabel}>Total Saved</Text>
            </View>
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <View style={styles.bookingsList}>
            {recentBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingService}>{booking.service}</Text>
                  <Text style={styles.bookingTechnician}>with {booking.technician}</Text>
                  <Text style={styles.bookingDate}>{new Date(booking.date).toLocaleDateString()}</Text>
                </View>
                
                <View style={styles.bookingStatus}>
                  <View style={[
                    styles.statusBadge,
                    booking.status === 'completed' ? styles.completedBadge : styles.pendingBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      booking.status === 'completed' ? styles.completedText : styles.pendingText
                    ]}>
                      {booking.status}
                    </Text>
                  </View>
                  
                  {booking.rating && (
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingText}>{booking.rating}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Bell size={20} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingSubtitle}>Get updates on your bookings</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                thumbColor={notifications ? '#2563EB' : '#9CA3AF'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <MapPin size={20} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Location Sharing</Text>
                  <Text style={styles.settingSubtitle}>Help find nearby technicians</Text>
                </View>
              </View>
              <Switch
                value={locationSharing}
                onValueChange={setLocationSharing}
                trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                thumbColor={locationSharing ? '#2563EB' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuIcon}>
                    {item.icon}
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>ServicePro v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for homeowners</Text>
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
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  userLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#2563EB',
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  bookingsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bookingInfo: {
    flex: 1,
  },
  bookingService: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  bookingTechnician: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  bookingDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  bookingStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  completedText: {
    color: '#065F46',
  },
  pendingText: {
    color: '#92400E',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#92400E',
    marginLeft: 4,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  menuList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#DC2626',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  versionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, MapPin, Clock, Wrench, Zap, Droplets, Snowflake, Hammer, Settings } from 'lucide-react-native';

interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  averagePrice: string;
  rating: number;
  providers: number;
  responseTime: string;
}

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const services: Service[] = [
    {
      id: '1',
      name: 'Plumbing',
      icon: <Droplets size={24} color="#2563EB" />,
      description: 'Leak repairs, pipe installations, drain cleaning',
      averagePrice: '$85-150/hr',
      rating: 4.8,
      providers: 156,
      responseTime: '15-30 min'
    },
    {
      id: '2',
      name: 'Electrical',
      icon: <Zap size={24} color="#F59E0B" />,
      description: 'Wiring, outlets, lighting, panel upgrades',
      averagePrice: '$95-180/hr',
      rating: 4.9,
      providers: 89,
      responseTime: '20-45 min'
    },
    {
      id: '3',
      name: 'HVAC',
      icon: <Snowflake size={24} color="#06B6D4" />,
      description: 'AC repair, heating, ventilation systems',
      averagePrice: '$120-200/hr',
      rating: 4.7,
      providers: 67,
      responseTime: '30-60 min'
    },
    {
      id: '4',
      name: 'Handyman',
      icon: <Hammer size={24} color="#10B981" />,
      description: 'General repairs, furniture assembly, mounting',
      averagePrice: '$65-120/hr',
      rating: 4.6,
      providers: 203,
      responseTime: '15-30 min'
    },
    {
      id: '5',
      name: 'Appliance Repair',
      icon: <Settings size={24} color="#8B5CF6" />,
      description: 'Washing machines, dishwashers, refrigerators',
      averagePrice: '$90-160/hr',
      rating: 4.8,
      providers: 124,
      responseTime: '20-40 min'
    },
    {
      id: '6',
      name: 'General Contractor',
      icon: <Wrench size={24} color="#EF4444" />,
      description: 'Major repairs, renovations, construction',
      averagePrice: '$150-300/hr',
      rating: 4.9,
      providers: 45,
      responseTime: '1-2 hours'
    }
  ];

  const categories = [
    { id: 'emergency', name: 'Emergency', count: 12 },
    { id: 'maintenance', name: 'Maintenance', count: 45 },
    { id: 'installation', name: 'Installation', count: 78 },
    { id: 'repair', name: 'Repair', count: 156 },
  ];

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <Text style={styles.subtitle}>Find the right professional for any job</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <View style={styles.categories}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && styles.categoryChipSelected
                  ]}
                  onPress={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.categoryChipTextSelected
                  ]}>
                    {category.name}
                  </Text>
                  <Text style={[
                    styles.categoryChipCount,
                    selectedCategory === category.id && styles.categoryChipCountSelected
                  ]}>
                    {category.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            <Text style={styles.sectionCount}>{filteredServices.length} services</Text>
          </View>

          <View style={styles.servicesList}>
            {filteredServices.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceIcon}>
                    {service.icon}
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                  </View>
                  <View style={styles.serviceRating}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{service.rating}</Text>
                  </View>
                </View>

                <View style={styles.serviceStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{service.averagePrice}</Text>
                    <Text style={styles.statLabel}>Average Rate</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={styles.statRow}>
                      <MapPin size={12} color="#6B7280" />
                      <Text style={styles.statValue}>{service.providers}</Text>
                    </View>
                    <Text style={styles.statLabel}>Providers</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={styles.statRow}>
                      <Clock size={12} color="#6B7280" />
                      <Text style={styles.statValue}>{service.responseTime}</Text>
                    </View>
                    <Text style={styles.statLabel}>Response</Text>
                  </View>
                </View>

                <View style={styles.serviceFooter}>
                  <View style={styles.availabilityBadge}>
                    <View style={styles.availabilityDot} />
                    <Text style={styles.availabilityText}>Available now</Text>
                  </View>
                  <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Service</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Our Platform?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitEmoji}>🛡️</Text>
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Verified Professionals</Text>
                <Text style={styles.benefitDescription}>All technicians are background checked and licensed</Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitEmoji}>💰</Text>
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Transparent Pricing</Text>
                <Text style={styles.benefitDescription}>Know the cost upfront with no hidden fees</Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitEmoji}>⚡</Text>
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Fast Response</Text>
                <Text style={styles.benefitDescription}>Get matched with available pros in minutes</Text>
              </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categories: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    marginRight: 6,
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  categoryChipCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    textAlign: 'center',
  },
  categoryChipCountSelected: {
    color: '#2563EB',
    backgroundColor: '#FFFFFF',
  },
  servicesList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  serviceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#92400E',
    marginLeft: 4,
  },
  serviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#111827',
    marginLeft: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  availabilityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#10B981',
  },
  bookButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  benefitsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitEmoji: {
    fontSize: 20,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  benefitDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
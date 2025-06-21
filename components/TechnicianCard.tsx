import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, MapPin, Clock, MessageCircle, Phone } from 'lucide-react-native';

interface Technician {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  distance: string;
  hourlyRate: number;
  avatar: string;
  responseTime: string;
  completedJobs?: number;
  verified?: boolean;
}

interface TechnicianCardProps {
  technician: Technician;
  onBook: () => void;
}

export function TechnicianCard({ technician, onBook }: TechnicianCardProps) {
  const formatSpecialties = (specialties: string[]) => {
    if (specialties.length <= 2) {
      return specialties.join(' • ');
    }
    return `${specialties.slice(0, 2).join(' • ')} +${specialties.length - 2}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: technician.avatar }} style={styles.avatar} />
          {technician.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{technician.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.rating}>{technician.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.specialties}>
            {formatSpecialties(technician.specialties)}
          </Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={12} color="#6B7280" />
              <Text style={styles.metaText}>{technician.distance}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={12} color="#6B7280" />
              <Text style={styles.metaText}>~{technician.responseTime}</Text>
            </View>
            {technician.completedJobs && (
              <View style={styles.metaItem}>
                <Text style={styles.metaText}>{technician.completedJobs} jobs</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.pricing}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Starting at</Text>
          <Text style={styles.price}>${technician.hourlyRate}/hr</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryButton}>
          <MessageCircle size={18} color="#6B7280" />
          <Text style={styles.secondaryButtonText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Phone size={18} color="#6B7280" />
          <Text style={styles.secondaryButtonText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.primaryButton} onPress={onBook}>
          <Text style={styles.primaryButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.highlights}>
        <View style={styles.highlightItem}>
          <View style={styles.highlightDot} />
          <Text style={styles.highlightText}>Same-day availability</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightDot} />
          <Text style={styles.highlightText}>Licensed & insured</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightDot} />
          <Text style={styles.highlightText}>Free estimates</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#92400E',
    marginLeft: 4,
  },
  specialties: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#2563EB',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  pricing: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  highlights: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    gap: 6,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  highlightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
});

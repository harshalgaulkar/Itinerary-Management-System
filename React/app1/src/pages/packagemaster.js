import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { packageAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function PackageMaster({ route, navigation }) {
  const { packageId } = route.params || {};
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId]);

  const fetchPackageDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await packageAPI.getById(packageId);
      setPackageData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch package details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookPackage = () => {
    // If user is not logged in, prompt to login
    if (!user) {
      Alert.alert('Login required', 'Please login to book this package');
      return;
    }
    // Navigate to the Booking screen and pass packageId
    navigation.navigate('Booking', { packageId });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !packageData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Package not found'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchPackageDetails}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {packageData.imageUrl && (
        <Image
          source={{ uri: packageData.imageUrl }}
          style={styles.headerImage}
        />
      )}

      <View style={styles.content}>
        <Text style={styles.packageName}>{packageData.name}</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.rating}>
            ⭐ {packageData.rating || 'N/A'} ({packageData.reviews || 0} reviews)
          </Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{packageData.duration} days</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>₹{packageData.price}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Destination</Text>
            <Text style={styles.detailValue}>{packageData.destination}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Available</Text>
            <Text style={styles.detailValue}>
              {packageData.availableSeats || 'N/A'} seats
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{packageData.description}</Text>
        </View>

        {packageData.itinerary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itinerary</Text>
            <Text style={styles.description}>{packageData.itinerary}</Text>
          </View>
        )}

        {packageData.inclusions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inclusions</Text>
            <Text style={styles.description}>{packageData.inclusions}</Text>
          </View>
        )}

        {packageData.exclusions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exclusions</Text>
            <Text style={styles.description}>{packageData.exclusions}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookPackage}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reviewsButton}
          onPress={() => navigation.navigate('Reviews', { packageId })}
        >
          <Text style={styles.reviewsButtonText}>View Reviews</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  content: {
    padding: 16,
    backgroundColor: '#fff',
  },
  packageName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ratingRow: {
    marginBottom: 15,
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  detailBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 21,
  },
  bookButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});

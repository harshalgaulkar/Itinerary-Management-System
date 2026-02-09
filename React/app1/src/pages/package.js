import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { packageAPI, packageDateAPI } from '../services/api';

export default function Package({ navigation, route }) {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, [route?.params?.destinationId]);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const destinationId = route?.params?.destinationId;
      let response;
      if (destinationId) {
        response = await packageAPI.getByDestination(destinationId);
      } else {
        response = await packageAPI.getAll();
      }

      if (response.success) {
        // Filter packages to show only those with available dates
        const allPackages = response.data || [];
        console.log('[Package] Fetched', allPackages.length, 'packages');
        
        // Check which packages have available dates
        const packagesWithDates = [];
        for (const pkg of allPackages) {
          try {
            const datesResponse = await packageDateAPI.getByPackageId(pkg.package_id || pkg.id);
            if (datesResponse.success && datesResponse.data && datesResponse.data.length > 0) {
              packagesWithDates.push(pkg);
              console.log('[Package] Package', pkg.package_id, '- has', datesResponse.data.length, 'dates');
            } else {
              console.log('[Package] Package', pkg.package_id, '- no dates available');
            }
          } catch (err) {
            console.log('[Package] Error checking dates for package', pkg.package_id, ':', err.message);
          }
        }
        
        console.log('[Package] Found', packagesWithDates.length, 'packages with available dates');
        setPackages(packagesWithDates);
        
        if (packagesWithDates.length === 0) {
          setError('No packages with available dates');
        }
      } else {
        setError(response.error || 'Failed to fetch packages');
        Alert.alert('Error', response.error || 'Failed to load packages');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch packages');
      Alert.alert('Error', err.message || 'Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPackageCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PackageDetails', { packageId: item.package_id })}
    >
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.packageName}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.base_price}</Text>
          <Text style={styles.duration}>{item.duration_days} days</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('PackageDetails', { packageId: item.package_id })}
        >
          <Text style={styles.bookButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Packages</Text>
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchPackages}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : packages.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No packages with available dates</Text>
          <Text style={styles.emptySubtext}>Check back soon for new tour dates</Text>
        </View>
      ) : (
        <FlatList
          data={packages}
          renderItem={renderPackageCard}
          keyExtractor={(item) => (item.package_id || item.id).toString()}
          contentContainerStyle={styles.listContent}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    boxShadow: Platform.OS === 'web' ? '0px 2px 4px rgba(0,0,0,0.1)' : undefined,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    padding: 12,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  duration: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
});

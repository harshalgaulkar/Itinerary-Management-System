import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function Profile({ navigation }) {
  const { user, sign_out } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('[Profile] Page mounted, user:', user);
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // No need to refresh - data comes from auth context
      console.log('[Profile] Refresh triggered, user data:', user);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              console.log('[Profile] Logout button pressed');
              const result = await sign_out();
              console.log('[Profile] Sign out result:', result);
              
              if (!result?.success) {
                console.log('[Profile] Logout failed:', result?.error);
                Alert.alert('Error', result?.error || 'Failed to logout');
              } else {
                console.log('[Profile] ✓ Logout successful! Navigation will automatically redirect...');
                // The RootNavigator will automatically handle the redirect
                // when userToken becomes null
              }
            } catch (err) {
              console.error('[Profile] Logout error:', err);
              Alert.alert('Error', err.message || 'Failed to logout');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const displayUser = user;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(displayUser.name || displayUser.email || 'U')[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.nameText}>{displayUser.name || 'User'}</Text>
        <Text style={styles.emailText}>{displayUser.email || 'No email'}</Text>
      </View>

      {/* User Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{displayUser.email || 'N/A'}</Text>
        </View>

        {displayUser.name && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{displayUser.name}</Text>
          </View>
        )}

        {displayUser.phone && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{displayUser.phone}</Text>
          </View>
        )}

        {displayUser.country && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Country:</Text>
            <Text style={styles.value}>{displayUser.country}</Text>
          </View>
        )}

        {displayUser.address && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{displayUser.address}</Text>
          </View>
        )}

        {displayUser.created_at && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Member Since:</Text>
            <Text style={styles.value}>
              {new Date(displayUser.created_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {/* Stats Section */}
      {(displayUser.bookingsCount !== undefined || displayUser.reviewsCount !== undefined) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          
          {displayUser.bookingsCount !== undefined && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Bookings</Text>
              <Text style={styles.statValue}>{displayUser.bookingsCount || 0}</Text>
            </View>
          )}

          {displayUser.reviewsCount !== undefined && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Reviews Written</Text>
              <Text style={styles.statValue}>{displayUser.reviewsCount || 0}</Text>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
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
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  profileHeader: {
    backgroundColor: '#007AFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

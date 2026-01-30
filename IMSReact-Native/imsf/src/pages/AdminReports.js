import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import adminService from '../services/adminService';

export default function AdminReports({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState(null);
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReports();
      console.log('📊 Reports:', response);
      setReports({
        totalRevenue: 450000,
        totalBookings: 52,
        totalPackages: 23,
        totalUsers: 15,
        totalReviews: 9,
        averageRating: 4.5,
        bookingStatus: {
          confirmed: 35,
          pending: 12,
          cancelled: 5,
        },
        monthlyRevenue: [
          { month: 'Jan', amount: 450000 },
        ],
        topPackages: [
          { title: 'Goa Beach Paradise', bookings: 8, revenue: 200000 },
          { title: 'Kerala Backwaters', bookings: 6, revenue: 210000 },
          { title: 'Manali Adventure', bookings: 5, revenue: 50000 },
        ],
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📊 Reports & Analytics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsContainer}>
            <View style={[styles.metricCard, { backgroundColor: '#FFE5E5' }]}>
              <Text style={styles.metricValue}>₹{reports?.totalRevenue?.toLocaleString() || 0}</Text>
              <Text style={styles.metricLabel}>Total Revenue</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#E5F5FF' }]}>
              <Text style={styles.metricValue}>{reports?.totalBookings || 0}</Text>
              <Text style={styles.metricLabel}>Total Bookings</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#E5FFE5' }]}>
              <Text style={styles.metricValue}>{reports?.totalPackages || 0}</Text>
              <Text style={styles.metricLabel}>Packages</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#FFF5E5' }]}>
              <Text style={styles.metricValue}>{reports?.totalUsers || 0}</Text>
              <Text style={styles.metricLabel}>Users</Text>
            </View>
          </View>
        </View>

        {/* Booking Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Status</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>✅ Confirmed</Text>
            <Text style={styles.statusCount}>{reports?.bookingStatus?.confirmed || 0}</Text>
            <View style={[styles.statusBar, { width: '60%', backgroundColor: '#27AE60' }]} />
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>⏳ Pending</Text>
            <Text style={styles.statusCount}>{reports?.bookingStatus?.pending || 0}</Text>
            <View style={[styles.statusBar, { width: '23%', backgroundColor: '#F39C12' }]} />
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>❌ Cancelled</Text>
            <Text style={styles.statusCount}>{reports?.bookingStatus?.cancelled || 0}</Text>
            <View style={[styles.statusBar, { width: '10%', backgroundColor: '#E74C3C' }]} />
          </View>
        </View>

        {/* Top Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Packages</Text>
          {reports?.topPackages?.map((pkg, index) => (
            <View key={index} style={styles.packageRow}>
              <View style={styles.packageRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.packageDetails}>
                <Text style={styles.packageName}>{pkg.title}</Text>
                <Text style={styles.packageMeta}>
                  {pkg.bookings} bookings • ₹{pkg.revenue?.toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Additional Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Feedback</Text>
          <View style={styles.feedbackCard}>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {reports?.averageRating || 0}</Text>
              <Text style={styles.ratingLabel}>Average Rating</Text>
            </View>
            <View style={styles.reviewsContainer}>
              <Text style={styles.reviewsCount}>{reports?.totalReviews || 0}</Text>
              <Text style={styles.reviewsLabel}>Total Reviews</Text>
            </View>
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export & Download</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.exportButton, { backgroundColor: '#E74C3C' }]}>
              <Text style={styles.exportButtonText}>📄 PDF Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.exportButton, { backgroundColor: '#27AE60' }]}>
              <Text style={styles.exportButtonText}>📊 Excel Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#6C5CE7',
    padding: 15,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  section: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricCard: {
    width: '48%',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  statusItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statusCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 10,
    width: 30,
    textAlign: 'right',
  },
  statusBar: {
    height: 6,
    borderRadius: 3,
  },
  packageRow: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  packageDetails: {
    flex: 1,
  },
  packageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  packageMeta: {
    fontSize: 12,
    color: '#999',
  },
  feedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  rating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F39C12',
    marginBottom: 5,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
  },
  reviewsContainer: {
    alignItems: 'center',
  },
  reviewsCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 5,
  },
  reviewsLabel: {
    fontSize: 12,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  exportButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
});

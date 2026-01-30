import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import packageMasterService from '../services/packageMasterService';
import authuser from '../utils/authuser';

// Simple Date Picker Component
const DatePicker = ({ onDateSelect, selectedDate, label }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;

      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.calendarDay, isSelected && styles.calendarDaySelected]}
          onPress={() => {
            onDateSelect(dateStr);
            setShowPicker(false);
          }}
        >
          <Text style={[styles.calendarDayText, isSelected && styles.calendarDayTextSelected]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <View style={styles.datePickerContainer}>
      <Text style={styles.datePickerLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={styles.datePickerButtonText}>{selectedDate || 'Select Date'}</Text>
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.calendarPickerModal}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity
              onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            >
              <Text style={styles.calendarNavButton}>◀ Previous</Text>
            </TouchableOpacity>
            <Text style={styles.calendarMonth}>{monthName}</Text>
            <TouchableOpacity
              onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            >
              <Text style={styles.calendarNavButton}>Next ▶</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calendarWeekHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {renderCalendar()}
          </View>

          <TouchableOpacity
            style={styles.calendarCloseButton}
            onPress={() => setShowPicker(false)}
          >
            <Text style={styles.calendarCloseButtonText}>Close Calendar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function PackageDateAdmin({ navigation }) {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageDates, setPackageDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDateId, setEditingDateId] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    seatsTotal: '',
    price: '',
  });
  const [calculatedDays, setCalculatedDays] = useState(0);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setCalculatedDays(diffDays);
    } else {
      setCalculatedDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  const checkAdminAndLoad = async () => {
    try {
      const admin = await authuser.isAdmin();
      setIsAdmin(admin);
      if (admin) {
        await loadPackages();
      } else {
        Alert.alert('Error', 'Admin access required');
        navigation.goBack();
      }
    } catch (error) {
      console.error('❌ Admin check error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const loadPackages = async () => {
    try {
      setLoading(true);
      console.log('📅 Loading packages...');
      const response = await packageMasterService.getAll();
      console.log('📅 Packages response:', response);
      
      if (response.success) {
        setPackages(response.data || []);
      } else {
        // Use mock data for demo
        console.warn('⚠️ Using mock package data');
        setPackages([
          { package_id: 1, title: 'Manali Adventure', duration_days: 5, base_price: 10000 },
          { package_id: 2, title: 'Goa Beach', duration_days: 3, base_price: 20000 },
          { package_id: 3, title: 'Wardha Heritage', duration_days: 4, base_price: 5000 },
        ]);
      }
    } catch (error) {
      console.error('❌ Error loading packages:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = async (pkg) => {
    try {
      setSelectedPackage(pkg);
      setLoading(true);
      console.log('📅 Loading dates for package:', pkg.package_id);
      
      // Fetch dates from API using the correct endpoint
      const dateResponse = await fetch(`http://10.64.205.48:4000/packageMaster/${pkg.package_id}/dates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📅 Dates API Status:', dateResponse.status);
      
      if (dateResponse.ok) {
        const data = await dateResponse.json();
        console.log('📅 Dates response:', data);
        
        // Extract data from response
        const dates = data.data || [];
        setPackageDates(dates);
        console.log('📅 Loaded', dates.length, 'dates for package');
      } else {
        setPackageDates([]);
        console.warn('⚠️ No dates found for package');
      }
    } catch (error) {
      console.error('❌ Error loading dates:', error);
      setPackageDates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDate = async () => {
    if (!formData.startDate || !formData.endDate || !formData.seatsTotal) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      Alert.alert('Error', 'Start date must be before end date');
      return;
    }

    try {
      const dateData = {
        start_date: formData.startDate,
        end_date: formData.endDate,
        seats_total: parseInt(formData.seatsTotal),
        price_override: formData.price ? parseFloat(formData.price) : null,
      };

      let response;
      if (editingDateId) {
        console.log('🔄 Updating date:', editingDateId, 'for package:', selectedPackage.package_id);
        response = await packageMasterService.updateDates(selectedPackage.package_id, editingDateId, dateData);
      } else {
        console.log('🔄 Adding new date for package:', selectedPackage.package_id);
        response = await packageMasterService.addDates(selectedPackage.package_id, dateData);
      }

      console.log('📅 Date response:', response);
      
      if (response.success) {
        Alert.alert('Success', editingDateId ? 'Date updated!' : 'Date added!');
        resetForm();
        setModalVisible(false);
        // Reload packages to refresh the dates list
        await loadPackages();
        if (selectedPackage) {
          setSelectedPackage({ ...selectedPackage });
        }
      } else {
        Alert.alert('Error', response.message || 'Failed to save date');
      }
    } catch (error) {
      console.error('❌ Error saving date:', error);
      Alert.alert('Error', error.message || 'An error occurred');
    }
  };

  const handleDeleteDate = (dateId) => {
    Alert.alert(
      'Delete Date',
      'Are you sure?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              console.log('🗑️ Deleting date:', dateId, 'from package:', selectedPackage.package_id);
              const response = await packageMasterService.deleteDates(selectedPackage.package_id, dateId);
              if (response.success) {
                Alert.alert('Success', 'Date deleted');
                // Reload packages to refresh the dates
                await loadPackages();
                setSelectedPackage(null);
              } else {
                Alert.alert('Error', response.message);
              }
            } catch (error) {
              console.error('Error deleting date:', error);
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const handleEditDate = (date) => {
    setEditingDateId(date.package_date_id);
    setFormData({
      startDate: date.start_date,
      endDate: date.end_date,
      seatsTotal: date.seats_total?.toString() || '',
      price: date.price_override?.toString() || '',
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      startDate: '',
      endDate: '',
      seatsTotal: '',
      price: '',
    });
    setCalculatedDays(0);
    setEditingDateId(null);
  };

  const renderDateItem = ({ item }) => (
    <View style={styles.dateCard}>
      <View style={styles.dateHeader}>
        <View>
          <Text style={styles.dateRange}>📅 {item.start_date} to {item.end_date}</Text>
          <Text style={styles.dateDetails}>
            {item.seats_total} seats • 
            {item.price_override ? `₹${item.price_override}` : 'Base price'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteDateButton}
          onPress={() => handleDeleteDate(item.package_date_id)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.editDateButton}
        onPress={() => handleEditDate(item)}
      >
        <Text style={styles.editDateButtonText}>✏️ Edit</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#45B7D1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Manage Package Dates</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Select a package and manage its departure dates</Text>
      </View>

      <Text style={styles.sectionTitle}>Packages</Text>
      <FlatList
        data={packages}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.packageItem,
              selectedPackage?.package_id === item.package_id && styles.packageItemSelected,
            ]}
            onPress={() => handleSelectPackage(item)}
          >
            <View style={styles.packageInfo}>
              <Text style={styles.packageName}>{item.title}</Text>
              <Text style={styles.packageDuration}>{item.duration_days} days • ₹{item.base_price}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.package_id?.toString()}
        scrollEnabled={false}
      />

      {selectedPackage && (
        <>
          <View style={styles.selectedPackageContainer}>
            <Text style={styles.selectedPackageTitle}>{selectedPackage.title} - Date Ranges</Text>
            <TouchableOpacity
              style={styles.addDateButton}
              onPress={() => {
                resetForm();
                setModalVisible(true);
              }}
            >
              <Text style={styles.addDateButtonText}>+ Add Date Range</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={packageDates}
            renderItem={renderDateItem}
            keyExtractor={(item) => item.package_date_id?.toString()}
            contentContainerStyle={styles.dateListContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No dates added yet. Click "Add Date Range" to create one.</Text>
            }
          />
        </>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>
              {editingDateId ? '✏️ Edit Date Range' : '➕ Add Date Range'}
            </Text>

            <View style={styles.datePickersContainer}>
              <DatePicker
                label="Start Date"
                selectedDate={formData.startDate}
                onDateSelect={(date) => setFormData({ ...formData, startDate: date })}
              />

              <DatePicker
                label="End Date"
                selectedDate={formData.endDate}
                onDateSelect={(date) => setFormData({ ...formData, endDate: date })}
              />
            </View>

            {calculatedDays > 0 && (
              <View style={styles.daysCalculated}>
                <Text style={styles.daysCalculatedText}>📊 Duration: {calculatedDays} Days</Text>
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="Total Available Seats"
              keyboardType="number-pad"
              value={formData.seatsTotal}
              onChangeText={(text) => setFormData({ ...formData, seatsTotal: text })}
            />

            <TextInput
              style={styles.input}
              placeholder={`Price Per Person (₹) - Default: ₹${selectedPackage?.base_price}`}
              keyboardType="decimal-pad"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  resetForm();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddDate}
              >
                <Text style={styles.buttonText}>{editingDateId ? 'Update' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#E0F7FF',
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#45B7D1',
  },
  infoText: {
    color: '#0277BD',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#333',
  },
  packageItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageItemSelected: {
    backgroundColor: '#E0F7FF',
    borderLeftWidth: 4,
    borderLeftColor: '#45B7D1',
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  packageDuration: {
    fontSize: 12,
    color: '#999',
  },
  arrow: {
    fontSize: 20,
    color: '#45B7D1',
  },
  selectedPackageContainer: {
    backgroundColor: '#45B7D1',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedPackageTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  addDateButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addDateButtonText: {
    color: '#45B7D1',
    fontSize: 12,
    fontWeight: '600',
  },
  dateListContent: {
    paddingBottom: 20,
  },
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#45B7D1',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateRange: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  dateDetails: {
    fontSize: 12,
    color: '#666',
  },
  deleteDateButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  editDateButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  editDateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#45B7D1',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  // Calendar Picker Styles
  datePickersContainer: {
    marginVertical: 15,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  datePickerButtonText: {
    fontSize: 14,
    color: '#333',
  },
  calendarPickerModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#45B7D1',
    padding: 15,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  calendarNavButton: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  calendarDayText: {
    fontSize: 13,
    color: '#333',
  },
  calendarDaySelected: {
    backgroundColor: '#45B7D1',
    borderRadius: 6,
  },
  calendarDayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  calendarCloseButton: {
    backgroundColor: '#45B7D1',
    paddingVertical: 12,
    alignItems: 'center',
    margin: 10,
    borderRadius: 8,
  },
  calendarCloseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  daysCalculated: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  daysCalculatedText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
  },
});

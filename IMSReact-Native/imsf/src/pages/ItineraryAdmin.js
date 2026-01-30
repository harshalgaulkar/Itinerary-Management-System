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
import packageItineraryService from '../services/packageItineraryService';

export default function ItineraryAdmin({ navigation }) {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    packageId: '',
    dayNumber: '',
    title: '',
    details: '',
  });

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      setLoading(true);
      console.log('🎯 Loading itineraries...');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItineraryItem = ({ item }) => (
    <View style={styles.itineraryItem}>
      <View style={styles.dayBadge}>
        <Text style={styles.dayNumber}>Day {item.day_number}</Text>
      </View>
      <View style={styles.itineraryInfo}>
        <Text style={styles.itineraryTitle}>{item.title}</Text>
        <Text style={styles.itineraryDetails} numberOfLines={2}>{item.details}</Text>
        <Text style={styles.packageId}>Package ID: {item.package_id}</Text>
      </View>
      <TouchableOpacity onPress={() => Alert.alert('Edit', 'Edit itinerary feature')}>
        <Text style={styles.editButton}>✏️</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎯 Manage Itineraries</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Create and manage day-by-day itineraries for packages</Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add New Itinerary Day</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Package Itineraries</Text>
      <FlatList
        data={itineraries}
        renderItem={renderItineraryItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No itineraries created yet</Text>
            <Text style={styles.emptySubtext}>Tap "Add New Itinerary Day" to get started</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Itinerary</Text>

            <TextInput
              style={styles.input}
              placeholder="Package ID"
              keyboardType="number-pad"
              value={formData.packageId}
              onChangeText={(text) => setFormData({ ...formData, packageId: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Day Number"
              keyboardType="number-pad"
              value={formData.dayNumber}
              onChangeText={(text) => setFormData({ ...formData, dayNumber: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Title (e.g., City Tour)"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Details/Description"
              multiline
              numberOfLines={5}
              value={formData.details}
              onChangeText={(text) => setFormData({ ...formData, details: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => {
                  Alert.alert('Success', 'Itinerary added successfully');
                  setModalVisible(false);
                  setFormData({
                    packageId: '',
                    dayNumber: '',
                    title: '',
                    details: '',
                  });
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#96CEB4',
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
  infoBox: {
    backgroundColor: '#E8F5E9',
    margin: 10,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#96CEB4',
  },
  infoText: {
    color: '#2E7D32',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  itineraryItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#96CEB4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itineraryInfo: {
    flex: 1,
  },
  itineraryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  itineraryDetails: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  packageId: {
    fontSize: 11,
    color: '#96CEB4',
    fontWeight: '600',
  },
  editButton: {
    fontSize: 18,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#96CEB4',
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#ccc',
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
    maxHeight: '80%',
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
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
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
    backgroundColor: '#96CEB4',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { packageAPI, bookingAPI, packageDateAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';

export default function Booking({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const bookingCtx = useContext(BookingContext);
  const packageId = route?.params?.packageId;

  console.log('[Booking] Page loaded. route.params:', route?.params);
  console.log('[Booking] Extracted packageId:', packageId);

  const [pkg, setPkg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateOptions, setDateOptions] = useState([]);
  const [selectedPackageDateId, setSelectedPackageDateId] = useState(null);
  const [guests, setGuests] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('[Booking] useEffect triggered, packageId:', packageId);
    if (packageId) {
      console.log('[Booking] Calling fetchPackage()');
      fetchPackage();
    } else {
      console.log('[Booking] ⚠️ packageId is missing!', { packageId });
      Alert.alert('Error', 'Package ID not found in route params');
    }
  }, [packageId]);

  const fetchPackage = async () => {
    try {
      setIsLoading(true);
      console.log('[Booking] fetchPackage called with packageId:', packageId);
      
      const resp = await packageAPI.getById(packageId);
      console.log('[Booking] packageAPI.getById response:', resp);
      
      if (resp.success) {
        setPkg(resp.data);
        console.log('[Booking] Package loaded:', resp.data.name);
      } else {
        Alert.alert('Error', resp.error || 'Failed to load package');
        return;
      }
      
      // Fetch available package dates from API
      try {
        console.log('[Booking] Fetching dates for packageId:', packageId);
        const datesResp = await packageDateAPI.getByPackageId(packageId);
        console.log('[Booking] Package dates response:', JSON.stringify(datesResp, null, 2));
        
        if (datesResp.success && Array.isArray(datesResp.data) && datesResp.data.length > 0) {
          console.log('[Booking] Found', datesResp.data.length, 'package dates');
          setDateOptions(datesResp.data);
          
          // Preselect first available date
          const firstDate = datesResp.data[0];
          const firstId = firstDate?.package_date_id || firstDate?.id || firstDate?.date_id;
          if (firstId != null) {
            console.log('[Booking] Presetting first date ID:', firstId);
            setSelectedPackageDateId(parseInt(String(firstId), 10));
            
            // Also pre-fill start date if available
            const startDateStr = firstDate?.start_date || firstDate?.date;
            if (startDateStr) {
              const dateOnly = startDateStr.split('T')[0];
              setStartDate(dateOnly);
              console.log('[Booking] Auto-selected first date:', dateOnly);
            }
          }
        } else {
          console.log('[Booking] No dates in response or not success:', datesResp);
          Alert.alert('Error', 'No dates available for this package');
        }
      } catch (e) {
        console.error('[Booking] Error fetching package dates:', e.message);
        Alert.alert('Error', 'Failed to load package dates: ' + e.message);
      }
    } catch (e) {
      console.error('[Booking] fetchPackage error:', e);
      Alert.alert('Error', e.message || 'Failed to load package');
    } finally {
      setIsLoading(false);
    }
  };

  const numericGuests = Math.max(1, parseInt(guests || '1', 10) || 1);

  const handleSubmit = async () => {
    console.log('[Booking] handleSubmit called');
    console.log('[Booking] User:', user);
    console.log('[Booking] Package:', pkg);
    console.log('[Booking] Guests:', numericGuests);
    console.log('[Booking] Start Date:', startDate);
    console.log('[Booking] All state - guests:', guests, 'startDate:', startDate, 'notes:', notes);
    
    if (!user) {
      Alert.alert('Login required', 'Please login to create a booking');
      return;
    }
    if (!pkg) {
      console.log('[Booking] No package data');
      return;
    }
    if (numericGuests > (pkg.availableSeats || pkg.max_people || 0)) {
      Alert.alert('Not enough seats', 'Selected number of guests exceeds availability');
      return;
    }
    if (!startDate) {
      Alert.alert('Missing date', 'Please select a start date by clicking one of the package dates above');
      return;
    }

    // Validate that a package_date is selected
    if (!selectedPackageDateId) {
      Alert.alert('Invalid date', 'Please select a date from the available package dates list above (the green buttons)');
      return;
    }

    // Verify the selected date matches the start date shown
    const selectedDateObj = dateOptions.find(d => {
      const id = d?.package_date_id || d?.id || d?.date_id;
      return String(id) === String(selectedPackageDateId);
    });

    if (selectedDateObj) {
      const dStart = (selectedDateObj.start_date || selectedDateObj.date || '').split('T')[0];
      if (dStart !== startDate) {
        console.log('[Booking] Warning: selected date', dStart, 'does not match start date input', startDate);
        // Update startDate to match selected date
        setStartDate(dStart);
      }
    }

    // derive endDate from duration if available
    let endDate = startDate;
    const duration = pkg.duration || pkg.duration_days || 0;
    try {
      if (duration) {
        const s = new Date(startDate);
        s.setDate(s.getDate() + Number(duration));
        endDate = s.toISOString().slice(0, 10);
      }
    } catch (e) {
      // keep startDate as endDate if parsing fails
    }

    const userId = user?.id || user?.user_id || user?.userId || user?.id_user;

    const pricePerGuest = Number(pkg.price || pkg.base_price || 0) || 0;
    const totalAmount = numericGuests * pricePerGuest;

    // Use the explicitly selected package_date_id
    let packageDateId = parseInt(String(selectedPackageDateId), 10);

    if (!packageDateId) {
      Alert.alert('Error', 'No available package dates found. Please try another package.');
      return;
    }

    const bookingData = {
      package_date_id: packageDateId,
      persons: numericGuests,
      total_price: totalAmount,
      contact_phone: (user?.phone || user?.mobile || '+919999999999'),
      notes: notes || '',
    };

    console.log('[Booking] Booking data being sent:', bookingData);

    try {
      setSubmitting(true);
      console.log('[Booking] ========== BOOKING SUBMISSION START ==========');
      console.log('[Booking] Calling bookingAPI.create with package_date_id:', packageDateId);
      const res = await bookingAPI.create(bookingData);
      
      console.log('[Booking] ========== API RESPONSE RECEIVED ==========');
      console.log('[Booking] Full API response:', JSON.stringify(res, null, 2));
      console.log('[Booking] Response.data.id:', res?.data?.id);
      console.log('[Booking] Response.data.bookingId:', res?.data?.bookingId);
      console.log('[Booking] Response keys:', Object.keys(res || {}));
      
      if (res && res.data) {
        console.log('[Booking] Response.data keys:', Object.keys(res.data));
      }
      
      if (res && res.success) {
        console.log('[Booking] SUCCESS! Booking created successfully');
        // bookingAPI.create returns bookingId directly
        const bookingId = res.bookingId;
        console.log('[Booking] Extracted bookingId:', bookingId);
        
        if (bookingId) {
          console.log('[Booking] Booking created successfully. bookingId:', bookingId);
          
          // Store booking ID in global context for Payments page
          if (bookingCtx) {
            console.log('[Booking] Storing bookingId in BookingContext');
            bookingCtx.setCurrentBooking(bookingId);
          }
          
          // Get the parent navigator
          const parent = navigation.getParent();
          console.log('[Booking] Parent navigator exists:', !!parent);
          console.log('[Booking] Navigation object type:', parent?.getState?.()?.type || 'unknown');
          
          // Show success alert with navigation to payments
          Alert.alert('Booking Confirmed', 'Your booking has been created successfully!\n\nBooking ID: ' + bookingId, [
            {
              text: 'Proceed to Payment',
              onPress: () => {
                console.log('[Booking] ========== NAVIGATION STARTING ==========');
                console.log('[Booking] Attempting navigation with parent:', !!parent);
                
                // Small delay to ensure alert is fully dismissed before navigation
                setTimeout(() => {
                  try {
                    console.log('[Booking] About to navigate with bookingId:', bookingId);
                    console.log('[Booking] Navigation params object:', { bookingId });
                    
                    if (parent) {
                      console.log('[Booking] Using parent.navigate() to go to Payments tab');
                      console.log('[Booking] Parent state:', parent.getState?.()?.routeNames);
                      
                      // Reset Payments stack to root before navigating with new params
                      parent.navigate('Payments', { 
                        screen: 'PaymentHome',
                        params: { 
                          bookingId: bookingId,
                          timestamp: Date.now()  // Add timestamp to force re-render
                        }
                      });
                      console.log('[Booking] ========== NAVIGATION CALL MADE ==========');
                    } else {
                      console.log('[Booking] Parent is null, trying direct navigation');
                      // Fallback: try direct navigation
                      navigation.navigate('Payments', { 
                        screen: 'PaymentHome',
                        params: { bookingId } 
                      });
                      console.log('[Booking] ========== FALLBACK NAVIGATION CALL MADE ==========');
                    }
                  } catch (navError) {
                    console.error('[Booking] Navigation error:', navError);
                    console.error('[Booking] Error message:', navError.message);
                    console.error('[Booking] Error stack:', navError.stack);
                    Alert.alert('Navigation Error', 'Failed to navigate to payments: ' + navError.message);
                  }
                }, 300);
              },
            },
            {
              text: 'Cancel',
              onPress: () => {
                console.log('[Booking] User cancelled navigation');
              },
              style: 'cancel',
            },
          ]);
        } else {
          console.log('[Booking] Booking created but no bookingId returned');
          Alert.alert('Success', 'Booking created! Please navigate to payments to complete payment.');
        }
      } else {
        console.log('[Booking] SUCCESS flag is FALSE or missing');
        console.log('[Booking] API returned error:', res?.error);
        Alert.alert('Error', res?.error || 'Failed to create booking');
      }
    } catch (e) {
      console.error('[Booking] ========== EXCEPTION CAUGHT ==========');
      console.error('[Booking] Exception:', e);
      console.error('[Booking] Error message:', e.message);
      console.error('[Booking] Error stack:', e.stack);
      Alert.alert('Error', e.message || 'Failed to create booking');
    } finally {
      console.log('[Booking] ========== BOOKING SUBMISSION END ==========');
      setSubmitting(false);
    }
  };

  if (isLoading) return (
    <View style={styles.centerContainer}><ActivityIndicator size="large" color="#007AFF"/></View>
  );

  if (!pkg) return (
    <View style={styles.centerContainer}><Text>No package selected</Text></View>
  );

  const pricePerGuest = Number(pkg.price || pkg.base_price || 0) || 0;
  const totalAmount = numericGuests * pricePerGuest;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding:16}}>
      <Text style={styles.title}>{pkg.name}</Text>
      <Text style={styles.sub}>Price per guest: ₹{pricePerGuest}</Text>
        <Text style={styles.title}>{pkg.title || pkg.name}</Text>
      <Text style={styles.sub}>Available seats: {pkg.availableSeats || pkg.max_people || 'N/A'}</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Number of Guests</Text>
        <TextInput
          keyboardType="number-pad"
          value={String(guests)}
          onChangeText={setGuests}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
        <Text style={{color: '#999', fontSize: 12, marginBottom: 8}}>dateOptions count: {dateOptions?.length || 0}</Text>
        {dateOptions && dateOptions.length > 0 ? (
          <View style={{marginTop:8, marginBottom:8}}>
            <Text style={{marginBottom:6, color:'#333', fontWeight: '600'}}>📅 Available Dates - Click to select:</Text>
            {dateOptions.map((d, idx) => {
              const id = d?.package_date_id ?? d?.id ?? d?.date_id ?? idx;
              const startDate = d?.start_date || d?.date || '';
              const endDate = d?.end_date || '';
              const label = startDate && endDate 
                ? `${startDate.split('T')[0]} to ${endDate.split('T')[0]}` 
                : (d?.date || d?.startDate || d?.label || d?.name || JSON.stringify(d).slice(0,40));
              const selected = String(selectedPackageDateId) === String(id);
              return (
                <TouchableOpacity key={idx} onPress={() => {
                  setSelectedPackageDateId(id);
                  const dStart = (d?.start_date || d?.date || '').split('T')[0];
                  setStartDate(dStart);
                  console.log('[Booking] Selected package date:', id, 'date:', dStart);
                }} style={{padding:10, backgroundColor: selected ? '#27ae60' : '#fff', borderRadius:6, borderWidth:2, borderColor:'#27ae60', marginBottom:8}}>
                  <Text style={{color: selected ? '#fff' : '#27ae60', fontWeight: selected ? '600' : '500', fontSize: 14}}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={{backgroundColor: '#ffe6e6', padding: 10, borderRadius: 6, marginBottom: 8}}>
            <Text style={{color: '#c00', fontWeight: '600'}}>⚠️ No dates available yet</Text>
            <Text style={{color: '#666', fontSize: 12, marginTop: 4}}>Dates are loading... If this persists, check console logs.</Text>
          </View>
        )}
        <TextInput
          key="startDateInput"
          value={startDate}
          onChangeText={(value) => {
            console.log('[Booking] Manual date input changed to:', value);
            setStartDate(value);
          }}
          placeholder="Will auto-fill when you select a date above"
          style={[styles.input, {backgroundColor: '#f9f9f9', color: '#999'}]}
          autoCapitalize="none"
          editable={false}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Notes / Requests</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, {height:80}]}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.bookButton} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.bookButtonText}>{submitting ? 'Booking...' : `Confirm & Pay ₹${totalAmount}`}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f5f5f5' },
  centerContainer: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:22, fontWeight:'700', marginBottom:6 },
  sub: { color:'#666', marginBottom:6 },
  field: { marginBottom:12 },
  label: { fontSize:13, color:'#333', marginBottom:6 },
  input: { backgroundColor:'#fff', padding:10, borderRadius:6, borderWidth:1, borderColor:'#e0e0e0' },
  bookButton: { backgroundColor:'#27ae60', paddingVertical:14, borderRadius:8, alignItems:'center', marginTop:10 },
  bookButtonText: { color:'#fff', fontSize:16, fontWeight:'600' },
});

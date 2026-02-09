import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { paymentAPI, bookingAPI } from '../services/api';
import storage from '../utils/storage';
import { BookingContext } from '../context/BookingContext';

export default function Payments({ route, navigation }) {
  const bookingCtx = useContext(BookingContext);
  
  console.log('[Payments] ========== PAGE LOADED ==========');
  console.log('[Payments] Full route object:', route);
  console.log('[Payments] route.params:', route?.params);
  console.log('[Payments] route.params?.bookingId:', route?.params?.bookingId);
  console.log('[Payments] BookingContext available:', !!bookingCtx);
  console.log('[Payments] BookingContext.currentBookingId:', bookingCtx?.currentBookingId);
  
  // Try to get bookingId from different possible locations
  let bookingId = null;
  
  if (route?.params?.bookingId) {
    bookingId = route.params.bookingId;
    console.log('[Payments] Got bookingId from route.params:', bookingId);
  } else if (route?.params) {
    // Check if bookingId is at any level in params
    console.log('[Payments] route.params keys:', Object.keys(route.params || {}));
    // Try to extract from nested structure
    bookingId = route.params.bookingId || route.params.params?.bookingId;
    if (bookingId) {
      console.log('[Payments] Got bookingId from nested params:', bookingId);
    }
  }
  
  // FALLBACK: Check BookingContext if route params didn't have bookingId
  if (!bookingId && bookingCtx?.currentBookingId) {
    bookingId = bookingCtx.currentBookingId;
    console.log('[Payments] 🔄 Got bookingId from BookingContext (fallback):', bookingId);
  }
  
  console.log('[Payments] Final bookingId:', bookingId);
  
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });
  const [processing, setProcessing] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    console.log('[Payments] useEffect triggered. bookingId:', bookingId);
    if (bookingId) {
      console.log('[Payments] Fetching booking details for bookingId:', bookingId);
      fetchBookingDetails();
    } else {
      console.log('[Payments] No bookingId provided — fetching pending payments for user');
      // Fetch pending payments for the logged-in user
      fetchPendingPayments();
    }
  }, [bookingId]);

  const fetchPendingPayments = async () => {
    try {
      setPendingLoading(true);
      setPendingError(null);
      setIsLoading(true);
      console.log('[Payments] Calling paymentAPI.getPaymentHistory() to get pending payments');
      const resp = await paymentAPI.getPaymentHistory();
      console.log('[Payments] payment history response:', resp);
      let payments = [];
      if (resp) {
        // axios response shape: resp.data may contain the payload
        payments = resp.data?.data || resp.data || resp.data?.data?.data || [];
      }
      // Normalize to array
      payments = Array.isArray(payments) ? payments : [];
      const pending = payments.filter(p => String(p.status).toLowerCase() === 'pending');
      setPendingPayments(pending);
      if (!pending || pending.length === 0) {
        setPendingError('No pending payments found');
      }
    } catch (err) {
      console.error('[Payments] Error fetching pending payments:', err);
      setPendingError(err.message || 'Failed to fetch payments');
    } finally {
      setPendingLoading(false);
      setIsLoading(false);
    }
  };

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('[Payments] Calling bookingAPI.getById(' + bookingId + ')');
      const response = await bookingAPI.getById(bookingId);
      
      console.log('[Payments] API Response:', response);
      if (response.success) {
        console.log('[Payments] ✅ Booking details loaded:', response.data);
        // Map API fields to component field names
        const mappedBooking = {
          ...response.data,
          packageName: response.data.package_title,
          travelDate: response.data.start_date ? response.data.start_date.split('T')[0] : '',
          numberOfTravelers: response.data.persons,
          totalAmount: response.data.total_price,
        };
        setBooking(mappedBooking);
      } else {
        console.error('[Payments] API returned error:', response.error);
        setError(response.error || 'Failed to fetch booking details');
      }
    } catch (err) {
      console.error('[Payments] Exception fetching booking details:', err);
      setError(err.message || 'Failed to fetch booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!validatePaymentData()) {
      Alert.alert('Error', 'Please fill in all payment details correctly');
      return;
    }

    try {
      setProcessing(true);
      const paymentData = {
        amount: booking.totalAmount,
        method: paymentMethod,
        ...(paymentMethod === 'card' && {
          cardNumber: cardData.cardNumber,
          cardholderName: cardData.cardholderName,
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
        }),
      };

      console.log('[Payments] Processing payment:', { bookingId, paymentData });
      
      const response = await paymentAPI.processPayment(bookingId, paymentData);
      console.log('[Payments] Payment response:', response);

      if (response.data && response.data.success) {
        const transactionId = response.data.data?.transactionId;
        console.log('[Payments] ✅ Payment successful! Transaction ID:', transactionId);
        
        Alert.alert('Payment Successful', `Transaction ID: ${transactionId}`, [
          { 
            text: 'OK', 
            onPress: () => {
              // Navigate to success page or home
              navigation.navigate('Home');
            }
          },
        ]);
      } else {
        const errorMsg = response.data?.message || response.data?.error || 'Payment could not be processed';
        Alert.alert('Payment Failed', errorMsg);
      }
    } catch (err) {
      console.error('[Payments] Payment error:', err);
      Alert.alert('Error', err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const fetchUPIQR = async () => {
    try {
      console.log('[Payments] Generating UPI QR for bookingId:', bookingId);
      
      // Generate a UPI string for the payment
      // Format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&tn=DESCRIPTION
      const upiId = 'harshalga@okaxis'; // Your UPI ID from the QR code shown
      const amount = booking.totalAmount;
      const description = `Booking ${bookingId}`;
      const recipientName = 'IMS Travel';
      
      // Create UPI URL string
      const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${amount}&tn=${encodeURIComponent(description)}`;
      
      console.log('[Payments] Generated UPI String:', upiString);
      
      // Display the UPI string as QR data
      setQrData(upiString);
      setQrVisible(true);
      
    } catch (err) {
      console.error('[Payments] Error generating UPI QR:', err);
      Alert.alert('Error', 'Failed to generate UPI QR: ' + err.message);
    }
  };

  const validatePaymentData = () => {
    if (paymentMethod === 'card') {
      return (
        cardData.cardNumber.length === 16 &&
        cardData.cardholderName.trim() &&
        cardData.expiryDate &&
        cardData.cvv.length === 3
      );
    }
    return true;
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If no bookingId was provided, show pending payments list
  if (!bookingId) {
    if (pendingLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    if (pendingError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{pendingError}</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container} contentContainerStyle={{padding:16}}>
        <View style={styles.header}>
          <Text style={styles.title}>Pending Payments</Text>
        </View>
        {pendingPayments && pendingPayments.length > 0 ? (
          pendingPayments.map((p, idx) => (
            <View key={idx} style={[styles.section, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
              <View>
                <Text style={{fontWeight: '600'}}>Booking ID: {p.booking_id}</Text>
                <Text style={{color: '#666'}}>Amount: ₹{p.amount}</Text>
                <Text style={{color: '#666'}}>Method: {p.method}</Text>
                <Text style={{color: '#999', fontSize: 12}}>Txn: {p.transaction_id || p.txn_reference || ''}</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={{backgroundColor: '#007AFF', paddingHorizontal:14, paddingVertical:8, borderRadius:6}}
                  onPress={() => {
                    // Navigate to same payments screen with bookingId so user can complete payment
                    try {
                      console.log('[Payments] Navigate to PaymentHome for booking:', p.booking_id);
                      const parent = navigation.getParent();
                      if (parent) {
                        parent.navigate('Payments', { screen: 'PaymentHome', params: { bookingId: p.booking_id } });
                      } else {
                        navigation.navigate('Payments', { screen: 'PaymentHome', params: { bookingId: p.booking_id } });
                      }
                    } catch (navErr) {
                      console.error('[Payments] Navigation error when paying pending:', navErr);
                    }
                  }}
                >
                  <Text style={{color: '#fff', fontWeight:'600'}}>Pay</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={{padding:20}}>
            <Text style={{color:'#666'}}>You have no pending payments.</Text>
          </View>
        )}
      </ScrollView>
    );
  }

  if (error || !booking) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Booking not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment</Text>
      </View>

      {/* Booking Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Package</Text>
          <Text style={styles.value}>{booking.packageName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Travel Date</Text>
          <Text style={styles.value}>{booking.travelDate}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Number of Travelers</Text>
          <Text style={styles.value}>{booking.numberOfTravelers}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{booking.totalAmount}</Text>
        </View>
      </View>

      {/* Payment Method Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentMethod === 'card' && styles.methodButtonActive,
          ]}
          onPress={() => setPaymentMethod('card')}
        >
          <Text
            style={[
              styles.methodText,
              paymentMethod === 'card' && styles.methodTextActive,
            ]}
          >
            Credit/Debit Card
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentMethod === 'upi' && styles.methodButtonActive,
          ]}
          onPress={() => {
            setPaymentMethod('upi');
            fetchUPIQR();
          }}
        >
          <Text
            style={[
              styles.methodText,
              paymentMethod === 'upi' && styles.methodTextActive,
            ]}
          >
            UPI
          </Text>
        </TouchableOpacity>
      </View>

      {/* Card Details Form */}
      {paymentMethod === 'card' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#999"
              value={cardData.cardNumber}
              onChangeText={(value) =>
                setCardData({ ...cardData, cardNumber: value.replace(/\D/g, '').slice(0, 16) })
              }
              keyboardType="numeric"
              maxLength={16}
              editable={!processing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name on Card"
              placeholderTextColor="#999"
              value={cardData.cardholderName}
              onChangeText={(value) =>
                setCardData({ ...cardData, cardholderName: value })
              }
              editable={!processing}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#999"
                value={cardData.expiryDate}
                onChangeText={(value) =>
                  setCardData({ ...cardData, expiryDate: value })
                }
                keyboardType="numeric"
                maxLength={5}
                editable={!processing}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#999"
                value={cardData.cvv}
                onChangeText={(value) =>
                  setCardData({ ...cardData, cvv: value.replace(/\D/g, '').slice(0, 3) })
                }
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                editable={!processing}
              />
            </View>
          </View>
        </View>
      )}

      {/* Payment Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.payButton, processing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay ₹{booking.totalAmount}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* QR Modal */}
      <Modal visible={qrVisible} transparent animationType="slide">
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.6)'}}>
          <View style={{width:'90%',backgroundColor:'#fff',padding:20,borderRadius:8,alignItems:'center'}}>
            <Text style={{fontSize:18,fontWeight:'600',marginBottom:12}}>Scan to Pay ₹{booking?.totalAmount}</Text>
            
            {/* QR Code Display */}
            <View style={{marginBottom:20,padding:16,backgroundColor:'#fff',borderRadius:8,borderWidth:1,borderColor:'#ddd',alignItems:'center'}}>
              <QRCode 
                value={typeof qrData === 'string' ? qrData : JSON.stringify(qrData)} 
                size={280}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </View>
            
            <Text style={{fontSize:12,color:'#999',marginBottom:16,textAlign:'center'}}>Scan this QR with any UPI app to complete payment</Text>
            <TouchableOpacity style={{backgroundColor:'#007AFF',paddingVertical:12,paddingHorizontal:30,borderRadius:6,width:'100%',alignItems:'center'}} onPress={() => { setQrVisible(false); }}>
              <Text style={{color:'#fff',fontWeight:'600'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  methodButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  methodButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f7ff',
  },
  methodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  methodTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  payButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
});

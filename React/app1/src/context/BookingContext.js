import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const bookingContext = {
    // Store the booking ID after creation
    setCurrentBooking: (bookingId, data = null) => {
      console.log('[BookingContext] Setting current booking. bookingId:', bookingId);
      setCurrentBookingId(bookingId);
      if (data) {
        setBookingData(data);
      }
    },
    
    // Get the current booking ID
    getCurrentBookingId: () => currentBookingId,
    
    // Get booking data
    getBookingData: () => bookingData,
    
    // Clear after payment
    clearBooking: () => {
      console.log('[BookingContext] Clearing current booking');
      setCurrentBookingId(null);
      setBookingData(null);
    },
    
    currentBookingId,
    bookingData,
  };

  return (
    <BookingContext.Provider value={bookingContext}>
      {children}
    </BookingContext.Provider>
  );
};

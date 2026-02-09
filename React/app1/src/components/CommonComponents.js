import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <View style={styles.container}>
    <View style={styles.spinner} />
    <Text style={styles.message}>{message}</Text>
  </View>
);

export const ErrorMessage = ({ message, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>⚠️ {message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const EmptyState = ({ message, icon = '📦' }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#007AFF',
    borderTopColor: 'transparent',
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffe0e0',
    borderRadius: 8,
    padding: 15,
    margin: 15,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

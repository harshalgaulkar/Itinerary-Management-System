import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * Custom Button Component
 */
export const Button = ({
  onPress,
  title,
  disabled = false,
  loading = false,
  style,
  variant = 'primary',
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'danger':
        return styles.dangerButton;
      case 'success':
        return styles.successButton;
      case 'secondary':
        return styles.secondaryButton;
      default:
        return styles.primaryButton;
    }
  };

  return (
    <TouchableOpacity
      style={[getVariantStyle(), disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * Custom Card Component
 */
export const Card = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

/**
 * Custom Alert Component
 */
export const Alert = ({ type = 'info', message, onDismiss }) => {
  const getAlertStyle = () => {
    switch (type) {
      case 'error':
        return styles.alertError;
      case 'success':
        return styles.alertSuccess;
      case 'warning':
        return styles.alertWarning;
      default:
        return styles.alertInfo;
    }
  };

  return (
    <View style={[styles.alert, getAlertStyle()]}>
      <Text style={styles.alertText}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss}>
          <Text style={styles.alertClose}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Custom Input Component
 */
export const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  error,
  ...props
}) => {
  return (
    <>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

/**
 * Custom Badge Component
 */
export const Badge = ({ label, variant = 'primary' }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'danger':
        return styles.badgeDanger;
      case 'success':
        return styles.badgeSuccess;
      case 'warning':
        return styles.badgeWarning;
      default:
        return styles.badgePrimary;
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle()]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
};

/**
 * Custom Loading Spinner
 */
export const LoadingSpinner = ({ size = 'large', color = '#007AFF' }) => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Button Styles
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  successButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  // Alert Styles
  alert: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertInfo: {
    backgroundColor: '#E3F2FD',
    borderLeftColor: '#2196F3',
    borderLeftWidth: 4,
  },
  alertSuccess: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: '#4CAF50',
    borderLeftWidth: 4,
  },
  alertWarning: {
    backgroundColor: '#FFF3E0',
    borderLeftColor: '#FF9800',
    borderLeftWidth: 4,
  },
  alertError: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#F44336',
    borderLeftWidth: 4,
  },
  alertText: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  alertClose: {
    color: '#999',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Input Styles
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginBottom: 10,
  },

  // Badge Styles
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgePrimary: {
    backgroundColor: '#007AFF',
  },
  badgeSuccess: {
    backgroundColor: '#4CAF50',
  },
  badgeWarning: {
    backgroundColor: '#FF9800',
  },
  badgeDanger: {
    backgroundColor: '#F44336',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Spinner Styles
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default {
  Button,
  Card,
  Alert,
  Input,
  Badge,
  LoadingSpinner,
};

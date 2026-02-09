import React, { useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function Splash({ navigation }) {
  const { userToken, isLoading } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userToken) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [userToken, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>IMS</Text>
          <Text style={styles.appSubtitle}>Inventory Management System</Text>
        </View>

        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.loader}
        />

        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  loader: {
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
});

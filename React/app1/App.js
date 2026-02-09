import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { BookingProvider } from './src/context/BookingContext';

// Pages
import Splash from './src/pages/splash';
import Login from './src/pages/login';
import Register from './src/pages/register';
import Package from './src/pages/package';
import PackageMaster from './src/pages/packagemaster';
import Destination from './src/pages/destination';
import Payments from './src/pages/payments';
import Reviews from './src/pages/reviews';
import Profile from './src/pages/profile';
import Booking from './src/pages/booking';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: 'white' },
    }}
  >
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ animationEnabled: false }}
    />
    <Stack.Screen
      name="Register"
      component={Register}
      options={{
        title: 'Create Account',
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerBackTitleVisible: false,
      headerTintColor: '#007AFF',
    }}
  >
    <Stack.Screen
      name="PackageHome"
      component={Package}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="PackageDetails"
      component={PackageMaster}
      options={{
        title: 'Package Details',
        headerBackTitle: 'Back',
      }}
    />
    <Stack.Screen
      name="Reviews"
      component={Reviews}
      options={{
        title: 'Reviews',
        headerBackTitle: 'Back',
      }}
    />
    <Stack.Screen
      name="Booking"
      component={Booking}
      options={{
        title: 'Book Package',
        headerBackTitle: 'Back',
      }}
    />
  </Stack.Navigator>
);

const DestinationStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerBackTitleVisible: false,
      headerTintColor: '#007AFF',
    }}
  >
    <Stack.Screen
      name="DestinationHome"
      component={Destination}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const PaymentStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerBackTitleVisible: false,
      headerTintColor: '#007AFF',
    }}
  >
    <Stack.Screen
      name="PaymentHome"
      component={Payments}
      options={{
        title: 'Make Payment',
        headerBackTitle: 'Back',
      }}
    />
  </Stack.Navigator>
);

const AppTabs = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{
              marginRight: 15,
              padding: 8,
              backgroundColor: '#007AFF',
              borderRadius: 50,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>👤</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen
        name="Packages"
        component={HomeStack}
        options={{
          tabBarLabel: 'Packages',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📦</Text>,
        }}
      />
      <Tab.Screen
        name="Destinations"
        component={DestinationStack}
        options={{
          tabBarLabel: 'Destinations',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗺️</Text>,
        }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentStack}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💳</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const navigationRef = React.useRef(null);

  React.useEffect(() => {
    console.log('[RootNavigator] userToken changed:', !!userToken);
    if (!userToken) {
      console.log('[RootNavigator] Token is null, preparing to switch to auth stack...');
      // Schedule navigation reset for next frame to ensure NavigationContainer is ready
      setTimeout(() => {
        if (navigationRef.current) {
          console.log('[RootNavigator] ✓ Resetting navigation to auth stack');
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } else {
          console.log('[RootNavigator] ✗ navigationRef not available yet');
        }
      }, 0);
    } else {
      console.log('[RootNavigator] ✓ User authenticated, switching to app stack');
    }
  }, [userToken]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer 
      ref={navigationRef}
      onReady={() => {
        console.log('[RootNavigator] NavigationContainer is ready');
      }}
    >
      {userToken ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AppTabs" component={AppTabs} />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              title: 'My Profile',
              headerShown: true,
              headerBackTitle: 'Back',
              headerTintColor: '#007AFF',
            }}
          />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </BookingProvider>
    </AuthProvider>
  );
}

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// We will create these screens shortly
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import DonorHomeScreen from '../screens/donor/DonorHomeScreen';
import ExploreScreen from '../screens/donor/ExploreScreen';
import DonationHistoryScreen from '../screens/donor/DonationHistoryScreen';
import DonorProfileScreen from '../screens/donor/DonorProfileScreen';
import CampaignDetailScreen from '../screens/donor/CampaignDetailScreen';
import MakeDonationScreen from '../screens/donor/MakeDonationScreen';
import DonationConfirmedScreen from '../screens/donor/DonationConfirmedScreen';
import NGODetailScreen from '../screens/donor/NGODetailScreen';

import ONGHomeScreen from '../screens/ong/ONGHomeScreen';
import NewCampaignScreen from '../screens/ong/NewCampaignScreen';
import ONGDonationHistoryScreen from '../screens/ong/ONGDonationHistoryScreen';
import ONGProfileScreen from '../screens/ong/ONGProfileScreen';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function DonorNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0f5238',
        tabBarInactiveTintColor: '#707973',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e1e3e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'home';
          if (route.name === 'DonorHome') iconName = 'home';
          else if (route.name === 'Explore') iconName = 'explore';
          else if (route.name === 'Donations') iconName = 'favorite';
          else if (route.name === 'Profile') iconName = 'person';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DonorHome" component={DonorHomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: 'Explorar' }} />
      <Tab.Screen name="Donations" component={DonationHistoryScreen} options={{ title: 'Histórico' }} />
      <Tab.Screen name="Profile" component={DonorProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

function ONGNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0f5238',
        tabBarInactiveTintColor: '#707973',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e1e3e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'home';
          if (route.name === 'ONGHome') iconName = 'home';
          else if (route.name === 'NewCampaign') iconName = 'add-circle';
          else if (route.name === 'Donations') iconName = 'favorite';
          else if (route.name === 'Profile') iconName = 'person';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="ONGHome" component={ONGHomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="NewCampaign" component={NewCampaignScreen} options={{ title: 'Nova Campanha' }} />
      <Tab.Screen name="Donations" component={ONGDonationHistoryScreen} options={{ title: 'Doações' }} />
      <Tab.Screen name="Profile" component={ONGProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { user, isLoading } = useContext(AuthContext);

  console.log('Navigation: isLoading =', isLoading, 'user =', !!user);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <ActivityIndicator size="large" color="#0f5238" />
      </View>
    );
  }

  try {
    return (
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {user == null ? (
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          ) : user.user_type === 'doador' ? (
            <>
              <RootStack.Screen name="DonorApp" component={DonorNavigator} />
              <RootStack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
              <RootStack.Screen name="MakeDonation" component={MakeDonationScreen} />
              <RootStack.Screen name="DonationConfirmed" component={DonationConfirmedScreen} />
              <RootStack.Screen name="NGODetail" component={NGODetailScreen} />
            </>
          ) : (
            <>
              <RootStack.Screen name="ONGApp" component={ONGNavigator} />
              <RootStack.Screen name="NewCampaign" component={NewCampaignScreen} />
              <RootStack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    );
  } catch (error) {
    console.error('Navigation Render Error:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="red" />
      </View>
    );
  }
}

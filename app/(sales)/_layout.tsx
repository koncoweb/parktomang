import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ios16Palette } from '@/constants/ios16TemplateStyles';

export default function SalesLayout() {
  const { profile } = useAuth();

  if (profile?.role !== 'sales') {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ios16Palette.accentBlue,
        tabBarInactiveTintColor: ios16Palette.textTertiaryLight,
        tabBarStyle: {
          backgroundColor: ios16Palette.backgroundLight,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: ios16Palette.borderLight,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="customers" 
        options={{ 
          title: 'Pelanggan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="invoices" 
        options={{ 
          title: 'Tagihan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="commissions" 
        options={{ 
          title: 'Komisi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}


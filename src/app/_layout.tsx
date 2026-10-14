import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../theme';

// Expo Router створює нижню панель навігації зі сторінок у цій теці.
export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: colors.border, paddingTop: 5 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Огляд',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 19 }}>⌂</Text>,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Камера',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>▣</Text>,
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: 'GPS',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⌖</Text>,
        }}
      />
      <Tabs.Screen
        name="phone"
        options={{
          title: 'Телефон',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>☎</Text>,
        }}
      />
      <Tabs.Screen
        name="sensors"
        options={{
          title: 'Датчики',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 19 }}>⌁</Text>,
        }}
      />
      <Tabs.Screen
        name="battery"
        options={{
          title: 'Батарея',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>▰</Text>,
        }}
      />
      <Tabs.Screen
        name="clipboard"
        options={{
          title: 'Буфер',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>▤</Text>,
        }}
      />
    </Tabs>
  );
}

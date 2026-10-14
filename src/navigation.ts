import type { Href } from 'expo-router';
import type { TabKey } from './types';

// Єдине зіставлення ідентифікаторів екранів і маршрутів Expo Router.
export const routeForTab: Record<TabKey, Href> = {
  home: '/',
  camera: '/camera',
  location: '/location',
  phone: '/phone',
  sensors: '/sensors',
  battery: '/battery',
  clipboard: '/clipboard',
};

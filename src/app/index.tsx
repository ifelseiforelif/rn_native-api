import { router } from 'expo-router';
import { HomeScreen } from '../screens/HomeScreen';
import { routeForTab } from '../navigation';

export default function HomeRoute() {
  return <HomeScreen onNavigate={(screen) => router.push(routeForTab[screen])} />;
}

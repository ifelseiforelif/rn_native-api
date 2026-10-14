import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import type { LocationObject } from 'expo-location';
import { ActionButton, ErrorMessage, InfoCard, ScreenLayout, StatusLine } from '../components/ui';
import { colors } from '../theme';

export function LocationScreen() {
  const [position, setPosition] = useState<LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Геолокацію запитуємо тільки після натискання, з мінімально потрібним дозволом.
  const findPosition = async () => {
    setLoading(true);
    setError(null);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setError('Доступ до геолокації не надано. Без дозволу координати недоступні.');
        return;
      }
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setError('Служби геолокації вимкнені. Увімкніть GPS у налаштуваннях пристрою.');
        return;
      }
      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setPosition(currentPosition);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не вдалося визначити координати.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout
      icon="⌖"
      title="GPS і геолокація"
      description="Одноразове визначення координат із точністю та висотою."
    >
      <InfoCard>
        <Text style={styles.cardTitle}>Визначення місця</Text>
        <Text style={styles.bodyText}>
          Використовуємо доступ лише «під час роботи застосунку». Для навчального прикладу фонова геолокація не потрібна.
        </Text>
        <ActionButton
          disabled={loading}
          icon="⌖"
          label={loading ? 'Шукаємо супутники…' : 'Визначити координати'}
          onPress={findPosition}
        />
        {loading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
      </InfoCard>

      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      {position ? (
        <InfoCard>
          <Text style={styles.cardTitle}>Результат GPS</Text>
          <StatusLine label="Широта" value={position.coords.latitude.toFixed(6)} />
          <StatusLine label="Довгота" value={position.coords.longitude.toFixed(6)} />
          <StatusLine
            label="Точність"
            value={position.coords.accuracy == null ? 'Невідома' : `±${Math.round(position.coords.accuracy)} м`}
          />
          <StatusLine
            label="Висота"
            value={position.coords.altitude == null ? 'Недоступна' : `${Math.round(position.coords.altitude)} м`}
          />
          <Text style={styles.timestamp}>Отримано: {new Date(position.timestamp).toLocaleTimeString()}</Text>
        </InfoCard>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.ink, fontSize: 15, fontWeight: '700', marginBottom: 7 },
  bodyText: { color: colors.muted, fontSize: 13, lineHeight: 19, marginBottom: 14 },
  loader: { marginTop: 12 },
  timestamp: { color: colors.muted, fontSize: 11, marginTop: 10 },
});

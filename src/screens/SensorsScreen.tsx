import { useEffect, useState } from 'react';
import { Accelerometer, type AccelerometerMeasurement } from 'expo-sensors';
import { StyleSheet, Text, View } from 'react-native';
import { InfoCard, ScreenLayout, StatusLine } from '../components/ui';
import { colors } from '../theme';

export function SensorsScreen() {
  const [measurement, setMeasurement] = useState<AccelerometerMeasurement | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Підписка на акселерометр діє лише поки цей екран змонтований.
  useEffect(() => {
    let mounted = true;
    let subscription: ReturnType<typeof Accelerometer.addListener> | undefined;

    const startSensor = async () => {
      try {
        const sensorAvailable = await Accelerometer.isAvailableAsync();
        if (!mounted) return;
        setAvailable(sensorAvailable);
        if (!sensorAvailable) return;
        Accelerometer.setUpdateInterval(500);
        subscription = Accelerometer.addListener((data) => setMeasurement(data));
      } catch (caughtError) {
        if (mounted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Не вдалося запустити акселерометр.');
        }
      }
    };

    void startSensor();
    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  return (
    <ScreenLayout
      icon="⌁"
      title="Датчики руху"
      description="Поточні значення акселерометра по трьох осях."
    >
      <InfoCard>
        <Text style={styles.cardTitle}>Акселерометр</Text>
        <Text style={styles.bodyText}>
          Значення нормалізовані відносно сили тяжіння. Перевертайте пристрій і спостерігайте за змінами.
        </Text>
        {available === null ? <Text style={styles.status}>Перевіряємо наявність сенсора…</Text> : null}
        {available === false ? <Text style={styles.status}>На цьому пристрої акселерометр недоступний.</Text> : null}
        {available && measurement ? (
          <>
            <AxisBars measurement={measurement} />
            <StatusLine label="Вісь X" value={measurement.x.toFixed(3)} />
            <StatusLine label="Вісь Y" value={measurement.y.toFixed(3)} />
            <StatusLine label="Вісь Z" value={measurement.z.toFixed(3)} />
          </>
        ) : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </InfoCard>
      <InfoCard style={styles.hint}>
        <Text style={styles.hintTitle}>Ідея для заняття</Text>
        <Text style={styles.bodyText}>
          Обчисліть сумарне прискорення: √(x² + y² + z²). У спокої воно приблизно дорівнює 1 g.
        </Text>
      </InfoCard>
    </ScreenLayout>
  );
}

function AxisBars({ measurement }: { measurement: AccelerometerMeasurement }) {
  const axes = [
    { name: 'X', value: measurement.x, color: colors.primary },
    { name: 'Y', value: measurement.y, color: colors.success },
    { name: 'Z', value: measurement.z, color: '#D27A14' },
  ];

  return (
    <View style={styles.bars}>
      {axes.map((axis) => (
        <View key={axis.name} style={styles.axisRow}>
          <Text style={styles.axisName}>{axis.name}</Text>
          <View style={styles.track}>
            <View
              style={[
                styles.bar,
                { backgroundColor: axis.color, width: `${Math.min(Math.abs(axis.value), 1) * 100}%` },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.ink, fontSize: 15, fontWeight: '700', marginBottom: 5 },
  bodyText: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  status: { color: colors.muted, fontSize: 13, paddingVertical: 15 },
  bars: { gap: 9, marginTop: 16, marginBottom: 10 },
  axisRow: { alignItems: 'center', flexDirection: 'row', gap: 9 },
  axisName: { color: colors.muted, fontSize: 11, fontWeight: '700', width: 13 },
  track: { backgroundColor: colors.background, borderRadius: 4, flex: 1, height: 8, overflow: 'hidden' },
  bar: { borderRadius: 4, height: '100%' },
  error: { color: colors.danger, fontSize: 13, marginTop: 8 },
  hint: { backgroundColor: colors.paleBlue, borderColor: colors.paleBlue },
  hintTitle: { color: colors.primary, fontSize: 13, fontWeight: '700', marginBottom: 6 },
});

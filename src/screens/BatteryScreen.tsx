import { useEffect, useState } from 'react';
import * as Battery from 'expo-battery';
import { StyleSheet, Text, View } from 'react-native';
import { ErrorMessage, InfoCard, ScreenLayout, StatusLine } from '../components/ui';
import { colors } from '../theme';

function describeBatteryState(state: Battery.BatteryState) {
  switch (state) {
    case Battery.BatteryState.CHARGING:
      return 'Заряджається';
    case Battery.BatteryState.FULL:
      return 'Повністю заряджена';
    case Battery.BatteryState.UNPLUGGED:
      return 'Не під’єднана до живлення';
    case Battery.BatteryState.UNKNOWN:
    default:
      return 'Невідомий стан';
  }
}

export function BatteryScreen() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryState, setBatteryState] = useState<Battery.BatteryState | null>(null);
  const [lowPowerMode, setLowPowerMode] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Зчитуємо поточний стан один раз і оновлюємо його системними подіями.
  useEffect(() => {
    let mounted = true;
    const levelSubscription = Battery.addBatteryLevelListener(({ batteryLevel: level }) => setBatteryLevel(level));
    const stateSubscription = Battery.addBatteryStateListener(({ batteryState: state }) => setBatteryState(state));
    const powerSubscription = Battery.addLowPowerModeListener(({ lowPowerMode: enabled }) => setLowPowerMode(enabled));

    const loadBattery = async () => {
      try {
        const state = await Battery.getPowerStateAsync();
        if (!mounted) return;
        setBatteryLevel(state.batteryLevel);
        setBatteryState(state.batteryState);
        setLowPowerMode(state.lowPowerMode);
      } catch (caughtError) {
        if (mounted) setError(caughtError instanceof Error ? caughtError.message : 'Не вдалося прочитати стан батареї.');
      }
    };

    void loadBattery();
    return () => {
      mounted = false;
      levelSubscription.remove();
      stateSubscription.remove();
      powerSubscription.remove();
    };
  }, []);

  const percentage = batteryLevel == null || batteryLevel < 0 ? null : Math.round(batteryLevel * 100);

  return (
    <ScreenLayout
      icon="▰"
      title="Батарея"
      description="Рівень заряду, підключення до живлення та енергозбереження."
    >
      <InfoCard>
        <Text style={styles.cardTitle}>Стан живлення</Text>
        <View style={styles.gauge}>
          <View
            style={[
              styles.gaugeFill,
              percentage == null ? styles.emptyGauge : null,
              percentage != null ? { width: `${percentage}%` } : null,
            ]}
          />
        </View>
        <Text style={styles.percentage}>{percentage == null ? 'Недоступно' : `${percentage}%`}</Text>
        <StatusLine label="Стан" value={batteryState == null ? 'Завантаження…' : describeBatteryState(batteryState)} />
        <StatusLine
          label="Режим енергозбереження"
          value={lowPowerMode == null ? 'Завантаження…' : lowPowerMode ? 'Увімкнений' : 'Вимкнений'}
        />
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      </InfoCard>
      <InfoCard style={styles.note}>
        <Text style={styles.noteTitle}>Події без опитування</Text>
        <Text style={styles.noteText}>
          Рівень і стан оновлюються підписками на системні події. При виході з екрана всі підписки знімаються.
        </Text>
      </InfoCard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  gauge: { backgroundColor: colors.background, borderRadius: 8, height: 15, marginTop: 18, overflow: 'hidden' },
  gaugeFill: { backgroundColor: colors.success, borderRadius: 8, height: '100%' },
  emptyGauge: { backgroundColor: colors.border, width: '100%' },
  percentage: { color: colors.ink, fontSize: 28, fontWeight: '800', marginTop: 8 },
  note: { backgroundColor: colors.paleGreen, borderColor: colors.paleGreen },
  noteTitle: { color: colors.success, fontSize: 13, fontWeight: '700', marginBottom: 5 },
  noteText: { color: colors.ink, fontSize: 12, lineHeight: 18 },
});

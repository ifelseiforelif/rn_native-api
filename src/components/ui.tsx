import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

type ScreenLayoutProps = PropsWithChildren<{
  title: string;
  description: string;
  icon: string;
}>;

// Спільний каркас екрана: заголовок, пояснення для уроку й прокручуваний вміст.
export function ScreenLayout({ title, description, icon, children }: ScreenLayoutProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.screenHeading}>
          <View style={styles.screenIcon}>
            <Text style={styles.screenIconText}>{icon}</Text>
          </View>
          <View style={styles.screenHeadingText}>
            <Text style={styles.screenTitle}>{title}</Text>
            <Text style={styles.screenDescription}>{description}</Text>
          </View>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function InfoCard({ children, style }: PropsWithChildren<{ style?: object }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: string;
};

// Кнопка має один вигляд на всіх екранах і передає дію через типізований onPress.
export function ActionButton({ label, onPress, secondary = false, disabled = false, icon }: ActionButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, secondary && styles.secondaryButton, disabled && styles.disabledButton]}
    >
      {icon ? <Text style={[styles.buttonIcon, secondary && styles.secondaryButtonText]}>{icon}</Text> : null}
      <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SectionTitle({ children }: PropsWithChildren) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function ErrorMessage({ children }: PropsWithChildren) {
  return <Text accessibilityRole="alert" style={styles.error}>{children}</Text>;
}

export function StatusLine({ label, value, accessory }: { label: string; value: string; accessory?: ReactNode }) {
  return (
    <View style={styles.statusLine}>
      <Text style={styles.statusLabel}>{label}</Text>
      <View style={styles.statusValueRow}>
        <Text style={styles.statusValue}>{value}</Text>
        {accessory}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  screen: { gap: 14, paddingHorizontal: 18, paddingTop: 4, paddingBottom: 24 },
  screenHeading: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, marginBottom: 2 },
  screenIcon: {
    alignItems: 'center',
    backgroundColor: colors.paleBlue,
    borderRadius: 15,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  screenIconText: { color: colors.primary, fontSize: 23, fontWeight: '700' },
  screenHeadingText: { flex: 1, paddingTop: 1 },
  screenTitle: { color: colors.ink, fontSize: 20, fontWeight: '800' },
  screenDescription: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 3 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  buttonIcon: { color: '#FFFFFF', fontSize: 16, marginRight: 8 },
  secondaryButton: { backgroundColor: colors.paleBlue },
  secondaryButtonText: { color: colors.primary },
  disabledButton: { opacity: 0.5 },
  sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: '700', marginBottom: 10 },
  error: { color: colors.danger, fontSize: 13, lineHeight: 19, marginTop: 8 },
  statusLine: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  statusLabel: { color: colors.muted, fontSize: 13 },
  statusValueRow: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  statusValue: { color: colors.ink, fontSize: 13, fontWeight: '700', textAlign: 'right' },
});

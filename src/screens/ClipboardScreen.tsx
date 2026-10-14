import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ActionButton, ErrorMessage, InfoCard, ScreenLayout } from '../components/ui';
import { colors } from '../theme';

export function ClipboardScreen() {
  const [text, setText] = useState('Привіт із React Native!');
  const [clipboardText, setClipboardText] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const copyText = async () => {
    try {
      await Clipboard.setStringAsync(text);
      setMessage('Текст скопійовано. Тепер його можна вставити в іншу програму.');
      setClipboardText(null);
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не вдалося скопіювати текст.');
    }
  };

  // Читаємо буфер лише після явної дії, адже там може бути приватний текст.
  const readClipboard = async () => {
    try {
      const value = await Clipboard.getStringAsync();
      setClipboardText(value);
      setMessage(null);
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не вдалося прочитати буфер обміну.');
    }
  };

  return (
    <ScreenLayout
      icon="▤"
      title="Буфер обміну"
      description="Копіювання та явне читання тексту між застосунками."
    >
      <InfoCard>
        <Text style={styles.cardTitle}>Текст для копіювання</Text>
        <TextInput
          accessibilityLabel="Текст для копіювання"
          multiline
          onChangeText={setText}
          style={styles.input}
          value={text}
        />
        <ActionButton icon="▣" label="Скопіювати текст" onPress={copyText} />
        {message ? <Text style={styles.success}>{message}</Text> : null}
      </InfoCard>

      <InfoCard>
        <Text style={styles.cardTitle}>Прочитати буфер</Text>
        <Text style={styles.bodyText}>
          Застосунок покаже вміст буфера тільки після натискання цієї кнопки.
        </Text>
        <ActionButton icon="↧" label="Прочитати буфер обміну" onPress={readClipboard} secondary />
        {clipboardText !== null ? (
          <Text selectable style={styles.clipboardResult}>
            {clipboardText || 'Буфер обміну порожній.'}
          </Text>
        ) : null}
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      </InfoCard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.ink, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  bodyText: { color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 13 },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 14,
    minHeight: 84,
    marginBottom: 11,
    padding: 12,
    textAlignVertical: 'top',
  },
  success: { color: colors.success, fontSize: 12, lineHeight: 18, marginTop: 10 },
  clipboardResult: {
    backgroundColor: colors.background,
    borderRadius: 10,
    color: colors.ink,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
    padding: 12,
  },
});

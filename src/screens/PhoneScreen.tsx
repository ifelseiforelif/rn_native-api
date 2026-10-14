import { useState } from 'react';
import { Linking, StyleSheet, Text, TextInput, View } from 'react-native';
import { Contact, ContactField, ContactsSortOrder, requestPermissionsAsync } from 'expo-contacts';
import { ActionButton, ErrorMessage, InfoCard, ScreenLayout, SectionTitle } from '../components/ui';
import { colors } from '../theme';

type PickedContact = {
  name: string;
  phone: string | null;
};

export function PhoneScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pickedContact, setPickedContact] = useState<PickedContact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  // Перевіряємо номер перед тим, як передати його системному застосунку телефону.
  const getDialableNumber = () => {
    const normalized = phoneNumber.trim().replace(/[^\d+]/g, '');
    if (!/^\+?\d{3,15}$/.test(normalized)) {
      setError('Введіть номер із 3–15 цифр; на початку можна вказати +.');
      return null;
    }
    setError(null);
    return normalized;
  };

  // tel: відкриває системний номеронабирач із підставленим номером, але не телефонує самостійно.
  const openDialer = async () => {
    const number = getDialableNumber();
    if (!number) return;
    try {
      await Linking.openURL(`tel:${number}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не вдалося відкрити номеронабирач.');
    }
  };

  const openMessages = async () => {
    const number = getDialableNumber();
    if (!number) return;
    try {
      await Linking.openURL(`sms:${number}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не вдалося відкрити застосунок повідомлень.');
    }
  };

  // Запитуємо лише ім'я та телефон, необхідні для цього прикладу.
  const chooseContact = async () => {
    setContactError(null);
    try {
      const permission = await requestPermissionsAsync();
      if (!permission.granted) {
        setContactError('Доступ до контактів не надано.');
        return;
      }
      const [contact] = await Contact.getAllDetails(
        [ContactField.FULL_NAME, ContactField.PHONES],
        { limit: 1, sortOrder: ContactsSortOrder.GivenName },
      );
      if (!contact) {
        setContactError('У телефонній книзі не знайдено контактів.');
        return;
      }
      setPickedContact({ name: contact.fullName ?? 'Контакт без імені', phone: contact.phones?.[0]?.number ?? null });
      if (contact.phones?.[0]?.number) setPhoneNumber(contact.phones[0].number);
    } catch (caughtError) {
      setContactError(caughtError instanceof Error ? caughtError.message : 'Не вдалося прочитати контакти.');
    }
  };

  return (
    <ScreenLayout
      icon="☎"
      title="Телефон і контакти"
      description="Системні посилання для дзвінка чи SMS та вибіркове читання контактів."
    >
      <InfoCard>
        <Text style={styles.cardTitle}>Відкрити системний номеронабирач</Text>
        <Text style={styles.bodyText}>
          Застосунок не телефонує самостійно: номер передається системі, а користувач підтверджує дію.
        </Text>
        <TextInput
          accessibilityLabel="Номер телефону"
          keyboardType="phone-pad"
          onChangeText={setPhoneNumber}
          placeholder="+380 00 000 00 00"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={phoneNumber}
        />
        <View style={styles.buttonRow}>
          <View style={styles.buttonCell}><ActionButton icon="☎" label="Набрати" onPress={openDialer} /></View>
          <View style={styles.buttonCell}><ActionButton icon="✉" label="SMS" onPress={openMessages} secondary /></View>
        </View>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      </InfoCard>

      <InfoCard>
        <SectionTitle>Телефонна книга</SectionTitle>
        <Text style={styles.bodyText}>
          Для демонстрації читається мінімум полів: ім&apos;я та один номер першого контакту.
        </Text>
        <ActionButton icon="☷" label="Надати доступ і прочитати контакт" onPress={chooseContact} secondary />
        {contactError ? <ErrorMessage>{contactError}</ErrorMessage> : null}
        {pickedContact ? (
          <View style={styles.contactResult}>
            <Text style={styles.contactName}>{pickedContact.name}</Text>
            <Text style={styles.contactPhone}>{pickedContact.phone ?? 'Номер телефону відсутній'}</Text>
          </View>
        ) : null}
      </InfoCard>

      <InfoCard style={styles.privacyCard}>
        <Text style={styles.privacyTitle}>Про доступ до дзвінків</Text>
        <Text style={styles.bodyText}>
          Журнал дзвінків не читаємо: ця можливість обмежена політиками платформ і не потрібна для прикладу.
        </Text>
      </InfoCard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.ink, fontSize: 15, fontWeight: '700', marginBottom: 6 },
  bodyText: { color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 12 },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    marginBottom: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  buttonRow: { flexDirection: 'row', gap: 9 },
  buttonCell: { flex: 1 },
  contactResult: { backgroundColor: colors.paleGreen, borderRadius: 12, marginTop: 13, padding: 12 },
  contactName: { color: colors.success, fontSize: 14, fontWeight: '700' },
  contactPhone: { color: colors.ink, fontSize: 12, marginTop: 3 },
  privacyCard: { backgroundColor: colors.paleOrange, borderColor: colors.paleOrange },
  privacyTitle: { color: colors.warning, fontSize: 13, fontWeight: '700', marginBottom: 6 },
});

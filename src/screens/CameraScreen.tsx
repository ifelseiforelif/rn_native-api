import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ActionButton, ErrorMessage, InfoCard, ScreenLayout } from '../components/ui';
import { colors } from '../theme';

export function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [takingPhoto, setTakingPhoto] = useState(false);

  // Камера вмикається лише після згоди користувача й натискання кнопки знімка.
  const takePhoto = async () => {
    setError(null);
    setTakingPhoto(true);
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) setPhotoUri(photo.uri);
      else setError('Камера не повернула знімок. Спробуйте ще раз.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не вдалося зробити знімок.');
    } finally {
      setTakingPhoto(false);
    }
  };

  return (
    <ScreenLayout
      icon="▣"
      title="Камера"
      description="Запит дозволу, попередній перегляд і створення фото."
    >
      {!permission?.granted ? (
        <InfoCard>
          <Text style={styles.cardTitle}>Потрібен дозвіл на камеру</Text>
          <Text style={styles.bodyText}>
            API повертає статус дозволу. Після згоди застосунок відкриє попередній перегляд камери.
          </Text>
          <ActionButton label="Надати доступ до камери" icon="▣" onPress={requestPermission} />
        </InfoCard>
      ) : (
        <>
          <View style={styles.cameraFrame}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />
            <View style={styles.cameraLabel}><Text style={styles.cameraLabelText}>ПОПЕРЕДНІЙ ПЕРЕГЛЯД</Text></View>
          </View>
          <ActionButton
            disabled={takingPhoto}
            label={takingPhoto ? 'Зберігаємо фото…' : 'Зробити знімок'}
            icon="◉"
            onPress={takePhoto}
          />
        </>
      )}

      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      {photoUri ? (
        <InfoCard>
          <Text style={styles.cardTitle}>Останній знімок</Text>
          <Image accessibilityLabel="Зроблений фотографічний знімок" source={{ uri: photoUri }} style={styles.photo} />
          <Text style={styles.caption}>Фото збережено в тимчасовому сховищі застосунку.</Text>
        </InfoCard>
      ) : null}
      {permission?.granted === false && permission.canAskAgain === false ? (
        <ErrorMessage>Дозвіл вимкнено в налаштуваннях пристрою. Змініть його там і поверніться сюди.</ErrorMessage>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  cameraFrame: {
    backgroundColor: '#172033',
    borderRadius: 18,
    height: 340,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: { flex: 1 },
  cameraLabel: {
    backgroundColor: 'rgba(12, 18, 32, 0.62)',
    borderRadius: 8,
    left: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
    position: 'absolute',
    top: 12,
  },
  cameraLabelText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  cardTitle: { color: colors.ink, fontSize: 15, fontWeight: '700', marginBottom: 7 },
  bodyText: { color: colors.muted, fontSize: 13, lineHeight: 19, marginBottom: 14 },
  photo: { backgroundColor: colors.background, borderRadius: 12, height: 220, width: '100%' },
  caption: { color: colors.muted, fontSize: 11, marginTop: 9 },
});

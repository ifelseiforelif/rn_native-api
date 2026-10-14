import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { TabKey } from "../types";
import { InfoCard, ScreenLayout, SectionTitle } from "../components/ui";
import { colors } from "../theme";

type HomeScreenProps = {
  onNavigate: (screen: TabKey) => void;
};

const lessons: {
  title: string;
  detail: string;
  icon: string;
  screen: TabKey;
}[] = [
  { title: "Камера", detail: "Дозвіл і знімок", icon: "▣", screen: "camera" },
  {
    title: "GPS",
    detail: "Координати та точність",
    icon: "⌖",
    screen: "location",
  },
  {
    title: "Телефон",
    detail: "Контакти й набір номера",
    icon: "☎",
    screen: "phone",
  },
  { title: "Датчики", detail: "Рух пристрою", icon: "⌁", screen: "sensors" },
  {
    title: "Батарея",
    detail: "Рівень і стан живлення",
    icon: "▰",
    screen: "battery",
  },
  {
    title: "Буфер",
    detail: "Копіювання тексту",
    icon: "▤",
    screen: "clipboard",
  },
];

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <ScreenLayout
      icon="✦"
      title="Можливості смартфона"
      description="Робота з нативними API пристрою."
    >
      <SectionTitle>Модулі</SectionTitle>
      <View style={styles.lessonList}>
        {lessons.map((lesson) => (
          <TouchableOpacity
            accessibilityRole="button"
            key={lesson.screen}
            onPress={() => onNavigate(lesson.screen)}
            style={styles.lesson}
          >
            <View style={styles.lessonIcon}>
              <Text style={styles.lessonIconText}>{lesson.icon}</Text>
            </View>
            <View style={styles.lessonCopy}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonDetail}>{lesson.detail}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
    padding: 19,
  },
  welcomeEyebrow: {
    color: "#B8C8FF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
    lineHeight: 27,
    marginTop: 9,
  },
  welcomeText: { color: "#DAE1F3", fontSize: 13, lineHeight: 20, marginTop: 8 },
  permissionNote: {
    alignItems: "center",
    backgroundColor: "#263553",
    borderRadius: 12,
    flexDirection: "row",
    gap: 9,
    marginTop: 15,
    padding: 11,
  },
  noteIcon: { color: "#B8C8FF", fontSize: 17 },
  noteText: { color: "#E2E8F5", flex: 1, fontSize: 11, lineHeight: 16 },
  lessonList: { gap: 8 },
  lesson: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 11,
  },
  lessonIcon: {
    alignItems: "center",
    backgroundColor: colors.paleBlue,
    borderRadius: 11,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  lessonIconText: { color: colors.primary, fontSize: 20, fontWeight: "700" },
  lessonCopy: { flex: 1 },
  lessonTitle: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  lessonDetail: { color: colors.muted, fontSize: 11, marginTop: 3 },
  chevron: { color: colors.muted, fontSize: 24, paddingHorizontal: 4 },
  tipCard: { gap: 10 },
  tipTitle: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  tipText: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});

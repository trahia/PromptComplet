// PromptComplet — accessibilité mobile (React Native / Expo).
// À inclure UNE SEULE FOIS dans app/_layout.tsx :
//   <AccessibilityProvider> <Stack /> </AccessibilityProvider>
// Les réglages du système (lecteur d'écran, animations réduites, texte en gras, taille de police) sont
// respectés automatiquement. L'app ajoute une taille de texte et un contraste renforcé propres à l'app.
// Rien ne remplace les libellés accessibles dans chaque composant (accessibilityLabel / Role / Hint).

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AccessibilityInfo, Linking, Pressable, StyleSheet, Switch, Text, View, type TextProps } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "a11y-preferences";
const SCALES = [1, 1.15, 1.3, 1.5] as const;
type Scale = (typeof SCALES)[number];

type A11yContextValue = {
  screenReader: boolean;
  reduceMotion: boolean;
  boldText: boolean;
  textScale: Scale;
  highContrast: boolean;
  setTextScale: (scale: Scale) => void;
  setHighContrast: (on: boolean) => void;
};

const A11yContext = createContext<A11yContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [screenReader, setScreenReader] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [boldText, setBoldText] = useState(false);
  const [textScale, setTextScaleState] = useState<Scale>(1);
  const [highContrast, setHighContrastState] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader).catch(() => undefined);
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => undefined);
    AccessibilityInfo.isBoldTextEnabled?.().then(setBoldText).catch(() => undefined);
    const subs = [
      AccessibilityInfo.addEventListener("screenReaderChanged", setScreenReader),
      AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion),
      AccessibilityInfo.addEventListener("boldTextChanged", setBoldText),
    ];
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as { textScale?: number; highContrast?: boolean };
        if (SCALES.includes(saved.textScale as Scale)) setTextScaleState(saved.textScale as Scale);
        if (typeof saved.highContrast === "boolean") setHighContrastState(saved.highContrast);
      })
      .catch(() => undefined);
    return () => subs.forEach((s) => s.remove());
  }, []);

  const value = useMemo<A11yContextValue>(() => {
    const persist = (next: { textScale: Scale; highContrast: boolean }) =>
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
    return {
      screenReader,
      reduceMotion,
      boldText,
      textScale,
      highContrast,
      setTextScale: (scale) => {
        setTextScaleState(scale);
        void persist({ textScale: scale, highContrast });
      },
      setHighContrast: (on) => {
        setHighContrastState(on);
        void persist({ textScale, highContrast: on });
      },
    };
  }, [screenReader, reduceMotion, boldText, textScale, highContrast]);

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y doit être utilisé sous <AccessibilityProvider> (app/_layout.tsx).");
  return ctx;
}

/** Texte qui applique la taille choisie dans l'app, en plus de la taille de police du système. */
export function A11yText({ style, maxFontSizeMultiplier = 2, ...props }: TextProps) {
  const { textScale, highContrast, boldText } = useA11y();
  const flat = StyleSheet.flatten(style) ?? {};
  const scaled = {
    ...(flat.fontSize ? { fontSize: flat.fontSize * textScale } : {}),
    ...(flat.lineHeight ? { lineHeight: flat.lineHeight * textScale } : {}),
    ...(highContrast ? { color: "#000000" } : {}),
    ...(boldText ? { fontWeight: "700" as const } : {}),
  };
  return <Text allowFontScaling maxFontSizeMultiplier={maxFontSizeMultiplier} style={[flat, scaled]} {...props} />;
}

/** Écran de réglages d'accessibilité (à placer dans app/settings/). */
export function AccessibilitySettings({ declarationUrl }: { declarationUrl: string }) {
  const { textScale, setTextScale, highContrast, setHighContrast, reduceMotion, screenReader } = useA11y();
  const index = SCALES.indexOf(textScale);
  return (
    <View style={styles.container}>
      <A11yText style={styles.title} accessibilityRole="header">
        Accessibilité
      </A11yText>

      <View style={styles.row}>
        <A11yText style={styles.label}>Taille du texte : {Math.round(textScale * 100)} %</A11yText>
        <View style={styles.buttons}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Réduire la taille du texte"
            accessibilityState={{ disabled: index <= 0 }}
            disabled={index <= 0}
            onPress={() => setTextScale(SCALES[Math.max(0, index - 1)])}
            style={styles.button}
          >
            <Text style={styles.buttonText}>A−</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Agrandir la taille du texte"
            accessibilityState={{ disabled: index >= SCALES.length - 1 }}
            disabled={index >= SCALES.length - 1}
            onPress={() => setTextScale(SCALES[Math.min(SCALES.length - 1, index + 1)])}
            style={styles.button}
          >
            <Text style={styles.buttonText}>A+</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.row}>
        <A11yText style={styles.label}>Contraste renforcé</A11yText>
        <Switch value={highContrast} onValueChange={setHighContrast} accessibilityLabel="Contraste renforcé" />
      </View>

      <A11yText style={styles.note}>
        Animations réduites : {reduceMotion ? "activées dans les réglages du téléphone" : "réglable dans les réglages du téléphone"}.
        {screenReader ? " Lecteur d'écran détecté." : " Pour la lecture à voix haute, active VoiceOver (iPhone) ou TalkBack (Android)."}
      </A11yText>

      <Pressable accessibilityRole="link" onPress={() => Linking.openURL(declarationUrl)} style={styles.link}>
        <A11yText style={styles.linkText}>Déclaration d'accessibilité</A11yText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 48 },
  label: { fontSize: 16, flexShrink: 1 },
  buttons: { flexDirection: "row", gap: 8 },
  button: { minWidth: 48, minHeight: 48, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 8 },
  buttonText: { fontSize: 18, fontWeight: "600" },
  note: { fontSize: 14, lineHeight: 20 },
  link: { minHeight: 48, justifyContent: "center" },
  linkText: { fontSize: 16, textDecorationLine: "underline" },
});

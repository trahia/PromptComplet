// ZeroTrap — liens vers les pages légales depuis l'app (écran Réglages).
// Les pages sont publiées sur le web (dossier web-legal/ ou site du projet) : l'URL de la politique de
// confidentialité est exigée par les stores, et Google Play exige une page web de suppression de compte.

import { Pressable, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";

export type LegalLink = { label: string; url: string };

export function LegalLinks({ links }: { links: LegalLink[] }) {
  return (
    <View accessibilityRole="list" style={styles.list}>
      {links.map((link) => (
        <Pressable
          key={link.url}
          accessibilityRole="link"
          accessibilityHint="Ouvre la page dans le navigateur intégré"
          onPress={() => WebBrowser.openBrowserAsync(link.url)}
          style={styles.item}
        >
          <Text style={styles.text}>{link.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 4 },
  item: { minHeight: 48, justifyContent: "center", paddingHorizontal: 16 },
  text: { fontSize: 16, textDecorationLine: "underline" },
});

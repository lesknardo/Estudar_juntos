import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";

const API_URL = "http://10.0.2.2:3000"; // troque pelo seu IP, se usar físico

export default function BookDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { book } = route.params;
  const [similarBooks, setSimilarBooks] = useState([]);

  // Busca livros similares (mesmo subject)
  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const response = await fetch(`${API_URL}/books`);
        const data = await response.json();
        const filtered = data.filter(
          (b) => b.subject === book.subject && b.id !== book.id
        );
        setSimilarBooks(filtered);
      } catch (error) {
        console.error("Erro ao buscar similares:", error);
      }
    };
    fetchSimilar();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Imagem principal */}
      <Image
        source={{ uri: `${API_URL}${book.image}` }}
        style={styles.bookImage}
      />

      {/* Info principal */}
      <View style={styles.info}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.subject}>{book.subject}</Text>
        <Text style={styles.condition}>Estado: {book.condition}</Text>
        <Text style={styles.distance}>📍 Distância: {book.distance || 0} km</Text>
      </View>

      {/* Mapa de localização */}
      {book.latitude && book.longitude ? (
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: book.latitude,
              longitude: book.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: book.latitude,
                longitude: book.longitude,
              }}
              title={book.title}
            />
          </MapView>
        </View>
      ) : (
        <Text style={styles.noLocation}>📍 Localização não informada</Text>
      )}

      {/* Livros similares */}
      <View style={styles.similarContainer}>
        <Text style={styles.sectionTitle}>Livros semelhantes</Text>
        {similarBooks.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {similarBooks.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.similarCard}
                onPress={() => navigation.push("BookDetail", { book: item })}
              >
                <Image
                  source={{ uri: `${API_URL}${item.image}` }}
                  style={styles.similarImage}
                />
                <Text style={styles.similarTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noSimilar}>Nenhum livro semelhante</Text>
        )}
      </View>

      {/* Botões de ação */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>💬 Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>📦 Solicitar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🔗 Compartilhar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bookImage: { width: "100%", height: 280, resizeMode: "cover" },
  info: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold" },
  subject: { fontSize: 16, color: "#555", marginBottom: 4 },
  condition: { color: "#333" },
  distance: { marginTop: 4, color: "#007AFF" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 10,
  },
  mapContainer: { height: 220, marginVertical: 10 },
  map: { width: Dimensions.get("window").width - 20, height: 200, marginLeft: 10 },
  noLocation: {
    textAlign: "center",
    color: "#888",
    marginTop: 8,
  },
  similarContainer: { marginVertical: 16 },
  similarCard: {
    width: 120,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },
  similarImage: { width: 120, height: 120, resizeMode: "cover" },
  similarTitle: { padding: 6, fontSize: 14, textAlign: "center" },
  noSimilar: { textAlign: "center", color: "#888" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
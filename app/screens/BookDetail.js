import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Platform,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

// ✅ Backend dinâmico
const API_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://192.168.1.104:3000"; // depois deixamos isso dinâmico

export default function BookDetail() {
  const { bookData, id } = useLocalSearchParams();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBook = async () => {
      try {
        if (bookData) {
          try {
            const parsed = JSON.parse(bookData);
            setBook(parsed);
            setLoading(false);
            return;
          } catch {}
        }

        if (!id) {
          setBook(null);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/books/${id}`);

        if (!res.ok) {
          setBook(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.log("❌ Erro ao carregar livro:", error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [bookData, id]);

  useEffect(() => {
    if (!book) return;

    fetch(`${API_URL}/books/${book.id}/interested`)
      .then((res) => res.json())
      .then((data) => setInterestedUsers(data || []))
      .catch(() => setInterestedUsers([]));
  }, [book]);

  useEffect(() => {
    if (!book) return;

    fetch(`${API_URL}/books`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (b) => b.subject === book.subject && b.id !== book.id
        );
        setSimilarBooks(filtered);
      })
      .catch(() => setSimilarBooks([]));
  }, [book]);

  const handleChat = () => {
    if (!book) return;

    const donorId = book.donorId;
    const donorName = book.donorName;
    const avatar = book.image || "https://via.placeholder.com/50";

    router.push({
      pathname: `/chat/${donorId}`,
      params: { name: donorName, avatar },
    });
  };

  const handleShare = async () => {
    if (!book) return;

    await Share.share({
      message: `📚 Livro: ${book.title}\n✍️ Autor: ${book.author}\n\nVeja no app Estudar Juntos.`,
    });
  };

  const handleSolicitar = () => {
    alert("✅ Solicitação enviada para o doador!");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando livro...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.center}>
        <Text>❌ Erro ao carregar o livro</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#007AFF", marginTop: 10 }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: book.image }} style={styles.image} />

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>

      <View style={styles.tagRow}>
        <Text style={styles.condition}>{book.condition}</Text>
        <Text style={styles.subject}>{book.subject}</Text>
      </View>

      {/* BOTÕES */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSolicitar}>
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.primaryText}>Solicitar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleChat}>
          <MaterialIcons name="chat" size={20} color="#007AFF" />
          <Text style={styles.secondaryText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
          <MaterialIcons name="share" size={20} color="#007AFF" />
          <Text style={styles.secondaryText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

      {/* MAPA */}
      {Platform.OS !== "web" && book.latitude && book.longitude && (
        <>
          <Text style={styles.sectionTitle}>Localização</Text>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: Number(book.latitude),
              longitude: Number(book.longitude),
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker
              coordinate={{
                latitude: Number(book.latitude),
                longitude: Number(book.longitude),
              }}
            />
          </MapView>

          {/* BOTÃO VOLTAR ABAIXO DO MAPA */}
          <TouchableOpacity
            style={styles.backButtonBottom}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </>
      )}

      {/* INTERESSADOS */}
      {interestedUsers.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Interessados</Text>

          {interestedUsers.map((user, index) => (
            <View style={styles.userCard} key={index}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userCity}>{user.city}</Text>
            </View>
          ))}
        </>
      )}

      {/* LIVROS SEMELHANTES */}
      {similarBooks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Livros semelhantes</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {similarBooks.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.similarCard}
                onPress={() =>
                  router.push({
                    pathname: "/screens/BookDetail",
                    params: {
                      id: String(item.id),
                      bookData: JSON.stringify(item),
                    },
                  })
                }
              >
                <Image source={{ uri: item.image }} style={styles.similarImage} />
                <Text style={styles.similarTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.similarCondition}>{item.condition}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
}

// ============================
// ESTILOS
// ============================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: "#fff" },

  image: {
    width: "100%",
    height: 280,
    borderRadius: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

  author: {
    fontSize: 16,
    color: "#444",
  },

  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  condition: {
    color: "#007AFF",
    fontWeight: "600",
  },

  subject: {
    color: "#666",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },

  primaryButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    justifyContent: "center",
  },

  primaryText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
  },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginLeft: 6,
  },

  secondaryText: {
    color: "#007AFF",
    marginLeft: 4,
  },

  map: {
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },

  backButtonBottom: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },

  userCard: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },

  userName: {
    fontWeight: "bold",
  },

  userCity: {
    fontSize: 13,
    color: "#555",
  },

  similarCard: {
    width: 130,
    marginRight: 12,
  },

  similarImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },

  similarTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },

  similarCondition: {
    fontSize: 12,
    color: "#666",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import * as Location from "expo-location";
import * as Device from "expo-device";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// BACKEND DINÂMICO
const API_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : Device.isDevice
    ? "http://192.168.1.104:3000"
    : "http://10.0.2.2:3000";

// Filtros
const CONDITIONS = [
  { label: "Todos", value: null },
  { label: "Novo", value: "Novo" },
  { label: "Usado - Bom", value: "Usado - Bom" },
  { label: "Usado - Regular", value: "Usado - Regular" },
];

// ✅ FUNÇÃO PARA REMOVER ACENTOS
const normalizeText = (text) => {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export default function SearchScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const [selectedCondition, setSelectedCondition] = useState(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const typingTimeout = useRef(null);

  // =========================
  // LOCALIZAÇÃO
  // =========================
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocation({ latitude: -23.5629, longitude: -46.6544 });
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation(loc.coords);
      } catch {
        setLocation({ latitude: -23.5629, longitude: -46.6544 });
      }
    };

    getLocation();
  }, []);

  // =========================
  // BUSCAR LIVROS
  // =========================
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/books`);
      const data = await res.json();

      console.log("📚 Livros recebidos do backend:", data);

      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Erro ao buscar livros:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // =========================
  // DISTÂNCIA
  // =========================
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // =========================
  // FILTROS + ORDENAR (COM ACENTOS)
  // =========================
  useEffect(() => {
    let results = [...books];

    if (query) {
      const q = normalizeText(query);

      results = results.filter((b) => {
        const title = normalizeText(b.title);
        const author = normalizeText(b.author);
        const subject = normalizeText(b.subject);

        return (
          title.includes(q) ||
          author.includes(q) ||
          subject.includes(q)
        );
      });
    }

    if (selectedCondition) {
      results = results.filter(
        (b) => String(b.condition) === selectedCondition
      );
    }

    if (location) {
      results = results.map((book) => {
        if (!book.latitude || !book.longitude) return book;

        const distance = getDistance(
          location.latitude,
          location.longitude,
          book.latitude,
          book.longitude
        );

        return { ...book, distanceKm: distance };
      });

      results.sort(
        (a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999)
      );
    }

    setFilteredBooks(results);
  }, [books, query, location, selectedCondition]);

  const handleChangeText = (text) => {
    setQuery(text);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {}, 400);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <Text style={styles.title}>Buscar Livros</Text>

        <TouchableOpacity onPress={() => setFilterModalOpen(true)}>
          <MaterialIcons name="tune" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Digite o nome do livro..."
          value={query}
          onChangeText={handleChangeText}
        />
      </View>

      {/* FILTER CHIPS */}
      <View style={styles.chipsContainer}>
        {CONDITIONS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.chip,
              selectedCondition === item.value && styles.chipActive,
            ]}
            onPress={() => setSelectedCondition(item.value)}
          >
            <Text
              style={[
                styles.chipText,
                selectedCondition === item.value &&
                  styles.chipTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {/* LISTA */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              console.log("➡️ CLICADO NO LIVRO ID:", item.id);

              router.push({
                pathname: "/screens/BookDetail",
                params: {
                  id: String(item.id),
                  bookData: JSON.stringify(item),
                },
              });
            }}
          >
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={{ flex: 1 }}>
  <Text style={styles.bookTitle}>
    {String(item.title || "")}
  </Text>

  <Text>
    {String(item.author || "")}
  </Text>

  <Text>
    {String(item.condition || "")}
  </Text>

  {item.distanceKm ? (
    <Text style={styles.distanceText}>
      📍 {Number(item.distanceKm).toFixed(1)} km
    </Text>
  ) : null}
</View>
          </TouchableOpacity>
        )}
      />

      {/* EMPTY */}
      {filteredBooks.length === 0 && !loading && (
        <Text style={styles.emptyText}>
          Nenhum livro encontrado 😢
        </Text>
      )}

      {/* MODAL FILTRO */}
      <Modal transparent visible={filterModalOpen} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filtros</Text>

            {CONDITIONS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedCondition(item.value);
                  setFilterModalOpen(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setFilterModalOpen(false)}
            >
              <Text style={{ color: "#fff" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =========================
// ESTILOS
// =========================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },

  title: { fontSize: 20, fontWeight: "bold" },

  searchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },

  searchInput: { flex: 1, padding: 8 },

  chipsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },

  chip: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
  },

  chipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  chipText: { color: "#444" },

  chipTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },

  image: {
    width: 60,
    height: 90,
    marginRight: 10,
  },

  bookTitle: { fontWeight: "bold" },

  distanceText: {
    marginTop: 5,
    color: "#007AFF",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  modalOptionText: {
    fontSize: 16,
  },

  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
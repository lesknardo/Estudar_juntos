import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

const API_URL = "http://10.0.2.2:3000"; // se estiver no celular físico, troca por IP da máquina

export default function SearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  // filtros
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);

  // Pegar localização
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de localização negada 😢");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // Buscar livros no servidor
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/books`);
        const data = await res.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Calcular distância (Haversine)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filtrar e ordenar resultados
  useEffect(() => {
    let results = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );

    if (selectedSubject) {
      results = results.filter(
        (book) =>
          book.subject &&
          book.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }

    if (selectedCondition) {
      results = results.filter(
        (book) =>
          book.condition &&
          book.condition.toLowerCase() === selectedCondition.toLowerCase()
      );
    }

    if (location) {
      results = results
        .map((book) => ({
          ...book,
          distance:
            getDistance(
              location.latitude,
              location.longitude,
              book.latitude,
              book.longitude
            ) || 9999,
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    setFilteredBooks(results);
  }, [query, books, location, selectedSubject, selectedCondition]);

  // Render item do livro
  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("BookDetail", { book: item })}
    >
      {item.image ? (
        <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text>Sem imagem</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subject || "Sem matéria"}</Text>
        {item.distance && (
          <Text style={styles.distance}>
            📍 {item.distance.toFixed(1)} km de distância
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Opções simples de filtro
  const subjects = ["Matemática", "Português", "História", "Geografia"];
  const conditions = ["Novo", "Usado", "Desgastado"];

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={24} color="#888" />
        <TextInput
          placeholder="Buscar livros..."
          style={styles.input}
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <MaterialIcons name="filter-list" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Filtros aplicados */}
      {(selectedSubject || selectedCondition) && (
        <View style={styles.activeFilters}>
          {selectedSubject && (
            <TouchableOpacity
              style={styles.filterTag}
              onPress={() => setSelectedSubject(null)}
            >
              <Text style={styles.filterText}>{selectedSubject} ✕</Text>
            </TouchableOpacity>
          )}
          {selectedCondition && (
            <TouchableOpacity
              style={styles.filterTag}
              onPress={() => setSelectedCondition(null)}
            >
              <Text style={styles.filterText}>{selectedCondition} ✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Lista */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : filteredBooks.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum resultado encontrado 😕</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBook}
        />
      )}

      {/* Modal de filtros */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar resultados</Text>

            <Text style={styles.modalSubtitle}>Matéria:</Text>
            <View style={styles.optionList}>
              {subjects.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.option,
                    selectedSubject === s && styles.optionSelected,
                  ]}
                  onPress={() =>
                    setSelectedSubject(selectedSubject === s ? null : s)
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedSubject === s && { color: "#fff" },
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSubtitle}>Condição:</Text>
            <View style={styles.optionList}>
              {conditions.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.option,
                    selectedCondition === c && styles.optionSelected,
                  ]}
                  onPress={() =>
                    setSelectedCondition(selectedCondition === c ? null : c)
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedCondition === c && { color: "#fff" },
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },
  activeFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  filterTag: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  filterText: { color: "#fff" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: { width: 90, height: 90 },
  placeholder: {
    width: 90,
    height: 90,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
  },
  info: { flex: 1, padding: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
  subtitle: { color: "#666" },
  distance: { marginTop: 4, color: "#333" },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalSubtitle: { fontWeight: "bold", marginTop: 10 },
  optionList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  option: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 4,
  },
  optionSelected: { backgroundColor: "#007AFF" },
  optionText: { color: "#007AFF" },
  closeButton: {
    backgroundColor: "#007AFF",
    borderRadius: 6,
    padding: 10,
    marginTop: 14,
  },
  closeText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
});
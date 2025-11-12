import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const mockBooksNearby = [
  { id: 1, title: 'Física Quântica', subject: 'Física', distance: '2.3 km', image: require('../assets/images/livro_verde.png') },
  { id: 2, title: 'Cálculo Volume 1', subject: 'Matemática', distance: '3.5 km', image: require('../assets/images/livro_vermelho.png') },
  { id: 3, title: 'Gramática Portuguesa', subject: 'Português', distance: '4.1 km', image: require('../assets/images/livro_azul.png') },
];

const SearchResultsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { query } = route.params;

  // Filtra livros mock conforme o termo buscado
  const filteredBooks = mockBooksNearby.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.subject.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Resultados por proximidade</Text>
      <Text style={styles.subheader}>
        Mostrando resultados para: <Text style={styles.queryText}>{query}</Text>
      </Text>

      {filteredBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookCard}
              onPress={() => console.log(`Abrir livro: ${item.title}`)}
            >
              <Image source={item.image} style={styles.bookImage} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookSubject}>{item.subject}</Text>
                <Text style={styles.bookDistance}>{item.distance} de distância</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.noResults}>Nenhum resultado encontrado perto de você 😕</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  queryText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  bookImage: {
    width: 60,
    height: 80,
    resizeMode: 'contain',
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bookSubject: {
    fontSize: 14,
    color: '#666',
  },
  bookDistance: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 4,
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
  },
});

export default SearchResultsScreen;
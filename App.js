import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/home';
import ExploreScreen from './screens/estado_padrao';
import LoadingScreen from './screens/loading_screen';
import SearchScreen from './screens/search';
import SearchResultsScreen from './screens/SearchResultsScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import AddBookScreen from "./screens/AddBookScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
        <Stack.Screen name="Explore" component={ExploreScreen} options={{ title: 'Explorar' }} />
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar Livros' }} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ title: 'Resultados' }} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Detalhes do Livro' }}/>
        <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: "Adicionar Livro" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
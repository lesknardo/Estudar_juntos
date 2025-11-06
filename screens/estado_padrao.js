import { useState } from 'react';
import {
    FlatList // <-- TIPO DE LISTA OTIMIZADA: Para a linha de livros
    , // Scroll principal VERTICAL (do corpo da tela)
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import BookCard from '../components/BookCard';

// Importa ícones que parecem ser usados nas ações rápidas
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- DADOS MOCKADOS ---
const quickActions = [
    { title: 'Buscar Livros', iconName: 'magnify', iconLib: MaterialCommunityIcons },
    { title: 'Doar um Livro', iconName: 'book-open-page-variant', iconLib: MaterialCommunityIcons },
    { title: 'Minhas Mensagens', iconName: 'chat-processing-outline', iconLib: MaterialCommunityIcons },
    { title: 'Meus Pedidos', iconName: 'package-variant-closed', iconLib: MaterialCommunityIcons },
];

const categories = [
    'Todos', 'Matemática', 'Física', 'Química', 'Biologia', 
    'História', 'Geografia', 'Português', 'Redação'
];

const mockBooks = [
    { id: 1, title: 'Física Quântica', subject: 'Física', distance: '2.3 km', image: require('../assets/images/livro_verde.png') },
    { id: 2, title: 'Cálculo Volume 1', subject: 'Matemática', distance: '3.5 km', image: require('../assets/images/livro_vermelho.png') },
    { id: 3, title: 'Biologia Celular', subject: 'Biologia', distance: '4.1 km', image: require('../assets/images/livro_azul.png') },

];


// --- COMPONENTE DE CARTÃO DE AÇÃO RÁPIDA (REUTILIZADO) ---
const QuickActionCard = ({ title, iconName, iconLib: IconComponent, onPress }) => {
    return (
        <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
            <View style={styles.quickActionIconContainer}>
                {/* O ícone na imagem é um desenho 3D. 
                    Usaremos ícones padrão como placeholder por enquanto. */}
                <IconComponent 
                    name={iconName}
                    size={30}
                    color="#555"
                />
            </View>
            <Text style={styles.quickActionText}>{title}</Text>
        </TouchableOpacity>
    );
};


// --- COMPONENTE DE ITEM DA BARRA DE CATEGORIAS ---
const CategoryItem = ({ title, isSelected, onPress }) => {
    return (
        <TouchableOpacity 
            style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
            onPress={onPress}
        >
            <Text style={[
                styles.categoryText, 
                isSelected && styles.categoryTextSelected
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};


// --- TELA PRINCIPAL: EXPLORE SCREEN ---
const ExploreScreen = ({ navigation }) => {
    const userName = "João";
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    return (
        <View style={styles.androidSafeArea}>
            <ScrollView style={styles.container}>

                {/* CARD DE BOAS-VINDAS (Topo azul) - Olá, João! 👋 */}
                <View style={styles.topWelcomeCard}>
                    <Text style={styles.topWelcomeTitle}>Olá, {userName}! 👋</Text>
                    <Text style={styles.topWelcomeSubtitle}>
                        Que bom ter você de volta
                    </Text>
                </View>

                {/* SEÇÃO DE AÇÕES RÁPIDAS (Buscar Livros, Doar, etc.) */}
                <View style={styles.quickActionsRow}>
                    {quickActions.map((action, index) => (
                        <QuickActionCard 
                            key={index}
                            title={action.title}
                            iconName={action.iconName}
                            iconLib={action.iconLib}
                            onPress={() => console.log(`Ação: ${action.title}`)}
                        />
                    ))}
                </View>

                {/* BARRA DE CATEGORIAS */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryBar}
                >
                    {categories.map((category) => (
                        <CategoryItem
                            key={category}
                            title={category}
                            isSelected={selectedCategory === category}
                            onPress={() => setSelectedCategory(category)}
                        />
                    ))}
                </ScrollView>
                
                {/* TÍTULO DA SEÇÃO DE LIVROS */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Adicionados Perto de Você</Text>
                    <TouchableOpacity onPress={() => console.log('Ver todos')}>
                        <Text style={styles.viewAllText}>Ver todos ›</Text>
                    </TouchableOpacity>
                </View>
                    
{/* LISTA DE CARDS DE LIVROS USANDO FLATLIST (Otimizado) */}
<FlatList 
    data={mockBooks} // 1. Diz qual a lista de dados usar
    renderItem={({ item }) => ( // 2. Diz como desenhar cada item
        <BookCard 
            key={item.id}
            title={item.title}
            subject={item.subject}
            distance={item.distance}
            imageSource={item.image}
            onPress={() => console.log(`Abrir livro: ${item.title}`)}
        />
    )}
    keyExtractor={(item) => item.id.toString()} // 3. Identificador único para otimização
    horizontal // 4. Define que o scroll é horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.booksRow}
/>
            </ScrollView>
        </View>
    );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Fundo branco
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    },
    
    container: {
        flex: 1,
    },

    booksRow: {
    paddingHorizontal: 20, 
    paddingBottom: 20,    
    },

    // ESTILO: Topo azul (Sem bordas arredondadas neste design)
    topWelcomeCard: {
        backgroundColor: '#007AFF', // Azul primário
        padding: 20,
        paddingVertical: 30,
        marginBottom: 10, // Menos espaço, já que o quick actions vem logo abaixo
    },
    topWelcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    topWelcomeSubtitle: {
        fontSize: 16,
        color: '#FFFFFF',
    },

    // --- ESTILOS DE AÇÕES RÁPIDAS ---
    quickActionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: '#fff',
        // Borda inferior para separação
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    quickActionItem: {
        width: '25%', // 4 itens por linha
        alignItems: 'center',
        paddingVertical: 10,
    },
    quickActionIconContainer: {
        // Ocultado o fundo do ícone por ser uma imagem 3D.
        // Se precisar, adicionaremos background, border-radius e sombra.
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
    },

    // --- ESTILOS DA BARRA DE CATEGORIAS ---
    categoryBar: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    categoryItem: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0', // Fundo cinza claro
        marginRight: 10,
    },
    categoryItemSelected: {
        backgroundColor: '#007AFF', // Fundo azul para selecionado
    },
    categoryText: {
        color: '#333',
        fontWeight: '500',
    },
    categoryTextSelected: {
        color: '#FFFFFF', // Texto branco para selecionado
        fontWeight: 'bold',
    },

    // --- ESTILOS DO HEADER DA SEÇÃO ---
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAllText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    
});

export default ExploreScreen;

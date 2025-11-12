import { useState } from 'react';
import {
    FlatList,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BookCard from '../components/BookCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

const QuickActionCard = ({ title, iconName, iconLib: IconComponent, onPress }) => {
    return (
        <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
            <View style={styles.quickActionIconContainer}>
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

const ExploreScreen = () => {
    const navigation = useNavigation();
    const userName = "João";
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    return (
        <View style={styles.androidSafeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.topWelcomeCard}>
                    <Text style={styles.topWelcomeTitle}>Olá, {userName}! 👋</Text>
                    <Text style={styles.topWelcomeSubtitle}>
                        Que bom ter você de volta
                    </Text>
                </View>

                <View style={styles.quickActionsRow}>
                    {quickActions.map((action, index) => (
                        <QuickActionCard 
                            key={index}
                            title={action.title}
                            iconName={action.iconName}
                            iconLib={action.iconLib}
                            onPress={() => {
                                if (action.title === 'Buscar Livros') {
                                    navigation.navigate('Search');
                                } else {
                                    console.log(`Ação: ${action.title}`);
                                }
                            }}
                        />
                    ))}
                </View>

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
                
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Adicionados Perto de Você</Text>
                    <TouchableOpacity onPress={() => console.log('Ver todos')}>
                        <Text style={styles.viewAllText}>Ver todos ›</Text>
                    </TouchableOpacity>
                </View>
                    
                <FlatList 
                    data={mockBooks}
                    renderItem={({ item }) => (
                        <BookCard 
                            key={item.id}
                            title={item.title}
                            subject={item.subject}
                            distance={item.distance}
                            imageSource={item.image}
                            onPress={() => console.log(`Abrir livro: ${item.title}`)}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.booksRow}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    },
    
    container: {
        flex: 1,
    },

    booksRow: {
        paddingHorizontal: 20, 
        paddingBottom: 20,    
    },

    topWelcomeCard: {
        backgroundColor: '#007AFF',
        padding: 20,
        paddingVertical: 30,
        marginBottom: 10,
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

    quickActionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    quickActionItem: {
        width: '25%',
        alignItems: 'center',
        paddingVertical: 10,
    },
    quickActionIconContainer: {
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
    },

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
        backgroundColor: '#f0f0f0',
        marginRight: 10,
    },
    categoryItemSelected: {
        backgroundColor: '#007AFF',
    },
    categoryText: {
        color: '#333',
        fontWeight: '500',
    },
    categoryTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

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
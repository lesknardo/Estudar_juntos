import React, { useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

const BookIconSource = require('../assets/images/livro_transparente.png');

// --- COMPONENTE DE AÇÃO RÁPIDA (mantido)
const QuickActionButton = ({ title, iconName }) => {
    return (
        <TouchableOpacity style={styles.quickActionCard}>
            <MaterialIcons
                name={iconName}
                size={30}
                color="#007AFF"
                style={{ marginBottom: 5 }}
            />
            <Text style={styles.quickActionText}>{title}</Text>
        </TouchableOpacity>
    );
};

// --- TELA PRINCIPAL (HOME SCREEN)
const HomeScreen = ({ navigation }) => { 
    const userName = "Maria"; 
    const [hasNotification, setHasNotification] = useState(true); // notificação

    const handleFabPress = () => {
        navigation.navigate('Loading');
    };

    return (
        <View style={styles.androidSafeArea}>
            <ScrollView style={styles.container}>

                {/* CARD DE BOAS-VINDAS */}
                <View style={styles.topWelcomeCard}>
                    <Text style={styles.topWelcomeTitle}>Seja bem-vindo(a), {userName}! 🎉</Text>
                    <Text style={styles.topWelcomeSubtitle}>
                        A Ponte do Saber conecta você ao seu futuro. Explore doações ou compartilhe seus livros para começar.
                    </Text>
                </View>

                {/*NOTIFICAÇÃO (mostra apenas se houver nova interação) */}
                {hasNotification && (
                    <View style={styles.notificationCard}>
                        <MaterialIcons name="notifications-active" size={28} color="#007AFF" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.notificationTitle}>Novo interesse em seu livro!</Text>
                            <Text style={styles.notificationSubtitle}>
                                Alguém quer o livro que você publicou recentemente.
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.notificationButton}
                            onPress={() => {
                                setHasNotification(false); // oculta o aviso
                                navigation.navigate('Explore');
                            }}
                        >
                            <Text style={styles.notificationButtonText}>Ver</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* SEÇÃO "NENHUM LIVRO PRÓXIMO AINDA" */}
                <View style={styles.noBooksContainer}>
                    <Image source={BookIconSource} style={styles.bookIcon} />
                    <Text style={styles.noBooksTitle}>Nenhum livro próximo ainda</Text>
                    <Text style={styles.noBooksSubtitle}>
                        Os livros que aparecerem perto de você serão listados aqui
                    </Text>
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fabButton} onPress={handleFabPress}> 
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: { flex: 1, padding: 0 },

    topWelcomeCard: {
        backgroundColor: '#007AFF',
        padding: 20,
        paddingTop: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    topWelcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    topWelcomeSubtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        lineHeight: 22,
    },

    // ---NOTIFICAÇÃO ---
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EAF4FF',
        marginHorizontal: 20,
        marginBottom: 25,
        padding: 15,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        gap: 10,
    },
    notificationTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#007AFF',
    },
    notificationSubtitle: {
        fontSize: 14,
        color: '#555',
    },
    notificationButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    notificationButtonText: {
        color: '#fff',
        fontWeight: '600',
    },

    // --- ESTILOS ORIGINAIS ---
    noBooksContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        marginTop: 200,
    },
    bookIcon: {
        width: 80,
        height: 80,
        marginBottom: 20,
        opacity: 0.9,
    },
    noBooksTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    noBooksSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    quickActionText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        fontWeight: '500',
    },
    quickActionCard: {},
   fabButton: {
   position: 'absolute',
   bottom: 30,
   right: 25,
   width: 60,
   height: 60,
   alignItems: 'center',
   justifyContent: 'center',
   backgroundColor: '#007AFF',
   borderRadius: 30,
   elevation: 6,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 3 },
   shadowOpacity: 0.3,
  shadowRadius: 4,
},
    fabText: {
        fontSize: 35,
        color: 'white',
        lineHeight: 35,
    },
});

export default HomeScreen;
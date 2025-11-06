import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    Image 
} from 'react-native'; // Componentes básicos necessários para construir a UI do Card
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Usaremos um componente de View para simular o efeito 3D/gradiente
const BookCard = ({ title, subject, distance, imageSource, onPress }) => {
    
    // Mapeamento de cor do tema para o texto do assunto (opcional, para consistência)
    const subjectColorMap = {
        'Física': '#28A745', // Verde
        'Matemática': '#DC3545', // Vermelho
        'Biologia': '#17A2B8', // Ciano
        // Adicione mais mapeamentos conforme suas categorias
    };

    const subjectColor = subjectColorMap[subject] || '#007AFF'; // Azul padrão

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
            {/* Simulação do Efeito 3D/Gradiente Azul */}
            <View style={styles.gradientEffect}>
                {/* O ícone 3D do livro entraria aqui. 
                    Por enquanto, é um placeholder visual. */}
                {imageSource && (
                     <Image 
                        source={imageSource} 
                        style={styles.bookImage}
                        resizeMode="contain" 
                     />
                )}
            </View>

            {/* Informações do Livro */}
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>

                <View style={styles.footerRow}>
                    <View style={styles.subjectRow}>
                        {/* Indicador de Assunto com cor */}
                        <MaterialCommunityIcons 
                            name="circle" 
                            size={8} 
                            color={subjectColor} 
                            style={{ marginRight: 4 }}
                        />
                        <Text style={[styles.subjectText, { color: subjectColor }]}>
                            {subject}
                        </Text>
                    </View>

                    <View style={styles.distanceRow}>
                        <MaterialCommunityIcons 
                            name="map-marker" 
                            size={14} 
                            color="#999" 
                            style={{ marginRight: 2 }}
                        />
                        <Text style={styles.distanceText}>
                            {distance}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
    cardContainer: {
        width: 140, // Largura fixa para 3 cards por linha (com margens)
        marginRight: 15,
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden', // Importante para o gradientEffect
        
        // Sombra suave para destacar o card
        elevation: 4, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    
    // Área superior (simulando a imagem 3D com fundo gradiente/sólido)
    gradientEffect: {
        height: 140, // Altura para o topo
        backgroundColor: '#f0f4ff', // Fundo bem clarinho para o efeito
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        // Você pode adicionar um `LinearGradient` aqui se quiser o efeito exato
    },
    bookImage: {
        width: '70%',
        height: '70%',
    },

    // Área inferior de informações
    infoContainer: {
        padding: 10,
        paddingTop: 12,
        height: 80, // Altura fixa para manter o alinhamento
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // Linha do Assunto (Ex: Física)
    subjectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        // Estilo de texto é aplicado diretamente na Text
    },
    subjectText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Linha da Distância (Ex: 2.3 km)
    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 12,
        color: '#999',
    },
});

export default BookCard;
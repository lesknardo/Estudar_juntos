import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Explore'); // depois de 2s, vai pra tela estado_padrao.js
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.skeletonLarge} />
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonSmall} />
        <View style={styles.skeletonSmall} />
      </View>
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonSmall} />
        <View style={styles.skeletonSmall} />
      </View>
      <View style={styles.skeletonBooks}>
        <View style={styles.skeletonTall} />
        <View style={styles.skeletonTall} />
        <View style={styles.skeletonTall} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    justifyContent: 'center',
  },
  skeletonLarge: {
    height: 80,
    borderRadius: 10,
    backgroundColor: '#E8E8E8',
    marginBottom: 16,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skeletonSmall: {
    width: '48%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E8E8E8',
  },
  skeletonBooks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  skeletonTall: {
    width: '30%',
    height: 130,
    borderRadius: 10,
    backgroundColor: '#E8E8E8',
  },
});
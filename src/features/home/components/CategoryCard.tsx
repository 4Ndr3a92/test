import React, { ComponentProps } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Definiamo l'interfaccia delle Props del componente
interface CategoryCardProps {
  title: string;
  subtitle: string;
  imageUri: string;
  iconName: ComponentProps<typeof Ionicons>['name']; // Tipizzazione nativa per i nomi di Ionicons
  iconBg: string; // Colore di sfondo del cerchio dell'icona
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  subtitle,
  imageUri,
  iconName,
  iconBg,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9} 
      onPress={onPress}
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: imageUri }} style={styles.cardImage} />
        {/* Badge circolare con l'icona Ionicons sovrapposta in alto a sinistra */}
        <View style={[styles.cardIconBadge, { backgroundColor: iconBg }]}>
          <Ionicons name={iconName} size={15} color="#FFF" />
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.38, // Rende la card proporzionata in base alla larghezza dello schermo
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F2F2F7',
    // Ombreggiatura per iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    // Ombreggiatura per Android
    elevation: 2,
  },
  cardImageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardIconBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    // Leggera ombra sotto il cerchio dell'icona per staccarlo dall'immagine di sfondo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    padding: 10,
    height: 75,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 14,
    marginTop: 2,
  },
});
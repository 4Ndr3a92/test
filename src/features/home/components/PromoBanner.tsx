import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';

// Interfaccia delle Props del componente
interface PromoBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  imageUri: string;
  onPress?: () => void;
}

export default function PromoBanner({
  title,
  subtitle,
  buttonText,
  imageUri,
  onPress,
}: PromoBannerProps) {
  return (
    <View style={styles.bannerContainer}>
      <ImageBackground
        source={{ uri: imageUri }}
        style={styles.bannerBackground}
        imageStyle={{ borderRadius: 16 }} // Applica il raggio solo all'immagine interna
      >
        {/* Overlay scuro (tonalità verde foresta profonda per richiamare la natura dell'Alcantara) */}
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>{title}</Text>
          <Text style={styles.bannerSubtitle}>{subtitle}</Text>
          
          <TouchableOpacity 
            style={styles.bannerButton} 
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.bannerButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  bannerBackground: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 48, 38, 0.75)', // Filtro verde scuro semitrasparente come nel design originale
    padding: 20,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 24,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#D1E7DD', // Sfumatura verde chiarissimo per il testo secondario
    lineHeight: 16,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    // Ombra leggera sotto il bottone
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bannerButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#123026', // Testo scuro che richiama il colore dell'overlay
  },
});
import React from 'react';
import { StyleSheet, Text, ImageBackground, View, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
interface Props {
 title: string,
}
export const HeroHeader: React.FC<Props> = ({title}) => {
return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=1000&q=80' }}
      style={styles.hero}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
        style={styles.gradient}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>
              {title}
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 380,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    // Centra il contenuto verticalmente e orizzontalmente
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    // Compensa l'altezza della barra di stato solo per dare un leggero margine superiore visivo
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
  },
  textContainer: {
    width: '100%',

  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.5,
    textAlign: 'center', // Centra il testo su più righe
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing } from '@/shared/theme';

const { width } = Dimensions.get('window');
const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj[ayfRayfQfQM{M|azazj[azfQj[ayfjayj[a|j[ayj[';

interface Props {
  imageUrl?: string;
}

export const PoiHeaderImage: React.FC<Props> = ({ imageUrl }) => (
  <View style={styles.container}>
    <Image
      source={imageUrl}
      style={styles.image}
      placeholder={{ blurhash }}
      contentFit="cover"
      transition={200}
    />
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => router.back()}
      activeOpacity={0.8}
    >
      <Ionicons name="chevron-back" size={24} color={'white'} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 280,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
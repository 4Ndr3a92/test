import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  Image, ActivityIndicator, StyleSheet, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { typography, colors, radius, spacing } from '@/shared/theme';
import { SafeAreaView } from 'react-native-safe-area-context';


interface Props {
  visible: boolean;
  currentName: string;
  currentAvatarUrl?: string;
  onClose: () => void;
}

export const EditProfileModal: React.FC<Props> = ({
  visible,
  currentName,
  currentAvatarUrl,
  onClose,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(currentName);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const updateMutation = useUpdateProfile();

  useEffect(() => {
    if (visible) {
      setName(currentName);
      setAvatarUri(null);
    }
  }, [visible, currentName]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('profile.photoPermissionTitle'), t('profile.photoPermissionMessage'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('', t('profile.nameRequired'));
      return;
    }

    updateMutation.mutate(
      { fullName: name.trim(), avatarUri: avatarUri ?? undefined },
      { onSuccess: onClose }
    );
  };

  const avatarSource = avatarUri ?? currentAvatarUrl;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={typography.sectionTitle}>{t('profile.editProfile')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage}>
            {avatarSource ? (
              <Image source={{ uri: avatarSource }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {(name || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Nome */}
          <Text style={styles.label}>{t('profile.name')}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('profile.namePlaceholder')}
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, updateMutation.isPending && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={typography.buttonText}>{t('common.save')}</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
  },
  avatarFallback: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF', fontSize: 36, fontWeight: '800',
  },
  avatarEditBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.surface,
  },
  label: {
    fontSize: 13, fontWeight: '700', color: colors.textMuted,
    textTransform: 'uppercase', marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.lg, paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, marginBottom: spacing.xl,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1, fontSize: 15, color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: { opacity: 0.6 },
});
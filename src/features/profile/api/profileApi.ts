import { supabase } from "@/config/supabase";

import { decode } from 'base64-arraybuffer';
import {File} from 'expo-file-system';


export interface UpdateProfilePayload {
  fullName: string;
  avatarUri?: string;
}

export const  uploadAvatar = async (userId: string, localUri: string): Promise<string> => {
  console.log('📤 Upload avatar');
  console.log('  userId:', userId);
  console.log('  localUri:', localUri);

  try {
    const base64 =await ( new File(localUri).base64());
    console.log('  ✓ File letto, lunghezza base64:', base64.length);

    const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filePath = `${userId}/avatar.${ext}`;
    console.log('  filePath:', filePath);

    const arrayBuffer = decode(base64);
    console.log('  ✓ Convertito in ArrayBuffer:', arrayBuffer.byteLength, 'bytes');

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, { contentType: `image/${ext}`, upsert: true });

    if (error) {
      console.error('  ❌ Supabase upload error:', JSON.stringify(error));
      throw error;
    }

    console.log('  ✓ Upload completato');
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return `${data.publicUrl}?t=${Date.now()}`;
  } catch (err) {
    console.error('  ❌ Errore upload:', err);
    throw err;
  }
};


export const updateProfile = async (
  userId: string,
  payload: UpdateProfilePayload
): Promise<void> => {
  let avatarUrl: string | undefined;

  if (payload.avatarUri) {
    avatarUrl = await uploadAvatar(userId, payload.avatarUri);



  }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: payload.fullName,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    },
  });

  if (error) throw error;

  await syncReviewsUserData(userId, payload.fullName, avatarUrl);
};



export const updateReview = async (trailId: string, reviewId: string, rating: number, comment: string) => {
  const { error } = await supabase
    .from('reviews')
    .update({ rating, comment, edited_at: new Date().toISOString() })
    .eq('id', reviewId);

  if (error) throw error;
};



const syncReviewsUserData = async (
  userId: string,
  fullName: string,
  avatarUrl?: string
): Promise<void> => {
  const updatePayload: Record<string, string> = {
    user_name: fullName,
  };

  if (avatarUrl) {
    updatePayload.user_avatar_url = avatarUrl;
  }

  const { error } = await supabase
    .from('reviews')
    .update(updatePayload)
    .eq('user_id', userId);

  if (error) {
    // Non blocchiamo il flusso principale se la sync delle recensioni fallisce
    console.warn('Sync recensioni fallita:', error.message);
  }
  
}


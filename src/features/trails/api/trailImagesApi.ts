import { supabase } from "@/config/supabase";

const BUCKET = 'trail-images';

export interface TrailImage {
  name: string;
  url: string;
}

export const fetchTrailImages = async (trailId: string): Promise<TrailImage[]> => {
  const folderPath = `${trailId}/gallery`;
  
  const { data: files, error } = await supabase.storage
    .from(BUCKET)
    .list(folderPath, {
      limit: 50,
      sortBy: { column: 'name', order: 'asc' },
    });

  // Se la cartella non esiste o è vuota, ritorna array vuoto (gestito come fallback)
  if (error || !files || files.length === 0) return [];

  const imageFiles = files.filter(
    (f) =>
      f.name &&
      !f.name.startsWith('.') &&
      (f.metadata?.mimetype?.startsWith('image/') ||
        /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name))
  );

  return imageFiles.map((file) => {
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(`${folderPath}/${file.name}`);

    return {
      name: file.name,
      url: urlData.publicUrl,
    };
  });
};
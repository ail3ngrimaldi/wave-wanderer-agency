import { supabase } from "@/integrations/supabase/client";

export const uploadMediaFile = async (file: File, packageSlug: string): Promise<string | null> => {
  try {
    // Generar nombre único
    const fileExt = file.name.split('.').pop();
    const fileName = `${packageSlug}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = fileName;

    // Subir archivo
    const { data, error } = await supabase.storage
      .from('package-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('package-media')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadMediaFile:', error);
    return null;
  }
};

export const deleteMediaFile = async (url: string): Promise<boolean> => {
  try {
    // Extraer el path del archivo desde la URL
    const path = url.split('/package-media/')[1];
    if (!path) return false;

    const { error } = await supabase.storage
      .from('package-media')
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteMediaFile:', error);
    return false;
  }
};

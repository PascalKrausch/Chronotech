import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadMedia(file: File): Promise<string> {
  // Eindeutigen Dateinamen generieren, um Überschreibungen zu verhindern
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  // Hochladen in den Bucket "article-media"
  const { error } = await supabase.storage
    .from('article-media')
    .upload(filePath, file);

  if (error) {
    throw new Error(`Upload fehlgeschlagen: ${error.message}`);
  }

  // Öffentliche URL abrufen
  const { data } = supabase.storage
    .from('article-media')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
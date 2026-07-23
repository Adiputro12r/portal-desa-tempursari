import { supabase } from "@/lib/supabase";

/**
 * Upload file single ke Supabase Storage bucket 'uploads'.
 * @param {File} file - File objek dari input file HTML
 * @param {string} folder - Nama subfolder (misal: 'pemerintah', 'berita', 'umkm')
 * @returns {Promise<{ url: string|null, error: Error|null }>}
 */
export async function uploadToSupabase(file, folder = "general") {
  if (!file) return { url: null, error: new Error("No file provided") };

  try {
    // Sanitize filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${cleanFileName}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file ke Supabase Storage bucket 'uploads'
    const { data, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage Upload Error:", uploadError);
      return { url: null, error: uploadError };
    }

    // Dapatkan Public URL
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err) {
    console.error("Storage Helper Error:", err);
    return { url: null, error: err };
  }
}

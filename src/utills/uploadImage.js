

import { supabase } from "../supabaseClient";



export const uploadImage = async (file) => {
  
    console.log("uploadImage is called");
  if (!file) return { error: "No file selected" };

  // Create a unique file name
  const randomNum =  Math.floor(Math.random() * (5000000 - 50000 + 1)) + 50000;
  const fileName= randomNum+ (file.name);

  // Upload to Supabase Storage
  try{
    console.log("entered in try");

  const { data, error } = await supabase.storage
    .from("buc") // Create this bucket in Supabase
    .upload(fileName, file, {
        contentType: file.type, // Ensure file type is valid
        upsert: true, // Allow replacing existing files
    });
    if(error) return {error: error.message};

}catch(e){
    return {error: e.message};
}

  // Get public URL
  const { data: publicData } = supabase.storage
    .from("buc")
    .getPublicUrl(fileName);
    
    console.log("Public URL:", publicData.publicUrl);
    //return publicData.publicUrl;
    return { publicData: publicData };
    
};

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@utils/firebase";
import { storage } from "@utils/firebase";

export default async function getImageURL(file, prodId) {
  if (!file) {
    return;
  }
  const productsImageFolderRef = ref(storage, `products/${prodId}`);
  try {
    await uploadBytes(productsImageFolderRef, file);
    const downloadURL = await getDownloadURL(productsImageFolderRef); // fixed reference
    return downloadURL;
  } catch (error) {
    console.log("Error uploading file:", error);
    return null;
  }
}

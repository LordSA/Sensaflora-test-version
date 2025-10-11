import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  markdownContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getProducts(options: {
  category?: string;
  sortBy?: 'price' | 'createdAt';
  order?: 'asc' | 'desc';
  limit?: number;
}) {
  const { category, sortBy = 'createdAt', order = 'desc', limit: limitCount = 12 } = options;
  const productsRef = collection(db, 'products');
  let q = query(productsRef);

  if (category) {
    q = query(q, where('category', '==', category));
  }

  q = query(q, orderBy(sortBy, order), limit(limitCount));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

export async function getProduct(id: string) {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Product not found');
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Product;
}

export async function addProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
) {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  const docRef = doc(db, 'products', id);
  const product = await getProduct(id);

  // Delete the product image from storage
  if (product.imageUrl) {
    const imageRef = ref(storage, product.imageUrl);
    await deleteObject(imageRef);
  }

  await deleteDoc(docRef);
}

export async function uploadProductImage(file: File) {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
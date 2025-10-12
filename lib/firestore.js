import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';

export const getProducts = async (
  collectionName = 'products',
  conditions = [],
  sortBy = null,
  limitCount = null
) => {
  try {
    let q = collection(db, collectionName);

    if (conditions.length > 0) {
      conditions.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });
    }

    if (sortBy) {
      q = query(q, orderBy(sortBy.field, sortBy.direction));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProduct = async (productId) => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), productData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, productData);
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
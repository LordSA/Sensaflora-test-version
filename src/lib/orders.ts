import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from './products';

export interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'placed' | 'packed' | 'shipped' | 'delivered';
  shippingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'google-pay' | 'cod';
  createdAt: Date;
  updatedAt: Date;
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getOrder(id: string) {
  const docRef = doc(db, 'orders', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Order not found');
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Order;
}

export async function getUserOrders(userId: string) {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
) {
  const docRef = doc(db, 'orders', orderId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}
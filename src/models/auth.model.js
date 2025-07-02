import { db } from '../data/data.js';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where
} from 'firebase/firestore';

const usersCollection = collection(db, 'users');

// Buscar usuario por email
export async function getUsersEmail(email) {
    if (!email) return null;

    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
}

export async function saveUser(userData) {
    const docRef = await addDoc(usersCollection,userData);
    return docRef.id;
}

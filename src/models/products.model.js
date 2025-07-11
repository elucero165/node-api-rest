import { db } from '../data/data.js';
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    setDoc,
    doc,
    query,
    where
} from 'firebase/firestore';

const productsCollection = collection(db, 'products');

export async function getProductById(id) {
    if (!id) return null;
    const productRef = doc(productsCollection, id);
    const productDoc = await getDoc(productRef);
    return productDoc.exists() ? productDoc.data() : null;
}

export async function getAllProducts() {
    const querySnapshot = await getDocs(productsCollection);
    const products = [];
    querySnapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...docSnap.data() });
    });
    return products;
}

/*
export async function saveProduct(product) {
    return await addDoc(productsCollection, product);
}
*/

export async function saveProductWithCustomId(id, product) {
    if (!id) throw new Error("El ID es obligatorio");
    const productRef = doc(productsCollection, id);
    return await setDoc(productRef, product);
}

export async function deleteProduct(id) {
    if (!id) throw new Error("El ID es obligatorio para eliminar");
    const productRef = doc(productsCollection, id);
    await deleteDoc(productRef);
}

export async function updateProductById(id, productData) {
    await setDoc(doc(productsCollection, id), productData, { merge: true });
}

// Opción 1: Búsqueda flexible (parcial, insensible a mayúsculas)
export async function searchProducts({ categoria, descripcion }) {
    const querySnapshot = await getDocs(productsCollection);
    const products = [];

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const matchCategoria = categoria ? (data.category || "").toLowerCase().includes(categoria.toLowerCase()) : true;
        const matchDescripcion = descripcion ? (data.description || "").toLowerCase().includes(descripcion.toLowerCase()) : true;

        if (matchCategoria && matchDescripcion) {
            products.push({ id: docSnap.id, ...data });
        }
    });

    return products;
}

// Opción 2: Búsqueda directa (exacta, más eficiente)
export async function searchProductsExact({ categoria, descripcion }) {
    let q = productsCollection;

    if (categoria && descripcion) {
        q = query(productsCollection, where("category", "==", categoria), where("description", "==", descripcion));
    } else if (categoria) {
        q = query(productsCollection, where("category", "==", categoria));
    } else if (descripcion) {
        q = query(productsCollection, where("description", "==", descripcion));
    }

    const querySnapshot = await getDocs(q);
    const products = [];

    querySnapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...docSnap.data() });
    });

    return products;
}

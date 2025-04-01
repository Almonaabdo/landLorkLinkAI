/*
* FILE        : Functions.js
* 
* Description : Contains related generic databse function that will be utilized from interface screens
* 
* Author      : Abdurrahman Almouna, Yafet Tekleab
* Date        : October 31, 2024
* Version     : 1.0
* 
*/

import { db } from './firebaseConfig';
import { collection, addDoc,setDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

// Create Apartments table
// export const createApartment = async (apartment) => {
//   try {
//     // Check if the ID is valid (4 characters long, alphanumeric)
//     const idRegex = /^[A-Za-z0-9]{4}$/;
//     if (!idRegex.test(apartment.id)) {
//       console.error("Invalid ID format. It must be 4 characters long and alphanumeric.");
//       return;
//     }

//     // Ensure values are valid
//     if (apartment.floor <= 0 || apartment.rooms <= 0 || apartment.est <= 0) {
//       console.error("FLOOR, ROOMS, and EST must be greater than 0.");
//       return;
//     }

//     // Create or update the apartment document in the collection
//     await setDoc(doc(db, "apartments", apartment.id), {
//       floor: apartment.floor,
//       rooms: apartment.rooms,
//       occupied: apartment.occupied,
//       est: apartment.est,
//       userId: apartment.userId
      
//     });

//   } catch (e) {
//     console.error("Error adding apartment: ", e);
//   }
// };

// Add data
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.fromDate(new Date()), // Store as Firestore Timestamp
      });
    return docRef.id; 
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; 
  }
};

// Fetch data
export const fetchDocuments = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to JS Date
        };
    });
    return documents;
};


// Update data
export const updateDocument = async (collectionName, id, data) => {
  const docRef = doc(db, collectionName, id);
  try {
    await updateDoc(docRef, data);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// Delete data
export const deleteDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  try {
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

// Update Status
export const updateStatus = async (requestId, newStatus) => {
    try {
        const requestRef = doc(db, 'repairRequests', requestId);
        await updateDoc(requestRef, {
            status: newStatus,
        });
    } catch (error) {
        console.error("Error updating status:", error);
    }
};

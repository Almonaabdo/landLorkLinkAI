import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// Get user role
export const getUserRole = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data().role;
        }
        return null;
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
};

export const checkPermission = async (requiredRole) => {
    try {
        // Get current user
        const user = auth.currentUser;
        if (!user) return false;

        // Get user role
        const userRole = await getUserRole(user.uid);
        if (!userRole) return false;

        // Role hierarchy: admin > landlord > tenant
        const roleHierarchy = {
            'admin': 3,
            'landlord': 2,
            'tenant': 1
        };

        // Check if user has permission
        return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    } catch (error) {
        // Log error
        console.error('Error checking permission:', error);
        return false;
    }
};
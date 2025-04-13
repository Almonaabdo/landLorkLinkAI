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
import { collection, addDoc, getDoc, setDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

/*
* APARTMENT AND TENANT MANAGEMENT IMPLEMENTATION GUIDE
* 
* 1. DATABASE STRUCTURE
* 
* Apartments Collection:
* - apartmentId (auto-generated)
* - buildingName: string
* - unitNumber: string
* - floor: number
* - rooms: number
* - status: 'available' | 'occupied'
* - monthlyRent: number
* - amenities: string[]
* - maxOccupants: number
* - currentOccupants: number
* - createdAt: timestamp
* - updatedAt: timestamp
* 
* TenantApartments Collection:
* - id (auto-generated)
* - userId: string (reference to user)
* - apartmentId: string (reference to apartment)
* - status: 'active' | 'inactive' | 'pending'
* - role: 'primary' | 'secondary'
* - leaseStartDate: timestamp
* - leaseEndDate: timestamp
* - createdAt: timestamp
* - updatedAt: timestamp
* 
* Users Collection (Update):
* - Add apartmentId reference
* - Add leaseStartDate
* - Add leaseEndDate
* 
* 2. CORE FUNCTIONS TO IMPLEMENT
* 
* Apartment Management:
* - createApartment(apartmentData)
* - updateApartment(apartmentId, updateData)
* - deleteApartment(apartmentId)
* - getApartment(apartmentId)
* - getAllApartments()
* - getAvailableApartments()
* 
* Tenant Assignment:
* - assignTenant(userId, apartmentId, leaseData)
* - removeTenant(userId, apartmentId)
* - getApartmentTenants(apartmentId)
* - getTenantApartment(userId)
* - updateTenantRole(userId, apartmentId, newRole)
* 
* Lease Management:
* - createLease(tenantApartmentId, leaseData)
* - updateLease(tenantApartmentId, updateData)
* - endLease(tenantApartmentId)
* - getLeaseDetails(tenantApartmentId)
* 
* 3. VALIDATION RULES
* 
* Apartment Validation:
* - Check if apartment exists
* - Validate apartment status
* - Check occupant limits
* - Validate required fields
* 
* Tenant Validation:
* - Check if user exists
* - Validate user role
* - Check if user already has active lease
* - Validate lease dates
* 
* 4. ERROR HANDLING
* 
* Common Errors:
* - Apartment not found
* - User not found
* - Apartment full
* - Invalid lease dates
* - User already assigned
* - Permission denied
* 
* 5. SECURITY RULES
* 
* Access Control:
* - Only landlords/admins can create apartments
* - Only landlords/admins can assign tenants
* - Tenants can only view their own apartment
* - Validate user roles for all operations
* 
* 6. QUERY EXAMPLES
* 
* Common Queries:
* - Get all apartments for a building
* - Get all tenants in an apartment
* - Get all available apartments
* - Get tenant's current apartment
* - Get apartment's rental history
* 
* 7. UI COMPONENTS NEEDED
* 
* Screens:
* - ApartmentListScreen
* - ApartmentDetailScreen
* - TenantAssignmentScreen
* - LeaseManagementScreen
* 
* Components:
* - ApartmentCard
* - TenantList
* - LeaseForm
* - AssignmentForm
* 
* 8. TESTING REQUIREMENTS
* 
* Test Cases:
* - Apartment creation/update
* - Tenant assignment/removal
* - Lease creation/update
* - Permission checks
* - Error handling
* - Edge cases
* 
* 9. IMPLEMENTATION ORDER
* 
* Phase 1:
* - Database structure setup
* - Basic CRUD operations
* - Simple tenant assignment
* 
* Phase 2:
* - Multiple tenant support
* - Lease management
* - Advanced queries
* 
* Phase 3:
* - UI implementation
* - Security rules
* - Testing
* 
* Phase 4:
* - Error handling
* - Edge cases
* - Documentation
*/

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
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(), // Convert Firestore Timestamp to JS Date
        createdBy: data.createdBy || null, // Ensure createdBy is included
      };
    });
    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

// Fetch data by ID
export const fetchDocumentByID = async (docRef) => {
  try {
    if (!docRef) {
      throw new Error('Document reference is required');
    }

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Document not found');
    }

    return docSnap.data();
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error; // Re-throw the error so callers can handle it
  }
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

// Apartment Management Functions

// Create a new apartment
async function createApartment(apartmentData) {
  // 1. Validate apartment data
  // 2. Check if apartment with same unit number exists
  // 3. Create apartment document with initial status 'available'
  // 4. Set createdAt and updatedAt timestamps
  // 5. Return the new apartment ID
}

// Update apartment details
async function updateApartment(apartmentId, updateData) {
  // 1. Validate apartment exists
  // 2. Validate update data
  // 3. Update apartment document
  // 4. Update updatedAt timestamp
  // 5. Return success status
}

// Delete an apartment
async function deleteApartment(apartmentId) {
  // 1. Check if apartment exists
  // 2. Check if apartment has active tenants
  // 3. Delete apartment document
  // 4. Return success status
}

// Get apartment details
async function getApartment(apartmentId) {
  // 1. Fetch apartment document
  // 2. Include current tenant count
  // 3. Include current status
  // 4. Return apartment data
}

// Get all apartments
async function getAllApartments() {
  // 1. Fetch all apartment documents
  // 2. Include current tenant count for each
  // 3. Sort by building and unit number
  // 4. Return array of apartments
}

// Get available apartments
async function getAvailableApartments() {
  // 1. Query apartments where status is 'available'
  // 2. Include relevant details
  // 3. Sort by building and unit number
  // 4. Return array of available apartments
}

// Tenant Assignment Functions

// Assign tenant to apartment
async function assignTenant(userId, apartmentId, leaseData) {
  // 1. Check apartment availability
  // 2. Create tenant-apartment relationship
  // 3. Update apartment status
  // 4. Update user reference
}

// Remove tenant from apartment
async function removeTenant(userId, apartmentId) {
  // 1. Update tenant-apartment status to inactive
  // 2. Update apartment occupant count
  // 3. Remove user's apartment reference
}

// Get all tenants in an apartment
async function getApartmentTenants(apartmentId) {
  // 1. Query active tenant-apartment relationships
  // 2. Fetch user details for each tenant
  // 3. Include lease information
  // 4. Return array of tenant objects
}

// Get tenant's current apartment
async function getTenantApartment(userId) {
  // 1. Query active tenant-apartment relationship
  // 2. Fetch apartment details
  // 3. Include lease information
  // 4. Return apartment object with lease details
}

// Update tenant role in apartment
async function updateTenantRole(userId, apartmentId, newRole) {
  // 1. Validate role change is allowed
  // 2. Update tenant-apartment relationship
  // 3. Update updatedAt timestamp
  // 4. Return success status
}

// Lease Management Functions

// Create lease agreement
async function createLease(tenantApartmentId, leaseData) {
  // 1. Validate lease data
  // 2. Check for date conflicts
  // 3. Create lease document
  // 4. Update tenant-apartment relationship
  // 5. Return lease ID
}

// Update lease details
async function updateLease(tenantApartmentId, updateData) {
  // 1. Validate lease exists
  // 2. Validate update data
  // 3. Update lease document
  // 4. Update updatedAt timestamp
  // 5. Return success status
}

// End lease agreement
async function endLease(tenantApartmentId) {
  // 1. Update lease status to 'ended'
  // 2. Update tenant-apartment status
  // 3. Update apartment status if needed
  // 4. Return success status
}

// Get lease details
async function getLeaseDetails(tenantApartmentId) {
  // 1. Fetch lease document
  // 2. Include tenant and apartment details
  // 3. Include payment history
  // 4. Return lease object with all details
}

// UI Implementation Steps

// ApartmentListScreen.js
/*
1. Create screen component
2. Implement apartment list view
   - Use FlatList for performance
   - Add pull-to-refresh
   - Add search functionality
3. Add apartment card component
   - Show basic apartment info
   - Show status badge
   - Add action buttons
4. Add filters
   - Filter by status
   - Filter by building
   - Filter by price range
5. Add sorting options
   - Sort by price
   - Sort by unit number
   - Sort by status
*/

// ApartmentDetailScreen.js
/*
1. Create screen component
2. Show apartment details
   - Basic information
   - Amenities
   - Current tenants
   - Lease information
3. Add edit functionality
   - Update apartment details
   - Add/remove amenities
4. Add tenant management
   - View current tenants
   - Add new tenants
   - Remove tenants
5. Add lease management
   - View current lease
   - Create new lease
   - End existing lease
*/

// TenantAssignmentScreen.js
/*
1. Create screen component
2. Add tenant search/selection
   - Search by name
   - Search by email
   - Show user details
3. Add apartment selection
   - Show available apartments
   - Filter by criteria
4. Add lease form
   - Start date
   - End date
   - Rent amount
   - Terms and conditions
5. Add validation
   - Check apartment availability
   - Check tenant eligibility
   - Validate lease dates
*/

// Security Rules Implementation
/*
1. Firestore Rules 
   - Apartments collection
     - Read: authenticated users
     - Create: landlords and admins
     - Update: landlords and admins
     - Delete: admins only
   - TenantApartments collection
     - Read: authenticated users
     - Create: landlords and admins
     - Update: landlords and admins
     - Delete: admins only
   - Users collection
     - Read: self and admins
     - Update: self and admins
     - Delete: admins only

2. Role-based Access Control
   - Implement role checking middleware
   - Add role validation to all operations
   - Handle unauthorized access errors
*/

// Testing Implementation
/*
1. Unit Tests
   - Database functions
     - Create apartment
     - Update apartment
     - Delete apartment
     - Assign tenant
     - Remove tenant
   - Validation functions
     - Data validation
     - Role validation
     - Date validation

2. Integration Tests
   - Tenant assignment flow
   - Lease management flow
   - Apartment management flow

3. UI Tests
   - Screen navigation
   - Form validation
   - Error handling
   - Loading states
*/

// Error Handling Implementation
/*
1. Database Errors
   - Handle connection issues
   - Handle permission errors
   - Handle validation errors
   - Handle concurrent updates

2. UI Errors
   - Show error messages
   - Handle loading states
   - Handle network errors
   - Handle validation errors

3. Business Logic Errors
   - Handle invalid operations
   - Handle conflicting states
   - Handle edge cases
*/

// Documentation
/*
1. API Documentation
   - Function signatures
   - Parameter descriptions
   - Return values
   - Error cases

2. UI Documentation
   - Screen layouts
   - Component hierarchy
   - State management
   - User flows

3. Database Documentation
   - Collection structure
   - Field descriptions
   - Relationships
   - Indexes
*/

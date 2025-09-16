import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from './firebase';

export const getUserStats = async () => {
  // TODO: This should be implemented on the backend
  console.warn('User stats are not being fetched from the backend. Returning dummy data.');
  return {
    totalUsers: 1000, // Dummy data
    activeTraders: 500 // Dummy data
  };
  /* try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getCountFromServer(usersCollection);
    return {
      totalUsers: snapshot.data().count,
      activeTraders: snapshot.data().count // For now, assume all users are active
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalUsers: 0,
      activeTraders: 0
    };
  } */
};
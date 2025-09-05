import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from './firebase';

export const getUserStats = async () => {
  try {
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
  }
};
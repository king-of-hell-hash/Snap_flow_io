import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

export async function logUsage(actionType: string, details: string) {
  const user = auth.currentUser;
  if (!user) return; // Only log for signed-in users

  try {
    await addDoc(collection(db, 'usageLogs'), {
      userId: user.uid,
      actionType,
      details,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to log usage to history:", error);
  }
}

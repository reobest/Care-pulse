import { getDocs , collection } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
export const fetchAppointments = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "Appointment"));
        const fetched: any = [];
        querySnapshot.forEach((doc) => {
            fetched.push({ id: doc.id, ...doc.data() });
        });
        return fetched
    } catch (error) {
        console.log(error);
        
    }
}

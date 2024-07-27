import { NextResponse } from 'next/server';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig'; // Adjust the import based on your Firebase setup

// Function to fetch appointments
const fetchAppointments = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'Appointment'));
        const fetched: any[] = [];
        querySnapshot.forEach((doc) => {
            fetched.push({ id: doc.id, ...doc.data() });
        });
        return fetched;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw new Error('Failed to fetch appointments');
    }
};

export async function GET(request: Request) {
    try {
        const appointments = await fetchAppointments();
        return NextResponse.json(appointments);
    } catch (error) {
        console.error('Error handling GET request:', error);
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

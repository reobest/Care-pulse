import { NextResponse } from 'next/server';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig'; // Adjust the import based on your Firebase setup

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'Appointment'));
        const fetched: any = [];
        querySnapshot.forEach((doc) => {
            fetched.push({ id: doc.id, ...doc.data() });
        });
        const doctor = fetched.find((doctor: any) => doctor.id === id);
        return NextResponse.json(doctor || {});
    } catch (error) {
        console.error('Error fetching doctor:', error);
        return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
    }
}

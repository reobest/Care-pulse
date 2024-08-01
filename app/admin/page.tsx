"use client"
import CustomCards from '@/components/CustomCards'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/table/data-table'
import { columns } from '@/components/table/columns'
import { Count } from '@/lib/utils'
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
const Admin =  () => {
    const [appointments, setAppointments] = useState<any[]>([]); 
    useEffect(() => {
        const fetchAppointments = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, 'Appointment'));
            const fetched: any[] = [];
            querySnapshot.forEach((doc) => {
                fetched.push({ id: doc.id, ...doc.data() });
            });
            setAppointments(fetched)
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw new Error('Failed to fetch appointments');
        }
        };

        fetchAppointments();
    }, []);
  return (
    <div className='w-full min-h-screen flex flex-col items-center'>
      <header className='w-[98vw] h-[50px] flex justify-between items-center p-3 bg-dark-200 rounded-md'>
        <Link href='/'>
          <Image
            src='/assets/icons/logo-full.svg'
            alt='logo'
            width={120}
            height={70}
          />
        </Link>
        <p>Admin</p>
      </header>
      <section className='flex flex-col space-y-4 mt-8 w-[95vw]'>
        <h1 className='text-4xl'>Welcome, Admin</h1>
        <p className='text-slate-600 text-xs'>starting day with making new appointments</p>
      </section>
      <section className='flex flex-wrap w-[95vw] justify-center gap-4  mt-8 items-center'>
        <CustomCards
          type="appointments"
          count={Count("schedule",appointments)}
          label="Scheduled appointments"
          icon={"/assets/icons/appointments.svg"}
        />
        <CustomCards
          type="pending"
          count={Count("pending",appointments)}
          label="Pending appointments"
          icon={"/assets/icons/pending.svg"}
        />
        <CustomCards
          type="cancelled"
          count={Count("cancel",appointments)}
          label="Cancelled appointments"
          icon={"/assets/icons/cancelled.svg"}
        />
      </section>
      <section className='w-full data-table-scroll-bar overflow-scroll'>
        <DataTable columns={columns} data={appointments}/>
      </section>
      
    </div>
  )
}

export default Admin
"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Doctors } from '@/constants'
import Link from 'next/link'
import {  useRouter } from 'next/navigation'
const AppointmentSuccess =  ({ searchParams: { id } }: { searchParams: any }) => {
    const router = useRouter()
    const [appointment, setAppointment] = useState<any>(null);
    const [newdoc, setNewdoc] = useState<any>(null);
    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await fetch(`/api/fetch-doctor?id=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch doctor');
                }
                const data = await response.json();
                setAppointment(data);
                const doctor : any = Doctors.find((doc) => doc.name === data?.primaryPhysician);
                setNewdoc(doctor);
            } catch (error) {
                console.error('Error fetching doctor:', error);
            }
        };
        fetchDoctor();
    }, [id]);
    useEffect(() => {
        const sendMessageAndRedirect = async () => {
            try {
                const response = await fetch('/api/send-message', {method: 'POST',});
                if (!response.ok) {
                    throw new Error('Failed to send message');
                }
                setTimeout(() => {
                    router.push('/');
                }, 5000);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        };
        sendMessageAndRedirect();
    }, [router]);

    return (
        <div className='w-full h-[800px] sm:h-screen min-h-screen flex justify-center items-start bg-dark-200'>
            <div className='w-[600px] flex flex-col gap-3 items-center mt-[50px]'>
                <Image
                    src="/assets/icons/logo-full.svg"
                    width={150}
                    height={100}
                    alt='logo'
                />
                <Image
                    src="/assets/gifs/success.gif"
                    width={200}
                    height={200}
                    alt='logo'
                    className='mt-[30px]'
                />
                <h1 className='text-3xl text-center mt-4'>
                    your <span className='text-green-400'>Appointment Request</span> has been successfully submitted!
                </h1>
                <p className='text-xs mt-6'>We will be in touch shortly to confirm.</p>
                <hr className='border-slate-900 w-full mt-4' />
                <div className='w-full flex flex-col items-center gap-3 sm:flex-row justify-between mt-3'>
                    <span>Requested appointment details :</span>
                    <span className='flex gap-3'>
                        <Image
                            src={newdoc?.image && `${newdoc?.image}`}
                            alt='doctor-image'
                            height={20}
                            width={20}
                        />
                        {newdoc?.name}
                    </span>
                    <span>{appointment?.schedule}</span>
                </div>
                <hr className='border-slate-900 w-full mt-4' />
                <div className='flex items-center gap-3'>
                    <Link href={`/patients/${appointment?.Patientid}/new-appintment`}> <button className='w-[200px] h-[35px] text-white flex justify-center items-center bg-green-400 mt-6 rounded-sm'>
                        New Appointment
                    </button>
                    </Link>
                    <Link href={`/`}> <button className='w-[200px] h-[35px] text-white flex justify-center items-center bg-green-400 mt-6 rounded-sm'>
                        Home
                    </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AppointmentSuccess
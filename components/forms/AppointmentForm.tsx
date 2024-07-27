"use client"
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { db } from '@/firebase/firebaseConfig'
import { SelectItem } from "@/components/ui/select";
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import CustomFormField from '../CustomFormField'
import { useRouter } from 'next/navigation'
import { Doctors } from '@/constants'
import Image from 'next/image'
import { format } from 'date-fns';
export const CreateAppointmentSchema = z.object({
    primaryPhysician: z.string().min(2, "Select at least one doctor"),
    schedule: z.string(),
    reason: z
        .string()
        .min(2, "Reason must be at least 2 characters")
        .max(500, "Reason must be at most 500 characters"),
    note: z.string().optional(),
    cancel: z.string().optional(),
});
type AppointmentFormTypes = {
    id?: string;
    name?: string | null;
    type?: string;
    userId?: string;
}
const RegisterForm = ({ id, name, type, userId }: AppointmentFormTypes) => {
    const [startDate, setStartDate] = useState(new Date());
    const formatedDate = format(startDate, "HH:mm:ss EEEE MMM dd yyyy")
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateAppointmentSchema>>({
        resolver: zodResolver(CreateAppointmentSchema),
        defaultValues: {
            primaryPhysician: "",
            schedule: formatedDate,
            reason: "",
            note: "",
            cancel: "",
        },

    })

    async function onSubmit(values: z.infer<typeof CreateAppointmentSchema>) {

        const UserData = {
            Patientname: name,
            Patientid: id,
            primaryPhysician: values.primaryPhysician,
            schedule: formatedDate as string,
            reason: values.reason,
            note: values.note,
            type: "pending",
        }
        if (type === 'pending') {
            const docRef = await addDoc(collection(db, "Appointment"), UserData);
            if (docRef) {
                router.push(`/patients/${id}/new-appintment/success?id=${docRef.id}`)
            }
        }
        if (type === 'schedule' && userId) {
            const updatedData = {
                primaryPhysician: values.primaryPhysician,
                schedule: values.schedule,
                reason: values.reason,
                type: 'schedule',
            };
            const docRef = doc(db, "Appointment", userId as string);
            await updateDoc(docRef, updatedData)

            router.push(`/`);
        }
    }
    const handlesubmit = async () => {
        if (type === 'cancel' && userId) {
            const updatedData = {
                cancellationReason: form.getValues().reason,
                type: 'cancel',
            };
            const docRef = doc(db, "Appointment", userId as string);
            await updateDoc(docRef, updatedData)
            router.push(`/`);
        }
    }
    const handleClick = () => {
        console.log(startDate);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[80%]">
                {type === 'pending' && (
                    <>
                        <button onClick={handleClick}>Rayan</button>
                        <h1 className='text-white w-[100%] text-start text-3xl font-semibold my-8'>New Appointment</h1>
                        <p className='text-slate-400 w-[100%] text-start text-xs my-8'>Request a new appointment in 10 secondes</p>
                        <CustomFormField
                            filedtype='select'
                            form={form.control}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a physician"
                        >
                            {Doctors.map((doctor, i) => (
                                <SelectItem key={doctor.name + i} value={doctor.name}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image}
                                            width={32}
                                            height={32}
                                            alt="doctor"
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>
                        <div className="flex flex-col mt-6 w-full space-y-3">
                            <h3 className='text-[15px]'>Expected appointment date</h3>
                            <div className="flex items-center w-full h-[40px] rounded-md border border-dark-500 bg-dark-400">
                                <Image
                                    src="/assets/icons/calendar.svg"
                                    height={20}
                                    width={20}
                                    alt="user"
                                    className="ml-2"
                                />
                                <DatePicker
                                    className='cursor-pointer flex text-center text-sm'
                                    selected={startDate}
                                    onChange={(date: any) => setStartDate(date)}
                                    dateFormat='MM/dd/yyyy'
                                    showTimeSelect={true}
                                    timeInputLabel='Time:'
                                />
                            </div>
                        </div>
                        <CustomFormField
                            form={form.control}
                            label="Family medical history"
                            placeholder="Reason for appointments"
                            name="reason"
                            filedtype='textarea'
                            styles="md:w-[100%] my-4"
                        />
                        <CustomFormField
                            form={form.control}
                            label="Notes"
                            placeholder="Notes"
                            name="note"
                            filedtype='textarea'
                            styles="md:w-[100%] my-4"
                        />
                    </>
                )}
                {type === 'schedule' && (
                    <div className='w-full flex flex-col items-start'>
                        <CustomFormField
                            filedtype='select'
                            form={form.control}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a physician"
                        >
                            {Doctors.map((doctor, i) => (
                                <SelectItem key={doctor.name + i} value={doctor.name}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image}
                                            width={32}
                                            height={32}
                                            alt="doctor"
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>
                        <CustomFormField
                            form={form.control}
                            label="Reason for appointments"
                            placeholder="Ex : annual or monthly checkup"
                            name="reason"
                            filedtype='textarea'
                            styles="md:w-[100%] my-4"
                        />
                        <CustomFormField
                            form={form.control}
                            label="Expected appointment date"
                            name="birthDate"
                            filedtype='date-picker'
                            styles="mb-4 mt-4"
                        />
                    </div>
                )}
                {type === 'cancel' && (
                    <div className='w-full'>
                        <CustomFormField
                            form={form.control}
                            label="Reason for appointments"
                            placeholder="Ex : annual or monthly checkup"
                            name="reason"
                            filedtype='textarea'
                            styles="md:w-[100%] my-4"
                        />
                    </div>
                )}
                <Button type="submit" className={`bg-green-500 w-[100%] h-[30px] mt-[50px] ${(type === 'schedule' || type === 'cancel') && 'w-[125%]'}`} onClick={handlesubmit}>Submit</Button>
            </form>
        </Form>
    )
}

export default RegisterForm
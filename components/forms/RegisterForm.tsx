"use client"
import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl } from "@/components/ui/form"
import { db } from '@/firebase/firebaseConfig'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import CustomFormField from '../CustomFormField'
import { useRouter } from 'next/navigation'
import { Doctors, GenderOptions, IdentificationTypes, Labels, PlaceHolders } from '@/constants'
import Image from 'next/image'
import { FileUploader } from "@/components/FileUploader";

export const PatientFormValidation = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
        .string()
        .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
    birthDate: z.coerce.date(),
    gender: z.enum(["Male", "Female", "Other"]),
    address: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(500, "Address must be at most 500 characters"),
    occupation: z
        .string()
        .min(2, "Occupation must be at least 2 characters")
        .max(500, "Occupation must be at most 500 characters"),
    emergencyContactName: z
        .string()
        .min(2, "Contact name must be at least 2 characters")
        .max(50, "Contact name must be at most 50 characters"),
    emergencyContactNumber: z
        .string()
        .refine(
            (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
            "Invalid phone number"
        ),
    primaryPhysician: z.string().min(2, "Select at least one doctor"),
    insuranceProvider: z
        .string()
        .min(2, "Insurance name must be at least 2 characters")
        .max(50, "Insurance name must be at most 50 characters"),
    insurancePolicyNumber: z
        .string()
        .min(2, "Policy number must be at least 2 characters")
        .max(50, "Policy number must be at most 50 characters"),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
    identificationType: z.string().optional(),
    identificationNumber: z.string().optional(),
    identificationDocument: z.custom<File[]>().optional(),
    treatmentConsent: z
        .boolean()
        .default(false)
        .refine((value) => value === true, {
            message: "You must consent to treatment in order to proceed",
        }),
    disclosureConsent: z
        .boolean()
        .default(false)
        .refine((value) => value === true, {
            message: "You must consent to disclosure in order to proceed",
        }),
    privacyConsent: z
        .boolean()
        .default(false)
        .refine((value) => value === true, {
            message: "You must consent to privacy in order to proceed",
        }),
});

const RegisterForm = ({ id }: { id: string }) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            birthDate: new Date(Date.now()),
            gender: "Male",
            address: "",
            occupation: "",
            emergencyContactName: "",
            emergencyContactNumber: "",
            primaryPhysician: "",
            insuranceProvider: "",
            insurancePolicyNumber: "",
            allergies: "",
            currentMedication: "",
            familyMedicalHistory: "",
            pastMedicalHistory: "",
            identificationType: "",
            identificationNumber: "",
            identificationDocument: [],
            treatmentConsent: false,
            disclosureConsent: false,
            privacyConsent: false,
        },
    })
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        try {
            if (!values.identificationDocument || values.identificationDocument.length === 0) {
                throw new Error('No identification document selected');
            }
            const storage = getStorage();
            const storageRef = ref(storage, `identification_documents/${values.identificationDocument[0].name}`);
            const uploadTask = uploadBytesResumable(storageRef, values.identificationDocument[0]);
            uploadTask.on('state_changed',
                (snapshot: any) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error: any) => {
                    console.error('Upload error:', error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const UserData = {
                        patientid: id,
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                        birthDate: new Date(Date.now()),
                        gender: values.gender,
                        address: values.address,
                        occupation: values.occupation,
                        emergencyContactName: values.emergencyContactName,
                        emergencyContactNumber: values.emergencyContactNumber,
                        primaryPhysician: values.primaryPhysician,
                        insuranceProvider: values.insuranceProvider,
                        insurancePolicyNumber: values.insurancePolicyNumber,
                        allergies: values.allergies,
                        currentMedication: values.currentMedication,
                        familyMedicalHistory: values.familyMedicalHistory,
                        pastMedicalHistory: values.pastMedicalHistory,
                        identificationType: values.identificationType,
                        identificationNumber: values.identificationNumber,
                        identificationDocument: downloadURL,
                        treatmentConsent: values.treatmentConsent,
                        disclosureConsent: values.disclosureConsent,
                        privacyConsent: values.privacyConsent,
                    }
                    const docRef = await addDoc(collection(db, "Patient"), UserData);
                    if (docRef) {
                        router.push(`/patients/${docRef.id}/new-appintment?name=${values.name}`)
                    }
                })
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[80%]">
                <h1 className='text-white w-[100%] text-start text-3xl font-semibold my-8'>Personal Information</h1>
                <CustomFormField
                    form={form.control}
                    label={Labels.LabelOne}
                    placeholder={PlaceHolders.FirstPlaceHolder}
                    name="name"
                    filedtype='input'
                    styles="w-[100%]"
                />
                <div className='w-full flex flex-col md:flex-row md:justify-between gap-3 mt-6'>
                    <CustomFormField
                        form={form.control}
                        label={Labels.LabelTwo}
                        placeholder={PlaceHolders.SecondPlaceHolder}
                        name="email"
                        filedtype='input'
                        styles="md:w-[40%]"
                    />
                    <CustomFormField
                        form={form.control}
                        label={Labels.LabelThree}
                        placeholder={PlaceHolders.ThirdPlaceHolder}
                        name="phone"
                        filedtype='phone-number'
                        styles=""
                    />
                </div>
                <div className='w-full flex flex-col md:flex-row md:justify-between gap-3 mt-5'>
                    <CustomFormField
                        form={form.control}
                        label={Labels.LabelFour}
                        name="birthDate"
                        filedtype='date-picker'
                        styles="mb-4"
                    />
                    <CustomFormField
                        filedtype='gender'
                        form={form.control}
                        name="gender"
                        label={Labels.labelFive}
                        renderSkeleton={(field: any) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-8 gap-5 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {GenderOptions.map((option, i) => (
                                        <div key={option + i} className="radio-group">
                                            <RadioGroupItem value={option} id={option} />
                                            <Label htmlFor={option} className="cursor-pointer">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>
                <div className='w-full flex flex-col md:flex-row md:justify-between mt-4'>
                    <CustomFormField
                        form={form.control}
                        label={Labels.LabelSix}
                        placeholder={PlaceHolders.ForthPlaceHolder}
                        name="address"
                        filedtype='input'
                        styles="md:w-[40%]"
                    />
                    <CustomFormField
                        form={form.control}
                        label={Labels.LabelSeven}
                        placeholder={PlaceHolders.FifthPlaceHolder}
                        name="occupation"
                        filedtype='input'
                        styles="md:w-[40%]"
                    />
                </div>
                <div className='w-full flex flex-col md:flex-row md:justify-between gap-3 mt-4'>
                    <CustomFormField
                        form={form.control}
                        label="Emergancy contact name"
                        placeholder="Guardian's name  "
                        name="emergencyContactName"
                        filedtype='input'
                        styles="md:w-[40%]"
                    />
                    <CustomFormField
                        form={form.control}
                        label="Emergancy contact number"
                        name="emergencyContactNumber"
                        filedtype='phone-number'
                        styles=""
                    />
                </div>
                <h1 className='text-white w-[100%] text-start text-3xl font-semibold my-8'>Medical Information</h1>


                <div className='w-full mt-4'>
                    <CustomFormField
                        filedtype='select'
                        form={form.control}
                        name="primaryPhysician"
                        label="Primary care physician"
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
                </div>
                <div className='w-full flex flex-col md:flex-row md:justify-between gap-3 mt-4'>
                    <CustomFormField
                        form={form.control}
                        label="Insurance provider"
                        placeholder="BlueCross BlueShield"
                        name="insuranceProvider"
                        filedtype='input'
                        styles="md:w-[40%]"
                    />
                    <CustomFormField
                        form={form.control}
                        label="Insurance number"
                        placeholder="aBC12345678"
                        name="insurancePolicyNumber"
                        filedtype='input'
                        styles="md:w-[40%]"
                    />
                </div>
                <div className='w-full flex flex-col md:flex-row md:justify-between  mt-4'>
                    <CustomFormField
                        form={form.control}
                        label="Family medical history"
                        placeholder="mother had brain cancer,father had heart disease"
                        name="familyMedicalHistory"
                        filedtype='textarea'
                        styles="md:w-[40%]"
                    />
                    <CustomFormField
                        form={form.control}
                        label="past medical history"
                        placeholder="Appendectomy,Tonsillectomy"
                        name="pastMedicalHistory"
                        filedtype='textarea'
                        styles="md:w-[40%]"
                    />
                </div>
                <h1 className='text-white w-[100%] text-start text-3xl font-semibold my-8'>Identification and Verification</h1>
                <div className='w-full  mt-4'>
                    <CustomFormField
                        filedtype='select'
                        form={form.control}
                        name="identificationType"
                        label="identification type"
                        placeholder="Select identification type"
                    >
                        {IdentificationTypes.map((type, i) => (
                            <SelectItem key={type + i} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </CustomFormField>
                </div>
                <CustomFormField
                    form={form.control}
                    label="Identification Number"
                    placeholder="123456789"
                    name="identificationNumber"
                    filedtype='input'
                    styles="w-[100%] mt-4"
                />
                <CustomFormField
                    filedtype="skeleton"
                    form={form.control}
                    name="identificationDocument"
                    label="Scanned Copy of Identification Document"
                    styles='mt-4'
                    renderSkeleton={(field: any) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange} />
                        </FormControl>
                    )}
                />
                <h1 className='text-white w-[100%] text-start text-3xl font-semibold my-8'>Consent and Privacy</h1>
                <div className='w-full flex flex-col  justify-start gap-6  mt-4'>
                    <CustomFormField
                        filedtype="checkbox"
                        form={form.control}
                        name="treatmentConsent"
                        cblabel="I consent to receive treatment for my health condition."
                    />

                    <CustomFormField
                        filedtype="checkbox"
                        form={form.control}
                        name="disclosureConsent"
                        cblabel="I consent to the use and disclosure of my health
            information for treatment purposes."
                    />

                    <CustomFormField
                        filedtype="checkbox"
                        form={form.control}
                        name="privacyConsent"
                        cblabel="I acknowledge that I have reviewed and agree to the
            privacy policy"
                    />
                </div>
                <Button type="submit" className='bg-green-500 w-[100%] h-[30px] mt-[50px]'>Submit</Button>
            </form>
        </Form>
    )
}

export default RegisterForm
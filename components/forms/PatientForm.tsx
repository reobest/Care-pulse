"use client"
import React  from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { db } from '@/firebase/firebaseConfig'
import { Form } from "@/components/ui/form"
import CustomFormField from '../CustomFormField'
import { collection, addDoc , getDocs , where , query } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { Labels, PlaceHolders } from '@/constants'
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phonenumber: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

const PatientForm = ({userExists,setUserExits} : {userExists:boolean,setUserExits:any}) => {
  
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phonenumber: "",
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const UserData = {
        name: values.name,
        email: values.email,
        phonenumber: values.phonenumber,
      }
      const usersRef = collection(db, "User");
      const q = query(usersRef, where("email", "==", UserData.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setUserExits(true)
        setTimeout(() => {
          setUserExits(false)
          querySnapshot.forEach((doc) => {
            const userId = doc.id;
            router.push(`/patients/${userId}/register`)
          });
        }, 2000);
        return; 
      }
      const docRef = await addDoc(usersRef, UserData);
      if(docRef){
        router.push(`/patients/${docRef.id}/register`)
      }
    } catch (error) {
      console.log(error);
    }

  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[80%] mt-[50px]">
        <CustomFormField
          form={form.control}
          label={Labels.LabelOne}
          placeholder={PlaceHolders.FirstPlaceHolder}
          name="name"
          filedtype='input'
          styles="flex flex-col gap-[10px] mb-4"
        />
        <CustomFormField
          form={form.control}
          label={Labels.LabelTwo}
          placeholder={PlaceHolders.SecondPlaceHolder}
          name="email"
          filedtype='input'
          styles="flex flex-col gap-[10px] mb-4"
        />
        <CustomFormField
          form={form.control}
          label={Labels.LabelThree}
          placeholder={PlaceHolders.ThirdPlaceHolder}
          name="phonenumber"
          filedtype='phone-number'
          styles="flex flex-col gap-[10px]"
        />
        <Button type="submit" className='bg-green-500 w-[100%] h-[30px] mt-[20px]'>Submit</Button>
      </form>
    </Form>
  )
}

export default PatientForm
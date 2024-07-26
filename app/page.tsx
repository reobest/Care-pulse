"use client"
import { useState } from "react";
import Image from "next/image";
import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import PasskeyModal from "@/components/PasskeyModal";
export default function Home() {
  const [userExists, setUserExits] = useState(false)
  return (
    <div className="text-white min-h-screen w-full flex flex-col md:flex-row">
      <div className=" w-[100%] md:w-[50%] flex flex-col justify-between items-center p-6">
        <div className="w-[80%] flex justify-start gap-2">
          <Image src='/assets/icons/logo-full.svg' alt="logo" width={100} height={100} />
        </div>
        <div className="w-full h-[500px] flex flex-col items-center">
          <h1 className="mt-[20px] text-3xl w-[80%] font-medium text-start">Hi there,....</h1>
          <p className="mt-[20px] text-xs w-[80%] text-slate-200 text-start">Get Started with Appointments.</p>
          <PatientForm userExists={userExists} setUserExits={setUserExits} />
        </div>
        {userExists &&

          (
            <p className="text-green-400 text-md w-[100%] text-center"> User Exists</p>
          )
        }
        <div className="w-[80%] flex justify-between">
          <span className="text-[9px] text-slate-500 w-[80%] text-start">CarePulse copyright</span>
          <Link href={{ pathname: '/', query: { admin: 'true' } }} className="text-sm">
             <PasskeyModal />
          </Link>
        </div>

      </div>
      <div className="md:w-[50%] min-h-screen">
        <Image
          src="/assets/images/onboarding-img.png"
          alt="home-image"
          width={500}
          height={1000}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

import RegisterForm from '@/components/forms/RegisterForm'
import Image from 'next/image'
import React from 'react'

const page = ({params}: {params:any}) => {
  return (
    <div className="text-white min-h-screen w-full flex flex-col md:flex-row">
      <div className="w-[100%] md:w-[60%] min-h-screen  flex flex-col justify-start items-center p-6">
        <div className="w-[80%] flex justify-start gap-2">
          <Image src='/assets/icons/logo-full.svg' alt="logo" width={100} height={100} />
        </div>
        <div className="w-full  flex flex-col items-center mt-[50px]">
        <h1 className="mt-[20px] text-3xl w-[80%] font-medium text-start">Hi there,....</h1>
        <p className="mt-[20px] text-xs w-[80%] text-slate-200 text-start">Get Started with Appointments.</p>
        <RegisterForm id={params?.id} />
        </div>
        <p className="text-[9px] text-slate-500 w-[80%] text-start mt-5">CarePulse copyright</p>
      </div>
      <div className="md:w-[40%] min-h-screen">
        <Image
          src="/assets/images/register-img.png"
          alt="home-image"
          width={500}
          height={1000}
          className="h-full w-full"
        />
      </div>
    </div>
  )
}

export default page
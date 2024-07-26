"use client"
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRouter } from 'next/navigation'
import { decryptKey, encryptKey } from '@/lib/utils'
import { usePathname } from 'next/navigation'
const PasskeyModal = () => {
    const router = useRouter()
    const path = usePathname()
    const [passkey, setPasskey] = useState("");
    const [open,setOpen] = useState<boolean>(false)
    const [admin,setAdmin] = useState<boolean>(false)
    const [key,setKey] = useState<string | null>("")
    const encryptedKey = encryptKey(passkey)
    const validatePassKey = () => {
        setAdmin(true)
        if (passkey === process.env.ADMIN_PASS_KEY) {
            window?.localStorage.setItem("accesskey", `${encryptedKey}`)
            router.push('/admin')
        }
    }
    useEffect(() => {
        const storedKey = window.localStorage.getItem("accesskey")
        setKey(storedKey)
        const dycreptedKey = decryptKey(storedKey as string)  
        if (path && open) {
            if(dycreptedKey == process.env.ADMIN_PASS_KEY){
                router.push('/admin')
            }
        }
    }, [admin,open])

    return (
        <AlertDialog>
            <AlertDialogTrigger onClick={() => setOpen(true)} >Admin</AlertDialogTrigger>
            { open && !key &&  <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-start justify-between">
                        Admin Access Verification
                        <Image
                            src="/assets/icons/close.svg"
                            alt="close"
                            width={20}
                            height={20}
                            className="cursor-pointer"
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        To access the admin page, please enter the passkey.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <InputOTP maxLength={6} value={passkey} onChange={(value) => setPasskey(value)}>
                        <InputOTPGroup className="shad-otp">
                            <InputOTPSlot className="shad-otp-slot" index={0} />
                            <InputOTPSlot className="shad-otp-slot" index={1} />
                            <InputOTPSlot className="shad-otp-slot" index={2} />
                            <InputOTPSlot className="shad-otp-slot" index={3} />
                            <InputOTPSlot className="shad-otp-slot" index={4} />
                            <InputOTPSlot className="shad-otp-slot" index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction className="shad-primary-btn w-full" onClick={validatePassKey}>Enter Admin Passkey</AlertDialogAction>
                    <AlertDialogCancel className='border-0 absolute top-[14px] right-2'>
                        <Image
                            src='/assets/icons/close.svg'
                            alt='close'
                            width={20}
                            height={20}
                        />
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>}
        </AlertDialog>
    )
}

export default PasskeyModal
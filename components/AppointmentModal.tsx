import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import AppointmentForm from '@/components/forms/AppointmentForm'
interface AppointmentModalTypes {
  type: string,
  userId: string,
  patientId?:string,
}
const AppointmentModal = ({ type, userId , patientId }: AppointmentModalTypes) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === "schedule" && "text-green-500"} ${type === "cancel" && "text-red-400"}`}>
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{type} Appointment</DialogTitle>
          <DialogDescription className='text-xs h-[30px] flex items-center  text-slate-500'>
            Please Fill in the following data to {type}.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AppointmentForm type={type} userId={userId} />
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default AppointmentModal
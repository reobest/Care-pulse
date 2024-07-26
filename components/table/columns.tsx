"use client"
import { ColumnDef } from "@tanstack/react-table"
export type Appointments = {
    id: string,
    type: string,
    schedule: string,
    cancellationReason: string | null,
    Patientid?: any,
    primaryPhysician: string,
    note: string | null,
    reason: string,
    Patientname: string,
}
import { StatusIcon } from "@/constants";
import AppointmentModal from "../AppointmentModal"
import Image from "next/image"
import clsx from "clsx"
export const columns: ColumnDef<Appointments>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    }
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.Patientname}</p>;
    }
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return <p className="text-14-medium">
        {row.original.schedule}
      </p>;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div className="min-w-[115px]">
        <div
          className={clsx("status-badge", {
            "bg-green-600": row.original.type === "schedule",
            "bg-blue-600": row.original.type === "pending",
            "bg-red-600": row.original.type === "cancel",
          })}
        >
          <Image
            src={StatusIcon[row.original.type]}
            alt="doctor"
            width={24}
            height={24}
            className="h-fit w-3"
          />
          <p
            className={clsx("text-12-semibold capitalize", {
              "text-green-500": row.original.type === "schedule",
              "text-blue-500": row.original.type === "pending",
              "text-red-500": row.original.type === "cancel",
            })}
          >
            {row.original.type}
          </p>
        </div>
      </div>;
    }
  },
  {
    accessorKey: "doctors",
    header: "Doctors",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.primaryPhysician}</p>;
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={appointment.Patientid}
            userId={appointment.id}
            type="cancel"
          />
          <AppointmentModal
            patientId={appointment.Patientid}
            userId={appointment.id}
            type="schedule"
          />
        </div>
      )
    },
  },
]

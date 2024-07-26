import clsx from 'clsx';
import Image from 'next/image';
import React from 'react'
type CustomCardsProps = {
  type: string;
  count: number | string;
  label: string;
  icon: string;
}
const CustomCards = ({ type, count, label, icon }: CustomCardsProps) => {
  return (
    <div
      className={clsx("stat-card flex-1", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt="appointments"
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
}

export default CustomCards
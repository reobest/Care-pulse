import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateTime(timestamp : any) {
  const date = timestamp.toDate();
  const options : any = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
  };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  return formattedDate;
}
export const Count  = (type : string,appointments : any) => {
  let NumberOfMatch : number = 0
  for(let i = 0;i < appointments.length;i++){
    if(appointments[i].type === type){
      NumberOfMatch++
    }
  }
  return NumberOfMatch
}
export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
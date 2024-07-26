"use client"
import React from 'react'
import { Input } from "@/components/ui/input"
import { Control } from 'react-hook-form'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from "libphonenumber-js/core";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import Image from 'next/image'
import { Checkbox } from "./ui/checkbox";
type FormFieldsType = {
    form: Control<any>;
    label?: string;
    placeholder?: string;
    name: string;
    filedtype: string;
    styles?: string;
    renderSkeleton?: any;
    children?: React.ReactNode;
    cblabel?: string;
}
const RenderInput = ({ field, placeholder, filedtype, renderSkeleton, children, name, cblabel }: {
    field: any, placeholder: string | undefined, filedtype: string, renderSkeleton: any
    , children: React.ReactNode | undefined, name: string, label: string | undefined, cblabel: string | undefined
}) => {
    switch (filedtype) {
        case 'input':
            return (
                <FormControl>
                    <Input placeholder={placeholder} {...field} className={`bg-dark-400`} />
                </FormControl>
            )
        case 'checkbox':
            return (
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Checkbox
                            id={name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <label htmlFor={name} className="checkbox-label">
                            {cblabel}
                        </label>
                    </div>
                </FormControl>
            );
        case 'gender':
            return renderSkeleton ? renderSkeleton(field) : null;
        case 'skeleton':
            return renderSkeleton ? renderSkeleton(field) : null;
        case 'select':
            return (
                <FormControl className='w-[100%]'>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className='w-[100%]'>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {children}
                        </SelectContent>
                    </Select>
                </FormControl>
            );
        case 'date-picker':
            return (
                <FormControl >
                    <div className="flex w-full h-[30px] rounded-md border border-dark-500 bg-dark-400">
                        <Image
                            src="/assets/icons/calendar.svg"
                            height={20}
                            width={20}
                            alt="user"
                            className="ml-2"
                        />
                        <DatePicker
                            className='cursor-pointer flex text-center text-sm'
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={'MM/DD/YYYY'}
                            showTimeSelect={false}
                            timeInputLabel='Time:'
                        />
                    </div>

                </FormControl>
            )
        case 'textarea':
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...field}
                        className="shad-textArea w-[100%]"
                    />
                </FormControl>
            );
        case 'phone-number':
            return (
                <FormControl>
                    <PhoneInput
                        placeholder={placeholder}
                        defaultCountry='EG'
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className='input-phone'
                    />
                </FormControl>
            )
    }
}
const CustomFormField = ({ form, label, placeholder, name, filedtype, styles, renderSkeleton, children, cblabel }: FormFieldsType) => {
    return (
        <>
            <FormField
                control={form}
                name={name}
                render={({ field }) => (
                    <FormItem className={`${styles}`}>
                        <FormLabel>{label}</FormLabel>
                        <RenderInput
                            field={field}
                            placeholder={placeholder}
                            filedtype={filedtype}
                            renderSkeleton={renderSkeleton}
                            name={name}
                            label={label}
                            cblabel={cblabel}
                        >
                            {children}
                        </RenderInput>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}

export default CustomFormField
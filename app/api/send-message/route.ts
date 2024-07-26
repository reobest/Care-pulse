import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
    try {
        // Sending the message
        await client.messages.create({
            body: 'Hello from CarePulse! You have successfully submitted your appointment. Your appointment will be scheduled soon. Please be patient.',
            from: process.env.TWILIO_NUMBER_SENDER, 
            to: '+201012785139', // Replace with the recipient phone number
        });

        // Return a success response
        return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
    }
}

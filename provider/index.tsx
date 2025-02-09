import React from "react";
import { ClerkProvider } from '@clerk/nextjs'


export default function Provider ({children}: {children: React.ReactNode}) {
    return <ClerkProvider
    signInUrl={`${process.env.NEXT_PUBLIC_CLERK_SIGN_IN}`}
    signUpUrl={`${process.env.NEXT_PUBLIC_CLERK_SIGN_UP}`}
    >
        {children}
    </ClerkProvider>
}
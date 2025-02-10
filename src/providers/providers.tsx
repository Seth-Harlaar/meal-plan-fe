'use client'

import { ModalProvider } from "./ModalProvider"
import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"


export default function Providers({session, children}: {session: Session | null, children: React.ReactNode}){
  return <>
    <SessionProvider session={session}>
      <ModalProvider>
        {children}
      </ModalProvider>
    </SessionProvider>
  </>
}
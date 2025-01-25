'use client'

import { ModalProvider } from "./ModalProvider"



export default function Providers({children}: {children: React.ReactNode}){
  return <>
    <ModalProvider>
      {children}
    </ModalProvider>
  </>
}
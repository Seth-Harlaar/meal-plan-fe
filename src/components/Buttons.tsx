'use client'

import { ModalContext } from "@/providers/ModalProvider";
import { useContext } from "react";

export function RefreshButton(){

  const modalData = useContext(ModalContext);

  return (
    <img className="icon refresh-button" src="/icons/refresh.svg" onClick={() => {modalData.openModal({component: <>asdf</>});}}/>
  )
}
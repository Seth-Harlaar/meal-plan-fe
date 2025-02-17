'use client'

import { ModalContext } from "@/providers/ModalProvider";
import { useContext } from "react";

export function RefreshButton(){
  return (
    <img className="icon refresh-button" src="/icons/refresh.svg"/>
  )
}
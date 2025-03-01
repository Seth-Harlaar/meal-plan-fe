'use client'

import { ModalContext } from "@/providers/ModalProvider";
import { useContext } from "react";

export function RefreshButton(){
  return (
    <img className="icon refresh-button" src="/icons/refresh.svg"/>
  )
}

export function EditButtion(){
  return (
    <img className="icon edit-button" src="/icons/pencil.svg"/>
  )
}
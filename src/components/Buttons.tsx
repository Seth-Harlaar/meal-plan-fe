'use client'

import { ModalContext } from "@/providers/ModalProvider";
import { useContext } from "react";

export function EditButton(){
  return (
    <img className="icon edit-button" src="/icons/pencil.svg"/>
  )
}

export function RefreshButton(){
  return (
    <img className="icon refresh-button" src="/icons/refresh.svg"/>
  )
}

export function HamburgerMenuButton(){
  return (
    <img className="icon refresh-button" src="/icons/hamburger.svg"/>
  )
}

export function PlusButton(){
  return (
    <img className="icon plus-button" src="/icons/plus.svg"/>
  )
}

export function XButton(){
  return (
    <img className="icon x-button" src="/icons/x.svg"/>
  )
}

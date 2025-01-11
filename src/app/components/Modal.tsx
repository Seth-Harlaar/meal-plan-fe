import { useContext } from "react"
import { ModalContext } from "../providers/ModalProvider"


export default function Modal({children}: {children: React.ReactNode}){
  const modal = useContext(ModalContext);

  return <div id="modal-container">
    <div id="modal">
      {children}
    </div>
    <div id="modal-exit" onClick={() => {modal.closeModal()}}></div>
  </div>
}
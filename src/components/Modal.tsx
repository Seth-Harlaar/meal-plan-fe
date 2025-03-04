import { useContext } from "react"
import { ModalContext } from "../providers/ModalProvider"

import './styles/Modal.css';

export default function Modal({children}: {children: React.ReactNode}){
  const modal = useContext(ModalContext);

  return <div id="modal-container">
    <div id="modal-exit" onClick={() => {modal.closeModal()}}></div>
    <div id="modal">
      <div>
        {children}
      </div>
      { modal.modalErrors.length > 0 ?
        <div className="errors">
          <ul>
            {modal.modalErrors.map((error, index) => {
              return <li key={index}>{error}</li>
            })}
          </ul>
        </div>
        : null
      }
    </div>
  </div>
}
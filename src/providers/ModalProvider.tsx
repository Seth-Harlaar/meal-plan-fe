'use client'

import React, { createContext, useState } from "react";

import Modal from "../components/Modal";

const ModalContext = createContext<ModalContextType>({
    modalVisible: false,
    modalChildren: null,
    openModal: () => {},
    closeModal: () => {},
});

type ModalContextType = {
  modalVisible: boolean;
  modalChildren: React.ReactNode;
  openModal: ({component}: {component: React.ReactNode}) => void;
  closeModal: () => void;
}

function ModalProvider({children}: {children: React.ReactNode}){
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChildren, setModalChildren] = useState<React.ReactNode>(null);

  function closeModal(){
    setModalVisible(false);
  }

  function openModal({component}: {component: React.ReactNode}){
    setModalChildren(component);
    setModalVisible(true);
  }

  const contextValue: ModalContextType = {
    modalVisible,
    modalChildren,
    openModal,
    closeModal,
  }

  return(
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
        {modalVisible ? <Modal>{modalChildren}</Modal> : null}
      </ModalContext.Provider>
    </>
  );
}

export { ModalContext, ModalProvider};
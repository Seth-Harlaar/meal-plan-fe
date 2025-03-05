'use client'

import React, { createContext, useState } from "react";

import Modal from "../components/Modal";

type ModalContextType = {
  modalVisible: boolean;
  modalChildren: React.ReactNode;
  modalErrors: string[];
  openModal: (component: React.ReactNode) => void;
  closeModal: () => void;
  addModalError: (errorMessage: string) => void,
  clearModalErrors: () => void;
  setModalError: (errorMessage: string) => void,
}

const ModalContext = createContext<ModalContextType>({
  modalVisible: false,
  modalChildren: null,
  modalErrors: [],
  openModal: () => {},
  closeModal: () => {},
  addModalError: () => {},
  clearModalErrors: () => {},
  setModalError: () => {},
});

function ModalProvider({children}: {children: React.ReactNode}){
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChildren, setModalChildren] = useState<React.ReactNode>(null);
  const [modalErrors, setModalErrors] = useState<string[]>([]);

  function addError(errorMessage: string){
    setModalErrors(prevErrors =>  [...prevErrors, errorMessage]);
  }

  function setError(errorMessage: string){
    setModalErrors([errorMessage]);
  }

  function clearErrors(){
    setModalErrors([]);
  }

  function closeModal(){
    clearErrors();
    setModalVisible(false);
  }

  function openModal(component: React.ReactNode){
    setModalChildren(component);
    setModalVisible(true);
  }

  const contextValue: ModalContextType = {
    modalVisible,
    modalChildren,
    modalErrors,
    openModal,
    closeModal,
    addModalError: addError,
    setModalError: setError,
    clearModalErrors: clearErrors,
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
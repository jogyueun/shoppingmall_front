import React, { useState, useEffect } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from './css/DeliveryModal.module.css';
const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={closeModal} className={styles.closeButton}
        style={{width:'40px', height:'40px'}}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
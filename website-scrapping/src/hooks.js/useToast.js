import React, { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const useToast = () => useContext(ToastContext);

export { ToastProvider, useToast };

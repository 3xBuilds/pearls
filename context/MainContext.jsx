"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode
} from "react";

const GlobalContext = createContext();


export const GlobalContextProvider = ({ children }) => {
  const [loader, setLoader] = useState(false);

  return (
    <GlobalContext.Provider value={{ loader, setLoader}}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

import React from "react";
import { Header } from "../components/Header";

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

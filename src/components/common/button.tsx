import React from "react";
import styles from "./button.module.css";

type ButtonProps = {
   className?: string
   onClick?: (e: React.MouseEvent) => void
   children: React.ReactNode
}

export function Button({ className, onClick, children }: ButtonProps) {
   return (
      <div className={styles.button + " " + className} onClick={onClick}>
         {children}
      </div>
   );
}
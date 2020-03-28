import React from "react";
import "./subtextbutton.css";

type FancyButtonProps = {
   label: string
   onClick: () => void
   children: React.ReactNode
}

export function SubtextButton({ label, onClick, children }: FancyButtonProps) {
   return (
      <div className="subtext-button" onClick={onClick}>
         <strong>{label}</strong><br />
         <small>{children}</small>
      </div >
   );
}
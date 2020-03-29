import React from "react";
import "./subtextbutton.css";
import { Button } from "./button";

type FancyButtonProps = {
   label: string
   onClick: () => void
   children: React.ReactNode
}

export function SubtextButton({ label, onClick, children }: FancyButtonProps) {
   return (
      <Button className="subtext-button" onClick={onClick}>
         <strong>{label}</strong><br />
         <small>{children}</small>
      </Button>
   );
}
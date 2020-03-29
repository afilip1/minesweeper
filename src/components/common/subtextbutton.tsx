import React from "react";
import { Clickable } from "./clickable";

type SubtextButtonProps = {
   className?: string
   label: string
   onClick?: (e: React.MouseEvent) => void
   children: React.ReactNode
}

export function SubtextButton({ label, children, ...props }: SubtextButtonProps) {
   return (
      <Clickable {...props}>
         <strong>{label}</strong><br />
         <small>{children}</small>
      </Clickable>
   );
}
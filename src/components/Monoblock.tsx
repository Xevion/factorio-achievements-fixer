import { cn } from "../utils";
import { ComponentChildren } from "preact";

interface MonoblockProps {
  className?: string;
  children?: ComponentChildren;
}

export default function Monoblock({ className, children }: MonoblockProps) {
  return (
    <span
      className={cn(
        "inline-block border-zinc-500 px-0.5 border bg-zinc-800 rounded",
        className
      )}
    >
      {children}
    </span>
  );
}

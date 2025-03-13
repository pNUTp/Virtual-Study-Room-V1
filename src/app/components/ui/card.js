"use client";
import { cn } from "../../lib/utils";

export function Card({ className, children }) {
  return <div className={cn("border rounded-lg p-4 shadow-md", className)}>{children}</div>;
}

export function CardContent({ className, children }) {
  return <div className={cn("mt-2", className)}>{children}</div>;
}

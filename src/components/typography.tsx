import { cn } from "@/lib/utils";
import type { ClassValue } from "class-variance-authority/types";
import type { JSX, ReactNode } from "react";

export function H1({
  children,
  className,
  ...props
}: JSX.IntrinsicElements["h1"]) {
  return (
    <h1
      className={cn(
        className,
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({
  children,
  className,
  ...props
}: JSX.IntrinsicElements["h2"]) {
  return (
    <h2
      className={cn(
        className,
        "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function Ul({
  children,
  className,
  ...props
}: JSX.IntrinsicElements["ul"]) {
  return (
    <ul
      className={cn(className, "my-6 ml-2 list-['•'] [&>li]:pl-6")}
      {...props}
    >
      {children}
    </ul>
  );
}

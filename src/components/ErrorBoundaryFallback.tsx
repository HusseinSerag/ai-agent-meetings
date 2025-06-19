"use client";

import { FallbackProps } from "react-error-boundary";
import { ErrorState } from "./Error";

export function ErrorBoundaryFallback(props: FallbackProps) {
  console.log(props.error);
  return (
    <ErrorState
      title="Error loading agent"
      description={props.error.message ?? "Something went wrong!"}
    />
  );
}

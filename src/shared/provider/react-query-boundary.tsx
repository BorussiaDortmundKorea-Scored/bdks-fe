import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};
interface IReactQueryBoundary {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  errorFallback: React.ComponentType<ErrorFallbackProps>;
}

const ReactQueryBoundary: React.FC<IReactQueryBoundary> = ({ children, skeleton, errorFallback }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={errorFallback}>
          <Suspense fallback={skeleton}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default ReactQueryBoundary;

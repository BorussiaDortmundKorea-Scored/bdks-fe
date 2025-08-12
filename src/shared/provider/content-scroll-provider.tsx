import React from "react";

interface ContentScrollProviderProps {
  children: React.ReactNode;
  className?: string;
}

const ContentScrollProvider: React.FC<ContentScrollProviderProps> = ({ children, className = "" }) => {
  return <div className={`scrollbar-hide w-full overflow-y-auto ${className}`}>{children}</div>;
};

export default ContentScrollProvider;

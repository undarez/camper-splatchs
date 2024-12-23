"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ClientLayout({ children }: Props): JSX.Element {
  return <>{children}</>;
}

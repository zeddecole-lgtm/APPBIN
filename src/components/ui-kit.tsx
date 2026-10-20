import type { ReactNode } from "react";

export function PageHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <header className="flex items-center justify-between pb-5 pt-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {right}
    </header>
  );
}

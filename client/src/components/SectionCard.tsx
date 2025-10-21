import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  children: ReactNode;
}

export default function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="section-card">
      <header className="section-card__header">{title}</header>
      <div className="section-card__body">{children}</div>
    </section>
  );
}

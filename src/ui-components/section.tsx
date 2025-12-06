import { Separator } from "./separator";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="px-6 py-4">
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <Separator />
      <div className="px-6 pt-4 pb-6">{children}</div>
    </div>
  );
}

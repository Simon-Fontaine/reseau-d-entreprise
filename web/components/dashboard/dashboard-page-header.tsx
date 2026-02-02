import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardPageHeader({
  heading,
  text,
  children,
  className,
  ...props
}: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2",
        className,
      )}
      {...props}
    >
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {heading}
        </h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils";

function Page({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("flex flex-1 flex-col gap-6 py-6 md:py-8", className)}
      {...props}
    />
  );
}

function PageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]",
        className,
      )}
      {...props}
    />
  );
}

function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "max-w-2xl text-balance text-lg text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function PageActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex w-full items-center gap-2 pt-2", className)}
      {...props}
    />
  );
}

function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-5xl px-4 md:px-6", className)}
      {...props}
    />
  );
}

export {
  Page,
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
  Container,
};

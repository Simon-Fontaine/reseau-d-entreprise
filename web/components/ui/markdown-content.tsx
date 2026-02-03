"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const components: Components = {
  // Headings
  h1: ({ children }) => (
    <h1 className="scroll-m-20 text-3xl font-bold tracking-tight mb-6 mt-8 first:mt-0 border-b pb-2 border-border">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4 mt-8 first:mt-0 border-b pb-2 border-border/50">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-3 mt-6">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2 mt-4">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="scroll-m-20 text-base font-semibold tracking-tight mb-2 mt-4">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="scroll-m-20 text-sm font-semibold tracking-tight mb-2 mt-4">
      {children}
    </h6>
  ),

  // Paragraphs
  p: ({ children }) => (
    <p className="leading-7 not-first:mt-4 text-foreground/90">{children}</p>
  ),

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="my-4 ml-6 list-disc [&>li]:mt-2 marker:text-primary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 list-decimal [&>li]:mt-2 marker:text-primary marker:font-semibold">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-foreground/90">{children}</li>,

  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-primary/50 bg-muted/50 py-2 pl-6 pr-4 italic text-foreground/80 rounded-r-md">
      {children}
    </blockquote>
  ),

  // Code blocks
  code: ({ className, children }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-medium text-primary">
          {children}
        </code>
      );
    }
    return (
      <code className="block overflow-x-auto rounded-lg bg-muted/80 p-4 font-mono text-sm">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg border bg-muted/50 p-0">
      {children}
    </pre>
  ),

  // Tables
  table: ({ children }) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/70 border-b">{children}</thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y">{children}</tbody>,
  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-muted/30">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-foreground/90">{children}</td>
  ),

  // Horizontal rule
  hr: () => <hr className="my-8 border-t border-border" />,

  // Strong and emphasis
  strong: ({ children }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,

  // Images - using native img for markdown content with external/unknown sources
  img: ({ src, alt }) => (
    <span className="block my-6">
      {/* biome-ignore lint/performance/noImgElement: Markdown images have unknown external sources and dimensions */}
      <img
        src={src}
        alt={alt || ""}
        className="rounded-lg border max-w-full h-auto mx-auto shadow-sm"
      />
      {alt && (
        <span className="block text-center text-sm text-muted-foreground mt-2">
          {alt}
        </span>
      )}
    </span>
  ),

  // Details/Summary (for collapsible content like answers)
  details: ({ children }) => (
    <details className="my-4 rounded-lg border bg-card p-4 group">
      {children}
    </details>
  ),
  summary: ({ children }) => (
    <summary className="cursor-pointer font-semibold text-primary hover:text-primary/80 transition-colors select-none list-none flex items-center gap-2 before:content-['▶'] before:text-xs before:transition-transform group-open:before:rotate-90">
      {children}
    </summary>
  ),

  // Delete (strikethrough)
  del: ({ children }) => (
    <del className="text-muted-foreground line-through">{children}</del>
  ),
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn("markdown-content text-base leading-relaxed", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

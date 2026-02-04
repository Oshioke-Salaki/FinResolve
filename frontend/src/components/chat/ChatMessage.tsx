import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type Role = "user" | "assistant";

export interface MessageProps {
  role: Role;
  content: string;
  timestamp?: string; // Optional for now
}

export function ChatMessage({ role, content }: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="flex bg-primary/10 w-8 h-8 rounded-full items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-white border border-gray-100 text-foreground rounded-bl-none shadow-sm prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0",
        )}
      >
        {isUser ? (
          content
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>

      {isUser && (
        <div className="flex bg-gray-100 w-8 h-8 rounded-full items-center justify-center shrink-0">
          <User className="w-4 h-4 text-gray-500" />
        </div>
      )}
    </div>
  );
}

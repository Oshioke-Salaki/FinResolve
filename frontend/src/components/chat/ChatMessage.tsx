import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";

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
            : "bg-white border border-gray-100 text-foreground rounded-bl-none shadow-sm",
        )}
      >
        {content}
      </div>

      {isUser && (
        <div className="flex bg-gray-100 w-8 h-8 rounded-full items-center justify-center shrink-0">
          <User className="w-4 h-4 text-gray-500" />
        </div>
      )}
    </div>
  );
}

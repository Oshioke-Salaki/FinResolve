import { SendHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`; // Max height 120px
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex items-end gap-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your finances..."
          disabled={disabled}
          rows={1}
          className="flex-1 max-h-32 min-h-[24px] w-full resize-none border-0 bg-transparent p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ overflow: "hidden" }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className={cn(
            "rounded-full p-3 transition-all duration-200 border border-transparent",
            input.trim()
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200",
          )}
        >
          <SendHorizontal className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </button>
      </div>
    </div>
  );
}

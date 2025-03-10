
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSend: (prompt: string) => void;
  isLoading: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({ 
  prompt, 
  setPrompt, 
  onSend,
  isLoading 
}) => {
  const [messages, setMessages] = React.useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm your AI assistant. Ask me to analyze data or generate visualizations for you." 
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!prompt.trim() || isLoading) return;
    
    const newMessage: Message = {
      role: "user",
      content: prompt
    };
    
    setMessages([...messages, newMessage]);
    onSend(prompt);
    setPrompt("");
    
    // Add a placeholder for the assistant's response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: "I'm analyzing your request..." 
        }
      ]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-300px)]">
      <ScrollArea className="flex-1 pr-4 mb-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="flex items-end gap-2 mt-auto">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about your data..."
          className="min-h-[80px] resize-none"
        />
        <Button 
          onClick={handleSend} 
          disabled={!prompt.trim() || isLoading}
          className="mb-[3px]"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

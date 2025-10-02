import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAIChat } from "@/hooks/useAIChat";
import { ScrollArea } from "@/components/ui/scroll-area";

const AIAssistant = () => {
  const { messages, isLoading, sendMessage } = useAIChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isLoading) return;
    await sendMessage(suggestion);
  };

  const suggestions = [
    "Como a radiação espacial afeta DNA?",
    "Técnicas de cultivo hidropônico em órbita",
    "Efeitos da microgravidade no sistema imunológico",
    "Bioprospecção em ambientes extremos",
  ];

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="sticky top-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center px-6">
              <SidebarTrigger />
              <div className="flex items-center gap-2 ml-4">
                <Sparkles className="w-5 h-5 text-primary animate-glow" />
                <h1 className="text-xl font-semibold">Dra. Aris - Assistente de IA</h1>
              </div>
            </header>
          
            <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.length === 0 ? (
                    <>
                      <div className="flex justify-start">
                        <div className="w-10 h-10 rounded-full gradient-cosmic flex items-center justify-center mr-3 flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <Card className="max-w-2xl p-4 bg-card/50 backdrop-blur-sm border-border/50">
                          <p className="text-sm whitespace-pre-line">
                            Olá! Sou a Dra. Aris, sua assistente de IA especializada em biologia espacial. Como posso ajudar você hoje?
                          </p>
                        </Card>
                      </div>

                      {/* Suggestion Cards */}
                      <div className="grid md:grid-cols-2 gap-3 mt-8">
                        {suggestions.map((suggestion, i) => (
                          <Card
                            key={i}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-border/50"
                          >
                            <p className="text-sm">{suggestion}</p>
                          </Card>
                        ))}
                      </div>
                    </>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-10 h-10 rounded-full gradient-cosmic flex items-center justify-center mr-3 flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <Card
                          className={`max-w-2xl p-4 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-card/50 backdrop-blur-sm border-border/50"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{msg.content}</p>
                        </Card>
                      </div>
                    ))
                  )}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-10 h-10 rounded-full gradient-cosmic flex items-center justify-center mr-3 flex-shrink-0">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                      <Card className="max-w-2xl p-4 bg-card/50 backdrop-blur-sm border-border/50">
                        <p className="text-sm text-muted-foreground">Pensando...</p>
                      </Card>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-md">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pergunte sobre biologia espacial, pesquisas, análises..."
                    className="bg-input/50 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                  <Button 
                    size="icon" 
                    className="gradient-cosmic glow-primary"
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Assistente alimentado por IA avançada • Especializado em biologia espacial
                </p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default AIAssistant;

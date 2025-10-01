import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const mockAIMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Olá! Sou seu assistente de IA especializado em biologia espacial. Como posso ajudar você hoje?",
  },
  {
    id: 2,
    role: "user",
    text: "Quais são os principais desafios da agricultura em Marte?",
  },
  {
    id: 3,
    role: "assistant",
    text: "Excelente pergunta! Os principais desafios incluem:\n\n1. **Baixa Gravidade**: Apenas 38% da gravidade terrestre afeta o crescimento das plantas\n2. **Radiação**: Falta de campo magnético protetor\n3. **Solo**: Presença de percloratos tóxicos no regolito marciano\n4. **Temperatura**: Variações extremas (-125°C a 20°C)\n5. **Atmosfera**: Apenas 0,6% da pressão terrestre\n\nGostaria de explorar algum desses pontos em mais detalhes?",
  },
];

const AIAssistant = () => {
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
                <h1 className="text-xl font-semibold">Assistente de IA</h1>
              </div>
            </header>
          
          <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {mockAIMessages.map((msg) => (
                <div
                  key={msg.id}
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
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  </Card>
                </div>
              ))}

              {/* Suggestion Cards */}
              <div className="grid md:grid-cols-2 gap-3 mt-8">
                {[
                  "Como a radiação espacial afeta DNA?",
                  "Técnicas de cultivo hidropônico em órbita",
                  "Efeitos da microgravidade no sistema imunológico",
                  "Bioprospecção em ambientes extremos",
                ].map((suggestion, i) => (
                  <Card
                    key={i}
                    className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-border/50"
                  >
                    <p className="text-sm">{suggestion}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-md">
              <div className="flex gap-2">
                <Input
                  placeholder="Pergunte sobre biologia espacial, pesquisas, análises..."
                  className="bg-input/50 backdrop-blur-sm"
                />
                <Button size="icon" className="gradient-cosmic glow-primary">
                  <Send className="w-4 h-4" />
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

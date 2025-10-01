import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const mockConversations = [
  { id: 1, name: "Dr. Maria Silva", avatar: "MS", lastMessage: "Olá! Vi seu artigo sobre...", time: "10:30", unread: 2 },
  { id: 2, name: "Prof. João Santos", avatar: "JS", lastMessage: "Podemos colaborar no projeto?", time: "Ontem", unread: 0 },
  { id: 3, name: "Dra. Ana Costa", avatar: "AC", lastMessage: "Obrigada pela revisão!", time: "2 dias", unread: 0 },
];

const mockMessages = [
  { id: 1, sender: "MS", text: "Olá! Vi seu artigo sobre microgravidade.", time: "10:28", isMe: false },
  { id: 2, sender: "Você", text: "Oi Maria! Obrigado por ler.", time: "10:29", isMe: true },
  { id: 3, sender: "MS", text: "Gostaria de discutir uma possível colaboração.", time: "10:30", isMe: false },
];

const Chat = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center px-6">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold ml-4">Mensagens</h1>
          </header>
          
          <div className="h-[calc(100vh-4rem)] flex">
            {/* Conversations List */}
            <div className="w-80 border-r border-border/50 overflow-y-auto">
              {mockConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {conv.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{conv.name}</p>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs text-primary-foreground">{conv.unread}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">MS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Dr. Maria Silva</p>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                  >
                    <Card
                      className={`max-w-md p-4 ${
                        msg.isMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-card/50 backdrop-blur-sm"
                      }`}
                    >
                      <p className="text-sm mb-1">{msg.text}</p>
                      <span className="text-xs opacity-70">{msg.time}</span>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    className="bg-input/50 backdrop-blur-sm"
                  />
                  <Button size="icon" className="gradient-cosmic">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Chat;

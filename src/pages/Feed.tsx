import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const mockArticles = [
  {
    id: 1,
    author: "Dr. Maria Silva",
    avatar: "MS",
    title: "Efeitos da Microgravidade no Desenvolvimento Celular",
    excerpt: "Nova pesquisa demonstra como a ausência de gravidade afeta processos celulares fundamentais...",
    likes: 124,
    comments: 23,
    published: "2 horas atrás",
    category: "Biologia Celular",
  },
  {
    id: 2,
    author: "Prof. João Santos",
    avatar: "JS",
    title: "Agricultura Espacial: Cultivando Alimentos em Marte",
    excerpt: "Técnicas inovadoras para cultivo de plantas em ambientes de baixa gravidade e radiação elevada...",
    likes: 89,
    comments: 15,
    published: "5 horas atrás",
    category: "Astrobiologia",
  },
  {
    id: 3,
    author: "Dra. Ana Costa",
    avatar: "AC",
    title: "Adaptação Humana a Ambientes Extraterrestres",
    excerpt: "Estudos sobre mudanças fisiológicas necessárias para sobrevivência em ambientes espaciais...",
    likes: 156,
    comments: 31,
    published: "1 dia atrás",
    category: "Fisiologia Espacial",
  },
];

const Feed = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="sticky top-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center px-6">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold ml-4">Feed de Artigos</h1>
            </header>
            
            <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
              <div className="space-y-6">
                {mockArticles.map((article) => (
                  <Card key={article.id} className="card-elevated bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {article.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{article.author}</p>
                          <p className="text-sm text-muted-foreground">{article.published}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {article.category}
                        </span>
                      </div>
                      <CardTitle className="text-2xl">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-base">
                        {article.excerpt}
                      </CardDescription>
                      
                      <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Heart className="w-4 h-4" />
                          {article.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageCircle className="w-4 h-4" />
                          {article.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Share2 className="w-4 h-4" />
                          Compartilhar
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Feed;

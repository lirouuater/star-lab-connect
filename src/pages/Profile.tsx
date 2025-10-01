import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Mail, MapPin, Link as LinkIcon, Award, BookOpen, Users } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Profile = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="sticky top-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center px-6">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold ml-4">Perfil</h1>
            </header>
          
          <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6 space-y-6">
            {/* Profile Header */}
            <Card className="card-elevated bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <Avatar className="w-32 h-32">
                    <AvatarFallback className="bg-gradient-cosmic text-white text-4xl">
                      DR
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-bold">Dr. Ricardo Almeida</h2>
                        <p className="text-muted-foreground mt-1">
                          Pesquisador em Astrobiologia
                        </p>
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <MapPin className="w-3 h-3" />
                        São Paulo, Brasil
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Mail className="w-3 h-3" />
                        ricardo@exemplo.com
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <LinkIcon className="w-3 h-3" />
                        ricardoalmeida.com
                      </Badge>
                    </div>

                    <p className="text-muted-foreground">
                      Especialista em biologia espacial com foco em adaptação de organismos a ambientes extremos. 
                      Atualmente pesquisando viabilidade de agricultura em Marte.
                    </p>

                    <div className="flex gap-6 pt-2">
                      <div>
                        <div className="text-2xl font-bold text-primary">24</div>
                        <div className="text-sm text-muted-foreground">Artigos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-secondary">156</div>
                        <div className="text-sm text-muted-foreground">Citações</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">89</div>
                        <div className="text-sm text-muted-foreground">Conexões</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="articles" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="articles" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Artigos
                </TabsTrigger>
                <TabsTrigger value="awards" className="gap-2">
                  <Award className="w-4 h-4" />
                  Conquistas
                </TabsTrigger>
                <TabsTrigger value="connections" className="gap-2">
                  <Users className="w-4 h-4" />
                  Conexões
                </TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="space-y-4 mt-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Efeitos da Radiação Cósmica em Organismos Multicelulares
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        Publicado em Mar 2025 • 45 citações
                      </p>
                      <div className="flex gap-2">
                        <Badge>Astrobiologia</Badge>
                        <Badge>Radiação</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="awards" className="space-y-4 mt-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full gradient-cosmic flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Top Contribuidor 2025</h3>
                        <p className="text-sm text-muted-foreground">
                          Reconhecido por contribuições significativas à plataforma
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="connections" className="grid md:grid-cols-2 gap-4 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            MS
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">Dr. Maria Silva</p>
                          <p className="text-sm text-muted-foreground">
                            Biologia Molecular
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Profile;

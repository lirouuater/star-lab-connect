import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Settings = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="sticky top-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center px-6">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold ml-4">Configurações</h1>
            </header>
          
          <div className="container max-w-3xl mx-auto py-8 px-4 md:px-6 space-y-6">
            {/* Account Settings */}
            <Card className="card-elevated bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
                <CardDescription>Gerencie suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue="Dr. Ricardo Almeida" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="ricardo@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Instituição</Label>
                  <Input id="institution" defaultValue="Universidade de São Paulo" />
                </div>
                <Button className="gradient-cosmic">Salvar Alterações</Button>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="card-elevated bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Privacidade</CardTitle>
                <CardDescription>Controle quem pode ver seu perfil e publicações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Perfil Público</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que outros pesquisadores vejam seu perfil
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mostrar Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Exibir seu email no perfil público
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Aceitar Mensagens</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que outros usuários enviem mensagens diretas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="card-elevated bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Configure como deseja ser notificado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Novos Artigos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações sobre novos artigos relevantes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mensagens</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando receber novas mensagens
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comentários</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando seus artigos receberem comentários
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant Settings */}
            <Card className="card-elevated bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Assistente de IA</CardTitle>
                <CardDescription>Personalize seu assistente de pesquisa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sugestões Automáticas</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber sugestões de pesquisa baseadas em seus interesses
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Análise de Dados</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que a IA analise seus dados de pesquisa
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Settings;

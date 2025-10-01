import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, Sparkles, Users, Share2, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Conecte-se com Pesquisadores",
    description: "Construa sua rede profissional com cientistas e pesquisadores do mundo todo especializados em biologia espacial.",
  },
  {
    icon: FileText,
    title: "Publique Artigos Científicos",
    description: "Compartilhe suas descobertas, pesquisas e conhecimentos através de artigos bem formatados e revisados pela comunidade.",
  },
  {
    icon: Sparkles,
    title: "Assistente IA Avançado",
    description: "Conte com inteligência artificial para auxiliar em suas pesquisas, análises de dados e desenvolvimento de hipóteses.",
  },
  {
    icon: MessageSquare,
    title: "Chat em Tempo Real",
    description: "Colabore diretamente com outros pesquisadores através de mensagens instantâneas e discussões em grupo.",
  },
  {
    icon: Share2,
    title: "Feed Personalizado",
    description: "Receba atualizações relevantes sobre pesquisas, descobertas e publicações da sua área de interesse.",
  },
  {
    icon: TrendingUp,
    title: "Análise Bibliométrica",
    description: "Acompanhe o impacto de suas publicações e visualize métricas importantes para sua carreira acadêmica.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 md:px-6 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Recursos <span className="text-gradient">Poderosos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para colaborar, publicar e avançar sua pesquisa científica
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-elevated bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all hover:scale-105"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg gradient-cosmic flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

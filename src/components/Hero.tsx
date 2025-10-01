import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-card/50" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-glow" />
            <span className="text-sm text-primary font-medium">NASA Space Apps Challenge 2025</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Rede Social para
            <span className="block text-gradient mt-2">Pesquisadores Espaciais</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Conecte-se com pesquisadores, publique artigos científicos e conte com IA para impulsionar suas descobertas no campo da biologia espacial.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              className="gradient-cosmic hover:opacity-90 transition-opacity text-lg h-14 px-8 glow-primary"
              onClick={() => navigate("/feed")}
            >
              Ver Feed de Artigos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/30 hover:bg-primary/10 text-lg h-14 px-8"
              onClick={() => navigate("/ai-assistant")}
            >
              Testar AI Assistant
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-2xl">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Pesquisadores</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">1.2K</div>
              <div className="text-sm text-muted-foreground">Artigos Publicados</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">24/7</div>
              <div className="text-sm text-muted-foreground">AI Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

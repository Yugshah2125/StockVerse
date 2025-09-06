import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Trophy, Zap, Sparkles, Target } from "lucide-react";
import { motion } from "framer-motion";

interface MiniGamesHubProps {
  onSelectGame: (gameId: string) => void;
}

const MiniGamesHub = ({ onSelectGame }: MiniGamesHubProps) => {
  const games = [
    {
      id: 'quiz-mania',
      title: 'Quiz Mania',
      description: 'Test your trading knowledge with 10 random questions',
      icon: Brain,
      color: 'from-primary/5 to-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      id: 'spot-the-scam',
      title: 'Spot the Scam',
      description: 'Identify scams and protect your investments',
      icon: Shield,
      color: 'from-profit/5 to-profit/10',
      borderColor: 'border-profit/20'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-gold/20 to-gold/10 mb-4">
          <Trophy className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-3">
          Mini Games Hub
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Challenge yourself, learn trading concepts, and earn rewards through interactive games!
        </p>
      </motion.div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {games.map((game, index) => {
          const Icon = game.icon;
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`relative overflow-hidden bg-gradient-to-br ${game.color} ${game.borderColor} border-2 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer h-full`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-r from-card to-card-hover shadow-lg flex items-center justify-center group-hover:shadow-xl"
                    >
                      <Icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold mb-1">{game.title}</CardTitle>
                      <CardDescription className="text-base">{game.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-medium">10 Questions</span>
                    </div>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-gold" />
                      <span className="font-medium">5-10 minutes</span>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Button 
                      size="lg"
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary-glow hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 ease-out hover:brightness-110" 
                      onClick={() => onSelectGame(game.id)}
                    >
                      <Sparkles className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                      Play Now
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MiniGamesHub;
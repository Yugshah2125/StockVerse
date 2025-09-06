import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useFeatureLock } from "@/hooks/useFeatureLock";
import { Zap, Target, Trophy, Lock, ArrowLeft, Flame, Clock, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import RapidFireChallenge from "@/components/challenges/RapidFireChallenge";
import TradingPsychologyChallenge from "@/components/challenges/TradingPsychologyChallenge";

const TradingChallenge = () => {
  const { user } = useAuth();
  const { isLocked, requirement } = useFeatureLock('trading-challenge');
  const userLevel = user?.level || 1;
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);

  const handleSelectChallenge = (challengeId: string) => {
    setCurrentChallenge(challengeId);
  };

  const handleBackToHub = () => {
    setCurrentChallenge(null);
  };



  if (isLocked) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Lock className="w-8 h-8 text-muted-foreground" />
              Trading Challenge
            </h1>
            <p className="text-muted-foreground">Complete levels and earn rewards</p>
          </div>

          <Card className="animate-slide-up border-2 border-dashed border-muted-foreground/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="w-6 h-6 text-muted-foreground" />
                Feature Locked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Level Up Required</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {requirement?.message || 'You need to reach a higher level to access this feature.'}
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">Current Level</Badge>
                    <p className="text-2xl font-bold">{userLevel}</p>
                  </div>
                  <div className="text-muted-foreground">
                    <ArrowLeft className="w-6 h-6 rotate-180" />
                  </div>
                  <div className="text-center">
                    <Badge variant="default" className="mb-2">Required Level</Badge>
                    <p className="text-2xl font-bold text-primary">{requirement?.minLevel}</p>
                  </div>
                </div>
                
                <Button asChild>
                  <Link to="/dashboard">Start Trading</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="w-8 h-8 text-profit" />
            Trading Challenge
          </h1>
          <p className="text-muted-foreground">Complete levels and earn rewards</p>
        </div>

        <AnimatePresence mode="wait">
          {currentChallenge === 'rapid-fire' ? (
            <RapidFireChallenge onBack={handleBackToHub} />
          ) : currentChallenge === 'psychology' ? (
            <TradingPsychologyChallenge onBack={handleBackToHub} />
          ) : (
            <motion.div className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Challenge Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 mx-auto text-profit mb-4" />
                <h3 className="text-xl font-semibold mb-2">Challenges Unlocked!</h3>
                <p className="text-muted-foreground mb-8">
                  Congratulations! You've reached Level {userLevel} and unlocked Trading Challenges.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 border-2 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 shadow-lg flex items-center justify-center">
                    <Flame className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold mb-1 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Rapid Fire Challenge
                    </CardTitle>
                    <p className="text-base text-muted-foreground">
                      Fast-paced trading questions with time pressure
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">10 Questions</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span className="font-medium">10s per question</span>
                  </div>
                </div>
                <Button 
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" 
                  onClick={() => handleSelectChallenge('rapid-fire')}
                >
                  <Flame className="w-5 h-5 mr-2" />
                  Start Challenge
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200 border-2 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg flex items-center justify-center">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold mb-1 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                      Psychology Challenge
                    </CardTitle>
                    <p className="text-base text-muted-foreground">
                      Master emotional control and decision-making
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-teal-600" />
                    <span className="font-medium">10 Scenarios</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Mindful Trading</span>
                  </div>
                </div>
                <Button 
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600" 
                  onClick={() => handleSelectChallenge('psychology')}
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TradingChallenge;
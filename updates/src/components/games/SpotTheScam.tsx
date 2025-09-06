import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Shield, CheckCircle, XCircle, RotateCcw, AlertTriangle, Info, Trophy, Sparkles, Target, Mail, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import scamData from '@/data/spotTheScamData.json';

interface SpotTheScamProps {
  onBack: () => void;
}

interface Scenario {
  id: number;
  scenario: string;
  isScam: boolean;
  explanation: string;
}

const SpotTheScam = ({ onBack }: SpotTheScamProps) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const getRandomScenarios = () => {
    const shuffled = [...scamData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  useEffect(() => {
    setScenarios(getRandomScenarios());
  }, []);

  const handleAnswerSelect = (isScam: boolean) => {
    if (showResult) return;
    setSelectedAnswer(isScam);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === scenarios[currentScenario].isScam;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setScenarios(getRandomScenarios());
    setCurrentScenario(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
  };

  if (scenarios.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (gameComplete) {
    const percentage = Math.round((score / scenarios.length) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;
    
    const safetyTips = [
      { icon: Shield, text: "Always verify sender domains - check for official company domains" },
      { icon: AlertTriangle, text: "Be suspicious of urgent requests for personal information" },
      { icon: Mail, text: "Never click suspicious links - type URLs directly into your browser" },
      { icon: Target, text: "Legitimate companies don't ask for passwords via email/text" },
      { icon: CheckCircle, text: "When in doubt, contact the company through official channels" }
    ];
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="fixed top-4 left-4 z-50">
          <motion.div 
            whileHover={{ scale: 1.05, x: -2 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button variant="ghost" size="sm" onClick={onBack} className="bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:bg-background/90">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Games
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card-hover border-2 rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-profit/5 via-transparent to-profit/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-profit/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
            
            <CardHeader className="relative z-10 text-center pb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-profit to-green-400 mb-4 mx-auto"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Scam Detection Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
                className="space-y-4"
              >
                <div className={`text-8xl font-black bg-gradient-to-r ${
                  isExcellent ? 'from-green-400 to-emerald-600' :
                  isGood ? 'from-blue-400 to-profit' :
                  'from-orange-400 to-red-500'
                } bg-clip-text text-transparent`}>
                  {percentage}%
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    You identified {score} out of {scenarios.length} correctly
                  </p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg text-muted-foreground max-w-md mx-auto"
                  >
                    {isExcellent ? "🔒 Outstanding! You can spot digital scams like a pro!" :
                     isGood ? "🛡️ Good instincts! Keep practicing to stay ahead of scammers!" :
                     "📚 Keep learning! Scammers are getting smarter - so should you!"}
                  </motion.p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Card className="text-left bg-gradient-to-br from-muted/50 to-muted/30 border-2 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      Digital Safety Essentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {safetyTips.map((tip, index) => {
                      const Icon = tip.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-background/50"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-sm leading-relaxed">{tip.text}</p>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button size="lg" onClick={handleRestart} className="bg-gradient-to-r from-profit to-green-400 hover:shadow-xl hover:shadow-profit/30 transition-all duration-500 ease-out hover:brightness-110">
                    <RotateCcw className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-180" />
                    Play Again
                  </Button>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button variant="outline" size="lg" onClick={onBack} className="border-2 hover:shadow-lg transition-all duration-300 ease-out">
                    Back to Hub
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  const scenario = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="fixed top-4 left-4 z-50">
        <motion.div 
          whileHover={{ scale: 1.05, x: -2 }} 
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Button variant="ghost" size="sm" onClick={onBack} className="bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:bg-background/90">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Games
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-card to-card-hover rounded-2xl p-6 shadow-lg border"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-profit to-green-400 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Spot the Scam</h3>
              <p className="text-sm text-muted-foreground">Scenario {currentScenario + 1} of {scenarios.length}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-profit">{score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-3 bg-muted" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(progress)}% Complete</span>
            <span>{scenarios.length - currentScenario - 1} remaining</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        key={currentScenario}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card-hover border-2 rounded-3xl shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-profit/5 to-transparent rounded-full -translate-y-24 translate-x-24" />
          
          <CardHeader className="relative z-10 pb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-profit/20 to-profit/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-profit" />
              </div>
              <CardTitle className="text-2xl font-bold">Is this legitimate or a scam?</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-background to-muted/30 rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-200/50">
                    <MessageSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        Scenario #{currentScenario + 1} of {scenarios.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        📱 Digital Communication
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-4 border border-border/50">
                      <pre className="text-sm leading-relaxed font-mono whitespace-pre-wrap text-foreground">{scenario.scenario}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { value: false, label: "✅ Legitimate", color: "from-green-500 to-emerald-600", bgColor: "from-green-50 to-emerald-50", hoverColor: "hover:from-green-100 hover:to-emerald-100", icon: CheckCircle },
                { value: true, label: "🚨 Scam", color: "from-red-500 to-rose-600", bgColor: "from-red-50 to-rose-50", hoverColor: "hover:from-red-100 hover:to-rose-100", icon: XCircle }
              ].map((option, index) => {
                const isSelected = selectedAnswer === option.value;
                const isCorrect = showResult && option.value === scenario.isScam;
                const isWrong = showResult && isSelected && option.value !== scenario.isScam;
                const Icon = option.icon;
                
                return (
                  <motion.div
                    key={option.value.toString()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                    whileHover={!showResult ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                  >
                    <Button
                      variant="outline"
                      className={`h-28 w-full border-2 rounded-2xl transition-all duration-300 ease-out transform ${
                        showResult
                          ? isCorrect
                            ? `bg-gradient-to-br ${option.bgColor} border-green-300 shadow-xl shadow-green-200/50 scale-105`
                            : isWrong
                            ? `bg-gradient-to-br from-red-50 to-rose-50 border-red-300 shadow-xl shadow-red-200/50`
                            : "opacity-50 scale-95"
                          : isSelected
                          ? `bg-gradient-to-br ${option.bgColor} border-current shadow-lg scale-105`
                          : `hover:bg-muted/30 hover:shadow-lg hover:scale-102 ${option.hoverColor}`
                      }`}
                      onClick={() => handleAnswerSelect(option.value)}
                      disabled={showResult}
                    >
                      <div className="flex flex-col items-center gap-4 p-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                          showResult
                            ? isCorrect
                              ? "bg-green-500 border-green-500 shadow-lg"
                              : isWrong
                              ? "bg-red-500 border-red-500 shadow-lg"
                              : "border-muted-foreground bg-muted opacity-60"
                            : isSelected
                            ? `bg-gradient-to-r ${option.color} border-transparent shadow-lg`
                            : "border-muted-foreground bg-background hover:border-primary/50"
                        }`}>
                          {showResult && (isCorrect || isWrong) ? (
                            <Icon className="w-7 h-7 text-white" />
                          ) : (
                            <Icon className={`w-7 h-7 transition-colors duration-300 ${
                              isSelected ? "text-white" : "text-muted-foreground hover:text-primary"
                            }`} />
                          )}
                        </div>
                        <span className="font-bold text-lg text-center leading-tight">{option.label}</span>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className={`p-6 rounded-2xl border-2 shadow-lg ${
                    selectedAnswer === scenario.isScam
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
                      : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300"
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                        selectedAnswer === scenario.isScam ? "bg-green-500" : "bg-blue-500"
                      }`}>
                        <Info className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-xl mb-3 ${
                          selectedAnswer === scenario.isScam ? "text-green-700" : "text-blue-700"
                        }`}>
                          {selectedAnswer === scenario.isScam ? "🎉 Excellent Detection!" : "📚 Good to Know"}
                        </p>
                        <p className="text-gray-700 leading-relaxed text-base font-medium">{scenario.explanation}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end pt-4">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {!showResult ? (
                  <Button 
                    size="lg"
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-gradient-to-r from-profit to-green-400 hover:shadow-xl hover:shadow-profit/30 disabled:opacity-50 transition-all duration-500 ease-out hover:brightness-110"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Submit Answer
                  </Button>
                ) : (
                  <Button size="lg" onClick={handleNextScenario} className="bg-gradient-to-r from-profit to-green-400 hover:shadow-xl hover:shadow-profit/30 transition-all duration-500 ease-out hover:brightness-110">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {currentScenario < scenarios.length - 1 ? "Next Scenario" : "View Results"}
                  </Button>
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SpotTheScam;
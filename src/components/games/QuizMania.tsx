import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, CheckCircle, XCircle, RotateCcw, Info, Trophy, Sparkles, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import quizData from '@/data/quizData.json';

interface QuizManiaProps {
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QuizMania = ({ onBack }: QuizManiaProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const getRandomQuestions = () => {
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  useEffect(() => {
    setQuestions(getRandomQuestions());
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    if (isCorrect) setScore(score + 1);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setQuestions(getRandomQuestions());
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
  };

  if (questions.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (gameComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card-hover border-2 rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
            
            <CardHeader className="relative z-10 text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-primary to-primary-glow mb-4 mx-auto"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Quiz Complete!
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
                  isGood ? 'from-blue-400 to-primary' :
                  'from-orange-400 to-red-500'
                } bg-clip-text text-transparent`}>
                  {percentage}%
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    You scored {score} out of {questions.length}
                  </p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg text-muted-foreground max-w-md mx-auto"
                  >
                    {isExcellent ? "🎉 Excellent! You're a trading expert!" :
                     isGood ? "👏 Good job! Keep learning!" :
                     "📚 Keep studying and try again!"}
                  </motion.p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button size="lg" onClick={handleRestart} className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 ease-out hover:brightness-110">
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

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="fixed top-4 left-4 z-50">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="sm" onClick={onBack} className="bg-background/80 backdrop-blur-sm shadow-lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Quiz Mania</h3>
              <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-3 bg-muted" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(progress)}% Complete</span>
            <span>{questions.length - currentQuestion - 1} remaining</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card-hover border-2 rounded-3xl shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-24 translate-x-24" />
          
          <CardHeader className="relative z-10 pb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-2xl font-bold leading-relaxed">{question.question}</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="space-y-4">
              {question.options.map((option, index) => {
                const isCorrect = index === question.correct;
                const isSelected = selectedAnswer === index;
                const isWrong = showResult && isSelected && !isCorrect;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                    whileHover={!showResult ? { scale: 1.02, x: 5 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                  >
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left h-auto p-6 text-base font-medium border-2 rounded-2xl transition-all duration-500 ease-out ${
                        showResult
                          ? isCorrect
                            ? "bg-green-50 border-green-200 text-green-800 shadow-lg shadow-green-100"
                            : isWrong
                            ? "bg-red-50 border-red-200 text-red-800 shadow-lg shadow-red-100"
                            : "opacity-60"
                          : isSelected
                          ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/20"
                          : "hover:bg-muted/50 hover:border-primary/30 hover:shadow-md"
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          showResult
                            ? isCorrect
                              ? "bg-green-500 border-green-500"
                              : isWrong
                              ? "bg-red-500 border-red-500"
                              : "border-muted-foreground"
                            : isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}>
                          {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-white" />}
                          {showResult && isWrong && <XCircle className="w-5 h-5 text-white" />}
                          {!showResult && isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                          {!showResult && !isSelected && <span className="text-sm font-bold text-muted-foreground">{String.fromCharCode(65 + index)}</span>}
                        </div>
                        <span className="flex-1">{option}</span>
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
                  <div className={`p-6 rounded-2xl border-2 ${
                    selectedAnswer === question.correct
                      ? "bg-green-50 border-green-200"
                      : "bg-blue-50 border-blue-200"
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedAnswer === question.correct ? "bg-green-500" : "bg-blue-500"
                      }`}>
                        <Info className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-lg mb-2 ${
                          selectedAnswer === question.correct ? "text-green-700" : "text-blue-700"
                        }`}>
                          {selectedAnswer === question.correct ? "🎉 Correct! Great job!" : "💡 Key Learning Point"}
                        </p>
                        <p className="text-gray-700 leading-relaxed font-medium">{question.explanation}</p>
                        {selectedAnswer !== question.correct && (
                          <p className="text-blue-600 text-sm mt-2 font-medium">
                            💪 Keep learning - every question helps you become a better investor!
                          </p>
                        )}
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
                    className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 transition-all duration-500 ease-out hover:brightness-110"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Submit Answer
                  </Button>
                ) : (
                  <Button size="lg" onClick={handleNextQuestion} className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 ease-out hover:brightness-110">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {currentQuestion < questions.length - 1 ? "Next Question" : "View Results"}
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

export default QuizMania;
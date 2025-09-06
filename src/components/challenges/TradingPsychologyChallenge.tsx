import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Trophy, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import tradingPsychologyData from "@/data/tradingPsychologyData.json";

interface TradingPsychologyChallengeProps {
  onBack: () => void;
}

interface Question {
  id: number;
  scenario: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const TradingPsychologyChallenge = ({ onBack }: TradingPsychologyChallengeProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const totalQuestions = 10;

  useEffect(() => {
    const shuffled = [...tradingPsychologyData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, totalQuestions));
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
    const shuffled = [...tradingPsychologyData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, totalQuestions));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
  };

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
    </div>;
  }

  if (gameComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Brain className="w-16 h-16 mx-auto text-teal-500 mb-4" />
          <CardTitle className="text-3xl">Psychology Challenge Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-4xl font-bold">{score}/{totalQuestions}</div>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleRestart} className="bg-teal-500">
              <RotateCcw className="w-4 h-4 mr-2" />
              Practice Again
            </Button>
            <Button variant="outline" onClick={onBack}>Back to Hub</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-teal-600">Trading Psychology Challenge</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span>{currentQuestion + 1} of {totalQuestions}</span>
            <Badge>{currentQ?.category}</Badge>
          </div>
          <Progress value={((currentQuestion + 1) / totalQuestions) * 100} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{currentQ?.scenario}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQ?.options.map((option, index) => {
            const isCorrect = showResult && index === currentQ.correct;
            const isSelected = selectedAnswer === index;
            const isWrong = showResult && isSelected && index !== currentQ.correct;
            
            return (
              <Button
                key={index}
                variant="outline"
                className={`w-full p-4 text-left justify-start ${
                  isCorrect ? "bg-green-500 text-white" :
                  isWrong ? "bg-red-500 text-white" :
                  isSelected ? "bg-teal-500 text-white" : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                {String.fromCharCode(65 + index)}. {option}
                {showResult && isCorrect && <CheckCircle className="w-4 h-4 ml-auto" />}
                {showResult && isWrong && <XCircle className="w-4 h-4 ml-auto" />}
              </Button>
            );
          })}
          
          {showResult && (
            <div className="p-4 bg-teal-50 rounded-lg">
              <p className="text-sm">{currentQ?.explanation}</p>
            </div>
          )}
          
          <div className="flex justify-center">
            {!showResult ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="bg-teal-500"
              >
                Submit Choice
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="bg-teal-500">
                {currentQuestion + 1 >= totalQuestions ? 'View Results' : 'Next Scenario'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingPsychologyChallenge;
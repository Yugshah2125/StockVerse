import { useState } from "react";
import { Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MiniGamesHub from "@/components/games/MiniGamesHub";
import QuizMania from "@/components/games/QuizMania";
import SpotTheScam from "@/components/games/SpotTheScam";

const MiniGames = () => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const handleSelectGame = (gameId: string) => {
    setCurrentGame(gameId);
  };

  const handleBackToHub = () => {
    setCurrentGame(null);
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'quiz-mania':
        return <QuizMania onBack={handleBackToHub} />;
      case 'spot-the-scam':
        return <SpotTheScam onBack={handleBackToHub} />;
      default:
        return <MiniGamesHub onSelectGame={handleSelectGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        


        {/* Game Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGame || 'hub'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {renderGame()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MiniGames;
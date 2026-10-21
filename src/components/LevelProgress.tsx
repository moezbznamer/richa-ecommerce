import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Medal, Star, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUserLevels } from '@/hooks/useUserLevels';
import confetti from 'canvas-confetti';

const LevelProgress: React.FC = () => {
  const { levelInfo, loading, simulateSpending } = useUserLevels();
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate numbers when they change
  useEffect(() => {
    const totalDuration = 1000;
    const progressDuration = 800;
    
    // Animate total spent
    const totalInterval = setInterval(() => {
      setAnimatedTotal(prev => {
        const diff = levelInfo.total_spent - prev;
        const step = diff / (totalDuration / 50);
        if (Math.abs(diff) < 0.1) {
          clearInterval(totalInterval);
          return levelInfo.total_spent;
        }
        return prev + step;
      });
    }, 50);

    // Animate progress
    const progressInterval = setInterval(() => {
      setAnimatedProgress(prev => {
        const diff = levelInfo.progress_percentage - prev;
        const step = diff / (progressDuration / 50);
        if (Math.abs(diff) < 0.1) {
          clearInterval(progressInterval);
          return levelInfo.progress_percentage;
        }
        return prev + step;
      });
    }, 50);

    return () => {
      clearInterval(totalInterval);
      clearInterval(progressInterval);
    };
  }, [levelInfo.total_spent, levelInfo.progress_percentage]);

  const getBadgeIcon = (badgeName: string) => {
    switch (badgeName) {
      case 'Gold':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'Silver':
        return <Award className="w-6 h-6 text-gray-400" />;
      case 'Bronze':
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <Star className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBadgeColor = (badgeName: string) => {
    switch (badgeName) {
      case 'Gold':
        return 'from-yellow-400 to-yellow-600';
      case 'Silver':
        return 'from-gray-300 to-gray-500';
      case 'Bronze':
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF']
    });
  };

  const handleSimulateSpending = async (amount: number) => {
    const leveledUp = await simulateSpending(amount);
    if (leveledUp) {
      triggerConfetti();
    }
  };

  if (loading) {
    return (
      <div className="luxury-card p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-700 rounded mb-4"></div>
        <div className="h-6 bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="luxury-card p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
      
      <div className="relative z-10">
        {/* Header with badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div
              className={`p-3 rounded-full bg-gradient-to-br ${getBadgeColor(levelInfo.badge_name)}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {getBadgeIcon(levelInfo.badge_name)}
            </motion.div>
            <div>
              <h2 className="text-2xl font-oswald font-bold text-white">
                Niveau {levelInfo.current_level}
              </h2>
              <p className="text-gray-300 text-sm">
                Badge: {levelInfo.badge_name === 'None' ? 'Aucun' : levelInfo.badge_name}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <motion.p 
              className="text-3xl font-bold text-luxury-gold"
              key={animatedTotal}
            >
              {animatedTotal.toFixed(2)} DT
            </motion.p>
            <p className="text-gray-300 text-sm">Total dépensé</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-white font-medium">
              Progression vers le niveau {levelInfo.current_level + 1}
            </span>
            <span className="text-luxury-gold font-medium">
              {animatedProgress.toFixed(1)}%
            </span>
          </div>
          
          <div className="relative">
            <Progress 
              value={animatedProgress} 
              className="h-3 bg-gray-700"
            />
            {/* Glow effect */}
            <div 
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-primary to-luxury-gold rounded-full opacity-20 transition-all duration-500"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>
              {Math.max(0, (levelInfo.current_level - 1) * 100)} DT
            </span>
            <span>
              {levelInfo.next_milestone} DT
            </span>
          </div>
        </div>

        {/* Next milestone */}
        <div className="mb-6 p-4 bg-luxury-black/30 rounded-lg border border-gray-700">
          <p className="text-white font-medium mb-1">Prochain objectif</p>
          <p className="text-gray-300 text-sm">
            Encore {(levelInfo.next_milestone - levelInfo.total_spent).toFixed(2)} DT 
            pour atteindre le niveau {levelInfo.current_level + 1}
          </p>
        </div>

        {/* Badge milestones */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Badges disponibles</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Bronze', threshold: 100, icon: Medal, color: 'text-orange-600' },
              { name: 'Silver', threshold: 200, icon: Award, color: 'text-gray-400' },
              { name: 'Gold', threshold: 300, icon: Trophy, color: 'text-yellow-500' }
            ].map((badge) => {
              const Icon = badge.icon;
              const achieved = levelInfo.total_spent >= badge.threshold;
              
              return (
                <motion.div
                  key={badge.name}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    achieved 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-600 bg-gray-800/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${badge.color} ${!achieved && 'opacity-50'}`} />
                  <p className={`text-xs ${achieved ? 'text-white' : 'text-gray-500'}`}>
                    {badge.name}
                  </p>
                  <p className={`text-xs ${achieved ? 'text-primary' : 'text-gray-600'}`}>
                    {badge.threshold} DT
                  </p>
                  {achieved && (
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Simulation buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={() => handleSimulateSpending(50)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter 50 DT
          </Button>
          <Button
            onClick={() => handleSimulateSpending(-50)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            size="sm"
          >
            <Minus className="w-4 h-4 mr-2" />
            Annuler 50 DT
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LevelProgress;
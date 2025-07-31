import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Scale, TrendingUp, Users, Target, Trophy, Crown, Star, Zap, Phone, Sparkles, Rocket } from "lucide-react";
import { UserData } from "./PatrimonialChat";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WeightCalculatorProps {
  userData: UserData;
}

export function WeightCalculator({ userData }: WeightCalculatorProps) {
  const [displayWeight, setDisplayWeight] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const calculatePatrimonialWeight = () => {
    let totalWeight = 0;
    let maxWeight = 0;

    if (userData.age) {
      const ageScore = Math.max(0, 65 - userData.age);
      totalWeight += ageScore * 0.3;
      maxWeight += 30 * 0.3;
    }

    if (userData.monthlyIncome) {
      let incomeScore = 0;
      if (userData.monthlyIncome <= 1512) incomeScore = 10;
      else if (userData.monthlyIncome <= 2183) incomeScore = 50;
      else if (userData.monthlyIncome <= 3000) incomeScore = 70;
      else if (userData.monthlyIncome <= 4302) incomeScore = 90;
      else incomeScore = 95;
      
      totalWeight += incomeScore * 0.25;
      maxWeight += 95 * 0.25;
    }

    if (userData.currentSavings && userData.monthlyIncome) {
      const savingsRate = (userData.currentSavings / userData.monthlyIncome) * 100;
      let savingsScore = 0;
      if (savingsRate < 8) savingsScore = 20;
      else if (savingsRate < 15) savingsScore = 40;
      else if (savingsRate < 25) savingsScore = 70;
      else savingsScore = 90;
      
      totalWeight += savingsScore * 0.25;
      maxWeight += 90 * 0.25;
    }

    if (userData.csp) {
      let cspScore = 0;
      if (userData.csp.includes('Cadre')) cspScore = 85;
      else if (userData.csp.includes('intermédiaire')) cspScore = 60;
      else if (userData.csp.includes('Artisan') || userData.csp.includes('Commerçant')) cspScore = 70;
      else if (userData.csp.includes('Retraité')) cspScore = 50;
      else cspScore = 40;
      
      totalWeight += cspScore * 0.2;
      maxWeight += 85 * 0.2;
    }

    return Math.round((totalWeight / maxWeight) * 100);
  };

  const patrimonialWeight = calculatePatrimonialWeight();

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = patrimonialWeight / 50;
      const interval = setInterval(() => {
        current += increment;
        if (current >= patrimonialWeight) {
          current = patrimonialWeight;
          clearInterval(interval);
          setShowComparison(true);
        }
        setDisplayWeight(Math.round(current));
      }, 30);
      
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, [patrimonialWeight]);

  const calculateRank = (weight: number) => {
    const adultFrench = 52000000;
    const rank = Math.round(adultFrench * (100 - weight) / 100);
    return { rank, total: adultFrench };
  };

  const { rank, total } = calculateRank(patrimonialWeight);

  const calculatePotentialGains = () => {
    const potentialImprovement = Math.min(30, patrimonialWeight < 50 ? 25 : patrimonialWeight < 70 ? 20 : 15);
    const newWeight = Math.min(95, patrimonialWeight + potentialImprovement);
    const newRank = Math.round(total * (100 - newWeight) / 100);
    const placeGained = Math.max(rank - newRank, 1000);
    
    return { placeGained, newRank, potentialImprovement };
  };

  const { placeGained, newRank, potentialImprovement } = calculatePotentialGains();

  const getWeightCategory = (weight: number) => {
    if (weight >= 90) return { label: "Elite Patrimoniale", icon: Crown, color: "from-yellow-400 to-orange-500", emoji: "👑" };
    if (weight >= 75) return { label: "Champion", icon: Trophy, color: "from-emerald-400 to-teal-500", emoji: "🏆" };
    if (weight >= 50) return { label: "Challenger", icon: Target, color: "from-blue-400 to-indigo-500", emoji: "🎯" };
    if (weight >= 25) return { label: "Aspirant", icon: Rocket, color: "from-purple-400 to-pink-500", emoji: "🚀" };
    return { label: "Débutant", icon: Star, color: "from-orange-400 to-red-500", emoji: "⭐" };
  };

  const category = getWeightCategory(patrimonialWeight);

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <Card className="glass-card border-0 p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh-1 opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-mesh-2 opacity-20"></div>
        
        <div className="relative text-center space-y-8">
          <div>
            <h2 className="text-4xl lg:text-6xl font-black text-gradient tracking-tight">
              Combien je pèse ?
            </h2>
            <p className="text-lg text-muted-foreground mt-3 font-medium">
              Votre poids patrimonial dans l'écosystème français
            </p>
          </div>

          {/* Score principal avec animation */}
          <motion.div className="relative flex justify-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-2xl scale-110"></div>
              
              <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-primary p-1">
                <div className="w-full h-full rounded-full bg-background/90 flex flex-col items-center justify-center backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <div className="text-5xl lg:text-7xl font-black text-gradient">
                      {displayWeight}
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-muted-foreground">
                      /100
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="mt-3"
                    >
                      <Badge className={`bg-gradient-to-r ${category.color} text-white px-4 py-2 text-sm font-bold shadow-lg`}>
                        {category.emoji} {category.label}
                      </Badge>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="glass-card p-6 border border-primary/20">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 rounded-full bg-gradient-primary">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">#{rank.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Classement national</div>
                  </div>
                </div>

                <div className="glass-card p-6 border border-secondary/20">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 rounded-full bg-gradient-secondary">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">
                      {userData.age && userData.age < 35 ? "25-34 ans" : 
                       userData.age && userData.age < 50 ? "35-49 ans" : "50+ ans"}
                    </div>
                    <div className="text-sm text-muted-foreground">Votre génération</div>
                  </div>
                </div>

                <div className="glass-card p-6 border border-accent/20">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 rounded-full bg-gradient-accent">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">
                      {userData.csp?.includes('Cadre') ? "Cadres" : 
                       userData.csp?.includes('intermédiaire') ? "Prof. inter." : "Général"}
                    </div>
                    <div className="text-sm text-muted-foreground">Votre catégorie</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="glass-card border-2 border-accent/30 p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-accent opacity-5"></div>
        
        <div className="relative space-y-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-3 p-4 bg-gradient-accent rounded-2xl text-white mb-6"
            >
              <Zap className="w-8 h-8" />
              <div className="text-left">
                <h3 className="text-2xl font-black">Simulation d'accompagnement</h3>
                <p className="text-sm opacity-90">Votre potentiel avec un expert</p>
              </div>
            </motion.div>
            
            <div className="text-3xl lg:text-4xl font-black text-center mb-8">
              <span className="text-muted-foreground">Vous êtes </span>
              <span className="text-gradient">#{rank.toLocaleString()}</span>
              <span className="text-muted-foreground">, voulez-vous gagner</span>
              <br />
              <span className="text-gradient">+{placeGained.toLocaleString()} places</span>
              <span className="text-muted-foreground"> ?</span>
            </div>
          </div>

          <div className="text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-hero hover:opacity-90 text-white text-lg font-bold px-12 py-6 rounded-2xl shadow-2xl hover:shadow-glow-accent transition-all duration-300"
              >
                <Phone className="w-6 h-6 mr-3" />
                Réserver mon bilan patrimonial gratuit
                <Sparkles className="w-6 h-6 ml-3" />
              </Button>
            </motion.div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Bilan de 45min avec un conseiller senior - Gratuit et sans engagement
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UserData } from "@/components/PatrimonialChat";
import { Trophy, Star, Target, Crown, TrendingUp, Shield, Zap, Award } from "lucide-react";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface GamificationBadgesProps {
  userData: UserData;
  completedSteps: number;
  totalSteps: number;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-500';
    case 'rare':
      return 'bg-blue-500';
    case 'epic':
      return 'bg-purple-500';
    case 'legendary':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
};

const getRarityBorder = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'border-gray-200';
    case 'rare':
      return 'border-blue-200';
    case 'epic':
      return 'border-purple-200';
    case 'legendary':
      return 'border-amber-200';
    default:
      return 'border-gray-200';
  }
};

export function GamificationBadges({ userData, completedSteps, totalSteps }: GamificationBadgesProps) {
  const generateBadges = (): BadgeData[] => {
    const badges: BadgeData[] = [];

    // Progression badges
    badges.push({
      id: 'first-step',
      name: 'Premier Pas',
      description: 'Vous avez commencé votre parcours patrimonial',
      icon: <Star className="w-4 h-4" />,
      earned: completedSteps >= 1,
      rarity: 'common'
    });

    badges.push({
      id: 'halfway',
      name: 'À Mi-Parcours',
      description: 'Vous avez complété la moitié du questionnaire',
      icon: <Target className="w-4 h-4" />,
      earned: completedSteps >= Math.floor(totalSteps / 2),
      rarity: 'rare'
    });

    badges.push({
      id: 'completion',
      name: 'Profil Complet',
      description: 'Vous avez terminé votre profil patrimonial',
      icon: <Trophy className="w-4 h-4" />,
      earned: completedSteps >= totalSteps,
      rarity: 'epic'
    });

    // Age-based badges
    if (userData.age && userData.age < 30) {
      badges.push({
        id: 'young-investor',
        name: 'Investisseur Précoce',
        description: 'Vous vous intéressez au patrimoine avant 30 ans',
        icon: <Zap className="w-4 h-4" />,
        earned: true,
        rarity: 'rare'
      });
    }

    if (userData.age && userData.age < 40) {
      badges.push({
        id: 'time-advantage',
        name: 'Avantage Temps',
        description: 'Vous avez plus de 20 ans d\'avance sur la moyenne',
        icon: <Crown className="w-4 h-4" />,
        earned: true,
        rarity: 'epic'
      });
    }

    // Income-based badges
    if (userData.monthlyIncome && userData.monthlyIncome > 4302) {
      badges.push({
        id: 'top-earner',
        name: 'Top 10%',
        description: 'Vous faites partie des 10% de revenus les plus élevés',
        icon: <Crown className="w-4 h-4" />,
        earned: true,
        rarity: 'legendary'
      });
    } else if (userData.monthlyIncome && userData.monthlyIncome > 3000) {
      badges.push({
        id: 'high-earner',
        name: 'Haut Revenu',
        description: 'Vous gagnez plus que 80% des Français',
        icon: <TrendingUp className="w-4 h-4" />,
        earned: true,
        rarity: 'epic'
      });
    }

    // Savings-based badges
    if (userData.currentSavings && userData.monthlyIncome) {
      const savingsRate = (userData.currentSavings / userData.monthlyIncome) * 100;
      
      if (savingsRate >= 25) {
        badges.push({
          id: 'super-saver',
          name: 'Épargnant Exemplaire',
          description: 'Vous épargnez plus de 25% de vos revenus',
          icon: <Shield className="w-4 h-4" />,
          earned: true,
          rarity: 'legendary'
        });
      } else if (savingsRate >= 17) {
        badges.push({
          id: 'good-saver',
          name: 'Bon Épargnant',
          description: 'Vous épargnez dans la moyenne française',
          icon: <Target className="w-4 h-4" />,
          earned: true,
          rarity: 'rare'
        });
      }
    }

    // Risk profile badges
    if (userData.riskProfile === 'DYNAMIQUE') {
      badges.push({
        id: 'risk-taker',
        name: 'Preneur de Risque',
        description: 'Vous osez investir pour la performance',
        icon: <Zap className="w-4 h-4" />,
        earned: true,
        rarity: 'epic'
      });
    }

    // Employment status badges
    if (userData.employmentStatus === 'TNS') {
      badges.push({
        id: 'entrepreneur',
        name: 'Entrepreneur',
        description: 'Vous faites partie des 11% de travailleurs indépendants',
        icon: <Crown className="w-4 h-4" />,
        earned: true,
        rarity: 'epic'
      });
    }

    // Household structure badges
    if (userData.householdStructure === 'Couple sans enfant') {
      badges.push({
        id: 'power-couple',
        name: 'Power Couple',
        description: 'Vous avez le profil d\'épargne le plus favorable',
        icon: <Star className="w-4 h-4" />,
        earned: true,
        rarity: 'rare'
      });
    }

    return badges;
  };

  const badges = generateBadges();
  const earnedBadges = badges.filter(b => b.earned);

  if (badges.length === 0) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg text-white">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Récompenses Débloquées</h3>
          <p className="text-sm text-muted-foreground">
            {earnedBadges.length} sur {badges.length} badges obtenus
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              badge.earned
                ? `${getRarityBorder(badge.rarity)} bg-gradient-to-br from-background to-${badge.rarity === 'legendary' ? 'amber' : badge.rarity === 'epic' ? 'purple' : badge.rarity === 'rare' ? 'blue' : 'gray'}-50 hover:shadow-lg`
                : 'border-muted bg-muted/20 opacity-50'
            }`}
          >
            <div className="text-center space-y-2">
              <div
                className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white ${
                  badge.earned ? getRarityColor(badge.rarity) : 'bg-muted-foreground'
                }`}
              >
                {badge.icon}
              </div>
              
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <h4 className="font-medium text-sm">{badge.name}</h4>
                  {badge.earned && (
                    <Badge variant="outline" className={`text-xs ${getRarityBorder(badge.rarity)}`}>
                      {badge.rarity}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-tight">
                  {badge.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {earnedBadges.length > 0 && (
        <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
          <p className="text-sm text-success-foreground text-center">
            🎉 Félicitations ! Vous avez débloqué {earnedBadges.length} récompense{earnedBadges.length > 1 ? 's' : ''} !
          </p>
        </div>
      )}
    </Card>
  );
}
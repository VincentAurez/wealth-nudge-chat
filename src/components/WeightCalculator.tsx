import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Scale, TrendingUp, Users, Target, Medal, ArrowUp, Phone } from "lucide-react";
import { UserData } from "./PatrimonialChat";

interface WeightCalculatorProps {
  userData: UserData;
}

export function WeightCalculator({ userData }: WeightCalculatorProps) {
  // Calcul du "poids patrimonial" basé sur plusieurs critères
  const calculatePatrimonialWeight = () => {
    let totalWeight = 0;
    let maxWeight = 0;

    // Âge (plus jeune = plus d'avantage temps)
    if (userData.age) {
      const ageScore = Math.max(0, 65 - userData.age); // Plus on est jeune, plus le score est haut
      totalWeight += ageScore * 0.3; // 30% du poids total
      maxWeight += 30 * 0.3;
    }

    // Revenus (percentile basé sur les données INSEE)
    if (userData.monthlyIncome) {
      let incomeScore = 0;
      if (userData.monthlyIncome <= 1512) incomeScore = 10;
      else if (userData.monthlyIncome <= 2183) incomeScore = 50;
      else if (userData.monthlyIncome <= 3000) incomeScore = 70;
      else if (userData.monthlyIncome <= 4302) incomeScore = 90;
      else incomeScore = 95;
      
      totalWeight += incomeScore * 0.25; // 25% du poids total
      maxWeight += 95 * 0.25;
    }

    // Taux d'épargne
    if (userData.currentSavings && userData.monthlyIncome) {
      const savingsRate = (userData.currentSavings / userData.monthlyIncome) * 100;
      let savingsScore = 0;
      if (savingsRate < 8) savingsScore = 20;
      else if (savingsRate < 15) savingsScore = 40;
      else if (savingsRate < 25) savingsScore = 70;
      else savingsScore = 90;
      
      totalWeight += savingsScore * 0.25; // 25% du poids total
      maxWeight += 90 * 0.25;
    }

    // CSP (Catégorie Socio-Professionnelle)
    if (userData.csp) {
      let cspScore = 0;
      if (userData.csp.includes('Cadre')) cspScore = 85;
      else if (userData.csp.includes('intermédiaire')) cspScore = 60;
      else if (userData.csp.includes('Artisan') || userData.csp.includes('Commerçant')) cspScore = 70;
      else if (userData.csp.includes('Retraité')) cspScore = 50;
      else cspScore = 40;
      
      totalWeight += cspScore * 0.2; // 20% du poids total
      maxWeight += 85 * 0.2;
    }

    return Math.round((totalWeight / maxWeight) * 100);
  };

  const patrimonialWeight = calculatePatrimonialWeight();

  // Calcul du rang approximatif
  const calculateRank = (weight: number) => {
    const totalFrench = 67000000; // Population française
    const adultFrench = 52000000; // Population adulte approximative
    
    // Conversion du poids en rang (plus le poids est élevé, meilleur est le rang)
    const rankPercentile = weight;
    const rank = Math.round(adultFrench * (100 - rankPercentile) / 100);
    
    return { rank, total: adultFrench };
  };

  const { rank, total } = calculateRank(patrimonialWeight);

  // Calcul des gains potentiels avec accompagnement
  const calculatePotentialGains = () => {
    const currentRank = rank;
    const potentialImprovement = Math.min(30, patrimonialWeight < 50 ? 25 : patrimonialWeight < 70 ? 20 : 15);
    const newWeight = Math.min(95, patrimonialWeight + potentialImprovement);
    const newRank = Math.round(total * (100 - newWeight) / 100);
    const placeGained = currentRank - newRank;
    
    return { 
      placeGained: Math.max(placeGained, 1000), // Minimum 1000 places
      newRank,
      potentialImprovement 
    };
  };

  const { placeGained, newRank, potentialImprovement } = calculatePotentialGains();

  const getWeightCategory = (weight: number) => {
    if (weight >= 90) return { label: "Poids Lourd 🏆", color: "bg-yellow-500", description: "Elite patrimoniale" };
    if (weight >= 75) return { label: "Poids Moyen+ 💪", color: "bg-green-500", description: "Très bien positionné" };
    if (weight >= 50) return { label: "Poids Moyen 📈", color: "bg-blue-500", description: "Position correcte" };
    if (weight >= 25) return { label: "Poids Léger+ 🎯", color: "bg-orange-500", description: "À optimiser" };
    return { label: "Poids Plume 🪶", color: "bg-red-500", description: "Potentiel énorme" };
  };

  const category = getWeightCategory(patrimonialWeight);

  const getComparisonData = () => {
    const ageGroup = userData.age && userData.age < 35 ? "25-34 ans" : 
                     userData.age && userData.age < 50 ? "35-49 ans" : "50+ ans";
    
    const cspGroup = userData.csp?.includes('Cadre') ? "Cadres" : 
                     userData.csp?.includes('intermédiaire') ? "Prof. intermédiaires" :
                     userData.csp?.includes('Artisan') ? "Indépendants" : "Population générale";

    return { ageGroup, cspGroup };
  };

  const { ageGroup, cspGroup } = getComparisonData();

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 p-3 bg-gradient-to-r from-primary to-accent rounded-lg text-white">
            <Scale className="w-8 h-8" />
            <div className="text-left">
              <h2 className="text-2xl font-bold">Combien je pèse ?</h2>
              <p className="text-sm opacity-90">Votre poids patrimonial français</p>
            </div>
          </div>
          
          <div className="bg-background/80 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className={`p-3 rounded-full ${category.color} text-white`}>
                <Scale className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{patrimonialWeight}/100</div>
                <Badge className={`${category.color} text-white mt-2`}>
                  {category.label}
                </Badge>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold">
                Vous êtes classé <span className="text-primary font-bold">#{rank.toLocaleString()}</span>
              </p>
              <p className="text-muted-foreground">
                sur {total.toLocaleString()} adultes français ({category.description})
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Comparaisons détaillées */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Vs votre génération</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Français {ageGroup}</span>
                <span className="font-semibold">{patrimonialWeight}e percentile</span>
              </div>
              <Progress value={patrimonialWeight} className="h-3" />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                {userData.age && userData.age < 35 
                  ? `À votre âge, vous avez ${65 - userData.age} ans d'avance sur l'âge moyen des clients patrimoniaux (60 ans). Cet avantage temps peut vous faire gagner des centaines de milliers d'euros.`
                  : userData.age && userData.age < 50
                  ? `Vous êtes dans la tranche d'âge où les Français commencent à optimiser leur patrimoine. Encore ${65 - userData.age} ans avant la retraite pour maximiser vos gains.`
                  : `Vous êtes dans la tranche d'âge où 48% des clients patrimoniaux sont des CSP+ actifs. Le timing est optimal pour sécuriser votre retraite.`
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Vs votre catégorie</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{cspGroup}</span>
                <span className="font-semibold">Top {100 - patrimonialWeight}%</span>
              </div>
              <Progress value={patrimonialWeight} className="h-3" />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                {userData.csp?.includes('Cadre') 
                  ? `Comme 21,6% d'actifs cadres, vous avez accès à l'épargne salariale et aux meilleurs dispositifs. Vous faites partie du top 25% patrimonial français.`
                  : userData.csp?.includes('intermédiaire')
                  ? `Votre position médiane vous donne un bon équilibre revenus/charges pour une épargne structurée et optimisée.`
                  : userData.csp?.includes('Artisan')
                  ? `Comme 6,5% de travailleurs non-salariés, vous épargnez plus (35%) et êtes sur-représentés chez les hauts patrimoines.`
                  : `Votre catégorie peut grandement bénéficier d'une optimisation patrimoniale pour maximiser chaque euro épargné.`
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Simulateur d'amélioration */}
      <Card className="p-6 border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg text-white">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Simulateur d'accompagnement</h3>
            <p className="text-muted-foreground">Votre potentiel d'amélioration avec un conseiller</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-background/80 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-500" />
                Votre situation actuelle
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Poids patrimonial:</span>
                  <span className="font-semibold">{patrimonialWeight}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Classement:</span>
                  <span className="font-semibold">#{rank.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Catégorie:</span>
                  <span className="font-semibold">{category.label}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-4 rounded-lg border border-green-500/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                <ArrowUp className="w-5 h-5" />
                Avec accompagnement pro
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Poids potentiel:</span>
                  <span className="font-semibold text-green-600">{patrimonialWeight + potentialImprovement}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Nouveau rang:</span>
                  <span className="font-semibold text-green-600">#{newRank.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Places gagnées:</span>
                  <span className="font-semibold text-green-600">+{placeGained.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center space-y-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="text-lg font-bold text-primary mb-2">
              🎯 Vous êtes {rank.toLocaleString()}e, voulez-vous être accompagné pour gagner au moins {placeGained.toLocaleString()} places ?
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Notre accompagnement personnalisé peut vous faire passer de <strong>{category.label}</strong> à 
              <strong className="text-green-600"> {getWeightCategory(patrimonialWeight + potentialImprovement).label}</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-background/60 p-3 rounded-lg">
              <div className="font-semibold text-primary">📊 Optimisation</div>
              <div>Allocation, fiscalité, produits</div>
            </div>
            <div className="bg-background/60 p-3 rounded-lg">
              <div className="font-semibold text-primary">🎯 Stratégie</div>
              <div>Plan personnalisé sur 10-20 ans</div>
            </div>
            <div className="bg-background/60 p-3 rounded-lg">
              <div className="font-semibold text-primary">🔄 Suivi</div>
              <div>Ajustements réguliers</div>
            </div>
          </div>

          <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
            <Phone className="w-5 h-5 mr-2" />
            Réserver mon bilan patrimonial gratuit
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Bilan de 45min avec un conseiller senior - Gratuit et sans engagement
          </p>
        </div>
      </Card>
    </div>
  );
}
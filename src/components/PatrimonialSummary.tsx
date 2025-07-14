import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { ObjectivesModal } from "@/components/ObjectivesModal";
import { ChoroplethMap } from "@/components/ChoroplethMap";
import { PatrimonialCharts } from "@/components/PatrimonialCharts";
import { UserData } from "@/components/PatrimonialChat";
import { TrendingUp, Users, Award, Target, Sparkles, Calendar, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

interface PatrimonialSummaryProps {
  userData: UserData;
}

export function PatrimonialSummary({ userData }: PatrimonialSummaryProps) {
  const [showObjectivesModal, setShowObjectivesModal] = useState(false);
  const [modalViewed, setModalViewed] = useState(false);

  // Auto-open modal when component mounts (only once)
  useEffect(() => {
    if (!modalViewed) {
      const timer = setTimeout(() => {
        setShowObjectivesModal(true);
        setModalViewed(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [modalViewed]);
const calculatePercentile = (
  field: keyof UserData,
  value: number | string
): number => {
    switch (field) {
      case 'age': {
        // Plus jeune que la moyenne = percentile plus bas
        const ageVal = Number(value);
        if (ageVal < 40) return 25;
        if (ageVal < 55) return 50;
        return 75;
      }
      
      case 'monthlyIncome': {
        const income = Number(value);
        if (income <= 1512) return 10;
        if (income <= 2183) return 50;
        if (income <= 3000) return 70;
        if (income <= 4302) return 90;
        return 95;
      }
      
      case 'currentSavings': {
        const savings = Number(value);
        const savingsRate = userData.monthlyIncome ? (savings / userData.monthlyIncome) * 100 : 0;
        if (savingsRate < 8) return 20;
        if (savingsRate < 15) return 40;
        if (savingsRate < 25) return 70;
        return 90;
      }
      
      default:
        return 50;
    }
  };

const getTrend = (
  field: keyof UserData,
  value: number | string
): 'up' | 'down' | 'neutral' => {
  switch (field) {
    case 'age':
      return Number(value) < 55 ? 'up' : 'neutral';
      
    case 'monthlyIncome': {
      const income = Number(value);
      return income > 2183 ? 'up' : income < 1512 ? 'down' : 'neutral';
    }
      
    case 'currentSavings': {
      const savings = Number(value);
      const savingsRate = userData.monthlyIncome ? (savings / userData.monthlyIncome) * 100 : 0;
      return savingsRate > 17 ? 'up' : savingsRate < 10 ? 'down' : 'neutral';
    }
      
      default:
        return 'neutral';
    }
  };

  const getAdvancedComparison = (
    field: keyof UserData,
    value: number | string
  ): string => {
    switch (field) {
      case 'age': {
        const ageVal = Number(value);
        if (ageVal < 40) {
          return `Vous avez ${60 - ageVal} ans d'avance sur l'âge moyen des clients patrimoniaux. Cet avantage temps peut vous faire gagner des dizaines de milliers d'euros grâce aux intérêts composés.`;
        } else if (ageVal >= 40 && ageVal < 55) {
          return `Vous faites partie des 47% de clients qui rajeunissent la clientèle patrimoniale. Vous avez encore ${65 - ageVal} ans avant la retraite pour optimiser votre patrimoine.`;
        } else {
          return `Vous êtes dans la tranche d'âge où 48% des clients patrimoniaux sont des CSP+ actifs ou récemment retraités. Le timing est optimal pour sécuriser votre retraite.`;
        }
      }

      case 'householdStructure': {
        const struct = value as string;
        if (struct === 'Personne seule') {
          return `Vous faites partie des 38,5% de ménages français vivant seuls. Statistiquement, vous avez 47% de chances d'être propriétaire vs 78% pour les couples. L'épargne solitaire demande plus de discipline mais offre plus de liberté.`;
        } else if (struct === 'Couple sans enfant') {
          return `Vous faites partie des 25,1% de ménages français en couple sans enfant. Avec 78% de taux de propriété et moins de charges, vous avez le profil d'épargne le plus favorable.`;
        } else if (struct.includes('Couple avec enfant')) {
          return `Vous faites partie des 23,4% de ménages avec enfants. Malgré les charges familiales, 70% des couples avec enfants sont propriétaires. Votre épargne doit concilier projets familiaux et retraite.`;
        } else {
          return `Vous faites partie des 9,5% de familles monoparentales, une proportion qui a augmenté depuis 1990. Votre situation demande une stratégie patrimoniale spécifique pour concilier sécurité et transmission.`;
        }
      }

      case 'csp': {
        const cspValue = value as string;
        if (cspValue.includes('Cadre')) {
          return `Vous faites partie des 21,6% d'actifs cadres. Avec un salaire moyen de 4 600€ nets, vous avez accès à 14,3% de dispositifs d'épargne salariale. Vous êtes dans le top 25% patrimonial.`;
        } else if (cspValue.includes('intermédiaire')) {
          return `Vous faites partie des 24,7% de professions intermédiaires. Cette position médiane vous donne un bon équilibre revenus/charges pour une épargne régulière et structurée.`;
        } else if (cspValue.includes('Employé') || cspValue.includes('Ouvrier')) {
          return `Avec les employés et ouvriers (45% des actifs), votre épargne nécessite plus d'optimisation. Chaque euro compte et les bons placements peuvent faire la différence sur le long terme.`;
        } else if (cspValue.includes('Artisan') || cspValue.includes('Commerçant')) {
          return `Vous faites partie des 6,5% de travailleurs non-salariés. Vous épargnez en moyenne 35% de vos revenus et êtes sur-représentés (14%) chez les ménages à haut patrimoine.`;
        } else {
          return `Votre statut de retraité vous place dans une catégorie qui épargne encore 18-25% de ses revenus, souvent pour la transmission patrimoniale.`;
        }
      }

      case 'employmentStatus': {
        const status = value as string;
        if (status === 'TNS') {
          return `Comme 11% des travailleurs français, vous êtes indépendant. Les TNS épargnent 35% en moyenne (vs 17% salariés) pour compenser l'absence de filet social. Vous êtes 14% parmi les hauts patrimoines.`;
        } else {
          return `Comme 89% des travailleurs, vous êtes salarié. Vous bénéficiez de la sécurité sociale mais devez compenser un taux d'épargne naturellement plus faible (17% vs 35% pour les TNS).`;
        }
      }

    case 'monthlyIncome': {
      const income = Number(value);
      if (income <= 1512) {
        return `Avec ce revenu, vous êtes parmi les 10% les plus modestes mais chaque euro bien placé compte double. Focus sur les livrets défiscalisés et l'épargne automatique même à petites doses.`;
      } else if (income <= 2183) {
          return `Au revenu médian français, vous représentez la France moyenne. Votre capacité d'épargne de ~200-400€/mois peut générer un patrimoine significatif avec les bons véhicules.`;
        } else if (income <= 3000) {
          return `Avec ce revenu supérieur à 70% des Français, votre capacité d'épargne de 450-600€/mois ouvre l'accès à tous les placements : assurance-vie, PER, immobilier locatif.`;
        } else if (income <= 4302) {
          return `Dans le top 20% des revenus, votre capacité d'épargne de 800-1200€/mois vous permet diversification et optimisation fiscale avancée. Vous entrez dans la cible des CGP.`;
        } else {
          return `Top 10% des revenus français ! Votre capacité d'épargne > 1500€/mois nécessite une structuration patrimoniale professionnelle : holdings, assurance-vie multi-supports, immobilier.`;
      }
    }

    case 'currentSavings': {
      const savings = Number(value);
      const savingsRate = userData.monthlyIncome ? (savings / userData.monthlyIncome) * 100 : 0;
      if (savingsRate < 8) {
        return `Votre taux d'épargne ${savingsRate.toFixed(1)}% est à optimiser. Les Français de votre âge épargnent généralement 10-18%. Marge de progression : +${(userData.monthlyIncome! * 0.15 - savings).toFixed(0)}€/mois.`;
      } else if (savingsRate >= 8 && savingsRate < 15) {
        return `Taux correct mais optimisable. Potentiel : +${(userData.monthlyIncome! * 0.18 - savings).toFixed(0)}€/mois pour atteindre la moyenne française de 18%.`;
      } else if (savingsRate >= 15 && savingsRate < 25) {
        return `Excellent ! Vous épargnez comme 50% des Français les plus disciplinés. À ce rythme, vous constituez un patrimoine solide pour vos projets.`;
      } else {
        return `Exceptionnel ! Votre taux d'épargne ${savingsRate.toFixed(1)}% rivalise avec les indépendants (35%) et les retraités aisés (25%). Vous maximisez votre potentiel patrimonial.`;
      }
      }

      case 'riskProfile':
        if (value === 'PRUDENT') {
          return `Comme 70% des Français, vous privilégiez la sécurité. 84% ont un Livret A, 46% une assurance-vie majoritairement en fonds euro. Votre profil correspond à l'allocation française typique.`;
        } else if (value === 'EQUILIBRE') {
          return `Profil équilibré idéal pour optimiser rendement/sécurité. Allocation recommandée : 50% sécurisé (fonds euro, livrets) / 50% dynamique (actions, SCPI). Vous dépassez la moyenne française.`;
        } else {
          return `Profil dynamique rare ! Seuls 16,7% des Français investissent en actions. Allocation possible : 20% sécurisé / 80% actions. Vous rejoignez l'élite des investisseurs particuliers.`;
        }

      default:
        return "Information prise en compte pour votre profil patrimonial.";
    }
  };

  const generatePersonalizedAdvice = () => {
    const { age, monthlyIncome, currentSavings, employmentStatus, riskProfile, goalsPriority } = userData;
    const savingsRate = (monthlyIncome && currentSavings) ? (currentSavings / monthlyIncome) * 100 : 0;
    
    const advice = [];

    // Immediate action steps
    const immediateActions = [];
    const mediumTermActions = [];
    const longTermActions = [];

    // Age-based strategy
    if (age && age < 35) {
      immediateActions.push({
        icon: "🚀",
        title: "Maximiser l'effet temps",
        description: "Ouvrir un PEA pour profiter de 20+ ans d'exonération fiscale",
        priority: "Urgent"
      });
      longTermActions.push({
        icon: "📈",
        title: "Stratégie aggressive",
        description: "Allocation 70% actions / 30% obligations possible à votre âge",
        projection: `Potentiel +${Math.round((currentSavings || 0) * 0.7 * Math.pow(1.07, 30 - (age || 25)))}€ à 55 ans`
      });
    } else if (age && age >= 35 && age < 50) {
      immediateActions.push({
        icon: "⚖️",
        title: "Équilibrer et sécuriser",
        description: "Diversifier entre immobilier, actions et fonds sécurisés",
        priority: "Important"
      });
      mediumTermActions.push({
        icon: "🏠",
        title: "Investissement immobilier",
        description: "Envisager SCPI ou investissement locatif selon votre capacité",
        estimation: `Avec ${currentSavings || 0}€/mois, apport possible: ${Math.round((currentSavings || 0) * 12 * 5)}€`
      });
    } else if (age && age >= 50) {
      immediateActions.push({
        icon: "🛡️",
        title: "Sécuriser les acquis",
        description: "Privilégier fonds euro et obligations pour protéger le capital",
        priority: "Critique"
      });
      immediateActions.push({
        icon: "💰",
        title: "Optimiser la retraite",
        description: "Maximiser les versements sur PER pour défiscalisation",
        economy: `Économie fiscale possible: ${Math.round((monthlyIncome || 0) * 12 * 0.3 * 0.3)}€/an`
      });
    }

    // Income-based optimization
    if (monthlyIncome && monthlyIncome > 4000) {
      immediateActions.push({
        icon: "🎯",
        title: "Défiscalisation avancée",
        description: "PER, Pinel, FCPI/FIP selon votre tranche marginale",
        priority: "Rentable",
        economy: `Réduction d'impôt possible: ${Math.round(monthlyIncome * 12 * 0.2 * 0.41)}€/an`
      });
    }

    // Savings rate optimization
    if (savingsRate < 15) {
      immediateActions.push({
        icon: "💡",
        title: "Optimiser le budget",
        description: "Analyser vos charges pour augmenter l'épargne",
        priority: "Urgent",
        potential: `+${Math.round((monthlyIncome || 0) * 0.15 - (currentSavings || 0))}€/mois possible`
      });
    } else if (savingsRate > 25) {
      mediumTermActions.push({
        icon: "🎖️",
        title: "Excellent épargnant",
        description: "Optimiser l'allocation pour maximiser le rendement",
        recognition: "Top 10% des épargnants français"
      });
    }

    // Risk profile optimization
    if (riskProfile === 'PRUDENT' && age && age < 45) {
      mediumTermActions.push({
        icon: "📊",
        title: "Éducation financière",
        description: "Formation aux investissements pour dépasser la peur du risque",
        impact: "Rendement potentiel +2-4%/an avec diversification actions"
      });
    }

    // Goals-based advice
    if (goalsPriority && goalsPriority.length > 0) {
      const primaryGoal = goalsPriority[0];
      if (primaryGoal.includes('retraite')) {
        longTermActions.push({
          icon: "🏖️",
          title: "Plan retraite personnalisé",
          description: "Calculer le capital nécessaire pour votre niveau de vie souhaité",
          calculation: `Capital estimé nécessaire: ${Math.round((monthlyIncome || 0) * 12 * 25)}€`
        });
      }
      if (primaryGoal.includes('immobilier') || primaryGoal.includes('résidence')) {
        mediumTermActions.push({
          icon: "🏡",
          title: "Projet immobilier",
          description: "Optimiser l'apport et négocier le meilleur taux",
          timeline: "Réalisable dans 2-3 ans selon votre épargne actuelle"
        });
      }
    }

    return { immediateActions, mediumTermActions, longTermActions };
  };

  const generateFinalAdvice = (): string => {
    const { immediateActions } = generatePersonalizedAdvice();
    let advice = "🎯 **Actions prioritaires pour vous :**\n\n";
    
    immediateActions.slice(0, 3).forEach((action, index) => {
      advice += `${index + 1}. **${action.title}** ${action.icon}\n`;
      advice += `   ${action.description}\n`;
      if (action.priority) advice += `   🏷️ Priorité: ${action.priority}\n`;
      if (action.economy) advice += `   💰 ${action.economy}\n`;
      if (action.potential) advice += `   📈 ${action.potential}\n`;
      advice += "\n";
    });

    return advice;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Votre Profil Patrimonial</h3>
            <p className="text-muted-foreground">Analyse complète basée sur les données INSEE</p>
          </div>
        </div>
        
        <div className="bg-background/60 rounded-lg p-4 mb-4">
          <pre className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {generateFinalAdvice()}
          </pre>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userData.age && (
          <StatsCard
            title="Âge"
            value={`${userData.age} ans`}
            comparison={getAdvancedComparison('age', userData.age)}
            percentile={calculatePercentile('age', userData.age)}
            trend={getTrend('age', userData.age)}
            category="age"
          />
        )}

        {userData.monthlyIncome && (
          <StatsCard
            title="Revenu mensuel"
            value={`${userData.monthlyIncome.toLocaleString()}€`}
            comparison={getAdvancedComparison('monthlyIncome', userData.monthlyIncome)}
            percentile={calculatePercentile('monthlyIncome', userData.monthlyIncome)}
            trend={getTrend('monthlyIncome', userData.monthlyIncome)}
            category="income"
          />
        )}

        {userData.currentSavings && (
          <StatsCard
            title="Épargne mensuelle"
            value={`${userData.currentSavings.toLocaleString()}€`}
            comparison={getAdvancedComparison('currentSavings', userData.currentSavings)}
            percentile={calculatePercentile('currentSavings', userData.currentSavings)}
            trend={getTrend('currentSavings', userData.currentSavings)}
            category="savings"
          />
        )}

        {userData.householdStructure && (
          <StatsCard
            title="Structure du foyer"
            value={userData.householdStructure}
            comparison={getAdvancedComparison('householdStructure', userData.householdStructure)}
            category="household"
          />
        )}

        {userData.csp && (
          <StatsCard
            title="Catégorie socio-professionnelle"
            value={userData.csp}
            comparison={getAdvancedComparison('csp', userData.csp)}
            category="csp"
          />
        )}

        {userData.employmentStatus && (
          <StatsCard
            title="Statut professionnel"
            value={userData.employmentStatus === 'TNS' ? 'Travailleur non salarié' : 'Salarié'}
            comparison={getAdvancedComparison('employmentStatus', userData.employmentStatus)}
            category="csp"
          />
        )}

        {userData.riskProfile && (
          <StatsCard
            title="Profil de risque"
            value={userData.riskProfile === 'PRUDENT' ? 'Prudent' : userData.riskProfile === 'EQUILIBRE' ? 'Équilibré' : 'Dynamique'}
            comparison={getAdvancedComparison('riskProfile', userData.riskProfile)}
            category="general"
          />
        )}
      </div>

      {/* Charts Section */}
      <PatrimonialCharts userData={userData} />

      {/* France Map */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 text-center">🗺️ Votre position géographique</h3>
        <ChoroplethMap 
          departements={[
            { id: userData.zipcode?.substring(0, 2) || '75', avgSavingRate: 18.5 },
            { id: '13', avgSavingRate: 16.2 },
            { id: '69', avgSavingRate: 19.8 },
            { id: '59', avgSavingRate: 15.1 },
            { id: '31', avgSavingRate: 17.9 }
          ]}
          userDept={userData.zipcode?.substring(0, 2) || '75'}
        />
      </Card>

      {/* Advanced Action Plan */}
      {(() => {
        const { immediateActions, mediumTermActions, longTermActions } = generatePersonalizedAdvice();
        return (
          <div className="space-y-6">
            {/* Immediate Actions */}
            {immediateActions.length > 0 && (
              <Card className="p-6 bg-gradient-to-r from-destructive/5 to-orange-500/5 border-destructive/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-destructive to-orange-500 rounded-lg text-white">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">Actions Immédiates (0-3 mois)</h3>
                </div>
                <div className="grid gap-4">
                  {immediateActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-background/60 rounded-lg border border-destructive/10">
                      <span className="text-2xl">{action.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{action.title}</h4>
                        <p className="text-muted-foreground text-sm mb-2">{action.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {action.priority && (
                            <Badge variant="destructive" className="text-xs">{action.priority}</Badge>
                          )}
                          {action.economy && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">{action.economy}</Badge>
                          )}
                          {action.potential && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">{action.potential}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Medium Term Actions */}
            {mediumTermActions.length > 0 && (
              <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-primary/5 border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-primary rounded-lg text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">Objectifs Moyen Terme (3-12 mois)</h3>
                </div>
                <div className="grid gap-4">
                  {mediumTermActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-background/60 rounded-lg border border-blue-500/10">
                      <span className="text-2xl">{action.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{action.title}</h4>
                        <p className="text-muted-foreground text-sm mb-2">{action.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {action.estimation && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">{action.estimation}</Badge>
                          )}
                          {action.timeline && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">{action.timeline}</Badge>
                          )}
                          {action.recognition && (
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">{action.recognition}</Badge>
                          )}
                          {action.impact && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">{action.impact}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Long Term Actions */}
            {longTermActions.length > 0 && (
              <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-accent/5 border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-accent rounded-lg text-white">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">Vision Long Terme (1-10 ans)</h3>
                </div>
                <div className="grid gap-4">
                  {longTermActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-background/60 rounded-lg border border-purple-500/10">
                      <span className="text-2xl">{action.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{action.title}</h4>
                        <p className="text-muted-foreground text-sm mb-2">{action.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {action.projection && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">{action.projection}</Badge>
                          )}
                          {action.calculation && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">{action.calculation}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        );
      })()}

      <Card className="p-6 text-center bg-gradient-to-br from-success/10 via-primary/5 to-accent/10 border-success/20">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-success to-primary rounded-full">
            <Award className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Félicitations !
        </h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Vous avez maintenant une feuille de route personnalisée et une vision claire de votre position patrimoniale. 
          Vous faites désormais partie des <strong>15% de Français</strong> qui ont une stratégie patrimoniale structurée.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg border border-success/20">
            <div className="font-bold text-lg text-success">100%</div>
            <div className="text-sm text-muted-foreground">Profil complété</div>
          </div>
          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <div className="font-bold text-lg text-primary">{(() => {
              const { immediateActions, mediumTermActions, longTermActions } = generatePersonalizedAdvice();
              return immediateActions.length + mediumTermActions.length + longTermActions.length;
            })()}</div>
            <div className="text-sm text-muted-foreground">Actions personnalisées</div>
          </div>
          <div className="p-4 bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-lg border border-accent/20">
            <div className="font-bold text-lg text-accent">
              {userData.goalsPriority?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Objectifs définis</div>
          </div>
        </div>

        <Badge variant="outline" className="bg-success/10 text-success border-success/30 mb-6 px-4 py-2">
          ✨ Profil patrimonial expert • Niveau : Avancé
        </Badge>
        
        {/* CTA Calendly */}
        <div className="pt-4 border-t border-border/30">
          <h4 className="text-lg font-semibold mb-3">Prêt pour la suite ?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Discutez de vos objectifs avec un conseiller patrimonial expérimenté
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#d3381c] text-white hover:bg-[#bb2e17] shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <a 
              href="https://calendly.com/votre-conseiller/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Prendre un rendez-vous avec un conseiller
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </Card>

      {/* Objectives Modal */}
      <ObjectivesModal
        isOpen={showObjectivesModal}
        onClose={() => setShowObjectivesModal(false)}
        userData={userData}
      />
    </div>
  );
}
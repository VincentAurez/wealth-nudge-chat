import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { ObjectivesModal } from "@/components/ObjectivesModal";
import { ChoroplethMap } from "@/components/ChoroplethMap";
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
  const calculatePercentile = (field: keyof UserData, value: any): number => {
    switch (field) {
      case 'age':
        // Plus jeune que la moyenne = percentile plus bas
        if (value < 40) return 25;
        if (value < 55) return 50;
        return 75;
      
      case 'monthlyIncome':
        if (value <= 1512) return 10;
        if (value <= 2183) return 50;
        if (value <= 3000) return 70;
        if (value <= 4302) return 90;
        return 95;
      
      case 'currentSavings':
        const savingsRate = userData.monthlyIncome ? (value / userData.monthlyIncome) * 100 : 0;
        if (savingsRate < 8) return 20;
        if (savingsRate < 15) return 40;
        if (savingsRate < 25) return 70;
        return 90;
      
      default:
        return 50;
    }
  };

  const getTrend = (field: keyof UserData, value: any): 'up' | 'down' | 'neutral' => {
    switch (field) {
      case 'age':
        return value < 55 ? 'up' : 'neutral';
      
      case 'monthlyIncome':
        return value > 2183 ? 'up' : value < 1512 ? 'down' : 'neutral';
      
      case 'currentSavings':
        const savingsRate = userData.monthlyIncome ? (value / userData.monthlyIncome) * 100 : 0;
        return savingsRate > 17 ? 'up' : savingsRate < 10 ? 'down' : 'neutral';
      
      default:
        return 'neutral';
    }
  };

  const getAdvancedComparison = (field: keyof UserData, value: any): string => {
    switch (field) {
      case 'age':
        if (value < 40) {
          return `Vous avez ${60 - value} ans d'avance sur l'âge moyen des clients patrimoniaux. Cet avantage temps peut vous faire gagner des dizaines de milliers d'euros grâce aux intérêts composés.`;
        } else if (value >= 40 && value < 55) {
          return `Vous faites partie des 47% de clients qui rajeunissent la clientèle patrimoniale. Vous avez encore ${65 - value} ans avant la retraite pour optimiser votre patrimoine.`;
        } else {
          return `Vous êtes dans la tranche d'âge où 48% des clients patrimoniaux sont des CSP+ actifs ou récemment retraités. Le timing est optimal pour sécuriser votre retraite.`;
        }

      case 'householdStructure':
        if (value === 'Personne seule') {
          return `Vous faites partie des 38,5% de ménages français vivant seuls. Statistiquement, vous avez 47% de chances d'être propriétaire vs 78% pour les couples. L'épargne solitaire demande plus de discipline mais offre plus de liberté.`;
        } else if (value === 'Couple sans enfant') {
          return `Vous faites partie des 25,1% de ménages français en couple sans enfant. Avec 78% de taux de propriété et moins de charges, vous avez le profil d'épargne le plus favorable.`;
        } else if (value?.includes('Couple avec enfant')) {
          return `Vous faites partie des 23,4% de ménages avec enfants. Malgré les charges familiales, 70% des couples avec enfants sont propriétaires. Votre épargne doit concilier projets familiaux et retraite.`;
        } else {
          return `Vous faites partie des 9,5% de familles monoparentales, une proportion qui a augmenté depuis 1990. Votre situation demande une stratégie patrimoniale spécifique pour concilier sécurité et transmission.`;
        }

      case 'csp':
        if (value?.includes('Cadre')) {
          return `Vous faites partie des 21,6% d'actifs cadres. Avec un salaire moyen de 4 600€ nets, vous avez accès à 14,3% de dispositifs d'épargne salariale. Vous êtes dans le top 25% patrimonial.`;
        } else if (value?.includes('intermédiaire')) {
          return `Vous faites partie des 24,7% de professions intermédiaires. Cette position médiane vous donne un bon équilibre revenus/charges pour une épargne régulière et structurée.`;
        } else if (value?.includes('Employé') || value?.includes('Ouvrier')) {
          return `Avec les employés et ouvriers (45% des actifs), votre épargne nécessite plus d'optimisation. Chaque euro compte et les bons placements peuvent faire la différence sur le long terme.`;
        } else if (value?.includes('Artisan') || value?.includes('Commerçant')) {
          return `Vous faites partie des 6,5% de travailleurs non-salariés. Vous épargnez en moyenne 35% de vos revenus et êtes sur-représentés (14%) chez les ménages à haut patrimoine.`;
        } else {
          return `Votre statut de retraité vous place dans une catégorie qui épargne encore 18-25% de ses revenus, souvent pour la transmission patrimoniale.`;
        }

      case 'employmentStatus':
        if (value === 'TNS') {
          return `Comme 11% des travailleurs français, vous êtes indépendant. Les TNS épargnent 35% en moyenne (vs 17% salariés) pour compenser l'absence de filet social. Vous êtes 14% parmi les hauts patrimoines.`;
        } else {
          return `Comme 89% des travailleurs, vous êtes salarié. Vous bénéficiez de la sécurité sociale mais devez compenser un taux d'épargne naturellement plus faible (17% vs 35% pour les TNS).`;
        }

      case 'monthlyIncome':
        if (value <= 1512) {
          return `Avec ce revenu, vous êtes parmi les 10% les plus modestes mais chaque euro bien placé compte double. Focus sur les livrets défiscalisés et l'épargne automatique même à petites doses.`;
        } else if (value <= 2183) {
          return `Au revenu médian français, vous représentez la France moyenne. Votre capacité d'épargne de ~200-400€/mois peut générer un patrimoine significatif avec les bons véhicules.`;
        } else if (value <= 3000) {
          return `Avec ce revenu supérieur à 70% des Français, votre capacité d'épargne de 450-600€/mois ouvre l'accès à tous les placements : assurance-vie, PER, immobilier locatif.`;
        } else if (value <= 4302) {
          return `Dans le top 20% des revenus, votre capacité d'épargne de 800-1200€/mois vous permet diversification et optimisation fiscale avancée. Vous entrez dans la cible des CGP.`;
        } else {
          return `Top 10% des revenus français ! Votre capacité d'épargne > 1500€/mois nécessite une structuration patrimoniale professionnelle : holdings, assurance-vie multi-supports, immobilier.`;
        }

      case 'currentSavings':
        const savingsRate = userData.monthlyIncome ? (value / userData.monthlyIncome) * 100 : 0;
        if (savingsRate < 8) {
          return `Votre taux d'épargne ${savingsRate.toFixed(1)}% est à optimiser. Les Français de votre âge épargnent généralement 10-18%. Marge de progression : +${(userData.monthlyIncome! * 0.15 - value).toFixed(0)}€/mois.`;
        } else if (savingsRate >= 8 && savingsRate < 15) {
          return `Taux correct mais optimisable. Potentiel : +${(userData.monthlyIncome! * 0.18 - value).toFixed(0)}€/mois pour atteindre la moyenne française de 18%.`;
        } else if (savingsRate >= 15 && savingsRate < 25) {
          return `Excellent ! Vous épargnez comme 50% des Français les plus disciplinés. À ce rythme, vous constituez un patrimoine solide pour vos projets.`;
        } else {
          return `Exceptionnel ! Votre taux d'épargne ${savingsRate.toFixed(1)}% rivalise avec les indépendants (35%) et les retraités aisés (25%). Vous maximisez votre potentiel patrimonial.`;
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

  const generateFinalAdvice = (): string => {
    const { age, monthlyIncome, currentSavings, employmentStatus, riskProfile } = userData;
    let advice = "🎯 **Recommandations personnalisées :**\n\n";

    // Age-based advice
    if (age && age < 40) {
      advice += "• **Avantage temps** : Avec votre jeune âge, misez sur le long terme et les intérêts composés\n";
    } else if (age && age > 55) {
      advice += "• **Optimisation retraite** : Priorité à la sécurisation et aux dispositifs de défiscalisation\n";
    }

    // Income-based advice
    if (monthlyIncome && monthlyIncome > 4000) {
      advice += "• **Optimisation fiscale** : Vos revenus justifient PER, défiscalisation immobilière, assurance-vie\n";
    }

    // Savings rate advice
    const savingsRate = (monthlyIncome && currentSavings) ? (currentSavings / monthlyIncome) * 100 : 0;
    if (savingsRate < 15) {
      advice += "• **Augmentation épargne** : Potentiel de +50% d'épargne possible avec optimisation budget\n";
    }

    // Risk profile advice
    if (riskProfile === 'PRUDENT' && age && age < 50) {
      advice += "• **Diversification** : Votre âge permet plus de prise de risque pour optimiser le rendement\n";
    }

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

      {/* France Map */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 text-center">Votre position géographique</h3>
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

      <Card className="p-6 text-center bg-gradient-to-r from-success/5 to-primary/5">
        <Award className="w-12 h-12 mx-auto mb-4 text-success" />
        <h3 className="text-xl font-bold mb-2">Félicitations !</h3>
        <p className="text-muted-foreground mb-4">
          Vous avez maintenant une vision claire de votre position patrimoniale par rapport aux autres Français.
        </p>
        <Badge variant="outline" className="bg-success/10 text-success border-success/30 mb-6">
          Profil patrimonial complété à 100%
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
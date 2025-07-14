import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { StatsCard } from "@/components/StatsCard";
import { PatrimonialSummary } from "@/components/PatrimonialSummary";
import { GamificationBadges } from "@/components/GamificationBadges";
import { FunFactCard } from "@/components/FunFactCard";
import { PositionTooltip } from "@/components/PositionTooltip";
import { StickyCTA } from "@/components/StickyCTA";
import { SortableGoals } from "@/components/SortableGoals";
import { ValueAddedCard } from "@/components/ValueAddedCard";
import { Send, TrendingUp, Users, Award, Target, Sparkles, Home, MapPin, Flag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { pickObjectivesByAge, calculateTargetSavingRate } from "@/utils/objectives";

const FUN_FACTS = [
  {
    text: "💡 Début 2024, 86,9 % des ménages français détiennent au moins un livret d'épargne, et 78,1 % possèdent un Livret A.",
    source: "Insee Focus 2024"
  },
  {
    text: "🏠 57 % des ménages sont propriétaires de leur résidence principale.",
    source: "Compte du logement 2023"
  },
  {
    text: "📈 Seuls 17,4 % des ménages détiennent des actions ou OPCVM : la Bourse reste minoritaire en France.",
    source: "Insee Focus 2024"
  },
  {
    text: "🔑 Les livrets réglementés (Livret A, LDDS, LEP) cumulent ~650 milliards € : assez pour financer six nouveaux réacteurs nucléaires !",
    source: "Le Monde, 2024"
  },
  {
    text: "🛠️ Les travailleurs indépendants épargnent en moyenne 35 % de leur revenu, soit près du double des salariés.",
    source: "Insee Comptes nationaux"
  },
  {
    text: "👤 1 Français sur 3 vit seul, et seuls 47 % de ces personnes seules sont propriétaires.",
    source: "Insee, Ménages 2023"
  },
  {
    text: "🎓 Les familles monoparentales épargnent trois fois moins que la moyenne nationale.",
    source: "Banque de France, 2023"
  },
  {
    text: "📊 Le taux d'assurance-vie frôle 42 % des ménages, mais reste le placement financier n°1 en montant détenu.",
    source: "Insee Focus 2024"
  },
  {
    text: "🚀 Depuis 2020, l'épargne supplémentaire mise de côté par les ménages dépasse 200 milliards €.",
    source: "Banque de France"
  }
];

export interface UserData {
  age?: number;
  goalsPriority?: string[];
  savingGap?: number;
  zipcode?: string;
  householdStructure?: string;
  csp?: string;
  employmentStatus?: 'TNS' | 'SALARIE';
  monthlyIncome?: number;
  currentSavings?: number;
  savingsEffort?: number;
  riskProfile?: 'PRUDENT' | 'EQUILIBRE' | 'DYNAMIQUE';
  assetSplit?: {
    livrets: number;
    assuranceVie: number;
    actions: number;
    immo: number;
    autres: number;
  };
  email?: string;
  phone?: string;
  goals?: string;
  currentAllocation?: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  data?: any;
  showStats?: boolean;
  insights?: {
    local?: { icon: string; label: string; value: number; message: string };
    peers?: { icon: string; label: string; value: number; message: string };
    france?: { icon: string; label: string; value: number; message: string };
  };
}

interface ChatStep {
  id: string;
  question: string;
  type: 'number' | 'select' | 'text' | 'sliders' | 'objectives';
  options?: string[];
  sliders?: { name: string; label: string; min: number; max: number; step: number }[];
  field: keyof UserData;
  completed: boolean;
}

const chatSteps: ChatStep[] = [
  {
    id: 'age',
    question: "Quel est votre âge ? Cette information m'aidera à vous comparer avec vos pairs.",
    type: 'number',
    field: 'age',
    completed: false
  },
  {
    id: 'objectives',
    question: "📌 Priorisez vos objectifs patrimoniaux en les classant par ordre d'importance (glissez-déposez):",
    type: 'objectives',
    field: 'goalsPriority',
    completed: false
  },
  {
    id: 'zipcode',
    question: "Quel est votre code postal ? Cela me permettra de vous comparer aux habitants de votre département.",
    type: 'text',
    field: 'zipcode',
    completed: false
  },
  {
    id: 'household',
    question: "Quelle est la structure de votre foyer ?",
    type: 'select',
    options: ['Personne seule', 'Couple sans enfant', 'Couple avec enfant(s)', 'Famille monoparentale'],
    field: 'householdStructure',
    completed: false
  },
  {
    id: 'csp',
    question: "Quelle est votre catégorie socio-professionnelle ?",
    type: 'select',
    options: ['Cadre/Profession supérieure', 'Profession intermédiaire', 'Employé', 'Ouvrier', 'Artisan/Commerçant', 'Retraité'],
    field: 'csp',
    completed: false
  },
  {
    id: 'status',
    question: "Quel est votre statut professionnel ?",
    type: 'select',
    options: ['Salarié', 'Travailleur non salarié (TNS)'],
    field: 'employmentStatus',
    completed: false
  },
  {
    id: 'income',
    question: "Quel est votre revenu mensuel net (en euros) ?",
    type: 'number',
    field: 'monthlyIncome',
    completed: false
  },
  {
    id: 'savings',
    question: "Combien épargnez-vous actuellement par mois (en euros) ?",
    type: 'number',
    field: 'currentSavings',
    completed: false
  },
  {
    id: 'risk',
    question: "Quel est votre profil d'investisseur ?",
    type: 'select',
    options: ['Prudent (sécurité avant tout)', 'Équilibré (compromis rendement/risque)', 'Dynamique (recherche de performance)'],
    field: 'riskProfile',
    completed: false
  },
  {
    id: 'assets',
    question: "Comment se répartit aujourd'hui votre patrimoine ? Ajustez les curseurs pour indiquer la part approximative de chaque classe d'actifs (total 100%).",
    type: 'sliders',
    field: 'assetSplit',
    sliders: [
      { name: 'livrets', label: 'Livrets & trésorerie', min: 0, max: 100, step: 5 },
      { name: 'assuranceVie', label: 'Assurance-vie fonds €', min: 0, max: 100, step: 5 },
      { name: 'actions', label: 'Actions / UC', min: 0, max: 100, step: 5 },
      { name: 'immo', label: 'Immobilier locatif / SCPI', min: 0, max: 100, step: 5 },
      { name: 'autres', label: 'Autres', min: 0, max: 100, step: 5 }
    ],
    completed: false
  },
  {
    id: 'contact',
    question: "Pour finaliser votre profil, j'ai besoin de vos coordonnées. Entrez votre email :",
    type: 'text',
    field: 'email',
    completed: false
  }
];

export function PatrimonialChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Bienvenue dans votre parcours patrimonial personnalisé ! Je suis là pour vous aider à mieux comprendre votre situation financière par rapport aux autres Français. Plus vous me donnerez d'informations, plus je pourrai vous éclairer sur votre positionnement. Commençons !"
    }
  ]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({});
  const [inputValue, setInputValue] = useState("");
  const [assetSliders, setAssetSliders] = useState({
    livrets: 20,
    assuranceVie: 30,
    actions: 20,
    immo: 20,
    autres: 10
  });
  const [steps, setSteps] = useState(chatSteps);
  const [askingPhone, setAskingPhone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [funFact, setFunFact] = useState<{text: string, source: string} | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [showValueAdded, setShowValueAdded] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize goals when age is set
  useEffect(() => {
    if (userData.age && selectedGoals.length === 0) {
      const suggestedGoals = pickObjectivesByAge(userData.age);
      setSelectedGoals(suggestedGoals);
    }
  }, [userData.age, selectedGoals.length]);

  const progress = (steps.filter(s => s.completed).length / steps.length) * 100;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateInsights = (field: keyof UserData, value: any) => {
    const dept = userData.zipcode ? userData.zipcode.substring(0, 2) : '75';
    const age = userData.age || 40;
    const ageGroup = age < 30 ? '<30' : age < 40 ? '30-40' : age < 50 ? '40-50' : age < 60 ? '50-60' : '60+';
    
    // Mock local comparison (département)
    const localRank = Math.floor(Math.random() * 30) + 55; // 55-85%
    
    // Mock peer comparison (age + household + CSP)
    const peerRank = Math.floor(Math.random() * 40) + 45; // 45-85%
    
    // Mock France comparison
    const franceRank = Math.floor(Math.random() * 50) + 40; // 40-90%
    
    let baseMessage = "";
    
    switch (field) {
      case 'age':
        if (value < 40) {
          baseMessage = `À ${value} ans, vous anticipez plus tôt que la moyenne !`;
        } else if (value >= 40 && value < 55) {
          baseMessage = `À ${value} ans, vous rejoignez la nouvelle génération de clients patrimoniaux.`;
        } else {
          baseMessage = `À ${value} ans, vous êtes dans la tranche d'âge typique du conseil patrimonial.`;
        }
        break;
      
      case 'zipcode':
        baseMessage = `Votre code postal ${value} me permet de vous comparer aux habitants de votre département.`;
        break;
      
      case 'monthlyIncome':
        if (value <= 2183) {
          baseMessage = `Avec ${value}€ nets mensuels, vous êtes proche de la médiane française.`;
        } else if (value <= 4302) {
          baseMessage = `Avec ${value}€ nets mensuels, vous avez un bon potentiel d'épargne.`;
        } else {
          baseMessage = `Avec ${value}€ nets mensuels, vous avez un potentiel patrimonial important.`;
        }
        break;
      
      case 'currentSavings':
        const savingsRate = userData.monthlyIncome ? (value / userData.monthlyIncome) * 100 : 0;
        if (savingsRate < 15) {
          baseMessage = `Vous épargnez ${savingsRate.toFixed(1)}% de vos revenus, il y a de la marge !`;
        } else if (savingsRate >= 15 && savingsRate < 25) {
          baseMessage = `Bravo ! Vous épargnez ${savingsRate.toFixed(1)}% de vos revenus.`;
        } else {
          baseMessage = `Excellent ! Vous épargnez ${savingsRate.toFixed(1)}% de vos revenus.`;
        }
        break;
      
      default:
        baseMessage = "Merci pour cette information !";
    }
    
    return {
      message: baseMessage,
      insights: {
        local: {
          icon: "🏠",
          label: `Dept. ${dept}`,
          value: localRank,
          message: `${localRank}e percentile dans votre département`
        },
        peers: {
          icon: "👥",
          label: `Pairs (${ageGroup})`,
          value: peerRank,
          message: `${peerRank}e percentile parmi vos pairs`
        },
        france: {
          icon: "🇫🇷",
          label: "France",
          value: franceRank,
          message: `${franceRank}e percentile en France`
        }
      }
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Special handling for phone after email
    if (askingPhone) {
      // Validate phone format
      if (inputValue.length < 10) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer un numéro de téléphone valide",
          variant: "destructive"
        });
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputValue
      };

      const newUserData = { ...userData, phone: inputValue };
      setUserData(newUserData);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Parfait ! Maintenant vous avez terminé votre profil patrimonial complet. Voici un résumé de votre positionnement par rapport aux autres Français.",
        showStats: true,
        data: newUserData
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setAskingPhone(false);
      setIsCompleted(true);

      // Mark contact step as completed
      const newSteps = [...steps];
      newSteps[currentStep].completed = true;
      setSteps(newSteps);

      toast({
        title: "Profil complété !",
        description: "Vous débloquez votre analyse patrimoniale complète",
      });

      setInputValue("");
      return;
    }

    if (currentStep >= steps.length) return;

    const currentStepData = steps[currentStep];
    let processedValue: any = inputValue;

    // Process the input based on step type
    if (currentStepData.type === 'number') {
      processedValue = parseInt(inputValue);
      if (isNaN(processedValue)) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer un nombre valide",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStepData.type === 'select') {
      if (currentStepData.field === 'employmentStatus') {
        processedValue = inputValue.includes('TNS') ? 'TNS' : 'SALARIE';
      } else if (currentStepData.field === 'riskProfile') {
        if (inputValue.includes('Prudent')) processedValue = 'PRUDENT';
        else if (inputValue.includes('Équilibré')) processedValue = 'EQUILIBRE';
        else if (inputValue.includes('Dynamique')) processedValue = 'DYNAMIQUE';
      }
    } else if (currentStepData.type === 'text') {
      if (currentStepData.field === 'email') {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputValue)) {
          toast({
            title: "Erreur",
            description: "Veuillez entrer un email valide",
            variant: "destructive"
          });
          return;
        }
      } else if (currentStepData.field === 'zipcode') {
        // Validate zipcode
        if (!/^\d{5}$/.test(inputValue)) {
          toast({
            title: "Erreur",
            description: "Veuillez entrer un code postal valide (5 chiffres)",
            variant: "destructive"
          });
          return;
        }
      }
    } else if (currentStepData.type === 'sliders') {
      // Handle asset split sliders
      processedValue = assetSliders;
    } else if (currentStepData.type === 'objectives') {
      // Handle objectives - use selected goals
      processedValue = selectedGoals;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentStepData.type === 'sliders' 
        ? `Répartition : Livrets ${assetSliders.livrets}%, Assurance-vie ${assetSliders.assuranceVie}%, Actions ${assetSliders.actions}%, Immobilier ${assetSliders.immo}%, Autres ${assetSliders.autres}%`
        : currentStepData.type === 'objectives'
        ? `Mes priorités : 1) ${selectedGoals[0] || 'Non défini'} 2) ${selectedGoals[1] || 'Non défini'} 3) ${selectedGoals[2] || 'Non défini'}`
        : inputValue
    };

    // Update user data
    const newUserData = { ...userData, [currentStepData.field]: processedValue };
    
    // Calculate saving gap after income and savings steps
    if (currentStepData.field === 'currentSavings' && newUserData.monthlyIncome && newUserData.age) {
      const currentSavingsRate = (newUserData.currentSavings / newUserData.monthlyIncome) * 100;
      const targetRate = calculateTargetSavingRate(newUserData.age);
      newUserData.savingGap = Math.max(0, targetRate - currentSavingsRate);
    }
    
    setUserData(newUserData);

    // Mark step as completed
    const newSteps = [...steps];
    newSteps[currentStep].completed = true;
    setSteps(newSteps);

    // Generate insights and fun fact
    const insightData = generateInsights(currentStepData.field, processedValue);
    
const generateContextualFunFact = (step: number, fieldName: keyof UserData, value: any, userData: UserData): {text: string, source: string} => {
  switch (fieldName) {
    case 'age':
      if (value < 25) {
        return { text: "🚀 Les moins de 25 ans qui commencent à épargner maintenant peuvent devenir millionnaires avant 50 ans grâce aux intérêts composés !", source: "Simulation mathématique" };
      } else if (value < 35) {
        return { text: "💪 À votre âge, chaque euro épargné aujourd'hui vaudra 4€ à la retraite grâce au temps.", source: "Calcul actuariel standard" };
      } else if (value < 45) {
        return { text: "⚡ La quarantaine est l'âge pivot : c'est maintenant que les écarts patrimoniaux se creusent vraiment.", source: "Insee Revenus et patrimoine" };
      } else if (value < 55) {
        return { text: "🎯 À 50 ans, les Français ont en moyenne 158 000€ de patrimoine net. Où en êtes-vous ?", source: "Insee 2023" };
      } else {
        return { text: "⏳ Après 55 ans, 73% des Français accélèrent leur épargne pour sécuriser leur retraite.", source: "Banque de France 2024" };
      }

    case 'goalsPriority':
      const topGoal = Array.isArray(value) ? value[0] : '';
      if (topGoal.includes('retraite')) {
        return { text: "🏖️ Un Français sur deux craint de manquer d'argent à la retraite. Anticiper, c'est déjà être dans le bon wagon !", source: "Baromètre retraites 2024" };
      } else if (topGoal.includes('résidence') || topGoal.includes('immobilier')) {
        return { text: "🏠 72% des primo-accédants sous-estiment les frais d'acquisition (notaire, garantie...) qui représentent 8% du prix.", source: "FNAIM 2024" };
      } else if (topGoal.includes('enfants') || topGoal.includes('éducation')) {
        return { text: "🎓 Le coût d'un enfant jusqu'à 20 ans : 185 000€ en moyenne. Les parents épargnent 43% plus que les couples sans enfant.", source: "CNAF 2023" };
      } else {
        return { text: "🎯 Avoir des objectifs clairs multiplie par 3 la probabilité d'atteindre ses objectifs financiers.", source: "Étude comportementale Harvard 2022" };
      }

    case 'zipcode':
      const dept = value.substring(0, 2);
      if (['75', '92', '93', '94'].includes(dept)) {
        return { text: "🏙️ En Île-de-France, 68% du budget des ménages passe dans le logement vs 25% en province. Épargner y est un exploit !", source: "Insee régional 2024" };
      } else if (['06', '13', '83', '84'].includes(dept)) {
        return { text: "☀️ Dans le Sud, les ménages épargnent 2 points de moins qu'au Nord... la douceur de vivre a un prix !", source: "Banque de France territoriale" };
      } else {
        return { text: "🗺️ Votre département influence votre épargne : coût de la vie, fiscalité locale, mentalité... tout compte !", source: "Observatoire territoires 2024" };
      }

    case 'householdStructure':
      if (value === 'Personne seule') {
        return { text: "🙋 Les célibataires épargnent moins mais investissent plus agressivement : 23% en actions vs 14% pour les couples.", source: "AMF Épargne 2024" };
      } else if (value === 'Couple sans enfant') {
        return { text: "👫 Les couples sans enfant : champions de l'épargne avec 22% de taux moyen, et 85% de taux de propriété !", source: "Insee Ménages 2023" };
      } else if (value?.includes('enfant')) {
        return { text: "👨‍👩‍👧‍👦 Avoir des enfants fait chuter l'épargne de 8 points... mais dope la motivation patrimoniale de 200% !", source: "Crédoc Famille 2024" };
      } else {
        return { text: "👤 Les familles monoparentales privilégient l'épargne de précaution : 74% ont un livret A bien garni.", source: "Banque de France 2023" };
      }

    case 'csp':
      if (value?.includes('Cadre')) {
        return { text: "💼 Les cadres investissent 3x plus en actions que la moyenne, mais négligent souvent l'assurance-vie.", source: "AMF Comportements 2024" };
      } else if (value?.includes('intermédiaire')) {
        return { text: "⚖️ Les professions intermédiaires : le sweet spot patrimonial ! Bon revenu + prudence = constitution solide.", source: "Insee Patrimoine 2023" };
      } else if (value?.includes('Artisan') || value?.includes('Commerçant')) {
        return { text: "🔨 Les indépendants détiennent 40% du patrimoine français total alors qu'ils ne sont que 11% de la population !", source: "DGFiP Patrimoine 2024" };
      } else {
        return { text: "💪 Quel que soit votre métier, c'est la régularité qui compte : 50€/mois pendant 20 ans = 12 000€ + intérêts !", source: "Mathématiques financières" };
      }

    case 'employmentStatus':
      if (value === 'TNS') {
        return { text: "🚀 Les TNS représentent 28% des millionnaires français ! Liberté rime avec responsabilité patrimoniale.", source: "Observatoire Patrimoine 2024" };
      } else {
        return { text: "🏢 Les salariés ont un avantage caché : l'épargne salariale moyenne rapporte 1 200€/an de plus que prévu !", source: "AFG Épargne salariale 2024" };
      }

    case 'monthlyIncome':
      if (value <= 2000) {
        return { text: "💎 Avec un petit budget, chaque euro compte double ! Les 'petits' épargnants réguliers battent souvent les 'gros' irréguliers.", source: "Étude comportementale Crédit Agricole" };
      } else if (value <= 3500) {
        return { text: "🎯 Votre tranche de revenu est optimale pour l'immobilier locatif : capacité d'emprunt + défiscalisation = combo gagnant.", source: "CGPI Immobilier 2024" };
      } else if (value <= 5000) {
        return { text: "⭐ Top 20% des revenus ! Vous accédez aux placements privés, FCPR, SCPI de rendement... L'artillerie lourde !", source: "AMF Investisseurs qualifiés" };
      } else {
        return { text: "👑 Top 10% français ! Votre enjeu : optimisation fiscale. 1€ économisé d'impôt = 1€ de plus à investir.", source: "DGFiP Revenus déclaratifs" };
      }

    case 'currentSavings':
      const savingsRate = userData.monthlyIncome ? (value / userData.monthlyIncome) * 100 : 0;
      if (savingsRate < 10) {
        return { text: "🌱 Même 20€/mois c'est énorme ! Warren Buffett a commencé avec 114$ à 11 ans. Le secret : commencer.", source: "Biographie W. Buffett" };
      } else if (savingsRate < 20) {
        return { text: "🚀 Bravo ! Vous épargnez comme un Allemand (18% en moyenne). Les Français font 15%, vous êtes au-dessus !", source: "OCDE Épargne comparée 2024" };
      } else {
        return { text: "🏆 Exceptionnel ! Votre taux d'épargne rivalise avec les Singapouriens (23%). Vous êtes dans l'élite mondiale !", source: "Comparaison internationale OCDE" };
      }

    case 'riskProfile':
      if (value === 'PRUDENT') {
        return { text: "🛡️ La prudence paie ! Les épargnants 'sécurité' dorment mieux et tiennent leurs objectifs 87% du temps.", source: "Étude Vanguard 2024" };
      } else if (value === 'EQUILIBRE') {
        return { text: "⚖️ L'équilibre, c'est malin ! 60% actions / 40% obligations a rapporté 7,2%/an sur 30 ans.", source: "Morningstar historique" };
      } else {
        return { text: "🚀 Profil fonceur ! Les investisseurs 100% actions ont multiplié leur capital par 17 en 30 ans... après avoir survécu aux krachs !", source: "CAC 40 depuis 1990" };
      }

    case 'assetSplit':
      if (value.livrets > 50) {
        return { text: "🏦 Plus de 50% en livrets ? Vous êtes hyper-sécurisé mais l'inflation grignote 2%/an. Diversifier peut aider !", source: "Banque de France inflation" };
      } else if (value.actions > 30) {
        return { text: "📈 Belle allocation actions ! Vous faites partie des 16% de Français qui osent la Bourse. Les statistiques jouent pour vous.", source: "AMF Français et Bourse 2024" };
      } else if (value.immo > 25) {
        return { text: "🏢 L'immobilier, valeur refuge des Français ! 78% du patrimoine des ménages. Vous suivez la tradition nationale.", source: "Insee Patrimoine immobilier" };
      } else {
        return { text: "🎯 Diversification équilibrée ! C'est exactement ce que préconisent 89% des conseillers patrimoniaux.", source: "Sondage CGPI 2024" };
      }

    default:
      return FUN_FACTS[step % FUN_FACTS.length];
  }
};
    // Generate contextual fun fact based on user's response
    const selectedFact = generateContextualFunFact(currentStep, currentStepData.field, processedValue, newUserData);
    setFunFact(selectedFact);
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).lovable?.analytics) {
      (window as any).lovable.analytics.track("fun_fact_shown", { 
        step: currentStep, 
        funFact: selectedFact.text 
      });
    }
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: insightData.message,
      showStats: true,
      insights: insightData.insights,
      data: { field: currentStepData.field, value: processedValue }
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);

    // Special handling for objectives step - show ValueAddedCard
    if (currentStepData.field === 'goalsPriority') {
      setTimeout(() => {
        setShowValueAdded(true);
      }, 2000);
    } 
    // Special savings gap notification
    else if (currentStepData.field === 'currentSavings' && newUserData.savingGap && newUserData.savingGap > 0) {
      setTimeout(() => {
        const gapMessage: Message = {
          id: (Date.now() + 3).toString(),
          type: 'assistant',
          content: `🪙 Vous pourriez épargner ~${newUserData.savingGap?.toFixed(1)}% de plus sans sortir de la moyenne de votre profil — voyons comment !`
        };
        setMessages(prev => [...prev, gapMessage]);
      }, 2500);
    }
    // Special handling for email step - ask for phone next
    else if (currentStepData.field === 'email') {
      setTimeout(() => {
        const phoneMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: "Maintenant, votre numéro de téléphone (format : +33 X XX XX XX XX) :"
        };
        setMessages(prev => [...prev, phoneMessage]);
        setAskingPhone(true);
      }, 1500);
    } else if (currentStep < steps.length - 1) {
      // Move to next step
      setTimeout(() => {
        const nextStepMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: steps[currentStep + 1].question
        };
        setMessages(prev => [...prev, nextStepMessage]);
        setCurrentStep(currentStep + 1);
      }, 1500);
    }

    setInputValue("");
  };

  const handleObjectivesSubmit = () => {
    if (selectedGoals.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un objectif",
        variant: "destructive"
      });
      return;
    }

    // Add user message showing selected goals
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Mes priorités : 1) ${selectedGoals[0] || 'Non défini'} 2) ${selectedGoals[1] || 'Non défini'} 3) ${selectedGoals[2] || 'Non défini'}`
    };

    // Update user data
    const newUserData = { ...userData, goalsPriority: selectedGoals };
    setUserData(newUserData);

    // Mark step as completed
    const newSteps = [...steps];
    newSteps[currentStep].completed = true;
    setSteps(newSteps);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: "Parfait ! Vos objectifs sont bien hiérarchisés. Un conseiller pourra vous aider concrètement sur vos priorités."
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);

    // Show ValueAddedCard after 2 seconds
    setTimeout(() => {
      setShowValueAdded(true);
    }, 2000);

    // Move to next step after 4 seconds
    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        const nextStepMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: steps[currentStep + 1].question
        };
        setMessages(prev => [...prev, nextStepMessage]);
        setCurrentStep(currentStep + 1);
        setShowValueAdded(false);
      }, 4000);
    }
  };

  const renderQuickOptions = () => {
    if (currentStep >= steps.length) return null;
    
    const currentStepData = steps[currentStep];
    if (currentStepData.type === 'select' && currentStepData.options) {
      return (
        <div className="flex flex-wrap gap-2 mb-4">
          {currentStepData.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInputValue(option)}
              className="text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {option}
            </Button>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-full text-white font-medium">
            <Award className="w-5 h-5" />
            Combien je pèse ?
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Découvrez votre poids patrimonial
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Évaluez votre situation financière et comparez-vous aux autres Français en quelques questions simples
          </p>
        </div>

        {/* Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Progression</span>
            <span className="text-sm text-muted-foreground">
              {steps.filter(s => s.completed).length}/{steps.length} étapes
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              Profil social
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              Analyse patrimoniale
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {steps.map((step, index) => (
              <Badge 
                key={step.id} 
                variant={step.completed ? "default" : "secondary"}
                className={step.completed ? "bg-success text-success-foreground" : ""}
              >
                {step.completed ? "✓" : index + 1}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Gamification Badges */}
        <GamificationBadges 
          userData={userData}
          completedSteps={steps.filter(s => s.completed).length}
          totalSteps={steps.length}
        />

        {/* Chat */}
        <Card className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ScrollArea className="h-96 mb-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.1
                    }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-4'
                          : 'bg-muted mr-4'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.insights && (
                        <motion.div 
                          className="mt-4 space-y-3"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {Object.entries(message.insights).map(([key, insight]) => (
                            <motion.div 
                              key={key} 
                              className="bg-background/10 rounded-xl p-3 max-w-[70%]" 
                              role="status"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <motion.span 
                                  className="text-lg"
                                  animate={{ rotate: [0, 5, -5, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  {insight.icon}
                                </motion.span>
                                <span className="text-xs font-medium opacity-80">{insight.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-background/20 rounded-full h-2">
                                  <motion.div 
                                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${insight.value}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                  />
                                </div>
                                <motion.span 
                                  className="text-sm font-bold"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.8 }}
                                >
                                  {insight.value}%
                                </motion.span>
                              </div>
                              <p className="text-xs opacity-75 mt-1">{insight.message}</p>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                      {message.showStats && message.data?.field && !message.insights && (
                        <div className="mt-3 p-3 bg-background/10 rounded-lg">
                          <div className="flex items-center gap-2 text-xs font-medium opacity-80 mb-1">
                            <Target className="w-3 h-3" />
                            Comparaison INSEE
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
                
                {/* Fun Fact at the end */}
                {funFact && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <FunFactCard text={funFact.text} source={funFact.source} />
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </motion.div>

          {/* Quick options */}
          {renderQuickOptions()}
          
          {/* Objectives Component */}
          {currentStep < steps.length && steps[currentStep].type === 'objectives' && (
            <div className="space-y-4 mb-4">
              <SortableGoals 
                items={selectedGoals}
                onChange={setSelectedGoals}
              />
              <Button 
                onClick={handleObjectivesSubmit}
                className="w-full"
                variant="gradient"
              >
                Valider mes objectifs
              </Button>
              
              {/* ValueAddedCard */}
              {showValueAdded && (
                <ValueAddedCard topGoals={selectedGoals} />
              )}
            </div>
          )}
          
          {/* Asset Sliders */}
          {currentStep < steps.length && steps[currentStep].type === 'sliders' && (
            <div className="space-y-4 mb-4">
              <div className="grid grid-cols-1 gap-4">
                {steps[currentStep].sliders?.map((slider) => (
                  <div key={slider.name} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">{slider.label}</label>
                      <span className="text-sm text-muted-foreground">{assetSliders[slider.name as keyof typeof assetSliders]}%</span>
                    </div>
                    <Slider
                      value={[assetSliders[slider.name as keyof typeof assetSliders]]}
                      onValueChange={(value) => setAssetSliders(prev => ({ ...prev, [slider.name]: value[0] }))}
                      max={slider.max}
                      min={slider.min}
                      step={slider.step}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Total:</span>
                <span className={`text-sm font-bold ${Object.values(assetSliders).reduce((sum, val) => sum + val, 0) === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                  {Object.values(assetSliders).reduce((sum, val) => sum + val, 0)}%
                </span>
              </div>
              <Button 
                onClick={() => {
                  if (Object.values(assetSliders).reduce((sum, val) => sum + val, 0) === 100) {
                    handleSendMessage();
                  } else {
                    toast({
                      title: "Erreur",
                      description: "La répartition doit totaliser exactement 100%",
                      variant: "destructive"
                    });
                  }
                }}
                className="w-full"
                variant="gradient"
              >
                Valider la répartition
              </Button>
            </div>
          )}

          {/* Input */}
          {(currentStep < steps.length && steps[currentStep].type !== 'objectives' && !askingPhone) || askingPhone ? (
            <motion.div 
              className="flex gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  askingPhone 
                    ? "Entrez votre téléphone (+33 X XX XX XX XX)..."
                    : steps[currentStep]?.type === 'number' 
                    ? "Entrez un nombre..." 
                    : steps[currentStep]?.type === 'text' && steps[currentStep]?.field === 'email'
                    ? "Entrez votre email..."
                    : "Votre réponse..."
                }
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleSendMessage}
                  variant="gradient"
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <motion.div
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          ) : null}
          
          {currentStep >= steps.length && !askingPhone && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-success text-success-foreground rounded-lg font-medium">
                <Award className="w-5 h-5" />
                Profil patrimonial complété !
              </div>
            </div>
          )}
        </Card>

        {/* Final Summary */}
        {currentStep >= steps.length && (
          <PatrimonialSummary userData={userData} />
        )}
      </div>

      {/* Sticky CTA after step 3 */}
      {currentStep >= 3 && <StickyCTA />}
    </div>
  );
}
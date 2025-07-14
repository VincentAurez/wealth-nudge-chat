import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatsCard } from "@/components/StatsCard";
import { PatrimonialSummary } from "@/components/PatrimonialSummary";
import { GamificationBadges } from "@/components/GamificationBadges";
import { Send, TrendingUp, Users, Award, Target, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface UserData {
  age?: number;
  householdStructure?: string;
  csp?: string;
  employmentStatus?: 'TNS' | 'SALARIE';
  monthlyIncome?: number;
  currentSavings?: number;
  savingsEffort?: number;
  riskProfile?: 'PRUDENT' | 'EQUILIBRE' | 'DYNAMIQUE';
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
}

interface ChatStep {
  id: string;
  question: string;
  type: 'number' | 'select' | 'text';
  options?: string[];
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
  const [steps, setSteps] = useState(chatSteps);
  const [askingPhone, setAskingPhone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const progress = (steps.filter(s => s.completed).length / steps.length) * 100;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateComparison = (field: keyof UserData, value: any) => {
    switch (field) {
      case 'age':
        if (value < 40) {
          return `À ${value} ans, vous faites partie des jeunes qui s'intéressent tôt au conseil patrimonial ! La moyenne d'âge des clients est de 60 ans. C'est un atout : vous avez plus de temps pour faire fructifier votre patrimoine.`;
        } else if (value >= 40 && value < 55) {
          return `À ${value} ans, vous êtes plus jeune que la moyenne des clients patrimoniaux (60 ans). Près de 47% des conseillers notent un rajeunissement de leur clientèle, vous faites partie de cette nouvelle génération.`;
        } else {
          return `À ${value} ans, vous êtes dans la tranche d'âge typique des clients patrimoniaux. C'est à cet âge que la plupart des Français commencent à structurer leur patrimoine pour la retraite.`;
        }
      
      case 'monthlyIncome':
        if (value <= 1512) {
          return `Avec ${value}€ nets mensuels, vous êtes dans les 10% les plus modestes. Cela ne vous empêche pas d'optimiser votre épargne ! Même avec des moyens limités, chaque euro compte.`;
        } else if (value <= 2183) {
          return `Avec ${value}€ nets mensuels, vous êtes proche du revenu médian français (2 183€). La moitié des Français gagnent moins que vous, la moitié gagnent plus.`;
        } else if (value <= 3000) {
          return `Avec ${value}€ nets mensuels, vous gagnez plus que 60% des Français ! Vous avez un potentiel d'épargne intéressant à optimiser.`;
        } else if (value <= 4302) {
          return `Avec ${value}€ nets mensuels, vous faites partie des 20% les mieux rémunérés. Votre capacité d'épargne est nettement supérieure à la moyenne.`;
        } else {
          return `Avec ${value}€ nets mensuels, vous êtes dans le top 10% des revenus français ! Vous avez un potentiel patrimonial très important à structurer.`;
        }
      
      case 'currentSavings':
        const savingsRate = userData.monthlyIncome ? (value / userData.monthlyIncome) * 100 : 0;
        if (savingsRate < 8) {
          return `Vous épargnez ${savingsRate.toFixed(1)}% de vos revenus. C'est en dessous de la moyenne française (17-18%). Il y a de la marge pour optimiser !`;
        } else if (savingsRate >= 8 && savingsRate < 15) {
          return `Vous épargnez ${savingsRate.toFixed(1)}% de vos revenus. C'est correct mais encore en dessous de la moyenne française (17-18%).`;
        } else if (savingsRate >= 15 && savingsRate < 25) {
          return `Bravo ! Vous épargnez ${savingsRate.toFixed(1)}% de vos revenus, dans la moyenne française. Vous avez de bonnes habitudes d'épargne.`;
        } else {
          return `Excellent ! Vous épargnez ${savingsRate.toFixed(1)}% de vos revenus, bien au-dessus de la moyenne française (17-18%). Vous faites partie des épargnants exemplaires !`;
        }
      
      default:
        return "Merci pour cette information ! Elle m'aide à mieux cerner votre profil.";
    }
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
    } else if (currentStepData.type === 'text' && currentStepData.field === 'email') {
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
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };

    // Update user data
    const newUserData = { ...userData, [currentStepData.field]: processedValue };
    setUserData(newUserData);

    // Mark step as completed
    const newSteps = [...steps];
    newSteps[currentStep].completed = true;
    setSteps(newSteps);

    // Generate comparison
    const comparison = generateComparison(currentStepData.field, processedValue);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: comparison,
      showStats: true,
      data: { field: currentStepData.field, value: processedValue }
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);

    // Special handling for email step - ask for phone next
    if (currentStepData.field === 'email') {
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
            Conseil Patrimonial Gamifié
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Découvrez votre position patrimoniale
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Répondez à quelques questions et découvrez comment vous vous situez par rapport aux autres Français
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
          <ScrollArea className="h-96 mb-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-muted mr-4'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.showStats && message.data?.field && (
                      <div className="mt-3 p-3 bg-background/10 rounded-lg">
                        <div className="flex items-center gap-2 text-xs font-medium opacity-80 mb-1">
                          <Target className="w-3 h-3" />
                          Comparaison INSEE
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick options */}
          {renderQuickOptions()}

          {/* Input */}
          {(currentStep < steps.length && !askingPhone) || askingPhone ? (
            <div className="flex gap-2">
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
              <Button 
                onClick={handleSendMessage}
                variant="gradient"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
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
    </div>
  );
}
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Joyride from "react-joyride";
import { DashboardShell } from "@/components/DashboardShell";
import { InfoCard } from "@/components/cards/InfoCard";
import { AllocationPie } from "@/components/graphs/AllocationPie";
import { RiskHorizonLine } from "@/components/graphs/RiskHorizonLine";
import { LossBar } from "@/components/graphs/LossBar";
import { PdfExportButton } from "@/components/PdfExportButton";
import { StickyCTA } from "@/components/StickyCTA";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/components/PatrimonialChat";

interface PatrimonyData {
  assetsDetail: Array<{type: string; amount: number}>;
  debts: Array<{type: string; balance: number}>;
  cashflow: {revenusMensuels: number; depenses: number};
  tolerance: number;
  horizon: number;
  maxLoss: number;
}

export default function TableauDeBord() {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [patrimonyData, setPatrimonyData] = useState<PatrimonyData | null>(null);
  const [showTour, setShowTour] = useState(false);
  const uid = searchParams.get("uid");

  useEffect(() => {
    if (uid) {
      loadUserData(uid);
      // Analytics tracking
      if (typeof window !== "undefined") {
        interface LovableAnalytics {
          lovable?: {
            analytics?: {
              track: (event: string, data: Record<string, unknown>) => void;
            };
          };
        }
        const win = window as unknown as LovableAnalytics;
        win.lovable?.analytics?.track("dashboard_visit", { uid });
      }
    }
  }, [uid]);

  const loadUserData = async (userId: string) => {
    try {
      // Load user patrimony data
      const { data: patrimonyData, error: patrimonyError } = await supabase
        .from('user_patrimony')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (patrimonyError && patrimonyError.code !== 'PGRST116') {
        console.error('Error loading patrimony data:', patrimonyError);
      }

      // Simulate user data from quiz (in real app, this would come from your users table)
      const mockUserData: UserData = {
        age: 35,
        monthlyIncome: 4500,
        currentSavings: 650,
        riskProfile: 'EQUILIBRE',
        assetSplit: {
          livrets: 25,
          assuranceVie: 35,
          actions: 20,
          immo: 15,
          autres: 5
        },
        householdStructure: 'Couple avec enfant(s)',
        csp: 'Cadre/Profession supérieure',
        employmentStatus: 'SALARIE',
        zipcode: '75001',
        email: 'test@example.com',
        goalsPriority: ['Préparer sa retraite', 'Acquérir sa résidence principale', 'Constituer un capital']
      };

      setUserData(mockUserData);
      
      if (patrimonyData) {
        setPatrimonyData({
          assetsDetail: Array.isArray(patrimonyData.assets_detail) ? patrimonyData.assets_detail as Array<{type: string; amount: number}> : [],
          debts: Array.isArray(patrimonyData.debts) ? patrimonyData.debts as Array<{type: string; balance: number}> : [],
          cashflow: typeof patrimonyData.cashflow === 'object' && patrimonyData.cashflow !== null 
            ? patrimonyData.cashflow as {revenusMensuels: number; depenses: number} 
            : {revenusMensuels: 0, depenses: 0},
          tolerance: patrimonyData.tolerance || 10,
          horizon: patrimonyData.horizon || 10,
          maxLoss: patrimonyData.max_loss || 5
        });
      } else {
        // Create default patrimony data
        const defaultPatrimony = {
          assetsDetail: [
            {type: "Livret A", amount: 8500},
            {type: "Assurance Vie", amount: 15000},
            {type: "Actions", amount: 12000},
            {type: "Immobilier", amount: 180000}
          ],
          debts: [
            {type: "Crédit immobilier", balance: 120000},
            {type: "Crédit auto", balance: 8500}
          ],
          cashflow: {revenusMensuels: 4500, depenses: 3200},
          tolerance: 15,
          horizon: 15,
          maxLoss: 10
        };
        setPatrimonyData(defaultPatrimony);
      }

      // Check if it's first visit for tour
      const hasVisited = localStorage.getItem(`dashboard_visited_${userId}`);
      if (!hasVisited) {
        setShowTour(true);
        localStorage.setItem(`dashboard_visited_${userId}`, 'true');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const tourSteps = [
    {
      target: '.dashboard-nav',
      content: 'Naviguez entre les différentes sections de votre patrimoine avec cette barre latérale.',
    },
    {
      target: '.allocation-chart',
      content: 'Visualisez la répartition de vos actifs et comparez-la aux recommandations.',
    },
    {
      target: '.pdf-export',
      content: 'Exportez votre bilan patrimonial complet en PDF à tout moment.',
    },
  ];

  if (!userData || !patrimonyData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Chargement de votre tableau de bord...</div>
      </div>
    );
  }

  const riskProfileLabel = userData.riskProfile === 'PRUDENT' ? 'Prudent' : 
                          userData.riskProfile === 'EQUILIBRE' ? 'Équilibré' : 'Dynamique';

  const totalAssets = patrimonyData.assetsDetail.reduce((sum, asset) => sum + asset.amount, 0);
  const totalDebts = patrimonyData.debts.reduce((sum, debt) => sum + debt.balance, 0);
  const netWealth = totalAssets - totalDebts;

  return (
    <div className="dark">
      <Joyride
        steps={tourSteps}
        run={showTour}
        callback={(data) => {
          if (data.status === 'finished' || data.status === 'skipped') {
            setShowTour(false);
          }
        }}
        styles={{
          options: {
            primaryColor: '#6366f1',
            backgroundColor: '#1e293b',
            textColor: '#f1f5f9',
          }
        }}
      />
      
      <DashboardShell>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-slate-100">Mon Tableau de Bord</h1>
              <p className="text-slate-400 mt-2">Vue d'ensemble de votre patrimoine</p>
            </motion.div>
            
            <div className="pdf-export">
              <PdfExportButton userData={userData} patrimonyData={patrimonyData} />
            </div>
          </div>

          {/* Informations Personnelles */}
          <InfoCard title="Informations Personnelles" icon="👤">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                <div className="text-2xl font-bold text-cyan-400">{userData.age} ans</div>
                <div className="text-slate-400 text-sm">Âge</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                <div className="text-2xl font-bold text-cyan-400">{userData.householdStructure}</div>
                <div className="text-slate-400 text-sm">Situation familiale</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                <div className="text-2xl font-bold text-cyan-400">{userData.csp}</div>
                <div className="text-slate-400 text-sm">Catégorie socio-professionnelle</div>
              </div>
            </div>
          </InfoCard>

          {/* Profil Investisseur */}
          <InfoCard title="Profil Investisseur" icon="📈">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                  <span className="text-slate-300">Profil</span>
                  <span className="text-cyan-400 font-semibold">{riskProfileLabel}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                  <span className="text-slate-300">Tolérance perte</span>
                  <span className="text-cyan-400 font-semibold">{patrimonyData.tolerance}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                  <span className="text-slate-300">Horizon</span>
                  <span className="text-cyan-400 font-semibold">{patrimonyData.horizon} ans</span>
                </div>
              </div>
              <div className="space-y-4">
                <RiskHorizonLine 
                  data={[
                    {name: 'Année 1', risque: 5, rendement: 3},
                    {name: 'Année 5', risque: 8, rendement: 5.5},
                    {name: 'Année 10', risque: 12, rendement: 7},
                    {name: 'Année 15', risque: 15, rendement: 8.5}
                  ]}
                />
                <LossBar value={patrimonyData.maxLoss} />
              </div>
            </div>
          </InfoCard>

          {/* Patrimoine Financier */}
          <InfoCard title="Patrimoine Financier" icon="💰">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-lg border border-cyan-400/30">
                  <div className="text-3xl font-bold text-cyan-400">{netWealth.toLocaleString()} €</div>
                  <div className="text-slate-300 text-sm">Patrimoine Net</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-green-400/20">
                    <div className="text-xl font-bold text-green-400">{totalAssets.toLocaleString()} €</div>
                    <div className="text-slate-400 text-sm">Actifs</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-red-400/20">
                    <div className="text-xl font-bold text-red-400">{totalDebts.toLocaleString()} €</div>
                    <div className="text-slate-400 text-sm">Dettes</div>
                  </div>
                </div>
              </div>
              <div className="allocation-chart">
                <AllocationPie 
                  data={userData.assetSplit}
                  benchmark={{
                    livrets: userData.riskProfile === 'PRUDENT' ? 40 : userData.riskProfile === 'EQUILIBRE' ? 25 : 15,
                    assuranceVie: userData.riskProfile === 'PRUDENT' ? 35 : userData.riskProfile === 'EQUILIBRE' ? 30 : 20,
                    actions: userData.riskProfile === 'PRUDENT' ? 10 : userData.riskProfile === 'EQUILIBRE' ? 25 : 40,
                    immo: userData.riskProfile === 'PRUDENT' ? 10 : userData.riskProfile === 'EQUILIBRE' ? 15 : 20,
                    autres: 5
                  }}
                />
              </div>
            </div>
          </InfoCard>

          {/* Revenus & Dépenses */}
          <InfoCard title="Revenus & Dépenses" icon="💸">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                <div className="text-2xl font-bold text-green-400">{patrimonyData.cashflow.revenusMensuels?.toLocaleString() || userData.monthlyIncome?.toLocaleString()} €</div>
                <div className="text-slate-400 text-sm">Revenus mensuels</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                <div className="text-2xl font-bold text-red-400">{patrimonyData.cashflow.depenses?.toLocaleString() || '3,200'} €</div>
                <div className="text-slate-400 text-sm">Dépenses mensuelles</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                <div className="text-2xl font-bold text-cyan-400">{userData.currentSavings} €</div>
                <div className="text-slate-400 text-sm">Épargne mensuelle</div>
              </div>
            </div>
          </InfoCard>

          {/* Objectifs */}
          <InfoCard title="Objectifs & Projections" icon="🎯">
            <div className="space-y-4">
              {userData.goalsPriority?.map((goal, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-cyan-400/20">
                  <div className="text-2xl font-bold text-indigo-400">#{index + 1}</div>
                  <div className="text-slate-300">{goal}</div>
                </div>
              ))}
            </div>
          </InfoCard>

          {/* Synthèse & Commentaires */}
          <InfoCard title="Synthèse & Commentaires" icon="📝">
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-lg border border-indigo-400/30">
                <h3 className="text-xl font-semibold text-indigo-400 mb-4">Analyse de votre profil</h3>
                <p className="text-slate-300 leading-relaxed">
                  Avec un patrimoine net de {netWealth.toLocaleString()} € et un taux d'épargne de {userData.monthlyIncome ? ((userData.currentSavings || 0) / userData.monthlyIncome * 100).toFixed(1) : 'X'}%, 
                  vous êtes dans une dynamique positive. Votre profil {riskProfileLabel.toLowerCase()} est cohérent avec votre horizon d'investissement de {patrimonyData.horizon} ans.
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-400/30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📞</span>
                  <h3 className="text-xl font-semibold text-cyan-400">Accompagnement personnalisé</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  Un conseiller peut passer en revue votre bilan et formuler vos 3 actions prioritaires. Réservez ici !
                </p>
                <button className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200">
                  Prendre rendez-vous
                </button>
              </div>
            </div>
          </InfoCard>
        </div>
      </DashboardShell>
      
      <StickyCTA />
    </div>
  );
}
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  TrendingUp, 
  Home, 
  Briefcase, 
  CreditCard, 
  DollarSign, 
  Target, 
  FileText, 
  Calculator, 
  Download,
  StickyNote,
  ChevronRight,
  ChevronDown
} from "lucide-react";

const navItems = [
  { id: 'infos', label: 'Infos Personnelles', icon: User },
  { id: 'profil', label: 'Profil Investisseur', icon: TrendingUp },
  { id: 'patrimoine', label: 'Patrimoine Fin. & Immo', icon: Home },
  { id: 'actifs', label: 'Actifs Professionnels', icon: Briefcase },
  { id: 'dettes', label: 'Dettes & Crédits', icon: CreditCard },
  { id: 'revenus', label: 'Revenus & Dépenses', icon: DollarSign },
  { id: 'objectifs', label: 'Objectifs & Projections', icon: Target },
  { id: 'synthese', label: 'Synthèse & Commentaires', icon: FileText },
  { id: 'optimisation', label: 'Optimisation Fiscale', icon: Calculator },
  { id: 'pdf', label: 'Mon Bilan PDF', icon: Download },
  { id: 'note', label: 'Note de Synthèse', icon: StickyNote },
];

export function DashboardNav() {
  const [activeSection, setActiveSection] = useState<string>('infos');
  const [collapsed, setCollapsed] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      className="dashboard-nav bg-slate-800 border-r border-slate-700 sticky top-0 h-screen overflow-y-auto"
      initial={{ width: collapsed ? 64 : 280 }}
      animate={{ width: collapsed ? 64 : 280 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-cyan-400">Mon Patrimoine</h2>
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-400/30' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-cyan-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <motion.span
                    className="text-sm font-medium text-left"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        {!collapsed && (
          <motion.div
            className="mt-8 p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-lg border border-indigo-400/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-sm text-slate-300 mb-2">
              💡 Conseil du jour
            </div>
            <div className="text-xs text-slate-400">
              Diversifiez vos investissements selon votre profil de risque pour optimiser votre rendement.
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
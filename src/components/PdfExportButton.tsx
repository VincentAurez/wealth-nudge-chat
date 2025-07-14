import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { UserData } from "@/components/PatrimonialChat";

interface PatrimonyData {
  assetsDetail: Array<{type: string; amount: number}>;
  debts: Array<{type: string; balance: number}>;
  cashflow: {revenusMensuels: number; depenses: number};
  tolerance: number;
  horizon: number;
  maxLoss: number;
}

interface PdfExportButtonProps {
  userData: UserData;
  patrimonyData: PatrimonyData;
}

export function PdfExportButton({ userData, patrimonyData }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Analytics tracking
      if (typeof window !== 'undefined' && (window as any).lovable?.analytics) {
        (window as any).lovable.analytics.track("pdf_export", { 
          userId: userData.email,
          timestamp: new Date().toISOString()
        });
      }

      // Simulate PDF generation (replace with actual PDF generation)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple PDF-like content for demo
      const pdfContent = generatePdfContent(userData, patrimonyData);
      
      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bilan-patrimonial-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generatePdfContent = (userData: UserData, patrimonyData: PatrimonyData) => {
    const totalAssets = patrimonyData.assetsDetail.reduce((sum, asset) => sum + asset.amount, 0);
    const totalDebts = patrimonyData.debts.reduce((sum, debt) => sum + debt.balance, 0);
    const netWealth = totalAssets - totalDebts;
    
    return `
BILAN PATRIMONIAL
==================

INFORMATIONS PERSONNELLES
- Âge: ${userData.age} ans
- Situation: ${userData.householdStructure}
- CSP: ${userData.csp}
- Statut: ${userData.employmentStatus}

REVENUS ET ÉPARGNE
- Revenus mensuels: ${userData.monthlyIncome?.toLocaleString()} €
- Épargne mensuelle: ${userData.currentSavings} €
- Taux d'épargne: ${userData.monthlyIncome ? ((userData.currentSavings || 0) / userData.monthlyIncome * 100).toFixed(1) : 'N/A'}%

PATRIMOINE
- Total actifs: ${totalAssets.toLocaleString()} €
- Total dettes: ${totalDebts.toLocaleString()} €
- Patrimoine net: ${netWealth.toLocaleString()} €

RÉPARTITION DES ACTIFS
- Livrets & Trésorerie: ${userData.assetSplit?.livrets}%
- Assurance Vie: ${userData.assetSplit?.assuranceVie}%
- Actions / UC: ${userData.assetSplit?.actions}%
- Immobilier: ${userData.assetSplit?.immo}%
- Autres: ${userData.assetSplit?.autres}%

PROFIL INVESTISSEUR
- Profil: ${userData.riskProfile}
- Tolérance aux pertes: ${patrimonyData.tolerance}%
- Horizon d'investissement: ${patrimonyData.horizon} ans

OBJECTIFS PRIORITAIRES
${userData.goalsPriority?.map((goal, index) => `${index + 1}. ${goal}`).join('\n') || 'Non définis'}

ANALYSE
Votre situation patrimoniale est ${netWealth > 0 ? 'positive' : 'déficitaire'} avec un patrimoine net de ${netWealth.toLocaleString()} €.
Votre taux d'épargne est ${userData.monthlyIncome && userData.currentSavings && (userData.currentSavings / userData.monthlyIncome) > 0.15 ? 'supérieur' : 'inférieur'} à la moyenne nationale.

Date d'édition: ${new Date().toLocaleDateString('fr-FR')}
`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-indigo-500/25"
        size="lg"
      >
        {isExporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Génération...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Exporter en PDF
          </>
        )}
      </Button>
    </motion.div>
  );
}
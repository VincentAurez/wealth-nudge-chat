interface ValueAddedCardProps {
  topGoals: string[];
}

const getAdviceForGoal = (goal: string): string => {
  const adviceMap: Record<string, string> = {
    "Réduire mon impôt": "Optimisation fiscale (déficit foncier, PER, etc.).",
    "Constituer un capital pour financer un projet": "Plan d'épargne et allocation adaptée à votre horizon.",
    "Constituer un capital pour un projet": "Plan d'épargne et allocation adaptée à votre horizon.",
    "Générer un complément de revenus à la retraite": "Stratégie PER / SCPI de rendement / dividendes.",
    "Transmettre mon patrimoine": "Outils Donation-Partage, assurance-vie, démembrement.",
    "Préparer ma dépendance": "Assurance dépendance, arbitrage de patrimoine sécuritaire.",
    "Protéger ma famille": "Prévoyance, clause bénéficiaire optimisée, contrat croisé.",
    "Maintenir mon niveau de revenus": "Gestion de portefeuille orientée revenus réguliers.",
    "Financer les études futures de mes enfants": "Planification PEL, assurance-vie multi-support, PEA Jeune.",
    "Financer les études de mes enfants": "Planification PEL, assurance-vie multi-support, PEA Jeune.",
    "Acheter ma résidence principale": "Montage financement, optimisation apport vs. levier."
  };

  return adviceMap[goal] || "Conseil personnalisé selon votre objectif spécifique.";
};

export function ValueAddedCard({ topGoals }: ValueAddedCardProps) {
  const topTwoGoals = topGoals.slice(0, 2);

  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 p-4 rounded-xl mt-4">
      <h4 className="font-semibold mb-3 text-emerald-800 dark:text-emerald-200">
        💡 Comment un conseiller peut vous aider :
      </h4>
      
      <ul className="list-disc pl-5 text-sm space-y-2">
        {topTwoGoals.map((goal, index) => (
          <li key={goal} className="text-emerald-700 dark:text-emerald-300">
            <strong>Objectif #{index + 1} - {goal} :</strong>
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">
              {getAdviceForGoal(goal)}
            </span>
          </li>
        ))}
      </ul>
      
      <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-700">
        <p className="text-xs text-emerald-600 dark:text-emerald-400 italic">
          ✨ Un rendez-vous gratuit vous donnera un plan d'action chiffré pour ces priorités.
        </p>
      </div>
    </div>
  );
}
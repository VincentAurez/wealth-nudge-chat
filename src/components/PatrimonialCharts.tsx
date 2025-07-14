import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { UserData } from "@/components/PatrimonialChat";

interface PatrimonialChartsProps {
  userData: UserData;
}

export function PatrimonialCharts({ userData }: PatrimonialChartsProps) {
  // Données de comparaison épargne par âge
  const savingsByAge = [
    { age: '< 30 ans', taux: 8, vous: userData.age && userData.age < 30 ? (userData.monthlyIncome && userData.currentSavings ? (userData.currentSavings / userData.monthlyIncome) * 100 : 0) : null },
    { age: '30-40 ans', taux: 12, vous: userData.age && userData.age >= 30 && userData.age < 40 ? (userData.monthlyIncome && userData.currentSavings ? (userData.currentSavings / userData.monthlyIncome) * 100 : 0) : null },
    { age: '40-50 ans', taux: 15, vous: userData.age && userData.age >= 40 && userData.age < 50 ? (userData.monthlyIncome && userData.currentSavings ? (userData.currentSavings / userData.monthlyIncome) * 100 : 0) : null },
    { age: '50-60 ans', taux: 18, vous: userData.age && userData.age >= 50 && userData.age < 60 ? (userData.monthlyIncome && userData.currentSavings ? (userData.currentSavings / userData.monthlyIncome) * 100 : 0) : null },
    { age: '60+ ans', taux: 22, vous: userData.age && userData.age >= 60 ? (userData.monthlyIncome && userData.currentSavings ? (userData.currentSavings / userData.monthlyIncome) * 100 : 0) : null }
  ];

  // Données répartition patrimoine français moyen vs utilisateur
  const allocationData = userData.assetSplit ? [
    { name: 'Livrets', francais: 35, vous: userData.assetSplit.livrets },
    { name: 'Assurance-vie', francais: 25, vous: userData.assetSplit.assuranceVie },
    { name: 'Actions', francais: 15, vous: userData.assetSplit.actions },
    { name: 'Immobilier', francais: 20, vous: userData.assetSplit.immo },
    { name: 'Autres', francais: 5, vous: userData.assetSplit.autres }
  ] : [];

  // Données pie chart pour votre répartition
  const yourAllocation = userData.assetSplit ? [
    { name: 'Livrets & trésorerie', value: userData.assetSplit.livrets, color: '#3b82f6' },
    { name: 'Assurance-vie', value: userData.assetSplit.assuranceVie, color: '#10b981' },
    { name: 'Actions / UC', value: userData.assetSplit.actions, color: '#f59e0b' },
    { name: 'Immobilier', value: userData.assetSplit.immo, color: '#ef4444' },
    { name: 'Autres', value: userData.assetSplit.autres, color: '#8b5cf6' }
  ].filter(item => item.value > 0) : [];

  // Revenus par CSP
  const incomeByCSP = [
    { csp: 'Cadres', revenu: 4600, vous: userData.csp?.includes('Cadre') ? userData.monthlyIncome || 0 : null },
    { csp: 'Prof. inter.', revenu: 2800, vous: userData.csp?.includes('intermédiaire') ? userData.monthlyIncome || 0 : null },
    { csp: 'Employés', revenu: 2100, vous: userData.csp?.includes('Employé') ? userData.monthlyIncome || 0 : null },
    { csp: 'Ouvriers', revenu: 1950, vous: userData.csp?.includes('Ouvrier') ? userData.monthlyIncome || 0 : null },
    { csp: 'Indépendants', revenu: 3200, vous: userData.csp?.includes('Artisan') || userData.csp?.includes('Commerçant') ? userData.monthlyIncome || 0 : null }
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Taux d'épargne par âge */}
      {userData.age && userData.monthlyIncome && userData.currentSavings && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">💰 Votre taux d'épargne vs autres Français</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={savingsByAge}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis label={{ value: 'Taux d\'épargne (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value, name) => [`${value}%`, name === 'taux' ? 'Moyenne française' : 'Votre taux']} />
              <Bar dataKey="taux" fill="#94a3b8" name="Moyenne française" />
              <Bar dataKey="vous" fill="#d3381c" name="Votre taux" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-2">
            Votre taux d'épargne : {((userData.currentSavings / userData.monthlyIncome) * 100).toFixed(1)}% vs moyenne de votre tranche d'âge
          </p>
        </Card>
      )}

      {/* Répartition patrimoine */}
      {userData.assetSplit && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">📊 Votre répartition patrimoniale</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={yourAllocation}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {yourAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Part']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">🇫🇷 Vous vs Français moyen</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={allocationData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Bar dataKey="francais" fill="#94a3b8" name="Français moyen" />
                <Bar dataKey="vous" fill="#d3381c" name="Vous" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Revenus par CSP */}
      {userData.monthlyIncome && userData.csp && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">💼 Votre revenu vs autres professions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeByCSP}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="csp" />
              <YAxis label={{ value: 'Revenu net (€)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value, name) => [`${value}€`, name === 'revenu' ? 'Moyenne' : 'Votre revenu']} />
              <Bar dataKey="revenu" fill="#94a3b8" name="Moyenne" />
              <Bar dataKey="vous" fill="#d3381c" name="Votre revenu" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-2">
            Comparaison avec les revenus moyens par catégorie socio-professionnelle
          </p>
        </Card>
      )}
    </div>
  );
}
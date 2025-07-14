export const AGE_OBJECTIVES = {
  "25-35": [
    "Constituer un capital pour financer un projet",
    "Réduire mon impôt",
    "Acheter ma résidence principale",
    "Financer les études futures de mes enfants",
    "Protéger ma famille"
  ],
  "35-55": [
    "Réduire mon impôt",
    "Constituer un capital pour un projet",
    "Générer un complément de revenus à la retraite",
    "Financer les études de mes enfants",
    "Protéger ma famille"
  ],
  "55-65": [
    "Générer un complément de revenus à la retraite",
    "Transmettre mon patrimoine",
    "Réduire mon impôt",
    "Protéger ma famille",
    "Préparer ma dépendance"
  ],
  "65+": [
    "Maintenir mon niveau de revenus",
    "Transmettre mon patrimoine",
    "Préparer ma dépendance",
    "Protéger ma famille"
  ]
};

export function pickObjectivesByAge(age: number): string[] {
  if (age < 35) return AGE_OBJECTIVES["25-35"];
  if (age < 55) return AGE_OBJECTIVES["35-55"];
  if (age < 65) return AGE_OBJECTIVES["55-65"];
  return AGE_OBJECTIVES["65+"];
}

export function calculateTargetSavingRate(age: number): number {
  if (age < 35) return 10;
  if (age < 55) return 15;
  return 20;
}
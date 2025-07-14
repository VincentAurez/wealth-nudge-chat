import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateBlues } from "d3-scale-chromatic";

// Topojson simplifié des départements français
const franceGeography = {
  type: "Topology",
  objects: {
    departments: {
      type: "GeometryCollection",
      geometries: [
        // Données simplifiées pour les départements principaux
        { type: "Polygon", properties: { code: "75", name: "Paris" } },
        { type: "Polygon", properties: { code: "13", name: "Bouches-du-Rhône" } },
        { type: "Polygon", properties: { code: "69", name: "Rhône" } },
        { type: "Polygon", properties: { code: "59", name: "Nord" } },
        { type: "Polygon", properties: { code: "31", name: "Haute-Garonne" } },
      ]
    }
  }
};

interface DepartmentData {
  id: string;
  avgSavingRate: number;
}

interface ChoroplethMapProps {
  departements: DepartmentData[];
  userDept: string;
}

export function ChoroplethMap({ departements, userDept }: ChoroplethMapProps) {
  const max = Math.max(...departements.map(d => d.avgSavingRate || 0));
  const colorScale = scaleSequential([0, max], interpolateBlues);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-muted/20 rounded-lg p-4 text-center">
        <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg flex items-center justify-center relative">
          {/* Représentation stylisée de la France */}
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* Forme simplifiée de la France */}
              <path
                d="M20,20 Q60,10 100,20 Q110,40 105,70 Q90,100 60,110 Q30,105 15,80 Q10,50 20,20"
                fill={userDept ? "#d3381c" : "#3b82f6"}
                stroke="white"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              {/* Points pour représenter les départements */}
              <circle cx="50" cy="30" r="3" fill="#1e40af" className="animate-pulse" />
              <circle cx="85" cy="85" r="3" fill="#1e40af" className="animate-pulse" />
              <circle cx="30" cy="60" r="3" fill="#1e40af" className="animate-pulse" />
              <circle cx="70" cy="50" r="3" fill="#1e40af" className="animate-pulse" />
              <circle cx="55" cy="75" r="3" fill="#1e40af" className="animate-pulse" />
              
              {/* Marqueur pour le département de l'utilisateur */}
              {userDept && (
                <circle 
                  cx="60" 
                  cy="45" 
                  r="5" 
                  fill="#d3381c" 
                  stroke="white" 
                  strokeWidth="2"
                  className="animate-bounce"
                />
              )}
            </svg>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium">Votre département: {userDept}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Plus la couleur est foncée, plus l'épargne moyenne est élevée. Votre département est en rouge.
          </p>
        </div>
        
        {/* Légende */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <span className="text-xs">Faible</span>
          <div className="w-8 h-3 bg-gradient-to-r from-blue-200 to-blue-600 rounded"></div>
          <span className="text-xs">Élevé</span>
          <div className="w-3 h-3 bg-[#d3381c] rounded"></div>
          <span className="text-xs">Vous</span>
        </div>
      </div>
    </div>
  );
}
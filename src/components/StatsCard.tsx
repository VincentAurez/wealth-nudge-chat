import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, Target, Award, Percent } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  comparison: string;
  percentile?: number;
  trend?: 'up' | 'down' | 'neutral';
  category: 'age' | 'income' | 'savings' | 'household' | 'csp' | 'general';
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'age':
      return <Users className="w-5 h-5" />;
    case 'income':
      return <TrendingUp className="w-5 h-5" />;
    case 'savings':
      return <Target className="w-5 h-5" />;
    case 'household':
      return <Users className="w-5 h-5" />;
    case 'csp':
      return <Award className="w-5 h-5" />;
    default:
      return <Percent className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'age':
      return 'bg-blue-500';
    case 'income':
      return 'bg-green-500';
    case 'savings':
      return 'bg-purple-500';
    case 'household':
      return 'bg-orange-500';
    case 'csp':
      return 'bg-indigo-500';
    default:
      return 'bg-gray-500';
  }
};

export function StatsCard({ title, value, comparison, percentile, trend, category }: StatsCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${getCategoryColor(category)} text-white`}>
            {getCategoryIcon(category)}
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </div>
        
        {trend && (
          <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}>
            {trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
            {trend === 'up' ? 'Au dessus' : trend === 'down' ? 'En dessous' : 'Moyenne'}
          </Badge>
        )}
      </div>
      
      {percentile !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Position</span>
            <span>{percentile}e percentile</span>
          </div>
          <Progress value={percentile} className="h-2" />
        </div>
      )}
      
      <p className="text-xs text-muted-foreground leading-relaxed">
        {comparison}
      </p>
    </Card>
  );
}
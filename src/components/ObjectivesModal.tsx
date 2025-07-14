import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { UserData } from "@/components/PatrimonialChat";

interface ObjectivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
}

export function ObjectivesModal({ isOpen, onClose, userData }: ObjectivesModalProps) {
  const [goals, setGoals] = useState("");
  const [currentAllocation, setCurrentAllocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call (since we don't have Supabase yet)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log data for demonstration
      console.log('Données objectives:', {
        userId: userData?.email || 'anonymous',
        goals,
        currentAllocation,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Merci !",
        description: "Vos objectifs ont été enregistrés avec succès.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog modal open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-50 max-w-lg rounded-2xl bg-muted/50 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <Target className="w-5 h-5" />
            </div>
            Parlez-nous de vos objectifs
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="goals" className="text-sm font-medium">
              Quels sont vos objectifs patrimoniaux ?
            </Label>
            <Textarea
              id="goals"
              placeholder="Préparer ma retraite, acheter un bien, transmettre…"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="min-h-[100px] resize-none"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocation" className="text-sm font-medium">
              Comment votre épargne est-elle actuellement répartie ?
            </Label>
            <Textarea
              id="allocation"
              placeholder="30% fonds euros, 30% immobilier, 40% actions…"
              value={currentAllocation}
              onChange={(e) => setCurrentAllocation(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#d3381c] text-white hover:bg-[#bb2e17]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Envoi...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Plus tard
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Ces informations nous aideront à personnaliser nos recommandations pour vous.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
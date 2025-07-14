import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export function DecileTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="underline decoration-dotted text-xs">Décile ?</TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">
          On classe tous les revenus du plus faible au plus élevé : <br/>
          • Décile 1 : 10 % des Français gagnent moins. <br/>
          • Décile 9 : 10 % gagnent plus. <br/>
          Donc « D9 » = top 10 %. <br/>
          Ici on te dit simplement « tu gagnes plus que X % des Français ».
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
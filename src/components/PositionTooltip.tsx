import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export function PositionTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="underline decoration-dotted text-xs">Ma position ?</TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">
          Nous comparons votre situation avec celle des autres Français : <br/>
          • Si vous êtes dans le top 20%, vous gagnez plus que 80% des Français <br/>
          • Si vous êtes dans la moyenne, vous vous situez comme 50% de la population <br/>
          Cela vous aide à comprendre où vous vous situez par rapport aux autres.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
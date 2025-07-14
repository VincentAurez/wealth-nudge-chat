import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, X, Plus } from "lucide-react";

interface GoalRowProps {
  id: string;
  text: string;
  onDelete: (id: string) => void;
}

function GoalRow({ id, text, onDelete }: GoalRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-3 cursor-move ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="flex-1 text-sm">{text}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

interface AddGoalRowProps {
  onAdd: (text: string) => void;
}

function AddGoalRow({ onAdd }: AddGoalRowProps) {
  const [newGoal, setNewGoal] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    if (newGoal.trim()) {
      onAdd(newGoal.trim());
      setNewGoal("");
      setShowInput(false);
    }
  };

  if (!showInput) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowInput(true)}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un objectif personnalisé
      </Button>
    );
  }

  return (
    <Card className="p-3">
      <div className="flex gap-2">
        <Input
          placeholder="Votre objectif personnalisé..."
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          autoFocus
        />
        <Button onClick={handleAdd} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setShowInput(false);
            setNewGoal("");
          }}
          size="sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

interface SortableGoalsProps {
  items: string[];
  onChange: (goals: string[]) => void;
}

export function SortableGoals({ items, onChange }: SortableGoalsProps) {
  const [goals, setGoals] = useState<string[]>(items);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = goals.indexOf(active.id as string);
      const newIndex = goals.indexOf(over.id as string);
      const newOrder = arrayMove(goals, oldIndex, newIndex);
      setGoals(newOrder);
      onChange(newOrder);
    }
  }

  const handleDelete = (goalToDelete: string) => {
    const newGoals = goals.filter(goal => goal !== goalToDelete);
    setGoals(newGoals);
    onChange(newGoals);
  };

  const handleAdd = (newGoal: string) => {
    const newGoals = [...goals, newGoal];
    setGoals(newGoals);
    onChange(newGoals);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        📌 <strong>Glissez-déposez</strong> pour réorganiser vos priorités (du plus important au moins important)
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={goals} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {goals.map((goal, index) => (
              <div key={goal} className="flex items-center gap-2">
                <div className="text-sm font-medium text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <GoalRow
                    id={goal}
                    text={goal}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AddGoalRow onAdd={handleAdd} />
    </div>
  );
}
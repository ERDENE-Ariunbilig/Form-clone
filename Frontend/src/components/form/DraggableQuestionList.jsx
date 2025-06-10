import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SortableQuestionItem from '../QuestionInput/SortableQuestionItem';

export function DraggableQuestionList({ questions, onQuestionChange, onQuestionDelete, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex(item => item.id === active.id);
      const newIndex = questions.findIndex(item => item.id === over.id);
      
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext 
        items={questions.map(q => q.id)}
        strategy={verticalListSortingStrategy}
      >
        {questions.map(question => (
          <SortableQuestionItem
            key={question.id}
            id={question.id}
            question={question}
            onQuestionChange={(updatedQ) => onQuestionChange(question.id, updatedQ)}
            onDelete={() => onQuestionDelete(question.id)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
} 
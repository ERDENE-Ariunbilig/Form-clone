import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SortableItem from './SortableItem';

export default function Swap({ question, value, onChange }) {
  // Parse items from question data or use defaults
  const [items, setItems] = useState([]);
  
  console.log("Swap component received question:", question);
  console.log("Current value:", value);

  useEffect(() => {
    let initialItems = [];
    
    if (question.swapOptions && Array.isArray(question.swapOptions) && question.swapOptions.length > 0) {
      initialItems = question.swapOptions.map((item, index) => ({
        id: item.id || `item-${index}`,
        text: item.text || String(item || '')
      }));
      console.log("Using swapOptions:", initialItems);
    }
    // check for stondorrd
    else if (Array.isArray(question.options) && question.options.length > 0) {
      initialItems = question.options.map((option, index) => {
        // If option object+text do thiss
        if (typeof option === 'object' && option !== null && option.text) {
          return {
            id: option.id || `item-${index}`,
            text: option.text
          };
        } 
        // If option string doo thiss
        else if (typeof option === 'string') {
          if (option.startsWith('{') || option.startsWith('[')) {
            try {
              const parsed = JSON.parse(option);
              if (parsed && (typeof parsed === 'object')) {
                return {
                  id: `item-${index}`,
                  text: parsed.text || String(parsed)
                };
              }
            } catch (e) {
              // if cant regonize just dooo ittt NIKE
            }
          }
          // string as is?
          return { id: `item-${index}`, text: option };
        }
        // Default
        else {
          return { id: `item-${index}`, text: String(option || '') };
        }
      });
      console.log("Using options array:", initialItems);
    }
    // check for text content
    else if (question.text) {
      // Look for num or words in txt
      const textMatches = question.text.match(/\b(\d+|[a-zA-Z]+)\b/g);
      if (textMatches && textMatches.length > 0) {
        initialItems = textMatches.map((match, index) => ({
          id: `item-${index}`,
          text: match
        }));
      }
      console.log("Extracted from text:", initialItems);
    }
    
    // If we still don't have items use gods plan
    if (initialItems.length === 0) {
      initialItems = [
        { id: 'item-0', text: '1' },
        { id: 'item-1', text: '2' },
        { id: 'item-2', text: '3' },
        { id: 'item-3', text: '4' }
      ];
      console.log("Using default items:", initialItems);
    }
    
    if (Array.isArray(value) && value.length > 0 && value.length === initialItems.length) {
      try {
        // Create new array mapping value ID
        const orderedItems = [];
        value.forEach(id => {
          const item = initialItems.find(item => item.id === id);
          if (item) {
            orderedItems.push(item);
          }
        });
        
        // If map ok ordered array ok
        if (orderedItems.length === initialItems.length) {
          initialItems = orderedItems;
          console.log("Reordered items based on value:", initialItems);
        }
      } catch (e) {
        console.error("Error reordering items:", e);
      }
    } else {
      // first var uf not setit
      onChange(initialItems.map(item => item.id));
    }
    
    setItems(initialItems);
  }, [question, value, onChange]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, //drag distnce
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      console.log(`Dragged item ${active.id} over ${over.id}`);
      
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id);
        const newIndex = currentItems.findIndex(item => item.id === over.id);
        
        console.log(`Moving from index ${oldIndex} to ${newIndex}`);
        
        const newItems = arrayMove(currentItems, oldIndex, newIndex);
        
        const newOrder = newItems.map(item => item.id); // up value
        console.log("New order:", newOrder);
        
        setTimeout(() => {
          onChange(newOrder);
        }, 0);
        
        return newItems;
      });
    }
  };

  return (
    <div className="swap-container">
      <p>{question.text}</p>
      
      <div className="swap-items-container" style={{padding: '10px 0'}}>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext 
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                {item.text}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
      
      <div className="swap-preview">
        <h4>Одоогийн дараалал:</h4>
        <ol>
          {items.map(item => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

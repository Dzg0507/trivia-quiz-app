import React, { useState } from 'react';
import { QuestWithDefinition } from '../../services/firestoreService';

// Defines the object that tells the camera where to go
type CameraTarget = {
  planetName: string;
  objectName?: string;
  position?: [number, number, number];
} | null;

// Defines the props that this component will receive
interface QuestMenuProps {
  quests: QuestWithDefinition[];
  onQuestSelect: (target: CameraTarget) => void;
}

const QuestMenu: React.FC<QuestMenuProps> = ({ quests, onQuestSelect }) => {
  // State to manage whether the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (quest: QuestWithDefinition) => {
    // When a quest is clicked, call the onQuestSelect function from the parent component.
    // We pass it an object with the planet's name and position if available
    onQuestSelect({ 
      planetName: quest.definition.planetName || quest.definition.name,
      position: quest.definition.position
    });
    setIsOpen(false); // Close the menu after selection
  };

  return (
    // Basic styling to position the menu as an overlay on the top-left
    <div style={{ position: 'absolute', top: '100px', left: '20px', zIndex: 100, color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          background: 'rgba(0,0,0,0.5)', 
          padding: '10px 20px', 
          border: '1px solid white', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Quests
      </button>

      {/* Conditionally render the quest list if the menu is open */}
      {isOpen && (
        <ul style={{ 
          background: 'rgba(0,0,0,0.7)', 
          listStyle: 'none', 
          padding: '10px', 
          margin: '5px 0 0 0',
          borderRadius: '5px',
          border: '1px solid #555'
        }}>
          {quests.map(quest => (
            <li 
              key={quest.questId} 
              onClick={() => handleSelect(quest)} 
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {quest.definition.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestMenu;
// Organize imports properly
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlanetaryApp from '../planetary-system/PlanetaryApp';
import { useQuestManager } from '../hooks/useQuestManager';
import { QuestWithDefinition } from '../services/firestoreService';
import QuestMenu from './QuestMenu';
import { useSolarSystemStore } from '../planetary-system/States';
import { QUEST_DEFINITIONS } from '../config/questDefinitions';

// Define CameraTarget type to match PlanetaryApp's expected props
type CameraTarget = {
  planetName: string;
  objectName?: string;
  position?: [number, number, number];
} | null;

const QuestWorld = () => {
  const { quests, loading } = useQuestManager();
  const [activeQuest, setActiveQuest] = useState<QuestWithDefinition | null>(null);
  const [cameraTarget, setCameraTarget] = useState<CameraTarget>(null);

  const navigate = useNavigate();
  const { isPlanetJustSelected, setSelectedPlanet, setIsPlanetJustSelected } = useSolarSystemStore();

  const handlePlanetClick = (planetName: string) => {
    const questAreasForPlanet = QUEST_DEFINITIONS.filter(q => q.planetName === planetName);
    console.log(`Loading ${questAreasForPlanet.length} quest areas for ${planetName}`);

    useSolarSystemStore.getState().setQuestAreas(questAreasForPlanet);
    setSelectedPlanet(planetName);
    setCameraTarget({ planetName });
    setActiveQuest(null);

    // Set initial camera target
    if (questAreasForPlanet.length > 0) {
      setCameraTarget({
        planetName,
        objectName: questAreasForPlanet[0].name,
        position: questAreasForPlanet[0].position
      });
    }
  };

  const handlePlanetDeselect = () => {
    setSelectedPlanet(null);
    setCameraTarget(null);
    setActiveQuest(null);
  };

  useEffect(() => {
    const unsubscribe = useSolarSystemStore.subscribe(
      (state) => {
        const { selectedPlanet, questAreas, selectedQuestAreaIndex } = state;

        if (selectedPlanet && questAreas.length > 0) {
          const questArea = questAreas[selectedQuestAreaIndex];

          setCameraTarget({
            planetName: selectedPlanet,
            objectName: questArea.name,
            position: questArea.position
          });

          const quest = quests.find(q => q.definition.id === questArea.id);
          setActiveQuest(quest || null);

          console.log('Camera target updated to quest area:', questArea.name);
        }
      }
    );

    return unsubscribe;
  }, [quests, setActiveQuest, setCameraTarget]);

  // Separate useEffect for isPlanetJustSelected to prevent immediate camera snap
  useEffect(() => {
    if (isPlanetJustSelected) {
      setIsPlanetJustSelected(false);
    }
  }, [isPlanetJustSelected, setIsPlanetJustSelected]);

  const startQuiz = () => {
    if (activeQuest) {
      navigate('/quiz');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-trivia-neon border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-white text-xl font-semibold">Loading Quest World...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <QuestMenu quests={quests} onQuestSelect={setCameraTarget} />

      {activeQuest && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg z-10 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Quest Found: {activeQuest.definition.name}</h3>
          <p className="text-trivia-gray-light mb-6">{activeQuest.definition.description}</p>
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-trivia-gold text-black font-bold rounded-md hover:bg-yellow-500 transition-colors duration-300"
          >
            Start Quiz
          </button>
          <button
            onClick={() => {
              setActiveQuest(null);
              setSelectedPlanet(null);
            }}
            className="ml-4 px-6 py-3 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700 transition-colors duration-300"
          >
            Dismiss
          </button>
        </div>
      )}

      <PlanetaryApp onPlanetClick={handlePlanetClick} onPlanetDeselect={handlePlanetDeselect} cameraTarget={cameraTarget} />
    </div>
  );
};

export default QuestWorld;
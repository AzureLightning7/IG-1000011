import React from 'react';
import { useLocation } from 'react-router-dom';

interface Stage {
  id: string;
  name: string;
  path: string;
  icon: string;
}

const StageNavigation: React.FC = () => {
  const location = useLocation();
  
  const stages: Stage[] = [
    { id: 'survey', name: 'Survey', path: '/', icon: '📝' },
    { id: 'customization', name: 'Customization', path: '/customization', icon: '🎨' },
    { id: 'purchase', name: 'Purchase', path: '/purchase', icon: '🛒' },
  ];

  const getCurrentStageIndex = () => {
    const currentPath = location.pathname;
    return stages.findIndex(stage => currentPath === stage.path);
  };

  const currentStageIndex = getCurrentStageIndex();

  return (
    <div className="py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => {
            const isActive = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;
            const isUpcoming = index > currentStageIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-2 transition-all ${isCompleted ? 'bg-teal-500 text-black' : isActive ? 'bg-teal-400 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                  {stage.icon}
                </div>
                <span className={`text-sm font-medium transition-all ${isActive ? 'text-teal-400' : isCompleted ? 'text-teal-500' : 'text-zinc-500'}`}>
                  {stage.name}
                </span>
                {index < stages.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${isCompleted ? 'bg-teal-500' : isActive ? 'bg-teal-400' : 'bg-zinc-800'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StageNavigation;
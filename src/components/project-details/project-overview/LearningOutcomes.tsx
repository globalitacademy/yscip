
import React from 'react';
import { CheckCircle } from 'lucide-react';
import EditableList from '@/components/common/EditableList';

interface LearningOutcomesProps {
  learningOutcomes: string[] | undefined;
  isEditing: boolean;
  onChange: (outcomes: string[]) => void;
}

const LearningOutcomes: React.FC<LearningOutcomesProps> = ({
  learningOutcomes,
  isEditing,
  onChange
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Ինչ կսովորեք</h2>
      {isEditing ? (
        <EditableList 
          items={learningOutcomes || []}
          onChange={onChange}
          placeholder="Մուտքագրեք նոր ուսումնական արդյունք..."
          listType="bulleted"
          disabled={!isEditing}
        />
      ) : (
        learningOutcomes && learningOutcomes.length > 0 ? (
          <ul className="space-y-2">
            {learningOutcomes.map((outcome, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">Ուսումնական արդյունքներ չեն նշված</p>
        )
      )}
    </section>
  );
};

export default LearningOutcomes;

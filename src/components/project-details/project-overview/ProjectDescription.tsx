
import React from 'react';
import EditableField from '@/components/common/EditableField';

interface ProjectDescriptionProps {
  detailedDescription: string | undefined;
  isEditing: boolean;
  onChange: (value: string) => void;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
  detailedDescription,
  isEditing,
  onChange
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Նախագծի նկարագրություն</h2>
      <div className="prose prose-slate max-w-none">
        {isEditing ? (
          <EditableField 
            value={detailedDescription || ''}
            onChange={onChange}
            multiline={true}
            placeholder="Մուտքագրեք նախագծի մանրամասն նկարագրությունը"
            showEditButton={false}
          />
        ) : (
          <p>{detailedDescription}</p>
        )}
      </div>
    </section>
  );
};

export default ProjectDescription;

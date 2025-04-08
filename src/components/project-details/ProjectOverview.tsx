
import React from 'react';
import { ExternalLink, Info, Star, Target, Book } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectTheme } from '@/data/projectThemes';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getProjectImage } from '@/lib/getProjectImage';
import { useProject } from '@/contexts/ProjectContext';
import EditableField from '@/components/common/EditableField';

interface ProjectOverviewProps {
  project: ProjectTheme;
  projectMembers: { id: string; name: string; role: string; avatar: string }[];
  organization: {
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null;
  similarProjects: ProjectTheme[];
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  projectMembers,
  organization,
  similarProjects
}) => {
  const { isEditing, updateProject } = useProject();

  const handleUpdateField = (field: string, value: string | string[]) => {
    updateProject({ [field]: value });
  };

  const handleUpdateArrayItem = (field: string, value: string, index: number) => {
    const currentArray = project[field as keyof ProjectTheme] as string[] || [];
    const updatedArray = [...currentArray];
    updatedArray[index] = value;
    updateProject({ [field]: updatedArray });
  };

  const handleAddArrayItem = (field: string) => {
    const currentArray = project[field as keyof ProjectTheme] as string[] || [];
    const updatedArray = [...currentArray, 'Նոր կետ'];
    updateProject({ [field]: updatedArray });
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    const currentArray = project[field as keyof ProjectTheme] as string[] || [];
    const updatedArray = [...currentArray];
    updatedArray.splice(index, 1);
    updateProject({ [field]: updatedArray });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Նախագծի մանրամասն նկարագրություն</h2>
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <EditableField
              value={project.detailedDescription || project.description}
              onChange={(value) => handleUpdateField('detailedDescription', value)}
              isEditing={isEditing}
              multiline
              placeholder="Մուտքագրեք նախագծի մանրամասն նկարագրությունը..."
              className="min-h-[200px]"
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" />
            Նախապահանջներ
          </h2>
          <ul className="space-y-2 list-disc pl-5">
            {isEditing ? (
              <>
                {project.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <EditableField
                        value={prerequisite}
                        onChange={(value) => handleUpdateArrayItem('prerequisites', value, index)}
                        isEditing={true}
                        placeholder="Նախապահանջ"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 rounded-full bg-red-100 hover:bg-red-200 text-red-700 flex-shrink-0" 
                      onClick={() => handleRemoveArrayItem('prerequisites', index)}
                    >
                      <span className="sr-only">Remove</span>
                      <span aria-hidden="true">×</span>
                    </Button>
                  </li>
                ))}
                <li>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddArrayItem('prerequisites')}
                    className="mt-2"
                  >
                    + Ավելացնել նախապահանջ
                  </Button>
                </li>
              </>
            ) : (
              project.prerequisites.map((prerequisite, index) => (
                <li key={index}>{prerequisite}</li>
              ))
            )}
            {!isEditing && project.prerequisites.length === 0 && (
              <li className="text-muted-foreground italic">Նախապահանջներ չկան</li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Star className="mr-2 h-5 w-5 text-primary" />
            Ուսումնական արդյունքներ
          </h2>
          <ul className="space-y-2 list-disc pl-5">
            {isEditing ? (
              <>
                {project.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <EditableField
                        value={outcome}
                        onChange={(value) => handleUpdateArrayItem('learningOutcomes', value, index)}
                        isEditing={true}
                        placeholder="Ուսումնական արդյունք"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 rounded-full bg-red-100 hover:bg-red-200 text-red-700 flex-shrink-0" 
                      onClick={() => handleRemoveArrayItem('learningOutcomes', index)}
                    >
                      <span className="sr-only">Remove</span>
                      <span aria-hidden="true">×</span>
                    </Button>
                  </li>
                ))}
                <li>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddArrayItem('learningOutcomes')}
                    className="mt-2"
                  >
                    + Ավելացնել ուսումնական արդյունք
                  </Button>
                </li>
              </>
            ) : (
              project.learningOutcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))
            )}
            {!isEditing && project.learningOutcomes.length === 0 && (
              <li className="text-muted-foreground italic">Ուսումնական արդյունքներ չկան</li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Book className="mr-2 h-5 w-5 text-primary" />
            Քայլեր
          </h2>
          <ol className="space-y-2 list-decimal pl-5">
            {isEditing ? (
              <>
                {project.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <EditableField
                        value={step}
                        onChange={(value) => handleUpdateArrayItem('steps', value, index)}
                        isEditing={true}
                        placeholder="Քայլ"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 rounded-full bg-red-100 hover:bg-red-200 text-red-700 flex-shrink-0" 
                      onClick={() => handleRemoveArrayItem('steps', index)}
                    >
                      <span className="sr-only">Remove</span>
                      <span aria-hidden="true">×</span>
                    </Button>
                  </li>
                ))}
                <li>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddArrayItem('steps')}
                    className="mt-2"
                  >
                    + Ավելացնել քայլ
                  </Button>
                </li>
              </>
            ) : (
              project.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))
            )}
            {!isEditing && project.steps.length === 0 && (
              <li className="text-muted-foreground italic">Քայլեր չկան</li>
            )}
          </ol>
        </section>
      </div>

      <div className="space-y-6">
        {projectMembers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Նախագծի անդամներ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="rounded-full h-10 w-10"
                  />
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {organization && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Կազմակերպություն</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={organization.logo}
                  alt={organization.name}
                  className="h-12 w-12"
                />
                <div>
                  <div className="font-medium">{organization.name}</div>
                  {organization.website && (
                    <a
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary flex items-center hover:underline"
                    >
                      Կայք <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {similarProjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Նման նախագծեր</CardTitle>
              <CardDescription>Նույն կատեգորիայի և տեխնոլոգիաների այլ նախագծեր</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {similarProjects.map((similarProject) => (
                <div key={similarProject.id} className="group">
                  <a href={`/project/${similarProject.id}`} className="block space-y-2">
                    <div className="w-full h-24 rounded-md overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={getProjectImage(similarProject)}
                          alt={similarProject.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </AspectRatio>
                    </div>
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {similarProject.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {similarProject.description}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Info className="mr-2 h-5 w-5 text-primary" />
              Օգնություն
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Նախագծեր էջում դուք կարող եք գտնել կամ ստեղծել նոր նախագծեր, որոնք կօգնեն ձեզ զարգացնել ձեր հմտությունները: Ընտրեք նախագիծը, գրանցվեք և սկսեք աշխատանքը:
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Օգնության կենտրոն
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectOverview;

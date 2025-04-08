
import React from 'react';
import { Link } from 'react-router-dom';
import { projectThemes } from '@/data/projectThemes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProjectsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Նախագծերի ցանկ</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectThemes.map(project => (
          <Card key={project.id} className="overflow-hidden">
            <div className="h-48 bg-gray-200">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              <Link to={`/project/${project.id}`}>
                <Button>Դիտել մանրամասները</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;

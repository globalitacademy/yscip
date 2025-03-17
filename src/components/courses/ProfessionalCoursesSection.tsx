
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';
import AddProfessionalCourseDialog from './AddProfessionalCourseDialog';
import ProfessionalCoursesGrid from './ProfessionalCoursesGrid';
import { sampleProfessionalCourses } from './data/sampleCourses';
import { useProfessionalCourses } from './hooks/useProfessionalCourses';

interface ProfessionalCoursesSectionProps {
  isAdminView?: boolean;
}

const ProfessionalCoursesSection: React.FC<ProfessionalCoursesSectionProps> = ({ isAdminView = false }) => {
  const { user } = useAuth();
  const {
    courses,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    selectedCourse,
    setSelectedCourse,
    handleEditCourse,
    handleAddCourse,
    openEditDialog,
    handleDeleteCourse,
    canEditCourse
  } = useProfessionalCourses(sampleProfessionalCourses);

  return (
    <section className={`py-8 ${!isAdminView ? 'bg-white' : ''}`}>
      <div className="container mx-auto px-4">
        {!isAdminView && (
          <>
            <FadeIn>
              <h2 className="text-3xl font-bold mb-2 text-center">
                Ծրագրավորման դասընթացներ
              </h2>
            </FadeIn>
            
            <FadeIn delay="delay-100">
              <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
                Ծրագրավորման դասընթացներ նախատեսված սկսնակների համար
              </p>
            </FadeIn>
          </>
        )}
        
        {isAdminView && user && (user.role === 'admin' || user.role === 'instructor') && (
          <div className="flex justify-end mb-6">
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Ավելացնել դասընթաց
            </Button>
          </div>
        )}
        
        <ProfessionalCoursesGrid
          courses={courses}
          isAdminView={isAdminView}
          canEditCourse={canEditCourse}
          openEditDialog={openEditDialog}
          handleDeleteCourse={handleDeleteCourse}
          user={user}
        />

        {!isAdminView && (
          <div className="flex justify-center mt-12">
            <Button asChild variant="outline">
              <Link to="/courses">
                Դիտել բոլոր դասընթացները
              </Link>
            </Button>
          </div>
        )}
      </div>

      {selectedCourse && (
        <EditProfessionalCourseDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          handleEditCourse={handleEditCourse}
        />
      )}
      
      <AddProfessionalCourseDialog 
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAddCourse={handleAddCourse}
      />
    </section>
  );
};

export default ProfessionalCoursesSection;

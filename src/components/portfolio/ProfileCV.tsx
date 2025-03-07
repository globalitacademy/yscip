
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProfileCV: React.FC = () => {
  const { user } = useAuth();
  const [template, setTemplate] = useState('modern');
  
  const downloadCV = (format: string) => {
    // This would typically connect to a PDF/DOCX generation service
    console.log(`Downloading CV in ${format} format...`);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">CV Ձևավորում</h2>
          <div className="flex gap-2">
            <Button onClick={() => downloadCV('pdf')} variant="outline">
              PDF ներբեռնել
            </Button>
            <Button onClick={() => downloadCV('docx')}>
              DOCX ներբեռնել
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ընտրեք ձևանմուշ</CardTitle>
            <CardDescription>
              Ընտրեք CV-ի տեսքը
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={template} onValueChange={setTemplate}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="modern">Ժամանակակից</TabsTrigger>
                <TabsTrigger value="classic">Դասական</TabsTrigger>
                <TabsTrigger value="minimal">Մինիմալիստական</TabsTrigger>
              </TabsList>
              
              <TabsContent value="modern" className="border p-4 rounded-md">
                <div className="flex gap-4">
                  <div className="w-1/3 bg-slate-100 rounded-md p-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-20 w-20 bg-slate-300 rounded-full mx-auto mb-2"></div>
                      <div className="h-4 w-24 bg-slate-300 rounded mx-auto mb-1"></div>
                      <div className="h-3 w-32 bg-slate-200 rounded mx-auto"></div>
                    </div>
                  </div>
                  <div className="w-2/3 space-y-3">
                    <div className="h-5 w-full bg-slate-100 rounded"></div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                    <div className="space-y-2 mt-4">
                      <div className="h-4 w-full bg-slate-100 rounded"></div>
                      <div className="h-4 w-full bg-slate-100 rounded"></div>
                      <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-center mt-2">Ժամանակակից ոճով CV՝ երկու սյունակով</p>
              </TabsContent>
              
              <TabsContent value="classic" className="border p-4 rounded-md">
                <div className="space-y-3">
                  <div className="text-center mb-4">
                    <div className="h-5 w-40 bg-slate-300 rounded mx-auto mb-1"></div>
                    <div className="h-3 w-60 bg-slate-200 rounded mx-auto"></div>
                  </div>
                  <div className="h-4 w-1/4 bg-slate-300 rounded"></div>
                  <div className="h-3 w-full bg-slate-100 rounded"></div>
                  <div className="h-3 w-full bg-slate-100 rounded"></div>
                  <div className="h-4 w-1/4 bg-slate-300 rounded mt-4"></div>
                  <div className="h-3 w-full bg-slate-100 rounded"></div>
                  <div className="h-3 w-full bg-slate-100 rounded"></div>
                </div>
                <p className="text-sm text-center mt-2">Դասական ոճով CV՝ պարզ ու գործնական</p>
              </TabsContent>
              
              <TabsContent value="minimal" className="border p-4 rounded-md">
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <div className="h-6 w-40 bg-slate-300 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-100 rounded"></div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                  </div>
                  <div className="border-b pb-2 pt-2">
                    <div className="h-6 w-40 bg-slate-300 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-100 rounded"></div>
                    <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                  </div>
                </div>
                <p className="text-sm text-center mt-2">Մինիմալիստական ոճով CV՝ առանց ավելորդ մանրամասների</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>CV նախադիտում</CardTitle>
            <CardDescription>
              Այսպես կտեսնեն Ձեր CV-ն
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-6 mb-4">
              <div className={`cv-preview ${template}`}>
                {template === 'modern' ? (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 bg-slate-50 p-4 rounded-md">
                      <div className="text-center mb-6">
                        <div className="h-24 w-24 mx-auto mb-3 rounded-full overflow-hidden">
                          <img 
                            src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                            alt={user?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <p className="text-sm text-gray-600">Ուսանող</p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-md font-bold mb-2">Կոնտակտային տվյալներ</h3>
                        <ul className="space-y-1 text-sm">
                          <li>Էլ. փոստ: {user?.email}</li>
                          <li>Հեռախոս: +374 99 123456</li>
                          <li>LinkedIn: linkedin.com/in/username</li>
                          <li>GitHub: github.com/username</li>
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-md font-bold mb-2">Հմտություններ</h3>
                        <ul className="space-y-1 text-sm">
                          <li>JavaScript (React, Node.js)</li>
                          <li>TypeScript</li>
                          <li>HTML/CSS</li>
                          <li>MongoDB, MySQL</li>
                          <li>Git</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-bold mb-2">Լեզուներ</h3>
                        <ul className="space-y-1 text-sm">
                          <li>Հայերեն (մայրենի)</li>
                          <li>Անգլերեն (B2)</li>
                          <li>Ռուսերեն (B1)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-2 border-b pb-1">Ամփոփում</h3>
                        <p className="text-sm">
                          Ծրագրավորման ֆակուլտետի ուսանող՝ Web ծրագրավորման մասնագիտացմամբ։ Փորձառու JavaScript ծրագրավորող՝ React և Node.js տեխնոլոգիաներով։ Ունեմ 5+ հաջողված նախագծեր դպրոցական և անձնական պորտֆոլիոյում։
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-2 border-b pb-1">Կրթություն</h3>
                        <div className="mb-3">
                          <div className="flex justify-between">
                            <h4 className="text-md font-semibold">ԵՊՀ, Ինֆորմատիկայի ֆակուլտետ</h4>
                            <span className="text-sm">2020 - ներկա</span>
                          </div>
                          <p className="text-sm">Բակալավրիատ, Ծրագրավորում</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-2 border-b pb-1">Նախագծեր</h3>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-md font-semibold">E-commerce կայք</h4>
                            <p className="text-sm text-gray-600">Full Stack Developer</p>
                            <p className="text-sm">Ամբողջական ֆունկցիոնալությամբ էլեկտրոնային առևտրի կայք React-ով և Node.js-ով</p>
                          </div>
                          
                          <div>
                            <h4 className="text-md font-semibold">Տվյալների վերլուծություն</h4>
                            <p className="text-sm text-gray-600">Data Analyst</p>
                            <p className="text-sm">Python-ով իրականացված տվյալների վերլուծության նախագիծ</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : template === 'classic' ? (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
                      <p className="text-sm">Էլ. փոստ: {user?.email} | Հեռախոս: +374 99 123456 | LinkedIn: linkedin.com/in/username</p>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-bold mb-2 bg-slate-100 px-2 py-1">Ամփոփում</h2>
                      <p className="text-sm">
                        Ծրագրավորման ֆակուլտետի ուսանող՝ Web ծրագրավորման մասնագիտացմամբ։ Փորձառու JavaScript ծրագրավորող՝ React և Node.js տեխնոլոգիաներով։ Ունեմ 5+ հաջողված նախագծեր դպրոցական և անձնական պորտֆոլիոյում։
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-bold mb-2 bg-slate-100 px-2 py-1">Կրթություն</h2>
                      <div className="mb-2">
                        <div className="flex justify-between">
                          <h4 className="text-md font-semibold">ԵՊՀ, Ինֆորմատիկայի ֆակուլտետ</h4>
                          <span className="text-sm">2020 - ներկա</span>
                        </div>
                        <p className="text-sm">Բակալավրիատ, Ծրագրավորում</p>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-bold mb-2 bg-slate-100 px-2 py-1">Նախագծեր</h2>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between">
                            <h4 className="text-md font-semibold">E-commerce կայք</h4>
                            <span className="text-sm">2022</span>
                          </div>
                          <p className="text-sm">Ամբողջական ֆունկցիոնալությամբ էլեկտրոնային առևտրի կայք React-ով և Node.js-ով</p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between">
                            <h4 className="text-md font-semibold">Տվյալների վերլուծություն</h4>
                            <span className="text-sm">2021</span>
                          </div>
                          <p className="text-sm">Python-ով իրականացված տվյալների վերլուծության նախագիծ</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-bold mb-2 bg-slate-100 px-2 py-1">Հմտություններ</h2>
                      <p className="text-sm">
                        JavaScript (React, Node.js), TypeScript, HTML/CSS, MongoDB, MySQL, Git, Python
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-bold mb-2 bg-slate-100 px-2 py-1">Լեզուներ</h2>
                      <p className="text-sm">
                        Հայերեն (մայրենի), Անգլերեն (B2), Ռուսերեն (B1)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="border-b pb-2">
                      <h1 className="text-2xl font-bold">{user?.name}</h1>
                      <p className="text-sm text-gray-600">Ուսանող | {user?.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm">
                        Ծրագրավորման ֆակուլտետի ուսանող՝ Web ծրագրավորման մասնագիտացմամբ։ Փորձառու JavaScript ծրագրավորող՝ React և Node.js տեխնոլոգիաներով։
                      </p>
                    </div>
                    
                    <div className="border-b pb-2">
                      <h2 className="text-lg font-bold">Նախագծեր</h2>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-md font-semibold">E-commerce կայք</h3>
                        <p className="text-sm">Ամբողջական ֆունկցիոնալությամբ էլեկտրոնային առևտրի կայք React-ով և Node.js-ով</p>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-semibold">Տվյալների վերլուծություն</h3>
                        <p className="text-sm">Python-ով իրականացված տվյալների վերլուծության նախագիծ</p>
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <h2 className="text-lg font-bold">Հմտություններ</h2>
                    </div>
                    
                    <div>
                      <p className="text-sm">
                        JavaScript (React, Node.js), TypeScript, HTML/CSS, MongoDB, MySQL, Git, Python
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCV;

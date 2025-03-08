
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash, Building } from 'lucide-react';
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  description: string;
}

const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'Տեխնոլոջի ՍՊԸ',
    address: 'Երևան, Հանրապետության 24',
    contactPerson: 'Արամ Հակոբյան',
    email: 'info@techno.am',
    phone: '+374 10 123456',
    website: 'https://techno.am',
    industry: 'Տեղեկատվական տեխնոլոգիաներ',
    description: 'Ծրագրային ապահովման մշակման ընկերություն։'
  },
  {
    id: 'org2',
    name: 'Սմարթ Սոլյուշնս',
    address: 'Երևան, Աբովյան 15',
    contactPerson: 'Լիլիթ Սարգսյան',
    email: 'contact@smartsolutions.am',
    phone: '+374 10 987654',
    website: 'https://smartsolutions.am',
    industry: 'Արհեստական բանականություն',
    description: 'AI լուծումների մշակմամբ զբաղվող ընկերություն։'
  }
];

const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [openNewOrg, setOpenNewOrg] = useState(false);
  const [openEditOrg, setOpenEditOrg] = useState<string | null>(null);
  const [newOrg, setNewOrg] = useState<Partial<Organization>>({
    name: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    description: ''
  });

  const handleCreateOrganization = () => {
    if (!newOrg.name || !newOrg.email) {
      toast.error("Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը");
      return;
    }

    const id = `org-${Date.now()}`;
    const createdOrg: Organization = {
      id,
      name: newOrg.name,
      address: newOrg.address || '',
      contactPerson: newOrg.contactPerson || '',
      email: newOrg.email,
      phone: newOrg.phone || '',
      website: newOrg.website || '',
      industry: newOrg.industry || '',
      description: newOrg.description || ''
    };

    setOrganizations(prev => [...prev, createdOrg]);
    setNewOrg({
      name: '',
      address: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      industry: '',
      description: ''
    });
    setOpenNewOrg(false);

    toast.success(`${createdOrg.name} կազմակերպությունը հաջողությամբ ստեղծվել է։`);
  };

  const handleEditOrganization = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (!org) return;
    
    setNewOrg({
      name: org.name,
      address: org.address,
      contactPerson: org.contactPerson,
      email: org.email,
      phone: org.phone,
      website: org.website,
      industry: org.industry,
      description: org.description
    });
    
    setOpenEditOrg(orgId);
  };

  const handleUpdateOrganization = () => {
    if (!openEditOrg) return;
    
    setOrganizations(prev => prev.map(org => {
      if (org.id === openEditOrg) {
        return {
          ...org,
          name: newOrg.name || org.name,
          address: newOrg.address || org.address,
          contactPerson: newOrg.contactPerson || org.contactPerson,
          email: newOrg.email || org.email,
          phone: newOrg.phone || org.phone,
          website: newOrg.website || org.website,
          industry: newOrg.industry || org.industry,
          description: newOrg.description || org.description
        };
      }
      return org;
    }));
    
    setNewOrg({
      name: '',
      address: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      industry: '',
      description: ''
    });
    
    setOpenEditOrg(null);
    toast.success("Կազմակերպության տվյալները հաջողությամբ թարմացվել են։");
  };

  const handleDeleteOrganization = (orgId: string) => {
    setOrganizations(prev => prev.filter(org => org.id !== orgId));
    
    toast.success("Կազմակերպությունը հաջողությամբ ջնջվել է համակարգից։");
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Կազմակերպությունների կառավարում</h2>
        <Dialog open={openNewOrg} onOpenChange={setOpenNewOrg}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Ավելացնել կազմակերպություն
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Նոր կազմակերպություն</DialogTitle>
              <DialogDescription>
                Ստեղծեք նոր կազմակերպություն համակարգում։
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Անվանում*</Label>
                <Input
                  id="name"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Օրինակ՝ Տեխնոլոջի ՍՊԸ"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Հասցե</Label>
                <Input
                  id="address"
                  value={newOrg.address}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Օրինակ՝ Երևան, Հանրապետության 24"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPerson">Կոնտակտային անձ</Label>
                <Input
                  id="contactPerson"
                  value={newOrg.contactPerson}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Օրինակ՝ Արամ Հակոբյան"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Էլ․ հասցե*</Label>
                <Input
                  id="email"
                  type="email"
                  value={newOrg.email}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="info@example.am"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Հեռախոս</Label>
                <Input
                  id="phone"
                  value={newOrg.phone}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+374 10 123456"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Կայք</Label>
                <Input
                  id="website"
                  value={newOrg.website}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.am"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Ոլորտ</Label>
                <Input
                  id="industry"
                  value={newOrg.industry}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="Օրինակ՝ Տեղեկատվական տեխնոլոգիաներ"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Նկարագրություն</Label>
                <Input
                  id="description"
                  value={newOrg.description}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Համառոտ նկարագրություն կազմակերպության մասին"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNewOrg(false)}>Չեղարկել</Button>
              <Button onClick={handleCreateOrganization}>Ստեղծել</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Կազմակերպությունների ցանկ</CardTitle>
          <CardDescription>Համակարգում գրանցված բոլոր կազմակերպությունները</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-left">ID</TableHead>
                <TableHead className="text-left">Անվանում</TableHead>
                <TableHead className="text-left">Կոնտակտ</TableHead>
                <TableHead className="text-left">Ոլորտ</TableHead>
                <TableHead className="text-right">Գործողություններ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org, index) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building size={16} />
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-xs text-muted-foreground">{org.address}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{org.contactPerson}</p>
                      <p className="text-xs text-muted-foreground">{org.email}</p>
                      {org.phone && <p className="text-xs text-muted-foreground">{org.phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell>{org.industry}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={openEditOrg === org.id} onOpenChange={(open) => {
                        if (open) {
                          handleEditOrganization(org.id);
                        } else {
                          setOpenEditOrg(null);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" title="Խմբագրել">
                            <Pencil size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Խմբագրել կազմակերպությունը</DialogTitle>
                            <DialogDescription>
                              Փոփոխեք {org.name} կազմակերպության տվյալները։
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name">Անվանում*</Label>
                              <Input
                                id="edit-name"
                                value={newOrg.name}
                                onChange={(e) => setNewOrg(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-address">Հասցե</Label>
                              <Input
                                id="edit-address"
                                value={newOrg.address}
                                onChange={(e) => setNewOrg(prev => ({ ...prev, address: e.target.value }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-contactPerson">Կոնտակտային անձ</Label>
                              <Input
                                id="edit-contactPerson"
                                value={newOrg.contactPerson}
                                onChange={(e) => setNewOrg(prev => ({ ...prev, contactPerson: e.target.value }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-email">Էլ․ հասցե*</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={newOrg.email}
                                onChange={(e) => setNewOrg(prev => ({ ...prev, email: e.target.value }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-phone">Հեռախոս</Label>
                              <Input
                                id="edit-phone"
                                value={newOrg.phone}
                                onChange={(e) => setNewOrg(prev => ({ ...prev, phone: e.target.value }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-website">Կայք</Label>
                              <Input
                                id="edit-website"
                                value={newOrg.website}
                                onChange={(e) => setNewOrg(prev => ({ ...prev, website: e.target.value }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-industry">Ոլորտ</Label>
                              <Input
                                id="edit-industry"
                                value={newOrg.industry}
                                onChange={(e) => setNewOrg(prev => ({ ...prev, industry: e.target.value }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-description">Նկարագրություն</Label>
                              <Input
                                id="edit-description"
                                value={newOrg.description}
                                onChange={(e) => setNewOrg(prev => ({ ...prev, description: e.target.value }))}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenEditOrg(null)}>Չեղարկել</Button>
                            <Button onClick={handleUpdateOrganization}>Պահպանել</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteOrganization(org.id)}
                        title="Ջնջել"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationManagement;

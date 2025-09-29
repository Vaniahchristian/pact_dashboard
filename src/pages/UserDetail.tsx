import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/context/user/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Mail, Phone, Award, Wallet, Calendar, Edit, UserCheck, UserX } from "lucide-react";
import { BankakAccountForm, BankakAccountFormValues } from "@/components/BankakAccountForm";
import { User } from "@/types";
import { sudanStates, getLocalitiesByState } from "@/data/sudanStates";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { users, currentUser, updateUser, approveUser, rejectUser } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bankAccountFormOpen, setBankAccountFormOpen] = useState(false);

  const canEditBankAccount = currentUser?.role === "admin" || currentUser?.role === "ict";
  const isAdmin = currentUser?.role === "admin" || (currentUser?.roles && currentUser.roles.includes("admin"));

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundUser = users.find(u => u.id === id);
      if (foundUser) {
        setUser(foundUser);
        setEditForm(foundUser);
      } else {
        toast({
          title: "User not found",
          description: `No user with ID ${id} exists`,
          variant: "destructive",
        });
        navigate("/users");
      }
    }
  }, [id, users, navigate, toast]);

  const handleBankAccountSubmit = (values: BankakAccountFormValues) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      bankAccount: {
        accountName: values.accountName,
        accountNumber: values.accountNumber,
        branch: values.branch
      }
    };

    if (updateUser) {
      updateUser(updatedUser)
        .then((success) => {
          if (success) {
            setUser(updatedUser);
            toast({
              title: "Bank Account Updated",
              description: `Bank account details updated for ${user.name}`,
            });
            setBankAccountFormOpen(false);
          }
        })
        .catch(error => {
          console.error("Error updating bank account:", error);
          toast({
            title: "Update failed",
            description: "There was a problem updating the bank account information.",
            variant: "destructive"
          });
        });
    }
  };

  const getUserLocation = (user: User) => {
    if (!user.stateId) return "Not specified";
    const state = sudanStates.find(s => s.id === user.stateId);
    if (!state) return "Unknown state";
    if (!user.localityId) return state.name;
    const locality = getLocalitiesByState(user.stateId).find(l => l.id === user.localityId);
    return locality ? `${state.name}, ${locality.name}` : state.name;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setEditForm(user || {});
  };

  const handleEditChange = (field: keyof User, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!updateUser || !user) return;
    setIsSaving(true);
    
    try {
      const updatedUser: User = { ...user, ...editForm };
      const success = await updateUser(updatedUser);
      
      if (success) {
        setUser(updatedUser);
        toast({
          title: "User updated",
          description: "User information was successfully updated and will persist between sessions.",
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating the user information.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
      setEditMode(false);
    }
  };

  const handleApprove = async () => {
    if (!user || !approveUser) return;
    setIsApproving(true);
    await approveUser(user.id);
    setIsApproving(false);
    toast({ title: "User approved", description: `${user.name} has been approved.` });
  };

  const handleReject = async () => {
    if (!user || !rejectUser) return;
    setIsRejecting(true);
    await rejectUser(user.id);
    setIsRejecting(false);
    toast({ title: "User rejected", description: `${user.name} has been rejected.` });
    navigate("/users");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading user details...</h2>
          <p className="text-gray-500">If this persists, the user may not exist.</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => navigate("/users")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate("/users")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>
        {isAdmin && !editMode && (
          <Button onClick={handleEdit} variant="outline">
            <Edit className="h-4 w-4 mr-1" />
            Edit User
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Avatar className="h-32 w-32">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="text-center">
                {editMode ? (
                  <input
                    className="font-bold text-2xl text-center border rounded px-2"
                    value={editForm.name || ""}
                    onChange={e => handleEditChange("name", e.target.value)}
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                )}
                <p className="text-muted-foreground">
                  {editMode ? (
                    <input
                      className="border rounded px-1 text-center"
                      value={editForm.role || ""}
                      onChange={e => handleEditChange("role", e.target.value)}
                    />
                  ) : (
                    user.role
                  )}
                </p>
                <Badge className="mt-2" variant={user.isApproved ? "default" : "destructive"}>
                  {user.isApproved ? "Active" : "Pending Approval"}
                </Badge>
              </div>
              
              <div className="w-full space-y-2 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {editMode ? (
                    <Input
                      type="email"
                      value={editForm.email || ""}
                      onChange={e => handleEditChange("email", e.target.value)}
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {editMode ? (
                    <Input
                      value={editForm.phone || ""}
                      onChange={e => handleEditChange("phone", e.target.value)}
                    />
                  ) : (
                    <span>{user.phone || "N/A"}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {editMode ? (
                    <Input
                      value={editForm.stateId || ""}
                      placeholder="State ID"
                      onChange={e => handleEditChange("stateId", e.target.value)}
                      className="mb-1"
                    />
                  ) : (
                    <span>{getUserLocation(user)}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>Rating: {user.performance?.rating ?? "-"}/5</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span>{user.wallet?.balance} {user.wallet?.currency}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Last Active: {user.lastActive ? new Date(user.lastActive).toLocaleString() : "N/A"}
                  </span>
                </div>
              </div>
              {!user.isApproved && isAdmin && !editMode && (
                <div className="w-full flex justify-center gap-2 mt-4">
                  <Button onClick={handleApprove} disabled={isApproving} variant="default">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button onClick={handleReject} disabled={isRejecting} variant="destructive">
                    <UserX className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
              {editMode && (
                <div className="w-full flex justify-center gap-2 mt-4">
                  <Button 
                    onClick={handleEditSave} 
                    disabled={isSaving} 
                    variant="default"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={handleEditCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="bankak">Bankak Account</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm">Full Name</h3>
                    {editMode ? (
                      <Input
                        value={editForm.name || ""}
                        onChange={e => handleEditChange("name", e.target.value)}
                      />
                    ) : (
                      <p>{user.name}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Email</h3>
                    {editMode ? (
                      <Input
                        type="email"
                        value={editForm.email || ""}
                        onChange={e => handleEditChange("email", e.target.value)}
                      />
                    ) : (
                      <p>{user.email}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Role</h3>
                    {editMode ? (
                      <Input
                        value={editForm.role || ""}
                        onChange={e => handleEditChange("role", e.target.value)}
                      />
                    ) : (
                      <p>{user.role}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Employee ID</h3>
                    {editMode ? (
                      <Input
                        value={editForm.employeeId || ""}
                        onChange={e => handleEditChange("employeeId", e.target.value)}
                      />
                    ) : (
                      <p>{user.employeeId || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Phone</h3>
                    {editMode ? (
                      <Input
                        value={editForm.phone || ""}
                        onChange={e => handleEditChange("phone", e.target.value)}
                      />
                    ) : (
                      <p>{user.phone || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Status</h3>
                    <p>{user.isApproved ? 'Active' : 'Pending Approval'}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="performance">
                {user.performance ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <h3 className="font-medium text-sm mb-1">Rating</h3>
                        <p className="text-2xl font-bold">{user.performance.rating}/5</p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <h3 className="font-medium text-sm mb-1">Completed Tasks</h3>
                        <p className="text-2xl font-bold">{user.performance.totalCompletedTasks}</p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <h3 className="font-medium text-sm mb-1">On-Time Completion</h3>
                        <p className="text-2xl font-bold">{user.performance.onTimeCompletion}%</p>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <h3 className="font-medium text-sm mb-1">Current Workload</h3>
                        <p className="text-2xl font-bold">{user.performance.currentWorkload || 0}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No performance data available.</p>
                )}
              </TabsContent>
              
              <TabsContent value="bankak">
                {user.bankAccount ? (
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Bank Account Details</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Account Name</p>
                          <p className="font-medium">{user.bankAccount.accountName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Account Number</p>
                          <p className="font-medium">{user.bankAccount.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Branch</p>
                          <p className="font-medium">{user.bankAccount.branch}</p>
                        </div>
                      </div>
                    </div>
                    
                    {canEditBankAccount && (
                      <Button onClick={() => setBankAccountFormOpen(true)}>
                        Edit Bank Account
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">No bank account details available.</p>
                    {canEditBankAccount && (
                      <Button onClick={() => setBankAccountFormOpen(true)}>
                        Add Bank Account
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="location">
                {user.location ? (
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Latitude</p>
                        <p className="font-medium">{user.location.latitude}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Longitude</p>
                        <p className="font-medium">{user.location.longitude}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="font-medium">
                          {user.location.lastUpdated ? new Date(user.location.lastUpdated).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location Sharing</p>
                        <p className="font-medium">
                          {user.location.isSharing ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="h-[300px] bg-slate-100 rounded-lg flex items-center justify-center">
                      <div className="text-center p-4">
                        <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">Map view is not available in this view</p>
                        <p className="text-xs text-muted-foreground mt-1">Check the Field Team page for interactive map</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No location data available.</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={bankAccountFormOpen} onOpenChange={setBankAccountFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {user.bankAccount ? "Edit Bankak Account" : "Add Bankak Account"}
            </DialogTitle>
          </DialogHeader>
          
          <BankakAccountForm 
            onSubmit={handleBankAccountSubmit}
            isSubmitting={false}
            existingDetails={user.bankAccount}
            currentUserRole={currentUser?.role}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetail;

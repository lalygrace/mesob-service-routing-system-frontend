"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  UserPlus,
  MoreVertical,
  Mail,
  Lock,
  User,
  Shield,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usersApi, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
}

export default function UsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" as Admin["role"],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await usersApi.list();
      setAdmins(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to load users: ${error.message}`);
      } else {
        toast.error("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      await usersApi.create(formData);
      toast.success("Admin added successfully");
      setFormData({ name: "", email: "", password: "", role: "admin" });
      setIsAddDialogOpen(false);
      await loadUsers();
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Failed to add admin");
      }
    }
  };

  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    setError("");
    setSuccess("");

    try {
      await usersApi.update(selectedAdmin.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
      toast.success("Admin updated successfully");
      setIsEditDialogOpen(false);
      setSelectedAdmin(null);
      await loadUsers();
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Failed to update admin");
      }
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      try {
        await usersApi.delete(id);
        toast.success("Admin deleted successfully");
        await loadUsers();
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(`Failed to delete admin: ${error.message}`);
        } else {
          toast.error("Failed to delete admin");
        }
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const admin = admins.find((a) => a.id === id);
      if (admin) {
        await usersApi.update(id, { status: admin.status === "active" ? "inactive" : "active" });
        toast.success("Admin status updated successfully");
        await loadUsers();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Failed to update status: ${error.message}`);
      } else {
        toast.error("Failed to update status");
      }
    }
  };

  const openEditDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
    });
    setIsEditDialogOpen(true);
  };

  const getRoleBadgeColor = (role: Admin["role"]) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-500 text-white";
      case "admin":
        return "bg-blue-500 text-white";
      case "moderator":
        return "bg-green-500 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
          <p className="text-muted-foreground">
            Manage admin users and their permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Create a new admin user account
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAdmin}>
              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@mesob.gov.et"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Admin</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Admins</CardTitle>
          <CardDescription>
            A list of all admin users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {admin.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{admin.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(admin.role)}>
                        {admin.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={admin.status === "active" ? "default" : "secondary"}
                      >
                        {admin.status === "active" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {admin.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{admin.createdAt}</TableCell>
                    <TableCell>{admin.lastLogin || "Never"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(admin)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(admin.id)}>
                            <Shield className="mr-2 h-4 w-4" />
                            {admin.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>Update admin user information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditAdmin}>
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

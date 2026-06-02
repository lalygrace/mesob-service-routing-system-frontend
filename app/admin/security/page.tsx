"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Key, Smartphone } from "lucide-react";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { TwoFactorSettings } from "@/components/admin/two-factor-settings";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Security Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account security and authentication methods
        </p>
      </div>

      <Tabs defaultValue="password" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="password" className="gap-2">
            <Key className="h-4 w-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="two-factor" className="gap-2">
            <Smartphone className="h-4 w-4" />
            Two-Factor Auth
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure. Use a strong
                password with at least 10 characters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="two-factor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account by enabling
                two-factor authentication. You'll need to enter a code from your
                authenticator app each time you sign in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TwoFactorSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

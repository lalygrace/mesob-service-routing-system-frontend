"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface LoginFormDataProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  className?: string;
}

export function LoginFormData({
  onSubmit,
  isLoading,
  className,
}: LoginFormDataProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome to Mesob Center</h1>
                <p className="text-balance text-muted-foreground">
                  Sign in to access the Government Service Navigation System
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@mesob.gov.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Government Service Portal
              </FieldSeparator>
              <FieldDescription className="text-center text-sm">
                Mesob One-Stop Government Service Center
                <br />
                Addis Ababa, Ethiopia
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:flex items-center justify-center">
            <Image
              src="/mesoblogo.png"
              alt="Mesob Logo"
              width={200}
              height={200}
              className="h-auto w-48 lg:w-64"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By signing in, you agree to the system usage policies for government
        service administration.
      </FieldDescription>
    </div>
  );
}

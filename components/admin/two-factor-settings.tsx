"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Loader2, 
  Shield, 
  ShieldCheck, 
  Copy, 
  Check, 
  ShieldAlert,
  Smartphone,
  Key,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAdminMe, enable2FA, disable2FA, verify2FATOTP, type Enable2FAResponse } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";

const enableFormSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

const verifyFormSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

const disableFormSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type EnableFormValues = z.infer<typeof enableFormSchema>;
type VerifyFormValues = z.infer<typeof verifyFormSchema>;
type DisableFormValues = z.infer<typeof disableFormSchema>;

export function TwoFactorSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [setupData, setSetupData] = useState<Enable2FAResponse | null>(null);
  const [copiedCodes, setCopiedCodes] = useState<Record<string, boolean>>({});

  const enableForm = useForm<EnableFormValues>({
    resolver: zodResolver(enableFormSchema),
    defaultValues: { password: "" },
  });

  const verifyForm = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: { code: "" },
  });

  const disableForm = useForm<DisableFormValues>({
    resolver: zodResolver(disableFormSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const data = await getAdminMe();
      setIs2FAEnabled(data.user?.twoFactorEnabled ?? false);
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  }

  async function onEnableSubmit(values: EnableFormValues) {
    setIsLoading(true);
    try {
      const response = await enable2FA(values.password);
      setSetupData(response);
      setShowSetupDialog(true);
      enableForm.reset();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to enable 2FA"));
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerifySubmit(values: VerifyFormValues) {
    setIsLoading(true);
    try {
      await verify2FATOTP(values.code, false);
      toast.success("Two-factor authentication enabled successfully!");
      setShowSetupDialog(false);
      setSetupData(null);
      verifyForm.reset();
      await loadUserData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid verification code"));
    } finally {
      setIsLoading(false);
    }
  }

  async function onDisableSubmit(values: DisableFormValues) {
    setIsLoading(true);
    try {
      await disable2FA(values.password);
      toast.success("Two-factor authentication disabled");
      setShowDisableDialog(false);
      disableForm.reset();
      await loadUserData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to disable 2FA"));
    } finally {
      setIsLoading(false);
    }
  }

  function copyToClipboard(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedCodes({ ...copiedCodes, [index]: true });
    toast.success("Backup code copied to clipboard");
    setTimeout(() => {
      setCopiedCodes({ ...copiedCodes, [index]: false });
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                is2FAEnabled 
                  ? "bg-green-100 dark:bg-green-950" 
                  : "bg-orange-100 dark:bg-orange-950"
              }`}>
                {is2FAEnabled ? (
                  <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <ShieldAlert className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Two-Factor Authentication</h3>
                  <Badge variant={is2FAEnabled ? "default" : "secondary"}>
                    {is2FAEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {is2FAEnabled 
                    ? "Your account is protected with TOTP-based two-factor authentication."
                    : "Add an extra layer of security by requiring a verification code from your authenticator app."}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {!is2FAEnabled && (
          <>
            <Separator />
            <div className="p-6 bg-muted/50">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Use an Authenticator App</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Compatible with Google Authenticator, Authy, 1Password, and other TOTP apps
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Key className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Backup Codes</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Save backup codes to recover access if you lose your device
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Section */}
      {is2FAEnabled ? (
        <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-sm">Disable Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                This will reduce your account security
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDisableDialog(true)}
            disabled={isLoading}
          >
            Disable 2FA
          </Button>
        </div>
      ) : (
        <Form {...enableForm}>
          <form
            onSubmit={enableForm.handleSubmit(onEnableSubmit)}
            className="space-y-4"
          >
            <FormField
              control={enableForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Your Password</FormLabel>
                  <FormDescription>
                    Enter your password to begin the setup process
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Shield className="mr-2 h-4 w-4" />
              Enable Two-Factor Authentication
            </Button>
          </form>
        </Form>
      )}

      {/* Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Set Up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Follow these steps to secure your account with TOTP-based authentication
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Step 1: QR Code */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-base">Scan QR Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your authenticator app to scan this code
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg border bg-muted/50 p-6">
                {setupData?.totpURI && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <QRCode value={setupData.totpURI} size={200} />
                    </div>
                    
                    <div className="space-y-2 w-full">
                      <p className="text-xs font-medium text-center text-muted-foreground">
                        Can't scan? Enter this code manually:
                      </p>
                      <div className="flex items-center gap-2 p-3 bg-background border rounded-lg">
                        <code className="flex-1 text-sm font-mono text-center break-all">
                          {setupData.totpURI.split("secret=")[1]?.split("&")[0]}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => {
                            const secret = setupData.totpURI.split("secret=")[1]?.split("&")[0];
                            navigator.clipboard.writeText(secret);
                            toast.success("Secret key copied to clipboard");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Recommended apps:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Google Authenticator</Badge>
                    <Badge variant="outline" className="text-xs">Microsoft Authenticator</Badge>
                    <Badge variant="outline" className="text-xs">Authy</Badge>
                    <Badge variant="outline" className="text-xs">1Password</Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 2: Backup Codes */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-base">Save Backup Codes</h3>
                  <p className="text-sm text-muted-foreground">
                    Store these codes securely for account recovery
                  </p>
                </div>
              </div>
              
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Each backup code can only be used once. Save them in a secure location like a password manager.
                </AlertDescription>
              </Alert>
              
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {setupData?.backupCodes?.map((code, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-3 bg-background rounded-lg border hover:bg-accent transition-colors group"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-medium text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <code className="text-sm font-mono font-medium">{code}</code>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(code, index)}
                      >
                        {copiedCodes[index] ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => {
                    const allCodes = setupData?.backupCodes?.join("\n") || "";
                    navigator.clipboard.writeText(allCodes);
                    toast.success("All backup codes copied to clipboard");
                  }}
                >
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Copy All Codes
                </Button>
              </div>
            </div>

            <Separator />

            {/* Step 3: Verify */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-base">Verify Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the code from your app to complete setup
                  </p>
                </div>
              </div>
              
              <Form {...verifyForm}>
                <form
                  onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={verifyForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormDescription>
                          Enter the 6-digit code shown in your authenticator app
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="000000"
                            maxLength={6}
                            disabled={isLoading}
                            className="text-center text-lg tracking-widest font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowSetupDialog(false);
                        setSetupData(null);
                        verifyForm.reset();
                      }}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Verify and Enable
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disable Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter your password to confirm disabling 2FA. This will reduce your
              account security.
            </DialogDescription>
          </DialogHeader>

          <Form {...disableForm}>
            <form
              onSubmit={disableForm.handleSubmit(onDisableSubmit)}
              className="space-y-4"
            >
              <FormField
                control={disableForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDisableDialog(false);
                    disableForm.reset();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Disable 2FA
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

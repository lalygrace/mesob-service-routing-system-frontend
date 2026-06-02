"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Shield, ShieldCheck, Copy, Check } from "lucide-react";
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
      {is2FAEnabled ? (
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Two-Factor Authentication is Enabled</AlertTitle>
          <AlertDescription>
            Your account is protected with an additional layer of security.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Two-Factor Authentication is Disabled</AlertTitle>
          <AlertDescription>
            Enable 2FA to add an extra layer of security to your account.
          </AlertDescription>
        </Alert>
      )}

      {is2FAEnabled ? (
        <div>
          <Button
            variant="destructive"
            onClick={() => setShowDisableDialog(true)}
          >
            Disable Two-Factor Authentication
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
                    Enter your password to enable two-factor authentication
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

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enable Two-Factor Authentication
            </Button>
          </form>
        </Form>
      )}

      {/* Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app and enter the code to
              complete setup.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Step 1: QR Code */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                  1
                </div>
                <span>Scan QR Code</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app like Google Authenticator, Authy, or
                1Password to scan this QR code.
              </p>
              {setupData?.totpURI && (
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCode value={setupData.totpURI} size={200} />
                </div>
              )}
              <div className="text-xs text-muted-foreground text-center">
                Can't scan? Manual entry key: <code className="px-1 py-0.5 bg-muted rounded">{setupData?.totpURI?.split("secret=")[1]?.split("&")[0]}</code>
              </div>
            </div>

            {/* Step 2: Backup Codes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                  2
                </div>
                <span>Save Backup Codes</span>
              </div>
              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> Save these backup codes in a safe
                  place. You can use them to access your account if you lose your
                  authenticator device.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
                {setupData?.backupCodes?.map((code, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2 bg-background rounded border"
                  >
                    <code className="text-sm font-mono">{code}</code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(code, index)}
                    >
                      {copiedCodes[index] ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Verify */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                  3
                </div>
                <span>Verify Setup</span>
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
                          Enter the 6-digit code from your authenticator app
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="000000"
                            maxLength={6}
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
                        setShowSetupDialog(false);
                        setSetupData(null);
                        verifyForm.reset();
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Verify and Enable
                    </Button>
                  </DialogFooter>
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

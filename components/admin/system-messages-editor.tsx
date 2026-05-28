"use client";

import * as React from "react";
import { Volume2, Save, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAllSystemMessages,
  updateSystemMessage,
  initializeSystemMessages,
  type SystemMessageListItem,
} from "@/lib/api/system-message";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function SystemMessagesEditor() {
  const [messages, setMessages] = React.useState<SystemMessageListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(false);

  // Default messages (same as backend defaults)
  const defaults = {
    welcome: {
      am: 'እንኳን ወደ መሶብ አንድ-ማዕከል መንግሥታዊ አገልግሎት ማዕከል ደህና መጡ። ዛሬ እንዴት ልንረዳዎት እንችላለን? የሚፈልጉትን አገልግሎት ይግለጹ፣ ይናገሩን፣ ወይም አገልግሎቶቻችንን በድርጅት ያስሱ።',
      en: 'Welcome to Mesob One-Stop Government Service Center. How can we help you today? Please describe your need, speak to us, or browse our services by organization.',
      om: "Gara Wiirtuu Tajaajila Mootummaa Tokkicha Mesob Nagaan Dhuftan. Har'a akkamitti isin gargaaruu dandeenya? Tajaajila barbaaddan ibsaa, nutti himaa, yookaan tajaajiloota keenya dhaabbata keessaa sakattaʼaa.",
    },
    processing: {
      am: 'እናመሰግናለን፣ ለእርስዎ እየፈለግን ነው። እባክዎ ትንሽ ይጠብቁ።',
      en: 'Thank you, we are looking into that for you. Just a moment please.',
      om: 'Galatoomaa; isinii barbaadaa jirra. Mee xinnoo obsa.',
    },
    closing: {
      am: 'መሶብ አንድ-ማዕከል መንግሥታዊ አገልግሎት ማዕከልን ስለተጠቀሙ እናመሰግናለን። ዛሬ ልንረዳዎት መቻላችንን ተስፋ እናደርጋለን። ከአገልግሎትዎ ጋር ለስላሳ እና ስኬታማ ልምድ እንመኝልዎታለን። መልካም ቀን ይሁንልዎት!',
      en: 'Thank you for using Mesob One-Stop Government Service Center. We hope we were able to help you today. Wishing you a smooth and successful experience with your service. Have a wonderful day!',
      om: "Wiirtuu Tajaajila Mootummaa Tokkicha Mesob fayyadamuu keessaniif galatoomaa. Har'a isin gargaaruu dandeenyee abdii qabna. Tajaajila keessan waliin muuxannoo sirrii fi milkaaʼaa akka qabaattan hawwina. Guyyaa gaarii qabaataa!",
    },
  };

  // Editable state for each message
  const [welcomeAm, setWelcomeAm] = React.useState("");
  const [welcomeEn, setWelcomeEn] = React.useState("");
  const [welcomeOm, setWelcomeOm] = React.useState("");

  const [processingAm, setProcessingAm] = React.useState("");
  const [processingEn, setProcessingEn] = React.useState("");
  const [processingOm, setProcessingOm] = React.useState("");

  const [closingAm, setClosingAm] = React.useState("");
  const [closingEn, setClosingEn] = React.useState("");
  const [closingOm, setClosingOm] = React.useState("");

  React.useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setIsLoading(true);
    try {
      const data = await getAllSystemMessages();
      setMessages(data);

      // If no messages exist, use defaults
      if (data.length === 0) {
        setWelcomeAm(defaults.welcome.am);
        setWelcomeEn(defaults.welcome.en);
        setWelcomeOm(defaults.welcome.om);
        setProcessingAm(defaults.processing.am);
        setProcessingEn(defaults.processing.en);
        setProcessingOm(defaults.processing.om);
        setClosingAm(defaults.closing.am);
        setClosingEn(defaults.closing.en);
        setClosingOm(defaults.closing.om);
      } else {
        // Populate state from loaded messages, use defaults for missing ones
        const messageMap = new Map(
          data.map((msg) => [`${msg.type}_${msg.language}`, msg.text])
        );

        setWelcomeAm(messageMap.get("welcome_AMHARIC") ?? defaults.welcome.am);
        setWelcomeEn(messageMap.get("welcome_ENGLISH") ?? defaults.welcome.en);
        setWelcomeOm(messageMap.get("welcome_AFAAN_OROMO") ?? defaults.welcome.om);

        setProcessingAm(messageMap.get("processing_AMHARIC") ?? defaults.processing.am);
        setProcessingEn(messageMap.get("processing_ENGLISH") ?? defaults.processing.en);
        setProcessingOm(messageMap.get("processing_AFAAN_OROMO") ?? defaults.processing.om);

        setClosingAm(messageMap.get("closing_AMHARIC") ?? defaults.closing.am);
        setClosingEn(messageMap.get("closing_ENGLISH") ?? defaults.closing.en);
        setClosingOm(messageMap.get("closing_AFAAN_OROMO") ?? defaults.closing.om);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load system messages"));
      // On error, still show defaults
      setWelcomeAm(defaults.welcome.am);
      setWelcomeEn(defaults.welcome.en);
      setWelcomeOm(defaults.welcome.om);
      setProcessingAm(defaults.processing.am);
      setProcessingEn(defaults.processing.en);
      setProcessingOm(defaults.processing.om);
      setClosingAm(defaults.closing.am);
      setClosingEn(defaults.closing.en);
      setClosingOm(defaults.closing.om);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await Promise.all([
        // Welcome messages
        updateSystemMessage("welcome", "AMHARIC", welcomeAm),
        updateSystemMessage("welcome", "ENGLISH", welcomeEn),
        updateSystemMessage("welcome", "AFAAN_OROMO", welcomeOm),
        // Processing messages
        updateSystemMessage("processing", "AMHARIC", processingAm),
        updateSystemMessage("processing", "ENGLISH", processingEn),
        updateSystemMessage("processing", "AFAAN_OROMO", processingOm),
        // Closing messages
        updateSystemMessage("closing", "AMHARIC", closingAm),
        updateSystemMessage("closing", "ENGLISH", closingEn),
        updateSystemMessage("closing", "AFAAN_OROMO", closingOm),
      ]);
      toast.success("System messages saved and TTS audio regenerated");
      await loadMessages(); // Reload to get updated cache keys
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save system messages"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleInitialize() {
    setIsInitializing(true);
    try {
      const result = await initializeSystemMessages();
      toast.success(`Initialized ${result.count} default system messages`);
      await loadMessages();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to initialize system messages")
      );
    } finally {
      setIsInitializing(false);
    }
  }

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Volume2 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">System Messages (TTS)</CardTitle>
              <CardDescription>
                Customize voice messages played to citizens
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Volume2 className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">System Messages (TTS)</CardTitle>
            <CardDescription>
              Customize voice messages played to citizens
            </CardDescription>
          </div>
          {messages.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleInitialize}
              disabled={isInitializing}
            >
              {isInitializing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                "Initialize Defaults"
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Volume2 className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">About System Messages</p>
              <p className="text-xs text-muted-foreground">
                These messages are played as TTS audio to citizens during their session.
                Amharic and Afaan Oromo messages are converted to voice using AddisAI TTS.
                English messages are text-only (AddisAI TTS doesn't support English).
                Audio is automatically cached for fast playback.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="welcome" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="closing">Closing</TabsTrigger>
          </TabsList>

          <TabsContent value="welcome" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Played after language selection on the intake step
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="welcome-am">Amharic (አማርኛ)</Label>
              <Textarea
                id="welcome-am"
                value={welcomeAm}
                onChange={(e) => setWelcomeAm(e.target.value)}
                rows={4}
                className="font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-en">English</Label>
              <Textarea
                id="welcome-en"
                value={welcomeEn}
                onChange={(e) => setWelcomeEn(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-om">Afaan Oromo</Label>
              <Textarea
                id="welcome-om"
                value={welcomeOm}
                onChange={(e) => setWelcomeOm(e.target.value)}
                rows={4}
                className="font-sans"
              />
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Played while AI is processing the citizen's request
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="processing-am">Amharic (አማርኛ)</Label>
              <Textarea
                id="processing-am"
                value={processingAm}
                onChange={(e) => setProcessingAm(e.target.value)}
                rows={3}
                className="font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="processing-en">English</Label>
              <Textarea
                id="processing-en"
                value={processingEn}
                onChange={(e) => setProcessingEn(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="processing-om">Afaan Oromo</Label>
              <Textarea
                id="processing-om"
                value={processingOm}
                onChange={(e) => setProcessingOm(e.target.value)}
                rows={3}
                className="font-sans"
              />
            </div>
          </TabsContent>

          <TabsContent value="closing" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Played after feedback submission on the thank you screen
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="closing-am">Amharic (አማርኛ)</Label>
              <Textarea
                id="closing-am"
                value={closingAm}
                onChange={(e) => setClosingAm(e.target.value)}
                rows={4}
                className="font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closing-en">English</Label>
              <Textarea
                id="closing-en"
                value={closingEn}
                onChange={(e) => setClosingEn(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closing-om">Afaan Oromo</Label>
              <Textarea
                id="closing-om"
                value={closingOm}
                onChange={(e) => setClosingOm(e.target.value)}
                rows={4}
                className="font-sans"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="font-medium">Save Changes</Label>
            <p className="text-xs text-muted-foreground">
              TTS audio will be regenerated automatically for Amharic and Afaan Oromo
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Messages
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

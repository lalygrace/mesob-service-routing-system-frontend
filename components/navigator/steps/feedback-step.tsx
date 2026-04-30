"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Strings } from "@/lib/service-navigator/strings";

export function FeedbackStep({
  strings, submitted, onSubmit, onStartOver,
}: {
  strings: Strings; submitted: boolean; onSubmit: () => void; onStartOver: () => void;
}) {
  const [helpful, setHelpful] = React.useState<boolean | null>(null);
  const [comment, setComment] = React.useState("");

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HeartHandshake className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{strings.feedbackForm.thankYou}</h2>
          <p className="mt-2 text-muted-foreground">{strings.feedbackForm.thankYouDesc}</p>
        </div>
        <Button onClick={onStartOver} size="lg" className="rounded-xl h-12 px-8 mt-4">
          {strings.success.startOver}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.feedbackForm.heading}
        </h1>
        <p className="text-muted-foreground">{strings.feedbackForm.subheading}</p>
      </div>

      <div className="space-y-4">
        <p className="text-center text-sm font-medium text-foreground">{strings.feedbackForm.wasHelpful}</p>
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setHelpful(true)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all w-32",
              helpful === true
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30",
            )}
          >
            <ThumbsUp className="h-8 w-8" />
            <span className="text-xs font-medium">{strings.feedbackForm.helpful}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setHelpful(false)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all w-32",
              helpful === false
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-border bg-card text-muted-foreground hover:border-destructive/30",
            )}
          >
            <ThumbsDown className="h-8 w-8" />
            <span className="text-xs font-medium">{strings.feedbackForm.notHelpful}</span>
          </motion.button>
        </div>
      </div>

      {helpful !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{strings.feedbackForm.comment}</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={strings.feedbackForm.commentPlaceholder}
              className="min-h-24 rounded-xl resize-none"
            />
          </div>

          <Button onClick={onSubmit} size="lg" className="w-full rounded-xl h-12">
            {strings.feedbackForm.submit}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

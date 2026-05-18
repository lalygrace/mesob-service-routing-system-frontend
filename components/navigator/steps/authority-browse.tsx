"use client";

/**
 * AuthorityBrowse
 *
 * The "Browse by Authority" path — no AI involved.
 * Flow: list all authorities → citizen taps one → list that authority's
 * services → citizen taps a service → navigate directly to result page.
 *
 * This path is completely independent of addis.ai. It always works even
 * when the AI service is unavailable (fallback per the proposal).
 */

import * as React from "react";
import {
  Building2,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  listPublicAuthorities,
  listServicesByAuthority,
  type PublicAuthority,
} from "@/lib/api/navigator";
import type { LanguageCode, Service } from "@/lib/service-navigator/types";
import type { Strings } from "@/lib/service-navigator/strings";

// ─── Sub-views ────────────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

function ErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm text-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

// ─── Authority list view ──────────────────────────────────────────────────────

function AuthorityList({
  authorities,
  onSelect,
}: {
  authorities: PublicAuthority[];
  onSelect: (authority: PublicAuthority) => void;
}) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return authorities;
    return authorities.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.description ?? "").toLowerCase().includes(q),
    );
  }, [authorities, query]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search authorities…"
          className="pl-9 rounded-xl"
          autoFocus
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No authorities match your search.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((authority) => (
            <button
              key={authority.id}
              onClick={() => onSelect(authority)}
              className="group flex w-full items-center gap-4 rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm p-4 text-left transition-all hover:border-primary/30 hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Building2 className="h-5 w-5" />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {authority.name}
                </p>
                {authority.floor && (
                  <p className="text-xs text-muted-foreground">
                    Floor {authority.floor}
                    {authority.wing ? ` · ${authority.wing}` : ""}
                  </p>
                )}
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Service list view ────────────────────────────────────────────────────────

function ServiceList({
  authority,
  services,
  onSelect,
  onBack,
}: {
  authority: PublicAuthority;
  services: Service[];
  onSelect: (service: Service) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Authority header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 rounded-xl"
          aria-label="Back to authorities"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Authority
          </p>
          <h2 className="truncate text-base font-bold text-foreground">
            {authority.name}
          </h2>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground/60" />
          <p className="text-sm font-medium text-foreground">
            No services available
          </p>
          <p className="text-xs text-muted-foreground">
            This authority has no published services yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className="group flex w-full items-start gap-4 rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm p-4 text-left transition-all hover:border-primary/30 hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {service.title}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  {service.locationHint && (
                    <span>{service.locationHint}</span>
                  )}
                  {service.feeHint && <span>{service.feeHint}</span>}
                  {service.durationHint && <span>{service.durationHint}</span>}
                </div>
              </div>
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type BrowseView = "authorities" | "services";

export function AuthorityBrowse({
  language,
  strings,
  onServiceSelected,
}: {
  language: LanguageCode;
  strings: Strings;
  onServiceSelected: (service: Service) => void;
}) {
  const [view, setView] = React.useState<BrowseView>("authorities");
  const [authorities, setAuthorities] = React.useState<PublicAuthority[]>([]);
  const [selectedAuthority, setSelectedAuthority] =
    React.useState<PublicAuthority | null>(null);
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load authorities on mount
  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    listPublicAuthorities(language)
      .then((data) => {
        if (mounted) setAuthorities(data);
      })
      .catch(() => {
        if (mounted) setError("Failed to load authorities. Please try again.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [language]);

  async function handleAuthoritySelect(authority: PublicAuthority) {
    setSelectedAuthority(authority);
    setView("services");
    setLoading(true);
    setError(null);

    try {
      const data = await listServicesByAuthority(authority.id, language);
      setServices(data);
    } catch {
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setView("authorities");
    setSelectedAuthority(null);
    setServices([]);
    setError(null);
  }

  function handleRetry() {
    if (view === "authorities") {
      setError(null);
      setLoading(true);
      listPublicAuthorities(language)
        .then(setAuthorities)
        .catch(() => setError("Failed to load authorities. Please try again."))
        .finally(() => setLoading(false));
    } else if (selectedAuthority) {
      handleAuthoritySelect(selectedAuthority);
    }
  }

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {strings.categories.heading}
        </h1>
        <p className="text-muted-foreground">
          {view === "authorities"
            ? strings.categories.subheading
            : "Select a service to see full details."}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorCard message={error} onRetry={handleRetry} />
      ) : view === "authorities" ? (
        <AuthorityList
          authorities={authorities}
          onSelect={handleAuthoritySelect}
        />
      ) : selectedAuthority ? (
        <ServiceList
          authority={selectedAuthority}
          services={services}
          onSelect={onServiceSelected}
          onBack={handleBack}
        />
      ) : null}
    </div>
  );
}

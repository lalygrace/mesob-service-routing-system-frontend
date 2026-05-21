"use client";

/**
 * OrganizationBrowse
 *
 * The "Browse by Organization" path — no AI involved.
 * Flow: list all organizations → citizen taps one → list that organization's
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
  listPublicOrganizations,
  listServicesByOrganization,
  type PublicOrganization,
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

// ─── Organization list view ──────────────────────────────────────────────────────

function OrganizationList({
  organizations,
  onSelect,
}: {
  organizations: PublicOrganization[];
  onSelect: (organization: PublicOrganization) => void;
}) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return organizations;
    return organizations.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.description ?? "").toLowerCase().includes(q),
    );
  }, [organizations, query]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search organizations…"
          className="pl-9 rounded-xl"
          autoFocus
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No organizations match your search.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((organization) => (
            <button
              key={organization.id}
              onClick={() => onSelect(organization)}
              className="group flex w-full items-center gap-4 rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm p-4 text-left transition-all hover:border-primary/30 hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Building2 className="h-5 w-5" />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {organization.name}
                </p>
                {organization.floor && (
                  <p className="text-xs text-muted-foreground">
                    Floor {organization.floor}
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
  organization,
  services,
  onSelect,
  onBack,
}: {
  organization: PublicOrganization;
  services: Service[];
  onSelect: (service: Service) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Organization header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 rounded-xl"
          aria-label="Back to organizations"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Organization
          </p>
          <h2 className="truncate text-base font-bold text-foreground">
            {organization.name}
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
            This organization has no published services yet.
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
                  {service.locationHint && <span>{service.locationHint}</span>}
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

type BrowseView = "organizations" | "services";

export function OrganizationBrowse({
  language,
  strings,
  onServiceSelected,
}: {
  language: LanguageCode;
  strings: Strings;
  onServiceSelected: (service: Service) => void;
}) {
  const [view, setView] = React.useState<BrowseView>("organizations");
  const [organizations, setOrganizations] = React.useState<
    PublicOrganization[]
  >([]);
  const [selectedOrganization, setSelectedOrganization] =
    React.useState<PublicOrganization | null>(null);
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load organizations on mount
  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    listPublicOrganizations(language)
      .then((data) => {
        if (mounted) setOrganizations(data);
      })
      .catch(() => {
        if (mounted)
          setError("Failed to load organizations. Please try again.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [language]);

  async function handleOrganizationSelect(organization: PublicOrganization) {
    setSelectedOrganization(organization);
    setView("services");
    setLoading(true);
    setError(null);

    try {
      const data = await listServicesByOrganization(organization.id, language);
      setServices(data);
    } catch {
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setView("organizations");
    setSelectedOrganization(null);
    setServices([]);
    setError(null);
  }

  function handleRetry() {
    if (view === "organizations") {
      setError(null);
      setLoading(true);
      listPublicOrganizations(language)
        .then(setOrganizations)
        .catch(() =>
          setError("Failed to load organizations. Please try again."),
        )
        .finally(() => setLoading(false));
    } else if (selectedOrganization) {
      handleOrganizationSelect(selectedOrganization);
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
          {view === "organizations"
            ? strings.categories.subheading
            : "Select a service to see full details."}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorCard message={error} onRetry={handleRetry} />
      ) : view === "organizations" ? (
        <OrganizationList
          organizations={organizations}
          onSelect={handleOrganizationSelect}
        />
      ) : selectedOrganization ? (
        <ServiceList
          organization={selectedOrganization}
          services={services}
          onSelect={onServiceSelected}
          onBack={handleBack}
        />
      ) : null}
    </div>
  );
}

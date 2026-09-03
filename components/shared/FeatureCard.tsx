import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FeaturePreview } from "@/types";

export interface FeatureCardProps {
  feature: FeaturePreview;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const statusLabels = {
    planned: "Planned",
    in_development: "In Forge",
    ready: "Ready",
  };

  return (
    <Card
      variant="parchment"
      className="group relative flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-xl group-hover:scale-105 transition-transform">
            {feature.icon}
          </span>
          <Badge variant={feature.accentColor} size="sm">
            {statusLabels[feature.status]}
          </Badge>
        </div>
        <h3 className="font-serif text-lg font-semibold text-amber-200 group-hover:text-amber-100 transition-colors">
          {feature.title}
        </h3>
        <p className="text-xs font-mono text-amber-400/80 mb-2">
          {feature.tagline}
        </p>
        <p className="text-xs leading-relaxed text-slate-300">
          {feature.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Module {feature.id}</span>
        <span className="text-amber-400/60 group-hover:text-amber-400 transition-colors">
          Architecture Ready &rarr;
        </span>
      </div>
    </Card>
  );
};

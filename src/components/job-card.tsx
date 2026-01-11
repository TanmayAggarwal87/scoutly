import { ExternalLink, MapPin, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  source: string;
  applyUrl: string;
  postedDate: string;
}

export function JobCard({ title, company, location, source, applyUrl, postedDate }: JobCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/20 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="mb-1.5">{title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building2 className="size-3.5" />
                <span>{company}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {source}
            </Badge>
            <span className="text-xs text-muted-foreground">{postedDate}</span>
          </div>
        </div>
        
        <Button size="sm" asChild>
          <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="gap-1.5">
            Apply
            <ExternalLink className="size-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}

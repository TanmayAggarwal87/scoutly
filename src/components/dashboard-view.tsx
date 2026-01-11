import { Search } from "lucide-react";
import { Header } from "./header";
import { JobCard } from "./job-card";
import { Input } from "./ui/input";

// Mock data for demonstration
const mockJobs = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    source: 'LinkedIn',
    applyUrl: 'https://example.com',
    postedDate: '2 hours ago',
  },
  {
    id: '2',
    title: 'Frontend Developer Intern',
    company: 'Meta',
    location: 'Menlo Park, CA',
    source: 'Indeed',
    applyUrl: 'https://example.com',
    postedDate: '5 hours ago',
  },
  {
    id: '3',
    title: 'Backend Engineering Intern',
    company: 'Stripe',
    location: 'San Francisco, CA',
    source: 'Company Website',
    applyUrl: 'https://example.com',
    postedDate: '1 day ago',
  },
  {
    id: '4',
    title: 'Data Science Intern',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    source: 'Glassdoor',
    applyUrl: 'https://example.com',
    postedDate: '1 day ago',
  },
  {
    id: '5',
    title: 'Product Design Intern',
    company: 'Figma',
    location: 'San Francisco, CA',
    source: 'Company Website',
    applyUrl: 'https://example.com',
    postedDate: '2 days ago',
  },
  {
    id: '6',
    title: 'Full Stack Engineering Intern',
    company: 'Vercel',
    location: 'Remote',
    source: 'LinkedIn',
    applyUrl: 'https://example.com',
    postedDate: '2 days ago',
  },
];

export function DashboardView({ isDarkMode, onToggleDarkMode, onLogout, onMenuClick }: { 
  isDarkMode: boolean; 
  onToggleDarkMode: () => void; 
  onLogout: () => void;
  onMenuClick: () => void;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header 
        title="Job Alerts" 
        subtitle="Recent opportunities matching your preferences"
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLogout={onLogout}
        onMenuClick={onMenuClick}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {mockJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>

          {mockJobs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No jobs found. Try adjusting your filters or keywords.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
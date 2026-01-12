import { Search } from "lucide-react";
import { Header } from "./header";
import { JobCard } from "./job-card";
import { Input } from "./ui/input";

import { useState, useEffect } from "react";
import { jobs as jobsApi } from "../lib/api";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  source: string;
  applyUrl: string;
  postedDate: string;
}

export function DashboardView({ isDarkMode, onToggleDarkMode, onLogout, onMenuClick }: {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await jobsApi.getAll();
      // Map backend data to frontend interface
      const mappedJobs = data.map((j: any) => ({
        id: j._id,
        title: j.title,
        company: j.company,
        location: j.location,
        source: j.source || 'Unknown',
        applyUrl: j.url,
        postedDate: j.postedDate || new Date(j.createdAt).toLocaleDateString(),
      }));
      setJobs(mappedJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            {loading ? (
              <div className="text-center py-8">Loading jobs...</div>
            ) : (
              jobs.map((job) => (
                <JobCard key={job.id} {...job} />
              ))
            )}
          </div>

          {!loading && jobs.length === 0 && (
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
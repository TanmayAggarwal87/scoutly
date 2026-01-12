import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";
import { Header } from "./header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { sources as sourcesApi, user as userApi } from "../lib/api";

export function SourcesView({ isDarkMode, onToggleDarkMode, onLogout, onMenuClick }: {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
}) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [availableSources, setAvailableSources] = useState<any[]>([]);
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sourcesRes, userRes] = await Promise.all([
        sourcesApi.getAll(),
        userApi.getMe()
      ]);
      setAvailableSources(sourcesRes.data); // Assuming backend seeds some data or we handle empty

      // If user has no active sources set, maybe select all?
      if (userRes.data.activeSources) {
        setSelectedSources(userRes.data.activeSources);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateSources = async (newSources: string[]) => {
    setSelectedSources(newSources);
    try {
      await userApi.updateSources(newSources);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSource = (id: string) => {
    const newSources = selectedSources.includes(id)
      ? selectedSources.filter((s) => s !== id)
      : [...selectedSources, id];
    updateSources(newSources);
  };

  const handleAddCustom = async () => {
    if (customCompanyName && customUrl) {
      try {
        const { data } = await sourcesApi.addCustom({
          name: customCompanyName,
          url: customUrl,
          type: 'custom'
        });
        setAvailableSources([...availableSources, data]);
        updateSources([...selectedSources, data._id]); // Auto select
        setCustomCompanyName('');
        setCustomUrl('');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Source Selection"
        subtitle="Choose which companies and websites to monitor"
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLogout={onLogout}
        onMenuClick={onMenuClick}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="space-y-8">
            {/* Predefined Companies */}
            <div>
              <h3 className="mb-4">Popular Companies</h3>
              <div className="bg-card border border-border rounded-lg divide-y divide-border">
                {availableSources.map((company) => {
                  const isSelected = selectedSources.includes(company._id);

                  return (
                    <label
                      key={company._id}
                      className="flex items-center gap-4 p-4 hover:bg-accent cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSource(company._id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span>{company.name}</span>
                          {isSelected && (
                            <Check className="size-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{company.url}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Custom URL */}
            <div>
              <h3 className="mb-4">Add Custom Website</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-name">Company Name</Label>
                    <Input
                      id="custom-name"
                      type="text"
                      placeholder="Company Name"
                      value={customCompanyName}
                      onChange={(e) => setCustomCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-url">Website URL</Label>
                    <Input
                      id="custom-url"
                      type="url"
                      placeholder="https://company.com/careers"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add any company career page or job board URL to monitor
                  </p>
                  <Button onClick={handleAddCustom}>
                    <Plus className="size-4 mr-2" />
                    Add Source
                  </Button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4>Active Sources</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Currently monitoring {selectedSources.length} companies
                  </p>
                </div>
                <Button variant="outline">Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
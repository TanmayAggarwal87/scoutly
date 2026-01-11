import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Header } from "./header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

const predefinedCompanies = [
  { id: '1', name: 'Google', url: 'https://careers.google.com' },
  { id: '2', name: 'Meta', url: 'https://www.metacareers.com' },
  { id: '3', name: 'Apple', url: 'https://jobs.apple.com' },
  { id: '4', name: 'Amazon', url: 'https://www.amazon.jobs' },
  { id: '5', name: 'Microsoft', url: 'https://careers.microsoft.com' },
  { id: '6', name: 'Netflix', url: 'https://jobs.netflix.com' },
  { id: '7', name: 'Stripe', url: 'https://stripe.com/jobs' },
  { id: '8', name: 'Airbnb', url: 'https://careers.airbnb.com' },
  { id: '9', name: 'Uber', url: 'https://www.uber.com/careers' },
  { id: '10', name: 'Figma', url: 'https://www.figma.com/careers' },
  { id: '11', name: 'Notion', url: 'https://www.notion.so/careers' },
  { id: '12', name: 'Vercel', url: 'https://vercel.com/careers' },
];

export function SourcesView({ isDarkMode, onToggleDarkMode, onLogout, onMenuClick }: { 
  isDarkMode: boolean; 
  onToggleDarkMode: () => void; 
  onLogout: () => void;
  onMenuClick: () => void;
}) {
  const [selectedSources, setSelectedSources] = useState<string[]>(['1', '5', '7']);
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  const toggleSource = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAddCustom = () => {
    if (customCompanyName && customUrl) {
      // In a real app, this would add to the list
      setCustomCompanyName('');
      setCustomUrl('');
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
                {predefinedCompanies.map((company) => {
                  const isSelected = selectedSources.includes(company.id);
                  
                  return (
                    <label
                      key={company.id}
                      className="flex items-center gap-4 p-4 hover:bg-accent cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSource(company.id)}
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
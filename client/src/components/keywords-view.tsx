import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Header } from "./header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { user as userApi } from "../lib/api";

export function KeywordsView({ isDarkMode, onToggleDarkMode, onLogout, onMenuClick }: {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
}) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      const { data } = await userApi.getMe();
      if (data.keywords) setKeywords(data.keywords);
    } catch (err) {
      console.error(err);
    }
  };

  const updateKeywords = async (newKeywords: string[]) => {
    try {
      setKeywords(newKeywords);
      await userApi.updateKeywords(newKeywords);
    } catch (err) {
      console.error(err);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim().toLowerCase())) {
      const updated = [...keywords, newKeyword.trim().toLowerCase()];
      updateKeywords(updated);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    const updated = keywords.filter((k) => k !== keyword);
    updateKeywords(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Keyword Filters"
        subtitle="Define keywords to filter relevant job postings"
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLogout={onLogout}
        onMenuClick={onMenuClick}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="space-y-8">
            {/* Add Keyword */}
            <div>
              <h3 className="mb-4">Add Keywords</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyword">Keyword</Label>
                    <div className="flex gap-2">
                      <Input
                        id="keyword"
                        type="text"
                        placeholder="e.g., intern, developer, remote"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button onClick={addKeyword}>
                        <Plus className="size-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Jobs will be filtered to include at least one of these keywords in the title or description
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Keywords */}
            <div>
              <h3 className="mb-4">Active Keywords</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                {keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="ml-2 hover:text-destructive transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No keywords added yet. Add keywords to start filtering jobs.
                  </div>
                )}
              </div>
            </div>

            {/* Examples */}
            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <h4 className="mb-3">Suggested Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {['python', 'react', 'machine learning', 'data science', 'full-stack', 'devops'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!keywords.includes(suggestion)) {
                        const updated = [...keywords, suggestion];
                        updateKeywords(updated);
                      }
                    }}
                    disabled={keywords.includes(suggestion)}
                  >
                    <Plus className="size-3 mr-1.5" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="mb-2">How it works</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Keywords are case-insensitive and will match partial words</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Jobs matching any of your keywords will be included in your feed</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>You can add as many keywords as you need to refine your search</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
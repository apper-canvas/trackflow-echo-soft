import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import IssueCard from "@/components/molecules/IssueCard";
import IssueModal from "@/components/molecules/IssueModal";
import Badge from "@/components/atoms/Badge";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import issueService from "@/services/api/issueService";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const query = searchParams.get("q") || "";

  const loadSearchResults = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setIssues([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const results = await issueService.search(searchQuery);
      setIssues(results);
      
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [searchQuery, ...prev.filter(item => item !== searchQuery)];
        return newHistory.slice(0, 5); // Keep only 5 recent searches
      });
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      loadSearchResults(query);
    }
  }, [query]);

  const handleSearch = (searchQuery) => {
    setSearchParams({ q: searchQuery });
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setShowIssueModal(true);
  };

  const handleIssueUpdate = (updatedIssue) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.Id === updatedIssue.Id ? updatedIssue : issue
      )
    );
    setSelectedIssue(updatedIssue);
  };

  const highlightSearchTerm = (text, term) => {
    if (!term || !text) return text;
    
    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  if (error) return <ErrorView error={error} onRetry={() => loadSearchResults(query)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <ApperIcon name="Search" size={32} className="text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Search Issues</h1>
              <p className="text-slate-600 mt-1">
                Find issues by title, description, labels, or assignee
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search issues..."
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Search History */}
        {!query && searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ApperIcon name="History" size={18} />
              Recent Searches
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        {query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Search Results
                </h2>
                {!loading && (
                  <p className="text-slate-600 text-sm mt-1">
                    {issues.length} {issues.length === 1 ? "result" : "results"} found for "{query}"
                  </p>
                )}
              </div>
              
              {query && (
                <Badge variant="primary" className="text-sm">
                  <ApperIcon name="Search" size={14} className="mr-1" />
                  "{query}"
                </Badge>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-600">Searching issues...</p>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {!loading && issues.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map((issue, index) => (
                  <motion.div
                    key={issue.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <IssueCard
                      issue={{
                        ...issue,
                        title: highlightSearchTerm(issue.title, query),
                        description: highlightSearchTerm(issue.description, query)
                      }}
                      onClick={() => handleIssueClick(issue)}
                      className="h-full hover:shadow-lg transition-shadow duration-200"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty Results */}
            {!loading && query && issues.length === 0 && (
              <Empty
                title="No results found"
                description={`No issues match your search for "${query}". Try different keywords or check your spelling.`}
                icon="SearchX"
              />
            )}
          </motion.div>
        )}

        {/* No Query State */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <ApperIcon name="Search" size={64} className="mx-auto text-slate-400 mb-6" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Search for Issues
            </h2>
            <p className="text-slate-600 max-w-md mx-auto mb-8">
              Enter keywords to search through issue titles, descriptions, labels, and assignees.
              Use the search bar above to get started.
            </p>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-md mx-auto">
              <h3 className="font-medium text-slate-900 mb-3">Search Tips:</h3>
              <ul className="text-left text-sm text-slate-600 space-y-2">
                <li>• Search by issue title or description</li>
                <li>• Find issues by assignee name</li>
                <li>• Look for specific labels or tags</li>
                <li>• Use multiple keywords for better results</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      {/* Issue Modal */}
      <IssueModal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        issue={selectedIssue}
        onUpdate={handleIssueUpdate}
        mode={selectedIssue ? "view" : "create"}
      />
    </div>
  );
};

export default SearchResults;
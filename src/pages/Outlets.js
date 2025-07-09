import React, { useState } from "react";
import { outletsAPI } from "../services/api";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ToolMetadata from "../components/Common/ToolMetadata";
import "./Outlets.css";

const Outlets = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await outletsAPI.queryOutlets(query.trim());
      setResult(response);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to query outlets. Please try again."
      );
      console.error("Outlets query error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setQuery("");
    setError(null);
  };

  return (
    <div className="outlets-page">
      <h1 className="page-title">Outlet Finder</h1>
      <p className="page-subtitle">
        Find our outlets by location, area, or specific addresses. Search by
        state, city, mall, or nearby landmarks!
      </p>

      <div className="outlets-container">
        <div className="search-section">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group">
              <label htmlFor="outlet-query" className="form-label">
                Where are you looking for outlets?
              </label>
              <textarea
                id="outlet-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., Show me outlets in Selangor, Find outlets in shopping malls, Outlets near KLCC, Show all outlets in Kuala Lumpur"
                className="form-textarea"
                rows={4}
                disabled={isLoading}
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn"
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? "Searching..." : "Find Outlets"}
              </button>
              {result && (
                <button
                  type="button"
                  onClick={clearResults}
                  className="btn btn-secondary"
                >
                  Clear Results
                </button>
              )}
            </div>
          </form>

          {/* Quick suggestions */}
          <div className="suggestions-section">
            <h3>Quick Suggestions:</h3>
            <div className="suggestions-grid">
              <button
                className="suggestion-card"
                onClick={() => setQuery("Show me outlets in shopping malls")}
                disabled={isLoading}
              >
                🏢 Outlets in Malls
              </button>
              <button
                className="suggestion-card"
                onClick={() => setQuery("Find outlets in Selangor")}
                disabled={isLoading}
              >
                �️ Selangor Outlets
              </button>
              <button
                className="suggestion-card"
                onClick={() => setQuery("Show outlets in Kuala Lumpur")}
                disabled={isLoading}
              >
                🏙️ KL Outlets
              </button>
              <button
                className="suggestion-card"
                onClick={() => setQuery("Find outlets near KLCC")}
                disabled={isLoading}
              >
                📍 Near KLCC
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {isLoading && (
          <div className="loading-section">
            <LoadingSpinner size="large" text="Searching for outlets..." />
          </div>
        )}

        {result && (
          <div className="results-section">
            <div className="result-card">
              <h2>🏪 Outlet Search Results</h2>
              <div className="result-content">
                <div className="query-echo">
                  <strong>Your Query:</strong> {result.query}
                </div>

                {result.summary && (
                  <div className="ai-summary">
                    <h3>Summary:</h3>
                    <p>{result.summary}</p>
                  </div>
                )}

                <div className="ai-response">
                  <h3>Results:</h3>
                  <div className="response-content">{result.response}</div>
                </div>

                {result.retrieved_outlets &&
                  result.retrieved_outlets.length > 0 && (
                    <div className="retrieved-outlets">
                      <h3>Found Outlets:</h3>
                      <div className="outlets-list">
                        {result.retrieved_outlets.map((outlet, index) => (
                          <div key={index} className="outlet-item">
                            <div className="outlet-header">
                              <span className="outlet-id">ID: {outlet.id}</span>
                              <span className="similarity-score">
                                Match:{" "}
                                {(outlet.similarity_score * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="outlet-content">
                              {outlet.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {result.tool_calls && result.tool_calls.length > 0 && (
                  <ToolMetadata toolCalls={result.tool_calls} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Outlets;

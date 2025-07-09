import React, { useState } from "react";
import { productsAPI } from "../services/api";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ToolMetadata from "../components/Common/ToolMetadata";
import "./Products.css";

const Products = () => {
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
      const response = await productsAPI.searchProducts(query.trim());
      setResult(response);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to search products. Please try again."
      );
      console.error("Products search error:", err);
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
    <div className="products-page">
      <h1 className="page-title">Drinkware Collection</h1>
      <p className="page-subtitle">
        Discover our premium drinkware collection including mugs, tumblers,
        reusable straws, and more eco-friendly drinking solutions!
      </p>

      <div className="products-container">
        <div className="search-section">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group">
              <label htmlFor="product-query" className="form-label">
                What drinkware products are you looking for?
              </label>
              <textarea
                id="product-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., Show me your thermal mugs, What tumblers do you have for travel? Tell me about your reusable straw options. What's the most popular drinkware?"
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
                {isLoading ? "Searching..." : "Search Drinkware"}
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
                onClick={() =>
                  setQuery("Show me your thermal mugs and insulated options")
                }
                disabled={isLoading}
              >
                Thermal Mugs
              </button>
              <button
                className="suggestion-card"
                onClick={() =>
                  setQuery(
                    "What tumblers do you have for travel and commuting?"
                  )
                }
                disabled={isLoading}
              >
                Travel Tumblers
              </button>
              <button
                className="suggestion-card"
                onClick={() =>
                  setQuery("Tell me about your reusable straw collection")
                }
                disabled={isLoading}
              >
                Reusable Straws
              </button>
              <button
                className="suggestion-card"
                onClick={() =>
                  setQuery("What's the most popular drinkware you sell?")
                }
                disabled={isLoading}
              >
                Popular Items
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {isLoading && (
          <div className="loading-section">
            <LoadingSpinner
              size="large"
              text="Searching our drinkware collection..."
            />
          </div>
        )}

        {result && (
          <div className="results-section">
            <div className="result-card">
              <h2>Drinkware Recommendations</h2>
              <div className="result-content">
                <div className="query-echo">
                  <strong>Your Query:</strong> {result.query}
                </div>
                <div className="ai-summary">
                  <h3>Summary:</h3>
                  <p>{result.summary}</p>
                </div>

                {result.retrieved_products &&
                  result.retrieved_products.length > 0 && (
                    <div className="retrieved-products">
                      <h3>Recommended Drinkware:</h3>
                      <div className="products-list">
                        {result.retrieved_products.map((product, index) => (
                          <div key={index} className="product-item">
                            <div className="product-header">
                              <span className="product-id">
                                ID: {product.id}
                              </span>
                              <span className="similarity-score">
                                Match:{" "}
                                {(product.similarity_score * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="product-content">
                              {typeof product.content === "string" ? (
                                <p>{product.content}</p>
                              ) : (
                                <div className="product-details">
                                  <h4>{product.content.name}</h4>
                                  <p className="product-description">
                                    {product.content.description}
                                  </p>
                                  <div className="product-pricing">
                                    {product.content.sale_price && (
                                      <span className="sale-price">
                                        ${product.content.sale_price}
                                      </span>
                                    )}
                                    {product.content.original_price && (
                                      <span
                                        className={
                                          product.content.sale_price
                                            ? "original-price discounted"
                                            : "original-price"
                                        }
                                      >
                                        ${product.content.original_price}
                                      </span>
                                    )}
                                  </div>
                                  {product.content.category && (
                                    <p className="product-category">
                                      Category: {product.content.category}
                                    </p>
                                  )}
                                  {product.content.available_colors &&
                                    product.content.available_colors.length >
                                      0 && (
                                      <p className="product-colors">
                                        Colors:{" "}
                                        {product.content.available_colors.join(
                                          ", "
                                        )}
                                      </p>
                                    )}
                                  {product.content.product_details && (
                                    <div className="product-specs">
                                      <h5>Details:</h5>
                                      <p>{product.content.product_details}</p>
                                    </div>
                                  )}
                                  {product.content.product_warning && (
                                    <div className="product-warning">
                                      <strong>Warning:</strong>{" "}
                                      {product.content.product_warning}
                                    </div>
                                  )}
                                </div>
                              )}
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

export default Products;

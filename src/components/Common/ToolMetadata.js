import React from "react";
import "./ToolMetadata.css";

const ToolMetadata = ({ toolCalls }) => {
  if (!toolCalls || toolCalls.length === 0) {
    return null;
  }

  return (
    <div className="tool-metadata">
      <h4 className="tool-metadata-title">🔧 Tool Usage Details</h4>
      <div className="tool-calls">
        {toolCalls.map((toolCall, index) => (
          <div key={index} className="tool-call">
            <div className="tool-call-header">
              <span className="tool-name">
                {toolCall.tool_name || "Unknown Tool"}
              </span>
              <span className="tool-timestamp">
                {new Date().toLocaleTimeString()}
              </span>
            </div>

            {/* Tool Arguments (tool_args) */}
            {toolCall.tool_args && toolCall.tool_args.length > 0 && (
              <div className="tool-section">
                <h5>Tool Arguments:</h5>
                <pre className="tool-data">
                  {JSON.stringify(toolCall.tool_args, null, 2)}
                </pre>
              </div>
            )}

            {/* Tool Keyword Arguments (tool_kwargs) */}
            {toolCall.tool_kwargs &&
              Object.keys(toolCall.tool_kwargs).length > 0 && (
                <div className="tool-section">
                  <h5>Tool Parameters:</h5>
                  <pre className="tool-data">
                    {JSON.stringify(toolCall.tool_kwargs, null, 2)}
                  </pre>
                </div>
              )}

            {/* Generated SQL (for database query tools) */}
            {toolCall.generated_sql && (
              <div className="tool-section">
                <h5>Generated SQL:</h5>
                <pre className="tool-data sql-code">
                  {toolCall.generated_sql}
                </pre>
              </div>
            )}

            {/* Legacy arguments field for backward compatibility */}
            {toolCall.arguments && (
              <div className="tool-section">
                <h5>Arguments:</h5>
                <pre className="tool-data">
                  {JSON.stringify(toolCall.arguments, null, 2)}
                </pre>
              </div>
            )}

            {/* Tool Result */}
            {toolCall.result && (
              <div className="tool-section">
                <h5>Result:</h5>
                <div className="tool-result">
                  {typeof toolCall.result === "string" ? (
                    <div className="result-text">
                      {toolCall.result.startsWith("[") ||
                      toolCall.result.startsWith("{") ? (
                        <pre className="tool-data">{toolCall.result}</pre>
                      ) : (
                        <p>{toolCall.result}</p>
                      )}
                    </div>
                  ) : Array.isArray(toolCall.result) ? (
                    <div>
                      <p>Found {toolCall.result.length} items:</p>
                      <ul className="result-list">
                        {toolCall.result.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="result-item">
                            {typeof item === "object"
                              ? JSON.stringify(item)
                              : String(item)}
                          </li>
                        ))}
                        {toolCall.result.length > 3 && (
                          <li className="result-more">
                            ... and {toolCall.result.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <pre className="tool-data">
                      {JSON.stringify(toolCall.result, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolMetadata;

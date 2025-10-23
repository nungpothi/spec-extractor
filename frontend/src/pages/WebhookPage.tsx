import React, { useState, useEffect } from 'react';
import { Navbar } from '../components';
import { useAuthStore } from '../stores';
import { webhookService } from '../services';
import { WebhookItem, WebhookLog } from '../types';

export const WebhookPage: React.FC = () => {
  const { user } = useAuthStore();
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWebhookId, setCurrentWebhookId] = useState<string>('');
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [customResponse, setCustomResponse] = useState<string>('');
  const [isSavingResponse, setIsSavingResponse] = useState(false);
  const [showJsonPopup, setShowJsonPopup] = useState(false);
  const [jsonPopupContent, setJsonPopupContent] = useState<{ headers?: any; body?: any }>({});

  const generateWebhook = async () => {
    try {
      setIsLoading(true);
      let responseTemplate: object | undefined;

      // Parse custom response if provided
      if (customResponse.trim()) {
        try {
          responseTemplate = JSON.parse(customResponse);
        } catch (error) {
          alert('Invalid JSON format in custom response. Please check your JSON syntax.');
          return;
        }
      }

      const response = await webhookService.generateWebhook(responseTemplate);
      if (response.status) {
        const result = response.results[0];
        setWebhookUrl(result.url);
        setCurrentWebhookId(result.uuid);
        setWebhookLogs([]); // Clear previous logs
        // Refresh list to include the new webhook
        loadUserWebhooks();
      }
    } catch (error) {
      console.error('Failed to generate webhook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCustomResponse = async () => {
    if (!currentWebhookId) {
      alert('Please select a webhook first');
      return;
    }

    if (!customResponse.trim()) {
      alert('Please enter a custom response');
      return;
    }

    try {
      setIsSavingResponse(true);
      const responseTemplate = JSON.parse(customResponse);
      const response = await webhookService.updateWebhookResponse(currentWebhookId, responseTemplate);
      
      if (response.status) {
        alert('Custom response saved successfully!');
        // Refresh the webhook list to show updated response
        loadUserWebhooks();
      }
    } catch (error: any) {
      if (error.name === 'SyntaxError') {
        alert('Invalid JSON format. Please check your JSON syntax.');
      } else {
        console.error('Failed to save custom response:', error);
        alert('Failed to save custom response. Please try again.');
      }
    } finally {
      setIsSavingResponse(false);
    }
  };

  const deleteWebhookLog = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this webhook log? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await webhookService.deleteWebhookLog(logId);
      if (response.status) {
        // Refresh logs after successful deletion
        loadWebhookLogs();
      }
    } catch (error) {
      console.error('Failed to delete webhook log:', error);
      alert('Failed to delete webhook log. Please try again.');
    }
  };

  const showJsonPreview = (headers: any, body: any) => {
    setJsonPopupContent({ headers, body });
    setShowJsonPopup(true);
  };

  const closeJsonPopup = () => {
    setShowJsonPopup(false);
    setJsonPopupContent({});
  };

  const loadWebhookLogs = async () => {
    if (!currentWebhookId) return;

    try {
      const response = await webhookService.getWebhookLogs(currentWebhookId);
      if (response.status) {
        setWebhookLogs(response.results);
      }
    } catch (error) {
      console.error('Failed to load webhook logs:', error);
    }
  };

  const loadUserWebhooks = async () => {
    try {
      setIsLoadingList(true);
      const response = await webhookService.getUserWebhooks();
      if (response.status) {
        setWebhooks(response.results);
      }
    } catch (error) {
      console.error('Failed to load user webhooks:', error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatJson = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  useEffect(() => {
    if (currentWebhookId) {
      loadWebhookLogs();
    }
  }, [currentWebhookId]);

  useEffect(() => {
    // Load user's existing webhooks when page mounts or user changes
    if (user?.id) {
      loadUserWebhooks();
    }
  }, [user?.id]);

  // Add ESC key listener for popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showJsonPopup) {
        closeJsonPopup();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showJsonPopup]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 p-6 space-y-6">
      <Navbar className="mb-8" />

      <main className="max-w-5xl mx-auto space-y-6">
        <section id="webhook-generator" className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Webhook Endpoint</h2>
          <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-white/70">
            <input
              type="text"
              id="webhook-url"
              readOnly
              className="flex-1 bg-transparent text-slate-800 font-mono text-sm select-all outline-none"
              value={webhookUrl || 'Click Generate to create your webhook URL'}
              onClick={() => webhookUrl && copyToClipboard(webhookUrl)}
            />
            <button
              id="btn-generate-webhook"
              onClick={generateWebhook}
              disabled={isLoading}
              className="ml-3 bg-sky-300 hover:bg-sky-400 disabled:bg-slate-300 text-white px-4 py-1 rounded shadow transition-colors"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-2">
            Use this unique URL to send test POST requests and inspect payloads. Click the URL to copy.
          </p>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Custom Response</h3>
            <textarea
              id="webhook-response"
              className="w-full h-40 p-3 border border-slate-200 rounded-lg bg-white/70 font-mono text-slate-700 placeholder-slate-400"
              placeholder="Enter JSON response to return when this webhook is called"
              value={customResponse}
              onChange={(e) => setCustomResponse(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <button
                id="btn-save-response"
                onClick={saveCustomResponse}
                disabled={isSavingResponse || !currentWebhookId}
                className="bg-emerald-300 hover:bg-emerald-400 disabled:bg-slate-300 text-slate-700 px-6 py-2 rounded shadow transition-colors"
              >
                {isSavingResponse ? 'Saving...' : 'Save Response'}
              </button>
            </div>
          </div>
        </section>

        <section id="webhook-existing" className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">My Webhooks</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2">Webhook URL</th>
                  <th className="border p-2">Custom Response</th>
                  <th className="border p-2">Created At</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody id="webhook-existing-body">
                {isLoadingList ? (
                  <tr>
                    <td className="border p-2 text-center text-slate-500" colSpan={5}>Loading...</td>
                  </tr>
                ) : webhooks.length === 0 ? (
                  <tr>
                    <td className="border p-2 text-center text-slate-500" colSpan={5}>No webhooks yet. Generate one to get started.</td>
                  </tr>
                ) : (
                  webhooks.map((wh, index) => (
                    <tr key={wh.id} className="hover:bg-slate-50">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2 font-mono text-xs break-all">
                        <button
                          className="text-left w-full hover:underline text-sky-700"
                          title="Copy URL"
                          onClick={() => copyToClipboard(wh.url)}
                        >
                          {wh.url}
                        </button>
                      </td>
                      <td className="border p-2 max-w-xs">
                        <div className="overflow-hidden">
                          {wh.response_template ? (
                            <pre className="text-xs whitespace-pre-wrap break-all">
                              {formatJson(wh.response_template).substring(0, 100)}
                              {formatJson(wh.response_template).length > 100 && '...'}
                            </pre>
                          ) : (
                            <span className="text-slate-400 text-xs">Default response</span>
                          )}
                        </div>
                      </td>
                      <td className="border p-2">{new Date(wh.created_at).toLocaleString()}</td>
                      <td className="border p-2">
                        <div className="flex space-x-1">
                          <button
                            className="bg-sky-300 hover:bg-sky-400 text-white px-3 py-1 rounded shadow text-xs"
                            onClick={() => {
                              setCurrentWebhookId(wh.uuid_key);
                              setWebhookUrl(wh.url);
                              setWebhookLogs([]);
                              // Load existing response template into textarea
                              setCustomResponse(wh.response_template ? formatJson(wh.response_template) : '');
                              // Load logs after selecting
                              setTimeout(() => loadWebhookLogs(), 0);
                            }}
                          >
                            View Logs
                          </button>
                          {wh.response_template && (
                            <button
                              onClick={() => copyToClipboard(formatJson(wh.response_template))}
                              className="text-xs bg-emerald-200 hover:bg-emerald-300 text-emerald-800 px-2 py-1 rounded"
                              title="Copy Custom Response"
                            >
                              CR
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="webhook-log" className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-slate-700">Received Payloads</h2>
            {currentWebhookId && (
              <button
                onClick={loadWebhookLogs}
                className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded transition-colors"
              >
                Refresh
              </button>
            )}
          </div>

          {webhookLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {currentWebhookId ? 'No requests received yet. Send a POST request to your webhook URL.' : 'Generate a webhook URL to start receiving requests.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="border border-slate-200 p-2">#</th>
                    <th className="border border-slate-200 p-2">Timestamp</th>
                    <th className="border border-slate-200 p-2">Method</th>
                    <th className="border border-slate-200 p-2">Preview</th>
                    <th className="border border-slate-200 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody id="webhook-table-body">
                  {webhookLogs.map((log, index) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="border border-slate-200 p-2">{index + 1}</td>
                      <td className="border border-slate-200 p-2">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="border border-slate-200 p-2">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          log.method === 'POST' ? 'bg-green-100 text-green-800' :
                          log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="border border-slate-200 p-2 max-w-xs">
                        <div className="overflow-hidden">
                          <div className="text-xs text-slate-600 mb-1">
                            <strong>Headers:</strong> {Object.keys(log.headers || {}).length} keys
                          </div>
                          <div className="text-xs text-slate-600">
                            <strong>Body:</strong> {formatJson(log.body).substring(0, 50)}
                            {formatJson(log.body).length > 50 && '...'}
                          </div>
                        </div>
                      </td>
                      <td className="border border-slate-200 p-2">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => showJsonPreview(log.headers, log.body)}
                            className="text-xs bg-blue-200 hover:bg-blue-300 text-blue-800 px-2 py-1 rounded"
                            title="Preview JSON"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => copyToClipboard(formatJson(log.headers))}
                            className="text-xs bg-green-200 hover:bg-green-300 text-green-800 px-2 py-1 rounded"
                            title="Copy Headers"
                          >
                            H
                          </button>
                          <button
                            onClick={() => copyToClipboard(formatJson(log.body))}
                            className="text-xs bg-purple-200 hover:bg-purple-300 text-purple-800 px-2 py-1 rounded"
                            title="Copy Body"
                          >
                            B
                          </button>
                          <button
                            onClick={() => deleteWebhookLog(log.id)}
                            className="text-xs bg-red-200 hover:bg-red-300 text-red-800 px-2 py-1 rounded"
                            title="Delete Log"
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* JSON Preview Popup */}
      {showJsonPopup && (
        <div 
          id="json-popup" 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={closeJsonPopup}
        >
          <div 
            className="bg-white p-6 rounded-2xl shadow-lg w-3/4 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-700 mb-3">JSON Preview</h3>
            
            {jsonPopupContent.headers && (
              <div className="mb-4">
                <h4 className="text-lg font-medium text-slate-600 mb-2">Headers:</h4>
                <pre 
                  id="json-preview-headers" 
                  className="text-sm bg-gray-50 border border-slate-200 p-3 rounded overflow-auto max-h-40"
                >
                  {formatJson(jsonPopupContent.headers)}
                </pre>
              </div>
            )}
            
            {jsonPopupContent.body && (
              <div className="mb-4">
                <h4 className="text-lg font-medium text-slate-600 mb-2">Body:</h4>
                <pre 
                  id="json-preview-body" 
                  className="text-sm bg-gray-50 border border-slate-200 p-3 rounded overflow-auto max-h-60"
                >
                  {formatJson(jsonPopupContent.body)}
                </pre>
              </div>
            )}
            
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => copyToClipboard(formatJson(jsonPopupContent))}
                className="bg-emerald-300 hover:bg-emerald-400 text-slate-700 px-4 py-2 rounded"
              >
                Copy All
              </button>
              <button 
                id="btn-close-popup"
                onClick={closeJsonPopup}
                className="bg-sky-300 hover:bg-sky-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

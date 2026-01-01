import React, { useState } from 'react';
import { RepoProvider, useRepo } from './contexts/RepoContext';
import { ExplanationProvider } from './contexts/ExplanationContext';
import FileTree from './components/FileTree';
import ExplanationDisplay from './components/ExplanationDisplay';

const AppContent: React.FC = () => {
  const { repo, loading, error, fetchRepo, resetRepo } = useRepo();
  const [repoUrl, setRepoUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      fetchRepo(repoUrl);
    }
  };

  const handleGoHome = () => {
    resetRepo();
    setRepoUrl('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-github-dark-bg flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="text-center glass-panel p-10 rounded-2xl shadow-2xl max-w-md border border-gray-700 relative z-10">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-github-dark-bg p-4 rounded-xl border border-github-dark-border">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Cloning Repository...</h3>
          <p className="text-gray-400 text-sm">Extracting knowledge from the mothership</p>

          <div className="mt-8 flex justify-center gap-2">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-github-dark-bg flex flex-col relative overflow-hidden font-sans">
      {/* Dynamic Background Elements - visible only on home/landing */}
      {!repo && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] bg-purple-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
          <div className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-blue-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[600px] h-[600px] bg-indigo-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      )}

      {/* Header */}
      <header className={`border-b border-github-dark-border sticky top-0 z-50 transition-all duration-300 ${!repo ? 'bg-transparent border-transparent pt-6' : 'glass-panel bg-opacity-80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={handleGoHome}
              className="group flex items-center space-x-3 hover:opacity-80 transition-all"
            >
              <div className="text-2xl bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent transform group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Explain<span className="text-blue-400">Hub</span>
              </h1>
            </button>
            <div className="flex items-center space-x-4">
              {!apiKey ? (
                <div className="flex items-center px-4 py-2 rounded-full glass-input text-amber-300 border-amber-500/30 text-xs font-medium backdrop-blur-md">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                  API Key Required
                </div>
              ) : (
                <div className="flex items-center px-4 py-2 rounded-full glass-input text-emerald-300 border-emerald-500/30 text-xs font-medium backdrop-blur-md">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  Ready
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        {!repo ? (
          // Welcome/URL input screen
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl animate-fade-in">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-2 px-4 mb-6 rounded-full glass-input border-blue-500/30 text-blue-300 text-xs font-medium tracking-wide uppercase">
                  AI-Powered Code Analysis
                </div>
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                  Understand any codebase <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
                    in seconds.
                  </span>
                </h2>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Drop a GitHub link and get instant explanations, architectural diagrams, and deep insights. No more README fatigue.
                </p>
              </div>

              <div className="glass-panel p-2 rounded-2xl shadow-2xl backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="space-y-2">
                  {/* Gemini API Key Input */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-lg">🔑</span>
                    </div>
                    <input
                      type="password"
                      placeholder="Enter Gemini API Key (keep it safe)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-github-dark-bg/50 border border-transparent rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-github-dark-bg focus:border-blue-500/50 transition-all duration-300 font-mono text-sm"
                      required
                    />
                  </div>

                  {/* Repository URL Input */}
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="github.com/username/repository"
                        className="w-full pl-12 pr-4 py-4 bg-github-dark-bg/50 border border-transparent rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:bg-github-dark-bg focus:border-blue-500/50 transition-all duration-300"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!repoUrl || !apiKey}
                      className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${!repoUrl || !apiKey
                        ? 'bg-gray-800 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25 transform hover:-translate-y-0.5'
                        }`}
                    >
                      <span>Analyze Code</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  Need an API Key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline transition-colors">Get one for free</a>
                </p>
              </div>

              {error && (
                <div className="mt-8 animate-slide-up">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200">
                    <span className="text-xl">⚠️</span>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Main app view with sidebar and content
          <ExplanationProvider apiKey={apiKey} repoName={`${repo.owner}/${repo.name}`}>
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Sidebar - File Tree */}
              <div className="w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-800 bg-[#0d1117]">
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mr-3 border border-blue-500/20">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-bold text-gray-200 truncate">
                        {repo.owner}/{repo.name}
                      </h2>
                      <p className="text-xs text-gray-500 font-mono">master • {repo.default_branch || 'main'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                  <FileTree />
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117] relative">
                {/* Decorative background for inner page */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full filter blur-[100px] pointer-events-none"></div>

                {/* Explanation Display */}
                <div className="flex-1 overflow-auto relative z-10 scrollbar-thin scrollbar-thumb-gray-800">
                  <ExplanationDisplay apiKey={apiKey} />
                </div>
              </div>
            </div>
          </ExplanationProvider>
        )}
      </main>

      <footer className="border-t border-gray-800/50 py-6 text-center relative z-10">
        <p className="text-xs text-gray-600 font-mono">
          ExplainHub • Built with <span className="text-red-500/50">♥</span> by Shaheer
        </p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <RepoProvider>
      <AppContent />
    </RepoProvider>
  );
};

export default App;
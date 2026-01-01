import React, { useState, useEffect } from 'react';
import { GitHubFile } from '../services/githubApi';
import { useRepo } from '../contexts/RepoContext';

interface FileTreeItemProps {
  file: GitHubFile;
  level: number;
  expandedDirs: Set<string>;
  loadingDirs: Set<string>;
  dirContents: Record<string, GitHubFile[]>;
  onToggle: (file: GitHubFile) => void;
  onFileClick: (file: GitHubFile) => void;
  selectedFile: GitHubFile | null;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  file,
  level,
  expandedDirs,
  loadingDirs,
  dirContents,
  onToggle,
  onFileClick,
  selectedFile,
}) => {
  const isExpanded = expandedDirs.has(file.path);
  const isLoading = loadingDirs.has(file.path);
  const isSelected = selectedFile?.path === file.path;

  const getIcon = (file: GitHubFile) => {
    if (file.type === 'dir') {
      if (isLoading) return '⏳';
      return isExpanded ? '📂' : '📁';
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return '📄';
      case 'ts':
      case 'tsx':
        return '📝';
      case 'py':
        return '🐍';
      case 'json':
        return '⚙️';
      case 'md':
        return '📚';
      case 'css':
      case 'scss':
      case 'sass':
        return '🎨';
      case 'html':
        return '🌐';
      case 'svg':
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return '🖼️';
      default:
        return '📄';
    }
  };

  const handleClick = () => {
    if (file.type === 'dir') {
      onToggle(file);
    } else {
      onFileClick(file);
    }
  };

  const children = dirContents[file.path] || [];

  return (
    <div>
      <div
        className={`flex items-center py-2 px-3 mx-2 my-0.5 rounded-lg cursor-pointer transition-all duration-200 relative group border border-transparent ${isSelected
            ? 'bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
            : 'hover:bg-gray-800/50 hover:border-gray-700/50 text-gray-400 hover:text-gray-200'
          }`}
        onClick={handleClick}
        style={{ paddingLeft: `${(level * 16) + 12}px` }}
      >
        <span className={`mr-2.5 text-base flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${file.type !== 'dir' ? 'group-hover:scale-110' : ''}`}>
          {getIcon(file)}
        </span>
        <span className={`text-sm truncate flex-1 font-medium ${isSelected ? 'text-blue-400' : ''}`}>
          {file.name}
        </span>
        {isLoading && (
          <div className="ml-auto flex items-center space-x-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}

        {/* Active Indicator Dot */}
        {isSelected && (
          <div className="absolute left-1.5 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
        )}
      </div>

      {file.type === 'dir' && isExpanded && children.length > 0 && (
        <div className="relative">
          {/* Vertical line for hierarchy */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px bg-gray-800/50"
            style={{ left: `${(level * 16) + 19}px` }}
          ></div>
          {children.map((child) => (
            <FileTreeItem
              key={child.path}
              file={child}
              level={level + 1}
              expandedDirs={expandedDirs}
              loadingDirs={loadingDirs}
              dirContents={dirContents}
              onToggle={onToggle}
              onFileClick={onFileClick}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}

      {file.type === 'dir' && isExpanded && children.length === 0 && !isLoading && (
        <div
          className="text-xs text-gray-600 italic py-2 flex items-center"
          style={{ paddingLeft: `${(level + 1) * 16 + 12}px` }}
        >
          <span className="mr-1 opacity-50">∅</span>
          Empty folder
        </div>
      )}
    </div>
  );
};

const FileTree: React.FC = () => {
  const { repo, selectedFile, fetchDirectoryContents, fetchFileContent } = useRepo();
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [loadingDirs, setLoadingDirs] = useState<Set<string>>(new Set());
  const [dirContents, setDirContents] = useState<Record<string, GitHubFile[]>>({});

  useEffect(() => {
    if (repo) {
      setDirContents({ '': repo.files });
    }
  }, [repo]);

  const toggleDir = async (dir: GitHubFile) => {
    console.log('Toggle directory:', dir.path, 'Currently expanded:', expandedDirs.has(dir.path));

    if (expandedDirs.has(dir.path)) {
      setExpandedDirs(prev => {
        const newSet = new Set(prev);
        newSet.delete(dir.path);
        console.log('Collapsed directory:', dir.path);
        return newSet;
      });
    } else {
      setLoadingDirs(prev => new Set(prev).add(dir.path));
      console.log('Fetching contents for:', dir.path);

      try {
        const contents = await fetchDirectoryContents(dir);
        console.log('Fetched contents:', contents.length, 'items for', dir.path);
        setDirContents(prev => ({ ...prev, [dir.path]: contents }));
        setExpandedDirs(prev => new Set(prev).add(dir.path));
        console.log('Expanded directory:', dir.path);
      } catch (error) {
        console.error(`Error loading directory ${dir.path}:`, error);
      } finally {
        setLoadingDirs(prev => {
          const newSet = new Set(prev);
          newSet.delete(dir.path);
          return newSet;
        });
      }
    }
  };

  const rootFiles = repo?.files || [];

  if (!repo) {
    return null;
  }

  return (
    <div className="select-none">
      {rootFiles.map((file) => (
        <FileTreeItem
          key={file.path}
          file={file}
          level={0}
          expandedDirs={expandedDirs}
          loadingDirs={loadingDirs}
          dirContents={dirContents}
          onToggle={toggleDir}
          onFileClick={fetchFileContent}
          selectedFile={selectedFile}
        />
      ))}
    </div>
  );
};

export default FileTree;
import React from 'react';
import { Search, ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export default function PageHeader({ title, onBack, searchPlaceholder, onSearch }: PageHeaderProps) {
  return (
    <div className="topbar">
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '12px', color: 'white', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={20} />
        </button>
      )}
      <h1>{title}</h1>
      {searchPlaceholder && (
        <div className="search-bar">
          <Search size={16} color="rgba(255,255,255,0.5)" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onKeyDown={(e) => e.key === 'Enter' && onSearch?.((e.target as HTMLInputElement).value)}
          />
        </div>
      )}
    </div>
  );
}

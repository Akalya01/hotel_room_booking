import React from 'react';

interface PanelProps {
  title?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function Panel({ title, children, style, className }: PanelProps) {
  return (
    <div className={`panel ${className || ''}`} style={style}>
      {title && <div className="panel-header">{title}</div>}
      <div className="panel-content">{children}</div>
    </div>
  );
}

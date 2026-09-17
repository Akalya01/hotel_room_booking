import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string | null;
  hint?: string | null;
  style?: React.CSSProperties;
}

export default function FormField({ label, required, children, error, hint, style }: FormFieldProps) {
  return (
    <div style={style}>
      <label className="form-label">
        {label}{required && <span style={{ color: 'var(--error)', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
      {error && <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '4px' }}>{error}</div>}
      {hint && !error && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>{hint}</div>}
    </div>
  );
}

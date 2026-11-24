import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case 'available':
      case 'operational':
      case 'optimal':
      case 'completed':
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
      case 'in use':
      case 'in progress':
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10';
      case 'at risk':
      case 'degraded':
      case 'warning':
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10';
      case 'critical':
      case 'offline':
      case 'under maintenance':
      case 'critical emergency':
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ring-1 capitalize ${getStyles(
        status
      )} ${sizeClasses[size]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status.toLowerCase() === 'critical' || status.toLowerCase() === 'at risk'
            ? 'animate-ping'
            : ''
        } ${
          status.toLowerCase() === 'available' || status.toLowerCase() === 'operational'
            ? 'bg-emerald-500'
            : status.toLowerCase() === 'at risk' || status.toLowerCase() === 'warning'
            ? 'bg-amber-500'
            : status.toLowerCase() === 'critical' || status.toLowerCase() === 'under maintenance'
            ? 'bg-rose-500'
            : 'bg-blue-500'
        }`}
      />
      {status.replace(/_/g, ' ')}
    </span>
  );
};

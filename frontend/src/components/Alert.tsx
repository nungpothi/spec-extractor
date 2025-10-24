import React from 'react';
import { AlertCircle, CheckCircle, X, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgClass: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
          textClass: 'text-emerald-800 dark:text-emerald-200',
          iconClass: 'text-emerald-400 dark:text-emerald-300',
          icon: CheckCircle,
        };
      case 'error':
        return {
          bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          textClass: 'text-red-800 dark:text-red-200',
          iconClass: 'text-red-400 dark:text-red-300',
          icon: AlertCircle,
        };
      case 'warning':
        return {
          bgClass: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
          textClass: 'text-amber-800 dark:text-amber-200',
          iconClass: 'text-amber-400 dark:text-amber-300',
          icon: AlertTriangle,
        };
      default:
        return {
          bgClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          textClass: 'text-blue-800 dark:text-blue-200',
          iconClass: 'text-blue-400 dark:text-blue-300',
          icon: Info,
        };
    }
  };

  const { bgClass, textClass, iconClass, icon: Icon } = getAlertConfig();

  return (
    <div className={`border rounded-xl p-4 mb-6 ${bgClass} backdrop-blur-sm shadow-sm animate-slide-up`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textClass}`}>{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${textClass} hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
                aria-label="Close alert"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
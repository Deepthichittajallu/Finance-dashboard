import React, { useState, useEffect, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Bell, Search, ShieldAlert, User, Moon, Sun, X, Check, CheckCheck } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const Header = () => {
  const { role, setRole, notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useFinance();
  // Default to light mode (false) if no class found
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Check initial dark mode from document
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
  };

  return (
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 transition-colors">
      <div className="flex items-center bg-surface2/50 rounded-full px-4 py-2 border border-border/50 max-w-md w-full transition-colors font-sans">
        <Search size={18} className="text-textMuted mr-2" />
        <input 
          type="text" 
          placeholder="Search everywhere..." 
          className="bg-transparent border-none outline-none text-sm text-text w-full placeholder:text-textMuted font-sans"
        />
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="text-textMuted hover:text-text transition-colors p-2 rounded-full hover:bg-surface2"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-textMuted hover:text-text transition-colors p-2 rounded-full hover:bg-surface2"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-danger rounded-full border border-background flex items-center justify-center">
                <span className="text-xs text-white font-bold leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 bg-surface2 border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      <CheckCheck size={14} />
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-textMuted">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-border/50 hover:bg-surface cursor-pointer transition-colors",
                        !notification.read && "bg-primary/5"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              notification.type === 'danger' && "bg-danger",
                              notification.type === 'warning' && "bg-warning",
                              notification.type === 'success' && "bg-success",
                              notification.type === 'info' && "bg-primary"
                            )} />
                            <h4 className={cn(
                              "text-sm font-medium",
                              !notification.read ? "text-text" : "text-textMuted"
                            )}>
                              {notification.title}
                            </h4>
                          </div>
                          <p className="text-sm text-textMuted mb-2">
                            {notification.message}
                          </p>
                          <span className="text-xs text-textMuted">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-textMuted hover:text-danger p-1 rounded transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-border pl-6">
          <span className="text-sm text-textMuted font-medium flex items-center gap-2">
            Viewing as <strong className={cn("font-semibold", role === 'Admin' ? "text-danger" : "text-primary")}>{role}</strong>
          </span>
          <button 
            onClick={() => setRole(role === 'Viewer' ? 'Admin' : 'Viewer')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all border flex items-center gap-1.5",
              role === 'Admin' 
                ? "bg-danger/10 border-danger/20 text-danger hover:bg-danger/20" 
                : "bg-surface2 border-border text-text hover:bg-border"
            )}
          >
            {role === 'Admin' ? <ShieldAlert size={14} /> : <User size={14} />}
            Switch
          </button>
        </div>
      </div>
    </header>
  );
};

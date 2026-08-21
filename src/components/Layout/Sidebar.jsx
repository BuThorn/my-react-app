import React, { useState } from 'react';
import { LogoutButton } from '../LogoutButton';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Settings,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import profileImage from '../../assets/img.jpg';

const defaultMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: Building2,
    count: 24,
    submenu: [
      { id: 'all-clients', label: 'All Clients' },
      { id: 'active-clients', label: 'Active Clients' },
      { id: 'add-client', label: 'Add Client' },
      { id: 'client-groups', label: 'Client Groups' },
    ],
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: UserPlus,
    badge: 32,
    submenu: [
      { id: 'all-leads', label: 'All Leads' },
      { id: 'new-leads', label: 'New Leads' },
      { id: 'qualified-leads', label: 'Qualified Leads' },
      { id: 'lead-sources', label: 'Lead Sources' },
      { id: 'lead-conversion', label: 'Lead Conversion' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    active: false,
    submenu: [
      { id: 'reports-overview', label: 'Reports Overview' },
      { id: 'sales-reports', label: 'Sales Reports' },
      { id: 'client-reports', label: 'Client Reports' },
      { id: 'export-reports', label: 'Export Reports' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    submenu: [
      { id: 'overview', label: 'Overview' },
      { id: 'traffic', label: 'Traffic Analytics' },
      { id: 'engagement', label: 'Engagement' },
      { id: 'conversion', label: 'Conversion' },
      { id: 'roi', label: 'ROI Analytics' },
      { id: 'customer', label: 'Customer Analytics' },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
    count: 12,
    submenu: [
      { id: 'team-members', label: 'Team Members' },
      { id: 'roles', label: 'Roles & Permissions' },
      { id: 'team-performance', label: 'Team Performance' },
      { id: 'activity', label: 'Team Activity' },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderKanban,
    submenu: [
      { id: 'all-projects', label: 'All Projects' },
      { id: 'active-projects', label: 'Active Projects' },
      { id: 'completed-projects', label: 'Completed Projects' },
      { id: 'project-performance', label: 'Project Performance' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    icon: FileText,
    submenu: [
      { id: 'content-overview', label: 'Overview' },
      { id: 'posts', label: 'Posts' },
      { id: 'social-media', label: 'Social Media' },
      { id: 'content-performance', label: 'Content Performance' },
    ],
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: CalendarDays,
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    badge: 5,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    submenu: [
      { id: 'general', label: 'General' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'permissions', label: 'Permissions' },
    ],
  },
];

export default function Sidebar({
  collapsed = false,
  onToggleCollapse = () => {},
  currentPage = '',
  onPageChange = () => {},
  menuItems = defaultMenuItems,
}) {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState(() => new Set(
    menuItems.filter((item) => item.active && item.submenu?.length).map((item) => item.id),
  ));

  const handleItemClick = (item) => {
    if (item.submenu?.length) {
      setExpandedItems((previous) => {
        const next = new Set(previous);
        if (next.has(item.id)) {
          next.delete(item.id);
        } else {
          next.add(item.id);
        }
        return next;
      });
    } else {
      onPageChange(item.id);
    }
  };

  const handleLogout = async () => {
    // កន្លែងសរសេរ Logic ចាកចេញ (ឧទាហរណ៍៖ លុប token)
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    navigate('/login');
  };

  return (
    <div className={`${
      collapsed ? "w-20" : "w-72"
    } transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 
    backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50
    flex flex-col h-screen relative z-10`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex min-w-0 items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full 
          flex items-center justify-center shadow-lg shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>

          {!collapsed && (
            <div className="truncate">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white truncate">
                Thorng
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin Panel
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto index-scroll">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const submenu = Array.isArray(item.submenu) ? item.submenu : [];
          const isExpanded = expandedItems.has(item.id);
          const isSelected = currentPage === item.id;

          return (
            <div key={item.id} className="space-y-1">
              <button
                type="button"
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200 ${
                  isSelected || isExpanded
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                onClick={() => handleItemClick(item)}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {Icon && <Icon className="w-5 h-5 shrink-0" />}
                  {!collapsed && <span className="truncate text-sm">{item.label}</span>}
                </div>

                {!collapsed && (
                  <div className="flex items-center space-x-1">
                    {item.badge != null && (
                      <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.count != null && (
                      <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                        {item.count}
                      </span>
                    )}
                    {submenu.length > 0 && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu Rendering */}
              {!collapsed && submenu.length > 0 && isExpanded && (
                <div className="pl-10 space-y-1 transition-all">
                  {submenu.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => onPageChange(sub.id)}
                      className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                        currentPage === sub.id
                          ? "text-blue-600 dark:text-blue-400 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile & Reusable Logout Button */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover shrink-0"
          />
          {!collapsed && (
            <div className="truncate flex-1">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                Bunthorng
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                thorng@admin.com
              </p>
            </div>
          )}
        </div>

        {/* ហៅប្រើប្រាស់ LogoutButton Component */}
        <LogoutButton
          onLogout={handleLogout}
          showText={!collapsed}
          className="w-full justify-center py-2.5"
        />
      </div>
    </div>
  );
}

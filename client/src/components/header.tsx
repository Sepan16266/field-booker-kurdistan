import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Shield, Settings, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  userRole: string | null;
  onLogout: () => void;
}

export default function Header({ userRole, onLogout }: HeaderProps) {
  const [location] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    onLogout();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                ملاعب كردستان
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                نظام حجز ملاعب كرة القدم المصغرة
              </p>
            </div>
          </div>

          {/* Navigation and User Info */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Navigation Links - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-2">
              <Link href="/">
                <Button
                  variant={location === "/" ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  الرئيسية
                </Button>
              </Link>

              {userRole === "admin" && (
                <Link href="/admin">
                  <Button
                    variant={location === "/admin" ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    لوحة الإدارة
                  </Button>
                </Link>
              )}
            </nav>

            {/* User Info - Simplified on mobile */}
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600 pr-2 sm:pr-4">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                {userRole === "admin" ? "مدير النظام" : "مستخدم"}
              </span>
              <span className="sm:hidden">
                {userRole === "admin" ? "مدير" : "مستخدم"}
              </span>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs sm:text-sm px-2 sm:px-3"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
              <span className="sm:hidden">خروج</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

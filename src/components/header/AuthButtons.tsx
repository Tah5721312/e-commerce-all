"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { FiSettings } from "react-icons/fi";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session ? (
        <>
          {/* زرار Dashboard - يظهر للأدمن فقط */}
          {session.user?.role === "ADMIN" && (
             <Link
            href='/dashboard'
            target='_blank'
            rel='noopener noreferrer'
            className='p-2.5 hover:bg-gray-100 rounded-full transition-colors group'
            aria-label='dashboard'
            title='لوحة التحكم'
          >
            <FiSettings className='w-5 h-5 text-gray-600 group-hover:text-[#D23F57] transition-colors' />
          </Link>

          )}

          {/* معلومات المستخدم وزرار تسجيل الخروج */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">
                {session.user?.name}
              </span>
              <span className="text-xs text-gray-500">
                {session.user?.role === "ADMIN" ? "مدير" : "مستخدم"}
              </span>
            </div>
            
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm">خروج</span>
            </button>
          </div>
        </>
      ) : (
        // زرار تسجيل الدخول - اختياري
        <Link
          href="/auth/signin"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <LogIn size={18} />
          <span>تسجيل الدخول</span>
        </Link>
      )}
    </div>
  );
}
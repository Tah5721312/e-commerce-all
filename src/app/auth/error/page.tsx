"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "هناك مشكلة في إعدادات الخادم. يرجى التواصل مع الدعم الفني.";
      case "AccessDenied":
        return "تم رفض الوصول. ليس لديك صلاحية للدخول.";
      case "Verification":
        return "فشل التحقق. الرابط قد يكون منتهي الصلاحية.";
      case "OAuthSignin":
        return "خطأ في بدء عملية تسجيل الدخول عبر Google.";
      case "OAuthCallback":
      case "Callback":
        return "خطأ في معالجة تسجيل الدخول. تأكد من إعدادات Google OAuth الصحيحة.";
      case "OAuthCreateAccount":
        return "لا يمكن إنشاء حساب جديد. يرجى المحاولة مرة أخرى.";
      case "EmailCreateAccount":
        return "لا يمكن إنشاء حساب بهذا البريد الإلكتروني.";
      case "Signin":
        return "خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      case "OAuthAccountNotLinked":
        return "هذا البريد الإلكتروني مستخدم بالفعل بطريقة تسجيل دخول أخرى.";
      case "EmailSignin":
        return "فشل إرسال رسالة التحقق عبر البريد الإلكتروني.";
      case "CredentialsSignin":
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      case "SessionRequired":
        return "يجب تسجيل الدخول للوصول إلى هذه الصفحة.";
      default:
        return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            خطأ في المصادقة
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
          {error && (
            <p className="mt-2 text-center text-xs text-gray-400">
              رمز الخطأ: {error}
            </p>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <Link
            href="/auth/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            العودة إلى تسجيل الدخول
          </Link>

          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            إذا استمرت المشكلة، يرجى{" "}
            <a href="/contact" className="text-blue-600 hover:text-blue-500">
              التواصل مع الدعم الفني
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

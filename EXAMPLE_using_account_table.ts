// مثال: كيفية استخدام جدول Account مع JWT Strategy

import { prisma } from "@/lib/db/prisma";

// في authOptions.ts - signIn callback
async signIn({ user, account, profile }) {
  if (account?.provider === "google") {
    try {
      // تحقق من وجود المستخدم
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! }
      });

      if (!existingUser) {
        // إنشاء مستخدم جديد
        const newUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
            emailVerified: new Date(),
          }
        });

        // ✅ حفظ معلومات OAuth في جدول Account
        await prisma.account.create({
          data: {
            userId: newUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
          }
        });
      } else {
        // تحقق إذا كان الحساب مربوط بالفعل
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            }
          }
        });

        if (!existingAccount) {
          // ربط حساب Google بمستخدم موجود
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            }
          });
        }
      }

      return true;
    } catch (error) {
      console.error("Error during Google sign in:", error);
      return false;
    }
  }

  return true;
}

// ===================================
// استخدامات إضافية
// ===================================

// 1. معرفة طرق تسجيل الدخول للمستخدم
export async function getUserLoginMethods(userId: string) {
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { provider: true }
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true }
  });

  return {
    hasPassword: !!user?.password,
    oauthProviders: accounts.map(a => a.provider), // ["google", "facebook"]
  };
}

// 2. فك ربط حساب OAuth
export async function unlinkOAuthAccount(userId: string, provider: string) {
  await prisma.account.deleteMany({
    where: {
      userId,
      provider
    }
  });
}

// 3. الحصول على Google Access Token
export async function getGoogleAccessToken(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "google"
    }
  });

  if (!account) return null;

  // تحقق إذا كان منتهي الصلاحية
  const now = Math.floor(Date.now() / 1000);
  if (account.expires_at && account.expires_at < now) {
    // استخدم refresh_token للحصول على token جديد
    // (يحتاج تنفيذ refreshGoogleToken)
    return null;
  }

  return account.access_token;
}

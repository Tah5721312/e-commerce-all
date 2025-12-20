// مثال: API لإضافة كلمة مرور لمستخدم Google

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    // تحقق من تسجيل الدخول
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // احصل على المستخدم
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // تحقق إذا كان لديه كلمة مرور بالفعل
    if (user.password) {
      return NextResponse.json(
        { error: "لديك كلمة مرور بالفعل. استخدم تغيير كلمة المرور بدلاً من ذلك" },
        { status: 400 }
      );
    }

    // أنشئ كلمة مرور جديدة (ليست كلمة مرور Google!)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // حدّث المستخدم
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      message: "تم إضافة كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بالإيميل وكلمة المرور"
    });

  } catch (error) {
    console.error("Error adding password:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة كلمة المرور" },
      { status: 500 }
    );
  }
}

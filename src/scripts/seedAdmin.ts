import "dotenv/config";
import { UserRole } from "../middlewares/auth";
import { prisma } from "../lib/prisma";

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (value !== undefined) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${key}`);
};

async function seedAdmin() {
  try {
    const adminData = {
      name: getEnv("ADMIN_NAME"),
      email: getEnv("ADMIN_EMAIL"),
      role: UserRole.ADMIN,
      password: getEnv("ADMIN_PASSWORD"),
    };

    console.log("Seeding admin:", adminData.email);

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      console.log("Admin already exists in DB.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify(adminData),
    });

    const data = await res.json().catch(() => null);

    console.log("Signup response status:", res.status);

    if (!res.ok) {
      throw new Error("Admin signup failed. Check response above.");
    }

    console.log("**** Admin created via API");

    await prisma.user.update({
      where: { email: adminData.email },
      data: { emailVerified: true },
    });

    console.log("Admin email verified updated.");

    const userAfter = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    console.log("User in DB after attempt:", userAfter ? "YES" : "NO");
  } catch (error) {
    console.error("Seed admin error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();

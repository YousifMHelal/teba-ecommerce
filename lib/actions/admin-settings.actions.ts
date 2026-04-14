"use server";

import bcrypt from "bcryptjs";

import { auth } from "@/lib/auth";
import {
  ADMIN_DASHBOARD_PIN_LENGTH,
  isValidAdminPin,
  normalizeAdminPin,
} from "@/lib/admin-pin";
import { prisma } from "@/lib/prisma";

const ADMIN_DASHBOARD_PIN_KEY = "admin_dashboard_pin_hash";

async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("غير مصرح");
  }
}

function getDefaultPin() {
  const envPin =
    process.env.ADMIN_DASHBOARD_PIN ??
    process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_PIN ??
    "010010";

  return normalizeAdminPin(envPin);
}

async function getStoredPinHash() {
  const setting = await prisma.pinCode.findUnique({
    where: { key: ADMIN_DASHBOARD_PIN_KEY },
    select: { value: true },
  });

  if (setting?.value) {
    return setting.value;
  }

  const defaultPinHash = await bcrypt.hash(getDefaultPin(), 12);

  await prisma.pinCode.upsert({
    where: { key: ADMIN_DASHBOARD_PIN_KEY },
    update: { value: defaultPinHash },
    create: {
      key: ADMIN_DASHBOARD_PIN_KEY,
      value: defaultPinHash,
    },
  });

  return defaultPinHash;
}

export async function verifyAdminDashboardPin(pin: string) {
  await requireAdmin();

  if (!isValidAdminPin(pin)) {
    return { success: false, error: "رمز PIN غير صحيح" };
  }

  const pinHash = await getStoredPinHash();
  const matches = await bcrypt.compare(pin, pinHash);

  if (!matches) {
    return { success: false, error: "رمز PIN غير صحيح" };
  }

  return { success: true };
}

export async function updateAdminDashboardPin(data: {
  currentPin: string;
  newPin: string;
}) {
  await requireAdmin();

  const { currentPin, newPin } = data;

  if (!isValidAdminPin(currentPin)) {
    return {
      success: false,
      error: `رمز PIN الحالي يجب أن يكون ${ADMIN_DASHBOARD_PIN_LENGTH} أرقام`,
    };
  }

  if (!isValidAdminPin(newPin)) {
    return {
      success: false,
      error: `رمز PIN الجديد يجب أن يكون ${ADMIN_DASHBOARD_PIN_LENGTH} أرقام`,
    };
  }

  const pinHash = await getStoredPinHash();
  const isCurrentPinValid = await bcrypt.compare(currentPin, pinHash);

  if (!isCurrentPinValid) {
    return { success: false, error: "رمز PIN الحالي غير صحيح" };
  }

  if (currentPin === newPin) {
    return {
      success: false,
      error: "رمز PIN الجديد يجب أن يكون مختلفاً عن الحالي",
    };
  }

  const newPinHash = await bcrypt.hash(newPin, 12);

  await prisma.pinCode.upsert({
    where: { key: ADMIN_DASHBOARD_PIN_KEY },
    update: { value: newPinHash },
    create: {
      key: ADMIN_DASHBOARD_PIN_KEY,
      value: newPinHash,
    },
  });

  return { success: true };
}

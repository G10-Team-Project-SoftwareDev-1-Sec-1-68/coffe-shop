"use client";

import Header from "@/app/components/Header";
import Toast from "@/app/components/Toast";
import { useToast } from "@/hooks/useToast";

export default function OrderPage() {
  const { toast, clearToast } = useToast();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-card shadow-lg border border-border px-8 py-10 space-y-8">
          <h1 className="text-2xl font-semibold tracking-tight">Order</h1>
        </div>
      </div>
    </div>
  );
}
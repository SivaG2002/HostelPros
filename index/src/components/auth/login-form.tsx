'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';

const API_URL = "http://localhost:5000";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store role locally (simple approach)
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.user_id);

      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }

    } catch (err) {
      setError("Server not reachable");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" required />
      </div>

      <div>
        <Label>Password</Label>
        <Input name="password" type="password" required />
      </div>

      <Button type="submit" className="w-full">
        Login
      </Button>

      {error && <Alert className="mt-4 text-red-500">{error}</Alert>}
    </form>
  );
}

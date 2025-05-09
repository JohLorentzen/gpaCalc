"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import { User } from "@supabase/supabase-js";
import AuthModal from "./AuthModal";

interface AuthBtnProps {
  locale: string;
}

const AuthBtn = ({ locale }: AuthBtnProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("[AuthBtn] useEffect triggered. Pathname:", pathname);
    const fetchUser = async () => {
      console.log("[AuthBtn] Fetching user...");
      const { data: { user: fetchedUser } } = await supabase.auth.getUser();
      console.log("[AuthBtn] User fetched:", fetchedUser?.id);
      setUser(fetchedUser);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[AuthBtn] onAuthStateChange event:", event, "session user:", session?.user?.id);
        setUser(session?.user ?? null);
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          setIsModalOpen(false);
        }
      }
    );
    return () => {
      console.log("[AuthBtn] Unsubscribing auth listener.");
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase.auth, pathname]);

  if (user) {
    return (
      <Button
        onClick={() => {
          router.push(`/${locale}/logging-out`);
        }}
      >
        Log out
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Login
      </Button>
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        locale={locale} 
      />
    </>
  );
};

export default AuthBtn;

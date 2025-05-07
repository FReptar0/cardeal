import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

export default function useUserProfile() {
  const { jwt, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const protectedRoutes = ["/perfil"]

  useEffect(() => {
    if (!jwt) {
        if (protectedRoutes.includes(router.pathname)) {
          router.replace("/login");
        } else {
          setLoading(false); 
        }
        return;
      }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.expired) {
            toast.info("Tu sesión ha expirado.");
            logout(); 
            setUserData(null);
            // NO redirecciona en /checkout
            if (router.pathname !== "/checkout") {
              router.replace("/login");
            }
            return;
          }

          toast.error(data.message || "No autorizado");
          logout();
          if (protectedRoutes.includes(router.pathname)) {
            router.replace("/login");
          }
          return;
        }

        setUserData(data.user);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        toast.error("Error al cargar el perfil");
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [jwt, isLoggedIn, logout, router]);

  return { userData, loading, error };
}

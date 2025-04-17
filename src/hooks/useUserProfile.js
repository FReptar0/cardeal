// /hooks/useUserProfile.js
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

    useEffect(() => {
        if (!isLoggedIn) {
            // Evitar redireccionar al login si estamos en la página de checkout
            if (router.pathname === "/checkout") {
                setLoading(false);
                return;
            }
            router.replace("/login");
            return;
        }
        if (!jwt) return;

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
                    toast.error(data.message || "No autorizado");
                    logout();
                    router.replace("/login");
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

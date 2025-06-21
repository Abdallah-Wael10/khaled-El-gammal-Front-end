"use client"
import React, { useEffect, useState } from 'react'
import Nav2 from '@/app/components/Nav2/page'
import { getAuthToken } from '@/app/utils/page'
import Loading from '@/app/components/loading/page'
import { toast } from 'react-hot-toast'
import { useRouter } from "next/navigation";


const UsersAdmin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const token = getAuthToken();

    // جلب المستخدمين
    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${baseUrl}/api/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.status === 401 || res.status === 403) {
                toast.error("You are not authorized to view this page.");
                setUsers([]);
                router.push("/Adminn/login");
            } else if (!res.ok) {
                toast.error("Failed to fetch users.");
                setUsers([]);
            } else {
                const data = await res.json();
                setUsers(data);
            }
        } catch {
            toast.error("Network error.");
            setUsers([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) fetchUsers();
        else setLoading(false);
        // eslint-disable-next-line
    }, [token, baseUrl]);

    // حذف مستخدم
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`${baseUrl}/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const data = await res.json();
                toast.error(data.message || "Failed to delete user.");
            } else {
                toast.success("User deleted successfully.");
                setUsers(users.filter(u => u._id !== id));
            }
        } catch {
            toast.error("Network error.");
        }
    };

    if (!token) return <Loading />
    if (loading) return <Loading />
    if (error) return (
        <div>
            <Nav2 />
            <div className="text-center text-red-500 mt-10">{error}</div>
        </div>
    );

    return (
        <div className="min-h-screen text-black font-bold bg-gradient-to-br from-[#FFFDF7] via-[#FFF6D4] to-[#FFFCF2]">
            <Nav2 />
            <div className="max-w-5xl mx-auto mt-12 bg-white/90 rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-extrabold mb-8 text-[#FFCF67] text-center tracking-wide drop-shadow">Users Management</h2>
                <div className="overflow-x-auto rounded-xl border border-[#FFCF67]/30 shadow">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#FFF6D4] text-[#917405] text-base">
                                <th className="py-3 px-4 border-b text-left">#</th>
                                <th className="py-3 px-4 border-b text-left">Name</th>
                                <th className="py-3 px-4 border-b text-left">Email</th>
                                <th className="py-3 px-4 border-b text-left">Phone</th>
                                <th className="py-3 px-4 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr key={u._id} className="hover:bg-[#FFFDF7] transition">
                                    <td className="py-3 px-4 border-b font-semibold">{i + 1}</td>
                                    <td className="py-3 px-4 border-b">{u.fullName}</td>
                                    <td className="py-3 px-4 border-b">{u.email}</td>
                                    <td className="py-3 px-4 border-b">{u.phone}</td>
                                    <td className="py-3 px-4 border-b">
                                        <button
                                            className="px-4 py-1 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow hover:scale-105 hover:from-red-500 hover:to-red-700 transition-all duration-150"
                                            onClick={() => handleDeleteUser(u._id)}
                                        >
                                            <span className="inline-block align-middle mr-1">🗑️</span>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && <div className="text-center text-[#A4A4A4] mt-8 text-lg">No users found.</div>}
            </div>
        </div>
    )
}

export default UsersAdmin

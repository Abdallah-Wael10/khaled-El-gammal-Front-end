"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";
import { Trash2, Users } from "lucide-react";
import Loading from "@/app/components/loading/page";
import {
  AdminButton,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  AdminSearch,
  AdminShell,
  AdminTable,
  AdminToolbar,
  adminTdClass,
  adminThClass,
  adminTableClass,
} from "@/app/components/Admin/AdminComponents";
import { useRequireAdmin } from "@/app/hooks/useRequireAdmin";

const UsersAdmin = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const { checking, token } = useRequireAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          toast.error("Failed to fetch users.");
          setUsers([]);
        } else {
          setUsers(await res.json());
        }
      } catch {
        toast.error("Network error.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [baseUrl, token]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      [user.fullName, user.email, user.phone].some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [search, users]);

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setDeleting(true);
    try {
      const res = await fetch(`${baseUrl}/api/users/${deletingUser._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to delete user.");
      } else {
        toast.success("User deleted successfully.");
        setUsers((current) => current.filter((user) => user._id !== deletingUser._id));
        setDeletingUser(null);
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setDeleting(false);
    }
  };

  if (checking) return <Loading message="Checking admin access..." detail="Opening user management" />;

  return (
    <AdminShell title="Users">
      <AdminPageHeader
        eyebrow="Accounts"
        title="Users Management"
        description="Review registered customers and remove accounts when needed."
      />

      <AdminPanel>
        <AdminToolbar>
          <AdminSearch
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..."
          />
          <div className="text-sm font-bold text-[#695f4c]">{filteredUsers.length} users</div>
        </AdminToolbar>

        {loading ? (
          <Loading variant="inline" message="Loading users..." detail="Preparing customer accounts" />
        ) : filteredUsers.length > 0 ? (
          <AdminTable>
            <table className={adminTableClass}>
              <thead>
                <tr>
                  <th className={adminThClass}>#</th>
                  <th className={adminThClass}>Name</th>
                  <th className={adminThClass}>Email</th>
                  <th className={adminThClass}>Phone</th>
                  <th className={`${adminThClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr key={user._id} layout className="hover:bg-[#fffaf0]">
                    <td className={adminTdClass}>{index + 1}</td>
                    <td className={`${adminTdClass} font-bold`}>{user.fullName || "-"}</td>
                    <td className={adminTdClass}>{user.email || "-"}</td>
                    <td className={adminTdClass}>{user.phone || "-"}</td>
                    <td className={`${adminTdClass} text-right`}>
                      <AdminButton variant="danger" icon={Trash2} onClick={() => setDeletingUser(user)}>
                        Delete
                      </AdminButton>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </AdminTable>
        ) : (
          <AdminEmptyState title="No users found" description="Try another search term or check again later." icon={Users} />
        )}
      </AdminPanel>

      <AdminConfirmDialog
        open={Boolean(deletingUser)}
        title="Delete user?"
        message={`This will permanently remove ${deletingUser?.fullName || "this user"}. This action cannot be undone.`}
        confirmLabel="Delete user"
        loading={deleting}
        onCancel={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
      />
    </AdminShell>
  );
};

export default UsersAdmin;

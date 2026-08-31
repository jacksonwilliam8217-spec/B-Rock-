"use client";

import { useState } from "react";
import UserAnalytics from "./UserAnalytics";

type User = {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  contact: string | null;
  country: string | null;
  date_of_birth: string | null;
  role: string | null;
  account_status: string | null;
  kyc_status: string | null;
  is_verified: boolean | null;
  created_at: string;
};

type UserAccountsTableProps = {
  users: User[];
  totalUsers: number;
  activeUsers: number;
  deactivatedUsers: number;
  pendingKyc: number;
};

export default function UserAccountsTable({
  users,
  totalUsers,
  activeUsers,
  deactivatedUsers,
  pendingKyc,
}: UserAccountsTableProps) {
  const [selected, setSelected] = useState("all");

  const filteredUsers = users.filter((u) => {
    if (selected === "active") {
      return u.account_status === "active";
    }

    if (selected === "deactivated") {
      return u.account_status === "deactivated";
    }

    if (selected === "kyc") {
      return u.kyc_status === "pending";
    }

    return true;
  });

  const PAGE_SIZE = 8;
  const currentPage = 1;

  const totalFilteredUsers = filteredUsers.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalFilteredUsers / PAGE_SIZE)
  );

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visibleUsers = filteredUsers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const showingFrom =
    totalFilteredUsers === 0 ? 0 : startIndex + 1;

  const showingTo = Math.min(
    startIndex + PAGE_SIZE,
    totalFilteredUsers
  );

  return (
    <>
      <UserAnalytics
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        deactivatedUsers={deactivatedUsers}
        pendingKyc={pendingKyc}
        selected={selected}
        onSelect={setSelected}
      />

      {!users || users.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/50">
            No registered users found.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="border-b border-white/10 bg-slate-900">
                <tr>
                  <th className="px-5 py-4">Username</th>
                  <th className="px-5 py-4">Full Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Country</th>
                  <th className="px-5 py-4">KYC</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5"
                  >
                    <td className="px-5 py-4 font-semibold">
                      {u.username || "—"}
                    </td>

                    <td className="px-5 py-4">
                      {u.full_name || "—"}
                    </td>

                    <td className="px-5 py-4 text-white/70">
                      {u.email || "—"}
                    </td>

                    <td className="px-5 py-4 text-white/70">
                      {u.contact || "—"}
                    </td>

                    <td className="px-5 py-4 text-white/70">
                      {u.country || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold capitalize text-yellow-400">
                        {u.kyc_status || "pending"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          u.account_status === "deactivated"
                            ? "bg-red-400/10 text-red-400"
                            : "bg-green-400/10 text-green-400"
                        }`}
                      >
                        {u.account_status || "active"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-white/50">
                      {new Date(u.created_at).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>

                 <td className="px-5 py-4">
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => {
        window.location.href = `/admin/users/${u.id}`;
      }}
      className="text-lg text-yellow-400 hover:text-yellow-300"
      title="Edit user"
    >
      ✎
    </button>

    <button
      type="button"
      className="text-lg text-red-400 hover:text-red-300"
      title="Delete user"
    >
      🗑
    </button>
  </div>
</td>
 </tr>
                ))}

                {visibleUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-10 text-center text-white/40"
                    >
                      No users match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/50">
              Showing {showingFrom} to {showingTo} of{" "}
              {totalFilteredUsers} entries
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/30"
              >
                ←
              </button>

              <button
                type="button"
                className="rounded-lg border border-yellow-400/50 bg-yellow-400/10 px-3 py-2 text-sm text-yellow-400"
              >
                1
              </button>

              <button
                type="button"
                disabled={totalPages <= 1}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/30"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

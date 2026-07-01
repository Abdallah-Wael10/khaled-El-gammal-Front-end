"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CheckCircle2, Inbox } from "lucide-react";
import Loading from "@/app/components/loading/page";
import {
  AdminButton,
  AdminEmptyState,
  AdminModal,
  AdminPageHeader,
  AdminPanel,
  AdminSearch,
  AdminShell,
  AdminStatusBadge,
  AdminTable,
  AdminToolbar,
  adminTdClass,
  adminThClass,
  adminTableClass,
} from "@/app/components/Admin/AdminComponents";

export function AdminRequestsManager({
  title,
  eyebrow = "Requests",
  description,
  data = [],
  isLoading,
  error,
  token,
  updateRequest,
  updating,
  refetch,
  kind = "request",
  imageField,
  extraFields = [],
}) {
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data || [];
    return (data || []).filter((lead) =>
      [lead.name, lead.email, lead.phone, lead.category, lead.comment].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [data, search]);

  const handleSetActive = async (lead) => {
    if (!lead || lead.status === "Active") return;
    try {
      await updateRequest({
        id: lead._id,
        body: { status: "Active" },
        token,
      }).unwrap();
      refetch();
      setSelectedLead({ ...lead, status: "Active" });
    } catch {
      alert(`Failed to update ${kind} status`);
    }
  };

  return (
    <AdminShell title={title}>
      <AdminPageHeader eyebrow={eyebrow} title={title} description={description} />

      <AdminPanel>
        <AdminToolbar>
          <AdminSearch value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${kind}s...`} />
          <div className="text-sm font-bold text-[#695f4c]">{filteredData.length} {kind}s</div>
        </AdminToolbar>

        {isLoading ? (
          <Loading variant="inline" message={`Loading ${kind}s...`} detail="Preparing the request inbox" />
        ) : error ? (
          <AdminEmptyState title={`Could not load ${kind}s`} description="Refresh the page or try again once the API is available." icon={Inbox} />
        ) : filteredData.length > 0 ? (
          <AdminTable>
            <table className={adminTableClass}>
              <thead>
                <tr>
                  <th className={adminThClass}>Name</th>
                  <th className={adminThClass}>Contact</th>
                  <th className={adminThClass}>Status</th>
                  {imageField && <th className={adminThClass}>Images</th>}
                  <th className={`${adminThClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((lead) => (
                  <motion.tr key={lead._id} layout className="hover:bg-[#fffaf0]">
                    <td className={adminTdClass}>
                      <div className="font-bold">{lead.name || "-"}</div>
                      {lead.category && <div className="text-xs text-[#695f4c]">{lead.category}</div>}
                    </td>
                    <td className={adminTdClass}>
                      <div>{lead.email || "-"}</div>
                      <div className="text-xs text-[#695f4c]">{lead.phone || "-"}</div>
                    </td>
                    <td className={adminTdClass}><AdminStatusBadge status={lead.status} /></td>
                    {imageField && (
                      <td className={adminTdClass}>
                        <ImageStrip images={lead[imageField]} />
                      </td>
                    )}
                    <td className={`${adminTdClass} text-right`}>
                      <AdminButton variant="secondary" onClick={() => setSelectedLead(lead)}>Details</AdminButton>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </AdminTable>
        ) : (
          <AdminEmptyState title={`No ${kind}s found`} description="New submissions will appear here." icon={Inbox} />
        )}
      </AdminPanel>

      <AdminModal
        open={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        title={`${title.replace(/s$/, "")} Details`}
        size="lg"
      >
        {selectedLead && (
          <div className="grid gap-5">
            <div className="grid gap-3 rounded-lg border border-[#eee2c9] bg-[#fffdf8] p-4 sm:grid-cols-2">
              {[
                ["Name", selectedLead.name],
                ["Email", selectedLead.email],
                ["Phone", selectedLead.phone],
                ...extraFields.map((field) => [field.label, selectedLead[field.key]]),
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#7a5f07]">{label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#211900]">{value || "-"}</p>
                </div>
              ))}
              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#7a5f07]">Comment</p>
                <p className="mt-1 max-h-56 overflow-y-auto whitespace-pre-line break-words rounded-lg bg-white p-3 text-sm leading-6 text-[#211900]">
                  {selectedLead.comment || "-"}
                </p>
              </div>
              {imageField && Array.isArray(selectedLead[imageField]) && selectedLead[imageField].length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#7a5f07]">Images</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedLead[imageField].map((img, index) => (
                      <Image
                        key={`${img}-${index}`}
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`}
                        width={128}
                        height={96}
                        alt={`${kind} reference ${index + 1}`}
                        className="h-24 w-32 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#eee2c9] p-4">
              <AdminStatusBadge status={selectedLead.status} />
              {selectedLead.status !== "Active" && (
                <AdminButton icon={CheckCircle2} loading={updating} onClick={() => handleSetActive(selectedLead)}>
                  Mark as Active
                </AdminButton>
              )}
            </div>
          </div>
        )}
      </AdminModal>
    </AdminShell>
  );
}

function ImageStrip({ images }) {
  if (!Array.isArray(images) || images.length === 0) {
    return <span className="text-sm text-[#695f4c]">None</span>;
  }

  return (
    <div className="flex -space-x-2">
      {images.slice(0, 3).map((img, index) => (
        <Image
          key={`${img}-${index}`}
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`}
          width={36}
          height={36}
          alt=""
          className="h-9 w-9 rounded-full border-2 border-white object-cover"
        />
      ))}
      {images.length > 3 && (
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#fff3cf] text-xs font-bold text-[#7a5f07]">
          +{images.length - 3}
        </span>
      )}
    </div>
  );
}

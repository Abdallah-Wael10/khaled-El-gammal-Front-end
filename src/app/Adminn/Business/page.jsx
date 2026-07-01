"use client";

import React from "react";
import Loading from "@/app/components/loading/page";
import { useGetBusinessQuery, useUpdateBusinessMutation } from "@/app/features/Api/BusinessFormApi";
import { AdminRequestsManager } from "@/app/components/Admin/AdminRequestsManager";
import { useRequireAdmin } from "@/app/hooks/useRequireAdmin";

const BusinessAdmin = () => {
  const { checking, token } = useRequireAdmin();
  const { data = [], isLoading, error, refetch } = useGetBusinessQuery();
  const [updateBusiness, { isLoading: updating }] = useUpdateBusinessMutation();

  if (checking) return <Loading message="Checking admin access..." detail="Opening business requests" />;

  return (
    <AdminRequestsManager
      title="Business Requests"
      description="Review business inquiries, contact information, category needs, and follow-up status."
      data={data}
      isLoading={isLoading}
      error={error}
      token={token}
      updateRequest={updateBusiness}
      updating={updating}
      refetch={refetch}
      kind="request"
      extraFields={[{ label: "Category", key: "category" }]}
    />
  );
};

export default BusinessAdmin;

"use client";

import React from "react";
import Loading from "@/app/components/loading/page";
import { useGetCustomizationQuery, useUpdateCustomizationMutation } from "@/app/features/Api/CustomizeFormApi";
import { AdminRequestsManager } from "@/app/components/Admin/AdminRequestsManager";
import { useRequireAdmin } from "@/app/hooks/useRequireAdmin";

const CustomizeAdmin = () => {
  const { checking, token } = useRequireAdmin();
  const { data = [], isLoading, error, refetch } = useGetCustomizationQuery();
  const [updateCustomization, { isLoading: updating }] = useUpdateCustomizationMutation();

  if (checking) return <Loading message="Checking admin access..." detail="Opening customization requests" />;

  return (
    <AdminRequestsManager
      title="Customize Requests"
      description="Review custom artwork requests, reference images, comments, and production status."
      data={data}
      isLoading={isLoading}
      error={error}
      token={token}
      updateRequest={updateCustomization}
      updating={updating}
      refetch={refetch}
      kind="custom request"
      imageField="image"
    />
  );
};

export default CustomizeAdmin;

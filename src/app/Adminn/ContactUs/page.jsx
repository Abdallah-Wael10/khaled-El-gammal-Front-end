"use client";

import React from "react";
import Loading from "@/app/components/loading/page";
import { useGetContactQuery, useUpdateContactMutation } from "@/app/features/Api/contactUsApi";
import { AdminRequestsManager } from "@/app/components/Admin/AdminRequestsManager";
import { useRequireAdmin } from "@/app/hooks/useRequireAdmin";

const ContactUsAdmin = () => {
  const { checking, token } = useRequireAdmin();
  const { data = [], isLoading, error, refetch } = useGetContactQuery();
  const [updateContact, { isLoading: updating }] = useUpdateContactMutation();

  if (checking) return <Loading message="Checking admin access..." detail="Opening contact requests" />;

  return (
    <AdminRequestsManager
      title="Contact Requests"
      description="Scan customer messages, contact details, comments, and response status."
      data={data}
      isLoading={isLoading}
      error={error}
      token={token}
      updateRequest={updateContact}
      updating={updating}
      refetch={refetch}
      kind="message"
    />
  );
};

export default ContactUsAdmin;

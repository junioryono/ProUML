import { UserNameFormSkeleton } from "@/components/dashboard/settings/user-name-form-skeleton";
import { UserEmailFormSkeleton } from "@/components/dashboard/settings/user-email-form-skeleton";
import { UserDeleteFormSkeleton } from "@/components/dashboard/settings/user-delete-form-skeleton";

export default function DashboardSettingsLoading() {
  return (
    <>
      <div>
        <UserNameFormSkeleton />
      </div>
      <div>
        <UserEmailFormSkeleton />
      </div>
      <div>
        <UserDeleteFormSkeleton />
      </div>
    </>
  );
}

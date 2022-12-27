import { FormContainer } from "@/components/dashboard/settings/form-container";
import { UserEmailForm } from "@/components/dashboard/settings/user-email-form";
import { UserNameForm } from "@/components/dashboard/settings/user-name-form";

export default async function SettingsPage() {
  return (
    <>
      <div className="grid gap-10">
        <FormContainer Component={UserNameForm} />
      </div>
      <div className="grid gap-10">
        <FormContainer Component={UserEmailForm} />
      </div>
    </>
  );
}

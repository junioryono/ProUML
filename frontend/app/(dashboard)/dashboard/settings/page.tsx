import { FormContainer } from "@/components/dashboard/settings/form-container";
import { UserNameForm } from "@/components/dashboard/settings/user-name-form";
import { UserEmailForm } from "@/components/dashboard/settings/user-email-form";
import { UserDeleteForm } from "@/components/dashboard/settings/user-delete-form";

export default async function SettingsPage() {
  return (
    <>
      <div>
        <FormContainer Component={UserNameForm} />
      </div>
      <div>
        <FormContainer Component={UserEmailForm} />
      </div>
      <div>
        <FormContainer Component={UserDeleteForm} />
      </div>
    </>
  );
}

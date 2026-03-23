import { SettingsForm } from '@/components/settings/settings-form';

export const metadata = {
  title: 'Settings – Castfor',
};

export default function SettingsPage() {
  return (
    <div className="py-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize your Castfor experience.
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}

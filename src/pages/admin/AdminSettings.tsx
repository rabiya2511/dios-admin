import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { FormField } from '@/components/common/FormField';
import { ToggleRow } from '@/components/common/ToggleRow';
import { Toast } from '@/components/common/Toast';
import { useUsers } from '@/hooks/useUsers';

export default function AdminSettings() {
  // General Settings
  const [platformName, setPlatformName] = useState('StartupSaaS');
  const [supportEmail, setSupportEmail] = useState('support@startupsaas.in');
  const [gstNumber, setGstNumber] = useState('27AABCS1429B1ZB');
  const [defaultGstRate, setDefaultGstRate] = useState(18);
  const [currency, setCurrency] = useState('INR (₹)');

  // Referral Settings
  const [referrerReward, setReferrerReward] = useState(500);
  const [newUserDiscount, setNewUserDiscount] = useState(300);
  const [enableReferral, setEnableReferral] = useState(true);
  const [autoApproveRewards, setAutoApproveRewards] = useState(false);

  // Task Assignment Rules
  const [autoAssign, setAutoAssign] = useState(true);
  const [reassignAfterHrs, setReassignAfterHrs] = useState(24);
  const [maxRejections, setMaxRejections] = useState(3);
  const [assignmentStrategy, setAssignmentStrategy] = useState('Round Robin');

  // Notification Settings
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(false);
  const [deadlineReminders, setDeadlineReminders] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { users, unblockUser } = useUsers();
  const [blockedSearch, setBlockedSearch] = useState('');

  const blockedUsers = useMemo(() => {
    return users
      .filter((u) => u.status === 'blocked')
      .filter(
        (u) =>
          u.name.toLowerCase().includes(blockedSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(blockedSearch.toLowerCase()),
      );
  }, [users, blockedSearch]);

  function handleSaveAll() {
    // No backend exists yet — settings live in this page's state for the
    // session, consistent with how Orders/Tasks/Invoices are handled elsewhere.
    const settingsSnapshot = {
      platformName,
      supportEmail,
      gstNumber,
      defaultGstRate,
      currency,
      referrerReward,
      newUserDiscount,
      enableReferral,
      autoApproveRewards,
      autoAssign,
      reassignAfterHrs,
      maxRejections,
      assignmentStrategy,
      emailNotif,
      smsNotif,
      whatsappNotif,
      deadlineReminders,
    };
    // eslint-disable-next-line no-console
    console.log('Platform settings saved:', settingsSnapshot);
    setToastMessage('All changes saved successfully.');
  }

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Platform Settings"
          subtitle="Configure global platform options, notifications and integrations"
          action={
            <Button variant="primary" size="sm" onClick={handleSaveAll}>
              Save All Changes
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          <div className="flex flex-col gap-3.5">
            <Card>
              <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                General Settings
              </h3>
              <div className="flex flex-col gap-3">
                <FormField
                  label="Platform Name"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                />
                <FormField
                  label="Support Email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
                <FormField label="GST Number" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Default GST Rate (%)"
                    type="number"
                    value={defaultGstRate}
                    onChange={(e) => setDefaultGstRate(Number(e.target.value))}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="cursor-pointer rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                    >
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Referral Settings
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Referrer Reward (₹)"
                  type="number"
                  value={referrerReward}
                  onChange={(e) => setReferrerReward(Number(e.target.value))}
                />
                <FormField
                  label="New User Discount (₹)"
                  type="number"
                  value={newUserDiscount}
                  onChange={(e) => setNewUserDiscount(Number(e.target.value))}
                />
              </div>
              <div className="mt-1">
                <ToggleRow label="Enable Referral Program" checked={enableReferral} onChange={setEnableReferral} bordered />
                <ToggleRow label="Auto-approve Rewards" checked={autoApproveRewards} onChange={setAutoApproveRewards} bordered />
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3.5">
            <Card>
              <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Task Assignment Rules
              </h3>
              <ToggleRow label="Enable Auto-Assignment" checked={autoAssign} onChange={setAutoAssign} />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <FormField
                  label="Reassign After (hrs)"
                  type="number"
                  value={reassignAfterHrs}
                  onChange={(e) => setReassignAfterHrs(Number(e.target.value))}
                />
                <FormField
                  label="Max Rejections"
                  type="number"
                  value={maxRejections}
                  onChange={(e) => setMaxRejections(Number(e.target.value))}
                />
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Assignment Strategy
                </label>
                <select
                  value={assignmentStrategy}
                  onChange={(e) => setAssignmentStrategy(e.target.value)}
                  className="cursor-pointer rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                >
                  <option>Round Robin</option>
                  <option>Best Rated</option>
                  <option>Least Busy</option>
                </select>
              </div>
            </Card>

            <Card>
              <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Notification Settings
              </h3>
              <div className="flex flex-col gap-1">
                <ToggleRow label="Email Notifications" checked={emailNotif} onChange={setEmailNotif} />
                <ToggleRow label="SMS Alerts" checked={smsNotif} onChange={setSmsNotif} />
                <ToggleRow label="WhatsApp Notifications" checked={whatsappNotif} onChange={setWhatsappNotif} />
                <ToggleRow label="Deadline Reminders" checked={deadlineReminders} onChange={setDeadlineReminders} />
              </div>
            </Card>

            <Card>
              <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Blocked Users
              </h3>
              <input
                value={blockedSearch}
                onChange={(e) => setBlockedSearch(e.target.value)}
                placeholder="Search blocked users..."
                className="mb-3 w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
              />
              {blockedUsers.length === 0 ? (
                <p className="py-4 text-center text-[12px] text-text-muted">No blocked users.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {blockedUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between rounded-[10px] border border-border-subtle p-2.5"
                    >
                      <div>
                        <div className="text-[12px] font-medium text-text-primary">{u.name}</div>
                        <div className="text-[11px] text-text-muted">{u.email}</div>
                      </div>
                      <Button variant="success" size="sm" onClick={() => unblockUser(u.id)}>
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { ServiceListItem } from '@/components/services/ServiceListItem';
import { ADMIN_SERVICES, PRICING_PACKAGES } from '@/constants/mockData';
import type { AdminService, PricingPackage, ServiceCategory } from '@/types/domain';

const CATEGORIES: ServiceCategory[] = ['Legal', 'Design', 'Tech', 'Finance', 'Food & ISO'];

const EMPTY_FORM = { name: '', category: 'Legal' as ServiceCategory, price: '', description: '', icon: '' };

const EMPTY_PACKAGE_FORM = { packageName: '', serviceName: '', description: '', price: '', gstPercent: '18' };

/** Single source of truth for package total math — used in the table and the live form preview. */
function calculatePackageTotal(price: number, gstPercent: number): number {
  return Math.round(price * (1 + gstPercent / 100));
}

function validatePackageForm(form: typeof EMPTY_PACKAGE_FORM): string {
  if (!form.packageName.trim()) return 'Package name is required.';
  if (!form.serviceName.trim()) return 'Service is required.';
  if (!form.description.trim()) return 'Package description is required.';
  const price = Number(form.price);
  if (!form.price || Number.isNaN(price) || price <= 0) return 'Price must be a valid positive number.';
  const gst = Number(form.gstPercent);
  if (form.gstPercent === '' || Number.isNaN(gst) || gst < 0 || gst > 100) {
    return 'GST must be a valid percentage (0–100).';
  }
  return '';
}

/** Finds an existing service with the same name (case-insensitive), so repeated names always share one icon. */
function findExistingByName(services: AdminService[], name: string): AdminService | undefined {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return undefined;
  return services.find((s) => s.name.trim().toLowerCase() === trimmed);
}

export default function ServicesPricing() {
  const [services, setServices] = useState<AdminService[]>(ADMIN_SERVICES);
  const [packages, setPackages] = useState<PricingPackage[]>(PRICING_PACKAGES);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [iconLocked, setIconLocked] = useState(false);

  const [selectedPackageNames, setSelectedPackageNames] = useState<string[]>([]);
  const [newPackagePrices, setNewPackagePrices] = useState<Record<string, string>>({});
  const [newPackageDescriptions, setNewPackageDescriptions] = useState<Record<string, string>>({});

  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  const [showAddPackageForm, setShowAddPackageForm] = useState(false);
  const [addPackageForm, setAddPackageForm] = useState(EMPTY_PACKAGE_FORM);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [editPackageForm, setEditPackageForm] = useState(EMPTY_PACKAGE_FORM);
  const [packageFormError, setPackageFormError] = useState('');

  // Unique package tier names already used anywhere (e.g. Starter, Growth, Enterprise),
  // offered as selectable templates when creating a new service.
  const availablePackageNames = useMemo(() => {
    const names = new Set(packages.map((p) => p.packageName));
    return Array.from(names);
  }, [packages]);

  // Auto-fill (and lock) the icon field whenever the typed name matches an existing service,
  // so the same service name always renders with the same emoji.
  useEffect(() => {
    const match = findExistingByName(services, addForm.name);
    if (match) {
      setAddForm((f) => (f.icon === match.icon ? f : { ...f, icon: match.icon }));
      setIconLocked(true);
    } else {
      setIconLocked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addForm.name, services]);

  function togglePackageName(name: string) {
    setSelectedPackageNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }

  function handleAddService() {
    if (!addForm.name.trim()) return;

    const existingMatch = findExistingByName(services, addForm.name);
    const resolvedIcon = existingMatch ? existingMatch.icon : addForm.icon.trim() || '⚡';

    const newService: AdminService = {
      id: `s${Date.now()}`,
      name: addForm.name,
      category: addForm.category,
      description: addForm.description,
      startingPrice: Number(addForm.price) || 0,
      icon: resolvedIcon,
    };
    setServices((prev) => [...prev, newService]);

    if (selectedPackageNames.length > 0) {
      const newPackages: PricingPackage[] = selectedPackageNames.map((name) => ({
        id: `p${Date.now()}-${name}`,
        packageName: name,
        serviceName: newService.name,
        description: newPackageDescriptions[name] ?? '',
        price: Number(newPackagePrices[name]) || 0,
        gstPercent: 18,
      }));
      setPackages((prev) => [...prev, ...newPackages]);
    }

    setAddForm(EMPTY_FORM);
    setSelectedPackageNames([]);
    setNewPackagePrices({});
    setNewPackageDescriptions({});
    setIconLocked(false);
    setShowAddForm(false);
  }

  function startEdit(service: AdminService) {
    setEditingService(service);
    setEditForm({
      name: service.name,
      category: service.category,
      price: String(service.startingPrice),
      description: service.description,
      icon: service.icon,
    });
  }

  function saveEdit() {
    if (!editingService) return;
    setServices((prev) =>
      prev.map((s) =>
        s.id === editingService.id
          ? { ...s, name: editForm.name, category: editForm.category, description: editForm.description, startingPrice: Number(editForm.price) || 0, icon: editForm.icon.trim() || s.icon }
          : s,
      ),
    );
    setEditingService(null);
  }

  function deleteService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  function updatePackagePrice(id: string, newPrice: number) {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p)));
  }

  function handleAddPackage() {
    const error = validatePackageForm(addPackageForm);
    if (error) {
      setPackageFormError(error);
      return;
    }
    const newPackage: PricingPackage = {
      id: `p${Date.now()}`,
      packageName: addPackageForm.packageName,
      serviceName: addPackageForm.serviceName,
      description: addPackageForm.description,
      price: Number(addPackageForm.price),
      gstPercent: Number(addPackageForm.gstPercent),
    };
    setPackages((prev) => [...prev, newPackage]);
    setAddPackageForm(EMPTY_PACKAGE_FORM);
    setPackageFormError('');
    setShowAddPackageForm(false);
  }

  function cancelAddPackage() {
    setAddPackageForm(EMPTY_PACKAGE_FORM);
    setPackageFormError('');
    setShowAddPackageForm(false);
  }

  function startEditPackage(pkg: PricingPackage) {
    setEditingPackage(pkg);
    setEditPackageForm({
      packageName: pkg.packageName,
      serviceName: pkg.serviceName,
      description: pkg.description,
      price: String(pkg.price),
      gstPercent: String(pkg.gstPercent),
    });
    setPackageFormError('');
  }

  function saveEditPackage() {
    if (!editingPackage) return;
    const error = validatePackageForm(editPackageForm);
    if (error) {
      setPackageFormError(error);
      return;
    }
    setPackages((prev) =>
      prev.map((p) =>
        p.id === editingPackage.id
          ? {
              ...p,
              packageName: editPackageForm.packageName,
              serviceName: editPackageForm.serviceName,
              description: editPackageForm.description,
              price: Number(editPackageForm.price),
              gstPercent: Number(editPackageForm.gstPercent),
            }
          : p,
      ),
    );
    setEditingPackage(null);
    setPackageFormError('');
  }

  function cancelEditPackage() {
    setEditingPackage(null);
    setPackageFormError('');
  }

  return (
    <div>
      <Topbar />
      <div className="p-5">
        <PageHeader
          title="Services & Pricing Editor"
          subtitle="Edit service names, descriptions, prices and packages. Changes reflect live on the platform."
          action={
            <Button variant="gold" size="sm" onClick={() => setShowAddForm((v) => !v)}>
              + Add Service
            </Button>
          }
        />

        {showAddForm && (
          <Card className="mb-3.5">
            <h3 className="mb-3.5 text-[14px] font-semibold text-text-primary">Add New Service</h3>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Service Name
                </label>
                <input
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. ISO Certification"
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Category
                </label>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value as ServiceCategory }))}
                  className="cursor-pointer rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Starting Price (₹)
                </label>
                <input
                  type="number"
                  value={addForm.price}
                  onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="9999"
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Icon (emoji)
                </label>
                <input
                  value={addForm.icon}
                  onChange={(e) => setAddForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="e.g. 🏢"
                  disabled={iconLocked}
                  maxLength={4}
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold disabled:opacity-60"
                />
                {iconLocked && (
                  <span className="text-[10px] text-text-muted">
                    Matches an existing service — icon locked for consistency.
                  </span>
                )}
              </div>
            </div>
            <div className="mb-3.5 flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Description
              </label>
              <input
                value={addForm.description}
                onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description visible to users"
                className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
              />
            </div>

            <div className="mb-3.5">
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Packages
              </label>
              {availablePackageNames.length === 0 ? (
                <p className="text-[11px] text-text-muted">
                  No packages exist yet — add one below in the Package Pricing Editor after saving this service.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {availablePackageNames.map((name) => {
                    const checked = selectedPackageNames.includes(name);
                    return (
                      <div key={name} className="flex flex-col gap-1.5 rounded-lg border border-border-subtle p-2.5">
                        <label className="flex items-center gap-2 text-[12px] font-medium text-text-primary">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePackageName(name)}
                            className="h-3.5 w-3.5 accent-gold"
                          />
                          {name}
                        </label>
                        {checked && (
                          <div className="grid grid-cols-1 gap-2 pl-5.5 sm:grid-cols-2">
                            <input
                              type="number"
                              value={newPackagePrices[name] ?? ''}
                              onChange={(e) =>
                                setNewPackagePrices((prev) => ({ ...prev, [name]: e.target.value }))
                              }
                              placeholder="Price (₹)"
                              className="rounded-lg border border-border-subtle bg-canvas px-3 py-1.5 text-[12px] text-text-primary outline-none focus:border-gold"
                            />
                            <input
                              value={newPackageDescriptions[name] ?? ''}
                              onChange={(e) =>
                                setNewPackageDescriptions((prev) => ({ ...prev, [name]: e.target.value }))
                              }
                              placeholder="Describe what this package includes"
                              className="rounded-lg border border-border-subtle bg-canvas px-3 py-1.5 text-[12px] text-text-primary outline-none focus:border-gold"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleAddService}>
                Save Service
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {editingService && (
          <Card className="mb-3.5">
            <h3 className="mb-3.5 text-[14px] font-semibold text-text-primary">
              Edit Service — {editingService.name}
            </h3>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Service Name
                </label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value as ServiceCategory }))}
                  className="cursor-pointer rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Starting Price (₹)
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Icon (emoji)
                </label>
                <input
                  value={editForm.icon}
                  onChange={(e) => setEditForm((f) => ({ ...f, icon: e.target.value }))}
                  maxLength={4}
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="mb-3.5 flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Description
              </label>
              <input
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={saveEdit}>
                Save Changes
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setEditingService(null)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <Card>
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            All Services
          </h3>
          <div>
            {services.map((s) => (
              <ServiceListItem key={s.id} service={s} onEdit={startEdit} onDelete={deleteService} />
            ))}
          </div>
        </Card>

        {showAddPackageForm && (
          <Card className="mt-3.5">
            <h3 className="mb-3.5 text-[14px] font-semibold text-text-primary">Add New Package</h3>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Package Name
                </label>
                <input
                  value={addPackageForm.packageName}
                  onChange={(e) => setAddPackageForm((f) => ({ ...f, packageName: e.target.value }))}
                  placeholder="e.g. Starter"
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Service
                </label>
                <input
                  value={addPackageForm.serviceName}
                  onChange={(e) => setAddPackageForm((f) => ({ ...f, serviceName: e.target.value }))}
                  placeholder="e.g. Company Reg."
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={addPackageForm.price}
                  onChange={(e) => setAddPackageForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="4999"
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  GST (%)
                </label>
                <input
                  type="number"
                  value={addPackageForm.gstPercent}
                  onChange={(e) => setAddPackageForm((f) => ({ ...f, gstPercent: e.target.value }))}
                  placeholder="18"
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="mb-3.5 flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Package Description
              </label>
              <textarea
                value={addPackageForm.description}
                onChange={(e) => setAddPackageForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe what's included in this package"
                rows={2}
                className="resize-none rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
              />
            </div>
            <div className="mb-3.5 text-[12px] text-text-muted">
              Total:{' '}
              <span className="font-semibold text-text-primary">
                ₹
                {calculatePackageTotal(
                  Number(addPackageForm.price) || 0,
                  Number(addPackageForm.gstPercent) || 0,
                ).toLocaleString('en-IN')}
              </span>
            </div>
            {packageFormError && <p className="mb-3.5 text-[11px] text-danger">{packageFormError}</p>}
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleAddPackage}>
                Save Package
              </Button>
              <Button variant="secondary" size="sm" onClick={cancelAddPackage}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {editingPackage && (
          <Card className="mt-3.5">
            <h3 className="mb-3.5 text-[14px] font-semibold text-text-primary">
              Edit Package — {editingPackage.packageName}
            </h3>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Package Name
                </label>
                <input
                  value={editPackageForm.packageName}
                  onChange={(e) => setEditPackageForm((f) => ({ ...f, packageName: e.target.value }))}
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Service
                </label>
                <input
                  value={editPackageForm.serviceName}
                  onChange={(e) => setEditPackageForm((f) => ({ ...f, serviceName: e.target.value }))}
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={editPackageForm.price}
                  onChange={(e) => setEditPackageForm((f) => ({ ...f, price: e.target.value }))}
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  GST (%)
                </label>
                <input
                  type="number"
                  value={editPackageForm.gstPercent}
                  onChange={(e) => setEditPackageForm((f) => ({ ...f, gstPercent: e.target.value }))}
                  className="rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="mb-3.5 flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Package Description
              </label>
              <textarea
                value={editPackageForm.description}
                onChange={(e) => setEditPackageForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="resize-none rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-[12px] text-text-primary outline-none focus:border-gold"
              />
            </div>
            <div className="mb-3.5 text-[12px] text-text-muted">
              Total:{' '}
              <span className="font-semibold text-text-primary">
                ₹
                {calculatePackageTotal(
                  Number(editPackageForm.price) || 0,
                  Number(editPackageForm.gstPercent) || 0,
                ).toLocaleString('en-IN')}
              </span>
            </div>
            {packageFormError && <p className="mb-3.5 text-[11px] text-danger">{packageFormError}</p>}
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={saveEditPackage}>
                Save Changes
              </Button>
              <Button variant="secondary" size="sm" onClick={cancelEditPackage}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <Card className="mt-3.5">
          <div className="mb-3.5 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Package Pricing Editor
            </h3>
            <Button variant="secondary" size="sm" onClick={() => setShowAddPackageForm((v) => !v)}>
              + Add Package
            </Button>
          </div>
          <DataTable<PricingPackage>
            data={packages}
            rowKey={(p) => p.id}
            columns={[
              { header: 'Package Name', render: (p) => p.packageName },
              { header: 'Service', render: (p) => p.serviceName },
              {
                header: 'Description',
                render: (p) => <span className="text-text-muted">{p.description || '—'}</span>,
              },
              {
                header: 'Price (₹)',
                render: (p) => (
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => updatePackagePrice(p.id, Number(e.target.value) || 0)}
                    className="w-[80px] rounded-md border border-border-subtle bg-canvas px-2 py-1 text-[11px] text-text-primary outline-none focus:border-gold"
                  />
                ),
              },
              { header: 'GST', render: (p) => `${p.gstPercent}%` },
              {
                header: 'Total',
                render: (p) => `₹${calculatePackageTotal(p.price, p.gstPercent).toLocaleString('en-IN')}`,
              },
              {
                header: 'Actions',
                render: (p) => (
                  <Button variant="secondary" size="sm" onClick={() => startEditPackage(p)}>
                    Edit
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
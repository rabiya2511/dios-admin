import { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { ServiceListItem } from '@/components/services/ServiceListItem';
import { ADMIN_SERVICES, PRICING_PACKAGES } from '@/constants/mockData';
import type { AdminService, PricingPackage, ServiceCategory } from '@/types/domain';

const CATEGORIES: ServiceCategory[] = ['Legal', 'Design', 'Tech', 'Finance', 'Food & ISO'];

const EMPTY_FORM = { name: '', category: 'Legal' as ServiceCategory, price: '', description: '' };

export default function ServicesPricing() {
  const [services, setServices] = useState<AdminService[]>(ADMIN_SERVICES);
  const [packages, setPackages] = useState<PricingPackage[]>(PRICING_PACKAGES);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);

  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  function handleAddService() {
    if (!addForm.name.trim()) return;
    const newService: AdminService = {
      id: `s${Date.now()}`,
      name: addForm.name,
      category: addForm.category,
      description: addForm.description,
      startingPrice: Number(addForm.price) || 0,
      icon: '⚡',
  };  
    setServices((prev) => [...prev, newService]);
    setAddForm(EMPTY_FORM);
    setShowAddForm(false);
}

  function startEdit(service: AdminService) {
    setEditingService(service);
    setEditForm({
      name: service.name,
      category: service.category,
      price: String(service.startingPrice),
      description: service.description,
    });
  }

  function saveEdit() {
    if (!editingService) return;
    setServices((prev) =>
      prev.map((s) =>
        s.id === editingService.id
          ? { ...s, name: editForm.name, category: editForm.category, description: editForm.description, startingPrice: Number(editForm.price) || 0 }
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
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
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

        <Card className="mt-3.5">
          <div className="mb-3.5 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Package Pricing Editor
            </h3>
            <Button variant="secondary" size="sm">
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
                render: (p) => `₹${Math.round(p.price * (1 + p.gstPercent / 100)).toLocaleString('en-IN')}`,
              },
              {
                header: 'Actions',
                render: () => (
                  <Button variant="secondary" size="sm">
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
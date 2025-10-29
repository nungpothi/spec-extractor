import React, { useEffect, useMemo, useState } from 'react';
import {
  ErrorMessage,
  LoadingSpinner,
  Navbar,
} from '../components';
import { useQuotationStore } from '../stores';

interface QuotationItemForm {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

const VAT_RATE = 0.07;

const makeId = () => `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;

const createEmptyItem = (): QuotationItemForm => ({
  id: makeId(),
  description: '',
  qty: 1,
  unitPrice: 0,
});

const formatCurrency = (value: number) =>
  value.toLocaleString('th-TH', { style: 'currency', currency: 'THB' });

export const QuotationPage: React.FC = () => {
  const [formState, setFormState] = useState({
    companyName: '',
    clientName: '',
    note: '',
    includeVat: true,
    items: [createEmptyItem()],
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    quotations,
    currentQuotation,
    shareLink,
    isListing,
    isSaving,
    isFetchingDetail,
    isPdfLoading,
    isShareLoading,
    error,
    loadQuotations,
    fetchQuotation,
    createQuotation,
    updateQuotation,
    downloadQuotationPdf,
    generateShareLink,
    clearShareLink,
    clearError,
    setCurrentQuotation,
  } = useQuotationStore();

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  useEffect(() => {
    if (currentQuotation) {
      setFormState({
        companyName: currentQuotation.companyName,
        clientName: currentQuotation.clientName,
        note: currentQuotation.note || '',
        includeVat: currentQuotation.includeVat,
        items:
          currentQuotation.items.length > 0
            ? currentQuotation.items.map((item) => ({
                id: makeId(),
                description: item.name,
                qty: item.qty,
                unitPrice: item.price,
              }))
            : [createEmptyItem()],
      });
      setSelectedId(currentQuotation.id);
      clearShareLink();
    }
  }, [currentQuotation, clearShareLink]);

  const resetForm = () => {
    setFormState({
      companyName: '',
      clientName: '',
      note: '',
      includeVat: true,
      items: [createEmptyItem()],
    });
    setSelectedId(null);
    setCurrentQuotation(null);
    clearShareLink();
  };

  const handleItemChange = (id: string, field: keyof QuotationItemForm, value: string) => {
    setFormState((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id) return item;

        if (field === 'description') {
          return { ...item, description: value };
        }

        if (field === 'qty') {
          const qty = Number.parseInt(value, 10);
          return { ...item, qty: Number.isNaN(qty) ? 0 : Math.max(0, qty) };
        }

        if (field === 'unitPrice') {
          const price = Number.parseFloat(value);
          return { ...item, unitPrice: Number.isNaN(price) ? 0 : Math.max(0, price) };
        }

        return item;
      }),
    }));
  };

  const handleAddItem = () => {
    setFormState((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyItem()],
    }));
  };

  const handleRemoveItem = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((item) => item.id !== id) : prev.items,
    }));
  };

  const subtotal = useMemo(
    () =>
      formState.items.reduce(
        (sum, item) => sum + (Number.isFinite(item.qty) ? item.qty : 0) * (Number.isFinite(item.unitPrice) ? item.unitPrice : 0),
        0
      ),
    [formState.items]
  );

  const vatAmount = useMemo(() => (formState.includeVat ? subtotal * VAT_RATE : 0), [subtotal, formState.includeVat]);
  const totalAmount = useMemo(() => subtotal + vatAmount, [subtotal, vatAmount]);

  const isEditing = Boolean(selectedId);

  const buildPayload = () => ({
    companyName: formState.companyName.trim(),
    clientName: formState.clientName.trim(),
    note: formState.note.trim() || undefined,
    includeVat: formState.includeVat,
    items: formState.items
      .filter((item) => item.description.trim() && item.qty > 0)
      .map((item) => ({
        name: item.description.trim(),
        qty: item.qty,
        price: item.unitPrice,
      })),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.companyName.trim() || !formState.clientName.trim()) {
      alert('กรุณากรอกชื่อบริษัทและชื่อลูกค้า / Please fill company and client names');
      return;
    }

    const itemsPayload = formState.items.filter((item) => item.description.trim() && item.qty > 0);
    if (itemsPayload.length === 0) {
      alert('กรุณาเพิ่มรายการสินค้า / Please add at least one product or service');
      return;
    }

    const payload = buildPayload();

    try {
      if (isEditing && selectedId) {
        await updateQuotation(selectedId, payload);
        await fetchQuotation(selectedId);
        alert('Quotation updated successfully');
      } else {
        const newId = await createQuotation(payload);
        await fetchQuotation(newId);
        alert('Quotation created successfully');
      }
    } catch (err) {
      // Store handles error state
    }
  };

  const handleSelectQuotation = async (id: string) => {
    setSelectedId(id);
    clearShareLink();
    await fetchQuotation(id);
  };

  const handleDownloadPdf = async () => {
    if (!selectedId) {
      alert('กรุณาเลือกใบเสนอราคาก่อนดาวน์โหลด / Please select a quotation before downloading');
      return;
    }
    try {
      const blob = await downloadQuotationPdf(selectedId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quotation-${selectedId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Store handles error state
    }
  };

  const handleShareLink = async () => {
    if (!selectedId) {
      alert('กรุณาเลือกใบเสนอราคาก่อนแชร์ / Please select a quotation before sharing');
      return;
    }
    try {
      await generateShareLink(selectedId);
    } catch (err) {
      // Store handles error state
    }
  };

  const handleCopyShareLink = () => {
    if (!shareLink) return;
    if (!navigator.clipboard) {
      alert('เบราว์เซอร์ไม่รองรับการคัดลอกอัตโนมัติ / Clipboard not supported');
      return;
    }
    navigator.clipboard
      .writeText(shareLink)
      .then(() => alert('คัดลอกลิงก์เรียบร้อย / Share link copied'))
      .catch(() => alert('ไม่สามารถคัดลอกลิงก์ได้ / Unable to copy link'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-emerald-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pb-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">สร้างใบเสนอราคา / Create Quotation</h1>
            <p className="text-slate-500 mt-1">จัดการใบเสนอราคาของคุณ ดู แก้ไข และส่งออกได้ในที่เดียว</p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 transition-colors"
          >
            + ใบเสนอราคาใหม่ / New Quotation
          </button>
        </div>

        {error && (
          <ErrorMessage message={error} onDismiss={clearError} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <section className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-700">รายการใบเสนอราคา / Quotations</h2>
              {isListing && <LoadingSpinner size="sm" />}
            </div>
            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
              {quotations.length === 0 && !isListing ? (
                <p className="text-sm text-slate-500 text-center py-10">
                  ยังไม่มีใบเสนอราคา / No quotations yet
                </p>
              ) : (
                quotations.map((quotation) => (
                  <button
                    key={quotation.id}
                    type="button"
                    onClick={() => handleSelectQuotation(quotation.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      selectedId === quotation.id
                        ? 'border-emerald-400 bg-emerald-50/80'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-slate-500">ลูกค้า / Client</p>
                        <p className="font-semibold text-slate-700">{quotation.clientName}</p>
                      </div>
                      <span className="text-sm text-slate-400">
                        {quotation.createdAt
                          ? new Date(quotation.createdAt).toLocaleDateString('th-TH')
                          : ''}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">บริษัท / Company</p>
                    <p className="text-sm text-slate-700 truncate">{quotation.companyName}</p>
                    <p className="text-md font-semibold text-emerald-600 mt-3">
                      {formatCurrency(quotation.total)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-md p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600">ชื่อบริษัท / Company</label>
                  <input
                    type="text"
                    value={formState.companyName}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, companyName: event.target.value }))
                    }
                    className="mt-1 border border-slate-200 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="เช่น บริษัท เอ บี ซี จำกัด"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">ลูกค้า / Client</label>
                  <input
                    type="text"
                    value={formState.clientName}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, clientName: event.target.value }))
                    }
                    className="mt-1 border border-slate-200 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="ชื่อผู้ติดต่อ / Company Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600">หมายเหตุ / Note</label>
                <textarea
                  value={formState.note}
                  onChange={(event) => setFormState((prev) => ({ ...prev, note: event.target.value }))}
                  className="mt-1 border border-slate-200 rounded-lg w-full p-3 h-24 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="เงื่อนไขการชำระเงิน ข้อเสนอเพิ่มเติม เป็นต้น"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-slate-700">รายการสินค้า / Products</h2>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    + เพิ่มรายการ / Add Item
                  </button>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3 text-left font-medium text-slate-600">รายการ / Description</th>
                        <th className="p-3 text-right font-medium text-slate-600 w-24">จำนวน / Qty</th>
                        <th className="p-3 text-right font-medium text-slate-600 w-32">ราคาต่อหน่วย / Unit Price</th>
                        <th className="p-3 text-right font-medium text-slate-600 w-32">รวม / Total</th>
                        <th className="p-3 w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {formState.items.map((item) => {
                        const lineTotal = item.qty * item.unitPrice;
                        return (
                          <tr key={item.id} className="border-t border-slate-200">
                            <td className="p-2">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(event) => handleItemChange(item.id, 'description', event.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                placeholder="สินค้า/บริการ"
                              />
                            </td>
                            <td className="p-2 text-right">
                              <input
                                type="number"
                                min={0}
                                value={item.qty}
                                onChange={(event) => handleItemChange(item.id, 'qty', event.target.value)}
                                className="w-20 border border-slate-200 rounded-lg p-2 text-right focus:outline-none focus:ring-2 focus:ring-emerald-200"
                              />
                            </td>
                            <td className="p-2 text-right">
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(event) => handleItemChange(item.id, 'unitPrice', event.target.value)}
                                className="w-24 border border-slate-200 rounded-lg p-2 text-right focus:outline-none focus:ring-2 focus:ring-emerald-200"
                              />
                            </td>
                            <td className="p-2 text-right text-slate-700">{formatCurrency(lineTotal)}</td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-600"
                                aria-label="Remove item"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center space-x-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={formState.includeVat}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, includeVat: event.target.checked }))
                    }
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <span>ราคารวม VAT / Include VAT (7%)</span>
                </label>
                <div className="text-right">
                  <p className="text-slate-500">ยอดรวม (Subtotal): <span className="font-semibold text-slate-700">{formatCurrency(subtotal)}</span></p>
                  <p className="text-slate-500">VAT (7%): <span className="font-semibold text-slate-700">{formatCurrency(vatAmount)}</span></p>
                  <p className="text-xl font-semibold text-slate-800">รวมสุทธิ (Total): {formatCurrency(totalAmount)}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isPdfLoading}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-60"
                >
                  {isPdfLoading ? 'กำลังดาวน์โหลด...' : 'Download PDF'}
                </button>
                <button
                  type="button"
                  onClick={handleShareLink}
                  disabled={isShareLoading}
                  className="px-4 py-2 rounded border border-emerald-400 text-emerald-600 hover:bg-emerald-50 disabled:opacity-60"
                >
                  {isShareLoading ? 'กำลังสร้างลิงก์...' : 'Share Link'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSaving ? 'กำลังบันทึก...' : isEditing ? 'Update Quotation' : 'Save Quotation'}
                </button>
              </div>

              {shareLink && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700">ลิงก์สำหรับแชร์ / Shareable Link</p>
                    <p className="text-sm font-medium text-emerald-900 break-words">{shareLink}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    Copy
                  </button>
                </div>
              )}

              {isFetchingDetail && (
                <div className="flex items-center space-x-2 text-slate-500">
                  <LoadingSpinner size="sm" />
                  <span>กำลังโหลดข้อมูลใบเสนอราคา...</span>
                </div>
              )}
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

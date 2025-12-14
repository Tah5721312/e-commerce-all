'use client';

import { useEffect,useState } from 'react';
import { FiX } from 'react-icons/fi';

interface OrderModalProps {
  orderNumber: string;
  currentStatus: string;
  onClose: () => void;
  onUpdate: (orderNumber: string, status: string) => void;
}

const OrderModal = ({ orderNumber, currentStatus, onClose, onUpdate }: OrderModalProps) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onUpdate(orderNumber, status);
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'قيد الانتظار / Pending', color: 'text-yellow-600' },
    { value: 'processing', label: 'قيد المعالجة / Processing', color: 'text-blue-600' },
    { value: 'shipped', label: 'تم الشحن / Shipped', color: 'text-purple-600' },
    { value: 'delivered', label: 'تم التسليم / Delivered', color: 'text-green-600' },
    { value: 'cancelled', label: 'ملغي / Cancelled', color: 'text-red-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              تحديث حالة الطلب / Update Order Status
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">رقم الطلب / Order Number:</p>
            <p className="font-semibold text-gray-900">{orderNumber}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة / Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء / Cancel
              </button>
              <button
                type="submit"
                disabled={loading || status === currentStatus}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ / Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;


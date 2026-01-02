'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { Eye, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

interface Order {
  orderId: number
  orderNumber: string
  customerName?: string
  customerPhone?: string
  orderStatus: string
  totalAmount: number
  itemCount: number
  orderDate: string
}

interface OrderDetail extends Order {
  customerWhatsApp?: string
  customerAddress?: string
  paymentStatus: string
  paymentMethod?: string
  subTotal: number
  taxAmount: number
  notes?: string
  orderItems: Array<{
    orderItemId: number
    productCode: string
    productNameEn: string
    productNameAr: string
    size: string
    unitPrice: number
    quantity: number
    itemTotal: number
    flavor?: string
  }>
}

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Completed',
  'Cancelled',
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [statusFilter])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const data =
        statusFilter === 'all'
          ? await apiService.getOrders()
          : await apiService.getOrdersByStatus(statusFilter)
      setOrders(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = async (orderId: number) => {
    try {
      const orderDetail = await apiService.getOrder(orderId)
      setSelectedOrder(orderDetail)
      setShowDetailModal(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order details')
    }
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus)
      loadOrders()
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus })
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Confirmed':
        return 'bg-blue-100 text-blue-700'
      case 'Preparing':
        return 'bg-purple-100 text-purple-700'
      case 'Ready':
        return 'bg-green-100 text-green-700'
      case 'Completed':
        return 'bg-green-200 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={16} />
      case 'Cancelled':
        return <XCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-heading font-bold text-primary">Orders Management</h2>
        <p className="text-coffee/70 mt-1">View and manage customer orders</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <XCircle size={20} />
          </button>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-primary">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Orders</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                  Order Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-coffee/70">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-primary">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-primary">
                          {order.customerName || 'Guest'}
                        </p>
                        {order.customerPhone && (
                          <p className="text-sm text-coffee/70">{order.customerPhone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-coffee/70">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-coffee/70">{order.itemCount} items</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary">
                        {order.totalAmount.toLocaleString()} IQD
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(order.orderId)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          className="px-3 py-1 text-sm border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-2xl font-heading font-bold text-primary">
                  Order {selectedOrder.orderNumber}
                </h3>
                <p className="text-sm text-coffee/70 mt-1">
                  {new Date(selectedOrder.orderDate).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedOrder(null)
                }}
                className="text-coffee/70 hover:text-coffee"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-coffee/70 mb-2">Customer Information</h4>
                  <div className="space-y-1">
                    <p className="text-primary font-semibold">
                      {selectedOrder.customerName || 'Guest'}
                    </p>
                    {selectedOrder.customerPhone && (
                      <p className="text-sm text-coffee/70">Phone: {selectedOrder.customerPhone}</p>
                    )}
                    {selectedOrder.customerWhatsApp && (
                      <p className="text-sm text-coffee/70">WhatsApp: {selectedOrder.customerWhatsApp}</p>
                    )}
                    {selectedOrder.customerAddress && (
                      <p className="text-sm text-coffee/70">Address: {selectedOrder.customerAddress}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-coffee/70 mb-2">Order Status</h4>
                  <div className="space-y-2">
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleStatusChange(selectedOrder.orderId, e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg font-semibold ${getStatusColor(
                        selectedOrder.orderStatus
                      )} border-0 focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <div className="text-sm">
                      <span className="text-coffee/70">Payment: </span>
                      <span className="font-semibold text-primary">{selectedOrder.paymentStatus}</span>
                      {selectedOrder.paymentMethod && (
                        <span className="text-coffee/70"> ({selectedOrder.paymentMethod})</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-semibold text-coffee/70 mb-4">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.orderItems.map((item) => (
                    <div
                      key={item.orderItemId}
                      className="flex items-center justify-between p-4 bg-cream/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-primary">{item.productNameEn}</p>
                        <p className="text-sm text-coffee/70">{item.productNameAr}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-coffee/70">
                          <span>Size: {item.size}</span>
                          <span>Qty: {item.quantity}</span>
                          {item.flavor && <span>Flavor: {item.flavor}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          {item.itemTotal.toLocaleString()} IQD
                        </p>
                        <p className="text-sm text-coffee/70">
                          {item.unitPrice.toLocaleString()} IQD × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-coffee/70">
                      <span>Subtotal:</span>
                      <span>{selectedOrder.subTotal.toLocaleString()} IQD</span>
                    </div>
                    <div className="flex justify-between text-coffee/70">
                      <span>Tax:</span>
                      <span>{selectedOrder.taxAmount.toLocaleString()} IQD</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span>{selectedOrder.totalAmount.toLocaleString()} IQD</span>
                    </div>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div className="mt-4 p-4 bg-cream/50 rounded-lg">
                    <p className="text-sm font-semibold text-coffee/70 mb-1">Notes:</p>
                    <p className="text-sm text-coffee/80">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin, CreditCard, Copy, Check } from 'lucide-react';
import { ordersAPI } from '../utils/api';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_CONFIG = {
  pending:    { icon: <Clock size={16}/>,        color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-950',   label: 'Pending' },
  processing: { icon: <Package size={16}/>,      color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-950',     label: 'Processing' },
  shipped:    { icon: <Truck size={16}/>,        color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950', label: 'Shipped' },
  delivered:  { icon: <CheckCircle size={16}/>,  color: 'text-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-950', label: 'Delivered' },
  cancelled:  { icon: <XCircle size={16}/>,      color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-950',       label: 'Cancelled' },
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    ordersAPI.getById(id).then(r => setOrder(r.data.order)).finally(() => setLoading(false));
  }, [id]);

  const copyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return (
    <div className="pt-24 pb-16"><div className="container-custom max-w-4xl space-y-4">
      {[200, 300, 200].map((h, i) => <div key={i} className="skeleton rounded" style={{ height: h }} />)}
    </div></div>
  );

  if (!order) return (
    <div className="pt-24 pb-16 text-center">
      <p className="text-[var(--text-muted)]">Order not found.</p>
      <Link to="/orders" className="btn-primary mt-4 inline-block">Back to Orders</Link>
    </div>
  );

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const stepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="pt-24 pb-16 bg-[var(--bg)]">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/orders" className="p-2 hover:bg-[var(--bg-card)] border border-[var(--border)] transition-colors" style={{ borderRadius: '2px' }}>
            <ChevronLeft size={18} strokeWidth={1.5} className="text-[var(--text-muted)]"/>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-bold text-[var(--text)] tracking-tight">
                Order <span className="font-mono text-accent-500">#{order._id?.slice(-8).toUpperCase()}</span>
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`} style={{ borderRadius: '2px' }}>
                {cfg.icon}{cfg.label}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        {!isCancelled && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 mb-4" style={{ borderRadius: '2px' }}>
            <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest mb-6">Order Progress</h3>
            <div className="flex items-center">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= stepIdx;
                const active = i === stepIdx;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 flex items-center justify-center border-2 transition-all ${
                        done ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white' : 'bg-[var(--bg)] border-[var(--border)]'
                      }`} style={{ borderRadius: '2px' }}>
                        {i < stepIdx ? (
                          <Check size={16} strokeWidth={2.5} className="text-white dark:text-[#111111]"/>
                        ) : active ? (
                          <div className={`${STATUS_CONFIG[step].color}`}>{STATUS_CONFIG[step].icon}</div>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)] font-bold">{i + 1}</span>
                        )}
                      </div>
                      <p className={`text-[10px] mt-2 font-semibold capitalize tracking-wide ${done ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                        {STATUS_CONFIG[step].label}
                      </p>
                      {order.timeline?.find(t => t.status === step) && (
                        <p className="text-[9px] text-[var(--text-muted)] mt-0.5">
                          {new Date(order.timeline.find(t => t.status === step).date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 transition-all ${i < stepIdx ? 'bg-[#111111] dark:bg-white' : 'bg-[var(--border)]'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tracking Info */}
        {order.trackingNumber && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-4 mb-4 flex items-center justify-between" style={{ borderRadius: '2px' }}>
            <div className="flex items-center gap-3">
              <Truck size={18} strokeWidth={1.5} className="text-[var(--text-muted)]"/>
              <div>
                <p className="text-xs font-bold text-[var(--text)]">{order.carrier || 'Courier'} Tracking</p>
                <p className="font-mono text-sm text-accent-500 font-semibold">{order.trackingNumber}</p>
              </div>
            </div>
            <button onClick={copyTracking} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors border border-[var(--border)] px-3 py-1.5" style={{ borderRadius: '2px' }}>
              {copied ? <><Check size={12}/> Copied!</> : <><Copy size={12}/> Copy</>}
            </button>
          </div>
        )}

        {order.estimatedDelivery && (
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-3 mb-4 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2" style={{ borderRadius: '2px' }}>
            <CheckCircle size={14}/>
            Estimated delivery: <strong>{new Date(order.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {/* Items + Timeline */}
          <div className="md:col-span-2 space-y-4">
            {/* Items */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)]" style={{ borderRadius: '2px' }}>
              <div className="px-5 py-3.5 border-b border-[var(--border)]">
                <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest">Items ({order.items?.length})</h3>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain bg-gray-50 dark:bg-gray-900 border border-[var(--border)] flex-shrink-0" style={{ borderRadius: '2px' }}/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{item.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity} × NPR {item.price?.toLocaleString()}</p>
                    </div>
                    <p className="font-bold text-sm text-[var(--text)]">NPR {(item.price * item.quantity)?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {order.timeline?.length > 0 && (
              <div className="bg-[var(--bg-card)] border border-[var(--border)]" style={{ borderRadius: '2px' }}>
                <div className="px-5 py-3.5 border-b border-[var(--border)]">
                  <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest">Order Timeline</h3>
                </div>
                <div className="p-5 space-y-4">
                  {[...order.timeline].reverse().map((event, i) => {
                    const ecfg = STATUS_CONFIG[event.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 ${ecfg.bg} ${ecfg.color}`} style={{ borderRadius: '2px' }}>
                          {ecfg.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[var(--text)] capitalize">{ecfg.label}</p>
                          <p className="text-xs text-[var(--text-muted)]">{event.message}</p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                            {new Date(event.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shipping + Payment */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] p-5" style={{ borderRadius: '2px' }}>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} strokeWidth={1.5} className="text-[var(--text-muted)]"/>
                  <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest">Shipping Address</h4>
                </div>
                <div className="text-xs text-[var(--text-muted)] space-y-1">
                  <p className="font-semibold text-[var(--text)]">{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.phone}</p>
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                </div>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] p-5" style={{ borderRadius: '2px' }}>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={14} strokeWidth={1.5} className="text-[var(--text-muted)]"/>
                  <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest">Payment</h4>
                </div>
                <p className="text-xs text-[var(--text-muted)] capitalize">{order.paymentMethod}</p>
                <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`} style={{ borderRadius: '2px' }}>
                  {order.isPaid ? <><Check size={10}/> Paid</> : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-5 h-fit sticky top-24" style={{ borderRadius: '2px' }}>
            <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest mb-4">Order Summary</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[var(--text-muted)]"><span>Subtotal</span><span>NPR {order.subtotal?.toLocaleString()}</span></div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? <span className="text-emerald-500 font-semibold">FREE</span> : `NPR ${order.shippingPrice}`}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]"><span>Tax (13%)</span><span>NPR {order.taxPrice?.toLocaleString()}</span></div>
            </div>
            <div className="border-t border-[var(--border)] mt-4 pt-4 flex justify-between font-bold text-[var(--text)]">
              <span>Total</span><span>NPR {order.totalPrice?.toLocaleString()}</span>
            </div>
            <Link to="/products" className="btn-primary w-full mt-5 text-center text-xs py-2.5 tracking-wide block">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

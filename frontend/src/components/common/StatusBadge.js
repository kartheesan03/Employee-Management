import React from 'react';
import './Common.css';

const statusColors = {
  in_stock: 'success',
  active: 'success',
  approved: 'success',
  present: 'success',
  paid: 'success',
  received: 'success',
  closed_won: 'success',
  full_time: 'success',

  low_stock: 'warning',
  pending: 'warning',
  draft: 'warning',
  partial: 'warning',
  late: 'warning',
  half_day: 'warning',
  on_leave: 'warning',
  prospect: 'warning',
  negotiation: 'warning',
  proposal: 'warning',
  qualified: 'warning',

  out_of_stock: 'danger',
  rejected: 'danger',
  cancelled: 'danger',
  absent: 'danger',
  unpaid: 'danger',
  inactive: 'danger',
  blacklisted: 'danger',
  terminated: 'danger',
  resigned: 'danger',
  closed_lost: 'danger',
  churned: 'danger',

  new: 'info',
  contacted: 'info',
  lead: 'info',
  ordered: 'info',
  contract: 'info',
  part_time: 'info',
  intern: 'info',
};

const StatusBadge = ({ status }) => {
  const color = statusColors[status] || 'secondary';
  const label = status?.replace(/_/g, ' ');

  return (
    <span className={`status-badge status-${color}`}>
      {label}
    </span>
  );
};

export default StatusBadge;

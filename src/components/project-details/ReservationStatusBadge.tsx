
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, HourglassIcon, X } from 'lucide-react';

interface ReservationStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | null;
}

const ReservationStatusBadge: React.FC<ReservationStatusBadgeProps> = ({ status }) => {
  if (!status) return null;
  
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1 flex items-center gap-1">
          <HourglassIcon size={14} /> Սպասում է հաստատման
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 px-3 py-1 flex items-center gap-1">
          <CheckCircle size={14} /> Հաստատված է
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 px-3 py-1 flex items-center gap-1">
          <X size={14} /> Մերժված է
        </Badge>
      );
    default:
      return null;
  }
};

export default ReservationStatusBadge;

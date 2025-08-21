export interface Capture {
  id: string;
  orderId: string;
  type: 'delivery' | 'signature' | 'document' | 'return' | 'incident';
  imageUrl: string;
  thumbnailUrl?: string;
  status: 'pending' | 'verified' | 'rejected' | 'incomplete';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  metadata?: {
    deviceInfo?: string;
    appVersion?: string;
    networkType?: string;
  };
  notes?: string;
  rejectionReason?: string;
  capturedBy: string;
  capturedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  order?: any;
}

export const CaptureTypeLabels = {
  delivery: 'Entrega',
  signature: 'Firma',
  document: 'Albarán',
  return: 'Devolución',
  incident: 'Incidente'
};

export const CaptureStatusLabels = {
  pending: 'Pendiente',
  verified: 'Entregado',
  rejected: 'Con incidencia',
  incomplete: 'Incompleto'
};

export interface CaptureStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  incomplete: number;
  todayCount: number;
  weekCount: number;
}

export interface CaptureImage {
  id: string;
  url: string;
  thumbnail?: string;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'failed';
  uploadedAt?: Date | string;
  localPath?: string;
  size?: number;
  type?: string;
}

export interface OrderCapture {
  orderId: string;
  images: CaptureImage[];
  captureStatus: 'pending' | 'partial' | 'success' | 'failed';
  lastModified: Date | string;
  notes?: string;
  signature?: string;
}

export interface CaptureFilters {
  status?: string[];
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
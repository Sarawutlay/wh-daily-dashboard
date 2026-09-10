// ----- Core data model for the WH Daily Dashboard -----

export interface StaffAbsence {
  name: string;
  reason: string;
}

export interface Manpower {
  total: number;
  present: number;
  absent: number;
  members: string[]; // ทีมงานคลังสินค้า (9 คน)
  absences: StaffAbsence[]; // เหตุผลการลา
  note: string;
}

export interface ShiftTransfer {
  shift: "กลางวัน" | "กลางคืน";
  pallets: number; // บาน
  rings: number | null; // วง (คืนอาจไม่มี)
}

export interface ProductionTransfer {
  date: string; // วันที่รับโอน เช่น 22/7/2569
  shifts: ShiftTransfer[];
}

export interface YesterdayPerformance {
  date: string;
  receivingSupplierCount: number; // รับของจาก Supplier (ราย)
  issuedToProductionSlips: number; // เบิกจ่ายให้ฝ่ายผลิต (ใบเบิก)
  shipping: {
    loadedTrucks: number; // จัด/โหลดรถใหญ่ (คัน)
    crc: number;
    samyaek: number; // สยามโกล (นิครใหญ่)
    others: number;
    smallTrucks: number; // จัดรถเล็ก (คัน)
  };
  pickingVolumePallets: number; // บาน
  pickingVolumeRings: number; // วง
  note: string;
}

export interface OTRow {
  type: string; // รายเดือน / รายวัน
  people: number;
  timeRange: string; // เวลา
  hours: number; // รวม (ชม.)
  task: string; // งาน
}

export interface ReceivingPlanItem {
  supplierCount: number; // รับของจาก Supplier (ราย)
  issuedToProductionSlips: number | "N/A";
}

export interface ShippingPlanRow {
  label: string; // ลูกค้า CRC / สยามโกล (นิครใหญ่) / จัดรถเล็ก
  trucks: number; // คัน
  pallets: number | null; // บาน
  rings: number | null; // วง
}

export interface TodaysPlan {
  date: string;
  loadTrucksPlanned: number; // จัด/โหลดรถใหญ่ (คัน) รวม
  receiving: ReceivingPlanItem;
  shipping: ShippingPlanRow[];
  plannedPickingPallets: number;
  plannedPickingRings: number;
  plannedOT: OTRow[];
}

export interface DailyRecord {
  id: string; // date key, e.g. 2026-07-23
  displayDate: string; // 23/7/2569 (Thai Buddhist era)
  manpower: Manpower;
  productionTransfer: ProductionTransfer;
  yesterday: YesterdayPerformance;
  otSummaryYesterday: OTRow[];
  todaysPlan: TodaysPlan;
  focusToday: string[];
  updatedAt: string; // ISO timestamp
}

export const FOCUS_DEFAULT = [
  "ความปลอดภัยในการทำงาน",
  "คุณภาพสินค้า",
  "ส่งมอบตรงเวลา",
  "ลดความสูญเสีย",
];

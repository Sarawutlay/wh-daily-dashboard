import { DailyRecord, FOCUS_DEFAULT } from "./types";

const STORAGE_KEY = "wh-daily-dashboard.records.v1";

export function loadRecords(): Record<string, DailyRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedRecords();
    const parsed = JSON.parse(raw) as Record<string, DailyRecord>;
    if (!parsed || Object.keys(parsed).length === 0) return seedRecords();
    return parsed;
  } catch {
    return seedRecords();
  }
}

export function saveRecords(records: Record<string, DailyRecord>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function saveRecord(record: DailyRecord): Record<string, DailyRecord> {
  const all = loadRecords();
  all[record.id] = record;
  saveRecords(all);
  return all;
}

export function deleteRecord(id: string): Record<string, DailyRecord> {
  const all = loadRecords();
  delete all[id];
  saveRecords(all);
  return all;
}

export function newBlankRecord(id: string, displayDate: string): DailyRecord {
  return {
    id,
    displayDate,
    manpower: {
      total: 9,
      present: 9,
      absent: 0,
      members: [
        "อัครวัฒน์",
        "ธงชัย",
        "ธงไชย",
        "สุภัย",
        "ชานน",
        "วีรวัฒน์",
        "ขวัญชัย",
        "ศุภวัฒน์",
        "รัตนา",
      ],
      absences: [],
      note: "",
    },
    productionTransfer: {
      date: "",
      shifts: [
        { shift: "กลางวัน", pallets: 0, rings: 0 },
        { shift: "กลางคืน", pallets: 0, rings: null },
      ],
    },
    yesterday: {
      date: "",
      receivingSupplierCount: 0,
      issuedToProductionSlips: 0,
      shipping: {
        loadedTrucks: 0,
        crc: 0,
        samyaek: 0,
        others: 0,
        smallTrucks: 0,
      },
      pickingVolumePallets: 0,
      pickingVolumeRings: 0,
      note: "",
    },
    otSummaryYesterday: [],
    todaysPlan: {
      date: displayDate,
      loadTrucksPlanned: 0,
      receiving: { supplierCount: 0, issuedToProductionSlips: "N/A" },
      shipping: [],
      plannedPickingPallets: 0,
      plannedPickingRings: 0,
      plannedOT: [],
    },
    focusToday: FOCUS_DEFAULT,
    updatedAt: new Date().toISOString(),
  };
}

// Seed with the sample data shown on the reference whiteboard (23/7/2569)
// so the dashboard has something meaningful to display on first run.
function seedRecords(): Record<string, DailyRecord> {
  const record: DailyRecord = {
    id: "2026-07-23",
    displayDate: "23/7/2569",
    manpower: {
      total: 9,
      present: 9,
      absent: 0,
      members: [
        "อัครวัฒน์",
        "ธงชัย",
        "ธงไชย",
        "สุภัย",
        "ชานน",
        "วีรวัฒน์",
        "ขวัญชัย",
        "ศุภวัฒน์",
        "รัตนา",
      ],
      absences: [],
      note: "-",
    },
    productionTransfer: {
      date: "22/7/2569",
      shifts: [
        { shift: "กลางวัน", pallets: 285, rings: 350 },
        { shift: "กลางคืน", pallets: 201, rings: null },
      ],
    },
    yesterday: {
      date: "22/7/2569",
      receivingSupplierCount: 3,
      issuedToProductionSlips: 4,
      shipping: {
        loadedTrucks: 1,
        crc: 0,
        samyaek: 1,
        others: 0,
        smallTrucks: 4,
      },
      pickingVolumePallets: 803,
      pickingVolumeRings: 762,
      note: "ลงตู้โครงช่วงเช้า",
    },
    otSummaryYesterday: [
      { type: "รายเดือน", people: 3, timeRange: "17:30-19:30", hours: 6, task: "จัดงานรถเล็ก/แกะงาน" },
      { type: "รายวัน", people: 4, timeRange: "17:30-19:30", hours: 10, task: "จัดงานรถเล็ก" },
      { type: "รายวัน", people: 1, timeRange: "17:30-20:30", hours: 3, task: "โหลดรถใหญ่" },
    ],
    todaysPlan: {
      date: "23/7/2569",
      loadTrucksPlanned: 2,
      receiving: { supplierCount: 2, issuedToProductionSlips: "N/A" },
      shipping: [
        { label: "ลูกค้า CRC", trucks: 1, pallets: 282, rings: 188 },
        { label: "สยามโกล (นิครใหญ่)", trucks: 1, pallets: 620, rings: 600 },
        { label: "จัดรถเล็ก", trucks: 4, pallets: 341, rings: 275 },
      ],
      plannedPickingPallets: 1243,
      plannedPickingRings: 1063,
      plannedOT: [
        { type: "รายเดือน", people: 3, timeRange: "17:30-19:30", hours: 6, task: "จัดงานรถเล็ก/แกะงาน" },
        { type: "รายวัน", people: 4, timeRange: "17:30-19:30", hours: 10, task: "จัดงานรถเล็ก" },
        { type: "รายวัน", people: 1, timeRange: "17:30-20:30", hours: 3, task: "โหลดรถใหญ่" },
      ],
    },
    focusToday: FOCUS_DEFAULT,
    updatedAt: new Date().toISOString(),
  };
  const seeded = { [record.id]: record };
  saveRecords(seeded);
  return seeded;
}

export function sumOT(rows: OTRowLike[]): number {
  return rows.reduce((acc, r) => acc + (r.hours || 0), 0);
}

interface OTRowLike {
  hours: number;
}

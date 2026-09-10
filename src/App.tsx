import React, { useMemo, useRef, useState } from "react";
import { DailyRecord } from "./lib/types";
import { deleteRecord, loadRecords, newBlankRecord, saveRecord } from "./lib/storage";
import { exportNodeAsJpg } from "./lib/exportImage";
import { Dashboard } from "./components/Dashboard";
import { EntryForm } from "./components/EntryForm";
import { IconCalendar, IconClipboard, IconDownload, IconSpinner, IconWarehouse } from "./components/Icons";

type View = "dashboard" | "entry";

function todayIsoKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function toThaiDisplayDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const yearBE = d.getFullYear() + 543;
  return `${day}/${month}/${yearBE}`;
}

export default function App() {
  const [records, setRecords] = useState<Record<string, DailyRecord>>(() => loadRecords());
  const sortedIds = useMemo(() => Object.keys(records).sort().reverse(), [records]);
  const [activeId, setActiveId] = useState<string>(() => {
    const initial = loadRecords();
    const ids = Object.keys(initial).sort().reverse();
    return ids[0] ?? "";
  });
  const [view, setView] = useState<View>("dashboard");
  const [exporting, setExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const activeRecord = records[activeId];

  async function handleExportJpg() {
    if (!dashboardRef.current || !activeRecord || exporting) return;
    setExporting(true);
    try {
      const dateSlug = activeRecord.displayDate.replace(/\//g, "-");
      await exportNodeAsJpg(dashboardRef.current, {
        fileName: `WH-Daily-Dashboard-${dateSlug}`,
        backgroundColor: "#EEF1F6",
        scale: 2,
      });
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถ Export รูปภาพได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setExporting(false);
    }
  }

  function handleSave(rec: DailyRecord) {
    const updated = saveRecord(rec);
    setRecords(updated);
    setActiveId(rec.id);
    setView("dashboard");
  }

  function handleCreateToday() {
    const id = todayIsoKey();
    if (records[id]) {
      setActiveId(id);
      setView("entry");
      return;
    }
    const blank = newBlankRecord(id, toThaiDisplayDate(id));
    setRecords((r) => ({ ...r, [id]: blank }));
    setActiveId(id);
    setView("entry");
  }

  function handleDelete(id: string) {
    if (!confirm(`ลบข้อมูลวันที่ ${records[id]?.displayDate ?? id} ?`)) return;
    const updated = deleteRecord(id);
    setRecords(updated);
    const ids = Object.keys(updated).sort().reverse();
    setActiveId(ids[0] ?? "");
  }

  return (
    <div className="min-h-screen bg-[#EEF1F6] pb-10">
      <header className="hatch sticky top-0 z-30 bg-ink shadow-panel no-print">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-amber">
              <IconWarehouse className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold leading-tight text-white sm:text-2xl">
                WH DAILY DASHBOARD
              </h1>
              <p className="text-[11px] font-medium tracking-wide text-white/60 sm:text-xs">
                คลังสินค้า · WAREHOUSE DAILY OPERATIONS
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5">
              <IconCalendar className="h-4 w-4 text-white/70" />
              <select
                value={activeId}
                onChange={(e) => setActiveId(e.target.value)}
                className="bg-transparent text-sm font-medium text-white outline-none [&>option]:text-ink"
              >
                {sortedIds.length === 0 && <option value="">ยังไม่มีข้อมูล</option>}
                {sortedIds.map((id) => (
                  <option key={id} value={id}>
                    {records[id].displayDate}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex overflow-hidden rounded-lg border border-white/15">
              <button
                onClick={() => setView("dashboard")}
                className={`px-3 py-1.5 text-[13px] font-semibold transition ${
                  view === "dashboard" ? "bg-amber text-ink" : "text-white/80 hover:bg-white/10"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => activeRecord && setView("entry")}
                disabled={!activeRecord}
                className={`px-3 py-1.5 text-[13px] font-semibold transition disabled:opacity-40 ${
                  view === "entry" ? "bg-amber text-ink" : "text-white/80 hover:bg-white/10"
                }`}
              >
                กรอกข้อมูล
              </button>
            </div>

            <button
              onClick={handleCreateToday}
              className="flex items-center gap-1.5 rounded-lg bg-rust px-3 py-1.5 text-[13px] font-semibold text-white transition hover:bg-rust/90"
            >
              <IconClipboard className="h-4 w-4" />
              บันทึกวันนี้
            </button>

            {activeRecord && view === "dashboard" && (
              <button
                onClick={handleExportJpg}
                disabled={exporting}
                className="flex items-center gap-1.5 rounded-lg bg-amber px-3 py-1.5 text-[13px] font-semibold text-ink transition hover:bg-amber/90 disabled:opacity-60"
              >
                {exporting ? (
                  <IconSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  <IconDownload className="h-4 w-4" />
                )}
                {exporting ? "กำลังสร้างรูป..." : "Export JPG"}
              </button>
            )}

            {activeRecord && (
              <button
                onClick={() => handleDelete(activeId)}
                className="rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-white/50 transition hover:bg-clay/20 hover:text-clay"
                title="ลบข้อมูลวันที่นี้"
              >
                ลบ
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-5">
        {!activeRecord ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-dock-300 bg-white/60 py-20 text-center">
            <IconWarehouse className="h-14 w-14 text-dock-300" />
            <div>
              <p className="text-lg font-semibold text-ink">ยังไม่มีข้อมูลรายวัน</p>
              <p className="mt-1 text-sm text-dock-500">เริ่มต้นบันทึกข้อมูลของวันนี้เพื่อดู Dashboard</p>
            </div>
            <button
              onClick={handleCreateToday}
              className="rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-panel transition hover:bg-dock-700"
            >
              + สร้างข้อมูลวันนี้
            </button>
          </div>
        ) : view === "dashboard" ? (
          <>
            <div className="mb-4 flex items-center justify-between no-print">
              <p className="text-sm text-dock-500">
                กำลังแสดงข้อมูลประจำวันที่{" "}
                <span className="font-num font-semibold text-ink">{activeRecord.displayDate}</span>
              </p>
              <button
                onClick={() => setView("entry")}
                className="text-sm font-semibold text-dock-500 underline-offset-2 hover:underline"
              >
                แก้ไขข้อมูลวันนี้ →
              </button>
            </div>
            <div ref={dashboardRef} className="bg-[#EEF1F6]">
              <div className="hatch mb-4 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-white">
                <div className="flex items-center gap-2.5">
                  <IconWarehouse className="h-6 w-6 text-amber" />
                  <div>
                    <h2 className="font-display text-base font-bold leading-tight sm:text-lg">
                      WH DAILY DASHBOARD
                    </h2>
                    <p className="text-[10px] text-white/60 sm:text-[11px]">WAREHOUSE DAILY DASHBOARD</p>
                  </div>
                </div>
                <div className="rounded-lg bg-white px-3 py-1.5 text-right">
                  <p className="text-[10px] font-medium text-dock-500">ประจำวันที่</p>
                  <p className="font-num text-base font-bold leading-none text-ink sm:text-lg">
                    {activeRecord.displayDate}
                  </p>
                </div>
              </div>
              <Dashboard record={activeRecord} />
            </div>
          </>
        ) : (
          <EntryForm record={activeRecord} onSave={handleSave} />
        )}
      </main>
    </div>
  );
}

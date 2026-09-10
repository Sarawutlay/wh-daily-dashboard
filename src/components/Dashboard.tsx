import React from "react";
import { DailyRecord } from "../lib/types";
import { Panel, Stat } from "./Panel";
import {
  IconPeople,
  IconTruckBig,
  IconTruckSmall,
  IconFactory,
  IconBox,
  IconClock,
  IconTarget,
} from "./Icons";

function sumHours(rows: { hours: number }[]): number {
  return rows.reduce((a, r) => a + (Number(r.hours) || 0), 0);
}

const KpiTile: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  unit: string;
  tone: string;
}> = ({ icon, label, value, unit, tone }) => (
  <div className="flex flex-col items-center gap-1.5 rounded-lg border border-dock-100 bg-paper/60 px-2 py-3 text-center">
    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tone}`}>{icon}</div>
    <span className="text-[11px] font-medium leading-tight text-dock-600/80">{label}</span>
    <span className="font-num text-xl font-bold leading-none text-ink">{value}</span>
    <span className="text-[10px] text-dock-500">{unit}</span>
  </div>
);

export const Dashboard: React.FC<{ record: DailyRecord }> = ({ record }) => {
  const { manpower, productionTransfer, yesterday, otSummaryYesterday, todaysPlan } = record;

  const transferTotals = productionTransfer.shifts.reduce(
    (acc, s) => ({
      pallets: acc.pallets + (s.pallets || 0),
      rings: acc.rings + (s.rings || 0),
    }),
    { pallets: 0, rings: 0 }
  );

  const yesterdayOtHours = sumHours(otSummaryYesterday);
  const shippingTotalTrucks =
    yesterday.shipping.loadedTrucks +
    yesterday.shipping.crc +
    yesterday.shipping.samyaek +
    yesterday.shipping.others;

  return (
    <div className="space-y-4">
      {/* Row 1: Manpower / Production Transfer / Executive KPI */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel title="Manpower Today" subtitle="พนักงานประจำวัน" accent="ink" className="lg:col-span-3">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="พนักงานทั้งหมด" value={manpower.total} unit="คน" tone="ink" />
            <Stat label="มา" value={manpower.present} unit="คน" tone="moss" />
            <Stat label="ไม่มา" value={manpower.absent} unit="คน" tone="clay" />
          </div>
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] font-semibold text-dock-600">สมาชิก (ทีมงานคลังสินค้า)</p>
            <ol className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[12px] text-ink/80">
              {manpower.members.map((m, i) => (
                <li key={i} className="truncate">
                  {i + 1}) {m}
                </li>
              ))}
            </ol>
          </div>
          {manpower.absences.length > 0 && (
            <div className="mt-3 rounded-md border border-clay/20 bg-clay/5 p-2">
              <p className="mb-1 text-[11px] font-semibold text-clay">เหตุผลการลา</p>
              {manpower.absences.map((a, i) => (
                <p key={i} className="text-[12px] text-ink/80">
                  {a.name} — {a.reason}
                </p>
              ))}
            </div>
          )}
          {manpower.note && manpower.note !== "-" && (
            <p className="mt-2 text-[11px] text-dock-500">โน้ต: {manpower.note}</p>
          )}
        </Panel>

        <Panel
          title="Production Transfer"
          subtitle="ยอดรับโอนจากผลิต"
          accent="dock"
          right={`เมื่อวาน ${productionTransfer.date || "-"}`}
          className="lg:col-span-3"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-dock-500">
                <th className="pb-1 text-left font-medium">กะ</th>
                <th className="pb-1 text-right font-medium">บาน</th>
                <th className="pb-1 text-right font-medium">วง</th>
              </tr>
            </thead>
            <tbody className="font-num">
              {productionTransfer.shifts.map((s, i) => (
                <tr key={i} className="border-t border-dock-100">
                  <td className="py-1.5 text-[13px] text-ink/80">กะ{s.shift}</td>
                  <td className="py-1.5 text-right font-semibold">{s.pallets.toLocaleString()}</td>
                  <td className="py-1.5 text-right font-semibold">{s.rings ?? "-"}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-dock-200">
                <td className="py-1.5 text-[13px] font-semibold text-ink">รวม</td>
                <td className="py-1.5 text-right text-base font-bold text-dock-500">
                  {transferTotals.pallets.toLocaleString()}
                </td>
                <td className="py-1.5 text-right text-base font-bold text-dock-500">
                  {transferTotals.rings.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-rust/10 px-3 py-2">
              <IconBox className="h-6 w-6 text-rust" />
              <div className="font-num">
                <div className="text-lg font-bold leading-none text-rust">{transferTotals.pallets.toLocaleString()}</div>
                <div className="text-[10px] text-rust/70">บาน (รวม)</div>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-dock-500/10 px-3 py-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dock-500 text-dock-500">
                <span className="h-2 w-2 rounded-full bg-dock-500" />
              </span>
              <div className="font-num">
                <div className="text-lg font-bold leading-none text-dock-500">{transferTotals.rings.toLocaleString()}</div>
                <div className="text-[10px] text-dock-500/70">วง (รวม)</div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Executive Summary" subtitle="KPI ภาพรวมวันนี้" accent="ink" className="lg:col-span-6">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            <KpiTile
              icon={<IconPeople className="h-5 w-5 text-white" />}
              label="Manpower"
              value={`${manpower.present}/${manpower.total}`}
              unit="คน"
              tone="bg-dock-600"
            />
            <KpiTile
              icon={<IconTruckSmall className="h-5 w-5 text-white" />}
              label="รับจาก Supplier"
              value={yesterday.receivingSupplierCount}
              unit="ราย"
              tone="bg-moss"
            />
            <KpiTile
              icon={<IconFactory className="h-5 w-5 text-white" />}
              label="รับโอนจากผลิต"
              value={`${transferTotals.pallets}/${transferTotals.rings}`}
              unit="บาน/วง"
              tone="bg-rust"
            />
            <KpiTile
              icon={<IconTruckBig className="h-5 w-5 text-white" />}
              label="รถใหญ่ (วันนี้)"
              value={todaysPlan.loadTrucksPlanned}
              unit="คัน"
              tone="bg-amber"
            />
            <KpiTile
              icon={<IconTruckSmall className="h-5 w-5 text-white" />}
              label="รถเล็ก (วันนี้)"
              value={todaysPlan.shipping.find((s) => s.label.includes("รถเล็ก"))?.trucks ?? 0}
              unit="คัน"
              tone="bg-dock-400"
            />
            <KpiTile
              icon={<IconClock className="h-5 w-5 text-white" />}
              label="OT (วันนี้)"
              value={sumHours(todaysPlan.plannedOT)}
              unit="ชม."
              tone="bg-clay"
            />
          </div>
          <div className="mt-2 rounded-lg border border-dock-100 bg-paper/60 px-3 py-2 text-center">
            <span className="text-[11px] font-medium text-dock-600/80">เตรียมสินค้า (วันนี้) </span>
            <span className="font-num font-bold text-ink">
              {todaysPlan.plannedPickingPallets.toLocaleString()}/{todaysPlan.plannedPickingRings.toLocaleString()}
            </span>
            <span className="text-[11px] text-dock-500"> บาน/วง</span>
          </div>
        </Panel>
      </div>

      {/* Row 2: Yesterday Performance / Today's Plan */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          title="Yesterday Performance"
          subtitle="ผลปฏิบัติงานเมื่อวาน"
          accent="moss"
          right={yesterday.date}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-dock-100 p-3">
              <p className="mb-2 text-[12px] font-semibold text-moss">Receiving / Production Support</p>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink/70">รับของจาก Supplier</span>
                <span className="font-num font-bold">{yesterday.receivingSupplierCount} ราย</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[13px]">
                <span className="text-ink/70">เบิกจ่ายให้ฝ่ายผลิต</span>
                <span className="font-num font-bold">{yesterday.issuedToProductionSlips} ใบเบิก</span>
              </div>
            </div>
            <div className="rounded-lg border border-dock-100 p-3">
              <p className="mb-2 text-[12px] font-semibold text-moss">Shipping</p>
              <ul className="space-y-1 text-[13px]">
                <li className="flex justify-between">
                  <span className="text-ink/70">จัด/โหลดรถใหญ่</span>
                  <span className="font-num font-bold">{yesterday.shipping.loadedTrucks} คัน</span>
                </li>
                <li className="flex justify-between pl-2">
                  <span className="text-ink/60">- ลูกค้า CRC</span>
                  <span className="font-num">{yesterday.shipping.crc} คัน</span>
                </li>
                <li className="flex justify-between pl-2">
                  <span className="text-ink/60">- สยามโกล (นิครใหญ่)</span>
                  <span className="font-num">{yesterday.shipping.samyaek} คัน</span>
                </li>
                <li className="flex justify-between pl-2">
                  <span className="text-ink/60">- อื่นๆ</span>
                  <span className="font-num">{yesterday.shipping.others || "-"}</span>
                </li>
                <li className="flex justify-between border-t border-dock-100 pt-1">
                  <span className="text-ink/70">จัดรถเล็ก</span>
                  <span className="font-num font-bold">{yesterday.shipping.smallTrucks} คัน</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-dock-100 p-3">
              <p className="mb-2 text-[12px] font-semibold text-moss">หมายเหตุ</p>
              <p className="text-[13px] text-ink/70">{yesterday.note || "-"}</p>
              <p className="mt-2 text-[11px] text-dock-500">
                รวมรถออก {shippingTotalTrucks + yesterday.shipping.smallTrucks} คัน
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-dock-100 p-3">
              <p className="mb-2 text-[12px] font-semibold text-moss">Picking / Loading Volume</p>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="บาน" value={yesterday.pickingVolumePallets.toLocaleString()} tone="moss" size="lg" />
                <Stat label="วง" value={yesterday.pickingVolumeRings.toLocaleString()} tone="moss" size="lg" />
              </div>
            </div>
            <div className="rounded-lg border border-dock-100 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[12px] font-semibold text-moss">OT Summary</p>
                <span className="font-num text-sm font-bold text-moss">{yesterdayOtHours} ชม.</span>
              </div>
              <div className="space-y-1 text-[12px]">
                {otSummaryYesterday.length === 0 && <p className="text-ink/50">ไม่มีข้อมูล</p>}
                {otSummaryYesterday.map((r, i) => (
                  <div key={i} className="border-t border-dock-100 pt-1 first:border-t-0 first:pt-0">
                    <div className="flex justify-between gap-2">
                      <span className="truncate text-ink/70">
                        {r.type} · {r.people} คน · {r.timeRange}
                      </span>
                      <span className="font-num shrink-0 font-semibold">{r.hours} ชม.</span>
                    </div>
                    {r.task && <p className="mt-0.5 text-[11px] text-dock-500">งาน: {r.task}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Today's Plan" subtitle="แผนงานวันนี้" accent="dock" right={todaysPlan.date}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-dock-100 p-3">
              <p className="mb-2 text-[12px] font-semibold text-dock-500">Receiving / Production Support</p>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink/70">รับของจาก Supplier</span>
                <span className="font-num font-bold">{todaysPlan.receiving.supplierCount} ราย</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[13px]">
                <span className="text-ink/70">เบิกจ่ายให้ฝ่ายผลิต</span>
                <span className="font-num font-bold">{todaysPlan.receiving.issuedToProductionSlips} ใบเบิก</span>
              </div>
            </div>
            <div className="rounded-lg border border-dock-100 p-3">
              <p className="mb-2 text-[12px] font-semibold text-dock-500">Shipping Plan</p>
              <ul className="space-y-1.5 text-[13px]">
                {todaysPlan.shipping.map((row, i) => (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <span className="truncate text-ink/70">{row.label}</span>
                    <span className="flex shrink-0 items-baseline gap-1.5 font-num">
                      <span className="font-bold">{row.trucks} คัน</span>
                      {row.pallets !== null && (
                        <span className="text-[11px] text-dock-500">
                          {row.pallets}/{row.rings}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
                {todaysPlan.shipping.length === 0 && <li className="text-ink/50">ไม่มีข้อมูล</li>}
              </ul>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-dock-100 p-3">
              <p className="mb-2 text-[12px] font-semibold text-dock-500">Planned Picking Volume</p>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="บาน" value={todaysPlan.plannedPickingPallets.toLocaleString()} tone="dock" size="lg" />
                <Stat label="วง" value={todaysPlan.plannedPickingRings.toLocaleString()} tone="dock" size="lg" />
              </div>
            </div>
            <div className="rounded-lg border border-dock-100 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[12px] font-semibold text-dock-500">Planned OT</p>
                <span className="font-num text-sm font-bold text-dock-500">
                  {sumHours(todaysPlan.plannedOT)} ชม.
                </span>
              </div>
              <div className="space-y-1 text-[12px]">
                {todaysPlan.plannedOT.length === 0 && <p className="text-ink/50">ไม่มีข้อมูล</p>}
                {todaysPlan.plannedOT.map((r, i) => (
                  <div key={i} className="border-t border-dock-100 pt-1 first:border-t-0 first:pt-0">
                    <div className="flex justify-between gap-2">
                      <span className="truncate text-ink/70">
                        {r.type} · {r.people} คน · {r.timeRange}
                      </span>
                      <span className="font-num shrink-0 font-semibold">{r.hours} ชม.</span>
                    </div>
                    {r.task && <p className="mt-0.5 text-[11px] text-dock-500">งาน: {r.task}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Focus footer */}
      <div className="hatch flex flex-col gap-2 rounded-xl bg-ink px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <IconTarget className="h-6 w-6 text-amber" />
          <span className="font-display text-sm font-semibold">FOCUS TODAY</span>
          <span className="hidden text-white/40 sm:inline">·</span>
          <span className="hidden text-[13px] text-white/80 sm:inline">
            {record.focusToday.join("  •  ")}
          </span>
        </div>
        <span className="font-display text-[13px] font-semibold tracking-wide text-amber">
          ZERO ACCIDENTS · ZERO DEFECTS · ON TIME DELIVERY
        </span>
      </div>
      <p className="text-[13px] text-white/80 sm:hidden -mt-2 px-1">{record.focusToday.join(" • ")}</p>
    </div>
  );
};

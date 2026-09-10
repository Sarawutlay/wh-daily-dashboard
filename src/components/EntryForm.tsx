import React, { useState } from "react";
import { DailyRecord, OTRow, ShiftTransfer, ShippingPlanRow, StaffAbsence } from "../lib/types";
import { Panel } from "./Panel";
import { Field, NumberInput, TextInput, SectionTitle, RowActions, RemoveButton } from "./Fields";
import { IconCheck } from "./Icons";

interface EntryFormProps {
  record: DailyRecord;
  onSave: (record: DailyRecord) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ record, onSave }) => {
  const [draft, setDraft] = useState<DailyRecord>(record);
  const [savedFlash, setSavedFlash] = useState(false);

  React.useEffect(() => {
    setDraft(record);
  }, [record.id]);

  function update<K extends keyof DailyRecord>(key: K, value: DailyRecord[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const presentCount = draft.manpower.total - draft.manpower.absent;
    const finalRecord: DailyRecord = {
      ...draft,
      manpower: { ...draft.manpower, present: presentCount },
      updatedAt: new Date().toISOString(),
    };
    onSave(finalRecord);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  const m = draft.manpower;
  const pt = draft.productionTransfer;
  const y = draft.yesterday;
  const tp = draft.todaysPlan;

  return (
    <form onSubmit={handleSave} className="space-y-4 pb-24">
      {/* Date + Manpower */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="วันที่ / รหัสรายการ" accent="ink">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="วันที่ทำงาน (ค.ศ.) — ใช้เป็นรหัสอ้างอิง">
              <input
                type="date"
                className="w-full rounded-md border border-dock-200 bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-dock-500 focus:ring-2 focus:ring-dock-500/20"
                value={draft.id}
                onChange={(e) => update("id", e.target.value)}
              />
            </Field>
            <Field label="วันที่แสดงผล (พ.ศ.) เช่น 23/7/2569">
              <TextInput value={draft.displayDate} onChange={(v) => update("displayDate", v)} placeholder="23/7/2569" />
            </Field>
          </div>
        </Panel>

        <Panel title="Manpower Today" subtitle="พนักงานประจำวัน" accent="dock">
          <div className="grid grid-cols-2 gap-3">
            <Field label="ไม่มา (คน)">
              <NumberInput
                value={m.absent}
                onChange={(v) =>
                  update("manpower", { ...m, absent: v, total: m.members.length, present: m.members.length - v })
                }
              />
            </Field>
            <Field label="พนักงานทั้งหมด (อัตโนมัติจากรายชื่อ)">
              <div className="flex h-[34px] items-center rounded-md bg-paper px-2.5 font-num text-sm font-semibold text-ink">
                {m.members.length} คน · มา {m.members.length - m.absent} คน
              </div>
            </Field>
          </div>

          <div className="mt-3">
            <SectionTitle hint="รายชื่อทีมงานคลังสินค้า">สมาชิก</SectionTitle>
            <div className="space-y-1.5">
              {m.members.map((name, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-[12px] text-dock-400">{i + 1}.</span>
                  <TextInput
                    value={name}
                    onChange={(v) => {
                      const members = [...m.members];
                      members[i] = v;
                      update("manpower", { ...m, members, total: members.length });
                    }}
                    placeholder="ชื่อพนักงาน"
                  />
                  <RemoveButton
                    onClick={() => {
                      const members = m.members.filter((_, idx) => idx !== i);
                      update("manpower", { ...m, members, total: members.length, present: members.length - m.absent });
                    }}
                  />
                </div>
              ))}
            </div>
            <RowActions
              addLabel="เพิ่มสมาชิก"
              onAdd={() => {
                const members = [...m.members, ""];
                update("manpower", { ...m, members, total: members.length });
              }}
            />
          </div>

          <div className="mt-3">
            <SectionTitle hint="กรอกเฉพาะคนที่ลา">เหตุผลการลา</SectionTitle>
            <div className="space-y-1.5">
              {m.absences.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TextInput
                    value={a.name}
                    onChange={(v) => {
                      const absences = [...m.absences];
                      absences[i] = { ...absences[i], name: v };
                      update("manpower", { ...m, absences });
                    }}
                    placeholder="ชื่อ"
                  />
                  <TextInput
                    value={a.reason}
                    onChange={(v) => {
                      const absences = [...m.absences];
                      absences[i] = { ...absences[i], reason: v };
                      update("manpower", { ...m, absences });
                    }}
                    placeholder="เหตุผลการลา"
                  />
                  <RemoveButton
                    onClick={() => {
                      const absences = m.absences.filter((_, idx) => idx !== i);
                      update("manpower", { ...m, absences });
                    }}
                  />
                </div>
              ))}
            </div>
            <RowActions
              addLabel="เพิ่มรายการลา"
              onAdd={() => {
                const absences: StaffAbsence[] = [...m.absences, { name: "", reason: "" }];
                update("manpower", { ...m, absences });
              }}
            />
          </div>

          <Field label="โน้ตเพิ่มเติม" className="mt-3">
            <TextInput value={m.note} onChange={(v) => update("manpower", { ...m, note: v })} placeholder="-" />
          </Field>
        </Panel>
      </div>

      {/* Production Transfer */}
      <Panel title="Production Transfer" subtitle="ยอดรับโอนสินค้าจากผลิตเมื่อวาน" accent="rust">
        <Field label="วันที่รับโอน" className="mb-3 max-w-xs">
          <TextInput value={pt.date} onChange={(v) => update("productionTransfer", { ...pt, date: v })} placeholder="22/7/2569" />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {pt.shifts.map((s, i) => (
            <div key={i} className="rounded-lg border border-dock-100 p-3">
              <p className="mb-2 text-[12px] font-semibold text-rust">กะ{s.shift}</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="บาน">
                  <NumberInput
                    value={s.pallets}
                    onChange={(v) => {
                      const shifts: ShiftTransfer[] = [...pt.shifts];
                      shifts[i] = { ...shifts[i], pallets: v };
                      update("productionTransfer", { ...pt, shifts });
                    }}
                  />
                </Field>
                <Field label="วง">
                  <NumberInput
                    value={s.rings ?? 0}
                    onChange={(v) => {
                      const shifts: ShiftTransfer[] = [...pt.shifts];
                      shifts[i] = { ...shifts[i], rings: v };
                      update("productionTransfer", { ...pt, shifts });
                    }}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Yesterday Performance */}
      <Panel title="Yesterday Performance" subtitle="ผลปฏิบัติงานเมื่อวาน" accent="moss">
        <Field label="วันที่" className="mb-3 max-w-xs">
          <TextInput value={y.date} onChange={(v) => update("yesterday", { ...y, date: v })} placeholder="22/7/2569" />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-dock-100 p-3">
            <SectionTitle>Receiving / Production Support</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <Field label="รับของจาก Supplier (ราย)">
                <NumberInput value={y.receivingSupplierCount} onChange={(v) => update("yesterday", { ...y, receivingSupplierCount: v })} />
              </Field>
              <Field label="เบิกจ่ายให้ฝ่ายผลิต (ใบเบิก)">
                <NumberInput value={y.issuedToProductionSlips} onChange={(v) => update("yesterday", { ...y, issuedToProductionSlips: v })} />
              </Field>
            </div>
          </div>
          <div className="rounded-lg border border-dock-100 p-3">
            <SectionTitle>Shipping</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <Field label="จัด/โหลดรถใหญ่ (คัน)">
                <NumberInput
                  value={y.shipping.loadedTrucks}
                  onChange={(v) => update("yesterday", { ...y, shipping: { ...y.shipping, loadedTrucks: v } })}
                />
              </Field>
              <Field label="- ลูกค้า CRC (คัน)">
                <NumberInput value={y.shipping.crc} onChange={(v) => update("yesterday", { ...y, shipping: { ...y.shipping, crc: v } })} />
              </Field>
              <Field label="- สยามโกล (นิครใหญ่) (คัน)">
                <NumberInput
                  value={y.shipping.samyaek}
                  onChange={(v) => update("yesterday", { ...y, shipping: { ...y.shipping, samyaek: v } })}
                />
              </Field>
              <Field label="- อื่นๆ (คัน)">
                <NumberInput value={y.shipping.others} onChange={(v) => update("yesterday", { ...y, shipping: { ...y.shipping, others: v } })} />
              </Field>
              <Field label="จัดรถเล็ก (คัน)" className="col-span-2">
                <NumberInput
                  value={y.shipping.smallTrucks}
                  onChange={(v) => update("yesterday", { ...y, shipping: { ...y.shipping, smallTrucks: v } })}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-dock-100 p-3">
            <SectionTitle>Picking / Loading Volume</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <Field label="บาน">
                <NumberInput value={y.pickingVolumePallets} onChange={(v) => update("yesterday", { ...y, pickingVolumePallets: v })} />
              </Field>
              <Field label="วง">
                <NumberInput value={y.pickingVolumeRings} onChange={(v) => update("yesterday", { ...y, pickingVolumeRings: v })} />
              </Field>
            </div>
          </div>
          <div className="rounded-lg border border-dock-100 p-3">
            <SectionTitle>หมายเหตุ</SectionTitle>
            <TextInput value={y.note} onChange={(v) => update("yesterday", { ...y, note: v })} placeholder="เช่น ลงตู้โครงช่วงเช้า" />
          </div>
        </div>

        <div className="mt-3">
          <OtRowsEditor
            title="OT Summary (เมื่อวาน)"
            rows={draft.otSummaryYesterday}
            onChange={(rows) => update("otSummaryYesterday", rows)}
          />
        </div>
      </Panel>

      {/* Today's Plan */}
      <Panel title="Today's Plan" subtitle="แผนงานวันนี้" accent="dock">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="วันที่แผนงาน">
            <TextInput value={tp.date} onChange={(v) => update("todaysPlan", { ...tp, date: v })} placeholder="23/7/2569" />
          </Field>
          <Field label="จัด/โหลดรถใหญ่ รวม (คัน)">
            <NumberInput value={tp.loadTrucksPlanned} onChange={(v) => update("todaysPlan", { ...tp, loadTrucksPlanned: v })} />
          </Field>
        </div>

        <div className="mt-3 rounded-lg border border-dock-100 p-3">
          <SectionTitle>Receiving / Production Support</SectionTitle>
          <div className="grid grid-cols-2 gap-2 sm:max-w-md">
            <Field label="รับของจาก Supplier (ราย)">
              <NumberInput
                value={tp.receiving.supplierCount}
                onChange={(v) => update("todaysPlan", { ...tp, receiving: { ...tp.receiving, supplierCount: v } })}
              />
            </Field>
            <Field label="เบิกจ่ายให้ฝ่ายผลิต">
              <TextInput
                value={String(tp.receiving.issuedToProductionSlips)}
                onChange={(v) => {
                  const trimmed = v.trim();
                  const nextValue: number | "N/A" =
                    trimmed === "" || trimmed.toUpperCase() === "N/A" ? "N/A" : Number(trimmed) || 0;
                  update("todaysPlan", {
                    ...tp,
                    receiving: { ...tp.receiving, issuedToProductionSlips: nextValue },
                  });
                }}
                placeholder="N/A หรือ จำนวนใบเบิก"
              />
            </Field>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-dock-100 p-3">
          <SectionTitle hint="ระบุ ลูกค้า / คัน / บาน / วง">Shipping Plan</SectionTitle>
          <div className="space-y-2">
            {tp.shipping.map((row, i) => (
              <ShippingRowEditor
                key={i}
                row={row}
                onChange={(next) => {
                  const shipping = [...tp.shipping];
                  shipping[i] = next;
                  update("todaysPlan", { ...tp, shipping });
                }}
                onRemove={() => {
                  const shipping = tp.shipping.filter((_, idx) => idx !== i);
                  update("todaysPlan", { ...tp, shipping });
                }}
              />
            ))}
          </div>
          <RowActions
            addLabel="เพิ่มรายการจัดส่ง"
            onAdd={() => {
              const shipping: ShippingPlanRow[] = [...tp.shipping, { label: "", trucks: 0, pallets: 0, rings: 0 }];
              update("todaysPlan", { ...tp, shipping });
            }}
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-dock-100 p-3">
            <SectionTitle>Planned Picking Volume</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <Field label="บาน">
                <NumberInput value={tp.plannedPickingPallets} onChange={(v) => update("todaysPlan", { ...tp, plannedPickingPallets: v })} />
              </Field>
              <Field label="วง">
                <NumberInput value={tp.plannedPickingRings} onChange={(v) => update("todaysPlan", { ...tp, plannedPickingRings: v })} />
              </Field>
            </div>
          </div>
          <div className="rounded-lg border border-dock-100 p-3">
            <OtRowsEditor title="Planned OT" rows={tp.plannedOT} onChange={(rows) => update("todaysPlan", { ...tp, plannedOT: rows })} compact />
          </div>
        </div>
      </Panel>

      {/* Focus today */}
      <Panel title="Focus Today" subtitle="ประเด็นเน้นย้ำวันนี้" accent="amber">
        <div className="space-y-1.5">
          {draft.focusToday.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <TextInput
                value={f}
                onChange={(v) => {
                  const focusToday = [...draft.focusToday];
                  focusToday[i] = v;
                  update("focusToday", focusToday);
                }}
              />
              <RemoveButton
                onClick={() => update("focusToday", draft.focusToday.filter((_, idx) => idx !== i))}
              />
            </div>
          ))}
        </div>
        <RowActions addLabel="เพิ่มหัวข้อ" onAdd={() => update("focusToday", [...draft.focusToday, ""])} />
      </Panel>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-dock-200 bg-white/95 px-4 py-3 backdrop-blur no-print">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
          <p className="hidden text-[12px] text-dock-500 sm:block">
            บันทึกล่าสุด: {new Date(draft.updatedAt).toLocaleString("th-TH")}
          </p>
          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
            {savedFlash && (
              <span className="flex items-center gap-1 text-[13px] font-medium text-moss">
                <IconCheck className="h-4 w-4" /> บันทึกแล้ว
              </span>
            )}
            <button
              type="submit"
              className="rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-panel transition hover:bg-dock-700 active:scale-[0.98]"
            >
              บันทึกข้อมูลวันนี้
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const ShippingRowEditor: React.FC<{
  row: ShippingPlanRow;
  onChange: (row: ShippingPlanRow) => void;
  onRemove: () => void;
}> = ({ row, onChange, onRemove }) => (
  <div className="grid grid-cols-12 items-end gap-2">
    <Field label="ลูกค้า / ประเภท" className="col-span-12 sm:col-span-5">
      <TextInput value={row.label} onChange={(v) => onChange({ ...row, label: v })} placeholder="เช่น ลูกค้า CRC" />
    </Field>
    <Field label="คัน" className="col-span-4 sm:col-span-2">
      <NumberInput value={row.trucks} onChange={(v) => onChange({ ...row, trucks: v })} />
    </Field>
    <Field label="บาน" className="col-span-4 sm:col-span-2">
      <NumberInput value={row.pallets ?? 0} onChange={(v) => onChange({ ...row, pallets: v })} />
    </Field>
    <Field label="วง" className="col-span-4 sm:col-span-2">
      <NumberInput value={row.rings ?? 0} onChange={(v) => onChange({ ...row, rings: v })} />
    </Field>
    <div className="col-span-12 flex justify-end sm:col-span-1">
      <RemoveButton onClick={onRemove} />
    </div>
  </div>
);

const OtRowsEditor: React.FC<{
  title: string;
  rows: OTRow[];
  onChange: (rows: OTRow[]) => void;
  compact?: boolean;
}> = ({ title, rows, onChange, compact }) => (
  <div>
    <SectionTitle hint={`รวม ${rows.reduce((a, r) => a + (Number(r.hours) || 0), 0)} ชม.`}>{title}</SectionTitle>
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-12 items-end gap-2">
          <Field label="ประเภท" className="col-span-6 sm:col-span-2">
            <TextInput
              value={r.type}
              onChange={(v) => {
                const next = [...rows];
                next[i] = { ...next[i], type: v };
                onChange(next);
              }}
              placeholder="รายเดือน/รายวัน"
            />
          </Field>
          <Field label="คน" className="col-span-6 sm:col-span-2">
            <NumberInput
              value={r.people}
              onChange={(v) => {
                const next = [...rows];
                next[i] = { ...next[i], people: v };
                onChange(next);
              }}
            />
          </Field>
          <Field label="เวลา" className={compact ? "col-span-12 sm:col-span-3" : "col-span-6 sm:col-span-2"}>
            <TextInput
              value={r.timeRange}
              onChange={(v) => {
                const next = [...rows];
                next[i] = { ...next[i], timeRange: v };
                onChange(next);
              }}
              placeholder="17:30-19:30"
            />
          </Field>
          <Field label="รวม (ชม.)" className="col-span-6 sm:col-span-2">
            <NumberInput
              value={r.hours}
              onChange={(v) => {
                const next = [...rows];
                next[i] = { ...next[i], hours: v };
                onChange(next);
              }}
            />
          </Field>
          <Field label="งาน" className={compact ? "col-span-10 sm:col-span-2" : "col-span-10 sm:col-span-3"}>
            <TextInput
              value={r.task}
              onChange={(v) => {
                const next = [...rows];
                next[i] = { ...next[i], task: v };
                onChange(next);
              }}
              placeholder="เช่น จัดงานรถเล็ก"
            />
          </Field>
          <div className="col-span-2 flex justify-end sm:col-span-1">
            <RemoveButton onClick={() => onChange(rows.filter((_, idx) => idx !== i))} />
          </div>
        </div>
      ))}
    </div>
    <RowActions
      addLabel="เพิ่มแถว OT"
      onAdd={() => onChange([...rows, { type: "รายวัน", people: 1, timeRange: "", hours: 0, task: "" }])}
    />
  </div>
);

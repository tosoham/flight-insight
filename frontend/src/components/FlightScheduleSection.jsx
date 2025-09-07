import React, { useState, useMemo } from "react";
import { format, addMinutes, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Calendar as CalendarIcon,
  RefreshCw,
  Search,
  AlertTriangle,
  LayoutList,
  LayoutGrid,
} from "lucide-react";

// ========================
// FlightScheduleSection
// ========================
export default function FlightScheduleSection({ initialDate = new Date() }) {
  const [date, setDate] = useState(initialDate);
  const [status, setStatus] = useState("ALL");
  const [airport, setAirport] = useState("ANY");
  const [q, setQ] = useState("");
  const [subTab, setSubTab] = useState("table");

  // Mock Data
  const nowISO = new Date().toISOString();
  const data = useMemo(
    () => [
      {
        id: "1",
        flightNo: "UA-1012",
        airline: "United Airlines",
        from: "JFK",
        to: "LAX",
        schedDep: parseISO(nowISO).toISOString(),
        schedArr: addMinutes(parseISO(nowISO), 370).toISOString(),
        estDep: addMinutes(parseISO(nowISO), 15).toISOString(),
        estArr: addMinutes(parseISO(nowISO), 385).toISOString(),
        status: "DELAYED",
        delayMin: 15,
        delayReason: "Late inbound aircraft",
      },
      {
        id: "2",
        flightNo: "AA-223",
        airline: "American Airlines",
        from: "ORD",
        to: "DFW",
        schedDep: addMinutes(parseISO(nowISO), 40).toISOString(),
        schedArr: addMinutes(parseISO(nowISO), 160).toISOString(),
        estDep: addMinutes(parseISO(nowISO), 40).toISOString(),
        estArr: addMinutes(parseISO(nowISO), 160).toISOString(),
        status: "BOARDING",
        delayMin: 0,
      },
      {
        id: "3",
        flightNo: "DL-789",
        airline: "Delta Air Lines",
        from: "ATL",
        to: "MIA",
        schedDep: addMinutes(parseISO(nowISO), -25).toISOString(),
        schedArr: addMinutes(parseISO(nowISO), 85).toISOString(),
        estDep: addMinutes(parseISO(nowISO), -10).toISOString(),
        estArr: addMinutes(parseISO(nowISO), 100).toISOString(),
        status: "IN_AIR",
        delayMin: 0,
      },
      {
        id: "4",
        flightNo: "WN-4567",
        airline: "Southwest Airlines",
        from: "SFO",
        to: "LAS",
        schedDep: addMinutes(parseISO(nowISO), 120).toISOString(),
        schedArr: addMinutes(parseISO(nowISO), 210).toISOString(),
        status: "ON_TIME",
        delayMin: 0,
      },
    ],
    [nowISO]
  );

  const filtered = useMemo(() => {
    return data.filter((f) => {
      const matchStatus = status === "ALL" || f.status === status;
      const matchAirport =
        airport === "ANY" || f.from === airport || f.to === airport;
      const query = q.trim().toLowerCase();
      const matchQuery =
        !query ||
        f.flightNo.toLowerCase().includes(query) ||
        f.airline.toLowerCase().includes(query) ||
        `${f.from}→${f.to}`.toLowerCase().includes(query) ||
        `${f.from}-${f.to}`.toLowerCase().includes(query);
      const matchDate =
        format(parseISO(f.schedDep), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd");
      return matchStatus && matchAirport && matchQuery && matchDate;
    });
  }, [data, status, airport, q, date]);

  return (
    <div className="space-y-4">
      <FilterRow
        date={date}
        setDate={setDate}
        status={status}
        setStatus={setStatus}
        airport={airport}
        setAirport={setAirport}
        q={q}
        setQ={setQ}
        refresh={() => {}}
      />

      {/* Toggle: Table / Analysis */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSubTab("table")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
            subTab === "table"
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-slate-700 border hover:bg-slate-50"
          }`}
        >
          <LayoutList className="h-4 w-4" />
          Table
        </button>
        <button
          onClick={() => setSubTab("analysis")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
            subTab === "analysis"
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-slate-700 border hover:bg-slate-50"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Analysis
        </button>
      </div>

      {subTab === "table" ? (
        <FlightsTable flights={filtered} />
      ) : (
        <FlightsAnalysis flights={filtered} />
      )}
    </div>
  );
}

/* ================= Helpers ================= */
const palette = {
  success: "#16A34A",
  danger: "#EF4444",
  primary: "#2563EB",
  slate500: "#64748B",
};

const hexWithAlpha = (hex, a01) =>
  `${hex}${Math.round(Math.min(1, Math.max(0, a01)) * 255)
    .toString(16)
    .padStart(2, "0")}`;

function StatusBadge({ status }) {
  const color =
    {
      ON_TIME: palette.success,
      BOARDING: palette.success,
      DELAYED: palette.danger,
      CANCELLED: palette.slate500,
      IN_AIR: palette.primary,
      LANDED: palette.primary,
    }[status] || palette.primary;

  const text =
    {
      ON_TIME: "On-Time",
      DELAYED: "Delayed",
      CANCELLED: "Cancelled",
      BOARDING: "Boarding",
      IN_AIR: "In-Air",
      LANDED: "Landed",
    }[status] || status;

  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: hexWithAlpha(color, 0.12), color }}
    >
      {text}
    </span>
  );
}

const minutes = (n) => (typeof n === "number" ? `${n} min` : "—");
const fmt = (t) => (t ? format(parseISO(t), "dd MMM, hh:mm a") : "—");


function FilterRow({ date, setDate, status, setStatus, airport, setAirport, q, setQ, refresh }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-wrap gap-3 items-end"
    >
      <div className="flex flex-col">
        <label className="mb-1 text-sm text-slate-600">Date</label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="date"
            value={format(date, "yyyy-MM-dd")}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="pl-9 pr-3 py-2 rounded-xl border bg-white text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm text-slate-600">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border bg-white text-sm"
        >
          <option value="ALL">All</option>
          <option value="ON_TIME">On-Time</option>
          <option value="DELAYED">Delayed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="BOARDING">Boarding</option>
          <option value="IN_AIR">In-Air</option>
          <option value="LANDED">Landed</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm text-slate-600">Airport</label>
        <select
          value={airport}
          onChange={(e) => setAirport(e.target.value)}
          className="px-3 py-2 rounded-xl border bg-white text-sm"
        >
          <option value="ANY">Any</option>
          <option value="DEL">DEL</option>
          <option value="BOM">BOM</option>
          <option value="BLR">BLR</option>
          <option value="HYD">HYD</option>
          <option value="CCU">CCU</option>
          <option value="IXB">IXB</option>
        </select>
      </div>

      <div className="flex-1 min-w-[220px]">
        <label className="mb-1 text-sm text-slate-600">Search (flight no, airline, route)</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. AI-676 or DEL→BOM"
              className="w-full pl-9 pr-3 py-2 rounded-xl border bg-white text-sm"
            />
          </div>
          <button
            onClick={refresh}
            className="px-3 py-2 rounded-xl border bg-white hover:bg-slate-50 transition flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FlightsTable({ flights }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl border bg-white"
    >
      <table className="w-full text-md">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="text-left p-3">Flight</th>
            <th className="text-left p-3">Route</th>
            <th className="text-left p-3">Scheduled</th>
            <th className="text-left p-3">Est / Actual</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Delay</th>
            {/* <th className="text-left p-3">Delay Reason</th> */}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {flights.map((f, i) => (
              <motion.tr
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-3 font-medium">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    {f.flightNo}
                  </div>
                </td>
                <td className="p-3">
                  {f.from} → {f.to}
                </td>
                <td className="p-3">
                  <div>Dep: {fmt(f.schedDep)}</div>
                  <div className="text-xs text-slate-500">
                    Arr: {fmt(f.schedArr)}
                  </div>
                </td>
                <td className="p-3">
                  <div>Dep: {fmt(f.estDep)}</div>
                  <div className="text-xs text-slate-500">
                    Arr: {fmt(f.estArr)}
                  </div>
                </td>
                <td className="p-3">
                  <StatusBadge status={f.status} />
                </td>
                <td className="p-3">{minutes(f.delayMin)}</td>
                {/* <td className="p-3 text-xs">
                  {f.status === "DELAYED" && f.delayReason ? f.delayReason : "—"}
                </td> */}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
}

function FlightsAnalysis({ flights }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {flights.map((f, i) => {
        const isDelayed = f.status === "DELAYED";
        const borderColor =
          {
            ON_TIME: "border-green-500",
            BOARDING: "border-emerald-500",
            DELAYED: "border-red-500",
            CANCELLED: "border-gray-500",
            IN_AIR: "border-blue-500",
            LANDED: "border-indigo-500",
          }[f.status] || "border-slate-400";

        return (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition border-l-4 ${borderColor} overflow-hidden`}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
              <div>
                <p className="font-bold text-gray-800 text-lg">{f.flightNo}</p>
                <p className="text-xs text-gray-500">{f.airline}</p>
              </div>
              <StatusBadge status={f.status} />
            </div>

            {/* Details */}
            <div className="p-5 space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-blue-500" />
                Route: <span className="font-medium">{f.from} → {f.to}</span>
              </p>
              <p>Sched: {fmt(f.schedDep)} → {fmt(f.schedArr)}</p>
              <p>Est/Act: {fmt(f.estDep)} → {fmt(f.estArr)}</p>
              {/* Gate removed as per new requirements */}
              <p>
                Delay:{" "}
                <span className={isDelayed ? "text-red-600 font-semibold" : ""}>
                  {minutes(f.delayMin)}
                </span>
              </p>

              {/* Delay reason (only for delayed) */}
              {isDelayed && f.delayReason && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex gap-2 items-start shadow-inner"
                >
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-red-600 animate-pulse" />
                  <span>{f.delayReason}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}


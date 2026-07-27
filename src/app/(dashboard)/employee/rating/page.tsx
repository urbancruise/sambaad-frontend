"use client";
import { useState, Fragment, useEffect } from "react";
import { ChevronDown, Info } from "lucide-react";



const monthsList = [
  { name: "Jan", num: 1 },
  { name: "Feb", num: 2 },
  { name: "Mar", num: 3 },
  { name: "Apr", num: 4 },
  { name: "May", num: 5 },
  { name: "Jun", num: 6 },
  { name: "Jul", num: 7 },
  { name: "Aug", num: 8 },
  { name: "Sep", num: 9 },
  { name: "Oct", num: 10 },
  { name: "Nov", num: 11 },
  { name: "Dec", num: 12 },
];

const rowColors = [
  { bg: "bg-indigo-50" },
  { bg: "bg-cyan-50" },
  { bg: "bg-rose-50" },
  { bg: "bg-green-50" },
  { bg: "bg-purple-50" },
  { bg: "bg-yellow-50" },
];

const SCORE_OPTIONS = [1, 2, 3, 4, 5];

type RoleRow = {
  role: "Self" | "TL";
  targetsVsActual: string;
  achievementPercent: number;
  salesImprovementIdeas: string;
  salesScore: number;
  punctualityLeaves: string;
  officePolicies: string;
  teamCoordination: string;
  conductScore: number;
  contributionNotes: string;
  contributionInitiative: string;
  processImprovement: string;
  contributionScore: number;
};

type Employee = {
  id: number;
  name: string;
  rows: RoleRow[];
};

// mock/starter data — swap for API response shaped the same way
const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "AJAY",
    rows: [
      {
        role: "Self",
        targetsVsActual: "",
        achievementPercent: 100,
        salesImprovementIdeas: "",
        salesScore: 5,
        punctualityLeaves: "",
        officePolicies: "",
        teamCoordination: "",
        conductScore: 5,
        contributionNotes: "",
        contributionInitiative: "",
        processImprovement: "",
        contributionScore: 5,
      },
      {
        role: "TL",
        targetsVsActual: "",
        achievementPercent: 100,
        salesImprovementIdeas: "",
        salesScore: 5,
        punctualityLeaves: "",
        officePolicies: "",
        teamCoordination: "",
        conductScore: 5,
        contributionNotes: "",
        contributionInitiative: "",
        processImprovement: "",
        contributionScore: 5,
      },
    ],
  },
  {
    id: 2,
    name: "RAHUL",
    rows: [
      {
        role: "Self",
        targetsVsActual: "",
        achievementPercent: 100,
        salesImprovementIdeas: "",
        salesScore: 4,
        punctualityLeaves: "",
        officePolicies: "",
        teamCoordination: "",
        conductScore: 4,
        contributionNotes: "",
        contributionInitiative: "",
        processImprovement: "",
        contributionScore: 3,
      },
      {
        role: "TL",
        targetsVsActual: "",
        achievementPercent: 100,
        salesImprovementIdeas: "",
        salesScore: 4,
        punctualityLeaves: "",
        officePolicies: "",
        teamCoordination: "",
        conductScore: 5,
        contributionNotes: "",
        contributionInitiative: "",
        processImprovement: "",
        contributionScore: 4,
      },
    ],
  },
];

// unique feature: rating -> color band, so the whole table shows health at a glance
function ratingClasses(total: number) {
  if (total >= 13) return "bg-green-600 text-white";
  if (total >= 9) return "bg-yellow-400 text-gray-900";
  return "bg-red-500 text-white";
}

function ratingLabel(total: number) {
  if (total >= 13) return "Excellent";
  if (total >= 9) return "Needs Improvement";
  return "Poor";
}

export default function PerformanceManagementSystem() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = String(new Date().getFullYear());

  const [selectedMonthNum, setSelectedMonthNum] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [department, setDepartment] = useState("SALES");
  const [manager, setManager] = useState("NEHA");

  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showLegend, setShowLegend] = useState(false);

  // TODO: wire this up like fetchLeadDistribution once a PMS API/slice exists
  useEffect(() => {
    // dispatch(fetchPerformanceRatings({ month: selectedMonthNum, year, regionId: selectedRegion, zoneId: selectedZone, cityId: selectedCity }));
  }, [selectedMonthNum, year, selectedRegion, selectedZone, selectedCity]);

  const selectedMonthName =
    monthsList.find((m) => m.num === selectedMonthNum)?.name ?? "";

  const cell = "border-r border-b border-gray-300 text-center px-2 py-2";
  const headCell =
    "border-r border-b border-white px-2 py-2 text-center whitespace-pre-line";

  const updateRow = (
    empId: number,
    rowIdx: number,
    field: keyof RoleRow,
    value: string | number,
  ) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id !== empId
          ? emp
          : {
              ...emp,
              rows: emp.rows.map((r, i) =>
                i !== rowIdx ? r : { ...r, [field]: value },
              ),
            },
      ),
    );
  };

  const rowTotal = (r: RoleRow) =>
    r.salesScore + r.conductScore + r.contributionScore;

  const allTotals = employees.flatMap((e) => e.rows.map(rowTotal));
  const teamAverage =
    allTotals.length > 0
      ? (allTotals.reduce((a, b) => a + b, 0) / allTotals.length).toFixed(1)
      : "0.0";

  if (employees === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* HEADER */}
      <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-md border border-green-100">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-5 gap-4">
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-green-600 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 00-1 1v1H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-4V3a1 1 0 00-1-1H9zM6 9a1 1 0 112 0v6a1 1 0 11-2 0V9zm5-2a1 1 0 00-1 1v7a1 1 0 102 0V8a1 1 0 00-1-1zm4 4a1 1 0 10-2 0v3a1 1 0 102 0v-3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                    Performance Management System
                  </span>
                  <span className="text-gray-700 ml-2">
                    – {selectedMonthName} {year}
                  </span>
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full mt-2"></div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => setShowLegend(true)}
              className="p-1 rounded-full hover:bg-green-50 border-2 border-green-400 shadow-sm transition-colors"
              title="Legend & Instructions"
            >
              <Info className="w-6 h-6 text-green-600" />
            </button>


            {/* Department */}
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-white border-2 border-green-200 rounded-xl px-3 py-2.5 font-semibold text-gray-700 hover:border-green-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 shadow-sm w-28"
              placeholder="Department"
            />

            {/* Manager */}
            <input
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="bg-white border-2 border-green-200 rounded-xl px-3 py-2.5 font-semibold text-gray-700 hover:border-green-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 shadow-sm w-28"
              placeholder="Manager"
            />

            {/* Month */}
            <div className="relative">
              <select
                value={selectedMonthNum}
                onChange={(e) => setSelectedMonthNum(Number(e.target.value))}
                className="appearance-none bg-white border-2 border-green-200 rounded-xl px-4 py-2.5 pr-10 font-semibold text-gray-700 hover:border-green-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 cursor-pointer shadow-sm"
              >
                {monthsList.map((m) => (
                  <option key={m.num} value={m.num}>
                    {m.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-green-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Year */}
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="appearance-none bg-white border-2 border-green-200 rounded-xl px-4 py-2.5 pr-10 font-semibold text-gray-700 hover:border-green-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 cursor-pointer shadow-sm"
              >
                {["2024", "2025", "2026", "2027"].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-green-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* TEAM AVERAGE strip — unique feature, at-a-glance summary */}
        <div className="px-5 pb-4 flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600">
            Team Average Rating:
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${ratingClasses(
              Number(teamAverage),
            )}`}
          >
            {teamAverage} / 15 — {ratingLabel(Number(teamAverage))}
          </span>
        </div>

        {/* LEGEND MODAL */}
        {showLegend && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLegend(false)}
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-green-700">
                  Legend & Instructions
                </h3>
                <button
                  onClick={() => setShowLegend(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white font-bold"
                >
                  ×
                </button>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                <li>
                  Score cells: choose 1 (Poor) to 5 (Excellent) from the
                  dropdown.
                </li>
                <li>
                  RATING column is auto-calculated: Sales + Conduct +
                  Contribution scores (max 15).
                </li>
                <li>
                  Green = Excellent (13-15), Yellow = Needs Improvement (9-12),
                  Red = Poor (&lt;9).
                </li>
                <li>Notes columns are free text for justification/comments.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* NO DATA */}
      {employees.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400 text-lg">
            No data found for this period.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 border-separate border-spacing-0 text-sm font-semibold">
            <thead>
              {/* GROUP HEADER ROW — 3 columns inside each section, matches the PMS sheet layout */}
              <tr className="bg-orange-100">
                <th
                  colSpan={3}
                  className="border-r border-b border-white bg-orange-100 px-2 py-2"
                ></th>
                <th
                  colSpan={4}
                  className="border-r border-b border-white bg-orange-100 text-red-600 text-sm md:text-base font-extrabold px-2 py-2 text-center"
                >
                  SALES PERFORMANCE - L1
                </th>
                <th
                  colSpan={4}
                  className="border-r border-b border-white bg-orange-100 text-blue-700 text-sm md:text-base font-extrabold px-2 py-2 text-center"
                >
                  CONDUCT &amp; BEHAVIOUR - HR
                </th>
                <th
                  colSpan={4}
                  className="border-r border-b border-white bg-orange-100 text-gray-900 text-sm md:text-base font-extrabold px-2 py-2 text-center"
                >
                  CONTRIBUTION TO ORG.
                </th>
                <th
                  rowSpan={2}
                  className="bg-green-800 text-white px-2 py-2 text-center whitespace-pre-line"
                >
                  RATING{"\n"}(/15)
                </th>
              </tr>

              <tr className="bg-green-800 text-white">
                <th className={headCell}>#</th>
                <th className={headCell}>NAME</th>
                <th className={headCell}>ROLE</th>
                <th className={`${headCell} text-orange-200`}>
                  Targets VS{"\n"}Actual
                </th>
                <th className={`${headCell} text-orange-200`}>
                  Achievement{"\n"}%
                </th>
                <th className={`${headCell} text-orange-200`}>
                  Sales Improvement{"\n"}Ideas
                </th>
                <th className={`${headCell} text-orange-200`}>
                  Sales{"\n"}Score
                </th>
                <th className={`${headCell} text-blue-200`}>
                  Punctuality{"\n"}& Leaves
                </th>
                <th className={`${headCell} text-blue-200`}>
                  Adherence to{"\n"}Office Policies
                </th>
                <th className={`${headCell} text-blue-200`}>
                  Team{"\n"}Coordination
                </th>
                <th className={`${headCell} text-blue-200`}>
                  Conduct{"\n"}Score
                </th>
                <th className={headCell}>Contribution{"\n"}Notes</th>
                <th className={headCell}>Initiatives{"\n"}Taken</th>
                <th className={headCell}>Process{"\n"}Improvement</th>
                <th className={headCell}>Contribution{"\n"}Score</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp, index) => {
                const color = rowColors[index % rowColors.length];

                return (
                  <Fragment key={emp.id}>
                    {emp.rows.map((r, rowIdx) => {
                      const total = rowTotal(r);
                      return (
                        <tr key={r.role} className={color.bg}>
                          {rowIdx === 0 && (
                            <>
                              <td
                                rowSpan={emp.rows.length}
                                className={`${cell} font-bold`}
                              >
                                {index + 1}
                              </td>
                              <td
                                rowSpan={emp.rows.length}
                                className={`${cell} font-bold text-lg`}
                              >
                                {emp.name}
                              </td>
                            </>
                          )}

                          <td className={cell}>{r.role}</td>

                          <td className={cell}>
                            <input
                              value={r.targetsVsActual}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "targetsVsActual",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent text-center outline-none placeholder:text-gray-400 font-normal"
                              placeholder="—"
                            />
                          </td>

                          <td className={cell}>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={r.achievementPercent}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "achievementPercent",
                                  Number(e.target.value),
                                )
                              }
                              className="w-full bg-transparent text-center outline-none text-orange-600 font-bold"
                            />
                          </td>

                          <td className={cell}>
                            <input
                              value={r.salesImprovementIdeas}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "salesImprovementIdeas",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent text-center outline-none placeholder:text-gray-400 font-normal"
                              placeholder="—"
                            />
                          </td>

                          <td className={cell}>
                            <select
                              value={r.salesScore}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "salesScore",
                                  Number(e.target.value),
                                )
                              }
                              className="bg-transparent text-orange-600 font-bold text-center outline-none cursor-pointer"
                            >
                              {SCORE_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className={cell}>
                            <input
                              value={r.punctualityLeaves}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "punctualityLeaves",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent text-center outline-none placeholder:text-gray-400 font-normal"
                              placeholder="—"
                            />
                          </td>

                          <td className={cell}>
                            <input
                              value={r.officePolicies}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "officePolicies",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent text-center outline-none placeholder:text-gray-400 font-normal"
                              placeholder="—"
                            />
                          </td>

                          <td className={cell}>
                            <input
                              value={r.teamCoordination}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "teamCoordination",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent text-center outline-none placeholder:text-gray-400 font-normal"
                              placeholder="—"
                            />
                          </td>

                          <td className={cell}>
                            <select
                              value={r.conductScore}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "conductScore",
                                  Number(e.target.value),
                                )
                              }
                              className="bg-transparent text-blue-700 font-bold text-center outline-none cursor-pointer"
                            >
                              {SCORE_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className={cell}>
                            <input
                              value={r.contributionNotes}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "contributionNotes",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent text-center outline-none placeholder:text-gray-400 font-normal"
                              placeholder="—"
                            />
                          </td>

                          <td className={cell}>
                            <input
                              value={r.contributionInitiative}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "contributionInitiative",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent text-center outline-none placeholder:text-gray-400 font-normal"
                              placeholder="—"
                            />
                          </td>

                          <td className={cell}>
                            <input
                              value={r.processImprovement}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "processImprovement",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent text-center outline-none placeholder:text-gray-400 font-normal"
                              placeholder="—"
                            />
                          </td>

                          <td className={cell}>
                            <select
                              value={r.contributionScore}
                              onChange={(e) =>
                                updateRow(
                                  emp.id,
                                  rowIdx,
                                  "contributionScore",
                                  Number(e.target.value),
                                )
                              }
                              className="bg-transparent font-bold text-center outline-none cursor-pointer"
                            >
                              {SCORE_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* auto-calculated, colour-coded rating */}
                          <td
                            className={`border-r border-b border-gray-300 text-center px-2 py-2 text-lg font-extrabold ${ratingClasses(
                              total,
                            )}`}
                          >
                            {total}
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                );
              })}

              {/* TEAM AVERAGE ROW */}
              <tr className="bg-gray-800 text-white font-bold text-lg">
                <td colSpan={15} className={cell}>
                  Team Average
                </td>
                <td
                  className={`px-2 py-2 text-center ${ratingClasses(
                    Number(teamAverage),
                  )}`}
                >
                  {teamAverage}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

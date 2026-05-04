import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

// ─── Static Data ─────────────────────────────────────────────────────────────
const PROVINCES = [
  { id: 1, name: "Koshi",         nameNe: "कोशी",         capital: "Biratnagar",    pop: 4534943, districts: 14, color: "#3B82F6", unemploy: 18 },
  { id: 2, name: "Madhesh",       nameNe: "मधेश",         capital: "Janakpur",      pop: 6126288, districts: 8,  color: "#10B981", unemploy: 22 },
  { id: 3, name: "Bagmati",       nameNe: "बागमती",       capital: "Hetauda",       pop: 6084042, districts: 13, color: "#F59E0B", unemploy: 14 },
  { id: 4, name: "Gandaki",       nameNe: "गण्डकी",       capital: "Pokhara",       pop: 2403757, districts: 11, color: "#8B5CF6", unemploy: 16 },
  { id: 5, name: "Lumbini",       nameNe: "लुम्बिनी",     capital: "Butwal",        pop: 5124225, districts: 12, color: "#EC4899", unemploy: 19 },
  { id: 6, name: "Karnali",       nameNe: "कर्णाली",      capital: "Birendranagar", pop: 1694889, districts: 10, color: "#EF4444", unemploy: 38 },
  { id: 7, name: "Sudurpashchim", nameNe: "सुदूरपश्चिम", capital: "Dhangadhi",     pop: 2552517, districts: 9,  color: "#6366F1", unemploy: 33 },
];

const DISTRICTS_BY_PROVINCE = {
  3: [
    { id: 8, name: "Kathmandu", citizens: 1240, projects: 12, problem: "Traffic congestion", skill: "IT / Coding", unemploy: 12 },
    { id: 9, name: "Lalitpur",  citizens: 480,  projects: 8,  problem: "Air pollution",      skill: "Digital Marketing", unemploy: 10 },
    { id: 10, name: "Bhaktapur",citizens: 310,  projects: 5,  problem: "Water scarcity",     skill: "Pottery / Heritage", unemploy: 11 },
    { id: 11, name: "Dhading",  citizens: 620,  projects: 7,  problem: "No irrigation",      skill: "Solar Repair",       unemploy: 28 },
    { id: 12, name: "Chitwan",  citizens: 780,  projects: 9,  problem: "Youth migration",    skill: "Hospitality",        unemploy: 15 },
    { id: 13, name: "Makwanpur",citizens: 410,  projects: 4,  problem: "Poor roads",         skill: "Carpentry",          unemploy: 22 },
  ],
  6: [
    { id: 20, name: "Surkhet",  citizens: 340,  projects: 6,  problem: "No job opportunity", skill: "Driving / Transport", unemploy: 35 },
    { id: 21, name: "Humla",    citizens: 120,  projects: 2,  problem: "Lack of food",       skill: "English Language",   unemploy: 52 },
    { id: 22, name: "Jumla",    citizens: 180,  projects: 3,  problem: "Poor roads",         skill: "Animal Husbandry",   unemploy: 44 },
    { id: 23, name: "Kalikot",  citizens: 140,  projects: 2,  problem: "No drinking water",  skill: "Plumbing",           unemploy: 48 },
    { id: 24, name: "Dailekh",  citizens: 260,  projects: 4,  problem: "Lack of electricity","skill": "Solar Repair",    unemploy: 40 },
  ],
  1: [
    { id: 1, name: "Jhapa",    citizens: 810, projects: 8, problem: "Land disputes",     skill: "Tea Processing",   unemploy: 16 },
    { id: 2, name: "Morang",   citizens: 965, projects: 11,problem: "Industrial pollution","skill": "Factory Work", unemploy: 14 },
    { id: 3, name: "Sunsari",  citizens: 760, projects: 9, problem: "Youth migration",   skill: "Hospitality",      unemploy: 18 },
    { id: 4, name: "Taplejung",citizens: 128, projects: 3, problem: "No training center","skill": "Mountaineering", unemploy: 29 },
  ],
};

const MUNICIPALITIES = [
  { id: 1, name: "Gajuri Rural Municipality",    nameNe: "गजुरी गाउँपालिका",       districtId: 11, citizens: 1200, unemploy: 31, problem: "No irrigation",    skill: "Solar Panel Repair", projects: 2 },
  { id: 2, name: "Nilkantha Municipality",        nameNe: "नीलकण्ठ नगरपालिका",      districtId: 11, citizens: 3400, unemploy: 22, problem: "Poor roads",       skill: "Digital Literacy",   projects: 4 },
  { id: 3, name: "Kathmandu Metropolitan",        nameNe: "काठमाडौं महानगरपालिका",  districtId: 8,  citizens: 18400,unemploy: 10, problem: "Air pollution",    skill: "IT / Coding",        projects: 14 },
  { id: 4, name: "Pokhara Metropolitan",          nameNe: "पोखरा महानगरपालिका",     districtId: 35, citizens: 9200, unemploy: 14, problem: "Waste management", skill: "Tourism / Hospitality",projects: 9 },
  { id: 5, name: "Birendranagar Municipality",    nameNe: "वीरेन्द्रनगर नगरपालिका", districtId: 20, citizens: 2100, unemploy: 32, problem: "No job opportunity","skill": "English Language", projects: 3 },
];

const PROJECTS = [
  { id: 1, name: "Gajuri Micro-Irrigation Scheme",     sector: "IRRIGATION", status: "ONGOING",    progress: 40, budget: 45000000,  district: "Dhading",   agency: "Dept of Irrigation" },
  { id: 2, name: "Kathmandu Ring Road Upgrade",        sector: "ROAD",       status: "ONGOING",    progress: 52, budget: 2800000000,district: "Kathmandu", agency: "Dept of Roads" },
  { id: 3, name: "Pokhara Digital Hub",               sector: "DIGITAL",    status: "PLANNED",    progress: 5,  budget: 850000000, district: "Kaski",     agency: "Gandaki Province IT" },
  { id: 4, name: "Dhading Community Health Posts",    sector: "HEALTH",     status: "ONGOING",    progress: 68, budget: 32000000,  district: "Dhading",   agency: "District Health Office" },
  { id: 5, name: "Madhesh Rural Electrification",     sector: "ELECTRICITY","status": "ONGOING",  progress: 50, budget: 120000000, district: "Mahottari", agency: "NEA" },
  { id: 6, name: "Surkhet-Jumla Road Blacktopping",   sector: "ROAD",       status: "COMPLETED",  progress: 100,budget: 980000000, district: "Surkhet",   agency: "Dept of Roads" },
  { id: 7, name: "Karnali School Renovation Program", sector: "EDUCATION",  status: "ONGOING",    progress: 75, budget: 55000000,  district: "Jumla",     agency: "UNICEF / MoE" },
  { id: 8, name: "Jhapa Tea Cooperative Market",      sector: "AGRICULTURE","status": "COMPLETED",progress: 100,budget: 28000000,  district: "Jhapa",     agency: "Agri Cooperative" },
];

const DIASPORA = [
  { country: "Qatar",        flag: "🇶🇦", workers: 400000, remittance: 480, avgSalaryNPR: 62000  },
  { country: "UAE",          flag: "🇦🇪", workers: 300000, remittance: 350, avgSalaryNPR: 45000  },
  { country: "Saudi Arabia", flag: "🇸🇦", workers: 250000, remittance: 290, avgSalaryNPR: 38000  },
  { country: "Malaysia",     flag: "🇲🇾", workers: 200000, remittance: 210, avgSalaryNPR: 32000  },
  { country: "South Korea",  flag: "🇰🇷", workers: 30000,  remittance: 180, avgSalaryNPR: 200000 },
  { country: "Japan",        flag: "🇯🇵", workers: 18000,  remittance: 150, avgSalaryNPR: 280000 },
  { country: "Australia",    flag: "🇦🇺", workers: 60000,  remittance: 120, avgSalaryNPR: 350000 },
  { country: "USA",          flag: "🇺🇸", workers: 80000,  remittance: 95,  avgSalaryNPR: 420000 },
];

const CITIZENS_SAMPLE = [
  { id: 1, age: 28, gender: "M", location: "Gajuri, Dhading",     occupation: "Farmer",         edu: "Secondary",          income: 8500,  unemployed: false, skill: "Organic Farming",    problem: "No irrigation"       },
  { id: 2, age: 35, gender: "F", location: "Gajuri, Dhading",     occupation: "School Teacher", edu: "Bachelor",           income: 22000, unemployed: false, skill: "Digital Literacy",   problem: "Poor internet"       },
  { id: 3, age: 19, gender: "M", location: "Gajuri, Dhading",     occupation: "—",              edu: "Higher Secondary",   income: 0,     unemployed: true,  skill: "English Language",   problem: "No job opportunity"  },
  { id: 4, age: 42, gender: "F", location: "Nilkantha, Dhading",  occupation: "Vegetable Seller","edu": "Primary",         income: 12000, unemployed: false, skill: "Business Skills",    problem: "Lack of capital"     },
  { id: 5, age: 25, gender: "M", location: "Nilkantha, Dhading",  occupation: "Solar Technician","edu": "Technical/Vocational",income: 18000,unemployed: false,skill: "Solar Panel Repair","problem": "No training center"},
  { id: 6, age: 55, gender: "F", location: "Kathmandu Metro",     occupation: "Tailor",         edu: "Informal",           income: 9000,  unemployed: false, skill: "Fashion Design",     problem: "Lack of capital"     },
  { id: 7, age: 31, gender: "M", location: "Surkhet, Karnali",    occupation: "—",              edu: "Secondary",          income: 0,     unemployed: true,  skill: "Driving",            problem: "No job opportunity"  },
  { id: 8, age: 22, gender: "F", location: "Humla, Karnali",      occupation: "—",              edu: "Primary",            income: 0,     unemployed: true,  skill: "English Language",   problem: "No drinking water"   },
];

const SKILL_GAP = [
  { skill: "Solar Repair",  learning: 1240, demanded: 2100 },
  { skill: "IT/Coding",     learning: 890,  demanded: 1800 },
  { skill: "Plumbing",      learning: 670,  demanded: 1200 },
  { skill: "English",       learning: 2100, demanded: 2400 },
  { skill: "Carpentry",     learning: 550,  demanded: 900  },
  { skill: "Hospitality",   learning: 740,  demanded: 1600 },
];

const SECTOR_COLORS = {
  ROAD: "#78716C", EDUCATION: "#3B82F6", HEALTH: "#EF4444",
  IRRIGATION: "#06B6D4", DIGITAL: "#8B5CF6", ELECTRICITY: "#F59E0B",
  AGRICULTURE: "#10B981", OTHER: "#6B7280",
};

const STATUS_COLORS = {
  ONGOING: "bg-blue-100 text-blue-700", COMPLETED: "bg-green-100 text-green-700",
  PLANNED: "bg-amber-100 text-amber-700", SUSPENDED: "bg-red-100 text-red-700",
};

const PIE_DATA = [
  { name: "Completed", value: 34, color: "#10B981" },
  { name: "Ongoing",   value: 48, color: "#3B82F6" },
  { name: "Planned",   value: 14, color: "#F59E0B" },
  { name: "Suspended", value: 4,  color: "#EF4444"  },
];

const TREND_DATA = [
  { m: "Jan", c: 12400, d: 3200 }, { m: "Feb", c: 13100, d: 3400 },
  { m: "Mar", c: 14800, d: 3700 }, { m: "Apr", c: 15200, d: 3900 },
  { m: "May", c: 16100, d: 4100 }, { m: "Jun", c: 17500, d: 4400 },
];

const formatNPR = (n) => n >= 1e7 ? `Rs ${(n/1e7).toFixed(1)} Cr` : n >= 1e5 ? `Rs ${(n/1e5).toFixed(1)}L` : `Rs ${n.toLocaleString()}`;

// ─── Components ───────────────────────────────────────────────────────────────

function Sidebar({ active, setActive }) {
  const nav = [
    { key: "dashboard", label: "Dashboard",    labelNe: "ड्यासबोर्ड",  icon: "📊" },
    { key: "map",       label: "Map Explorer", labelNe: "नक्शा",        icon: "🗺️" },
    { key: "citizens",  label: "Citizens",     labelNe: "नागरिक",       icon: "👥" },
    { key: "diaspora",  label: "Diaspora",     labelNe: "प्रवासी",      icon: "✈️" },
    { key: "projects",  label: "Projects",     labelNe: "आयोजना",       icon: "🏗️" },
    { key: "export",    label: "Reports",      labelNe: "रिपोर्ट",       icon: "📄" },
    { key: "admin",     label: "Admin",        labelNe: "प्रशासन",      icon: "⚙️" },
  ];
  return (
    <aside style={{ width: 200, background: "#0f172a", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#DC143C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🇳🇵</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>Nepal Dev</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Tracker</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(({ key, label, labelNe, icon }) => (
          <button key={key} onClick={() => setActive(key)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
            background: active === key ? "#2563eb" : "transparent", border: "none", cursor: "pointer",
            color: active === key ? "#fff" : "#94a3b8", textAlign: "left", transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 15 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: active === key ? 600 : 400 }}>{label}</div>
              <div style={{ fontSize: 10, opacity: 0.6 }}>{labelNe}</div>
            </div>
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>A</div>
          <div>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>Super Admin</div>
            <div style={{ color: "#64748b", fontSize: 10 }}>admin@nepaltracker.gov.np</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ icon, title, value, trend, color }) {
  const colors = { blue: ["#EFF6FF","#2563EB"], green: ["#F0FDF4","#16A34A"], amber: ["#FFFBEB","#D97706"], purple: ["#F5F3FF","#7C3AED"] };
  const [bg, fg] = colors[color] ?? colors.blue;
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: "#64748B" }}>{title}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: fg }}>{value}</div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{trend}</div>
    </div>
  );
}

function ProgressBar({ value, color = "#3B82F6" }) {
  return (
    <div style={{ background: "#F1F5F9", borderRadius: 99, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.5s" }} />
    </div>
  );
}

const TT_STYLE = { background: "#1e293b", border: "none", borderRadius: 8, color: "#f8fafc", fontSize: 11, padding: "6px 10px" };

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#991B1B" }}>Top reported problem this month: </span>
          <span style={{ fontSize: 13, color: "#B91C1C" }}>No job opportunity — flagged by 34% of citizens in Karnali & Sudurpashchim</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <StatCard icon="👥" title="Citizens Tracked"   value="18,240"  trend="+240 this month"  color="blue"   />
        <StatCard icon="📈" title="Unemployment Rate"  value="21.4%"   trend="−2.1% vs last yr" color="amber"  />
        <StatCard icon="🏗️" title="Active Projects"    value="48"      trend="+3 this quarter"  color="green"  />
        <StatCard icon="✈️" title="Diaspora Tracked"   value="5,840"   trend="+180 this month"  color="purple" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 14 }}>Employment rate by province</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PROVINCES} barSize={18} margin={{ left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} domain={[0, 100]} />
              <Tooltip contentStyle={TT_STYLE} formatter={(v) => [`${100 - v}% unemployed / ${v}% employed`]} />
              <Bar dataKey={(r) => 100 - r.unemploy} name="Employed %" radius={[4,4,0,0]}>
                {PROVINCES.map((p, i) => <Cell key={i} fill={p.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 14 }}>Skills gap: learning vs demanded</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SKILL_GAP} layout="vertical" barSize={9} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94A3B8" }} />
              <YAxis dataKey="skill" type="category" tick={{ fontSize: 10, fill: "#94A3B8" }} width={68} />
              <Tooltip contentStyle={TT_STYLE} />
              <Bar dataKey="learning" name="Learning"  fill="#8B5CF6" radius={[0,4,4,0]} />
              <Bar dataKey="demanded" name="Demanded"  fill="#E9D5FF" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 14 }}>Registration growth trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TREND_DATA} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={TT_STYLE} />
              <Area type="monotone" dataKey="c" name="Citizens"  stroke="#3B82F6" fill="#DBEAFE" strokeWidth={2} />
              <Area type="monotone" dataKey="d" name="Diaspora"  stroke="#10B981" fill="#D1FAE5" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 10 }}>Project status breakdown</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "center" }}>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {PIE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={TT_STYLE} formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PIE_DATA.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                  <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1E293B" }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { label: "Most learned skill", value: "Solar Panel Repair", sub: "Across 23 districts" },
          { label: "Annual remittances tracked", value: "Rs 167 Cr", sub: "Sent by registered diaspora" },
          { label: "Projects completed FY 2080/81", value: "34", sub: "Out of 96 total projects" },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1E293B" }}>{value}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Map Explorer ─────────────────────────────────────────────────────────────
function MapExplorer() {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const districts = selectedProvince ? DISTRICTS_BY_PROVINCE[selectedProvince.id] ?? [] : [];
  const municipalities = selectedDistrict ? MUNICIPALITIES.filter(m => m.districtId === selectedDistrict.id) : [];

  return (
    <div style={{ display: "flex", gap: 16, height: "100%" }}>
      {/* Province List */}
      <div style={{ width: 180, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Provinces</div>
        {PROVINCES.map(p => (
          <button key={p.id} onClick={() => { setSelectedProvince(p); setSelectedDistrict(null); }} style={{
            display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2,
            background: selectedProvince?.id === p.id ? "#EFF6FF" : "transparent",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: selectedProvince?.id === p.id ? 600 : 400, color: selectedProvince?.id === p.id ? "#1D4ED8" : "#374151" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{p.nameNe}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Map Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Nepal map visual */}
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", borderRadius: 12, padding: 20, position: "relative", minHeight: 260 }}>
          <div style={{ position: "absolute", top: 12, left: 16, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>🗺️ Nepal — Click a province to drill down</div>

          {/* Province bubbles positioned roughly */}
          {[
            { p: PROVINCES[0], x: 78, y: 40 }, { p: PROVINCES[1], x: 58, y: 72 },
            { p: PROVINCES[2], x: 52, y: 38 }, { p: PROVINCES[3], x: 33, y: 28 },
            { p: PROVINCES[4], x: 28, y: 55 }, { p: PROVINCES[5], x: 20, y: 30 },
            { p: PROVINCES[6], x: 8,  y: 25 },
          ].map(({ p, x, y }) => (
            <button key={p.id} onClick={() => { setSelectedProvince(p); setSelectedDistrict(null); }} style={{
              position: "absolute", left: `${x}%`, top: `${y}%`,
              transform: "translate(-50%,-50%)", background: p.color,
              border: selectedProvince?.id === p.id ? "3px solid white" : "2px solid rgba(255,255,255,0.3)",
              borderRadius: "50%", width: selectedProvince?.id === p.id ? 52 : 44, height: selectedProvince?.id === p.id ? 52 : 44,
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: selectedProvince?.id === p.id ? `0 0 20px ${p.color}80` : "none",
              transition: "all 0.2s",
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "white", lineHeight: 1.1, textAlign: "center", padding: "0 4px" }}>{p.name.length > 7 ? p.name.slice(0,7) : p.name}</div>
            </button>
          ))}

          {/* Stats overlay for selected province */}
          {selectedProvince && (
            <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(15,23,42,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 14, minWidth: 200 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedProvince.color }} />
                {selectedProvince.name} Province
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  ["Population",    selectedProvince.pop.toLocaleString()],
                  ["Districts",     selectedProvince.districts],
                  ["Unemployment",  `${selectedProvince.unemploy}%`],
                  ["Capital",       selectedProvince.capital],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{k}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "white" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Districts grid */}
        {districts.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
              Districts in {selectedProvince?.name} Province
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
              {districts.map(d => (
                <button key={d.id} onClick={() => setSelectedDistrict(d)} style={{
                  background: selectedDistrict?.id === d.id ? "#EFF6FF" : "#fff",
                  border: `1px solid ${selectedDistrict?.id === d.id ? "#93C5FD" : "#E2E8F0"}`,
                  borderRadius: 10, padding: 12, cursor: "pointer", textAlign: "left",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 4 }}>📍 {d.name}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{d.citizens.toLocaleString()} citizens</div>
                  <div style={{ fontSize: 11, color: "#EF4444", marginTop: 2 }}>⚠️ {d.problem}</div>
                  <div style={{ fontSize: 11, color: "#3B82F6" }}>⚡ {d.skill}</div>
                  <div style={{ marginTop: 6 }}>
                    <ProgressBar value={100 - d.unemploy} color={selectedProvince?.color} />
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{d.unemploy}% unemployment</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Municipalities */}
        {municipalities.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
              Municipalities in {selectedDistrict?.name} District
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {municipalities.map(m => (
                <div key={m.id} style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 8 }}>{m.nameNe}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[
                      ["Citizens", m.citizens.toLocaleString()],
                      ["Projects", m.projects],
                      ["Top problem", m.problem],
                      ["Top skill", m.skill],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 10, color: "#94A3B8" }}>{k}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <ProgressBar value={100 - m.unemploy} color="#F59E0B" />
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{m.unemploy}% unemployment</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!selectedProvince && (
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
            <p style={{ fontSize: 14, color: "#64748B" }}>Select a province to drill down into districts and municipalities</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Citizens ─────────────────────────────────────────────────────────────────
function Citizens({ setView }) {
  const [search, setSearch] = useState("");
  const [filterUnemployed, setFilterUnemployed] = useState(false);
  const filtered = useMemo(() =>
    CITIZENS_SAMPLE.filter(c =>
      (!search || c.location.toLowerCase().includes(search.toLowerCase()) || c.occupation.toLowerCase().includes(search.toLowerCase())) &&
      (!filterUnemployed || c.unemployed)
    ), [search, filterUnemployed]);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by location or occupation…"
            style={{ width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8, background: "#fff", boxSizing: "border-box" }} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569", cursor: "pointer" }}>
          <input type="checkbox" checked={filterUnemployed} onChange={e => setFilterUnemployed(e.target.checked)} />
          Unemployed only
        </label>
        <button onClick={() => setView("newCitizen")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
          ＋ Add Citizen
        </button>
      </div>

      <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>{filtered.length} of {CITIZENS_SAMPLE.length} records</div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
            <tr>{["Age/Gender","Location","Occupation","Education","Income/mo","Skill","Problem","Status"].map(h =>
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 500, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                <td style={{ padding: "10px 14px" }}><div style={{ fontWeight: 600 }}>{c.age}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{c.gender === "M" ? "Male" : "Female"}</div></td>
                <td style={{ padding: "10px 14px", color: "#475569" }}>{c.location}</td>
                <td style={{ padding: "10px 14px", color: "#475569" }}>{c.occupation}</td>
                <td style={{ padding: "10px 14px", color: "#475569", fontSize: 12 }}>{c.edu}</td>
                <td style={{ padding: "10px 14px" }}>{c.income > 0 ? <span style={{ fontWeight: 500, color: "#065F46" }}>Rs {c.income.toLocaleString()}</span> : <span style={{ color: "#94A3B8" }}>—</span>}</td>
                <td style={{ padding: "10px 14px" }}><span style={{ background: "#F5F3FF", color: "#6D28D9", fontSize: 11, padding: "2px 8px", borderRadius: 99 }}>{c.skill}</span></td>
                <td style={{ padding: "10px 14px" }}><span style={{ color: "#DC2626", fontSize: 12 }}>⚠️ {c.problem}</span></td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, fontWeight: 500, background: c.unemployed ? "#FEE2E2" : "#D1FAE5", color: c.unemployed ? "#991B1B" : "#065F46" }}>
                    {c.unemployed ? "Unemployed" : "Employed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── New Citizen Form ─────────────────────────────────────────────────────────
function NewCitizenForm({ setView }) {
  const [form, setForm] = useState({ age: "", gender: "MALE", province: "", district: "", municipality: "", occupation: "", income: "", education: "", unemployed: false });
  const [skills, setSkills] = useState([{ name: "", level: "BEGINNER" }]);
  const [problems, setProblems] = useState([]);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const fld = { width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8, background: "#fff", boxSizing: "border-box" };

  return (
    <div style={{ maxWidth: 700 }}>
      <button onClick={() => setView("citizens")} style={{ background: "none", border: "none", cursor: "pointer", color: "#3B82F6", fontSize: 13, marginBottom: 16, padding: 0 }}>← Back to Citizens</button>

      {[
        { title: "📍 Location", fields: (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[["Province", "province", ["Koshi","Madhesh","Bagmati","Gandaki","Lumbini","Karnali","Sudurpashchim"]], ["District", "district", ["Dhading","Chitwan","Kathmandu"]], ["Municipality", "municipality", ["Gajuri Rural Municipality","Nilkantha Municipality","Kathmandu Metropolitan"]]].map(([label, key, opts]) => (
              <div key={key}><label style={{ fontSize: 11, fontWeight: 500, color: "#475569", display: "block", marginBottom: 4 }}>{label}</label>
                <select value={form[key]} onChange={set(key)} style={fld}><option value="">Select…</option>{opts.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
            ))}
          </div>
        )},
        { title: "👤 Demographics", fields: (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={{ fontSize: 11, fontWeight: 500, color: "#475569", display: "block", marginBottom: 4 }}>Age *</label><input type="number" value={form.age} onChange={set("age")} style={fld} /></div>
            <div><label style={{ fontSize: 11, fontWeight: 500, color: "#475569", display: "block", marginBottom: 4 }}>Gender *</label>
              <select value={form.gender} onChange={set("gender")} style={fld}><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></select></div>
          </div>
        )},
        { title: "💼 Employment", fields: (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={{ fontSize: 11, fontWeight: 500, color: "#475569", display: "block", marginBottom: 4 }}>Occupation</label><input value={form.occupation} onChange={set("occupation")} placeholder="e.g. Farmer, Teacher…" style={fld} /></div>
            <div><label style={{ fontSize: 11, fontWeight: 500, color: "#475569", display: "block", marginBottom: 4 }}>Monthly Income (NPR)</label><input type="number" value={form.income} onChange={set("income")} placeholder="15000" style={fld} /></div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569", cursor: "pointer" }}>
                <input type="checkbox" checked={form.unemployed} onChange={set("unemployed")} /> Mark as unemployed
              </label>
            </div>
          </div>
        )},
        { title: "⚡ Skills", fields: (
          <div>
            {skills.map((sk, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: 8 }}>
                <input value={sk.name} onChange={e => setSkills(s => s.map((x, j) => j === i ? {...x, name: e.target.value} : x))} placeholder="Skill name" style={fld} />
                <select value={sk.level} onChange={e => setSkills(s => s.map((x, j) => j === i ? {...x, level: e.target.value} : x))} style={fld}>
                  <option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option>
                </select>
                <button onClick={() => setSkills(s => s.filter((_, j) => j !== i))} style={{ background: "#FEF2F2", border: "none", borderRadius: 8, color: "#DC2626", cursor: "pointer", padding: "0 12px" }}>✕</button>
              </div>
            ))}
            <button onClick={() => setSkills(s => [...s, { name: "", level: "BEGINNER" }])} style={{ background: "none", border: "1px dashed #CBD5E1", borderRadius: 8, color: "#3B82F6", cursor: "pointer", padding: "6px 16px", fontSize: 12 }}>＋ Add skill</button>
          </div>
        )},
        { title: "⚠️ Problems Faced", fields: (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {["No job opportunity","Poor internet","No training center","Health issues","Poor roads","No drinking water","Lack of electricity","Gender discrimination","Lack of capital"].map(p => (
              <label key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer", padding: "6px 8px", borderRadius: 8, border: `1px solid ${problems.includes(p) ? "#FCA5A5" : "#E2E8F0"}`, background: problems.includes(p) ? "#FEF2F2" : "#fff", color: problems.includes(p) ? "#991B1B" : "#475569" }}>
                <input type="checkbox" checked={problems.includes(p)} onChange={() => setProblems(ps => ps.includes(p) ? ps.filter(x => x !== p) : [...ps, p])} style={{ accentColor: "#EF4444" }} />{p}
              </label>
            ))}
          </div>
        )},
      ].map(({ title, fields }) => (
        <div key={title} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 14 }}>{title}</div>
          {fields}
        </div>
      ))}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setView("citizens")} style={{ padding: "10px 24px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>💾 Save Citizen</button>
        <button onClick={() => setView("citizens")} style={{ padding: "10px 16px", background: "#fff", color: "#475569", border: "1px solid #E2E8F0", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Diaspora ─────────────────────────────────────────────────────────────────
function Diaspora() {
  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 14 }}>Remittance flow by country (Cr NPR/yr)</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={DIASPORA} barSize={22} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="country" tick={{ fontSize: 11, fill: "#94A3B8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
            <Tooltip contentStyle={TT_STYLE} formatter={(v) => [`Rs ${v} Cr`, "Remittance"]} />
            <Bar dataKey="remittance" name="Remittance (Cr)" radius={[4,4,0,0]}>
              {DIASPORA.map((_, i) => <Cell key={i} fill={`hsl(${160 + i * 20},60%,${45 + i * 3}%)`} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {DIASPORA.map(d => (
          <div key={d.country} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{d.flag}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{d.country}</div>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                ["Workers", d.workers.toLocaleString()],
                ["Remittance/yr", `Rs ${d.remittance} Cr`],
                ["Avg salary", `Rs ${d.avgSalaryNPR.toLocaleString()}/mo`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#64748B" }}>{k}</span>
                  <span style={{ fontWeight: 600, color: "#1E293B" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Projects() {
  const [filter, setFilter] = useState("");
  const filtered = PROJECTS.filter(p => !filter || p.status === filter);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["", "ONGOING", "COMPLETED", "PLANNED"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 14px", borderRadius: 8, border: `1px solid ${filter === s ? "#93C5FD" : "#E2E8F0"}`,
            background: filter === s ? "#EFF6FF" : "#fff", color: filter === s ? "#1D4ED8" : "#475569",
            cursor: "pointer", fontSize: 12, fontWeight: filter === s ? 600 : 400,
          }}>
            {s || "All"} {s && `(${PROJECTS.filter(p => p.status === s).length})`}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {filtered.map(p => {
          const color = SECTOR_COLORS[p.sector] ?? "#6B7280";
          const sc = STATUS_COLORS[p.status] ?? "";
          return (
            <div key={p.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, transition: "box-shadow 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: 10, color: "#94A3B8" }}>{p.sector.replace(/_/g," ")}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", lineHeight: 1.3 }}>{p.name}</div>
                </div>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 99, fontWeight: 500, whiteSpace: "nowrap", marginLeft: 8,
                  background: p.status === "ONGOING" ? "#DBEAFE" : p.status === "COMPLETED" ? "#D1FAE5" : "#FEF3C7",
                  color: p.status === "ONGOING" ? "#1E40AF" : p.status === "COMPLETED" ? "#065F46" : "#92400E" }}>
                  {p.status}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>📍 {p.district} · {p.agency}</div>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 10 }}>Budget: <strong>{formatNPR(p.budget)}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>
                <span>Progress</span><span style={{ fontWeight: 600, color: "#475569" }}>{p.progress}%</span>
              </div>
              <ProgressBar value={p.progress} color={color} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function Reports() {
  const [province, setProvince] = useState("");
  const [generated, setGenerated] = useState(false);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", marginBottom: 16 }}>📄 Generate Development Report</div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: "#475569", display: "block", marginBottom: 6 }}>Province</label>
          <select value={province} onChange={e => setProvince(e.target.value)} style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8 }}>
            <option value="">All Nepal</option>
            {PROVINCES.map(p => <option key={p.id} value={p.name}>{p.name} — {p.nameNe}</option>)}
          </select>
        </div>
        <button onClick={() => setGenerated(true)} style={{ width: "100%", padding: "10px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
          Generate Report
        </button>
        {generated && (
          <div style={{ marginTop: 14, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#166534", marginBottom: 8 }}>✅ Report ready: {province || "All Nepal"}</div>
            {[["Total Citizens","18,240"],["Unemployment","21.4%"],["Active Projects","48"],["Top Problem","No job opportunity"],["Top Need","Road infrastructure"]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#166534" }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button style={{ flex: 1, padding: "7px", background: "#fff", border: "1px solid #BBF7D0", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#166534" }}>⬇️ Download PDF</button>
              <button style={{ flex: 1, padding: "7px", background: "#fff", border: "1px solid #BBF7D0", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#166534" }}>⬇️ Download JSON</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", marginBottom: 16 }}>⬆️ Bulk Data Upload</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["Citizens", "Diaspora"].map(t => (
            <button key={t} style={{ flex: 1, padding: "8px", background: t === "Citizens" ? "#EFF6FF" : "#F8FAFC", border: `1px solid ${t === "Citizens" ? "#93C5FD" : "#E2E8F0"}`, borderRadius: 8, cursor: "pointer", fontSize: 12, color: t === "Citizens" ? "#1D4ED8" : "#475569", fontWeight: t === "Citizens" ? 600 : 400 }}>{t}</button>
          ))}
        </div>
        <div style={{ border: "2px dashed #E2E8F0", borderRadius: 10, padding: 28, textAlign: "center", background: "#FAFAFA" }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>📂</div>
          <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>Drop CSV here or click to browse</div>
          <button style={{ padding: "7px 16px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#475569" }}>Choose CSV file</button>
        </div>
        <button style={{ width: "100%", marginTop: 10, padding: "8px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#3B82F6" }}>⬇️ Download CSV template</button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, gridColumn: "span 2" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", marginBottom: 14 }}>📊 Export Anonymized Research Data</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Citizens dataset (CSV)", desc: "Age, gender, skills, employment — anonymized", color: "#EFF6FF" },
            { label: "Diaspora dataset (CSV)", desc: "Country, remittances, return intentions", color: "#F0FDF4" },
            { label: "Projects dataset (CSV)", desc: "All projects, budgets, progress, sectors", color: "#F5F3FF" },
          ].map(({ label, desc, color }) => (
            <div key={label} style={{ background: color, border: "1px solid #E2E8F0", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}>{desc}</div>
              <button style={{ fontSize: 12, color: "#3B82F6", background: "none", border: "none", cursor: "pointer", padding: 0 }}>⬇️ Export CSV</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Admin ────────────────────────────────────────────────────────────────────
function Admin() {
  const users = [
    { name: "Super Admin", email: "admin@nepaltracker.gov.np", role: "SUPER_ADMIN",    province: "All",     status: "Active" },
    { name: "Ramesh Sharma", email: "ramesh@bagmati.gov.np",  role: "PROVINCE_ADMIN",  province: "Bagmati", status: "Active" },
    { name: "Sita Kumari",  email: "sita.data@nepaltracker.gov.np",role:"DATA_ENTRY",  province: "Karnali", status: "Active" },
    { name: "Hari Bhandari",email: "hari@gandaki.gov.np",     role: "PROVINCE_ADMIN",  province: "Gandaki", status: "Active" },
  ];
  const roleColor = { SUPER_ADMIN: ["#FEE2E2","#991B1B"], PROVINCE_ADMIN: ["#F5F3FF","#5B21B6"], DATA_ENTRY: ["#DBEAFE","#1E40AF"] };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[["👥","Citizens","18,240","blue"],["🏗️","Active Projects","48","green"],["✈️","Diaspora Records","5,840","purple"],["🛡️","Admin Users","4","amber"]].map(([icon,label,value,color]) => (
          <StatCard key={label} icon={icon} title={label} value={value} trend="" color={color} />
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>User Management</div>
          <button style={{ padding: "7px 14px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 500 }}>＋ Add User</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ borderBottom: "1px solid #E2E8F0" }}>
            <tr>{["Name","Email","Role","Province","Status"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 500, color: "#64748B", textTransform: "uppercase" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const [bg, fg] = roleColor[u.role] ?? ["#F1F5F9","#475569"];
              return (
                <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 500, color: "#1E293B" }}>{u.name}</td>
                  <td style={{ padding: "10px 12px", color: "#64748B" }}>{u.email}</td>
                  <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: bg, color: fg, fontWeight: 500 }}>{u.role.replace(/_/g," ")}</span></td>
                  <td style={{ padding: "10px 12px", color: "#64748B" }}>{u.province}</td>
                  <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: "#D1FAE5", color: "#065F46" }}>Active</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", marginBottom: 14 }}>System Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[["Database","PostgreSQL 15 + PostGIS","Healthy",true],["Authentication","NextAuth.js (JWT)","Active",true],["File Storage","Local /public/uploads","Configured",true],["Email Service","Not configured","Warning",false],["PWA / Offline","Service Worker enabled","Active",true],["Rate Limiting","100 req/min per IP","Active",true]].map(([label, value, status, ok]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: "1px solid #F1F5F9", borderRadius: 10 }}>
              <div><div style={{ fontSize: 12, fontWeight: 500, color: "#1E293B" }}>{label}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{value}</div></div>
              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: ok ? "#D1FAE5" : "#FEF3C7", color: ok ? "#065F46" : "#92400E" }}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [view, setView] = useState("list");

  const resolvedActive = view === "newCitizen" ? "citizens" : active;

  const TITLE_MAP = { dashboard: "Dashboard", map: "Map Explorer", citizens: "Citizens", diaspora: "Diaspora Tracker", projects: "Projects", export: "Reports & Export", admin: "Admin Panel" };
  const BREAD_MAP = { dashboard: ["Home","Dashboard"], map: ["Home","Map Explorer"], citizens: ["Home","Citizens"], diaspora: ["Home","Diaspora"], projects: ["Home","Projects"], export: ["Home","Reports"], admin: ["Home","Admin"] };

  const renderContent = () => {
    if (view === "newCitizen") return <NewCitizenForm setView={setView} />;
    switch (active) {
      case "dashboard": return <Dashboard />;
      case "map":       return <MapExplorer />;
      case "citizens":  return <Citizens setView={setView} />;
      case "diaspora":  return <Diaspora />;
      case "projects":  return <Projects />;
      case "export":    return <Reports />;
      case "admin":     return <Admin />;
      default:          return <Dashboard />;
    }
  };

  const handleNav = (key) => { setActive(key); setView("list"); };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", background: "#F8FAFC", overflow: "hidden" }}>
      <Sidebar active={resolvedActive} setActive={handleNav} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <header style={{ height: 56, background: "#fff", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{(BREAD_MAP[active] ?? ["Home"]).join(" › ")}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1E293B" }}>{view === "newCitizen" ? "Add New Citizen" : TITLE_MAP[active]}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#64748B", fontSize: 18 }}>🔔</button>
              <div style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, background: "#EF4444", borderRadius: "50%" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>A</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#1E293B" }}>Super Admin</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>SUPER_ADMIN</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

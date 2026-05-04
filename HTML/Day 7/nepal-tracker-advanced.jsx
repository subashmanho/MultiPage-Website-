import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, LineChart, Line,
} from "recharts";

// ══════════════════════════════════════════════════════════════════════════════
// DATA LAYER — comprehensive Nepal data
// ══════════════════════════════════════════════════════════════════════════════

const PROVINCES = [
  { id:1, name:"Koshi",         ne:"कोशी",         cap:"Biratnagar",    pop:4534943, area:25905, districts:14, color:"#3B82F6", unemploy:18, gdppc:45000, poverty:18.4, literacy:72.3 },
  { id:2, name:"Madhesh",       ne:"मधेश",         cap:"Janakpur",      pop:6126288, area:9661,  districts:8,  color:"#10B981", unemploy:22, gdppc:38000, poverty:26.1, literacy:59.2 },
  { id:3, name:"Bagmati",       ne:"बागमती",       cap:"Hetauda",       pop:6084042, area:20300, districts:13, color:"#F59E0B", unemploy:14, gdppc:85000, poverty:10.9, literacy:81.4 },
  { id:4, name:"Gandaki",       ne:"गण्डकी",       cap:"Pokhara",       pop:2403757, area:21504, districts:11, color:"#8B5CF6", unemploy:16, gdppc:62000, poverty:14.2, literacy:78.8 },
  { id:5, name:"Lumbini",       ne:"लुम्बिनी",     cap:"Butwal",        pop:5124225, area:22288, districts:12, color:"#EC4899", unemploy:19, gdppc:42000, poverty:19.8, literacy:68.1 },
  { id:6, name:"Karnali",       ne:"कर्णाली",      cap:"Birendranagar", pop:1694889, area:27984, districts:10, color:"#EF4444", unemploy:38, gdppc:28000, poverty:38.2, literacy:55.9 },
  { id:7, name:"Sudurpashchim", ne:"सुदूरपश्चिम", cap:"Dhangadhi",     pop:2552517, area:19539, districts:9,  color:"#6366F1", unemploy:33, gdppc:31000, poverty:32.5, literacy:60.4 },
];

const ALL_DISTRICTS = [
  // Koshi (1)
  { id:1,  name:"Taplejung",      prov:1, pop:127461,  citizens:312,  projects:3,  unemploy:29, topProblem:"No training center",     topSkill:"Mountaineering",     remittance:12, income:11000 },
  { id:2,  name:"Panchthar",      prov:1, pop:191817,  citizens:480,  projects:4,  unemploy:24, topProblem:"Poor roads",             topSkill:"Tea Processing",     remittance:18, income:13000 },
  { id:3,  name:"Ilam",           prov:1, pop:290254,  citizens:710,  projects:6,  unemploy:20, topProblem:"Youth migration",        topSkill:"Tea Processing",     remittance:24, income:15000 },
  { id:4,  name:"Jhapa",          prov:1, pop:812650,  citizens:1920, projects:11, unemploy:16, topProblem:"Land disputes",          topSkill:"Agro-processing",    remittance:65, income:18000 },
  { id:5,  name:"Morang",         prov:1, pop:965370,  citizens:2340, projects:13, unemploy:14, topProblem:"Industrial pollution",   topSkill:"Factory Operations", remittance:78, income:20000 },
  { id:6,  name:"Sunsari",        prov:1, pop:760117,  citizens:1840, projects:10, unemploy:15, topProblem:"Flood risk",             topSkill:"Aquaculture",        remittance:62, income:19000 },
  { id:7,  name:"Dhankuta",       prov:1, pop:163412,  citizens:390,  projects:4,  unemploy:22, topProblem:"No job opportunity",     topSkill:"Handicraft",         remittance:14, income:13500 },
  { id:8,  name:"Terhathum",      prov:1, pop:99389,   citizens:240,  projects:3,  unemploy:26, topProblem:"Poor internet",          topSkill:"Digital Literacy",   remittance:9,  income:12000 },
  { id:9,  name:"Sankhuwasabha",  prov:1, pop:158742,  citizens:380,  projects:4,  unemploy:27, topProblem:"No training center",     topSkill:"Hiking Guide",       remittance:13, income:11500 },
  { id:10, name:"Bhojpur",        prov:1, pop:182459,  citizens:440,  projects:4,  unemploy:25, topProblem:"Poor roads",             topSkill:"Carpentry",          remittance:15, income:12500 },
  { id:11, name:"Solukhumbu",     prov:1, pop:105886,  citizens:260,  projects:5,  unemploy:21, topProblem:"High altitude isolation",topSkill:"Mountaineering",     remittance:22, income:28000 },
  { id:12, name:"Okhaldhunga",    prov:1, pop:147984,  citizens:360,  projects:3,  unemploy:28, topProblem:"No drinking water",      topSkill:"Organic Farming",    remittance:11, income:10500 },
  { id:13, name:"Khotang",        prov:1, pop:206312,  citizens:490,  projects:4,  unemploy:27, topProblem:"Poor education",         topSkill:"Animal Husbandry",   remittance:16, income:11000 },
  { id:14, name:"Udayapur",       prov:1, pop:317532,  citizens:760,  projects:6,  unemploy:22, topProblem:"Youth migration",        topSkill:"Cement/Industry",    remittance:26, income:15000 },
  // Madhesh (2)
  { id:15, name:"Saptari",        prov:2, pop:639284,  citizens:1540, projects:7,  unemploy:23, topProblem:"Flood risk",             topSkill:"Rice Farming",       remittance:48, income:14000 },
  { id:16, name:"Siraha",         prov:2, pop:637328,  citizens:1530, projects:7,  unemploy:24, topProblem:"Gender discrimination",  topSkill:"Jute Processing",    remittance:46, income:13500 },
  { id:17, name:"Dhanusha",       prov:2, pop:754776,  citizens:1820, projects:9,  unemploy:21, topProblem:"Poor education",         topSkill:"Religious Tourism",  remittance:55, income:15000 },
  { id:18, name:"Mahottari",      prov:2, pop:693891,  citizens:1670, projects:7,  unemploy:24, topProblem:"Lack of electricity",    topSkill:"Sugarcane Farming",  remittance:50, income:13000 },
  { id:19, name:"Sarlahi",        prov:2, pop:769729,  citizens:1860, projects:8,  unemploy:22, topProblem:"Flood risk",             topSkill:"Fish Farming",       remittance:57, income:14500 },
  { id:20, name:"Rautahat",       prov:2, pop:686722,  citizens:1650, projects:6,  unemploy:25, topProblem:"No drinking water",      topSkill:"Tobacco Farming",    remittance:49, income:13000 },
  { id:21, name:"Bara",           prov:2, pop:756948,  citizens:1820, projects:8,  unemploy:20, topProblem:"Industrial pollution",   topSkill:"Manufacturing",      remittance:58, income:16000 },
  { id:22, name:"Parsa",          prov:2, pop:787610,  citizens:1900, projects:9,  unemploy:19, topProblem:"Traffic congestion",     topSkill:"Trade/Commerce",     remittance:62, income:18000 },
  // Bagmati (3)
  { id:23, name:"Sindhuli",       prov:3, pop:296192,  citizens:710,  projects:6,  unemploy:22, topProblem:"Poor roads",             topSkill:"Organic Farming",    remittance:22, income:14000 },
  { id:24, name:"Ramechhap",      prov:3, pop:202646,  citizens:490,  projects:4,  unemploy:26, topProblem:"Youth migration",        topSkill:"Apple Farming",      remittance:15, income:12500 },
  { id:25, name:"Dolakha",        prov:3, pop:186557,  citizens:450,  projects:5,  unemploy:24, topProblem:"Earthquake reconstruction","topSkill":"Construction",   remittance:14, income:13000 },
  { id:26, name:"Sindhupalchok",  prov:3, pop:287798,  citizens:690,  projects:6,  unemploy:22, topProblem:"Landslide risk",         topSkill:"Hydropower Tech",    remittance:21, income:14500 },
  { id:27, name:"Kavrepalanchok", prov:3, pop:381937,  citizens:920,  projects:8,  unemploy:17, topProblem:"Water scarcity",         topSkill:"Dairy Farming",      remittance:30, income:17000 },
  { id:28, name:"Lalitpur",       prov:3, pop:468132,  citizens:1120, projects:10, unemploy:10, topProblem:"Air pollution",          topSkill:"IT/Digital",         remittance:42, income:35000 },
  { id:29, name:"Bhaktapur",      prov:3, pop:304651,  citizens:730,  projects:7,  unemploy:11, topProblem:"Heritage preservation",  topSkill:"Pottery/Handicraft", remittance:28, income:30000 },
  { id:30, name:"Kathmandu",      prov:3, pop:1744240, citizens:4180, projects:22, unemploy:10, topProblem:"Traffic congestion",     topSkill:"IT/Software Dev",    remittance:168, income:45000 },
  { id:31, name:"Nuwakot",        prov:3, pop:277471,  citizens:660,  projects:5,  unemploy:23, topProblem:"Youth migration",        topSkill:"Vegetable Farming",  remittance:20, income:13500 },
  { id:32, name:"Rasuwa",         prov:3, pop:43300,   citizens:104,  projects:3,  unemploy:19, topProblem:"Border trade issues",    topSkill:"Trade/Commerce",     remittance:4,  income:16000 },
  { id:33, name:"Dhading",        prov:3, pop:336067,  citizens:806,  projects:8,  unemploy:27, topProblem:"No irrigation",          topSkill:"Solar Panel Repair", remittance:25, income:12000 },
  { id:34, name:"Makwanpur",      prov:3, pop:420477,  citizens:1008, projects:7,  unemploy:18, topProblem:"Poor roads",             topSkill:"Carpentry",          remittance:34, income:16000 },
  { id:35, name:"Chitwan",        prov:3, pop:579984,  citizens:1392, projects:11, unemploy:13, topProblem:"Wildlife conflict",      topSkill:"Eco-tourism",        remittance:50, income:22000 },
  // Gandaki (4)
  { id:36, name:"Gorkha",         prov:4, pop:271061,  citizens:650,  projects:6,  unemploy:23, topProblem:"Earthquake impact",      topSkill:"Construction",       remittance:20, income:13000 },
  { id:37, name:"Manang",         prov:4, pop:5645,    citizens:14,   projects:2,  unemploy:15, topProblem:"Remote isolation",       topSkill:"Mountain Tourism",   remittance:1,  income:35000 },
  { id:38, name:"Mustang",        prov:4, pop:13452,   citizens:32,   projects:3,  unemploy:12, topProblem:"Depopulation",           topSkill:"Cultural Tourism",   remittance:2,  income:42000 },
  { id:39, name:"Myagdi",         prov:4, pop:113641,  citizens:272,  projects:4,  unemploy:20, topProblem:"Poor roads",             topSkill:"Hydropower Tech",    remittance:9,  income:13500 },
  { id:40, name:"Kaski",          prov:4, pop:492098,  citizens:1180, projects:12, unemploy:13, topProblem:"Waste management",       topSkill:"Tourism/Hospitality",remittance:44, income:28000 },
  { id:41, name:"Lamjung",        prov:4, pop:167724,  citizens:400,  projects:4,  unemploy:21, topProblem:"Youth migration",        topSkill:"Organic Farming",    remittance:14, income:14000 },
  { id:42, name:"Tanahu",         prov:4, pop:322928,  citizens:774,  projects:6,  unemploy:18, topProblem:"Landslide risk",         topSkill:"Dairy Farming",      remittance:26, income:15000 },
  { id:43, name:"Nawalpur",       prov:4, pop:368677,  citizens:884,  projects:7,  unemploy:17, topProblem:"Flood risk",             topSkill:"Rice Cultivation",   remittance:30, income:16000 },
  { id:44, name:"Syangja",        prov:4, pop:289148,  citizens:692,  projects:5,  unemploy:20, topProblem:"Youth migration",        topSkill:"Remittance Business", remittance:24, income:14500 },
  { id:45, name:"Parbat",         prov:4, pop:146590,  citizens:352,  projects:4,  unemploy:22, topProblem:"Youth migration",        topSkill:"Handicraft",         remittance:12, income:13000 },
  { id:46, name:"Baglung",        prov:4, pop:268613,  citizens:644,  projects:5,  unemploy:19, topProblem:"Poor internet",          topSkill:"Apple Farming",      remittance:21, income:14000 },
  // Lumbini (5)
  { id:47, name:"Palpa",          prov:5, pop:261180,  citizens:626,  projects:5,  unemploy:20, topProblem:"Youth migration",        topSkill:"Weaving/Handicraft", remittance:22, income:14500 },
  { id:48, name:"Nawalparasi W",  prov:5, pop:367000,  citizens:880,  projects:6,  unemploy:19, topProblem:"Flood risk",             topSkill:"Sugarcane Farming",  remittance:29, income:15000 },
  { id:49, name:"Rupandehi",      prov:5, pop:880196,  citizens:2112, projects:12, unemploy:15, topProblem:"Industrial pollution",   topSkill:"Manufacturing",      remittance:75, income:20000 },
  { id:50, name:"Kapilvastu",     prov:5, pop:631622,  citizens:1516, projects:8,  unemploy:21, topProblem:"Poor education",         topSkill:"Buddhist Tourism",   remittance:48, income:14000 },
  { id:51, name:"Arghakhanchi",   prov:5, pop:197632,  citizens:474,  projects:4,  unemploy:23, topProblem:"Youth migration",        topSkill:"Vegetable Farming",  remittance:16, income:13000 },
  { id:52, name:"Gulmi",          prov:5, pop:280160,  citizens:672,  projects:5,  unemploy:22, topProblem:"Youth migration",        topSkill:"Remittance Business", remittance:22, income:13500 },
  { id:53, name:"Pyuthan",        prov:5, pop:228102,  citizens:548,  projects:4,  unemploy:24, topProblem:"No job opportunity",     topSkill:"Animal Husbandry",   remittance:18, income:12500 },
  { id:54, name:"Rolpa",          prov:5, pop:224506,  citizens:538,  projects:4,  unemploy:26, topProblem:"Poor roads",             topSkill:"Organic Farming",    remittance:17, income:12000 },
  { id:55, name:"Rukum East",     prov:5, pop:117611,  citizens:282,  projects:3,  unemploy:28, topProblem:"Poor roads",             topSkill:"Sheep Farming",      remittance:9,  income:11000 },
  { id:56, name:"Dang",           prov:5, pop:552583,  citizens:1324, projects:9,  unemploy:18, topProblem:"Youth migration",        topSkill:"Rice Cultivation",   remittance:46, income:17000 },
  { id:57, name:"Banke",          prov:5, pop:491313,  citizens:1178, projects:9,  unemploy:20, topProblem:"No job opportunity",     topSkill:"Trade/Commerce",     remittance:42, income:18000 },
  { id:58, name:"Bardiya",        prov:5, pop:426576,  citizens:1022, projects:7,  unemploy:21, topProblem:"Wildlife conflict",      topSkill:"Eco-tourism",        remittance:35, income:15000 },
  // Karnali (6)
  { id:59, name:"Dolpa",          prov:6, pop:36700,   citizens:88,   projects:2,  unemploy:42, topProblem:"Remote isolation",       topSkill:"Yak Farming",        remittance:3,  income:9000 },
  { id:60, name:"Mugu",           prov:6, pop:55286,   citizens:132,  projects:2,  unemploy:45, topProblem:"No drinking water",      topSkill:"Animal Husbandry",   remittance:4,  income:8500 },
  { id:61, name:"Humla",          prov:6, pop:50858,   citizens:122,  projects:2,  unemploy:52, topProblem:"Lack of food",           topSkill:"Trade (Tibet)",      remittance:4,  income:8000 },
  { id:62, name:"Jumla",          prov:6, pop:108921,  citizens:262,  projects:4,  unemploy:44, topProblem:"Poor roads",             topSkill:"Apple Farming",      remittance:8,  income:10000 },
  { id:63, name:"Kalikot",        prov:6, pop:136948,  citizens:328,  projects:3,  unemploy:48, topProblem:"No drinking water",      topSkill:"Plumbing",           remittance:10, income:9500 },
  { id:64, name:"Dailekh",        prov:6, pop:261770,  citizens:628,  projects:5,  unemploy:40, topProblem:"Lack of electricity",    topSkill:"Solar Panel Repair", remittance:20, income:10500 },
  { id:65, name:"Jajarkot",       prov:6, pop:171304,  citizens:412,  projects:3,  unemploy:43, topProblem:"No training center",     topSkill:"Masonry",            remittance:13, income:10000 },
  { id:66, name:"Rukum West",     prov:6, pop:155613,  citizens:374,  projects:3,  unemploy:41, topProblem:"Poor roads",             topSkill:"Sheep Farming",      remittance:12, income:10000 },
  { id:67, name:"Salyan",         prov:6, pop:242444,  citizens:582,  projects:5,  unemploy:38, topProblem:"No job opportunity",     topSkill:"English Language",   remittance:19, income:11000 },
  { id:68, name:"Surkhet",        prov:6, pop:350804,  citizens:842,  projects:8,  unemploy:35, topProblem:"No job opportunity",     topSkill:"Driving/Transport",  remittance:28, income:12000 },
  // Sudurpashchim (7)
  { id:69, name:"Bajura",         prov:7, pop:134912,  citizens:324,  projects:3,  unemploy:38, topProblem:"No drinking water",      topSkill:"Animal Husbandry",   remittance:11, income:10000 },
  { id:70, name:"Bajhang",        prov:7, pop:195159,  citizens:468,  projects:4,  unemploy:36, topProblem:"Poor roads",             topSkill:"Masonry",            remittance:15, income:10500 },
  { id:71, name:"Achham",         prov:7, pop:257477,  citizens:618,  projects:5,  unemploy:35, topProblem:"Gender discrimination",  topSkill:"English Language",   remittance:20, income:11000 },
  { id:72, name:"Doti",           prov:7, pop:211746,  citizens:508,  projects:4,  unemploy:34, topProblem:"Poor internet",          topSkill:"Digital Literacy",   remittance:17, income:11500 },
  { id:73, name:"Kailali",        prov:7, pop:775709,  citizens:1862, projects:10, unemploy:28, topProblem:"Flood risk",             topSkill:"Rice Cultivation",   remittance:64, income:14000 },
  { id:74, name:"Kanchanpur",     prov:7, pop:451248,  citizens:1082, projects:7,  unemploy:26, topProblem:"Deforestation",          topSkill:"Timber/Forestry",    remittance:38, income:14500 },
  { id:75, name:"Dadeldhura",     prov:7, pop:142094,  citizens:340,  projects:3,  unemploy:33, topProblem:"Youth migration",        topSkill:"English Language",   remittance:12, income:11500 },
  { id:76, name:"Baitadi",        prov:7, pop:246893,  citizens:592,  projects:4,  unemploy:32, topProblem:"No training center",     topSkill:"Carpentry",          remittance:20, income:11500 },
  { id:77, name:"Darchula",       prov:7, pop:137279,  citizens:330,  projects:3,  unemploy:34, topProblem:"Border trade issues",    topSkill:"Trade (India)",      remittance:11, income:12000 },
];

const CITIZENS = [
  { id:"C001", age:28, gender:"M", loc:"Gajuri, Dhading",       occ:"Farmer",          edu:"Secondary",         income:8500,  emp:"FARMING",    skill:"Organic Farming",    problem:"No irrigation",        returning:false, married:true  },
  { id:"C002", age:35, gender:"F", loc:"Gajuri, Dhading",       occ:"School Teacher",  edu:"Bachelor",          income:22000, emp:"GOVERNMENT", skill:"Digital Literacy",   problem:"Poor internet",        returning:false, married:true  },
  { id:"C003", age:19, gender:"M", loc:"Gajuri, Dhading",       occ:"—",               edu:"Higher Secondary",  income:0,     emp:"UNEMPLOYED", skill:"English Language",   problem:"No job opportunity",   returning:false, married:false },
  { id:"C004", age:42, gender:"F", loc:"Nilkantha, Dhading",    occ:"Vegetable Seller",edu:"Primary",           income:12000, emp:"SELF",       skill:"Business Skills",    problem:"Lack of capital",      returning:false, married:true  },
  { id:"C005", age:25, gender:"M", loc:"Nilkantha, Dhading",    occ:"Solar Technician",edu:"Technical/Voc.",    income:18000, emp:"PRIVATE",    skill:"Solar Panel Repair", problem:"No training center",   returning:false, married:false },
  { id:"C006", age:55, gender:"F", loc:"Kathmandu Metro",       occ:"Tailor",          edu:"Informal",          income:9000,  emp:"SELF",       skill:"Fashion Design",     problem:"Lack of capital",      returning:false, married:true  },
  { id:"C007", age:31, gender:"M", loc:"Surkhet, Karnali",      occ:"—",               edu:"Secondary",         income:0,     emp:"UNEMPLOYED", skill:"Driving",            problem:"No job opportunity",   returning:false, married:true  },
  { id:"C008", age:22, gender:"F", loc:"Humla, Karnali",        occ:"—",               edu:"Primary",           income:0,     emp:"UNEMPLOYED", skill:"English Language",   problem:"No drinking water",    returning:false, married:false },
  { id:"C009", age:44, gender:"M", loc:"Jhapa, Koshi",          occ:"Tea Farmer",      edu:"Secondary",         income:25000, emp:"FARMING",    skill:"Tea Processing",     problem:"Land disputes",        returning:false, married:true  },
  { id:"C010", age:29, gender:"F", loc:"Pokhara, Kaski",        occ:"Tour Guide",      edu:"Bachelor",          income:32000, emp:"SELF",       skill:"Tourism/Hospitality",problem:"Waste management",     returning:false, married:false },
  { id:"C011", age:38, gender:"M", loc:"Kathmandu Metro",       occ:"Software Dev",    edu:"Bachelor",          income:85000, emp:"PRIVATE",    skill:"IT/Software Dev",    problem:"High living cost",     returning:false, married:true  },
  { id:"C012", age:26, gender:"F", loc:"Janakpur, Dhanusha",    occ:"—",               edu:"Secondary",         income:0,     emp:"UNEMPLOYED", skill:"Tailoring",          problem:"Gender discrimination",returning:false, married:false },
  { id:"C013", age:50, gender:"M", loc:"Biratnagar, Morang",    occ:"Factory Manager", edu:"Bachelor",          income:45000, emp:"PRIVATE",    skill:"Management",         problem:"Industrial pollution",  returning:false, married:true  },
  { id:"C014", age:23, gender:"F", loc:"Dang, Lumbini",         occ:"Nurse Student",   edu:"Higher Secondary",  income:0,     emp:"UNEMPLOYED", skill:"Healthcare",         problem:"No training center",   returning:false, married:false },
  { id:"C015", age:60, gender:"M", loc:"Jumla, Karnali",        occ:"Apple Farmer",    edu:"None",              income:15000, emp:"FARMING",    skill:"Apple Farming",      problem:"Poor roads",           returning:false, married:true  },
  { id:"C016", age:33, gender:"F", loc:"Chitwan, Bagmati",      occ:"Hotel Owner",     edu:"Bachelor",          income:55000, emp:"SELF",       skill:"Eco-tourism",        problem:"Wildlife conflict",     returning:false, married:true  },
  { id:"C017", age:27, gender:"M", loc:"Butwal, Rupandehi",     occ:"Electrician",     edu:"Technical/Voc.",    income:22000, emp:"PRIVATE",    skill:"Solar Panel Repair", problem:"Poor internet",        returning:false, married:false },
  { id:"C018", age:45, gender:"F", loc:"Dhangadhi, Kailali",    occ:"Teacher",         edu:"Master",            income:28000, emp:"GOVERNMENT", skill:"Digital Literacy",   problem:"Poor roads",           returning:false, married:true  },
  { id:"C019", age:21, gender:"M", loc:"Palpa, Lumbini",        occ:"—",               edu:"Higher Secondary",  income:0,     emp:"UNEMPLOYED", skill:"Handicraft",         problem:"Youth migration",      returning:false, married:false },
  { id:"C020", age:37, gender:"F", loc:"Sindhupalchok, Bagmati",occ:"Dairy Farmer",    edu:"Secondary",         income:18000, emp:"FARMING",    skill:"Dairy Processing",   problem:"Landslide risk",       returning:false, married:true  },
  { id:"C021", age:52, gender:"M", loc:"Kalikot, Karnali",      occ:"—",               edu:"None",              income:0,     emp:"UNEMPLOYED", skill:"Animal Husbandry",   problem:"No drinking water",    returning:false, married:true  },
  { id:"C022", age:30, gender:"F", loc:"Dhankuta, Koshi",       occ:"Weaver",          edu:"Primary",           income:8000,  emp:"SELF",       skill:"Handicraft",         problem:"Lack of capital",      returning:false, married:true  },
  { id:"C023", age:24, gender:"M", loc:"Kavrepalanchok, Bagmati",occ:"Plumber",        edu:"Technical/Voc.",    income:20000, emp:"PRIVATE",    skill:"Plumbing",           problem:"Water scarcity",       returning:false, married:false },
  { id:"C024", age:41, gender:"F", loc:"Siraha, Madhesh",       occ:"—",               edu:"None",              income:0,     emp:"UNEMPLOYED", skill:"Tailoring",          problem:"Gender discrimination",returning:false, married:true  },
  { id:"C025", age:18, gender:"M", loc:"Mustang, Gandaki",      occ:"Student",         edu:"Secondary",         income:0,     emp:"UNEMPLOYED", skill:"Cultural Tourism",   problem:"Depopulation",         returning:false, married:false },
];

const DIASPORA = [
  { id:"D001", country:"Qatar",        flag:"🇶🇦", workers:400000, remit:480, avgNPR:62000,  intent:"YES",   status:"WORKER",  sector:"Construction",  skill:"Masonry",       years:3  },
  { id:"D002", country:"UAE",          flag:"🇦🇪", workers:300000, remit:350, avgNPR:45000,  intent:"UNSURE",status:"WORKER",  sector:"Service",       skill:"Hospitality",   years:4  },
  { id:"D003", country:"Saudi Arabia", flag:"🇸🇦", workers:250000, remit:290, avgNPR:38000,  intent:"NO",    status:"WORKER",  sector:"Domestic",      skill:"Caregiving",    years:5  },
  { id:"D004", country:"Malaysia",     flag:"🇲🇾", workers:200000, remit:210, avgNPR:32000,  intent:"YES",   status:"WORKER",  sector:"Manufacturing", skill:"Factory Ops",   years:2  },
  { id:"D005", country:"South Korea",  flag:"🇰🇷", workers:30000,  remit:180, avgNPR:200000, intent:"UNSURE",status:"WORKER",  sector:"Manufacturing", skill:"Electronics",   years:3  },
  { id:"D006", country:"Japan",        flag:"🇯🇵", workers:18000,  remit:150, avgNPR:280000, intent:"UNSURE",status:"BOTH",    sector:"IT",            skill:"Software Dev",  years:4  },
  { id:"D007", country:"Australia",    flag:"🇦🇺", workers:60000,  remit:120, avgNPR:350000, intent:"NO",    status:"STUDENT", sector:"Education",     skill:"IT/Data",       years:2  },
  { id:"D008", country:"USA",          flag:"🇺🇸", workers:80000,  remit:95,  avgNPR:420000, intent:"NO",    status:"BOTH",    sector:"Tech/Health",   skill:"Medicine/IT",   years:6  },
  { id:"D009", country:"UK",           flag:"🇬🇧", workers:50000,  remit:85,  avgNPR:380000, intent:"UNSURE",status:"BOTH",    sector:"Health/Edu",    skill:"Nursing",       years:5  },
  { id:"D010", country:"Kuwait",       flag:"🇰🇼", workers:120000, remit:130, avgNPR:42000,  intent:"YES",   status:"WORKER",  sector:"Construction",  skill:"Driving",       years:3  },
  { id:"D011", country:"Israel",       flag:"🇮🇱", workers:15000,  remit:110, avgNPR:180000, intent:"YES",   status:"WORKER",  sector:"Agriculture",   skill:"Farming Tech",  years:2  },
  { id:"D012", country:"Germany",      flag:"🇩🇪", workers:8000,   remit:60,  avgNPR:340000, intent:"UNSURE",status:"STUDENT", sector:"Engineering",   skill:"Mechanical Eng",years:3  },
];

const PROJECTS = [
  { id:"P001", name:"Gajuri Micro-Irrigation Scheme",         sector:"IRRIGATION",    status:"ONGOING",    progress:40,  budget:45000000,   spent:18000000,   dist:"Dhading",    prov:"Bagmati",       agency:"Dept of Irrigation",           start:"2023-03-01", end:"2025-06-30", prob:"No irrigation"         },
  { id:"P002", name:"Kathmandu Valley Ring Road Upgrade",     sector:"ROAD",          status:"ONGOING",    progress:52,  budget:2800000000, spent:1456000000, dist:"Kathmandu",  prov:"Bagmati",       agency:"Dept of Roads / ADB",           start:"2022-01-01", end:"2026-12-31", prob:""                      },
  { id:"P003", name:"Pokhara Digital Hub & Fiber Optic",      sector:"DIGITAL",       status:"PLANNED",    progress:5,   budget:850000000,  spent:0,          dist:"Kaski",      prov:"Gandaki",       agency:"Gandaki Province IT Division",  start:"2024-07-01", end:"2027-06-30", prob:"Poor internet"         },
  { id:"P004", name:"Dhading Community Health Posts (8)",     sector:"HEALTH",        status:"ONGOING",    progress:68,  budget:32000000,   spent:21760000,   dist:"Dhading",    prov:"Bagmati",       agency:"WHO / District Health Office",  start:"2023-01-01", end:"2024-12-31", prob:"Health issues"         },
  { id:"P005", name:"Madhesh Rural Electrification",          sector:"ELECTRICITY",   status:"ONGOING",    progress:50,  budget:120000000,  spent:60000000,   dist:"Mahottari",  prov:"Madhesh",       agency:"NEA / World Bank",             start:"2023-06-01", end:"2025-12-31", prob:"Lack of electricity"   },
  { id:"P006", name:"Surkhet–Jumla Road Blacktopping",        sector:"ROAD",          status:"COMPLETED",  progress:100, budget:980000000,  spent:975000000,  dist:"Surkhet",    prov:"Karnali",       agency:"Dept of Roads",                start:"2020-04-01", end:"2024-07-15", prob:""                      },
  { id:"P007", name:"Karnali Province School Renovation",     sector:"EDUCATION",     status:"ONGOING",    progress:75,  budget:55000000,   spent:41250000,   dist:"Jumla",      prov:"Karnali",       agency:"UNICEF / MoE",                 start:"2023-01-01", end:"2024-12-31", prob:"Poor education"        },
  { id:"P008", name:"Jhapa Tea Cooperative Market",           sector:"AGRICULTURE",   status:"COMPLETED",  progress:100, budget:28000000,   spent:27400000,   dist:"Jhapa",      prov:"Koshi",         agency:"Tea Cooperative Board",        start:"2022-01-01", end:"2023-06-30", prob:""                      },
  { id:"P009", name:"Lumbini Digital Skills Center",          sector:"DIGITAL",       status:"ONGOING",    progress:60,  budget:18000000,   spent:10800000,   dist:"Rupandehi",  prov:"Lumbini",       agency:"MoICT / CTEVT",                start:"2023-07-01", end:"2024-12-31", prob:"No training center"    },
  { id:"P010", name:"Kailali Flood Embankment Construction",  sector:"WATER_SANIT",   status:"ONGOING",    progress:35,  budget:210000000,  spent:73500000,   dist:"Kailali",    prov:"Sudurpashchim", agency:"Dept of Water Resources",       start:"2023-09-01", end:"2026-03-31", prob:"Flood risk"            },
  { id:"P011", name:"Chitwan Eco-Tourism Infrastructure",     sector:"AGRICULTURE",   status:"ONGOING",    progress:80,  budget:42000000,   spent:33600000,   dist:"Chitwan",    prov:"Bagmati",       agency:"DNPWC / UNDP",                 start:"2022-07-01", end:"2024-06-30", prob:"Wildlife conflict"     },
  { id:"P012", name:"Biratnagar Smart City Phase I",          sector:"DIGITAL",       status:"ONGOING",    progress:45,  budget:380000000,  spent:171000000,  dist:"Morang",     prov:"Koshi",         agency:"Morang Municipality / ADB",     start:"2023-01-01", end:"2026-06-30", prob:""                      },
  { id:"P013", name:"Karnali Drinking Water Supply Program",  sector:"WATER_SANIT",   status:"ONGOING",    progress:55,  budget:85000000,   spent:46750000,   dist:"Surkhet",    prov:"Karnali",       agency:"DWSS / SDC",                   start:"2023-04-01", end:"2025-03-31", prob:"No drinking water"     },
  { id:"P014", name:"Solukhumbu Mountain Tourism Trail",      sector:"AGRICULTURE",   status:"COMPLETED",  progress:100, budget:35000000,   spent:34200000,   dist:"Solukhumbu", prov:"Koshi",         agency:"TAAN / Province Tourism Board", start:"2021-07-01", end:"2023-12-31", prob:""                      },
  { id:"P015", name:"Madhesh Agricultural Mechanization",     sector:"AGRICULTURE",   status:"PLANNED",    progress:8,   budget:95000000,   spent:0,          dist:"Dhanusha",   prov:"Madhesh",       agency:"MoALD / FAO",                  start:"2024-10-01", end:"2027-09-30", prob:"No training center"    },
  { id:"P016", name:"Sudurpashchim Road Connectivity Pack",   sector:"ROAD",          status:"ONGOING",    progress:28,  budget:1200000000, spent:336000000,  dist:"Kailali",    prov:"Sudurpashchim", agency:"Dept of Roads / JICA",          start:"2023-01-01", end:"2027-12-31", prob:"Poor roads"            },
  { id:"P017", name:"Gandaki Province Organic Certification", sector:"AGRICULTURE",   status:"ONGOING",    progress:65,  budget:22000000,   spent:14300000,   dist:"Kaski",      prov:"Gandaki",       agency:"NARC / Gandaki Agri Division",  start:"2023-07-01", end:"2025-06-30", prob:""                      },
  { id:"P018", name:"Humla-Simikot Solar Micro-Grid",         sector:"ELECTRICITY",   status:"PLANNED",    progress:12,  budget:68000000,   spent:0,          dist:"Humla",      prov:"Karnali",       agency:"AEPC / GIZ",                   start:"2024-11-01", end:"2026-10-31", prob:"Lack of electricity"   },
  { id:"P019", name:"Kathmandu Valley Waste Management",      sector:"WATER_SANIT",   status:"SUSPENDED",  progress:22,  budget:450000000,  spent:99000000,   dist:"Kathmandu",  prov:"Bagmati",       agency:"KMC / World Bank",             start:"2022-07-01", end:"2025-06-30", prob:""                      },
  { id:"P020", name:"Mustang Cultural Heritage Preservation", sector:"EDUCATION",     status:"COMPLETED",  progress:100, budget:18000000,   spent:17600000,   dist:"Mustang",    prov:"Gandaki",       agency:"UNESCO / Province 4",           start:"2022-01-01", end:"2023-12-31", prob:""                      },
];

const SKILLS_DATA = [
  { skill:"Solar Panel Repair",    learning:4240, demanded:8100, growth:32, districts:23, topProv:"Karnali"     },
  { skill:"IT / Software Dev",     learning:3890, demanded:9800, growth:45, districts:18, topProv:"Bagmati"     },
  { skill:"Plumbing",              learning:2670, demanded:5200, growth:18, districts:31, topProv:"Sudurpashchim"},
  { skill:"English Language",      learning:7100, demanded:8400, growth:12, districts:45, topProv:"Bagmati"     },
  { skill:"Carpentry",             learning:2550, demanded:4900, growth:15, districts:38, topProv:"Koshi"       },
  { skill:"Hospitality/Tourism",   learning:3740, demanded:7600, growth:28, districts:24, topProv:"Gandaki"     },
  { skill:"Organic Farming",       learning:4980, demanded:6100, growth:22, districts:42, topProv:"Koshi"       },
  { skill:"Healthcare/Nursing",    learning:2190, demanded:5800, growth:38, districts:29, topProv:"Bagmati"     },
  { skill:"Driving/Transport",     learning:3620, demanded:4900, growth:10, districts:55, topProv:"Lumbini"     },
  { skill:"Masonry/Construction",  learning:3310, demanded:5600, growth:14, districts:44, topProv:"Karnali"     },
  { skill:"Tailoring",             learning:2840, demanded:3900, growth:8,  districts:36, topProv:"Madhesh"     },
  { skill:"Digital Marketing",     learning:1240, demanded:4600, growth:55, districts:12, topProv:"Bagmati"     },
];

const PROBLEMS_MATRIX = [
  { prob:"No job opportunity",    k:1,  c:[3400,5200,2100,1800,3100,2800,2600] },
  { prob:"Poor roads",            k:2,  c:[2100,1200,1800,2200,2400,3100,2900] },
  { prob:"No drinking water",     k:3,  c:[1800,2100,1200,1400,1600,2900,2700] },
  { prob:"Poor internet",         k:4,  c:[2400,1600,1900,2100,1800,1400,1600] },
  { prob:"Lack of electricity",   k:5,  c:[1200,2800,900, 1100,1300,2600,2400] },
  { prob:"Youth migration",       k:6,  c:[3100,1800,2400,2700,2900,2100,2300] },
  { prob:"No training center",    k:7,  c:[1900,1400,1600,1800,2000,2200,2100] },
  { prob:"Gender discrimination", k:8,  c:[1100,2400,800, 900, 1000,1200,1400] },
  { prob:"Health issues",         k:9,  c:[1600,1900,1200,1300,1500,2400,2200] },
  { prob:"Flood risk",            k:10, c:[1400,3200,1000,600, 1800,400, 1200] },
];

const SECTOR_COLORS = { ROAD:"#78716C",EDUCATION:"#3B82F6",HEALTH:"#EF4444",IRRIGATION:"#06B6D4",DIGITAL:"#8B5CF6",ELECTRICITY:"#F59E0B",AGRICULTURE:"#10B981",WATER_SANIT:"#0EA5E9",OTHER:"#6B7280" };
const PROV_COLORS   = { 1:"#3B82F6",2:"#10B981",3:"#F59E0B",4:"#8B5CF6",5:"#EC4899",6:"#EF4444",7:"#6366F1" };
const STATUS_BG     = { ONGOING:"#DBEAFE",COMPLETED:"#D1FAE5",PLANNED:"#FEF3C7",SUSPENDED:"#FEE2E2",CANCELLED:"#F1F5F9" };
const STATUS_FG     = { ONGOING:"#1E40AF",COMPLETED:"#065F46",PLANNED:"#92400E",SUSPENDED:"#991B1B",CANCELLED:"#475569" };
const TT            = { background:"#0f172a",border:"none",borderRadius:8,color:"#f1f5f9",fontSize:11,padding:"6px 10px" };

const fmt = (n)=> n>=1e9?`Rs ${(n/1e9).toFixed(2)}B`:n>=1e7?`Rs ${(n/1e7).toFixed(1)} Cr`:n>=1e5?`Rs ${(n/1e5).toFixed(1)}L`:`Rs ${n.toLocaleString()}`;

// ══════════════════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ══════════════════════════════════════════════════════════════════════════════

const Badge = ({ children, color="#DBEAFE", fg="#1E40AF", small=false })=>(
  <span style={{ fontSize:small?10:11,padding:small?"2px 6px":"3px 9px",borderRadius:99,background:color,color:fg,fontWeight:600,whiteSpace:"nowrap" }}>{children}</span>
);
const Bar_  = ({ v, color="#3B82F6", h=6 })=>(
  <div style={{ background:"#F1F5F9",borderRadius:99,height:h,overflow:"hidden" }}>
    <div style={{ width:`${Math.min(v,100)}%`,height:"100%",background:color,borderRadius:99,transition:"width 0.6s ease" }}/>
  </div>
);
const Card  = ({ children, style={} })=>(
  <div style={{ background:"#fff",border:"1px solid #E2E8F0",borderRadius:14,padding:20,...style }}>{children}</div>
);
const KPI   = ({ icon,label,value,sub,color="blue" })=>{
  const map = { blue:["#EFF6FF","#2563EB"],green:["#F0FDF4","#16A34A"],amber:["#FFFBEB","#D97706"],purple:["#F5F3FF","#7C3AED"],red:["#FEF2F2","#DC2626"],teal:["#F0FDFA","#0D9488"] };
  const [bg,fg]=map[color]||map.blue;
  return (
    <div style={{ background:"#fff",border:"1px solid #E2E8F0",borderRadius:14,padding:18 }}>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
        <span style={{ fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",letterSpacing:0.5 }}>{label}</span>
        <div style={{ width:34,height:34,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17 }}>{icon}</div>
      </div>
      <div style={{ fontSize:26,fontWeight:800,color:fg,fontVariantNumeric:"tabular-nums" }}>{value}</div>
      {sub&&<div style={{ fontSize:11,color:"#94A3B8",marginTop:5 }}>{sub}</div>}
    </div>
  );
};

// Sortable table hook
function useSortable(data, def="id") {
  const [col,setCol]=useState(def);
  const [asc,setAsc]=useState(true);
  const sort = (c)=>{ if(c===col) setAsc(a=>!a); else { setCol(c);setAsc(true); } };
  const sorted = useMemo(()=>[...data].sort((a,b)=>{
    const av=a[col]??0, bv=b[col]??0;
    if(typeof av==="string") return asc?av.localeCompare(bv):bv.localeCompare(av);
    return asc?av-bv:bv-av;
  }),[data,col,asc]);
  const Th = ({ c,children })=>(
    <th onClick={()=>sort(c)} style={{ padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:600,color:col===c?"#1D4ED8":"#64748B",textTransform:"uppercase",letterSpacing:0.5,cursor:"pointer",userSelect:"none",whiteSpace:"nowrap",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0" }}>
      {children}{col===c?asc?" ↑":" ↓":" "}
    </th>
  );
  return { sorted, Th };
}

// Search/filter
function useSearch(data, keys) {
  const [q,setQ]=useState("");
  const filtered = useMemo(()=>!q?data:data.filter(r=>keys.some(k=>String(r[k]??"").toLowerCase().includes(q.toLowerCase()))),[data,q]);
  return { filtered, q, setQ };
}

// ══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { k:"dash",     label:"Dashboard",       ne:"ड्यासबोर्ड",   icon:"📊" },
  { k:"map",      label:"Map Explorer",    ne:"नक्शा",         icon:"🗺️" },
  { k:"citizens", label:"Citizens",        ne:"नागरिक",         icon:"👥" },
  { k:"diaspora", label:"Diaspora",        ne:"प्रवासी",        icon:"✈️" },
  { k:"projects", label:"Projects",        ne:"आयोजना",         icon:"🏗️" },
  { k:"skills",   label:"Skills Analysis", ne:"सीप विश्लेषण",  icon:"⚡" },
  { k:"problems", label:"Problem Map",     ne:"समस्या नक्शा",  icon:"⚠️" },
  { k:"reports",  label:"Reports",         ne:"रिपोर्ट",         icon:"📄" },
  { k:"admin",    label:"Admin",           ne:"प्रशासन",        icon:"⚙️" },
];

function Sidebar({ active, setActive }) {
  return (
    <aside style={{ width:210,background:"#0c1425",display:"flex",flexDirection:"column",flexShrink:0 }}>
      <div style={{ padding:"18px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#DC143C,#8B0000)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 12px rgba(220,20,60,0.4)" }}>🇳🇵</div>
          <div>
            <div style={{ color:"#fff",fontWeight:700,fontSize:13 }}>Nepal Dev</div>
            <div style={{ color:"#475569",fontSize:10 }}>Tracker v2.0</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1,padding:"14px 10px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto" }}>
        {NAV_ITEMS.map(({ k,label,ne,icon })=>(
          <button key={k} onClick={()=>setActive(k)} style={{
            display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,border:"none",
            cursor:"pointer",textAlign:"left",transition:"all 0.15s",
            background:active===k?"rgba(37,99,235,0.85)":"transparent",
          }}>
            <span style={{ fontSize:16,flexShrink:0 }}>{icon}</span>
            <div>
              <div style={{ fontSize:12.5,fontWeight:active===k?700:400,color:active===k?"#fff":"#94a3b8" }}>{label}</div>
              <div style={{ fontSize:9.5,color:active===k?"rgba(255,255,255,0.55)":"#475569" }}>{ne}</div>
            </div>
          </button>
        ))}
      </nav>
      <div style={{ padding:"14px 12px",borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:9,padding:"8px 10px",borderRadius:9,background:"rgba(255,255,255,0.04)" }}>
          <div style={{ width:30,height:30,borderRadius:"50%",background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700,flexShrink:0 }}>A</div>
          <div style={{ overflow:"hidden" }}>
            <div style={{ color:"#e2e8f0",fontSize:11.5,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>Super Admin</div>
            <div style={{ color:"#475569",fontSize:9.5 }}>SUPER_ADMIN</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard() {
  const totalCitizens = ALL_DISTRICTS.reduce((s,d)=>s+d.citizens,0);
  const totalProjects = PROJECTS.length;
  const totalDiaspora = DIASPORA.reduce((s,d)=>s+d.workers,0);
  const totalRemit    = DIASPORA.reduce((s,d)=>s+d.remit,0);

  const provUnemploy = PROVINCES.map(p=>({ name:p.name, unemploy:p.unemploy, employed:100-p.unemploy, color:p.color }));
  const provPop      = PROVINCES.map(p=>({ name:p.name.substring(0,5), pop:+(p.pop/1000000).toFixed(2), pov:p.poverty }));
  const remitData    = DIASPORA.map(d=>({ name:d.country.replace(" Arabia",""), remit:d.remit }));
  const projStatus   = [
    { name:"Ongoing",   v:PROJECTS.filter(p=>p.status==="ONGOING").length,   color:"#3B82F6" },
    { name:"Completed", v:PROJECTS.filter(p=>p.status==="COMPLETED").length,  color:"#10B981" },
    { name:"Planned",   v:PROJECTS.filter(p=>p.status==="PLANNED").length,    color:"#F59E0B" },
    { name:"Suspended", v:PROJECTS.filter(p=>p.status==="SUSPENDED").length,  color:"#EF4444" },
  ];
  const trendData = [
    {m:"Jan",c:10400,d:3200},{m:"Feb",c:12100,d:3400},{m:"Mar",c:14800,d:3700},
    {m:"Apr",c:16200,d:3900},{m:"May",c:18100,d:4100},{m:"Jun",c:19500,d:4400},
  ];
  const sectorBudget = Object.entries(
    PROJECTS.reduce((acc,p)=>{ acc[p.sector]=(acc[p.sector]||0)+p.budget; return acc; },{})
  ).map(([k,v])=>({ sector:k.replace("_"," "), budget:+(v/1e7).toFixed(1), color:SECTOR_COLORS[k]||"#6B7280" })).sort((a,b)=>b.budget-a.budget);

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
      {/* Alert */}
      <div style={{ background:"linear-gradient(90deg,#FEF2F2,#FFF7ED)",border:"1px solid #FECACA",borderRadius:12,padding:"12px 16px",display:"flex",gap:10,alignItems:"flex-start" }}>
        <span style={{ fontSize:18 }}>🚨</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13,fontWeight:700,color:"#991B1B",marginBottom:2 }}>Critical: Karnali Province alert</div>
          <div style={{ fontSize:12,color:"#B45309" }}>38% unemployment, 38.2% poverty rate — 4 districts flagged as high-need. <span style={{ color:"#DC2626",fontWeight:600 }}>3 projects at risk of budget overrun.</span></div>
        </div>
        <Badge color="#FEE2E2" fg="#991B1B">Critical</Badge>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12 }}>
        <KPI icon="👥" label="Citizens"        value={totalCitizens.toLocaleString()} sub="+412 this month"     color="blue"   />
        <KPI icon="📈" label="Unemployment"    value="22.4%"                           sub="National average"    color="amber"  />
        <KPI icon="🏗️" label="Projects"        value={totalProjects}                   sub="Active: 13"          color="green"  />
        <KPI icon="✈️" label="Diaspora"         value={(totalDiaspora/1e6).toFixed(2)+"M"} sub="Registered workers"  color="purple" />
        <KPI icon="💰" label="Remittances"     value={`Rs ${totalRemit} Cr`}           sub="Annual (tracked)"    color="teal"   />
        <KPI icon="📍" label="Districts"        value="77 / 77"                         sub="All seeded"          color="red"    />
      </div>

      {/* Charts row 1 */}
      <div style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16 }}>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Province-level employment & unemployment</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={provUnemploy} barSize={18} margin={{ left:-18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize:10,fill:"#94A3B8" }} />
              <YAxis tick={{ fontSize:10,fill:"#94A3B8" }} domain={[0,100]} />
              <Tooltip contentStyle={TT} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <Bar dataKey="employed"  name="Employed %"   radius={[4,4,0,0]} stackId="a">
                {provUnemploy.map((p,i)=><Cell key={i} fill={p.color} />)}
              </Bar>
              <Bar dataKey="unemploy"  name="Unemployed %" fill="#FCA5A5"  radius={[4,4,0,0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:10 }}>Project status distribution</div>
          <div style={{ display:"flex",gap:12,alignItems:"center" }}>
            <ResponsiveContainer width={130} height={180}>
              <PieChart>
                <Pie data={projStatus} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="v" paddingAngle={4}>
                  {projStatus.map((d,i)=><Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={TT} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1,display:"flex",flexDirection:"column",gap:10 }}>
              {projStatus.map(d=>(
                <div key={d.name}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                    <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                      <div style={{ width:8,height:8,borderRadius:3,background:d.color }} />
                      <span style={{ fontSize:12,color:"#475569" }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize:13,fontWeight:700,color:"#1E293B" }}>{d.v}</span>
                  </div>
                  <Bar_ v={d.v/PROJECTS.length*100} color={d.color} h={4} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16 }}>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Citizen & diaspora registration trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData} margin={{ left:-18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize:10,fill:"#94A3B8" }} />
              <YAxis tick={{ fontSize:10,fill:"#94A3B8" }} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={TT} />
              <Area type="monotone" dataKey="c" name="Citizens"  stroke="#3B82F6" fill="#DBEAFE" strokeWidth={2} />
              <Area type="monotone" dataKey="d" name="Diaspora"  stroke="#10B981" fill="#D1FAE5" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Annual remittance by country (Cr NPR)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={remitData} layout="vertical" barSize={10} margin={{ left:10,right:10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize:9,fill:"#94A3B8" }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize:9,fill:"#94A3B8" }} width={62} />
              <Tooltip contentStyle={TT} formatter={v=>[`Rs ${v} Cr`,"Remittance"]} />
              <Bar dataKey="remit" name="Remit (Cr)" radius={[0,4,4,0]}>
                {DIASPORA.map((_,i)=><Cell key={i} fill={`hsl(${160+i*22},58%,${46+i*2}%)`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Project budget by sector (Cr NPR)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sectorBudget} barSize={14} margin={{ left:-18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="sector" tick={{ fontSize:9,fill:"#94A3B8" }} interval={0} />
              <YAxis tick={{ fontSize:9,fill:"#94A3B8" }} />
              <Tooltip contentStyle={TT} formatter={v=>[`Rs ${v} Cr`,"Budget"]} />
              <Bar dataKey="budget" name="Budget" radius={[4,4,0,0]}>
                {sectorBudget.map((d,i)=><Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Province summary table */}
      <Card>
        <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:16 }}>Province-level summary table</div>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
          <thead>
            <tr style={{ background:"#F8FAFC",borderBottom:"1px solid #E2E8F0" }}>
              {["Province","Capital","Population","Districts","Citizens","Unemployment","Poverty Rate","Literacy","GDP/Capita","Status"].map(h=>(
                <th key={h} style={{ padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:600,color:"#64748B",textTransform:"uppercase",letterSpacing:0.4,whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROVINCES.map((p,i)=>{
              const dists = ALL_DISTRICTS.filter(d=>d.prov===p.id);
              const cits  = dists.reduce((s,d)=>s+d.citizens,0);
              const alert = p.unemploy>30 || p.poverty>35;
              return (
                <tr key={p.id} style={{ borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#FAFBFD" }}>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <div style={{ width:8,height:8,borderRadius:"50%",background:p.color,flexShrink:0 }} />
                      <div>
                        <div style={{ fontWeight:600,color:"#0F172A" }}>{p.name}</div>
                        <div style={{ fontSize:10,color:"#94A3B8" }}>{p.ne}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"10px 12px",color:"#475569" }}>{p.cap}</td>
                  <td style={{ padding:"10px 12px",fontWeight:600,color:"#1E293B" }}>{p.pop.toLocaleString()}</td>
                  <td style={{ padding:"10px 12px",color:"#475569" }}>{p.districts}</td>
                  <td style={{ padding:"10px 12px",fontWeight:600,color:"#1E293B" }}>{cits.toLocaleString()}</td>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <Bar_ v={p.unemploy} color={p.unemploy>30?"#EF4444":p.unemploy>20?"#F59E0B":"#10B981"} h={5} />
                      <span style={{ fontSize:12,fontWeight:600,color:p.unemploy>30?"#DC2626":p.unemploy>20?"#D97706":"#059669",minWidth:30 }}>{p.unemploy}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <Badge color={p.poverty>30?"#FEE2E2":p.poverty>18?"#FEF3C7":"#D1FAE5"} fg={p.poverty>30?"#991B1B":p.poverty>18?"#92400E":"#065F46"} small>{p.poverty}%</Badge>
                  </td>
                  <td style={{ padding:"10px 12px",color:"#475569" }}>{p.literacy}%</td>
                  <td style={{ padding:"10px 12px" }}>Rs {p.gdppc.toLocaleString()}</td>
                  <td style={{ padding:"10px 12px" }}>
                    {alert
                      ? <Badge color="#FEE2E2" fg="#991B1B" small>High Need</Badge>
                      : p.unemploy>20
                      ? <Badge color="#FEF3C7" fg="#92400E" small>Watch</Badge>
                      : <Badge color="#D1FAE5" fg="#065F46" small>Stable</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DISTRICTS / MAP TABLE
// ══════════════════════════════════════════════════════════════════════════════
function MapExplorer() {
  const [selProv,setSelProv] = useState(null);
  const [selDist,setSelDist] = useState(null);
  const [cmpA,setCmpA]       = useState("");
  const [cmpB,setCmpB]       = useState("");
  const [tab,setTab]         = useState("map");

  const provDists = selProv ? ALL_DISTRICTS.filter(d=>d.prov===selProv.id) : ALL_DISTRICTS;
  const distA = ALL_DISTRICTS.find(d=>d.id===+cmpA);
  const distB = ALL_DISTRICTS.find(d=>d.id===+cmpB);

  const cmpRadar = distA&&distB ? [
    { metric:"Citizens",  A:distA.citizens,                    B:distB.citizens                    },
    { metric:"Projects",  A:distA.projects*20,                  B:distB.projects*20                  },
    { metric:"Income",    A:distA.income/1000,                  B:distB.income/1000                  },
    { metric:"Remittance",A:distA.remittance,                   B:distB.remittance                   },
    { metric:"Employment",A:100-distA.unemploy,                 B:100-distB.unemploy                 },
  ] : [];

  return (
    <div>
      <div style={{ display:"flex",gap:8,marginBottom:18 }}>
        {["map","table","compare"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"7px 18px",borderRadius:8,border:`1px solid ${tab===t?"#93C5FD":"#E2E8F0"}`,background:tab===t?"#EFF6FF":"#fff",color:tab===t?"#1D4ED8":"#475569",cursor:"pointer",fontSize:13,fontWeight:tab===t?600:400,textTransform:"capitalize" }}>{t==="map"?"🗺️ Map View":t==="table"?"📋 District Table":"⚖️ Comparison"}</button>
        ))}
      </div>

      {tab==="map" && (
        <div style={{ display:"flex",gap:16 }}>
          {/* Province sidebar */}
          <div style={{ width:170,display:"flex",flexDirection:"column",gap:6,flexShrink:0 }}>
            <button onClick={()=>{setSelProv(null);setSelDist(null);}} style={{ padding:"8px 12px",borderRadius:9,border:`1px solid ${!selProv?"#93C5FD":"#E2E8F0"}`,background:!selProv?"#EFF6FF":"#fff",color:!selProv?"#1D4ED8":"#475569",cursor:"pointer",fontSize:12,fontWeight:!selProv?700:400 }}>🇳🇵 All Nepal</button>
            {PROVINCES.map(p=>(
              <button key={p.id} onClick={()=>{setSelProv(p);setSelDist(null);}} style={{ padding:"8px 12px",borderRadius:9,border:`1px solid ${selProv?.id===p.id?"#93C5FD":"#E2E8F0"}`,background:selProv?.id===p.id?`${p.color}18`:"#fff",cursor:"pointer",textAlign:"left" }}>
                <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",background:p.color }} />
                  <div>
                    <div style={{ fontSize:12,fontWeight:selProv?.id===p.id?700:400,color:selProv?.id===p.id?"#1E293B":"#475569" }}>{p.name}</div>
                    <div style={{ fontSize:9.5,color:"#94A3B8" }}>{p.ne}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ flex:1 }}>
            {/* Visual map */}
            <div style={{ background:"linear-gradient(145deg,#0f172a,#1a2744,#0f172a)",borderRadius:14,padding:24,marginBottom:16,position:"relative",minHeight:240 }}>
              <div style={{ position:"absolute",top:12,left:16,fontSize:11,color:"rgba(255,255,255,0.4)" }}>Click any province bubble to explore ↓</div>
              {[
                { p:PROVINCES[0], x:78,y:38 },{ p:PROVINCES[1],x:60,y:72 },
                { p:PROVINCES[2], x:54,y:38 },{ p:PROVINCES[3],x:35,y:28 },
                { p:PROVINCES[4], x:28,y:56 },{ p:PROVINCES[5],x:20,y:30 },
                { p:PROVINCES[6], x:8, y:24 },
              ].map(({ p,x,y })=>{
                const sel=selProv?.id===p.id;
                return (
                  <button key={p.id} onClick={()=>{setSelProv(p);setSelDist(null);}} style={{
                    position:"absolute",left:`${x}%`,top:`${y}%`,transform:"translate(-50%,-50%)",
                    border:sel?"3px solid white":"2px solid rgba(255,255,255,0.25)",
                    borderRadius:"50%",width:sel?58:48,height:sel?58:48,cursor:"pointer",
                    background:`radial-gradient(circle at 35% 35%,${p.color}dd,${p.color}88)`,
                    boxShadow:sel?`0 0 28px ${p.color}88`:"0 2px 8px rgba(0,0,0,0.4)",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                    transition:"all 0.25s",
                  }}>
                    <div style={{ fontSize:8.5,fontWeight:800,color:"white",textAlign:"center",lineHeight:1.2,padding:"0 3px" }}>{p.name.length>7?p.name.slice(0,7):p.name}</div>
                    <div style={{ fontSize:8,color:"rgba(255,255,255,0.7)" }}>{p.unemploy}%↑</div>
                  </button>
                );
              })}
              {selProv && (
                <div style={{ position:"absolute",top:12,right:12,background:"rgba(15,23,42,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:16,minWidth:220,backdropFilter:"blur(8px)" }}>
                  <div style={{ fontWeight:700,color:"#fff",marginBottom:12,fontSize:13,display:"flex",alignItems:"center",gap:6 }}>
                    <div style={{ width:8,height:8,borderRadius:"50%",background:selProv.color }} />
                    {selProv.name} — {selProv.ne}
                  </div>
                  {[["Population",selProv.pop.toLocaleString()],["Districts",selProv.districts],["Capital",selProv.cap],["Unemployment",`${selProv.unemploy}%`],["Poverty",`${selProv.poverty}%`],["Literacy",`${selProv.literacy}%`],["GDP/Capita",`Rs ${selProv.gdppc.toLocaleString()}`]].map(([k,v])=>(
                    <div key={k} style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                      <span style={{ fontSize:11,color:"rgba(255,255,255,0.45)" }}>{k}</span>
                      <span style={{ fontSize:11,fontWeight:600,color:"white" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Districts grid */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10 }}>
              {provDists.slice(0,18).map(d=>(
                <button key={d.id} onClick={()=>setSelDist(d)} style={{
                  background:selDist?.id===d.id?"#EFF6FF":"#fff",
                  border:`1px solid ${selDist?.id===d.id?"#93C5FD":"#E2E8F0"}`,
                  borderRadius:11,padding:12,cursor:"pointer",textAlign:"left",transition:"all 0.15s",
                }}>
                  <div style={{ fontSize:13,fontWeight:600,color:"#0F172A",marginBottom:3 }}>📍 {d.name}</div>
                  <div style={{ fontSize:11,color:"#64748B",marginBottom:6 }}>{d.citizens.toLocaleString()} citizens · {d.projects} projects</div>
                  <div style={{ fontSize:11,color:"#DC2626",marginBottom:2 }}>⚠️ {d.topProblem}</div>
                  <div style={{ fontSize:11,color:"#7C3AED",marginBottom:6 }}>⚡ {d.topSkill}</div>
                  <Bar_ v={100-d.unemploy} color={PROV_COLORS[d.prov]||"#3B82F6"} />
                  <div style={{ fontSize:10,color:"#94A3B8",marginTop:3 }}>{d.unemploy}% unemployment · Income Rs {d.income.toLocaleString()}</div>
                </button>
              ))}
            </div>
            {selDist && (
              <Card style={{ marginTop:16,background:"#FFFBEB",borderColor:"#FDE68A" }}>
                <div style={{ fontWeight:700,color:"#0F172A",fontSize:14,marginBottom:12 }}>📊 {selDist.name} District — Detailed Stats</div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12 }}>
                  {[
                    ["Population",selDist.pop.toLocaleString(),"👥"],
                    ["Citizens tracked",selDist.citizens.toLocaleString(),"📋"],
                    ["Active projects",selDist.projects,"🏗️"],
                    ["Unemployment",`${selDist.unemploy}%`,"📈"],
                    ["Avg Income",`Rs ${selDist.income.toLocaleString()}`,   "💰"],
                    ["Remittance",`Rs ${selDist.remittance} Cr`,"✈️"],
                    ["Top problem",selDist.topProblem,"⚠️"],
                    ["Top skill",selDist.topSkill,"⚡"],
                  ].map(([k,v,ic])=>(
                    <div key={k} style={{ background:"white",borderRadius:10,padding:12,border:"1px solid #FDE68A" }}>
                      <div style={{ fontSize:16,marginBottom:4 }}>{ic}</div>
                      <div style={{ fontSize:10,color:"#92400E",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600 }}>{k}</div>
                      <div style={{ fontSize:14,fontWeight:700,color:"#1E293B",marginTop:2 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {tab==="table" && <DistrictTable />}

      {tab==="compare" && (
        <div>
          <div style={{ display:"flex",gap:12,marginBottom:18 }}>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:11,fontWeight:600,color:"#475569",display:"block",marginBottom:5 }}>District A</label>
              <select value={cmpA} onChange={e=>setCmpA(e.target.value)} style={{ width:"100%",padding:"9px 12px",border:"1px solid #E2E8F0",borderRadius:9,fontSize:13,background:"#fff" }}>
                <option value="">Select district…</option>
                {ALL_DISTRICTS.map(d=><option key={d.id} value={d.id}>{d.name} ({PROVINCES.find(p=>p.id===d.prov)?.name})</option>)}
              </select>
            </div>
            <div style={{ display:"flex",alignItems:"flex-end",paddingBottom:2,fontSize:20,color:"#94A3B8",fontWeight:300 }}>vs</div>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:11,fontWeight:600,color:"#475569",display:"block",marginBottom:5 }}>District B</label>
              <select value={cmpB} onChange={e=>setCmpB(e.target.value)} style={{ width:"100%",padding:"9px 12px",border:"1px solid #E2E8F0",borderRadius:9,fontSize:13,background:"#fff" }}>
                <option value="">Select district…</option>
                {ALL_DISTRICTS.map(d=><option key={d.id} value={d.id}>{d.name} ({PROVINCES.find(p=>p.id===d.prov)?.name})</option>)}
              </select>
            </div>
          </div>

          {distA && distB && (
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              {/* Side-by-side metric cards */}
              {[["Citizens",distA.citizens,distB.citizens,"👥"],["Projects",distA.projects,distB.projects,"🏗️"],["Unemployment",`${distA.unemploy}%`,`${distB.unemploy}%`,"📈"],["Avg Income",`Rs ${distA.income.toLocaleString()}`,`Rs ${distB.income.toLocaleString()}`,"💰"],["Remittance",`Rs ${distA.remittance}Cr`,`Rs ${distB.remittance}Cr`,"✈️"],["Top Problem",distA.topProblem,distB.topProblem,"⚠️"]].map(([k,va,vb,ic])=>(
                <Card key={k}>
                  <div style={{ fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10 }}>{ic} {k}</div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                    <div style={{ background:"#EFF6FF",borderRadius:10,padding:12,textAlign:"center" }}>
                      <div style={{ fontSize:10,color:"#1D4ED8",fontWeight:600,marginBottom:4 }}>{distA.name}</div>
                      <div style={{ fontSize:15,fontWeight:800,color:"#1E3A5F" }}>{va}</div>
                    </div>
                    <div style={{ background:"#F0FDF4",borderRadius:10,padding:12,textAlign:"center" }}>
                      <div style={{ fontSize:10,color:"#065F46",fontWeight:600,marginBottom:4 }}>{distB.name}</div>
                      <div style={{ fontSize:15,fontWeight:800,color:"#064E3B" }}>{vb}</div>
                    </div>
                  </div>
                </Card>
              ))}
              {/* Radar */}
              <Card style={{ gridColumn:"span 2" }}>
                <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Radar Comparison: {distA.name} vs {distB.name}</div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={cmpRadar} margin={{ top:10,right:30,left:30,bottom:10 }}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize:11,fill:"#64748B" }} />
                    <PolarRadiusAxis angle={30} domain={[0,"auto"]} tick={{ fontSize:9,fill:"#94A3B8" }} />
                    <Radar name={distA.name} dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
                    <Radar name={distB.name} dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                    <Legend wrapperStyle={{ fontSize:11 }} />
                    <Tooltip contentStyle={TT} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}
          {(!distA || !distB) && (
            <div style={{ textAlign:"center",padding:60,color:"#94A3B8" }}>
              <div style={{ fontSize:36,marginBottom:8 }}>⚖️</div>
              <p>Select two districts above to see a side-by-side comparison</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DistrictTable() {
  const { filtered, q, setQ } = useSearch(ALL_DISTRICTS, ["name","topProblem","topSkill"]);
  const [provFilter, setProvFilter] = useState("");
  const displayed = provFilter ? filtered.filter(d=>d.prov===+provFilter) : filtered;
  const { sorted, Th } = useSortable(displayed,"name");
  const [pg,setPg] = useState(1); const PER=15;
  const rows = sorted.slice((pg-1)*PER, pg*PER);
  const pages = Math.ceil(sorted.length/PER);

  return (
    <div>
      <div style={{ display:"flex",gap:10,marginBottom:14 }}>
        <div style={{ flex:1,position:"relative" }}>
          <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94A3B8",fontSize:14 }}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search districts, problems, skills…" style={{ width:"100%",paddingLeft:32,paddingRight:12,paddingTop:8,paddingBottom:8,fontSize:13,border:"1px solid #E2E8F0",borderRadius:8,background:"#fff",boxSizing:"border-box" }} />
        </div>
        <select value={provFilter} onChange={e=>setProvFilter(e.target.value)} style={{ padding:"8px 12px",border:"1px solid #E2E8F0",borderRadius:8,fontSize:13,background:"#fff" }}>
          <option value="">All provinces</option>
          {PROVINCES.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div style={{ fontSize:11,color:"#94A3B8",marginBottom:8 }}>{sorted.length} districts</div>
      <div style={{ background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,overflow:"hidden" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
          <thead><tr>
            <Th c="name">District</Th>
            <Th c="prov">Province</Th>
            <Th c="pop">Population</Th>
            <Th c="citizens">Citizens</Th>
            <Th c="projects">Projects</Th>
            <Th c="unemploy">Unemployment</Th>
            <Th c="income">Avg Income</Th>
            <Th c="remittance">Remittance</Th>
            <th style={{ padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",letterSpacing:0.5,background:"#F8FAFC",borderBottom:"1px solid #E2E8F0" }}>Top Problem</th>
            <th style={{ padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",letterSpacing:0.5,background:"#F8FAFC",borderBottom:"1px solid #E2E8F0" }}>Top Skill</th>
          </tr></thead>
          <tbody>
            {rows.map((d,i)=>{
              const prov = PROVINCES.find(p=>p.id===d.prov);
              const uColor = d.unemploy>40?"#DC2626":d.unemploy>25?"#D97706":"#059669";
              return (
                <tr key={d.id} style={{ borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#FAFBFD" }}>
                  <td style={{ padding:"9px 14px",fontWeight:600,color:"#0F172A" }}>📍 {d.name}</td>
                  <td style={{ padding:"9px 14px" }}><Badge color={`${prov?.color}22`} fg={prov?.color||"#64748B"} small>{prov?.name}</Badge></td>
                  <td style={{ padding:"9px 14px",color:"#475569" }}>{d.pop.toLocaleString()}</td>
                  <td style={{ padding:"9px 14px",fontWeight:600,color:"#1E293B" }}>{d.citizens.toLocaleString()}</td>
                  <td style={{ padding:"9px 14px",color:"#475569" }}>{d.projects}</td>
                  <td style={{ padding:"9px 14px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                      <Bar_ v={d.unemploy} color={uColor} h={5} />
                      <span style={{ color:uColor,fontWeight:700,minWidth:28 }}>{d.unemploy}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"9px 14px",color:"#475569" }}>Rs {d.income.toLocaleString()}</td>
                  <td style={{ padding:"9px 14px",color:"#475569" }}>Rs {d.remittance} Cr</td>
                  <td style={{ padding:"9px 14px" }}><span style={{ color:"#DC2626",fontSize:11 }}>⚠️ {d.topProblem}</span></td>
                  <td style={{ padding:"9px 14px" }}><span style={{ color:"#7C3AED",fontSize:11 }}>⚡ {d.topSkill}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12 }}>
        <button disabled={pg<=1} onClick={()=>setPg(p=>p-1)} style={{ padding:"7px 16px",border:"1px solid #E2E8F0",borderRadius:8,background:"#fff",cursor:"pointer",fontSize:12,opacity:pg<=1?0.4:1 }}>← Prev</button>
        <span style={{ fontSize:12,color:"#64748B" }}>Page {pg} of {pages} · {sorted.length} districts</span>
        <button disabled={pg>=pages} onClick={()=>setPg(p=>p+1)} style={{ padding:"7px 16px",border:"1px solid #E2E8F0",borderRadius:8,background:"#fff",cursor:"pointer",fontSize:12,opacity:pg>=pages?0.4:1 }}>Next →</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CITIZENS
// ══════════════════════════════════════════════════════════════════════════════
function Citizens() {
  const [tab,setTab] = useState("list");
  const [modal,setModal] = useState(null);
  const [addForm,setAddForm] = useState(false);
  const { filtered,q,setQ } = useSearch(CITIZENS,["loc","occ","skill","problem"]);
  const [gFilter,setGFilter] = useState("");
  const [eFilter,setEFilter] = useState("");
  const [uFilter,setUFilter] = useState(false);
  const displayed = filtered
    .filter(c=>!gFilter||c.gender===gFilter)
    .filter(c=>!eFilter||c.edu.includes(eFilter))
    .filter(c=>!uFilter||c.emp==="UNEMPLOYED");
  const { sorted,Th } = useSortable(displayed,"id");
  const [pg,setPg] = useState(1); const PER=12;

  const stats = {
    total:CITIZENS.length, unemployed:CITIZENS.filter(c=>c.emp==="UNEMPLOYED").length,
    female:CITIZENS.filter(c=>c.gender==="F").length,
    avgIncome:Math.round(CITIZENS.filter(c=>c.income>0).reduce((s,c)=>s+c.income,0)/CITIZENS.filter(c=>c.income>0).length),
  };

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display:"flex",gap:8,marginBottom:18 }}>
        {["list","analytics"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"7px 18px",borderRadius:8,border:`1px solid ${tab===t?"#93C5FD":"#E2E8F0"}`,background:tab===t?"#EFF6FF":"#fff",color:tab===t?"#1D4ED8":"#475569",cursor:"pointer",fontSize:13,fontWeight:tab===t?600:400 }}>{t==="list"?"👥 Citizen List":"📊 Analytics"}</button>
        ))}
        <button onClick={()=>setAddForm(true)} style={{ marginLeft:"auto",padding:"7px 18px",borderRadius:8,border:"none",background:"#2563EB",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600 }}>＋ Add Citizen</button>
      </div>

      {/* Quick stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16 }}>
        <KPI icon="👥" label="Total Records"   value={stats.total}                 sub="All municipalities"    color="blue"   />
        <KPI icon="📉" label="Unemployed"       value={stats.unemployed}             sub={`${Math.round(stats.unemployed/stats.total*100)}% of total`} color="amber" />
        <KPI icon="👩" label="Female"           value={stats.female}                sub={`${Math.round(stats.female/stats.total*100)}% female`}        color="purple" />
        <KPI icon="💰" label="Avg Income (emp)" value={`Rs ${stats.avgIncome.toLocaleString()}`} sub="Employed citizens"      color="green"  />
      </div>

      {tab==="list" && (
        <>
          <div style={{ display:"flex",gap:10,marginBottom:14,flexWrap:"wrap" }}>
            <div style={{ flex:1,minWidth:200,position:"relative" }}>
              <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94A3B8" }}>🔍</span>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by location, occupation, skill…" style={{ width:"100%",paddingLeft:32,paddingRight:12,paddingTop:8,paddingBottom:8,fontSize:13,border:"1px solid #E2E8F0",borderRadius:8,background:"#fff",boxSizing:"border-box" }} />
            </div>
            <select value={gFilter} onChange={e=>setGFilter(e.target.value)} style={{ padding:"8px 12px",border:"1px solid #E2E8F0",borderRadius:8,fontSize:12,background:"#fff" }}>
              <option value="">All genders</option><option value="M">Male</option><option value="F">Female</option>
            </select>
            <select value={eFilter} onChange={e=>setEFilter(e.target.value)} style={{ padding:"8px 12px",border:"1px solid #E2E8F0",borderRadius:8,fontSize:12,background:"#fff" }}>
              <option value="">All education</option>
              {["None","Primary","Secondary","Higher Secondary","Bachelor","Master","Technical/Voc.","Informal"].map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <label style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#475569",cursor:"pointer",padding:"8px 12px",border:"1px solid #E2E8F0",borderRadius:8,background:uFilter?"#FEF2F2":"#fff" }}>
              <input type="checkbox" checked={uFilter} onChange={e=>setUFilter(e.target.checked)} style={{ accentColor:"#EF4444" }} />Unemployed only
            </label>
          </div>
          <div style={{ fontSize:11,color:"#94A3B8",marginBottom:8 }}>{sorted.length} records</div>
          <div style={{ background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,overflow:"hidden" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
              <thead><tr>
                <Th c="id">ID</Th><Th c="age">Age</Th>
                <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Gender</th>
                <Th c="loc">Location</Th><Th c="occ">Occupation</Th><Th c="edu">Education</Th>
                <Th c="income">Income/mo</Th>
                <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Skill</th>
                <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Status</th>
                <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Action</th>
              </tr></thead>
              <tbody>
                {sorted.slice((pg-1)*PER,pg*PER).map((c,i)=>(
                  <tr key={c.id} style={{ borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#FAFBFD" }}>
                    <td style={{ padding:"9px 14px",fontFamily:"monospace",fontSize:11,color:"#94A3B8" }}>{c.id}</td>
                    <td style={{ padding:"9px 14px",fontWeight:700,color:"#1E293B" }}>{c.age}</td>
                    <td style={{ padding:"9px 14px" }}><Badge color={c.gender==="F"?"#FCE7F3":"#DBEAFE"} fg={c.gender==="F"?"#831843":"#1E40AF"} small>{c.gender==="M"?"Male":"Female"}</Badge></td>
                    <td style={{ padding:"9px 14px",color:"#475569",fontSize:11 }}>{c.loc}</td>
                    <td style={{ padding:"9px 14px",color:"#1E293B",fontWeight:500 }}>{c.occ}</td>
                    <td style={{ padding:"9px 14px",color:"#475569",fontSize:11 }}>{c.edu}</td>
                    <td style={{ padding:"9px 14px" }}>{c.income>0?<span style={{ color:"#065F46",fontWeight:600 }}>Rs {c.income.toLocaleString()}</span>:<span style={{ color:"#94A3B8" }}>—</span>}</td>
                    <td style={{ padding:"9px 14px" }}><span style={{ background:"#F5F3FF",color:"#6D28D9",fontSize:10,padding:"2px 7px",borderRadius:99 }}>{c.skill}</span></td>
                    <td style={{ padding:"9px 14px" }}><Badge color={c.emp==="UNEMPLOYED"?"#FEE2E2":"#D1FAE5"} fg={c.emp==="UNEMPLOYED"?"#991B1B":"#065F46"} small>{c.emp==="UNEMPLOYED"?"Unemployed":"Employed"}</Badge></td>
                    <td style={{ padding:"9px 14px" }}>
                      <button onClick={()=>setModal(c)} style={{ fontSize:11,color:"#3B82F6",background:"none",border:"none",cursor:"pointer",padding:"3px 8px",borderRadius:6,background:"#EFF6FF" }}>View ›</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12 }}>
            <button disabled={pg<=1} onClick={()=>setPg(p=>p-1)} style={{ padding:"7px 16px",border:"1px solid #E2E8F0",borderRadius:8,background:"#fff",cursor:"pointer",fontSize:12,opacity:pg<=1?0.4:1 }}>← Prev</button>
            <span style={{ fontSize:12,color:"#64748B" }}>Page {pg} / {Math.ceil(sorted.length/PER)} · {sorted.length} records</span>
            <button disabled={pg>=Math.ceil(sorted.length/PER)} onClick={()=>setPg(p=>p+1)} style={{ padding:"7px 16px",border:"1px solid #E2E8F0",borderRadius:8,background:"#fff",cursor:"pointer",fontSize:12,opacity:pg>=Math.ceil(sorted.length/PER)?0.4:1 }}>Next →</button>
          </div>
        </>
      )}

      {tab==="analytics" && (
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <Card>
            <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Education level distribution</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={Object.entries(CITIZENS.reduce((a,c)=>{a[c.edu]=(a[c.edu]||0)+1;return a},{})).map(([k,v])=>({edu:k.length>12?k.slice(0,12)+"…":k,count:v}))} barSize={16} margin={{ left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="edu" tick={{ fontSize:9,fill:"#94A3B8" }} interval={0} angle={-20} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize:9,fill:"#94A3B8" }} />
                <Tooltip contentStyle={TT} />
                <Bar dataKey="count" name="Count" fill="#8B5CF6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Employment type breakdown</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={Object.entries(CITIZENS.reduce((a,c)=>{a[c.emp]=(a[c.emp]||0)+1;return a},{})).map(([k,v],i)=>({ name:k.replace("_"," "),value:v,color:["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4"][i%6] }))} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {Object.keys(CITIZENS.reduce((a,c)=>{a[c.emp]=1;return a},{})).map((_,i)=><Cell key={i} fill={["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4"][i%6]} />)}
                </Pie>
                <Tooltip contentStyle={TT} />
                <Legend wrapperStyle={{ fontSize:10 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Income distribution (employed)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[{range:"<10K",cnt:CITIZENS.filter(c=>c.income>0&&c.income<10000).length},{range:"10–20K",cnt:CITIZENS.filter(c=>c.income>=10000&&c.income<20000).length},{range:"20–40K",cnt:CITIZENS.filter(c=>c.income>=20000&&c.income<40000).length},{range:"40K+",cnt:CITIZENS.filter(c=>c.income>=40000).length}]} barSize={24} margin={{ left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize:11,fill:"#94A3B8" }} />
                <YAxis tick={{ fontSize:11,fill:"#94A3B8" }} />
                <Tooltip contentStyle={TT} />
                <Bar dataKey="cnt" name="Citizens" fill="#10B981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Top skills being learned</div>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {Object.entries(CITIZENS.reduce((a,c)=>{a[c.skill]=(a[c.skill]||0)+1;return a},{})).sort((a,b)=>b[1]-a[1]).map(([k,v],i)=>(
                <div key={k}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                    <span style={{ fontSize:12,color:"#475569" }}>{k}</span>
                    <span style={{ fontSize:12,fontWeight:600,color:"#7C3AED" }}>{v}</span>
                  </div>
                  <Bar_ v={v/CITIZENS.length*100*2.5} color={`hsl(${250+i*20},70%,${55+i*3}%)`} h={5} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Citizen Detail Modal */}
      {modal && (
        <div style={{ position:"fixed",inset:0,background:"rgba(15,23,42,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20 }} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div style={{ background:"#fff",borderRadius:16,padding:28,maxWidth:520,width:"100%",boxShadow:"0 25px 60px rgba(0,0,0,0.35)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:20 }}>
              <div>
                <div style={{ fontSize:11,color:"#94A3B8",fontFamily:"monospace" }}>{modal.id}</div>
                <div style={{ fontSize:18,fontWeight:800,color:"#0F172A",marginTop:2 }}>{modal.occ||"Unemployed"}</div>
                <div style={{ fontSize:13,color:"#64748B" }}>{modal.loc}</div>
              </div>
              <button onClick={()=>setModal(null)} style={{ width:32,height:32,borderRadius:"50%",border:"1px solid #E2E8F0",background:"#F8FAFC",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:"#64748B" }}>✕</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
              {[["Age",modal.age],["Gender",modal.gender==="M"?"Male":"Female"],["Education",modal.edu],["Employment",modal.emp.replace("_"," ")],["Monthly Income",modal.income>0?`Rs ${modal.income.toLocaleString()}`:"Unemployed"],["Married",modal.married?"Yes":"No"]].map(([k,v])=>(
                <div key={k} style={{ background:"#F8FAFC",borderRadius:10,padding:12 }}>
                  <div style={{ fontSize:10,color:"#94A3B8",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600 }}>{k}</div>
                  <div style={{ fontSize:14,fontWeight:600,color:"#1E293B",marginTop:3 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              <div style={{ background:"#F5F3FF",borderRadius:10,padding:12 }}>
                <div style={{ fontSize:10,color:"#7C3AED",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600 }}>Skill Learning</div>
                <div style={{ fontSize:13,fontWeight:600,color:"#1E293B",marginTop:3 }}>⚡ {modal.skill}</div>
              </div>
              <div style={{ background:"#FEF2F2",borderRadius:10,padding:12 }}>
                <div style={{ fontSize:10,color:"#DC2626",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600 }}>Top Problem</div>
                <div style={{ fontSize:13,fontWeight:600,color:"#1E293B",marginTop:3 }}>⚠️ {modal.problem}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {addForm && (
        <div style={{ position:"fixed",inset:0,background:"rgba(15,23,42,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20 }} onClick={e=>{if(e.target===e.currentTarget)setAddForm(false);}}>
          <div style={{ background:"#fff",borderRadius:16,padding:28,maxWidth:560,width:"100%",maxHeight:"85vh",overflowY:"auto" }}>
            <div style={{ fontSize:18,fontWeight:700,marginBottom:20 }}>Add New Citizen</div>
            {[["Location","location","text","Gajuri Rural Municipality, Dhading"],["Age","age","number","28"],["Occupation","occupation","text","Farmer"],["Monthly Income (NPR)","income","number","15000"],].map(([label,name,type,ph])=>(
              <div key={name} style={{ marginBottom:14 }}>
                <label style={{ fontSize:11,fontWeight:600,color:"#475569",display:"block",marginBottom:5 }}>{label}</label>
                <input type={type} placeholder={ph} style={{ width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #E2E8F0",borderRadius:9,boxSizing:"border-box" }} />
              </div>
            ))}
            {[["Gender","gender",["Male","Female","Other"]],["Education","education",["None","Primary","Secondary","Higher Secondary","Bachelor","Master","Technical/Voc."]],["Employment Type","emp",["Government","Private","Self Employed","Farming","Daily Wage","Unemployed"]]].map(([label,name,opts])=>(
              <div key={name} style={{ marginBottom:14 }}>
                <label style={{ fontSize:11,fontWeight:600,color:"#475569",display:"block",marginBottom:5 }}>{label}</label>
                <select style={{ width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #E2E8F0",borderRadius:9,boxSizing:"border-box",background:"#fff" }}>
                  {opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ display:"flex",gap:10,marginTop:20 }}>
              <button onClick={()=>setAddForm(false)} style={{ flex:1,padding:"10px",background:"#2563EB",color:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:600 }}>💾 Save</button>
              <button onClick={()=>setAddForm(false)} style={{ padding:"10px 20px",border:"1px solid #E2E8F0",borderRadius:9,background:"#fff",cursor:"pointer",fontSize:13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DIASPORA
// ══════════════════════════════════════════════════════════════════════════════
function DiasporaPage() {
  const [modal,setModal] = useState(null);
  const { sorted,Th } = useSortable(DIASPORA,"workers");
  const totalW = DIASPORA.reduce((s,d)=>s+d.workers,0);
  const totalR = DIASPORA.reduce((s,d)=>s+d.remit,0);
  const intReturn = { YES:DIASPORA.filter(d=>d.intent==="YES").length, NO:DIASPORA.filter(d=>d.intent==="NO").length, UNSURE:DIASPORA.filter(d=>d.intent==="UNSURE").length };

  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
        <KPI icon="✈️" label="Total Diaspora"    value={(totalW/1e6).toFixed(2)+"M"} sub="Registered workers"       color="blue"   />
        <KPI icon="💰" label="Total Remittance"  value={`Rs ${totalR} Cr`}           sub="Annual (all countries)"  color="green"  />
        <KPI icon="🔙" label="Will Return"        value={intReturn.YES}               sub="intend to return home"   color="teal"   />
        <KPI icon="🎓" label="Students Abroad"   value={DIASPORA.filter(d=>d.status==="STUDENT"||d.status==="BOTH").length} sub="Registered"             color="purple" />
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16,marginBottom:18 }}>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Remittance flow by destination (Cr NPR/yr)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[...DIASPORA].sort((a,b)=>b.remit-a.remit)} barSize={20} margin={{ left:-18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="country" tick={{ fontSize:10,fill:"#94A3B8" }} interval={0} />
              <YAxis tick={{ fontSize:10,fill:"#94A3B8" }} />
              <Tooltip contentStyle={TT} formatter={v=>[`Rs ${v} Cr`,"Remittance"]} />
              <Bar dataKey="remit" name="Remittance (Cr)" radius={[5,5,0,0]}>
                {DIASPORA.map((_,i)=><Cell key={i} fill={`hsl(${185+i*18},65%,${44+i*2}%)`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:10 }}>Return intention</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={[{n:"Will return",v:intReturn.YES,c:"#10B981"},{n:"Unsure",v:intReturn.UNSURE,c:"#F59E0B"},{n:"No",v:intReturn.NO,c:"#EF4444"}]} cx="50%" cy="50%" outerRadius={65} dataKey="v" nameKey="n" paddingAngle={4}>
                {[{c:"#10B981"},{c:"#F59E0B"},{c:"#EF4444"}].map((d,i)=><Cell key={i} fill={d.c} />)}
              </Pie>
              <Tooltip contentStyle={TT} />
              <Legend wrapperStyle={{ fontSize:10 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop:12 }}>
            <div style={{ fontSize:11,fontWeight:600,color:"#475569",marginBottom:6 }}>Avg salary by country (NPR/mo)</div>
            {DIASPORA.slice(0,5).map(d=>(
              <div key={d.country} style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <span style={{ fontSize:11,color:"#64748B" }}>{d.flag} {d.country}</span>
                <span style={{ fontSize:11,fontWeight:700,color:"#1E293B" }}>Rs {d.avgNPR.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:16 }}>Diaspora registry — all countries</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead><tr>
              <Th c="country">Country</Th><Th c="workers">Workers</Th><Th c="remit">Remittance (Cr)</Th>
              <Th c="avgNPR">Avg Salary (NPR)</Th>
              <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Status</th>
              <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Sector</th>
              <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Top Skill</th>
              <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Return</th>
              <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Action</th>
            </tr></thead>
            <tbody>
              {sorted.map((d,i)=>(
                <tr key={d.id} style={{ borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#FAFBFD" }}>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <span style={{ fontSize:18 }}>{d.flag}</span>
                      <div>
                        <div style={{ fontWeight:600,color:"#0F172A" }}>{d.country}</div>
                        <div style={{ fontSize:10,color:"#94A3B8" }}>{d.years} yrs avg abroad</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"10px 14px",fontWeight:700,color:"#1E293B" }}>{d.workers.toLocaleString()}</td>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ marginBottom:3,fontWeight:600,color:"#065F46" }}>Rs {d.remit} Cr</div>
                    <Bar_ v={d.remit/500*100} color="#10B981" h={4} />
                  </td>
                  <td style={{ padding:"10px 14px",fontWeight:600,color:"#1E293B" }}>Rs {d.avgNPR.toLocaleString()}</td>
                  <td style={{ padding:"10px 14px" }}><Badge color="#DBEAFE" fg="#1E40AF" small>{d.status}</Badge></td>
                  <td style={{ padding:"10px 14px",color:"#475569",fontSize:11 }}>{d.sector}</td>
                  <td style={{ padding:"10px 14px" }}><span style={{ background:"#F5F3FF",color:"#6D28D9",fontSize:10,padding:"2px 7px",borderRadius:99 }}>{d.skill}</span></td>
                  <td style={{ padding:"10px 14px" }}>
                    <Badge color={d.intent==="YES"?"#D1FAE5":d.intent==="NO"?"#FEE2E2":"#FEF3C7"} fg={d.intent==="YES"?"#065F46":d.intent==="NO"?"#991B1B":"#92400E"} small>{d.intent}</Badge>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <button onClick={()=>setModal(d)} style={{ fontSize:11,color:"#3B82F6",background:"#EFF6FF",border:"none",cursor:"pointer",padding:"3px 8px",borderRadius:6 }}>Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <div style={{ position:"fixed",inset:0,background:"rgba(15,23,42,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000 }} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div style={{ background:"#fff",borderRadius:16,padding:28,maxWidth:440,width:"100%",margin:20 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:20 }}>
              <div><span style={{ fontSize:28 }}>{modal.flag}</span><div style={{ fontSize:18,fontWeight:800,color:"#0F172A" }}>{modal.country}</div></div>
              <button onClick={()=>setModal(null)} style={{ width:32,height:32,borderRadius:"50%",border:"1px solid #E2E8F0",background:"#F8FAFC",cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {[["Workers",modal.workers.toLocaleString()],["Status",modal.status],["Sector",modal.sector],["Top Skill",modal.skill],["Avg Monthly (NPR)",`Rs ${modal.avgNPR.toLocaleString()}`],["Annual Remit",`Rs ${modal.remit} Cr`],["Avg Years Abroad",modal.years],["Return Intent",modal.intent]].map(([k,v])=>(
                <div key={k} style={{ background:"#F8FAFC",borderRadius:10,padding:12 }}>
                  <div style={{ fontSize:10,color:"#94A3B8",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600 }}>{k}</div>
                  <div style={{ fontSize:13,fontWeight:600,color:"#1E293B",marginTop:3 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ══════════════════════════════════════════════════════════════════════════════
function ProjectsPage() {
  const [view,setView]   = useState("cards");
  const [status,setStatus] = useState("");
  const [sector,setSector] = useState("");
  const [modal,setModal] = useState(null);
  const { filtered,q,setQ } = useSearch(PROJECTS,["name","dist","prov","agency"]);
  const shown = filtered.filter(p=>(!status||p.status===status)&&(!sector||p.sector===sector));
  const { sorted,Th } = useSortable(shown,"name");

  const totalBudget = PROJECTS.reduce((s,p)=>s+p.budget,0);
  const totalSpent  = PROJECTS.reduce((s,p)=>s+p.spent,0);

  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
        <KPI icon="🏗️" label="Total Projects"   value={PROJECTS.length}                sub="All statuses"          color="blue"   />
        <KPI icon="💰" label="Total Budget"      value={fmt(totalBudget)}               sub="All projects"          color="amber"  />
        <KPI icon="📊" label="Total Spent"       value={fmt(totalSpent)}                sub={`${Math.round(totalSpent/totalBudget*100)}% utilisation`} color="green" />
        <KPI icon="✅" label="Completed"         value={PROJECTS.filter(p=>p.status==="COMPLETED").length} sub="This fiscal year" color="teal" />
      </div>

      <div style={{ display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center" }}>
        <div style={{ position:"relative",flex:1,minWidth:200 }}>
          <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94A3B8" }}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search projects…" style={{ width:"100%",paddingLeft:32,paddingRight:12,paddingTop:8,paddingBottom:8,fontSize:13,border:"1px solid #E2E8F0",borderRadius:8,background:"#fff",boxSizing:"border-box" }} />
        </div>
        <select value={status} onChange={e=>setStatus(e.target.value)} style={{ padding:"8px 12px",border:"1px solid #E2E8F0",borderRadius:8,fontSize:12,background:"#fff" }}>
          <option value="">All statuses</option>
          {["ONGOING","COMPLETED","PLANNED","SUSPENDED"].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sector} onChange={e=>setSector(e.target.value)} style={{ padding:"8px 12px",border:"1px solid #E2E8F0",borderRadius:8,fontSize:12,background:"#fff" }}>
          <option value="">All sectors</option>
          {Object.keys(SECTOR_COLORS).map(s=><option key={s} value={s}>{s.replace("_"," ")}</option>)}
        </select>
        <div style={{ display:"flex",gap:4 }}>
          {["cards","table"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{ padding:"8px 12px",borderRadius:8,border:`1px solid ${view===v?"#93C5FD":"#E2E8F0"}`,background:view===v?"#EFF6FF":"#fff",cursor:"pointer",fontSize:13,color:view===v?"#1D4ED8":"#475569" }}>{v==="cards"?"🃏":"📋"}</button>
          ))}
        </div>
      </div>
      <div style={{ fontSize:11,color:"#94A3B8",marginBottom:12 }}>{shown.length} projects</div>

      {view==="cards" && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14 }}>
          {shown.map(p=>{
            const color=SECTOR_COLORS[p.sector]||"#6B7280";
            return (
              <div key={p.id} onClick={()=>setModal(p)} style={{ background:"#fff",border:"1px solid #E2E8F0",borderRadius:14,padding:18,cursor:"pointer",transition:"box-shadow 0.15s" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
                  <div style={{ flex:1,marginRight:10 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
                      <div style={{ width:8,height:8,borderRadius:"50%",background:color }} />
                      <span style={{ fontSize:10,color:"#94A3B8",fontWeight:600 }}>{p.sector.replace("_"," ")}</span>
                    </div>
                    <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",lineHeight:1.3 }}>{p.name}</div>
                  </div>
                  <Badge color={STATUS_BG[p.status]||"#F1F5F9"} fg={STATUS_FG[p.status]||"#475569"} small>{p.status}</Badge>
                </div>
                <div style={{ fontSize:11,color:"#64748B",marginBottom:6 }}>📍 {p.dist} · {p.prov}</div>
                <div style={{ fontSize:11,color:"#475569",marginBottom:4 }}>Budget: <strong>{fmt(p.budget)}</strong> · Spent: <strong>{fmt(p.spent)}</strong></div>
                <div style={{ fontSize:11,color:"#64748B",marginBottom:10 }}>🏢 {p.agency}</div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"#94A3B8",marginBottom:4 }}>
                  <span>Progress</span><span style={{ fontWeight:700,color:"#475569" }}>{p.progress}%</span>
                </div>
                <Bar_ v={p.progress} color={color} h={7} />
                {p.prob && <div style={{ marginTop:8,fontSize:10,color:"#DC2626",background:"#FEF2F2",borderRadius:6,padding:"3px 8px",display:"inline-block" }}>Triggered by: {p.prob}</div>}
              </div>
            );
          })}
        </div>
      )}

      {view==="table" && (
        <div style={{ background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,overflow:"hidden" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead><tr>
              <Th c="name">Project Name</Th><Th c="sector">Sector</Th><Th c="status">Status</Th>
              <Th c="prov">Province</Th><Th c="dist">District</Th><Th c="budget">Budget</Th>
              <Th c="spent">Spent</Th><Th c="progress">Progress</Th>
              <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Agency</th>
              <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Detail</th>
            </tr></thead>
            <tbody>
              {sorted.map((p,i)=>{
                const color=SECTOR_COLORS[p.sector]||"#6B7280";
                return (
                  <tr key={p.id} style={{ borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#FAFBFD" }}>
                    <td style={{ padding:"9px 14px",fontWeight:600,color:"#0F172A",maxWidth:200 }}>{p.name}</td>
                    <td style={{ padding:"9px 14px" }}><span style={{ fontSize:10,padding:"2px 7px",borderRadius:99,background:`${color}22`,color,fontWeight:600 }}>{p.sector.replace("_"," ")}</span></td>
                    <td style={{ padding:"9px 14px" }}><Badge color={STATUS_BG[p.status]||"#F1F5F9"} fg={STATUS_FG[p.status]||"#475569"} small>{p.status}</Badge></td>
                    <td style={{ padding:"9px 14px",color:"#475569",fontSize:11 }}>{p.prov}</td>
                    <td style={{ padding:"9px 14px",color:"#475569",fontSize:11 }}>{p.dist}</td>
                    <td style={{ padding:"9px 14px",fontWeight:600,color:"#1E293B" }}>{fmt(p.budget)}</td>
                    <td style={{ padding:"9px 14px",color:"#475569" }}>{fmt(p.spent)}</td>
                    <td style={{ padding:"9px 14px",minWidth:120 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                        <Bar_ v={p.progress} color={color} h={5} />
                        <span style={{ fontSize:11,fontWeight:600,color:"#1E293B",minWidth:28 }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"9px 14px",color:"#64748B",fontSize:11,maxWidth:140 }}>{p.agency}</td>
                    <td style={{ padding:"9px 14px" }}><button onClick={()=>setModal(p)} style={{ fontSize:11,color:"#3B82F6",background:"#EFF6FF",border:"none",cursor:"pointer",padding:"3px 8px",borderRadius:6 }}>View</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div style={{ position:"fixed",inset:0,background:"rgba(15,23,42,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20 }} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div style={{ background:"#fff",borderRadius:16,padding:28,maxWidth:560,width:"100%",maxHeight:"85vh",overflowY:"auto" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:20 }}>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:6 }}>
                  <div style={{ width:10,height:10,borderRadius:"50%",background:SECTOR_COLORS[modal.sector]||"#6B7280" }} />
                  <span style={{ fontSize:11,color:"#64748B",fontWeight:600 }}>{modal.sector.replace("_"," ")} · {modal.id}</span>
                </div>
                <div style={{ fontSize:17,fontWeight:800,color:"#0F172A",lineHeight:1.3 }}>{modal.name}</div>
              </div>
              <button onClick={()=>setModal(null)} style={{ width:32,height:32,borderRadius:"50%",border:"1px solid #E2E8F0",background:"#F8FAFC",cursor:"pointer",flexShrink:0,marginLeft:12 }}>✕</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18 }}>
              {[["Province",modal.prov],["District",modal.dist],["Status",modal.status],["Agency",modal.agency],["Budget",fmt(modal.budget)],["Spent",fmt(modal.spent)],["Start",modal.start],["End",modal.end]].map(([k,v])=>(
                <div key={k} style={{ background:"#F8FAFC",borderRadius:10,padding:12 }}>
                  <div style={{ fontSize:10,color:"#94A3B8",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600 }}>{k}</div>
                  <div style={{ fontSize:13,fontWeight:600,color:"#1E293B",marginTop:3 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13,fontWeight:600 }}><span>Overall Progress</span><span>{modal.progress}%</span></div>
              <Bar_ v={modal.progress} color={SECTOR_COLORS[modal.sector]||"#3B82F6"} h={12} />
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13,fontWeight:600 }}><span>Budget Utilisation</span><span>{Math.round(modal.spent/modal.budget*100)}%</span></div>
              <Bar_ v={modal.spent/modal.budget*100} color="#F59E0B" h={12} />
            </div>
            {modal.prob && <div style={{ background:"#FEF2F2",borderRadius:10,padding:12,marginTop:12 }}><div style={{ fontSize:11,color:"#DC2626",fontWeight:600 }}>⚠️ Triggered by citizen problem: {modal.prob}</div></div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SKILLS ANALYSIS
// ══════════════════════════════════════════════════════════════════════════════
function SkillsAnalysis() {
  const { sorted,Th } = useSortable(SKILLS_DATA,"demanded");
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
        <KPI icon="⚡" label="Skills Tracked"   value={SKILLS_DATA.length}                         sub="Across all districts"  color="purple" />
        <KPI icon="📈" label="Highest Demand"   value="IT / Software Dev"                           sub="9,800 jobs needed"     color="blue"   />
        <KPI icon="🚀" label="Fastest Growing"  value="Digital Marketing"                           sub="+55% growth YoY"       color="green"  />
        <KPI icon="⚠️" label="Biggest Gap"      value="IT / Software Dev"                           sub="5,910 shortage"        color="amber"  />
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16,marginBottom:16 }}>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Skills gap: people learning vs market demand</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SKILLS_DATA} layout="vertical" barSize={10} barGap={2} margin={{ left:30,right:20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize:10,fill:"#94A3B8" }} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} />
              <YAxis dataKey="skill" type="category" tick={{ fontSize:10,fill:"#475569" }} width={110} />
              <Tooltip contentStyle={TT} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <Bar dataKey="learning" name="Currently learning" fill="#8B5CF6" radius={[0,4,4,0]} />
              <Bar dataKey="demanded" name="Demanded by market"  fill="#DDD6FE" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Growth rate by skill (%/yr)</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[...SKILLS_DATA].sort((a,b)=>b.growth-a.growth)} barSize={14} margin={{ left:-20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="skill" tick={{ fontSize:8,fill:"#94A3B8" }} interval={0} angle={-35} textAnchor="end" height={55} />
              <YAxis tick={{ fontSize:10,fill:"#94A3B8" }} unit="%" />
              <Tooltip contentStyle={TT} formatter={v=>[`${v}%`,"Growth"]} />
              <Bar dataKey="growth" name="Growth %" radius={[4,4,0,0]}>
                {SKILLS_DATA.sort((a,b)=>b.growth-a.growth).map((_,i)=><Cell key={i} fill={`hsl(${145+i*12},65%,${42+i*2}%)`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:16 }}>Complete skills matrix — sortable</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead><tr>
              <Th c="skill">Skill</Th><Th c="learning">Learning</Th><Th c="demanded">Demanded</Th>
              <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Gap</th>
              <Th c="growth">Growth %</Th><Th c="districts">Districts</Th><Th c="topProv">Top Province</Th>
              <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Coverage</th>
              <th style={{ padding:"10px 14px",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",textAlign:"left" }}>Priority</th>
            </tr></thead>
            <tbody>
              {sorted.map((s,i)=>{
                const gap=s.demanded-s.learning;
                const coverage=Math.round(s.learning/s.demanded*100);
                const priority=gap>3000?"HIGH":gap>1500?"MEDIUM":"LOW";
                const pColor=priority==="HIGH"?"#FEE2E2":priority==="MEDIUM"?"#FEF3C7":"#D1FAE5";
                const pFg=priority==="HIGH"?"#991B1B":priority==="MEDIUM"?"#92400E":"#065F46";
                return (
                  <tr key={s.skill} style={{ borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#FAFBFD" }}>
                    <td style={{ padding:"10px 14px",fontWeight:600,color:"#0F172A" }}>⚡ {s.skill}</td>
                    <td style={{ padding:"10px 14px",fontWeight:600,color:"#7C3AED" }}>{s.learning.toLocaleString()}</td>
                    <td style={{ padding:"10px 14px",fontWeight:600,color:"#1E40AF" }}>{s.demanded.toLocaleString()}</td>
                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ color:"#DC2626",fontWeight:700 }}>−{gap.toLocaleString()}</span>
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ color:s.growth>30?"#059669":s.growth>15?"#D97706":"#64748B",fontWeight:600 }}>+{s.growth}%</span>
                    </td>
                    <td style={{ padding:"10px 14px",color:"#475569" }}>{s.districts}</td>
                    <td style={{ padding:"10px 14px" }}><Badge small color={`${PROVINCES.find(p=>p.name===s.topProv)?.color||"#64748B"}22`} fg={PROVINCES.find(p=>p.name===s.topProv)?.color||"#64748B"}>{s.topProv}</Badge></td>
                    <td style={{ padding:"10px 14px",minWidth:100 }}>
                      <div style={{ marginBottom:2 }}><Bar_ v={coverage} color="#8B5CF6" h={5} /></div>
                      <div style={{ fontSize:10,color:"#94A3B8" }}>{coverage}% covered</div>
                    </td>
                    <td style={{ padding:"10px 14px" }}><Badge color={pColor} fg={pFg} small>{priority}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROBLEM MAP
// ══════════════════════════════════════════════════════════════════════════════
function ProblemMap() {
  const [sel,setSel] = useState(0);
  const provNames = PROVINCES.map(p=>p.name);
  const maxVal    = Math.max(...PROBLEMS_MATRIX.flatMap(r=>r.c));

  return (
    <div>
      <Card style={{ marginBottom:16 }}>
        <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:16 }}>Problem intensity heatmap — province × problem type</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ borderCollapse:"collapse",fontSize:11 }}>
            <thead>
              <tr>
                <th style={{ padding:"8px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"#475569",minWidth:160 }}>Problem Type</th>
                {provNames.map((n,i)=>(
                  <th key={i} style={{ padding:"8px 10px",textAlign:"center",fontSize:10,fontWeight:600,color:PROVINCES[i].color,minWidth:80 }}>
                    <div>{n}</div><div style={{ fontSize:9,color:"#94A3B8",fontWeight:400 }}>{PROVINCES[i].ne}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROBLEMS_MATRIX.map((row,ri)=>(
                <tr key={row.k} style={{ borderBottom:"1px solid #F1F5F9" }}>
                  <td style={{ padding:"8px 14px",fontWeight:600,color:"#1E293B" }}>⚠️ {row.prob}</td>
                  {row.c.map((v,ci)=>{
                    const intensity=v/maxVal;
                    const r=Math.round(239*intensity+241*(1-intensity));
                    const g=Math.round(68 *intensity+245*(1-intensity));
                    const b=Math.round(68 *intensity+249*(1-intensity));
                    return (
                      <td key={ci} style={{ padding:"7px 10px",textAlign:"center",background:`rgba(${r},${g},${b},${0.15+intensity*0.7})`,cursor:"pointer" }}
                        onClick={()=>setSel(ci)}>
                        <div style={{ fontSize:12,fontWeight:700,color:`rgb(${Math.round(r*0.6)},${Math.round(g*0.4)},${Math.round(b*0.4)})` }}>{v.toLocaleString()}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:12 }}>
          <span style={{ fontSize:11,color:"#94A3B8" }}>Low</span>
          <div style={{ display:"flex",gap:2 }}>
            {[0.1,0.3,0.5,0.7,0.9].map((v,i)=>{
              const intensity=v;
              const r=Math.round(239*intensity+241*(1-intensity));
              const g=Math.round(68*intensity+245*(1-intensity));
              const b=Math.round(68*intensity+249*(1-intensity));
              return <div key={i} style={{ width:24,height:12,borderRadius:3,background:`rgba(${r},${g},${b},${0.15+intensity*0.7})` }} />;
            })}
          </div>
          <span style={{ fontSize:11,color:"#94A3B8" }}>High</span>
        </div>
      </Card>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Top problems by province (selected: {PROVINCES[sel]?.name})</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={PROBLEMS_MATRIX.map(r=>({ prob:r.prob.length>18?r.prob.slice(0,18)+"…":r.prob, count:r.c[sel] })).sort((a,b)=>b.count-a.count)} layout="vertical" barSize={12} margin={{ left:10,right:10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize:9,fill:"#94A3B8" }} />
              <YAxis dataKey="prob" type="category" tick={{ fontSize:9,fill:"#475569" }} width={130} />
              <Tooltip contentStyle={TT} />
              <Bar dataKey="count" name="Citizens reporting" radius={[0,4,4,0]} fill={PROVINCES[sel]?.color||"#EF4444"} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:"flex",gap:6,marginTop:10,flexWrap:"wrap" }}>
            {PROVINCES.map((p,i)=>(
              <button key={i} onClick={()=>setSel(i)} style={{ padding:"4px 10px",borderRadius:99,border:`1px solid ${sel===i?p.color:"#E2E8F0"}`,background:sel===i?`${p.color}22`:"#fff",color:sel===i?p.color:"#64748B",cursor:"pointer",fontSize:11,fontWeight:sel===i?700:400 }}>{p.name}</button>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:14 }}>Province with highest count per problem</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {PROBLEMS_MATRIX.map(row=>{
              const maxIdx=row.c.indexOf(Math.max(...row.c));
              const prov=PROVINCES[maxIdx];
              return (
                <div key={row.k} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#F8FAFC",borderRadius:9 }}>
                  <div style={{ fontSize:12,color:"#1E293B",fontWeight:500 }}>⚠️ {row.prob}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <Badge color={`${prov.color}22`} fg={prov.color} small>{prov.name}</Badge>
                    <span style={{ fontSize:11,fontWeight:700,color:"#DC2626" }}>{Math.max(...row.c).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORTS
// ══════════════════════════════════════════════════════════════════════════════
function Reports() {
  const [prov,setProv]   = useState("");
  const [dist,setDist]   = useState("");
  const [generated,setGenerated] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [uploadResult,setUploadResult] = useState(null);
  const dists = dist?[]:prov?ALL_DISTRICTS.filter(d=>d.prov===+prov):[];

  const selDist  = dist ? ALL_DISTRICTS.find(d=>d.id===+dist) : null;
  const selProv  = prov ? PROVINCES.find(p=>p.id===+prov) : null;
  const locationName = selDist?.name || selProv?.name || "All Nepal";

  const citizens = selDist ? selDist.citizens : selProv ? ALL_DISTRICTS.filter(d=>d.prov===+prov).reduce((s,d)=>s+d.citizens,0) : ALL_DISTRICTS.reduce((s,d)=>s+d.citizens,0);
  const projects_ = selDist ? PROJECTS.filter(p=>p.dist===selDist.name) : selProv ? PROJECTS.filter(p=>p.prov===selProv.name) : PROJECTS;
  const remit    = selDist ? selDist.remittance : selProv ? ALL_DISTRICTS.filter(d=>d.prov===+prov).reduce((s,d)=>s+d.remittance,0) : DIASPORA.reduce((s,d)=>s+d.remit,0);

  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        {/* Report Generator */}
        <Card>
          <div style={{ fontSize:14,fontWeight:700,color:"#0F172A",marginBottom:16 }}>📄 Generate Development Report</div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11,fontWeight:600,color:"#475569",display:"block",marginBottom:5 }}>Province</label>
            <select value={prov} onChange={e=>{setProv(e.target.value);setDist("");setGenerated(false);}} style={{ width:"100%",padding:"9px 12px",border:"1px solid #E2E8F0",borderRadius:9,fontSize:13,background:"#fff" }}>
              <option value="">🇳🇵 All Nepal</option>
              {PROVINCES.map(p=><option key={p.id} value={p.id}>{p.name} — {p.ne}</option>)}
            </select>
          </div>
          {prov && (
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11,fontWeight:600,color:"#475569",display:"block",marginBottom:5 }}>District (optional)</label>
              <select value={dist} onChange={e=>{setDist(e.target.value);setGenerated(false);}} style={{ width:"100%",padding:"9px 12px",border:"1px solid #E2E8F0",borderRadius:9,fontSize:13,background:"#fff" }}>
                <option value="">All districts in province</option>
                {ALL_DISTRICTS.filter(d=>d.prov===+prov).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          )}
          <button onClick={()=>setGenerated(true)} style={{ width:"100%",padding:"11px",background:"#2563EB",color:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:700 }}>
            📊 Generate Report
          </button>

          {generated && (
            <div style={{ marginTop:16,background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:12,padding:16 }}>
              <div style={{ fontSize:13,fontWeight:700,color:"#166534",marginBottom:12 }}>✅ Report: {locationName}</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12 }}>
                {[["Citizens tracked",citizens.toLocaleString()],["Active projects",projects_.filter(p=>p.status==="ONGOING").length],["Remittances",`Rs ${remit} Cr`],["Unemployment",selDist?`${selDist.unemploy}%`:selProv?`${selProv.unemploy}%`:"22.4%"],["Top skill",selDist?.topSkill||"Digital Literacy"],["Top problem",selDist?.topProblem||"No job opportunity"]].map(([k,v])=>(
                  <div key={k}>
                    <div style={{ fontSize:10,color:"#166534",opacity:0.7 }}>{k}</div>
                    <div style={{ fontSize:12,fontWeight:700,color:"#064E3B" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <button style={{ flex:1,padding:"8px",background:"#fff",border:"1px solid #BBF7D0",borderRadius:8,cursor:"pointer",fontSize:12,color:"#166534",fontWeight:600 }}>⬇️ PDF Report</button>
                <button style={{ flex:1,padding:"8px",background:"#fff",border:"1px solid #BBF7D0",borderRadius:8,cursor:"pointer",fontSize:12,color:"#166534",fontWeight:600 }}>⬇️ JSON Data</button>
                <button style={{ flex:1,padding:"8px",background:"#fff",border:"1px solid #BBF7D0",borderRadius:8,cursor:"pointer",fontSize:12,color:"#166534",fontWeight:600 }}>⬇️ Excel</button>
              </div>
            </div>
          )}
        </Card>

        {/* Bulk Upload */}
        <Card>
          <div style={{ fontSize:14,fontWeight:700,color:"#0F172A",marginBottom:16 }}>⬆️ Bulk CSV Upload</div>
          <div style={{ display:"flex",gap:8,marginBottom:14 }}>
            {["Citizens","Diaspora","Projects"].map((t,i)=>(
              <button key={t} style={{ flex:1,padding:"8px",borderRadius:8,border:`1px solid ${i===0?"#93C5FD":"#E2E8F0"}`,background:i===0?"#EFF6FF":"#fff",cursor:"pointer",fontSize:12,color:i===0?"#1D4ED8":"#475569",fontWeight:i===0?600:400 }}>{t}</button>
            ))}
          </div>
          <div style={{ border:"2px dashed #E2E8F0",borderRadius:12,padding:32,textAlign:"center",background:"#FAFBFD",marginBottom:12 }}>
            <div style={{ fontSize:28,marginBottom:8 }}>📂</div>
            <div style={{ fontSize:13,color:"#64748B",marginBottom:10 }}>Drop CSV file or click to browse</div>
            <button onClick={()=>{setUploading(true);setTimeout(()=>{setUploading(false);setUploadResult({created:24,errors:1,total:25});},1500);}} style={{ padding:"8px 20px",background:"#fff",border:"1px solid #E2E8F0",borderRadius:8,cursor:"pointer",fontSize:12,color:"#475569" }}>{uploading?"⏳ Processing…":"Choose file"}</button>
          </div>
          {uploadResult && (
            <div style={{ background:uploadResult.errors>0?"#FFFBEB":"#F0FDF4",border:`1px solid ${uploadResult.errors>0?"#FDE68A":"#BBF7D0"}`,borderRadius:10,padding:12 }}>
              <div style={{ fontSize:13,fontWeight:600,color:uploadResult.errors>0?"#92400E":"#166534",marginBottom:4 }}>
                {uploadResult.errors>0?"⚠️":"✅"} {uploadResult.created}/{uploadResult.total} rows imported
              </div>
              {uploadResult.errors>0&&<div style={{ fontSize:11,color:"#92400E" }}>1 row skipped: Municipality not found</div>}
            </div>
          )}
          <div style={{ display:"flex",gap:8,marginTop:12 }}>
            <button style={{ flex:1,padding:"8px",background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:8,cursor:"pointer",fontSize:12,color:"#3B82F6" }}>⬇️ Citizen CSV template</button>
            <button style={{ flex:1,padding:"8px",background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:8,cursor:"pointer",fontSize:12,color:"#3B82F6" }}>⬇️ Diaspora template</button>
          </div>
        </Card>

        {/* Export tiles */}
        <Card style={{ gridColumn:"span 2" }}>
          <div style={{ fontSize:14,fontWeight:700,color:"#0F172A",marginBottom:16 }}>📊 Anonymized Research Datasets</div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12 }}>
            {[
              { label:"Citizens dataset",       desc:"Age, gender, skills, employment",      size:"~2.4MB", color:"#EFF6FF",accent:"#2563EB" },
              { label:"Diaspora dataset",        desc:"Country, remittances, return intent",  size:"~0.8MB", color:"#F0FDF4",accent:"#16A34A" },
              { label:"Projects dataset",        desc:"Budgets, progress, sectors, agencies", size:"~1.1MB", color:"#F5F3FF",accent:"#7C3AED" },
              { label:"Districts full dataset",  desc:"All 77 districts, all metrics",        size:"~0.5MB", color:"#FFFBEB",accent:"#D97706" },
            ].map(({ label,desc,size,color,accent })=>(
              <div key={label} style={{ background:color,border:"1px solid #E2E8F0",borderRadius:12,padding:16 }}>
                <div style={{ fontSize:13,fontWeight:600,color:"#0F172A",marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:11,color:"#64748B",marginBottom:4 }}>{desc}</div>
                <div style={{ fontSize:10,color:"#94A3B8",marginBottom:10 }}>Approx. {size} · Anonymized</div>
                <button style={{ width:"100%",padding:"7px",border:`1px solid ${accent}44`,borderRadius:8,cursor:"pointer",fontSize:12,color:accent,background:"white",fontWeight:600 }}>⬇️ Export CSV</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════════════════════════════════════════
function Admin() {
  const [tab,setTab] = useState("users");
  const users = [
    { name:"Super Admin",   email:"admin@nepaltracker.gov.np",  role:"SUPER_ADMIN",   prov:"All",          status:"Active",   last:"Today 09:12" },
    { name:"Ramesh Sharma", email:"ramesh@bagmati.gov.np",      role:"PROVINCE_ADMIN",prov:"Bagmati",      status:"Active",   last:"Today 08:45" },
    { name:"Sita Kumari",   email:"sita@karnali.gov.np",        role:"DATA_ENTRY",    prov:"Karnali",      status:"Active",   last:"Yesterday"   },
    { name:"Hari Bhandari", email:"hari@gandaki.gov.np",        role:"PROVINCE_ADMIN",prov:"Gandaki",      status:"Active",   last:"2 days ago"  },
    { name:"Maya Thapa",    email:"maya@sudur.gov.np",          role:"DATA_ENTRY",    prov:"Sudurpashchim",status:"Active",   last:"Today 07:30" },
    { name:"Bikash KC",     email:"bikash@koshi.gov.np",        role:"PROVINCE_ADMIN",prov:"Koshi",        status:"Inactive", last:"1 week ago"  },
  ];
  const roleColor = { SUPER_ADMIN:["#FEE2E2","#991B1B"],PROVINCE_ADMIN:["#F5F3FF","#5B21B6"],DATA_ENTRY:["#DBEAFE","#1E40AF"] };
  const auditLog = [
    { time:"09:14",user:"Super Admin",  action:"Updated project progress",     target:"Gajuri Irrigation Scheme",    type:"update" },
    { time:"08:50",user:"Ramesh Sharma",action:"Added 12 citizens (bulk CSV)", target:"Dhading district",            type:"create" },
    { time:"08:22",user:"Sita Kumari",  action:"Added citizen record",         target:"Humla municipality",          type:"create" },
    { time:"Yesterday",user:"Hari Bhandari",action:"Created new project",      target:"Pokhara Digital Hub",         type:"create" },
    { time:"Yesterday",user:"Maya Thapa",action:"Deleted duplicate record",    target:"Citizen C089",                type:"delete" },
    { time:"2d ago",user:"Super Admin", action:"Created user account",         target:"Maya Thapa (DATA_ENTRY)",     type:"create" },
  ];

  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
        <KPI icon="🛡️" label="Total Users"  value={users.length}                            sub="All roles"       color="blue"   />
        <KPI icon="✅" label="Active Users" value={users.filter(u=>u.status==="Active").length}  sub="Last 7 days"    color="green"  />
        <KPI icon="📊" label="Total Records" value={(ALL_DISTRICTS.reduce((s,d)=>s+d.citizens,0)+DIASPORA.reduce((s,d)=>s+d.workers/1000,0)).toFixed(0)+"K+"} sub="Citizens+Diaspora" color="purple" />
        <KPI icon="🗄️" label="DB Status"    value="Healthy"                                 sub="PostgreSQL + PostGIS" color="teal" />
      </div>

      <div style={{ display:"flex",gap:8,marginBottom:16 }}>
        {["users","audit","system"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"7px 16px",borderRadius:8,border:`1px solid ${tab===t?"#93C5FD":"#E2E8F0"}`,background:tab===t?"#EFF6FF":"#fff",color:tab===t?"#1D4ED8":"#475569",cursor:"pointer",fontSize:12,fontWeight:tab===t?600:400,textTransform:"capitalize" }}>
            {t==="users"?"👥 Users":t==="audit"?"📋 Audit Log":"⚙️ System"}
          </button>
        ))}
      </div>

      {tab==="users" && (
        <Card>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <div style={{ fontSize:13,fontWeight:700,color:"#0F172A" }}>User Management</div>
            <button style={{ padding:"8px 16px",background:"#2563EB",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600 }}>＋ Add User</button>
          </div>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead style={{ background:"#F8FAFC",borderBottom:"1px solid #E2E8F0" }}>
              <tr>{["Name","Email","Role","Province","Status","Last Active","Actions"].map(h=><th key={h} style={{ padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",letterSpacing:0.4 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {users.map((u,i)=>{
                const [bg,fg]=roleColor[u.role]||["#F1F5F9","#475569"];
                return (
                  <tr key={i} style={{ borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#FAFBFD" }}>
                    <td style={{ padding:"10px 12px",fontWeight:600,color:"#0F172A" }}>{u.name}</td>
                    <td style={{ padding:"10px 12px",color:"#64748B",fontSize:11 }}>{u.email}</td>
                    <td style={{ padding:"10px 12px" }}><Badge color={bg} fg={fg} small>{u.role.replace(/_/g," ")}</Badge></td>
                    <td style={{ padding:"10px 12px",color:"#64748B",fontSize:11 }}>{u.prov}</td>
                    <td style={{ padding:"10px 12px" }}><Badge color={u.status==="Active"?"#D1FAE5":"#F1F5F9"} fg={u.status==="Active"?"#065F46":"#475569"} small>{u.status}</Badge></td>
                    <td style={{ padding:"10px 12px",color:"#94A3B8",fontSize:11 }}>{u.last}</td>
                    <td style={{ padding:"10px 12px" }}>
                      <div style={{ display:"flex",gap:4 }}>
                        <button style={{ fontSize:11,color:"#3B82F6",background:"#EFF6FF",border:"none",cursor:"pointer",padding:"3px 8px",borderRadius:6 }}>Edit</button>
                        {u.role!=="SUPER_ADMIN"&&<button style={{ fontSize:11,color:"#DC2626",background:"#FEF2F2",border:"none",cursor:"pointer",padding:"3px 8px",borderRadius:6 }}>Delete</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {tab==="audit" && (
        <Card>
          <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:16 }}>Audit Log — Recent activity</div>
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            {auditLog.map((log,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#F8FAFC",borderRadius:10,border:"1px solid #F1F5F9" }}>
                <div style={{ fontSize:16 }}>{log.type==="create"?"✅":log.type==="update"?"✏️":"🗑️"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12,fontWeight:600,color:"#1E293B" }}>{log.action}</div>
                  <div style={{ fontSize:11,color:"#64748B" }}>Target: <strong>{log.target}</strong></div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11,fontWeight:600,color:"#475569" }}>{log.user}</div>
                  <div style={{ fontSize:10,color:"#94A3B8" }}>{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab==="system" && (
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <Card>
            <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:16 }}>System Configuration</div>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {[["Database","PostgreSQL 15 + PostGIS 3.3","Healthy",true],["Authentication","NextAuth.js — JWT Strategy","Active",true],["File Storage","Local /public/uploads","Configured",true],["Email Service","SMTP — Not configured","Warning",false],["PWA / Offline","Service Worker enabled","Active",true],["Rate Limiting","100 req/min per IP (nginx)","Active",true],["Encryption","AES-256 for PII fields","Active",true],["Backups","Daily snapshot to S3","Scheduled",true]].map(([k,v,s,ok])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",border:"1px solid #F1F5F9",borderRadius:10 }}>
                  <div>
                    <div style={{ fontSize:12,fontWeight:600,color:"#1E293B" }}>{k}</div>
                    <div style={{ fontSize:11,color:"#94A3B8" }}>{v}</div>
                  </div>
                  <Badge color={ok?"#D1FAE5":"#FEF3C7"} fg={ok?"#065F46":"#92400E"} small>{s}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:16 }}>Database Statistics</div>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {[["provinces",7],["districts",77],["municipalities",20],["citizens",CITIZENS.length],["citizen_skills",CITIZENS.length*1.3|0],["citizen_problems",CITIZENS.length*1.6|0],["diaspora",DIASPORA.length],["projects",PROJECTS.length],["project_updates",PROJECTS.length*2],["users",users.length]].map(([table,rows])=>(
                <div key={table} style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <code style={{ fontSize:12,color:"#7C3AED",fontFamily:"monospace" }}>{table}</code>
                  <span style={{ fontSize:13,fontWeight:700,color:"#1E293B" }}>{rows.toLocaleString()} rows</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
const PAGE_TITLES = { dash:"Dashboard",map:"Map Explorer",citizens:"Citizens",diaspora:"Diaspora Tracker",projects:"Projects",skills:"Skills Analysis",problems:"Problem Heatmap",reports:"Reports & Export",admin:"Admin Panel" };

export default function App() {
  const [active,setActive] = useState("dash");
  const renderPage = () => {
    switch(active) {
      case "dash":     return <Dashboard />;
      case "map":      return <MapExplorer />;
      case "citizens": return <Citizens />;
      case "diaspora": return <DiasporaPage />;
      case "projects": return <ProjectsPage />;
      case "skills":   return <SkillsAnalysis />;
      case "problems": return <ProblemMap />;
      case "reports":  return <Reports />;
      case "admin":    return <Admin />;
      default:         return <Dashboard />;
    }
  };

  return (
    <div style={{ display:"flex",height:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#F1F5F9",overflow:"hidden" }}>
      <Sidebar active={active} setActive={setActive} />
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        {/* Header */}
        <header style={{ height:52,background:"#fff",borderBottom:"1px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",flexShrink:0,boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          <div>
            <div style={{ fontSize:10,color:"#94A3B8",letterSpacing:0.3 }}>Home › {PAGE_TITLES[active]}</div>
            <div style={{ fontSize:15,fontWeight:800,color:"#0F172A",letterSpacing:-0.3 }}>{PAGE_TITLES[active]}</div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:9,padding:"6px 12px",fontSize:12,color:"#64748B",display:"flex",alignItems:"center",gap:6 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"#10B981",boxShadow:"0 0 6px #10B981" }} />
              Live · {new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
            </div>
            <button style={{ position:"relative",background:"none",border:"none",cursor:"pointer",padding:6,color:"#64748B",fontSize:20 }}>
              🔔<span style={{ position:"absolute",top:6,right:6,width:7,height:7,background:"#EF4444",borderRadius:"50%",border:"2px solid white" }} />
            </button>
            <div style={{ display:"flex",alignItems:"center",gap:8,padding:"5px 10px",borderRadius:9,background:"#F8FAFC",border:"1px solid #E2E8F0" }}>
              <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#2563EB,#4F46E5)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:800 }}>A</div>
              <div>
                <div style={{ fontSize:12,fontWeight:600,color:"#0F172A" }}>Super Admin</div>
                <div style={{ fontSize:9.5,color:"#94A3B8" }}>SUPER_ADMIN · NPC</div>
              </div>
            </div>
          </div>
        </header>
        {/* Main */}
        <main style={{ flex:1,overflowY:"auto",padding:22 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

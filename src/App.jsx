import { useState, useCallback, useEffect, useRef } from "react";
import * as XLSXLib from "xlsx";

// ─── SheetJS ──────────────────────────────────────────────────────────────────
function cargarXLSX() {
  return Promise.resolve(XLSXLib);
}

// ─── Zona ML por partido ──────────────────────────────────────────────────────
const ZONA_ML = {
  "CABA":"CABA",
  "Avellaneda":"PL","Lanus":"PL","Quilmes":"PL",
  "Lomas de Zamora":"LOMAS",
  "Almirante Brown":"SUR","Berazategui":"SUR","Esteban Echeverria":"SUR","Florencio Varela":"SUR",
  "Hurlingham":"NOE","Ituzaingo":"NOE","Jose C Paz":"NOE","La Matanza":"NOE",
  "Malvinas Argentinas":"NOE","Merlo":"NOE","Moreno":"NOE","Moron":"NOE",
  "San Fernando":"NOE","San Isidro":"NOE","San Martin":"NOE","San Miguel":"NOE",
  "Tigre":"NOE","Tres de Febrero":"NOE","Vicente Lopez":"NOE",
  "La Plata":"GBA2","Zarate":"GBA2","Ensenada":"GBA2","Berisso":"GBA2",
  "Escobar":"GBA2","Marcos Paz":"GBA2","Pilar":"GBA2","Presidente Peron":"GBA2",
  "Canuelas":"GBA2","Lujan":"GBA2","Gral. Rodriguez":"GBA2","Ex.de la Cruz":"GBA2",
  "San Vicente":"GBA2","Campana":"GBA2","Ezeiza":"GBA2",
};

const ZONAS_ML_LIST = ["CABA","NOE","SUR","PL","LOMAS","GBA2"];
const ZONA_ML_COLOR = {
  CABA:"#84cc16", NOE:"#f59e0b", SUR:"#ef4444",
  PL:"#10b981", LOMAS:"#ec4899", GBA2:"#8b5cf6"
};
const ZONA_ML_BG = {
  CABA:"#0d1c04", NOE:"#1c1400", SUR:"#1c0404",
  PL:"#021a0e", LOMAS:"#1c0514", GBA2:"#130d2a"
};

function getZonaML(partido) {
  return ZONA_ML[partido] || "otra";
}

// ─── CP → Partido ─────────────────────────────────────────────────────────────
const CP_P = {"1601":"La Plata","1602":"Vicente Lopez","1603":"Vicente Lopez","1604":"Vicente Lopez","1605":"Vicente Lopez","1606":"Vicente Lopez","1607":"San Isidro","1608":"Tigre","1609":"San Isidro","1610":"Tigre","1611":"Tigre","1612":"Malvinas Argentinas","1613":"Malvinas Argentinas","1614":"Malvinas Argentinas","1615":"Malvinas Argentinas","1616":"Malvinas Argentinas","1617":"Tigre","1618":"Tigre","1619":"Escobar","1620":"Escobar","1621":"Tigre","1622":"Escobar","1623":"Escobar","1624":"Tigre","1625":"Escobar","1626":"Escobar","1627":"Escobar","1628":"Escobar","1629":"Pilar","1630":"Pilar","1631":"Pilar","1632":"Pilar","1633":"Pilar","1634":"Pilar","1635":"Pilar","1636":"Vicente Lopez","1637":"Vicente Lopez","1638":"Vicente Lopez","1640":"San Isidro","1641":"San Isidro","1642":"San Isidro","1643":"San Isidro","1644":"San Fernando","1645":"San Fernando","1646":"San Fernando","1647":"Zarate","1648":"Tigre","1649":"San Fernando","1650":"San Martin","1651":"San Martin","1653":"San Martin","1655":"San Martin","1657":"San Martin","1659":"San Miguel","1660":"Jose C Paz","1661":"San Miguel","1662":"San Miguel","1663":"San Miguel","1664":"Pilar","1665":"Jose C Paz","1666":"Jose C Paz","1667":"Pilar","1669":"Pilar","1670":"Tigre","1671":"Tigre","1672":"San Martin","1674":"Tres de Febrero","1675":"Tres de Febrero","1676":"Tres de Febrero","1678":"Tres de Febrero","1682":"Tres de Febrero","1683":"Tres de Febrero","1684":"Moron","1685":"Moron","1686":"Hurlingham","1687":"Tres de Febrero","1688":"Hurlingham","1689":"La Matanza","1692":"Tres de Febrero","1702":"Tres de Febrero","1703":"Tres de Febrero","1704":"La Matanza","1706":"Moron","1707":"Moron","1708":"Moron","1712":"Moron","1713":"Ituzaingo","1714":"Ituzaingo","1715":"Ituzaingo","1716":"Merlo","1718":"Merlo","1721":"Merlo","1722":"Merlo","1723":"Merlo","1724":"Merlo","1727":"Marcos Paz","1736":"Moreno","1738":"Moreno","1740":"Moreno","1742":"Moreno","1743":"Moreno","1744":"Moreno","1745":"Moreno","1746":"Moreno","1748":"Gral. Rodriguez","1749":"Gral. Rodriguez","1751":"La Matanza","1752":"La Matanza","1753":"La Matanza","1754":"La Matanza","1755":"La Matanza","1757":"La Matanza","1758":"La Matanza","1759":"La Matanza","1761":"La Matanza","1763":"La Matanza","1764":"La Matanza","1765":"La Matanza","1766":"La Matanza","1768":"La Matanza","1770":"La Matanza","1771":"La Matanza","1772":"La Matanza","1773":"Lomas de Zamora","1774":"La Matanza","1776":"Esteban Echeverria","1778":"La Matanza","1785":"La Matanza","1786":"La Matanza","1801":"Ezeiza","1802":"Ezeiza","1803":"Ezeiza","1804":"Ezeiza","1805":"Esteban Echeverria","1806":"Ezeiza","1807":"Ezeiza","1808":"Canuelas","1812":"Canuelas","1813":"Ezeiza","1814":"Canuelas","1815":"Canuelas","1816":"Canuelas","1821":"Lomas de Zamora","1822":"Lanus","1823":"Lanus","1824":"Lanus","1825":"Lanus","1826":"Lanus","1827":"Lomas de Zamora","1828":"Lomas de Zamora","1829":"Lomas de Zamora","1831":"Lomas de Zamora","1832":"Lomas de Zamora","1833":"Lomas de Zamora","1834":"Lomas de Zamora","1835":"Lomas de Zamora","1836":"Lomas de Zamora","1837":"Berazategui","1838":"Esteban Echeverria","1839":"Esteban Echeverria","1840":"Quilmes","1841":"Esteban Echeverria","1842":"Esteban Echeverria","1843":"Almirante Brown","1844":"Almirante Brown","1845":"Almirante Brown","1846":"Almirante Brown","1847":"Almirante Brown","1848":"Almirante Brown","1849":"Almirante Brown","1851":"Almirante Brown","1852":"Almirante Brown","1853":"Florencio Varela","1854":"Almirante Brown","1855":"Almirante Brown","1856":"Almirante Brown","1858":"Presidente Peron","1859":"Florencio Varela","1860":"Berazategui","1861":"Berazategui","1862":"Presidente Peron","1863":"Florencio Varela","1864":"San Vicente","1865":"San Vicente","1867":"Florencio Varela","1868":"Avellaneda","1869":"Avellaneda","1870":"Avellaneda","1871":"Avellaneda","1872":"Avellaneda","1873":"Avellaneda","1874":"Avellaneda","1875":"Avellaneda","1876":"Quilmes","1877":"Quilmes","1878":"Quilmes","1879":"Quilmes","1880":"Berazategui","1881":"Quilmes","1882":"Quilmes","1883":"Quilmes","1884":"Berazategui","1885":"Berazategui","1886":"Berazategui","1887":"Florencio Varela","1888":"Florencio Varela","1889":"Florencio Varela","1890":"Berazategui","1891":"Florencio Varela","1893":"Berazategui","1894":"La Plata","1895":"La Plata","1896":"La Plata","1897":"La Plata","1900":"La Plata","1901":"La Plata","1902":"La Plata","1903":"La Plata","1904":"La Plata","1905":"La Plata","1906":"La Plata","1907":"La Plata","1908":"La Plata","1909":"La Plata","1910":"La Plata","1912":"La Plata","1914":"La Plata","1923":"Berisso","1924":"Berisso","1925":"Ensenada","1926":"Ensenada","1927":"Ensenada","1929":"Berisso","1931":"Ensenada","1984":"San Vicente","2800":"Zarate","2801":"Zarate","2802":"Zarate","2804":"Campana","2805":"Campana","2806":"Zarate","2808":"Zarate","2812":"Campana","2814":"Ex.de la Cruz","2816":"Campana","6700":"Lujan","6701":"Lujan","6702":"Lujan","6703":"Ex.de la Cruz","6706":"Lujan","6708":"Lujan","6712":"Lujan"};

function cpAPartido(cp) {
  const s = String(cp || "").replace(/\D/g, "");
  const n = parseInt(s);
  if (n >= 1000 && n <= 1499) return "CABA";
  return CP_P[s] || "";
}

// ─── Fechas ───────────────────────────────────────────────────────────────────
function fechaHoy() { return new Date().toISOString().split("T")[0]; }
function fechaAyer() { const d = new Date(); d.setDate(d.getDate()-1); return d.toISOString().split("T")[0]; }
function fechaManana() { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split("T")[0]; }
function fechaInicioSemana() { const d = new Date(); d.setDate(d.getDate()-((d.getDay()||7)-1)); return d.toISOString().split("T")[0]; }
function fmtCorta(ds) { if (!ds) return ""; const [,m,d] = ds.split("-"); return d+"/"+m; }
function fmtLarga(ds) { if (!ds) return ""; return new Date(ds+"T00:00:00").toLocaleDateString("es-AR",{weekday:"short",day:"numeric",month:"short"}); }

const MESES = {enero:1,febrero:2,marzo:3,abril:4,mayo:5,junio:6,julio:7,agosto:8,septiembre:9,octubre:10,noviembre:11,diciembre:12};
function parseFechaES(str) {
  const m = String(str||"").toLowerCase().match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d{4})/);
  if (!m) return "";
  const mes = MESES[m[2]]; if (!mes) return "";
  return m[3]+"-"+String(mes).padStart(2,"0")+"-"+String(m[1]).padStart(2,"0");
}

// ─── Parser Excel ─────────────────────────────────────────────────────────────
function parsearExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.onload = async (ev) => {
      try {
        const XLSX = await cargarXLSX();
        const wb = XLSX.read(new Uint8Array(ev.target.result), {type:"array",raw:false});
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const filas = XLSX.utils.sheet_to_json(sheet, {header:1,raw:false,defval:""});
        let hFila = -1;
        for (let i = 0; i < Math.min(filas.length,15); i++) {
          if (filas[i].some(c => typeof c==="string" && c.includes("# de venta"))) { hFila=i; break; }
        }
        if (hFila < 0) throw new Error("No se encontro el encabezado. Es un reporte de Mercado Libre?");
        const h = filas[hFila];
        const col = t => h.findIndex(c => typeof c==="string" && c.toLowerCase().includes(t.toLowerCase()));
        const iOrden=col("# de venta"), iFecha=col("fecha"), iDir=col("domicilio");
        const iCiudad=col("ciudad");
        const iProv=h.findIndex(c => typeof c==="string" && (c.toLowerCase().includes("estado")||c.toLowerCase().includes("provincia")));
        const iCP=col("postal");
        if (iDir < 0) throw new Error("No se encontro la columna Domicilio.");
        const envios = [];
        for (let i = hFila+1; i < filas.length; i++) {
          const r = filas[i];
          const orden = String(r[iOrden]||"").trim();
          if (!orden||orden.length<5||!/^\d/.test(orden)) continue;
          const dir = String(r[iDir]||"").trim(); if (!dir) continue;
          const cp = String(r[iCP]||"").replace(/\D/g,"");
          const fechaVenta = parseFechaES(r[iFecha]); if (!fechaVenta) continue;
          const partido = cpAPartido(cp) || String(r[iCiudad]||"").trim();
          envios.push({id:orden, direccion:dir, ciudad:String(r[iCiudad]||"").trim(),
            provincia:String(r[iProv]||"").trim(), cp, fechaVenta, fecha:"", turno:"", trans:"",
            partido, importe:0, cancelado:false, cobranza:null, cambio:null, origen:"ML"});
        }
        if (envios.length===0) throw new Error("No se encontraron envios con domicilio.");
        resolve(envios);
      } catch(err) { reject(err); }
    };
    reader.readAsArrayBuffer(file);
  });
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const LOGISTICAS = ["CARLOS","GUS","DELFRAN","SYM","HNOS"];
const TURNOS = ["AM","MD","PM","Turbo"];
const TC  = {CARLOS:"#f59e0b",GUS:"#3b82f6",DELFRAN:"#10b981",SYM:"#ec4899",HNOS:"#8b5cf6"};
const TCB = {CARLOS:"#1c1400",GUS:"#0c1a2e",DELFRAN:"#041f14",SYM:"#1c0514",HNOS:"#130d2a"};
const TURNO_C = {AM:{c:"#60a5fa",bg:"#0c1a2e"},MD:{c:"#a78bfa",bg:"#130d2a"},PM:{c:"#93c5fd",bg:"#0c1a2e"},Turbo:{c:"#f472b6",bg:"#1c0514"}};

const ZONAS_INIT = {
  HNOS: {zonas:[
    {id:"CABA",nombre:"CABA",color:"#84cc16",precio:5808,partidos:["CABA"]},
    {id:"ZONA1",nombre:"ZONA 1",color:"#f97316",precio:5808,partidos:["San Isidro","Vicente Lopez","San Martin","Tres de Febrero","Moron","Hurlingham","La Matanza","Lanus","Avellaneda"]},
    {id:"ZONA2",nombre:"ZONA 2",color:"#3b82f6",precio:7986,partidos:["Tigre","Malvinas Argentinas","Jose C Paz","San Miguel","Ituzaingo","Merlo","Ezeiza","Esteban Echeverria","Almirante Brown","Lomas de Zamora","Quilmes","Florencio Varela","Berazategui","San Fernando"]},
    {id:"ZONA3",nombre:"ZONA 3",color:"#6b7280",precio:10164,partidos:["La Plata","Zarate","Ensenada","Berisso","Escobar","Marcos Paz","Pilar","Presidente Peron","Canuelas","Lujan","Gral. Rodriguez","Ex.de la Cruz","San Vicente","Campana","Moreno"]}
  ]},
  CARLOS: {zonas:[
    {id:"CABA",nombre:"CABA",color:"#6366f1",precio:7371,partidos:["CABA"]},
    {id:"PL",nombre:"PL",color:"#10b981",precio:4611,partidos:["Avellaneda","Lanus","Quilmes"]},
    {id:"LOMAS",nombre:"LOMAS",color:"#ec4899",precio:7371,partidos:["Lomas de Zamora"]},
    {id:"NOE",nombre:"NOE",color:"#f59e0b",precio:10246,partidos:["Hurlingham","Ituzaingo","Jose C Paz","La Matanza","Malvinas Argentinas","Merlo","Moreno","Moron","San Fernando","San Isidro","San Martin","San Miguel","Tigre","Tres de Febrero","Vicente Lopez"]},
    {id:"SUR",nombre:"SUR",color:"#ef4444",precio:10246,partidos:["Almirante Brown","Berazategui","Esteban Echeverria","Florencio Varela"]},
    {id:"GBA2",nombre:"GBA2",color:"#8b5cf6",precio:0,partidos:["La Plata","Zarate","Ensenada","Berisso","Escobar","Marcos Paz","Pilar","Presidente Peron","Canuelas","Lujan","Gral. Rodriguez","Ex.de la Cruz","San Vicente","Campana","Ezeiza"]}
  ]},
  GUS: {zonas:[
    {id:"CABA",nombre:"CABA",color:"#6366f1",precio:7371,partidos:["CABA"]},
    {id:"PL",nombre:"PL",color:"#10b981",precio:4611,partidos:["Avellaneda","Lanus","Quilmes"]},
    {id:"LOMAS",nombre:"LOMAS",color:"#ec4899",precio:7371,partidos:["Lomas de Zamora"]},
    {id:"NOE",nombre:"NOE",color:"#f59e0b",precio:10246,partidos:["Hurlingham","Ituzaingo","Jose C Paz","La Matanza","Malvinas Argentinas","Merlo","Moreno","Moron","San Fernando","San Isidro","San Martin","San Miguel","Tigre","Tres de Febrero","Vicente Lopez"]},
    {id:"SUR",nombre:"SUR",color:"#ef4444",precio:10246,partidos:["Almirante Brown","Berazategui","Esteban Echeverria","Florencio Varela"]},
    {id:"GBA2",nombre:"GBA2",color:"#8b5cf6",precio:0,partidos:["La Plata","Zarate","Ensenada","Berisso","Escobar","Marcos Paz","Pilar","Presidente Peron","Canuelas","Lujan","Gral. Rodriguez","Ex.de la Cruz","San Vicente","Campana","Ezeiza"]}
  ]},
  DELFRAN: {zonas:[
    {id:"CABA",nombre:"CABA",color:"#6366f1",precio:6792,partidos:["CABA"]},
    {id:"PL",nombre:"PL",color:"#10b981",precio:4249,partidos:["Avellaneda","Lanus","Quilmes"]},
    {id:"LOMAS",nombre:"LOMAS",color:"#ec4899",precio:6792,partidos:["Lomas de Zamora"]},
    {id:"NOE",nombre:"NOE",color:"#f59e0b",precio:9443,partidos:["Hurlingham","Ituzaingo","Jose C Paz","La Matanza","Malvinas Argentinas","Merlo","Moreno","Moron","San Fernando","San Isidro","San Martin","San Miguel","Tigre","Tres de Febrero","Vicente Lopez"]},
    {id:"SUR",nombre:"SUR",color:"#ef4444",precio:9443,partidos:["Almirante Brown","Berazategui","Esteban Echeverria","Florencio Varela"]},
    {id:"GBA2",nombre:"GBA2",color:"#8b5cf6",precio:10246,partidos:["La Plata","Zarate","Ensenada","Berisso","Escobar","Marcos Paz","Pilar","Presidente Peron","Canuelas","Lujan","Gral. Rodriguez","Ex.de la Cruz","San Vicente","Campana","Ezeiza"]}
  ]},
  SYM: {zonas:[
    {id:"CABA",nombre:"CABA",color:"#6366f1",precio:3509,partidos:["CABA"]},
    {id:"PL",nombre:"PL",color:"#10b981",precio:3509,partidos:["Avellaneda","Lanus"]},
    {id:"LOMAS",nombre:"LOMAS",color:"#ec4899",precio:3509,partidos:["Lomas de Zamora"]},
    {id:"QUILMES",nombre:"QUILMES",color:"#14b8a6",precio:7865,partidos:["Quilmes"]},
    {id:"NOE",nombre:"NOE",color:"#f59e0b",precio:7865,partidos:["Hurlingham","Ituzaingo","Jose C Paz","La Matanza","Malvinas Argentinas","Merlo","Moreno","Moron","San Fernando","San Isidro","San Martin","San Miguel","Tigre","Tres de Febrero","Vicente Lopez"]},
    {id:"SUR",nombre:"SUR",color:"#ef4444",precio:7865,partidos:["Almirante Brown","Berazategui","Esteban Echeverria","Florencio Varela"]},
    {id:"GBA2",nombre:"GBA2",color:"#8b5cf6",precio:10527,partidos:["La Plata","Zarate","Ensenada","Berisso","Escobar","Marcos Paz","Pilar","Presidente Peron","Canuelas","Lujan","Gral. Rodriguez","Ex.de la Cruz","San Vicente","Campana","Ezeiza"]}
  ]}
};

const ALL_PARTIDOS = ["CABA","Avellaneda","Lanus","Quilmes","Lomas de Zamora","Almirante Brown","Berazategui","Esteban Echeverria","Florencio Varela","Hurlingham","Ituzaingo","Jose C Paz","La Matanza","Malvinas Argentinas","Merlo","Moreno","Moron","San Fernando","San Isidro","San Martin","San Miguel","Tigre","Tres de Febrero","Vicente Lopez","La Plata","Zarate","Ensenada","Berisso","Escobar","Marcos Paz","Pilar","Presidente Peron","Canuelas","Lujan","Gral. Rodriguez","Ex.de la Cruz","San Vicente","Campana","Ezeiza"];

function buildTarifaMap(zc) {
  const m = {};
  Object.entries(zc).forEach(([l,c]) => c.zonas.forEach(z => z.partidos.forEach(p => { if (!m[p]) m[p]={}; m[p][l]=z.precio; })));
  return m;
}
function getZonaLogistica(zc, trans, partido) {
  return zc[trans] ? zc[trans].zonas.find(z => z.partidos.includes(partido))||null : null;
}
function getWeekNum(ds) {
  const d=new Date(ds+"T00:00:00"), day=d.getDay()||7; d.setDate(d.getDate()+4-day);
  const y=new Date(d.getFullYear(),0,1);
  return {w:Math.ceil((((d-y)/86400000)+1)/7), y:d.getFullYear()};
}
function weekLabel(ds) {
  const d=new Date(ds+"T00:00:00"), day=d.getDay()||7;
  const mon=new Date(d); mon.setDate(d.getDate()-(day-1));
  const sun=new Date(mon); sun.setDate(mon.getDate()+6);
  const f=x=>String(x.getDate()).padStart(2,"0")+"/"+String(x.getMonth()+1).padStart(2,"0");
  return "Sem."+getWeekNum(ds).w+" ("+f(mon)+"-"+f(sun)+")";
}

const fmt  = n => n ? "$"+Number(n).toLocaleString("es-AR") : "-";
const fmtN = n => Number(n).toLocaleString("es-AR");

// ─── Estilos ──────────────────────────────────────────────────────────────────
const S = {
  card:  {background:"#1a1f2e",border:"1px solid #252d40",borderRadius:"14px"},
  input: {background:"#0f1420",border:"1px solid #252d40",borderRadius:"8px",padding:"0.45rem 0.75rem",color:"#e5e7eb",fontFamily:"sans-serif",fontSize:"0.85rem",outline:"none",boxSizing:"border-box"},
  btn:   (on,col)=>({padding:"0.4rem 0.85rem",borderRadius:"8px",fontWeight:700,fontSize:"0.78rem",cursor:"pointer",border:"none",background:on?(col||"#6366f1"):"#12172a",color:on?"#fff":"#6b7280"}),
  btnSm: (on,col)=>({padding:"0.2rem 0.6rem",borderRadius:"6px",fontWeight:700,fontSize:"0.72rem",cursor:"pointer",border:"none",background:on?(col||"#6366f1"):"#0f1420",color:on?"#fff":"#6b7280"}),
  chip:  (on,col,bg)=>({padding:"3px 10px",borderRadius:"20px",fontWeight:700,fontSize:"0.72rem",cursor:"pointer",border:"1px solid "+(on?col:"#252d40"),background:on?bg:"transparent",color:on?col:"#6b7280"}),
};
const thSt={padding:"0.5rem 0.8rem",textAlign:"left",color:"#6b7280",fontWeight:700,fontSize:"0.62rem",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"};
const tdSt={padding:"0.4rem 0.8rem",whiteSpace:"nowrap"};

function Bdg({label,bg,t,style}) {
  return <span style={{padding:"2px 8px",background:bg||"#252d40",color:t||"#9ca3af",borderRadius:"6px",fontSize:"0.67rem",fontWeight:700,whiteSpace:"nowrap",...style}}>{label}</span>;
}
function Chk({checked,onChange,size=16}) {
  return (
    <div onClick={onChange} style={{width:size,height:size,borderRadius:"4px",border:"1.5px solid "+(checked?"#6366f1":"#374151"),background:checked?"#6366f1":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
      {checked && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// PANTALLA ASIGNACION — agrupada por zona ML
// ════════════════════════════════════════════════════════════════════
function PantallaAsignacion({borrador,fileName,onConfirmar,onCancelar}) {
  const hoy = fechaHoy();
  const [asig, setAsig] = useState({});
  const [modoVista, setModoVista] = useState("zona"); // zona | partido

  const getA = id => asig[id] || {trans:"",fecha:hoy,turno:""};
  const setA = (id,k,v) => setAsig(p=>({...p,[id]:{...getA(id),[k]:v}}));
  const setGrupo = (ids,k,v) => setAsig(p=>{const n={...p};ids.forEach(id=>{n[id]={...getA(id),[k]:v}});return n;});
  const getGrupoVal = (ids,k) => {const vals=[...new Set(ids.map(id=>getA(id)[k]||""))];return vals.length===1?vals[0]:"";};

  // Agrupar por zona ML o por partido
  const grupos = {};
  borrador.forEach(e => {
    const key = modoVista==="zona" ? (getZonaML(e.partido)||"Otra") : (e.partido||"Sin partido");
    if (!grupos[key]) grupos[key]=[];
    grupos[key].push(e);
  });
  const grupoKeys = modoVista==="zona"
    ? [...ZONAS_ML_LIST, "Otra"].filter(k=>grupos[k])
    : Object.keys(grupos).sort();

  const totalAsig = borrador.filter(e=>getA(e.id).trans).length;
  const confirmar = () => onConfirmar(borrador.map(e=>({...e,...getA(e.id)})));

  const rowHeight = "auto";

  return (
    <div style={{minHeight:"100vh",background:"#0a0e1a",color:"#fff",fontFamily:"sans-serif"}}>
      <style>{`*{box-sizing:border-box;}select option{background:#1a1f2e;}`}</style>
      {/* Header */}
      <div style={{background:"#0f1420",borderBottom:"1px solid #1a1f2e",padding:"0.75rem 1rem",display:"flex",alignItems:"center",gap:"0.75rem",flexWrap:"wrap"}}>
        <div style={{width:"28px",height:"28px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center"}}>🛵</div>
        <div>
          <div style={{fontWeight:800,fontSize:"0.95rem"}}>Asignar envios</div>
          <div style={{color:"#4b5563",fontSize:"0.62rem"}}>{fileName} · {borrador.length} envios</div>
        </div>
        <div style={{display:"flex",gap:"4px",marginLeft:"0.5rem"}}>
          <button onClick={()=>setModoVista("zona")} style={S.btn(modoVista==="zona","#6366f1")}>Por zona ML</button>
          <button onClick={()=>setModoVista("partido")} style={S.btn(modoVista==="partido","#6366f1")}>Por partido</button>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:"0.5rem",alignItems:"center",flexWrap:"wrap"}}>
          <span style={{color:totalAsig===borrador.length?"#10b981":"#f59e0b",fontSize:"0.82rem",fontWeight:700}}>{totalAsig}/{borrador.length}</span>
          <button onClick={onCancelar} style={S.btn(false)}>Cancelar</button>
          <button onClick={confirmar} style={{...S.btn(true),background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>Confirmar</button>
        </div>
      </div>

      <div style={{padding:"1rem",maxWidth:"980px",margin:"0 auto"}}>
        {grupoKeys.map(key => {
          const grupo = grupos[key];
          const ids = grupo.map(e=>e.id);
          const gT  = getGrupoVal(ids,"trans");
          const gF  = getGrupoVal(ids,"fecha");
          const gTu = getGrupoVal(ids,"turno");
          const zcolor = modoVista==="zona" ? (ZONA_ML_COLOR[key]||"#6b7280") : "#6b7280";
          const asigCount = ids.filter(id=>getA(id).trans).length;

          return (
            <div key={key} style={{...S.card,marginBottom:"0.75rem",overflow:"hidden"}}>
              {/* Header grupo */}
              <div style={{padding:"0.6rem 1rem",background:"#12172a",borderBottom:"1px solid #1e2535"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem",flexWrap:"wrap"}}>
                  <span style={{display:"inline-block",padding:"2px 10px",borderRadius:"20px",background:modoVista==="zona"?(ZONA_ML_BG[key]||"#1a1f2e"):"#1a1f2e",color:zcolor,fontWeight:800,fontSize:"0.82rem",border:"1px solid "+zcolor}}>{key}</span>
                  <span style={{color:"#4b5563",fontSize:"0.72rem"}}>{grupo.length} envios</span>
                  <span style={{color:asigCount===grupo.length?"#10b981":"#4b5563",fontSize:"0.7rem",marginLeft:"auto"}}>{asigCount}/{grupo.length} asignados</span>
                </div>
                {/* Controles de grupo */}
                <div style={{display:"grid",gridTemplateColumns:"70px 1fr",rowGap:"6px",columnGap:"0.75rem",alignItems:"center"}}>
                  <span style={{color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase"}}>Logistica</span>
                  <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
                    {LOGISTICAS.map(l=><button key={l} onClick={()=>setGrupo(ids,"trans",gT===l?"":l)} style={S.btnSm(gT===l,TC[l])}>{l}</button>)}
                    {gT&&<button onClick={()=>setGrupo(ids,"trans","")} style={{...S.btnSm(false),"color":"#6b7280","fontSize":"0.68rem"}}>x</button>}
                  </div>
                  <span style={{color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase"}}>Fecha</span>
                  <div style={{display:"flex",gap:"3px",flexWrap:"wrap",alignItems:"center"}}>
                    <button onClick={()=>setGrupo(ids,"fecha",gF===hoy?"":hoy)} style={S.btnSm(gF===hoy,"#6366f1")}>Hoy</button>
                    <button onClick={()=>{const d=fechaManana();setGrupo(ids,"fecha",gF===d?"":d);}} style={S.btnSm(gF===fechaManana(),"#6366f1")}>Manana</button>
                    <input type="date" value={gF||""} onChange={e=>setGrupo(ids,"fecha",e.target.value)} style={{...S.input,padding:"1px 6px",fontSize:"0.7rem",height:"22px",width:"112px"}}/>
                  </div>
                  <span style={{color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase"}}>Turno</span>
                  <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
                    {TURNOS.map(t=><button key={t} onClick={()=>setGrupo(ids,"turno",gTu===t?"":t)} style={S.btnSm(gTu===t,"#8b5cf6")}>{t}</button>)}
                  </div>
                </div>
              </div>
              {/* Filas individuales */}
              {grupo.map((e,i)=>{
                const a=getA(e.id);
                return (
                  <div key={e.id} style={{padding:"0.45rem 1rem",borderBottom:i<grupo.length-1?"1px solid #1a1f2e":"none",display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:"140px"}}>
                      <div style={{color:"#d1d5db",fontSize:"0.78rem",lineHeight:1.3}}>{e.direccion.slice(0,68)}{e.direccion.length>68?"...":""}</div>
                      <div style={{color:"#4b5563",fontSize:"0.66rem",marginTop:"1px"}}>CP {e.cp} · {e.partido} · ...{e.id.slice(-8)}</div>
                    </div>
                    <div style={{display:"flex",gap:"3px",flexWrap:"wrap",alignItems:"center"}}>
                      {LOGISTICAS.map(l=><button key={l} onClick={()=>setA(e.id,"trans",a.trans===l?"":l)} style={S.btnSm(a.trans===l,TC[l])}>{l}</button>)}
                      <span style={{color:"#252d40",padding:"0 2px"}}>|</span>
                      {TURNOS.map(t=><button key={t} onClick={()=>setA(e.id,"turno",a.turno===t?"":t)} style={S.btnSm(a.turno===t,"#8b5cf6")}>{t}</button>)}
                      {a.trans&&<Bdg label={a.fecha?fmtCorta(a.fecha):"sin fecha"} bg="#12172a" t="#6b7280"/>}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div style={{display:"flex",justifyContent:"flex-end",gap:"0.75rem",marginTop:"1rem",paddingBottom:"2rem"}}>
          <button onClick={onCancelar} style={S.btn(false)}>Cancelar</button>
          <button onClick={confirmar} style={{...S.btn(true),background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"0.55rem 1.4rem"}}>Confirmar ({totalAsig}/{borrador.length})</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// PANEL EDICION INLINE
// ════════════════════════════════════════════════════════════════════
function PanelEdit({envio,onSave,onClose}) {
  const [e,setE]=useState({...envio});
  const set=(k,v)=>setE(p=>({...p,[k]:v}));

  return (
    <div style={{background:"#12172a",border:"1px solid #6366f1",borderRadius:"12px",padding:"0.9rem 1rem",marginTop:"2px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem 1rem",marginBottom:"0.6rem"}}>
        <div>
          <div style={{color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"4px"}}>Logistica</div>
          <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
            {LOGISTICAS.map(l=><button key={l} onClick={()=>set("trans",e.trans===l?"":l)} style={S.chip(e.trans===l,TC[l],TCB[l])}>{l}</button>)}
          </div>
        </div>
        <div>
          <div style={{color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"4px"}}>Turno</div>
          <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
            {TURNOS.map(t=>{const tc=TURNO_C[t]||{c:"#a78bfa",bg:"#130d2a"};return <button key={t} onClick={()=>set("turno",e.turno===t?"":t)} style={S.chip(e.turno===t,tc.c,tc.bg)}>{t}</button>;})}
          </div>
        </div>
        <div>
          <div style={{color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"4px"}}>Fecha entrega</div>
          <div style={{display:"flex",gap:"3px",flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={()=>set("fecha",fechaHoy())} style={S.btnSm(e.fecha===fechaHoy(),"#6366f1")}>Hoy</button>
            <button onClick={()=>set("fecha",fechaManana())} style={S.btnSm(e.fecha===fechaManana(),"#6366f1")}>Manana</button>
            <input type="date" value={e.fecha||""} onChange={ev=>set("fecha",ev.target.value)} style={{...S.input,padding:"2px 6px",fontSize:"0.72rem",height:"24px",width:"120px"}}/>
          </div>
        </div>
        <div>
          <div style={{color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"4px"}}>Estado</div>
          <button onClick={()=>set("cancelado",!e.cancelado)} style={{...S.chip(e.cancelado,"#f87171","#1c0a0a")}}>Cancelado</button>
        </div>
      </div>
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.5rem",flexWrap:"wrap",alignItems:"center"}}>
        <button onClick={()=>set("cobranza",e.cobranza!==null?null:0)} style={S.btnSm(e.cobranza!==null,"#f59e0b")}>Cobranza</button>
        {e.cobranza!==null&&<input type="number" placeholder="Monto" value={e.cobranza||""} onChange={ev=>set("cobranza",parseFloat(ev.target.value)||0)} style={{...S.input,width:"140px",padding:"3px 8px",fontSize:"0.8rem"}}/>}
      </div>
      <div style={{marginBottom:"0.65rem"}}>
        <button onClick={()=>set("cambio",e.cambio!==null?null:"")} style={S.btnSm(e.cambio!==null,"#ec4899")}>Cambio / Devolucion / Retiro</button>
        {e.cambio!==null&&<textarea value={e.cambio||""} onChange={ev=>set("cambio",ev.target.value)} placeholder="Descripcion..." style={{...S.input,display:"block",width:"100%",marginTop:"5px",height:"52px",resize:"vertical",fontSize:"0.8rem"}}/>}
      </div>
      <div style={{display:"flex",gap:"0.5rem",justifyContent:"flex-end"}}>
        <button onClick={onClose} style={S.btn(false)}>Cancelar</button>
        <button onClick={()=>onSave(e)} style={{...S.btn(true),background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>Guardar</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB ENVIOS
// ════════════════════════════════════════════════════════════════════
function TabEnvios({envios,setEnvios,zonasConfig,onReasignar}) {
  const hoy=fechaHoy();
  const [modFecha,setModFecha]=useState("hoy");
  const [rangoD,setRangoD]=useState(hoy);
  const [rangoH,setRangoH]=useState(hoy);
  const [filTrans,setFilTrans]=useState("TODOS");
  const [filZona,setFilZona]=useState("TODAS");
  const [filTurno,setFilTurno]=useState("TODOS");
  const [busqueda,setBusqueda]=useState("");
  const [editId,setEditId]=useState(null);
  const [seleccionados,setSeleccionados]=useState(new Set());
  const [modoSel,setModoSel]=useState(false);

  const tmap=buildTarifaMap(zonasConfig);
  const getImp=e=>tmap[e.partido] ? (tmap[e.partido][e.trans]||0) : 0;

  const getRango=()=>{
    if(modFecha==="hoy")    return {d:hoy,h:hoy};
    if(modFecha==="ayer")   return {d:fechaAyer(),h:fechaAyer()};
    if(modFecha==="semana") return {d:fechaInicioSemana(),h:hoy};
    return {d:rangoD,h:rangoH};
  };
  const {d:desde,h:hasta}=getRango();

  const filtrados=envios.filter(e=>{
    const f=e.fecha||e.fechaVenta||"";
    if(f<desde||f>hasta) return false;
    if(filTrans==="SIN ASIGNAR"&&e.trans) return false;
    if(filTrans!=="TODOS"&&filTrans!=="SIN ASIGNAR"&&e.trans!==filTrans) return false;
    if(filZona!=="TODAS"&&getZonaML(e.partido)!==filZona) return false;
    if(filTurno!=="TODOS"&&e.turno!==filTurno) return false;
    if(busqueda){const q=busqueda.toLowerCase();return e.direccion.toLowerCase().includes(q)||e.id.includes(q)||e.partido.toLowerCase().includes(q);}
    return true;
  });

  const activos=filtrados.filter(e=>!e.cancelado);
  const totalImp=activos.reduce((s,e)=>s+getImp(e),0);
  const sinAsig=activos.filter(e=>!e.trans).length;
  const porTrans=LOGISTICAS.map(l=>({l,n:activos.filter(e=>e.trans===l).length,v:activos.filter(e=>e.trans===l).reduce((s,e)=>s+getImp(e),0)})).filter(x=>x.n>0);

  const toggleSel=id=>setSeleccionados(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const selAll=()=>setSeleccionados(new Set(filtrados.map(e=>e.id)));
  const selNone=()=>setSeleccionados(new Set());
  const saveEnvio=updated=>{setEnvios(p=>p.map(e=>e.id===updated.id?updated:e));setEditId(null);};
  const eliminar=id=>{if(window.confirm("Eliminar este envio?")) setEnvios(p=>p.filter(e=>e.id!==id));};

  const reasignarSel=()=>{
    const items=envios.filter(e=>seleccionados.has(e.id));
    onReasignar(items);
    setSeleccionados(new Set());
    setModoSel(false);
  };

  return (
    <div>
      {/* Filtro fecha */}
      <div style={{...S.card,padding:"0.65rem 1rem",marginBottom:"0.7rem"}}>
        <div style={{display:"flex",gap:"4px",flexWrap:"wrap",alignItems:"center",marginBottom:modFecha==="rango"?"0.5rem":"0"}}>
          <span style={{color:"#4b5563",fontSize:"0.65rem",fontWeight:700,textTransform:"uppercase",marginRight:"4px"}}>Fecha</span>
          {[{k:"hoy",l:"Hoy"},{k:"ayer",l:"Ayer"},{k:"semana",l:"Esta semana"},{k:"rango",l:"Rango"}].map(x=>(
            <button key={x.k} onClick={()=>setModFecha(x.k)} style={S.btn(modFecha===x.k)}>{x.l}</button>
          ))}
        </div>
        {modFecha==="rango"&&(
          <div style={{display:"flex",gap:"0.5rem",alignItems:"center",flexWrap:"wrap"}}>
            <span style={{color:"#6b7280",fontSize:"0.8rem"}}>Desde</span>
            <input type="date" value={rangoD} onChange={e=>setRangoD(e.target.value)} style={{...S.input,padding:"4px 8px",width:"132px"}}/>
            <span style={{color:"#6b7280",fontSize:"0.8rem"}}>hasta</span>
            <input type="date" value={rangoH} onChange={e=>setRangoH(e.target.value)} style={{...S.input,padding:"4px 8px",width:"132px"}}/>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"0.55rem",marginBottom:"0.7rem"}}>
        <div style={{...S.card,padding:"0.75rem 1rem"}}>
          <div style={{color:"#6366f1",fontWeight:800,fontSize:"1.8rem",lineHeight:1}}>{filtrados.length}</div>
          <div style={{color:"#6b7280",fontSize:"0.62rem",marginTop:"2px",textTransform:"uppercase"}}>Envios</div>
        </div>
        <div style={{...S.card,padding:"0.75rem 1rem"}}>
          <div style={{color:"#10b981",fontWeight:800,fontSize:"1.05rem",lineHeight:1.1}}>{fmt(totalImp)}</div>
          <div style={{color:"#6b7280",fontSize:"0.62rem",marginTop:"2px",textTransform:"uppercase"}}>Total</div>
        </div>
        {sinAsig>0&&<div style={{...S.card,padding:"0.75rem 1rem",borderLeft:"3px solid #f59e0b"}}>
          <div style={{color:"#f59e0b",fontWeight:800,fontSize:"1.8rem",lineHeight:1}}>{sinAsig}</div>
          <div style={{color:"#6b7280",fontSize:"0.62rem",marginTop:"2px"}}>Sin logistica</div>
        </div>}
        {porTrans.map(({l,n,v})=>(
          <div key={l} style={{...S.card,padding:"0.75rem 1rem",borderLeft:"3px solid "+TC[l]}}>
            <div style={{color:TC[l],fontWeight:800,fontSize:"1.8rem",lineHeight:1}}>{n}</div>
            <div style={{color:"#6b7280",fontSize:"0.62rem",marginTop:"2px"}}>{l}</div>
            <div style={{color:"#10b981",fontSize:"0.72rem",fontWeight:600,marginTop:"2px"}}>{fmt(v)}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{...S.card,padding:"0.6rem 1rem",marginBottom:"0.7rem",display:"flex",gap:"0.4rem",flexWrap:"wrap",alignItems:"center"}}>
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Buscar..." style={{...S.input,width:"160px"}}/>
        <span style={{color:"#374151",fontSize:"0.65rem"}}>|</span>
        {["TODOS",...LOGISTICAS,"SIN ASIGNAR"].map(t=><button key={t} onClick={()=>setFilTrans(t)} style={S.btnSm(filTrans===t,t==="SIN ASIGNAR"?"#f59e0b":TC[t]||"#6366f1")}>{t}</button>)}
        <span style={{color:"#374151",fontSize:"0.65rem"}}>|</span>
        {["TODAS",...ZONAS_ML_LIST].map(z=><button key={z} onClick={()=>setFilZona(z)} style={S.btnSm(filZona===z,ZONA_ML_COLOR[z]||"#6366f1")}>{z}</button>)}
        <span style={{color:"#374151",fontSize:"0.65rem"}}>|</span>
        {["TODOS",...TURNOS].map(t=><button key={t} onClick={()=>setFilTurno(t)} style={S.btnSm(filTurno===t,"#8b5cf6")}>{t}</button>)}
        <span style={{color:"#374151",fontSize:"0.65rem"}}>|</span>
        <button onClick={()=>{setModoSel(!modoSel);if(modoSel)setSeleccionados(new Set());}} style={S.btnSm(modoSel,"#6366f1")}>
          {modoSel?"Cancelar seleccion":"Seleccionar"}
        </button>
        {modoSel&&<button onClick={selAll} style={S.btnSm(false)}>Todos ({filtrados.length})</button>}
        {modoSel&&seleccionados.size>0&&<button onClick={selNone} style={S.btnSm(false)}>Ninguno</button>}
      </div>

      {/* Lista */}
      <div style={{display:"grid",gap:"4px"}}>
        {filtrados.length===0&&<div style={{textAlign:"center",padding:"3rem",color:"#4b5563"}}><div style={{fontSize:"2rem"}}>📭</div><p>Sin envios</p></div>}
        {filtrados.map((e,i)=>{
          const zi=getZonaLogistica(zonasConfig,e.trans,e.partido);
          const zml=getZonaML(e.partido);
          const isEdit=editId===e.id;
          const isSel=seleccionados.has(e.id);
          const imp=getImp(e);
          return (
            <div key={e.id}>
              <div style={{...S.card,padding:"0.55rem 0.75rem 0.55rem 0.6rem",display:"flex",alignItems:"flex-start",gap:"0.5rem",opacity:e.cancelado?0.45:1,borderColor:isEdit?"#6366f1":isSel?"#6366f1":"#252d40",background:isSel?"#12172a":"#1a1f2e"}}>
                {/* Checkbox o numero */}
                {modoSel
                  ? <div style={{paddingTop:"2px"}}><Chk checked={isSel} onChange={()=>toggleSel(e.id)}/></div>
                  : <span style={{color:"#374151",fontSize:"0.65rem",minWidth:"20px",textAlign:"right",paddingTop:"3px"}}>{i+1}</span>
                }
                {/* Clic para editar (si no en modo seleccion) */}
                <div style={{flex:1,cursor:modoSel?"pointer":"default"}} onClick={()=>{if(modoSel){toggleSel(e.id);}else{setEditId(isEdit?null:e.id);}}}>
                  <div style={{display:"flex",gap:"4px",flexWrap:"wrap",alignItems:"center",marginBottom:"3px"}}>
                    {e.trans
                      ? <Bdg label={e.trans} bg={TCB[e.trans]} t={TC[e.trans]}/>
                      : <Bdg label="Sin asignar" bg="#1c1500" t="#f59e0b"/>
                    }
                    {zml&&zml!=="otra"&&<Bdg label={zml} bg={ZONA_ML_BG[zml]||"#1a1f2e"} t={ZONA_ML_COLOR[zml]||"#6b7280"}/>}
                    {zi&&<Bdg label={zi.nombre} bg={zi.color+"22"} t={zi.color}/>}
                    {e.turno&&<Bdg label={e.turno} bg={TURNO_C[e.turno]?TURNO_C[e.turno].bg:"#130d2a"} t={TURNO_C[e.turno]?TURNO_C[e.turno].c:"#a78bfa"}/>}
                    {e.fecha&&<Bdg label={fmtCorta(e.fecha)} bg="#12172a" t="#6b7280"/>}
                    {e.cancelado&&<Bdg label="CANCELADO" bg="#1c0a0a" t="#f87171"/>}
                    {e.cobranza!==null&&<Bdg label={"$"+Number(e.cobranza).toLocaleString("es-AR")} bg="#1c1500" t="#fbbf24"/>}
                    {e.cambio!==null&&<Bdg label="Cambio" bg="#1c0514" t="#ec4899"/>}
                  </div>
                  <div style={{color:"#e5e7eb",fontSize:"0.8rem",lineHeight:1.35,textDecoration:e.cancelado?"line-through":"none"}}>{e.direccion}</div>
                  <div style={{color:"#374151",fontSize:"0.66rem",marginTop:"1px"}}>
                    <span style={{fontFamily:"monospace"}}>...{e.id.slice(-10)}</span>
                    <span style={{margin:"0 4px"}}>·</span>{e.partido}
                  </div>
                </div>
                {/* Importe + acciones */}
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"3px",flexShrink:0}}>
                  {imp>0&&<span style={{color:"#10b981",fontWeight:700,fontSize:"0.82rem"}}>{fmt(imp)}</span>}
                  {!modoSel&&(
                    <div style={{display:"flex",gap:"3px",marginTop:"2px"}}>
                      <button onClick={e2=>{e2.stopPropagation();setEditId(isEdit?null:e.id);}} style={{...S.btnSm(false),padding:"1px 6px",fontSize:"0.68rem",color:"#6b7280"}}>editar</button>
                      <button onClick={e2=>{e2.stopPropagation();eliminar(e.id);}} style={{...S.btnSm(false),padding:"1px 6px",fontSize:"0.68rem",color:"#f87171"}}>x</button>
                    </div>
                  )}
                </div>
              </div>
              {isEdit&&!modoSel&&<PanelEdit envio={e} onSave={saveEnvio} onClose={()=>setEditId(null)}/>}
            </div>
          );
        })}
      </div>

      {/* Barra flotante de seleccion */}
      {modoSel&&seleccionados.size>0&&(
        <div style={{position:"fixed",bottom:"20px",left:"50%",transform:"translateX(-50%)",background:"#1a1f2e",border:"1px solid #6366f1",borderRadius:"12px",padding:"0.7rem 1.25rem",display:"flex",gap:"0.75rem",alignItems:"center",zIndex:50,boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}}>
          <span style={{color:"#e5e7eb",fontWeight:700,fontSize:"0.9rem"}}>{seleccionados.size} seleccionados</span>
          <button onClick={reasignarSel} style={{...S.btn(true),background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"0.45rem 1.1rem"}}>Reasignar</button>
          <button onClick={()=>{setModoSel(false);setSeleccionados(new Set());}} style={S.btn(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB IMPRIMIR — PDF A4 apaisado
// ════════════════════════════════════════════════════════════════════
function TabImprimir({envios,zonasConfig}) {
  const hoy=fechaHoy();
  const [fecha,setFecha]=useState(hoy);
  const [trans,setTrans]=useState("TODOS");
  const [turno,setTurno]=useState("TODOS");
  const [filZona,setFilZona]=useState("TODAS");

  const tmap=buildTarifaMap(zonasConfig);
  const getImp=e=>tmap[e.partido] ? (tmap[e.partido][e.trans]||0) : 0;

  const lista=envios.filter(e=>{
    const f=e.fecha||e.fechaVenta||"";
    if(fecha&&f!==fecha) return false;
    if(trans!=="TODOS"&&e.trans!==trans) return false;
    if(turno!=="TODOS"&&e.turno!==turno) return false;
    if(filZona!=="TODAS"&&getZonaML(e.partido)!==filZona) return false;
    return !e.cancelado;
  });

  const totalImp=lista.reduce((s,e)=>s+getImp(e),0);
  const cobTotal=lista.filter(e=>e.cobranza).reduce((s,e)=>s+(e.cobranza||0),0);
  const hayCobro=lista.some(e=>e.cobranza);
  const hayCambio=lista.some(e=>e.cambio);

  const generarPDF=()=>{
    const ahora=new Date();
    const tsImpr=ahora.toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})+" "+ahora.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"});
    const logLabel=trans==="TODOS"?"Todas las logisticas":trans;
    const zonaLabel=filZona==="TODAS"?"Todas las zonas":filZona;
    const turnoLabel=turno==="TODOS"?"Todos los turnos":turno;
    const fechaLabel=fecha||"Todas las fechas";

    const rows=lista.map((e,i)=>{
      const zi=getZonaLogistica(zonasConfig,e.trans,e.partido);
      const zml=getZonaML(e.partido);
      return `<tr>
        <td style="text-align:center;padding:4px 6px;border:1px solid #ddd;">${i+1}</td>
        <td style="padding:4px 6px;border:1px solid #ddd;"><strong>${e.direccion}</strong><br><span style="font-size:9px;color:#555;">${e.partido} · CP ${e.cp}</span></td>
        <td style="padding:4px 6px;border:1px solid #ddd;font-family:monospace;font-size:9px;color:#555;">...${e.id.slice(-10)}</td>
        <td style="padding:4px 6px;border:1px solid #ddd;">${e.trans||"-"}</td>
        <td style="padding:4px 6px;border:1px solid #ddd;">${zml!=="otra"?zml:"-"}${zi?" / "+zi.nombre:""}</td>
        <td style="padding:4px 6px;border:1px solid #ddd;text-align:center;">${e.turno||"-"}</td>
        <td style="padding:4px 6px;border:1px solid #ddd;text-align:center;">${e.fecha?fmtCorta(e.fecha):"-"}</td>
        ${hayCobro?`<td style="padding:4px 6px;border:1px solid #ddd;text-align:right;">${e.cobranza?"$"+Number(e.cobranza).toLocaleString("es-AR"):"-"}</td>`:""}
        ${hayCambio?`<td style="padding:4px 6px;border:1px solid #ddd;font-size:9px;">${e.cambio||"-"}</td>`:""}
        <td style="padding:4px 6px;border:1px solid #ddd;text-align:center;">&#9633;</td>
      </tr>`;
    }).join("");

    const html=`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Envios ${fecha}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body { font-family: Arial, sans-serif; font-size: 10px; margin: 0; }
  h2 { margin: 0 0 3px; font-size: 13px; }
  .sub { color: #444; margin: 0 0 4px; font-size: 9px; }
  .meta { display: flex; gap: 16px; margin-bottom: 8px; font-size: 9px; }
  .meta span { background: #f0f0f0; padding: 2px 8px; border-radius: 4px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #e8e8e8; padding: 4px 6px; text-align: left; font-size: 9px; text-transform: uppercase; border: 1px solid #ccc; }
  td { vertical-align: top; }
  tr:nth-child(even) td { background: #fafafa; }
  .footer { margin-top: 8px; padding-top: 6px; border-top: 1px solid #ccc; font-size: 9px; }
  @media print { button { display: none !important; } }
</style></head><body>
<h2>Hoja de salida de envios</h2>
<div class="sub">Impreso: ${tsImpr}</div>
<div class="meta">
  <span>Envios: <strong>${lista.length}</strong></span>
  <span>Logistica: <strong>${logLabel}</strong></span>
  <span>Zona: <strong>${zonaLabel}</strong></span>
  <span>Turno: <strong>${turnoLabel}</strong></span>
  <span>Fecha entrega: <strong>${fechaLabel}</strong></span>
  <span>Total: <strong>$${totalImp.toLocaleString("es-AR")}</strong></span>
  ${cobTotal?`<span>Cobranzas: <strong>$${cobTotal.toLocaleString("es-AR")}</strong></span>`:""}
</div>
<table>
<thead><tr>
  <th style="width:24px;">#</th>
  <th>Direccion</th>
  <th style="width:90px;">Nro. venta</th>
  <th style="width:60px;">Logistica</th>
  <th style="width:80px;">Zona</th>
  <th style="width:45px;">Turno</th>
  <th style="width:50px;">F. entrega</th>
  ${hayCobro?"<th style='width:65px;'>Cobrar</th>":""}
  ${hayCambio?"<th>Cambio/Dev.</th>":""}
  <th style="width:26px;text-align:center;">Chk</th>
</tr></thead>
<tbody>${rows}</tbody>
</table>
<div class="footer">Total: <strong>$${totalImp.toLocaleString("es-AR")}</strong> · ${lista.length} envios${cobTotal?" · Cobranzas: $"+cobTotal.toLocaleString("es-AR"):""}</div>
<script>window.onload=function(){window.print();}<\/script>
</body></html>`;

    const w=window.open("","_blank");
    if (!w) { alert("Permite ventanas emergentes para imprimir."); return; }
    w.document.write(html);
    w.document.close();
  };

  return (
    <div>
      <div style={{...S.card,padding:"0.75rem 1rem",marginBottom:"0.9rem",display:"flex",gap:"0.5rem",flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <span style={{color:"#6b7280",fontSize:"0.65rem",fontWeight:700,textTransform:"uppercase"}}>Fecha</span>
          <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} style={{...S.input,padding:"5px 10px",width:"140px"}}/>
        </div>
        <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
          {["TODOS",...LOGISTICAS].map(t=><button key={t} onClick={()=>setTrans(t)} style={S.btnSm(trans===t,TC[t]||"#6366f1")}>{t}</button>)}
        </div>
        <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
          {["TODAS",...ZONAS_ML_LIST].map(z=><button key={z} onClick={()=>setFilZona(z)} style={S.btnSm(filZona===z,ZONA_ML_COLOR[z]||"#6366f1")}>{z}</button>)}
        </div>
        <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
          {["TODOS",...TURNOS].map(t=><button key={t} onClick={()=>setTurno(t)} style={S.btnSm(turno===t,"#8b5cf6")}>{t}</button>)}
        </div>
        <button onClick={generarPDF} style={{marginLeft:"auto",...S.btn(true),background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"0.5rem 1.1rem"}}>Generar PDF / Imprimir</button>
      </div>
      <div style={{...S.card,padding:"0.65rem 1rem",marginBottom:"0.9rem",display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
        <div><span style={{color:"#6b7280",fontSize:"0.72rem"}}>Envios: </span><span style={{color:"#e5e7eb",fontWeight:700}}>{lista.length}</span></div>
        <div><span style={{color:"#6b7280",fontSize:"0.72rem"}}>Total: </span><span style={{color:"#10b981",fontWeight:700}}>{fmt(totalImp)}</span></div>
        {cobTotal>0&&<div><span style={{color:"#6b7280",fontSize:"0.72rem"}}>A cobrar: </span><span style={{color:"#fbbf24",fontWeight:700}}>{fmt(cobTotal)}</span></div>}
      </div>
      {lista.length===0?(
        <div style={{textAlign:"center",padding:"3rem",color:"#4b5563"}}><div style={{fontSize:"2rem"}}>📋</div><p>Sin envios para los filtros seleccionados</p></div>
      ):(
        <div style={{...S.card,overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"}}>
            <thead>
              <tr style={{background:"#12172a",borderBottom:"1px solid #252d40"}}>
                <th style={{...thSt,width:"28px",textAlign:"center"}}>#</th>
                <th style={thSt}>Direccion</th>
                <th style={thSt}>Nro. venta</th>
                <th style={thSt}>Logistica</th>
                <th style={thSt}>Zona ML</th>
                <th style={thSt}>Turno</th>
                <th style={thSt}>F.entrega</th>
                {hayCobro&&<th style={thSt}>Cobrar</th>}
                {hayCambio&&<th style={thSt}>Cambio/Dev.</th>}
                <th style={{...thSt,textAlign:"center",width:"28px"}}>Chk</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((e,i)=>{
                const zi=getZonaLogistica(zonasConfig,e.trans,e.partido);
                const zml=getZonaML(e.partido);
                return (
                  <tr key={e.id} style={{borderBottom:"1px solid #1a1f2e",background:i%2===0?"transparent":"#0d1119"}}>
                    <td style={{...tdSt,textAlign:"center",color:"#4b5563"}}>{i+1}</td>
                    <td style={{...tdSt,maxWidth:"240px"}}>
                      <div style={{color:"#e5e7eb",fontSize:"0.8rem",whiteSpace:"normal",lineHeight:1.3}}>{e.direccion}</div>
                      <div style={{color:"#4b5563",fontSize:"0.66rem"}}>{e.partido} · CP {e.cp}</div>
                    </td>
                    <td style={{...tdSt,fontFamily:"monospace",fontSize:"0.7rem",color:"#6b7280"}}>...{e.id.slice(-10)}</td>
                    <td style={tdSt}>{e.trans?<Bdg label={e.trans} bg={TCB[e.trans]} t={TC[e.trans]}/>:<span style={{color:"#374151"}}>-</span>}</td>
                    <td style={tdSt}>
                      {zml&&zml!=="otra"?<Bdg label={zml} bg={ZONA_ML_BG[zml]||"#1a1f2e"} t={ZONA_ML_COLOR[zml]||"#6b7280"}/>:null}
                      {zi&&<Bdg label={zi.nombre} bg={zi.color+"22"} t={zi.color} style={{marginLeft:"3px"}}/>}
                    </td>
                    <td style={tdSt}>{e.turno?<Bdg label={e.turno} bg={TURNO_C[e.turno]?TURNO_C[e.turno].bg:"#130d2a"} t={TURNO_C[e.turno]?TURNO_C[e.turno].c:"#a78bfa"}/>:<span style={{color:"#374151"}}>-</span>}</td>
                    <td style={{...tdSt,color:"#9ca3af"}}>{e.fecha?fmtCorta(e.fecha):"-"}</td>
                    {hayCobro&&<td style={tdSt}>{e.cobranza?<span style={{color:"#fbbf24",fontWeight:700}}>{fmt(e.cobranza)}</span>:<span style={{color:"#374151"}}>-</span>}</td>}
                    {hayCambio&&<td style={{...tdSt,maxWidth:"120px",fontSize:"0.73rem",color:"#9ca3af",whiteSpace:"normal"}}>{e.cambio||"-"}</td>}
                    <td style={{...tdSt,textAlign:"center"}}><div style={{width:"13px",height:"13px",border:"1px solid #374151",borderRadius:"2px",margin:"auto"}}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB CARGA MANUAL
// ════════════════════════════════════════════════════════════════════
function TabManual({setEnvios,onSuccess}) {
  const hoy=fechaHoy();
  const vacio={id:"",direccion:"",ciudad:"",cp:"",origen:"ML",trans:"",fecha:hoy,turno:"",cancelado:false,cobranza:null,cambio:null,partido:"",provincia:"",importe:0,fechaVenta:hoy};
  const [f,setF]=useState(vacio);
  const [err,setErr]=useState("");
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  useEffect(()=>{const p=cpAPartido(f.cp);if(p)set("partido",p);},[f.cp]);

  const guardar=()=>{
    if(!f.id.trim()){setErr("El numero de venta es obligatorio.");return;}
    if(!f.direccion.trim()){setErr("La direccion es obligatoria.");return;}
    if(!f.fecha){setErr("La fecha de entrega es obligatoria.");return;}
    setEnvios(p=>[{...f,id:f.id.trim(),partido:f.partido||(cpAPartido(f.cp)||f.ciudad)},...p]);
    setF(vacio);setErr("");onSuccess();
  };

  return (
    <div style={{maxWidth:"620px"}}>
      {err&&<div style={{...S.card,padding:"0.6rem 1rem",marginBottom:"0.75rem",background:"#1c0a0a",border:"1px solid #7f1d1d",color:"#fca5a5",fontSize:"0.82rem"}}>{err}</div>}
      <div style={{...S.card,padding:"1rem 1.1rem"}}>
        <h3 style={{margin:"0 0 0.9rem",fontWeight:800,fontSize:"0.95rem",color:"#e5e7eb"}}>Nuevo envio manual</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem",marginBottom:"0.7rem"}}>
          <div>
            <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Nro. de venta / referencia</label>
            <input value={f.id} onChange={e=>set("id",e.target.value)} style={{...S.input,width:"100%"}} placeholder="ej. 2000012345 o REF-001"/>
          </div>
          <div>
            <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Origen</label>
            <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
              {["ML","Tienda Nube","Particular","Otro"].map(o=><button key={o} onClick={()=>set("origen",o)} style={S.btnSm(f.origen===o,"#6366f1")}>{o}</button>)}
            </div>
          </div>
        </div>
        <div style={{marginBottom:"0.7rem"}}>
          <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Direccion completa</label>
          <textarea value={f.direccion} onChange={e=>set("direccion",e.target.value)} style={{...S.input,width:"100%",height:"56px",resize:"vertical"}} placeholder="Calle, numero, referencias..."/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.7rem",marginBottom:"0.7rem"}}>
          <div>
            <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>CP</label>
            <input value={f.cp} onChange={e=>set("cp",e.target.value)} style={{...S.input,width:"100%"}} placeholder="1642"/>
          </div>
          <div>
            <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Partido (auto)</label>
            <input value={f.partido} onChange={e=>set("partido",e.target.value)} style={{...S.input,width:"100%",color:f.partido?"#10b981":"#6b7280"}} placeholder="Se detecta por CP"/>
          </div>
          <div>
            <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Zona ML</label>
            <div style={{...S.input,padding:"0.45rem 0.6rem",color:ZONA_ML_COLOR[getZonaML(f.partido)]||"#6b7280",fontSize:"0.8rem",fontWeight:700}}>{getZonaML(f.partido)||"-"}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem",marginBottom:"0.7rem"}}>
          <div>
            <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Logistica</label>
            <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
              {LOGISTICAS.map(l=><button key={l} onClick={()=>set("trans",f.trans===l?"":l)} style={S.btnSm(f.trans===l,TC[l])}>{l}</button>)}
            </div>
          </div>
          <div>
            <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Turno</label>
            <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
              {TURNOS.map(t=><button key={t} onClick={()=>set("turno",f.turno===t?"":t)} style={S.btnSm(f.turno===t,"#8b5cf6")}>{t}</button>)}
            </div>
          </div>
          <div>
            <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Fecha de entrega</label>
            <input type="date" value={f.fecha} onChange={e=>set("fecha",e.target.value)} style={{...S.input,width:"100%"}}/>
          </div>
        </div>
        <div style={{...S.card,padding:"0.65rem 1rem",marginBottom:"0.55rem",background:"#0f1420"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
            <button onClick={()=>set("cobranza",f.cobranza!==null?null:0)} style={S.btnSm(f.cobranza!==null,"#f59e0b")}>Cobranza</button>
            {f.cobranza!==null
              ?<input type="number" placeholder="Monto a cobrar" value={f.cobranza||""} onChange={e=>set("cobranza",parseFloat(e.target.value)||0)} style={{...S.input,width:"150px",padding:"4px 10px"}}/>
              :<span style={{color:"#374151",fontSize:"0.78rem"}}>Sin cobranza</span>
            }
          </div>
        </div>
        <div style={{...S.card,padding:"0.65rem 1rem",marginBottom:"0.9rem",background:"#0f1420"}}>
          <button onClick={()=>set("cambio",f.cambio!==null?null:"")} style={S.btnSm(f.cambio!==null,"#ec4899")}>Cambio / Devolucion / Retiro</button>
          {f.cambio!==null
            ?<textarea value={f.cambio||""} onChange={e=>set("cambio",e.target.value)} placeholder="Descripcion..." style={{...S.input,display:"block",width:"100%",marginTop:"6px",height:"56px",resize:"vertical"}}/>
            :<span style={{color:"#374151",fontSize:"0.78rem",marginLeft:"8px"}}>Sin cambio</span>
          }
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:"0.5rem"}}>
          <button onClick={()=>{setF(vacio);setErr("");}} style={S.btn(false)}>Limpiar</button>
          <button onClick={guardar} style={{...S.btn(true),background:"linear-gradient(135deg,#6366f1,#8b5cf6)",padding:"0.5rem 1.2rem"}}>Agregar envio</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB TARIFAS
// ════════════════════════════════════════════════════════════════════
function TabTarifas({zonasConfig,setZonasConfig}) {
  const [logSel,setLogSel]=useState("HNOS");
  const [editando,setEditando]=useState(null);
  const [moverModal,setMoverModal]=useState(null);
  const [addModal,setAddModal]=useState(false);
  const [newZona,setNewZona]=useState({nombre:"",color:"#6366f1",precio:0});
  const cfg=zonasConfig[logSel];
  const asig=new Set(cfg.zonas.flatMap(z=>z.partidos));
  const sinAsig=ALL_PARTIDOS.filter(p=>!asig.has(p));
  const upd=fn=>setZonasConfig(p=>({...p,[logSel]:{...p[logSel],zonas:fn(p[logSel].zonas)}}));
  const updP=(id,v)=>upd(zs=>zs.map(z=>z.id===id?{...z,precio:parseInt(v)||0}:z));
  const updC=(id,c)=>upd(zs=>zs.map(z=>z.id===id?{...z,color:c}:z));
  const updN=(id,n)=>upd(zs=>zs.map(z=>z.id===id?{...z,nombre:n}:z));
  const elimZ=id=>{if(!window.confirm("Eliminar zona?"))return;upd(zs=>zs.filter(z=>z.id!==id));};
  const moverP=(p,dest)=>upd(zs=>zs.map(z=>({...z,partidos:z.id===dest?[...new Set([...z.partidos,p])]:z.partidos.filter(x=>x!==p)})));
  const quitarP=p=>upd(zs=>zs.map(z=>({...z,partidos:z.partidos.filter(x=>x!==p)})));
  const addZ=()=>{if(!newZona.nombre.trim())return;const id=newZona.nombre.toUpperCase().replace(/\s+/g,"_")+"_"+Date.now();upd(zs=>[...zs,{id,...newZona,partidos:[]}]);setAddModal(false);setNewZona({nombre:"",color:"#6366f1",precio:0});};
  return (
    <div>
      <div style={{...S.card,padding:"0.65rem 1rem",marginBottom:"0.9rem",display:"flex",gap:"0.4rem",flexWrap:"wrap",alignItems:"center"}}>
        <span style={{color:"#4b5563",fontSize:"0.65rem",fontWeight:700}}>LOGISTICA</span>
        {LOGISTICAS.map(l=><button key={l} onClick={()=>setLogSel(l)} style={S.btn(logSel===l,TC[l])}>{l}</button>)}
        <span style={{marginLeft:"auto",color:"#4b5563",fontSize:"0.72rem"}}>Doble clic en el precio para editar</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(245px,1fr))",gap:"0.85rem",marginBottom:"0.9rem"}}>
        {cfg.zonas.map(zona=>(
          <div key={zona.id} style={{...S.card,borderTop:"3px solid "+zona.color,overflow:"hidden"}}>
            <div style={{padding:"0.55rem 0.9rem 0.45rem",display:"flex",alignItems:"center",gap:"0.45rem",borderBottom:"1px solid #1e2535"}}>
              <input type="color" value={zona.color} onChange={e=>updC(zona.id,e.target.value)} style={{width:"18px",height:"18px",border:"none",borderRadius:"50%",cursor:"pointer",padding:0,flexShrink:0}}/>
              <input value={zona.nombre} onChange={e=>updN(zona.id,e.target.value)} style={{...S.input,flex:1,padding:"0.2rem 0.4rem",background:"transparent",border:"none",color:zona.color,fontWeight:700,fontSize:"0.85rem"}}/>
              <button onClick={()=>elimZ(zona.id)} style={{background:"none",border:"none",color:"#374151",cursor:"pointer",fontSize:"0.85rem"}}>x</button>
            </div>
            <div style={{padding:"0.45rem 0.9rem",borderBottom:"1px solid #1e2535",display:"flex",alignItems:"center",gap:"0.6rem"}}>
              <span style={{color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase"}}>Precio</span>
              {editando&&editando.id===zona.id?(
                <input autoFocus value={editando.val} onChange={e=>setEditando({...editando,val:e.target.value})}
                  onBlur={()=>{updP(zona.id,editando.val);setEditando(null);}}
                  onKeyDown={e=>{if(e.key==="Enter"){updP(zona.id,editando.val);setEditando(null);}if(e.key==="Escape")setEditando(null);}}
                  style={{...S.input,width:"100px",textAlign:"right",border:"1px solid "+zona.color,fontWeight:700}}/>
              ):(
                <span onDoubleClick={()=>setEditando({id:zona.id,val:String(zona.precio)})} style={{color:zona.precio>0?"#10b981":"#374151",fontWeight:800,fontSize:"1.1rem",cursor:"pointer",padding:"2px 8px",borderRadius:"5px"}}>{fmt(zona.precio)}</span>
              )}
              <span style={{color:"#374151",fontSize:"0.65rem",marginLeft:"auto"}}>{zona.partidos.length}</span>
            </div>
            <div style={{padding:"0.45rem 0.65rem",minHeight:"50px",display:"flex",flexWrap:"wrap",gap:"0.25rem",alignContent:"flex-start"}}>
              {zona.partidos.length===0&&<div style={{color:"#374151",fontSize:"0.7rem",width:"100%",textAlign:"center"}}>Sin partidos</div>}
              {zona.partidos.map(p=>(
                <div key={p} style={{display:"flex",alignItems:"center",gap:"0.2rem",padding:"2px 6px",background:"#0f1420",border:"1px solid "+zona.color+"44",borderRadius:"5px"}}>
                  <button onClick={()=>setMoverModal({p,from:zona.id})} style={{background:"none",border:"none",color:"#d1d5db",cursor:"pointer",fontSize:"0.68rem",padding:0}}>{p}</button>
                  <button onClick={()=>quitarP(p)} style={{background:"none",border:"none",color:"#374151",cursor:"pointer",fontSize:"0.6rem",padding:0}}>x</button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div onClick={()=>setAddModal(true)} style={{...S.card,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"0.4rem",minHeight:"130px",cursor:"pointer",border:"1px dashed #252d40",background:"transparent"}}>
          <span style={{color:"#374151",fontSize:"1.6rem"}}>+</span>
          <span style={{color:"#4b5563",fontSize:"0.78rem"}}>Nueva zona</span>
        </div>
      </div>
      {sinAsig.length>0&&(
        <div style={{...S.card,padding:"0.65rem 1rem"}}>
          <div style={{color:"#f59e0b",fontWeight:700,fontSize:"0.68rem",marginBottom:"0.4rem",textTransform:"uppercase"}}>Sin asignar ({sinAsig.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
            {sinAsig.map(p=><button key={p} onClick={()=>setMoverModal({p,from:null})} style={{padding:"2px 8px",background:"#1c1500",border:"1px solid #78350f",borderRadius:"5px",color:"#fbbf24",fontSize:"0.7rem",cursor:"pointer"}}>{p}</button>)}
          </div>
        </div>
      )}
      {moverModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div style={{...S.card,padding:"1.1rem",width:"100%",maxWidth:"320px"}}>
            <h3 style={{margin:"0 0 0.2rem",fontWeight:800,fontSize:"0.95rem"}}>Mover: {moverModal.p}</h3>
            <p style={{margin:"0 0 0.9rem",color:"#9ca3af",fontSize:"0.82rem"}}>A que zona?</p>
            <div style={{display:"grid",gap:"0.35rem"}}>
              {cfg.zonas.filter(z=>z.id!==moverModal.from).map(z=>(
                <button key={z.id} onClick={()=>{moverP(moverModal.p,z.id);setMoverModal(null);}} style={{padding:"0.5rem 0.9rem",background:"#0f1420",border:"1px solid "+z.color,borderRadius:"8px",color:z.color,fontWeight:700,cursor:"pointer",textAlign:"left",fontSize:"0.82rem",display:"flex",justifyContent:"space-between"}}>
                  <span>{z.nombre}</span><span style={{color:"#6b7280",fontWeight:400}}>{fmt(z.precio)}</span>
                </button>
              ))}
            </div>
            <button onClick={()=>setMoverModal(null)} style={{...S.btn(false),marginTop:"0.65rem",width:"100%"}}>Cancelar</button>
          </div>
        </div>
      )}
      {addModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div style={{...S.card,padding:"1.25rem",width:"100%",maxWidth:"320px"}}>
            <h3 style={{margin:"0 0 0.9rem",fontWeight:800}}>Nueva zona - {logSel}</h3>
            <div style={{display:"grid",gap:"0.65rem"}}>
              <div>
                <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Nombre</label>
                <input value={newZona.nombre} onChange={e=>setNewZona(p=>({...p,nombre:e.target.value}))} style={{...S.input,width:"100%"}} placeholder="ej. ZONA 4"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem"}}>
                <div>
                  <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Color</label>
                  <input type="color" value={newZona.color} onChange={e=>setNewZona(p=>({...p,color:e.target.value}))} style={{width:"100%",height:"34px",borderRadius:"7px",border:"1px solid #252d40",cursor:"pointer"}}/>
                </div>
                <div>
                  <label style={{display:"block",color:"#6b7280",fontSize:"0.62rem",fontWeight:700,textTransform:"uppercase",marginBottom:"3px"}}>Precio</label>
                  <input type="number" value={newZona.precio} onChange={e=>setNewZona(p=>({...p,precio:parseInt(e.target.value)||0}))} style={{...S.input,width:"100%"}}/>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:"0.5rem",marginTop:"1rem",justifyContent:"flex-end"}}>
              <button onClick={()=>setAddModal(false)} style={S.btn(false)}>Cancelar</button>
              <button onClick={addZ} style={{...S.btn(true),background:TC[logSel]}}>Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TAB RESUMEN
// ════════════════════════════════════════════════════════════════════
function TabResumen({envios,zonasConfig}) {
  const [semanaSel,setSemanaSel]=useState("");
  const [logSel,setLogSel]=useState("TODAS");
  const tmap=buildTarifaMap(zonasConfig);
  const getImp=e=>tmap[e.partido] ? (tmap[e.partido][e.trans]||0) : 0;
  const semMap={};
  envios.forEach(e=>{
    const ds=e.fecha||e.fechaVenta||"";if(!ds)return;
    const {w,y}=getWeekNum(ds);
    const key=y+"-"+String(w).padStart(2,"0");
    if(!semMap[key])semMap[key]={key,label:weekLabel(ds),fechas:new Set()};
    semMap[key].fechas.add(ds);
  });
  const semanas=Object.keys(semMap).sort().reverse();
  useEffect(()=>{if(semanas.length&&!semanaSel)setSemanaSel(semanas[0]);},[envios]);
  const semFechas=semanaSel&&semMap[semanaSel]?[...semMap[semanaSel].fechas].sort():[];
  const envSem=envios.filter(e=>{const ds=e.fecha||e.fechaVenta||"";return semFechas.includes(ds)&&!e.cancelado;});
  const logsMost=logSel==="TODAS"?LOGISTICAS:[logSel];
  const filas=semFechas.map(f=>{
    const row={f,label:new Date(f+"T00:00:00").toLocaleDateString("es-AR",{weekday:"short",day:"numeric",month:"short"})};
    LOGISTICAS.forEach(l=>{const ev=envSem.filter(e=>(e.fecha||e.fechaVenta||"")===f&&e.trans===l);row[l+"_n"]=ev.length;row[l+"_v"]=ev.reduce((s,e)=>s+getImp(e),0);});
    row._n=LOGISTICAS.reduce((s,l)=>s+(row[l+"_n"]||0),0);row._v=LOGISTICAS.reduce((s,l)=>s+(row[l+"_v"]||0),0);
    return row;
  });
  const totL=Object.fromEntries(LOGISTICAS.map(l=>[l,{n:filas.reduce((s,d)=>s+(d[l+"_n"]||0),0),v:filas.reduce((s,d)=>s+(d[l+"_v"]||0),0)}]));
  const grand={n:filas.reduce((s,d)=>s+d._n,0),v:filas.reduce((s,d)=>s+d._v,0)};
  if(!envios.length) return <div style={{textAlign:"center",padding:"3rem",color:"#4b5563"}}><div style={{fontSize:"2rem"}}>📊</div><p>Carga un Excel primero</p></div>;
  return (
    <div>
      <div style={{...S.card,padding:"0.65rem 1rem",marginBottom:"0.8rem",display:"flex",gap:"0.4rem",flexWrap:"wrap",alignItems:"center"}}>
        <span style={{color:"#4b5563",fontSize:"0.65rem",fontWeight:700}}>SEMANA</span>
        {semanas.map(s=><button key={s} onClick={()=>setSemanaSel(s)} style={S.btn(semanaSel===s)}>{semMap[s].label}</button>)}
      </div>
      <div style={{...S.card,padding:"0.55rem 1rem",marginBottom:"0.8rem",display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
        <button onClick={()=>setLogSel("TODAS")} style={S.btn(logSel==="TODAS")}>TODAS</button>
        {LOGISTICAS.map(l=><button key={l} onClick={()=>setLogSel(l)} style={S.btn(logSel===l,TC[l])}>{l}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"0.65rem",marginBottom:"0.9rem"}}>
        {logsMost.map(l=>(
          <div key={l} style={{...S.card,padding:"0.8rem 0.9rem",borderTop:"3px solid "+TC[l]}}>
            <div style={{color:TC[l],fontWeight:800,fontSize:"0.78rem",marginBottom:"3px"}}>{l}</div>
            <div style={{color:"#fff",fontWeight:800,fontSize:"1.55rem",lineHeight:1}}>{fmtN(totL[l].n)}</div>
            <div style={{color:"#6b7280",fontSize:"0.65rem",marginBottom:"2px"}}>envios</div>
            <div style={{color:"#10b981",fontWeight:700,fontSize:"0.9rem"}}>{fmt(totL[l].v)}</div>
          </div>
        ))}
        <div style={{...S.card,padding:"0.8rem 0.9rem",borderTop:"3px solid #6366f1",background:"#12172a"}}>
          <div style={{color:"#6366f1",fontWeight:800,fontSize:"0.78rem",marginBottom:"3px"}}>TOTAL</div>
          <div style={{color:"#fff",fontWeight:800,fontSize:"1.55rem",lineHeight:1}}>{fmtN(grand.n)}</div>
          <div style={{color:"#6b7280",fontSize:"0.65rem",marginBottom:"2px"}}>envios</div>
          <div style={{color:"#10b981",fontWeight:700,fontSize:"0.9rem"}}>{fmt(grand.v)}</div>
        </div>
      </div>
      <div style={{...S.card,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"}}>
          <thead>
            <tr style={{borderBottom:"1px solid #252d40",background:"#12172a"}}>
              <th style={thSt}>Dia</th>
              {logsMost.map(l=><th key={l} colSpan={2} style={{...thSt,color:TC[l],textAlign:"center",borderLeft:"1px solid #1e2535"}}>{l}</th>)}
              <th colSpan={2} style={{...thSt,color:"#6366f1",textAlign:"center",borderLeft:"1px solid #252d40"}}>TOTAL</th>
            </tr>
            <tr style={{borderBottom:"1px solid #1e2535"}}>
              <th style={thSt}></th>
              {logsMost.map(l=>[<th key={l+"a"} style={{...thSt,textAlign:"center",borderLeft:"1px solid #1e2535",color:"#374151"}}>#</th>,<th key={l+"b"} style={{...thSt,textAlign:"right",color:"#374151"}}>$</th>])}
              <th style={{...thSt,textAlign:"center",borderLeft:"1px solid #252d40",color:"#374151"}}>#</th>
              <th style={{...thSt,textAlign:"right",color:"#374151"}}>$</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((d,ri)=>(
              <tr key={d.f} style={{borderBottom:"1px solid #1a1f2e",background:ri%2===0?"transparent":"#0d1119"}}>
                <td style={{...tdSt,color:"#e5e7eb",fontWeight:500}}>{d.label}</td>
                {logsMost.map(l=>[
                  <td key={l+"c"} style={{...tdSt,textAlign:"center",borderLeft:"1px solid #1e2535",color:d[l+"_n"]>0?"#e5e7eb":"#2d3548"}}>{d[l+"_n"]||"-"}</td>,
                  <td key={l+"v"} style={{...tdSt,textAlign:"right",color:d[l+"_v"]>0?"#10b981":"#2d3548"}}>{d[l+"_v"]>0?fmt(d[l+"_v"]):"-"}</td>
                ])}
                <td style={{...tdSt,textAlign:"center",borderLeft:"1px solid #252d40",color:"#6366f1",fontWeight:700}}>{d._n||"-"}</td>
                <td style={{...tdSt,textAlign:"right",color:"#10b981",fontWeight:700}}>{fmt(d._v)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{borderTop:"2px solid #252d40",background:"#12172a"}}>
              <td style={{...tdSt,color:"#6366f1",fontWeight:800}}>TOTAL</td>
              {logsMost.map(l=>[
                <td key={l+"f1"} style={{...tdSt,textAlign:"center",borderLeft:"1px solid #1e2535",color:"#e5e7eb",fontWeight:700}}>{totL[l].n||"-"}</td>,
                <td key={l+"f2"} style={{...tdSt,textAlign:"right",color:"#10b981",fontWeight:700}}>{fmt(totL[l].v)}</td>
              ])}
              <td style={{...tdSt,textAlign:"center",borderLeft:"1px solid #252d40",color:"#6366f1",fontWeight:800}}>{grand.n}</td>
              <td style={{...tdSt,textAlign:"right",color:"#10b981",fontWeight:800}}>{fmt(grand.v)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// APP
// ════════════════════════════════════════════════════════════════════
export default function App() {
  const [pantalla,setPantalla]   = useState("inicio");
  const [borrador,setBorrador]   = useState([]);
  const [envios,setEnvios]       = useState([]);
  const [zonasConfig,setZonasConfig] = useState(ZONAS_INIT);
  const [tab,setTab]             = useState("envios");
  const [error,setError]         = useState("");
  const [loading,setLoading]     = useState(false);
  const [fileName,setFileName]   = useState("");
  const [toast,setToast]         = useState("");

  const mostrarToast = msg => { setToast(msg); setTimeout(()=>setToast(""),2500); };

  const cargarArchivo = useCallback(async (file) => {
    if (!file) return;
    setLoading(true); setError("");
    try {
      const parsed = await parsearExcel(file);
      setBorrador(parsed); setFileName(file.name); setPantalla("asignacion");
    } catch(e) { setError(e.message); }
    setLoading(false);
  }, []);

  const confirmarAsignacion = asignados => {
    setEnvios(p => [...asignados, ...p.filter(e => !asignados.find(a => a.id===e.id))]);
    setPantalla("dashboard"); setTab("envios");
    mostrarToast(asignados.length+" envios cargados");
  };

  const reasignarSeleccionados = items => {
    setBorrador(items); setPantalla("asignacion");
  };

  if (pantalla==="asignacion") {
    return <PantallaAsignacion borrador={borrador} fileName={fileName}
      onConfirmar={confirmarAsignacion}
      onCancelar={()=>setPantalla(envios.length>0?"dashboard":"inicio")}/>;
  }

  const TABS=[{id:"envios",l:"Envios"},{id:"imprimir",l:"Imprimir"},{id:"manual",l:"+ Manual"},{id:"tarifas",l:"Tarifas"},{id:"resumen",l:"Resumen"}];

  if (pantalla==="inicio") {
    return (
      <div style={{minHeight:"100vh",background:"#0a0e1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif",padding:"2rem"}}>
        <style>{`*{box-sizing:border-box;}`}</style>
        <div style={{width:"54px",height:"54px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",marginBottom:"1.5rem"}}>🛵</div>
        <h1 style={{fontWeight:800,fontSize:"1.8rem",margin:"0 0 0.3rem",color:"#fff",textAlign:"center"}}>EnviosHub</h1>
        <p style={{color:"#6b7280",margin:"0 0 2.5rem",fontSize:"0.95rem"}}>Gestion de envios Flex</p>
        {error&&<div style={{background:"#1c0a0a",border:"1px solid #7f1d1d",color:"#fca5a5",padding:"0.65rem 1.1rem",borderRadius:"10px",marginBottom:"1.25rem",fontSize:"0.82rem",maxWidth:"380px",textAlign:"center"}}>{error}</div>}
        <label style={{cursor:"pointer",display:"inline-block",marginBottom:"0.9rem"}}>
          <input type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){cargarArchivo(e.target.files[0]);e.target.value="";}}}/>
          <span style={{display:"inline-block",padding:"0.85rem 2rem",borderRadius:"12px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontWeight:700,fontSize:"0.95rem",cursor:"pointer"}}>
            {loading?"Leyendo...":"Cargar planilla ML"}
          </span>
        </label>
        <p style={{color:"#374151",fontSize:"0.75rem",margin:"0 0 1.25rem"}}>Reporte de ventas Mercado Libre (.xlsx)</p>
        <div style={{display:"flex",gap:"0.65rem",flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={()=>{setPantalla("dashboard");setTab("manual");}} style={{background:"none",border:"1px solid #252d40",borderRadius:"8px",color:"#6b7280",cursor:"pointer",fontSize:"0.8rem",padding:"0.45rem 0.9rem"}}>+ Carga manual</button>
          <button onClick={()=>{setPantalla("dashboard");setTab("tarifas");}} style={{background:"none",border:"1px solid #252d40",borderRadius:"8px",color:"#6b7280",cursor:"pointer",fontSize:"0.8rem",padding:"0.45rem 0.9rem"}}>Configurar tarifas</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#0a0e1a",color:"#fff",fontFamily:"sans-serif"}}>
      <style>{`*{box-sizing:border-box;}::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:#0a0e1a;}::-webkit-scrollbar-thumb{background:#252d40;border-radius:3px;}select option{background:#1a1f2e;color:#e5e7eb;}button:hover{opacity:0.85;}`}</style>
      {toast&&<div style={{position:"fixed",top:"16px",right:"16px",zIndex:999,background:"#041f14",border:"1px solid #10b981",borderRadius:"10px",padding:"0.6rem 1.1rem",color:"#34d399",fontWeight:700,fontSize:"0.82rem"}}>{toast}</div>}
      <div style={{background:"#0f1420",borderBottom:"1px solid #1a1f2e",padding:"0.7rem 1rem",display:"flex",alignItems:"center",gap:"0.55rem",flexWrap:"wrap"}}>
        <div style={{width:"26px",height:"26px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🛵</div>
        <div style={{marginRight:"0.2rem"}}>
          <div style={{fontWeight:800,fontSize:"0.92rem"}}>EnviosHub</div>
          <div style={{color:"#374151",fontSize:"0.58rem"}}>{fileName||"Sin datos"}</div>
        </div>
        <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{...S.btn(tab===t.id),padding:"0.32rem 0.65rem",fontSize:"0.73rem"}}>{t.l}</button>)}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
          <label style={{cursor:"pointer"}}>
            <input type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){cargarArchivo(e.target.files[0]);e.target.value="";}}}/>
            <span style={{display:"inline-block",padding:"0.33rem 0.75rem",borderRadius:"7px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontWeight:700,fontSize:"0.72rem",cursor:"pointer"}}>{loading?"...":"Cargar Excel"}</span>
          </label>
        </div>
      </div>
      <div style={{padding:"0.85rem 1rem",maxWidth:"1400px",margin:"0 auto"}}>
        {error&&<div style={{...S.card,padding:"0.65rem 1rem",marginBottom:"0.8rem",background:"#1c0a0a",border:"1px solid #7f1d1d",color:"#fca5a5",fontSize:"0.8rem"}}>{error}</div>}
        {tab==="envios"  &&<TabEnvios   envios={envios} setEnvios={setEnvios} zonasConfig={zonasConfig} onReasignar={reasignarSeleccionados}/>}
        {tab==="imprimir"&&<TabImprimir envios={envios} zonasConfig={zonasConfig}/>}
        {tab==="manual"  &&<TabManual   setEnvios={setEnvios} onSuccess={()=>{setTab("envios");mostrarToast("Envio agregado");}}/>}
        {tab==="tarifas" &&<TabTarifas  zonasConfig={zonasConfig} setZonasConfig={setZonasConfig}/>}
        {tab==="resumen" &&<TabResumen  envios={envios} zonasConfig={zonasConfig}/>}
      </div>
    </div>
  );
}

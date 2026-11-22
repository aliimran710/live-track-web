/**
 * Every word and number on this site lives here.
 *
 * Figures are taken from the ZM Solutions system documentation
 * (gps-tracker/document.md) and rewritten as customer-facing copy.
 * Nothing here is invented: if a number appears, the platform produces it.
 */

export type StatusKey = "move" | "idle" | "stop" | "offline" | "disabled" | "total";

export const STATUS_HEX: Record<StatusKey, string> = {
  move: "#16D97E",
  idle: "#FFB020",
  stop: "#FF4D5E",
  offline: "#5B6BA8",
  disabled: "#A855F7",
  total: "#38BDF8",
};

/* ------------------------------------------------------------------ */
/* Waypoints — the spine of the page                                   */
/* ------------------------------------------------------------------ */

/**
 * One trip, read top to bottom. Coordinates follow a real corridor from
 * Multan (the panel default map centre) north to Lahore, and the clock
 * runs forward in Asia/Karachi, the only timezone the platform computes in.
 */
export type Waypoint = {
  id: string;
  index: string;
  label: string;
  coord: string;
  stamp: string;
  status: StatusKey;
  speed: number;
};

export const WAYPOINTS: Waypoint[] = [
  { id: "hero", index: "01", label: "Departure", coord: "30.3384, 71.2781", stamp: "06:12:04", status: "move", speed: 48 },
  { id: "why", index: "02", label: "Blind spots", coord: "30.4712, 71.5390", stamp: "06:41:18", status: "move", speed: 72 },
  { id: "how", index: "03", label: "Signal chain", coord: "30.6655, 71.8803", stamp: "07:09:55", status: "move", speed: 81 },
  { id: "tracking", index: "04", label: "Live tracking", coord: "30.9021, 72.1447", stamp: "07:44:30", status: "move", speed: 64 },
  { id: "geofencing", index: "05", label: "Geofencing", coord: "31.1180, 72.4892", stamp: "08:16:02", status: "idle", speed: 0 },
  { id: "alerts", index: "06", label: "Alerts", coord: "31.2994, 72.7715", stamp: "08:52:47", status: "stop", speed: 0 },
  { id: "reports", index: "07", label: "Reports", coord: "31.4504, 73.1350", stamp: "09:30:11", status: "move", speed: 58 },
  { id: "control", index: "08", label: "Remote control", coord: "31.5610, 73.5902", stamp: "10:05:26", status: "disabled", speed: 0 },
  { id: "customer", index: "09", label: "The customer", coord: "31.4802, 73.9014", stamp: "10:38:59", status: "move", speed: 69 },
  { id: "admin", index: "10", label: "Administration", coord: "31.5204, 74.3587", stamp: "11:14:33", status: "offline", speed: 0 },
  { id: "platform", index: "11", label: "Platform", coord: "31.5497, 74.3436", stamp: "11:47:08", status: "total", speed: 0 },
  { id: "contact", index: "12", label: "Arrival", coord: "31.5820, 74.3294", stamp: "12:02:40", status: "stop", speed: 0 },
];

/* ------------------------------------------------------------------ */
/* 01 — Hero                                                           */
/* ------------------------------------------------------------------ */

export const HERO = {
  eyebrow: "Live Track · Fleet telemetry",
  title: ["Every vehicle,", "on one screen,", "right now."],
  lead:
    "Live Track puts your whole fleet on one map, tells you the moment something is wrong, and keeps a record you can hand to a customer. Built for operators who watch thousands of vehicles at once.",
  primaryCta: "See how it works",
  secondaryCta: "Talk to us",
  stats: [
    { value: 18, suffix: "", label: "Working modules", note: "Tracking to invoicing" },
    { value: 500, suffix: " ms", label: "Position batch", note: "Merged and flushed" },
    { value: 7, suffix: "", label: "Report types", note: "Route to summary" },
    { value: 0.05, suffix: " s", label: "Trip lookup", note: "Down from 13 s" },
  ],
};

/* ------------------------------------------------------------------ */
/* 02 — Why                                                            */
/* ------------------------------------------------------------------ */

export const WHY = {
  title: "A fleet you cannot see is a fleet you cannot answer for.",
  lead:
    "Most tracking tools show you a dot on a map and stop there. The questions that cost money come later, and they are harder.",
  questions: [
    {
      q: "Where was this truck at 3 PM yesterday?",
      a: "Trips are cached in full. Any vehicle, any day, answered in a twentieth of a second instead of thirteen.",
      status: "move" as StatusKey,
    },
    {
      q: "Why has this van not moved since morning?",
      a: "Set a timer on idle, stopped or moving. The panel raises it on its own after the minutes you chose.",
      status: "idle" as StatusKey,
    },
    {
      q: "The customer says nobody told them.",
      a: "Location and complaint updates go out over WhatsApp from the same row you are already looking at.",
      status: "stop" as StatusKey,
    },
    {
      q: "The vehicle is being driven without permission.",
      a: "Send the immobiliser command from the vehicle row and watch the device acknowledge it.",
      status: "disabled" as StatusKey,
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 03 — How it works                                                   */
/* ------------------------------------------------------------------ */

export const SIGNAL_CHAIN = {
  title: "From the vehicle to your screen",
  lead:
    "A position leaves the device and reaches the operator in four hops. Each one is tuned so that a thousand vehicles reporting at once still feels like one.",
  stages: [
    {
      key: "device",
      name: "Device",
      metric: "GT06 · Teltonika",
      body:
        "The tracker reads position, heading, speed, ignition, power and satellite count, then reports over GSM. Protocol differences are handled for you: the panel knows an immobiliser is out1 on one device and blocked on another.",
    },
    {
      key: "satellite",
      name: "Satellite fix",
      metric: "Live heading",
      body:
        "Each fix carries a bearing. Vehicle icons are rotated to match it and cached in five-degree steps, so a screen full of moving vehicles stays smooth instead of stuttering.",
    },
    {
      key: "server",
      name: "Server",
      metric: "500 ms batch",
      body:
        "Incoming frames are queued and flushed as one merged batch every 500 ms, halving the interval when the queue fills. If a frame has to be dropped the panel says so rather than quietly losing it.",
    },
    {
      key: "panel",
      name: "Operator panel",
      metric: "100 ms dispatch",
      body:
        "Updates are throttled to 100 ms and painted on the browser own frame clock. The vehicles you have selected update ahead of the queue, so the one you are watching never lags.",
    },
  ],
  resilience: [
    { label: "Reconnect", value: "5 s", note: "And again the moment the network returns" },
    { label: "Lookup cost", value: "O(1)", note: "Indexed by id, device and name" },
    { label: "Health", value: "3 states", note: "Healthy, degraded, critical — shown in the header" },
  ],
};

/* ------------------------------------------------------------------ */
/* 04 — Live tracking                                                  */
/* ------------------------------------------------------------------ */

export const TRACKING = {
  title: "Six states. One glance.",
  lead:
    "Every vehicle is in exactly one state, decided by ignition and speed. The strip across the top of the vehicle list counts them, and clicking a count filters the list to it.",
  states: [
    { key: "move" as StatusKey, name: "Moving", rule: "Ignition on, speed above zero", count: 412 },
    { key: "idle" as StatusKey, name: "Idle", rule: "Ignition on, not moving", count: 86 },
    { key: "stop" as StatusKey, name: "Stopped", rule: "Ignition off", count: 237 },
    { key: "offline" as StatusKey, name: "Offline", rule: "No contact from the device", count: 41 },
    { key: "disabled" as StatusKey, name: "Disabled", rule: "Blocked from the panel", count: 9 },
    { key: "total" as StatusKey, name: "Total", rule: "Everything you are allowed to see", count: 785 },
  ],
  map: {
    title: "The map does the work",
    items: [
      { name: "Auto-follow", body: "Keep the map locked to a vehicle. It re-centres only when the vehicle actually moves." },
      { name: "Live trail", body: "The last twenty positions stay drawn behind each vehicle, with arrows showing direction of travel." },
      { name: "Clean tracks", body: "Points are sorted by server time and de-duplicated before drawing, so routes never zig-zag." },
      { name: "Ruler", body: "Click anywhere to measure the straight-line distance from the selected vehicle." },
      { name: "Address", body: "Turn on the address bar and the panel reverse-geocodes wherever the vehicle is standing." },
      { name: "Fit to selection", body: "One vehicle centres; several fit the bounds around all of them." },
    ],
  },
  search: {
    title: "Nine ways to find one vehicle",
    fields: ["IMEI", "Vehicle", "Contact", "SIM", "Security code", "City", "Engine #", "Chassis #", "Customer name"],
    note: "Filters combine, so City plus Customer name narrows to exactly the rows you meant.",
  },
  readout: [
    { k: "Speed", v: "64 km/h" },
    { k: "Ignition", v: "On" },
    { k: "Satellites", v: "11" },
    { k: "Power", v: "12.6 V" },
    { k: "Battery", v: "96%" },
    { k: "Protocol", v: "teltonika" },
    { k: "Altitude", v: "122 m" },
    { k: "Odometer", v: "184,203 km" },
  ],
};

/* ------------------------------------------------------------------ */
/* 05 — Geofencing                                                     */
/* ------------------------------------------------------------------ */

export const GEOFENCING = {
  title: "Draw the boundary. The panel watches it.",
  lead:
    "Mark a yard, a customer site or a whole city, attach it to the vehicles that belong there, and get told when one leaves.",
  shapes: [
    {
      key: "polygon" as const,
      name: "Polygon",
      body: "Click each corner on the map. The shape closes itself when you save it.",
      wkt: "POLYGON((31.4504 73.1350, 31.4601 73.1512, 31.4489 73.1688, 31.4372 73.1471))",
    },
    {
      key: "circle" as const,
      name: "Circle",
      body: "Press at the centre and drag out to the radius you want.",
      wkt: "CIRCLE(31.4504 73.1350, 850)",
    },
  ],
  steps: [
    { name: "Draw", body: "Polygon or circle, directly on the live map." },
    { name: "Attach", body: "Bind the zone to a vehicle, or to as many as you need." },
    { name: "Watch", body: "Entry and exit raise an event with the zone named in it." },
    { name: "Protect", body: "Editing or deleting a zone asks for your password again first." },
  ],
};

/* ------------------------------------------------------------------ */
/* 06 — Alerts                                                         */
/* ------------------------------------------------------------------ */

export const ALERTS = {
  title: "You get told. You do not go looking.",
  lead:
    "Alarms arrive as they happen. Slower problems — a vehicle idling too long, a vehicle stopped since morning — are raised by a timer you set per vehicle.",
  feed: [
    { time: "08:52:47", vehicle: "LES-4471", event: "Geofence exit", tone: "stop" as StatusKey },
    { time: "08:51:12", vehicle: "TKF-9930", event: "Overspeed 96 km/h", tone: "idle" as StatusKey },
    { time: "08:49:03", vehicle: "MNL-2208", event: "Power disconnected", tone: "stop" as StatusKey },
    { time: "08:47:55", vehicle: "RWP-1174", event: "Idle 42 min", tone: "idle" as StatusKey },
    { time: "08:44:21", vehicle: "LHR-7712", event: "Ignition on", tone: "move" as StatusKey },
    { time: "08:41:09", vehicle: "FSD-3390", event: "Arrived at Zone 4", tone: "move" as StatusKey },
  ],
  rules: [
    { label: "Per-vehicle timers", value: "Idle · Stopped · Moving", note: "Choose the state and the minutes" },
    { label: "Default stopped alert", value: "60 min", note: "Applies when you have set no rule" },
    { label: "State check", value: "Every 15 s", note: "Each alert fires once per state change" },
    { label: "Alert history", value: "Last 100", note: "Survives a page reload" },
    { label: "Notification sounds", value: "9 tones", note: "With a volume you control" },
    { label: "Noise control", value: "1 day · 2 days · forever", note: "Mute a vehicle that is under repair" },
  ],
};

/* ------------------------------------------------------------------ */
/* 07 — Reports                                                        */
/* ------------------------------------------------------------------ */

export const REPORTS = {
  title: "Seven answers about yesterday",
  lead:
    "Pick a vehicle, pick a range, pick the question. Ranges are computed in Asia/Karachi, so today means today where your fleet is.",
  types: [
    { name: "Route", body: "The full track, drawn on the map and listed point by point." },
    { name: "Events", body: "Ignition on and off, marked along the route with direction arrows." },
    { name: "Idle", body: "Where the engine ran without the vehicle moving, and for how long." },
    { name: "Trips", body: "Each journey with its start, end, distance and duration." },
    { name: "Stops", body: "Where the vehicle stood still, and for how long." },
    { name: "Summary", body: "Distance, top speed and run-time for a single vehicle." },
    { name: "History report", body: "Every selected vehicle in one table, ready to print." },
  ],
  cache: {
    title: "Thirteen seconds to a twentieth of one",
    body:
      "Trips used to be read from the upstream server, which took around thirteen seconds for one vehicle for one day. They are now served from a cache refreshed nightly, and every selected vehicle is fetched in a single request.",
    before: { label: "Upstream, per vehicle per day", value: "13 s" },
    after: { label: "From cache, all vehicles at once", value: "0.05 s" },
  },
  pdf: {
    title: "A document you can send",
    columns: ["Sr.", "Vehicle no.", "Total travel (km)", "Max speed (km/h)", "Trip count", "Trip duration"],
    note: "Titled with your account name and the date range, with the column header repeated on every page.",
  },
  playback: {
    title: "Watch it happen again",
    body:
      "Replay any track with the vehicle moving along it. Play, pause, scrub to a moment, change the speed, and read the distance, moving time and top speed for the run.",
  },
};

/* ------------------------------------------------------------------ */
/* 08 — Remote control                                                 */
/* ------------------------------------------------------------------ */

export const CONTROL = {
  title: "Reach the vehicle, not just its record.",
  lead:
    "Commands go from the vehicle row to the device and come back with a result you can read, refreshed every five seconds while you wait.",
  commands: [
    { name: "Start", body: "Release the immobiliser and let the vehicle run.", tone: "move" as StatusKey },
    { name: "Stop", body: "Engage the immobiliser. The lock icon on the row changes with it.", tone: "disabled" as StatusKey },
    { name: "Custom", body: "Send any command string your device supports, saved to a library you can reuse.", tone: "total" as StatusKey },
  ],
  console: [
    { time: "10:05:26", line: "> IMMOBILISE ON", kind: "out" as const },
    { time: "10:05:29", line: "ACK · relay engaged", kind: "in" as const },
    { time: "10:05:31", line: "out1 = 1 · locked", kind: "in" as const },
  ],
  note: "Protocol differences are handled for you — out1 on Teltonika, blocked on GT06 — so the lock state on screen is the real one.",
};

/* ------------------------------------------------------------------ */
/* 09 — The customer                                                   */
/* ------------------------------------------------------------------ */

export const CUSTOMER = {
  title: "The part most trackers leave out",
  lead:
    "Fleet work is customer work. Three things an operator does all day are built into the same screen as the map.",
  channels: [
    {
      name: "Share a location",
      body: "Send the customer a Google Maps link to where their vehicle is standing, over WhatsApp, from the vehicle row.",
      sample:
        "Dear customer,\n\nHere is the current location of your vehicle (LES-4471):\nhttps://maps.google.com/?q=31.4504,73.1350",
    },
    {
      name: "Call the customer",
      body: "Click the number and your desk phone rings, then the customer. No headset, no browser microphone, no softphone to install.",
      sample: "Contact 1 · 0308 403 4370\nStarting call…\nPhone ringing — answer on ext 2001",
    },
    {
      name: "Track a complaint",
      body: "Pending, in process, resolved. Each ticket carries how long it has been open, or how long it took to close.",
      sample: "Ticket 2284 · Wiring issue\nIn process · open 3 h 12 m\nComment added by operator",
    },
  ],
  complaintStates: [
    { name: "Pending", tone: "stop" as StatusKey, count: 7 },
    { name: "In process", tone: "idle" as StatusKey, count: 12 },
    { name: "Resolved", tone: "move" as StatusKey, count: 148 },
  ],
};

/* ------------------------------------------------------------------ */
/* 10 — Administration                                                 */
/* ------------------------------------------------------------------ */

export const ADMIN = {
  title: "Who sees what",
  lead:
    "Accounts, devices and the link between them are managed in the panel. Sessions are encrypted and expire on their own.",
  groups: [
    {
      name: "Users",
      items: [
        "Create, edit and remove accounts",
        "Set an expiry date per account",
        "Attach and detach devices",
        "Search across every field",
      ],
    },
    {
      name: "Objects",
      items: [
        "Install and expiry dates per device",
        "Filter by active, expiry month and online state",
        "Export the filtered list to CSV",
        "Twenty-one editable fields per device",
      ],
    },
    {
      name: "Oversight",
      items: [
        "Device and user limits per reseller",
        "Online and offline counts per account",
        "Recover the record of a removed vehicle",
        "See which accounts a device belongs to",
      ],
    },
  ],
  session: [
    { label: "Session", value: "Encrypted" },
    { label: "Expiry", value: "7 days" },
    { label: "Rejected request", value: "Signed out" },
  ],
};

/* ------------------------------------------------------------------ */
/* 11 — Platform                                                       */
/* ------------------------------------------------------------------ */

export const PLATFORM = {
  title: "What it is built on",
  lead: "No plugins, no desktop install. It runs in the browser your operators already have open.",
  specs: [
    { k: "Interface", v: "React 18 · TypeScript · Vite" },
    { k: "Live data", v: "WebSocket, batched and throttled" },
    { k: "Mapping", v: "Google Maps with custom markers" },
    { k: "State", v: "Redux Toolkit with memoised selectors" },
    { k: "Charts", v: "Recharts on the live dashboard" },
    { k: "Documents", v: "A4 PDF generated in the browser" },
    { k: "Timezone", v: "Asia/Karachi throughout" },
    { k: "Speed", v: "Knots converted to km/h on display" },
    { k: "Lists", v: "50 rows per page, 100 in admin" },
    { k: "Layout", v: "Desktop console, usable on a phone" },
  ],
  dashboard: {
    title: "A dashboard for the room",
    kpis: ["Users", "Zones", "Circle zones", "Polygon zones", "Vehicles", "Complaints"],
    charts: ["Object status overview", "Events today", "Maintenance", "Zone split"],
  },
};

/* ------------------------------------------------------------------ */
/* 12 — Contact                                                        */
/* ------------------------------------------------------------------ */

export const CONTACT = {
  eyebrow: "Arrival",
  title: "Put your fleet on the map.",
  lead:
    "Tell us how many vehicles you run and what you need to see. We will show you the panel with your own devices on it.",
  fields: {
    name: { label: "Your name", placeholder: "Ali Imran" },
    company: { label: "Company", placeholder: "Transport company" },
    phone: { label: "Phone", placeholder: "0300 0000000" },
    fleet: { label: "Fleet size", placeholder: "120" },
    message: {
      label: "What do you need to track?",
      placeholder: "Containers between Multan and Lahore, with geofences at both yards.",
    },
  },
  submit: "Request a demo",
  success: "Request received. We will call you on the number you gave.",
  assurances: [
    "We set up your devices before the demo, so you see your own fleet.",
    "Operators are trained on the live panel, not a slide deck.",
    "Your data stays on your account and nowhere else.",
  ],
};

export const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#tracking", label: "Tracking" },
  { href: "#reports", label: "Reports" },
  { href: "#control", label: "Control" },
  { href: "#platform", label: "Platform" },
];

export const FOOTER = {
  blurb: "Fleet GPS tracking built and run by Live Track.",
  columns: [
    { title: "Product", links: ["Live tracking", "Geofencing", "Alerts", "Reports", "Remote control"] },
    { title: "Platform", links: ["Operator panel", "Dashboard", "Administration", "Mobile layout"] },
    { title: "Company", links: ["About", "Support", "Contact"] },
  ],
  legal: "Live Track. All rights reserved.",
};

/**
 * A vehicle state used as *text*. Resolves through CSS variables so the
 * colour darkens on the light theme instead of washing out.
 * Use STATUS_HEX for fills, bars and dots; use this for anything read.
 */
export function statusInk(key: StatusKey) {
  return `var(--ink-${key})`;
}

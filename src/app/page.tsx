"use client";

import { useEffect, useState } from "react";
import { normalizeEmail, normalizePersonName } from "@/lib/text";

type Appointment = {
  id: string;
  day: string;
  time: string;
  name: string;
  type: string;
  color: string;
  status: string;
};

type AppointmentDraft = {
  day: string;
  patient: string;
  time: string;
  type: string;
};

const initialAppointments: Appointment[] = [
  { id: "a-1", day: "20", time: "09:30", name: "Sofia Bianchi", type: "Colloquio individuale", color: "mint", status: "Confermato" },
  { id: "a-2", day: "20", time: "11:00", name: "Marco Rinaldi", type: "Prima consultazione", color: "coral", status: "Da confermare" },
  { id: "a-3", day: "20", time: "15:30", name: "Elena Conti", type: "Colloquio individuale", color: "blue", status: "Confermato" },
  { id: "a-4", day: "20", time: "17:00", name: "Luca Ferri", type: "Follow-up", color: "amber", status: "Confermato" },
];

type Patient = {
  id: string;
  initials: string;
  name: string;
  detail: string;
  color: string;
  email: string;
  phone: string;
  emailConsent: boolean;
  whatsappConsent: boolean;
};

const initialPatients: Patient[] = [
  { id: "demo-sofia", initials: "SB", name: "Sofia Bianchi", detail: "Ultimo appuntamento ieri", color: "mint", email: "sofia.bianchi@email.demo", phone: "+39 333 000 0101", emailConsent: false, whatsappConsent: false },
  { id: "demo-marco", initials: "MR", name: "Marco Rinaldi", detail: "Prima consultazione oggi", color: "coral", email: "marco.rinaldi@email.demo", phone: "+39 333 000 0102", emailConsent: false, whatsappConsent: false },
  { id: "demo-elena", initials: "EC", name: "Elena Conti", detail: "Ultimo appuntamento 12 giu", color: "blue", email: "elena.conti@email.demo", phone: "+39 333 000 0103", emailConsent: false, whatsappConsent: false },
];

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (response.ok) onLogin();
    else setError("Credenziali non valide.");
    setSubmitting(false);
  }

  return <main className="login-page"><section className="login-card"><div className="brand login-brand"><span className="brand-mark">+</span><span>Studio di<br /><b>Psicologia</b></span></div><p className="eyebrow">ACCESSO RISERVATO</p><h1>Buongiorno, Martina</h1><p className="login-intro">Accedi al tuo spazio di lavoro.</p><form onSubmit={submit} className="login-form"><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@studio.it" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="La tua password" required /></label>{error && <p className="form-error">{error}</p>}<button type="submit" className="primary-button" disabled={isSubmitting}>{isSubmitting ? "Accesso in corso..." : "Accedi"}</button></form><p className="demo-disclaimer">Ambiente di prova: usa solo dati fittizi fino al completamento della configurazione di sicurezza.</p></section></main>;
}

function PatientManager({ patients, onClose, onNew, onEdit, onDelete }: { patients: Patient[]; onClose: () => void; onNew: () => void; onEdit: (patient: Patient) => void; onDelete: (patient: Patient) => void }) {
  const [search, setSearch] = useState("");
  const [consentFilter, setConsentFilter] = useState("all");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = !normalizedSearch || `${patient.name} ${patient.email} ${patient.phone}`.toLowerCase().includes(normalizedSearch);
    const matchesConsent = consentFilter === "all" || (consentFilter === "email" ? patient.emailConsent : patient.whatsappConsent);
    return matchesSearch && matchesConsent;
  });

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="manager-modal" role="dialog" aria-modal="true" aria-labelledby="patient-manager-title"><div className="manager-header"><div><p className="eyebrow">ANAGRAFICA</p><h2 id="patient-manager-title">Gestisci pazienti</h2><p className="manager-count">{filteredPatients.length} di {patients.length} pazienti</p></div><button className="close-button" aria-label="Chiudi" onClick={onClose}>×</button></div><div className="manager-toolbar"><input aria-label="Cerca paziente" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cerca nome, email o telefono" /><select aria-label="Filtra consensi" value={consentFilter} onChange={(event) => setConsentFilter(event.target.value)}><option value="all">Tutti i contatti</option><option value="email">Consenso email</option><option value="whatsapp">Consenso WhatsApp</option></select><button className="primary-button" onClick={onNew}>+ Nuovo paziente</button></div><div className="manager-list">{filteredPatients.map((patient) => <div className="manager-row" key={patient.id}><span className={`avatar avatar-${patient.color}`}>{patient.initials}</span><div className="manager-patient-info"><strong>{patient.name}</strong><span>{patient.phone || "Telefono assente"} · {patient.email || "Email assente"}</span><small>{patient.emailConsent ? "Email consentita" : "Email non consentita"} · {patient.whatsappConsent ? "WhatsApp consentito" : "WhatsApp non consentito"}</small></div><button className="manager-action" onClick={() => onEdit(patient)}>Modifica</button><button className="delete-patient" aria-label={`Cancella ${patient.name}`} onClick={() => onDelete(patient)}>×</button></div>)}{filteredPatients.length === 0 && <p className="empty-state">Nessun paziente corrisponde ai filtri.</p>}</div></section></div>;
}

function CalendarView({ appointments, selectedDay, onDayChange, onNew, onEdit, onDelete }: { appointments: Appointment[]; selectedDay: string; onDayChange: (day: string) => void; onNew: () => void; onEdit: (appointment: Appointment) => void; onDelete: (appointment: Appointment) => void }) {
  const days = [{ day: "18", label: "MER" }, { day: "19", label: "GIO" }, { day: "20", label: "VEN" }, { day: "21", label: "SAB" }, { day: "22", label: "DOM" }];
  const visibleAppointments = appointments.filter((appointment) => appointment.day === selectedDay).sort((first, second) => first.time.localeCompare(second.time));

  return <section className="calendar-page"><div className="welcome-row"><div><p className="eyebrow">CALENDARIO</p><h1>Agenda dello studio</h1><p className="intro">Visualizza e gestisci gli appuntamenti della settimana.</p></div><button className="primary-button" onClick={onNew}>+ <span>Nuovo appuntamento</span></button></div><div className="panel calendar-panel"><div className="panel-heading"><div><p className="eyebrow">SETTIMANA</p><h2>Giugno 2025</h2></div><strong className="calendar-count">{visibleAppointments.length} appuntamenti</strong></div><div className="date-strip">{days.map((date) => <button className={selectedDay === date.day ? "selected" : ""} onClick={() => onDayChange(date.day)} key={date.day}><b>{date.label}</b><strong>{date.day}</strong></button>)}</div><div className="appointment-list">{visibleAppointments.map((appointment) => <div className="appointment" key={appointment.id}><time>{appointment.time}</time><span className={`appointment-line ${appointment.color}`} /><div className="appointment-details"><strong>{appointment.name}</strong><span>{appointment.type}</span></div><span className={`status ${appointment.status === "Confermato" ? "confirmed" : "pending"}`}>{appointment.status}</span><button className="more-button" aria-label={`Modifica ${appointment.name}`} onClick={() => onEdit(appointment)}>•••</button><button className="delete-appointment" aria-label={`Cancella appuntamento di ${appointment.name}`} onClick={() => onDelete(appointment)}>×</button></div>)}</div>{visibleAppointments.length === 0 && <p className="empty-state">Nessun appuntamento per questo giorno.</p>}</div></section>;
}

export default function Home() {
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [activeSection, setActiveSection] = useState("Panoramica");
  const [patientList, setPatientList] = useState(initialPatients);
  const [appointmentList, setAppointmentList] = useState(initialAppointments);
  const [isStorageReady, setStorageReady] = useState(false);
  const [isPatientFormOpen, setPatientFormOpen] = useState(false);
    const [isPatientManagerOpen, setPatientManagerOpen] = useState(false);
  const [isAppointmentFormOpen, setAppointmentFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDay, setSelectedDay] = useState("20");
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formError, setFormError] = useState("");
  const [appointmentError, setAppointmentError] = useState("");
  const [allowAppointmentOverlap, setAllowAppointmentOverlap] = useState(false);
  const [appointmentDraft, setAppointmentDraft] = useState<AppointmentDraft>({ day: "20", patient: "", time: "", type: "Colloquio individuale" });
  const [apiAvailable, setApiAvailable] = useState(false);
  const visibleAppointments = appointmentList
    .filter((appointment) => appointment.day === selectedDay)
    .sort((first, second) => first.time.localeCompare(second.time));

  useEffect(() => {
    fetch("/api/auth/me").then((response) => setAuthStatus(response.ok ? "authenticated" : "unauthenticated")).catch(() => setAuthStatus("unauthenticated"));
  }, []);

  useEffect(() => {
    const savedPatients = window.localStorage.getItem("studio-calma-patients");
    const savedAppointments = window.localStorage.getItem("studio-calma-appointments");
    let localPatients = initialPatients;
    let localAppointments = initialAppointments;
    try {
      if (savedPatients) localPatients = JSON.parse(savedPatients) as Patient[];
      if (savedAppointments) localAppointments = JSON.parse(savedAppointments) as Appointment[];
    } catch {
      window.localStorage.removeItem("studio-calma-patients");
      window.localStorage.removeItem("studio-calma-appointments");
    }
    async function loadFromApi() {
      const patientResponse = await fetch("/api/patients");
      if (!patientResponse.ok) throw new Error("API pazienti non disponibile");
      let serverPatients = await patientResponse.json() as Array<{ id: string; firstName: string; lastName: string; phone: string | null; email: string | null; emailConsent: boolean; whatsappConsent: boolean }>;
      if (serverPatients.length === 0 && localPatients.length > 0) {
        serverPatients = await Promise.all(localPatients.map(async (patient) => {
          const response = await fetch("/api/patients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName: patient.name.split(" ")[0], lastName: patient.name.split(" ").slice(1).join(" "), phone: patient.phone, email: patient.email }),
          });
          return response.json();
        }));
      }
      const mappedPatients = serverPatients.map((patient) => ({
          id: patient.id,
          initials: `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase(),
          name: `${patient.firstName} ${patient.lastName}`,
          detail: "Contatto nel database",
          color: "mint",
          email: patient.email ?? "",
          phone: patient.phone ?? "",
          emailConsent: patient.emailConsent,
          whatsappConsent: patient.whatsappConsent,
        }));
      setPatientList(mappedPatients);
      const appointmentResponse = await fetch("/api/appointments");
      if (!appointmentResponse.ok) throw new Error("API appuntamenti non disponibile");
      let serverAppointments = await appointmentResponse.json() as Appointment[];
      if (serverAppointments.length === 0 && localAppointments.length > 0) {
        serverAppointments = (await Promise.all(localAppointments.map(async (appointment) => {
          const response = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day: appointment.day, time: appointment.time, patient: appointment.name, type: appointment.type }),
          });
          return response.ok ? response.json() : null;
        }))).filter(Boolean) as Appointment[];
      }
      setAppointmentList(serverAppointments);
      setApiAvailable(true);
    }

    loadFromApi().catch(() => {
      setPatientList(localPatients);
      setAppointmentList(localAppointments);
      setApiAvailable(false);
    }).finally(() => setStorageReady(true));
  }, []);

  useEffect(() => {
    if (isStorageReady) {
      window.localStorage.setItem("studio-calma-patients", JSON.stringify(patientList));
    }
  }, [isStorageReady, patientList]);

  useEffect(() => {
    if (isStorageReady) {
      window.localStorage.setItem("studio-calma-appointments", JSON.stringify(appointmentList));
    }
  }, [isStorageReady, appointmentList]);

  function openPatientForm(patient?: Patient) {
      setPatientManagerOpen(false);
    setEditingPatient(patient ?? null);
    setFormError("");
    setPatientFormOpen(true);
  }

  async function savePatient(formData: FormData) {
    const firstName = normalizePersonName(String(formData.get("firstName") || ""));
    const lastName = normalizePersonName(String(formData.get("lastName") || ""));
    if (!firstName || !lastName) {
      setFormError("Inserisci nome e cognome.");
      return;
    }
    const name = `${firstName} ${lastName}`;
    const updatedPatient: Patient = {
      id: editingPatient?.id ?? `local-${Date.now()}`,
      initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
      name,
      detail: editingPatient?.detail ?? "Nuovo paziente",
      color: editingPatient?.color ?? "amber",
      email: normalizeEmail(String(formData.get("email") || "")),
      phone: String(formData.get("phone") || "").trim(),
      emailConsent: formData.get("emailConsent") === "on",
      whatsappConsent: formData.get("whatsappConsent") === "on",
    };
    if (apiAvailable) {
      const response = await fetch(editingPatient ? `/api/patients/${editingPatient.id}` : "/api/patients", {
        method: editingPatient ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone: updatedPatient.phone, email: updatedPatient.email, emailConsent: updatedPatient.emailConsent, whatsappConsent: updatedPatient.whatsappConsent }),
      });
      if (!response.ok) {
        setFormError(response.status === 409 ? "Esiste gia un paziente con questi dati." : "Impossibile salvare il paziente.");
        return;
      }
      const saved = await response.json();
      updatedPatient.id = saved.id;
    }
    setPatientList((current) => editingPatient
      ? current.map((patient) => patient.id === editingPatient.id ? updatedPatient : patient)
      : [updatedPatient, ...current]);
    setFormError("");
    setPatientFormOpen(false);
    setEditingPatient(null);
  }

  async function removePatient(patient: Patient) {
    if (!window.confirm(`Rimuovere ${patient.name} dall'anagrafica?`)) return;
    if (apiAvailable) {
      const response = await fetch(`/api/patients/${patient.id}`, { method: "DELETE" });
      if (!response.ok) return;
    }
    setPatientList((current) => current.filter((item) => item.id !== patient.id));
  }

  function openAppointmentForm() {
    setEditingAppointment(null);
    setAppointmentError("");
    setAllowAppointmentOverlap(false);
    setAppointmentDraft({ day: selectedDay, patient: "", time: "", type: "Colloquio individuale" });
    setAppointmentFormOpen(true);
  }

  function editAppointment(appointment: Appointment) {
    setEditingAppointment(appointment);
    setAppointmentError("");
    setAllowAppointmentOverlap(false);
    setAppointmentDraft({ day: appointment.day, patient: appointment.name, time: appointment.time, type: appointment.type });
    setAppointmentFormOpen(true);
  }

  async function saveAppointment(formData: FormData) {
    const patientName = appointmentDraft.patient || String(formData.get("patient") || "");
    const time = appointmentDraft.time || String(formData.get("time") || "");
    if (!patientName || !time) {
      setAppointmentError("Seleziona un paziente e un orario.");
      return;
    }
    const updatedAppointment: Appointment = {
      id: `a-${Date.now()}`,
      day: appointmentDraft.day || String(formData.get("day") || selectedDay),
      time,
      name: patientName,
      type: appointmentDraft.type || String(formData.get("type") || "Colloquio individuale"),
      color: editingAppointment?.color ?? "amber",
      status: editingAppointment?.status ?? "Da confermare",
    };
    const hasLocalOverlap = appointmentList.some((appointment) => appointment.id !== editingAppointment?.id && appointment.day === updatedAppointment.day && appointment.time === updatedAppointment.time);
    if (hasLocalOverlap && !allowAppointmentOverlap) {
      setAppointmentError("Esiste gia un appuntamento a questo orario. Verifica la sovrapposizione oppure confermala.");
      return;
    }
    if (apiAvailable) {
      const response = await fetch(editingAppointment ? `/api/appointments/${editingAppointment.id}` : "/api/appointments", {
        method: editingAppointment ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day: updatedAppointment.day, time: updatedAppointment.time, patient: updatedAppointment.name, type: updatedAppointment.type, allowOverlap: allowAppointmentOverlap }),
      });
      if (!response.ok) {
        setAppointmentError(response.status === 409 ? "Esiste gia un appuntamento a questo orario. Verifica la sovrapposizione oppure confermala." : "Impossibile salvare l'appuntamento.");
        return;
      }
      const saved = await response.json();
      updatedAppointment.id = saved.id;
    }
    setAppointmentList((current) => editingAppointment
      ? current.map((appointment) => appointment.id === editingAppointment.id ? { ...updatedAppointment, id: editingAppointment.id } : appointment)
      : [...current, updatedAppointment]);
    setAppointmentError("");
    setAllowAppointmentOverlap(false);
    setAppointmentFormOpen(false);
    setEditingAppointment(null);
    setAppointmentDraft({ day: selectedDay, patient: "", time: "", type: "Colloquio individuale" });
  }

  async function removeAppointment(appointment: Appointment) {
    if (window.confirm(`Rimuovere l'appuntamento di ${appointment.name}?`)) {
      if (apiAvailable) {
        const response = await fetch(`/api/appointments/${appointment.id}`, { method: "DELETE" });
        if (!response.ok) return;
      }
      setAppointmentList((current) => current.filter((item) => item.id !== appointment.id));
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthStatus("unauthenticated");
  }

  if (authStatus === "loading") return <main className="login-page"><p className="login-loading">Caricamento...</p></main>;
  if (authStatus === "unauthenticated") return <LoginScreen onLogin={() => setAuthStatus("authenticated")} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">+</span><span>Studio di<br /><b>Psicologia</b></span></div>
        <div className="workspace-label">IL TUO STUDIO</div>
        <nav className="nav-list" aria-label="Navigazione principale">
          {["Panoramica", "Calendario", "Pazienti", "Impostazioni"].map((item) => (
            <button className={`nav-item ${activeSection === item ? "active" : ""}`} onClick={() => setActiveSection(item)} key={item}>
              <span className="nav-icon">{item === "Panoramica" ? "◈" : item === "Calendario" ? "□" : item === "Pazienti" ? "◎" : "⚙"}</span>{item}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom"><div className="privacy-note"><span>✓</span><div><strong>Dati protetti</strong><small>Solo dati demo</small></div></div><button className="profile" onClick={logout}><span className="avatar avatar-rose">MC</span><div><strong>Dott.ssa M. Conti</strong><small>Esci dall&apos;applicazione</small></div><span className="dots">•••</span></button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb">Il tuo studio <span>/</span> <strong>{activeSection}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifiche">♢<i /></button><button className="help-button">?</button></div></header>
        <div className="content-wrap">
          {activeSection === "Calendario" ? <CalendarView appointments={appointmentList} selectedDay={selectedDay} onDayChange={setSelectedDay} onNew={openAppointmentForm} onEdit={editAppointment} onDelete={removeAppointment} /> : <>
          <section className="welcome-row"><div><p className="eyebrow">MERCOLEDI, 18 GIUGNO 2025</p><h1>Buongiorno, Martina <span>✦</span></h1><p className="intro">Ecco cosa succede oggi nel tuo studio.</p></div><button className="primary-button" onClick={openAppointmentForm}>+ <span>Nuovo appuntamento</span></button></section>
          <section className="stats-grid"><div className="stat-card stat-today"><div className="stat-label">APPUNTAMENTI OGGI <span>→</span></div><strong>{visibleAppointments.length}</strong><p>2 in presenza <span>·</span> 2 online</p><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="stat-card"><div className="stat-label">PAZIENTI ATTIVI <span>→</span></div><strong>{patientList.length}</strong><p><b className="positive">+3</b> questo mese</p><div className="sparkline">╱╲╱╲╱╱╲╱</div></div><div className="stat-card"><div className="stat-label">PROMEMORIA INVIATI <span>→</span></div><strong>12</strong><p>Questa settimana</p><div className="delivery"><b>98%</b><span>consegnati</span></div></div></section>
          <section className="dashboard-grid"><div className="panel agenda-panel"><div className="panel-heading"><div><p className="eyebrow">AGENDA</p><h2>Gli appuntamenti del giorno</h2></div><button className="text-button" onClick={openAppointmentForm}>Nuovo <span>+</span></button></div><div className="date-strip"><button aria-label="Giorno precedente">‹</button>{[{ day: "18", label: "MER" }, { day: "19", label: "GIO" }, { day: "20", label: "VEN" }, { day: "21", label: "SAB" }, { day: "22", label: "DOM" }].map((date) => <button className={selectedDay === date.day ? "selected" : ""} onClick={() => setSelectedDay(date.day)} key={date.day}><b>{date.label}</b><strong>{date.day}</strong></button>)}<button aria-label="Giorno successivo">›</button></div><div className="appointment-list">{visibleAppointments.map((appointment) => <div className="appointment" key={appointment.id}><time>{appointment.time}</time><span className={`appointment-line ${appointment.color}`} /><div className="appointment-details"><strong>{appointment.name}</strong><span>{appointment.type}</span></div><span className={`status ${appointment.status === "Confermato" ? "confirmed" : "pending"}`}>{appointment.status}</span><button className="more-button" aria-label={`Modifica ${appointment.name}`} onClick={() => editAppointment(appointment)}>•••</button><button className="delete-appointment" aria-label={`Cancella appuntamento di ${appointment.name}`} onClick={() => removeAppointment(appointment)}>×</button></div>)}</div>{visibleAppointments.length === 0 && <p className="empty-state">Nessun appuntamento per questo giorno.</p>}</div>
            <div className="side-stack"><div className="panel patients-panel"><div className="panel-heading"><div><p className="eyebrow">PAZIENTI RECENTI</p><h2>Contatti rapidi</h2></div><button className="round-add" aria-label="Aggiungi paziente" onClick={() => openPatientForm()}>+</button></div><div className="patient-list">{patientList.slice(0, 3).map((patient) => <div className="patient" key={patient.id}><span className={`avatar avatar-${patient.color}`}>{patient.initials}</span><div><strong>{patient.name}</strong><span>{patient.detail}</span></div><button className="more-button" aria-label={`Modifica ${patient.name}`} onClick={() => openPatientForm(patient)}>•••</button><button className="delete-patient" aria-label={`Cancella ${patient.name}`} onClick={() => removePatient(patient)}>×</button></div>)}</div><button className="outline-button" onClick={() => setPatientManagerOpen(true)}>Gestisci pazienti <span>→</span></button></div><div className="quote-card"><span className="quote-mark">“</span><p>La cura comincia dal tempo che scegli di dedicare.</p><small>Nota per oggi</small></div></div>
          </section>
          </>}
        </div>
      </main>
      {isPatientManagerOpen && <PatientManager patients={patientList} onClose={() => setPatientManagerOpen(false)} onNew={() => openPatientForm()} onEdit={openPatientForm} onDelete={removePatient} />}
      {isPatientFormOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPatientFormOpen(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="patient-form-title"><div className="modal-heading"><div><p className="eyebrow">{editingPatient ? "MODIFICA CONTATTO" : "NUOVO CONTATTO"}</p><h2 id="patient-form-title">{editingPatient ? "Modifica paziente" : "Aggiungi paziente"}</h2></div><button className="close-button" aria-label="Chiudi" onClick={() => setPatientFormOpen(false)}>×</button></div><form action={savePatient} className="patient-form"><label>Nome<input name="firstName" defaultValue={editingPatient?.name.split(" ")[0]} placeholder="Es. Sofia" autoFocus /></label><label>Cognome<input name="lastName" defaultValue={editingPatient?.name.split(" ").slice(1).join(" ")} placeholder="Es. Bianchi" /></label><label>Telefono <span>(facoltativo)</span><input name="phone" type="tel" defaultValue={editingPatient?.phone} placeholder="+39 333 000 0000" /></label><label>Email <span>(facoltativa)</span><input name="email" type="email" defaultValue={editingPatient?.email} placeholder="nome@email.it" /></label><label className="consent-option"><input name="emailConsent" type="checkbox" defaultChecked={editingPatient?.emailConsent} /> Consenso promemoria email</label><label className="consent-option"><input name="whatsappConsent" type="checkbox" defaultChecked={editingPatient?.whatsappConsent} /> Consenso promemoria WhatsApp</label>{formError && <p className="form-error">{formError}</p>}<div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setPatientFormOpen(false)}>Annulla</button><button type="submit" className="primary-button">{editingPatient ? "Salva modifiche" : "Salva paziente"}</button></div></form><p className="demo-disclaimer">I consensi vengono registrati, ma i promemoria non sono ancora attivi.</p></section></div>}
      {isAppointmentFormOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAppointmentFormOpen(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="appointment-form-title"><div className="modal-heading"><div><p className="eyebrow">AGENDA</p><h2 id="appointment-form-title">{editingAppointment ? "Modifica appuntamento" : "Nuovo appuntamento"}</h2></div><button className="close-button" aria-label="Chiudi" onClick={() => setAppointmentFormOpen(false)}>×</button></div><form onSubmit={(event) => { event.preventDefault(); void saveAppointment(new FormData(event.currentTarget)); }} className="patient-form"><label>Giorno<select name="day" value={appointmentDraft.day} onChange={(event) => setAppointmentDraft((draft) => ({ ...draft, day: event.target.value }))}><option value="18">Mercoledi 18</option><option value="19">Giovedi 19</option><option value="20">Venerdi 20</option><option value="21">Sabato 21</option><option value="22">Domenica 22</option></select></label><label>Paziente<select name="patient" value={appointmentDraft.patient} onChange={(event) => setAppointmentDraft((draft) => ({ ...draft, patient: event.target.value }))}><option value="">Seleziona un paziente</option>{patientList.map((patient) => <option value={patient.name} key={patient.name}>{patient.name}</option>)}</select></label><label>Orario<input name="time" type="time" value={appointmentDraft.time} onChange={(event) => setAppointmentDraft((draft) => ({ ...draft, time: event.target.value }))} /></label><label>Tipo di appuntamento<select name="type" value={appointmentDraft.type} onChange={(event) => setAppointmentDraft((draft) => ({ ...draft, type: event.target.value }))}><option>Colloquio individuale</option><option>Prima consultazione</option><option>Follow-up</option><option>Colloquio con piu persone</option></select></label>{appointmentError && <p className="form-error">{appointmentError}</p>}{appointmentError.includes("sovrapposizione") && <label className="consent-option"><input name="allowOverlap" type="checkbox" checked={allowAppointmentOverlap} onChange={(event) => setAllowAppointmentOverlap(event.target.checked)} /> Confermo la sovrapposizione: colloquio con piu persone</label>}<div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setAppointmentFormOpen(false)}>Annulla</button><button type="submit" className="primary-button">{editingAppointment ? "Salva modifiche" : "Salva appuntamento"}</button></div></form><p className="demo-disclaimer">Appuntamenti demo salvati nel browser per questa prova.</p></section></div>}
    </div>
  );
}

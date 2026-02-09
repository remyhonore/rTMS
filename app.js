(() => {
  "use strict";

  // NOTE : on garde volontairement la même clé de stockage local sur la branche 0.1.x
  // pour éviter toute régression (perte des données existantes dans le navigateur).
  const STORE_KEY = "rtms_registry_v0_1_0";
  const SCHEMA_VERSION = "0.1.11";

  // --------- Dictionnaire de données (v1) ----------
  const DATA_DICTIONARY = [
    // Patients
    {table:"patients", field:"patient_id", label:"ID patient", type:"texte", required:"oui", values:"P0001…", notes:"Identifiant interne. Généré automatiquement."},
    {table:"patients", field:"initiales", label:"Initiales", type:"texte", required:"oui", values:"—", notes:"Limiter les identifiants directs (pas de nom/prénom)."},
    {table:"patients", field:"annee_naissance", label:"Année de naissance", type:"entier", required:"oui", values:"1900–2100", notes:"Préférer année plutôt que date complète."},
    {table:"patients", field:"sexe", label:"Sexe", type:"catégoriel", required:"oui", values:"F/M/X/ND", notes:"ND = non précisé."},
    {table:"patients", field:"date_inclusion", label:"Date d’inclusion", type:"date", required:"oui", values:"AAAA-MM-JJ", notes:"Point de départ temporel des contrôles de cohérence."},
    {table:"patients", field:"indication", label:"Indication principale", type:"catégoriel", required:"oui", values:"fibromyalgie/douleur_neuropathique/post_infectieux/douleur_rebelle/autre", notes:"À adapter à la file active."},
    {table:"patients", field:"centre", label:"Centre", type:"texte", required:"oui", values:"—", notes:"Nom court du centre/structure."},
    {table:"patients", field:"consentement", label:"Consentement", type:"catégoriel", required:"oui", values:"oui/non", notes:"Bloquant pour inclusion en vie réelle selon procédures locales."},
    {table:"patients", field:"douleur_base", label:"Douleur de base (NRS)", type:"entier", required:"oui", values:"0–10", notes:"0 = aucune, 10 = maximale."},
    {table:"patients", field:"fatigue_base", label:"Fatigue de base (NRS)", type:"entier", required:"non", values:"0–10", notes:"Optionnel."},
    {table:"patients", field:"sommeil_base", label:"Sommeil de base (NRS)", type:"entier", required:"non", values:"0–10", notes:"0 = très mauvais, 10 = excellent."},
    {table:"patients", field:"humeur_base", label:"Humeur de base (NRS)", type:"entier", required:"non", values:"0–10", notes:"0 = très mauvaise, 10 = excellente."},
    {table:"patients", field:"antalgiques", label:"Antalgiques (texte)", type:"texte", required:"non", values:"—", notes:"Texte libre (pratique en V1)."},
    {table:"patients", field:"notes", label:"Notes", type:"texte", required:"non", values:"—", notes:"Texte libre."},
    {table:"patients", field:"created_at", label:"Créé le", type:"datetime", required:"oui", values:"ISO", notes:"Auto."},
    {table:"patients", field:"updated_at", label:"Mis à jour le", type:"datetime", required:"oui", values:"ISO", notes:"Auto."},

    // Séances
    {table:"seances", field:"seance_id", label:"ID séance", type:"texte", required:"oui", values:"S…", notes:"Identifiant interne. Auto."},
    {table:"seances", field:"patient_id", label:"ID patient", type:"texte", required:"oui", values:"P…", notes:"Lien vers patients.patient_id."},
    {table:"seances", field:"date", label:"Date séance", type:"date", required:"oui", values:"AAAA-MM-JJ", notes:"Doit être ≥ date d’inclusion."},
    {table:"seances", field:"numero", label:"Numéro de séance", type:"entier", required:"oui", values:"1…", notes:"Unique par patient."},
    {table:"seances", field:"cible", label:"Cible", type:"catégoriel", required:"non", values:"DLPFC/M1/SMA/autre", notes:"Optionnel."},
    {table:"seances", field:"lateralite", label:"Latéralité", type:"catégoriel", required:"non", values:"gauche/droite/bilaterale", notes:"Optionnel."},
    {table:"seances", field:"frequence_hz", label:"Fréquence", type:"decimal", required:"non", values:"0–100", notes:"Hz."},
    {table:"seances", field:"intensite_pct_mt", label:"Intensité (% seuil moteur)", type:"entier", required:"non", values:"0–200", notes:"Contrôle de cohérence large en V1."},
    {table:"seances", field:"pulses", label:"Nombre d’impulsions", type:"entier", required:"non", values:"0–200000", notes:"Optionnel."},
    {table:"seances", field:"duree_min", label:"Durée", type:"entier", required:"non", values:"0–300", notes:"Minutes."},
    {table:"seances", field:"douleur_pre", label:"Douleur avant (NRS)", type:"entier", required:"non", values:"0–10", notes:"Optionnel."},
    {table:"seances", field:"douleur_post", label:"Douleur après (NRS)", type:"entier", required:"non", values:"0–10", notes:"Optionnel."},
    {table:"seances", field:"tolerance", label:"Tolérance", type:"entier", required:"non", values:"0–10", notes:"0 = mauvaise, 10 = excellente."},
    {table:"seances", field:"effets", label:"Effets / remarque", type:"texte", required:"non", values:"—", notes:"Texte libre."},
    {table:"seances", field:"created_at", label:"Créé le", type:"datetime", required:"oui", values:"ISO", notes:"Auto."},
    {table:"seances", field:"updated_at", label:"Mis à jour le", type:"datetime", required:"oui", values:"ISO", notes:"Auto."},

    // Suivi
    {table:"suivi", field:"suivi_id", label:"ID suivi", type:"texte", required:"oui", values:"F…", notes:"Identifiant interne. Auto."},
    {table:"suivi", field:"patient_id", label:"ID patient", type:"texte", required:"oui", values:"P…", notes:"Lien vers patients.patient_id."},
    {table:"suivi", field:"date", label:"Date", type:"date", required:"oui", values:"AAAA-MM-JJ", notes:"Doit être ≥ date d’inclusion."},
    {table:"suivi", field:"temps", label:"Temps", type:"catégoriel", required:"oui", values:"inclusion/sem2/sem4/fin/m1/m3/autre", notes:"À adapter au protocole."},
    {table:"suivi", field:"point_protocole", label:"Point protocole", type:"texte", required:"non", values:"S0/S10… ou W0/W2…", notes:"Optionnel. Si utilisé, permet une couverture “réalisé/attendu” et une timeline."},
    {table:"suivi", field:"douleur", label:"Douleur (NRS)", type:"entier", required:"non", values:"0–10", notes:"Optionnel."},
    {table:"suivi", field:"fatigue", label:"Fatigue (NRS)", type:"entier", required:"non", values:"0–10", notes:"Optionnel."},
    {table:"suivi", field:"sommeil", label:"Sommeil (NRS)", type:"entier", required:"non", values:"0–10", notes:"0 = très mauvais, 10 = excellent."},
    {table:"suivi", field:"humeur", label:"Humeur (NRS)", type:"entier", required:"non", values:"0–10", notes:"0 = très mauvaise, 10 = excellente."},
    {table:"suivi", field:"pgic", label:"PGIC", type:"entier", required:"non", values:"1–7", notes:"Échelle à harmoniser selon centre (ici, repère par défaut)."},
    {table:"suivi", field:"antalgiques", label:"Antalgiques (texte)", type:"texte", required:"non", values:"—", notes:"Texte libre."},
    {table:"suivi", field:"notes", label:"Notes", type:"texte", required:"non", values:"—", notes:"Texte libre."},
    {table:"suivi", field:"created_at", label:"Créé le", type:"datetime", required:"oui", values:"ISO", notes:"Auto."},
    {table:"suivi", field:"updated_at", label:"Mis à jour le", type:"datetime", required:"oui", values:"ISO", notes:"Auto."},

    // EI
    {table:"evenements_indesirables", field:"ei_id", label:"ID EI", type:"texte", required:"oui", values:"E…", notes:"Identifiant interne. Auto."},
    {table:"evenements_indesirables", field:"patient_id", label:"ID patient", type:"texte", required:"oui", values:"P…", notes:"Lien vers patients.patient_id."},
    {table:"evenements_indesirables", field:"date", label:"Date", type:"date", required:"oui", values:"AAAA-MM-JJ", notes:"Doit être ≥ date d’inclusion."},
    {table:"evenements_indesirables", field:"severite", label:"Sévérité", type:"catégoriel", required:"oui", values:"leger/modere/severe", notes:"V1 : 3 niveaux."},
    {table:"evenements_indesirables", field:"lien_rtms", label:"Lien avec rTMS", type:"catégoriel", required:"oui", values:"oui/non/incertain", notes:"Imputabilité simplifiée."},
    {table:"evenements_indesirables", field:"description", label:"Description", type:"texte", required:"oui", values:"—", notes:"Temporalité + symptômes + contexte."},
    {table:"evenements_indesirables", field:"action", label:"Action", type:"texte", required:"non", values:"—", notes:"Adaptation, pause, arrêt…"},
    {table:"evenements_indesirables", field:"issue", label:"Issue", type:"catégoriel", required:"non", values:"resolu/en_cours/sequelles/inconnu", notes:"Optionnel."},
    {table:"evenements_indesirables", field:"date_resolution", label:"Date de résolution", type:"date", required:"non", values:"AAAA-MM-JJ", notes:"Doit être ≥ date EI."},
    {table:"evenements_indesirables", field:"created_at", label:"Créé le", type:"datetime", required:"oui", values:"ISO", notes:"Auto."},
    {table:"evenements_indesirables", field:"updated_at", label:"Mis à jour le", type:"datetime", required:"oui", values:"ISO", notes:"Auto."},
  

    // Protocole (paramétrage)
    {table:"protocole", field:"centre", label:"Centre (optionnel)", type:"texte", required:"non", values:"—", notes:"Vide = global. Sinon : protocole spécifique à un centre."},
    {table:"protocole", field:"seances_attendues", label:"Séances attendues", type:"entier", required:"non", values:"0–200", notes:"Optionnel. Sert au calcul réalisé/attendu sur le tableau de bord."},
    {table:"protocole", field:"mode_points", label:"Mode points", type:"catégoriel", required:"non", values:"seance/semaine", notes:"Définit le préfixe S ou W."},
    {table:"protocole", field:"points_attendus", label:"Points attendus", type:"liste", required:"non", values:"0,10,20,30…", notes:"Liste de points numériques (préfixe géré par le mode)."}
];

  // --------- Helpers ----------
  const qs = (sel, el=document) => el.querySelector(sel);
  const qsa = (sel, el=document) => Array.from(el.querySelectorAll(sel));
  const nowISO = () => new Date().toISOString();

  function uid(prefix){
    return prefix + Math.random().toString(36).slice(2, 8).toUpperCase() + Date.now().toString(36).slice(-4).toUpperCase();
  }

  function downloadText(filename, text, mime="text/plain;charset=utf-8"){
    const blob = new Blob([text], {type: mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadBlob(filename, blob){
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function asDate(s){
    if(!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  function fmtDate(s){
    if(!s) return "—";
    return s;
  }

  function esc(s){
    return (s ?? "").toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function trunc(s, max=140){
    const t = (s ?? "").toString().trim();
    if(!t) return "";
    if(t.length <= max) return t;
    return t.slice(0, Math.max(0, max-1)) + "…";
  }

  // --------- State ----------

function normalizeProtocol(proto){
  const base = {expectedSeances:null, mode:"seance", points:[]};
  const out = {global:{...base}, byCentre:{}};

  const cleanOne = (obj) => {
    const one = {...base};
    if(obj && typeof obj === "object"){
      // expectedSeances
      const esRaw = obj.expectedSeances;
      const esNum = (esRaw === null || esRaw === undefined || esRaw === "") ? null : Number(esRaw);
      one.expectedSeances = Number.isFinite(esNum) ? Math.max(0, Math.round(esNum)) : null;

      // mode
      one.mode = (obj.mode === "semaine" || obj.mode === "seance") ? obj.mode : "seance";

      // points
      const pts = Array.isArray(obj.points) ? obj.points : [];
      const nums = pts.map(x => Number(x)).filter(n => Number.isFinite(n)).map(n => Math.max(0, Math.round(n)));
      one.points = Array.from(new Set(nums)).sort((a,b) => a-b);
    }
    return one;
  };

  if(proto && typeof proto === "object"){
    out.global = cleanOne(proto.global);
    if(proto.byCentre && typeof proto.byCentre === "object"){
      for(const [k,v] of Object.entries(proto.byCentre)){
        const key = String(k || "").trim();
        if(!key) continue;
        out.byCentre[key] = cleanOne(v);
      }
    }
  }
  return out;
}

function normalizeState(obj){
  const st = (obj && typeof obj === "object") ? obj : {};
  const meta = (st.meta && typeof st.meta === "object") ? st.meta : {};
  const createdAt = meta.createdAt || nowISO();
  const updatedAt = meta.updatedAt || nowISO();
  const schemaVersion = meta.schemaVersion || SCHEMA_VERSION;

  return {
    meta: {schemaVersion, createdAt, updatedAt},
    patients: Array.isArray(st.patients) ? st.patients : [],
    seances: Array.isArray(st.seances) ? st.seances : [],
    suivi: Array.isArray(st.suivi) ? st.suivi : [],
    ei: Array.isArray(st.ei) ? st.ei : [],
    protocol: normalizeProtocol(st.protocol)
  };
}
  function defaultState(){
    return normalizeState({
      meta: {schemaVersion: SCHEMA_VERSION, createdAt: nowISO(), updatedAt: nowISO()},
      patients: [],
      seances: [],
      suivi: [],
      ei: [],
      protocol: {global:{expectedSeances:null, mode:"seance", points:[]}, byCentre:{}}
    });
  }

  let state = loadState();
  let currentPatientId = null;
  let currentSeanceId = null;
  let currentSuiviId = null;
  let currentEiId = null;

  function loadState(){
    try{
      const raw = localStorage.getItem(STORE_KEY);
      if(!raw) return defaultState();
      const obj = JSON.parse(raw);
      return normalizeState(obj);
    }catch(e){
      return defaultState();
    }
  }

  function saveState(){
    // Upgrade in-place (0.1.x) : conserve les données, met à jour la version du schéma.
    state.meta.schemaVersion = SCHEMA_VERSION;
    state.meta.updatedAt = nowISO();
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  // --------- Navigation ----------
  function setView(view){
    qsa(".tab").forEach(b => b.classList.toggle("active", b.dataset.view === view));
    qsa(".view").forEach(v => v.classList.add("hidden"));
    qs("#view-"+view).classList.remove("hidden");

    // refresh common selects/lists
    renderPatientsList();
    refreshPatientSelects();
    if(view === "seances") renderSeances();
    if(view === "suivi") renderSuivi();
    if(view === "ei") renderEI();
    if(view === "dashboard") renderDashboard();
    if(view === "protocole") renderProtocole();
    if(view === "qualite") renderQualityEmpty();
    if(view === "export") renderExport();
    if(view === "dictionnaire") renderDictionary();
  }

  // --------- Patients ----------
  function nextPatientId(){
    const nums = state.patients
      .map(p => (p.patient_id || "").replace("P",""))
      .map(x => parseInt(x,10))
      .filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    const next = max + 1;
    return "P" + String(next).padStart(4,"0");
  }

  function getPatient(patientId){
    return state.patients.find(p => p.patient_id === patientId) || null;
  }

  function setCurrentPatient(patientId){
    currentPatientId = patientId;
    // Keep selects aligned
    ["selPatientDashboard","selPatientSeances","selPatientSuivi","selPatientEI","selPatientExport"].forEach(id => {
      const sel = qs("#"+id);
      if(sel){
        sel.value = patientId || "";
      }
    });
    // Render active selection
    qsa("#patientsList .item").forEach(it => it.classList.toggle("active", it.dataset.patientId === patientId));
    loadPatientForm(patientId);
    refreshSuiviProtocolPoints(patientId);
    renderSeances();
    renderSuivi();
    renderEI();
    renderExport();
    // Dashboard : recalcul à chaque changement de patient.
    renderDashboard();
  }

  function renderPatientsList(){
    const list = qs("#patientsList");
    const q = (qs("#patientSearch")?.value || "").trim().toLowerCase();
    const items = state.patients
      .slice()
      .sort((a,b) => (a.patient_id||"").localeCompare(b.patient_id||""))
      .filter(p => {
        if(!q) return true;
        const blob = `${p.patient_id} ${p.initiales} ${p.indication}`.toLowerCase();
        return blob.includes(q);
      });

    list.innerHTML = "";
    if(items.length === 0){
      list.innerHTML = `<div class="hint">Aucun patient pour l’instant.</div>`;
      return;
    }
    for(const p of items){
      const ind = labelIndication(p.indication);
      const sub = `${ind} • inclusion ${fmtDate(p.date_inclusion)} • consentement ${p.consentement || "—"}`;
      const div = document.createElement("div");
      div.className = "item" + (p.patient_id === currentPatientId ? " active" : "");
      div.dataset.patientId = p.patient_id;
      div.innerHTML = `
        <div class="item-title">
          <span>${esc(p.initiales || "—")} <span class="badge">${esc(p.patient_id)}</span></span>
          <span class="badge">${esc(p.centre || "—")}</span>
        </div>
        <div class="item-sub">${esc(sub)}</div>
      `;
      div.addEventListener("click", () => setCurrentPatient(p.patient_id));
      list.appendChild(div);
    }
  }

  function labelIndication(v){
    const map = {
      fibromyalgie: "Fibromyalgie",
      douleur_neuropathique: "Douleur neuropathique",
      post_infectieux: "Post-infectieux / Covid long",
      douleur_rebelle: "Douleur rebelle",
      autre: "Autre"
    };
    return map[v] || (v ? v : "—");
  }

  function resetPatientForm(){
    currentPatientId = null;
    qs("#p_patientId").value = nextPatientId();
    qs("#p_initiales").value = "";
    qs("#p_anneeNaissance").value = "";
    qs("#p_sexe").value = "";
    qs("#p_dateInclusion").value = "";
    qs("#p_indication").value = "";
    qs("#p_centre").value = "";
    qs("#p_consentement").value = "";
    qs("#p_douleurBase").value = "";
    qs("#p_fatigueBase").value = "";
    qs("#p_sommeilBase").value = "";
    qs("#p_humeurBase").value = "";
    qs("#p_antalgiques").value = "";
    qs("#p_notes").value = "";
    setStatus("#patientFormStatus", "");
    // clear active highlight
    qsa("#patientsList .item").forEach(it => it.classList.remove("active"));
  }

  function loadPatientForm(patientId){
    const p = getPatient(patientId);
    if(!p){
      qs("#p_patientId").value = nextPatientId();
      return;
    }
    qs("#p_patientId").value = p.patient_id || "";
    qs("#p_initiales").value = p.initiales || "";
    qs("#p_anneeNaissance").value = p.annee_naissance ?? "";
    qs("#p_sexe").value = p.sexe || "";
    qs("#p_dateInclusion").value = p.date_inclusion || "";
    qs("#p_indication").value = p.indication || "";
    qs("#p_centre").value = p.centre || "";
    qs("#p_consentement").value = p.consentement || "";
    qs("#p_douleurBase").value = p.douleur_base ?? "";
    qs("#p_fatigueBase").value = p.fatigue_base ?? "";
    qs("#p_sommeilBase").value = p.sommeil_base ?? "";
    qs("#p_humeurBase").value = p.humeur_base ?? "";
    qs("#p_antalgiques").value = p.antalgiques || "";
    qs("#p_notes").value = p.notes || "";
  }

  function validatePatientForm(){
    const errors = [];
    const initiales = qs("#p_initiales").value.trim();
    const annee = parseInt(qs("#p_anneeNaissance").value,10);
    const sexe = qs("#p_sexe").value;
    const dateInc = qs("#p_dateInclusion").value;
    const indication = qs("#p_indication").value;
    const centre = qs("#p_centre").value.trim();
    const consent = qs("#p_consentement").value;
    const douleurBase = qs("#p_douleurBase").value;

    if(!initiales) errors.push("Initiales manquantes.");
    if(!annee || isNaN(annee)) errors.push("Année de naissance manquante.");
    if(!sexe) errors.push("Sexe manquant.");
    if(!dateInc) errors.push("Date d’inclusion manquante.");
    if(!indication) errors.push("Indication manquante.");
    if(!centre) errors.push("Centre manquant.");
    if(!consent) errors.push("Consentement manquant.");
    if(douleurBase === "" || douleurBase === null) errors.push("Douleur de base manquante.");

    // Basic ranges
    const pain = parseInt(douleurBase,10);
    if(douleurBase !== "" && (isNaN(pain) || pain < 0 || pain > 10)) errors.push("Douleur de base hors plage 0–10.");

    return errors;
  }

  function upsertPatient(){
    const errors = validatePatientForm();
    if(errors.length){
      setStatus("#patientFormStatus", "⛔ " + errors.join(" "));
      return;
    }

    const patientId = qs("#p_patientId").value || nextPatientId();

    const payload = {
      patient_id: patientId,
      initiales: qs("#p_initiales").value.trim(),
      annee_naissance: parseInt(qs("#p_anneeNaissance").value,10),
      sexe: qs("#p_sexe").value,
      date_inclusion: qs("#p_dateInclusion").value,
      indication: qs("#p_indication").value,
      centre: qs("#p_centre").value.trim(),
      consentement: qs("#p_consentement").value,
      douleur_base: parseInt(qs("#p_douleurBase").value,10),
      fatigue_base: numOrNull(qs("#p_fatigueBase").value),
      sommeil_base: numOrNull(qs("#p_sommeilBase").value),
      humeur_base: numOrNull(qs("#p_humeurBase").value),
      antalgiques: qs("#p_antalgiques").value.trim(),
      notes: qs("#p_notes").value.trim()
    };

    const existingIndex = state.patients.findIndex(p => p.patient_id === patientId);
    if(existingIndex >= 0){
      const old = state.patients[existingIndex];
      state.patients[existingIndex] = {...old, ...payload, updated_at: nowISO()};
      setStatus("#patientFormStatus", "✅ Patient mis à jour.");
    }else{
      state.patients.push({...payload, created_at: nowISO(), updated_at: nowISO()});
      setStatus("#patientFormStatus", "✅ Patient ajouté.");
    }

    saveState();
    renderPatientsList();
    refreshPatientSelects();
    setCurrentPatient(patientId);
  }

  function deleteCurrentPatient(){
    const pid = qs("#p_patientId").value;
    if(!pid) return;
    const p = getPatient(pid);
    if(!p) return;
    const ok = confirm(`Supprimer le patient ${pid} (${p.initiales}) ?\nCela supprimera aussi ses séances, suivis et événements indésirables.`);
    if(!ok) return;

    state.patients = state.patients.filter(x => x.patient_id !== pid);
    state.seances = state.seances.filter(x => x.patient_id !== pid);
    state.suivi = state.suivi.filter(x => x.patient_id !== pid);
    state.ei = state.ei.filter(x => x.patient_id !== pid);

    saveState();
    resetPatientForm();
    refreshPatientSelects();
    renderPatientsList();
    renderSeances();
    renderSuivi();
    renderEI();
    renderExport();
    setStatus("#patientFormStatus", "✅ Patient supprimé.");
  }

  // --------- Séances ----------
  function getSeancesForPatient(pid){
    return state.seances
      .filter(s => s.patient_id === pid)
      .slice()
      .sort((a,b) => {
        const da = a.date || "";
        const db = b.date || "";
        if(da !== db) return da.localeCompare(db);
        return (a.numero||0) - (b.numero||0);
      });
  }

  function resetSeanceForm(pid){
    currentSeanceId = null;
    qs("#s_id").value = "";
    qs("#s_date").value = "";
    qs("#s_numero").value = "";
    // Prefill from last seance for the patient
    const last = pid ? getSeancesForPatient(pid).slice(-1)[0] : null;
    qs("#s_cible").value = last?.cible || "";
    qs("#s_lateralite").value = last?.lateralite || "";
    qs("#s_frequence").value = last?.frequence_hz ?? "";
    qs("#s_intensite").value = last?.intensite_pct_mt ?? "";
    qs("#s_pulses").value = last?.pulses ?? "";
    qs("#s_duree").value = last?.duree_min ?? "";
    qs("#s_douleurPre").value = "";
    qs("#s_douleurPost").value = "";
    qs("#s_tolerance").value = "";
    qs("#s_effets").value = "";
    setStatus("#seanceFormStatus", "");
    qsa("#seancesList .item").forEach(it => it.classList.remove("active"));
  }

  function loadSeanceForm(id){
    const s = state.seances.find(x => x.seance_id === id);
    if(!s) return;
    currentSeanceId = id;
    qs("#s_id").value = s.seance_id;
    qs("#s_date").value = s.date || "";
    qs("#s_numero").value = s.numero ?? "";
    qs("#s_cible").value = s.cible || "";
    qs("#s_lateralite").value = s.lateralite || "";
    qs("#s_frequence").value = s.frequence_hz ?? "";
    qs("#s_intensite").value = s.intensite_pct_mt ?? "";
    qs("#s_pulses").value = s.pulses ?? "";
    qs("#s_duree").value = s.duree_min ?? "";
    qs("#s_douleurPre").value = s.douleur_pre ?? "";
    qs("#s_douleurPost").value = s.douleur_post ?? "";
    qs("#s_tolerance").value = s.tolerance ?? "";
    qs("#s_effets").value = s.effets || "";

    qsa("#seancesList .item").forEach(it => it.classList.toggle("active", it.dataset.seanceId === id));
  }

  function validateSeanceForm(pid){
    const errors = [];
    if(!pid) errors.push("Aucun patient sélectionné.");
    const date = qs("#s_date").value;
    const numeroStr = qs("#s_numero").value;
    const numero = parseInt(numeroStr,10);

    if(!date) errors.push("Date de séance manquante.");
    if(!numeroStr) errors.push("Numéro de séance manquant.");
    if(numeroStr && (isNaN(numero) || numero < 1)) errors.push("Numéro de séance invalide.");

    const p = pid ? getPatient(pid) : null;
    if(p && p.date_inclusion && date){
      if(date < p.date_inclusion) errors.push("Date séance avant la date d’inclusion.");
    }

    // Unique per patient
    if(pid && numeroStr){
      const existing = state.seances.find(s => s.patient_id === pid && s.numero === numero && s.seance_id !== (qs("#s_id").value || ""));
      if(existing) errors.push("Numéro de séance déjà utilisé pour ce patient.");
    }

    // Ranges (soft)
    const freq = numOrNull(qs("#s_frequence").value);
    if(freq !== null && (freq < 0 || freq > 100)) errors.push("Fréquence hors plage 0–100 Hz.");
    const inten = numOrNull(qs("#s_intensite").value);
    if(inten !== null && (inten < 0 || inten > 200)) errors.push("Intensité hors plage 0–200 %.");
    const pain = numOrNull(qs("#s_douleurPre").value);
    if(pain !== null && (pain < 0 || pain > 10)) errors.push("Douleur avant hors plage 0–10.");
    const pain2 = numOrNull(qs("#s_douleurPost").value);
    if(pain2 !== null && (pain2 < 0 || pain2 > 10)) errors.push("Douleur après hors plage 0–10.");
    const tol = numOrNull(qs("#s_tolerance").value);
    if(tol !== null && (tol < 0 || tol > 10)) errors.push("Tolérance hors plage 0–10.");

    return errors;
  }

  function upsertSeance(){
    const pid = qs("#selPatientSeances").value;
    const errors = validateSeanceForm(pid);
    if(errors.length){
      setStatus("#seanceFormStatus", "⛔ " + errors.join(" "));
      return;
    }

    const id = qs("#s_id").value || uid("S");
    const payload = {
      seance_id: id,
      patient_id: pid,
      date: qs("#s_date").value,
      numero: parseInt(qs("#s_numero").value,10),
      cible: qs("#s_cible").value,
      lateralite: qs("#s_lateralite").value,
      frequence_hz: numOrNull(qs("#s_frequence").value),
      intensite_pct_mt: numOrNull(qs("#s_intensite").value),
      pulses: numOrNull(qs("#s_pulses").value),
      duree_min: numOrNull(qs("#s_duree").value),
      douleur_pre: numOrNull(qs("#s_douleurPre").value),
      douleur_post: numOrNull(qs("#s_douleurPost").value),
      tolerance: numOrNull(qs("#s_tolerance").value),
      effets: qs("#s_effets").value.trim(),
    };

    const idx = state.seances.findIndex(s => s.seance_id === id);
    if(idx >= 0){
      const old = state.seances[idx];
      state.seances[idx] = {...old, ...payload, updated_at: nowISO()};
      setStatus("#seanceFormStatus", "✅ Séance mise à jour.");
    }else{
      state.seances.push({...payload, created_at: nowISO(), updated_at: nowISO()});
      setStatus("#seanceFormStatus", "✅ Séance ajoutée.");
    }
    saveState();
    renderSeances();
    loadSeanceForm(id);
    renderDashboard();
  }

  function deleteCurrentSeance(){
    const pid = qs("#selPatientSeances").value;
    const id = qs("#s_id").value;
    if(!id) return;
    const ok = confirm("Supprimer cette séance ?");
    if(!ok) return;

    state.seances = state.seances.filter(s => s.seance_id !== id);
    saveState();
    renderSeances();
    resetSeanceForm(pid);
    setStatus("#seanceFormStatus", "✅ Séance supprimée.");
    renderDashboard();
  }

  function renderSeances(){
    const pid = qs("#selPatientSeances").value || currentPatientId;
    const list = qs("#seancesList");
    if(!pid){
      list.innerHTML = `<div class="hint">Choisis un patient pour afficher ses séances.</div>`;
      return;
    }
    const items = getSeancesForPatient(pid);
    list.innerHTML = "";
    if(items.length === 0){
      list.innerHTML = `<div class="hint">Aucune séance pour ce patient.</div>`;
      return;
    }
    for(const s of items){
      const sub = `${fmtDate(s.date)} • ${s.cible || "cible —"} ${s.lateralite ? "• " + s.lateralite : ""}`;
      const div = document.createElement("div");
      div.className = "item" + (s.seance_id === currentSeanceId ? " active" : "");
      div.dataset.seanceId = s.seance_id;
      div.innerHTML = `
        <div class="item-title">
          <span>Séance ${esc(String(s.numero ?? "—"))}</span>
          <span class="badge">${esc(s.seance_id)}</span>
        </div>
        <div class="item-sub">${esc(sub)}</div>
      `;
      div.addEventListener("click", () => loadSeanceForm(s.seance_id));
      list.appendChild(div);
    }
  }

  // --------- Suivi ----------
  function getSuiviForPatient(pid){
    return state.suivi
      .filter(f => f.patient_id === pid)
      .slice()
      .sort((a,b) => (a.date||"").localeCompare(b.date||""));
  }

  function resetSuiviForm(pid){
    currentSuiviId = null;
    qs("#f_id").value = "";
    qs("#f_date").value = "";
    qs("#f_temps").value = "";
    qs("#f_douleur").value = "";
    qs("#f_fatigue").value = "";
    qs("#f_sommeil").value = "";
    qs("#f_humeur").value = "";
    qs("#f_pgic").value = "";
    qs("#f_antalgiques").value = "";
    qs("#f_notes").value = "";
    // protocole
    if(qs("#f_point_proto")){
      qs("#f_point_proto").value = "";
      qs("#f_point_proto").disabled = true;
    }
    if(qs("#f_point_proto_custom")){
      qs("#f_point_proto_custom").value = "";
      qs("#f_point_proto_custom").disabled = true;
    }
    refreshSuiviProtocolPoints(pid);

    setStatus("#suiviFormStatus", "");
    qsa("#suiviList .item").forEach(it => it.classList.remove("active"));
  }

  function loadSuiviForm(id){
    const f = state.suivi.find(x => x.suivi_id === id);
    if(!f) return;
    currentSuiviId = id;
    qs("#f_id").value = f.suivi_id;
    qs("#f_date").value = f.date || "";
    qs("#f_temps").value = f.temps || "";
    qs("#f_douleur").value = f.douleur ?? "";
    qs("#f_fatigue").value = f.fatigue ?? "";
    qs("#f_sommeil").value = f.sommeil ?? "";
    qs("#f_humeur").value = f.humeur ?? "";
    qs("#f_pgic").value = f.pgic ?? "";
    qs("#f_antalgiques").value = f.antalgiques || "";
    qs("#f_notes").value = f.notes || "";

    // protocole
    refreshSuiviProtocolPoints(f.patient_id, f.point_protocole);
    const _selP = qs("#f_point_proto");
    const _manualP = qs("#f_point_proto_custom");
    if(_selP && !_selP.disabled){
      const proto = getProtocolForPatient(f.patient_id);
      const val = normalizePointInput(f.point_protocole, proto.mode);
      const has = Array.from(_selP.options).some(o => o.value === val);
      if(has){
        _selP.value = val;
      }else{
        _selP.value = "__manual__";
        if(_manualP){ _manualP.disabled = false; _manualP.value = val; }
      }
      handleSuiviPointChange();
    }

    qsa("#suiviList .item").forEach(it => it.classList.toggle("active", it.dataset.suiviId === id));
  }

  function validateSuiviForm(pid){
    const errors = [];
    if(!pid) errors.push("Aucun patient sélectionné.");
    const date = qs("#f_date").value;
    const temps = qs("#f_temps").value;

    if(!date) errors.push("Date manquante.");
    if(!temps) errors.push("Temps manquant.");

    const p = pid ? getPatient(pid) : null;
    if(p && p.date_inclusion && date){
      if(date < p.date_inclusion) errors.push("Date de suivi avant la date d’inclusion.");
    }

    const pain = numOrNull(qs("#f_douleur").value);
    if(pain !== null && (pain < 0 || pain > 10)) errors.push("Douleur hors plage 0–10.");
    const fat = numOrNull(qs("#f_fatigue").value);
    if(fat !== null && (fat < 0 || fat > 10)) errors.push("Fatigue hors plage 0–10.");
    const som = numOrNull(qs("#f_sommeil").value);
    if(som !== null && (som < 0 || som > 10)) errors.push("Sommeil hors plage 0–10.");
    const hum = numOrNull(qs("#f_humeur").value);
    if(hum !== null && (hum < 0 || hum > 10)) errors.push("Humeur hors plage 0–10.");

    const pgic = numOrNull(qs("#f_pgic").value);
    if(pgic !== null && (pgic < 1 || pgic > 7)) errors.push("PGIC hors plage 1–7.");

    return errors;
  }

  function upsertSuivi(){
    const pid = qs("#selPatientSuivi").value;
    const errors = validateSuiviForm(pid);
    if(errors.length){
      setStatus("#suiviFormStatus", "⛔ " + errors.join(" "));
      return;
    }

    const id = qs("#f_id").value || uid("F");
    const payload = {
      suivi_id: id,
      patient_id: pid,
      date: qs("#f_date").value,
      temps: qs("#f_temps").value,
      point_protocole: (() => {
        const pid2 = pid;
        const proto = getProtocolForPatient(pid2);
        const sel = qs("#f_point_proto");
        const manual = qs("#f_point_proto_custom");
        if(!sel || sel.disabled) return "";
        const v = (sel.value === "__manual__") ? (manual ? manual.value : "") : sel.value;
        return normalizePointInput(v, proto.mode);
      })(),
      douleur: numOrNull(qs("#f_douleur").value),
      fatigue: numOrNull(qs("#f_fatigue").value),
      sommeil: numOrNull(qs("#f_sommeil").value),
      humeur: numOrNull(qs("#f_humeur").value),
      pgic: numOrNull(qs("#f_pgic").value),
      antalgiques: qs("#f_antalgiques").value.trim(),
      notes: qs("#f_notes").value.trim(),
    };

    const idx = state.suivi.findIndex(x => x.suivi_id === id);
    if(idx >= 0){
      const old = state.suivi[idx];
      state.suivi[idx] = {...old, ...payload, updated_at: nowISO()};
      setStatus("#suiviFormStatus", "✅ Suivi mis à jour.");
    }else{
      state.suivi.push({...payload, created_at: nowISO(), updated_at: nowISO()});
      setStatus("#suiviFormStatus", "✅ Suivi ajouté.");
    }
    saveState();
    renderSuivi();
    loadSuiviForm(id);
    renderDashboard();
  }

  function deleteCurrentSuivi(){
    const pid = qs("#selPatientSuivi").value;
    const id = qs("#f_id").value;
    if(!id) return;
    const ok = confirm("Supprimer ce suivi ?");
    if(!ok) return;

    state.suivi = state.suivi.filter(x => x.suivi_id !== id);
    saveState();
    renderSuivi();
    resetSuiviForm(pid);
    setStatus("#suiviFormStatus", "✅ Suivi supprimé.");
    renderDashboard();
  }

  function renderSuivi(){
    const pid = qs("#selPatientSuivi").value || currentPatientId;
    const list = qs("#suiviList");
    if(!pid){
      list.innerHTML = `<div class="hint">Choisis un patient pour afficher son suivi.</div>`;
      return;
    }
    const items = getSuiviForPatient(pid);
    list.innerHTML = "";
    if(items.length === 0){
      list.innerHTML = `<div class="hint">Aucun suivi pour ce patient.</div>`;
      return;
    }
    for(const f of items){
      const pt = f.point_protocole ? ` • ${f.point_protocole}` : "";
      const sub = `${fmtDate(f.date)} • ${labelTemps(f.temps)}${pt} • douleur ${f.douleur ?? "—"}/10`;
      const div = document.createElement("div");
      div.className = "item" + (f.suivi_id === currentSuiviId ? " active" : "");
      div.dataset.suiviId = f.suivi_id;
      div.innerHTML = `
        <div class="item-title">
          <span>${esc(labelTemps(f.temps))}</span>
          <span class="badge">${esc(f.suivi_id)}</span>
        </div>
        <div class="item-sub">${esc(sub)}</div>
      `;
      div.addEventListener("click", () => loadSuiviForm(f.suivi_id));
      list.appendChild(div);
    }
  }

  function labelTemps(v){
    const map = {inclusion:"Inclusion", sem2:"Semaine 2", sem4:"Semaine 4", fin:"Fin de cure", m1:"1 mois", m3:"3 mois", autre:"Autre"};
    return map[v] || (v ? v : "—");
  }

  // --------- EI ----------
  function getEIForPatient(pid){
    return state.ei
      .filter(e => e.patient_id === pid)
      .slice()
      .sort((a,b) => (a.date||"").localeCompare(b.date||""));
  }

  function resetEiForm(pid){
    currentEiId = null;
    qs("#e_id").value = "";
    qs("#e_date").value = "";
    qs("#e_severite").value = "";
    qs("#e_lien").value = "";
    qs("#e_description").value = "";
    qs("#e_action").value = "";
    qs("#e_issue").value = "";
    qs("#e_dateResolution").value = "";
    setStatus("#eiFormStatus", "");
    qsa("#eiList .item").forEach(it => it.classList.remove("active"));
  }

  function loadEiForm(id){
    const e = state.ei.find(x => x.ei_id === id);
    if(!e) return;
    currentEiId = id;
    qs("#e_id").value = e.ei_id;
    qs("#e_date").value = e.date || "";
    qs("#e_severite").value = e.severite || "";
    qs("#e_lien").value = e.lien_rtms || "";
    qs("#e_description").value = e.description || "";
    qs("#e_action").value = e.action || "";
    qs("#e_issue").value = e.issue || "";
    qs("#e_dateResolution").value = e.date_resolution || "";

    qsa("#eiList .item").forEach(it => it.classList.toggle("active", it.dataset.eiId === id));
  }

  function validateEiForm(pid){
    const errors = [];
    if(!pid) errors.push("Aucun patient sélectionné.");
    const date = qs("#e_date").value;
    const sev = qs("#e_severite").value;
    const lien = qs("#e_lien").value;
    const desc = qs("#e_description").value.trim();

    if(!date) errors.push("Date EI manquante.");
    if(!sev) errors.push("Sévérité manquante.");
    if(!lien) errors.push("Lien avec rTMS manquant.");
    if(!desc) errors.push("Description manquante.");

    const p = pid ? getPatient(pid) : null;
    if(p && p.date_inclusion && date){
      if(date < p.date_inclusion) errors.push("Date EI avant la date d’inclusion.");
    }

    const res = qs("#e_dateResolution").value;
    if(date && res && res < date) errors.push("Date de résolution avant la date EI.");

    return errors;
  }

  function upsertEI(){
    const pid = qs("#selPatientEI").value;
    const errors = validateEiForm(pid);
    if(errors.length){
      setStatus("#eiFormStatus", "⛔ " + errors.join(" "));
      return;
    }

    const id = qs("#e_id").value || uid("E");
    const payload = {
      ei_id: id,
      patient_id: pid,
      date: qs("#e_date").value,
      severite: qs("#e_severite").value,
      lien_rtms: qs("#e_lien").value,
      description: qs("#e_description").value.trim(),
      action: qs("#e_action").value.trim(),
      issue: qs("#e_issue").value,
      date_resolution: qs("#e_dateResolution").value || ""
    };

    const idx = state.ei.findIndex(x => x.ei_id === id);
    if(idx >= 0){
      const old = state.ei[idx];
      state.ei[idx] = {...old, ...payload, updated_at: nowISO()};
      setStatus("#eiFormStatus", "✅ EI mis à jour.");
    }else{
      state.ei.push({...payload, created_at: nowISO(), updated_at: nowISO()});
      setStatus("#eiFormStatus", "✅ EI ajouté.");
    }
    saveState();
    renderEI();
    loadEiForm(id);
    renderDashboard();
  }

  function deleteCurrentEI(){
    const pid = qs("#selPatientEI").value;
    const id = qs("#e_id").value;
    if(!id) return;
    const ok = confirm("Supprimer cet événement indésirable ?");
    if(!ok) return;

    state.ei = state.ei.filter(x => x.ei_id !== id);
    saveState();
    renderEI();
    resetEiForm(pid);
    setStatus("#eiFormStatus", "✅ EI supprimé.");
    renderDashboard();
  }

  function renderEI(){
    const pid = qs("#selPatientEI").value || currentPatientId;
    const list = qs("#eiList");
    if(!pid){
      list.innerHTML = `<div class="hint">Choisis un patient pour afficher ses EI.</div>`;
      return;
    }
    const items = getEIForPatient(pid);
    list.innerHTML = "";
    if(items.length === 0){
      list.innerHTML = `<div class="hint">Aucun EI pour ce patient.</div>`;
      return;
    }
    for(const e of items){
      const sub = `${fmtDate(e.date)} • ${labelSev(e.severite)} • lien rTMS : ${e.lien_rtms}`;
      const div = document.createElement("div");
      div.className = "item" + (e.ei_id === currentEiId ? " active" : "");
      div.dataset.eiId = e.ei_id;
      div.innerHTML = `
        <div class="item-title">
          <span>${esc(labelSev(e.severite))}</span>
          <span class="badge">${esc(e.ei_id)}</span>
        </div>
        <div class="item-sub">${esc(sub)}</div>
      `;
      div.addEventListener("click", () => loadEiForm(e.ei_id));
      list.appendChild(div);
    }
  }

  function labelSev(v){
    const map = {leger:"Léger", modere:"Modéré", severe:"Sévère"};
    return map[v] || (v ? v : "—");
  }

  // --------- Tableau de bord patient (v0.1.3) ----------
  function pct(n, d){
    if(!d) return 0;
    const v = Math.round((n / d) * 100);
    return Math.max(0, Math.min(100, v));
  }

  function isFilled(v){
    return !(v === null || v === undefined || v === "");
  }

  function recordCompleteness(records, requiredFields){
    const total = records.length;
    let complete = 0;
    const incomplete = [];
    for(const r of records){
      const missing = requiredFields.filter(f => !isFilled(r[f]));
      if(missing.length === 0){
        complete++;
      }else{
        incomplete.push({id: r, missing});
      }
    }
    return {total, complete, incomplete};
  }

  function patientRequiredMissing(p){
    const miss = [];
    if(!p) return ["patient_inexistant"];
    if(!p.initiales) miss.push("initiales");
    if(!p.annee_naissance) miss.push("annee_naissance");
    if(!p.sexe) miss.push("sexe");
    if(!p.date_inclusion) miss.push("date_inclusion");
    if(!p.indication) miss.push("indication");
    if(!p.centre) miss.push("centre");
    if(!p.consentement) miss.push("consentement");
    if(p.douleur_base === null || p.douleur_base === undefined || p.douleur_base === "") miss.push("douleur_base");
    return miss;
  }

  
// --------- Protocole (v0.1.3) ----------
function centreKey(v){
  return String(v || "").trim();
}

function pointPrefix(mode){
  return mode === "semaine" ? "W" : "S";
}

function pointValue(mode, n){
  return pointPrefix(mode) + String(n);
}

function normalizePointInput(v, mode){
  const s = String(v || "").trim();
  if(!s) return "";
  const up = s.toUpperCase();
  if(/^[SW]\d+$/.test(up)) return up;
  if(/^\d+$/.test(up)) return pointValue(mode, Number(up));
  return up;
}

function parsePointsText(text){
  const raw = String(text || "").split(",").map(x => x.trim()).filter(Boolean);
  const nums = raw
    .map(x => Number(x))
    .filter(n => Number.isFinite(n))
    .map(n => Math.max(0, Math.round(n)));
  return Array.from(new Set(nums)).sort((a,b)=>a-b);
}

function pointsText(points){
  return (points || []).map(n => String(n)).join(",");
}

function getProtocolForCentre(centre){
  const key = centreKey(centre);
  if(key && state.protocol?.byCentre?.[key]) return state.protocol.byCentre[key];
  return state.protocol?.global || {expectedSeances:null, mode:"seance", points:[]};
}

function getProtocolForPatient(patientId){
  const p = getPatient(patientId);
  if(!p) return getProtocolForCentre("");
  return getProtocolForCentre(p.centre);
}

function refreshCentreSelectProtocole(){
  const sel = qs("#selCentreProtocole");
  if(!sel) return;

  const centresPatients = Array.from(new Set(state.patients.map(p => centreKey(p.centre)).filter(Boolean)));
  const centresProto = state.protocol?.byCentre ? Object.keys(state.protocol.byCentre).map(centreKey).filter(Boolean) : [];
  const all = Array.from(new Set([...centresPatients, ...centresProto])).sort((a,b)=>a.localeCompare(b));

  const prev = sel.value;
  sel.innerHTML = `<option value="">— protocole global —</option>` + all.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
  sel.value = prev || "";
}

function renderProtocole(){
  const sel = qs("#selCentreProtocole");
  const expectedEl = qs("#proto_expected");
  const modeEl = qs("#proto_mode");
  const pointsEl = qs("#proto_points");
  const statusEl = qs("#protocoleStatus");
  const previewEl = qs("#protocolePreview");
  if(!sel || !expectedEl || !modeEl || !pointsEl || !statusEl || !previewEl) return;

  refreshCentreSelectProtocole();

  const centre = centreKey(sel.value);
  const hasOverride = !!(centre && state.protocol?.byCentre?.[centre]);
  const protoEffective = getProtocolForCentre(centre);
  const protoStored = centre ? (state.protocol.byCentre[centre] || null) : (state.protocol.global || null);

  // On charge le formulaire avec le protocole "stocké" si présent, sinon avec le global (héritage).
  const source = protoStored || state.protocol.global;
  expectedEl.value = (source.expectedSeances === null || source.expectedSeances === undefined) ? "" : String(source.expectedSeances);
  modeEl.value = source.mode || "seance";
  pointsEl.value = pointsText(source.points || []);

  const note = centre
    ? (hasOverride ? `Centre : ${centre} (surchargé)` : `Centre : ${centre} (hérite du global)`)
    : "Protocole global";
  const effSeances = (protoEffective.expectedSeances === null || protoEffective.expectedSeances === undefined) ? "—" : String(protoEffective.expectedSeances);
  const effPoints = (protoEffective.points && protoEffective.points.length) ? protoEffective.points.map(n => pointValue(protoEffective.mode, n)).join(", ") : "—";

  previewEl.innerHTML = `
    <div class="proto-block">
      <h3>${esc(note)}</h3>
      <div class="dash-coverage">
        <div class="kpi">
          <div class="label">Séances attendues</div>
          <div class="value">${esc(effSeances)}</div>
          <div class="sub">${centre ? (hasOverride ? "Valeur centre" : "Hérité du global") : "Global"}</div>
        </div>
        <div class="kpi">
          <div class="label">Points attendus</div>
          <div class="value">${esc(protoEffective.points?.length ? String(protoEffective.points.length) : "—")}</div>
          <div class="sub">${esc(effPoints)}</div>
        </div>
      </div>
    </div>
  `;
}

function saveProtocoleFromForm(){
  const sel = qs("#selCentreProtocole");
  const expectedEl = qs("#proto_expected");
  const modeEl = qs("#proto_mode");
  const pointsEl = qs("#proto_points");
  const statusEl = qs("#protocoleStatus");
  if(!sel || !expectedEl || !modeEl || !pointsEl || !statusEl) return;

  const centre = centreKey(sel.value);
  const expectedRaw = expectedEl.value;
  const expectedNum = (expectedRaw === "" ? null : Number(expectedRaw));
  const expected = Number.isFinite(expectedNum) ? Math.max(0, Math.round(expectedNum)) : null;

  const mode = (modeEl.value === "semaine" || modeEl.value === "seance") ? modeEl.value : "seance";
  const pts = parsePointsText(pointsEl.value);

  const payload = {expectedSeances: expected, mode, points: pts};

  if(!state.protocol) state.protocol = normalizeProtocol(null);
  if(centre){
    state.protocol.byCentre[centre] = payload;
    setStatus("#protocoleStatus", `✅ Protocole enregistré pour le centre : ${centre}.`);
  }else{
    state.protocol.global = payload;
    setStatus("#protocoleStatus", "✅ Protocole global enregistré.");
  }
  saveState();
  renderProtocole();
  renderDashboard();
  refreshSuiviProtocolPoints(qs("#selPatientSuivi")?.value || currentPatientId);
}

function resetProtocoleSelection(){
  const sel = qs("#selCentreProtocole");
  if(!sel) return;
  const centre = centreKey(sel.value);

  if(!state.protocol) state.protocol = normalizeProtocol(null);

  if(centre){
    delete state.protocol.byCentre[centre];
    setStatus("#protocoleStatus", `✅ Surcharge supprimée (centre : ${centre}).`);
  }else{
    state.protocol.global = {expectedSeances:null, mode:"seance", points:[]};
    setStatus("#protocoleStatus", "✅ Protocole global réinitialisé.");
  }
  saveState();
  renderProtocole();
  renderDashboard();
  refreshSuiviProtocolPoints(qs("#selPatientSuivi")?.value || currentPatientId);
}

function refreshSuiviProtocolPoints(patientId, currentValue){
  const sel = qs("#f_point_proto");
  const manual = qs("#f_point_proto_custom");
  if(!sel || !manual) return;

  if(!patientId){
    sel.innerHTML = `<option value="">—</option>`;
    sel.value = "";
    sel.disabled = true;
    manual.value = "";
    manual.disabled = true;
    return;
  }

  const proto = getProtocolForPatient(patientId);
  const points = (proto.points || []).map(n => pointValue(proto.mode, n));

  const existing = String(currentValue || sel.value || "").trim();
  const existingNorm = existing ? normalizePointInput(existing, proto.mode) : "";

  const hasPoints = points.length > 0;
  sel.disabled = !hasPoints;
  manual.disabled = true;

  // Build options
  let opts = `<option value="">—</option>`;
  if(hasPoints){
    opts += points.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    if(existingNorm && !points.includes(existingNorm)){
      opts += `<option value="${esc(existingNorm)}">${esc(existingNorm)} (hors protocole)</option>`;
    }
    opts += `<option value="__manual__">manuel…</option>`;
  }
  sel.innerHTML = opts;

  // Restore current
  if(existingNorm && hasPoints){
    if(points.includes(existingNorm)) sel.value = existingNorm;
    else sel.value = existingNorm;
  }else{
    sel.value = "";
  }

  // Manual toggle
  if(sel.value === "__manual__"){
    manual.disabled = false;
    manual.value = existingNorm || "";
  }else{
    manual.disabled = true;
    manual.value = "";
  }
}

function handleSuiviPointChange(){
  const pid = qs("#selPatientSuivi")?.value || currentPatientId;
  const proto = getProtocolForPatient(pid);
  const sel = qs("#f_point_proto");
  const manual = qs("#f_point_proto_custom");
  if(!sel || !manual) return;
  if(sel.value === "__manual__"){
    manual.disabled = false;
    manual.focus();
    return;
  }
  manual.disabled = true;
  manual.value = "";
}

function prefillSuiviFromDashboard(patientId, point){
  if(!patientId) return;
  setCurrentPatient(patientId);
  setView("suivi");
  // Reset form, puis pré-remplissage
  resetSuiviForm(patientId);
  refreshSuiviProtocolPoints(patientId, point);

  const sel = qs("#f_point_proto");
  const manual = qs("#f_point_proto_custom");
  const proto = getProtocolForPatient(patientId);
  const val = normalizePointInput(point, proto.mode);

  if(val && sel && !sel.disabled){
    // If val exists in options, use it. Otherwise, switch to manual.
    const has = Array.from(sel.options).some(o => o.value === val);
    if(has){
      sel.value = val;
    }else{
      sel.value = "__manual__";
      manual.disabled = false;
      manual.value = val;
    }
    handleSuiviPointChange();
  }

  // focus date
  setTimeout(() => {
    const d = qs("#f_date");
    if(d){ d.focus(); }
    setStatus("#suiviFormStatus", val ? `🧩 Pré-rempli : point ${val}. Renseigne la date puis valide.` : `🧩 Pré-rempli : patient ${patientId}. Renseigne la date puis valide.`);
  }, 60);
}

function prefillSeanceFromDashboard(patientId){
  if(!patientId) return;
  setCurrentPatient(patientId);
  setView("seances");
  resetSeanceForm(patientId);

  setTimeout(() => {
    const d = qs("#s_date");
    if(d){ d.focus(); }
    setStatus("#seanceFormStatus", `🧩 Pré-rempli : patient ${patientId}. Renseigne la date puis valide.`);
  }, 60);
}


function prefillEiFromDashboard(patientId){
  if(!patientId) return;
  setCurrentPatient(patientId);
  setView("ei");
  resetEiForm(patientId);

  setTimeout(() => {
    const d = qs("#e_date");
    if(d){ d.focus(); }
    setStatus("#eiFormStatus", `🧩 Pré-rempli : patient ${patientId}. Renseigne la date puis valide.`);
  }, 60);
}

function renderDashboard(){
    const identityEl = qs("#dashIdentity");
    const completenessEl = qs("#dashCompleteness");
    const evolutionEl = qs("#dashEvolution");
    const alertsEl = qs("#dashAlerts");
    const protoEl = qs("#dashProtocol");
    const sel = qs("#selPatientDashboard");
    if(!identityEl || !completenessEl || !evolutionEl || !alertsEl || !sel) return;

    if(!state.patients.length){
      sel.innerHTML = `<option value="">— aucun patient —</option>`;
      identityEl.innerHTML = `<div class="hint">Ajoute un patient pour afficher son tableau de bord.</div>`;
      completenessEl.innerHTML = `<div class="hint">—</div>`;
      evolutionEl.innerHTML = `<div class="hint">—</div>`;
      alertsEl.innerHTML = `<div class="hint">—</div>`;
      if(protoEl) protoEl.innerHTML = `<div class="hint">—</div>`;
      return;
    }

    const pid = sel.value || currentPatientId || state.patients[0].patient_id;
    if(pid) sel.value = pid;
    const p = getPatient(pid);
    if(!p){
      identityEl.innerHTML = `<div class="hint">Patient introuvable.</div>`;
      completenessEl.innerHTML = `<div class="hint">—</div>`;
      evolutionEl.innerHTML = `<div class="hint">—</div>`;
      alertsEl.innerHTML = `<div class="hint">—</div>`;
      if(protoEl) protoEl.innerHTML = `<div class="hint">—</div>`;
      return;
    }

    const seances = getSeancesForPatient(pid);
    const suivi = getSuiviForPatient(pid);
    const eis = getEIForPatient(pid);

    // Identité minimale + contexte
    identityEl.innerHTML = `
      <div class="line">
        <span class="pill"><span class="mono">${esc(p.patient_id)}</span></span>
        <span class="pill">Initiales : <span class="mono">${esc(p.initiales || "—")}</span></span>
        <span class="pill">Indication : <span class="mono">${esc(labelIndication(p.indication))}</span></span>
        <span class="pill">Centre : <span class="mono">${esc(p.centre || "—")}</span></span>
      </div>
      <div class="line">
        <span class="pill">Inclusion : <span class="mono">${esc(p.date_inclusion || "—")}</span></span>
        <span class="pill">Consentement : <span class="mono">${esc(p.consentement || "—")}</span></span>
        <span class="pill">Séances : <span class="mono">${seances.length}</span></span>
        <span class="pill">Suivis : <span class="mono">${suivi.length}</span></span>
        <span class="pill">EI : <span class="mono">${eis.length}</span></span>
      </div>
    `;

    // Complétude
    const miss = patientRequiredMissing(p);
    const inclTotal = 8;
    const inclOk = inclTotal - miss.length;
    const inclPct = pct(inclOk, inclTotal);

    const sComp = recordCompleteness(seances, ["date","numero"]);
    const fComp = recordCompleteness(suivi, ["date","temps"]);
    const eComp = recordCompleteness(eis, ["date","severite","lien_rtms","description"]);

    const blocks = [
      {
        label: "Inclusion (champs obligatoires)",
        value: `${inclPct}%`,
        sub: miss.length ? `Manquants : ${miss.join(", ")}` : `${inclOk}/${inclTotal} champs OK`,
        progress: inclPct
      },
      {
        label: "Séances (champs obligatoires)",
        value: seances.length ? `${pct(sComp.complete, sComp.total)}%` : "—",
        sub: seances.length ? `${sComp.complete}/${sComp.total} séances complètes` : "Aucune séance enregistrée",
        progress: seances.length ? pct(sComp.complete, sComp.total) : 0
      },
      {
        label: "Suivi (champs obligatoires)",
        value: suivi.length ? `${pct(fComp.complete, fComp.total)}%` : "—",
        sub: suivi.length ? `${fComp.complete}/${fComp.total} suivis complets` : "Aucun suivi enregistré",
        progress: suivi.length ? pct(fComp.complete, fComp.total) : 0
      },
      {
        label: "EI (champs obligatoires)",
        value: eis.length ? `${pct(eComp.complete, eComp.total)}%` : "—",
        sub: eis.length ? `${eComp.complete}/${eComp.total} EI complets` : "Aucun EI enregistré",
        progress: eis.length ? pct(eComp.complete, eComp.total) : 0
      }
    ];

    completenessEl.innerHTML = blocks.map(b => `
      <div class="dash-kpi">
        <div class="label">${esc(b.label)}</div>
        <div class="value">${esc(b.value)}</div>
        <div class="progress" aria-hidden="true"><div style="width:${b.progress}%"></div></div>
        <div class="sub">${esc(b.sub)}</div>
      </div>
    `).join("");

    // Évolution (résumé)
    const lastSuivi = suivi.length ? suivi[suivi.length-1] : null;
    const lastSeance = seances.length ? seances[seances.length-1] : null;

    function fmtNum(v){
      return (v === null || v === undefined || v === "") ? "—" : String(v);
    }
    function fmtDelta(base, last){
      if(base === null || base === undefined || last === null || last === undefined) return "—";
      const d = Number(last) - Number(base);
      if(isNaN(d)) return "—";
      return (d >= 0 ? "+" : "") + String(d);
    }

    const rows = [
      {label:"Douleur (NRS)", base:p.douleur_base, last:lastSuivi?.douleur, delta:fmtDelta(p.douleur_base, lastSuivi?.douleur)},
      {label:"Fatigue (NRS)", base:p.fatigue_base, last:lastSuivi?.fatigue, delta:fmtDelta(p.fatigue_base, lastSuivi?.fatigue)},
      {label:"Sommeil (0 mauvais → 10 excellent)", base:p.sommeil_base, last:lastSuivi?.sommeil, delta:fmtDelta(p.sommeil_base, lastSuivi?.sommeil)},
      {label:"Humeur (0 mauvaise → 10 excellente)", base:p.humeur_base, last:lastSuivi?.humeur, delta:fmtDelta(p.humeur_base, lastSuivi?.humeur)}
    ];

    evolutionEl.innerHTML = `
      <table class="dash-table" aria-label="Résumé évolution">
        <thead><tr><th>Mesure</th><th>Base</th><th>Dernier suivi</th><th>Δ</th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${esc(r.label)}</td>
              <td>${esc(fmtNum(r.base))}</td>
              <td>${esc(fmtNum(r.last))}</td>
              <td class="delta">${esc(r.delta)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="muted" style="margin-top:10px;">
        Dernière séance : ${esc(lastSeance?.date || "—")} • Dernier suivi : ${esc(lastSuivi?.date || "—")} ${lastSuivi?.temps ? `(${esc(labelTemps(lastSuivi.temps))})` : ""}
      </div>
    `;

   // Qualité patient actif : alertes ciblées (champs manquants + incohérences)
    const qMissing = [];
    const qIncoh = [];
    const qInfo = [];

    const labelFor = (table, field) => {
      const d = DATA_DICTIONARY.find(x => x.table === table && x.field === field);
      return d ? d.label : field;
    };

    if(miss.length){
      qMissing.push({
        sev: "critique",
        title: "Champs obligatoires manquants (inclusion)",
        sub: miss.map(f => labelFor("patients", f)).join(" • ")
      });
    }

    // Cohérence : consentement
    if(p.consentement === "non"){
      const has = seances.length || suivi.length || eis.length;
      if(has){
        qIncoh.push({
          sev: "à vérifier",
          title: "Consentement = non",
          sub: "Données présentes malgré consentement = non (séances/suivi/EI). Vérifier la procédure locale."
        });
      }
    }

    // Cohérence : dates vs inclusion (si date d’inclusion connue)
    if(p.date_inclusion){
      for(const s of seances){
        if(s.date && s.date < p.date_inclusion){
          qIncoh.push({sev:"à vérifier", title:"Séance avant inclusion", sub:`Séance ${s.seance_id} : ${s.date} < ${p.date_inclusion}`});
        }
      }
      for(const f of suivi){
        if(f.date && f.date < p.date_inclusion){
          qIncoh.push({sev:"à vérifier", title:"Suivi avant inclusion", sub:`Suivi ${f.suivi_id} : ${f.date} < ${p.date_inclusion}`});
        }
      }
      for(const e of eis){
        if(e.date && e.date < p.date_inclusion){
          qIncoh.push({sev:"à vérifier", title:"EI avant inclusion", sub:`EI ${e.ei_id} : ${e.date} < ${p.date_inclusion}`});
        }
      }
    }else{
      // utile en terrain : si des données existent mais la date d’inclusion manque, la cohérence temporelle est impossible à vérifier
      const has = (seances.length || suivi.length || eis.length);
      if(has){
        qIncoh.push({
          sev: "à vérifier",
          title: "Date d’inclusion manquante",
          sub: "Des données existent (séances/suivi/EI) mais la date d’inclusion est absente : cohérence temporelle non vérifiable."
        });
      }
    }

    // Cohérence : numéros de séance dupliqués
    const seen = new Map();
    for(const s of seances){
      const n = s.numero;
      if(n === null || n === undefined || n === "") continue;
      if(seen.has(n)){
        qIncoh.push({sev:"à vérifier", title:"Numéro de séance dupliqué", sub:`Numéro ${n} dupliqué (${seen.get(n)} et ${s.seance_id}).`});
      }else{
        seen.set(n, s.seance_id);
      }
    }

    // Cohérence : EI résolution
    for(const e of eis){
      if(e.date && e.date_resolution && e.date_resolution < e.date){
        qIncoh.push({sev:"à vérifier", title:"Résolution EI avant la date", sub:`EI ${e.ei_id} : résolution ${e.date_resolution} < EI ${e.date}`});
      }
    }

    // Intégrité : enregistrements incomplets (souvent après import)
    if(sComp.incomplete.length){
      qIncoh.push({sev:"critique", title:"Séances incomplètes", sub:`${sComp.incomplete.length} séance(s) avec champs obligatoires manquants (date/numéro).`});
    }
    if(fComp.incomplete.length){
      qIncoh.push({sev:"critique", title:"Suivis incomplets", sub:`${fComp.incomplete.length} suivi(s) avec champs obligatoires manquants (date/temps).`});
    }
    if(eComp.incomplete.length){
      qIncoh.push({sev:"critique", title:"EI incomplets", sub:`${eComp.incomplete.length} EI avec champs obligatoires manquants (date/sévérité/lien/description).`});
    }

    // Couverture (informatif)
    if(seances.length === 0) qInfo.push({sev:"info", title:"Couverture", sub:"Aucune séance enregistrée pour l’instant."});
    if(suivi.length === 0) qInfo.push({sev:"info", title:"Couverture", sub:"Aucun suivi enregistré pour l’instant."});


// Protocole : couverture + timeline (si définie)
if(protoEl){
  const proto = getProtocolForCentre(p.centre);
  const expectedSeances = (proto.expectedSeances === null || proto.expectedSeances === undefined) ? null : proto.expectedSeances;
  const expectedPoints = (proto.points || []).map(n => pointValue(proto.mode, n));

  const observedPoints = Array.from(new Set(
    suivi.map(f => normalizePointInput(f.point_protocole, proto.mode)).filter(Boolean)
  ));

  const expectedSet = new Set(expectedPoints);
  const observedSet = new Set(observedPoints);

  const realizedPoints = expectedPoints.filter(v => observedSet.has(v));
  const missingPoints = expectedPoints.filter(v => !observedSet.has(v));
  const offList = observedPoints.filter(v => !expectedSet.has(v));

  const seanceCoverage = (expectedSeances !== null && expectedSeances > 0)
    ? `${seances.length}/${expectedSeances} (${pct(seances.length, expectedSeances)}%)`
    : `${seances.length}/—`;

  const pointsCoverage = expectedPoints.length
    ? `${realizedPoints.length}/${expectedPoints.length} (${pct(realizedPoints.length, expectedPoints.length)}%)`
    : `${observedPoints.length}/—`;

  const protoInfo = (expectedSeances !== null || expectedPoints.length)
    ? ""
    : `<div class="hint">Aucun protocole défini (global/centre). Onglet “Protocole” pour paramétrer.</div>`;

  const timeline = expectedPoints.length ? `
    <div class="proto-block">
      <h3>Timeline points</h3>
      <div class="proto-timeline" aria-label="Timeline protocole">
        ${expectedPoints.map(v => observedSet.has(v)
          ? `<span class="proto-chip ok">${esc(v)} <small>réalisé</small></span>`
          : `<button class="proto-chip missing" data-action="prefill" data-point="${esc(v)}" type="button">${esc(v)} <small>manquant</small></button>`
        ).join("")}
      </div>
      ${missingPoints.length ? `<ul><li>${missingPoints.length} point(s) manquant(s) : ${missingPoints.map(esc).join(", ")}</li></ul>` : `<div class="muted" style="margin-top:8px;">Tous les points attendus sont présents.</div>`}
    </div>
  ` : "";

  const off = offList.length ? `
    <div class="proto-block">
      <h3>Hors-liste</h3>
      <div class="proto-timeline" aria-label="Points hors-liste">
        ${offList.map(v => `<span class="proto-chip off">${esc(v)} <small>hors-liste</small></span>`).join("")}
      </div>
    </div>
  ` : "";

  protoEl.innerHTML = `
    <div class="dash-coverage">
      <div class="kpi">
        <div class="label">Couverture séances</div>
        <div class="value">${esc(seanceCoverage)}</div>
        <div class="sub">Réalisé / attendu (si défini).</div>
      </div>
      <div class="kpi">
        <div class="label">Couverture points</div>
        <div class="value">${esc(pointsCoverage)}</div>
        <div class="sub">Points protocole (suivi).</div>
      </div>
    </div>
    ${protoInfo}
    ${timeline}
    ${off}
  `;

  protoEl.onclick = (ev) => {
    const btn = ev.target.closest("button[data-action='prefill']");
    if(!btn) return;
    const point = btn.dataset.point || "";
    prefillSuiviFromDashboard(pid, point);
  };
}

    const sevBadge = (sev) => {
      if(sev === "critique") return `<span class="sev" style="border-color: rgba(251,113,133,.35); background: rgba(251,113,133,.12);">CRITIQUE</span>`;
      if(sev === "à vérifier") return `<span class="sev" style="border-color: rgba(251,191,36,.35); background: rgba(251,191,36,.12);">À VÉRIFIER</span>`;
      return `<span class="sev">INFO</span>`;
    };

    const renderCards = (arr) => arr.map(a => `
      <div class="alert">
        <div class="atitle">
          <span>${esc(a.title)}</span>
          ${sevBadge(a.sev)}
        </div>
        <div class="asub">${esc(a.sub)}</div>
      </div>
    `).join("");

    const missingCount = miss.length;
    const incohCount = qIncoh.length;
    const infoCount = qInfo.length;

    const summary = `
      <div class="dash-quality-summary" aria-label="Résumé qualité patient">
        <span class="pill">Champs manquants : <span class="mono">${missingCount}</span></span>
        <span class="pill">Incohérences : <span class="mono">${incohCount}</span></span>
        <span class="pill">Infos : <span class="mono">${infoCount}</span></span>
      </div>
    `;

    const section = (title, body) => `
      <div class="qsec">
        <h3 class="subhead">${esc(title)}</h3>
        ${body}
      </div>
    `;

    const missingBody = qMissing.length ? renderCards(qMissing) : `<div class="hint">OK.</div>`;
    const incohBody = qIncoh.length ? renderCards(qIncoh) : `<div class="hint">OK.</div>`;
    const infoBody = qInfo.length ? renderCards(qInfo) : `<div class="hint">—</div>`;

    alertsEl.innerHTML = summary
      + section("Champs manquants", missingBody)
      + section("Incohérences", incohBody)
      + section("Infos", infoBody);
  }

  // --------- Qualité ----------
  function renderQualityEmpty(){
    qs("#qualitySummary").innerHTML = `
      <div class="qbox"><div class="label">Patients</div><div class="kpi">—</div></div>
      <div class="qbox"><div class="label">Séances</div><div class="kpi">—</div></div>
      <div class="qbox"><div class="label">Alertes</div><div class="kpi">—</div></div>
    `;
    qs("#qualityDetails").innerHTML = `<div class="hint">Clique “Analyser”.</div>`;
  }

  function runQuality(){
    const rules = [];

    // Rule: patients required fields
    const missingPatients = [];
    for(const p of state.patients){
      const m = [];
      if(!p.initiales) m.push("initiales");
      if(!p.annee_naissance) m.push("annee_naissance");
      if(!p.sexe) m.push("sexe");
      if(!p.date_inclusion) m.push("date_inclusion");
      if(!p.indication) m.push("indication");
      if(!p.centre) m.push("centre");
      if(!p.consentement) m.push("consentement");
      if(p.douleur_base === null || p.douleur_base === undefined || p.douleur_base === "") m.push("douleur_base");
      if(m.length) missingPatients.push({id:p.patient_id, initiales:p.initiales, missing:m});
    }
    rules.push({
      title: "Champs obligatoires (patients)",
      severity: missingPatients.length ? "bad" : "ok",
      count: missingPatients.length,
      description: "Détecte les trous sur les champs minimaux d’inclusion.",
      details: missingPatients.map(x => `Patient ${x.id} (${x.initiales || "—"}) : ${x.missing.join(", ")}`)
    });

    // Rule: séances before inclusion or duplicate number
    const seanceIssues = [];
    for(const s of state.seances){
      const p = getPatient(s.patient_id);
      if(p && p.date_inclusion && s.date && s.date < p.date_inclusion){
        seanceIssues.push(`Séance ${s.seance_id} (${s.patient_id}) : date ${s.date} < inclusion ${p.date_inclusion}`);
      }
    }
    // duplicate session numbers per patient
    const byPatient = new Map();
    for(const s of state.seances){
      const key = s.patient_id || "";
      if(!byPatient.has(key)) byPatient.set(key, []);
      byPatient.get(key).push(s);
    }
    for(const [pid, arr] of byPatient.entries()){
      const seen = new Map();
      for(const s of arr){
        const n = s.numero;
        if(n === null || n === undefined) continue;
        if(seen.has(n)){
          seanceIssues.push(`Patient ${pid} : numéro séance ${n} dupliqué (${seen.get(n)} et ${s.seance_id})`);
        }else{
          seen.set(n, s.seance_id);
        }
      }
    }
    rules.push({
      title: "Cohérence (séances)",
      severity: seanceIssues.length ? "warn" : "ok",
      count: seanceIssues.length,
      description: "Vérifie les dates vs inclusion et les numéros uniques.",
      details: seanceIssues
    });

    // Rule: suivi before inclusion
    const suiviIssues = [];
    for(const f of state.suivi){
      const p = getPatient(f.patient_id);
      if(p && p.date_inclusion && f.date && f.date < p.date_inclusion){
        suiviIssues.push(`Suivi ${f.suivi_id} (${f.patient_id}) : date ${f.date} < inclusion ${p.date_inclusion}`);
      }
    }
    rules.push({
      title: "Cohérence (suivi)",
      severity: suiviIssues.length ? "warn" : "ok",
      count: suiviIssues.length,
      description: "Vérifie les dates de suivi vs inclusion.",
      details: suiviIssues
    });

    // Rule: EI before inclusion or resolution before EI
    const eiIssues = [];
    for(const e of state.ei){
      const p = getPatient(e.patient_id);
      if(p && p.date_inclusion && e.date && e.date < p.date_inclusion){
        eiIssues.push(`EI ${e.ei_id} (${e.patient_id}) : date ${e.date} < inclusion ${p.date_inclusion}`);
      }
      if(e.date && e.date_resolution && e.date_resolution < e.date){
        eiIssues.push(`EI ${e.ei_id} (${e.patient_id}) : résolution ${e.date_resolution} < EI ${e.date}`);
      }
    }
    rules.push({
      title: "Cohérence (événements indésirables)",
      severity: eiIssues.length ? "warn" : "ok",
      count: eiIssues.length,
      description: "Vérifie les dates EI vs inclusion et résolution.",
      details: eiIssues
    });

    // Rule: consentement = non but has data
    const consentIssues = [];
    for(const p of state.patients){
      if(p.consentement === "non"){
        const has = state.seances.some(s => s.patient_id === p.patient_id) ||
                    state.suivi.some(f => f.patient_id === p.patient_id) ||
                    state.ei.some(e => e.patient_id === p.patient_id);
        if(has){
          consentIssues.push(`Patient ${p.patient_id} : consentement = non, mais données présentes (séances/suivi/EI).`);
        }
      }
    }
    rules.push({
      title: "Traçabilité (consentement)",
      severity: consentIssues.length ? "warn" : "ok",
      count: consentIssues.length,
      description: "Alerte si consentement = non mais des enregistrements existent.",
      details: consentIssues
    });

    return rules;
  }

  function renderQuality(rules){
    const totalPatients = state.patients.length;
    const totalSeances = state.seances.length;
    const totalAlerts = rules.reduce((acc,r) => acc + (r.count || 0), 0);

    const kpiClass = (n) => n === 0 ? "ok" : (n < 3 ? "warn" : "bad");

    qs("#qualitySummary").innerHTML = `
      <div class="qbox">
        <div class="label">Patients</div>
        <div class="kpi ${kpiClass(totalPatients === 0 ? 0 : 0)}">${totalPatients}</div>
        <div class="label">inclus</div>
      </div>
      <div class="qbox">
        <div class="label">Séances</div>
        <div class="kpi ${kpiClass(totalSeances === 0 ? 0 : 0)}">${totalSeances}</div>
        <div class="label">enregistrées</div>
      </div>
      <div class="qbox">
        <div class="label">Alertes</div>
        <div class="kpi ${kpiClass(totalAlerts)}">${totalAlerts}</div>
        <div class="label">à vérifier</div>
      </div>
    `;

    const container = qs("#qualityDetails");
    container.innerHTML = "";
    if(!rules.length){
      container.innerHTML = `<div class="hint">Aucune règle.</div>`;
      return;
    }
    for(const r of rules){
      const sevLabel = r.severity === "ok" ? "OK" : (r.severity === "warn" ? "À vérifier" : "Critique");
      const div = document.createElement("div");
      div.className = "rule";
      div.innerHTML = `
        <div class="rtitle">
          <span>${esc(r.title)}</span>
          <span class="badge">${sevLabel} • ${r.count}</span>
        </div>
        <div class="rsub">${esc(r.description || "")}</div>
        ${r.details && r.details.length ? `<ul>${r.details.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : `<div class="rsub">Aucun point.</div>`}
      `;
      container.appendChild(div);
    }
  }

  // --------- Export CSV ----------
  function numOrNull(v){
    if(v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  }

  function csvEscape(v){
    if(v === null || v === undefined) return "";
    const s = String(v);
    if(/[",\n;]/.test(s)){
      return '"' + s.replace(/"/g,'""') + '"';
    }
    return s;
  }

  function toCSV(rows, fields, delimiter=";"){
    const header = fields.join(delimiter);
    const lines = rows.map(r => fields.map(f => csvEscape(r[f])).join(delimiter));
    return [header, ...lines].join("\n");
  }

  function exportCSV(tableName){
    const map = {
      patients: {rows: state.patients, idField:"patient_id"},
      seances: {rows: state.seances, idField:"seance_id"},
      suivi: {rows: state.suivi, idField:"suivi_id"},
      evenements_indesirables: {rows: state.ei, idField:"ei_id"},
    };
    const cfg = map[tableName];
    if(!cfg) return;

    const fields = DATA_DICTIONARY.filter(d => d.table === tableName).map(d => d.field);
    const csv = toCSV(cfg.rows, fields, ";");
    downloadText(`${tableName}.csv`, csv, "text/csv;charset=utf-8");
  }

  // Raccourci patient : export du « dossier du patient sélectionné » (CSV filtrés + dictionnaire)
  function safeFilePart(s){
    return String(s || "").replace(/[^a-zA-Z0-9_-]/g, "-");
  }

  function exportPatientDossier(patientId){
    const p = getPatient(patientId);
    if(!p){
      alert("Patient introuvable.");
      return;
    }

    const dateStr = new Date().toISOString().slice(0,10);
    const pidSafe = safeFilePart(p.patient_id);
    const prefix = `patient_${pidSafe}_${dateStr}_`;

    const exportOne = (tableName, rows) => {
      const fields = DATA_DICTIONARY.filter(d => d.table === tableName).map(d => d.field);
      const csv = toCSV(rows, fields, ";");
      downloadText(`${prefix}${tableName}.csv`, csv, "text/csv;charset=utf-8");
    };

    // Patients : 1 ligne (patient actif)
    exportOne("patients", [p]);

    // Tables liées
    exportOne("seances", getSeancesForPatient(patientId));
    exportOne("suivi", getSuiviForPatient(patientId));
    exportOne("evenements_indesirables", getEIForPatient(patientId));

    // Dictionnaire : inchangé
    downloadText("dictionnaire_donnees_v1.csv", dictToCSV(), "text/csv;charset=utf-8");
  }

  // Raccourci patient : export du « dossier patient » en 1 seul ZIP (CSV filtrés + dictionnaire)
  // Objectif : solution légère, sans dépendance.
  const CRC32_TABLE = (() => {
    const tbl = new Uint32Array(256);
    for(let i=0;i<256;i++){
      let c = i;
      for(let k=0;k<8;k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      tbl[i] = c >>> 0;
    }
    return tbl;
  })();

  function crc32(bytes){
    let c = 0xFFFFFFFF;
    for(let i=0;i<bytes.length;i++){
      c = CRC32_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function msDosTimeDate(d){
    const dt = d instanceof Date ? d : new Date();
    const year = Math.max(1980, dt.getFullYear());
    const month = dt.getMonth() + 1;
    const day = dt.getDate();
    const hours = dt.getHours();
    const minutes = dt.getMinutes();
    const seconds = Math.floor(dt.getSeconds() / 2);
    const time = ((hours & 31) << 11) | ((minutes & 63) << 5) | (seconds & 31);
    const date = (((year - 1980) & 127) << 9) | ((month & 15) << 5) | (day & 31);
    return {time, date};
  }

  function concatU8(chunks){
    const total = chunks.reduce((n, c) => n + c.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for(const c of chunks){ out.set(c, off); off += c.length; }
    return out;
  }

  function buildZip(files){
    // ZIP "store" (sans compression) : compatible et léger.
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    for(const f of files){
      const nameBytes = encoder.encode(f.name);
      const dataBytes = (f.data instanceof Uint8Array) ? f.data : new Uint8Array(f.data);
      const crc = crc32(dataBytes);
      const size = dataBytes.length;
      const {time, date} = msDosTimeDate(f.mtime || new Date());

      // Local file header (30 bytes)
      const lh = new ArrayBuffer(30);
      const dv = new DataView(lh);
      dv.setUint32(0, 0x04034b50, true);
      dv.setUint16(4, 20, true); // version needed
      dv.setUint16(6, 0, true);  // flags
      dv.setUint16(8, 0, true);  // compression = store
      dv.setUint16(10, time, true);
      dv.setUint16(12, date, true);
      dv.setUint32(14, crc, true);
      dv.setUint32(18, size, true);
      dv.setUint32(22, size, true);
      dv.setUint16(26, nameBytes.length, true);
      dv.setUint16(28, 0, true); // extra length

      localParts.push(new Uint8Array(lh), nameBytes, dataBytes);

      // Central directory header (46 bytes)
      const ch = new ArrayBuffer(46);
      const cv = new DataView(ch);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true); // version made by
      cv.setUint16(6, 20, true); // version needed
      cv.setUint16(8, 0, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, time, true);
      cv.setUint16(14, date, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, size, true);
      cv.setUint32(24, size, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true); // extra
      cv.setUint16(32, 0, true); // comment
      cv.setUint16(34, 0, true); // disk start
      cv.setUint16(36, 0, true); // internal attrs
      cv.setUint32(38, 0, true); // external attrs
      cv.setUint32(42, offset, true); // relative offset

      centralParts.push(new Uint8Array(ch), nameBytes);

      offset += 30 + nameBytes.length + size;
    }

    const centralStart = offset;
    const centralData = concatU8(centralParts);
    offset += centralData.length;

    // End of central directory record (22 bytes)
    const eocd = new ArrayBuffer(22);
    const ev = new DataView(eocd);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true); // disk
    ev.setUint16(6, 0, true); // disk with central dir
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, centralData.length, true);
    ev.setUint32(16, centralStart, true);
    ev.setUint16(20, 0, true); // comment length

    return concatU8([...localParts, centralData, new Uint8Array(eocd)]);
  }

  function exportPatientDossierZip(patientId){
    const p = getPatient(patientId);
    if(!p){
      alert("Patient introuvable.");
      return;
    }

    const dateStr = new Date().toISOString().slice(0,10);
    const pidSafe = safeFilePart(p.patient_id);
    const prefix = `patient_${pidSafe}_${dateStr}_`;

    const encoder = new TextEncoder();

    const mkCsvBytes = (tableName, rows) => {
      const fields = DATA_DICTIONARY.filter(d => d.table === tableName).map(d => d.field);
      const csv = toCSV(rows, fields, ";");
      return encoder.encode(csv);
    };

    const files = [
      {name: `${prefix}patients.csv`, data: mkCsvBytes("patients", [p])},
      {name: `${prefix}seances.csv`, data: mkCsvBytes("seances", getSeancesForPatient(patientId))},
      {name: `${prefix}suivi.csv`, data: mkCsvBytes("suivi", getSuiviForPatient(patientId))},
      {name: `${prefix}ei.csv`, data: mkCsvBytes("evenements_indesirables", getEIForPatient(patientId))},
      {name: "dictionnaire_donnees_v1.csv", data: encoder.encode(dictToCSV())}
    ];

    const zipBytes = buildZip(files);
    const zipName = `patient_${pidSafe}_${dateStr}_dossier.zip`;
    downloadBlob(zipName, new Blob([zipBytes], {type:"application/zip"}));
  }

  // Raccourci global : 1 clic pour tout exporter (CSV + dictionnaire)
  function exportAllRegistry(){
    // Remarque : selon le navigateur, l’utilisateur peut devoir autoriser les téléchargements multiples.
    exportCSV("patients");
    exportCSV("seances");
    exportCSV("suivi");
    exportCSV("evenements_indesirables");
    downloadText("dictionnaire_donnees_v1.csv", dictToCSV(), "text/csv;charset=utf-8");
    setStatus("#exportAllStatus", "✅ Export lancé (patients / séances / suivi / EI + dictionnaire).");
  }

  // --------- Synthèse clinique (impression PDF) ----------
  function openClinicalSummary(patientId){
    const p = getPatient(patientId);
    if(!p){
      alert("Choisis un patient.");
      return;
    }

    const seances = getSeancesForPatient(patientId);
    const suivi = getSuiviForPatient(patientId);
    const eis = getEIForPatient(patientId);

    const win = window.open("", "_blank");
    if(!win){
      alert("Fenêtre bloquée. Autorise les popups pour générer la synthèse.");
      return;
    }

    const style = `
      <style>
        body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin:24px; color:#111}
        h1{margin:0 0 6px;font-size:20px}
        .meta{color:#444;font-size:12px;margin-bottom:16px}
        .box{border:1px solid #ddd;border-radius:12px;padding:12px 12px;margin:12px 0}
        h2{margin:0 0 10px;font-size:14px}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th,td{border-bottom:1px solid #eee;padding:8px 6px;text-align:left;vertical-align:top}
        .muted{color:#555}
        .row{display:grid;grid-template-columns:1fr 1fr; gap:12px}
        .pill{display:inline-block;padding:3px 8px;border-radius:999px;background:#eef6ff;border:1px solid #d8ecff;font-size:12px}
        @media print{
          .noprint{display:none}
          body{margin:0}
        }
      </style>
    `;

    const html = `
      <!doctype html>
      <html lang="fr"><head><meta charset="utf-8" /><title>Synthèse clinique ${esc(p.patient_id)}</title>${style}</head>
      <body>
        <div class="noprint" style="margin-bottom:12px;">
          <button onclick="window.print()" style="padding:10px 12px;border-radius:10px;border:1px solid #ddd;background:#f7f7f7;cursor:pointer;font-weight:700;">
            Imprimer / enregistrer en PDF
          </button>
          <span style="margin-left:10px;color:#555;font-size:12px;">Astuce : “Destination” → “Enregistrer en PDF”.</span>
        </div>

        <h1>Synthèse clinique — registre rTMS douleur</h1>
        <div class="meta">
          Patient <span class="pill">${esc(p.patient_id)}</span> • ${esc(p.initiales)} • Centre : ${esc(p.centre || "—")} • Inclusion : ${esc(p.date_inclusion || "—")}
          <br/>Généré le ${new Date().toISOString().slice(0,10)} • Schéma v${SCHEMA_VERSION}
        </div>

        <div class="row">
          <div class="box">
            <h2>Inclusion</h2>
            <table>
              <tr><th>Indication</th><td>${esc(labelIndication(p.indication))}</td></tr>
              <tr><th>Année naissance</th><td>${esc(p.annee_naissance)}</td></tr>
              <tr><th>Sexe</th><td>${esc(p.sexe)}</td></tr>
              <tr><th>Consentement</th><td>${esc(p.consentement)}</td></tr>
              <tr><th>Douleur base</th><td>${esc(p.douleur_base)} / 10</td></tr>
              <tr><th>Fatigue base</th><td>${esc(p.fatigue_base ?? "—")} / 10</td></tr>
              <tr><th>Sommeil base</th><td>${esc(p.sommeil_base ?? "—")} / 10</td></tr>
              <tr><th>Humeur base</th><td>${esc(p.humeur_base ?? "—")} / 10</td></tr>
              <tr><th>Antalgiques</th><td class="muted">${esc(p.antalgiques || "—")}</td></tr>
              <tr><th>Notes</th><td class="muted">${esc(p.notes || "—")}</td></tr>
            </table>
          </div>

          <div class="box">
            <h2>Résumé</h2>
            <table>
              <tr><th>Séances</th><td>${seances.length}</td></tr>
              <tr><th>Suivis</th><td>${suivi.length}</td></tr>
              <tr><th>EI</th><td>${eis.length}</td></tr>
              <tr><th>Dernière séance</th><td>${esc(seances.length ? seances[seances.length-1].date : "—")}</td></tr>
              <tr><th>Dernier suivi</th><td>${esc(suivi.length ? suivi[suivi.length-1].date : "—")}</td></tr>
            </table>
            <div class="muted" style="margin-top:10px;font-size:12px;line-height:1.35;">
              Cette synthèse est une extraction “vie réelle”. L’interprétation clinique dépend du protocole du centre et du contexte patient.
            </div>
          </div>
        </div>

        <div class="box">
          <h2>Séances</h2>
          ${seances.length ? `
            <table>
              <thead><tr>
                <th>Date</th><th>N°</th><th>Cible</th><th>Lat.</th><th>Hz</th><th>%</th><th>Impulsions</th><th>Durée</th><th>Douleur (pré→post)</th><th>Tol.</th><th>Remarque</th>
              </tr></thead>
              <tbody>
                ${seances.map(s => `
                  <tr>
                    <td>${esc(s.date||"—")}</td>
                    <td>${esc(s.numero ?? "—")}</td>
                    <td>${esc(s.cible||"—")}</td>
                    <td>${esc(s.lateralite||"—")}</td>
                    <td>${esc(s.frequence_hz ?? "—")}</td>
                    <td>${esc(s.intensite_pct_mt ?? "—")}</td>
                    <td>${esc(s.pulses ?? "—")}</td>
                    <td>${esc(s.duree_min ?? "—")}</td>
                    <td>${esc(s.douleur_pre ?? "—")} → ${esc(s.douleur_post ?? "—")}</td>
                    <td>${esc(s.tolerance ?? "—")}</td>
                    <td class="muted">${esc(s.effets || "—")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `<div class="muted">Aucune séance enregistrée.</div>`}
        </div>

        <div class="box">
          <h2>Suivi</h2>
          ${suivi.length ? `
            <table>
              <thead><tr>
                <th>Date</th><th>Temps</th><th>Point protocole</th><th>Douleur</th><th>Fatigue</th><th>Sommeil</th><th>Humeur</th><th>PGIC</th><th>Antalgiques</th><th>Notes</th>
              </tr></thead>
              <tbody>
                ${suivi.map(f => `
                  <tr>
                    <td>${esc(f.date||"—")}</td>
                    <td>${esc(labelTemps(f.temps))}</td>
                    <td>${esc(f.douleur ?? "—")}</td>
                    <td>${esc(f.fatigue ?? "—")}</td>
                    <td>${esc(f.sommeil ?? "—")}</td>
                    <td>${esc(f.humeur ?? "—")}</td>
                    <td>${esc(f.pgic ?? "—")}</td>
                    <td class="muted">${esc(f.antalgiques || "—")}</td>
                    <td class="muted">${esc(f.notes || "—")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `<div class="muted">Aucun suivi enregistré.</div>`}
        </div>

        <div class="box">
          <h2>Événements indésirables</h2>
          ${eis.length ? `
            <table>
              <thead><tr>
                <th>Date</th><th>Sévérité</th><th>Lien rTMS</th><th>Description</th><th>Action</th><th>Issue</th><th>Résolution</th>
              </tr></thead>
              <tbody>
                ${eis.map(e => `
                  <tr>
                    <td>${esc(e.date||"—")}</td>
                    <td>${esc(labelSev(e.severite))}</td>
                    <td>${esc(e.lien_rtms||"—")}</td>
                    <td class="muted">${esc(e.description||"—")}</td>
                    <td class="muted">${esc(e.action||"—")}</td>
                    <td>${esc(e.issue||"—")}</td>
                    <td>${esc(e.date_resolution||"—")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `<div class="muted">Aucun EI enregistré.</div>`}
        </div>

        <div class="muted" style="font-size:11px;margin-top:12px;">
          Confidentialité : ne pas inclure d’identifiants directs dans les champs texte. Stockage local uniquement (navigateur).
        </div>
      </body></html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  // --------- Résumé patient (1 page) ----------
  function openOnePageSummary(patientId){
    const p = getPatient(patientId);
    if(!p){
      alert("Choisis un patient.");
      return;
    }

    const seances = getSeancesForPatient(patientId);
    const suivi = getSuiviForPatient(patientId);
    const eis = getEIForPatient(patientId);
    const proto = getProtocolForPatient(patientId);

    const win = window.open("", "_blank");
    if(!win){
      alert("Fenêtre bloquée. Autorise les popups pour générer le résumé.");
      return;
    }

    const isoToday = new Date().toISOString().slice(0,10);

    const lastSeance = seances.length ? seances[seances.length-1] : null;
    const firstSeance = seances.length ? seances[0] : null;
    const lastSuivi = suivi.length ? suivi[suivi.length-1] : null;
    const lastEI = eis.length ? eis[eis.length-1] : null;

    const asNum = (x) => {
      const n = Number(x);
      return Number.isFinite(n) ? n : null;
    };

    const seriesLine = (label, base, cur) => {
      const b = asNum(base);
      const c = asNum(cur);
      if(b === null && c === null) return `<tr><th>${esc(label)}</th><td>—</td></tr>`;
      if(b === null) return `<tr><th>${esc(label)}</th><td>— → ${esc(String(c))}</td></tr>`;
      if(c === null) return `<tr><th>${esc(label)}</th><td>${esc(String(b))} → —</td></tr>`;
      const d = c - b;
      const dTxt = (d === 0) ? "0" : (d > 0 ? `+${d}` : `${d}`);
      return `<tr><th>${esc(label)}</th><td>${esc(String(b))} → ${esc(String(c))} <span class="muted">(${esc(dTxt)})</span></td></tr>`;
    };

    const coverage = (() => {
      const exp = (proto && proto.expectedSeances !== null && proto.expectedSeances !== undefined) ? Number(proto.expectedSeances) : null;
      if(!Number.isFinite(exp) || exp <= 0) return `${seances.length}`;
      const pct = Math.round((seances.length / exp) * 100);
      return `${seances.length} / ${exp} (${pct}%)`;
    })();

    const style = `
      <style>
        @page{ size: A4; margin: 12mm; }
        body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin:0; color:#111; font-size:11px;}
        h1{margin:0 0 4px; font-size:16px;}
        h2{margin:0 0 8px; font-size:12px;}
        .meta{color:#444; font-size:10px; margin-bottom:10px;}
        .noprint{margin:10px 0 10px;}
        .btn{padding:8px 10px; border-radius:10px; border:1px solid #ddd; background:#f7f7f7; cursor:pointer; font-weight:700;}
        .grid{display:grid; grid-template-columns: 1fr 1fr; gap:10px;}
        .box{border:1px solid #ddd; border-radius:12px; padding:10px; margin:8px 0; break-inside: avoid;}
        table{width:100%; border-collapse:collapse; font-size:10px;}
        th,td{border-bottom:1px solid #eee; padding:6px 6px; text-align:left; vertical-align:top;}
        th{white-space:nowrap; width:34%;}
        .muted{color:#555;}
        .pill{display:inline-block; padding:2px 8px; border-radius:999px; background:#eef6ff; border:1px solid #d8ecff; font-size:10px;}
        .kpi{display:flex; gap:10px; flex-wrap:wrap; font-size:10px; color:#222;}
        .kpi span{display:inline-flex; gap:6px; align-items:center; padding:3px 8px; border-radius:999px; border:1px solid #eee; background:#fafafa;}
        .small{font-size:9px;}
        @media print{ .noprint{display:none} }
      </style>
    `;

    const seancesRows = seances.slice(-6).reverse();
    const suiviRows = suivi.slice(-6).reverse();
    const eiRows = eis.slice(-4).reverse();

    const html = `
      <!doctype html>
      <html lang="fr"><head><meta charset="utf-8" /><title>Résumé 1 page ${esc(p.patient_id)}</title>${style}</head>
      <body>
        <div class="noprint">
          <button class="btn" onclick="window.print()">Imprimer / enregistrer en PDF</button>
          <span style="margin-left:10px;color:#555;font-size:10px;">Astuce : “Destination” → “Enregistrer en PDF”.</span>
        </div>

        <h1>Résumé patient (1 page) — registre rTMS douleur</h1>
        <div class="meta">
          Patient <span class="pill">${esc(p.patient_id)}</span> • ${esc(p.initiales)} • Centre : ${esc(p.centre || "—")} • Inclusion : ${esc(p.date_inclusion || "—")}
          <br/>Généré le ${esc(isoToday)} • Schéma v${esc(SCHEMA_VERSION)}
        </div>

        <div class="kpi">
          <span><strong>Séances</strong> ${esc(String(seances.length))}</span>
          <span><strong>Suivis</strong> ${esc(String(suivi.length))}</span>
          <span><strong>EI</strong> ${esc(String(eis.length))}</span>
          <span><strong>Couverture</strong> ${esc(coverage)}</span>
        </div>

        <div class="grid">
          <div class="box">
            <h2>Inclusion</h2>
            <table>
              <tr><th>Indication</th><td>${esc(labelIndication(p.indication))}</td></tr>
              <tr><th>Année naissance</th><td>${esc(p.annee_naissance || "—")}</td></tr>
              <tr><th>Sexe</th><td>${esc(p.sexe || "—")}</td></tr>
              <tr><th>Consentement</th><td>${esc(p.consentement || "—")}</td></tr>
              <tr><th>Antalgiques</th><td class="muted">${esc(trunc(p.antalgiques || "—", 140) || "—")}</td></tr>
            </table>
          </div>

          <div class="box">
            <h2>Évolution (base → dernier suivi)</h2>
            <table>
              ${seriesLine("Douleur (NRS)", p.douleur_base, lastSuivi?.douleur)}
              ${seriesLine("Fatigue (NRS)", p.fatigue_base, lastSuivi?.fatigue)}
              ${seriesLine("Sommeil (NRS)", p.sommeil_base, lastSuivi?.sommeil)}
              ${seriesLine("Humeur (NRS)", p.humeur_base, lastSuivi?.humeur)}
              <tr><th>PGIC (dernier)</th><td>${esc(lastSuivi?.pgic ?? "—")}</td></tr>
            </table>
            <div class="muted small" style="margin-top:6px; line-height:1.25;">Sommeil/Humeur : 0 = très mauvais, 10 = excellent. Douleur : 0 = aucune, 10 = maximale.</div>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <h2>Dernière séance</h2>
            ${lastSeance ? `
              <table>
                <tr><th>Date</th><td>${esc(lastSeance.date || "—")}</td></tr>
                <tr><th>Numéro</th><td>${esc(lastSeance.numero ?? "—")}</td></tr>
                <tr><th>Cible / latéralité</th><td>${esc(lastSeance.cible || "—")} • ${esc(lastSeance.lateralite || "—")}</td></tr>
                <tr><th>Hz / % seuil moteur</th><td>${esc(lastSeance.frequence_hz ?? "—")} • ${esc(lastSeance.intensite_pct_mt ?? "—")}</td></tr>
                <tr><th>Impulsions / durée</th><td>${esc(lastSeance.pulses ?? "—")} • ${esc(lastSeance.duree_min ?? "—")} min</td></tr>
                <tr><th>Douleur (pré → post)</th><td>${esc(lastSeance.douleur_pre ?? "—")} → ${esc(lastSeance.douleur_post ?? "—")}</td></tr>
                <tr><th>Tolérance</th><td>${esc(lastSeance.tolerance ?? "—")} / 10</td></tr>
                <tr><th>Remarque</th><td class="muted">${esc(trunc(lastSeance.effets || "—", 160) || "—")}</td></tr>
              </table>
            ` : `<div class="muted">Aucune séance enregistrée.</div>`}
            <div class="muted small" style="margin-top:6px;">Première séance : ${esc(firstSeance?.date || "—")} • Dernière : ${esc(lastSeance?.date || "—")}</div>
          </div>

          <div class="box">
            <h2>Dernier suivi & derniers EI</h2>
            <table>
              <tr><th>Dernier suivi</th><td>${esc(lastSuivi?.date || "—")} (${esc(labelTemps(lastSuivi?.temps))})</td></tr>
              <tr><th>Dernier EI</th><td>${esc(lastEI?.date || "—")} • ${esc(labelSev(lastEI?.severite))} • lien rTMS : ${esc(lastEI?.lien_rtms || "—")}</td></tr>
              <tr><th>Description EI</th><td class="muted">${esc(trunc(lastEI?.description || "—", 220) || "—")}</td></tr>
              <tr><th>Action / issue</th><td class="muted">${esc(trunc(lastEI?.action || "—", 120) || "—")} • ${esc(lastEI?.issue || "—")}</td></tr>
            </table>
          </div>
        </div>

        <div class="box">
          <h2>Derniers enregistrements (extrait)</h2>
          <div class="grid">
            <div>
              <div class="muted" style="font-weight:700;margin-bottom:6px;">Séances (6 dernières)</div>
              ${seancesRows.length ? `
                <table>
                  <thead><tr><th>Date</th><th>N°</th><th>Cible</th><th>Pré→post</th><th>Tol.</th></tr></thead>
                  <tbody>
                    ${seancesRows.map(s => `
                      <tr>
                        <td>${esc(s.date||"—")}</td>
                        <td>${esc(s.numero ?? "—")}</td>
                        <td>${esc((s.cible||"—") + (s.lateralite ? " " + s.lateralite : ""))}</td>
                        <td>${esc(s.douleur_pre ?? "—")}→${esc(s.douleur_post ?? "—")}</td>
                        <td>${esc(s.tolerance ?? "—")}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              ` : `<div class="muted">—</div>`}
            </div>

            <div>
              <div class="muted" style="font-weight:700;margin-bottom:6px;">Suivis (6 derniers)</div>
              ${suiviRows.length ? `
                <table>
                  <thead><tr><th>Date</th><th>Temps</th><th>Douleur</th><th>Fat.</th><th>Som.</th><th>Hum.</th></tr></thead>
                  <tbody>
                    ${suiviRows.map(f => `
                      <tr>
                        <td>${esc(f.date||"—")}</td>
                        <td>${esc(labelTemps(f.temps))}</td>
                        <td>${esc(f.douleur ?? "—")}</td>
                        <td>${esc(f.fatigue ?? "—")}</td>
                        <td>${esc(f.sommeil ?? "—")}</td>
                        <td>${esc(f.humeur ?? "—")}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              ` : `<div class="muted">—</div>`}
            </div>
          </div>

          <div style="margin-top:10px;">
            <div class="muted" style="font-weight:700;margin-bottom:6px;">EI (4 derniers)</div>
            ${eiRows.length ? `
              <table>
                <thead><tr><th>Date</th><th>Sév.</th><th>Lien</th><th>Description</th></tr></thead>
                <tbody>
                  ${eiRows.map(e => `
                    <tr>
                      <td>${esc(e.date||"—")}</td>
                      <td>${esc(labelSev(e.severite))}</td>
                      <td>${esc(e.lien_rtms||"—")}</td>
                      <td class="muted">${esc(trunc(e.description||"—", 120) || "—")}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            ` : `<div class="muted">—</div>`}
          </div>
        </div>

        <div class="muted small" style="margin-top:8px; line-height:1.25;">
          Confidentialité : ne pas inclure d’identifiants directs dans les champs texte. Stockage local uniquement (navigateur). Ce résumé est une extraction “vie réelle”.
        </div>
      </body></html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  // --------- Dictionary view ----------
  function dictToCSV(){
    const fields = ["table","field","label","type","required","values","notes"];
    return toCSV(DATA_DICTIONARY, fields, ";");
  }

  function renderDictionary(){
    const el = qs("#dictTable");
    const rows = DATA_DICTIONARY.slice();
    const head = `
      <table>
        <thead><tr>
          <th>Table</th><th>Champ</th><th>Libellé</th><th>Type</th><th>Obligatoire</th><th>Valeurs</th><th>Notes</th>
        </tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td class="mono">${esc(r.table)}</td>
              <td class="mono">${esc(r.field)}</td>
              <td>${esc(r.label)}</td>
              <td>${esc(r.type)}</td>
              <td>${esc(r.required)}</td>
              <td>${esc(r.values)}</td>
              <td>${esc(r.notes)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    el.innerHTML = head;
  }

  // --------- Export view ----------
  function renderExport(){
    // nothing special for now
  }

  // --------- Patient selects ----------
  function refreshPatientSelects(){
    const selects = ["selPatientDashboard","selPatientSeances","selPatientSuivi","selPatientEI","selPatientExport"];
    const options = state.patients
      .slice()
      .sort((a,b) => (a.patient_id||"").localeCompare(b.patient_id||""))
      .map(p => ({value:p.patient_id, label:`${p.patient_id} — ${p.initiales || "—"} — ${labelIndication(p.indication)}`}));

    for(const id of selects){
      const sel = qs("#"+id);
      if(!sel) continue;
      const prev = sel.value;
      sel.innerHTML = `<option value="">— choisir —</option>` + options.map(o => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join("");
      // restore
      sel.value = prev || currentPatientId || "";
    }
  }

  // --------- Backup / Reset ----------
  function exportBackup(){
    const payload = {...state};
    downloadText(`backup_rtms_registre_${SCHEMA_VERSION}_${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
  }

  function importBackup(file){
    const reader = new FileReader();
    reader.onload = () => {
      try{
        const obj = JSON.parse(String(reader.result || ""));
        const ok = obj && obj.meta && obj.meta.schemaVersion && Array.isArray(obj.patients) && Array.isArray(obj.seances) && Array.isArray(obj.suivi) && Array.isArray(obj.ei);
        if(!ok){
          alert("Backup invalide : structure inattendue.");
          return;
        }
        // Basic compatibility: accept same schema major (0.1.x)
        state = normalizeState(obj);
        saveState();
        currentPatientId = state.patients[0]?.patient_id || null;
        resetPatientForm();
        renderPatientsList();
        refreshPatientSelects();
        if(currentPatientId) setCurrentPatient(currentPatientId);
        alert("Import terminé.");
      }catch(e){
        alert("Import impossible : fichier non JSON ou corrompu.");
      }
    };
    reader.readAsText(file);
  }

  function resetAll(){
    const ok = confirm("Réinitialiser le registre ?\nToutes les données locales seront effacées.");
    if(!ok) return;
    localStorage.removeItem(STORE_KEY);
    state = defaultState();
    saveState();
    currentPatientId = null;
    currentSeanceId = null;
    currentSuiviId = null;
    currentEiId = null;
    resetPatientForm();
    refreshPatientSelects();
    renderPatientsList();
    renderSeances();
    renderSuivi();
    renderEI();
    renderQualityEmpty();
    alert("Réinitialisé.");
  }

  // --------- Status helper ----------
  function setStatus(sel, msg){
    const el = qs(sel);
    if(el) el.textContent = msg || "";
  }

  // --------- Wire UI ----------
  function bind(){
    // tabs
    qsa(".tab").forEach(b => b.addEventListener("click", () => setView(b.dataset.view)));

    // dashboard
    qs("#selPatientDashboard").addEventListener("change", (e) => {
      const pid = e.target.value;
      if(pid) setCurrentPatient(pid);
      setStatus("#dashExportStatus", "");
      renderDashboard();
    });
    qs("#btnDashToPatients").addEventListener("click", () => {
      const pid = qs("#selPatientDashboard").value;
      if(pid) setCurrentPatient(pid);
      setView("patients");
    });
    qs("#btnDashToSeances").addEventListener("click", () => {
      const pid = qs("#selPatientDashboard").value;
      if(pid) setCurrentPatient(pid);
      setView("seances");
    });
    qs("#btnDashAddSeance").addEventListener("click", () => {
      const pid = qs("#selPatientDashboard").value;
      if(!pid){ alert("Choisis un patient."); return; }
      prefillSeanceFromDashboard(pid);
    });
    qs("#btnDashToSuivi").addEventListener("click", () => {
      const pid = qs("#selPatientDashboard").value;
      if(pid) setCurrentPatient(pid);
      setView("suivi");
    });
    qs("#btnDashAddSuivi").addEventListener("click", () => {
      const pid = qs("#selPatientDashboard").value;
      if(!pid){ alert("Choisis un patient."); return; }
      prefillSuiviFromDashboard(pid);
    });
    qs("#btnDashToEI").addEventListener("click", () => {
      const pid = qs("#selPatientDashboard").value;
      if(pid) setCurrentPatient(pid);
      setView("ei");
    });
    qs("#btnDashAddEI").addEventListener("click", () => {
      const pid = qs("#selPatientDashboard").value;
      if(!pid){ alert("Choisis un patient."); return; }
      prefillEiFromDashboard(pid);
    });
    qs("#btnDashToPDF").addEventListener("click", () => {
      const pid = qs("#selPatientDashboard").value;
      openClinicalSummary(pid);
    });

    if(qs("#btnDashOnePage")){
      qs("#btnDashOnePage").addEventListener("click", () => {
        const pid = qs("#selPatientDashboard").value;
        openOnePageSummary(pid);
      });
    }

    if(qs("#btnDashExportPatient")){
      qs("#btnDashExportPatient").addEventListener("click", () => {
        const pid = qs("#selPatientDashboard").value;
        if(!pid){ alert("Choisis un patient."); return; }
        // Remarque : selon le navigateur, l’utilisateur peut devoir autoriser les téléchargements multiples.
        exportPatientDossier(pid);
        setStatus("#dashExportStatus", `✅ Export lancé : dossier patient ${pid}.`);
      });
    }

    if(qs("#btnDashExportPatientZip")){
      qs("#btnDashExportPatientZip").addEventListener("click", () => {
        const pid = qs("#selPatientDashboard").value;
        if(!pid){ alert("Choisis un patient."); return; }
        exportPatientDossierZip(pid);
        setStatus("#dashExportStatus", `✅ Export lancé : dossier patient (ZIP) ${pid}.`);
      });
    }
    qs("#btnDashToProtocole").addEventListener("click", () => {
      setView("protocole");
      renderProtocole();
    });

    // patients
    qs("#patientSearch").addEventListener("input", renderPatientsList);
    qs("#btnNewPatient").addEventListener("click", () => {
      resetPatientForm();
      setView("patients");
    });
    qs("#formPatient").addEventListener("submit", (e) => {
      e.preventDefault();
      upsertPatient();
    });
    qs("#btnDeletePatient").addEventListener("click", deleteCurrentPatient);

    // seances
    qs("#selPatientSeances").addEventListener("change", (e) => {
      const pid = e.target.value;
      if(pid) setCurrentPatient(pid);
      resetSeanceForm(pid);
      renderSeances();
    });
    qs("#btnNewSeance").addEventListener("click", () => {
      const pid = qs("#selPatientSeances").value;
      if(!pid){ alert("Choisis un patient."); return; }
      resetSeanceForm(pid);
    });
    qs("#formSeance").addEventListener("submit", (e) => {
      e.preventDefault();
      upsertSeance();
    });
    qs("#btnDeleteSeance").addEventListener("click", deleteCurrentSeance);

    // suivi
    qs("#selPatientSuivi").addEventListener("change", (e) => {
      const pid = e.target.value;
      if(pid) setCurrentPatient(pid);
      resetSuiviForm(pid);
      renderSuivi();
    });
    qs("#btnNewSuivi").addEventListener("click", () => {
      const pid = qs("#selPatientSuivi").value;
      if(!pid){ alert("Choisis un patient."); return; }
      resetSuiviForm(pid);
    });
    if(qs("#f_point_proto")){
      qs("#f_point_proto").addEventListener("change", handleSuiviPointChange);
    }
    qs("#formSuivi").addEventListener("submit", (e) => {
      e.preventDefault();
      upsertSuivi();
    });
    qs("#btnDeleteSuivi").addEventListener("click", deleteCurrentSuivi);

    // EI
    qs("#selPatientEI").addEventListener("change", (e) => {
      const pid = e.target.value;
      if(pid) setCurrentPatient(pid);
      resetEiForm(pid);
      renderEI();
    });
    qs("#btnNewEI").addEventListener("click", () => {
      const pid = qs("#selPatientEI").value;
      if(!pid){ alert("Choisis un patient."); return; }
      resetEiForm(pid);
    });
    qs("#formEI").addEventListener("submit", (e) => {
      e.preventDefault();
      upsertEI();
    });
    qs("#btnDeleteEI").addEventListener("click", deleteCurrentEI);

    // qualité
    qs("#btnRunQuality").addEventListener("click", () => {
      const rules = runQuality();
      renderQuality(rules);
    });

    
// protocole
if(qs("#selCentreProtocole")){
  qs("#selCentreProtocole").addEventListener("change", () => {
    renderProtocole();
  });
}
if(qs("#formProtocole")){
  qs("#formProtocole").addEventListener("submit", (e) => {
    e.preventDefault();
    saveProtocoleFromForm();
  });
}
if(qs("#btnProtoReset")){
  qs("#btnProtoReset").addEventListener("click", () => {
    resetProtocoleSelection();
  });
}
if(qs("#btnProtoTemplateCure")){
  qs("#btnProtoTemplateCure").addEventListener("click", () => {
    qs("#proto_mode").value = "seance";
    qs("#proto_points").value = "0,10,20,30";
    setStatus("#protocoleStatus", "🧩 Template appliqué (cure). Clique “Enregistrer”.");
    renderProtocole();
  });
}
if(qs("#btnProtoTemplateSemaines")){
  qs("#btnProtoTemplateSemaines").addEventListener("click", () => {
    qs("#proto_mode").value = "semaine";
    qs("#proto_points").value = "0,2,4,8";
    setStatus("#protocoleStatus", "🧩 Template appliqué (semaines). Clique “Enregistrer”.");
    renderProtocole();
  });
}

    // export
    qs("#selPatientExport").addEventListener("change", (e) => {
      const pid = e.target.value;
      if(pid) setCurrentPatient(pid);
    });
    qs("#btnOpenClinicalSummary").addEventListener("click", () => {
      const pid = qs("#selPatientExport").value;
      openClinicalSummary(pid);
    });
    qs("#btnExportPatientsCsv").addEventListener("click", () => exportCSV("patients"));
    qs("#btnExportSeancesCsv").addEventListener("click", () => exportCSV("seances"));
    qs("#btnExportSuiviCsv").addEventListener("click", () => exportCSV("suivi"));
    qs("#btnExportEiCsv").addEventListener("click", () => exportCSV("evenements_indesirables"));
    if(qs("#btnExportAllRegistry")){
      qs("#btnExportAllRegistry").addEventListener("click", exportAllRegistry);
    }

    // dictionnaire
    qs("#btnDownloadDict").addEventListener("click", () => downloadText("dictionnaire_donnees_v1.csv", dictToCSV(), "text/csv;charset=utf-8"));

    // backup/import/reset
    qs("#btnBackupExport").addEventListener("click", exportBackup);
    qs("#fileBackupImport").addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if(f) importBackup(f);
      e.target.value = "";
    });
    qs("#btnReset").addEventListener("click", resetAll);
  }

  function init(){
    bind();
    refreshPatientSelects();
    renderPatientsList();
    renderDictionary();
    renderQualityEmpty();

    // default patient selection
    if(state.patients.length){
      const pid = currentPatientId || state.patients[0].patient_id;
      setCurrentPatient(pid);
    }else{
      resetPatientForm();
    }
    setView("patients");
  }

  init();

})();

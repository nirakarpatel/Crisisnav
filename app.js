/* ===========================================================
   CrisisNav – Application Logic
   =========================================================== */

// ── Crisis Data Store ──────────────────────────────────────
const CRISIS_DATA = [
  {
    id: 'fire',
    title: 'Fire Incident',
    icon: 'ph-bold ph-fire',
    desc: 'Industrial or workplace fire emergency with evacuation and suppression procedures.',
    severity: 'critical',
    accentColor: '#f43f5e',
    stepCount: 8,
    steps: [
      { title: 'Activate Fire Alarm', desc: 'Immediately pull the nearest fire alarm pull station. This alerts all building occupants and notifies the fire department automatically in most systems.', warning: 'Do NOT attempt to fight a large fire yourself. Evacuate immediately if fire is uncontrollable.', timer: 30 },
      { title: 'Call Emergency Services', desc: 'Dial 112 / 911 / local fire emergency number. Clearly state the building address, floor, nature of fire, and whether anyone is trapped.', timer: 60 },
      { title: 'Evacuate the Area', desc: 'Follow the established evacuation routes. Assist persons with disabilities. Use stairs — never elevators. Close doors behind you to slow fire spread.', warning: 'Do NOT re-enter the building for personal belongings.' },
      { title: 'Assemble at Muster Point', desc: 'Proceed to the designated assembly point. Report to the floor warden or emergency coordinator. Perform headcount of your team members.' },
      { title: 'Shut Down Critical Systems', desc: 'If safe to do so, shut down gas lines, electrical panels, and HVAC systems to prevent fire spread. Only designated personnel should perform this.', warning: 'Only attempt if it is safe and you are trained to do so.' },
      { title: 'Use Fire Extinguisher (If Safe)', desc: 'Only for small, contained fires. Use PASS technique: Pull pin, Aim at fire base, Squeeze handle, Sweep side-to-side. Stay low to avoid smoke inhalation.' },
      { title: 'Notify Management & Safety Officer', desc: 'Inform the plant manager, safety officer, and HR department. Provide initial assessment including affected area, estimated damage, and injury status.' },
      { title: 'Document the Incident', desc: 'Fill the Fire Incident Report form. Include time of detection, actions taken, personnel involved, injuries sustained, and property damage. Take photographs if safe.' }
    ],
    contacts: [
      { name: 'Fire Department', number: '112 / 911' },
      { name: 'Plant Safety Officer', number: 'Internal Ext. 500' },
      { name: 'Insurance Helpline', number: '1-800-FIRE-CLM' }
    ],
    documents: ['Fire Incident Report Form', 'Evacuation Plan Map', 'Insurance Policy Documents', 'Employee Headcount Records'],
    mistakes: ['Using elevators during fire', 'Re-entering the building before all-clear', 'Attempting to fight a large fire alone', 'Forgetting to close doors while evacuating']
  },
  {
    id: 'chemical',
    title: 'Chemical Leak / Spill',
    icon: 'ph-bold ph-flask',
    desc: 'Hazardous chemical release requiring containment, evacuation, and decontamination.',
    severity: 'critical',
    accentColor: '#8b5cf6',
    stepCount: 8,
    steps: [
      { title: 'Identify the Chemical', desc: 'Check Safety Data Sheets (SDS) or container labels to identify the substance. Note the chemical name, hazard class, and recommended PPE.', warning: 'Do NOT smell or touch the substance to identify it.' },
      { title: 'Alert Nearby Personnel', desc: 'Warn all workers in the immediate area. Activate the chemical spill alarm or PA system. Clear the affected zone within a 50-meter radius.', timer: 45 },
      { title: 'Don Personal Protective Equipment', desc: 'Wear appropriate PPE: chemical-resistant gloves, goggles, protective suit, and respiratory protection as specified in the SDS.' },
      { title: 'Contain the Spill', desc: 'Use spill containment kits — absorbent pads, booms, or neutralizing agents. Prevent the chemical from reaching drains, waterways, or soil.' },
      { title: 'Ventilate the Area', desc: 'Open windows and doors. Activate emergency ventilation systems. If outdoors, move upwind from the spill. Monitor air quality if instruments are available.' },
      { title: 'Call HAZMAT Response Team', desc: 'Contact the internal HAZMAT team or dial emergency services. Provide the chemical name, quantity spilled, location, and current wind direction.' },
      { title: 'Administer First Aid', desc: 'If anyone is exposed: flush eyes/skin with water for 15 minutes, move to fresh air, remove contaminated clothing. Seek medical attention immediately.' },
      { title: 'File Environmental Compliance Report', desc: 'Document the spill details, cleanup actions, and environmental impact. Submit regulatory reports within the required timeframe (typically 24-48 hours).' }
    ],
    contacts: [
      { name: 'HAZMAT Team', number: 'Internal Ext. 600' },
      { name: 'Poison Control', number: '1-800-222-1222' },
      { name: 'Environmental Agency', number: 'Regional Office' }
    ],
    documents: ['Safety Data Sheets (SDS)', 'Chemical Inventory List', 'Spill Response Procedure', 'Environmental Impact Report Form'],
    mistakes: ['Touching or tasting unknown chemicals', 'Using water on water-reactive chemicals', 'Neglecting to report small spills', 'Improper disposal of contaminated materials']
  },
  {
    id: 'medical',
    title: 'Medical Emergency',
    icon: 'ph-bold ph-heartbeat',
    desc: 'Workplace injuries, cardiac events, or health crises requiring immediate medical response.',
    severity: 'high',
    accentColor: '#f97316',
    stepCount: 8,
    steps: [
      { title: 'Assess the Scene for Safety', desc: 'Before approaching, ensure the area is safe for you. Look for hazards like electrical wires, traffic, or unstable structures. Do not become a second victim.', timer: 15 },
      { title: 'Call Emergency Medical Services', desc: 'Dial 112 / 911. Describe the victim\'s condition, location, age, and symptoms. Stay on the line and follow dispatcher instructions.', timer: 30 },
      { title: 'Check Responsiveness & Breathing', desc: "Tap the person's shoulders and ask loudly \"Are you okay?\" Check for chest rise and breathing. If unresponsive and not breathing normally, prepare for CPR." },
      { title: 'Begin CPR if Needed', desc: 'Place the heel of your hand on the center of the chest. Push hard and fast (100-120 compressions per minute, 2 inches deep). Give 2 rescue breaths after every 30 compressions.', warning: 'Do NOT stop CPR until professional help arrives or the person starts breathing.' },
      { title: 'Use AED if Available', desc: 'Locate the nearest Automated External Defibrillator. Power it on and follow voice prompts. Attach pads as shown. Stand clear and deliver shock if advised.' },
      { title: 'Control Bleeding', desc: 'Apply firm, direct pressure to wounds using clean cloth or gauze. Elevate the injured limb if possible. Apply a tourniquet only for life-threatening limb bleeding.' },
      { title: 'Monitor & Comfort the Patient', desc: 'Keep the person warm and calm. Monitor their breathing and consciousness. Do not give food or drink. Note the time of injury and any medications taken.' },
      { title: 'Complete Incident Documentation', desc: 'Record incident details: time, location, nature of emergency, first aid administered, and patient status on handover to EMS. File the workplace incident report.' }
    ],
    contacts: [
      { name: 'Emergency Medical Services', number: '112 / 911' },
      { name: 'Company Nurse/Medic', number: 'Internal Ext. 300' },
      { name: 'Nearest Hospital', number: 'See Facility Directory' }
    ],
    documents: ['First Aid Log', 'Incident Report Form', 'Medical Release Authorization', 'Employee Medical Information Card'],
    mistakes: ['Moving a spinal injury patient', 'Removing objects embedded in wounds', 'Performing CPR improperly or stopping too early', 'Not wearing gloves when treating wounds']
  },
  {
    id: 'accident',
    title: 'Workplace Accident',
    icon: 'ph-bold ph-warning-diamond',
    desc: 'Industrial accidents involving machinery, falls, or structural failures.',
    severity: 'high',
    accentColor: '#f59e0b',
    stepCount: 8,
    steps: [
      { title: 'Secure the Accident Area', desc: 'Cordon off the area with barriers or caution tape. Remove non-essential personnel. Prevent further access until the area is declared safe.', timer: 60 },
      { title: 'Provide Immediate First Aid', desc: 'Attend to injured persons. Apply first aid for bleeding, fractures, or shock. Do NOT move severely injured persons unless there is immediate danger.' },
      { title: 'Call Emergency Services', desc: 'Dial 112 / 911 for severe injuries. Provide the exact location, number of injured persons, and type of accident (fall, machinery, electrical, etc.).' },
      { title: 'Shut Down Equipment', desc: 'Immediately power off any involved machinery using emergency stop buttons or lockout/tagout (LOTO) procedures. Ensure the machine cannot restart accidentally.', warning: 'Follow LOTO procedures strictly. Never assume equipment is de-energized.' },
      { title: 'Preserve the Accident Scene', desc: 'Do not move or clean up anything at the scene. Mark positions of equipment, tools, and materials. This is essential for the investigation.' },
      { title: 'Notify Management & Safety Team', desc: 'Inform the shift supervisor, safety officer, and HR immediately. Provide a preliminary report of what happened, who is involved, and current status.' },
      { title: 'Conduct Witness Interviews', desc: 'Interview all witnesses while memories are fresh. Record their statements, names, and contact information. Ask for timeline of events and any unusual observations.' },
      { title: 'File Formal Accident Report', desc: 'Complete the Workplace Accident Report within 24 hours. Include root cause analysis, photos, witness statements, corrective actions, and timeline of events.' }
    ],
    contacts: [
      { name: 'Emergency Services', number: '112 / 911' },
      { name: 'Safety Officer', number: 'Internal Ext. 500' },
      { name: 'Workers Comp Insurance', number: '1-800-WRK-COMP' }
    ],
    documents: ['Accident Investigation Report', 'Witness Statement Forms', 'LOTO Procedures', 'Workers Compensation Claim Form'],
    mistakes: ['Moving the injured person unnecessarily', 'Cleaning up the accident scene before investigation', 'Failing to interview witnesses promptly', 'Not filing the report within 24 hours']
  },
  {
    id: 'legal',
    title: 'Legal Notice / Threat',
    icon: 'ph-bold ph-scales',
    desc: 'Receiving legal notices, compliance violations, or regulatory actions requiring immediate response.',
    severity: 'medium',
    accentColor: '#4f46e5',
    stepCount: 7,
    steps: [
      { title: 'Read the Notice Carefully', desc: 'Read every word of the legal notice. Note the sender, date issued, response deadline, and specific allegations. Do NOT ignore or delay reading it.', timer: null },
      { title: 'Document Receipt Details', desc: 'Record the date and time you received the notice, the method of delivery (email, registered post, in-person), and who handed it to you. Photograph the envelope and document.' },
      { title: 'Do NOT Respond Immediately', desc: 'Never send a hasty reply, email, or social media post about the matter. Any statements you make can be used in legal proceedings.', warning: 'Do NOT contact the opposing party directly. All communication should go through legal counsel.' },
      { title: 'Contact Legal Counsel', desc: 'Reach out to your lawyer, company legal department, or legal aid helpline. Share the full notice. Discuss the allegations, your options, and the response timeline.' },
      { title: 'Gather Supporting Documents', desc: 'Collect all documents related to the matter: contracts, emails, invoices, receipts, communication records, agreements, and any relevant photographs or evidence.' },
      { title: 'Prepare a Formal Response', desc: 'With your lawyer, draft a formal response addressing each point in the notice. Ensure it is factual, professional, and submitted before the deadline.' },
      { title: 'File & Track the Case', desc: 'Maintain a file with all case documents, correspondence, and timeline. Set reminders for future court dates, response deadlines, and follow-up actions.' }
    ],
    contacts: [
      { name: 'Company Legal Counsel', number: 'Legal Dept.' },
      { name: 'Legal Aid Helpline', number: '1-800-LEGAL' },
      { name: 'Bar Association Referral', number: 'Local Chapter' }
    ],
    documents: ['The Legal Notice', 'Relevant Contracts & Agreements', 'Communication Records (emails, letters)', 'Financial Records & Invoices'],
    mistakes: ['Ignoring the legal notice or deadline', 'Responding emotionally or without legal advice', 'Discussing the matter on social media', 'Destroying or tampering with evidence']
  },
  {
    id: 'bankfreeze',
    title: 'Bank Account Freeze',
    icon: 'ph-bold ph-bank',
    desc: 'Sudden bank account freeze due to court order, tax dispute, or suspicious activity alert.',
    severity: 'medium',
    accentColor: '#0ea5e9',
    stepCount: 7,
    steps: [
      { title: 'Verify the Freeze', desc: 'Check your online banking portal and call your bank\'s customer service. Confirm that the freeze is legitimate and not a phishing scam. Ask for the reason and reference number.' },
      { title: 'Understand the Reason', desc: 'The freeze may be due to: court order (debt recovery), tax authority attachment, suspicious transaction flagging, or compliance hold. Note the exact reason and ordering authority.' },
      { title: 'Gather Account Documents', desc: 'Collect recent bank statements (6 months minimum), your account opening documents, PAN/tax ID, identity proof, and any correspondence from the bank or authority.' },
      { title: 'Contact the Ordering Authority', desc: 'If frozen by court or tax authority, obtain a copy of the order. Understand the specific amount under dispute and the legal basis for the freeze.' },
      { title: 'Consult a Financial / Legal Advisor', desc: 'Contact your CA, financial advisor, or lawyer. Discuss whether the freeze is legally valid, what portion of funds can be released, and the appeal process.', warning: 'Time-sensitive: Most freeze orders have a specific validity period. Act within this window.' },
      { title: 'File an Appeal or Representation', desc: 'Submit a formal representation to the bank and/or the ordering authority. Include supporting documents proving your case. Request partial release of funds for essential expenses.' },
      { title: 'Arrange Alternative Finances', desc: 'While the freeze is being resolved, arrange for essential payments through alternate accounts, family assistance, or emergency credit lines. Track all alternative transactions.' }
    ],
    contacts: [
      { name: 'Bank Customer Care', number: 'See Card Back' },
      { name: 'Tax Authority Helpline', number: 'Regional Office' },
      { name: 'Financial Advisor', number: 'Your CA/Advisor' }
    ],
    documents: ['Bank Statements (6 months)', 'Freeze Order Copy', 'Identity & Tax ID Proof', 'Income Tax Returns'],
    mistakes: ['Ignoring the freeze hoping it resolves itself', 'Attempting to withdraw large amounts from other linked accounts', 'Not keeping copies of all representations filed', 'Missing the appeal deadline']
  }
];

// ── Severity Config ────────────────────────────────────────
const SEVERITY_CONFIG = {
  low: { label: 'Low', color: '#10b981', offset: 244 },
  medium: { label: 'Medium', color: '#f59e0b', offset: 163 },
  high: { label: 'High', color: '#f97316', offset: 82 },
  critical: { label: 'Critical', color: '#ef4444', offset: 16 }
};

// ── DOM Elements ───────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  hero: $('#hero'),
  howItWorks: $('#how-it-works'),
  categories: $('#categories'),
  navigator: $('#navigator'),
  crisisGrid: $('#crisis-grid'),
  crisisSearch: $('#crisis-search'),
  // Navigator
  navCrisisName: $('#nav-crisis-name'),
  navSeverity: $('#nav-severity'),
  progressFill: $('#progress-fill'),
  progressLabel: $('#progress-label'),
  stepNavigator: $('#step-navigator'),
  stepNum: $('#step-num'),
  stepTimer: $('#step-timer'),
  stepTitle: $('#step-title'),
  stepDesc: $('#step-desc'),
  stepWarning: $('#step-warning'),
  stepWarningText: $('#step-warning-text'),
  completionCard: $('#completion-card'),
  // Severity ring
  severityRingFill: $('#severity-ring-fill'),
  severityLabel: $('#severity-label'),
  // Sidebar lists
  actionLog: $('#action-log'),
  contactsList: $('#contacts-list'),
  docsList: $('#docs-list'),
  mistakesList: $('#mistakes-list'),
  // Human centric tools
  btnSOS: $('#btn-sos'),
  btnMedical: $('#btn-medical-id'),
  modalMedical: $('#modal-medical'),
  formMedical: $('#form-medical'),
  toggleContrast: $('#toggle-contrast'),
  btnTTS: $('#btn-tts'),
  companion: $('#companion'),
  companionBubble: $('#companion-bubble'),
  // Buttons
  btnStartHero: $('#btn-start-hero'),
  btnStartMain: $('#btn-start-main'),
  btnBack: $('#btn-back'),
  btnUndo: $('#btn-undo'),
  btnNext: $('#btn-next'),
  btnRestart: $('#btn-restart'),
  btnDownloadLog: $('#btn-download-log'),
  // Dashboard
  dashboard: $('#dashboard'),
  toggleDashboard: $('#toggle-dashboard'),
  btnDashBack: $('#btn-dash-back'),
  dashIncidents: $('#dashboard-incidents'),
  // Onboarding
  onboarding: $('#onboarding'),
  btnOnboardingNext: $('.onboarding-next'),
  btnOnboardingSkip: $('.onboarding-skip'),
  // Simulation
  toggleSim: $('#toggle-sim'),
};

// ── State ──────────────────────────────────────────────────
let state = {
  activeCrisis: null,
  currentStep: 0,
  completedSteps: [],
  actionLogs: [],
  timerInterval: null,
  timerValue: 0,
  isSimMode: false,
  onboardingStep: 0
};

// ── Render Crisis Cards ────────────────────────────────────
function renderCrisisGrid() {
  dom.crisisGrid.innerHTML = CRISIS_DATA.map(c => `
    <div class="crisis-card" data-crisis="${c.id}" style="--card-accent: ${c.accentColor}; --card-icon-bg: ${c.accentColor}22;">
      <div class="crisis-card__icon"><i class="${c.icon}"></i></div>
      <div class="crisis-card__title">${c.title}</div>
      <div class="crisis-card__desc">${c.desc}</div>
      <div class="crisis-card__meta">
        <span><i class="ph-bold ph-list-numbers"></i> ${c.stepCount} Steps</span>
        <span><i class="ph-bold ph-gauge"></i> ${capitalize(c.severity)}</span>
      </div>
    </div>
  `).join('');

  // Attach click handlers
  $$('.crisis-card').forEach(card => {
    card.addEventListener('click', () => {
      const crisis = CRISIS_DATA.find(c => c.id === card.dataset.crisis);
      if (crisis) startCrisis(crisis);
    });
  });
}

// ── Search ─────────────────────────────────────────────────
function initSearch() {
  dom.crisisSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    $$('.crisis-card').forEach(card => {
      const crisis = CRISIS_DATA.find(c => c.id === card.dataset.crisis);
      const match = crisis.title.toLowerCase().includes(q) || crisis.desc.toLowerCase().includes(q);
      card.classList.toggle('hidden', !match);
    });
  });
}

// ── Start Crisis Navigation ────────────────────────────────
function startCrisis(crisis) {
  state.activeCrisis = crisis;
  state.currentStep = 0;
  state.completedSteps = [];
  state.actionLogs = [];

  // Hide hero & categories, show navigator
  dom.hero.style.display = 'none';
  dom.howItWorks.style.display = 'none';
  dom.categories.style.display = 'none';
  dom.navigator.style.display = 'block';

  // Set top bar
  dom.navCrisisName.textContent = crisis.title;
  dom.navSeverity.textContent = capitalize(crisis.severity);
  dom.navSeverity.className = 'navigator__severity ' + crisis.severity;

  // Set severity ring
  updateSeverityRing(crisis.severity);

  // Render sidebar lists
  renderContacts(crisis.contacts);
  renderDocuments(crisis.documents);
  renderMistakes(crisis.mistakes);

  // Companion greeting
  say(`Stay calm. We are now in the ${crisis.title} protocol. I will guide you through each step.`);

  // Reset action log
  dom.actionLog.innerHTML = '<li class="action-log__empty">No actions yet. Start completing steps.</li>';

  // Show first step
  showStep(0);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Show Step ──────────────────────────────────────────────
function showStep(index) {
  const crisis = state.activeCrisis;
  const step = crisis.steps[index];
  const total = crisis.steps.length;

  // Show step navigator, hide completion
  dom.stepNavigator.style.display = 'block';
  dom.completionCard.style.display = 'none';

  // Re-trigger animation
  dom.stepNavigator.style.animation = 'none';
  dom.stepNavigator.offsetHeight; // reflow
  dom.stepNavigator.style.animation = '';

  // Update content
  dom.stepNum.textContent = `Step ${index + 1} of ${total}`;
  dom.stepTitle.textContent = step.title;
  dom.stepDesc.textContent = step.desc;

  // Warning
  if (step.warning) {
    dom.stepWarning.style.display = 'flex';
    dom.stepWarningText.textContent = step.warning;
  } else {
    dom.stepWarning.style.display = 'none';
  }

  // Timer
  clearInterval(state.timerInterval);
  if (step.timer) {
    state.timerValue = step.timer;
    dom.stepTimer.textContent = formatTime(state.timerValue);
    dom.stepTimer.style.display = 'inline';
    state.timerInterval = setInterval(() => {
      state.timerValue--;
      dom.stepTimer.textContent = formatTime(state.timerValue);
      if (state.timerValue <= 0) {
        clearInterval(state.timerInterval);
        dom.stepTimer.textContent = '⏰ Time!';
        dom.stepTimer.style.color = 'var(--accent-red)';
      }
    }, 1000);
  } else {
    dom.stepTimer.style.display = 'none';
    dom.stepTimer.style.color = '';
  }

  // Progress bar
  const progress = ((state.completedSteps.length) / total) * 100;
  dom.progressFill.style.width = progress + '%';
  dom.progressLabel.textContent = `Step ${index + 1} / ${total}`;

  // Undo button
  dom.btnUndo.disabled = state.completedSteps.length === 0;

  // Next button text
  if (index === total - 1) {
    dom.btnNext.innerHTML = '<i class="ph-bold ph-flag-checkered"></i> Complete';
  } else {
    dom.btnNext.innerHTML = '<i class="ph-bold ph-check-circle"></i> Mark Done & Next';
  }

  // Auto-read if TTS was active or first step
  if (index === 0) {
    setTimeout(() => say(`Step 1: ${step.title}. ${step.desc}`), 1000);
  }
}

// ── Complete Step ──────────────────────────────────────────
function completeStep() {
  const crisis = state.activeCrisis;
  const step = crisis.steps[state.currentStep];

  // Log action
  state.completedSteps.push(state.currentStep);
  state.actionLogs.push({
    step: state.currentStep + 1,
    title: step.title,
    time: new Date()
  });
  updateActionLog();

  // Move to next or complete
  if (state.currentStep + 1 >= crisis.steps.length) {
    showCompletion();
  } else {
    state.currentStep++;
    showStep(state.currentStep);
  }
}

// ── Undo Step ──────────────────────────────────────────────
function undoStep() {
  if (state.completedSteps.length === 0) return;
  state.completedSteps.pop();
  state.actionLogs.pop();
  state.currentStep = state.completedSteps.length > 0
    ? state.completedSteps[state.completedSteps.length - 1] + 1
    : 0;

  // Edge: if we undo back to 0
  if (state.currentStep >= state.activeCrisis.steps.length) {
    state.currentStep = state.activeCrisis.steps.length - 1;
  }

  updateActionLog();
  showStep(state.currentStep);
}

// ── Show Completion ────────────────────────────────────────
function showCompletion() {
  clearInterval(state.timerInterval);
  dom.stepNavigator.style.display = 'none';
  dom.completionCard.style.display = 'block';

  // Full progress
  dom.progressFill.style.width = '100%';
  dom.progressLabel.textContent = 'All steps completed';
}

// ── Update Action Log ──────────────────────────────────────
function updateActionLog() {
  if (state.actionLogs.length === 0) {
    dom.actionLog.innerHTML = '<li class="action-log__empty">No actions yet. Start completing steps.</li>';
    return;
  }

  dom.actionLog.innerHTML = state.actionLogs.map(log => `
    <li>
      <span class="action-log__check"><i class="ph-bold ph-check"></i></span>
      <span class="action-log__text"><strong>Step ${log.step}:</strong> ${log.title}</span>
      <span class="action-log__time">${log.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
    </li>
  `).join('');

  // Scroll to bottom
  dom.actionLog.scrollTop = dom.actionLog.scrollHeight;
}

// ── Severity Ring ──────────────────────────────────────────
function updateSeverityRing(severity) {
  const config = SEVERITY_CONFIG[severity];
  dom.severityRingFill.style.strokeDashoffset = config.offset;
  dom.severityRingFill.style.stroke = config.color;
  dom.severityLabel.textContent = config.label;
  dom.severityLabel.style.color = config.color;
}

// ── Sidebar Renderers ──────────────────────────────────────
function renderContacts(contacts) {
  dom.contactsList.innerHTML = contacts.map(c => `
    <li><i class="ph-bold ph-phone"></i> <strong>${c.name}:</strong>&nbsp;${c.number}</li>
  `).join('');
}

function renderDocuments(docs) {
  dom.docsList.innerHTML = docs.map(d => `
    <li><i class="ph-bold ph-file-text"></i> ${d}</li>
  `).join('');
}

function renderMistakes(mistakes) {
  dom.mistakesList.innerHTML = mistakes.map(m => `
    <li><i class="ph-bold ph-x-circle"></i> ${m}</li>
  `).join('');
}

// ── Download Log ───────────────────────────────────────────
function downloadLog() {
  if (!state.activeCrisis || state.actionLogs.length === 0) return;

  const crisis = state.activeCrisis;
  let text = `CRISIS NAVIGATION LOG\n`;
  text += `${'='.repeat(50)}\n`;
  text += `Crisis Type: ${crisis.title}\n`;
  text += `Severity: ${capitalize(crisis.severity)}\n`;
  text += `Date: ${new Date().toLocaleDateString()}\n`;
  text += `${'='.repeat(50)}\n\n`;
  text += `COMPLETED ACTIONS:\n`;
  text += `${'-'.repeat(30)}\n`;

  state.actionLogs.forEach(log => {
    text += `[${log.time.toLocaleTimeString()}] Step ${log.step}: ${log.title}\n`;
  });

  text += `\n${'-'.repeat(30)}\n`;
  text += `Total Steps Completed: ${state.actionLogs.length} / ${crisis.steps.length}\n`;
  text += `\nEMERGENCY CONTACTS:\n`;
  crisis.contacts.forEach(c => {
    text += ` - ${c.name}: ${c.number}\n`;
  });

  text += `\nDOCUMENTS REQUIRED:\n`;
  crisis.documents.forEach(d => {
    text += ` - ${d}\n`;
  });

  text += `\n${'='.repeat(50)}\n`;
  text += `Generated by CrisisNav – Hack Horizon Prototype\n`;

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CrisisNav_Log_${crisis.id}_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Go Back to Categories ──────────────────────────────────
function goBack() {
  clearInterval(state.timerInterval);
  state.activeCrisis = null;
  state.currentStep = 0;
  state.completedSteps = [];
  state.actionLogs = [];

  dom.navigator.style.display = 'none';
  dom.hero.style.display = 'flex';
  dom.howItWorks.style.display = 'block';
  dom.categories.style.display = 'block';

  window.scrollTo({ top: dom.categories.offsetTop - 80, behavior: 'smooth' });
}

// ── Scroll to Categories ───────────────────────────────────
function scrollToCategories() {
  dom.categories.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Helpers ────────────────────────────────────────────────
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `⏱ ${m > 0 ? m + 'm ' : ''}${s}s`;
}

// ── Intersection Observer for scroll animations ────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  $$('.step-card, .crisis-card, .sidebar-panel').forEach(el => {
    el.classList.add('fade-in-target');
    observer.observe(el);
  });
}

// ── Human-Centric Features ──────────────────────────────────

// 1. Text-to-Speech
let isSpeaking = false;
function say(text) {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    isSpeaking = true;
    dom.btnTTS.querySelector('.soundwave').classList.add('active');
  };
  utterance.onend = () => {
    isSpeaking = false;
    dom.btnTTS.querySelector('.soundwave').classList.remove('active');
  };

  synth.speak(utterance);
}

// 2. Companion Bubbles
function sayCompanion(text, duration = 5000) {
  dom.companionBubble.textContent = text;
  dom.companion.classList.add('active');
  setTimeout(() => dom.companion.classList.remove('active'), duration);
}

// 3. SOS Simulation
function triggerSOS() {
  sayCompanion("Initiating Emergency SOS protocols...");
  showNotification("SOS: Sending your location to emergency contacts...", true);

  // Simulate GPS fetch
  setTimeout(() => {
    const lat = (Math.random() * 0.1 + 28.6).toFixed(4);
    const lng = (Math.random() * 0.1 + 77.2).toFixed(4);
    showNotification(`LOCATION SENT: Lat ${lat}, Lng ${lng}`, true);
    say("Your location has been broadcast to all emergency contacts and authorities.");
  }, 2000);
}

// 4. Medical ID
function openMedicalID() {
  // Load existing
  const saved = localStorage.getItem('crisis_medical_id');
  if (saved) {
    const data = JSON.parse(saved);
    const form = dom.formMedical;
    form.name.value = data.name || '';
    form.blood.value = data.blood || '';
    form.age.value = data.age || '';
    form.allergies.value = data.allergies || '';
    form.contact.value = data.contact || '';
  }
  dom.modalMedical.classList.add('active');
}

function saveMedicalID(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  localStorage.setItem('crisis_medical_id', JSON.stringify(data));

  dom.modalMedical.classList.remove('active');
  showNotification("Medical ID saved successfully.");
  sayCompanion("Your medical profile has been updated.");
}

// 5. High Contrast Toggle
function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  const isActive = document.body.classList.contains('high-contrast');
  dom.toggleContrast.innerHTML = isActive
    ? '<i class="ph-bold ph-eye-slash"></i> Normal Mode'
    : '<i class="ph-bold ph-eye"></i> High Contrast';

  showNotification(isActive ? "High Contrast Enabled" : "High Contrast Disabled");
}

// 6. Generic Notification
function showNotification(text, isSOS = false) {
  const notif = document.createElement('div');
  notif.className = `notif ${isSOS ? 'notif--sos' : ''}`;
  notif.innerHTML = `
    <i class="ph-bold ${isSOS ? 'ph-warning-circle' : 'ph-info'}"></i>
    <span>${text}</span>
  `;
  document.body.appendChild(notif);

  setTimeout(() => notif.classList.add('active'), 10);
  setTimeout(() => {
    notif.classList.remove('active');
    setTimeout(() => notif.remove(), 500);
  }, 4000);
}

// ── Event Listeners ────────────────────────────────────────
function initEvents() {
  dom.btnStartHero.addEventListener('click', scrollToCategories);
  dom.btnStartMain.addEventListener('click', scrollToCategories);
  dom.btnBack.addEventListener('click', goBack);
  dom.btnNext.addEventListener('click', completeStep);
  dom.btnUndo.addEventListener('click', undoStep);
  dom.btnRestart.addEventListener('click', goBack);
  dom.btnDownloadLog.addEventListener('click', downloadLog);

  // Human-centric listeners
  dom.btnSOS.addEventListener('click', triggerSOS);
  dom.btnMedical.addEventListener('click', openMedicalID);
  dom.modalMedical.querySelector('.modal__close').addEventListener('click', () => dom.modalMedical.classList.remove('active'));
  dom.modalMedical.querySelector('.modal__overlay').addEventListener('click', () => dom.modalMedical.classList.remove('active'));
  dom.formMedical.addEventListener('submit', saveMedicalID);
  dom.toggleContrast.addEventListener('click', toggleHighContrast);

  dom.btnTTS.addEventListener('click', () => {
    const step = state.activeCrisis.steps[state.currentStep];
    say(`${step.title}. ${step.desc}`);
  });

  dom.companion.addEventListener('click', () => {
    sayCompanion("I'm monitoring your status. Proceed with the current step.");
  });

  // Production Event Listeners
  dom.toggleDashboard.addEventListener('click', openDashboard);
  dom.btnDashBack.addEventListener('click', closeDashboard);
  dom.toggleSim.addEventListener('change', (e) => toggleSimulation(e.target.checked));

  if (dom.btnOnboardingNext) {
    dom.btnOnboardingNext.addEventListener('click', nextOnboarding);
    dom.btnOnboardingSkip.addEventListener('click', closeOnboarding);
  }
}

// ── Production Readiness Logic ──────────────────────────────

// 1. Industry Dashboard
function openDashboard() {
  dom.hero.style.display = 'none';
  dom.howItWorks.style.display = 'none';
  dom.categories.style.display = 'none';
  dom.navigator.style.display = 'none';
  dom.dashboard.style.display = 'block';

  renderMockIncidents();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeDashboard() {
  dom.dashboard.style.display = 'none';
  dom.hero.style.display = 'flex';
  dom.howItWorks.style.display = 'block';
  dom.categories.style.display = 'block';
}

function renderMockIncidents() {
  const mockIncidents = [
    { type: 'Fire', location: 'Section B-12', status: 'SOP In Progress', color: '#f43f5e' },
    { type: 'Medical', location: 'Warehouse 4', status: 'Paramedics Arrived', color: '#f97316' },
    { type: 'Chemical', location: 'Lab 2', status: 'Resolved', color: '#10b981' }
  ];

  dom.dashIncidents.innerHTML = mockIncidents.map(inc => `
    <div class="incident-item">
      <div class="incident-item__info">
        <div class="incident-item__dot" style="background: ${inc.color};"></div>
        <div>
          <div class="incident-item__name">${inc.type} Incident</div>
          <div class="incident-item__status">${inc.location}</div>
        </div>
      </div>
      <div class="incident-item__status">${inc.status}</div>
    </div>
  `).join('');
}

// 2. Simulation Mode
function toggleSimulation(active) {
  state.isSimMode = active;
  document.body.classList.toggle('sim-active', active);

  if (active) {
    showNotification("SIMULATION MODE ACTIVE: Follow steps under pressure.", true);
    say("Training simulation initiated. Please proceed with urgency.");
  } else {
    showNotification("Simulation deactivated.");
  }
}

// 3. Onboarding logic
function initOnboarding() {
  const seen = localStorage.getItem('crisis_onboarding_seen');
  if (!seen) {
    dom.onboarding.style.display = 'grid';
  }
}

function nextOnboarding() {
  closeOnboarding(); // Simple one-step onboarding for the hackathon
}

function closeOnboarding() {
  dom.onboarding.style.display = 'none';
  localStorage.setItem('crisis_onboarding_seen', 'true');
  sayCompanion("The tour is complete. You can now start navigating emergencies.");
}

// ── Add scroll animation styles ────────────────────────────
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in-target {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .fade-in-target.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}

// ── Init ───────────────────────────────────────────────────
function init() {
  addAnimationStyles();
  renderCrisisGrid();
  initSearch();
  initEvents();
  initOnboarding();
  // Delay observer to allow initial render
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initScrollAnimations();
    });
  });
}

document.addEventListener('DOMContentLoaded', init);

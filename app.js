/* ===========================================================
   Crisis Navigation System – Application Logic
   =========================================================== */

// ── State ──────────────────────────────────────────────────
let state = {
    crises: [],
    activeCrisis: null,
    currentStep: 0,
    actionLogs: []
};

// ── DOM Elements ───────────────────────────────────────────
const dom = {
    categoryGrid: document.getElementById('category-grid'),
    stepsList: document.getElementById('steps-list'),
    nextStepBtn: document.getElementById('next-step-btn'),
    currentStepMini: document.getElementById('current-step-mini'),
    activeStepsSection: document.getElementById('active-steps-section'),
    stepCountBadge: document.querySelector('.step-count-badge'),
    nextStepHint: document.getElementById('next-step-hint'),
    voiceBtn: document.getElementById('voice-btn'),
    // Modal
    recModal: document.getElementById('recommendation-modal'),
    recTitle: document.getElementById('rec-title'),
    recDesc: document.getElementById('rec-desc'),
    recSuggestion: document.getElementById('rec-suggestion'),
    btnApproveRec: document.getElementById('btn-approve-rec'),
    btnCancelRec: document.getElementById('btn-cancel-rec'),
    btnCloseRec: document.getElementById('close-recommendation')
};

// ── Initialization ─────────────────────────────────────────
async function init() {
    try {
        const response = await fetch('/api/crises');
        state.crises = await response.json();
        if (dom.categoryGrid) {
            renderCategories();
            startCrisis('fire'); // Start with fire by default for the demo
        }
    } catch (error) {
        console.error('Failed to fetch crisis data:', error);
        // Fallback for direct file opening
        state.crises = mockData;
        if (dom.categoryGrid) {
            renderCategories();
            startCrisis('fire');
        }
    }
    
    initEvents();
    loadGlobalProfile();
}

// ── Render Categories ──────────────────────────────────────
function renderCategories() {
    if (!dom.categoryGrid) return;
    dom.categoryGrid.innerHTML = state.crises.map(c => `
        <button class="category-btn ${c.id}" data-crisis="${c.id}">
            <div class="category-icon"><i class="${c.icon}"></i></div>
            <span>${c.title.split(' ')[0]}</span>
        </button>
    `).join('');
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => startCrisis(btn.dataset.crisis));
    });
}

// ── Start Crisis Protocol ──────────────────────────────────
function startCrisis(id) {
    const crisis = state.crises.find(c => c.id === id);
    if (!crisis) return;
    
    state.activeCrisis = crisis;
    state.currentStep = 0;
    state.actionLogs = [];
    
    updateUI();
}

// ── Update UI ──────────────────────────────────────────────
function updateUI() {
    if (!dom.stepCountBadge || !state.activeCrisis) return;
    const crisis = state.activeCrisis;
    const step = crisis.steps[state.currentStep];
    
    // Update labels
    dom.stepCountBadge.textContent = crisis.steps.length;
    dom.currentStepMini.textContent = `Step ${state.currentStep + 1}: ${step.title}`;
    
    // Update Next Step Button
    if (state.currentStep < crisis.steps.length - 1) {
        dom.nextStepBtn.style.display = 'flex';
        dom.nextStepHint.textContent = crisis.steps[state.currentStep + 1].title;
    } else {
        dom.nextStepBtn.innerHTML = '<span>Protocol Complete</span> <i class="ph-bold ph-check"></i>';
    }
    
    renderSteps();
}

// ── Render Steps ───────────────────────────────────────────
function renderSteps() {
    if (!dom.stepsList || !state.activeCrisis) return;
    const crisis = state.activeCrisis;
    
    dom.stepsList.innerHTML = crisis.steps.map((s, index) => {
        let statusClass = '';
        let iconClass = crisis.icon;
        
        if (index < state.currentStep) {
            statusClass = 'completed';
        } else if (index === state.currentStep) {
            statusClass = 'active';
        }
        
        // Custom icons based on step index for visual variety like in the image
        if (index === 1) iconClass = 'ph-fill ph-warning-octagon';
        if (index === 2) iconClass = 'ph-fill ph-drop';
        
        return `
            <div class="step-item ${statusClass}">
                <div class="step-status ${index === 1 ? 'warning' : index === 2 ? 'info' : ''}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="step-body">
                    <h4>${index + 1} ${s.title}</h4>
                    <p>${s.desc}</p>
                </div>
                <div class="step-check ${index < state.currentStep ? 'completed' : ''}">
                    ${index < state.currentStep ? '<i class="ph-bold ph-check"></i>' : '<div class="check-box"></div>'}
                </div>
            </div>
        `;
    }).join('');
}

// ── Voice Recognition ──────────────────────────────────────
let recognition = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        dom.voiceBtn.classList.add('active');
        console.log('Voice recognition started...');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Voice Input:', transcript);
        handleVoiceCommand(transcript);
        dom.voiceBtn.classList.remove('active');
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        dom.voiceBtn.classList.remove('active');
    };

    recognition.onend = () => {
        dom.voiceBtn.classList.remove('active');
    };
}

function handleVoiceCommand(text) {
    if (text.includes('fire')) {
        showSmartRecommendation('fire');
    } else if (text.includes('accident') || text.includes('car')) {
        showSmartRecommendation('accident');
    } else if (text.includes('chemical') || text.includes('leak')) {
        showSmartRecommendation('chemical');
    } else if (text.includes('medical') || text.includes('heart') || text.includes('ill')) {
        showSmartRecommendation('medical');
    } else {
        alert(`Command not recognized: "${text}". Try saying "There is a fire".`);
    }
}

// ── Smart Recommendations ──────────────────────────────────
function showSmartRecommendation(crisisId) {
    const crisis = state.crises.find(c => c.id === crisisId);
    if (!crisis) return;

    dom.recTitle.textContent = `${crisis.title} Detected`;
    dom.recDesc.textContent = `Based on your voice input, I recommend starting the ${crisis.title} protocol immediately.`;
    dom.recSuggestion.innerHTML = `
        <div style="display: flex; gap: 12px; align-items: center;">
            <div class="category-icon" style="background: ${crisis.accentColor || 'var(--primary-blue)'}; width: 32px; height: 32px; font-size: 14px;">
                <i class="${crisis.icon}"></i>
            </div>
            <div>
                <strong style="display: block; font-size: 0.9rem;">Suggested Flow: ${crisis.title}</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted)">Priority: High</span>
            </div>
        </div>
    `;

    dom.recModal.classList.add('active');

    // Approve
    dom.btnApproveRec.onclick = () => {
        startCrisis(crisisId);
        dom.recModal.classList.remove('active');
    };
}

// ── Event Handlers ─────────────────────────────────────────
function initEvents() {
    if (dom.nextStepBtn) {
        dom.nextStepBtn.addEventListener('click', () => {
            if (state.currentStep < state.activeCrisis.steps.length - 1) {
                state.currentStep++;
                updateUI();
            } else {
                alert('Emergency Protocol Successfully Completed!');
            }
        });
    }

    // Voice button
    if (dom.voiceBtn) {
        dom.voiceBtn.addEventListener('click', () => {
            if (recognition) {
                recognition.start();
            } else {
                alert('Speech Recognition is not supported in this browser.');
            }
        });
    }

    // Modal close
    [dom.btnCancelRec, dom.btnCloseRec].forEach(btn => {
        if (btn && dom.recModal) {
            btn.addEventListener('click', () => dom.recModal.classList.remove('active'));
        }
    });

    // Navigation Events
    document.querySelectorAll('.app-nav .nav-item').forEach(navBtn => {
        navBtn.addEventListener('click', (e) => {
            const spanText = navBtn.querySelector('span')?.textContent.trim();
            if (spanText === 'Home') window.location.href = 'index.html';
            else if (spanText === 'My Crisis') window.location.href = 'my-crises.html';
            else if (spanText === 'Reports') window.location.href = 'reports.html';
            else if (spanText === 'Settings') window.location.href = 'settings.html';
        });
    });
}

// ── Mock Data Fallback ─────────────────────────────────────
const mockData = [
  {
    id: 'fire',
    title: 'Fire Incident',
    icon: 'ph-fill ph-fire',
    steps: [
      { title: 'Sound the alarm & evacuate the area;', desc: 'Then call the fire dept..' },
      { title: 'No injuries? Close the gas valves;', desc: 'Use an extinguisher from safe distance' },
      { title: 'Don\'t use elevators', desc: 'Use only the stairs' }
    ]
  }
];

// ── Global Profile ─────────────────────────────────────────
function loadGlobalProfile() {
    // Check Auth State
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authButtons = document.getElementById('auth-buttons');
    const profilePicContainer = document.getElementById('profile-pic');
    
    if (authButtons && profilePicContainer) {
        if (isLoggedIn) {
            authButtons.style.display = 'none';
            profilePicContainer.style.display = 'block';
        } else {
            authButtons.style.display = 'flex';
            profilePicContainer.style.display = 'none';
        }
    }

    if (localStorage.getItem('showLoginToast') === 'true') {
        showToast('Access Granted', 'You have been successfully logged in.', 'success');
        localStorage.removeItem('showLoginToast');
    }

    // Load Photo
    const savedPic = localStorage.getItem('crisisnav_profile_pic');
    if (savedPic) {
        document.querySelectorAll('.profile-pic img').forEach(img => {
            img.src = savedPic;
        });
    }

    // Load Name
    const savedName = localStorage.getItem('crisisnav_profile_name');
    if (savedName) {
        document.querySelectorAll('.profile-display-name').forEach(el => {
            el.textContent = savedName;
        });
    }

    // Load Role
    const savedRole = localStorage.getItem('crisisnav_profile_role');
    if (savedRole) {
        document.querySelectorAll('.profile-display-role').forEach(el => {
            el.textContent = savedRole;
        });
    }

    // Make profile pics navigate to profile.html
    document.querySelectorAll('.profile-pic').forEach(pic => {
        pic.style.cursor = 'pointer';
        pic.onclick = () => {
            window.location.href = 'profile.html';
        };
    });
}

// ── Toast Notification System ──────────────────────────────
function showToast(title, message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    let iconClass = 'ph-fill ph-check-circle';
    let iconColor = '#10b981';
    
    if (type === 'error') {
        iconClass = 'ph-fill ph-warning-circle';
        iconColor = '#ef4444';
    } else if (type === 'info') {
        iconClass = 'ph-fill ph-info';
        iconColor = '#3b82f6';
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon" style="color: ${iconColor}"><i class="${iconClass}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

// Start the app
init();

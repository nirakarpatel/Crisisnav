/* ===========================================================
   Crisis Navigation System – Application Logic
   =========================================================== */
// ── Auth Guard ───────────────────────────────────────────────
(function checkAuthGuard() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const path = window.location.pathname.toLowerCase();
    const isAuthPage = path.includes('signin.html') || path.includes('signup.html');

    if (!isLoggedIn && !isAuthPage) {
        window.location.href = 'signin.html';
    }
})();

// ── State ──────────────────────────────────────────────────
let state = {
    crises: [],
    activeCrisis: null,
    currentStep: 0,
    actionLogs: [],
    protocolCompleted: false
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
    btnCloseRec: document.getElementById('close-recommendation'),
    // Navigation
    navItems: document.querySelectorAll('.nav-item'),
    profilePic: document.querySelector('.profile-pic'),
    menuToggle: document.getElementById('menu-toggle'),
    sideMenu: document.getElementById('side-menu'),
    menuOverlay: document.getElementById('menu-overlay'),
    themeToggle: document.getElementById('theme-toggle-btn'),
    crisisSearch: document.getElementById('crisis-search')
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
    initNavigation();
    initMenu();
    initTheme();
    loadGlobalProfile();
    checkOnboardingGuide();
}

// ── Theme Management ──────────────────────────────────────
function initTheme() {
    const savedTheme = localStorage.getItem('crisisnav_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (dom.themeToggle) {
        if (savedTheme === 'dark') dom.themeToggle.classList.add('on');
        dom.themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('crisisnav_theme', newTheme);
    
    if (dom.themeToggle) {
        dom.themeToggle.classList.toggle('on');
    }
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

    // Check if the previous crisis was completed
    if (state.activeCrisis && !state.protocolCompleted) {
        logActivity(`${state.activeCrisis.title}: steps not completed`, 'ph-fill ph-warning-octagon', 'warning');
    }

    state.activeCrisis = crisis;
    state.currentStep = 0;
    state.actionLogs = [];
    state.protocolCompleted = false;
    
    logActivity(`${crisis.title} started`, crisis.icon, crisis.id);
    
    // Add staggered class for automated entrance
    if (dom.stepsList) {
        dom.stepsList.classList.add('staggered');
        // Remove after animation completes to avoid re-triggering on every step update
        setTimeout(() => {
            dom.stepsList.classList.remove('staggered');
        }, crisis.steps.length * 150 + 500);
    }

    updateUI();
}

// ── Update UI ──────────────────────────────────────────────
function updateUI() {
    if (!dom.stepCountBadge || !state.activeCrisis) return;
    const crisis = state.activeCrisis;
    const step = crisis.steps[state.currentStep];
    
    // Update labels
    if (dom.stepCountBadge) dom.stepCountBadge.textContent = crisis.steps.length;
    if (dom.currentStepMini) dom.currentStepMini.textContent = `Step ${state.currentStep + 1}: ${step.title}`;
    
    // Update Next Step Button
    if (dom.nextStepBtn) {
        if (state.currentStep < crisis.steps.length - 1) {
            dom.nextStepBtn.style.display = 'flex';
            if (dom.nextStepHint) dom.nextStepHint.textContent = crisis.steps[state.currentStep + 1].title;
        } else {
            dom.nextStepBtn.innerHTML = '<span>Protocol Complete</span> <i class="ph-bold ph-check"></i>';
        }
    }
    
    renderSteps();
}

// ── Render Steps (Single Card Display) ──────────────────────
function renderSteps() {
    if (!dom.stepsList || !state.activeCrisis) return;
    const crisis = state.activeCrisis;
    const currentStepIndex = state.currentStep;
    const step = crisis.steps[currentStepIndex];
    
    // Create progress dots
    const dotsHtml = crisis.steps.map((_, i) => `
        <div class="progress-dot ${i === currentStepIndex ? 'active' : ''}"></div>
    `).join('');

    let typeClass = '';
    let iconClass = crisis.icon;
    
    // Pattern match icons for variety like original version
    if (currentStepIndex === 1) { 
        iconClass = 'ph-fill ph-warning-octagon';
        typeClass = 'warning';
    } else if (currentStepIndex === 2) {
        iconClass = 'ph-fill ph-drop';
        typeClass = 'info';
    } else if (crisis.id === 'fire') {
        typeClass = 'fire';
    }

    dom.stepsList.innerHTML = `
        <div class="step-progress-dots">
            ${dotsHtml}
        </div>
        <div class="step-card active">
            <div class="step-card-icon ${typeClass}">
                <i class="${iconClass}"></i>
            </div>
            <div class="step-card-body">
                <h3>${currentStepIndex + 1}. ${step.title}</h3>
                <p>${step.desc}</p>
            </div>
        </div>
    `;
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

// ── Search Logic ───────────────────────────────────────────
function handleSearch() {
    if (!dom.crisisSearch) return;
    const query = dom.crisisSearch.value.toLowerCase();
    const categories = document.querySelectorAll('.category-btn');
    
    categories.forEach(btn => {
        const title = btn.querySelector('span').textContent.toLowerCase();
        if (title.includes(query)) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    });
}

// ── Event Handlers ─────────────────────────────────────────
function initEvents() {
    // Search functionality
    if (dom.crisisSearch) {
        dom.crisisSearch.addEventListener('input', handleSearch);
    }
    
    if (dom.nextStepBtn) {
        dom.nextStepBtn.addEventListener('click', () => {
            if (state.currentStep < state.activeCrisis.steps.length - 1) {
                state.currentStep++;
                logActivity(`Step ${state.currentStep} completed`, 'ph-bold ph-check-circle', 'info');
                updateUI();
            } else {
                state.protocolCompleted = true;
                logActivity('Emergency protocol completed', 'ph-bold ph-crown', 'info');
                logHistory(`${state.activeCrisis.title} completed`, 'ph-bold ph-check-circle', 'success');
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
    [dom.btnApproveRec, dom.btnCancelRec, dom.btnCloseRec].forEach(btn => {
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


// ── Navigation Logic ───────────────────────────────────────
function initNavigation() {
    dom.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const label = item.querySelector('span').textContent.toLowerCase().trim();
            if (label === 'home') window.location.href = 'index.html';
            if (label === 'my crisis') window.location.href = 'my-crises.html';
            if (label === 'reports') window.location.href = 'reports.html';
            if (label === 'settings') window.location.href = 'settings.html';
        });
    });

    if (dom.profilePic) {
        dom.profilePic.style.cursor = 'pointer';
        dom.profilePic.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
}

// ── Side Menu Logic ────────────────────────────────────────
function initMenu() {
    if (!dom.menuToggle) return;

    dom.menuToggle.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
    });

    if (dom.menuOverlay) {
        dom.menuOverlay.addEventListener('click', () => {
            document.body.classList.remove('menu-open');
        });
    }
}


// ── Mock Data Fallback ─────────────────────────────────────
const mockData = [
  {
    id: 'fire',
    title: 'Fire Incident',
    icon: 'ph-fill ph-fire',
    desc: 'If you see smoke or fire.',
    severity: 'critical',
    accentColor: '#f43f5e',
    steps: [
      { title: 'Pull the Alarm', desc: 'Find the red box on the wall and pull the handle down hard.' },
      { title: 'Call for Help', desc: 'Call 911. Tell them your name and where the fire is.' },
      { title: 'Get Out Fast', desc: 'Walk quickly to the nearest door. Don\'t stop to pick up your things.' },
      { title: 'Meet at the Tree', desc: 'Go to the safe spot outside where everyone meets and stay there.' }
    ]
  },
  {
    id: 'accident',
    title: 'Workplace Accident',
    icon: 'ph-fill ph-warning-octagon',
    desc: 'If someone gets hurt or something breaks.',
    severity: 'high',
    accentColor: '#f59e0b',
    steps: [
      { title: 'Stop Everything', desc: 'Push the big red "STOP" button on the machine right away.' },
      { title: 'Tell a Grown-up', desc: 'Run and find a teacher or boss and tell them someone is hurt.' },
      { title: 'Stay Back', desc: 'Keep away from the broken machine so you don\'t get hurt too.' },
      { title: 'Wait for the Doctor', desc: 'Stay calm and wait for the ambulance to arrive.' }
    ]
  },
  {
    id: 'chemical',
    title: 'Chemical Leak',
    icon: 'ph-fill ph-flask',
    desc: 'If something smelly or sticky spills.',
    severity: 'critical',
    accentColor: '#8b5cf6',
    steps: [
      { title: 'Don\'t Touch It', desc: 'Stay away from the spill. Don\'t smell it or touch it!' },
      { title: 'Cover Your Nose', desc: 'Use your shirt or a mask to cover your mouth and nose.' },
      { title: 'Leave the Room', desc: 'Go outside where the air is fresh. Close the door behind you.' },
      { title: 'Wash Your Hands', desc: 'If anything touched your skin, wash it with lots of water.' }
    ]
  },
  {
    id: 'medical',
    title: 'Medical Emergency',
    icon: 'ph-fill ph-heartbeat',
    desc: 'If someone falls down or feels very sick.',
    severity: 'high',
    accentColor: '#f97316',
    steps: [
      { title: 'Check if they Wake Up', desc: 'Gently shake their shoulder and ask "Are you okay?".' },
      { title: 'Call 911', desc: 'Tell the person on the phone that someone is sick and needs a doctor.' },
      { title: 'Stay with Them', desc: 'Don\'t leave the person alone. Hold their hand and talk to them.' },
      { title: 'Open the Door', desc: 'Make sure the door is unlocked so the doctors can get in easily.' }
    ]
  }
];

// ── Global Profile ─────────────────────────────────────────
function loadGlobalProfile() {
    // Check Auth State
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authButtons = document.getElementById('auth-buttons');
    const profilePicContainer = document.getElementById('profile-pic');
    
    if (profilePicContainer) {
        if (isLoggedIn) {
            profilePicContainer.style.display = 'block';
            if (authButtons) authButtons.style.display = 'none';
        } else {
            profilePicContainer.style.display = 'none';
            if (authButtons) authButtons.style.display = 'flex';
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

// ── Activity Logging ───────────────────────────────────────
function logActivity(text, iconClass, type) {
    const activityList = document.querySelector('.activity-list');
    const sidebarList = document.getElementById('sidebar-activity-list');
    
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Ensure icon mapping is correct
    let icon = iconClass || 'ph-fill ph-info';
    if (type === 'fire' && !icon.includes('ph-')) icon = 'ph-fill ph-fire';

    const activityData = { text, icon, type, timeStr };
    
    // Persist Action Logs
    let logs = JSON.parse(localStorage.getItem('crisisnav_activity_logs') || '[]');
    logs.unshift(activityData);
    if (logs.length > 5) logs.pop();
    localStorage.setItem('crisisnav_activity_logs', JSON.stringify(logs));

    // 1. Update Main Activity List (if present)
    if (activityList) {
        renderActivityList(activityList, logs);
    }

    // 2. Update Sidebar Activity List (global)
    if (sidebarList) {
        renderSidebarActivity(sidebarList, logs);
    }
}

function renderActivityList(container, logs) {
    container.innerHTML = logs.map(log => `
        <div class="activity-item">
            <div class="activity-icon ${log.type || ''}" style="${log.type === 'info' ? 'background: var(--primary-blue)' : ''}">
                <i class="${log.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${log.text}</p>
                <span>${getCategoryLabel(log.type)}</span>
            </div>
            <span class="activity-time">${log.timeStr}</span>
        </div>
    `).join('');
}

function renderSidebarActivity(container, logs) {
    if (logs.length === 0) {
        container.innerHTML = '<div class="sidebar-activity-placeholder">No activities recorded in this session</div>';
        return;
    }
    
    container.innerHTML = logs.slice(0, 5).map(log => `
        <div class="sidebar-activity-item ${log.type || ''}">
            <div class="sidebar-activity-icon ${log.type || ''}">
                <i class="${log.icon}"></i>
            </div>
            <div class="sidebar-activity-info">
                <p>${log.text}</p>
                <span>${log.timeStr} • ${getCategoryLabel(log.type)}</span>
            </div>
        </div>
    `).join('');
}

function logHistory(text, icon, type) {
    logActivity(text, icon, type);
}

function loadSessionActivity() {
    const logs = JSON.parse(localStorage.getItem('crisisnav_activity_logs') || '[]');
    const activityList = document.querySelector('.activity-list');
    const sidebarList = document.getElementById('sidebar-activity-list');
    
    if (activityList && logs.length > 0) renderActivityList(activityList, logs);
    if (sidebarList) renderSidebarActivity(sidebarList, logs);
}

function getCategoryLabel(type) {
    if (type === 'fire') return 'Fire Safety';
    if (type === 'medical') return 'Medical Response';
    if (type === 'accident') return 'Traffic Safety';
    if (type === 'chemical') return 'Hazmat Safety';
    if (type === 'info') return 'System Alert';
    return 'General';
}

// ── Onboarding Guide ───────────────────────────────────────
function checkOnboardingGuide() {
    if (localStorage.getItem('showSignupGuide') === 'true') {
        const onboardModal = document.getElementById('onboard-modal');
        if (onboardModal) {
            onboardModal.classList.add('active');
            localStorage.removeItem('showSignupGuide');
        }
    }
}

// ── Multi-Step Page Tour Engine ──────────────────────────
class AppTour {
    constructor(pageName, steps) {
        this.pageName = pageName;
        this.steps = steps;
        this.currentStep = 0;
        
        // Run only for new users who haven't completed this page's tour
        if (localStorage.getItem('isNewUser') !== 'true') return;
        if (localStorage.getItem('tour_completed_' + pageName) === 'true') return;
        
        this.init();
    }
    
    init() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tour-overlay';
        
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tour-tooltip';
        this.tooltip.innerHTML = `
            <div class="tour-tooltip-content">
                <div class="tour-tooltip-icon"><i class="ph-fill ph-info"></i></div>
                <div class="tour-tooltip-text">
                    <h4>Feature Guide</h4>
                    <p id="tour-message"></p>
                    <div class="tour-tooltip-footer">
                        <span class="tour-steps-indicator" id="tour-indicator"></span>
                        <button class="tour-next-btn" id="tour-next-btn">Next</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.tooltip);
        
        document.getElementById('tour-next-btn').addEventListener('click', () => this.nextStep());
        
        // Wait briefly for page to settle
        setTimeout(() => this.showStep(), 1200);
    }
    
    showStep() {
        if (this.currentTarget) {
            this.currentTarget.classList.remove('tour-target');
        }
        
        if (this.currentStep >= this.steps.length) {
            this.finish();
            return;
        }
        
        const step = this.steps[this.currentStep];
        const elements = document.querySelectorAll(step.selector);
        this.currentTarget = elements[step.index || 0];
        
        if (!this.currentTarget) {
            // Skip if element not found
            this.currentStep++;
            this.showStep();
            return;
        }
        
        this.overlay.classList.add('active');
        this.currentTarget.classList.add('tour-target');
        
        // Calculate offset to ensure it's comfortably in view
        const elementRect = this.currentTarget.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
        window.scrollTo({ top: middle, behavior: 'smooth' });
        
        document.getElementById('tour-message').textContent = step.message;
        document.getElementById('tour-indicator').textContent = `${this.currentStep + 1} of ${this.steps.length}`;
        document.getElementById('tour-next-btn').textContent = this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next';
        
        this.tooltip.classList.remove('visible');
        
        setTimeout(() => {
            const rect = this.currentTarget.getBoundingClientRect();
            // Default position (bottom)
            let top = rect.bottom + window.scrollY + 15;
            let left = rect.left + window.scrollX;
            
            // Boundary checks
            if (left + 280 > window.innerWidth) {
                left = window.innerWidth - 300;
            }
            if (top + 150 > window.scrollY + window.innerHeight) {
                top = rect.top + window.scrollY - 160; // place above
            }
            
            this.tooltip.style.top = top + 'px';
            this.tooltip.style.left = Math.max(10, left) + 'px';
            this.tooltip.classList.add('visible');
        }, 400);
    }
    
    nextStep() {
        this.tooltip.classList.remove('visible');
        this.currentStep++;
        setTimeout(() => this.showStep(), 300);
    }
    
    finish() {
        this.overlay.classList.remove('active');
        this.tooltip.classList.remove('visible');
        if (this.currentTarget) {
            this.currentTarget.classList.remove('tour-target');
        }
        localStorage.setItem('tour_completed_' + this.pageName, 'true');
        
        setTimeout(() => {
            if (this.overlay.parentNode) this.overlay.remove();
            if (this.tooltip.parentNode) this.tooltip.remove();
        }, 400);
    }
}

const pageTours = {
    'index.html': [
        { selector: '#crisis-search', message: 'Search for any crisis protocol quickly right here.' },
        { selector: '.category-grid', message: 'Tap a main category to instantly start an emergency workflow.' },
        { selector: '.steps-section', message: 'View your actively tracked crisis steps and progress here.' },
        { selector: '#voice-btn', message: 'Use voice commands for hands-free incident reporting.' }
    ],
    'my-crises.html': [
        { selector: '.activity-section', index: 0, message: 'Track your ongoing active emergencies here.' },
        { selector: '.activity-section', index: 1, message: 'Review your resolved past incidents.' }
    ],
    'reports.html': [
        { selector: '.next-step-btn', message: 'Generate comprehensive PDF reports of your incidents.' },
        { selector: '.activity-list', message: 'Download previously generated reports.' },
        { selector: '.steps-section', message: 'Check your year-to-date response analytics.' }
    ],
    'settings.html': [
        { selector: '.setting-group', index: 1, message: 'Configure critical push and audio notifications.' },
        { selector: '.setting-group', index: 2, message: 'Manage your trusted emergency contacts and location sharing.' }
    ],
    'profile.html': [
        { selector: '.profile-img-container', message: 'Tap here to upload a new profile picture.' },
        { selector: '#profile-form', message: 'Ensure your personal details and blood group are up to date.' },
        { selector: '.save-btn', message: 'Save your personal and medical information securely.' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    let filename = location.pathname.split('/').pop() || 'index.html';
    // Handle root path mapping 
    if (filename === '' || filename === '/') filename = 'index.html';
    
    if (pageTours[filename]) {
        // init() is async, so the modal might not have the 'active' class yet during DOMContentLoaded.
        // We check the raw localStorage key to accurately determine if the welcome modal WILL show.
        const willShowWelcomeModal = (filename === 'index.html' && localStorage.getItem('showSignupGuide') === 'true');

        if (willShowWelcomeModal) {
            // The welcome modal will be shown. Wait for the user to close it.
            const modal = document.getElementById('onboard-modal');
            if (modal) {
                const modalBtns = modal.querySelectorAll('button');
                modalBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        // Small delay to let modal closing animation finish
                        setTimeout(() => new AppTour(filename, pageTours[filename]), 300);
                    });
                });
            }
        } else {
            // Start normally
            new AppTour(filename, pageTours[filename]);
        }
    }
});

// Start the app
init();
loadSessionActivity();

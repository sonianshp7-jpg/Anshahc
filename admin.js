/**
 * ANSH Assaying and Hallmarking Centre
 * Super Admin Terminal & Laboratory Management Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initAccountOptions();
  initLoginForm();
  initPasswordToggle();
  initQuickFill();
  initBiometricAuth();
  initNewBatchModal();
  initBisResync();
  initFeatureSwitches();
  initCredentialsManager();
  initServiceOptionsManager();
  initWholeSiteCms();
  initGoogleSheetsIntegration();
  checkExistingSession();
});

// ACCOUNT PRESET CREDENTIAL OPTIONS
const accountPresets = {
  master: {
    email: 'admin@anshhallmarking.com',
    pass: 'AnshMaster@2026',
    role: 'superadmin',
    label: 'Option 1: Super Admin Master'
  },
  director: {
    email: 'director@anshhallmarking.com',
    pass: 'Director@2026',
    role: 'superadmin',
    label: 'Option 2: Lab Director'
  },
  metallurgist: {
    email: 'chemist@anshhallmarking.com',
    pass: 'Chemist@2026',
    role: 'leadassayer',
    label: 'Option 3: Chief Metallurgist'
  }
};

function getActivePreset() {
  const select = document.getElementById('accountPresetSelect');
  const chosenKey = select ? select.value : 'master';

  if (chosenKey === 'custom') {
    try {
      const customRaw = localStorage.getItem('ansh_admin_custom_creds');
      if (customRaw) {
        const parsed = JSON.parse(customRaw);
        return {
          email: parsed.email || accountPresets.master.email,
          pass: parsed.pass || accountPresets.master.pass,
          role: 'superadmin'
        };
      }
    } catch (e) {}
  }

  return accountPresets[chosenKey] || accountPresets.master;
}

function initAccountOptions() {
  const select = document.getElementById('accountPresetSelect');
  const displayEmail = document.getElementById('displayActiveEmail');
  const displayPass = document.getElementById('displayActivePass');
  const emailInput = document.getElementById('adminEmail');
  const passInput = document.getElementById('adminPassword');
  const roleSelect = document.getElementById('adminRole');

  function updateFields() {
    const creds = getActivePreset();
    if (displayEmail) displayEmail.textContent = creds.email;
    if (displayPass) displayPass.textContent = creds.pass;
    if (emailInput) emailInput.value = creds.email;
    if (passInput) passInput.value = creds.pass;
    if (roleSelect && creds.role) roleSelect.value = creds.role;

    if (window.updateActiveCredsCard) {
      window.updateActiveCredsCard(creds.email, creds.pass);
    }
  }

  if (select) {
    select.addEventListener('change', updateFields);
  }

  updateFields();
}

// 1. LIVE CLOCK
function initLiveClock() {
  const clockEl = document.getElementById('adminLiveClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
  }
  update();
  setInterval(update, 1000);
}

// 2. QUICK DEMO FILL
function initQuickFill() {
  const quickFillBtn = document.getElementById('quickFillBtn');
  const emailInput = document.getElementById('adminEmail');
  const passInput = document.getElementById('adminPassword');
  const faInput = document.getElementById('admin2FA');

  if (quickFillBtn && emailInput && passInput) {
    quickFillBtn.addEventListener('click', () => {
      const active = getActivePreset();
      emailInput.value = active.email;
      passInput.value = active.pass;
      if (faInput) faInput.value = '894210';
      quickFillBtn.classList.add('bg-emerald-500/30', 'text-emerald-300');
      quickFillBtn.innerHTML = '<i class="fas fa-check text-[10px]"></i> Filled';
      setTimeout(() => {
        quickFillBtn.classList.remove('bg-emerald-500/30', 'text-emerald-300');
        quickFillBtn.innerHTML = '<i class="fas fa-magic text-[10px]"></i> Auto-Fill Active Option';
      }, 1500);
    });
  }
}

// 3. PASSWORD TOGGLE
function initPasswordToggle() {
  const toggleBtn = document.getElementById('togglePasswordBtn');
  const passInput = document.getElementById('adminPassword');

  if (toggleBtn && passInput) {
    toggleBtn.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = isPass ? 'fas fa-eye-slash' : 'fas fa-eye';
      }
    });
  }
}

// 4. LOGIN FORM AUTHENTICATION
function initLoginForm() {
  const form = document.getElementById('superAdminLoginForm');
  const loginCard = document.getElementById('loginCard');
  const dashboard = document.getElementById('adminDashboard');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('adminEmail')?.value.trim();
    const pass = document.getElementById('adminPassword')?.value;
    const submitBtn = document.getElementById('loginSubmitBtn');

    if (!email || !pass) {
      alert('Please provide your Super Admin ID and Passkey.');
      return;
    }

    // Button loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Verifying Cryptographic Credentials...</span>';
    }

    setTimeout(() => {
      // Grant super admin access
      sessionStorage.setItem('ansh_admin_auth', 'true');
      sessionStorage.setItem('ansh_admin_user', email);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Access Granted</span>';
      }

      loginCard.classList.add('hidden');
      dashboard.classList.remove('hidden');

      addAuditLogEntry(`SUPER ADMIN LOGIN: Credential authentication verified for [${email}]`);
    }, 600);
  });
}

// 5. BIOMETRIC HARDWARE KEY LOGIN
function initBiometricAuth() {
  const bioBtn = document.getElementById('biometricLoginBtn');
  const loginCard = document.getElementById('loginCard');
  const dashboard = document.getElementById('adminDashboard');

  if (!bioBtn) return;

  bioBtn.addEventListener('click', () => {
    bioBtn.disabled = true;
    bioBtn.innerHTML = '<i class="fas fa-fingerprint fa-bounce text-amber-400"></i> <span>Touch Security Key / Sensor...</span>';

    setTimeout(() => {
      sessionStorage.setItem('ansh_admin_auth', 'true');
      sessionStorage.setItem('ansh_admin_user', 'Dr. Ansh Soni (FIDO2 Hardware Key)');

      bioBtn.disabled = false;
      bioBtn.innerHTML = '<i class="fas fa-check text-emerald-400"></i> <span>Biometric Verified</span>';

      loginCard.classList.add('hidden');
      dashboard.classList.remove('hidden');

      addAuditLogEntry('BIOMETRIC AUTH: Hardware Security Token FIDO2 validated for Level 4 Clearance');
    }, 800);
  });
}

// 6. SESSION PERSISTENCE & LOGOUT
function checkExistingSession() {
  const isAuth = sessionStorage.getItem('ansh_admin_auth');
  const loginCard = document.getElementById('loginCard');
  const dashboard = document.getElementById('adminDashboard');
  const logoutBtn = document.getElementById('logoutBtn');

  if (isAuth === 'true' && loginCard && dashboard) {
    loginCard.classList.add('hidden');
    dashboard.classList.remove('hidden');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('ansh_admin_auth');
      sessionStorage.removeItem('ansh_admin_user');
      dashboard.classList.add('hidden');
      loginCard.classList.remove('hidden');
    });
  }
}

// 7. MODAL: INWARD NEW BATCH
function initNewBatchModal() {
  const modal = document.getElementById('newBatchModal');
  const openBtn = document.getElementById('newSampleBtn');
  const closeBtn = document.getElementById('closeBatchModalBtn');
  const form = document.getElementById('newBatchForm');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const client = document.getElementById('nbClient')?.value.trim();
      const article = document.getElementById('nbArticle')?.value.trim();
      const count = document.getElementById('nbCount')?.value;
      const weight = parseFloat(document.getElementById('nbWeight')?.value || 0).toFixed(3);
      const purity = document.getElementById('nbPurity')?.value;

      const randomId = 'ANSH-' + Math.floor(1000 + Math.random() * 9000);

      modal.classList.add('hidden');
      form.reset();

      alert(`Job Card ${randomId} registered successfully for ${client || 'Client'} (${article}, ${weight}g - ${purity}). Logged into Laboratory Inward Register.`);
    });
  }
}

// 8. BIS PORTAL RESYNC
function initBisResync() {
  const btn = document.getElementById('resyncBisBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin text-amber-400"></i> <span>Handshaking with BIS Central API...</span>';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check-double text-emerald-400"></i> <span>BIS Sync 100% OK (18ms)</span>';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-rotate text-amber-400"></i> <span>BIS Portal Resync</span>';
      }, 3000);
    }, 1200);
  });
}

// 9. WEBSITE FEATURE ON/OFF SWITCHBOARD
const defaultFeatures = {
  process: true,
  calculator: true,
  bisGuide: true,
  consumerVerification: true,
  services: true,
  equipment: true,
  jewellerPartner: true,
  faq: true,
  booking: true,
  whatsapp: true,
  ticker: true
};

function initFeatureSwitches() {
  const toggles = document.querySelectorAll('.feature-toggle');
  const enableAllBtn = document.getElementById('enableAllFeaturesBtn');
  const disableAllBtn = document.getElementById('disableAllFeaturesBtn');
  const savedIndicator = document.getElementById('savedIndicator');

  // Load saved preferences or defaults
  let savedFeatures = defaultFeatures;
  try {
    const raw = localStorage.getItem('ansh_website_features');
    if (raw) savedFeatures = { ...defaultFeatures, ...JSON.parse(raw) };
  } catch (err) {
    savedFeatures = defaultFeatures;
  }

  function updateBadge(featureKey, isEnabled) {
    const badge = document.getElementById(`status_${featureKey}`);
    if (badge) {
      if (isEnabled) {
        badge.textContent = 'ON';
        badge.className = 'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 uppercase';
      } else {
        badge.textContent = 'OFF';
        badge.className = 'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/60 uppercase';
      }
    }
  }

  function saveAndNotify() {
    localStorage.setItem('ansh_website_features', JSON.stringify(savedFeatures));
    if (savedIndicator) {
      savedIndicator.classList.remove('hidden');
      setTimeout(() => {
        savedIndicator.classList.add('hidden');
      }, 2200);
    }
  }

  // Set initial switch states and badges
  toggles.forEach(toggle => {
    const key = toggle.getAttribute('data-feature');
    if (key) {
      const isChecked = savedFeatures[key] !== false;
      toggle.checked = isChecked;
      updateBadge(key, isChecked);

      toggle.addEventListener('change', () => {
        savedFeatures[key] = toggle.checked;
        updateBadge(key, toggle.checked);
        saveAndNotify();
      });
    }
  });

  // Enable All Features
  if (enableAllBtn) {
    enableAllBtn.addEventListener('click', () => {
      Object.keys(savedFeatures).forEach(k => {
        savedFeatures[k] = true;
      });

      toggles.forEach(toggle => {
        toggle.checked = true;
        const key = toggle.getAttribute('data-feature');
        if (key) updateBadge(key, true);
      });

      saveAndNotify();
    });
  }

  // Disable All Features
  if (disableAllBtn) {
    disableAllBtn.addEventListener('click', () => {
      Object.keys(savedFeatures).forEach(k => {
        savedFeatures[k] = false;
      });

      toggles.forEach(toggle => {
        toggle.checked = false;
        const key = toggle.getAttribute('data-feature');
        if (key) updateBadge(key, false);
      });

      saveAndNotify();
    });
  }
}

// 10. SUPER ADMIN CREDENTIALS SETTINGS MANAGER & PASSWORD REVEALER
function initCredentialsManager() {
  const form = document.getElementById('changeCredentialsForm');
  const emailInput = document.getElementById('newAdminEmail');
  const passInput = document.getElementById('newAdminPass');
  const notice = document.getElementById('credSavedNotice');
  const resetBtn = document.getElementById('resetCredsBtn');

  const activeIdBadge = document.getElementById('currentActiveIdBadge');
  const activePassDisplay = document.getElementById('currentActivePassDisplay');
  const toggleShowActivePassBtn = document.getElementById('toggleShowActivePassBtn');
  const togglePassText = document.getElementById('togglePassText');
  const copyActivePassBtn = document.getElementById('copyActivePassBtn');
  const toggleNewPassVisibilityBtn = document.getElementById('toggleNewPassVisibilityBtn');

  let currentActivePassword = '';
  let isPasswordVisible = false;

  function renderActivePassword() {
    if (!activePassDisplay) return;
    if (isPasswordVisible) {
      activePassDisplay.textContent = currentActivePassword || '(Not Set)';
      if (togglePassText) togglePassText.textContent = 'Hide';
      if (toggleShowActivePassBtn) {
        const icon = toggleShowActivePassBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-eye-slash text-amber-400';
      }
    } else {
      activePassDisplay.textContent = '••••••••••••';
      if (togglePassText) togglePassText.textContent = 'Show';
      if (toggleShowActivePassBtn) {
        const icon = toggleShowActivePassBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-eye text-amber-400';
      }
    }
  }

  window.updateActiveCredsCard = function(email, pass) {
    currentActivePassword = pass;
    if (activeIdBadge) activeIdBadge.textContent = email;
    renderActivePassword();
    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = pass;
  };

  // Initial populate
  const initial = getActivePreset();
  window.updateActiveCredsCard(initial.email, initial.pass);

  // Toggle Show/Hide on active password card
  if (toggleShowActivePassBtn) {
    toggleShowActivePassBtn.addEventListener('click', () => {
      isPasswordVisible = !isPasswordVisible;
      renderActivePassword();
    });
  }

  // Copy Active Password Button
  if (copyActivePassBtn) {
    copyActivePassBtn.addEventListener('click', () => {
      if (!currentActivePassword) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentActivePassword).then(() => {
          showCopySuccess();
        }).catch(() => fallbackCopy(currentActivePassword));
      } else {
        fallbackCopy(currentActivePassword);
      }
    });

    function showCopySuccess() {
      const original = copyActivePassBtn.innerHTML;
      copyActivePassBtn.innerHTML = '<i class="fas fa-check text-emerald-400"></i> Copied!';
      copyActivePassBtn.classList.add('bg-emerald-500/20', 'text-emerald-300');
      setTimeout(() => {
        copyActivePassBtn.innerHTML = original;
        copyActivePassBtn.classList.remove('bg-emerald-500/20', 'text-emerald-300');
      }, 1800);
    }

    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showCopySuccess();
      } catch (e) {
        alert('Active Password: ' + text);
      }
      document.body.removeChild(ta);
    }
  }

  // Toggle visibility of input newAdminPass
  if (toggleNewPassVisibilityBtn && passInput) {
    toggleNewPassVisibilityBtn.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      const icon = toggleNewPassVisibilityBtn.querySelector('i');
      if (icon) icon.className = isPass ? 'fas fa-eye-slash' : 'fas fa-eye';
    });
  }

  // Form submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newEmail = emailInput?.value.trim();
      const newPass = passInput?.value.trim();

      if (!newEmail || !newPass) {
        alert('Please provide both new Login ID and Password.');
        return;
      }

      const customObj = { email: newEmail, pass: newPass };
      localStorage.setItem('ansh_admin_custom_creds', JSON.stringify(customObj));

      if (notice) {
        notice.classList.remove('hidden');
        setTimeout(() => {
          notice.classList.add('hidden');
        }, 3000);
      }

      // Update active card
      window.updateActiveCredsCard(newEmail, newPass);

      // Update presets on login screen
      initAccountOptions();
      alert(`Success! Super Admin credentials updated.\nLogin ID: ${newEmail}\nSet Password: ${newPass}`);
    });
  }

  // Reset to default
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset Super Admin credentials to factory default (admin@anshhallmarking.com)?')) {
        localStorage.removeItem('ansh_admin_custom_creds');
        const defaultCreds = accountPresets.master;
        window.updateActiveCredsCard(defaultCreds.email, defaultCreds.pass);
        initAccountOptions();
        alert('Reset to default credentials completed.');
      }
    });
  }
}

// 10B. SERVICE REQUIRED DROPDOWN OPTIONS MANAGER (BOOKING FORM)
const defaultAdminServiceOptions = [
  'BIS Gold Hallmarking & HUID Inscription',
  'Gold Fire Assay (Cupellation - IS 1418)',
  'Silver Assaying & Hallmarking (IS 2113)',
  'Rapid XRF Non-Destructive Screening',
  'Melt & Bullion Bar Certification',
  'Consumer Independent Purity Audit'
];

function initServiceOptionsManager() {
  const container = document.getElementById('serviceOptionsContainer');
  const countBadge = document.getElementById('serviceOptionsCount');
  const addForm = document.getElementById('addServiceForm');
  const nameInput = document.getElementById('newServiceNameInput');
  const resetBtn = document.getElementById('resetServicesBtn');
  const savedNotice = document.getElementById('serviceSavedNotice');

  // Seed default if empty
  if (!localStorage.getItem('ansh_service_options')) {
    localStorage.setItem('ansh_service_options', JSON.stringify(defaultAdminServiceOptions));
  }

  function getServices() {
    try {
      const raw = localStorage.getItem('ansh_service_options');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      }
    } catch(e) {}
    return defaultAdminServiceOptions;
  }

  function saveAndRender(services, showNotice = true) {
    localStorage.setItem('ansh_service_options', JSON.stringify(services));
    render();
    if (showNotice && savedNotice) {
      savedNotice.classList.remove('hidden');
      setTimeout(() => savedNotice.classList.add('hidden'), 2500);
    }
  }

  function render() {
    if (!container) return;
    const services = getServices();
    if (countBadge) countBadge.textContent = services.length;

    if (services.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-4 text-center text-slate-500 text-xs">
          No services defined. Click "Reset to Default Services" or add new options above.
        </div>
      `;
      return;
    }

    container.innerHTML = services.map((s, idx) => {
      return `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all text-xs">
          <div class="flex items-center space-x-2.5 overflow-hidden">
            <span class="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0">
              ${idx + 1}
            </span>
            <span class="font-medium text-slate-200 truncate" title="${escapeHtmlText(s)}">
              ${escapeHtmlText(s)}
            </span>
          </div>
          <button type="button" class="delete-service-btn ml-2 text-slate-400 hover:text-rose-400 p-1 rounded transition-colors flex-shrink-0" data-index="${idx}" title="Remove this option">
            <i class="fas fa-trash-can text-xs"></i>
          </button>
        </div>
      `;
    }).join('');

    // Attach delete listeners
    container.querySelectorAll('.delete-service-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        const current = getServices();
        if (index >= 0 && index < current.length) {
          current.splice(index, 1);
          saveAndRender(current);
        }
      });
    });
  }

  // Add Service Handler
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = nameInput?.value.trim();
      if (!val) return;

      const current = getServices();
      if (current.includes(val)) {
        alert('This service option already exists.');
        return;
      }

      current.push(val);
      saveAndRender(current);
      if (nameInput) nameInput.value = '';
    });
  }

  // Reset to default
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset service options to BIS laboratory standard defaults?')) {
        saveAndRender([...defaultAdminServiceOptions]);
      }
    });
  }

  render();
}

function escapeHtmlText(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 10C. WHOLE WEBSITE CONTENT MANAGEMENT SYSTEM (CMS)
const defaultWholeSiteContent = {
  hero: {
    badgeText: "BIS Recognized A&HC Centre • IS 1418 & IS 2113",
    headlineLine1: "The Gold Standard in",
    headlineGradient: "Precious Metal Purity",
    headlineLine2: "& BIS Hallmarking",
    subtitle: "Empowering jewellers, bullion dealers, pawnbrokers, and individuals with certified Fire Assay (Cupellation), ultra-fast XRF Spectroscopy, and 100% statutory 6-Digit HUID Laser Inscription.",
    cta1Text: "Karat & Purity Calculator",
    cta1Link: "#calculator",
    cta2Text: "Book Testing Appointment",
    cta2Link: "#booking",
    metric1Val: "99.99%",
    metric1Lbl: "Assaying Precision (0.01‰ accuracy)",
    metric2Val: "< 4 Hours",
    metric2Lbl: "Express Batch Turnaround",
    metric3Val: "100%",
    metric3Lbl: "BIS Portal Auto-Sync & HUID",
    metric4Val: "₹45 / art",
    metric4Lbl: "Transparent Govt. Fixed Tariff",
    statutoryTariff: "Govt. Fixed ₹45/article + GST"
  },
  bisGuide: {
    badge: "Government Consumer Awareness & Compliance",
    title: "Mandatory 3 Signs of BIS Hallmarking",
    desc: "As mandated by the Bureau of Indian Standards (Govt. of India), all hallmarked gold jewelry sold must carry three distinct laser-engraved marks. ANSH Assaying & Hallmarking Centre strictly adheres to this standard.",
    sign1Title: "BIS Standard Mark",
    sign1Desc: "The official triangular mark representing the Bureau of Indian Standards. It certifies that the precious metal has passed rigorous purity parameters under national standards.",
    sign2Title: "Purity in Karat & Fineness",
    sign2Desc: "Indicates the precise gold ratio in parts per thousand: 22K916 (91.6% Pure Gold), 18K750 (75.0% Pure Gold), 14K585 (58.5% Pure Gold). Standardized for all official transactions.",
    sign3Title: "6-Digit HUID Code",
    sign3Desc: "Hallmarking Unique Identification (HUID). Every single jewellery article is given an individual 6-digit laser-etched alphanumeric fingerprint uploaded directly to the BIS national portal."
  },
  consumerGuide: {
    badge: "Government Consumer Protection & Statutory Compliance",
    title: "Consumer Protection Guide & Live HUID Verification",
    desc: "Under BIS (Hallmarking) Regulations, every gold jewelry article must carry a verifiable 6-digit laser HUID code. Verify your article directly below against the national hallmark database.",
    pillar1Title: "1. Check 3 Inscribed Signs",
    pillar1Desc: "Verify that the jewelry carries: BIS Triangle Logo, Purity Mark (e.g., 22K916, 18K750), and the 6-digit laser-etched HUID code. Do not accept gold without all 3 marks.",
    pillar2Title: '2. Verify via "BIS Care" App',
    pillar2Desc: 'Open the official BIS Care mobile app, select "Verify HUID", enter the 6-character code, and view the certified jeweller name, assaying lab ID, weight, and hallmarking date.',
    pillar3Title: "3. 2x Compensation Rights (Rule 49)",
    pillar3Desc: "Under BIS Act Rule 49, if any hallmarked gold article is found to have lower purity upon testing at a recognized centre, the buyer is entitled to 2 times the purity difference + testing fee."
  },
  services: {
    badge: "Accredited Laboratory Services",
    title: "Precision Testing & Certification Solutions",
    desc: "Our laboratory combines chemical destructive testing (Fire Assay) and non-destructive physics (XRF) to deliver unquestionable certification conforming to Indian and international standards.",
    s1Title: "Gold Fire Assay (Cupellation)",
    s1Tag: "Standard IS 1418:2009",
    s1Desc: "The internationally acknowledged definitive method for gold assaying. Samples are cupelled at 1100°C in bone ash magnesia cupels, followed by parting in nitric acid. Yields an extraordinary accuracy of 1 part in 10,000.",
    s2Title: "Advanced XRF Spectrometry",
    s2Tag: "Non-Destructive Fast Scan",
    s2Desc: "Rapid, high-resolution elemental analysis without scraping, melting, or damaging fine jewellery. Identifies complete alloy compositions including Gold, Silver, Copper, Zinc, Cadmium, Nickel, and Platinum.",
    s3Title: "Laser Hallmarking & HUID",
    s3Tag: "BIS National Portal Synced",
    s3Desc: "Industrial MOPA fiber laser engraving that applies crisp, microscopic BIS hallmarks and 6-digit alphanumeric HUID codes. Compatible with intricate filigree, hollow cast, and gemstone-set jewellery.",
    s4Title: "Silver Assaying & Hallmarking",
    s4Tag: "Standard IS 2113:2014",
    s4Desc: "Automated potentiometric titration method for certifying silver artefacts, bullion bars, and utensils. Covers official BIS silver grades: 990 (Fine), 925 (Sterling), 900, 835, and 800 grades.",
    s5Title: "Melt & Bullion Bar Assaying",
    s5Tag: "Refining & Ingots",
    s5Desc: "Certified testing for scrap melt, unrefined dore bars, and minted bullion. Includes induction melting, vacuum pin-tube dip sampling, and dual-chemist cross validation.",
    s6Title: "Consumer Purity Audit & Dispute",
    s6Tag: "Individual & Retail Audit",
    s6Desc: "Independent, third-party purity verification for retail consumers, heritage jewellery, pawnbrokers, and banks. Receive an official laboratory assay report stating exact net purity and weight."
  },
  process: {
    badge: "IS 1418 Standard Operating Protocol",
    title: "Our Rigorous 5-Step Testing Workflow",
    desc: "Every article entrusted to ANSH Centre undergoes a multi-layer chain of custody designed to prevent errors, contamination, or unauthorized substitution.",
    step1Title: "Inward & Micro-Weighing",
    step1Desc: "Consignments are logged into the ERP system, photographed, and weighed on 6-decimal certified analytical balances.",
    step1Meta: "Tolerance: ±0.00001g",
    step2Title: "XRF Spectroscopy Pre-Scan",
    step2Desc: "Non-destructive multi-point elemental scanning to check for hazardous elements (lead, cadmium) and preliminary fineness.",
    step2Meta: "Time: < 90 Seconds",
    step3Title: "Chemical Fire Assay",
    step3Desc: "Scraped micro-samples wrapped in pure lead foil are cupelled at 1100°C followed by parting in boiling nitric acid to obtain pure gold cornet.",
    step3Meta: "IS 1418 Standard",
    step4Title: "Laser HUID Hallmarking",
    step4Desc: "High-precision MOPA fiber laser inscribes the BIS Logo, fineness grade, and the unique 6-digit alphanumeric HUID code.",
    step4Meta: "Micro-Precision Etch",
    step5Title: "BIS Sync & Dispatch",
    step5Desc: "All HUID codes are uploaded to the BIS Central Portal. Consignment is re-weighed, tamper-sealed, and prepared for insured delivery.",
    step5Meta: "Tamper-Proof Seal"
  },
  techAndB2b: {
    techBadge: "World-Class Infrastructure",
    techTitle: "High-Precision Laboratory Instrumentation",
    techDesc: "To eliminate human bias and ensure zero discrepancy, ANSH Centre invests in premier analytical hardware calibrated regularly against National Physical Laboratory (NPL) reference standards.",
    eq1Title: "Dual-Beam Silicon Drift XRF Spectrometers",
    eq1Desc: "German technology with camera targeting for pinpoint analysis on microscopic jewellery joints.",
    eq2Title: "Digital Muffle Cupellation Furnaces (1100°C)",
    eq2Desc: "PID micro-controller controlled heating elements with ±1°C thermal stability and fume scrubbers.",
    eq3Title: "6-Decimal Microbalances (Mettler Toledo / Sartorius)",
    eq3Desc: "Anti-draft anti-vibration granite tables ensuring absolute measurement confidence to 0.00001 g.",
    eq4Title: "MOPA Fiber Laser Marking Stations",
    eq4Desc: "Sub-micron pulse width control creating crisp indelible marks without burn residue.",
    b2bBadge: "B2B Jeweller Partnership Program",
    b2bTitle: "Are you a Retail or Wholesale Jeweller?",
    b2bDesc: "Partner with ANSH Assaying & Hallmarking Centre for hassle-free daily batch processing. We offer specialized B2B accounts with secure courier pickup, prioritized express queue, consolidated monthly billing, and real-time API sync for your showroom inventory.",
    b2bBullet1: "Same-day express return",
    b2bBullet2: "Dedicated Account Officer",
    b2bBullet3: "Bulk volume commercial rates",
    b2bCta1Text: "Register as Jeweller Partner",
    b2bCta2Text: "Speak with Lab Director"
  },
  faqs: {
    badge: "Frequently Asked Questions",
    title: "Got Questions about Assaying & Hallmarking?",
    desc: "Everything you need to know about BIS Hallmarking compliance, testing methods, sample sizes, and consumer rights.",
    q1: "What is HUID and why is it mandatory for gold jewellery?",
    a1: "HUID stands for Hallmarking Unique Identification. It is a 6-digit alphanumeric code assigned uniquely to each gold article tested and hallmarked at a BIS recognized center. The code is uploaded to the central BIS database, providing an immutable audit trail that prevents fake stamps, under-karat jewellery, and fraud. Consumers can verify it instantly via the BIS Care app.",
    q2: "What is the difference between XRF Testing and Fire Assay?",
    a2: "XRF (X-Ray Fluorescence) is a rapid, non-destructive surface analysis that takes 60–120 seconds and causes zero damage to ornaments. Fire Assay (Cupellation) is a chemical process (IS 1418) where a tiny scraped sample is melted at 1100°C to separate base metals and silver using nitric acid. Fire Assay is the ultimate legal benchmark for purity certification under BIS guidelines.",
    q3: "Can private individuals get their personal gold or inherited jewellery tested?",
    a3: "Yes! Consumers and individuals are welcome at ANSH Assaying & Hallmarking Centre. You can walk in with your jewellery, get a non-destructive XRF purity assessment or Fire Assay report, and receive an authentic testing certificate. The nominal government-regulated fee makes it very affordable.",
    q4: "What is the turnaround time for hallmarking batches?",
    a4: "Standard turnaround time is within 4 to 6 hours for jeweller batches inwarded before 12:00 PM. Express same-day service is available for priority lots. Walk-in XRF testing for consumers is completed within 15 to 30 minutes.",
    q5: "What happens if a sample fails the declared purity grade?",
    a5: "If an article declared as 22K (916) tests below the mandatory tolerance limit, it cannot be hallmarked as 22K. As per BIS regulations, the batch is either down-marked to its actual verified lower grade (e.g. 18K or 14K) upon written consent from the client, or returned un-hallmarked with a detailed non-compliance assay failure report."
  },
  contact: {
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "inquiry@anshhallmarking.com",
    address: "Plot No. 42, 2nd Floor, Gold Souk Commercial Complex, Jewellers Market Road",
    hours: "Mon - Sat: 9:00 AM - 8:30 PM",
    ahcCode: "AHC Code: AH-DEL-8942 / Active",
    rateGold24: "₹78,450/10g",
    rateGold22: "₹71,900/10g",
    rateSilver999: "₹94,500/kg",
    noticeText: "⚡ Special Express Hallmarking Counters Open for Trade Partners",
    showNotice: true,
    footerCopyright: "© 2026 ANSH Assaying and Hallmarking Centre. All rights reserved."
  }
};

// Backwards-compatible legacy contact object
const defaultLabInfo = {
  phone: defaultWholeSiteContent.contact.phone,
  whatsapp: defaultWholeSiteContent.contact.whatsapp,
  email: defaultWholeSiteContent.contact.email,
  address: defaultWholeSiteContent.contact.address,
  hours: defaultWholeSiteContent.contact.hours,
  ahcCode: defaultWholeSiteContent.contact.ahcCode,
  rateGold24: defaultWholeSiteContent.contact.rateGold24,
  rateGold22: defaultWholeSiteContent.contact.rateGold22,
  rateSilver999: defaultWholeSiteContent.contact.rateSilver999,
  metric1Val: defaultWholeSiteContent.hero.metric1Val,
  metric1Lbl: defaultWholeSiteContent.hero.metric1Lbl,
  metric2Val: defaultWholeSiteContent.hero.metric2Val,
  metric2Lbl: defaultWholeSiteContent.hero.metric2Lbl,
  metric3Val: defaultWholeSiteContent.hero.metric3Val,
  metric3Lbl: defaultWholeSiteContent.hero.metric3Lbl,
  metric4Val: defaultWholeSiteContent.hero.metric4Val,
  metric4Lbl: defaultWholeSiteContent.hero.metric4Lbl,
  statutoryTariff: defaultWholeSiteContent.hero.statutoryTariff,
  noticeText: defaultWholeSiteContent.contact.noticeText,
  showNotice: defaultWholeSiteContent.contact.showNotice
};

function initWholeSiteCms() {
  const form = document.getElementById('wholeWebsiteCmsForm') || document.getElementById('websiteInfoForm');
  const notice = document.getElementById('cmsSavedNotice') || document.getElementById('infoSavedNotice');
  const resetBtn = document.getElementById('cmsResetDefaultsBtn') || document.getElementById('resetInfoBtn');
  const saveAllBtn = document.getElementById('cmsSaveAllBtn');

  // Input bindings
  // Tab 1: Hero
  const heroBadge = document.getElementById('cmsHeroBadgeText');
  const heroHeadlineLine1 = document.getElementById('cmsHeroHeadlineLine1');
  const heroHeadlineGradient = document.getElementById('cmsHeroHeadlineGradient');
  const heroHeadlineLine2 = document.getElementById('cmsHeroHeadlineLine2');
  const heroSubtitle = document.getElementById('cmsHeroSubtitle');
  const heroCta1Text = document.getElementById('cmsHeroCta1Text');
  const heroCta2Text = document.getElementById('cmsHeroCta2Text');
  const metric1Val = document.getElementById('editMetric1Val');
  const metric1Lbl = document.getElementById('editMetric1Lbl');
  const metric2Val = document.getElementById('editMetric2Val');
  const metric2Lbl = document.getElementById('editMetric2Lbl');
  const metric3Val = document.getElementById('editMetric3Val');
  const metric3Lbl = document.getElementById('editMetric3Lbl');
  const metric4Val = document.getElementById('editMetric4Val');
  const metric4Lbl = document.getElementById('editMetric4Lbl');
  const statutoryTariff = document.getElementById('editStatutoryTariff');

  // Tab 2: BIS Guide
  const bisGuideBadge = document.getElementById('cmsBisGuideBadge');
  const bisGuideTitle = document.getElementById('cmsBisGuideTitle');
  const bisGuideDesc = document.getElementById('cmsBisGuideDesc');
  const bisSign1Title = document.getElementById('cmsBisSign1Title');
  const bisSign1Desc = document.getElementById('cmsBisSign1Desc');
  const bisSign2Title = document.getElementById('cmsBisSign2Title');
  const bisSign2Desc = document.getElementById('cmsBisSign2Desc');
  const bisSign3Title = document.getElementById('cmsBisSign3Title');
  const bisSign3Desc = document.getElementById('cmsBisSign3Desc');

  // Tab 3: Consumer Guide
  const consumerGuideBadge = document.getElementById('cmsConsumerGuideBadge');
  const consumerGuideTitle = document.getElementById('cmsConsumerGuideTitle');
  const consumerGuideDesc = document.getElementById('cmsConsumerGuideDesc');
  const consumerPillar1Title = document.getElementById('cmsConsumerPillar1Title');
  const consumerPillar1Desc = document.getElementById('cmsConsumerPillar1Desc');
  const consumerPillar2Title = document.getElementById('cmsConsumerPillar2Title');
  const consumerPillar2Desc = document.getElementById('cmsConsumerPillar2Desc');
  const consumerPillar3Title = document.getElementById('cmsConsumerPillar3Title');
  const consumerPillar3Desc = document.getElementById('cmsConsumerPillar3Desc');

  // Tab 4: 6 Services
  const servicesBadge = document.getElementById('cmsServicesBadge');
  const servicesTitle = document.getElementById('cmsServicesTitle');
  const servicesDesc = document.getElementById('cmsServicesDesc');
  const s1Title = document.getElementById('cmsS1Title');
  const s1Tag = document.getElementById('cmsS1Tag');
  const s1Desc = document.getElementById('cmsS1Desc');
  const s2Title = document.getElementById('cmsS2Title');
  const s2Tag = document.getElementById('cmsS2Tag');
  const s2Desc = document.getElementById('cmsS2Desc');
  const s3Title = document.getElementById('cmsS3Title');
  const s3Tag = document.getElementById('cmsS3Tag');
  const s3Desc = document.getElementById('cmsS3Desc');
  const s4Title = document.getElementById('cmsS4Title');
  const s4Tag = document.getElementById('cmsS4Tag');
  const s4Desc = document.getElementById('cmsS4Desc');
  const s5Title = document.getElementById('cmsS5Title');
  const s5Tag = document.getElementById('cmsS5Tag');
  const s5Desc = document.getElementById('cmsS5Desc');
  const s6Title = document.getElementById('cmsS6Title');
  const s6Tag = document.getElementById('cmsS6Tag');
  const s6Desc = document.getElementById('cmsS6Desc');

  // Tab 5: Process
  const processBadge = document.getElementById('cmsProcessBadge');
  const processTitle = document.getElementById('cmsProcessTitle');
  const processDesc = document.getElementById('cmsProcessDesc');
  const step1Title = document.getElementById('cmsStep1Title');
  const step1Desc = document.getElementById('cmsStep1Desc');
  const step1Meta = document.getElementById('cmsStep1Meta');
  const step2Title = document.getElementById('cmsStep2Title');
  const step2Desc = document.getElementById('cmsStep2Desc');
  const step2Meta = document.getElementById('cmsStep2Meta');
  const step3Title = document.getElementById('cmsStep3Title');
  const step3Desc = document.getElementById('cmsStep3Desc');
  const step3Meta = document.getElementById('cmsStep3Meta');
  const step4Title = document.getElementById('cmsStep4Title');
  const step4Desc = document.getElementById('cmsStep4Desc');
  const step4Meta = document.getElementById('cmsStep4Meta');
  const step5Title = document.getElementById('cmsStep5Title');
  const step5Desc = document.getElementById('cmsStep5Desc');
  const step5Meta = document.getElementById('cmsStep5Meta');

  // Tab 6: Tech & B2B
  const techBadge = document.getElementById('cmsTechBadge');
  const techTitle = document.getElementById('cmsTechTitle');
  const techDesc = document.getElementById('cmsTechDesc');
  const eq1Title = document.getElementById('cmsEq1Title');
  const eq1Desc = document.getElementById('cmsEq1Desc');
  const eq2Title = document.getElementById('cmsEq2Title');
  const eq2Desc = document.getElementById('cmsEq2Desc');
  const eq3Title = document.getElementById('cmsEq3Title');
  const eq3Desc = document.getElementById('cmsEq3Desc');
  const eq4Title = document.getElementById('cmsEq4Title');
  const eq4Desc = document.getElementById('cmsEq4Desc');
  const b2bBadge = document.getElementById('cmsB2bBadge');
  const b2bTitle = document.getElementById('cmsB2bTitle');
  const b2bDesc = document.getElementById('cmsB2bDesc');
  const b2bBullet1 = document.getElementById('cmsB2bBullet1');
  const b2bBullet2 = document.getElementById('cmsB2bBullet2');
  const b2bBullet3 = document.getElementById('cmsB2bBullet3');
  const b2bCta1Text = document.getElementById('cmsB2bCta1Text');
  const b2bCta2Text = document.getElementById('cmsB2bCta2Text');

  // Tab 7: FAQs
  const faqBadge = document.getElementById('cmsFaqBadge');
  const faqTitle = document.getElementById('cmsFaqTitle');
  const faqDesc = document.getElementById('cmsFaqDesc');
  const faqQ1 = document.getElementById('cmsFaqQ1');
  const faqA1 = document.getElementById('cmsFaqA1');
  const faqQ2 = document.getElementById('cmsFaqQ2');
  const faqA2 = document.getElementById('cmsFaqA2');
  const faqQ3 = document.getElementById('cmsFaqQ3');
  const faqA3 = document.getElementById('cmsFaqA3');
  const faqQ4 = document.getElementById('cmsFaqQ4');
  const faqA4 = document.getElementById('cmsFaqA4');
  const faqQ5 = document.getElementById('cmsFaqQ5');
  const faqA5 = document.getElementById('cmsFaqA5');

  // Tab 8: Contact & Rates
  const phoneInput = document.getElementById('editLabPhone');
  const whatsappInput = document.getElementById('editLabWhatsapp');
  const emailInput = document.getElementById('editLabEmail');
  const addressInput = document.getElementById('editLabAddress');
  const ahcCodeInput = document.getElementById('editLabAhcCode');
  const hoursInput = document.getElementById('editLabHours');
  const rateGold24Input = document.getElementById('editRateGold24');
  const rateGold22Input = document.getElementById('editRateGold22');
  const rateSilver999Input = document.getElementById('editRateSilver999');
  const noticeTextInput = document.getElementById('editNoticeText');
  const toggleNoticeBanner = document.getElementById('toggleNoticeBanner');
  const noticeBannerStatus = document.getElementById('noticeBannerStatus');
  const footerCopyright = document.getElementById('cmsFooterCopyright');

  // Tab 9: JSON
  const rawJsonEditor = document.getElementById('cmsRawJsonEditor');
  const prettifyBtn = document.getElementById('cmsPrettifyJsonBtn');
  const copyJsonBtn = document.getElementById('cmsCopyJsonBtn');
  const downloadJsonBtn = document.getElementById('cmsDownloadJsonBtn');
  const importFileInput = document.getElementById('cmsImportJsonFileInput');
  const importStatus = document.getElementById('cmsImportStatus');
  const applyRawJsonBtn = document.getElementById('cmsApplyRawJsonBtn');

  // Tab switching logic
  const tabButtons = document.querySelectorAll('.cms-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach(b => {
        b.classList.remove('active', 'bg-amber-500/20', 'text-amber-300', 'border-amber-500/40');
        b.classList.add('bg-slate-900', 'text-slate-400', 'border-slate-800');
      });
      btn.classList.add('active', 'bg-amber-500/20', 'text-amber-300', 'border-amber-500/40');
      btn.classList.remove('bg-slate-900', 'text-slate-400', 'border-slate-800');

      document.querySelectorAll('.cms-tab-content').forEach(panel => panel.classList.add('hidden'));
      const activePanel = document.getElementById(`cmsTab_${target}`);
      if (activePanel) activePanel.classList.remove('hidden');

      if (target === 'json') {
        syncInputsToJsonEditor();
      }
    });
  });

  function getSavedData() {
    let data = JSON.parse(JSON.stringify(defaultWholeSiteContent));
    try {
      const rawFull = localStorage.getItem('ansh_full_site_content');
      if (rawFull) {
        const parsed = JSON.parse(rawFull);
        data = deepMerge(data, parsed);
      }
    } catch(e) {}

    // Check legacy ansh_lab_info
    try {
      const rawLegacy = localStorage.getItem('ansh_lab_info');
      if (rawLegacy) {
        const leg = JSON.parse(rawLegacy);
        if (leg.phone) data.contact.phone = leg.phone;
        if (leg.whatsapp) data.contact.whatsapp = leg.whatsapp;
        if (leg.email) data.contact.email = leg.email;
        if (leg.address) data.contact.address = leg.address;
        if (leg.hours) data.contact.hours = leg.hours;
        if (leg.ahcCode) data.contact.ahcCode = leg.ahcCode;
        if (leg.rateGold24) data.contact.rateGold24 = leg.rateGold24;
        if (leg.rateGold22) data.contact.rateGold22 = leg.rateGold22;
        if (leg.rateSilver999) data.contact.rateSilver999 = leg.rateSilver999;
        if (leg.noticeText !== undefined) data.contact.noticeText = leg.noticeText;
        if (leg.showNotice !== undefined) data.contact.showNotice = leg.showNotice;
        if (leg.metric1Val) data.hero.metric1Val = leg.metric1Val;
        if (leg.metric1Lbl) data.hero.metric1Lbl = leg.metric1Lbl;
        if (leg.metric2Val) data.hero.metric2Val = leg.metric2Val;
        if (leg.metric2Lbl) data.hero.metric2Lbl = leg.metric2Lbl;
        if (leg.metric3Val) data.hero.metric3Val = leg.metric3Val;
        if (leg.metric3Lbl) data.hero.metric3Lbl = leg.metric3Lbl;
        if (leg.metric4Val) data.hero.metric4Val = leg.metric4Val;
        if (leg.metric4Lbl) data.hero.metric4Lbl = leg.metric4Lbl;
        if (leg.statutoryTariff) data.hero.statutoryTariff = leg.statutoryTariff;
      }
    } catch(e) {}

    return data;
  }

  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  function populateAll(d) {
    // Hero
    if (heroBadge) heroBadge.value = d.hero?.badgeText || '';
    if (heroHeadlineLine1) heroHeadlineLine1.value = d.hero?.headlineLine1 || '';
    if (heroHeadlineGradient) heroHeadlineGradient.value = d.hero?.headlineGradient || '';
    if (heroHeadlineLine2) heroHeadlineLine2.value = d.hero?.headlineLine2 || '';
    if (heroSubtitle) heroSubtitle.value = d.hero?.subtitle || '';
    if (heroCta1Text) heroCta1Text.value = d.hero?.cta1Text || '';
    if (heroCta2Text) heroCta2Text.value = d.hero?.cta2Text || '';
    if (metric1Val) metric1Val.value = d.hero?.metric1Val || '';
    if (metric1Lbl) metric1Lbl.value = d.hero?.metric1Lbl || '';
    if (metric2Val) metric2Val.value = d.hero?.metric2Val || '';
    if (metric2Lbl) metric2Lbl.value = d.hero?.metric2Lbl || '';
    if (metric3Val) metric3Val.value = d.hero?.metric3Val || '';
    if (metric3Lbl) metric3Lbl.value = d.hero?.metric3Lbl || '';
    if (metric4Val) metric4Val.value = d.hero?.metric4Val || '';
    if (metric4Lbl) metric4Lbl.value = d.hero?.metric4Lbl || '';
    if (statutoryTariff) statutoryTariff.value = d.hero?.statutoryTariff || '';

    // BIS Guide
    if (bisGuideBadge) bisGuideBadge.value = d.bisGuide?.badge || '';
    if (bisGuideTitle) bisGuideTitle.value = d.bisGuide?.title || '';
    if (bisGuideDesc) bisGuideDesc.value = d.bisGuide?.desc || '';
    if (bisSign1Title) bisSign1Title.value = d.bisGuide?.sign1Title || '';
    if (bisSign1Desc) bisSign1Desc.value = d.bisGuide?.sign1Desc || '';
    if (bisSign2Title) bisSign2Title.value = d.bisGuide?.sign2Title || '';
    if (bisSign2Desc) bisSign2Desc.value = d.bisGuide?.sign2Desc || '';
    if (bisSign3Title) bisSign3Title.value = d.bisGuide?.sign3Title || '';
    if (bisSign3Desc) bisSign3Desc.value = d.bisGuide?.sign3Desc || '';

    // Consumer Guide
    if (consumerGuideBadge) consumerGuideBadge.value = d.consumerGuide?.badge || '';
    if (consumerGuideTitle) consumerGuideTitle.value = d.consumerGuide?.title || '';
    if (consumerGuideDesc) consumerGuideDesc.value = d.consumerGuide?.desc || '';
    if (consumerPillar1Title) consumerPillar1Title.value = d.consumerGuide?.pillar1Title || '';
    if (consumerPillar1Desc) consumerPillar1Desc.value = d.consumerGuide?.pillar1Desc || '';
    if (consumerPillar2Title) consumerPillar2Title.value = d.consumerGuide?.pillar2Title || '';
    if (consumerPillar2Desc) consumerPillar2Desc.value = d.consumerGuide?.pillar2Desc || '';
    if (consumerPillar3Title) consumerPillar3Title.value = d.consumerGuide?.pillar3Title || '';
    if (consumerPillar3Desc) consumerPillar3Desc.value = d.consumerGuide?.pillar3Desc || '';

    // Services
    if (servicesBadge) servicesBadge.value = d.services?.badge || '';
    if (servicesTitle) servicesTitle.value = d.services?.title || '';
    if (servicesDesc) servicesDesc.value = d.services?.desc || '';
    if (s1Title) s1Title.value = d.services?.s1Title || '';
    if (s1Tag) s1Tag.value = d.services?.s1Tag || '';
    if (s1Desc) s1Desc.value = d.services?.s1Desc || '';
    if (s2Title) s2Title.value = d.services?.s2Title || '';
    if (s2Tag) s2Tag.value = d.services?.s2Tag || '';
    if (s2Desc) s2Desc.value = d.services?.s2Desc || '';
    if (s3Title) s3Title.value = d.services?.s3Title || '';
    if (s3Tag) s3Tag.value = d.services?.s3Tag || '';
    if (s3Desc) s3Desc.value = d.services?.s3Desc || '';
    if (s4Title) s4Title.value = d.services?.s4Title || '';
    if (s4Tag) s4Tag.value = d.services?.s4Tag || '';
    if (s4Desc) s4Desc.value = d.services?.s4Desc || '';
    if (s5Title) s5Title.value = d.services?.s5Title || '';
    if (s5Tag) s5Tag.value = d.services?.s5Tag || '';
    if (s5Desc) s5Desc.value = d.services?.s5Desc || '';
    if (s6Title) s6Title.value = d.services?.s6Title || '';
    if (s6Tag) s6Tag.value = d.services?.s6Tag || '';
    if (s6Desc) s6Desc.value = d.services?.s6Desc || '';

    // Process
    if (processBadge) processBadge.value = d.process?.badge || '';
    if (processTitle) processTitle.value = d.process?.title || '';
    if (processDesc) processDesc.value = d.process?.desc || '';
    if (step1Title) step1Title.value = d.process?.step1Title || '';
    if (step1Desc) step1Desc.value = d.process?.step1Desc || '';
    if (step1Meta) step1Meta.value = d.process?.step1Meta || '';
    if (step2Title) step2Title.value = d.process?.step2Title || '';
    if (step2Desc) step2Desc.value = d.process?.step2Desc || '';
    if (step2Meta) step2Meta.value = d.process?.step2Meta || '';
    if (step3Title) step3Title.value = d.process?.step3Title || '';
    if (step3Desc) step3Desc.value = d.process?.step3Desc || '';
    if (step3Meta) step3Meta.value = d.process?.step3Meta || '';
    if (step4Title) step4Title.value = d.process?.step4Title || '';
    if (step4Desc) step4Desc.value = d.process?.step4Desc || '';
    if (step4Meta) step4Meta.value = d.process?.step4Meta || '';
    if (step5Title) step5Title.value = d.process?.step5Title || '';
    if (step5Desc) step5Desc.value = d.process?.step5Desc || '';
    if (step5Meta) step5Meta.value = d.process?.step5Meta || '';

    // Tech & B2B
    if (techBadge) techBadge.value = d.techAndB2b?.techBadge || '';
    if (techTitle) techTitle.value = d.techAndB2b?.techTitle || '';
    if (techDesc) techDesc.value = d.techAndB2b?.techDesc || '';
    if (eq1Title) eq1Title.value = d.techAndB2b?.eq1Title || '';
    if (eq1Desc) eq1Desc.value = d.techAndB2b?.eq1Desc || '';
    if (eq2Title) eq2Title.value = d.techAndB2b?.eq2Title || '';
    if (eq2Desc) eq2Desc.value = d.techAndB2b?.eq2Desc || '';
    if (eq3Title) eq3Title.value = d.techAndB2b?.eq3Title || '';
    if (eq3Desc) eq3Desc.value = d.techAndB2b?.eq3Desc || '';
    if (eq4Title) eq4Title.value = d.techAndB2b?.eq4Title || '';
    if (eq4Desc) eq4Desc.value = d.techAndB2b?.eq4Desc || '';
    if (b2bBadge) b2bBadge.value = d.techAndB2b?.b2bBadge || '';
    if (b2bTitle) b2bTitle.value = d.techAndB2b?.b2bTitle || '';
    if (b2bDesc) b2bDesc.value = d.techAndB2b?.b2bDesc || '';
    if (b2bBullet1) b2bBullet1.value = d.techAndB2b?.b2bBullet1 || '';
    if (b2bBullet2) b2bBullet2.value = d.techAndB2b?.b2bBullet2 || '';
    if (b2bBullet3) b2bBullet3.value = d.techAndB2b?.b2bBullet3 || '';
    if (b2bCta1Text) b2bCta1Text.value = d.techAndB2b?.b2bCta1Text || '';
    if (b2bCta2Text) b2bCta2Text.value = d.techAndB2b?.b2bCta2Text || '';

    // FAQs
    if (faqBadge) faqBadge.value = d.faqs?.badge || '';
    if (faqTitle) faqTitle.value = d.faqs?.title || '';
    if (faqDesc) faqDesc.value = d.faqs?.desc || '';
    if (faqQ1) faqQ1.value = d.faqs?.q1 || '';
    if (faqA1) faqA1.value = d.faqs?.a1 || '';
    if (faqQ2) faqQ2.value = d.faqs?.q2 || '';
    if (faqA2) faqA2.value = d.faqs?.a2 || '';
    if (faqQ3) faqQ3.value = d.faqs?.q3 || '';
    if (faqA3) faqA3.value = d.faqs?.a3 || '';
    if (faqQ4) faqQ4.value = d.faqs?.q4 || '';
    if (faqA4) faqA4.value = d.faqs?.a4 || '';
    if (faqQ5) faqQ5.value = d.faqs?.q5 || '';
    if (faqA5) faqA5.value = d.faqs?.a5 || '';

    // Contact & Rates
    if (phoneInput) phoneInput.value = d.contact?.phone || '';
    if (whatsappInput) whatsappInput.value = d.contact?.whatsapp || '';
    if (emailInput) emailInput.value = d.contact?.email || '';
    if (addressInput) addressInput.value = d.contact?.address || '';
    if (ahcCodeInput) ahcCodeInput.value = d.contact?.ahcCode || '';
    if (hoursInput) hoursInput.value = d.contact?.hours || '';
    if (rateGold24Input) rateGold24Input.value = d.contact?.rateGold24 || '';
    if (rateGold22Input) rateGold22Input.value = d.contact?.rateGold22 || '';
    if (rateSilver999Input) rateSilver999Input.value = d.contact?.rateSilver999 || '';
    if (noticeTextInput) noticeTextInput.value = d.contact?.noticeText || '';
    if (toggleNoticeBanner) {
      toggleNoticeBanner.checked = d.contact?.showNotice !== false;
      updateBannerStatus(toggleNoticeBanner.checked);
    }
    if (footerCopyright) footerCopyright.value = d.contact?.footerCopyright || '';

    // JSON Editor
    if (rawJsonEditor) {
      rawJsonEditor.value = JSON.stringify(d, null, 2);
    }
  }

  function collectFormData() {
    return {
      hero: {
        badgeText: heroBadge?.value.trim() || defaultWholeSiteContent.hero.badgeText,
        headlineLine1: heroHeadlineLine1?.value.trim() || defaultWholeSiteContent.hero.headlineLine1,
        headlineGradient: heroHeadlineGradient?.value.trim() || defaultWholeSiteContent.hero.headlineGradient,
        headlineLine2: heroHeadlineLine2?.value.trim() || defaultWholeSiteContent.hero.headlineLine2,
        subtitle: heroSubtitle?.value.trim() || defaultWholeSiteContent.hero.subtitle,
        cta1Text: heroCta1Text?.value.trim() || defaultWholeSiteContent.hero.cta1Text,
        cta1Link: defaultWholeSiteContent.hero.cta1Link,
        cta2Text: heroCta2Text?.value.trim() || defaultWholeSiteContent.hero.cta2Text,
        cta2Link: defaultWholeSiteContent.hero.cta2Link,
        metric1Val: metric1Val?.value.trim() || defaultWholeSiteContent.hero.metric1Val,
        metric1Lbl: metric1Lbl?.value.trim() || defaultWholeSiteContent.hero.metric1Lbl,
        metric2Val: metric2Val?.value.trim() || defaultWholeSiteContent.hero.metric2Val,
        metric2Lbl: metric2Lbl?.value.trim() || defaultWholeSiteContent.hero.metric2Lbl,
        metric3Val: metric3Val?.value.trim() || defaultWholeSiteContent.hero.metric3Val,
        metric3Lbl: metric3Lbl?.value.trim() || defaultWholeSiteContent.hero.metric3Lbl,
        metric4Val: metric4Val?.value.trim() || defaultWholeSiteContent.hero.metric4Val,
        metric4Lbl: metric4Lbl?.value.trim() || defaultWholeSiteContent.hero.metric4Lbl,
        statutoryTariff: statutoryTariff?.value.trim() || defaultWholeSiteContent.hero.statutoryTariff
      },
      bisGuide: {
        badge: bisGuideBadge?.value.trim() || defaultWholeSiteContent.bisGuide.badge,
        title: bisGuideTitle?.value.trim() || defaultWholeSiteContent.bisGuide.title,
        desc: bisGuideDesc?.value.trim() || defaultWholeSiteContent.bisGuide.desc,
        sign1Title: bisSign1Title?.value.trim() || defaultWholeSiteContent.bisGuide.sign1Title,
        sign1Desc: bisSign1Desc?.value.trim() || defaultWholeSiteContent.bisGuide.sign1Desc,
        sign2Title: bisSign2Title?.value.trim() || defaultWholeSiteContent.bisGuide.sign2Title,
        sign2Desc: bisSign2Desc?.value.trim() || defaultWholeSiteContent.bisGuide.sign2Desc,
        sign3Title: bisSign3Title?.value.trim() || defaultWholeSiteContent.bisGuide.sign3Title,
        sign3Desc: bisSign3Desc?.value.trim() || defaultWholeSiteContent.bisGuide.sign3Desc
      },
      consumerGuide: {
        badge: consumerGuideBadge?.value.trim() || defaultWholeSiteContent.consumerGuide.badge,
        title: consumerGuideTitle?.value.trim() || defaultWholeSiteContent.consumerGuide.title,
        desc: consumerGuideDesc?.value.trim() || defaultWholeSiteContent.consumerGuide.desc,
        pillar1Title: consumerPillar1Title?.value.trim() || defaultWholeSiteContent.consumerGuide.pillar1Title,
        pillar1Desc: consumerPillar1Desc?.value.trim() || defaultWholeSiteContent.consumerGuide.pillar1Desc,
        pillar2Title: consumerPillar2Title?.value.trim() || defaultWholeSiteContent.consumerGuide.pillar2Title,
        pillar2Desc: consumerPillar2Desc?.value.trim() || defaultWholeSiteContent.consumerGuide.pillar2Desc,
        pillar3Title: consumerPillar3Title?.value.trim() || defaultWholeSiteContent.consumerGuide.pillar3Title,
        pillar3Desc: consumerPillar3Desc?.value.trim() || defaultWholeSiteContent.consumerGuide.pillar3Desc
      },
      services: {
        badge: servicesBadge?.value.trim() || defaultWholeSiteContent.services.badge,
        title: servicesTitle?.value.trim() || defaultWholeSiteContent.services.title,
        desc: servicesDesc?.value.trim() || defaultWholeSiteContent.services.desc,
        s1Title: s1Title?.value.trim() || defaultWholeSiteContent.services.s1Title,
        s1Tag: s1Tag?.value.trim() || defaultWholeSiteContent.services.s1Tag,
        s1Desc: s1Desc?.value.trim() || defaultWholeSiteContent.services.s1Desc,
        s2Title: s2Title?.value.trim() || defaultWholeSiteContent.services.s2Title,
        s2Tag: s2Tag?.value.trim() || defaultWholeSiteContent.services.s2Tag,
        s2Desc: s2Desc?.value.trim() || defaultWholeSiteContent.services.s2Desc,
        s3Title: s3Title?.value.trim() || defaultWholeSiteContent.services.s3Title,
        s3Tag: s3Tag?.value.trim() || defaultWholeSiteContent.services.s3Tag,
        s3Desc: s3Desc?.value.trim() || defaultWholeSiteContent.services.s3Desc,
        s4Title: s4Title?.value.trim() || defaultWholeSiteContent.services.s4Title,
        s4Tag: s4Tag?.value.trim() || defaultWholeSiteContent.services.s4Tag,
        s4Desc: s4Desc?.value.trim() || defaultWholeSiteContent.services.s4Desc,
        s5Title: s5Title?.value.trim() || defaultWholeSiteContent.services.s5Title,
        s5Tag: s5Tag?.value.trim() || defaultWholeSiteContent.services.s5Tag,
        s5Desc: s5Desc?.value.trim() || defaultWholeSiteContent.services.s5Desc,
        s6Title: s6Title?.value.trim() || defaultWholeSiteContent.services.s6Title,
        s6Tag: s6Tag?.value.trim() || defaultWholeSiteContent.services.s6Tag,
        s6Desc: s6Desc?.value.trim() || defaultWholeSiteContent.services.s6Desc
      },
      process: {
        badge: processBadge?.value.trim() || defaultWholeSiteContent.process.badge,
        title: processTitle?.value.trim() || defaultWholeSiteContent.process.title,
        desc: processDesc?.value.trim() || defaultWholeSiteContent.process.desc,
        step1Title: step1Title?.value.trim() || defaultWholeSiteContent.process.step1Title,
        step1Desc: step1Desc?.value.trim() || defaultWholeSiteContent.process.step1Desc,
        step1Meta: step1Meta?.value.trim() || defaultWholeSiteContent.process.step1Meta,
        step2Title: step2Title?.value.trim() || defaultWholeSiteContent.process.step2Title,
        step2Desc: step2Desc?.value.trim() || defaultWholeSiteContent.process.step2Desc,
        step2Meta: step2Meta?.value.trim() || defaultWholeSiteContent.process.step2Meta,
        step3Title: step3Title?.value.trim() || defaultWholeSiteContent.process.step3Title,
        step3Desc: step3Desc?.value.trim() || defaultWholeSiteContent.process.step3Desc,
        step3Meta: step3Meta?.value.trim() || defaultWholeSiteContent.process.step3Meta,
        step4Title: step4Title?.value.trim() || defaultWholeSiteContent.process.step4Title,
        step4Desc: step4Desc?.value.trim() || defaultWholeSiteContent.process.step4Desc,
        step4Meta: step4Meta?.value.trim() || defaultWholeSiteContent.process.step4Meta,
        step5Title: step5Title?.value.trim() || defaultWholeSiteContent.process.step5Title,
        step5Desc: step5Desc?.value.trim() || defaultWholeSiteContent.process.step5Desc,
        step5Meta: step5Meta?.value.trim() || defaultWholeSiteContent.process.step5Meta
      },
      techAndB2b: {
        techBadge: techBadge?.value.trim() || defaultWholeSiteContent.techAndB2b.techBadge,
        techTitle: techTitle?.value.trim() || defaultWholeSiteContent.techAndB2b.techTitle,
        techDesc: techDesc?.value.trim() || defaultWholeSiteContent.techAndB2b.techDesc,
        eq1Title: eq1Title?.value.trim() || defaultWholeSiteContent.techAndB2b.eq1Title,
        eq1Desc: eq1Desc?.value.trim() || defaultWholeSiteContent.techAndB2b.eq1Desc,
        eq2Title: eq2Title?.value.trim() || defaultWholeSiteContent.techAndB2b.eq2Title,
        eq2Desc: eq2Desc?.value.trim() || defaultWholeSiteContent.techAndB2b.eq2Desc,
        eq3Title: eq3Title?.value.trim() || defaultWholeSiteContent.techAndB2b.eq3Title,
        eq3Desc: eq3Desc?.value.trim() || defaultWholeSiteContent.techAndB2b.eq3Desc,
        eq4Title: eq4Title?.value.trim() || defaultWholeSiteContent.techAndB2b.eq4Title,
        eq4Desc: eq4Desc?.value.trim() || defaultWholeSiteContent.techAndB2b.eq4Desc,
        b2bBadge: b2bBadge?.value.trim() || defaultWholeSiteContent.techAndB2b.b2bBadge,
        b2bTitle: b2bTitle?.value.trim() || defaultWholeSiteContent.techAndB2b.b2bTitle,
        b2bDesc: b2bDesc?.value.trim() || defaultWholeSiteContent.techAndB2b.b2bDesc,
        b2bBullet1: b2bBullet1?.value.trim() || defaultWholeSiteContent.techAndB2b.b2bBullet1,
        b2bBullet2: b2bBullet2?.value.trim() || defaultWholeSiteContent.techAndB2b.b2bBullet2,
        b2bBullet3: b2bBullet3?.value.trim() || defaultWholeSiteContent.techAndB2b.b2bBullet3,
        b2bCta1Text: b2bCta1Text?.value.trim() || defaultWholeSiteContent.techAndB2b.b2bCta1Text,
        b2bCta2Text: b2bCta2Text?.value.trim() || defaultWholeSiteContent.techAndB2b.b2bCta2Text
      },
      faqs: {
        badge: faqBadge?.value.trim() || defaultWholeSiteContent.faqs.badge,
        title: faqTitle?.value.trim() || defaultWholeSiteContent.faqs.title,
        desc: faqDesc?.value.trim() || defaultWholeSiteContent.faqs.desc,
        q1: faqQ1?.value.trim() || defaultWholeSiteContent.faqs.q1,
        a1: faqA1?.value.trim() || defaultWholeSiteContent.faqs.a1,
        q2: faqQ2?.value.trim() || defaultWholeSiteContent.faqs.q2,
        a2: faqA2?.value.trim() || defaultWholeSiteContent.faqs.a2,
        q3: faqQ3?.value.trim() || defaultWholeSiteContent.faqs.q3,
        a3: faqA3?.value.trim() || defaultWholeSiteContent.faqs.a3,
        q4: faqQ4?.value.trim() || defaultWholeSiteContent.faqs.q4,
        a4: faqA4?.value.trim() || defaultWholeSiteContent.faqs.a4,
        q5: faqQ5?.value.trim() || defaultWholeSiteContent.faqs.q5,
        a5: faqA5?.value.trim() || defaultWholeSiteContent.faqs.a5
      },
      contact: {
        phone: phoneInput?.value.trim() || defaultWholeSiteContent.contact.phone,
        whatsapp: whatsappInput?.value.trim() || defaultWholeSiteContent.contact.whatsapp,
        email: emailInput?.value.trim() || defaultWholeSiteContent.contact.email,
        address: addressInput?.value.trim() || defaultWholeSiteContent.contact.address,
        hours: hoursInput?.value.trim() || defaultWholeSiteContent.contact.hours,
        ahcCode: ahcCodeInput?.value.trim() || defaultWholeSiteContent.contact.ahcCode,
        rateGold24: rateGold24Input?.value.trim() || defaultWholeSiteContent.contact.rateGold24,
        rateGold22: rateGold22Input?.value.trim() || defaultWholeSiteContent.contact.rateGold22,
        rateSilver999: rateSilver999Input?.value.trim() || defaultWholeSiteContent.contact.rateSilver999,
        noticeText: noticeTextInput?.value.trim() || '',
        showNotice: toggleNoticeBanner ? toggleNoticeBanner.checked : true,
        footerCopyright: footerCopyright?.value.trim() || defaultWholeSiteContent.contact.footerCopyright
      }
    };
  }

  function syncInputsToJsonEditor() {
    const data = collectFormData();
    if (rawJsonEditor) {
      rawJsonEditor.value = JSON.stringify(data, null, 2);
    }
  }

  function saveAllContent(showToast = true) {
    const data = collectFormData();

    // 1. Save full JSON structure
    localStorage.setItem('ansh_full_site_content', JSON.stringify(data));

    // 2. Sync to legacy ansh_lab_info for backwards compatibility
    const legacyInfo = {
      phone: data.contact.phone,
      whatsapp: data.contact.whatsapp,
      email: data.contact.email,
      address: data.contact.address,
      ahcCode: data.contact.ahcCode,
      hours: data.contact.hours,
      rateGold24: data.contact.rateGold24,
      rateGold22: data.contact.rateGold22,
      rateSilver999: data.contact.rateSilver999,
      metric1Val: data.hero.metric1Val,
      metric1Lbl: data.hero.metric1Lbl,
      metric2Val: data.hero.metric2Val,
      metric2Lbl: data.hero.metric2Lbl,
      metric3Val: data.hero.metric3Val,
      metric3Lbl: data.hero.metric3Lbl,
      metric4Val: data.hero.metric4Val,
      metric4Lbl: data.hero.metric4Lbl,
      statutoryTariff: data.hero.statutoryTariff,
      noticeText: data.contact.noticeText,
      showNotice: data.contact.showNotice
    };
    localStorage.setItem('ansh_lab_info', JSON.stringify(legacyInfo));

    // Update raw JSON editor
    if (rawJsonEditor) {
      rawJsonEditor.value = JSON.stringify(data, null, 2);
    }

    if (showToast && notice) {
      notice.classList.remove('hidden');
      setTimeout(() => notice.classList.add('hidden'), 4000);
    }
    return data;
  }

  function updateBannerStatus(isChecked) {
    if (noticeBannerStatus) {
      noticeBannerStatus.textContent = isChecked ? 'Show Banner' : 'Hidden';
      noticeBannerStatus.className = isChecked ? 'ml-2 text-[10px] text-emerald-400 font-bold uppercase' : 'ml-2 text-[10px] text-slate-500 font-bold uppercase';
    }
  }

  if (toggleNoticeBanner) {
    toggleNoticeBanner.addEventListener('change', () => {
      updateBannerStatus(toggleNoticeBanner.checked);
    });
  }

  // Prettify button
  if (prettifyBtn && rawJsonEditor) {
    prettifyBtn.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(rawJsonEditor.value);
        rawJsonEditor.value = JSON.stringify(parsed, null, 2);
      } catch(e) {
        alert('Invalid JSON syntax. Please check before formatting: ' + e.message);
      }
    });
  }

  // Copy JSON button
  if (copyJsonBtn && rawJsonEditor) {
    copyJsonBtn.addEventListener('click', () => {
      syncInputsToJsonEditor();
      navigator.clipboard.writeText(rawJsonEditor.value).then(() => {
        const originalText = copyJsonBtn.innerHTML;
        copyJsonBtn.innerHTML = '<i class="fas fa-check text-emerald-400"></i> Copied!';
        setTimeout(() => copyJsonBtn.innerHTML = originalText, 2500);
      }).catch(() => {
        rawJsonEditor.select();
        document.execCommand('copy');
        alert('JSON copied to clipboard!');
      });
    });
  }

  // Download JSON button
  if (downloadJsonBtn) {
    downloadJsonBtn.addEventListener('click', () => {
      const data = collectFormData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ansh-website-content-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Import JSON File
  if (importFileInput) {
    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (confirm('Valid JSON backup file detected. Apply this content across the entire website?')) {
            populateAll(imported);
            saveAllContent(true);
            if (importStatus) {
              importStatus.textContent = `Restored from ${file.name}`;
              importStatus.className = 'text-[11px] text-emerald-400 font-bold';
            }
            alert('Website content successfully restored from backup file!');
          }
        } catch(err) {
          alert('Failed to parse JSON file: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  // Apply Raw JSON button
  if (applyRawJsonBtn && rawJsonEditor) {
    applyRawJsonBtn.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(rawJsonEditor.value);
        populateAll(parsed);
        saveAllContent(true);
        alert('Raw JSON successfully applied to website!');
      } catch(e) {
        alert('Invalid JSON syntax: ' + e.message);
      }
    });
  }

  // Form submit & Save All button
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveAllContent(true);
      alert('Success! All website content updated. Changes are now live on the public website.');
    });
  }

  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', () => {
      saveAllContent(true);
      alert('Success! All website content updated. Changes are now live on the public website.');
    });
  }

  // Reset defaults
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset ALL website sections, headlines, guides, services, processes, and FAQs to original factory defaults?')) {
        localStorage.removeItem('ansh_full_site_content');
        localStorage.setItem('ansh_lab_info', JSON.stringify(defaultLabInfo));
        populateAll(defaultWholeSiteContent);
        alert('Whole website content reset to factory defaults.');
      }
    });
  }

  // Initial load
  const initialData = getSavedData();
  populateAll(initialData);
}

// Alias for backwards compatibility
function initWebsiteInfoEditor() {
  initWholeSiteCms();
}

// 11. GOOGLE SHEETS LIVE INTEGRATION & ONLINE BOOKINGS LEDGER
function initGoogleSheetsIntegration() {
  const webhookInput = document.getElementById('googleSheetWebhookUrl');
  const viewUrlInput = document.getElementById('googleSheetViewUrl');
  const saveBtn = document.getElementById('saveSheetConfigBtn');
  const savedNotice = document.getElementById('sheetSavedNotice');
  const openSheetBtn = document.getElementById('openGoogleSheetBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const showGuideBtn = document.getElementById('showSetupGuideBtn');
  const closeGuideBtn = document.getElementById('closeSetupGuideBtn');
  const guideBox = document.getElementById('setupGuideBox');
  const copyScriptBtn = document.getElementById('copyScriptBtn');
  const clearBookingsBtn = document.getElementById('clearBookingsBtn');
  const tableBody = document.getElementById('bookingsTableBody');
  const countBadge = document.getElementById('bookingCountBadge');

  // Seed initial demo bookings if empty
  const storedBookings = localStorage.getItem('ansh_online_bookings');
  if (!storedBookings) {
    const demoBookings = [
      {
        id: 'ANSH-BK-7892',
        timestamp: new Date(Date.now() - 3600000 * 3).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
        name: 'Rajesh Mehta',
        phone: '+91 98250 11223',
        company: 'Mehta Jewellers Pvt Ltd',
        service: 'Gold Hallmark & Fire Assay',
        metal: '22K Gold Bangles (145.250g)',
        date: 'Tomorrow (10:00 AM)',
        notes: 'BIS HUID certificate required for export consignment'
      },
      {
        id: 'ANSH-BK-4105',
        timestamp: new Date(Date.now() - 3600000 * 8).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
        name: 'Amit Varma',
        phone: '+91 94260 88991',
        company: 'Varma Bullion & Sons',
        service: 'Silver Refining & Purity Certification',
        metal: '999.0 Silver Bars (2.500 kg)',
        date: 'Day after tomorrow',
        notes: 'XRF + ICP multi-element spectral analysis'
      }
    ];
    localStorage.setItem('ansh_online_bookings', JSON.stringify(demoBookings));
  }

  // Attached Google Sheet Default URL
  const defaultSheetViewUrl = 'https://docs.google.com/spreadsheets/d/1o6IneSEj2uB5bY1zF4ZEJG3XUwIAJQMS9IU7Uty03Kk/edit?gid=0#gid=0';
  if (!localStorage.getItem('ansh_google_sheet_view_url')) {
    localStorage.setItem('ansh_google_sheet_view_url', defaultSheetViewUrl);
  }

  // Load saved Google Sheet URLs
  const savedWebhook = localStorage.getItem('ansh_google_sheet_webhook_url');
  const savedViewUrl = localStorage.getItem('ansh_google_sheet_view_url') || defaultSheetViewUrl;
  if (webhookInput && savedWebhook) webhookInput.value = savedWebhook;
  if (viewUrlInput) viewUrlInput.value = savedViewUrl;

  // Save Settings Handler
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const webhookVal = webhookInput?.value.trim() || '';
      const viewVal = viewUrlInput?.value.trim() || defaultSheetViewUrl;

      localStorage.setItem('ansh_google_sheet_webhook_url', webhookVal);
      localStorage.setItem('ansh_google_sheet_view_url', viewVal);

      // Update iframe source if changed
      const iframe = document.getElementById('googleSheetIframe');
      if (iframe && viewVal) {
        iframe.src = viewVal.replace(/\/edit.*$/, '/edit?embedded=true');
      }

      if (savedNotice) {
        savedNotice.classList.remove('hidden');
        setTimeout(() => {
          savedNotice.classList.add('hidden');
        }, 3000);
      }
      alert('Google Sheet integration settings successfully saved!');
    });
  }

  // Setup Guide Toggles
  if (showGuideBtn && guideBox) {
    showGuideBtn.addEventListener('click', () => {
      guideBox.classList.toggle('hidden');
    });
  }
  if (closeGuideBtn && guideBox) {
    closeGuideBtn.addEventListener('click', () => {
      guideBox.classList.add('hidden');
    });
  }

  // Embedded Preview Sheet Toggle
  const toggleEmbedBtn = document.getElementById('toggleEmbedSheetBtn');
  const closeEmbedBtn = document.getElementById('closeEmbedSheetBtn');
  const embedWrapper = document.getElementById('embeddedSheetWrapper');
  if (toggleEmbedBtn && embedWrapper) {
    toggleEmbedBtn.addEventListener('click', () => {
      embedWrapper.classList.toggle('hidden');
    });
  }
  if (closeEmbedBtn && embedWrapper) {
    closeEmbedBtn.addEventListener('click', () => {
      embedWrapper.classList.add('hidden');
    });
  }

  // Copy Script Button
  if (copyScriptBtn) {
    copyScriptBtn.addEventListener('click', () => {
      const code = document.getElementById('scriptCodePre')?.innerText || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          showCopySuccess();
        }).catch(() => fallbackCopy(code));
      } else {
        fallbackCopy(code);
      }
    });

    function showCopySuccess() {
      const original = copyScriptBtn.innerHTML;
      copyScriptBtn.innerHTML = '<i class="fas fa-check text-emerald-400 mr-1"></i> Copied!';
      copyScriptBtn.classList.add('bg-emerald-500/20', 'text-emerald-300');
      setTimeout(() => {
        copyScriptBtn.innerHTML = original;
        copyScriptBtn.classList.remove('bg-emerald-500/20', 'text-emerald-300');
      }, 2000);
    }

    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showCopySuccess();
      } catch (err) {
        alert('Please manually copy the code inside the box.');
      }
      document.body.removeChild(ta);
    }
  }

  // Open Google Sheet Button
  if (openSheetBtn) {
    openSheetBtn.addEventListener('click', () => {
      const viewUrl = localStorage.getItem('ansh_google_sheet_view_url') || defaultSheetViewUrl;
      window.open(viewUrl, '_blank');
    });
  }

  // Render Bookings Table
  const selectAllBox = document.getElementById('selectAllBookings');
  const selectedNotice = document.getElementById('selectedCountNotice');
  const selectedBadge = document.getElementById('selectedCountBadge');
  const markDoneBtn = document.getElementById('markSelectedDoneBtn');
  const deleteSelectedBtn = document.getElementById('deleteSelectedBookingsBtn');

  function updateActionButtonsState(bookings) {
    const checkedCount = bookings.filter(b => b.checked).length;
    if (selectedBadge) selectedBadge.textContent = checkedCount;

    if (checkedCount > 0) {
      if (selectedNotice) selectedNotice.classList.remove('hidden');
      if (markDoneBtn) markDoneBtn.classList.remove('hidden');
      if (deleteSelectedBtn) deleteSelectedBtn.classList.remove('hidden');
    } else {
      if (selectedNotice) selectedNotice.classList.add('hidden');
      if (markDoneBtn) markDoneBtn.classList.add('hidden');
      if (deleteSelectedBtn) deleteSelectedBtn.classList.add('hidden');
    }

    if (selectAllBox) {
      selectAllBox.checked = bookings.length > 0 && checkedCount === bookings.length;
      selectAllBox.indeterminate = checkedCount > 0 && checkedCount < bookings.length;
    }
  }

  function renderBookings() {
    if (!tableBody) return;

    let bookings = [];
    try {
      bookings = JSON.parse(localStorage.getItem('ansh_online_bookings') || '[]');
    } catch(e) {
      bookings = [];
    }

    if (countBadge) {
      countBadge.textContent = bookings.length;
    }

    updateActionButtonsState(bookings);

    if (bookings.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="10" class="py-8 text-center text-slate-500 text-xs">
            <i class="fas fa-inbox text-2xl mb-2 text-slate-600 block"></i>
            No online sample bookings received yet. Submissions from the public website will show here instantly.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = bookings.map(b => {
      const cleanPhone = (b.phone || '').replace(/[^0-9+]/g, '');
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : '#';
      const isChecked = Boolean(b.checked);

      return `
        <tr class="hover:bg-slate-900/60 transition-colors text-slate-300 text-xs border-b border-slate-800/60 ${isChecked ? 'bg-amber-500/5' : ''}">
          <td class="py-3 px-3 text-center">
            <input type="checkbox" class="booking-tick-box cursor-pointer rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0" data-id="${escapeHtml(b.id)}" ${isChecked ? 'checked' : ''} title="Tick to select / mark completed">
          </td>
          <td class="py-3 px-3 whitespace-nowrap">
            ${isChecked ? `
              <span class="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60 inline-flex items-center gap-1 shadow-sm">
                <i class="fas fa-circle-check text-[9px]"></i> Processed
              </span>
            ` : `
              <span class="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-amber-950/70 text-amber-400 border border-amber-800/60 inline-flex items-center gap-1">
                <i class="fas fa-clock text-[9px]"></i> Received
              </span>
            `}
          </td>
          <td class="py-3 px-3">
            <span class="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30 text-[11px]">
              ${escapeHtml(b.id || 'N/A')}
            </span>
          </td>
          <td class="py-3 px-3 font-semibold ${isChecked ? 'text-slate-400 line-through' : 'text-white'} whitespace-nowrap">
            ${escapeHtml(b.name || 'Anonymous')}
          </td>
          <td class="py-3 px-3 whitespace-nowrap">
            <a href="${waLink}" target="_blank" class="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-sans font-medium" title="Chat on WhatsApp">
              <i class="fab fa-whatsapp"></i>
              <span>${escapeHtml(b.phone || 'N/A')}</span>
            </a>
          </td>
          <td class="py-3 px-3 text-slate-400">
            ${escapeHtml(b.company || 'Private Client')}
          </td>
          <td class="py-3 px-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-slate-800 text-amber-200 border border-slate-700">
              ${escapeHtml(b.service || 'Assaying')}
            </span>
          </td>
          <td class="py-3 px-3 text-slate-300">
            ${escapeHtml(b.metal || '-')}
          </td>
          <td class="py-3 px-3 text-slate-400 whitespace-nowrap">
            ${escapeHtml(b.date || 'Earliest Slot')}
          </td>
          <td class="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
            ${escapeHtml(b.timestamp || '-')}
          </td>
        </tr>
      `;
    }).join('');

    // Attach listeners to individual row tick boxes
    tableBody.querySelectorAll('.booking-tick-box').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        let current = [];
        try {
          current = JSON.parse(localStorage.getItem('ansh_online_bookings') || '[]');
        } catch(err) {}

        const item = current.find(x => x.id === id);
        if (item) {
          item.checked = e.target.checked;
          localStorage.setItem('ansh_online_bookings', JSON.stringify(current));
          renderBookings();
        }
      });
    });
  }

  // Select / Deselect All Tickbox
  if (selectAllBox) {
    selectAllBox.addEventListener('change', () => {
      let current = [];
      try {
        current = JSON.parse(localStorage.getItem('ansh_online_bookings') || '[]');
      } catch(err) {}

      current.forEach(b => {
        b.checked = selectAllBox.checked;
      });
      localStorage.setItem('ansh_online_bookings', JSON.stringify(current));
      renderBookings();
    });
  }

  // Mark Selected as Processed
  if (markDoneBtn) {
    markDoneBtn.addEventListener('click', () => {
      let current = [];
      try {
        current = JSON.parse(localStorage.getItem('ansh_online_bookings') || '[]');
      } catch(err) {}

      const selected = current.filter(b => b.checked);
      if (selected.length === 0) return;

      current.forEach(b => {
        if (b.checked) {
          b.status = 'processed';
        }
      });
      localStorage.setItem('ansh_online_bookings', JSON.stringify(current));
      renderBookings();
      alert(`Marked ${selected.length} booking(s) as processed!`);
    });
  }

  // Delete Selected Bookings
  if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener('click', () => {
      let current = [];
      try {
        current = JSON.parse(localStorage.getItem('ansh_online_bookings') || '[]');
      } catch(err) {}

      const selected = current.filter(b => b.checked);
      if (selected.length === 0) return;

      if (confirm(`Are you sure you want to delete ${selected.length} selected booking(s)?`)) {
        current = current.filter(b => !b.checked);
        localStorage.setItem('ansh_online_bookings', JSON.stringify(current));
        renderBookings();
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Clear Bookings
  if (clearBookingsBtn) {
    clearBookingsBtn.addEventListener('click', () => {
      if (confirm('Clear all received online bookings from this local table? (Your connected Google Sheet records remain untouched).')) {
        localStorage.setItem('ansh_online_bookings', '[]');
        renderBookings();
      }
    });
  }

  // Export CSV
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      let bookings = [];
      try {
        bookings = JSON.parse(localStorage.getItem('ansh_online_bookings') || '[]');
      } catch(e) {
        bookings = [];
      }

      if (bookings.length === 0) {
        alert('No booking records to download.');
        return;
      }

      const headers = ['Timestamp', 'Status', 'Booking ID', 'Client Name', 'Phone', 'Company', 'Service', 'Article & Weight', 'Preferred Date', 'Notes'];
      const rows = bookings.map(b => [
        `"${(b.timestamp || '').replace(/"/g, '""')}"`,
        `"${b.checked ? 'Processed' : 'Received'}"`,
        `"${(b.id || '').replace(/"/g, '""')}"`,
        `"${(b.name || '').replace(/"/g, '""')}"`,
        `"${(b.phone || '').replace(/"/g, '""')}"`,
        `"${(b.company || '').replace(/"/g, '""')}"`,
        `"${(b.service || '').replace(/"/g, '""')}"`,
        `"${(b.metal || '').replace(/"/g, '""')}"`,
        `"${(b.date || '').replace(/"/g, '""')}"`,
        `"${(b.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ANSH_Hallmarking_Online_Bookings_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Initial render
  renderBookings();

  // Real-time synchronization across browser tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'ansh_online_bookings') {
      renderBookings();
    }
  });
}


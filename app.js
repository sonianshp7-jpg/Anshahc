/**
 * ANSH Assaying and Hallmarking Centre
 * Interactive Application Logic & Calculations
 */

document.addEventListener('DOMContentLoaded', () => {
  const safeRun = (fn, name) => {
    try {
      fn();
    } catch (e) {
      console.warn(`[ANSH Lab] ${name} initialization notice:`, e);
    }
  };

  safeRun(applyFeatureVisibility, 'Feature Visibility');
  safeRun(applyWholeWebsiteContent, 'Whole Website Content');
  safeRun(initServiceOptions, 'Service Options');
  safeRun(initMobileMenu, 'Mobile Menu');
  safeRun(initMarketTicker, 'Market Ticker');
  safeRun(initPurityCalculator, 'Purity Calculator');
  safeRun(initMeltLossCalculator, 'Melt Loss Calculator');
  safeRun(initFaqAccordion, 'FAQ Accordion');
  safeRun(initBookingForm, 'Booking Form');
  safeRun(initHuidSimulator, 'HUID Simulator');
  safeRun(initBisCareVerification, 'BIS Care Verification');
  safeRun(initScrollAnimations, 'Scroll Animations');
  safeRun(initGoldParticles, 'Gold Particles');
});

// Real-time synchronization across browser tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'ansh_website_features') {
    applyFeatureVisibility();
  } else if (e.key === 'ansh_service_options') {
    initServiceOptions();
  } else if (e.key === 'ansh_lab_info' || e.key === 'ansh_full_site_content') {
    applyWholeWebsiteContent();
  }
});

// 1. MOBILE MENU TOGGLE
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        if (mobileMenu.classList.contains('hidden')) {
          icon.className = 'fas fa-bars text-xl';
        } else {
          icon.className = 'fas fa-times text-xl';
        }
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars text-xl';
      });
    });

    // Dismiss mobile drawer when tapping outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden')) {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
          mobileMenu.classList.add('hidden');
          const icon = menuBtn.querySelector('i');
          if (icon) icon.className = 'fas fa-bars text-xl';
        }
      }
    });
  }
}

// 2. LIVE MARKET TICKER SIMULATION (Standard Indian Bullion Benchmark)
const bullionRates = {
  gold24k: 78450, // per 10g
  gold22k: 71900, // per 10g (916)
  gold18k: 58840, // per 10g (750)
  gold14k: 45790, // per 10g (585)
  silver999: 94500 // per 1kg
};

function initMarketTicker() {
  const tickerEl = document.getElementById('tickerContent');
  if (!tickerEl) return;

  // Prevent flicker/glitch if markup is already pre-rendered
  if (tickerEl.children && tickerEl.children.length > 0) {
    return;
  }

  const items = [
    { label: 'Gold 24K (999)', val: `₹${bullionRates.gold24k.toLocaleString('en-IN')}/10g`, change: '+₹240 (0.31%)', up: true },
    { label: 'Gold 22K (916 HUID)', val: `₹${bullionRates.gold22k.toLocaleString('en-IN')}/10g`, change: '+₹210 (0.29%)', up: true },
    { label: 'Gold 18K (750)', val: `₹${bullionRates.gold18k.toLocaleString('en-IN')}/10g`, change: '+₹175 (0.30%)', up: true },
    { label: 'Gold 14K (585)', val: `₹${bullionRates.gold14k.toLocaleString('en-IN')}/10g`, change: '+₹135 (0.30%)', up: true },
    { label: 'Silver 999 Fine', val: `₹${bullionRates.silver999.toLocaleString('en-IN')}/kg`, change: '+₹450 (0.48%)', up: true },
    { label: 'BIS Standard Assaying Fee', val: 'Govt. Fixed ₹45/article + GST', note: 'Transparent Pricing' }
  ];

  // Render twice for continuous loop
  let html = '';
  for (let i = 0; i < 2; i++) {
    items.forEach(item => {
      html += `
        <div class="inline-flex items-center space-x-2 text-xs md:text-sm font-medium px-6 border-r border-slate-700/60 whitespace-nowrap">
          <span class="text-slate-400">${item.label}:</span>
          <span class="text-amber-300 font-bold font-mono">${item.val}</span>
          ${item.change ? `<span class="text-emerald-400 text-xs flex items-center"><i class="fas fa-arrow-up text-[10px] mr-1"></i>${item.change}</span>` : ''}
          ${item.note ? `<span class="text-blue-300 text-xs bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">${item.note}</span>` : ''}
        </div>
      `;
    });
  }
  tickerEl.innerHTML = html;
}

// 3. INTERACTIVE PURITY & VALUATION CALCULATOR
function initPurityCalculator() {
  const metalTypeSelect = document.getElementById('calcMetalType');
  const puritySelect = document.getElementById('calcPuritySelect');
  const weightInput = document.getElementById('calcWeight');
  const rateInput = document.getElementById('calcCustomRate');
  
  // Output Elements
  const pureContentEl = document.getElementById('resPureContent');
  const alloyContentEl = document.getElementById('resAlloyContent');
  const estValueEl = document.getElementById('resEstValue');
  const bisFinenessCodeEl = document.getElementById('resBisFinenessCode');
  const bisHuidPreviewEl = document.getElementById('resBisHuidPreview');
  const assayFeeEl = document.getElementById('resAssayFee');

  if (!weightInput || !puritySelect) return;

  // Fineness map & default standards
  const finenessData = {
    '24k': { fineness: 99.9, name: '24 Karat (999)', mark: '24K999', goldPerGram: bullionRates.gold24k / 10 },
    '22k': { fineness: 91.6, name: '22 Karat (916 BIS Standard)', mark: '22K916', goldPerGram: bullionRates.gold22k / 10 },
    '20k': { fineness: 83.3, name: '20 Karat (833)', mark: '20K833', goldPerGram: (bullionRates.gold24k * 0.833) / 10 },
    '18k': { fineness: 75.0, name: '18 Karat (750 BIS Standard)', mark: '18K750', goldPerGram: bullionRates.gold18k / 10 },
    '14k': { fineness: 58.5, name: '14 Karat (585 BIS Standard)', mark: '14K585', goldPerGram: bullionRates.gold14k / 10 },
    '9k':  { fineness: 37.5, name: '9 Karat (375)', mark: '9K375', goldPerGram: (bullionRates.gold24k * 0.375) / 10 },
    'silver999': { fineness: 99.9, name: 'Silver 999 Fine', mark: '999', goldPerGram: bullionRates.silver999 / 1000 },
    'silver925': { fineness: 92.5, name: 'Sterling Silver 925', mark: '925', goldPerGram: (bullionRates.silver999 * 0.925) / 1000 }
  };

  function updateCalculator() {
    const metal = metalTypeSelect ? metalTypeSelect.value : 'gold';
    const selectedKey = puritySelect.value;
    const finenessObj = finenessData[selectedKey] || finenessData['22k'];
    const weight = parseFloat(weightInput.value) || 0;

    let ratePerGram = finenessObj.goldPerGram;
    if (rateInput && rateInput.value && parseFloat(rateInput.value) > 0) {
      ratePerGram = parseFloat(rateInput.value);
    } else if (rateInput) {
      rateInput.placeholder = `₹${Math.round(ratePerGram).toLocaleString('en-IN')}/g`;
    }

    const pureGrams = (weight * (finenessObj.fineness / 100));
    const alloyGrams = Math.max(0, weight - pureGrams);
    const estimatedValue = weight * ratePerGram;

    // Assaying statutory fee estimate (approx ₹45 for gold, ₹35 for silver per article, subject to bulk batch scale)
    const baseFee = metal === 'silver' ? 35 : 45;
    const approxArticles = Math.max(1, Math.ceil(weight / 25)); // Estimate 1 article per 25g average if not specified
    const totalAssayFee = approxArticles * baseFee;

    // Update UI
    if (pureContentEl) pureContentEl.textContent = `${pureGrams.toFixed(3)} g`;
    if (alloyContentEl) alloyContentEl.textContent = `${alloyGrams.toFixed(3)} g`;
    if (estValueEl) {
      estValueEl.textContent = `₹${Math.round(estimatedValue).toLocaleString('en-IN')}`;
      estValueEl.classList.remove('calc-result-flash');
      void estValueEl.offsetWidth; // trigger reflow
      estValueEl.classList.add('calc-result-flash');
    }
    if (bisFinenessCodeEl) bisFinenessCodeEl.textContent = finenessObj.mark;
    if (assayFeeEl) assayFeeEl.textContent = `₹${totalAssayFee} + 18% GST (approx ${approxArticles} article${approxArticles > 1 ? 's' : ''})`;

    if (bisHuidPreviewEl) {
      bisHuidPreviewEl.innerHTML = `
        <div class="flex items-center space-x-3 text-xs md:text-sm font-mono text-amber-200">
          <span class="bg-amber-950/80 px-2 py-1 rounded border border-amber-600/60 font-bold"><i class="fas fa-gem text-amber-400 mr-1"></i>BIS</span>
          <span class="bg-amber-950/80 px-2 py-1 rounded border border-amber-600/60 font-bold">${finenessObj.mark}</span>
          <span class="bg-amber-950/80 px-2 py-1 rounded border border-amber-600/60 font-bold tracking-wider">AH78Q2</span>
        </div>
      `;
    }
  }

  weightInput.addEventListener('input', updateCalculator);
  puritySelect.addEventListener('change', updateCalculator);
  if (rateInput) rateInput.addEventListener('input', updateCalculator);
  if (metalTypeSelect) {
    metalTypeSelect.addEventListener('change', () => {
      const metal = metalTypeSelect.value;
      puritySelect.innerHTML = '';
      if (metal === 'gold') {
        puritySelect.innerHTML = `
          <option value="22k" selected>22K - 916 Fineness (Most Common)</option>
          <option value="24k">24K - 999 Fineness (Bullion / Pure)</option>
          <option value="18k">18K - 750 Fineness (Diamond / Fine)</option>
          <option value="14k">14K - 585 Fineness (Modern / Daily)</option>
          <option value="9k">9K - 375 Fineness</option>
        `;
      } else {
        puritySelect.innerHTML = `
          <option value="silver925" selected>925 Sterling Silver (92.5%)</option>
          <option value="silver999">999 Fine Silver Bullion (99.9%)</option>
        `;
      }
      if (rateInput) rateInput.value = '';
      updateCalculator();
    });
  }

  updateCalculator();
}

// 3B. JEWELLER SCRAP MELT & RECOVERY CALCULATOR & TAB SWITCHER
function initMeltLossCalculator() {
  const tabKarat = document.getElementById('tabKaratCalc');
  const tabMelt = document.getElementById('tabMeltCalc');
  const karatView = document.getElementById('karatCalcView');
  const meltView = document.getElementById('meltCalcView');

  // Tab switching
  if (tabKarat && tabMelt && karatView && meltView) {
    tabKarat.addEventListener('click', () => {
      karatView.classList.remove('hidden');
      meltView.classList.add('hidden');
      tabKarat.className = 'px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-amber-500/20 text-amber-300 border border-amber-500/40';
      tabMelt.className = 'px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-slate-400 hover:text-white';
    });

    tabMelt.addEventListener('click', () => {
      meltView.classList.remove('hidden');
      karatView.classList.add('hidden');
      tabMelt.className = 'px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-amber-500/20 text-amber-300 border border-amber-500/40';
      tabKarat.className = 'px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-slate-400 hover:text-white';
      updateMeltCalculator();
    });
  }

  // Melt Inputs
  const grossInput = document.getElementById('meltGrossWeight');
  const lossInput = document.getElementById('meltLossPercent');
  const finenessInput = document.getElementById('meltFinenessPercent');
  const rateInput = document.getElementById('melt24kRate');

  // Melt Outputs
  const postWeightEl = document.getElementById('resMeltPostWeight');
  const lossGramsEl = document.getElementById('resMeltLossGrams');
  const fineGoldEl = document.getElementById('resMeltFineGold');
  const meltValueEl = document.getElementById('resMeltValue');
  const meltBarsEl = document.getElementById('resMeltBars');

  if (!grossInput) return;

  function updateMeltCalculator() {
    const grossWeight = parseFloat(grossInput?.value) || 0;
    const lossPct = parseFloat(lossInput?.value) || 0;
    const finenessPct = parseFloat(finenessInput?.value) || 0;
    const rate24k = parseFloat(rateInput?.value) || bullionRates.gold24k;

    const lossGrams = grossWeight * (lossPct / 100);
    const postWeight = Math.max(0, grossWeight - lossGrams);
    const fineGoldGrams = postWeight * (finenessPct / 100);
    const ratePerGram24k = rate24k / 10;
    const totalValue = fineGoldGrams * ratePerGram24k;

    // Standard Minted Bars Breakdown
    const tenGramBars = Math.floor(fineGoldGrams / 10);
    const looseGrams = (fineGoldGrams % 10).toFixed(3);

    if (postWeightEl) postWeightEl.textContent = `${postWeight.toFixed(3)} g`;
    if (lossGramsEl) lossGramsEl.textContent = `${lossGrams.toFixed(3)} g`;
    if (fineGoldEl) fineGoldEl.textContent = `${fineGoldGrams.toFixed(3)} g`;
    if (meltValueEl) {
      meltValueEl.textContent = `₹${Math.round(totalValue).toLocaleString('en-IN')}`;
      meltValueEl.classList.remove('calc-result-flash');
      void meltValueEl.offsetWidth; // trigger reflow
      meltValueEl.classList.add('calc-result-flash');
    }
    if (meltBarsEl) {
      meltBarsEl.textContent = `${tenGramBars} x 10g Bars + ${looseGrams}g loose grain`;
    }
  }

  [grossInput, lossInput, finenessInput, rateInput].forEach(inp => {
    if (inp) inp.addEventListener('input', updateMeltCalculator);
  });

  updateMeltCalculator();
}

// 4. INTERACTIVE HUID SIMULATOR & EXPLAINER
function initHuidSimulator() {
  const genBtn = document.getElementById('generateHuidBtn');
  const huidDisplay = document.getElementById('simHuidCode');
  const purityDisplay = document.getElementById('simPurityCode');
  const simKaratSelect = document.getElementById('simKaratSelect');

  if (!genBtn || !huidDisplay) return;

  function generateRandomHuid() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // BIS avoids confusing 0/O, 1/I
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  genBtn.addEventListener('click', () => {
    huidDisplay.textContent = generateRandomHuid();
    huidDisplay.classList.add('scale-110');
    setTimeout(() => {
      huidDisplay.classList.remove('scale-110');
    }, 200);
  });

  if (simKaratSelect && purityDisplay) {
    simKaratSelect.addEventListener('change', () => {
      purityDisplay.textContent = simKaratSelect.value;
    });
  }
}

// 6. FAQ ACCORDION
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => {
        i.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// 7. BOOKING & INQUIRY FORM WITH INSTANT WHATSAPP HANDOFF
function initBookingForm() {
  const form = document.getElementById('sampleBookingForm');
  const successModal = document.getElementById('bookingSuccessModal');
  const closeBtn = document.getElementById('closeModalBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('bookName')?.value.trim();
    const phone = document.getElementById('bookPhone')?.value.trim();
    const company = document.getElementById('bookCompany')?.value.trim() || 'Independent Client';
    const metal = document.getElementById('bookMetal')?.value || 'Gold Jewellery';
    const quantity = document.getElementById('bookQuantity')?.value || 'Batch';
    const service = document.getElementById('bookService')?.value || 'Hallmarking & HUID';
    const date = document.getElementById('bookDate')?.value || 'Earliest Slot';
    const notes = document.getElementById('bookNotes')?.value.trim() || 'Standard turn-around requested';

    if (!name || !phone) {
      alert('Please fill in your name and phone number to proceed.');
      return;
    }

    const bookingId = 'BKG-' + Math.floor(10000 + Math.random() * 90000);
    const bookingTimestamp = new Date().toLocaleString('en-IN');

    // Booking Data Object for Google Sheets & Local Ledger
    const bookingRecord = {
      id: bookingId,
      timestamp: bookingTimestamp,
      name: name,
      phone: phone,
      company: company,
      service: service,
      metal: `${metal} (${quantity})`,
      date: date,
      notes: notes
    };

    // 1. Save to Local Online Bookings Ledger
    try {
      let currentBookings = JSON.parse(localStorage.getItem('ansh_online_bookings') || '[]');
      currentBookings.unshift(bookingRecord);
      localStorage.setItem('ansh_online_bookings', JSON.stringify(currentBookings));
    } catch(err) {}

    // 2. Dispatch to Connected Google Sheets Apps Script Webhook
    try {
      const sheetWebhook = localStorage.getItem('ansh_google_sheet_webhook_url');
      if (sheetWebhook && sheetWebhook.startsWith('http')) {
        fetch(sheetWebhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingRecord)
        }).catch(e => console.log('Google Sheets dispatch notice:', e));
      }
    } catch(err) {}

    // Prepare WhatsApp Link for instant direct engagement
    const centerWhatsApp = '919876543210'; // Representative Center Helpline
    const waText = encodeURIComponent(
      `Hello ANSH Assaying & Hallmarking Centre,\n\nI have submitted an online testing booking:\n` +
      `🔖 Booking ID: ${bookingId}\n` +
      `👤 Name: ${name}\n` +
      `🏢 Company / Jeweller: ${company}\n` +
      `📞 Phone: ${phone}\n` +
      `🔬 Service: ${service}\n` +
      `🪙 Metal / Article: ${metal} (${quantity})\n` +
      `📅 Preferred Date: ${date}\n` +
      `📝 Remarks: ${notes}\n\nPlease confirm slot availability and custody guidelines.`
    );

    const waBtn = document.getElementById('modalWhatsAppBtn');
    if (waBtn) {
      waBtn.href = `https://wa.me/${centerWhatsApp}?text=${waText}`;
    }

    const modalSummary = document.getElementById('modalDetails');
    if (modalSummary) {
      modalSummary.innerHTML = `
        <div class="space-y-1.5 text-left bg-slate-900/90 p-3.5 rounded-xl border border-amber-500/30 text-xs">
          <div class="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <span class="text-slate-400">Booking Reference:</span>
            <span class="text-amber-300 font-mono font-bold">${bookingId}</span>
          </div>
          <div><strong class="text-amber-300">Name:</strong> <span class="text-white">${name}</span></div>
          <div><strong class="text-amber-300">Client / Firm:</strong> <span class="text-white">${company}</span></div>
          <div><strong class="text-amber-300">Contact:</strong> <span class="text-white">${phone}</span></div>
          <div><strong class="text-amber-300">Selected Service:</strong> <span class="text-white">${service}</span></div>
          <div><strong class="text-amber-300">Items:</strong> <span class="text-white">${metal} (${quantity})</span></div>
          <div class="text-[10px] text-emerald-400 pt-1 border-t border-slate-800 flex items-center gap-1">
            <i class="fas fa-check-circle"></i> Logged into Center Laboratory Ledger & Google Sheets Queue
          </div>
        </div>
      `;
    }

    if (successModal) {
      successModal.classList.remove('hidden');
    }

    form.reset();
  });

  if (closeBtn && successModal) {
    closeBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
    });
  }
}

// 7. BIS CARE VERIFICATION SIMULATOR & CONSUMER PROTECTION HUB
function initBisCareVerification() {
  const btn = document.getElementById('bisCareVerifyBtn');
  const btnText = document.getElementById('bisCareBtnText');
  const input = document.getElementById('bisCareInput');
  const errorBox = document.getElementById('bisCareErrorMsg');
  const errorText = document.getElementById('bisCareErrorText');
  const inlineResult = document.getElementById('bisCareInlineResult');
  const inlineHuid = document.getElementById('inlineHuidCode');
  const inlinePurity = document.getElementById('inlinePurityGrade');
  const inlineAhc = document.getElementById('inlineAhcCode');
  const openModalBtn = document.getElementById('openFullBisModalBtn');
  const sampleBtns = document.querySelectorAll('.sample-huid-btn');

  const modal = document.getElementById('bisCareResultModal');
  const closeBtn = document.getElementById('closeBisCareModalBtn');
  const okBtn = document.getElementById('okBisCareModalBtn');
  const modalHuid = document.getElementById('bisModalHuid');
  const modalPurity = document.getElementById('bisModalPurity');
  const copyBtn = document.getElementById('copyModalHuidBtn');

  if (!btn || !input) return;

  // Auto-uppercase and sanitize input
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (errorBox) errorBox.classList.add('hidden');
  });

  function getPurityForCode(code) {
    if (code.includes('24') || code.startsWith('BL')) {
      return '24K (999 Fineness - 99.9% Pure)';
    } else if (code.includes('18') || code.startsWith('KA')) {
      return '18K (750 Fineness - 75.0% Pure)';
    } else if (code.includes('14')) {
      return '14K (585 Fineness - 58.5% Pure)';
    }
    return '22K (916 Fineness - 91.6% Pure)';
  }

  function getActiveAhcCode() {
    try {
      const saved = localStorage.getItem('ansh_lab_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ahcCode) return parsed.ahcCode;
      }
    } catch (e) {}
    return 'AH-DEL-8942 / Active';
  }

  function executeVerification(codeToVerify) {
    const raw = (codeToVerify || input.value || '').trim().toUpperCase();
    
    // Validation
    if (!raw || raw.length < 6) {
      if (errorBox && errorText) {
        errorText.textContent = 'Please enter a complete 6-digit alphanumeric HUID code (e.g. AH78Q2).';
        errorBox.classList.remove('hidden');
      }
      input.focus();
      return;
    }

    if (errorBox) errorBox.classList.add('hidden');

    // Button loading state
    btn.disabled = true;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin text-base"></i><span>Querying BIS Database...</span>';

    setTimeout(() => {
      const purityStr = getPurityForCode(raw);
      const ahcCodeStr = getActiveAhcCode();

      // Update inline card
      if (inlineHuid) inlineHuid.textContent = raw;
      if (inlinePurity) inlinePurity.textContent = purityStr;
      if (inlineAhc) inlineAhc.textContent = ahcCodeStr;

      if (inlineResult) {
        inlineResult.classList.remove('hidden');
        inlineResult.classList.add('calc-result-flash');
        setTimeout(() => inlineResult.classList.remove('calc-result-flash'), 600);
      }

      // Update modal
      if (modalHuid) modalHuid.textContent = raw;
      if (modalPurity) modalPurity.textContent = purityStr;

      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check-double text-emerald-400 text-base"></i><span>Verified on BIS Care</span>';

      setTimeout(() => {
        btn.innerHTML = originalHtml;
      }, 3000);
    }, 450);
  }

  btn.addEventListener('click', () => executeVerification());

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeVerification();
    }
  });

  // Sample quick-test buttons
  sampleBtns.forEach(sb => {
    sb.addEventListener('click', () => {
      const sampleCode = sb.getAttribute('data-code');
      if (sampleCode) {
        input.value = sampleCode;
        executeVerification(sampleCode);
      }
    });
  });

  // Open Full Modal button
  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  // Modal dismiss handlers
  if (modal) {
    [closeBtn, okBtn].forEach(b => {
      if (b) b.addEventListener('click', () => modal.classList.add('hidden'));
    });

    // Dismiss on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });

    // Dismiss on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }
    });
  }

  // Copy HUID Code in Modal
  if (copyBtn && modalHuid) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(modalHuid.textContent).then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check text-emerald-400"></i>';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 1500);
      }).catch(() => {});
    });
  }
}

// 8. MASTER FEATURE & SECTION VISIBILITY CONTROLLER (Synced from Admin Panel)
function applyFeatureVisibility() {
  let features = {
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

  try {
    const raw = localStorage.getItem('ansh_website_features');
    if (raw) features = { ...features, ...JSON.parse(raw) };
  } catch (err) {
    // Keep defaults
  }

  function toggleSectionAndNav(isVisible, selector) {
    const sec = document.querySelector(selector);
    if (sec) {
      if (isVisible === false) sec.classList.add('hidden');
      else sec.classList.remove('hidden');
    }

    document.querySelectorAll(`a[href="${selector}"]`).forEach(link => {
      if (isVisible === false) link.classList.add('hidden');
      else link.classList.remove('hidden');
    });
  }

  // 1. Testing Process
  toggleSectionAndNav(features.process, '#process');

  // 2. Karat & Melt Calculator
  toggleSectionAndNav(features.calculator, '#calculator');

  // 3. BIS 3-Sign Standard & HUID Guide
  toggleSectionAndNav(features.bisGuide, '#bis-guide');

  // 3B. Consumer Protection Guide & Live Verification (BIS Care HUID Simulator)
  const consumerBlock = document.getElementById('consumerVerificationBlock');
  if (consumerBlock) {
    if (features.consumerVerification === false) consumerBlock.classList.add('hidden');
    else consumerBlock.classList.remove('hidden');
  }

  // 4. Accredited Services
  toggleSectionAndNav(features.services, '#services');

  // 5. Lab Equipment & Instrumentation
  toggleSectionAndNav(features.equipment, '#equipment');

  // 6. B2B Jeweller Partnership Program
  const partnerSec = document.getElementById('jeweller-partner');
  if (partnerSec) {
    if (features.jewellerPartner === false) partnerSec.classList.add('hidden');
    else partnerSec.classList.remove('hidden');
  }

  // 7. FAQ Accordion
  toggleSectionAndNav(features.faq, '#faq');

  // 8. Online Booking Form & Action Buttons
  const bookingSec = document.getElementById('booking');
  if (bookingSec) {
    if (features.booking === false) bookingSec.classList.add('hidden');
    else bookingSec.classList.remove('hidden');
  }
  document.querySelectorAll('a[href="#booking"]').forEach(btn => {
    if (features.booking === false) btn.classList.add('hidden');
    else btn.classList.remove('hidden');
  });

  // 9. Floating WhatsApp Button
  const waBtn = document.getElementById('whatsappFloating');
  if (waBtn) {
    if (features.whatsapp === false) waBtn.classList.add('hidden');
    else waBtn.classList.remove('hidden');
  }

  // 10. Live Bullion Ticker Bar
  const tickerBar = document.getElementById('topTickerBar');
  if (tickerBar) {
    if (features.ticker === false) tickerBar.classList.add('hidden');
    else tickerBar.classList.remove('hidden');
  }
}

// 11. DYNAMIC SERVICE REQUIRED OPTIONS
const defaultServiceOptions = [
  'BIS Gold Hallmarking & HUID Inscription',
  'Gold Fire Assay (Cupellation - IS 1418)',
  'Silver Assaying & Hallmarking (IS 2113)',
  'Rapid XRF Non-Destructive Screening',
  'Melt & Bullion Bar Certification',
  'Consumer Independent Purity Audit'
];

function initServiceOptions() {
  const serviceSelect = document.getElementById('bookService');
  if (!serviceSelect) return;

  let services = defaultServiceOptions;
  try {
    const raw = localStorage.getItem('ansh_service_options');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        services = parsed;
      }
    }
  } catch (e) {}

  const currentVal = serviceSelect.value;
  serviceSelect.innerHTML = services.map(s => {
    return `<option value="${escapeFormAttr(s)}">${escapeFormHtml(s)}</option>`;
  }).join('');

  if (services.includes(currentVal)) {
    serviceSelect.value = currentVal;
  }
}

function escapeFormHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeFormAttr(str) {
  return String(str || '')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 12. WHOLE WEBSITE CONTENT APPLIER
function applyWholeWebsiteContent() {
  let fullData = null;
  try {
    const rawFull = localStorage.getItem('ansh_full_site_content');
    if (rawFull) fullData = JSON.parse(rawFull);
  } catch (e) {}

  let legacyInfo = null;
  try {
    const rawLeg = localStorage.getItem('ansh_lab_info');
    if (rawLeg) legacyInfo = JSON.parse(rawLeg);
  } catch (e) {}

  if (!fullData && !legacyInfo) return;

  function setTxt(id, val) {
    if (val === undefined || val === null || val === '') return;
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // 1. Hero & Brand
  if (fullData?.hero) {
    const h = fullData.hero;
    setTxt('heroBadgeText', h.badgeText);
    setTxt('heroHeadlineLine1', h.headlineLine1);
    setTxt('heroHeadlineGradient', h.headlineGradient);
    setTxt('heroHeadlineLine2', h.headlineLine2);
    setTxt('heroSubtitle', h.subtitle);
    setTxt('heroCta1Text', h.cta1Text);
    setTxt('heroCta2Text', h.cta2Text);
    if (h.cta1Link) {
      const el = document.getElementById('heroCta1Link');
      if (el) el.href = h.cta1Link;
    }
    if (h.cta2Link) {
      const el = document.getElementById('heroCta2Link');
      if (el) el.href = h.cta2Link;
    }
    setTxt('heroMetric1Val', h.metric1Val);
    setTxt('heroMetric1Lbl', h.metric1Lbl);
    setTxt('heroMetric2Val', h.metric2Val);
    setTxt('heroMetric2Lbl', h.metric2Lbl);
    setTxt('heroMetric3Val', h.metric3Val);
    setTxt('heroMetric3Lbl', h.metric3Lbl);
    setTxt('heroMetric4Val', h.metric4Val);
    setTxt('heroMetric4Lbl', h.metric4Lbl);
    if (h.statutoryTariff) {
      document.querySelectorAll('.statutory-tariff-text').forEach(el => el.textContent = h.statutoryTariff);
    }
  }

  // 2. BIS 3-Sign Standard Guide
  if (fullData?.bisGuide) {
    const bg = fullData.bisGuide;
    setTxt('bisGuideBadge', bg.badge);
    setTxt('bisGuideTitle', bg.title);
    setTxt('bisGuideDesc', bg.desc);
    setTxt('bisSign1Title', bg.sign1Title);
    setTxt('bisSign1Desc', bg.sign1Desc);
    setTxt('bisSign2Title', bg.sign2Title);
    setTxt('bisSign2Desc', bg.sign2Desc);
    setTxt('bisSign3Title', bg.sign3Title);
    setTxt('bisSign3Desc', bg.sign3Desc);
  }

  // 3. Consumer Protection Guide & Verification
  if (fullData?.consumerGuide) {
    const cg = fullData.consumerGuide;
    setTxt('consumerGuideBadge', cg.badge);
    setTxt('consumerGuideTitle', cg.title);
    setTxt('consumerGuideDesc', cg.desc);
    setTxt('consumerPillar1Title', cg.pillar1Title);
    setTxt('consumerPillar1Desc', cg.pillar1Desc);
    setTxt('consumerPillar2Title', cg.pillar2Title);
    setTxt('consumerPillar2Desc', cg.pillar2Desc);
    setTxt('consumerPillar3Title', cg.pillar3Title);
    setTxt('consumerPillar3Desc', cg.pillar3Desc);
  }

  // 4. 6 Core Services
  if (fullData?.services) {
    const s = fullData.services;
    setTxt('servicesBadge', s.badge);
    setTxt('servicesTitle', s.title);
    setTxt('servicesDesc', s.desc);
    setTxt('s1Title', s.s1Title); setTxt('s1Tag', s.s1Tag); setTxt('s1Desc', s.s1Desc);
    setTxt('s2Title', s.s2Title); setTxt('s2Tag', s.s2Tag); setTxt('s2Desc', s.s2Desc);
    setTxt('s3Title', s.s3Title); setTxt('s3Tag', s.s3Tag); setTxt('s3Desc', s.s3Desc);
    setTxt('s4Title', s.s4Title); setTxt('s4Tag', s.s4Tag); setTxt('s4Desc', s.s4Desc);
    setTxt('s5Title', s.s5Title); setTxt('s5Tag', s.s5Tag); setTxt('s5Desc', s.s5Desc);
    setTxt('s6Title', s.s6Title); setTxt('s6Tag', s.s6Tag); setTxt('s6Desc', s.s6Desc);
  }

  // 5. 5-Step Process Workflow
  if (fullData?.process) {
    const p = fullData.process;
    setTxt('processBadge', p.badge);
    setTxt('processTitle', p.title);
    setTxt('processDesc', p.desc);
    setTxt('step1Title', p.step1Title); setTxt('step1Desc', p.step1Desc); setTxt('step1Meta', p.step1Meta);
    setTxt('step2Title', p.step2Title); setTxt('step2Desc', p.step2Desc); setTxt('step2Meta', p.step2Meta);
    setTxt('step3Title', p.step3Title); setTxt('step3Desc', p.step3Desc); setTxt('step3Meta', p.step3Meta);
    setTxt('step4Title', p.step4Title); setTxt('step4Desc', p.step4Desc); setTxt('step4Meta', p.step4Meta);
    setTxt('step5Title', p.step5Title); setTxt('step5Desc', p.step5Desc); setTxt('step5Meta', p.step5Meta);
  }

  // 6. Lab Tech & B2B
  if (fullData?.techAndB2b) {
    const tb = fullData.techAndB2b;
    setTxt('techBadge', tb.techBadge);
    setTxt('techTitle', tb.techTitle);
    setTxt('techDesc', tb.techDesc);
    setTxt('eq1Title', tb.eq1Title); setTxt('eq1Desc', tb.eq1Desc);
    setTxt('eq2Title', tb.eq2Title); setTxt('eq2Desc', tb.eq2Desc);
    setTxt('eq3Title', tb.eq3Title); setTxt('eq3Desc', tb.eq3Desc);
    setTxt('eq4Title', tb.eq4Title); setTxt('eq4Desc', tb.eq4Desc);

    setTxt('b2bBadge', tb.b2bBadge);
    setTxt('b2bTitle', tb.b2bTitle);
    setTxt('b2bDesc', tb.b2bDesc);
    setTxt('b2bBullet1', tb.b2bBullet1);
    setTxt('b2bBullet2', tb.b2bBullet2);
    setTxt('b2bBullet3', tb.b2bBullet3);
    setTxt('b2bCta1Text', tb.b2bCta1Text);
    setTxt('b2bCta2Text', tb.b2bCta2Text);
  }

  // 7. FAQs
  if (fullData?.faqs) {
    const f = fullData.faqs;
    setTxt('faqBadge', f.badge);
    setTxt('faqTitle', f.title);
    setTxt('faqDesc', f.desc);
    setTxt('faqQ1', f.q1); setTxt('faqA1', f.a1);
    setTxt('faqQ2', f.q2); setTxt('faqA2', f.a2);
    setTxt('faqQ3', f.q3); setTxt('faqA3', f.a3);
    setTxt('faqQ4', f.q4); setTxt('faqA4', f.a4);
    setTxt('faqQ5', f.q5); setTxt('faqA5', f.a5);
  }

  // 8. Contact & Rates (combining fullData.contact and legacyInfo)
  const c = fullData?.contact || legacyInfo || {};
  if (c.phone) {
    const phoneEl = document.getElementById('infoDirectPhone');
    if (phoneEl) {
      phoneEl.textContent = c.phone;
      phoneEl.href = `tel:${c.phone.replace(/[^0-9+]/g, '')}`;
    }
  }
  if (c.whatsapp) {
    const b2bEl = document.getElementById('infoB2bPhone');
    if (b2bEl) {
      b2bEl.textContent = c.whatsapp;
      b2bEl.href = `tel:${c.whatsapp.replace(/[^0-9+]/g, '')}`;
    }
    const waFloating = document.getElementById('whatsappFloating');
    if (waFloating) {
      const cleanWa = c.whatsapp.replace(/[^0-9]/g, '');
      waFloating.href = `https://wa.me/${cleanWa}?text=Hello%20ANSH%20Hallmarking%20Centre,%20I%20want%20to%20inquire%20about%20gold/silver%20testing`;
    }
  }
  if (c.email) {
    const emailEl = document.getElementById('infoLabEmail');
    if (emailEl) {
      emailEl.textContent = c.email;
      emailEl.href = `mailto:${c.email}`;
    }
  }
  if (c.address) setTxt('infoLabAddress', c.address);
  if (c.hours) setTxt('infoLabHours', c.hours);
  if (c.ahcCode) setTxt('infoAhcCode', c.ahcCode);

  if (c.rateGold24) {
    document.querySelectorAll('.rate-gold24').forEach(el => el.textContent = c.rateGold24);
  }
  if (c.rateGold22) {
    document.querySelectorAll('.rate-gold22').forEach(el => el.textContent = c.rateGold22);
  }
  if (c.rateSilver999) {
    document.querySelectorAll('.rate-silver999').forEach(el => el.textContent = c.rateSilver999);
  }

  // Backwards compatibility for legacyInfo hero metrics if fullData wasn't set
  if (!fullData?.hero && legacyInfo) {
    setTxt('heroMetric1Val', legacyInfo.metric1Val);
    setTxt('heroMetric1Lbl', legacyInfo.metric1Lbl);
    setTxt('heroMetric2Val', legacyInfo.metric2Val);
    setTxt('heroMetric2Lbl', legacyInfo.metric2Lbl);
    setTxt('heroMetric3Val', legacyInfo.metric3Val);
    setTxt('heroMetric3Lbl', legacyInfo.metric3Lbl);
    setTxt('heroMetric4Val', legacyInfo.metric4Val);
    setTxt('heroMetric4Lbl', legacyInfo.metric4Lbl);
    if (legacyInfo.statutoryTariff) {
      document.querySelectorAll('.statutory-tariff-text').forEach(el => el.textContent = legacyInfo.statutoryTariff);
    }
  }

  // Top Announcement Banner
  const banner = document.getElementById('topAnnouncementBanner');
  const bannerText = document.getElementById('announcementBannerText');
  if (banner && bannerText) {
    const showNotice = c.showNotice !== false;
    const text = c.noticeText || '';
    if (showNotice && text.trim()) {
      bannerText.textContent = text.trim();
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  // Footer copyright
  if (c.footerCopyright) {
    setTxt('footerCopyrightText', c.footerCopyright);
  }
}

// Backwards-compatible alias
function applyLabInformation() {
  applyWholeWebsiteContent();
}

// 12. SCROLL REVEAL & STAGGER ANIMATIONS
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    elements.forEach(el => el.classList.add('is-revealed'));
  }
}

// 13. FLOATING GOLD AMBIENT PARTICLES
function initGoldParticles() {
  const container = document.getElementById('goldParticles');
  if (!container) return;

  container.innerHTML = '';
  const count = 28;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'gold-particle';

    const size = Math.random() * 4 + 2; // 2px to 6px
    const left = Math.random() * 100; // 0% to 100%
    const duration = Math.random() * 8 + 8; // 8s to 16s
    const delay = Math.random() * 6; // 0s to 6s
    const opacity = (Math.random() * 0.4 + 0.35).toFixed(2);

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = opacity;

    frag.appendChild(particle);
  }

  container.appendChild(frag);
}

// ============================================================
// COMPANY ONBOARDING & COMPLIANCE ENGINE v2.0
// Fully integrated with DATA_WAGES, DATA_OSH, DATA_IR, DATA_SS
// Generates section-by-section, rule-by-rule, form-by-form report
// ============================================================

const ONBOARD = {

  open() {
    document.getElementById('onboardOverlay').classList.add('open');
    document.body.classList.add('modal-open');
    ONBOARD.resetForm();
  },

  close() {
    document.getElementById('onboardOverlay').classList.remove('open');
    document.body.classList.remove('modal-open');
  },

  resetForm() {
    ['obCompanyName','obEmployeeName','obDesignation','obGST','obContact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    ['obIndustry','obEmployeeCount','obCompanyType','obState'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    ['obContractLabour','obMines','obConstruction','obPlantation','obMigrant','obBOCW'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });
    document.getElementById('onboardStep1').style.display = 'block';
    document.getElementById('onboardStep2').style.display = 'none';
    document.getElementById('onboardStep3').style.display = 'none';
    ONBOARD.setProgress(1);
  },

  setProgress(step) {
    const pcts = { 1: '33%', 2: '66%', 3: '100%' };
    const labels = {
      1: 'Step 1 of 3 — Company Details',
      2: 'Step 2 of 3 — Additional Details',
      3: 'Step 3 of 3 — Your Compliance Report'
    };
    document.getElementById('obProgressBar').style.width = pcts[step];
    document.getElementById('obProgressLabel').textContent = labels[step];
  },

  goStep2() {
    const required = ['obCompanyName','obEmployeeName','obDesignation','obIndustry','obEmployeeCount','obCompanyType'];
    for (const id of required) {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        if (el) { el.focus(); el.style.borderColor = '#F07070'; setTimeout(() => el.style.borderColor = '', 2000); }
        ONBOARD.showToast('Please fill all required fields.');
        return;
      }
    }
    document.getElementById('onboardStep1').style.display = 'none';
    document.getElementById('onboardStep2').style.display = 'block';
    ONBOARD.setProgress(2);
  },

  goStep1() {
    document.getElementById('onboardStep2').style.display = 'none';
    document.getElementById('onboardStep1').style.display = 'block';
    ONBOARD.setProgress(1);
  },

  generate() {
    const data = ONBOARD.collectFormData();
    const report = ONBOARD.computeCompliance(data);
    ONBOARD.renderReport(data, report);
    document.getElementById('onboardStep2').style.display = 'none';
    document.getElementById('onboardStep3').style.display = 'block';
    ONBOARD.setProgress(3);
  },

  collectFormData() {
    return {
      companyName:          (document.getElementById('obCompanyName').value || '').trim(),
      employeeName:         (document.getElementById('obEmployeeName').value || '').trim(),
      designation:          (document.getElementById('obDesignation').value || '').trim(),
      industry:             document.getElementById('obIndustry').value,
      employeeCount:        parseInt(document.getElementById('obEmployeeCount').value) || 0,
      companyType:          document.getElementById('obCompanyType').value,
      gstIn:                (document.getElementById('obGST').value || '').trim(),
      contactNumber:        (document.getElementById('obContact').value || '').trim(),
      state:                document.getElementById('obState').value,
      hasContractLabour:    document.getElementById('obContractLabour').checked,
      hasMines:             document.getElementById('obMines').checked,
      hasConstruction:      document.getElementById('obConstruction').checked,
      hasPlantation:        document.getElementById('obPlantation').checked,
      hasInterStateMigrant: document.getElementById('obMigrant').checked,
      hasBOCW:              document.getElementById('obBOCW').checked,
    };
  },

  // ============================================================
  // CORE ENGINE — pulls from actual DATA_* objects
  // ============================================================
  computeCompliance(d) {
    const n = d.employeeCount;
    const result = { codes: [], summary: {} };

    // ── 1. CODE ON WAGES ────────────────────────────────────────
    const wData = (typeof DATA_WAGES !== 'undefined') ? DATA_WAGES : null;
    const wCode = ONBOARD.buildWagesCode(d, n, wData);
    result.codes.push(wCode);

    // ── 2. OSH & WC CODE ────────────────────────────────────────
    const oData = (typeof DATA_OSH !== 'undefined') ? DATA_OSH : null;
    const oCode = ONBOARD.buildOSHCode(d, n, oData);
    result.codes.push(oCode);

    // ── 3. INDUSTRIAL RELATIONS ──────────────────────────────────
    const iData = (typeof DATA_IR !== 'undefined') ? DATA_IR : null;
    const iCode = ONBOARD.buildIRCode(d, n, iData);
    result.codes.push(iCode);

    // ── 4. SOCIAL SECURITY ───────────────────────────────────────
    const sData = (typeof DATA_SS !== 'undefined') ? DATA_SS : null;
    const sCode = ONBOARD.buildSSCode(d, n, sData);
    result.codes.push(sCode);

    // Summary tallies
    result.summary.totalObligations = result.codes.reduce((a,c) => a + c.obligations.length, 0);
    result.summary.highPriority     = result.codes.reduce((a,c) => a + c.obligations.filter(o => o.priority === 'HIGH').length, 0);
    result.summary.totalForms       = [...new Set(result.codes.flatMap(c => c.allForms))].length;
    result.summary.totalSections    = result.codes.reduce((a,c) => a + c.applicableSections.length, 0);
    result.summary.totalRules       = result.codes.reduce((a,c) => a + c.applicableRules.length, 0);

    return result;
  },

  // ============================================================
  // CODE ON WAGES
  // ============================================================
  buildWagesCode(d, n, wData) {
    const acc = '#E8A020';
    const obligations = [];
    const applicableSections = [];
    const applicableRules = [];
    const allForms = [];

    // --- Sections from DATA_WAGES ---
    const secMap = {};
    if (wData && wData.sections) {
      wData.sections.forEach(s => { secMap[s.sec] = s; });
    }

    // Always: Min Wages
    ['5','6','7','8','13','14'].forEach(s => { if (secMap[s]) applicableSections.push(secMap[s]); });
    obligations.push({
      title: 'Minimum Wages — Mandatory for All',
      rule: 'Rule 3 / Sec 5–9, 13, 14',
      priority: 'HIGH',
      threshold: 'All Employees',
      details: `Pay minimum wages as notified by Central/State Govt for "${d.industry || 'your sector'}". Components: Basic Rate + VDA (revised before 1st April & 1st October each year based on CPI-IW). Overtime = minimum 2× normal rate. Normal working day = 8 hrs; weekly 48 hrs max.`,
      sections: ['Sec 5','Sec 6','Sec 7','Sec 8','Sec 13','Sec 14'],
      rules: ['Rule 3 (Wages Calculation)','Rule 4 (VDA Revision)','Rule 5 (Hours of Work)','Rule 6 (Rest Day)','Rule 9 (Longer Wage Period)'],
      forms: []
    });
    ['3','4','5','6','9'].forEach(r => { if (wData && wData.rules) { const found = wData.rules.find(x => String(x.r) === r); if (found) applicableRules.push(found); }});

    // Payment of Wages — all
    ['15','16','17','18','19'].forEach(s => { if (secMap[s]) applicableSections.push(secMap[s]); });
    obligations.push({
      title: 'Payment of Wages — Mode, Period & Deductions',
      rule: 'Rules 11–20 / Sec 15–24',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `Pay wages by bank/electronic mode. Wage period max 1 month. Monthly: pay by 7th of next month. On termination: within 2 working days. Total deductions ≤ 50% of wages. Fines ≤ 3% of wages in any period. 7-day show cause before imposing fine/deduction for damage. Authority for fines: Deputy CLC(C).`,
      sections: ['Sec 15','Sec 16','Sec 17','Sec 18','Sec 19','Sec 20','Sec 21'],
      rules: ['Rule 11 (Contractor Payment)','Rule 13 (Deductions Limit 50%)','Rule 14 (Fine Authority: DyCLC)','Rule 15 (Notice Display)','Rule 16 (Fine Procedure)','Rule 17 (Absence Deduction)','Rule 18 (Damage/Loss Deduction)'],
      forms: ['Form-IV (Wages/OT/Fines Register)']
    });
    allForms.push('Form-IV');

    // Records — all
    obligations.push({
      title: '3 Mandatory Registers + Wage Slip',
      rule: 'Rules 51–52 / Sec 50',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `FORM-I: Employee Register (name, UAN, PAN, Aadhaar, bank, photo, category: Highly Skilled/Skilled/Semi-Skilled/Unskilled). FORM-IV: Wages, OT, Advances, Fines, Deductions. FORM-IX: Attendance-cum-Muster Roll. All preserved 5 years from last entry. FORM-V Wage Slip: issued electronically/physically on or before payment — every wage period without exception.`,
      sections: ['Sec 50'],
      rules: ['Rule 51(i) Form-I Employee Register','Rule 51(ii) Form-IV Wages Register','Rule 51(iii) Form-IX Attendance','Rule 52 Wage Slip Form-V'],
      forms: ['Form-I','Form-IV','Form-V','Form-IX']
    });
    allForms.push('Form-I','Form-IV','Form-V','Form-IX');
    if (secMap['50']) applicableSections.push(secMap['50']);

    // Nomination — all
    obligations.push({
      title: 'Nomination for Undisbursed Dues — FORM-VII',
      rule: 'Rule 45 / Sec 44',
      priority: 'MEDIUM',
      threshold: 'All Employees',
      details: `Every employee must file FORM-VII nomination for undisbursed wages/bonus on death. If family exists, nomination must be in favour of spouse/family member. Fresh nomination mandatory after marriage. Multiple nominees: share specified. Employer certifies and returns duplicate. Undisbursed dues unpaid for 3+ months → deposit with DyCLC(C) within 15 days.`,
      sections: ['Sec 44'],
      rules: ['Rule 45 (Nomination)','Rule 46 (Deposit Deadline)','Rule 47 (Investment of Deposits)'],
      forms: ['Form-VII (Nomination)','Form-VIII (Notice to Respondent)']
    });
    allForms.push('Form-VII');
    if (secMap['44']) applicableSections.push(secMap['44']);

    // Bonus — 20+ employees
    if (n >= 20) {
      ['26','27','28','29','31','32','33','36','39'].forEach(s => { if (secMap[s]) applicableSections.push(secMap[s]); });
      obligations.push({
        title: `Bonus — 8.33% to 20% of Wages (${n} Employees)`,
        rule: 'Rules 21–28 / Sec 26–39',
        priority: 'HIGH',
        threshold: '20+ Employees',
        details: `Mandatory for establishments with 20+ employees. Eligibility: worked 30+ days in accounting year. Minimum bonus: 8.33% of wages or ₹100 (whichever higher). Maximum: 20% of wages. Payable within 8 months of close of accounting year. SET ON: excess carried forward up to 4 years (max 20% of total wages). SET OFF: deficit carried forward 4 years. Disqualification: fraud, violence, theft, sabotage. Computation: Gross Profit → Available Surplus → Allocable Surplus (60-67%) → Bonus. FORM-IX attendance register used to verify eligibility days.`,
        sections: ['Sec 26','Sec 27','Sec 28','Sec 29','Sec 31','Sec 32','Sec 33','Sec 36','Sec 39'],
        rules: ['Rule 21 (Contractor Bonus)','Rule 22 (6th Year Set-On)','Rule 23 (7th Year Set-On)','Rule 24 (Banking Gross Profit: Appendix B)','Rule 25 (Non-Banking Gross Profit: Appendix C)','Rule 26 (Further Deductions: Appendix D)','Rule 27 (Set On)','Rule 28 (Set Off)'],
        forms: []
      });
    }

    // Claims
    if (secMap['45']) applicableSections.push(secMap['45']);
    if (secMap['49']) applicableSections.push(secMap['49']);
    obligations.push({
      title: 'Claims & Appeals Process',
      rule: 'Rules 49–50 / Sec 45, 49',
      priority: 'MEDIUM',
      threshold: 'All',
      details: `Claims for short payment/deductions: FORM-II (single application for group). Filed within 3 years of cause of action. Authority issues FORM-VIII notice to employer. Ex-parte decision if employer absent. Appeal in FORM-III within 90 days. Employer must deposit claim amount at time of appeal — no appeal without deposit. Composition of offences: FORM-VI (50% of max fine) within 30 days.`,
      sections: ['Sec 45','Sec 49','Sec 52','Sec 53','Sec 54','Sec 56'],
      rules: ['Rule 49 (Claims Form-II)','Rule 50 (Appeals Form-III)','Rule 53 (Enquiry Procedure)','Rule 54 (Composition Form-VI)'],
      forms: ['Form-II (Claims)','Form-III (Appeal)','Form-VI (Composition)','Form-VIII (Notice)']
    });
    allForms.push('Form-II','Form-III','Form-VI','Form-VIII');

    // Equal Remuneration
    if (secMap['3']) applicableSections.push(secMap['3']);
    obligations.push({
      title: 'No Gender Discrimination in Wages',
      rule: 'Sec 3',
      priority: 'MEDIUM',
      threshold: 'All Employers',
      details: `No discrimination on grounds of gender in wages. No reduction of wages on ground that employee of opposite sex performs same/similar work. Inspector-cum-Facilitator may inspect records and take samples to verify compliance.`,
      sections: ['Sec 3'],
      rules: ['Sec 3 (Equal Remuneration)'],
      forms: []
    });

    return {
      code: 'wages', icon: '💰', name: 'Code on Wages, 2019',
      act: 'Act No. 29 of 2019', gsr: 'G.S.R. 343(E)', accent: acc,
      applicable: true,
      reason: 'Applies to ALL establishments and employees across India. No minimum threshold.',
      obligations,
      applicableSections: [...new Set(applicableSections)],
      applicableRules: [...new Set(applicableRules)],
      allForms: [...new Set(allForms)]
    };
  },

  // ============================================================
  // OSH & WC CODE
  // ============================================================
  buildOSHCode(d, n, oData) {
    const acc = '#1ECDE8';
    const obligations = [];
    const applicableSections = [];
    const applicableRules = [];
    const allForms = [];

    const secMap = {};
    if (oData && oData.sections) {
      oData.sections.forEach(s => { secMap[s.sec] = s; });
    }

    // Registration — always
    obligations.push({
      title: 'Registration on Shram Suvidha Portal — FORM-I & III',
      rule: 'Rule 3 / Sec 3',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `Electronic registration within 60 days of applicability in FORM-I on Shram Suvidha Portal. Registration Certificate in FORM-III auto-generated within 7 days; display at conspicuous places. Update registration within 30 days of any change. On closure: file FORM-II within 30 days with proof all dues paid. Common registration with SS Code — single Form-I covers both.`,
      sections: ['Sec 3','Sec 4','Sec 5'],
      rules: ['Rule 3 (Registration FORM-I)','Rule 4 (Notice Commencement/Cessation FORM-VI/VII)'],
      forms: ['Form-I (Registration)','Form-II (Cancellation)','Form-III (Certificate)','Form-VI (Commencement Notice)']
    });
    allForms.push('Form-I','Form-III','Form-VI');
    if (secMap['3']) applicableSections.push(secMap['3']);
    if (secMap['5']) applicableSections.push(secMap['5']);

    // Appointment Letter — all
    obligations.push({
      title: 'Letter of Appointment — Every Employee Before Joining',
      rule: 'Rule 6 / Sec 6',
      priority: 'HIGH',
      threshold: 'All Employees',
      details: `Written appointment letter MANDATORY before employment begins — no exceptions. Must contain: name, DOB, designation, type (permanent/temporary/FTE/trainee), wages, PF applicability, ESI applicability, nature of duties, maternity benefits (for women employees). No charge on employees for any safety measure.`,
      sections: ['Sec 6'],
      rules: ['Rule 6 (Appointment Letter)'],
      forms: []
    });
    if (secMap['6']) applicableSections.push(secMap['6']);

    // Accident Reporting — all
    obligations.push({
      title: 'Accident & Disease Reporting — FORM-XI',
      rule: 'Rule 7 / Sec 10, 11, 12',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `FATAL ACCIDENT: Forthwith (immediately) inform Inspector, Chief Inspector, District Magistrate, Police Station, and nearest family member. 48-HOUR DISABILITY ACCIDENT: within 12 hours in FORM-XI. DANGEROUS OCCURRENCES (bursting of plant, crane collapse, explosion, fire, toxic gas leakage, etc.): within 12 hours. NOTIFIABLE DISEASE (Third Schedule): report to Inspector immediately; attending medical practitioner independently reports to Chief Inspector within prescribed time.`,
      sections: ['Sec 10','Sec 11','Sec 12'],
      rules: ['Rule 7 (Accident/Occurrence Notice: Fatal=Forthwith, 48-hr=12hrs, Dangerous=12hrs)','Rule 8 (Occupational Disease Reporting)'],
      forms: ['Form-XI (Accident/Dangerous Occurrence Notice)','Form-XIX (Register of Accidents)']
    });
    allForms.push('Form-XI','Form-XIX');
    if (secMap['10']) applicableSections.push(secMap['10']);
    if (secMap['11']) applicableSections.push(secMap['11']);
    if (secMap['12']) applicableSections.push(secMap['12']);

    // Annual Return — all
    obligations.push({
      title: 'Annual Return — FORM-XVII by 28/29 February Each Year',
      rule: 'Rule 74 / Sec 33',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `File electronically to Inspector-cum-Facilitator on or before 28th/29th February every year. Covers: category of employees by skill and type, health/welfare facilities provided, retrenchments/layoffs, bonus, maternity benefits, accidents. Integrated with annual returns under other Codes (see SS Code FORM-XXIII for unified return).`,
      sections: ['Sec 33'],
      rules: ['Rule 74 (Annual Return FORM-XVII by 28/29 Feb)'],
      forms: ['Form-XVII (Annual Return)']
    });
    allForms.push('Form-XVII');
    if (secMap['33']) applicableSections.push(secMap['33']);

    // 4 Registers — all
    obligations.push({
      title: '4 Mandatory Electronic Registers + Notice Board',
      rule: 'Rules 72–73 / Sec 33',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `FORM-XIII: Employee Register (comprehensive). FORM-XIV: Attendance-cum-Muster Roll. FORM-XV: Register of Wages, Overtime and Deductions. FORM-XVI: Wage Slip (issued on or before day of payment). ALL maintained electronically and preserved 5 calendar years from last entry. MANDATORY NOTICE BOARD: hours of work, wages, accident notices (last 5 years), Inspector's details — in local language. FORM-XII: Notice of Periods of Work displayed before implementation.`,
      sections: ['Sec 33','Sec 31'],
      rules: ['Rule 72 (4 Registers: Form-XIII/XIV/XV/XVI)','Rule 73 (Notice Board Display)','Rule 75 (Accident Register Form-XIX)','Rule 76 (Leave Register Form-XX)'],
      forms: ['Form-XIII','Form-XIV','Form-XV','Form-XVI','Form-XII (Periods of Work)','Form-XX (Leave Register)']
    });
    allForms.push('Form-XIII','Form-XIV','Form-XV','Form-XVI','Form-XX');

    // Working hours — all
    obligations.push({
      title: 'Working Hours, OT & Annual Leave',
      rule: 'Rules 64–69, 76 / Sec 25–32',
      priority: 'HIGH',
      threshold: 'All Workers',
      details: `Max 8 hours/day; max 48 hours/week. Overtime = 2× rate (worker consent required). Fraction counting: 15–30 min = 30 min; over 30 min = 1 hour. 1 weekly rest day (Sunday in 6-day week). Max 10 consecutive working days. ANNUAL LEAVE: 1 day per 20 days worked (if 180 days worked in year). Adolescents/below-ground mine workers: 1 per 15 days. Max 30 days carry forward. On discharge/death: wages in lieu of leave payable.`,
      sections: ['Sec 25','Sec 26','Sec 27','Sec 32'],
      rules: ['Rule 64 (Working Hours 48hrs/week)','Rule 67 (Weekly Holiday)','Rule 68 (Compensatory Holidays)','Rule 69 (OT at 2×)','Rule 76 (Leave Register Form-XX)'],
      forms: []
    });
    if (secMap['25']) applicableSections.push(secMap['25']);
    if (secMap['27']) applicableSections.push(secMap['27']);
    if (secMap['32']) applicableSections.push(secMap['32']);

    // Annual health exam 40+
    if (n >= 1) {
      obligations.push({
        title: 'Annual Health Examination for Employees Aged 40+ Years',
        rule: 'Rule 5 / Sec 6',
        priority: 'MEDIUM',
        threshold: 'All Employees Aged 40+',
        details: `Free annual medical examination for all employees aged 40+ years in FORM-VIII. Cannot charge employee for this. Certificate issued by Medical Officer. Employer must facilitate and maintain records.`,
        sections: ['Sec 6'],
        rules: ['Rule 5 (Annual Health Exam FORM-VIII)'],
        forms: ['Form-VIII (Health Examination Certificate)']
      });
      allForms.push('Form-VIII');
    }

    // Toilet mandate — all
    obligations.push({
      title: 'Toilets: 1 per 25 Males / 1 per 15 Females + Sanitary Napkins',
      rule: 'Rule 47 / Sec 23',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `Separate latrines/urinals for male, female, transgender, and PwD workers. Minimum ratio: 1 per 25 males; 1 per 15 females. Glazed tiled walls to height of 90cm. SANITARY NAPKINS provided FREE in women's toilets and replenished daily without request. Notice boards outside each facility. Adequately lighted and ventilated. Maintained in clean condition.`,
      sections: ['Sec 23'],
      rules: ['Rule 47 (Latrine/Urinal: 1 per 25M / 1 per 15F; Sanitary Napkins Free)','Rule 48 (Waste Treatment)'],
      forms: []
    });
    if (secMap['23']) applicableSections.push(secMap['23']);

    // Women night work
    obligations.push({
      title: 'Night Work for Women — Written Consent + Safety Requirements',
      rule: 'Rule 83 / Sec 43',
      priority: 'HIGH',
      threshold: 'Where Women Employed Before 6 AM or After 7 PM',
      details: `Mandatory requirements: (1) Written consent from woman employee. (2) CCTV surveillance of workplace during night hours. (3) Well-lit workplace and approach roads. (4) Transport facility (pick-up and drop to residence). (5) Dedicated telephone numbers for emergencies displayed. (6) POSH Act compliance mandatory. (7) Adequate safety measures certified before employment.`,
      sections: ['Sec 43','Sec 44'],
      rules: ['Rule 83 (Night Work Women: Consent+CCTV+Transport+POSH)','Rule 84 (Dangerous Operations)'],
      forms: []
    });
    if (secMap['43']) applicableSections.push(secMap['43']);

    // Size-based obligations
    if (n >= 50) {
      obligations.push({
        title: `Rest Room + Crèche for Children Under 6 (${n} > 50)`,
        rule: 'Rules 56, 58 / Sec 24',
        priority: 'HIGH',
        threshold: '50+ Workers',
        details: `SHELTER/REST ROOM/LUNCHROOM: Separate for all genders; adequately lighted and ventilated; maintained clean. CRÈCHE: For children under 6 years of employees. FREE of charge. CCTV monitoring during all working hours (24×7). Police verification of ALL crèche staff. No child left alone at any point. Dedicated feeding room. Evacuation plan displayed prominently. 4 visits per day allowed during working hours.`,
        sections: ['Sec 24'],
        rules: ['Rule 56 (Rest Room/Lunchroom: 50+ workers)','Rule 58 (Crèche: CCTV+Police Verification+No Child Alone)'],
        forms: []
      });
      if (secMap['24']) applicableSections.push(secMap['24']);
    }

    if (n >= 100) {
      obligations.push({
        title: `Canteen — No Profit No Loss Basis (${n} > 100)`,
        rule: 'Rule 53 / Sec 24',
        priority: 'HIGH',
        threshold: '100+ Workers',
        details: `Canteen run on NO-PROFIT-NO-LOSS basis. Must serve nutritious, wholesome food. Special portions for women workers and PwD. CANTEEN MANAGING COMMITTEE: equal employer-worker representation; recommends menu and prices; meets regularly. Proper furniture and utensils. No contractors making profit. Menu prices fixed by Managing Committee.`,
        sections: ['Sec 24'],
        rules: ['Rule 53 (Canteen: No Profit-No Loss; Managing Committee)'],
        forms: []
      });
    }

    if (n >= 250) {
      obligations.push({
        title: `Welfare Officer Appointment (${n} > 250)`,
        rule: 'Rule 57 / Sec 24',
        priority: 'HIGH',
        threshold: '250+ Workers',
        details: `Appoint qualified Welfare Officer. Qualification: PG degree/diploma in social work, HR, labour welfare, or industrial relations. Appointment intimated to Inspector-cum-Facilitator. Duties include: welfare activities, grievance handling, liaison with workers, implementation of welfare schemes.`,
        sections: ['Sec 24'],
        rules: ['Rule 57 (Welfare Officer: PG Degree; Intimation to Inspector)'],
        forms: []
      });
    }

    if (n >= 500) {
      obligations.push({
        title: `Safety Committee + Ambulance Room (${n} > 500)`,
        rule: 'Rules 14–15, 55 / Sec 22, 24',
        priority: 'HIGH',
        threshold: '500+ Workers',
        details: `SAFETY COMMITTEE: Max 20 members; equal employer-worker representation; women represented proportionally; term 3 years; meets AT LEAST ONCE EVERY QUARTER. Employer must act on recommendations within 15 days. AMBULANCE ROOM: Round-the-clock staffing. Full-time MBBS doctor with occupational health diploma or training. Stretcher, splints, bandages, resuscitation equipment. Mock drills: quarterly emergency preparedness drills mandatory in all factories (Rule 59).`,
        sections: ['Sec 22','Sec 24'],
        rules: ['Rule 14 (Safety Committee 500+: 20 Members Quarterly)','Rule 15 (Safety Committee Composition)','Rule 55 (Ambulance Room: MBBS Doctor 24×7)','Rule 59 (Mock Drills: Quarterly)'],
        forms: []
      });
      if (secMap['22']) applicableSections.push(secMap['22']);
    } else if (n >= 250 && (d.hasConstruction || d.companyType === 'construction')) {
      obligations.push({
        title: `Safety Committee for Hazardous/Construction (${n} > 250)`,
        rule: 'Rule 14 / Sec 22',
        priority: 'HIGH',
        threshold: '250+ Workers (Hazardous/Construction)',
        details: `Safety Committee mandatory for hazardous process factories with 250+ workers or construction sites with 250+ workers. Equal representation; women proportional; quarterly meetings; recommendations acted on within 15 days.`,
        sections: ['Sec 22'],
        rules: ['Rule 14 (Safety Committee 250+: Hazardous/Construction)'],
        forms: []
      });
    }

    // Contract Labour
    if (d.hasContractLabour || n >= 50) {
      obligations.push({
        title: 'Contractor Licence — FORM-XXI (50+ Contract Labour)',
        rule: 'Rules 85–97 / Sec 45–57',
        priority: 'HIGH',
        threshold: '50+ Contract Labour',
        details: `CONTRACTOR: Must obtain licence in FORM-XXI before engaging any contract labour. Licence valid 5 years. Single licence available for multi-State operations. Cannot charge any fee/commission from contract labour. Must intimate work order receipt to designated authority. PRINCIPAL EMPLOYER: Responsible for welfare facilities (Sec 23, 24) for ALL contract labour — cannot delegate to contractor. If contractor fails to pay wages: principal employer pays and recovers. Experience certificate in FORM-XXIII on completion of work. PROHIBITION: No contract labour in core activities of establishment (exceptions: ordinarily done through contractor; sudden volume increase).`,
        sections: ['Sec 45','Sec 47','Sec 48','Sec 53','Sec 55','Sec 57'],
        rules: ['Rule 85 (Contractor Qualifications)','Rule 87 (Licence FORM-XXI; 5-year validity)','Rule 93 (Contractor Welfare Responsibility)','Rule 98 (Principal Employer Wage Liability)','Rule 100 (Experience Certificate FORM-XXIII)','Rule 101 (No Contract Labour in Core Activities)'],
        forms: ['Form-XXI (Contractor Licence)','Form-XXII (Licence Proforma)','Form-XXIII (Experience Certificate)']
      });
      allForms.push('Form-XXI','Form-XXIII');
      if (secMap['45']) applicableSections.push(secMap['45']);
      if (secMap['53']) applicableSections.push(secMap['53']);
      if (secMap['55']) applicableSections.push(secMap['55']);
      if (secMap['57']) applicableSections.push(secMap['57']);
    }

    // Mines
    if (d.hasMines) {
      obligations.push({
        title: 'Mine Manager + Safety Officer + Medical Exams (Mines)',
        rule: 'Rules 107–182 / Sec 67–72',
        priority: 'HIGH',
        threshold: 'All Mines',
        details: `MINE MANAGER: Mandatory with requisite qualifications; responsible for overall management. SAFETY OFFICER: Mandatory for mines. SAFETY COMMITTEE: for mines with 100+ workers. MEDICAL EXAMINATION: Initial before employment (FORM-IX); periodic at max 12-month intervals; MBBS examination; cost borne by employer. No person below 18 years allowed in any mine (minimum 16 for apprentices with supervision). RESCUE STATION/ROOM: Mandatory as per Rules 123–154. Vocational training per Rules 155–176. Rescue trained persons maintained on rolls.`,
        sections: ['Sec 67','Sec 70','Sec 72'],
        rules: ['Rule 107 (Manager Qualifications)','Rule 109 (Medical Exam FORM-IX)','Rule 121 (Employer Bears Exam Cost)','Rule 123 (Rescue Station)','Rule 155 (Vocational Training)'],
        forms: ['Form-IX (Medical Examination Report)']
      });
      allForms.push('Form-IX');
    }

    // Inter-State Migrant
    if (d.hasInterStateMigrant) {
      obligations.push({
        title: 'Inter-State Migrant Workers — Journey Allowance & Portal Registration',
        rule: 'Rules 102–103 / Sec 59–63',
        priority: 'HIGH',
        threshold: '10+ Inter-State Migrant Workers',
        details: `Register all inter-State migrant workers on MoLE portal with Aadhaar (self-registration available). Annual LUMP SUM FARE for to-and-fro journey to native place. Fatal accident/serious injury: report to authorities of BOTH States and to next of kin. Extend all ESI, EPF and other benefits. Toll-free helpline access. PDS portability scheme benefits for migrant workers.`,
        sections: ['Sec 59','Sec 60','Sec 61','Sec 62','Sec 63'],
        rules: ['Rule 13 (Portal Registration with Aadhaar)','Rule 102 (Journey Allowance: Annual Lump Sum)','Rule 103 (Toll-Free Helpline)','Rule 104 (Study of Conditions)'],
        forms: []
      });
      if (secMap['59']) applicableSections.push(secMap['59']);
      if (secMap['61']) applicableSections.push(secMap['61']);
    }

    // First Aid — all
    obligations.push({
      title: 'First Aid, Washing Facilities & Welfare Basics',
      rule: 'Rules 44, 49–52, 54 / Sec 23, 24',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `POTABLE WATER: Adequate, clean, safe drinking water; no common drinking tumblers. WASHING FACILITY: Separate for all genders; no common towels. FIRST AID: 33% of workers trained in first aid; refresher every 3 years; at least 1 woman trained; speedy hospital referral arrangement. SITTING ARRANGEMENTS: Seating for workers required to stand during work. STORAGE/LOCKERS: Individual lockers; separate for work and street clothes.`,
      sections: ['Sec 23','Sec 24'],
      rules: ['Rule 44 (Potable Water)','Rule 49 (Washing: Separate Genders)','Rule 50 (Lockers)','Rule 52 (Sitting Arrangements)','Rule 54 (First Aid: 33% Trained; 1 Woman)'],
      forms: []
    });

    // Composition
    obligations.push({
      title: 'Composition of Offences — FORM-XXVI/XXVII',
      rule: 'Rule 182 / Sec 114',
      priority: 'LOW',
      threshold: 'When Offence Identified',
      details: `First-time offences compoundable: penalty-only offences at 50% of max fine; imprisonment offences at 75% of max fine. Application in FORM-XXVI by accused. FORM-XXVII notice by Compounding Officer. Not applicable for 2nd+ offence within 3 years. Amount credited to Social Security Fund.`,
      sections: ['Sec 114'],
      rules: ['Rule 182 (Compounding: 50%/75% Max Fine; FORM-XXVI/XXVII)'],
      forms: ['Form-XXVI (Application)','Form-XXVII (Notice)']
    });

    return {
      code: 'osh', icon: '🛡️', name: 'OSH & Working Conditions Code, 2020',
      act: 'Act No. 37 of 2020', gsr: 'G.S.R. 345(E)', accent: acc,
      applicable: true,
      reason: 'Applies to all establishments. Consolidates 13 earlier laws: Factories Act, Mines Act, Contract Labour Act, BOCW Act, and 9 others.',
      obligations,
      applicableSections: [...new Set(applicableSections)],
      applicableRules: [...new Set(applicableRules)],
      allForms: [...new Set(allForms)]
    };
  },

  // ============================================================
  // INDUSTRIAL RELATIONS CODE
  // ============================================================
  buildIRCode(d, n, iData) {
    const acc = '#9B72E8';
    const obligations = [];
    const applicableSections = [];
    const applicableRules = [];
    const allForms = [];

    const secMap = {};
    if (iData && iData.sections) {
      iData.sections.forEach(s => { secMap[s.sec] = s; });
    }

    // Electronic Records — all
    obligations.push({
      title: 'Electronic Record Maintenance & Memorandum of Settlement',
      rule: 'Rules 4, 47 / Sec 2, 99',
      priority: 'MEDIUM',
      threshold: 'All Establishments',
      details: `All registers, forms, notices, display boards under IR Rules maintained ELECTRONICALLY. Records produced to authority on demand. Any settlement between employer and workers must be documented in FORM-I (Memorandum of Settlement). Outside conciliation: copy marked to Deputy CLC(C). During conciliation: Conciliation Officer countersigns. Settlement binding on all parties and successors.`,
      sections: ['Sec 2','Sec 53','Sec 57','Sec 58'],
      rules: ['Rule 4 (Memorandum of Settlement FORM-I)','Rule 47 (Electronic Record Maintenance)'],
      forms: ['Form-I (Memorandum of Settlement)']
    });
    allForms.push('Form-I');

    // Strike/Lockout — all
    obligations.push({
      title: 'Strike/Lock-out — 60-Day Notice Mandatory (FORM-XI / XII)',
      rule: 'Rules 25–26 / Sec 62–64',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `NO STRIKE without: (a) 60-day notice in FORM-XI by Trade Union Secretary or 5 elected representatives; (b) not within 14 days of giving notice; (c) not before specified date; (d) not during conciliation proceedings or 7 days after; (e) not during Tribunal/NIT proceedings or 60 days after. LOCK-OUT: 60-day notice in FORM-XII by employer to every registered Trade Union by speed post/electronically; displayed conspicuously. Illegal strike/lockout: fine ₹1L–₹10L. No financial aid to illegal strike/lockout.`,
      sections: ['Sec 62','Sec 63','Sec 64'],
      rules: ['Rule 25 (Strike Notice FORM-XI: 60-Day; TU Secretary or 5 Reps)','Rule 26 (Lock-out Notice FORM-XII: 60-Day; Speed Post/Electronic)'],
      forms: ['Form-XI (Strike Notice)','Form-XII (Lock-out Notice)']
    });
    allForms.push('Form-XI','Form-XII');
    if (secMap['62']) applicableSections.push(secMap['62']);
    if (secMap['63']) applicableSections.push(secMap['63']);

    // Retrenchment — all
    obligations.push({
      title: 'Retrenchment/Closure Notice & Re-skilling Fund',
      rule: 'Rules 27, 29, 37 / Sec 70, 74, 75, 83',
      priority: 'HIGH',
      threshold: 'All Employers (on retrenchment/closure)',
      details: `RETRENCHMENT (Chapter IX — all establishments): 1 month written notice OR wages in lieu. Compensation: 15 days average pay × completed years (above 6 months counted). FORM-XIII notice to Central Government + Deputy CLC(C) 30 days before. Last-come-first-go rule unless reasons recorded. CLOSURE: 60-day notice in FORM-XIII. RE-SKILLING FUND (Rule 37): Transfer 15 days' last drawn wages ELECTRONICALLY within 10 DAYS of retrenchment to CLC(C)/DCLC(C). Disbursed to worker's bank account within 45 days.`,
      sections: ['Sec 70','Sec 71','Sec 72','Sec 74','Sec 75','Sec 83'],
      rules: ['Rule 27 (Retrenchment Notice FORM-XIII: 30 Days)','Rule 28 (Re-employment: Seniority List 7 Days)','Rule 29 (Closure Notice FORM-XIII: 60 Days)','Rule 37 (Re-skilling Fund: 15 Days Wages within 10 Days)'],
      forms: ['Form-XIII (Retrenchment/Closure Notice)']
    });
    allForms.push('Form-XIII');
    if (secMap['70']) applicableSections.push(secMap['70']);
    if (secMap['74']) applicableSections.push(secMap['74']);
    if (secMap['83']) applicableSections.push(secMap['83']);

    // Protected Workers
    obligations.push({
      title: 'Protected Workers List — Submit by 30 April Every Year',
      rule: 'Rule 39 / Sec 90',
      priority: 'MEDIUM',
      threshold: 'All Establishments with Trade Unions',
      details: `Trade Union must inform employer by 30 APRIL every year: list of office-bearers designated as Protected Workers. Maximum 1% of total workers (minimum 5, maximum 100 per establishment). Recognition valid 12 months. Protected workers cannot be dismissed/discharged during dispute without authority permission. Annual deadline: 30 April.`,
      sections: ['Sec 90','Sec 91'],
      rules: ['Rule 39 (Protected Workers: By 30 April; 1% of Workers; Min 5 Max 100)','Rule 40 (Complaint FORM-XVI)'],
      forms: ['Form-XVI (Complaint by Aggrieved Employee)']
    });
    allForms.push('Form-XVI');

    // Compounding
    obligations.push({
      title: 'Composition of Offences — FORM-XV',
      rule: 'Rule 38 / Sec 89',
      priority: 'LOW',
      threshold: 'When Offence Identified',
      details: `First-time non-imprisonment offences: 50% of max fine. Imprisonment ≤1 year offences: 75% of max fine. FORM-XV (3 parts): Part I notice, Part II 15-day deposit window, Part III accused application. Amount credited to Social Security Fund. Stops prosecution.`,
      sections: ['Sec 89'],
      rules: ['Rule 38 (Compounding FORM-XV: 15-Day Window; 50%/75% Max Fine)'],
      forms: ['Form-XV (Compounding Notice)']
    });
    allForms.push('Form-XV');

    // GRC — 20+ workers
    if (n >= 20) {
      obligations.push({
        title: `Grievance Redressal Committee (${n} > 20 Workers)`,
        rule: 'Rules 6–8 / Sec 4',
        priority: 'HIGH',
        threshold: '20+ Workers',
        details: `Constitute GRC with max 10 members. Equal employer-worker representation. Adequate women representation. Term 3 years. Application within 1 year of cause. GRC resolves within 30 days. Appeal to Conciliation Officer within 60 days of GRC decision. Application online via MoLE portal through Trade Union. GRC must maintain meeting records electronically.`,
        sections: ['Sec 4'],
        rules: ['Rule 6 (GRC: 10 Members; 3-Year Term)','Rule 7 (Grievance Application: Within 1 Year)','Rule 8 (Conciliation Appeal: 60 Days; MoLE Portal)'],
        forms: []
      });
      if (secMap['4']) applicableSections.push(secMap['4']);
    }

    // Works Committee — 100+
    if (n >= 100) {
      obligations.push({
        title: `Works Committee — Max 20 Members (${n} > 100)`,
        rule: 'Rule 5 / Sec 3',
        priority: 'HIGH',
        threshold: '100+ Workers',
        details: `Constitute Works Committee. Max 20 members. Equal employer-worker representation. Women represented proportionally to their numbers. Term 3 years. MEETINGS: At least ONCE EVERY 3 MONTHS. Functions: promote amity and good relations, comment on matters of common interest (not disputes — those go to GRC). Meeting minutes maintained electronically.`,
        sections: ['Sec 3'],
        rules: ['Rule 5 (Works Committee: Max 20; 3-Year Term; Quarterly Meetings)'],
        forms: []
      });
      if (secMap['3']) applicableSections.push(secMap['3']);
    }

    // Trade Union Recognition — all industrial establishments
    obligations.push({
      title: 'Trade Union Recognition — Negotiating Union/Council',
      rule: 'Rule 9 / Sec 14',
      priority: 'MEDIUM',
      threshold: 'All Industrial Establishments with Trade Unions',
      details: `SOLE NEGOTIATING UNION: Trade Union with 51%+ workers on muster roll. NEGOTIATING COUNCIL: If no union has 51%+, council formed with unions having 20%+ members each. Verification by secret ballot. Valid 3 years (extendable to max 5 years). Employer must provide facilities. Change of name/amalgamation: notice to Registrar signed by Secretary and 7 members.`,
      sections: ['Sec 14','Sec 24','Sec 25','Sec 26'],
      rules: ['Rule 9 (Recognition: 51% = Sole Union; 20%+ = Council; Secret Ballot; 3-5 Years)'],
      forms: []
    });
    if (secMap['14']) applicableSections.push(secMap['14']);

    // Standing Orders — 300+
    if (n >= 300) {
      obligations.push({
        title: `Standing Orders — Adopt Within 6 Months (${n} > 300)`,
        rule: 'Rules 10–18 / Sec 28–39',
        priority: 'HIGH',
        threshold: '300+ Workers',
        details: `Within 6 months of Chapter applicability: adopt Model Standing Orders OR submit draft Standing Orders. MODEL SO ADOPTION: Intimate Certifying Officer electronically/speed post; deemed certified in 30 days. DRAFT SO: Submit with statement (establishment name, address, email, employee details, Trade Union particulars) to Certifying Officer. Certification within 60 days. Display in Hindi/English/local language at entrance and on portal. Register of Certified SOs in FORM-III. Modification: not before 6 months; apply to Certifying Officer. Subsistence allowance on suspension: 50% wages first 90 days; 75% thereafter (if delay not worker's fault). Disciplinary inquiry: ordinarily within 90 days.`,
        sections: ['Sec 28','Sec 29','Sec 30','Sec 33','Sec 35','Sec 38'],
        rules: ['Rule 10 (Model SO Adoption: 30-Day Deemed Certification)','Rule 12 (Authentication: 7 Days)','Rule 13 (Draft SO Statement)','Rule 15 (Appeal: 60 Days)','Rule 16 (Display: Hindi/English/Local)','Rule 17 (Register FORM-III)','Rule 18 (Modification Application)'],
        forms: ['Form-III (Register of Certified Standing Orders)']
      });
      allForms.push('Form-III');
      if (secMap['28']) applicableSections.push(secMap['28']);
      if (secMap['38']) applicableSections.push(secMap['38']);
    }

    // Notice of Change — all
    obligations.push({
      title: 'Notice of Change in Service Conditions — FORM-IV (21 Days)',
      rule: 'Rule 19 / Sec 40',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `No employer may change service conditions on Third Schedule matters without 21 DAYS' prior notice in FORM-IV to affected workers. Third Schedule matters include: wages, allowances, hours of work, leave, methods of production, work practices. Display on portal and notice board. Copy to Trade Union/negotiating union/council. Failure: fine and criminal liability.`,
      sections: ['Sec 40'],
      rules: ['Rule 19 (Notice of Change FORM-IV: 21 Days; Portal Display)'],
      forms: ['Form-IV (Notice of Change of Service Conditions)']
    });
    allForms.push('Form-IV');
    if (secMap['40']) applicableSections.push(secMap['40']);

    // Chapter X — 300+
    if (n >= 300) {
      obligations.push({
        title: `Prior Permission for Lay-off/Retrenchment/Closure — FORM-XIV (${n} > 300)`,
        rule: 'Rules 30–36 / Sec 77–82',
        priority: 'HIGH',
        threshold: '300+ Workers',
        details: `LAY-OFF (Sec 78): PRIOR PERMISSION of appropriate Government. Application in FORM-XIV 15 days before lay-off (mines: emergency within 30 days). Government decides in 60 days (deemed granted otherwise). Lay-off compensation: 50% of basic wages + DA. Muster roll maintained even during lay-off. RETRENCHMENT (Sec 79): PRIOR PERMISSION + 3 months notice OR wages in lieu. FORM-XIV 60 days before. Compensation: 15 days average pay × completed years. CLOSURE (Sec 80): PRIOR PERMISSION application 90 days before intended closure date with reasons. Copy to workers' representatives. Government decides in 60 days (deemed granted otherwise). Review of orders: application within 30 days; disposal within 2 months.`,
        sections: ['Sec 77','Sec 78','Sec 79','Sec 80','Sec 81','Sec 82'],
        rules: ['Rule 30 (Lay-off FORM-XIV: 15 Days Before)','Rule 31 (Mine Emergency Lay-off: 30 Days)','Rule 32 (Review of Lay-off)','Rule 33 (Retrenchment FORM-XIV: 60 Days Before)','Rule 34 (Review of Retrenchment)','Rule 35 (Closure FORM-XIV: 90 Days Before)','Rule 36 (Review of Closure)'],
        forms: ['Form-XIV (Application for Lay-off/Retrenchment/Closure Permission)']
      });
      allForms.push('Form-XIV');
      if (secMap['77']) applicableSections.push(secMap['77']);
      if (secMap['78']) applicableSections.push(secMap['78']);
      if (secMap['79']) applicableSections.push(secMap['79']);
      if (secMap['80']) applicableSections.push(secMap['80']);
    }

    // Arbitration
    obligations.push({
      title: 'Voluntary Arbitration — FORM-V & VI',
      rule: 'Rules 20–22 / Sec 42',
      priority: 'LOW',
      threshold: 'All (optional)',
      details: `Parties may voluntarily refer industrial disputes to arbitration before referring to Tribunal. Arbitration agreement in FORM-V. Arbitrator's written/electronic consent required. Default period: 60 days (extendable). Worker authorization via FORM-VI (if not Trade Union member). Central Government publishes arbitration notification in Official Gazette and MoLE website.`,
      sections: ['Sec 42'],
      rules: ['Rule 20 (Arbitration Agreement FORM-V: 60-Day Default)','Rule 21 (Gazette Publication)','Rule 22 (Worker Authorisation FORM-VI)'],
      forms: ['Form-V (Arbitration Agreement)','Form-VI (Authorisation)']
    });
    allForms.push('Form-V','Form-VI');

    return {
      code: 'ir', icon: '🤝', name: 'Industrial Relations Code, 2020',
      act: 'Act No. 35 of 2020', gsr: 'G.S.R. 342(E)', accent: acc,
      applicable: true,
      reason: 'Applies to all industrial establishments. Consolidates: Trade Unions Act 1926, Industrial Employment (Standing Orders) Act 1946, Industrial Disputes Act 1947.',
      obligations,
      applicableSections: [...new Set(applicableSections)],
      applicableRules: [...new Set(applicableRules)],
      allForms: [...new Set(allForms)]
    };
  },

  // ============================================================
  // SOCIAL SECURITY CODE
  // ============================================================
  buildSSCode(d, n, sData) {
    const acc = '#2ECC9A';
    const obligations = [];
    const applicableSections = [];
    const applicableRules = [];
    const allForms = [];

    const secMap = {};
    if (sData && sData.sections) {
      sData.sections.forEach(s => { secMap[s.sec] = s; });
    }

    // Registration — all
    obligations.push({
      title: 'Registration on Shram Suvidha Portal (Common with OSH Rules)',
      rule: 'Rule 5 / Sec 3',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `Common Form-I (same as OSH Code registration) on Shram Suvidha Portal. No separate registration needed. Certificate auto-generated. Update within 30 days of any change. On closure: intimate with proof all dues paid. This single registration covers both OSH Code and SS Code.`,
      sections: ['Sec 3'],
      rules: ['Rule 5 (Common Registration: OSH + SS Form-I)'],
      forms: []
    });
    if (secMap['3']) applicableSections.push(secMap['3']);

    // ESI — 10+ employees
    if (n >= 10) {
      obligations.push({
        title: `ESI — Employee State Insurance (${n} > 10 Employees)`,
        rule: 'Rules 18–19 / Sec 28–45',
        priority: 'HIGH',
        threshold: '10+ Employees',
        details: `Register employees for ESI on ESIC portal ON OR BEFORE FIRST DAY OF EMPLOYMENT — no grace period. CONTRIBUTIONS: Employer 3.25% + Employee 0.75% of wages (rounded to next higher rupee). Contribution period: 6 months (Apr–Sep; Oct–Mar). PwD EXCEPTION: Employer's contribution WAIVED up to 3 years from first contribution; Central Government reimburses ESIC. BENEFITS: Sickness benefit (78 contribution days, 70% of SBR), maternity, disablement, dependants, medical benefit, funeral expenses ₹20,000 (Rule 21 / Sec 32(1)(f)), rehabilitation. ESI coverage priority: employer's ESI contributions have priority charge on assets under Insolvency Code.`,
        sections: ['Sec 28','Sec 29','Sec 31','Sec 32','Sec 39'],
        rules: ['Rule 18 (ESI Registration: Before First Day; No Grace)','Rule 19 (Contributions: Employer 3.25%; Employee 0.75%)','Rule 20 (Admin Expenses ≤15% of Revenue)','Rule 21 (Funeral: ₹20,000 within 3 Months)','Rule 22 (Sickness Benefit: 78 Days, 70% SBR)'],
        forms: []
      });
      if (secMap['28']) applicableSections.push(secMap['28']);
      if (secMap['29']) applicableSections.push(secMap['29']);
      if (secMap['32']) applicableSections.push(secMap['32']);
    }

    // EPF — 20+ employees
    if (n >= 20) {
      obligations.push({
        title: `EPF — Provident Fund (${n} > 20 Employees)`,
        rule: 'Sec 14–22 / Chapter III',
        priority: 'HIGH',
        threshold: '20+ Employees',
        details: `Employer contributes 12% of wages to EPF. Employee also contributes 12%. 8.33% of employer share goes to Employees Pension Scheme. Employer ≤1% to Employees Deposit Linked Insurance Scheme. Register all employees on EPFO portal. Allot UAN (Universal Account Number) — mandatory; portable across employers. EPF/Pension Fund priority over other creditors under Insolvency Code. Exempted establishments (100+ employees, 3-year clean record): may maintain own PF trust subject to EPFO norms.`,
        sections: ['Sec 14','Sec 15','Sec 16','Sec 17','Sec 19'],
        rules: ['Rule 6 (EPF Fund Administration: RBI/SBI/Scheduled Bank)','Rule 7 (Executive Committee of Central Board)','Rule 13 (EPF Appeal FORM-I: ₹1,000 Fee; 60-Day Limit)'],
        forms: ['Form-I (EPF Appeal to CGIT)','Form-II (Receipt Slip)']
      });
      allForms.push('Form-I','Form-II');
      if (secMap['14']) applicableSections.push(secMap['14']);
      if (secMap['16']) applicableSections.push(secMap['16']);
      if (secMap['19']) applicableSections.push(secMap['19']);
    }

    // Gratuity — 10+ employees
    if (n >= 10) {
      obligations.push({
        title: `Gratuity — 15 Days Wages per Year (${n} > 10 Employees)`,
        rule: 'Rules 31–34 / Sec 53–58',
        priority: 'HIGH',
        threshold: '10+ Employees',
        details: `Payable after 5 years continuous service on: superannuation, retirement, resignation, death, or total disablement. RATE: 15 days average wages per completed year of service (above 6 months counted as full year). CAP: as notified. FIXED-TERM EMPLOYEES: eligible after 1 year of service (not 5 years). NOMINATION: FORM-III within 90 days of completing 1 year service. Aadhaar of nominee mandatory. Family nomination mandatory if family exists; fresh nomination after marriage compulsory. Process: Employee files FORM-IV (within 30 days) → Employer issues FORM-V within 15 days (admissibility/rejection) → Dispute: FORM-VI → Recovery: FORM-IX. Compulsory insurance with LIC or approved insurer (exemption for approved gratuity funds).`,
        sections: ['Sec 53','Sec 54','Sec 55','Sec 56','Sec 57','Sec 58'],
        rules: ['Rule 31 (Minor Nominee: Term Deposit SBI/Nationalised Bank)','Rule 32 (Nomination FORM-III: 90 Days; Aadhaar Mandatory)','Rule 33 (Claim FORM-IV→FORM-V; Dispute FORM-VI; Recovery FORM-IX)','Rule 34 (Competent Authority Qualifications)'],
        forms: ['Form-III (Gratuity Nomination)','Form-IV (Claim Application)','Form-V (Employer Notice)','Form-VI (Dispute Direction)','Form-VII (Summons)','Form-VIII (Payment Order)','Form-IX (Recovery)']
      });
      allForms.push('Form-III','Form-IV','Form-V','Form-VI','Form-VII','Form-VIII','Form-IX');
      if (secMap['53']) applicableSections.push(secMap['53']);
      if (secMap['55']) applicableSections.push(secMap['55']);
      if (secMap['56']) applicableSections.push(secMap['56']);
      if (secMap['57']) applicableSections.push(secMap['57']);
    }

    // Maternity — all establishments with women employees
    obligations.push({
      title: 'Maternity Benefit — 26 Weeks Paid + Nursing Breaks + Display',
      rule: 'Rules 35–40 / Sec 59–72',
      priority: 'HIGH',
      threshold: 'All Establishments Employing Women',
      details: `LEAVE: 26 weeks for first 2 children (12 weeks for 3rd child onwards); 8 weeks before expected delivery. No work 6 weeks immediately after delivery — absolute prohibition. CLAIM: FORM-X (medical certificate from doctor/ASHA/ANM/gram panchayat officer) → FORM-XI notice. Payment within 48 HOURS of FORM-X production. Advance payment on pregnancy proof. MEDICAL BONUS: ₹3,500 if employer does not provide free natal care; paid with last maternity benefit instalment. NURSING BREAKS: 2 × 15 minutes + up to 15 min travel time to crèche each way; cannot be deducted from wages; until child is 15 months. DISMISSAL PROHIBITION: Unlawful to dismiss during maternity absence. DISPLAY: FORM-XIV abstract of maternity provisions displayed permanently at all establishments employing women — non-display attracts penalty.`,
      sections: ['Sec 59','Sec 60','Sec 62','Sec 64','Sec 65','Sec 66','Sec 68','Sec 71'],
      rules: ['Rule 35 (Claim FORM-X + FORM-XI: Payment within 48hrs)','Rule 36 (Nursing Breaks: 2×15min + 15min Travel)','Rule 37 (Crèche 50+: CCTV+Police Verification)','Rule 38 (Gross Misconduct for Dismissal)','Rule 39 (Complaint FORM-XIII-A; Appeal FORM-XIII-B: 30 Days)','Rule 40 (Display FORM-XIV: Permanent; All Establishments with Women)'],
      forms: ['Form-X (Medical Certificate)','Form-XI (Maternity Notice)','Form-XII (Dismissal Appeal)','Form-XIII-A (Complaint)','Form-XIII-B (Appeal)','Form-XIV (Abstract Display)']
    });
    allForms.push('Form-X','Form-XI','Form-XIV');
    if (secMap['60']) applicableSections.push(secMap['60']);
    if (secMap['66']) applicableSections.push(secMap['66']);
    if (secMap['67']) applicableSections.push(secMap['67']);
    if (secMap['68']) applicableSections.push(secMap['68']);

    // Crèche — 50+ employees
    if (n >= 50) {
      obligations.push({
        title: `Crèche for Children Under 6 — With CCTV (${n} > 50 Employees)`,
        rule: 'Rule 37 / Sec 67',
        priority: 'HIGH',
        threshold: '50+ Employees',
        details: `Mandatory crèche for children under 6 years. CCTV monitoring during ALL working hours. Police verification of ALL crèche staff. Qualified, trained personnel. No child left alone at any point. Feeding room adjacent. Evacuation plan displayed prominently. 4 visits per day allowed for mothers during working hours. Common facility with neighboring establishments is permitted.`,
        sections: ['Sec 67'],
        rules: ['Rule 37 (Crèche: CCTV+Police Verified+Qualified Staff+No Child Alone+4 Visits/Day)'],
        forms: []
      });
      if (secMap['67']) applicableSections.push(secMap['67']);
    }

    // Workers Compensation — all
    obligations.push({
      title: "Workers' Compensation — Employer Liability",
      rule: 'Rules 57–62 / Sec 73–99',
      priority: 'HIGH',
      threshold: 'All Employers',
      details: `FATAL ACCIDENT REPORT: within 7 days to Competent Authority. LIABILITY: death (50% monthly wages × relevant factor); permanent total disablement (60% × factor); permanent partial (proportional); temporary (25% wages half-monthly). COMPENSATION DUE IMMEDIATELY on liability accrual. DEFAULT: 12% interest + up to 50% damages for delayed payment without justification. CLAIM: FORM-XXVII (application) with FORM-XXVIII (verification certificate). Competent Authority: 5+ years judicial service or advocate. Notice of accident: within 6 months. Claim: within 2 years. Principal employer liable for contractor's employees.`,
      sections: ['Sec 73','Sec 74','Sec 76','Sec 77','Sec 82','Sec 85','Sec 90','Sec 93'],
      rules: ['Rule 57 (Interest on Delayed Compensation)','Rule 58 (Transfer Notice FORM-XXIX)','Rule 59 (Claim FORM-XXVII + FORM-XXVIII)','Rule 62 (Accident Report FORM-XXX)'],
      forms: ['Form-XXVII (Compensation Claim)','Form-XXVIII (Verification Certificate)','Form-XXIX (Transfer Notice)','Form-XXX (Accident Report)']
    });
    allForms.push('Form-XXVII','Form-XXVIII');
    if (secMap['73']) applicableSections.push(secMap['73']);
    if (secMap['74']) applicableSections.push(secMap['74']);
    if (secMap['76']) applicableSections.push(secMap['76']);
    if (secMap['77']) applicableSections.push(secMap['77']);

    // Records & Annual Return — all
    obligations.push({
      title: 'Unified Annual Return — FORM-XXIII by 28/29 Feb (Online)',
      rule: 'Rule 53 / Sec 123',
      priority: 'HIGH',
      threshold: 'All Establishments',
      details: `Single integrated annual return filed online on MoLE web portal on or before 28th/29th FEBRUARY every year. PART-I: all establishments — gratuity, maternity, crèche, women employment, IR data, accidents, bonus, BOCW. PART-II: mine owners only. This single return satisfies annual return requirements under ALL FOUR CODES (Code on Wages, OSH Code, IR Code, SS Code). 4 Mandatory Registers: (1) Employee Register (Wages Rules Form-I); (2) Attendance (Form-IX); (3) Wages/OT (Form-IV); (4) Women Employees (SS Rules FORM-XXII). PRESERVE 5 CALENDAR YEARS from last entry. Wage slips issued electronically on/before payment.`,
      sections: ['Sec 123'],
      rules: ['Rule 53 (4 Registers: Wages Form-I, Attendance Form-IX, Wages/OT Form-IV, Women FORM-XXII; 5-Year Retention)','Rule 53(5) (Unified Annual Return FORM-XXIII: 28/29 Feb Online; All 4 Codes)'],
      forms: ['Form-XXII (Women Employees Register)','Form-XXIII (Unified Annual Return — All 4 Codes)']
    });
    allForms.push('Form-XXII','Form-XXIII');
    if (secMap['123']) applicableSections.push(secMap['123']);

    // Vacancy Reporting — all
    obligations.push({
      title: 'Vacancy Reporting & Annual Employment Information Return',
      rule: 'Rule 56 / Sec 139',
      priority: 'MEDIUM',
      threshold: 'All Establishments',
      details: `Report vacancies in FORM-XXV to Career Centre within 30 days of vacancy arising. Separate form per post type. Career Centre issues unique vacancy ID within 3 working days. ANNUAL EMPLOYMENT INFORMATION RETURN: FORM-XXVI to Career Centre (Regional) within 30 days after end of financial year. Covers: total manpower by skill category and gender, vacancies occurred/filled, skill shortages, next-year estimated requirements by occupation. EXCLUSIONS: agriculture, domestic service, <20 employees, vacancies <90 days, promotions, low-remuneration vacancies.`,
      sections: ['Sec 139','Sec 140'],
      rules: ['Rule 55 (Career Centre Establishment)','Rule 56 (FORM-XXV Vacancy: 30 Days; FORM-XXVI Annual EIR)'],
      forms: ['Form-XXV (Vacancy Report)','Form-XXVI (Annual EIR)','Form-XXVI-A (Job Seeker Registration)']
    });
    allForms.push('Form-XXV','Form-XXVI');
    if (secMap['139']) applicableSections.push(secMap['139']);

    // BOCW
    if (d.hasBOCW || d.hasConstruction) {
      obligations.push({
        title: 'BOCW Cess — Self-Assessment Cycle (4 Forms)',
        rule: 'Rule 41 / Sec 100–108',
        priority: 'HIGH',
        threshold: 'All Construction Employers',
        details: `CESS RATE: 1–2% of construction cost (excluding land cost and Land Acquisition compensation). BEFORE COMMENCEMENT: File FORM-XV (intimation). SELF-ASSESSMENT: FORM-XVI certified by Chartered Engineer at PWD/CPWD/RERA rates; provisional cess %. Pay advance cess before starting. ON STOPPAGE: File FORM-XVII. ON COMPLETION: File FORM-XVIII within 60 days. SELF-ASSESSMENT IS FINAL if Assessing Officer fails to complete assessment within 180 days. INTEREST: 1% PER MONTH on delayed cess payment — no ceiling on total interest. PENALTY: up to cess amount for non-payment. APPEAL: FORM-XIX within 90 days. BUILDING WORKER REGISTRATION: Aadhaar-based portal registration; workers aged 18–60 with 90+ days work in preceding 12 months; digital identity card issued; UAN.`,
        sections: ['Sec 100','Sec 101','Sec 103','Sec 104','Sec 105','Sec 106','Sec 108'],
        rules: ['Rule 41 (FORM-XV Commencement; FORM-XVI Self-Assessment; FORM-XVII Stoppage; FORM-XVIII Completion within 60 Days)','Rule 42 (Interest: 1%/Month; No Ceiling)','Rule 43 (Penalty: Up to Cess Amount)','Rule 44 (Appeal FORM-XIX: 90 Days)','Rule 45 (Worker Registration: Aadhaar; 90-Day Work Criterion)','Rule 47 (Recovery and Exemption)'],
        forms: ['Form-XV (Commencement)','Form-XVI (Self-Assessment)','Form-XVII (Stoppage)','Form-XVIII (Completion)','Form-XIX (Appeal)']
      });
      allForms.push('Form-XV','Form-XVI','Form-XVII','Form-XVIII','Form-XIX');
      if (secMap['100']) applicableSections.push(secMap['100']);
      if (secMap['103']) applicableSections.push(secMap['103']);
      if (secMap['106']) applicableSections.push(secMap['106']);
    }

    // Gig/Platform Workers
    if (d.companyType === 'aggregator') {
      obligations.push({
        title: '⚠️ Gig/Platform Worker Registration & Contribution — URGENT DEADLINES',
        rule: 'Rules 48–49 / Sec 113–114',
        priority: 'HIGH',
        threshold: 'All Aggregators',
        details: `REGISTRATION (Rule 48): Workers aged 16+ self-register on Central Govt portal via Aadhaar. UAN and digital identity card issued. AGGREGATOR OBLIGATIONS: (1) Share EXISTING worker details via API WITHIN 45 DAYS of Rules commencement (DEADLINE: 22 June 2026). (2) Register NEW workers in real-time or daily. (3) Share EXIT data daily. UAN portable across platforms. CONTRIBUTION: Up to 5% of amount paid to gig workers (% notified by Central Govt; or up to 2% of annual turnover). PROVISIONAL RETURN: FORM-XX by 30 JUNE each year. FINAL RETURN: FORM-XXI by 31 OCTOBER (based on audited accounts). REFUND: excess within 90 days; Government pays 1% per month interest on delayed refund.`,
        sections: ['Sec 113','Sec 114'],
        rules: ['Rule 48 (API Data: Existing Workers within 45 Days of 8 May 2026; New Workers Real-Time)','Rule 49 (FORM-XX Provisional by 30 June; FORM-XXI Final by 31 October; Refund 90 Days+1%/Month)'],
        forms: ['Form-XX (Provisional Return: By 30 June)','Form-XXI (Final Return: By 31 October)']
      });
      allForms.push('Form-XX','Form-XXI');
      if (secMap['113']) applicableSections.push(secMap['113']);
      if (secMap['114']) applicableSections.push(secMap['114']);
    }

    // Compounding
    obligations.push({
      title: 'Composition of Offences — FORM-XXIV (4 Parts)',
      rule: 'Rule 54 / Sec 138',
      priority: 'LOW',
      threshold: 'When Offence Identified',
      details: `First-time offences: FORM-XXIV (4 parts). PART-I: notice by authorized officer. PART-II: employer has 15 days to pay. PART-III: employer application confirming payment. PART-IV: Composition Certificate. Fine-only offences: 50% of max fine. Imprisonment ≤1 year offences: 75% of max fine. No compounding for repeat within 3 years. Amount credited to Social Security Fund.`,
      sections: ['Sec 138'],
      rules: ['Rule 54 (Compounding FORM-XXIV: 4 Parts; 50%/75%; 15-Day Payment Window)'],
      forms: ['Form-XXIV (Compounding Notice — 4 Parts)']
    });
    allForms.push('Form-XXIV');

    // Prohibition on reducing wages
    obligations.push({
      title: 'No Reduction of Wages Due to Code Compliance Costs',
      rule: 'Sec 124',
      priority: 'MEDIUM',
      threshold: 'All Employers',
      details: `Prohibited from reducing wages, benefits, or service conditions due to Code-imposed contributions or compliance costs. Any such reduction void and of no effect. Also: amounts in PF/ESI/gratuity/maternity/compensation are non-attachable by court decree — cannot be seized in execution.`,
      sections: ['Sec 124','Sec 151'],
      rules: ['Sec 124 (No Reduction for Compliance Costs)','Sec 151 (Non-Attachment of SS Benefits)'],
      forms: []
    });

    return {
      code: 'ss', icon: '🏦', name: 'Code on Social Security, 2020',
      act: 'Act No. 36 of 2020', gsr: 'G.S.R. 344(E)', accent: acc,
      applicable: true,
      reason: 'Applies to all establishments. Consolidates 9 earlier laws: EPF Act, ESI Act, Gratuity Act, Maternity Benefit Act, Employees Compensation Act, BOCW Acts, Unorganised Workers Act, and Cine Workers Act.',
      obligations,
      applicableSections: [...new Set(applicableSections)],
      applicableRules: [...new Set(applicableRules)],
      allForms: [...new Set(allForms)]
    };
  },

  // ============================================================
  // RENDER REPORT
  // ============================================================
  renderReport(data, report) {
    const n = data.employeeCount;
    const s = report.summary;

    const priorityActions = report.codes
      .flatMap(c => c.obligations.filter(o => o.priority === 'HIGH').map(o => ({ ...o, codeAccent: c.accent, codeName: c.name })))
      .slice(0, 10);

    const priorityHTML = priorityActions.map(a => `
      <div style="display:flex;align-items:flex-start;gap:8px;padding:8px 10px;background:var(--card,#0C1A30);border-radius:8px;border:1px solid var(--border,rgba(255,255,255,0.07));margin-bottom:6px">
        <div style="width:8px;height:8px;border-radius:50%;background:${a.codeAccent};flex-shrink:0;margin-top:4px"></div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text,#D8E8F8);line-height:1.4">${a.title}</div>
          <div style="font-size:9px;font-family:monospace;color:${a.codeAccent};margin-top:1px">${a.rule}</div>
        </div>
      </div>`).join('');

    const codesHTML = report.codes.map(c => `
      <div style="background:var(--bg2,#081828);border:1px solid var(--border,rgba(255,255,255,0.07));border-left:4px solid ${c.accent};border-radius:10px;overflow:hidden;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--border,rgba(255,255,255,0.07));flex-wrap:wrap">
          <span style="font-size:20px;flex-shrink:0">${c.icon}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:800;color:var(--text,#D8E8F8)">${c.name}</div>
            <div style="font-size:9px;color:var(--text3,#3D6080);font-family:monospace;margin-top:1px">${c.act} · ${c.gsr}</div>
          </div>
          <div style="display:flex;gap:5px;flex-wrap:wrap">
            <span style="padding:3px 9px;border-radius:20px;font-size:9px;font-weight:700;background:${c.accent}18;color:${c.accent}">${c.obligations.length} Obligations</span>
            <span style="padding:3px 9px;border-radius:20px;font-size:9px;font-weight:700;background:rgba(0,0,0,0.2);color:var(--text3,#3D6080)">${c.allForms.length} Forms</span>
            <span style="padding:3px 9px;border-radius:20px;font-size:9px;font-weight:700;background:rgba(0,0,0,0.2);color:var(--text3,#3D6080)">${c.applicableSections.length} Sections</span>
          </div>
        </div>
        <div style="font-size:10px;color:var(--text3,#3D6080);padding:8px 14px;border-bottom:1px solid var(--border,rgba(255,255,255,0.07));font-style:italic">${c.reason}</div>
        <div style="padding:10px 14px">
          ${c.obligations.map(ob => `
            <div style="display:flex;gap:8px;padding:10px;background:var(--card,#0C1A30);border-radius:8px;border:1px solid var(--border,rgba(255,255,255,0.07));margin-bottom:8px">
              <div style="flex-shrink:0;padding:2px 7px;border-radius:4px;font-size:8px;font-weight:800;letter-spacing:0.4px;height:fit-content;margin-top:1px;background:${ob.priority === 'HIGH' ? 'rgba(240,112,112,0.2)' : ob.priority === 'MEDIUM' ? 'rgba(232,160,32,0.2)' : 'rgba(46,204,154,0.2)'};color:${ob.priority === 'HIGH' ? '#F07070' : ob.priority === 'MEDIUM' ? '#E8A020' : '#2ECC9A'}">${ob.priority}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;font-weight:700;color:var(--text,#D8E8F8);margin-bottom:2px;line-height:1.4">${ob.title}</div>
                <div style="font-size:9px;font-family:monospace;color:${c.accent};margin-bottom:5px">${ob.rule} · 👥 ${ob.threshold}</div>
                <div style="font-size:10px;color:var(--text3,#3D6080);line-height:1.65">${ob.details}</div>
                ${ob.sections && ob.sections.length ? `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:3px">${ob.sections.map(sec => `<span style="padding:1px 6px;background:${c.accent}12;color:${c.accent};border:1px solid ${c.accent}30;border-radius:3px;font-size:8px;font-weight:700;font-family:monospace">${sec}</span>`).join('')}</div>` : ''}
                ${ob.rules && ob.rules.length ? `<div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:3px">${ob.rules.map(r => `<span style="padding:1px 6px;background:rgba(100,116,139,0.15);color:#94A3B8;border:1px solid rgba(100,116,139,0.3);border-radius:3px;font-size:8px;font-family:monospace">${r}</span>`).join('')}</div>` : ''}
                ${ob.forms && ob.forms.length ? `<div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:3px">${ob.forms.map(f => `<span style="padding:1px 6px;background:rgba(30,205,232,0.12);color:#1ECDE8;border:1px solid rgba(30,205,232,0.3);border-radius:3px;font-size:8px;font-weight:700;font-family:monospace">${f}</span>`).join('')}</div>` : ''}
              </div>
            </div>`).join('')}
        </div>
        ${c.allForms.length ? `<div style="padding:10px 14px;border-top:1px solid var(--border,rgba(255,255,255,0.07));background:var(--bg3,#0D2040)">
          <div style="font-size:9px;font-weight:700;color:var(--text3,#3D6080);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px">All Required Forms (${c.allForms.length})</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px">${c.allForms.map(f => `<span style="padding:2px 8px;background:rgba(30,205,232,0.08);color:#1ECDE8;border:1px solid rgba(30,205,232,0.3);border-radius:4px;font-size:9px;font-weight:700;font-family:monospace">${f}</span>`).join('')}</div>
        </div>` : ''}
      </div>`).join('');

    const el = document.getElementById('onboardResultsContent');
    el.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:14px;justify-content:space-between;flex-wrap:wrap;padding:16px;background:var(--bg2,#081828);border-radius:10px;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#2ECC9A,#1ECDE8);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#000;flex-shrink:0">${(data.companyName || 'C').charAt(0).toUpperCase()}</div>
          <div>
            <div style="font-size:16px;font-weight:900;color:var(--text,#D8E8F8);line-height:1.2">${data.companyName}</div>
            <div style="font-size:10px;color:var(--text3,#3D6080);margin-top:2px;font-family:monospace">${data.industry} · ${n} Employees · ${data.state || 'Central Jurisdiction'}</div>
            <div style="font-size:10px;color:var(--text2,#7BA8CC);margin-top:1px">Contact: ${data.employeeName} (${data.designation})</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${[
            { num: 4, label: 'Codes Apply', color: '#E8A020' },
            { num: s.totalObligations, label: 'Obligations', color: '#1ECDE8' },
            { num: s.totalForms, label: 'Forms', color: '#2ECC9A' },
            { num: s.highPriority, label: 'High Priority', color: '#F07070' }
          ].map(stat => `
            <div style="text-align:center;padding:8px 14px;background:var(--card,#0C1A30);border:1px solid var(--border,rgba(255,255,255,0.07));border-radius:8px;min-width:70px">
              <div style="font-size:24px;font-weight:900;font-family:monospace;line-height:1;color:${stat.color}">${stat.num}</div>
              <div style="font-size:9px;color:var(--text3,#3D6080);text-transform:uppercase;letter-spacing:0.4px;margin-top:3px;font-weight:700">${stat.label}</div>
            </div>`).join('')}
        </div>
      </div>

      <div style="background:rgba(240,112,112,0.06);border:1px solid rgba(240,112,112,0.2);border-radius:10px;padding:14px;margin-bottom:14px">
        <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;color:#F07070">🚨 Immediate Priority Actions (${s.highPriority} High-Priority Obligations)</div>
        <div>${priorityHTML}</div>
      </div>

      ${codesHTML}

      <div style="font-size:10px;color:var(--text3,#3D6080);line-height:1.8;border-top:1px solid var(--border,rgba(255,255,255,0.07));padding-top:12px;margin-top:4px">
        ⚠️ This report is based on Central Rules notified on 8 May 2026 (G.S.R. 341–345(E)). State-specific rules may impose additional obligations. Consult a qualified labour law advisor for implementation.
      </div>
    `;
  },

  showToast(msg) {
    let t = document.getElementById('obToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'obToast';
      Object.assign(t.style, {
        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        background: '#F07070', color: '#fff', padding: '9px 20px', borderRadius: '8px',
        fontSize: '11px', fontWeight: '700', zIndex: '99999'
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 3000);
  },

  exportReport() {
    const companyName = document.getElementById('obCompanyName').value.trim() || 'Company';
    const content = document.getElementById('onboardResultsContent').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${companyName.replace(/\s+/g, '_')}_Labour_Compliance_Report.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
};

window.ONBOARD = ONBOARD;
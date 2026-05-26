// ============================================================
// CODE ON WAGES, 2019 — COMPLETE DATA FILE
// Act No. 29 of 2019 | G.S.R. 343(E) | 8 May 2026
// 69 Sections | 54 Central Rules | 9 Forms | 4 Appendices
// ============================================================

const DATA_WAGES = {
  meta: {
    code: "wages",
    name: "Code on Wages, 2019",
    icon: "💰",
    act: "Act No. 29 of 2019",
    sections: 69,
    rules: 54,
    forms: 9,
    enacted: "8 Aug 2019",
    accent: "#E8A020",
    gsr: "G.S.R. 343(E)"
  },

  stats: [
    { num: 69,      label: "Code Sections",   sub: "9 Chapters" },
    { num: 54,      label: "Central Rules",    sub: "8 May 2026" },
    { num: 9,       label: "Prescribed Forms", sub: "FORM-I to IX" },
    { num: 4,       label: "Appendices",       sub: "Bonus Computation" },
    { num: "8.33%", label: "Min Bonus",        sub: "Max: 20% of Wages" },
    { num: 5,       label: "Record Retention", sub: "Minimum Years" }
  ],

  // ============================================================
  // ALL 69 SECTIONS
  // ============================================================
  sections: [
    // CHAPTER I — PRELIMINARY
    { sec:"1",  ch:"I",   title:"Short title, extent and commencement",                  provision:"Code on Wages, 2019 extends to whole of India; came into force on dates notified by Central Government; consolidates 4 earlier wage laws: Payment of Wages Act 1936, Minimum Wages Act 1948, Payment of Bonus Act 1965, Equal Remuneration Act 1976.",                                                                                                                                                                                                                app:"All Establishments" },
    { sec:"2",  ch:"I",   title:"Definitions",                                           provision:"Defines: employee, employer, wages, contract labour, contractor, establishment, factory, industrial dispute, wages etc. 'Wages' excludes bonus, HRA, conveyance, OT, gratuity, PF, gratuity, retrenchment compensation, ex-gratia, overtime etc.",                                                                                                                                                                                                                   app:"All" },
    { sec:"3",  ch:"I",   title:"Prohibition of discrimination on ground of gender",     provision:"No discrimination on grounds of gender in matters relating to wages by employer; no reduction of rates of wages on ground that an employee of opposite sex performs same work or work of similar nature.",                                                                                                                                                                                                                                                             app:"Equal Remuneration" },

    // CHAPTER II — MINIMUM WAGES
    { sec:"5",  ch:"II",  title:"Payment of minimum rate of wages",                      provision:"No employer shall pay wages less than minimum rate of wages notified by appropriate Government. Applies to all employees in scheduled employments. Binding obligation.",                                                                                                                                                                                                                                                                                               app:"Minimum Wages" },
    { sec:"6",  ch:"II",  title:"Fixation of minimum wages",                             provision:"Appropriate Government fixes minimum wages for employees in various employments; may fix for time work, piece work, guaranteed time rate, overtime work. Not required to fix for Central Government employees.",                                                                                                                                                                                                                                                        app:"Minimum Wages" },
    { sec:"7",  ch:"II",  title:"Components of minimum wages",                           provision:"Minimum wages consist of basic rate of wages + cost of living allowance (variable DA) revised periodically + cash value of concessions in respect of essential commodities at concession rates.",                                                                                                                                                                                                                                                                     app:"Minimum Wages" },
    { sec:"8",  ch:"II",  title:"Procedure for fixing and revising minimum wages",       provision:"Government may appoint Committees/sub-committees to hold enquiries; consult Advisory Board; revise minimum wages at intervals not exceeding 5 years.",                                                                                                                                                                                                                                                                                                                app:"Minimum Wages" },
    { sec:"9",  ch:"II",  title:"Power of Central Government to fix floor wage",         provision:"Central Government fixes floor wage taking into account minimum living standards of workers; State minimum wage cannot be less than the floor wage. Floor wage revised not exceeding 5 years.",                                                                                                                                                                                                                                                                        app:"Floor Wages" },
    { sec:"10", ch:"II",  title:"Wages for work for less than normal working day",       provision:"Employee not entitled to full day wages if engaged for less than normal working day (except agreed part-time or other labour law provision). Proportionate calculation applies.",                                                                                                                                                                                                                                                                                      app:"Minimum Wages" },
    { sec:"11", ch:"II",  title:"Wages for two or more classes of work",                 provision:"Where employee does two or more classes of work each carrying different minimum wage, employer pays each class at applicable minimum rate for time spent on that class.",                                                                                                                                                                                                                                                                                              app:"Minimum Wages" },
    { sec:"12", ch:"II",  title:"Minimum time rate wages for piece work",                provision:"For employees engaged in piece work, appropriate Government may fix minimum time rate of wages for purpose of calculating overtime.",                                                                                                                                                                                                                                                                                                                                 app:"Minimum Wages" },
    { sec:"13", ch:"II",  title:"Fixing hours of work for normal working day",           provision:"Appropriate Government may fix number of hours constituting a normal working day; provide for day of rest; payment for rest day; overtime rates not less than twice the normal rate.",                                                                                                                                                                                                                                                                                 app:"Minimum Wages" },
    { sec:"14", ch:"II",  title:"Wages for overtime work",                               provision:"Employee working in excess of normal working hours entitled to overtime wages at rate not less than twice the normal rate of wages.",                                                                                                                                                                                                                                                                                                                                  app:"Minimum Wages" },

    // CHAPTER III — PAYMENT OF WAGES
    { sec:"15", ch:"III", title:"Mode of payment of wages",                              provision:"Wages paid in current coin, currency notes, by cheque, by crediting to bank account, or by electronic mode as notified by appropriate Government.",                                                                                                                                                                                                                                                                                                                  app:"All Establishments" },
    { sec:"16", ch:"III", title:"Fixation of wage period",                               provision:"Employer fixes wage period — daily, weekly, fortnightly or monthly; wage period not to exceed one month.",                                                                                                                                                                                                                                                                                                                                                           app:"All Establishments" },
    { sec:"17", ch:"III", title:"Time limit for payment of wages",                       provision:"Daily: end of shift on working day; Weekly: last working day of week; Fortnightly: 2 days after end of fortnight; Monthly: 7th day of following month; Termination: 2 working days. For estates: 7th day.",                                                                                                                                                                                                                                                           app:"All Establishments" },
    { sec:"18", ch:"III", title:"Deductions which may be made from wages",               provision:"Permitted deductions from wages: fines, absence from duty, damage or loss, house accommodation, advances, recovery of loans, income tax, court orders, EPF, ESI, etc. Total deductions cannot exceed 50% of wages.",                                                                                                                                                                                                                                                  app:"All Establishments" },
    { sec:"19", ch:"III", title:"Fines",                                                 provision:"Fines only for specified acts/omissions approved by authority; cannot exceed 3% of wages in any wage period; recovered within 90 days; no fines on employees under 15 years; prior opportunity to show cause required.",                                                                                                                                                                                                                                              app:"All Establishments" },
    { sec:"20", ch:"III", title:"Deductions for absence from duty",                      provision:"Deduction proportional to period of absence; where 10+ employees absent in concert, additional deduction (not exceeding 8 days wages) for violation of notice requirement.",                                                                                                                                                                                                                                                                                          app:"All Establishments" },
    { sec:"21", ch:"III", title:"Deductions for damage or loss",                         provision:"For damage or loss directly attributable to employee's neglect or default; show cause opportunity required; cannot exceed value of damage/loss; recorded in register.",                                                                                                                                                                                                                                                                                                app:"All Establishments" },
    { sec:"22", ch:"III", title:"Deductions for services rendered",                      provision:"For house accommodation, amenities, services rendered by employer; accepted by employee; cannot exceed actual cost or equivalent value; subject to conditions.",                                                                                                                                                                                                                                                                                                       app:"All Establishments" },
    { sec:"23", ch:"III", title:"Deductions for recovery of advances",                   provision:"For advance money paid before employment begins, after employment commencement, advance wages not yet earned; instalments subject to conditions prescribed.",                                                                                                                                                                                                                                                                                                          app:"All Establishments" },
    { sec:"24", ch:"III", title:"Deductions for recovery of loans",                      provision:"For loans granted to employees for prescribed purposes; rate of interest as prescribed; conditions of grant prescribed by appropriate Government.",                                                                                                                                                                                                                                                                                                                    app:"All Establishments" },
    { sec:"25", ch:"III", title:"Chapter not to apply in certain cases",                 provision:"Chapter III provisions on time limits and mode of payment do not apply to Government establishments where time of payment and mode are regulated by special provisions.",                                                                                                                                                                                                                                                                                              app:"All Establishments" },

    // CHAPTER IV — PAYMENT OF BONUS
    { sec:"26", ch:"IV",  title:"Eligibility for bonus",                                 provision:"Every employee drawing wages up to specified amount entitled to bonus if worked for 30+ days; minimum bonus: 8.33% of wages or ₹100 (whichever higher); maximum bonus: 20% of wages. Applies to establishments with 20+ persons employed.",                                                                                                                                                                                                                           app:"Bonus" },
    { sec:"27", ch:"IV",  title:"Proportionate reduction in bonus in certain cases",     provision:"Where employee has not worked for all working days in accounting year, minimum bonus payable proportionately reduced to number of working days actually worked.",                                                                                                                                                                                                                                                                                                      app:"Bonus" },
    { sec:"28", ch:"IV",  title:"Computation of number of working days",                 provision:"For bonus eligibility/computation, employee deemed to have worked on days: laid-off with compensation, leave with wages, absence due to temporary disablement by accident, maternity leave under applicable law.",                                                                                                                                                                                                                                                     app:"Bonus" },
    { sec:"29", ch:"IV",  title:"Disqualification for bonus",                            provision:"Employee disqualified from bonus if dismissed for: fraud, riotous or violent behaviour, theft, misappropriation, or sabotage of employer's property.",                                                                                                                                                                                                                                                                                                                app:"Bonus" },
    { sec:"30", ch:"IV",  title:"Establishments to include departments, undertakings and branches", provision:"Departments, undertakings, branches of same employer treated as part of same establishment for bonus computation unless separate balance sheets/P&L statements maintained.",                                                                                                                                                                                                                                                                                app:"Bonus" },
    { sec:"31", ch:"IV",  title:"Payment of bonus out of allocable surplus",             provision:"Bonus paid out of allocable surplus = 67% of available surplus (for companies under section 32) or 60% (for other employers). Minimum bonus always payable from Section 26.",                                                                                                                                                                                                                                                                                         app:"Bonus" },
    { sec:"32", ch:"IV",  title:"Computation of gross profits",                          provision:"Banking company: as per Appendix B under Section 32(a); Other than banking company: as per Appendix C under Section 32(b).",                                                                                                                                                                                                                                                                                                                                          app:"Bonus" },
    { sec:"33", ch:"IV",  title:"Computation of available surplus",                      provision:"Available surplus = Gross profit (as computed under Sec 32) minus prior charges: depreciation, development rebate, direct taxes, sums specified in Third Schedule.",                                                                                                                                                                                                                                                                                                  app:"Bonus" },
    { sec:"34", ch:"IV",  title:"Sums deductible from gross profits",                   provision:"Prior charges deductible from gross profit: depreciation, development rebate/investment allowance, direct tax liability, further sums specified for each type of employer.",                                                                                                                                                                                                                                                                                            app:"Bonus" },
    { sec:"35", ch:"IV",  title:"Calculation of direct tax payable by employer",        provision:"Direct taxes computed as if employer is a public company; losses carried forward NOT deductible; rebates and reliefs not considered for this calculation.",                                                                                                                                                                                                                                                                                                             app:"Bonus" },
    { sec:"36", ch:"IV",  title:"Set on and set off of allocable surplus",               provision:"Excess over max bonus carried forward (Set On) for up to 4 years; deficiency carried forward (Set Off) for up to 4 years; max Set On = 20% of total wages/salary. Per Appendix A.",                                                                                                                                                                                                                                                                                   app:"Bonus" },
    { sec:"37", ch:"IV",  title:"Adjustment of customary or interim bonus",              provision:"Customary bonus (puja bonus, festival bonus) or interim bonus paid to employee during year deductible from final bonus payable under Code.",                                                                                                                                                                                                                                                                                                                           app:"Bonus" },
    { sec:"38", ch:"IV",  title:"Deduction of certain amounts from bonus payable",       provision:"Loss caused by misconduct of employee may be deducted from bonus payable for that accounting year.",                                                                                                                                                                                                                                                                                                                                                                  app:"Bonus" },
    { sec:"39", ch:"IV",  title:"Time limit for payment of bonus",                       provision:"Bonus payable within 8 months from close of accounting year; may be extended by appropriate Government up to total of 2 years on sufficient cause shown.",                                                                                                                                                                                                                                                                                                            app:"Bonus" },
    { sec:"40", ch:"IV",  title:"Application of Chapter to public sector establishments", provision:"Bonus Chapter applies to public sector establishments where they sell/produce goods/services in competition with private establishment having income ≥20% of gross income.",                                                                                                                                                                                                                                                                                          app:"Bonus" },
    { sec:"41", ch:"IV",  title:"Non-applicability of this Chapter",                     provision:"Bonus Chapter does NOT apply to: LIC, seamen, dock workers, GOI employees, RBI, IFCI, certain Universities, NABARD, SIDBI, social/welfare institutions (registered under Societies Registration Act), IDBI.",                                                                                                                                                                                                                                                         app:"Bonus" },

    // CHAPTER V — ADVISORY BOARD
    { sec:"42", ch:"V",   title:"Central Advisory Board and State Advisory Boards",      provision:"Central Advisory Board: equal employer and employee reps, independent persons (max 1/3), 5 State Govt reps. Advises on fixation/revision of wages, women employment. State Boards similarly constituted.",                                                                                                                                                                                                                                                           app:"Advisory Board" },
    { sec:"43", ch:"V",   title:"Method of payment of bonus by company, firm etc.",      provision:"Company/firm/association/person who is proprietor liable to pay bonus to employees employed through contractor if contractor fails to do so.",                                                                                                                                                                                                                                                                                                                         app:"Bonus" },

    // CHAPTER VI — PAYMENT OF DUES, CLAIMS AND AUDIT
    { sec:"44", ch:"VI",  title:"Payment of undisbursed dues in case of death of employee", provision:"Undisbursed wages/dues paid to nominee declared in Form-VII; if no nomination, deposited with DyCLC(C) within prescribed time; nominee identified by authority within 2 months.",                                                                                                                                                                                                                                                                                  app:"Claims" },
    { sec:"45", ch:"VI",  title:"Claims under Code and procedure thereof",               provision:"Claims by employees for non-payment, short payment, illegal deductions, non-payment of bonus filed before authority appointed by appropriate Government; must be filed within 3 years of cause of action.",                                                                                                                                                                                                                                                            app:"Claims" },
    { sec:"46", ch:"VI",  title:"Reference of disputes",                                 provision:"Disputes regarding fixation of minimum bonus referred to authority specified by appropriate Government; authority to determine and pass orders.",                                                                                                                                                                                                                                                                                                                      app:"Claims" },
    { sec:"47", ch:"VI",  title:"Presumption about accuracy of balance sheet",           provision:"Balance sheet/P&L statements audited by qualified auditor presumed accurate in bonus disputes; employer not required to prove correctness.",                                                                                                                                                                                                                                                                                                                           app:"Bonus" },
    { sec:"48", ch:"VI",  title:"Audit of accounts of employers, not being corporations", provision:"For employer not being corporation/company — authority may order audit by qualified auditor; cost paid by employer; expenses reimbursed to authority on default.",                                                                                                                                                                                                                                                                                                    app:"Bonus" },
    { sec:"49", ch:"VI",  title:"Appeal",                                                provision:"Appeal against order of authority lies to appellate authority within 90 days of order; for employer, deposit of claim amount with appellate authority MANDATORY.",                                                                                                                                                                                                                                                                                                     app:"Claims" },
    { sec:"50", ch:"VI",  title:"Records, returns and notices",                          provision:"Employer maintains registers of: employees (Form-I), wages/OT/deductions/fines (Form-IV), attendance (Form-IX); displays abstract of Code; issue wage slips in Form-V; preserve records 5 years from last entry.",                                                                                                                                                                                                                                                    app:"Records" },

    // CHAPTER VII — INSPECTOR-CUM-FACILITATORS
    { sec:"51", ch:"VII", title:"Appointment of Inspector-cum-Facilitators and their powers", provision:"Inspector-cum-Facilitators appointed by appropriate Government; web-based inspection scheme with randomised selection; advise employers/employees on compliance; powers to: examine, require documents, search/seize records, take samples, file complaints.",                                                                                                                                                                                                     app:"All Establishments" },

    // CHAPTER VIII — OFFENCES AND PENALTIES
    { sec:"52", ch:"VIII", title:"Cognizance of offences",                               provision:"Court takes cognizance only on complaint by: appropriate Government/authorised officer, employee, registered trade union, Inspector-cum-Facilitator. Metropolitan/Judicial Magistrate First Class tries offences.",                                                                                                                                                                                                                                                    app:"Offences" },
    { sec:"53", ch:"VIII", title:"Power of officers to impose penalty",                  provision:"Officer notified by appropriate Government may impose penalty for offences punishable with fine only; hearing opportunity required; appealable.",                                                                                                                                                                                                                                                                                                                      app:"Offences" },
    { sec:"54", ch:"VIII", title:"Penalties for offences",                               provision:"(a) Less than minimum wages: Fine ≤₹50,000 + repeat: 3 months imprisonment; (b) Other contraventions: Fine ≤₹20,000; (c) Non-maintenance of records: Fine ≤₹10,000.",                                                                                                                                                                                                                                                                                               app:"Offences" },
    { sec:"55", ch:"VIII", title:"Offences by companies",                                provision:"Company officer in charge liable; directors/managers/secretaries liable if offence with their consent/connivance/neglect.",                                                                                                                                                                                                                                                                                                                                            app:"Offences" },
    { sec:"56", ch:"VIII", title:"Composition of offences",                              provision:"Offences punishable with fine only (not repeat within 5 years) may be compounded by Gazetted Officer on payment of 50% of max fine before or after institution of prosecution.",                                                                                                                                                                                                                                                                                      app:"Offences" },

    // CHAPTER IX — MISCELLANEOUS
    { sec:"57", ch:"IX",  title:"Bar of suits",                                          provision:"No court shall entertain suit for recovery of wages/bonus/dues recoverable under this Code by procedure prescribed herein.",                                                                                                                                                                                                                                                                                                                                          app:"Miscellaneous" },
    { sec:"58", ch:"IX",  title:"Protection of action taken in good faith",              provision:"No suit/prosecution against Government/authority/officer for anything done in good faith under Code.",                                                                                                                                                                                                                                                                                                                                                                app:"Miscellaneous" },
    { sec:"59", ch:"IX",  title:"Burden of proof",                                       provision:"Where claim of non-payment/less payment of wages/bonus/dues, burden of proof on employer to prove such payment was duly made.",                                                                                                                                                                                                                                                                                                                                       app:"Miscellaneous" },
    { sec:"60", ch:"IX",  title:"Contracting out",                                       provision:"Any contract/agreement by which employee relinquishes any right conferred under Code is null and void to that extent.",                                                                                                                                                                                                                                                                                                                                               app:"Miscellaneous" },
    { sec:"61", ch:"IX",  title:"Effect of laws, agreements inconsistent with Code",     provision:"Code overrides inconsistent laws/awards/agreements/contracts; more favourable benefits under other instruments continue.",                                                                                                                                                                                                                                                                                                                                            app:"Miscellaneous" },
    { sec:"62", ch:"IX",  title:"Delegation of powers",                                  provision:"Appropriate Government may delegate powers to officers; conditions and limitations as specified in delegation order.",                                                                                                                                                                                                                                                                                                                                                 app:"Miscellaneous" },
    { sec:"63", ch:"IX",  title:"Exemption of employer from liability",                  provision:"Employer absolved if proves due diligence and offence committed without his knowledge/consent by another person — to be named in notice.",                                                                                                                                                                                                                                                                                                                            app:"Miscellaneous" },
    { sec:"64", ch:"IX",  title:"Protection against attachments",                        provision:"Employer's assets with Government towards Code dues not attachable in execution of court decree.",                                                                                                                                                                                                                                                                                                                                                                     app:"Miscellaneous" },
    { sec:"65", ch:"IX",  title:"Power of Central Government to give directions",        provision:"Central Government may give directions to State Governments on execution of Code provisions.",                                                                                                                                                                                                                                                                                                                                                                        app:"Miscellaneous" },
    { sec:"66", ch:"IX",  title:"Saving",                                                provision:"Any scheme/order/rule made under repealed laws continues until superseded by Code rules.",                                                                                                                                                                                                                                                                                                                                                                            app:"Miscellaneous" },
    { sec:"67", ch:"IX",  title:"Power of appropriate Government to make rules",         provision:"Appropriate Government may make rules for Code implementation; enumerated subjects include: minimum wages, payment procedures, forms, registers, penalties.",                                                                                                                                                                                                                                                                                                          app:"Miscellaneous" },
    { sec:"68", ch:"IX",  title:"Power to remove difficulties",                          provision:"Central Government may make orders within 3 years of Code commencement to remove implementation difficulties; laid before Parliament.",                                                                                                                                                                                                                                                                                                                               app:"Miscellaneous" },
    { sec:"69", ch:"IX",  title:"Repeal and savings",                                    provision:"Repeals: Payment of Wages Act 1936, Minimum Wages Act 1948, Payment of Bonus Act 1965, Equal Remuneration Act 1976. Saves actions done under repealed laws.",                                                                                                                                                                                                                                                                                                         app:"Miscellaneous" }
  ],

  // ============================================================
  // ALL 54 CENTRAL RULES — G.S.R. 343(E), 8 May 2026
  // ============================================================
  rules: [
    { r:"1",  ch:"I",    t:"Short title and commencement — Code on Wages (Central) Rules, 2026",                                                                      c:"Preliminary",    thresh:"All",                    codeRef:"Sec 67" },
    { r:"2",  ch:"I",    t:"Definitions — appeal, Board, geographical area, highly skilled/skilled/semi-skilled/unskilled, Inspector-cum-Facilitator, section",       c:"Preliminary",    thresh:"All",                    codeRef:"Sec 2" },
    { r:"3",  ch:"II",   t:"Manner of calculating minimum rate of wages — daily basis; hourly = daily÷8; monthly = daily×26; fractions of half/more rounded up",      c:"Minimum Wages",  thresh:"All Employees",          codeRef:"Sec 6(5)" },
    { r:"4",  ch:"II",   t:"VDA revision — computed before 1st April and before 1st October each year; based on CPI-IW published by Labour Bureau, MoLE",             c:"Minimum Wages",  thresh:"All Employees",          codeRef:"Sec 7" },
    { r:"5",  ch:"II",   t:"Hours of work for normal working day — 8 hours daily; weekly not exceeding 48 hours; rest interval per OSH&WC Code 2020",                 c:"Minimum Wages",  thresh:"All Employees",          codeRef:"Sec 13" },
    { r:"6",  ch:"II",   t:"Weekly day of rest — 1 rest day per week (Sunday in 6-day week); substituted rest day conditions; max 10 consecutive working days",       c:"Minimum Wages",  thresh:"All Employees",          codeRef:"Sec 13" },
    { r:"7",  ch:"II",   t:"Night shifts — rest day = 24 hrs from end of shift; following day = 24 hrs from shift-end; midnight hours counted in previous day",       c:"Minimum Wages",  thresh:"Night Shift Workers",    codeRef:"Sec 13" },
    { r:"8",  ch:"II",   t:"Extent and conditions of working hours for certain categories — working hours may exceed normal hours; overtime as per Section 14",        c:"Minimum Wages",  thresh:"Special Categories",     codeRef:"Sec 13(2)" },
    { r:"9",  ch:"II",   t:"Longer wage period — by the month for purposes of minimum rate under section 14",                                                          c:"Minimum Wages",  thresh:"All Employees",          codeRef:"Sec 14" },
    { r:"10", ch:"III",  t:"Manner of fixing floor wage — Central Govt consults Board; takes into account food, clothing, housing; revised not exceeding 5 years",     c:"Floor Wages",    thresh:"All Establishments",     codeRef:"Sec 9" },
    { r:"11", ch:"IV",   t:"Payment of wages to contractual employee — proprietor/company/firm pays contractor the amount payable in respect of employees' wages",     c:"Payment",        thresh:"Contractor Employees",   codeRef:"Sec 17" },
    { r:"12", ch:"IV",   t:"Payment of wages for less than normal working day — proportionate to part-time terms or other labour law provisions",                      c:"Payment",        thresh:"Part-time Employees",    codeRef:"Sec 10" },
    { r:"13", ch:"IV",   t:"Recovery of deductions — excess over 50% carried forward to next period in instalments not exceeding 50% per month",                      c:"Payment",        thresh:"All Employees",          codeRef:"Sec 18(4)" },
    { r:"14", ch:"IV",   t:"Authority for approving acts and omissions — Deputy Chief Labour Commissioner (Central) having jurisdiction",                              c:"Payment",        thresh:"All Establishments",     codeRef:"Sec 19(1)" },
    { r:"15", ch:"IV",   t:"Manner of exhibiting notice — in Hindi, English, local language at workplace (physical/electronic); copy to Inspector-cum-Facilitator",   c:"Payment",        thresh:"All Establishments",     codeRef:"Sec 19(2)" },
    { r:"16", ch:"IV",   t:"Procedure for imposing fines — 7-day show cause; fine on establishment of charges; intimated to employee within 15 days",                 c:"Payment",        thresh:"All Employees",          codeRef:"Sec 19(3)" },
    { r:"17", ch:"IV",   t:"Intimation of deduction for absence from duty — 7-day show cause; deduction per Sec 18(3) on charges established; intimated within 15 days", c:"Payment",    thresh:"All Employees",          codeRef:"Sec 20(2)" },
    { r:"18", ch:"IV",   t:"Procedure for deduction for damage or loss — 7-day opportunity to explain; on charges established, deduction made; intimated within 15 days", c:"Payment",   thresh:"All Employees",          codeRef:"Sec 21(1)" },
    { r:"19", ch:"IV",   t:"Recovery of advance — instalments not exceeding 50% of wages per period; subject to Rule 13; recorded in register in Form-IV",            c:"Payment",        thresh:"All Employees",          codeRef:"Sec 23" },
    { r:"20", ch:"IV",   t:"Deduction for recovery of loans — as per extant Central Government instructions/guidelines on extent of loan and interest rate",           c:"Payment",        thresh:"All Employees",          codeRef:"Sec 24" },
    { r:"21", ch:"V",    t:"Payment of bonus to contractual employee — company/firm/proprietor pays minimum bonus if contractor fails",                                 c:"Bonus",          thresh:"Contractor Employees",   codeRef:"Sec 26" },
    { r:"22", ch:"V",    t:"Calculation for sixth accounting year — Set on/Set off per Appendix A under Section 26(7)(i)",                                             c:"Bonus",          thresh:"Bonus Eligible",         codeRef:"Sec 26(7)(i)" },
    { r:"23", ch:"V",    t:"Calculation for seventh accounting year — Set on/Set off per Appendix A under Section 26(7)(ii)",                                          c:"Bonus",          thresh:"Bonus Eligible",         codeRef:"Sec 26(7)(ii)" },
    { r:"24", ch:"V",    t:"Computation of gross profits for banking company — Appendix B under Section 32(a)",                                                        c:"Bonus",          thresh:"Banking Companies",       codeRef:"Sec 32(a)" },
    { r:"25", ch:"V",    t:"Computation of gross profits for other than banking — Appendix C under Section 32(b)",                                                     c:"Bonus",          thresh:"Non-Banking",            codeRef:"Sec 32(b)" },
    { r:"26", ch:"V",    t:"Deduction of further sums from gross profit — Appendix D as prior charges under Section 34(c)",                                            c:"Bonus",          thresh:"All Employers",          codeRef:"Sec 34(c)" },
    { r:"27", ch:"V",    t:"Set On — excess over max bonus carried forward; up to 20% of total wages; carried forward 4 years per Appendix A",                        c:"Bonus",          thresh:"All Employers",          codeRef:"Sec 36(1)" },
    { r:"28", ch:"V",    t:"Set Off — minimum amount/deficiency carried forward as set off up to 4 years per Appendix A",                                             c:"Bonus",          thresh:"All Employers",          codeRef:"Sec 36(2)" },
    { r:"29", ch:"VI",   t:"Constitution of the Central Advisory Board — under Section 42(1) by Central Government",                                                  c:"Advisory",       thresh:"All",                    codeRef:"Sec 42(1)" },
    { r:"30", ch:"VI",   t:"Meetings of the Board — Chairperson may call any time; on requisition of half members, within 30 days",                                   c:"Advisory",       thresh:"Board Members",          codeRef:"Sec 42" },
    { r:"31", ch:"VI",   t:"Notice of meetings — 15 days by speed post/electronic mode; emergency meeting: 7 days notice",                                            c:"Advisory",       thresh:"Board Members",          codeRef:"Sec 42" },
    { r:"32", ch:"VI",   t:"Functions of Chairperson — presides, decides agenda, conducts voting, performs functions assigned by Central Government",                  c:"Advisory",       thresh:"Board Chair",            codeRef:"Sec 42" },
    { r:"33", ch:"VI",   t:"Quorum — at least 1/3 members + at least 1 each of employer and employee reps; if less, adjourn not later than 7 days",                   c:"Advisory",       thresh:"Board Members",          codeRef:"Sec 42" },
    { r:"34", ch:"VI",   t:"Disposal of business — majority vote; Chairperson has casting vote; circulation resolution needs 2/3 majority",                            c:"Advisory",       thresh:"Board",                  codeRef:"Sec 42" },
    { r:"35", ch:"VI",   t:"Method of voting — ordinarily show of hands; secret ballot if member requests or Chairperson decides",                                     c:"Advisory",       thresh:"Board",                  codeRef:"Sec 42" },
    { r:"36", ch:"VI",   t:"Proceedings of meetings — forwarded within 7 days before next meeting; confirmed at next meeting",                                         c:"Advisory",       thresh:"Board",                  codeRef:"Sec 42" },
    { r:"37", ch:"VI",   t:"Summoning of witnesses — Chairperson may summon; allowance per civil court rates of State",                                               c:"Advisory",       thresh:"Board",                  codeRef:"Sec 42" },
    { r:"38", ch:"VI",   t:"Term of office — 3 years from appointment; continues till successor; casual vacancy for remaining term; max 2 re-nomination terms",       c:"Advisory",       thresh:"Board Members",          codeRef:"Sec 42" },
    { r:"39", ch:"VI",   t:"Travelling allowance — official members per salary authority rules; non-official per Dept of Expenditure, MoF instructions",               c:"Advisory",       thresh:"Board Members",          codeRef:"Sec 42" },
    { r:"40", ch:"VI",   t:"Officers and staff of Board — Central Government provides necessary infrastructure",                                                        c:"Advisory",       thresh:"Board",                  codeRef:"Sec 42" },
    { r:"41", ch:"VI",   t:"Eligibility for re-nomination — outgoing member eligible for re-nomination for maximum 2 terms total",                                     c:"Advisory",       thresh:"Board Members",          codeRef:"Sec 42" },
    { r:"42", ch:"VI",   t:"Resignation — member resigns by notice to Chairperson; Chairperson to Central Govt; effective on acceptance or 30 days from resignation",  c:"Advisory",       thresh:"Board",                  codeRef:"Sec 42" },
    { r:"43", ch:"VI",   t:"Cessation — member absent from 3 consecutive meetings without prior intimation ceases to be member",                                       c:"Advisory",       thresh:"Board Members",          codeRef:"Sec 42" },
    { r:"44", ch:"VI",   t:"Disqualification — unsound mind (court declared), undischarged insolvent, convicted of moral turpitude offence",                           c:"Advisory",       thresh:"Board Members",          codeRef:"Sec 42" },
    { r:"45", ch:"VII",  t:"Payment to nominees — Form-VII nomination; spouse/family preference; fresh after marriage; minor needs guardian; deposit with DyCLC(C) within 3 months if not paid", c:"Claims", thresh:"All Employees", codeRef:"Sec 44(1)(a)" },
    { r:"46", ch:"VII",  t:"Deposit of undisbursed dues — within 15 days after 6 months from due date; bank transfer or crossed demand draft in favour of DyCLC(C)",   c:"Claims",         thresh:"All Employers",          codeRef:"Sec 44(1)(b)" },
    { r:"47", ch:"VII",  t:"Dealing with deposit — invest in Govt securities or scheduled bank FD; 15-day public notice; 7-year unclaimed: as Central Govt directs",   c:"Claims",         thresh:"All Employers",          codeRef:"Sec 44" },
    { r:"48", ch:"VIII", t:"Returns — filed electronically by employer in forms under OSH&WC Code 2020 (integrated unified return)",                                   c:"Records",        thresh:"All Establishments",     codeRef:"Sec 50" },
    { r:"49", ch:"VIII", t:"Form and procedure for filing claims — Form-II single application for group; Form-VIII notice to employer; ex-parte if employer absent",    c:"Claims",         thresh:"All Employees",          codeRef:"Sec 45(5)" },
    { r:"50", ch:"VIII", t:"Procedure for filing appeal — Form-III electronically/speed post; employer MUST deposit claim amount; Form-VIII notice; ex-parte on absence", c:"Claims",       thresh:"All",                    codeRef:"Sec 49(1)" },
    { r:"51", ch:"VIII", t:"Form of register — Form-I Employee Register; Form-IV Wages/OT/Advances/Fines/Deductions; Form-IX Attendance; ALL preserved 5 years",       c:"Records",        thresh:"All Establishments",     codeRef:"Sec 50(1)" },
    { r:"52", ch:"VIII", t:"Wage slip — Form-V issued electronically or physically on or before payment of wages",                                                      c:"Records",        thresh:"All Establishments",     codeRef:"Sec 50(3)" },
    { r:"53", ch:"VIII", t:"Manner of holding enquiry — officer considers evidence; summons offender; evidence on oath; cross-examination; defence opportunity",        c:"Offences",       thresh:"All",                    codeRef:"Sec 53(1)" },
    { r:"54", ch:"VIII", t:"Composition of offences — Form-VI Part-A application; 50% of max fine; payment within 30 days; Composition Certificate Form-VI Part-B within 10 days", c:"Offences", thresh:"All",            codeRef:"Sec 56(1)" }
  ],

  // ============================================================
  // ALL 9 PRESCRIBED FORMS
  // ============================================================
  forms: [
    {
      n: "I",
      ruleRef: "Rule 51(1)(i)",
      cat: "Records",
      codeRef: "Sec 50",
      cc: "#2ECC9A",
      bg: "rgba(46,204,154,0.12)",
      title: "Employee Register",
      desc: "Comprehensive employee register maintained by every employer. Contains: personal details, employment history, statutory IDs (UAN, PAN, Aadhaar, ESIC IP), banking details, nomination details, photo, signature/thumb impression, date of exit with reason. Categorizes as Highly Skilled/Skilled/Semi-skilled/Unskilled and Permanent/Temporary/Fixed-Term/Trainee/Badli.",
      who: "All Employers",
      deadline: "Maintained always; preserved 5 years after last entry",
      filedBy: "Employer (maintained)",
      driveLink: "https://drive.google.com/file/d/1zKyLmuymaiBWCn2UDk-dvDGmRoZWFkDs/view"
    },
    {
      n: "II",
      ruleRef: "Rule 49(1)",
      cat: "Claims",
      codeRef: "Sec 45(5)",
      cc: "#F07070",
      bg: "rgba(240,112,112,0.12)",
      title: "Application for Claims under Section 45(5)",
      desc: "Single application for any number of employees in same establishment where claims relate to same wage period or same incident of discrimination. Filed by employees, registered trade union, or Inspector-cum-Facilitator before the Claims Authority.",
      who: "Employees / Registered Trade Union / Inspector",
      deadline: "Within 3 years of cause of action",
      filedBy: "Aggrieved Employees → Authority",
      driveLink: "https://drive.google.com/file/d/1YumW5EVqrVZ4anvSrBFqyR9WTsoiB5eN/view"
    },
    {
      n: "III",
      ruleRef: "Rule 50(1)",
      cat: "Appeal",
      codeRef: "Sec 49(1)",
      cc: "#9B72E8",
      bg: "rgba(155,114,232,0.12)",
      title: "Appeal before Appellate Authority",
      desc: "Appeal filed by aggrieved person against order under Section 45(2). Employer MUST deposit claim amount with appellate authority at time of appeal. Filed electronically or by speed post.",
      who: "Aggrieved Person → Appellate Authority",
      deadline: "Within 90 days of order under Section 45(2)",
      filedBy: "Appellant (employer deposits claim amount)",
      driveLink: "https://drive.google.com/file/d/1lxl3dZ1ljO3lrSexQdjH4DrGk21AwP-j/view"
    },
    {
      n: "IV",
      ruleRef: "Rules 51(1)(ii), 51(2), 51(3)",
      cat: "Records",
      codeRef: "Sec 50",
      cc: "#E8A020",
      bg: "rgba(232,160,32,0.12)",
      title: "Register of Wages, Overtime, Advances, Fines and Deductions",
      desc: "Comprehensive wages register. Records: wage rates (Basic+DA+Allowances), overtime worked, wages earned, all deductions (EPF, ESIC, Income Tax, Insurance, Advances, Fines, Damages/Losses), net payment, bank transaction ID. Also records fines under Sec 19(8) and deductions under Sec 21(3).",
      who: "All Employers",
      deadline: "Maintained continuously; preserved 5 years",
      filedBy: "Employer (maintained)",
      driveLink: "https://drive.google.com/file/d/1Q9OxKVavAENfrv3b0xFMMLhe8A9RcSRI/view"
    },
    {
      n: "V",
      ruleRef: "Rule 52",
      cat: "Wage Slip",
      codeRef: "Sec 50(3)",
      cc: "#1ECDE8",
      bg: "rgba(30,205,232,0.12)",
      title: "Wage Slip",
      desc: "Statutory wage slip issued by every employer to all employees on or before payment of wages. Contains full breakdown: rates, attendance, overtime, gross wages, all deductions, net wages paid. Issued electronically or in physical form.",
      who: "All Employers → Each Employee",
      deadline: "On or before each wage payment",
      filedBy: "Employer → Employee",
      driveLink: "https://drive.google.com/file/d/1lZmgRelm-x98RbKdF4obuOJROH9CU7eS/view"
    },
    {
      n: "VI",
      ruleRef: "Rules 54(1), 54(3)",
      cat: "Compounding",
      codeRef: "Sec 56",
      cc: "#F07832",
      bg: "rgba(240,120,50,0.12)",
      title: "Application for Composition of Offence + Composition Certificate (2 Parts)",
      desc: "PART-A: Application by accused person to Gazetted Officer for compounding the offence (50% of max fine). PART-B: Composition Certificate issued by compounding officer within 10 days of receipt of composition amount — certifies full remission.",
      who: "Accused Person (Part-A); Compounding Officer (Part-B)",
      deadline: "Payment within 30 days of composition order",
      filedBy: "Accused (Application); Compounding Officer (Certificate)",
      driveLink: "https://drive.google.com/file/d/16DeGvE_tGdzVmiY_i7cCrFWdAf7Env0Q/view"
    },
    {
      n: "VII",
      ruleRef: "Rule 45(1)(a)",
      cat: "Nomination",
      codeRef: "Sec 44(1)(a)",
      cc: "#E858A8",
      bg: "rgba(232,88,168,0.12)",
      title: "Nomination Form for Undisbursed Dues",
      desc: "Employee declares person(s) to receive dues on death. If family exists, nomination must be in favour of spouse/family member. Fresh nomination mandatory after marriage. For minor nominees, guardian must be appointed. Multiple nominees: share specified. Employer certifies with seal; duplicate returned to employee.",
      who: "All Employees → Employer",
      deadline: "On joining; fresh nomination after marriage",
      filedBy: "Employee (certified by Employer)",
      driveLink: "https://drive.google.com/file/d/1n7ZFUd3njcgLT8LKHgZF_bn27gYs6Swz/view"
    },
    {
      n: "VIII",
      ruleRef: "Rule 49(2)",
      cat: "Notice",
      codeRef: "Sec 45(5), Sec 49(1)",
      cc: "#2E6FED",
      bg: "rgba(46,111,237,0.12)",
      title: "Notice to Respondent (2 Parts)",
      desc: "PART-A: Notice by Authority under Sec 45(5) to respondent (employer) to appear with documents — default leads to ex-parte. PART-B: Notice by Appellate Authority under Sec 49(1) to respondent for hearing of appeal.",
      who: "Authority / Appellate Authority → Respondent",
      deadline: "As specified in notice",
      filedBy: "Authority / Appellate Authority",
      driveLink: "https://drive.google.com/file/d/1ThOPDwuvn8XyvshVHnSEoBmAAPkvZfw3/view"
    },
    {
      n: "IX",
      ruleRef: "Rule 51(1)(iii)",
      cat: "Attendance",
      codeRef: "Sec 50",
      cc: "#60A5FA",
      bg: "rgba(96,165,250,0.12)",
      title: "Attendance Register-cum-Muster Roll",
      desc: "Daily attendance register recording IN/OUT times for each day with signature/thumb impression. Captures shift details, place of work/section/department, total days worked, overtime hours, tour details. Maintained electronically or physically. Preserved 5 years.",
      who: "All Employers",
      deadline: "Maintained daily; preserved 5 years",
      filedBy: "Employer (maintained)",
      driveLink: "https://drive.google.com/file/d/1n7R3XqN9PMgTaa8i18IlEMEfHhvn2yAM/view"
    }
  ],

  // ============================================================
  // EMPLOYER COMPLIANCE SECTIONS
  // ============================================================
  employerSections: [
    {
      icon: "💰",
      title: "A. Minimum Wages & VDA (Chapter II)",
      color: "rgba(46,111,237,0.12)",
      items: [
        {
          rule: "Rule 3",
          title: "Minimum Wages Calculation",
          cls: "minw",
          codeRef: "Sec 6(5)",
          desc: "Daily basis fixed. Hourly = Daily ÷ 8. Monthly = Daily × 26. Fractions of half/more rounded up; less than half rounded down. Central Govt does NOT fix Central Govt employees' minimum wages.",
          thresh: "All Establishments",
          forms: []
        },
        {
          rule: "Rule 4",
          title: "VDA Revision — Twice Yearly",
          cls: "minw",
          codeRef: "Sec 7",
          desc: "VDA computed BEFORE 1ST APRIL and BEFORE 1ST OCTOBER every year. Based on Average CPI-IW published by Labour Bureau, MoLE. Includes cost of living allowance + cash value of concessions on essential commodities.",
          thresh: "All Employees",
          forms: []
        },
        {
          rule: "Rules 5–7",
          title: "Hours of Work, Rest Day & Night Shifts",
          cls: "minw",
          codeRef: "Sec 13, 14",
          desc: "NORMAL WORKING DAY: 8 hours; max 48 hours weekly. WEEKLY REST: 1 day per week (Sunday). NIGHT SHIFT: Rest day = 24 hrs from shift-end; midnight hours counted in previous day. Max 10 consecutive working days without rest. OVERTIME: not less than 2x normal rate.",
          thresh: "All Employees",
          forms: []
        }
      ]
    },
    {
      icon: "💼",
      title: "B. Payment of Wages (Chapter IV)",
      color: "rgba(232,160,32,0.12)",
      items: [
        {
          rule: "Rules 14–16",
          title: "Fines: Authority, Notice & Procedure",
          cls: "pay",
          codeRef: "Sec 19",
          desc: "AUTHORITY: DyCLC(C) approves acts/omissions. NOTICE: Hindi + English + Local language at workplace. PROCEDURE: 7-day show cause → fine on charges established → intimated within 15 days. Fine ≤ 3% of wages.",
          thresh: "All Employees",
          forms: []
        },
        {
          rule: "Rule 13",
          title: "Deductions Limit — 50% of Wages",
          cls: "pay",
          codeRef: "Sec 18(4)",
          desc: "Total authorised deductions cannot exceed 50% of wages. Excess carried forward to next wage period in instalments so recovery in any month ≤ 50%.",
          thresh: "All Employees",
          forms: []
        },
        {
          rule: "Rules 17–18",
          title: "Absence & Damage/Loss Deductions",
          cls: "pay",
          codeRef: "Sec 20, 21",
          desc: "7-day notice + show cause for both. On establishment of charges, deduction made and intimated within 15 days.",
          thresh: "All Employees",
          forms: ["IV"]
        },
        {
          rule: "Rules 19–20",
          title: "Recovery of Advances & Loans",
          cls: "pay",
          codeRef: "Sec 23, 24",
          desc: "ADVANCES: Instalments ≤ 50% of wages per period (subject to Rule 13 ceiling); recorded in Form-IV. LOANS: Per Central Government instructions on extent and interest rate.",
          thresh: "All Employees",
          forms: ["IV"]
        }
      ]
    },
    {
      icon: "🎁",
      title: "C. Bonus (Chapter V)",
      color: "rgba(232,88,168,0.12)",
      items: [
        {
          rule: "Sec 26",
          title: "Bonus Eligibility — 8.33% to 20%",
          cls: "bon",
          codeRef: "Sec 26",
          desc: "Every employee drawing wages up to specified amount entitled if worked 30+ days. Minimum: 8.33% of wages or ₹100 (whichever higher). Maximum: 20% of wages. Applicable to establishments with 20+ persons.",
          thresh: "All Employers",
          forms: []
        },
        {
          rule: "Rules 27–28",
          title: "Set On / Set Off Mechanism",
          cls: "bon",
          codeRef: "Sec 36",
          desc: "SET ON: Excess over max bonus carried forward up to 20% of total wages for 4 years per Appendix A. SET OFF: Deficiency/minimum amount carried forward for 4 years per Appendix A.",
          thresh: "All Employers",
          forms: []
        },
        {
          rule: "Sec 39",
          title: "Bonus Payment — Within 8 Months",
          cls: "bon",
          codeRef: "Sec 39",
          desc: "Bonus PAYABLE WITHIN 8 MONTHS from close of accounting year. May be extended by appropriate Government up to total 2 years on sufficient cause shown.",
          thresh: "All Employers",
          forms: []
        }
      ]
    },
    {
      icon: "⚰️",
      title: "D. Undisbursed Dues on Death (Chapter VII)",
      color: "rgba(240,112,112,0.10)",
      items: [
        {
          rule: "Rules 45–47",
          title: "Nomination, Deposit & Investment",
          cls: "clm",
          codeRef: "Sec 44",
          desc: "Form-VII nomination; spouse/family preference; fresh on marriage; minor needs guardian. If unpaid 3 months → deposit with DyCLC(C). Investment in Govt securities/FD. 15-day public notice. 7-year unclaimed → as Central Govt directs.",
          thresh: "All Employees",
          forms: ["VII"]
        }
      ]
    },
    {
      icon: "📋",
      title: "E. Records, Registers & Wage Slip (Chapter VIII)",
      color: "rgba(46,204,154,0.12)",
      items: [
        {
          rule: "Rule 51",
          title: "3 Mandatory Registers",
          cls: "rec",
          codeRef: "Sec 50(1)",
          desc: "(i) EMPLOYEE REGISTER — Form-I. (ii) WAGES/OT/ADVANCES/FINES/DEDUCTIONS — Form-IV. (iii) ATTENDANCE-CUM-MUSTER ROLL — Form-IX. ALL preserved 5 YEARS after last entry.",
          thresh: "All Establishments",
          forms: ["I", "IV", "IX"]
        },
        {
          rule: "Rule 52",
          title: "Wage Slip — FORM-V on Every Payment",
          cls: "rec",
          codeRef: "Sec 50(3)",
          desc: "Issue Form-V electronically or physically to employees ON OR BEFORE PAYMENT of wages. Full breakdown: Basic+DA+Allowances, attendance, overtime, gross wages, deductions, net wages paid.",
          thresh: "All Employers",
          forms: ["V"]
        }
      ]
    },
    {
      icon: "⚖️",
      title: "F. Claims, Appeals & Compounding (Chapter VIII)",
      color: "rgba(155,114,232,0.10)",
      items: [
        {
          rule: "Rule 49",
          title: "Filing Claims — FORM-II",
          cls: "clm",
          codeRef: "Sec 45(5)",
          desc: "Form-II single application for group of employees in same establishment (same wage period/discrimination incident). Manually or electronically. Form-VIII notice to employer. Failure → ex-parte.",
          thresh: "All Employees",
          forms: ["II", "VIII"]
        },
        {
          rule: "Rule 50",
          title: "Filing Appeals — FORM-III (90 Days)",
          cls: "clm",
          codeRef: "Sec 49(1)",
          desc: "Form-III electronically/speed post to Appellate Authority. EMPLOYER APPEAL: Must deposit claim amount — NO APPEAL WITHOUT DEPOSIT. Form-VIII notice to respondent.",
          thresh: "All",
          forms: ["III"]
        },
        {
          rule: "Rule 54",
          title: "Compounding — FORM-VI (50% of Max Fine)",
          cls: "off",
          codeRef: "Sec 56(1)",
          desc: "Form-VI Part-A application. 50% of max fine payable within 30 days. Composition Certificate Form-VI Part-B issued within 10 days. Failure → prosecution before court.",
          thresh: "All",
          forms: ["VI"]
        }
      ]
    }
  ],

  // ============================================================
  // CALENDAR EVENTS
  // ============================================================
  calEvents: [
    { title: "Wages Rules 2026 — Effective Date",       date: "20260508", desc: "G.S.R. 343(E) — Code on Wages (Central) Rules 2026 came into force.",                                            id: "w0" },
    { title: "VDA Revision — Pre-October (Rule 4)",     date: "20260930", desc: "Compute Variable DA based on CPI-IW before 1st October each year.",                                               id: "w1" },
    { title: "VDA Revision — Pre-April (Rule 4)",       date: "20270331", desc: "Compute Variable DA based on CPI-IW before 1st April each year.",                                                  id: "w2" },
    { title: "Bonus Payment Due (Sec 39)",               date: "20261130", desc: "Bonus payable within 8 months from close of accounting year (typically by 30 Nov for FY ending 31 March).",       id: "w3" },
    { title: "Records 5-Year Retention Check",           date: "20271231", desc: "Verify all wage records, registers and wage slips preserved for at least 5 years from last entry.",               id: "w4" }
  ],

  // ============================================================
  // TIMELINE
  // ============================================================
  timeline: [
    { date: "1936–1976",    title: "Four Original Wage Laws",                         sub: "Payment of Wages Act 1936 · Minimum Wages Act 1948 · Payment of Bonus Act 1965 · Equal Remuneration Act 1976 — governed wage matters for over 80 years.",                                                                                           color: "#9B72E8" },
    { date: "8 Aug 2019",   title: "Code on Wages, 2019 Enacted",                    sub: "Act No. 29 of 2019 — consolidates 4 earlier laws. 69 sections across 9 chapters.",                                                                                                                                                                     color: "#E8A020" },
    { date: "30 Dec 2025",  title: "Draft Central Rules Published — G.S.R. 936(E)",  sub: "Draft Code on Wages (Central) Rules, 2025 published with 45-day window for public comments.",                                                                                                                                                          color: "#F07832" },
    { date: "8 May 2026",   title: "✅ Final Rules Notified — G.S.R. 343(E)",        sub: "54 Rules across 8 Chapters, 9 Forms (FORM-I to IX), 4 Appendices (A, B, C, D). Effective from date of publication.",                                                                                                                                    color: "#2ECC9A" },
    { date: "Ongoing",      title: "💰 VDA Revision Cycle (Rule 4)",                 sub: "VDA revised twice yearly — before 1st April and before 1st October based on CPI-IW.",                                                                                                                                                                   color: "#2E6FED" },
    { date: "Annual",       title: "🎁 Bonus Payment Deadline (Sec 39)",             sub: "Bonus payable within 8 months from close of accounting year; min 8.33%, max 20%.",                                                                                                                                                                      color: "#E858A8" }
  ]
};
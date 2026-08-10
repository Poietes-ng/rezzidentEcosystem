import json

# Read the MODELS definition
exec(open("/Users/mac/rezzidentEcosystem/generate_flowchart.py").read())

models_json = json.dumps(MODELS, indent=4)

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rezzident Ecosystem — Master ERD Database Flow & System Workflows</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg-dark: #070a12;
      --bg-card: rgba(15, 23, 42, 0.92);
      --bg-card-hover: rgba(24, 36, 64, 0.98);
      --border-color: rgba(255, 255, 255, 0.08);
      --border-color-hover: rgba(56, 189, 248, 0.5);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      
      /* Domain Color Palette */
      --color-public: #38bdf8;      /* Cyan - Public Core */
      --color-identity: #818cf8;    /* Indigo - Identity & Residence */
      --color-social: #a78bfa;      /* Purple - Verification & Social */
      --color-visitor: #34d399;     /* Emerald - Gate Access */
      --color-finance: #f59e0b;     /* Amber - Financial Dues */
      --color-governance: #ec4899;  /* Pink - Governance & Ops */
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }}

    body {{
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      overflow: hidden;
      height: 100vh;
      width: 100vw;
    }}

    /* Grid Background Pattern */
    .bg-grid {{
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
      background-size: 32px 32px;
      pointer-events: none;
      z-index: 0;
    }}

    /* Header Bar */
    header {{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgba(7, 10, 18, 0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      z-index: 50;
    }}

    .brand {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .brand-logo {{
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #0284c7, #6366f1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
      font-weight: 800;
      color: white;
      font-size: 16px;
    }}

    .brand-title {{
      font-size: 16px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: #fff;
    }}

    .brand-badge {{
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 12px;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    /* Tab Switcher */
    .tabs {{
      display: flex;
      background: rgba(255, 255, 255, 0.04);
      padding: 4px;
      border-radius: 10px;
      border: 1px solid var(--border-color);
    }}

    .tab-btn {{
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    .tab-btn.active {{
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }}

    /* Controls */
    .controls {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .search-box {{
      position: relative;
    }}

    .search-input {{
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      padding: 7px 14px 7px 32px;
      border-radius: 8px;
      color: #fff;
      font-size: 12px;
      width: 220px;
      outline: none;
      transition: all 0.2s;
    }}

    .search-input:focus {{
      border-color: var(--color-public);
      width: 280px;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
    }}

    .search-icon {{
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 13px;
    }}

    /* App Container */
    #app-container {{
      position: relative;
      width: 100vw;
      height: calc(100vh - 64px);
      margin-top: 64px;
    }}

    /* Graph Canvas View */
    #graph-view {{
      position: absolute;
      inset: 0;
      overflow: hidden;
      cursor: grab;
    }}

    #graph-view.panning {{
      cursor: grabbing !important;
    }}

    svg#graph-svg {{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }}

    /* ERD Card Node Styling */
    .node-group {{
      cursor: move;
      transition: opacity 0.25s ease;
    }}

    .node-card {{
      fill: var(--bg-card);
      stroke-width: 1.5;
      rx: 10;
      ry: 10;
      filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.8));
      transition: stroke 0.2s, stroke-width 0.2s, filter 0.2s;
    }}

    .node-group:hover .node-card {{
      stroke-width: 2.5;
      filter: drop-shadow(0 0 25px rgba(56, 189, 248, 0.4));
    }}

    .node-header-bg {{
      rx: 10;
      ry: 10;
      opacity: 0.18;
    }}

    .node-header-title {{
      font-weight: 700;
      font-size: 13px;
      fill: #ffffff;
      pointer-events: none;
    }}

    .node-header-table {{
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      fill: #94a3b8;
      pointer-events: none;
    }}

    .col-row-text {{
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      pointer-events: none;
    }}

    .col-name {{
      fill: #e2e8f0;
      font-weight: 500;
    }}

    .col-type {{
      fill: #64748b;
      font-size: 10px;
    }}

    .pk-tag {{
      fill: #f59e0b;
      font-weight: 700;
    }}

    .fk-tag {{
      fill: #818cf8;
      font-weight: 700;
    }}

    .port-dot {{
      r: 4;
      stroke-width: 1.5;
      transition: r 0.2s, fill 0.2s;
    }}

    .node-group:hover .port-dot {{
      r: 5.5;
    }}

    /* Connection Lines */
    .link-path {{
      fill: none;
      stroke-width: 1.8;
      opacity: 0.35;
      transition: opacity 0.25s, stroke-width 0.25s, stroke 0.25s;
      cursor: pointer;
    }}

    .link-path:hover {{
      opacity: 0.95;
      stroke-width: 3.5;
      filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.6));
    }}

    .link-path.active {{
      opacity: 1;
      stroke-width: 3;
      filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.8));
    }}

    /* Legend */
    .legend-panel {{
      position: absolute;
      bottom: 24px;
      left: 24px;
      background: var(--bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 14px 18px;
      z-index: 40;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.7);
    }}

    .legend-title {{
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    .legend-items {{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 16px;
    }}

    .legend-item {{
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid transparent;
      transition: all 0.2s;
    }}

    .legend-item:hover {{
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }}

    .legend-dot {{
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
    }}

    /* Floating Zoom Controls */
    .zoom-toolbar {{
      position: absolute;
      bottom: 24px;
      right: 24px;
      background: var(--bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 6px 10px;
      z-index: 40;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    }}

    .zoom-btn {{
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-color);
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }}

    .zoom-btn:hover {{
      background: rgba(255, 255, 255, 0.18);
      border-color: rgba(255, 255, 255, 0.3);
    }}

    .zoom-scale-text {{
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--color-public);
      min-width: 50px;
      text-align: center;
      font-weight: 600;
    }}

    /* Inspector Drawer */
    #inspector-drawer {{
      position: absolute;
      top: 20px;
      right: 20px;
      bottom: 20px;
      width: 400px;
      background: rgba(11, 17, 31, 0.96);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      z-index: 60;
      transform: translateX(440px);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      box-shadow: -10px 0 40px rgba(0,0,0,0.8);
      overflow: hidden;
    }}

    #inspector-drawer.open {{
      transform: translateX(0);
    }}

    .drawer-header {{
      padding: 18px 22px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    .drawer-title {{
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }}

    .drawer-subtitle {{
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--color-public);
      margin-top: 2px;
    }}

    .close-btn {{
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: var(--text-muted);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .drawer-content {{
      padding: 18px 22px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }}

    .field-row {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.03);
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 11px;
    }}

    .field-name {{
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      color: #e2e8f0;
    }}

    .field-type {{
      font-family: 'JetBrains Mono', monospace;
      color: var(--color-public);
    }}

    /* Tooltip */
    #link-tooltip {{
      position: absolute;
      padding: 6px 12px;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid var(--color-public);
      border-radius: 6px;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: #fff;
      pointer-events: none;
      z-index: 100;
      display: none;
      box-shadow: 0 4px 14px rgba(0,0,0,0.6);
    }}

    /* Views */
    #flowcharts-view, #matrix-view {{
      display: none;
      position: absolute;
      inset: 0;
      padding: 30px;
      overflow-y: auto;
      z-index: 10;
    }}

    .flowcard {{
      background: var(--bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
    }}

    .steps-container {{
      display: flex;
      align-items: center;
      gap: 12px;
      overflow-x: auto;
      padding: 10px 0;
    }}

    .step-box {{
      min-width: 220px;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 14px;
    }}

    .matrix-table {{
      width: 100%;
      max-width: 1300px;
      margin: 0 auto;
      border-collapse: collapse;
      background: var(--bg-card);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }}

    .matrix-table th, .matrix-table td {{
      padding: 12px 16px;
      font-size: 12px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }}

    .matrix-table th {{
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
      text-transform: uppercase;
      font-size: 11px;
    }}
  </style>
</head>
<body>

  <div class="bg-grid"></div>

  <!-- Header -->
  <header>
    <div class="brand">
      <div class="brand-logo">R</div>
      <div class="brand-title">Rezzident Database ERD & Flowcharts</div>
      <span class="brand-badge">37 Master Models • Field-Level Web</span>
    </div>

    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('graph')">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        Database ERD Graph
      </button>
      <button class="tab-btn" onclick="switchTab('flowcharts')">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        System Workflows
      </button>
      <button class="tab-btn" onclick="switchTab('matrix')">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        Table Matrix
      </button>
    </div>

    <div class="controls">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="search-input" class="search-input" placeholder="Search model, table, or field..." oninput="handleSearch(this.value)">
      </div>
    </div>
  </header>

  <!-- App Container -->
  <div id="app-container">

    <!-- View 1: Interactive ERD Graph -->
    <div id="graph-view">
      <svg id="graph-svg">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.4)" />
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
          </marker>
        </defs>

        <g id="viewport">
          <g id="domain-headers-layer"></g>
          <g id="links-layer"></g>
          <g id="nodes-layer"></g>
        </g>
      </svg>

      <!-- Tooltip -->
      <div id="link-tooltip"></div>

      <!-- Legend & Domain Filters -->
      <div class="legend-panel">
        <div class="legend-title">
          <span>Database Sub-Systems</span>
          <span style="font-size: 9px; opacity: 0.7;">Click to filter</span>
        </div>
        <div class="legend-items">
          <div class="legend-item" onclick="filterDomain('Public Core')">
            <div class="legend-dot" style="background: var(--color-public); color: var(--color-public);"></div> Public Core
          </div>
          <div class="legend-item" onclick="filterDomain('Identity & Residence')">
            <div class="legend-dot" style="background: var(--color-identity); color: var(--color-identity);"></div> Identity & Residence
          </div>
          <div class="legend-item" onclick="filterDomain('Verification & Social')">
            <div class="legend-dot" style="background: var(--color-social); color: var(--color-social);"></div> Verification & Social
          </div>
          <div class="legend-item" onclick="filterDomain('Gate Access')">
            <div class="legend-dot" style="background: var(--color-visitor); color: var(--color-visitor);"></div> Gate Access
          </div>
          <div class="legend-item" onclick="filterDomain('Financial Dues')">
            <div class="legend-dot" style="background: var(--color-finance); color: var(--color-finance);"></div> Financial Dues
          </div>
          <div class="legend-item" onclick="filterDomain('Governance & Ops')">
            <div class="legend-dot" style="background: var(--color-governance); color: var(--color-governance);"></div> Governance & Ops
          </div>
        </div>
      </div>

      <!-- Zoom Toolbar -->
      <div class="zoom-toolbar">
        <button class="zoom-btn" onclick="zoomIn()" title="Zoom In">🔍 +</button>
        <span class="zoom-scale-text" id="scale-text">85%</span>
        <button class="zoom-btn" onclick="zoomOut()" title="Zoom Out">🔍 -</button>
        <button class="zoom-btn" onclick="fitView()" title="Fit Screen">🎯 Fit</button>
        <button class="zoom-btn" onclick="resetZoom()" title="Reset Origin">⟲ Reset</button>
      </div>
    </div>

    <!-- View 2: Workflows -->
    <div id="flowcharts-view">
      <div style="max-width: 1100px; margin: 0 auto;">
        
        <!-- Workflow 1 -->
        <div class="flowcard">
          <h3 style="color: var(--color-public); font-size: 18px; margin-bottom: 8px;">🏗️ 1. Estate Registration & Flexible Address Structure Flow</h3>
          <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 18px;">
            Registration flow matching Figma specs: Estate setup, management type selection, 48+ preloaded/custom structure configuration, 2 designated stakeholders, and Paystack settlement account.
          </p>
          <div class="steps-container">
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">1. Basic Info & Type</div>
              <div style="font-size: 11px; color: var(--text-muted);">Estate Name, Address, GPS, Type (Community / Firm)</div>
            </div>
            <span style="color: var(--color-public);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">2. Structure Template</div>
              <div style="font-size: 11px; color: var(--text-muted);">Select from 48+ preloaded patterns or custom structure</div>
            </div>
            <span style="color: var(--color-public);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">3. 2 Stakeholders</div>
              <div style="font-size: 11px; color: var(--text-muted);">Assign 2 contacts (Elected leaders or Firm admins)</div>
            </div>
            <span style="color: var(--color-public);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">4. Bank Settlement</div>
              <div style="font-size: 11px; color: var(--text-muted);">Bank details & Paystack Subaccount auto-creation</div>
            </div>
            <span style="color: var(--color-public);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">5. Onboarding Verification</div>
              <div style="font-size: 11px; color: var(--text-muted);">Stakeholder OTP verify → Instant admin panel access</div>
            </div>
          </div>
        </div>

        <!-- Workflow 2 -->
        <div class="flowcard">
          <h3 style="color: var(--color-identity); font-size: 18px; margin-bottom: 8px;">🛡️ 2. Resident Auth & Peer Vouching System</h3>
          <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 18px;">
            Registration paths, facial bio capture, PIN setup, and peer vouching upgrade from Tier 1 (restricted) to Tier 2 (full access).
          </p>
          <div class="steps-container">
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">1. Registration</div>
              <div style="font-size: 11px; color: var(--text-muted);">Phone # + Facial Capture URL + NIN setup</div>
            </div>
            <span style="color: var(--color-identity);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">2. OTP Verification</div>
              <div style="font-size: 11px; color: var(--text-muted);">SMS verification via OTP model</div>
            </div>
            <span style="color: var(--color-identity);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">3. Tier Assessment</div>
              <div style="font-size: 11px; color: var(--text-muted);">CSV Match → Tier 2 | Self Registered → Tier 1</div>
            </div>
            <span style="color: var(--color-identity);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">4. Peer Vouching</div>
              <div style="font-size: 11px; color: var(--text-muted);">2 verified neighbors vouch → Tier 2 Upgrade</div>
            </div>
          </div>
        </div>

        <!-- Workflow 3 -->
        <div class="flowcard">
          <h3 style="color: var(--color-visitor); font-size: 18px; margin-bottom: 8px;">🚪 3. Visitor Passcode & Gate Security Flow</h3>
          <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 18px;">
            Single-entry, multi-entry, or duration visitor code generation with real-time gate security check-in/out logging.
          </p>
          <div class="steps-container">
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">1. Schedule Visitor</div>
              <div style="font-size: 11px; color: var(--text-muted);">Resident creates VisitorCode in app</div>
            </div>
            <span style="color: var(--color-visitor);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">2. Gate Scan</div>
              <div style="font-size: 11px; color: var(--text-muted);">Security guard scans/types code</div>
            </div>
            <span style="color: var(--color-visitor);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">3. Log Check-In</div>
              <div style="font-size: 11px; color: var(--text-muted);">Record created in Visitor history table</div>
            </div>
            <span style="color: var(--color-visitor);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">4. Arrival Alert</div>
              <div style="font-size: 11px; color: var(--text-muted);">Instant push notification sent to resident</div>
            </div>
          </div>
        </div>

        <!-- Workflow 4 -->
        <div class="flowcard">
          <h3 style="color: var(--color-finance); font-size: 18px; margin-bottom: 8px;">💳 4. Bill Payment & Paystack Split Ledger Flow</h3>
          <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 18px;">
            Automated payment splitting: Gross payment divided between Paystack fee, Platform revenue, and Estate settlement subaccount with real-time audit ledger.
          </p>
          <div class="steps-container">
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">1. Bill Generated</div>
              <div style="font-size: 11px; color: var(--text-muted);">Bill created & ResidentBill assigned</div>
            </div>
            <span style="color: var(--color-finance);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">2. Resident Pays</div>
              <div style="font-size: 11px; color: var(--text-muted);">Payment initialized via Paystack SDK</div>
            </div>
            <span style="color: var(--color-finance);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">3. Paystack Split</div>
              <div style="font-size: 11px; color: var(--text-muted);">Split transaction executed on gateway</div>
            </div>
            <span style="color: var(--color-finance);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">4. PaymentLedger Record</div>
              <div style="font-size: 11px; color: var(--text-muted);">Exact kobo breakdown logged for reconciliation</div>
            </div>
          </div>
        </div>

        <!-- Workflow 5 -->
        <div class="flowcard">
          <h3 style="color: var(--color-governance); font-size: 18px; margin-bottom: 8px;">🚨 5. Panic Alert & Emergency Escalation Flow</h3>
          <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 18px;">
            Instant emergency trigger with real-time GPS coordinates, security broadcast, and resolution logging.
          </p>
          <div class="steps-container">
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">1. Panic Triggered</div>
              <div style="font-size: 11px; color: var(--text-muted);">Resident presses Panic Button in app</div>
            </div>
            <span style="color: var(--color-governance);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">2. Record & Broadcast</div>
              <div style="font-size: 11px; color: var(--text-muted);">PanicAlert created with GPS coordinates</div>
            </div>
            <span style="color: var(--color-governance);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">3. Security Alert</div>
              <div style="font-size: 11px; color: var(--text-muted);">Instant push to security guards & estate admins</div>
            </div>
            <span style="color: var(--color-governance);">➔</span>
            <div class="step-box">
              <div style="font-weight: 700; font-size: 13px; color: #fff; margin-bottom: 4px;">4. Resolution</div>
              <div style="font-size: 11px; color: var(--text-muted);">Guard arrives, marks alert resolved with notes</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- View 3: Table Matrix -->
    <div id="matrix-view">
      <table class="matrix-table">
        <thead>
          <tr>
            <th>Class Model</th>
            <th>PostgreSQL Table</th>
            <th>Schema</th>
            <th>Domain</th>
            <th>Columns Count</th>
            <th>Foreign Keys</th>
          </tr>
        </thead>
        <tbody id="matrix-body"></tbody>
      </table>
    </div>

    <!-- Inspector Drawer -->
    <div id="inspector-drawer">
      <div class="drawer-header">
        <div>
          <div class="drawer-title" id="drawer-model-name">Table Details</div>
          <div class="drawer-subtitle" id="drawer-model-table">table_name</div>
        </div>
        <button class="close-btn" onclick="closeDrawer()">✕</button>
      </div>
      <div class="drawer-content">
        <div>
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Schema & Domain</div>
          <div id="drawer-model-meta" style="font-size: 12px; color: var(--text-muted);"></div>
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Column Definitions</div>
          <div id="drawer-fields-list" style="display: flex; flex-direction: column; gap: 6px;"></div>
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Foreign Key Connections</div>
          <div id="drawer-rel-list" style="display: flex; flex-direction: column; gap: 6px;"></div>
        </div>
      </div>
    </div>

  </div>

  <script>
    const MODELS = {models_json};

    let scale = 0.75;
    let translateX = 80;
    let translateY = 60;
    let isPanning = false;
    let isDraggingNode = false;
    let draggedNode = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let startX = 0;
    let startY = 0;
    let activeDomainFilter = null;

    const SVG_CARD_WIDTH = 250;
    const SVG_ROW_HEIGHT = 22;
    const SVG_HEADER_HEIGHT = 50;

    const DOMAIN_X_OFFSETS = {{
      'Public Core': 60,
      'Identity & Residence': 400,
      'Verification & Social': 740,
      'Gate Access': 1080,
      'Financial Dues': 1420,
      'Governance & Ops': 1760
    }};

    function initGraph() {{
      const nodesGroup = document.getElementById('nodes-layer');
      const linksGroup = document.getElementById('links-layer');
      const headersGroup = document.getElementById('domain-headers-layer');

      nodesGroup.innerHTML = '';
      linksGroup.innerHTML = '';
      headersGroup.innerHTML = '';

      // Track Y positions per domain column to prevent card collisions
      const domainYCounters = {{
        'Public Core': 100,
        'Identity & Residence': 100,
        'Verification & Social': 100,
        'Gate Access': 100,
        'Financial Dues': 100,
        'Governance & Ops': 100
      }};

      // Render Domain Banners above each column
      Object.keys(DOMAIN_X_OFFSETS).forEach(domain => {{
        const x = DOMAIN_X_OFFSETS[domain];
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', 30);
        rect.setAttribute('width', SVG_CARD_WIDTH);
        rect.setAttribute('height', 36);
        rect.setAttribute('rx', 8);
        rect.setAttribute('fill', 'rgba(15, 23, 42, 0.85)');
        rect.setAttribute('stroke', getDomainColor(domain));
        rect.setAttribute('stroke-width', '1');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + 16);
        text.setAttribute('y', 53);
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', '800');
        text.setAttribute('fill', getDomainColor(domain));
        text.setAttribute('letter-spacing', '0.8');
        text.textContent = domain.toUpperCase();

        g.appendChild(rect);
        g.appendChild(text);
        headersGroup.appendChild(g);
      }});

      // Position each model card cleanly without overlaps
      MODELS.forEach((m) => {{
        const visibleCols = Math.min(m.columns.length, 8);
        m.height = SVG_HEADER_HEIGHT + visibleCols * SVG_ROW_HEIGHT + 24;

        const currentY = domainYCounters[m.domain] || 100;
        m.x = DOMAIN_X_OFFSETS[m.domain] || 60;
        m.y = currentY;

        domainYCounters[m.domain] = currentY + m.height + 40;
      }});

      // Collect all Foreign Key Links with exact field row indexes
      window.ALL_LINKS = [];
      MODELS.forEach((m) => {{
        m.columns.forEach((col, cIdx) => {{
          if (col.isFk && col.fkTarget) {{
            const parts = col.fkTarget.split('.');
            const targetModelId = parts[0];
            const targetFieldName = parts[1] || 'id';

            const targetModel = MODELS.find(item => item.id === targetModelId);
            if (targetModel) {{
              const targetColIdx = targetModel.columns.findIndex(c => c.name === targetFieldName);
              window.ALL_LINKS.push({{
                id: `link-${{m.id}}-${{col.name}}-to-${{targetModel.id}}-${{targetFieldName}}`,
                source: m,
                sourceField: col.name,
                sourceColIdx: Math.min(cIdx, 8),
                target: targetModel,
                targetField: targetFieldName,
                targetColIdx: targetColIdx >= 0 ? Math.min(targetColIdx, 8) : 0,
                color: m.color
              }});
            }}
          }}
        }});
      }});

      renderLinks();
      renderNodes();
      updateTransform();
      populateMatrix();
    }}

    function getDomainColor(domain) {{
      switch(domain) {{
        case 'Public Core': return '#38bdf8';
        case 'Identity & Residence': return '#818cf8';
        case 'Verification & Social': return '#a78bfa';
        case 'Gate Access': return '#34d399';
        case 'Financial Dues': return '#f59e0b';
        case 'Governance & Ops': return '#ec4899';
        default: return '#38bdf8';
      }}
    }}

    // Render exact field-to-field connection Bezier curves
    function renderLinks() {{
      const linksGroup = document.getElementById('links-layer');
      linksGroup.innerHTML = '';

      window.ALL_LINKS.forEach((l) => {{
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('id', l.id);
        path.setAttribute('class', 'link-path');
        path.setAttribute('stroke', l.color || '#38bdf8');
        path.setAttribute('marker-end', 'url(#arrow)');

        const d = calculateFieldCurve(l);
        path.setAttribute('d', d);

        // Hover tooltip for relationship description
        path.onmouseenter = (e) => {{
          showTooltip(e, `${{l.source.id}}.${{l.sourceField}} ➔ ${{l.target.id}}.${{l.targetField}}`);
        }};
        path.onmouseleave = hideTooltip;

        linksGroup.appendChild(path);
      }});
    }}

    function calculateFieldCurve(l) {{
      const srcY = l.source.y + SVG_HEADER_HEIGHT + 18 + l.sourceColIdx * SVG_ROW_HEIGHT - 6;
      const tgtY = l.target.y + SVG_HEADER_HEIGHT + 18 + l.targetColIdx * SVG_ROW_HEIGHT - 6;

      // Determine left/right anchoring direction based on relative position
      let srcX, tgtX;
      if (l.source.x < l.target.x) {{
        srcX = l.source.x + SVG_CARD_WIDTH;
        tgtX = l.target.x;
      }} else {{
        srcX = l.source.x;
        tgtX = l.target.x + SVG_CARD_WIDTH;
      }}

      const dx = Math.max(60, Math.abs(tgtX - srcX) * 0.4);
      return `M ${{srcX}} ${{srcY}} C ${{srcX + (srcX < tgtX ? dx : -dx)}} ${{srcY}}, ${{tgtX + (srcX < tgtX ? -dx : dx)}} ${{tgtY}}, ${{tgtX}} ${{tgtY}}`;
    }}

    function renderNodes() {{
      const nodesGroup = document.getElementById('nodes-layer');
      nodesGroup.innerHTML = '';

      MODELS.forEach((m) => {{
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'node-group');
        g.setAttribute('id', `node-${{m.id}}`);
        g.setAttribute('transform', `translate(${{m.x}}, ${{m.y}})`);

        // Node Dragging Handlers
        g.onmousedown = (e) => {{
          e.stopPropagation();
          isDraggingNode = true;
          draggedNode = m;
          dragOffsetX = (e.clientX - translateX) / scale - m.x;
          dragOffsetY = (e.clientY - translateY) / scale - m.y;
          selectNode(m);
        }};

        // Outer Card Box
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('class', 'node-card');
        rect.setAttribute('width', SVG_CARD_WIDTH);
        rect.setAttribute('height', m.height);
        rect.setAttribute('stroke', m.color);
        g.appendChild(rect);

        // Header Box
        const hRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        hRect.setAttribute('class', 'node-header-bg');
        hRect.setAttribute('width', SVG_CARD_WIDTH);
        hRect.setAttribute('height', SVG_HEADER_HEIGHT);
        hRect.setAttribute('fill', m.color);
        g.appendChild(hRect);

        // Header Title
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('class', 'node-header-title');
        title.setAttribute('x', 14);
        title.setAttribute('y', 24);
        title.textContent = m.id;
        g.appendChild(title);

        // Table Subtitle
        const sub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        sub.setAttribute('class', 'node-header-table');
        sub.setAttribute('x', 14);
        sub.setAttribute('y', 40);
        sub.textContent = m.table;
        g.appendChild(sub);

        // Field Rows
        const visibleCols = m.columns.slice(0, 8);
        visibleCols.forEach((col, cIdx) => {{
          const yPos = SVG_HEADER_HEIGHT + 18 + cIdx * SVG_ROW_HEIGHT;

          // Connection Handle Dot for PK / FK
          if (col.isPk || col.isFk) {{
            const dotLeft = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dotLeft.setAttribute('class', 'port-dot');
            dotLeft.setAttribute('cx', 0);
            dotLeft.setAttribute('cy', yPos - 5);
            dotLeft.setAttribute('fill', col.isPk ? '#f59e0b' : '#818cf8');
            dotLeft.setAttribute('stroke', '#070a12');
            g.appendChild(dotLeft);

            const dotRight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dotRight.setAttribute('class', 'port-dot');
            dotRight.setAttribute('cx', SVG_CARD_WIDTH);
            dotRight.setAttribute('cy', yPos - 5);
            dotRight.setAttribute('fill', col.isPk ? '#f59e0b' : '#818cf8');
            dotRight.setAttribute('stroke', '#070a12');
            g.appendChild(dotRight);
          }}

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('class', 'col-row-text');
          text.setAttribute('x', 14);
          text.setAttribute('y', yPos);

          let prefix = col.isPk ? '🔑 ' : col.isFk ? '🔗 ' : '';

          const colNameSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          colNameSpan.setAttribute('class', 'col-name');
          if (col.isPk) colNameSpan.setAttribute('class', 'col-name pk-tag');
          if (col.isFk) colNameSpan.setAttribute('class', 'col-name fk-tag');
          colNameSpan.textContent = prefix + col.name;

          const colTypeSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          colTypeSpan.setAttribute('class', 'col-type');
          colTypeSpan.setAttribute('dx', 10);
          colTypeSpan.textContent = col.type;

          text.appendChild(colNameSpan);
          text.appendChild(colTypeSpan);
          g.appendChild(text);
        }});

        if (m.columns.length > 8) {{
          const yPos = SVG_HEADER_HEIGHT + 18 + 8 * SVG_ROW_HEIGHT;
          const moreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          moreText.setAttribute('class', 'col-type');
          moreText.setAttribute('x', 14);
          moreText.setAttribute('y', yPos);
          moreText.textContent = `+ ${{m.columns.length - 8}} more fields...`;
          g.appendChild(moreText);
        }}

        nodesGroup.appendChild(g);
      }});
    }}

    function updateTransform() {{
      const vp = document.getElementById('viewport');
      vp.setAttribute('transform', `translate(${{translateX}}, ${{translateY}}) scale(${{scale}})`);
      document.getElementById('scale-text').textContent = `${{Math.round(scale * 100)}}%`;
    }}

    // Global Mouse Handlers for Dragging & Panning
    const graphView = document.getElementById('graph-view');

    graphView.addEventListener('mousedown', (e) => {{
      if (e.target.closest('#inspector-drawer') || e.target.closest('.zoom-toolbar') || e.target.closest('.legend-panel')) return;
      if (!isDraggingNode) {{
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        graphView.classList.add('panning');
      }}
    }});

    window.addEventListener('mousemove', (e) => {{
      if (isDraggingNode && draggedNode) {{
        draggedNode.x = (e.clientX - translateX) / scale - dragOffsetX;
        draggedNode.y = (e.clientY - translateY) / scale - dragOffsetY;

        const nodeGroup = document.getElementById(`node-${{draggedNode.id}}`);
        if (nodeGroup) {{
          nodeGroup.setAttribute('transform', `translate(${{draggedNode.x}}, ${{draggedNode.y}})`);
        }}
        renderLinks();
      }} else if (isPanning) {{
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
      }}
    }});

    window.addEventListener('mouseup', () => {{
      isPanning = false;
      isDraggingNode = false;
      draggedNode = null;
      graphView.classList.remove('panning');
    }});

    graphView.addEventListener('wheel', (e) => {{
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      scale = Math.min(Math.max(0.25, scale * zoomFactor), 2.5);
      updateTransform();
    }}, {{ passive: false }});

    function zoomIn() {{
      scale = Math.min(2.5, scale * 1.2);
      updateTransform();
    }}

    function zoomOut() {{
      scale = Math.max(0.25, scale / 1.2);
      updateTransform();
    }}

    function resetZoom() {{
      scale = 0.75;
      translateX = 80;
      translateY = 60;
      updateTransform();
    }}

    function fitView() {{
      scale = 0.42;
      translateX = 30;
      translateY = 30;
      updateTransform();
    }}

    function selectNode(m) {{
      // Highlight connections
      document.querySelectorAll('.link-path').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.node-group').forEach(n => n.style.opacity = '0.25');

      const targetGroup = document.getElementById(`node-${{m.id}}`);
      if (targetGroup) targetGroup.style.opacity = '1';

      window.ALL_LINKS.forEach(l => {{
        if (l.source.id === m.id || l.target.id === m.id) {{
          const srcGroup = document.getElementById(`node-${{l.source.id}}`);
          const tgtGroup = document.getElementById(`node-${{l.target.id}}`);
          if (srcGroup) srcGroup.style.opacity = '1';
          if (tgtGroup) tgtGroup.style.opacity = '1';

          const path = document.getElementById(l.id);
          if (path) path.classList.add('active');
        }}
      }});

      openDrawer(m);
    }}

    function openDrawer(m) {{
      const drawer = document.getElementById('inspector-drawer');
      document.getElementById('drawer-model-name').textContent = m.id;
      document.getElementById('drawer-model-table').textContent = `Table: ${{m.table}}`;
      document.getElementById('drawer-model-meta').textContent = `${{m.schema}} • ${{m.domain}}`;

      const fieldsList = document.getElementById('drawer-fields-list');
      fieldsList.innerHTML = '';
      m.columns.forEach(c => {{
        const row = document.createElement('div');
        row.className = 'field-row';
        let prefix = c.isPk ? '🔑 ' : c.isFk ? '🔗 ' : '';
        row.innerHTML = `<span class="field-name">${{prefix}}${{c.name}}</span><span class="field-type">${{c.type}}</span>`;
        fieldsList.appendChild(row);
      }});

      const relList = document.getElementById('drawer-rel-list');
      relList.innerHTML = '';
      let hasFk = false;
      m.columns.forEach(c => {{
        if (c.isFk && c.fkTarget) {{
          hasFk = true;
          const row = document.createElement('div');
          row.className = 'field-row';
          row.innerHTML = `<span class="field-name">${{c.name}}</span><span class="field-type" style="color: #818cf8;">➔ ${{c.fkTarget}}</span>`;
          relList.appendChild(row);
        }}
      }});
      if (!hasFk) {{
        relList.innerHTML = '<div style="font-size: 11px; color: var(--text-muted);">No outgoing foreign keys</div>';
      }}

      drawer.classList.add('open');
    }}

    function closeDrawer() {{
      document.getElementById('inspector-drawer').classList.remove('open');
      document.querySelectorAll('.node-group').forEach(n => n.style.opacity = '1');
      document.querySelectorAll('.link-path').forEach(p => p.classList.remove('active'));
    }}

    function filterDomain(domain) {{
      if (activeDomainFilter === domain) {{
        activeDomainFilter = null;
        document.querySelectorAll('.node-group').forEach(n => n.style.opacity = '1');
        document.querySelectorAll('.link-path').forEach(p => p.style.opacity = '0.35');
        return;
      }}
      activeDomainFilter = domain;
      MODELS.forEach(m => {{
        const group = document.getElementById(`node-${{m.id}}`);
        if (group) {{
          group.style.opacity = m.domain === domain ? '1' : '0.12';
        }}
      }});
      window.ALL_LINKS.forEach(l => {{
        const path = document.getElementById(l.id);
        if (path) {{
          path.style.opacity = (l.source.domain === domain || l.target.domain === domain) ? '0.85' : '0.05';
        }}
      }});
    }}

    function showTooltip(e, text) {{
      const tt = document.getElementById('link-tooltip');
      tt.textContent = text;
      tt.style.left = `${{e.clientX + 14}}px`;
      tt.style.top = `${{e.clientY - 28}}px`;
      tt.style.display = 'block';
    }}

    function hideTooltip() {{
      document.getElementById('link-tooltip').style.display = 'none';
    }}

    function switchTab(tabName) {{
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById('graph-view').style.display = 'none';
      document.getElementById('flowcharts-view').style.display = 'none';
      document.getElementById('matrix-view').style.display = 'none';

      if (tabName === 'graph') {{
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('graph-view').style.display = 'block';
      }} else if (tabName === 'flowcharts') {{
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('flowcharts-view').style.display = 'block';
      }} else if (tabName === 'matrix') {{
        document.querySelectorAll('.tab-btn')[2].classList.add('active');
        document.getElementById('matrix-view').style.display = 'block';
      }}
    }}

    function populateMatrix() {{
      const tbody = document.getElementById('matrix-body');
      tbody.innerHTML = '';
      MODELS.forEach(m => {{
        const tr = document.createElement('tr');
        const fkCount = m.columns.filter(c => c.isFk).length;
        tr.innerHTML = `
          <td style="font-weight: 700; color: ${{m.color}}">${{m.id}}</td>
          <td style="font-family: 'JetBrains Mono', monospace;">${{m.table}}</td>
          <td>${{m.schema}}</td>
          <td>${{m.domain}}</td>
          <td>${{m.columns.length}} fields</td>
          <td>${{fkCount}} FKs</td>
        `;
        tbody.appendChild(tr);
      }});
    }}

    function handleSearch(query) {{
      if (!query) {{
        document.querySelectorAll('.node-group').forEach(n => n.style.opacity = '1');
        return;
      }}
      const q = query.toLowerCase();
      MODELS.forEach(m => {{
        const match = m.id.toLowerCase().includes(q) || 
                      m.table.toLowerCase().includes(q) || 
                      m.columns.some(c => c.name.toLowerCase().includes(q));
        const group = document.getElementById(`node-${{m.id}}`);
        if (group) {{
          group.style.opacity = match ? '1' : '0.12';
        }}
      }});
    }}

    window.onload = initGraph;
  </script>
</body>
</html>
"""

with open("/Users/mac/rezzidentEcosystem/models_interactive_flowchart.html", "w") as f:
    f.write(html_content)

print("Successfully generated detailed & interactive /Users/mac/rezzidentEcosystem/models_interactive_flowchart.html")

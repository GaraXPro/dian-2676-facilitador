// ============================================================================
// LÓGICA PRINCIPAL DE LA PLATAFORMA TODO-EN-UNO DIAN 2676 (FACILITADOR I)
// ============================================================================

(function () {
  const STORAGE_KEYS = {
    PROGRESS: "dian2676_progress",
    MICRO_STEPS: "dian2676_micro_steps",
    CHECKED_RESOURCES: "dian2676_checked_resources",
    LAST_POSITION: "dian2676_last_position",
    ACTIVE_MAIN_TAB: "dian2676_active_main_tab",
    DAILY_PACE: "dian2676_daily_pace",
    READER_THEME: "dian2676_reader_theme",
    READER_FONT_STEP: "dian2676_reader_font_step",
    SIDEBAR_COLLAPSED: "dian2676_sidebar_collapsed",
    EXPANDED_MODULES: "dian2676_expanded_modules",
    CURRENT_FOCUS: "dian2676_current_focus",
    NOTES_GLOBAL: "dian2676_notes",
    NOTES_BY_IND: "dian2676_ind_notes",
    PJS_ANSWERS: "dian2676_pjs_answers",
    CUSTOM_CASES: "dian2676_custom_cases",
    AUTO_ANSWERS: "dian2676_auto_answers",
    AUTO_ATTEMPTS: "dian2676_auto_attempts",
    AUTO_SHUFFLED_ORDER: "dian2676_auto_shuffled_order",
    SOUND_ENABLED: "dian2676_sound_enabled",
    LOW_GPU_MODE: "dian2676_low_gpu",
    UNLOCKED_ACH: "dian2676_unlocked_ach",
    ZERO_INIT_DONE: "dian2676_zero_init_v3",
    MICRO_INIT_V4: "dian2676_micro_init_v4",
    MICRO_INIT_V5: "dian2676_micro_init_v5"
  };

  if (!localStorage.getItem(STORAGE_KEYS.ZERO_INIT_DONE)) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, "{}");
    localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, "ind1");
    localStorage.setItem(STORAGE_KEYS.ZERO_INIT_DONE, "true");
  }

  let progressState = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || "{}");
  let microStepsState = JSON.parse(localStorage.getItem(STORAGE_KEYS.MICRO_STEPS) || "{}");
  let checkedResources = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKED_RESOURCES) || "{}");
  let currentFocusId = localStorage.getItem(STORAGE_KEYS.CURRENT_FOCUS) || "ind1";
  let lastPosition = JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_POSITION) || "null") || {
    indId: currentFocusId,
    subtab: "cases"
  };
  let indNotesState = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES_BY_IND) || "{}");
  let pjsAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PJS_ANSWERS) || "{}");
  let customCases = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_CASES) || "[]");
  let autoAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTO_ANSWERS) || "{}");
  let autoAttempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTO_ATTEMPTS) || "[]");
  let autoShuffledOrder = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTO_SHUFFLED_ORDER) || "null");
  let soundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== "false";
  let lowGpuMode = localStorage.getItem(STORAGE_KEYS.LOW_GPU_MODE) === "true";
  let unlockedAch = JSON.parse(localStorage.getItem(STORAGE_KEYS.UNLOCKED_ACH) || "[]");

  let readerTheme = localStorage.getItem(STORAGE_KEYS.READER_THEME) || "sepia";
  let readerFontStep = parseInt(localStorage.getItem(STORAGE_KEYS.READER_FONT_STEP) || "0", 10);
  let sidebarCollapsed = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === "true";
  let sidebarMode = "outline"; // "outline" | "resources"
  let immersiveMode = false;
  let expandedModules = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPANDED_MODULES) || '{"bloque1":true,"bloque2":true,"bloque3":false,"bloque4":false}');

  const todayISO = new Date().toISOString().slice(0, 10);
  let dailyPace = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_PACE) || "null") || {
    modeId: "fluido",
    dateISO: todayISO,
    stepsDoneToday: 2
  };
  if (dailyPace.dateISO !== todayISO) {
    dailyPace.dateISO = todayISO;
    dailyPace.stepsDoneToday = 0;
    localStorage.setItem(STORAGE_KEYS.DAILY_PACE, JSON.stringify(dailyPace));
  }

  // Inicialización del modelo secuencial de 5 pasos (X.1 a X.5) respetando el avance real de Marcelino en el Indicador #1:
  // Ya leyó la teoría (1.1 read: true) y ya copió la Página 1 en su libreta (1.2 notebook: true).
  if (!localStorage.getItem(STORAGE_KEYS.MICRO_INIT_V5)) {
    const prevInd1 = microStepsState["ind1"] || {};
    microStepsState["ind1"] = {
      read: prevInd1.read !== undefined ? !!prevInd1.read : true,
      notebook: prevInd1.notebook !== undefined ? !!prevInd1.notebook : true,
      practice: !!prevInd1.practice,
      resources: !!prevInd1.resources,
      cases: !!prevInd1.cases
    };
    window.INDICATORS_DATA?.forEach(ind => {
      if (progressState[ind.id]) {
        microStepsState[ind.id] = { read: true, notebook: true, practice: true, resources: true, cases: true };
      } else if (microStepsState[ind.id]) {
        const s = microStepsState[ind.id];
        microStepsState[ind.id] = {
          read: !!s.read,
          notebook: !!s.notebook,
          practice: !!s.practice,
          resources: !!s.resources,
          cases: !!s.cases
        };
      }
    });
    localStorage.setItem(STORAGE_KEYS.MICRO_STEPS, JSON.stringify(microStepsState));
    localStorage.setItem(STORAGE_KEYS.MICRO_INIT_V5, "true");
  }

  let activeIndicatorId = lastPosition.indId || currentFocusId || "ind1";
  let activeLessonSubtab = lastPosition.subtab || "all";
  let currentStudyFilter = "all";
  let sidebarSearchQuery = "";
  let currentPjsFilter = "all";
  let activeCasesList = [];
  let currentApaMode = "progress";

  function getAllCases() {
    return [...window.PJS_CASES, ...customCases];
  }

  function getIndAutoinformeItems(indId) {
    return (window.AUTOINFORME_ITEMS || []).filter(item => (item.indicatorIds || []).includes(indId));
  }

  function getIndFlashcards(indId) {
    return (window.FLASHCARDS_DATA || []).filter(fc => (fc.indicatorIds || []).includes(indId));
  }

  function getCourseStepDefs(ind) {
    const pjsCount = getAllCases().filter(c => c.indicatorId === ind.id).length;
    const autoCount = getIndAutoinformeItems(ind.id).length;
    const fcCount = getIndFlashcards(ind.id).length;
    const resCount = (ind.links || []).length;
    const hasExtraLab = ind.id === "ind10" || ind.id === "ind11" || ind.id === "ind21" || ind.id === "ind22";

    return [
      {
        key: "read",
        subtab: "theory",
        code: `${ind.num}.1`,
        icon: "📖",
        shortTitle: "Lectura Teórica y Trampas",
        fullTitle: `${ind.num}.1 📖 Lectura Teórica y Trampas CNSC`,
        btnText: `📖 ${ind.num}.1 Lectura Teórica`
      },
      {
        key: "notebook",
        subtab: "notebook",
        code: `${ind.num}.2`,
        icon: "📓",
        shortTitle: `Mapa en Libreta (Pág. #${ind.num})`,
        fullTitle: `${ind.num}.2 📓 Mapa en Libreta Cuadriculada (Pág. #${ind.num})`,
        btnText: `📓 ${ind.num}.2 Libreta Pág. #${ind.num}`
      },
      {
        key: "practice",
        subtab: "practice",
        code: `${ind.num}.3`,
        icon: "🛠️",
        shortTitle: hasExtraLab ? `Laboratorio + Flashcards (${fcCount})` : `Práctica Flashcards (${fcCount})`,
        fullTitle: `${ind.num}.3 🛠️ Práctica y Laboratorio del Tema (${fcCount} Flashcards${hasExtraLab ? " + Taller" : ""})`,
        btnText: `🛠️ ${ind.num}.3 Práctica del Tema`
      },
      {
        key: "resources",
        subtab: "resources",
        code: `${ind.num}.4`,
        icon: "🔗",
        shortTitle: `Recursos Oficiales (${resCount})`,
        fullTitle: `${ind.num}.4 🔗 Recursos Oficiales Verificados (${resCount} enlaces)`,
        btnText: `🔗 ${ind.num}.4 Recursos Oficiales`
      },
      {
        key: "cases",
        subtab: "cases",
        code: `${ind.num}.5`,
        icon: "⚖️",
        shortTitle: `Cuestionario (${pjsCount} PJS${autoCount > 0 ? ` + ${autoCount} Auto` : ""})`,
        fullTitle: `${ind.num}.5 ⚖️ Cuestionario de Sección (${pjsCount} Casos PJS${autoCount > 0 ? ` + ${autoCount} Autoinforme` : ""})`,
        btnText: `⚖️ ${ind.num}.5 Simulador (${pjsCount + autoCount})`
      }
    ];
  }

  function getIndSteps(indId) {
    if (progressState[indId]) {
      return { read: true, notebook: true, practice: true, resources: true, cases: true };
    }
    const st = microStepsState[indId] || {};
    return {
      read: !!st.read,
      notebook: !!st.notebook,
      practice: !!st.practice,
      resources: !!st.resources,
      cases: !!st.cases
    };
  }

  function getIndDoneStepsCount(indId) {
    const st = getIndSteps(indId);
    return (st.read ? 1 : 0) + (st.notebook ? 1 : 0) + (st.practice ? 1 : 0) + (st.resources ? 1 : 0) + (st.cases ? 1 : 0);
  }

  function getTotalMicroStepsDone() {
    return window.INDICATORS_DATA.reduce((acc, ind) => acc + getIndDoneStepsCount(ind.id), 0);
  }

  function getNextMicroStepInfo(indId) {
    const ind = window.INDICATORS_DATA.find(i => i.id === indId) || window.INDICATORS_DATA[0];
    const st = getIndSteps(ind.id);
    const defs = getCourseStepDefs(ind);
    for (const d of defs) {
      if (!st[d.key]) {
        return { key: d.key, code: d.code, label: d.fullTitle, shortTitle: d.shortTitle, subtab: d.subtab, btnText: d.btnText };
      }
    }
    return { key: "done", code: `${ind.num}.5`, label: "¡Tema 100% completado (5/5 pasos)!", shortTitle: "Completado", subtab: "all", btnText: "✅ Repasar Tema" };
  }

  function saveLastPosition(indId, subtab) {
    lastPosition = {
      indId: indId || activeIndicatorId || currentFocusId || "ind1",
      subtab: subtab || activeLessonSubtab || "all",
      savedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.LAST_POSITION, JSON.stringify(lastPosition));
    updateHeaderCourseBar();
  }

  function updateHeaderCourseBar() {
    const totalSteps = window.INDICATORS_DATA.length * 5;
    const doneSteps = getTotalMicroStepsDone();
    const pct = Math.round((doneSteps / totalSteps) * 100);

    const pctLbl = document.getElementById("header-course-pct-label");
    const pctFill = document.getElementById("header-course-pct-fill");
    const stepLbl = document.getElementById("header-course-step-label");
    const resTitle = document.getElementById("header-resume-title");
    const resSub = document.getElementById("header-resume-sub");

    if (pctLbl) pctLbl.textContent = `Progreso del Curso: ${pct}% (${doneSteps}/${totalSteps} pasos)`;
    if (pctFill) pctFill.style.width = `${Math.max(pct, doneSteps > 0 ? 3 : 0)}%`;

    const targetIndId = (lastPosition && lastPosition.indId) || currentFocusId || "ind1";
    const ind = window.INDICATORS_DATA.find(i => i.id === targetIndId) || window.INDICATORS_DATA[0];
    const nextStep = getNextMicroStepInfo(ind.id);
    const defs = getCourseStepDefs(ind);
    const savedDef = defs.find(d => d.subtab === (lastPosition && lastPosition.subtab)) || defs.find(d => d.key === nextStep.key) || defs[0];

    if (stepLbl) {
      stepLbl.textContent = `Ubicación guardada: ${savedDef.code} (${ getIndDoneStepsCount(ind.id) }/5 en Tema #${ind.num})`;
    }
    if (resTitle) {
      resTitle.textContent = `Reanudar en ${savedDef.code}: ${savedDef.shortTitle}`;
    }
    if (resSub) {
      const cleanName = ind.name.replace(/^\d+\.\s*/, "");
      resSub.textContent = `Tema #${ind.num}: ${cleanName}`;
    }
  }

  window.resumeLearning = function () {
    const targetIndId = (lastPosition && lastPosition.indId) || currentFocusId || "ind1";
    const ind = window.INDICATORS_DATA.find(i => i.id === targetIndId) || window.INDICATORS_DATA[0];
    const nextStep = getNextMicroStepInfo(ind.id);
    const targetSubtab = (lastPosition && lastPosition.subtab && lastPosition.subtab !== "all")
      ? lastPosition.subtab
      : nextStep.subtab;

    activeIndicatorId = ind.id;
    currentFocusId = ind.id;
    activeLessonSubtab = targetSubtab;
    localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, ind.id);
    saveLastPosition(ind.id, targetSubtab);

    renderDashboard();
    renderStudySidebar();
    renderStudyDetail();
    window.switchTab("study");

    const defs = getCourseStepDefs(ind);
    const stepDef = defs.find(d => d.subtab === targetSubtab);
    window.playSoundEffect("start");
    window.showToast(`▶️ <strong>Reanudando aprendizaje:</strong><br>${stepDef ? stepDef.fullTitle : ind.name}`);
  };

  window.switchSidebarMode = function (mode) {
    sidebarMode = mode === "resources" ? "resources" : "outline";
    const btnOut = document.getElementById("btn-sbar-outline");
    const btnRes = document.getElementById("btn-sbar-resources");
    const ctrlBox = document.getElementById("sidebar-outline-controls");
    if (btnOut) btnOut.classList.toggle("active", sidebarMode === "outline");
    if (btnRes) btnRes.classList.toggle("active", sidebarMode === "resources");
    if (ctrlBox) ctrlBox.style.display = sidebarMode === "outline" ? "block" : "none";
    renderStudySidebar();
  };

  window.toggleResourceChecked = function (indId, resIdx, checked) {
    const key = `${indId}_${resIdx}`;
    checkedResources[key] = !!checked;
    localStorage.setItem(STORAGE_KEYS.CHECKED_RESOURCES, JSON.stringify(checkedResources));

    const ind = window.INDICATORS_DATA.find(i => i.id === indId);
    if (ind && ind.links && ind.links.length > 0) {
      const allLinksDone = ind.links.every((_, idx) => !!checkedResources[`${indId}_${idx}`]);
      const st = getIndSteps(indId);
      if (allLinksDone && !st.resources) {
        window.toggleMicroStep(indId, "resources", true);
        return;
      } else if (checked) {
        window.playSoundEffect("correct");
        const doneLinks = ind.links.filter((_, idx) => !!checkedResources[`${indId}_${idx}`]).length;
        window.showToast(`🔗 Recurso marcado como visto (${doneLinks}/${ind.links.length} en el Tema #${ind.num}).`);
      }
    }

    renderStudySidebar();
    renderStudyDetail();
    renderDashboard();
  };

  // --------------------------------------------------------------------------
  // 0.1 MODO DESCANSO VISUAL GLOBAL (OSCURO, SEPIA, WORD) Y CONCENTRACIÓN
  // --------------------------------------------------------------------------
  function applyReaderVisualSettings() {
    document.body.setAttribute("data-reader-theme", readerTheme);
    document.body.setAttribute("data-reader-font", String(readerFontStep));
    document.body.classList.toggle("immersive-focus", immersiveMode);

    const floatBar = document.getElementById("immersive-floating-bar");
    if (floatBar) {
      floatBar.style.display = immersiveMode ? "block" : "none";
    }

    const immBtn = document.getElementById("btn-immersive-toggle");
    if (immBtn) {
      immBtn.textContent = immersiveMode ? "🧘 Salir Concentración" : "🧘 Concentración";
      immBtn.style.borderColor = immersiveMode ? "var(--accent)" : "";
      immBtn.style.color = immersiveMode ? "var(--accent)" : "";
    }

    const gridEl = document.getElementById("course-player-grid");
    if (gridEl) {
      gridEl.classList.toggle("sidebar-collapsed", sidebarCollapsed);
    }

    document.querySelectorAll(".reader-theme-btn").forEach(btn => {
      const t = btn.getAttribute("data-rtheme");
      btn.classList.toggle("active", t === readerTheme);
    });
  }

  window.setReaderTheme = function (theme) {
    readerTheme = theme;
    localStorage.setItem(STORAGE_KEYS.READER_THEME, readerTheme);
    applyReaderVisualSettings();
    const names = {
      dark: "🌙 Papel Oscuro (Descanso Nocturno en toda la web)",
      sepia: "📜 Sepia Cálido (Antifatiga Visual en toda la web)",
      word: "📄 Hoja Word Clásica (Papel Claro en toda la web)"
    };
    window.showToast(`🎨 Tonalidad global aplicada: <strong>${names[theme] || theme}</strong>`);
  };

  window.changeReaderFontSize = function (delta) {
    if (delta === 0) {
      readerFontStep = 0;
    } else {
      readerFontStep = Math.max(-1, Math.min(2, readerFontStep + delta));
    }
    localStorage.setItem(STORAGE_KEYS.READER_FONT_STEP, String(readerFontStep));
    applyReaderVisualSettings();
  };

  window.toggleImmersiveMode = function () {
    immersiveMode = !immersiveMode;
    if (immersiveMode) {
      window.showToast("🧘 <strong>Modo Concentración Total activado.</strong> Sin distracciones en toda la web (Presiona ESC o el botón superior para salir).");
    } else {
      window.showToast("✨ Barra superior restaurada.");
    }
    applyReaderVisualSettings();
  };

  window.toggleCourseSidebar = function () {
    sidebarCollapsed = !sidebarCollapsed;
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(sidebarCollapsed));
    applyReaderVisualSettings();
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && immersiveMode) {
      window.toggleImmersiveMode();
    }
  });

  // --------------------------------------------------------------------------
  // 0. MOTOR DE SONIDOS, ALARMAS Y NOTIFICACIONES (WEB AUDIO API)
  // --------------------------------------------------------------------------
  let sharedAudioCtx = null;
  function getAudioCtx() {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  }

  window.toggleMusicDrawer = function () {
    const drawer = document.getElementById("music-compact-drawer");
    const btn = document.getElementById("btn-music-drawer");
    if (!drawer) return;
    const isHidden = drawer.style.display === "none";
    drawer.style.display = isHidden ? "block" : "none";
    if (btn) {
      btn.style.borderColor = isHidden ? "var(--accent)" : "";
      btn.style.color = isHidden ? "var(--accent)" : "";
    }
  };

  window.playSoundEffect = function (type, forcePlay) {
    if (!soundEnabled && !forcePlay) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      const playTone = (freq, startOffset, duration, wave = "sine", vol = 0.16) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, now + startOffset);
        gain.gain.setValueAtTime(vol, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration);
      };

      if (type === "start") {
        playTone(440, 0, 0.15, "sine", 0.14);
        playTone(554.37, 0.14, 0.15, "sine", 0.14);
        playTone(659.25, 0.28, 0.28, "sine", 0.16);
      } else if (type === "correct") {
        playTone(587.33, 0, 0.12, "triangle", 0.16);
        playTone(880, 0.11, 0.25, "triangle", 0.18);
      } else if (type === "wrong") {
        playTone(260, 0, 0.18, "sawtooth", 0.1);
        playTone(195, 0.16, 0.25, "sawtooth", 0.1);
      } else if (type === "achievement") {
        playTone(523.25, 0, 0.13, "triangle", 0.18);
        playTone(659.25, 0.12, 0.13, "triangle", 0.18);
        playTone(783.99, 0.24, 0.13, "triangle", 0.18);
        playTone(1046.5, 0.36, 0.42, "triangle", 0.22);
      } else if (type === "alarm") {
        playTone(880, 0, 0.2, "square", 0.14);
        playTone(659.25, 0.22, 0.2, "square", 0.14);
        playTone(880, 0.44, 0.2, "square", 0.14);
        playTone(1046.5, 0.68, 0.45, "square", 0.18);
      }
    } catch (_) {}
  };

  window.showToast = function (message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const div = document.createElement("div");
    div.className = "toast-msg";
    div.innerHTML = message;
    container.appendChild(div);
    setTimeout(() => {
      div.remove();
    }, 4800);
  };

  window.toggleSoundEnabled = function () {
    soundEnabled = !soundEnabled;
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(soundEnabled));
    updateHeaderToggles();
    if (soundEnabled) {
      window.playSoundEffect("start", true);
      window.showToast("🔊 Sonidos y alarmas de progreso activados.");
    }
  };

  window.toggleLowGpuMode = function () {
    lowGpuMode = !lowGpuMode;
    localStorage.setItem(STORAGE_KEYS.LOW_GPU_MODE, String(lowGpuMode));
    document.body.classList.toggle("low-gpu", lowGpuMode);
    updateHeaderToggles();
    window.showToast(lowGpuMode
      ? "⚡ Modo Fluido activado (sin animaciones pesadas para el monitor de 27\")."
      : "✨ Efectos visuales estándar restaurados.");
  };

  function updateHeaderToggles() {
    const soundBtn = document.getElementById("btn-toggle-sound");
    if (soundBtn) {
      soundBtn.textContent = soundEnabled ? "🔊 ON" : "🔇 OFF";
    }
    const gpuBtn = document.getElementById("btn-toggle-gpu");
    if (gpuBtn) {
      gpuBtn.textContent = lowGpuMode ? "⚡ 27\": ON" : "🖥️ 27\"";
    }
  }

  // --------------------------------------------------------------------------
  // 1. NAVEGACIÓN DE PESTAÑAS Y BUSCADOR GLOBAL
  // --------------------------------------------------------------------------
  window.switchTab = function (tabId) {
    document.querySelectorAll(".tab-panel").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".nav-tab").forEach(el => el.classList.remove("active"));
    const targetPanel = document.getElementById("tab-" + tabId);
    const targetBtn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (targetPanel) targetPanel.classList.add("active");
    if (targetBtn) {
      targetBtn.classList.add("active");
      try {
        targetBtn.scrollIntoView({ behavior: lowGpuMode ? "auto" : "smooth", inline: "center", block: "nearest" });
      } catch (_) {}
    }
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MAIN_TAB, tabId);
    if (tabId === "apa") renderApaView();
    window.scrollTo({ top: 0, behavior: lowGpuMode ? "auto" : "smooth" });
  };

  window.setCurrentFocusIndicator = function (indId, openStudyNow) {
    currentFocusId = indId;
    activeIndicatorId = indId;
    localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, indId);
    saveLastPosition(indId, activeLessonSubtab);
    renderDashboard();
    renderStudySidebar();
    renderStudyDetail();
    const indObj = window.INDICATORS_DATA.find(i => i.id === indId);
    if (indObj && !openStudyNow) {
      window.showToast(`📍 Marcado como tu punto actual: <strong>${indObj.name}</strong>`);
    }
    if (openStudyNow) {
      window.switchTab("study");
      if (window.innerWidth <= 1100) {
        setTimeout(() => {
          const detailEl = document.getElementById("study-detail-view");
          if (detailEl) detailEl.scrollIntoView({ behavior: lowGpuMode ? "auto" : "smooth", block: "start" });
        }, 80);
      }
    }
  };

  window.openIndicatorStudy = function (indId) {
    const nextStep = getNextMicroStepInfo(indId);
    activeLessonSubtab = nextStep.subtab || "theory";
    window.setCurrentFocusIndicator(indId, true);
  };

  window.openIndicatorCases = function (indId) {
    currentFocusId = indId;
    localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, indId);
    currentPjsFilter = indId;
    const selectEl = document.getElementById("pjs-filter-select");
    if (selectEl) selectEl.value = indId;
    renderDashboard();
    renderPjsSimulator();
    window.switchTab("pjs");
  };

  function setupGlobalSearch() {
    const input = document.getElementById("global-search-input");
    const box = document.getElementById("global-search-results");
    if (!input || !box) return;

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        box.classList.remove("active");
        box.innerHTML = "";
        return;
      }

      const hits = [];
      window.INDICATORS_DATA.forEach(ind => {
        const plain = (ind.name + " " + ind.normaBase + " " + (ind.quickSummary || "") + " " + ind.step1 + " " + ind.step2 + " " + ind.step3)
          .replace(/<[^>]+>/g, " ");
        if (plain.toLowerCase().includes(q)) {
          hits.push({
            type: "Indicador",
            title: ind.name,
            snippet: ind.quickSummary || ind.normaBase,
            action: () => {
              box.classList.remove("active");
              input.value = "";
              window.openIndicatorStudy(ind.id);
            }
          });
        }
      });

      getAllCases().forEach(c => {
        const plain = `${c.title} ${c.context} ${c.stem} ${c.explanation.correctWhy}`;
        if (plain.toLowerCase().includes(q)) {
          hits.push({
            type: "Caso PJS",
            title: c.title,
            snippet: c.context.slice(0, 95) + "...",
            action: () => {
              box.classList.remove("active");
              input.value = "";
              window.openLessonSubtab(c.indicatorId, "cases");
            }
          });
        }
      });

      if (hits.length === 0) {
        box.innerHTML = `<div class="search-hit"><div class="search-hit-snippet">Sin resultados para "${input.value}"</div></div>`;
      } else {
        box.innerHTML = "";
        hits.slice(0, 10).forEach(hit => {
          const item = document.createElement("div");
          item.className = "search-hit";
          item.innerHTML = `
            <div class="search-hit-title">[${hit.type}] ${hit.title}</div>
            <div class="search-hit-snippet">${hit.snippet}</div>
          `;
          item.addEventListener("click", hit.action);
          box.appendChild(item);
        });
      }
      box.classList.add("active");
    });

    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !box.contains(e.target)) {
        box.classList.remove("active");
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. CUENTA REGRESIVA Y RELOJ POMODORO CON ALARMAS
  // --------------------------------------------------------------------------
  function updateCountdown() {
    const examDate = new Date(window.DIAN_PROFILE.fechaExamenISO).getTime();
    const now = Date.now();
    const diff = examDate - now;
    const el = document.getElementById("countdown-timer");
    if (!el) return;

    if (diff <= 0) {
      el.textContent = "¡Día del Examen DIAN!";
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    el.textContent = `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  }

  let timerInterval = null;
  let remainingSeconds = 45 * 60;
  let isPaused = false;

  function updateTimerDisplay() {
    const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
    const secs = String(remainingSeconds % 60).padStart(2, "0");
    const el = document.getElementById("timer-display");
    if (el) el.textContent = `${mins}:${secs}`;
  }

  window.startTimer = function (minutes, labelText) {
    clearInterval(timerInterval);
    isPaused = false;
    remainingSeconds = minutes * 60;
    const lbl = document.getElementById("timer-mode-label");
    if (lbl && labelText) lbl.textContent = labelText;
    updateTimerDisplay();
    window.playSoundEffect("start");
    window.showToast(`⏱️ Iniciado: <strong>${labelText || minutes + " min"}</strong>`);

    timerInterval = setInterval(() => {
      if (!isPaused) {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          window.playSoundEffect("alarm");
          const lblDone = document.getElementById("timer-mode-label");
          if (lblDone) lblDone.textContent = "✅ ¡Bloque completado! Descansa la vista e hidrátate.";
          window.showToast("⏰ <strong>¡Tiempo cumplido!</strong> Hidrátate, parpadea y estira las piernas.");
        }
      }
    }, 1000);
  };

  window.togglePauseTimer = function () {
    isPaused = !isPaused;
    const btn = document.getElementById("btn-pause-timer");
    if (btn) btn.textContent = isPaused ? "▶️ Reanudar" : "⏸️ Pausar";
  };

  window.resetTimer = function () {
    clearInterval(timerInterval);
    isPaused = false;
    remainingSeconds = 45 * 60;
    const lbl = document.getElementById("timer-mode-label");
    if (lbl) lbl.textContent = "Bloque de Enfoque Intenso (45 min)";
    const btn = document.getElementById("btn-pause-timer");
    if (btn) btn.textContent = "⏸️ Pausar";
    updateTimerDisplay();
  };

  // --------------------------------------------------------------------------
  // 3. SISTEMA LMS SECUENCIAL A TU PROPIO RITMO (CISCO NETACAD + COURSERA)
  // --------------------------------------------------------------------------
  window.toggleMicroStep = function (indId, stepKey, checked) {
    if (!microStepsState[indId]) {
      microStepsState[indId] = getIndSteps(indId);
    }
    const prevVal = !!microStepsState[indId][stepKey];
    microStepsState[indId][stepKey] = checked;

    if (checked && !prevVal) {
      dailyPace.stepsDoneToday = (dailyPace.stepsDoneToday || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.DAILY_PACE, JSON.stringify(dailyPace));
      window.playSoundEffect("correct");
    }

    const st = microStepsState[indId];
    const allFiveDone = !!(st.read && st.notebook && st.practice && st.resources && st.cases);
    progressState[indId] = allFiveDone;

    localStorage.setItem(STORAGE_KEYS.MICRO_STEPS, JSON.stringify(microStepsState));
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressState));

    const indObj = window.INDICATORS_DATA.find(i => i.id === indId) || window.INDICATORS_DATA[0];
    const defs = getCourseStepDefs(indObj);
    const stepDef = defs.find(d => d.key === stepKey);

    if (allFiveDone) {
      window.playSoundEffect("achievement");
      const nextPending = window.INDICATORS_DATA.find(i => !progressState[i.id]);
      if (nextPending && currentFocusId === indId) {
        currentFocusId = nextPending.id;
        localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, currentFocusId);
      }
      if (indObj) {
        window.showToast(`🎉 ¡Tema completado al 100 % (5/5 pasos)!<br><strong>${indObj.name}</strong>`);
      }
    } else if (checked && stepDef) {
      window.showToast(`✅ Marcado como completo: <strong>${stepDef.fullTitle}</strong>`);
    }

    updateHeaderCourseBar();
    renderDashboard();
    renderStudySidebar();
    renderStudyDetail();
  };

  window.toggleIndicatorDone = function (indId, checked) {
    progressState[indId] = checked;
    microStepsState[indId] = {
      read: checked,
      notebook: checked,
      practice: checked,
      resources: checked,
      cases: checked
    };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressState));
    localStorage.setItem(STORAGE_KEYS.MICRO_STEPS, JSON.stringify(microStepsState));

    if (checked) {
      dailyPace.stepsDoneToday = (dailyPace.stepsDoneToday || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.DAILY_PACE, JSON.stringify(dailyPace));
      window.playSoundEffect("achievement");
      const nextPending = window.INDICATORS_DATA.find(i => !progressState[i.id]);
      if (nextPending && currentFocusId === indId) {
        currentFocusId = nextPending.id;
        localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, currentFocusId);
      }
      const indObj = window.INDICATORS_DATA.find(i => i.id === indId);
      if (indObj) {
        window.showToast(`✅ ¡Dominado al 100 % (5/5 pasos)! <strong>${indObj.name}</strong>`);
      }
    }

    updateHeaderCourseBar();
    renderDashboard();
    renderStudySidebar();
    renderStudyDetail();
  };

  window.setDailyPaceMode = function (modeId) {
    dailyPace.modeId = modeId;
    localStorage.setItem(STORAGE_KEYS.DAILY_PACE, JSON.stringify(dailyPace));
    renderDashboard();
    const modeObj = (window.DIAN_PROFILE.modosRitmoDiario || []).find(m => m.id === modeId);
    if (modeObj) {
      window.showToast(`${modeObj.icono} Ritmo ajustado a: <strong>${modeObj.nombre}</strong>`);
    }
  };

  window.toggleCourseModuleAccordion = function (blockId) {
    expandedModules[blockId] = !expandedModules[blockId];
    localStorage.setItem(STORAGE_KEYS.EXPANDED_MODULES, JSON.stringify(expandedModules));
    renderDashboard();
  };

  window.expandAllCourseModules = function (expand) {
    expandedModules = { bloque1: expand, bloque2: expand, bloque3: expand, bloque4: expand };
    localStorage.setItem(STORAGE_KEYS.EXPANDED_MODULES, JSON.stringify(expandedModules));
    renderDashboard();
  };

  window.openLessonSubtab = function (indId, subtab) {
    activeLessonSubtab = subtab || "all";
    saveLastPosition(indId, activeLessonSubtab);
    window.setCurrentFocusIndicator(indId, true);
  };

  window.goToNextCourseStep = function () {
    const ind = window.INDICATORS_DATA.find(i => i.id === activeIndicatorId) || window.INDICATORS_DATA[0];
    const st = getIndSteps(ind.id);
    const defs = getCourseStepDefs(ind);

    // Si está en una sub-pestaña específica (ej. 1.1 theory), marca ese paso y pasa al siguiente en orden (1.2 -> 1.3 -> 1.4 -> 1.5)
    const activeDefIdx = defs.findIndex(d => d.subtab === activeLessonSubtab);
    if (activeDefIdx !== -1) {
      const currDef = defs[activeDefIdx];
      if (!st[currDef.key]) {
        window.toggleMicroStep(ind.id, currDef.key, true);
      }
      if (activeDefIdx + 1 < defs.length) {
        activeLessonSubtab = defs[activeDefIdx + 1].subtab;
        saveLastPosition(ind.id, activeLessonSubtab);
        renderStudySidebar();
        renderStudyDetail();
        window.scrollTo({ top: 0, behavior: lowGpuMode ? "auto" : "smooth" });
        return;
      }
    } else {
      // Si está en vista completa ("all"), busca el primer paso pendiente del indicador
      for (let i = 0; i < defs.length; i++) {
        if (!st[defs[i].key]) {
          window.toggleMicroStep(ind.id, defs[i].key, true);
          if (i + 1 < defs.length) {
            activeLessonSubtab = defs[i + 1].subtab;
            saveLastPosition(ind.id, activeLessonSubtab);
            renderStudySidebar();
            renderStudyDetail();
            window.scrollTo({ top: 0, behavior: lowGpuMode ? "auto" : "smooth" });
            return;
          }
          break;
        }
      }
    }

    // Si ya completó los 5 pasos de este indicador, avanza al paso X.1 del siguiente indicador
    const idx = window.INDICATORS_DATA.findIndex(i => i.id === ind.id);
    const nextInd = window.INDICATORS_DATA[idx + 1] || window.INDICATORS_DATA.find(i => !progressState[i.id]);
    if (nextInd) {
      activeLessonSubtab = "theory";
      saveLastPosition(nextInd.id, "theory");
      window.setCurrentFocusIndicator(nextInd.id, true);
    }
  };

  window.startFromZeroInd1 = function () {
    progressState = {};
    microStepsState = { ind1: { read: false, notebook: false, practice: false, resources: false, cases: false } };
    currentFocusId = "ind1";
    activeIndicatorId = "ind1";
    activeLessonSubtab = "theory";
    localStorage.setItem(STORAGE_KEYS.PROGRESS, "{}");
    localStorage.setItem(STORAGE_KEYS.MICRO_STEPS, JSON.stringify(microStepsState));
    localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, "ind1");
    saveLastPosition("ind1", "theory");
    renderDashboard();
    renderStudySidebar();
    renderStudyDetail();
    window.playSoundEffect("start");
    window.showToast("🔄 ¡Listo Marcelino! Punto de partida fijado en el <strong>Paso 1.1 (Misionalidad DIAN)</strong>.");
  };

  function renderContinuityCompass() {
    const compassEl = document.getElementById("continuity-compass-container");
    if (!compassEl) return;

    const focusInd = window.INDICATORS_DATA.find(i => i.id === currentFocusId) || window.INDICATORS_DATA[0];
    const focusIdx = window.INDICATORS_DATA.findIndex(i => i.id === focusInd.id);
    const nextPending = window.INDICATORS_DATA.find((i, idx) => idx > focusIdx && !progressState[i.id])
      || window.INDICATORS_DATA.find(i => !progressState[i.id]);

    const st = getIndSteps(focusInd.id);
    const doneSteps = getIndDoneStepsCount(focusInd.id);
    const indPct = Math.round((doneSteps / 5) * 100);
    const nextStepInfo = getNextMicroStepInfo(focusInd.id);
    const defs = getCourseStepDefs(focusInd);

    compassEl.innerHTML = `
      <div class="compass-info">
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:8px;">
          <span class="pill warning">📍 TU RUTA SECUENCIAL ACTUAL (${window.DIAN_PROFILE.nombreAspirante})</span>
          <span class="pill ${doneSteps === 5 ? "success" : "accent"}">Avance en este tema: ${doneSteps} / 5 pasos (${indPct}%)</span>
        </div>
        <h2 style="font-size:1.2rem; color:var(--text); margin-bottom:6px;">${focusInd.name}</h2>

        <!-- Barra interactiva de los 5 Pasos Secuenciales del Indicador en Foco (Cisco NetAcad + Coursera) -->
        <div class="micro-steps-strip" style="margin:8px 0 10px;">
          ${defs.map(d => `
            <label class="micro-step-chip ${st[d.key] ? "done" : (nextStepInfo.key === d.key ? "current" : "")}">
              <input type="checkbox" ${st[d.key] ? "checked" : ""} onchange="window.toggleMicroStep('${focusInd.id}', '${d.key}', this.checked)" />
              <span onclick="event.preventDefault(); window.openLessonSubtab('${focusInd.id}', '${d.subtab}')">${d.code} ${d.icon} ${d.shortTitle} ${st[d.key] ? "✅" : ""}</span>
            </label>
          `).join("")}
        </div>

        <div style="font-size:0.85rem; color:var(--accent);">
          🎯 <strong>Tu siguiente paso en orden:</strong> <span style="color:var(--text); font-weight:600;">${nextStepInfo.label}</span>
          ${nextPending ? `<span style="color:var(--muted); margin-left:8px;">(Después sigue: ${nextPending.name})</span>` : ""}
        </div>
      </div>
      <div class="compass-actions">
        <button class="btn success" onclick="window.openLessonSubtab('${focusInd.id}', '${nextStepInfo.subtab}')">▶️ Continuar: ${nextStepInfo.btnText}</button>
        <button class="btn secondary" onclick="window.openLessonSubtab('${focusInd.id}', 'theory')">📖 ${focusInd.num}.1 Lectura</button>
        <button class="btn secondary" onclick="window.openLessonSubtab('${focusInd.id}', 'notebook')">📓 ${focusInd.num}.2 Libreta</button>
        <button class="btn secondary" onclick="window.openLessonSubtab('${focusInd.id}', 'practice')">🛠️ ${focusInd.num}.3 Práctica</button>
        <button class="btn secondary" onclick="window.openLessonSubtab('${focusInd.id}', 'resources')">🔗 ${focusInd.num}.4 Recursos</button>
        <button class="btn warning" onclick="window.openLessonSubtab('${focusInd.id}', 'cases')">⚖️ ${focusInd.num}.5 Cuestionario</button>
      </div>
    `;
  }

  window.openNotebookMapForIndicator = function (indId) {
    activeLessonSubtab = "notebook";
    saveLastPosition(indId, "notebook");
    window.setCurrentFocusIndicator(indId, true);
  };

  function renderCatchupSprints() {
    const sprintsEl = document.getElementById("catchup-sprints-container");
    if (!sprintsEl) return;

    const now = new Date();
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const fechaDinamica = `${diasSemana[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]} de ${now.getFullYear()}`;

    const examDate = new Date(window.DIAN_PROFILE.fechaExamenISO).getTime();
    const daysLeft = Math.max(0, Math.ceil((examDate - Date.now()) / (1000 * 60 * 60 * 24)));

    const datePill = document.getElementById("dynamic-date-pill");
    if (datePill) {
      datePill.textContent = `📅 Hoy es ${fechaDinamica} • Faltan ${daysLeft} días`;
    }

    const modes = window.DIAN_PROFILE.modosRitmoDiario || [];
    const activeMode = modes.find(m => m.id === dailyPace.modeId) || modes[1] || {
      id: "fluido", icono: "⚡", nombre: "Objetivo Coursera", metaPasos: 3, descripcion: "Avanza a tu ritmo sin presión."
    };

    const doneToday = dailyPace.stepsDoneToday || 0;
    const targetToday = activeMode.metaPasos;
    const goalPct = targetToday > 0 ? Math.min(100, Math.round((doneToday / targetToday) * 100)) : 100;

    const focusInd = window.INDICATORS_DATA.find(i => i.id === currentFocusId) || window.INDICATORS_DATA[0];
    const nextStep = getNextMicroStepInfo(focusInd.id);

    const kpiSlotVal = document.getElementById("kpi-slot-val");
    const kpiSlotSub = document.getElementById("kpi-slot-sub");
    if (kpiSlotVal) {
      kpiSlotVal.textContent = targetToday > 0
        ? `${activeMode.icono} Hoy: ${doneToday} / ${targetToday} pasos (${goalPct}%)`
        : `${activeMode.icono} Modo Repaso Libre (Sin meta fija)`;
    }
    if (kpiSlotSub) {
      kpiSlotSub.textContent = `${activeMode.nombre} — Cero horarios estrictos`;
    }

    sprintsEl.innerHTML = `
      <!-- WIDGET ESTILO COURSERA: OBJETIVO DIARIO FLEXIBLE A TU RITMO -->
      <div class="coursera-goal-box">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
          <div>
            <div style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.04em; color:var(--accent); font-weight:700;">
              🧭 El Objetivo de Hoy (A tu propio ritmo, sin horarios rígidos)
            </div>
            <h3 style="font-size:1.05rem; color:var(--text); margin-top:2px;">
              ${targetToday > 0
                ? (doneToday >= targetToday
                    ? `🎉 ¡Meta de hoy cumplida (${doneToday}/${targetToday} pasos)! Todo lo que hagas extra es ganancia.`
                    : `${activeMode.icono} Llevas <strong>${doneToday} de ${targetToday} pasos</strong> hoy — ¡Te falta(n) ${targetToday - doneToday} para tu meta del día!`)
                : `☕ Hoy estás en Modo Repaso Libre — Estudia o repasa cuando te sientas cómodo`}
            </h3>
            <p style="font-size:0.83rem; color:var(--muted); margin-top:3px;">${activeMode.descripcion}</p>
          </div>
          <button class="btn success" onclick="window.openLessonSubtab('${focusInd.id}', '${nextStep.subtab}')">
            ▶️ Continuar: ${nextStep.btnText}
          </button>
        </div>

        <div class="progress-bar-bg" style="height:14px; margin:6px 0 12px;">
          <div class="progress-bar-fill" style="width:${goalPct}%; line-height:14px; font-size:0.7rem;">${goalPct}%</div>
        </div>

        <div style="font-size:0.78rem; color:var(--muted); margin-bottom:6px; font-weight:600;">
          🎚️ ¿Cómo te sientes de tiempo y energía hoy? Elige tu ritmo con un clic:
        </div>
        <div class="pace-selector-grid">
          ${modes.map(m => `
            <button class="pace-mode-btn ${m.id === activeMode.id ? "active" : ""}" onclick="window.setDailyPaceMode('${m.id}')">
              <div style="font-weight:700; font-size:0.82rem;">${m.icono} ${m.nombre}</div>
              <div style="font-size:0.72rem; color:var(--muted); margin-top:2px;">
                ${m.metaPasos > 0 ? `Meta: ${m.metaPasos} paso(s)` : "Sin meta obligatoria"}
              </div>
            </button>
          `).join("")}
        </div>
      </div>

      <!-- TARJETAS DE LOS 4 MÓDULOS DEL CURSO (ESTILO CISCO NETACAD / UDEMY) -->
      <div style="margin-top:14px;">
        <div style="font-size:0.82rem; color:var(--muted); font-weight:700; margin-bottom:8px; text-transform:uppercase;">
          📊 Panorama General por Módulos del Curso (4 Secciones):
        </div>
        <div class="grid-2" style="gap:10px;">
          ${(window.DIAN_PROFILE.modulosCurso || []).map(mod => {
            const totalSteps = mod.indicadores.length * 5;
            const doneSteps = mod.indicadores.reduce((acc, id) => acc + getIndDoneStepsCount(id), 0);
            const modPct = Math.round((doneSteps / totalSteps) * 100);
            const firstPending = mod.indicadores.find(id => getIndDoneStepsCount(id) < 5) || mod.indicadores[0];
            return `
              <div class="course-module-summary-card">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                  <strong style="font-size:0.86rem; color:var(--text);">Módulo ${mod.num}: ${mod.titulo.replace(/^Módulo \d+:\s*/, "")}</strong>
                  <span class="pill ${modPct === 100 ? "success" : "accent"}" style="font-size:0.72rem;">${modPct}%</span>
                </div>
                <div class="mini-progress-track">
                  <div class="mini-progress-fill" style="width:${modPct}%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--muted); margin-top:4px;">
                  <span>${doneSteps}/${totalSteps} pasos (${mod.indicadores.length} temas)</span>
                  <button class="btn-mini" onclick="window.openIndicatorStudy('${firstPending}')">Ir al Módulo →</button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderAchievements(completedCount, pjsScore, pjsAnsweredCount) {
    const achContainer = document.getElementById("achievements-container");
    if (!achContainer || !window.ACHIEVEMENTS_DATA) return;

    const ctx = { progressState, completedCount, pjsScore, pjsAnsweredCount };
    let newlyUnlocked = null;

    achContainer.innerHTML = window.ACHIEVEMENTS_DATA.map(ach => {
      const isUnlocked = ach.check(ctx);
      if (isUnlocked && !unlockedAch.includes(ach.id)) {
        unlockedAch.push(ach.id);
        newlyUnlocked = ach;
      }
      return `
        <div class="ach-badge ${isUnlocked ? "unlocked" : ""}">
          <div class="ach-icon">${ach.icon}</div>
          <div>
            <div style="font-size:0.84rem; font-weight:700; color:var(--text);">${ach.title}</div>
            <div style="font-size:0.74rem; color:var(--muted);">${ach.desc}</div>
          </div>
        </div>
      `;
    }).join("");

    if (newlyUnlocked) {
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_ACH, JSON.stringify(unlockedAch));
      window.playSoundEffect("achievement");
      window.showToast(`🏆 <strong>¡Nuevo Logro Desbloqueado!</strong><br>${newlyUnlocked.icon} ${newlyUnlocked.title}`);
    }
  }

  function renderDashboard() {
    updateHeaderCourseBar();
    renderContinuityCompass();
    renderCatchupSprints();

    const container = document.getElementById("indicators-container");
    if (!container) return;

    const groups = {};
    window.INDICATORS_DATA.forEach(ind => {
      if (!groups[ind.blockId]) {
        groups[ind.blockId] = { id: ind.blockId, title: ind.blockName, items: [] };
      }
      groups[ind.blockId].items.push(ind);
    });

    container.innerHTML = "";
    let totalInds = window.INDICATORS_DATA.length;
    let completedInds = window.INDICATORS_DATA.filter(i => !!progressState[i.id]).length;
    const totalMicroSteps = totalInds * 5;
    const doneMicroSteps = getTotalMicroStepsDone();

    Object.values(groups).forEach(group => {
      const groupDoneInds = group.items.filter(i => !!progressState[i.id]).length;
      const groupTotalSteps = group.items.length * 5;
      const groupDoneSteps = group.items.reduce((acc, i) => acc + getIndDoneStepsCount(i.id), 0);
      const groupPct = Math.round((groupDoneSteps / groupTotalSteps) * 100);
      const isExpanded = expandedModules[group.id] !== false;

      const sectionEl = document.createElement("div");
      sectionEl.className = "udemy-module-section";

      const headerEl = document.createElement("div");
      headerEl.className = "udemy-module-header";
      headerEl.onclick = () => window.toggleCourseModuleAccordion(group.id);
      headerEl.innerHTML = `
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
            <strong style="font-size:0.94rem; color:var(--warning);">${isExpanded ? "▾" : "▸"} ${group.title}</strong>
            <span style="font-size:0.78rem; color:var(--text); font-weight:700;">
              ${groupDoneInds}/${group.items.length} temas • ${groupDoneSteps}/${groupTotalSteps} pasos (${groupPct}%)
            </span>
          </div>
          <div class="mini-progress-track" style="margin-top:6px;">
            <div class="mini-progress-fill" style="width:${groupPct}%;"></div>
          </div>
        </div>
      `;
      sectionEl.appendChild(headerEl);

      if (isExpanded) {
        const bodyEl = document.createElement("div");
        bodyEl.className = "udemy-module-body";

        group.items.forEach(item => {
          const isChecked = !!progressState[item.id];
          const isCurrentFocus = item.id === currentFocusId;
          const st = getIndSteps(item.id);
          const doneCount = getIndDoneStepsCount(item.id);
          const badgeClass = item.tag.toLowerCase();
          const defs = getCourseStepDefs(item);

          const row = document.createElement("div");
          row.className = "indicator-item" + (isChecked ? " done" : "") + (isCurrentFocus ? " current-focus" : "");
          row.innerHTML = `
            <div style="width:100%; display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
              <label style="flex:1; min-width:210px;">
                <input type="checkbox" ${isChecked ? "checked" : ""} onchange="window.toggleIndicatorDone('${item.id}', this.checked)" />
                <span>${isCurrentFocus ? "📍 " : ""}${item.name}</span>
              </label>
              <div class="indicator-actions">
                <span class="pill ${doneCount === 5 ? "success" : (doneCount > 0 ? "accent" : "")}" style="font-size:0.7rem;">${doneCount}/5 pasos</span>
                <span class="badge ${badgeClass}">${item.tag}</span>
                <button class="btn-mini" title="Fijar como tema actual" onclick="window.setCurrentFocusIndicator('${item.id}', false)">📍 Aquí voy</button>
                <button class="btn-mini" onclick="window.openIndicatorStudy('${item.id}')">🎓 Abrir en Curso</button>
              </div>
            </div>

            <!-- Sub-ítems secuenciales X.1 a X.5 estilo Cisco NetAcad / Coursera -->
            <div class="micro-steps-strip" style="width:100%; padding-left:26px; margin-top:4px;">
              ${defs.map(d => `
                <label class="micro-step-chip ${st[d.key] ? "done" : ""}">
                  <input type="checkbox" ${st[d.key] ? "checked" : ""} onchange="window.toggleMicroStep('${item.id}', '${d.key}', this.checked)" />
                  <span onclick="event.preventDefault(); window.openLessonSubtab('${item.id}', '${d.subtab}')">${d.code} ${d.icon} ${d.shortTitle}</span>
                </label>
              `).join("")}
            </div>
          `;
          bodyEl.appendChild(row);
        });

        sectionEl.appendChild(bodyEl);
      }

      container.appendChild(sectionEl);
    });

    const pctMicro = Math.round((doneMicroSteps / totalMicroSteps) * 100);
    const bar = document.getElementById("progress-bar");
    if (bar) {
      bar.style.width = `${Math.max(pctMicro, doneMicroSteps > 0 ? 4 : 0)}%`;
      bar.textContent = `${pctMicro}% (${doneMicroSteps}/${totalMicroSteps} Pasos Secuenciales • ${completedInds}/${totalInds} Temas Completos)`;
    }

    const kpiInd = document.getElementById("kpi-indicators-val");
    if (kpiInd) {
      kpiInd.textContent = `${doneMicroSteps} / ${totalMicroSteps} pasos (${pctMicro}%)`;
    }

    const focusInd = window.INDICATORS_DATA.find(i => i.id === currentFocusId) || window.INDICATORS_DATA[0];
    const nextStep = getNextMicroStepInfo(focusInd.id);
    const kpiIndSub = document.getElementById("kpi-indicators-sub");
    if (kpiIndSub && focusInd) {
      kpiIndSub.textContent = `Actual: #${focusInd.num} (${getIndDoneStepsCount(focusInd.id)}/5 pasos) → ${nextStep.btnText}`;
    }

    const pjsStats = updatePjsKpi();
    renderAchievements(completedInds, pjsStats.numScore, pjsStats.totalAnswered);
    renderRoutineAndRules();
  }

  function renderRoutineAndRules() {
    const routineContainer = document.getElementById("routine-list-container");
    if (routineContainer) {
      routineContainer.innerHTML = "";
      window.DIAN_PROFILE.rutinaHoraria.forEach(slot => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${slot.rango} (${slot.titulo}):</strong> ${slot.detalle}`;
        routineContainer.appendChild(li);
      });
    }

    const rulesContainer = document.getElementById("golden-rules-container");
    if (rulesContainer) {
      rulesContainer.innerHTML = window.DIAN_PROFILE.reglasOro.map(r => `
        <div class="step-box" style="margin-bottom:10px; padding:12px 14px;">
          <h3 style="font-size:0.93rem; color:var(--warning); margin-bottom:4px;">🛡️ ${r.titulo}</h3>
          <p style="font-size:0.86rem; color:var(--text); margin:0;">${r.detalle}</p>
        </div>
      `).join("");
    }

    const screensContainer = document.getElementById("setup-screens-container");
    if (screensContainer && window.DIAN_PROFILE.setupPantallas) {
      screensContainer.innerHTML = window.DIAN_PROFILE.setupPantallas.map(s => `
        <div class="step-box" style="margin-bottom:8px; padding:10px 14px; border-left-color:var(--purple);">
          <strong style="font-size:0.88rem; color:var(--accent);">${s.posicion}</strong>
          <p style="font-size:0.83rem; color:var(--muted); margin:4px 0 0;">${s.uso}</p>
        </div>
      `).join("");
    }

    renderMusicStation();
  }

  function renderMusicStation() {
    const musicContainer = document.getElementById("music-station-container");
    if (!musicContainer || !window.DIAN_PROFILE.estacionMusica) return;

    musicContainer.innerHTML = window.DIAN_PROFILE.estacionMusica.map(m => {
      const shortName = m.nombre.replace(/^\d+\.\s*/, "").split("(")[0].trim();
      return `
        <div class="music-pill-group" title="${m.fase} — ${m.razon}">
          <span class="music-pill-label">${shortName}</span>
          <a href="${m.ytUrl}" target="_blank" rel="noopener" class="music-pill-link yt" title="Abrir en YouTube: ${m.nombre}">YT</a>
          <a href="${m.spUrl}" target="_blank" rel="noopener" class="music-pill-link sp" title="Abrir en Spotify: ${m.nombre}">SP</a>
        </div>
      `;
    }).join("");

    const savedUrl = localStorage.getItem("dian2676_custom_music_url") || "";
    const inputEl = document.getElementById("custom-music-url");
    const openBtn = document.getElementById("btn-open-custom-music");
    if (inputEl && savedUrl) inputEl.value = savedUrl;
    if (openBtn) openBtn.style.display = savedUrl ? "inline-flex" : "none";
  }

  window.saveCustomMusicUrl = function () {
    const inputEl = document.getElementById("custom-music-url");
    if (!inputEl) return;
    const url = inputEl.value.trim();
    localStorage.setItem("dian2676_custom_music_url", url);
    renderMusicStation();
    if (url) {
      window.showToast("🎧 ¡Tu playlist personal quedó guardada en la barra rápida!");
    }
  };

  window.openCustomMusicUrl = function () {
    const url = localStorage.getItem("dian2676_custom_music_url");
    if (url) window.open(url, "_blank", "noopener");
  };

  window.buildVisualGridNotebookHtml = function (ind, relatedCasesCount) {
    if (ind.id === "ind1") {
      return `
        <div class="notebook-sheet-grid">
          <div class="nb-header-zone">
            <div>
              <div class="ink-blue-pen" style="font-size:1.05rem;">🖊️ [LAPICERO AZUL/NEGRO] PÁGINA #1 — INDICADOR 1: MISIONALIDAD Y ESTRUCTURA DIAN</div>
              <div class="ink-black-pen" style="font-size:0.86rem;">Norma Base: <span class="hl-yellow">Decreto 1742 de 2020</span> y <span class="hl-yellow">Decreto Ley 927 de 2023</span> | Aspirante: Marcelino Garavito</div>
            </div>
            <div style="text-align:right; font-size:0.8rem;" class="ink-blue-pen">
              OPEC: 236908 (Facilitador I)<br>
              <em>(Deja 3 cuadritos arriba)</em>
            </div>
          </div>

          <div class="nb-body-cornell">
            <!-- COLUMNA IZQUIERDA (33% - 10 CUADRITOS DE ANCHO) -->
            <div class="nb-left-cue">
              <div class="ink-blue-pen" style="font-size:0.84rem; margin-bottom:8px;">📏 COLUMNA IZQUIERDA<br><span style="font-weight:400; font-size:0.76rem;">(Traza línea vertical a 10 cuadritos del margen izquierdo)</span></div>

              <p style="font-size:0.85rem; margin-bottom:8px;">
                🖍️ <strong>Naturaleza (Art. 1):</strong><br>
                <span class="hl-yellow">U.A.E.</span> (Unidad Administrativa Especial) adscrita a <span class="hl-green">MinHacienda</span>.
              </p>

              <p style="font-size:0.85rem; margin-bottom:8px;">
                🖍️ <strong>Los 2 Fines (Art. 2):</strong><br>
                1. <span class="hl-yellow">Seguridad Fiscal</span> del Estado.<br>
                2. <span class="hl-yellow">Orden Público Económico</span> Nacional.
              </p>

              <p style="font-size:0.85rem; margin-bottom:8px;">
                🖍️ <strong>Sigla Clave:</strong><br>
                <span class="hl-green">T - A - C + Juegos Nac.</span><br>
                • Tributario Nacional<br>
                • Aduanero<br>
                • Cambiario (Imp/Exp)<br>
                • Juegos Suerte/Azar (Nivel Nacional)
              </p>

              <p style="font-size:0.85rem; margin-bottom:4px;">
                🖍️ <strong>Plazo Traslado:</strong><br>
                <span class="hl-yellow">5 días hábiles</span> (Art. 21 Ley 1755) si radican algo de otra entidad.
              </p>
            </div>

            <!-- COLUMNA DERECHA (67% - ESQUEMAS CON LÁPIZ Y LAPICERO) -->
            <div class="nb-right-notes">
              <div class="ink-blue-pen" style="font-size:0.84rem; margin-bottom:8px;">✏️ COLUMNA DERECHA (APUNTES, ESQUEMAS Y FLUJO CON LÁPIZ HB + LAPICERO)</div>

              <div class="nb-flow-box">
                <strong class="ink-blue-pen">1. Estructura en 3 Niveles (Art. 4 Decreto 1742/2020) — Dibuja con ✏️ Lápiz:</strong><br>
                <span class="ink-pencil">[ 1. NIVEL CENTRAL (Bogotá - Dirección General: Dirige y norma) ]</span><br>
                &nbsp;&nbsp;&nbsp;&nbsp;⬇️ <em>(Flecha a lápiz)</em><br>
                <span class="ink-pencil">[ 2. NIVEL LOCAL (Direcciones Seccionales: Ejecuta y atiende — <span class="hl-green">¡AQUÍ TRABAJO YO!</span>) ]</span><br>
                &nbsp;&nbsp;&nbsp;&nbsp;⬇️ <em>(Flecha a lápiz)</em><br>
                <span class="ink-pencil">[ 3. NIVEL DELEGADO (Direcciones Seccionales Delegadas) ]</span>
              </div>

              <div class="nb-flow-box">
                <strong class="ink-blue-pen">2. Mapa de los 4 Campos que SÍ administra la DIAN:</strong><br>
                • <strong>Tributario NAC:</strong> <span class="hl-yellow">Renta, IVA, Consumo, GMF (4x1000), Patrimonio, Retefuente</span>.<br>
                • <strong>Aduanero:</strong> Importación, exportación, tránsito, aprehensión y decomiso.<br>
                • <strong>Cambiario:</strong> Divisas de comercio exterior (Importación/Exportación).<br>
                • <strong>Juegos:</strong> Derechos de explotación de juegos del <u>orden nacional</u>.
              </div>

              <div class="nb-flow-box">
                <strong class="ink-blue-pen">3. Mi Flujo Operativo como Facilitador I (Dibuja en 4 cajitas con ✏️ Lápiz):</strong><br>
                <span class="ink-pencil">[1. Recibo escrito] ➡️ [2. Verifico folios/anexos] ➡️ [3. Radico sin falta] ➡️ [4. Reparto o Traslado en <span class="hl-yellow">5 días</span>]</span>
              </div>
            </div>
          </div>

          <!-- FRANJA INFERIOR (TRAMPA MORTAL CNSC CON MARCADOR NARANJA/ROJO) -->
          <div class="nb-bottom-trap">
            <strong style="color:#9a3412 !important; font-size:0.9rem;">🖍️ [MARCADOR NARANJA / ROJO — FRANJA INFERIOR DE 4 RENGLONES] 🚨 TRAMPAS MORTALES CNSC:</strong>
            <div style="font-size:0.85rem; margin-top:4px;">
              1) <span class="hl-orange">¡TRAMPA TERRITORIAL!</span> <strong>Impuesto Predial, ICA (Industria y Comercio), Vehículos y Loterías Departamentales NO son de la DIAN</strong> (son municipales/departamentales).<br>
              2) <span class="hl-orange">¡TRAMPA DE ROL!</span> Como Facilitador I <strong>NUNCA rechazo de plano un escrito</strong> (lo recibo, radico y traslado en <span class="hl-yellow">5 días hábiles</span>) y <strong>NUNCA emito conceptos jurídicos ni levanto mercancías</strong>.
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="notebook-sheet-grid">
        <div class="nb-header-zone">
          <div>
            <div class="ink-blue-pen" style="font-size:1rem;">🖊️ [LAPICERO] PÁGINA #${ind.num} — ${ind.name.toUpperCase()}</div>
            <div class="ink-black-pen" style="font-size:0.85rem;">Norma Base: <span class="hl-yellow">${ind.normaBase}</span> | Aspirante: Marcelino Garavito</div>
          </div>
          <div class="ink-blue-pen" style="font-size:0.78rem; text-align:right;">Libreta Cuadriculada<br>Método Cornell</div>
        </div>
        <div class="nb-body-cornell" style="min-height:170px;">
          <div class="nb-left-cue">
            <div class="ink-blue-pen" style="font-size:0.82rem; margin-bottom:6px;">🖍️ COLUMNA IZQUIERDA (10 cuadritos): Cifras y Plazos</div>
            <p style="font-size:0.84rem;"><span class="hl-yellow">${ind.quickSummary || ind.normaBase}</span></p>
          </div>
          <div class="nb-right-notes">
            <div class="ink-blue-pen" style="font-size:0.82rem; margin-bottom:6px;">✏️ COLUMNA DERECHA: Esquema de Rol Facilitador I (Con Lápiz HB y Lapicero)</div>
            <div class="nb-flow-box">
              <span class="ink-pencil">[1. Recibir / Escuchar] ➡️ [2. Verificar requisitos formales] ➡️ [3. Radicar / Registrar en sistema] ➡️ [4. Escalar o Archivar según TRD sin usurpar funciones]</span>
            </div>
            <p style="font-size:0.82rem; margin-top:6px;"><strong>Casos PJS en plataforma para practicar este indicador:</strong> <span class="hl-green">${relatedCasesCount} caso(s)</span>.</p>
          </div>
        </div>
        <div class="nb-bottom-trap">
          <strong style="color:#9a3412 !important; font-size:0.86rem;">🖍️ [MARCADOR NARANJA/ROJO — FRANJA INFERIOR] 🚨 TRAMPA CNSC A EVITAR:</strong>
          <div style="font-size:0.83rem; margin-top:3px;">
            Resume en 2 renglones la alerta del <strong>Paso 3</strong> de arriba y resáltala con <span class="hl-orange">marcador naranja/rojo</span>.
          </div>
        </div>
      </div>
    `;
  };

  // --------------------------------------------------------------------------
  // 4. AULA DEL CURSO: ESQUEMA SECUENCIAL CISCO NETACAD Y REPRODUCTOR COURSERA
  // --------------------------------------------------------------------------
  window.setStudyFilter = function (blockFilter) {
    currentStudyFilter = blockFilter;
    renderStudySidebar();
  };

  window.filterSidebarSearch = function (query) {
    sidebarSearchQuery = (query || "").trim().toLowerCase();
    renderStudySidebar();
  };

  window.flipInlineFlashcard = function (el) {
    if (!el) return;
    const isFlipped = el.classList.toggle("flipped");
    const front = el.querySelector(".fc-front");
    const back = el.querySelector(".fc-back");
    if (front) front.style.display = isFlipped ? "none" : "block";
    if (back) back.style.display = isFlipped ? "block" : "none";
  };

  window.calculateInlineTrdDates = function () {
    const idx = parseInt(document.getElementById("inline-trd-calc-series")?.value || "0", 10);
    const closeYear = parseInt(document.getElementById("inline-trd-calc-year")?.value || "2026", 10);
    const out = document.getElementById("inline-trd-calc-output");
    if (!out || !window.TRD_MATRIX_DATA) return;

    const item = window.TRD_MATRIX_DATA[idx] || window.TRD_MATRIX_DATA[0];
    const yearPrimaryTransfer = closeYear + item.retencionAG;
    const yearFinalDisp = yearPrimaryTransfer + item.retencionAC;

    out.innerHTML = `
      <strong>📌 Resultado para «${item.subserie}» (Cerrado en ${closeYear}):</strong><br>
      • Permanece en <strong>Archivo de Gestión (AG)</strong> durante <strong>${item.retencionAG} año(s)</strong> → <strong>Transferencia Primaria al Archivo Central (AC) en: ${yearPrimaryTransfer}</strong>.<br>
      • Permanece en <strong>Archivo Central (AC)</strong> durante <strong>${item.retencionAC} año(s)</strong> → <strong>Disposición Final (${item.disposicion}) en el año: ${yearFinalDisp}</strong>.<br>
      <span style="font-size:0.84rem; color:var(--warning);">${item.procedimiento}</span>
    `;
  };

  window.checkInlineWorkshopEx = function (exId, chosenIdx) {
    const ex = (window.EXCEL_LOGIC_EXERCISES || []).find(x => x.id === exId);
    const fb = document.getElementById("inline-ex-fb-" + exId);
    const optsWrap = document.getElementById("inline-ex-opts-" + exId);
    if (!ex || !fb || !optsWrap) return;

    if (chosenIdx === ex.correctIndex) window.playSoundEffect("correct");
    else window.playSoundEffect("wrong");

    optsWrap.querySelectorAll(".option-btn").forEach((btn, idx) => {
      btn.classList.remove("correct", "incorrect");
      if (idx === ex.correctIndex) btn.classList.add("correct");
      else if (idx === chosenIdx) btn.classList.add("incorrect");
    });

    fb.style.display = "block";
    fb.innerHTML = `
      <h4>${chosenIdx === ex.correctIndex ? "✅ ¡Correcto!" : "❌ Revisa la regla técnica"}</h4>
      <p>${ex.explanation}</p>
    `;
  };

  function renderStudySidebar() {
    const listEl = document.getElementById("study-sidebar-list");
    if (!listEl) return;

    const totalSteps = window.INDICATORS_DATA.length * 5;
    const doneSteps = getTotalMicroStepsDone();
    const coursePct = Math.round((doneSteps / totalSteps) * 100);
    const pctEl = document.getElementById("sidebar-course-pct");
    if (pctEl) pctEl.textContent = `${coursePct}% (${doneSteps}/${totalSteps})`;

    // MODO RECURSOS EN EL PANEL LATERAL (ESTILO CISCO NETACAD)
    if (sidebarMode === "resources") {
      const activeInd = window.INDICATORS_DATA.find(i => i.id === activeIndicatorId) || window.INDICATORS_DATA[0];
      const otherInds = window.INDICATORS_DATA.filter(i => i.id !== activeInd.id);
      const orderedInds = [activeInd, ...otherInds];

      listEl.innerHTML = `
        <div style="font-size:0.78rem; color:var(--muted); margin-bottom:10px;">
          Marca con un check <strong>✓</strong> cada recurso a medida que lo abras o termines de leer:
        </div>
        ${orderedInds.map(ind => {
          const links = ind.links || [];
          const doneCount = links.filter((_, idx) => !!checkedResources[`${ind.id}_${idx}`]).length;
          const isCurrent = ind.id === activeInd.id;
          return `
            <div class="netacad-res-group ${isCurrent ? "current" : ""}">
              <div class="netacad-res-header" onclick="window.openLessonSubtab('${ind.id}', 'resources')">
                <strong>${isCurrent ? "📍 " : ""}${ind.name}</strong>
                <span class="pill ${doneCount === links.length && links.length > 0 ? "success" : "accent"}" style="font-size:0.68rem;">${doneCount}/${links.length}</span>
              </div>
              <div class="netacad-res-items">
                ${links.map((l, idx) => {
                  const isChecked = !!checkedResources[`${ind.id}_${idx}`];
                  return `
                    <div class="netacad-res-row ${isChecked ? "done" : ""}">
                      <input type="checkbox" ${isChecked ? "checked" : ""} onchange="window.toggleResourceChecked('${ind.id}', ${idx}, this.checked)" title="Marcar este recurso como visto" />
                      <a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        }).join("")}
      `;
      return;
    }

    // MODO ESQUEMA DE CURSO SECUENCIAL (ÁRBOL CONECTADO X.1 -> X.5 ESTILO CISCO NETACAD)
    const filtered = window.INDICATORS_DATA.filter(ind => {
      if (currentStudyFilter === "pending" && progressState[ind.id]) return false;
      if (currentStudyFilter.startsWith("bloque") && ind.blockId !== currentStudyFilter) return false;
      if (sidebarSearchQuery) {
        const hay = `${ind.name} ${ind.normaBase} ${ind.quickSummary || ""}`.toLowerCase();
        if (!hay.includes(sidebarSearchQuery)) return false;
      }
      return true;
    });

    listEl.innerHTML = "";
    filtered.forEach(ind => {
      const isDone = !!progressState[ind.id];
      const isActive = ind.id === activeIndicatorId;
      const indStepsCount = getIndDoneStepsCount(ind.id);
      const st = getIndSteps(ind.id);
      const defs = getCourseStepDefs(ind);

      const itemWrap = document.createElement("div");
      itemWrap.className = "netacad-topic-wrap" + (isActive ? " expanded" : "");

      const btn = document.createElement("button");
      btn.className = "study-nav-btn" + (isActive ? " active" : "");
      const statusDotClass = isDone ? "done" : (indStepsCount > 0 || isActive ? "progress" : "pending");
      const statusSymbol = isDone ? "✓" : (indStepsCount > 0 ? "◐" : "•");

      btn.innerHTML = `
        <span class="netacad-node-circle ${statusDotClass}">${statusSymbol}</span>
        <span style="flex:1; line-height:1.3;">${ind.name}</span>
        <span class="pill ${indStepsCount === 5 ? "success" : (indStepsCount > 0 ? "accent" : "")}" style="font-size:0.68rem; padding:1px 6px;">${indStepsCount}/5</span>
      `;
      btn.addEventListener("click", () => {
        if (activeIndicatorId !== ind.id) {
          const nextStep = getNextMicroStepInfo(ind.id);
          activeLessonSubtab = nextStep.subtab || "theory";
        }
        window.setCurrentFocusIndicator(ind.id, false);
        if (window.innerWidth <= 1100) {
          setTimeout(() => {
            const detailEl = document.getElementById("study-detail-view");
            if (detailEl) detailEl.scrollIntoView({ behavior: lowGpuMode ? "auto" : "smooth", block: "start" });
          }, 60);
        }
      });
      itemWrap.appendChild(btn);

      // Si es el indicador activo, desplegar su árbol vertical conectado (X.1 a X.5) estilo Cisco NetAcad
      if (isActive) {
        const treeEl = document.createElement("div");
        treeEl.className = "netacad-subtree";

        defs.forEach(d => {
          const stepDone = !!st[d.key];
          const stepActive = activeLessonSubtab === d.subtab;
          const subBtn = document.createElement("div");
          subBtn.className = "netacad-subitem" + (stepActive ? " active" : "") + (stepDone ? " done" : "");
          subBtn.innerHTML = `
            <span class="netacad-sub-circle ${stepDone ? "done" : (stepActive ? "active" : "")}"
                  onclick="event.stopPropagation(); window.toggleMicroStep('${ind.id}', '${d.key}', ${!stepDone})"
                  title="${stepDone ? "Completado (Clic para desmarcar)" : "Clic para marcar como completo"}">
              ${stepDone ? "✓" : "›"}
            </span>
            <div class="netacad-sub-text" onclick="window.openLessonSubtab('${ind.id}', '${d.subtab}')">
              <div class="netacad-sub-code">${d.code} ${d.icon} ${d.shortTitle}</div>
            </div>
          `;
          treeEl.appendChild(subBtn);
        });

        itemWrap.appendChild(treeEl);
      }

      listEl.appendChild(itemWrap);
    });
  }

  function buildInlinePracticeHtml(ind) {
    const st = getIndSteps(ind.id);
    const flashcards = getIndFlashcards(ind.id);
    const isTrdTopic = ind.id === "ind10" || ind.id === "ind11";
    const isExcelLogicTopic = ind.id === "ind21" || ind.id === "ind22";

    const flashcardsSection = flashcards.length > 0 ? `
      <div style="margin-bottom:14px;">
        <h4 style="font-size:0.95rem; color:var(--accent); margin-bottom:6px;">
          🃏 Tarjetas de Memoria Activa (Flashcards) de este Tema (${flashcards.length})
        </h4>
        <p style="font-size:0.83rem; color:var(--muted); margin-bottom:10px;">
          Haz clic sobre cada tarjeta para voltearla y verificar el dato exacto que pregunta la CNSC:
        </p>
        <div class="flashcard-Grid">
          ${flashcards.map((fc, idx) => `
            <div class="flashcard" onclick="window.flipInlineFlashcard(this)">
              <div>
                <span class="pill accent" style="font-size:0.72rem;">${fc.cat}</span>
                <p class="fc-front" style="margin-top:12px; font-weight:700; font-size:0.94rem;">❓ ${fc.q}</p>
                <p class="fc-back" style="margin-top:12px; display:none; color:var(--success); font-weight:600; font-size:0.91rem; white-space:pre-line;">✅ ${fc.a}</p>
              </div>
              <div style="font-size:0.75rem; color:var(--muted); margin-top:12px; text-align:right;">Toca para voltear 🔄 (#${idx + 1})</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : "";

    const trdLabSection = isTrdTopic && window.TRD_MATRIX_DATA ? `
      <div class="case-card" style="margin-top:14px; border-left:4px solid var(--accent);">
        <h4 style="font-size:0.98rem; color:var(--warning); margin-bottom:8px;">
          🗂️ Laboratorio Integrado TRD: Calculadora de Transferencia Primaria (AG) y Disposición Final (AC)
        </h4>
        <p style="font-size:0.84rem; color:var(--muted); margin-bottom:10px;">
          Practica aquí mismo los tiempos de retención documental de tu cargo de Facilitador I sin salir del curso:
        </p>
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:12px;">
          <label style="font-size:0.84rem;">Serie Documental:
            <select id="inline-trd-calc-series" onchange="window.calculateInlineTrdDates()" style="background:#090d16; color:var(--text); border:1px solid var(--border); padding:6px 10px; border-radius:6px; margin-left:6px;">
              ${window.TRD_MATRIX_DATA.map((r, i) => `<option value="${i}">${r.codigo} — ${r.subserie}</option>`).join("")}
            </select>
          </label>
          <label style="font-size:0.84rem;">Año de cierre del expediente:
            <input id="inline-trd-calc-year" type="number" value="2026" onchange="window.calculateInlineTrdDates()" style="width:95px; background:#090d16; color:var(--text); border:1px solid var(--border); padding:6px 10px; border-radius:6px; margin-left:6px;" />
          </label>
        </div>
        <div id="inline-trd-calc-output" class="feedback-panel" style="margin-bottom:12px;"></div>
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Código / Dependencia</th>
                <th>Serie / Subserie</th>
                <th>AG</th>
                <th>AC</th>
                <th>Disposición</th>
                <th>Procedimiento</th>
              </tr>
            </thead>
            <tbody>
              ${window.TRD_MATRIX_DATA.map(row => `
                <tr>
                  <td><strong>${row.codigo}</strong><br><span style="font-size:0.74rem; color:var(--muted);">${row.dependencia}</span></td>
                  <td><strong>${row.serie}</strong><br>${row.subserie}</td>
                  <td style="text-align:center; font-weight:700;">${row.retencionAG} a</td>
                  <td style="text-align:center; font-weight:700;">${row.retencionAC} a</td>
                  <td style="text-align:center;"><span class="pill accent">${row.disposicion}</span></td>
                  <td style="font-size:0.8rem;">${row.procedimiento}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    ` : "";

    const excelLabSection = isExcelLogicTopic && window.EXCEL_LOGIC_EXERCISES ? `
      <div style="margin-top:14px;">
        <h4 style="font-size:0.98rem; color:var(--warning); margin-bottom:8px;">
          📊 Taller Práctico Integrado: Fórmulas de Excel y Razonamiento Cuantitativo DIAN
        </h4>
        ${window.EXCEL_LOGIC_EXERCISES.map((ex, i) => `
          <div class="case-card" style="margin-bottom:12px;">
            <span class="pill accent">Ejercicio #${i + 1} — ${ex.type}</span>
            <p style="margin:10px 0; font-weight:600;">${ex.question}</p>
            <div id="inline-ex-opts-${ex.id}">
              ${ex.options.map((opt, oIdx) => `
                <button class="option-btn" onclick="window.checkInlineWorkshopEx('${ex.id}', ${oIdx})">
                  <span class="option-letter">${oIdx + 1}</span>
                  <code>${opt}</code>
                </button>
              `).join("")}
            </div>
            <div id="inline-ex-fb-${ex.id}" class="feedback-panel" style="display:none;"></div>
          </div>
        `).join("")}
      </div>
    ` : "";

    return `
      <div class="step-box" style="border-left-color:var(--success);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <div>
            <h3 style="margin-bottom:2px;">🛠️ Paso ${ind.num}.3: Práctica y Laboratorio del Tema</h3>
            <p style="font-size:0.84rem; color:var(--muted); margin:0;">
              Entrena la memoria activa de <strong>${ind.name}</strong> antes de pasar a los recursos y al cuestionario.
            </p>
          </div>
          <button class="btn-coursera-complete ${st.practice ? "completed" : ""}" onclick="window.toggleMicroStep('${ind.id}', 'practice', ${!st.practice})">
            ${st.practice ? "✅ Práctica Completada" : "✓ Marcar Práctica como Completa"}
          </button>
        </div>
        ${flashcardsSection}
        ${trdLabSection}
        ${excelLabSection}
      </div>
    `;
  }

  function buildInlineResourcesHtml(ind) {
    const st = getIndSteps(ind.id);
    const links = ind.links || [];
    const doneCount = links.filter((_, idx) => !!checkedResources[`${ind.id}_${idx}`]).length;

    return `
      <div class="step-box" style="border-left-color:var(--purple);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <div>
            <h3 style="margin-bottom:2px;">🔗 Paso ${ind.num}.4: Recursos Oficiales Verificados de esta Lección</h3>
            <p style="font-size:0.84rem; color:var(--muted); margin:0;">
              Si hoy lees un recurso y dejas otro para mañana, marca cada enlace individualmente. Tu avance queda guardado al instante.
            </p>
          </div>
          <span class="pill ${doneCount === links.length && links.length > 0 ? "success" : "accent"}">
            Recursos vistos: ${doneCount} / ${links.length}
          </span>
        </div>

        <ul class="links-list resource-checklist">
          ${links.map((l, idx) => {
            const isChecked = !!checkedResources[`${ind.id}_${idx}`];
            return `
              <li class="resource-check-item ${isChecked ? "done" : ""}">
                <label class="resource-check-label">
                  <input type="checkbox" ${isChecked ? "checked" : ""} onchange="window.toggleResourceChecked('${ind.id}', ${idx}, this.checked)" />
                  <span class="resource-status-tag">${isChecked ? "✅ Visto" : "⏳ Pendiente"}</span>
                </label>
                <a href="${l.url}" target="_blank" rel="noopener" style="flex:1;">${l.label} ↗</a>
              </li>
            `;
          }).join("")}
        </ul>

        <div style="margin-top:12px; display:flex; justify-content:flex-end;">
          <button class="btn-coursera-complete ${st.resources ? "completed" : ""}" onclick="window.toggleMicroStep('${ind.id}', 'resources', ${!st.resources})">
            ${st.resources ? "✅ Recursos Completados" : "✓ Marcar Recursos como Completos"}
          </button>
        </div>
      </div>
    `;
  }

  function buildInlineLessonCasesHtml(ind, relatedCases) {
    const st = getIndSteps(ind.id);
    const autoItems = getIndAutoinformeItems(ind.id);

    const answeredPjs = relatedCases.filter(c => !!pjsAnswers[c.id]).length;
    const hitsPjs = relatedCases.filter(c => pjsAnswers[c.id] === c.correct).length;
    const answeredAuto = autoItems.filter(a => !!autoAnswers[a.id]).length;
    const hitsAuto = autoItems.filter(a => autoAnswers[a.id] === a.idealLevel).length;

    const totalItems = relatedCases.length + autoItems.length;
    const totalAnswered = answeredPjs + answeredAuto;

    const pjsHtml = relatedCases.length > 0 ? `
      <div style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <h4 style="font-size:0.96rem; color:var(--warning); margin:0;">
            ⚖️ Parte A — Casos de Juicio Situacional (PJS Eliminatorio 70%): ${relatedCases.length} Caso(s)
          </h4>
          <span class="pill ${answeredPjs === relatedCases.length ? "success" : "warning"}">
            PJS Resueltos: ${answeredPjs}/${relatedCases.length} • Aciertos: ${hitsPjs}
          </span>
        </div>

        ${relatedCases.map((c, idx) => {
          const userChoice = pjsAnswers[c.id];
          const isAnswered = !!userChoice;
          const renderOpt = (letter) => {
            let cls = "option-btn";
            if (isAnswered) {
              if (letter === c.correct) cls += " correct";
              else if (letter === userChoice && userChoice !== c.correct) cls += " incorrect";
            }
            return `
              <button class="${cls}" ${isAnswered ? "disabled" : ""} onclick="window.answerPjsCase('${c.id}', '${letter}')">
                <span class="option-letter">${letter}</span>
                <span>${c.options[letter]}</span>
              </button>
            `;
          };

          return `
            <div class="case-card" style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
                <span class="pill accent">Caso PJS ${idx + 1} de ${relatedCases.length} — ${c.title}</span>
                ${isAnswered ? `<button class="btn-mini" onclick="window.retrySinglePjsCase('${c.id}')">🔄 Reintentar caso</button>` : ""}
              </div>
              <div class="case-context"><strong>Caso Situacional:</strong> ${c.context}</div>
              <div class="case-stem">${c.stem}</div>
              <div>
                ${renderOpt("A")}
                ${renderOpt("B")}
                ${renderOpt("C")}
              </div>
              ${isAnswered ? `
                <div class="feedback-panel">
                  <h4>${userChoice === c.correct ? "✅ ¡Respuesta Correcta!" : `❌ Respuesta Incorrecta (Elegiste ${userChoice} — La clave correcta es ${c.correct})`}</h4>
                  <p style="margin-bottom:6px;"><strong>Fundamento Técnico y Jurídico (Clave ${c.correct}):</strong> ${c.explanation.correctWhy}</p>
                  ${c.explanation.distractorA ? `<p style="font-size:0.82rem; color:var(--muted);">• <strong>Distractor A:</strong> ${c.explanation.distractorA}</p>` : ""}
                  ${c.explanation.distractorB ? `<p style="font-size:0.82rem; color:var(--muted);">• <strong>Distractor B:</strong> ${c.explanation.distractorB}</p>` : ""}
                  ${c.explanation.distractorC ? `<p style="font-size:0.82rem; color:var(--muted);">• <strong>Distractor C:</strong> ${c.explanation.distractorC}</p>` : ""}
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    ` : "";

    const autoHtml = autoItems.length > 0 ? `
      <div style="margin-top:14px; padding-top:12px; border-top:1px dashed var(--border);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
          <div>
            <h4 style="font-size:0.96rem; color:var(--accent); margin:0;">
              🧭 Parte B — Reactivos de Autoinforme Comportamental e Integridad (Clasificatoria 30%): ${autoItems.length} Reactivo(s)
            </h4>
            <p style="font-size:0.82rem; color:var(--muted); margin:2px 0 0;">
              En el examen real este bloque evalúa tu alineación con los 5 Valores DIAN y tus Competencias Nivel 1 (sin caer en trampas de falso perfeccionismo).
            </p>
          </div>
          <span class="pill ${answeredAuto === autoItems.length ? "success" : "accent"}">
            Autoinforme: ${answeredAuto}/${autoItems.length} • Alineados: ${hitsAuto}
          </span>
        </div>

        ${autoItems.map((item, idx) => {
          const chosen = autoAnswers[item.id];
          const isAligned = chosen === item.idealLevel;
          return `
            <div class="case-card" style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
                <span class="pill ${item.isControlTrap ? "warning" : "accent"}">Autoinforme #${idx + 1} — ${item.category}</span>
              </div>
              <p style="font-size:0.96rem; font-weight:600; margin-bottom:10px;">«${item.statement}»</p>
              <div class="likert-row">
                ${LIKERT_LABELS.map(l => {
                  let cls = "likert-btn";
                  if (chosen === l.val) {
                    cls += (l.val === item.idealLevel) ? " selected-best" : " selected-warn";
                  }
                  return `<button class="${cls}" onclick="window.answerAutoinforme('${item.id}', ${l.val})">${l.text}</button>`;
                }).join("")}
              </div>
              ${chosen ? `
                <div class="feedback-panel" style="margin-top:12px;">
                  <h4>${isAligned ? "✅ Calibración Óptima con el Perfil DIAN" : `⚠️ Ajuste Recomendado: La respuesta ideal es «${LIKERT_LABELS.find(x => x.val === item.idealLevel).text}»`}</h4>
                  <p>${item.explanation}</p>
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    ` : "";

    return `
      <div class="step-box" style="border-left-color:var(--warning);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <div>
            <h3 style="margin-bottom:2px;">⚖️ Paso ${ind.num}.5: Cuestionario de Sección (${totalItems} Reactivos Integrados)</h3>
            <p style="font-size:0.84rem; color:var(--muted); margin:0;">
              Resuelve el cuestionario de <strong>${ind.name}</strong> aquí mismo en secuencia. Al contestar todos los reactivos se marcará automáticamente tu paso ${ind.num}.5.
            </p>
          </div>
          <span class="pill ${totalAnswered === totalItems && totalItems > 0 ? "success" : "warning"}">
            Progreso Cuestionario: ${totalAnswered}/${totalItems}
          </span>
        </div>

        ${pjsHtml}
        ${autoHtml}

        <div style="margin-top:12px; display:flex; justify-content:flex-end;">
          <button class="btn-coursera-complete ${st.cases ? "completed" : ""}" onclick="window.toggleMicroStep('${ind.id}', 'cases', ${!st.cases})">
            ${st.cases ? "✅ Cuestionario Completado" : "✓ Marcar Cuestionario como Completo"}
          </button>
        </div>
      </div>
    `;
  }

  function renderStudyDetail() {
    const viewEl = document.getElementById("study-detail-view");
    if (!viewEl) return;

    const idx = window.INDICATORS_DATA.findIndex(i => i.id === activeIndicatorId);
    const ind = window.INDICATORS_DATA[idx] || window.INDICATORS_DATA[0];
    const isDone = !!progressState[ind.id];
    const st = getIndSteps(ind.id);
    const doneStepsCount = getIndDoneStepsCount(ind.id);
    const nextStepInfo = getNextMicroStepInfo(ind.id);
    const prevInd = idx > 0 ? window.INDICATORS_DATA[idx - 1] : null;
    const nextInd = idx < window.INDICATORS_DATA.length - 1 ? window.INDICATORS_DATA[idx + 1] : null;
    const relatedCases = getAllCases().filter(c => c.indicatorId === ind.id);
    const defs = getCourseStepDefs(ind);

    const showTheory = activeLessonSubtab === "all" || activeLessonSubtab === "theory";
    const showNotebook = activeLessonSubtab === "all" || activeLessonSubtab === "notebook";
    const showPractice = activeLessonSubtab === "all" || activeLessonSubtab === "practice";
    const showResources = activeLessonSubtab === "all" || activeLessonSubtab === "resources";
    const showCases = activeLessonSubtab === "all" || activeLessonSubtab === "cases";

    // Determinar cuál es el paso actualmente visible para el botón azul estilo Coursera "Marcar como completo"
    const activeDef = defs.find(d => d.subtab === activeLessonSubtab) || defs.find(d => d.key === nextStepInfo.key) || defs[0];
    const isActiveStepDone = !!st[activeDef.key];

    viewEl.innerHTML = `
      <div class="card reader-card-surface">
        <div class="card-header">
          <div>
            <span class="pill accent">${ind.blockName}</span>
            <span class="badge ${ind.tag.toLowerCase()}" style="margin-left:6px;">${ind.tag}</span>
            <span class="pill ${doneStepsCount === 5 ? "success" : "warning"}" style="margin-left:6px;">${doneStepsCount}/5 Pasos Secuenciales</span>
            <h2 style="margin-top:8px; font-size:1.3rem;">${ind.name}</h2>
            <p style="font-size:0.85rem; color:var(--muted);">Normativa Base: <strong>${ind.normaBase}</strong></p>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <label style="display:flex; align-items:center; gap:8px; background:rgba(15,23,42,0.75); color:#f8fafc; padding:8px 12px; border-radius:8px; border:1px solid var(--border); cursor:pointer; font-size:0.84rem; font-weight:600;">
              <input type="checkbox" ${isDone ? "checked" : ""} onchange="window.toggleIndicatorDone('${ind.id}', this.checked)" />
              <span>${isDone ? "Tema 100% Dominado (5/5) ✅" : "Marcar Todo el Tema Completo"}</span>
            </label>
            <button class="btn secondary" onclick="window.openApaSingleIndicator('${ind.id}')">
              📄 Vista Impresión APA
            </button>
          </div>
        </div>

        <!-- BARRA DE PROGRESO SECUENCIAL X.1 A X.5 (ESTILO CISCO NETACAD + COURSERA) -->
        <div class="lesson-microsteps-box no-print">
          <div style="font-size:0.8rem; font-weight:700; margin-bottom:6px; color:var(--accent);">
            🧭 Secuencia guiada del tema (Marca cada paso a tu ritmo o navega entre <strong>${ind.num}.1</strong> y <strong>${ind.num}.5</strong>):
          </div>
          <div class="micro-steps-strip">
            ${defs.map(d => `
              <label class="micro-step-chip ${st[d.key] ? "done" : (nextStepInfo.key === d.key ? "current" : "")}">
                <input type="checkbox" ${st[d.key] ? "checked" : ""} onchange="window.toggleMicroStep('${ind.id}', '${d.key}', this.checked)" />
                <span onclick="event.preventDefault(); window.openLessonSubtab('${ind.id}', '${d.subtab}')">${d.code} ${d.icon} ${d.shortTitle}</span>
              </label>
            `).join("")}
          </div>

          <!-- PESTAÑAS INTERNAS SECUENCIALES (X.1 -> X.5) -->
          <div class="lesson-subtabs-bar">
            <button class="lesson-subtab-btn ${activeLessonSubtab === "all" ? "active" : ""}" onclick="window.openLessonSubtab('${ind.id}', 'all')">📑 Todo el Tema</button>
            ${defs.map(d => `
              <button class="lesson-subtab-btn ${activeLessonSubtab === d.subtab ? "active" : ""}" onclick="window.openLessonSubtab('${ind.id}', '${d.subtab}')">
                ${st[d.key] ? "✅" : d.icon} ${d.code} ${d.shortTitle}
              </button>
            `).join("")}
          </div>
        </div>

        ${ind.quickSummary ? `
          <div class="flash-summary-box" style="background:rgba(56, 189, 248, 0.12); border:1px solid var(--accent); border-radius:8px; padding:10px 14px; margin-bottom:14px; font-size:0.92rem;">
            <strong>⚡ Ficha Flash de Memoria:</strong> ${ind.quickSummary}
          </div>
        ` : ""}

        ${showTheory ? `
          <div class="step-box">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
              <h3 style="margin:0;">📘 ${ind.num}.1 Lectura Teórica — Síntesis Ejecutiva sin Relleno</h3>
              <button class="btn-coursera-complete ${st.read ? "completed" : ""}" onclick="window.toggleMicroStep('${ind.id}', 'read', ${!st.read})">
                ${st.read ? "✅ Lectura Completada" : "✓ Marcar Lectura como Completa"}
              </button>
            </div>
            <div class="step-content">${ind.step1}</div>
          </div>

          <div class="step-box step-2">
            <h3>🏛️ Traducción al Lenguaje DIAN (Cómo aplica en tu puesto de Facilitador I)</h3>
            <div class="step-content">${ind.step2}</div>
          </div>

          <div class="step-box step-3">
            <h3>🎯 Trampas Típicas de la CNSC que debes detectar</h3>
            <div class="step-content">${ind.step3}</div>
          </div>
        ` : ""}

        ${showNotebook ? `
          <div id="notebook-visual-anchor" class="step-box" style="border-left-color:#f43f5e; background:rgba(244,63,94,0.06);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
              <h3 style="margin:0;">📓 Paso ${ind.num}.2: Mapa Visual de tu Libreta Cuadriculada — Página #${ind.num}</h3>
              <button class="btn-coursera-complete ${st.notebook ? "completed" : ""}" onclick="window.toggleMicroStep('${ind.id}', 'notebook', !${st.notebook})">
                ${st.notebook ? "✅ Libreta Completada" : "✓ Marcar Libreta como Completa"}
              </button>
            </div>
            <p style="font-size:0.84rem; color:var(--muted); margin-bottom:8px;">
              Usa tu <strong>Libreta Cuadriculada</strong> como cuaderno principal. Aquí tienes el plano exacto de cómo distribuir tu hoja con <strong>Lapicero, Lápiz HB y Marcadores</strong>:
            </p>
            ${window.buildVisualGridNotebookHtml(ind, relatedCases.length)}
          </div>
        ` : ""}

        ${showPractice ? buildInlinePracticeHtml(ind) : ""}

        ${showResources ? buildInlineResourcesHtml(ind) : ""}

        ${showCases ? buildInlineLessonCasesHtml(ind, relatedCases) : ""}

        <div class="step-box" style="border-left-color:var(--muted);">
          <h3>📝 Mis Apuntes Digitales Específicos para este Tema (#${ind.num})</h3>
          <textarea id="ind-specific-note" class="notes-area" style="min-height:95px;" placeholder="Escribe aquí tus resúmenes o nemotecnias para ${ind.name}...">${indNotesState[ind.id] || ""}</textarea>
        </div>

        <!-- BARRA INFERIOR OFICIAL ESTILO COURSERA + CISCO NETACAD -->
        <div class="coursera-bottom-action-bar no-print">
          <div>
            ${prevInd ? `<button class="btn secondary" onclick="window.openIndicatorStudy('${prevInd.id}')">⬅️ Tema Anterior (#${prevInd.num})</button>` : `<span></span>`}
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
            <button class="btn-coursera-complete large ${isActiveStepDone ? "completed" : ""}"
                    onclick="window.toggleMicroStep('${ind.id}', '${activeDef.key}', ${!isActiveStepDone})">
              ${isActiveStepDone ? `✅ ${activeDef.code} Completado (Clic para desmarcar)` : `✓ Marcar como completo (${activeDef.code})`}
            </button>
            <button class="btn success" onclick="window.goToNextCourseStep()">
              ${doneStepsCount < 5 ? `Ir al siguiente elemento →` : (nextInd ? `Pasar al Tema #${nextInd.num} →` : `🎉 ¡Curso Completado!`)}
            </button>
          </div>
        </div>
      </div>
    `;

    if (showPractice && (ind.id === "ind10" || ind.id === "ind11")) {
      window.calculateInlineTrdDates();
    }

    const noteArea = document.getElementById("ind-specific-note");
    if (noteArea) {
      noteArea.addEventListener("input", () => {
        indNotesState[ind.id] = noteArea.value;
        localStorage.setItem(STORAGE_KEYS.NOTES_BY_IND, JSON.stringify(indNotesState));
      });
    }
  }

  // --------------------------------------------------------------------------
  // 5. SIMULADOR DE JUICIO SITUACIONAL (PJS - MODO A ELIMINATORIO 70%)
  // --------------------------------------------------------------------------
  function updatePjsKpi() {
    const allCases = getAllCases();
    const answeredIds = Object.keys(pjsAnswers);
    let hits = 0;
    answeredIds.forEach(cid => {
      const c = allCases.find(item => item.id === cid);
      if (c && pjsAnswers[cid] === c.correct) hits++;
    });

    const totalAnswered = answeredIds.length;
    const score = totalAnswered > 0 ? ((hits / totalAnswered) * 100).toFixed(1) : "0.0";
    const numScore = parseFloat(score);

    const kpiPjs = document.getElementById("kpi-pjs-val");
    if (kpiPjs) {
      kpiPjs.textContent = totalAnswered > 0 ? `${score} pts (${hits}/${totalAnswered})` : `0 / ${allCases.length} resueltos`;
    }

    const pjsScoreBanner = document.getElementById("pjs-score-banner");
    if (pjsScoreBanner) {
      let statusBadge = `<span class="pill warning">Mínimo aprobatorio: 70.00 | Meta: 85.00+</span>`;
      if (totalAnswered > 0) {
        if (numScore >= 85) {
          statusBadge = `<span class="pill success">🏆 NIVEL ELEGIBLE SUPERIOR (${score} pts ≥ 85.00)</span>`;
        } else if (numScore >= 70) {
          statusBadge = `<span class="pill accent">✅ APROBADO (${score} pts ≥ 70.00) — ¡Sigue por el 85+!</span>`;
        } else {
          statusBadge = `<span class="pill warning">⚠️ POR DEBAJO DEL MÍNIMO ELIMINATORIO (${score} / 70.00 pts)</span>`;
        }
      }
      pjsScoreBanner.innerHTML = `
        <div><strong>Casos Resueltos:</strong> ${totalAnswered} de ${allCases.length} | <strong>Aciertos:</strong> ${hits} | <strong>Fallos:</strong> ${totalAnswered - hits} | <strong>Puntaje Simulado:</strong> ${score} / 100</div>
        <div>${statusBadge}</div>
      `;
    }
    return { totalAnswered, hits, numScore };
  }

  function checkAndAutoCompleteStep5(indId) {
    const allC = getAllCases().filter(item => item.indicatorId === indId);
    const autoIt = getIndAutoinformeItems(indId);
    const total = allC.length + autoIt.length;
    if (total === 0) return;

    const allPjsDone = allC.every(item => !!pjsAnswers[item.id]);
    const allAutoDone = autoIt.every(item => !!autoAnswers[item.id]);
    const st = getIndSteps(indId);
    if (allPjsDone && allAutoDone && !st.cases) {
      window.toggleMicroStep(indId, "cases", true);
    }
  }

  window.answerPjsCase = function (caseId, chosenOption) {
    pjsAnswers[caseId] = chosenOption;
    localStorage.setItem(STORAGE_KEYS.PJS_ANSWERS, JSON.stringify(pjsAnswers));
    const allC = getAllCases();
    const c = allC.find(item => item.id === caseId);
    if (c) {
      if (chosenOption === c.correct) {
        window.playSoundEffect("correct");
      } else {
        window.playSoundEffect("wrong");
      }
      checkAndAutoCompleteStep5(c.indicatorId);
    }
    renderPjsSimulator();
    renderStudyDetail();
    renderStudySidebar();
    renderDashboard();
  };

  window.retrySinglePjsCase = function (caseId) {
    delete pjsAnswers[caseId];
    localStorage.setItem(STORAGE_KEYS.PJS_ANSWERS, JSON.stringify(pjsAnswers));
    renderPjsSimulator();
    renderStudyDetail();
    renderDashboard();
  };

  window.filterFailedPjsCases = function () {
    const failed = getAllCases().filter(c => pjsAnswers[c.id] && pjsAnswers[c.id] !== c.correct);
    if (failed.length === 0) {
      window.showToast("🎉 ¡No tienes casos fallados pendientes! Todos tus casos respondidos están en verde.");
      return;
    }
    activeCasesList = failed;
    currentPjsFilter = "failed";
    renderPjsSimulator();
    window.showToast(`🎯 Mostrando ${failed.length} caso(s) fallado(s) para reforzar.`);
  };

  window.resetPjsSimulator = function () {
    pjsAnswers = {};
    localStorage.setItem(STORAGE_KEYS.PJS_ANSWERS, JSON.stringify(pjsAnswers));
    activeCasesList = [];
    renderPjsSimulator();
    renderDashboard();
  };

  window.filterPjsBySelect = function (val) {
    currentPjsFilter = val;
    activeCasesList = [];
    renderPjsSimulator();
  };

  window.generateRandomSimulacro = function (count) {
    const pool = [...getAllCases()];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    activeCasesList = pool.slice(0, count);
    currentPjsFilter = "random";
    window.playSoundEffect("start");
    renderPjsSimulator();
  };

  function renderPjsSimulator() {
    const container = document.getElementById("pjs-cases-container");
    if (!container) return;

    let casesToRender = getAllCases();
    if ((currentPjsFilter === "random" || currentPjsFilter === "failed") && activeCasesList.length > 0) {
      casesToRender = activeCasesList;
    } else if (currentPjsFilter !== "all" && currentPjsFilter !== "random" && currentPjsFilter !== "failed") {
      if (currentPjsFilter.startsWith("bloque")) {
        casesToRender = casesToRender.filter(c => c.blockId === currentPjsFilter);
      } else {
        casesToRender = casesToRender.filter(c => c.indicatorId === currentPjsFilter);
      }
    }

    container.innerHTML = "";
    casesToRender.forEach((c, index) => {
      const userChoice = pjsAnswers[c.id];
      const isAnswered = !!userChoice;
      const indObj = window.INDICATORS_DATA.find(i => i.id === c.indicatorId);

      const card = document.createElement("div");
      card.className = "case-card";

      const renderOption = (letter) => {
        let btnClass = "option-btn";
        if (isAnswered) {
          if (letter === c.correct) btnClass += " correct";
          else if (letter === userChoice && userChoice !== c.correct) btnClass += " incorrect";
        }
        return `
          <button class="${btnClass}" ${isAnswered ? "disabled" : ""} onclick="window.answerPjsCase('${c.id}', '${letter}')">
            <span class="option-letter">${letter}</span>
            <span>${c.options[letter]}</span>
          </button>
        `;
      };

      const feedbackHtml = isAnswered
        ? `<div class="feedback-panel">
             <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
               <h4 style="margin:0;">${userChoice === c.correct ? "✅ ¡Respuesta Correcta!" : `❌ Respuesta Incorrecta (Elegiste ${userChoice} — La clave correcta es ${c.correct})`}</h4>
               <button class="btn-mini" onclick="window.retrySinglePjsCase('${c.id}')">🔄 Reintentar este caso</button>
             </div>
             <p style="margin-bottom:8px;"><strong>Fundamento Técnico y Jurídico (Clave ${c.correct}):</strong> ${c.explanation.correctWhy}</p>
             ${c.explanation.distractorA ? `<p style="font-size:0.84rem; color:var(--muted);">• <strong>Análisis Distractor A:</strong> ${c.explanation.distractorA}</p>` : ""}
             ${c.explanation.distractorB ? `<p style="font-size:0.84rem; color:var(--muted);">• <strong>Análisis Distractor B:</strong> ${c.explanation.distractorB}</p>` : ""}
             ${c.explanation.distractorC ? `<p style="font-size:0.84rem; color:var(--muted);">• <strong>Análisis Distractor C:</strong> ${c.explanation.distractorC}</p>` : ""}
           </div>`
        : "";

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
          <span class="pill accent">Reactivo #${index + 1} — ${c.title}</span>
          ${indObj ? `<button class="btn-mini" onclick="window.openIndicatorStudy('${indObj.id}')">📖 Ver Teoría: ${indObj.name}</button>` : ""}
        </div>
        <div class="case-context"><strong>Caso Situacional:</strong> ${c.context}</div>
        <div class="case-stem">${c.stem}</div>
        <div>
          ${renderOption("A")}
          ${renderOption("B")}
          ${renderOption("C")}
        </div>
        ${feedbackHtml}
      `;
      container.appendChild(card);
    });

    updatePjsKpi();
  }

  window.addCustomPjsCase = function (e) {
    e.preventDefault();
    const title = document.getElementById("new-case-title").value.trim();
    const indId = document.getElementById("new-case-ind").value;
    const context = document.getElementById("new-case-context").value.trim();
    const stem = document.getElementById("new-case-stem").value.trim();
    const optA = document.getElementById("new-case-a").value.trim();
    const optB = document.getElementById("new-case-b").value.trim();
    const optC = document.getElementById("new-case-c").value.trim();
    const correct = document.getElementById("new-case-correct").value;
    const why = document.getElementById("new-case-why").value.trim();

    if (!title || !context || !stem || !optA || !optB || !optC || !why) return;

    const indObj = window.INDICATORS_DATA.find(i => i.id === indId);
    const newCase = {
      id: "custom_" + Date.now(),
      indicatorId: indId,
      blockId: indObj ? indObj.blockId : "bloque1",
      title,
      context,
      stem,
      options: { A: optA, B: optB, C: optC },
      correct,
      explanation: { correctWhy: why }
    };

    customCases.push(newCase);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CASES, JSON.stringify(customCases));
    e.target.reset();
    window.playSoundEffect("achievement");
    window.showToast("💾 Nuevo caso de Juicio Situacional agregado a tu banco.");
    renderPjsSimulator();
  };

  // --------------------------------------------------------------------------
  // 6. SIMULADOR DE AUTOINFORME COMPORTAMENTAL E INTEGRIDAD (MODO B - 30%)
  // --------------------------------------------------------------------------
  const LIKERT_LABELS = [
    { val: 1, text: "1. Totalmente en desacuerdo" },
    { val: 2, text: "2. En desacuerdo" },
    { val: 3, text: "3. De acuerdo" },
    { val: 4, text: "4. Totalmente de acuerdo" }
  ];

  function getActiveAutoinformeItems() {
    const raw = window.AUTOINFORME_ITEMS || [];
    if (!autoShuffledOrder || !Array.isArray(autoShuffledOrder) || autoShuffledOrder.length !== raw.length) {
      return raw;
    }
    const map = new Map(raw.map(item => [item.id, item]));
    const reordered = autoShuffledOrder.map(id => map.get(id)).filter(Boolean);
    return reordered.length === raw.length ? reordered : raw;
  }

  window.answerAutoinforme = function (itemId, level) {
    autoAnswers[itemId] = level;
    localStorage.setItem(STORAGE_KEYS.AUTO_ANSWERS, JSON.stringify(autoAnswers));
    const item = (window.AUTOINFORME_ITEMS || []).find(x => x.id === itemId);
    if (item) {
      if (level === item.idealLevel) window.playSoundEffect("correct");
      else window.playSoundEffect("wrong");
      (item.indicatorIds || []).forEach(indId => checkAndAutoCompleteStep5(indId));
    }
    renderAutoinforme();
    renderStudyDetail();
    renderStudySidebar();
    renderDashboard();
  };

  window.resetAutoinforme = function () {
    autoAnswers = {};
    localStorage.setItem(STORAGE_KEYS.AUTO_ANSWERS, JSON.stringify(autoAnswers));
    renderAutoinforme();
    renderStudyDetail();
    window.showToast("🔄 Respuestas del simulador actual en blanco para practicar.");
  };

  window.shuffleAutoinforme = function () {
    const raw = [...(window.AUTOINFORME_ITEMS || [])];
    for (let i = raw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [raw[i], raw[j]] = [raw[j], raw[i]];
    }
    autoShuffledOrder = raw.map(it => it.id);
    localStorage.setItem(STORAGE_KEYS.AUTO_SHUFFLED_ORDER, JSON.stringify(autoShuffledOrder));
    renderAutoinforme();
    window.playSoundEffect("start");
    window.showToast("🔀 ¡Afirmaciones barajadas en nuevo orden aleatorio!");
  };

  window.saveAutoinformeAttempt = function () {
    const totalItems = (window.AUTOINFORME_ITEMS || []).length;
    const answeredKeys = Object.keys(autoAnswers);
    if (answeredKeys.length === 0) {
      window.showToast("⚠️ Primero responde algunas afirmaciones para poder guardar el intento.");
      return;
    }

    let alignedCount = 0;
    let trapsCount = 0;
    let details = {};

    (window.AUTOINFORME_ITEMS || []).forEach(item => {
      const chosen = autoAnswers[item.id];
      if (chosen !== undefined) {
        const isAligned = chosen === item.idealLevel;
        if (isAligned) alignedCount++;
        if (item.isControlTrap && chosen >= 3) trapsCount++;
        details[item.id] = {
          chosen,
          ideal: item.idealLevel,
          isAligned,
          statement: item.statement,
          category: item.category
        };
      }
    });

    const scorePct = Math.round((alignedCount / totalItems) * 100);
    const newAttempt = {
      id: "attempt_" + Date.now(),
      dateISO: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }),
      answeredCount: answeredKeys.length,
      totalItems,
      alignedCount,
      scorePct,
      trapsCount,
      answersSnapshot: { ...autoAnswers },
      details
    };

    autoAttempts.unshift(newAttempt);
    if (autoAttempts.length > 10) autoAttempts = autoAttempts.slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.AUTO_ATTEMPTS, JSON.stringify(autoAttempts));

    window.playSoundEffect("achievement");
    window.showToast(`💾 Intento guardado con éxito (${scorePct}% de alineación — ${alignedCount}/${totalItems}).`);
    renderAutoinforme();
  };

  window.restoreAutoinformeAttempt = function (attemptId) {
    const attempt = autoAttempts.find(a => a.id === attemptId);
    if (!attempt) return;
    autoAnswers = { ...(attempt.answersSnapshot || {}) };
    localStorage.setItem(STORAGE_KEYS.AUTO_ANSWERS, JSON.stringify(autoAnswers));
    renderAutoinforme();
    renderStudyDetail();
    renderStudySidebar();
    renderDashboard();
    window.showToast(`📂 Intento del ${attempt.dateFormatted} restaurado para repasar.`);
  };

  window.deleteAutoinformeAttempt = function (attemptId) {
    autoAttempts = autoAttempts.filter(a => a.id !== attemptId);
    localStorage.setItem(STORAGE_KEYS.AUTO_ATTEMPTS, JSON.stringify(autoAttempts));
    renderAutoinforme();
    window.showToast("🗑️ Intento eliminado del historial.");
  };

  function renderAutoinforme() {
    const container = document.getElementById("autoinforme-container");
    if (!container) return;

    const items = getActiveAutoinformeItems();
    let controlTrapsTriggered = 0;
    let alignedCount = 0;
    const answeredCount = Object.keys(autoAnswers).length;

    container.innerHTML = "";
    items.forEach((item, idx) => {
      const chosen = autoAnswers[item.id];
      const isAligned = chosen === item.idealLevel;
      if (chosen) {
        if (isAligned) alignedCount++;
        if (item.isControlTrap && chosen >= 3) controlTrapsTriggered++;
      }

      const card = document.createElement("div");
      card.className = "case-card";
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
          <span class="pill ${item.isControlTrap ? "warning" : "accent"}">Afirmación #${idx + 1} — ${item.category}</span>
          ${chosen ? `<span class="pill ${isAligned ? "success" : "warning"}">${isAligned ? "✅ Alineado" : "⚠️ Por Ajustar"}</span>` : ""}
        </div>
        <p style="font-size:0.98rem; font-weight:600; margin-bottom:10px;">«${item.statement}»</p>
        <div class="likert-row">
          ${LIKERT_LABELS.map(l => {
            let cls = "likert-btn";
            if (chosen === l.val) {
              cls += (l.val === item.idealLevel) ? " selected-best" : " selected-warn";
            }
            return `<button class="${cls}" onclick="window.answerAutoinforme('${item.id}', ${l.val})">${l.text}</button>`;
          }).join("")}
        </div>
        ${chosen ? `
          <div class="feedback-panel" style="margin-top:12px;">
            <h4>${isAligned ? "✅ Calibración Óptima con el Perfil DIAN" : `⚠️ Ajuste Recomendado: La respuesta ideal es «${LIKERT_LABELS.find(x => x.val === item.idealLevel).text}»`}</h4>
            <p>${item.explanation}</p>
          </div>
        ` : ""}
      `;
      container.appendChild(card);
    });

    // Banner resumen
    const summaryEl = document.getElementById("autoinforme-summary-banner");
    if (summaryEl) {
      const pct = Math.round((alignedCount / items.length) * 100);
      summaryEl.innerHTML = `
        <div>
          <strong>Reactivos Evaluados:</strong> ${answeredCount} / ${items.length} | 
          <strong>Alineación con Diccionario DIAN:</strong> ${alignedCount} (${pct}%)
        </div>
        <div>
          ${controlTrapsTriggered > 0
            ? `<span class="pill warning">🚨 ALERTA SUBESCALA DE CONTROL: Caíste en ${controlTrapsTriggered} trampa(s) de deseabilidad social</span>`
            : `<span class="pill success">🛡️ Subescala de Sinceridad / Control: Limpia (0 distorsiones)</span>`}
        </div>
      `;
    }

    // Historial de intentos
    const historyPanel = document.getElementById("autoinforme-history-panel");
    if (historyPanel) {
      if (autoAttempts.length === 0) {
        historyPanel.innerHTML = `
          <div style="font-size:0.83rem; color:var(--muted); background:rgba(0,0,0,0.15); padding:8px 12px; border-radius:6px; border:1px dashed var(--border);">
            💡 <em>Aún no has guardado ningún intento. Cuando respondas varias afirmaciones, haz clic en «💾 Guardar Intento» para crear un registro y poder comparar tus mejoras.</em>
          </div>
        `;
      } else {
        historyPanel.innerHTML = `
          <div style="background:rgba(0,0,0,0.2); padding:10px 14px; border-radius:8px; border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.86rem; font-weight:700; color:var(--text);">📋 Historial de Intentos Guardados (${autoAttempts.length}):</span>
              <span style="font-size:0.75rem; color:var(--muted);">Haz clic en «Repasar» para cargar las respuestas marcadas</span>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              ${autoAttempts.map(att => `
                <div style="background:var(--bg-card, #0f172a); border:1px solid var(--border); padding:8px 10px; border-radius:6px; font-size:0.8rem; display:flex; align-items:center; gap:8px;">
                  <div>
                    <strong>${att.dateFormatted}</strong>: <span style="color:var(--success); font-weight:700;">${att.scorePct}%</span> (${att.alignedCount}/${att.totalItems})
                    ${att.trapsCount > 0 ? `<span style="color:var(--warning); font-size:0.72rem;"> · ⚠️ ${att.trapsCount} trampa</span>` : ""}
                  </div>
                  <button class="btn-mini" onclick="window.restoreAutoinformeAttempt('${att.id}')" title="Cargar este intento en pantalla para repasar">👁️ Repasar</button>
                  <button class="btn-mini" style="color:var(--danger, #f43f5e);" onclick="window.deleteAutoinformeAttempt('${att.id}')" title="Borrar del historial">✕</button>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }
    }
  }

  // --------------------------------------------------------------------------
  // 7. TALLERES PRÁCTICOS (FLASHCARDS, TRD, EXCEL Y LÓGICA)
  // --------------------------------------------------------------------------
  function renderWorkshops() {
    const fcGrid = document.getElementById("flashcards-grid");
    if (fcGrid) {
      fcGrid.innerHTML = "";
      window.FLASHCARDS_DATA.forEach((fc, idx) => {
        const card = document.createElement("div");
        card.className = "flashcard";
        card.innerHTML = `
          <div>
            <span class="pill accent" style="font-size:0.72rem;">${fc.cat}</span>
            <p class="fc-front" style="margin-top:12px; font-weight:700; font-size:0.95rem;">❓ ${fc.q}</p>
            <p class="fc-back" style="margin-top:12px; display:none; color:var(--success); font-weight:600; font-size:0.92rem; white-space:pre-line;">✅ ${fc.a}</p>
          </div>
          <div style="font-size:0.76rem; color:var(--muted); margin-top:12px; text-align:right;">Haz clic para voltear 🔄 (#${idx + 1})</div>
        `;
        card.addEventListener("click", () => {
          const isFlipped = card.classList.toggle("flipped");
          card.querySelector(".fc-front").style.display = isFlipped ? "none" : "block";
          card.querySelector(".fc-back").style.display = isFlipped ? "block" : "none";
        });
        fcGrid.appendChild(card);
      });
    }

    const trdBody = document.getElementById("trd-table-body");
    const trdSelect = document.getElementById("trd-calc-series");
    if (trdBody) {
      trdBody.innerHTML = window.TRD_MATRIX_DATA.map(row => `
        <tr>
          <td><strong>${row.codigo}</strong><br><span style="font-size:0.76rem; color:var(--muted);">${row.dependencia}</span></td>
          <td><strong>${row.serie}</strong><br>${row.subserie}<br><em style="font-size:0.78rem; color:var(--muted);">Tipos: ${row.tipos}</em></td>
          <td style="text-align:center; font-weight:700;">${row.retencionAG} años</td>
          <td style="text-align:center; font-weight:700;">${row.retencionAC} años</td>
          <td style="text-align:center;"><span class="pill accent">${row.disposicion}</span></td>
          <td style="font-size:0.82rem;">${row.procedimiento}</td>
        </tr>
      `).join("");
    }
    if (trdSelect) {
      trdSelect.innerHTML = window.TRD_MATRIX_DATA.map((r, i) => `<option value="${i}">${r.codigo} — ${r.subserie}</option>`).join("");
      window.calculateTrdDates();
    }

    const exContainer = document.getElementById("excel-logic-container");
    if (exContainer) {
      exContainer.innerHTML = "";
      window.EXCEL_LOGIC_EXERCISES.forEach((ex, i) => {
        const div = document.createElement("div");
        div.className = "case-card";
        div.innerHTML = `
          <span class="pill accent">Taller #${i + 1} — ${ex.type}</span>
          <p style="margin:10px 0; font-weight:600;">${ex.question}</p>
          <div id="ex-opts-${ex.id}">
            ${ex.options.map((opt, oIdx) => `
              <button class="option-btn" onclick="window.checkWorkshopEx('${ex.id}', ${oIdx})">
                <span class="option-letter">${oIdx + 1}</span>
                <code>${opt}</code>
              </button>
            `).join("")}
          </div>
          <div id="ex-fb-${ex.id}" class="feedback-panel" style="display:none;"></div>
        `;
        exContainer.appendChild(div);
      });
    }
  }

  window.calculateTrdDates = function () {
    const idx = parseInt(document.getElementById("trd-calc-series")?.value || "0", 10);
    const closeYear = parseInt(document.getElementById("trd-calc-year")?.value || "2026", 10);
    const out = document.getElementById("trd-calc-output");
    if (!out) return;

    const item = window.TRD_MATRIX_DATA[idx];
    const yearPrimaryTransfer = closeYear + item.retencionAG;
    const yearFinalDisp = yearPrimaryTransfer + item.retencionAC;

    out.innerHTML = `
      <strong>📌 Resultado para «${item.subserie}» (Cerrado en ${closeYear}):</strong><br>
      • Permanece en <strong>Archivo de Gestión (AG)</strong> durante <strong>${item.retencionAG} año(s)</strong> → <strong>Transferencia Primaria al Archivo Central (AC) en: ${yearPrimaryTransfer}</strong>.<br>
      • Permanece en <strong>Archivo Central (AC)</strong> durante <strong>${item.retencionAC} año(s)</strong> → <strong>Disposición Final (${item.disposicion}) en el año: ${yearFinalDisp}</strong>.<br>
      <span style="font-size:0.84rem; color:var(--warning);">${item.procedimiento}</span>
    `;
  };

  window.checkWorkshopEx = function (exId, chosenIdx) {
    const ex = window.EXCEL_LOGIC_EXERCISES.find(x => x.id === exId);
    const fb = document.getElementById("ex-fb-" + exId);
    const optsWrap = document.getElementById("ex-opts-" + exId);
    if (!ex || !fb || !optsWrap) return;

    if (chosenIdx === ex.correctIndex) window.playSoundEffect("correct");
    else window.playSoundEffect("wrong");

    optsWrap.querySelectorAll(".option-btn").forEach((btn, idx) => {
      btn.classList.remove("correct", "incorrect");
      if (idx === ex.correctIndex) btn.classList.add("correct");
      else if (idx === chosenIdx) btn.classList.add("incorrect");
    });

    fb.style.display = "block";
    fb.innerHTML = `
      <h4>${chosenIdx === ex.correctIndex ? "✅ ¡Correcto!" : "❌ Revisa la regla técnica"}</h4>
      <p>${ex.explanation}</p>
    `;
  };

  // --------------------------------------------------------------------------
  // 8. MÓDULO 7: MODO LECTURA E IMPRESIÓN EN NORMAS APA 7.ª EDICIÓN
  // --------------------------------------------------------------------------
  window.setApaMode = function (mode) {
    currentApaMode = mode;
    renderApaView();
  };

  window.openApaSingleIndicator = function (indId) {
    currentApaMode = "single_" + indId;
    window.switchTab("apa");
  };

  function renderApaView() {
    const paper = document.getElementById("apa-paper-content");
    if (!paper) return;

    const nowStr = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
    const allInds = window.INDICATORS_DATA;
    const completedInds = allInds.filter(i => !!progressState[i.id]);
    const pendingInds = allInds.filter(i => !progressState[i.id]);
    const focusInd = allInds.find(i => i.id === currentFocusId) || allInds[0];
    const pjsStats = updatePjsKpi();
    const globalNotes = localStorage.getItem(STORAGE_KEYS.NOTES_GLOBAL) || "Sin apuntes globales registrados.";

    const nombre = window.DIAN_PROFILE.nombreAspirante || "Marcelino Garavito";

    if (currentApaMode === "progress") {
      paper.innerHTML = `
        <h1>Informe Ejecutivo de Avance y Plan de Estudio: Convocatoria DIAN 2676</h1>
        <p style="text-align:center;"><strong>Aspirante:</strong> ${nombre} (Inscripción N.º ${window.DIAN_PROFILE.inscripcion}) | <strong>Cargo:</strong> ${window.DIAN_PROFILE.cargo} (${window.DIAN_PROFILE.nivel}) | <strong>OPEC:</strong> ${window.DIAN_PROFILE.opec}</p>
        <p style="text-align:center;"><strong>Fecha de Corte del Informe:</strong> ${nowStr} | <strong>Examen Escrito:</strong> ${window.DIAN_PROFILE.fechaExamenTexto}</p>

        <h2>1. Estado Actual de Avance y Continuidad</h2>
        <table>
          <thead>
            <tr>
              <th>Indicador de Control</th>
              <th>Resultado Actual</th>
              <th>Meta Oficial</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Indicadores Evaluables Dominados</td>
              <td>${completedInds.length} de ${allInds.length} (${Math.round((completedInds.length / allInds.length) * 100)} %)</td>
              <td>22 de 22 (100 %)</td>
            </tr>
            <tr>
              <td>Indicador Actual en Estudio (Punto de Retoma)</td>
              <td>${focusInd.name}</td>
              <td>Continuidad Diaria</td>
            </tr>
            <tr>
              <td>Desempeño en Simulador de Juicio Situacional (PJS)</td>
              <td>${pjsStats.numScore.toFixed(1)} puntos (${pjsStats.hits}/${pjsStats.totalAnswered} casos)</td>
              <td>Mínimo: 70.00 | Meta: +85.00</td>
            </tr>
          </tbody>
        </table>

        <h2>2. Indicadores Ya Dominados (${completedInds.length})</h2>
        <ul>
          ${completedInds.map(i => `<li><strong>${i.name}</strong> (${i.normaBase}) ${indNotesState[i.id] ? `<br><em>Nota personal: ${indNotesState[i.id]}</em>` : ""}</li>`).join("") || "<li>Aún no se han marcado indicadores como dominados (Arranque desde Indicador #1).</li>"}
        </ul>

        <h2>3. Indicadores Pendientes por Estudiar (${pendingInds.length})</h2>
        <ul>
          ${pendingInds.map(i => `<li><strong>${i.name}</strong> — <em>Resumen clave:</em> ${i.quickSummary || i.normaBase}</li>`).join("")}
        </ul>

        <h2>4. Bitácora General de Apuntes y Trampas del Examen</h2>
        <p style="white-space:pre-line;">${globalNotes}</p>
      `;
    } else if (currentApaMode === "notebook") {
      const lib = window.DIAN_PROFILE.sistemaLibreta;
      paper.innerHTML = `
        <h1>Manual de Escritura a Mano y Sistema de Libreta Física (Método Cornell DIAN 2676)</h1>
        <p style="text-align:center;"><strong>Aspirante:</strong> ${nombre} | <strong>Empleo:</strong> Facilitador I (OPEC 236908) | <strong>Normas APA 7.ª Edición</strong></p>

        <h2>1. Elección de Cuaderno: ¿Libreta Cuadriculada o Libreta Rayada?</h2>
        <p>${lib.eleccionCuaderno}</p>
        <p>${lib.reglaOro}</p>

        <h2>2. Mapa Visual Exacto de tu PÁGINA #1 en la Libreta Cuadriculada (Indicador #1)</h2>
        ${window.buildVisualGridNotebookHtml(allInds[0], 6)}

        <h2>3. Código Oficial de Colores para tus Útiles (Lapicero, Lápiz y Marcadores)</h2>
        <table>
          <thead>
            <tr>
              <th>Útil de Escritura</th>
              <th>Qué debes escribir o resaltar con él en tu libreta</th>
            </tr>
          </thead>
          <tbody>
            ${lib.colores.map(c => `
              <tr>
                <td><strong>${c.util}</strong></td>
                <td>${c.uso}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <h2>4. Estructura Exacta de cada Página de tu Cuaderno (Plantilla Cornell de 4 Zonas)</h2>
        <ul>
          <li><strong>ZONA SUPERIOR (3 cuadritos con Lapicero):</strong> Número de página (1 al 22), Nombre del Indicador y Norma Base exacta.</li>
          <li><strong>COLUMNA IZQUIERDA (10 cuadritos de ancho — Con Marcador Amarillo/Verde):</strong> Números, plazos en días hábiles, artículos y siglas clave (ej. 10 d, 15 d, 30 d, 5 d, máx. 200 folios, AG/AC/AH, FALSO en BUSCARV).</li>
          <li><strong>COLUMNA DERECHA (Resto de la hoja — Con Lápiz HB y Lapicero):</strong> Esquema de cómo actúa el <strong>Facilitador I</strong> (Recibir → Verificar formalmente → Radicar → Escalar sin usurpar funciones).</li>
          <li><strong>FRANJA INFERIOR (4 cuadritos con Marcador Naranja/Rojo):</strong> «TRAMPA MORTAL CNSC»: La opción distractora que jamás debes marcar en el examen.</li>
        </ul>

        <h2>5. Guía Rápida de tus 22 Páginas (Qué copiar a mano en cada Indicador)</h2>
        <table>
          <thead>
            <tr>
              <th>Pág. / Indicador</th>
              <th>Norma Base (Lapicero)</th>
              <th>Datos y Plazos Clave para resaltar con Marcador</th>
            </tr>
          </thead>
          <tbody>
            ${allInds.map(i => `
              <tr>
                <td><strong>Pág. ${i.num}:</strong> ${i.name}</td>
                <td>${i.normaBase}</td>
                <td>${i.quickSummary || i.normaBase}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    } else if (currentApaMode === "compendium") {
      paper.innerHTML = `
        <h1>Compendio Normativo y Técnico de los 22 Indicadores Evaluables — DIAN 2676</h1>
        <p style="text-align:center;"><strong>Aspirante:</strong> ${nombre} | <strong>Empleo:</strong> Facilitador I (Nivel Asistencial) — OPEC 236908 | Normas APA 7.ª Edición</p>
        ${allInds.map(ind => `
          <h2>${ind.name} (${ind.tag})</h2>
          <p><strong>Normativa base:</strong> ${ind.normaBase}</p>
          <h3>Síntesis ejecutiva y artículos clave</h3>
          <div>${ind.step1}</div>
          <h3>Aplicación funcional como Facilitador I</h3>
          <div>${ind.step2}</div>
          <h3>Trampas frecuentes de evaluación CNSC</h3>
          <div>${ind.step3}</div>
          ${indNotesState[ind.id] ? `<p><strong>Apuntes personales de ${nombre}:</strong> ${indNotesState[ind.id]}</p>` : ""}
        `).join("")}
      `;
    } else if (currentApaMode === "cases") {
      const allC = getAllCases();
      paper.innerHTML = `
        <h1>Cuadernillo Oficial de Entrenamiento en Pruebas de Juicio Situacional (PJS) — DIAN 2676</h1>
        <p style="text-align:center;"><strong>Aspirante:</strong> ${nombre} | <strong>Total de Casos:</strong> ${allC.length} reactivos comentados | OPEC 236908</p>
        ${allC.map((c, idx) => `
          <h2>Reactivo ${idx + 1}: ${c.title}</h2>
          <p><strong>Caso situacional:</strong> ${c.context}</p>
          <p><strong>Enunciado:</strong> ${c.stem}</p>
          <ul>
            <li><strong>A.</strong> ${c.options.A}</li>
            <li><strong>B.</strong> ${c.options.B}</li>
            <li><strong>C.</strong> ${c.options.C}</li>
          </ul>
          <p><strong>Clave correcta: Opción ${c.correct}.</strong> ${c.explanation.correctWhy}</p>
        `).join("")}
      `;
    } else if (currentApaMode.startsWith("single_")) {
      const indId = currentApaMode.replace("single_", "");
      const ind = allInds.find(i => i.id === indId) || allInds[0];
      const indCases = getAllCases().filter(c => c.indicatorId === ind.id);
      paper.innerHTML = `
        <h1>Ficha de Estudio Individual (APA 7.ª ed.): ${ind.name}</h1>
        <p style="text-align:center;"><strong>Aspirante:</strong> ${nombre} | <strong>Bloque:</strong> ${ind.blockName} | <strong>Norma Base:</strong> ${ind.normaBase}</p>
        <h2>1. Síntesis Ejecutiva</h2>
        <div>${ind.step1}</div>
        <h2>2. Traducción al Rol de Facilitador I</h2>
        <div>${ind.step2}</div>
        <h2>3. Alertas y Trampas CNSC</h2>
        <div>${ind.step3}</div>
        <h2>4. Casos de Juicio Situacional Asociados (${indCases.length})</h2>
        ${indCases.map(c => `
          <h3>${c.title}</h3>
          <p><strong>Caso:</strong> ${c.context}</p>
          <p><strong>Pregunta:</strong> ${c.stem}</p>
          <p><strong>Respuesta correcta (${c.correct}):</strong> ${c.explanation.correctWhy}</p>
        `).join("")}
      `;
    }
  }

  // --------------------------------------------------------------------------
  // 9. EXPORTAR / IMPORTAR PROGRESO Y NOTAS GLOBALES
  // --------------------------------------------------------------------------
  window.exportBackupJson = function () {
    const payload = {
      exportedAt: new Date().toISOString(),
      progressState,
      microStepsState,
      checkedResources,
      lastPosition,
      dailyPace,
      readerTheme,
      currentFocusId,
      indNotesState,
      globalNotes: localStorage.getItem(STORAGE_KEYS.NOTES_GLOBAL) || "",
      pjsAnswers,
      customCases,
      autoAnswers,
      unlockedAch
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Respaldo_DIAN_2676_OPEC_236908.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.showToast("⬇️ Respaldo <code>.json</code> descargado correctamente.");
  };

  window.importBackupJson = function (event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.progressState) {
          progressState = data.progressState;
          localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressState));
        }
        if (data.microStepsState) {
          microStepsState = data.microStepsState;
          localStorage.setItem(STORAGE_KEYS.MICRO_STEPS, JSON.stringify(microStepsState));
        }
        if (data.checkedResources) {
          checkedResources = data.checkedResources;
          localStorage.setItem(STORAGE_KEYS.CHECKED_RESOURCES, JSON.stringify(checkedResources));
        }
        if (data.lastPosition) {
          lastPosition = data.lastPosition;
          localStorage.setItem(STORAGE_KEYS.LAST_POSITION, JSON.stringify(lastPosition));
        }
        if (data.dailyPace) {
          dailyPace = data.dailyPace;
          localStorage.setItem(STORAGE_KEYS.DAILY_PACE, JSON.stringify(dailyPace));
        }
        if (data.readerTheme) {
          readerTheme = data.readerTheme;
          localStorage.setItem(STORAGE_KEYS.READER_THEME, readerTheme);
        }
        if (data.currentFocusId) {
          currentFocusId = data.currentFocusId;
          localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, currentFocusId);
        }
        if (data.indNotesState) {
          indNotesState = data.indNotesState;
          localStorage.setItem(STORAGE_KEYS.NOTES_BY_IND, JSON.stringify(indNotesState));
        }
        if (typeof data.globalNotes === "string") {
          localStorage.setItem(STORAGE_KEYS.NOTES_GLOBAL, data.globalNotes);
          const notesEl = document.getElementById("notes-area");
          if (notesEl) notesEl.value = data.globalNotes;
        }
        if (data.pjsAnswers) {
          pjsAnswers = data.pjsAnswers;
          localStorage.setItem(STORAGE_KEYS.PJS_ANSWERS, JSON.stringify(pjsAnswers));
        }
        if (data.customCases) {
          customCases = data.customCases;
          localStorage.setItem(STORAGE_KEYS.CUSTOM_CASES, JSON.stringify(customCases));
        }
        if (data.autoAnswers) {
          autoAnswers = data.autoAnswers;
          localStorage.setItem(STORAGE_KEYS.AUTO_ANSWERS, JSON.stringify(autoAnswers));
        }
        initApp();
        window.showToast("✅ Respaldo restaurado exitosamente.");
      } catch (_) {}
    };
    reader.readAsText(file);
  };

  function populateSelectControls() {
    const pjsSelect = document.getElementById("pjs-filter-select");
    const newCaseInd = document.getElementById("new-case-ind");
    if (pjsSelect) {
      const indOptions = window.INDICATORS_DATA.map(i => `<option value="${i.id}">${i.name}</option>`).join("");
      pjsSelect.innerHTML = `
        <option value="all">Todos los Bloques e Indicadores (30 Casos)</option>
        <option value="bloque1">Bloque 1: Identidad, Ética y Servicio al Ciudadano</option>
        <option value="bloque2">Bloque 2: Gestión Documental y Oficina</option>
        <option value="bloque3">Bloque 3: Competencias Comportamentales</option>
        <option value="bloque4">Bloque 4: Herramientas y Razonamiento</option>
        <optgroup label="Filtrar por Indicador Específico">
          ${indOptions}
        </optgroup>
      `;
    }
    if (newCaseInd) {
      newCaseInd.innerHTML = window.INDICATORS_DATA.map(i => `<option value="${i.id}">${i.name}</option>`).join("");
    }
  }

  function initApp() {
    document.body.classList.toggle("low-gpu", lowGpuMode);
    applyReaderVisualSettings();
    updateHeaderToggles();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    updateTimerDisplay();
    setupGlobalSearch();
    populateSelectControls();

    const notesArea = document.getElementById("notes-area");
    if (notesArea) {
      notesArea.value = localStorage.getItem(STORAGE_KEYS.NOTES_GLOBAL) || "";
      notesArea.addEventListener("input", () => {
        localStorage.setItem(STORAGE_KEYS.NOTES_GLOBAL, notesArea.value);
      });
    }

    renderDashboard();
    renderStudySidebar();
    renderStudyDetail();
    renderPjsSimulator();
    renderAutoinforme();
    renderWorkshops();
    renderApaView();

    const savedMainTab = localStorage.getItem(STORAGE_KEYS.ACTIVE_MAIN_TAB);
    if (savedMainTab && document.getElementById("tab-" + savedMainTab)) {
      window.switchTab(savedMainTab);
    }
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();

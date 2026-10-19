// ============================================================================
// LÓGICA PRINCIPAL DE LA PLATAFORMA TODO-EN-UNO DIAN 2676 (FACILITADOR I)
// ============================================================================

(function () {
  const STORAGE_KEYS = {
    PROGRESS: "dian2676_progress",
    CURRENT_FOCUS: "dian2676_current_focus",
    NOTES_GLOBAL: "dian2676_notes",
    NOTES_BY_IND: "dian2676_ind_notes",
    PJS_ANSWERS: "dian2676_pjs_answers",
    CUSTOM_CASES: "dian2676_custom_cases",
    AUTO_ANSWERS: "dian2676_auto_answers",
    SOUND_ENABLED: "dian2676_sound_enabled",
    LOW_GPU_MODE: "dian2676_low_gpu",
    UNLOCKED_ACH: "dian2676_unlocked_ach",
    ZERO_INIT_DONE: "dian2676_zero_init_v3"
  };

  // Si es la primera vez tras configurar el arranque desde cero, limpiamos el foco en #1 y progreso en 0/22
  if (!localStorage.getItem(STORAGE_KEYS.ZERO_INIT_DONE)) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, "{}");
    localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, "ind1");
    localStorage.setItem(STORAGE_KEYS.ZERO_INIT_DONE, "true");
  }

  let progressState = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || "{}");
  let currentFocusId = localStorage.getItem(STORAGE_KEYS.CURRENT_FOCUS) || "ind1";
  let indNotesState = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES_BY_IND) || "{}");
  let pjsAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PJS_ANSWERS) || "{}");
  let customCases = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_CASES) || "[]");
  let autoAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTO_ANSWERS) || "{}");
  let soundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== "false";
  let lowGpuMode = localStorage.getItem(STORAGE_KEYS.LOW_GPU_MODE) === "true";
  let unlockedAch = JSON.parse(localStorage.getItem(STORAGE_KEYS.UNLOCKED_ACH) || "[]");

  let activeIndicatorId = currentFocusId;
  let currentStudyFilter = "all";
  let currentPjsFilter = "all";
  let activeCasesList = [];
  let currentApaMode = "progress";

  function getAllCases() {
    return [...window.PJS_CASES, ...customCases];
  }

  // --------------------------------------------------------------------------
  // 0. MOTOR DE SONIDOS, ALARMAS Y NOTIFICACIONES (WEB AUDIO API)
  // --------------------------------------------------------------------------
  window.playSoundEffect = function (type, forcePlay) {
    if (!soundEnabled && !forcePlay) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
        // Tonos ascendentes de enfoque
        playTone(440, 0, 0.15, "sine", 0.14);
        playTone(554.37, 0.14, 0.15, "sine", 0.14);
        playTone(659.25, 0.28, 0.28, "sine", 0.16);
      } else if (type === "correct") {
        // Acierto en simulador
        playTone(587.33, 0, 0.12, "triangle", 0.16);
        playTone(880, 0.11, 0.25, "triangle", 0.18);
      } else if (type === "wrong") {
        // Alerta suave de error
        playTone(260, 0, 0.18, "sawtooth", 0.1);
        playTone(195, 0.16, 0.25, "sawtooth", 0.1);
      } else if (type === "achievement") {
        // Fanfarria de logro / indicador dominado
        playTone(523.25, 0, 0.13, "triangle", 0.18);
        playTone(659.25, 0.12, 0.13, "triangle", 0.18);
        playTone(783.99, 0.24, 0.13, "triangle", 0.18);
        playTone(1046.5, 0.36, 0.42, "triangle", 0.22);
      } else if (type === "alarm") {
        // Alarma de fin de bloque Pomodoro
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
      soundBtn.textContent = soundEnabled ? "🔊 Sonidos: ON" : "🔇 Silencio";
    }
    const gpuBtn = document.getElementById("btn-toggle-gpu");
    if (gpuBtn) {
      gpuBtn.textContent = lowGpuMode ? "⚡ Modo Fluido 27\": ON" : "🖥️ Modo Fluido 27\": OFF";
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
    if (targetBtn) targetBtn.classList.add("active");
    if (tabId === "apa") renderApaView();
    window.scrollTo({ top: 0, behavior: lowGpuMode ? "auto" : "smooth" });
  };

  window.setCurrentFocusIndicator = function (indId, openStudyNow) {
    currentFocusId = indId;
    activeIndicatorId = indId;
    localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, indId);
    renderDashboard();
    renderStudySidebar();
    renderStudyDetail();
    const indObj = window.INDICATORS_DATA.find(i => i.id === indId);
    if (indObj && !openStudyNow) {
      window.showToast(`📍 Marcado como tu punto actual: <strong>${indObj.name}</strong>`);
    }
    if (openStudyNow) {
      window.switchTab("study");
    }
  };

  window.openIndicatorStudy = function (indId) {
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
              window.openIndicatorCases(c.indicatorId);
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
  // 3. DASHBOARD: BRÚJULA DE CONTINUIDAD, SPRINTS, LOGROS E INDICADORES
  // --------------------------------------------------------------------------
  window.toggleIndicatorDone = function (indId, checked) {
    progressState[indId] = checked;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressState));

    if (checked) {
      window.playSoundEffect("achievement");
      // Si marcó como dominado el que tenía en foco, avanzar foco automáticamente al siguiente pendiente
      const nextPending = window.INDICATORS_DATA.find(i => !progressState[i.id]);
      if (nextPending && currentFocusId === indId) {
        currentFocusId = nextPending.id;
        localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, currentFocusId);
      }
      const indObj = window.INDICATORS_DATA.find(i => i.id === indId);
      if (indObj) {
        window.showToast(`✅ ¡Dominado! <strong>${indObj.name}</strong>`);
      }
    }

    renderDashboard();
    renderStudySidebar();
    renderStudyDetail();
  };

  window.startFromZeroInd1 = function () {
    progressState = {};
    currentFocusId = "ind1";
    activeIndicatorId = "ind1";
    localStorage.setItem(STORAGE_KEYS.PROGRESS, "{}");
    localStorage.setItem(STORAGE_KEYS.CURRENT_FOCUS, "ind1");
    renderDashboard();
    renderStudySidebar();
    renderStudyDetail();
    window.playSoundEffect("start");
    window.showToast("🔄 ¡Listo Marcelino! Punto de partida fijado en el <strong>Indicador #1 (Misionalidad DIAN)</strong>.");
  };

  function renderContinuityCompass() {
    const compassEl = document.getElementById("continuity-compass-container");
    if (!compassEl) return;

    const focusInd = window.INDICATORS_DATA.find(i => i.id === currentFocusId) || window.INDICATORS_DATA[0];
    const focusIdx = window.INDICATORS_DATA.findIndex(i => i.id === focusInd.id);
    const nextPending = window.INDICATORS_DATA.find((i, idx) => idx > focusIdx && !progressState[i.id])
      || window.INDICATORS_DATA.find(i => !progressState[i.id]);

    const fase1Ids = ["ind1","ind2","ind3","ind4","ind5","ind6","ind7","ind8","ind9"];
    const fase1Done = fase1Ids.filter(id => !!progressState[id]).length;

    compassEl.innerHTML = `
      <div style="flex:1; min-width:280px;">
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:6px;">
          <span class="pill warning">📍 AQUÍ QUEDASTE ESTUDIANDO (${window.DIAN_PROFILE.nombreAspirante})</span>
          <span class="pill accent">Meta Fase 1 (Ind. 1 al 9): ${fase1Done} / 9 completados</span>
        </div>
        <h2 style="font-size:1.22rem; color:var(--text); margin-bottom:4px;">${focusInd.name}</h2>
        <p style="font-size:0.86rem; color:var(--muted); margin-bottom:6px;">
          <strong>Resumen rápido:</strong> ${focusInd.quickSummary || focusInd.normaBase}
        </p>
        <div style="font-size:0.83rem; color:var(--accent);">
          ⏭️ <strong>Qué sigue después:</strong> ${nextPending ? nextPending.name : "¡Has completado los 22 indicadores! Pasa a Simulacros Generales."}
        </div>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <button class="btn success" onclick="window.openIndicatorStudy('${focusInd.id}')">▶️ Estudiar Teoría (#${focusInd.num})</button>
        <button class="btn secondary" style="border:1px solid var(--accent);" onclick="window.openNotebookMapForIndicator('${focusInd.id}')">📓 Mapa Hoja Cuadriculada (#${focusInd.num})</button>
        <button class="btn warning" onclick="window.openIndicatorCases('${focusInd.id}')">⚖️ Practicar Casos (#${focusInd.num})</button>
        ${nextPending && nextPending.id !== focusInd.id
          ? `<button class="btn secondary" onclick="window.setCurrentFocusIndicator('${nextPending.id}', true)">⏭️ Pasar al #${nextPending.num}</button>`
          : ""}
        ${focusInd.id !== "ind1" || Object.keys(progressState).length > 0
          ? `<button class="btn-mini" onclick="window.startFromZeroInd1()" title="Fijar el punto de inicio en el Indicador #1 desde cero">🔄 Ir a #1 (Desde Cero)</button>`
          : ""}
      </div>
    `;
  }

  window.openNotebookMapForIndicator = function (indId) {
    window.setCurrentFocusIndicator(indId, true);
    setTimeout(() => {
      const anchor = document.getElementById("notebook-visual-anchor");
      if (anchor) {
        anchor.scrollIntoView({ behavior: lowGpuMode ? "auto" : "smooth", block: "center" });
      }
    }, 120);
  };

  function renderCatchupSprints() {
    const sprintsEl = document.getElementById("catchup-sprints-container");
    if (!sprintsEl || !window.DIAN_PROFILE.sprintsDesatraso) return;

    sprintsEl.innerHTML = window.DIAN_PROFILE.sprintsDesatraso.map(sp => {
      const doneCount = sp.indicadores.filter(id => !!progressState[id]).length;
      const totalCount = sp.indicadores.length;
      const isAllDone = doneCount === totalCount;
      const firstPendingId = sp.indicadores.find(id => !progressState[id]) || sp.indicadores[0];

      return `
        <div class="sprint-card ${isAllDone ? "completed" : ""}">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
            <strong style="color:${isAllDone ? "var(--success)" : "var(--warning)"}; font-size:0.92rem;">
              ${isAllDone ? "✅" : "⚡"} ${sp.titulo}
            </strong>
            <span class="pill ${isAllDone ? "success" : "accent"}">${doneCount}/${totalCount} listos</span>
          </div>
          <p style="font-size:0.83rem; color:var(--text); margin:6px 0 4px;"><strong>Objetivo:</strong> ${sp.meta}</p>
          <p style="font-size:0.8rem; color:var(--muted); margin-bottom:8px;"><strong>Plan de acción:</strong> ${sp.pasoAPaso}</p>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn-mini" onclick="window.openIndicatorStudy('${firstPendingId}')">
              📖 Ir a ${isAllDone ? "Repasar Sprint" : "Indicador Pendiente"}
            </button>
            <button class="btn-mini" onclick="window.startTimer(45, '${sp.titulo.replace(/'/g, "")}')">
              ⏱️ Iniciar Reloj para este Sprint
            </button>
          </div>
        </div>
      `;
    }).join("");
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
    renderContinuityCompass();
    renderCatchupSprints();

    const container = document.getElementById("indicators-container");
    if (!container) return;

    const groups = {};
    window.INDICATORS_DATA.forEach(ind => {
      if (!groups[ind.blockId]) {
        groups[ind.blockId] = { title: ind.blockName, items: [] };
      }
      groups[ind.blockId].items.push(ind);
    });

    container.innerHTML = "";
    let total = 0;
    let completed = 0;

    Object.values(groups).forEach(group => {
      const groupDone = group.items.filter(i => !!progressState[i.id]).length;
      const div = document.createElement("div");
      div.className = "indicator-group";
      div.innerHTML = `<h3><span>${group.title}</span><span>${groupDone}/${group.items.length}</span></h3>`;

      group.items.forEach(item => {
        total++;
        const isChecked = !!progressState[item.id];
        const isCurrentFocus = item.id === currentFocusId;
        if (isChecked) completed++;
        const badgeClass = item.tag.toLowerCase();
        const itemCasesCount = getAllCases().filter(c => c.indicatorId === item.id).length;

        const row = document.createElement("div");
        row.className = "indicator-item" + (isChecked ? " done" : "") + (isCurrentFocus ? " current-focus" : "");
        row.innerHTML = `
          <label>
            <input type="checkbox" ${isChecked ? "checked" : ""} onchange="window.toggleIndicatorDone('${item.id}', this.checked)" />
            <span>${isCurrentFocus ? "📍 " : ""}${item.name}</span>
          </label>
          <span class="badge ${badgeClass}">${item.tag}</span>
          <button class="btn-mini" title="Marcar que vas por aquí" onclick="window.setCurrentFocusIndicator('${item.id}', false)">📍 Aquí voy</button>
          <button class="btn-mini" onclick="window.openIndicatorStudy('${item.id}')">📖 Teoría</button>
          <button class="btn-mini" onclick="window.openIndicatorCases('${item.id}')">⚖️ Casos (${itemCasesCount})</button>
        `;
        div.appendChild(row);
      });

      container.appendChild(div);
    });

    const pct = Math.round((completed / total) * 100);
    const bar = document.getElementById("progress-bar");
    if (bar) {
      bar.style.width = `${pct}%`;
      bar.textContent = `${pct}% (${completed}/${total} Indicadores Dominados)`;
    }

    const kpiInd = document.getElementById("kpi-indicators-val");
    if (kpiInd) kpiInd.textContent = `${completed} / ${total} (${pct}%)`;

    const focusInd = window.INDICATORS_DATA.find(i => i.id === currentFocusId);
    const kpiIndSub = document.getElementById("kpi-indicators-sub");
    if (kpiIndSub && focusInd) {
      kpiIndSub.textContent = `En curso: #${focusInd.num} (${focusInd.name.slice(0, 32)}...)`;
    }

    const pjsStats = updatePjsKpi();
    renderAchievements(completed, pjsStats.numScore, pjsStats.totalAnswered);
    renderRoutineAndRules();
  }

  function renderRoutineAndRules() {
    const routineContainer = document.getElementById("routine-list-container");
    if (routineContainer) {
      const now = new Date();
      const minsNow = now.getHours() * 60 + now.getMinutes();
      routineContainer.innerHTML = "";
      let activeTitle = "Horario Flexible / Desatraso";

      window.DIAN_PROFILE.rutinaHoraria.forEach(slot => {
        const isCurrent = minsNow >= slot.startMin && minsNow < slot.endMin;
        if (isCurrent) activeTitle = `${slot.rango} — ${slot.titulo}`;
        const li = document.createElement("li");
        li.className = isCurrent ? "active-slot" : "";
        li.innerHTML = `<strong>${slot.rango} (${slot.titulo}):</strong> ${slot.detalle}`;
        routineContainer.appendChild(li);
      });

      const kpiSlot = document.getElementById("kpi-slot-val");
      if (kpiSlot) kpiSlot.textContent = activeTitle;
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

    musicContainer.innerHTML = window.DIAN_PROFILE.estacionMusica.map(m => `
      <div class="music-track-row">
        <div style="flex:1; min-width:210px;">
          <div style="font-size:0.74rem; color:var(--warning); font-weight:700;">${m.fase}</div>
          <div style="font-size:0.86rem; font-weight:700; color:var(--text);">${m.nombre}</div>
          <div style="font-size:0.75rem; color:var(--muted);">${m.razon}</div>
        </div>
        <div style="display:flex; gap:6px;">
          <a href="${m.ytUrl}" target="_blank" rel="noopener" class="btn-mini" style="text-decoration:none; border-color:#ef4444; color:#fca5a5;">▶️ YouTube</a>
          <a href="${m.spUrl}" target="_blank" rel="noopener" class="btn-mini" style="text-decoration:none; border-color:#22c55e; color:#86efac;">🎧 Spotify</a>
        </div>
      </div>
    `).join("");

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
      window.showToast("🎧 ¡Tu playlist personal quedó guardada en el Centro de Mando!");
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
  // 4. MÓDULO DE ESTUDIO DE LOS 22 INDICADORES (MÉTODO DE 3 PASOS + RECURSOS)
  // --------------------------------------------------------------------------
  window.setStudyFilter = function (blockFilter) {
    currentStudyFilter = blockFilter;
    renderStudySidebar();
  };

  function renderStudySidebar() {
    const listEl = document.getElementById("study-sidebar-list");
    if (!listEl) return;

    const filtered = window.INDICATORS_DATA.filter(ind => {
      if (currentStudyFilter === "all") return true;
      if (currentStudyFilter === "pending") return !progressState[ind.id];
      return ind.blockId === currentStudyFilter;
    });

    listEl.innerHTML = "";
    filtered.forEach(ind => {
      const isDone = !!progressState[ind.id];
      const isActive = ind.id === activeIndicatorId;
      const isFocus = ind.id === currentFocusId;
      const btn = document.createElement("button");
      btn.className = "study-nav-btn" + (isActive ? " active" : "");
      btn.innerHTML = `
        <span>${isDone ? "✅" : (isFocus ? "📍" : "⬜")} ${ind.name}</span>
        <span class="badge ${ind.tag.toLowerCase()}">${ind.tag}</span>
      `;
      btn.addEventListener("click", () => {
        window.setCurrentFocusIndicator(ind.id, false);
      });
      listEl.appendChild(btn);
    });
  }

  function renderStudyDetail() {
    const viewEl = document.getElementById("study-detail-view");
    if (!viewEl) return;

    const idx = window.INDICATORS_DATA.findIndex(i => i.id === activeIndicatorId);
    const ind = window.INDICATORS_DATA[idx] || window.INDICATORS_DATA[0];
    const isDone = !!progressState[ind.id];
    const prevInd = idx > 0 ? window.INDICATORS_DATA[idx - 1] : null;
    const nextInd = idx < window.INDICATORS_DATA.length - 1 ? window.INDICATORS_DATA[idx + 1] : null;
    const relatedCases = getAllCases().filter(c => c.indicatorId === ind.id);

    const linksHtml = ind.links && ind.links.length > 0
      ? `<div class="step-box" style="border-left-color:var(--purple);">
           <h3>🔗 Recursos Directos y Normativa de este Indicador</h3>
           <ul class="links-list">
             ${ind.links.map(l => `<li><a href="${l.url}" target="_blank" rel="noopener">${l.label}</a></li>`).join("")}
           </ul>
         </div>`
      : "";

    viewEl.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <span class="pill accent">${ind.blockName}</span>
            <span class="badge ${ind.tag.toLowerCase()}" style="margin-left:6px;">${ind.tag}</span>
            <h2 style="margin-top:8px; font-size:1.3rem;">${ind.name}</h2>
            <p style="font-size:0.85rem; color:var(--muted);">Normativa Base: <strong>${ind.normaBase}</strong></p>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <label style="display:flex; align-items:center; gap:8px; background:#090d16; padding:8px 12px; border-radius:8px; border:1px solid var(--border); cursor:pointer; font-size:0.86rem; font-weight:600;">
              <input type="checkbox" ${isDone ? "checked" : ""} onchange="window.toggleIndicatorDone('${ind.id}', this.checked)" />
              <span>${isDone ? "Indicador Dominado ✅" : "Marcar como Dominado"}</span>
            </label>
            <button class="btn warning" onclick="window.openIndicatorCases('${ind.id}')">
              ⚖️ Practicar Casos (${relatedCases.length})
            </button>
            <button class="btn secondary" onclick="window.openApaSingleIndicator('${ind.id}')">
              📄 Ver en Formato APA
            </button>
          </div>
        </div>

        ${ind.quickSummary ? `
          <div style="background:rgba(56, 189, 248, 0.1); border:1px solid var(--accent); border-radius:8px; padding:10px 14px; margin-bottom:14px; font-size:0.9rem;">
            <strong>⚡ Ficha Flash de Memoria:</strong> ${ind.quickSummary}
          </div>
        ` : ""}

        <div class="step-box">
          <h3>📘 Paso 1: Síntesis Ejecutiva sin Relleno (Artículos, Plazos y Conceptos Exactos)</h3>
          <div class="step-content">${ind.step1}</div>
        </div>

        <div class="step-box step-2">
          <h3>🏛️ Paso 2: Traducción al Lenguaje DIAN (Cómo aplica en tu puesto de Facilitador I)</h3>
          <div class="step-content">${ind.step2}</div>
        </div>

        <div class="step-box step-3">
          <h3>🎯 Paso 3: Trampas Típicas de la CNSC que debes detectar</h3>
          <div class="step-content">${ind.step3}</div>
        </div>

        <div id="notebook-visual-anchor" class="step-box" style="border-left-color:#f43f5e; background:rgba(244,63,94,0.06);">
          <h3>📓 Mapa Visual de tu Libreta Cuadriculada — Página #${ind.num} (Cópialo así a mano)</h3>
          <p style="font-size:0.84rem; color:var(--muted); margin-bottom:8px;">
            Usa tu <strong>Libreta Cuadriculada</strong> como cuaderno principal. Aquí tienes el plano exacto de cómo distribuir tu hoja con <strong>Lapicero, Lápiz HB y Marcadores</strong>:
          </p>
          ${window.buildVisualGridNotebookHtml(ind, relatedCases.length)}
        </div>

        ${linksHtml}

        <div class="step-box" style="border-left-color:var(--muted);">
          <h3>📝 Mis Apuntes Digitales Específicos para este Indicador (#${ind.num})</h3>
          <textarea id="ind-specific-note" class="notes-area" style="min-height:95px;" placeholder="Escribe aquí tus resúmenes o nemotecnias para ${ind.name}...">${indNotesState[ind.id] || ""}</textarea>
        </div>

        <div style="display:flex; justify-content:space-between; margin-top:14px;">
          ${prevInd ? `<button class="btn secondary" onclick="window.openIndicatorStudy('${prevInd.id}')">⬅️ Anterior: #${prevInd.num}</button>` : `<span></span>`}
          ${nextInd ? `<button class="btn" onclick="window.openIndicatorStudy('${nextInd.id}')">Siguiente: #${nextInd.num} ➡️</button>` : `<span></span>`}
        </div>
      </div>
    `;

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
        <div><strong>Casos Resueltos:</strong> ${totalAnswered} de ${allCases.length} | <strong>Aciertos:</strong> ${hits} | <strong>Puntaje Simulado:</strong> ${score} / 100</div>
        <div>${statusBadge}</div>
      `;
    }
    return { totalAnswered, hits, numScore };
  }

  window.answerPjsCase = function (caseId, chosenOption) {
    pjsAnswers[caseId] = chosenOption;
    localStorage.setItem(STORAGE_KEYS.PJS_ANSWERS, JSON.stringify(pjsAnswers));
    const c = getAllCases().find(item => item.id === caseId);
    if (c) {
      if (chosenOption === c.correct) {
        window.playSoundEffect("correct");
      } else {
        window.playSoundEffect("wrong");
      }
    }
    renderPjsSimulator();
    renderDashboard();
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
    if (currentPjsFilter === "random" && activeCasesList.length > 0) {
      casesToRender = activeCasesList;
    } else if (currentPjsFilter !== "all" && currentPjsFilter !== "random") {
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
             <h4>${userChoice === c.correct ? "✅ ¡Respuesta Correcta!" : `❌ Respuesta Incorrecta (Elegiste ${userChoice} — La clave correcta es ${c.correct})`}</h4>
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

  window.answerAutoinforme = function (itemId, level) {
    autoAnswers[itemId] = level;
    localStorage.setItem(STORAGE_KEYS.AUTO_ANSWERS, JSON.stringify(autoAnswers));
    const item = window.AUTOINFORME_ITEMS.find(x => x.id === itemId);
    if (item) {
      if (level === item.idealLevel) window.playSoundEffect("correct");
      else window.playSoundEffect("wrong");
    }
    renderAutoinforme();
  };

  window.resetAutoinforme = function () {
    autoAnswers = {};
    localStorage.setItem(STORAGE_KEYS.AUTO_ANSWERS, JSON.stringify(autoAnswers));
    renderAutoinforme();
  };

  function renderAutoinforme() {
    const container = document.getElementById("autoinforme-container");
    if (!container) return;

    let controlTrapsTriggered = 0;
    let alignedCount = 0;
    const answeredCount = Object.keys(autoAnswers).length;

    container.innerHTML = "";
    window.AUTOINFORME_ITEMS.forEach((item, idx) => {
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

    const summaryEl = document.getElementById("autoinforme-summary-banner");
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div><strong>Reactivos Evaluados:</strong> ${answeredCount} / ${window.AUTOINFORME_ITEMS.length} | <strong>Alineación con Diccionario DIAN:</strong> ${alignedCount}</div>
        <div>
          ${controlTrapsTriggered > 0
            ? `<span class="pill warning">🚨 ALERTA DE SUBESCALA DE CONTROL: Caíste en ${controlTrapsTriggered} trampa(s) de deseabilidad social</span>`
            : `<span class="pill success">🛡️ Subescala de Sinceridad / Control: Limpia (0 alertas de distorsión)</span>`}
        </div>
      `;
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
        ${window.buildVisualGridNotebookHtml(allInds[0], 4)}

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
        <option value="all">Todos los Bloques e Indicadores (26 Casos)</option>
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
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();

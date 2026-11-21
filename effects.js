
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let soundEnabled = true;
  let animationsEnabled = !prefersReducedMotion;
  let audioContext = null;
  let toastTimeout = null;

  function getAudioContext() {
    if (!soundEnabled) return null;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;

      if (!audioContext) audioContext = new AudioContextClass();

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      return audioContext;
    } catch (error) {
      return null;
    }
  }

  function playTone(frequency, duration, type, volume, delay) {
    const context = getAudioContext();
    if (!context) return;

    try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + (delay || 0);

      oscillator.type = type || "sine";
      oscillator.frequency.setValueAtTime(frequency, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume || 0.035, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    } catch (error) {
      // Zvuk je doplňkový efekt; jeho nedostupnost neovlivní hru.
    }
  }

  function sound(name) {
    if (!soundEnabled) return;

    switch (name) {
      case "click":
        playTone(520, 0.07, "sine", 0.018);
        break;

      case "success":
        playTone(523, 0.13, "sine", 0.035);
        playTone(659, 0.16, "sine", 0.035, 0.10);
        playTone(784, 0.22, "sine", 0.035, 0.20);
        break;

      case "great":
        playTone(523, 0.14, "sine", 0.04);
        playTone(659, 0.14, "sine", 0.04, 0.10);
        playTone(784, 0.16, "sine", 0.04, 0.20);
        playTone(1047, 0.28, "sine", 0.035, 0.31);
        break;

      case "miss":
        playTone(330, 0.16, "triangle", 0.025);
        playTone(247, 0.20, "triangle", 0.02, 0.12);
        break;

      case "tick":
        playTone(740, 0.035, "sine", 0.012);
        break;

      case "finish":
        playTone(392, 0.18, "sine", 0.035);
        playTone(494, 0.18, "sine", 0.035, 0.13);
        playTone(587, 0.24, "sine", 0.035, 0.26);
        playTone(784, 0.35, "sine", 0.04, 0.40);
        break;

      default:
        playTone(440, 0.06, "sine", 0.015);
    }
  }

  function setSoundEnabled(enabled) {
    soundEnabled = Boolean(enabled);
  }

  function setAnimationsEnabled(enabled) {
    animationsEnabled = Boolean(enabled);
    document.body.classList.toggle("animations-off", !animationsEnabled);
  }

  function animate(element, className, duration) {
    if (!element || !animationsEnabled) return;

    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);

    window.setTimeout(() => {
      element.classList.remove(className);
    }, duration || 650);
  }

  function transitionPage(oldPage, newPage) {
    if (!newPage) return;

    if (oldPage && oldPage !== newPage) {
      oldPage.classList.remove("page-enter");
    }

    newPage.classList.remove("page-enter");
    void newPage.offsetWidth;

    if (animationsEnabled) {
      newPage.classList.add("page-enter");

      window.setTimeout(() => {
        newPage.classList.remove("page-enter");
      }, 500);
    }
  }

  function showToast(message, type) {
    let toast = document.getElementById("toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = String(message || "");
    toast.className = "toast";

    if (type) toast.classList.add("toast-" + type);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    window.clearTimeout(toastTimeout);

    toastTimeout = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function createParticles(container, count, intensity) {
    if (!container || !animationsEnabled) return;

    const total = Math.max(1, Math.min(70, Number(count) || 24));
    const strength = Math.max(0.3, Math.min(2, Number(intensity) || 1));

    const layer = document.createElement("div");
    layer.className = "particle-layer";
    layer.setAttribute("aria-hidden", "true");

    for (let i = 0; i < total; i++) {
      const particle = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const distance = (45 + Math.random() * 150) * strength;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = 3 + Math.random() * 5;

      particle.className = "particle";
      particle.style.setProperty("--particle-x", x + "px");
      particle.style.setProperty("--particle-y", y + "px");
      particle.style.setProperty("--particle-size", size + "px");
      particle.style.animationDelay = (Math.random() * 180) + "ms";

      layer.appendChild(particle);
    }

    container.appendChild(layer);

    window.setTimeout(() => {
      layer.remove();
    }, 1400);
  }

  function celebrate(element, level) {
    if (!element) return;

    const intensity = level === "great" ? 1.5 : 1;
    createParticles(element, level === "great" ? 42 : 24, intensity);
    animate(element, "celebrate-pop", 650);

    sound(level === "great" ? "great" : "success");
  }

  function setFlightProgress(progress, feedback) {
    const character = document.getElementById("gameCharacter");
    const scene = document.querySelector(".game-scene");

    const normalized = Math.max(0, Math.min(1, Number(progress) || 0));

    if (character) {
      character.style.setProperty("--flight-progress", normalized.toFixed(3));
      character.classList.remove("is-great", "is-low");

      if (normalized >= 0.8) {
        character.classList.add("is-great");
      } else if (normalized <= 0.3) {
        character.classList.add("is-low");
      }
    }

    if (scene) {
      scene.style.setProperty("--scene-progress", normalized.toFixed(3));
    }

    const heightLabel = document.getElementById("sceneHeightLabel");

    if (heightLabel) {
      if (normalized >= 0.85) {
        heightLabel.textContent = "AMAZING FLIGHT";
      } else if (normalized >= 0.65) {
        heightLabel.textContent = "HIGH FLIGHT";
      } else if (normalized >= 0.4) {
        heightLabel.textContent = "NICE FLIGHT";
      } else if (normalized >= 0.2) {
        heightLabel.textContent = "KEEP CLIMBING";
      } else {
        heightLabel.textContent = "WARMING UP";
      }
    }

    const feedbackElement = document.getElementById("sceneFeedback");

    if (feedbackElement && feedback) {
      feedbackElement.textContent = feedback;
    }
  }

  function animateFlight(progress, feedback) {
    const target = Math.max(0, Math.min(1, Number(progress) || 0));

    if (!animationsEnabled) {
      setFlightProgress(target, feedback);
      return;
    }

    const character = document.getElementById("gameCharacter");
    if (!character) {
      setFlightProgress(target, feedback);
      return;
    }

    const start = Number(
      getComputedStyle(character).getPropertyValue("--flight-progress")
    ) || 0;

    const startTime = performance.now();
    const duration = 1000;

    function frame(now) {
      const elapsed = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 4);
      const current = start + (target - start) * eased;

      setFlightProgress(current, elapsed >= 1 ? feedback : "");

      if (elapsed < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  function pulseTimer(secondsLeft) {
    const timer = document.querySelector(".timer-display");
    if (!timer) return;

    timer.classList.toggle("timer-warning", secondsLeft <= 10);
    timer.classList.toggle("timer-critical", secondsLeft <= 5);

    if (secondsLeft <= 5 && secondsLeft > 0) {
      sound("tick");
    }
  }

  function bindHoverEffects() {
    if (!animationsEnabled) return;

    const selectors = [
      ".mode-card",
      ".category-card",
      ".daily-card",
      ".plus-feature",
      ".leaderboard-row"
    ];

    document.querySelectorAll(selectors.join(",")).forEach(element => {
      if (element.dataset.effectsBound === "true") return;
      element.dataset.effectsBound = "true";

      element.addEventListener("mouseenter", () => {
        element.classList.add("hover-lift");
      });

      element.addEventListener("mouseleave", () => {
        element.classList.remove("hover-lift");
      });
    });
  }

  function bindButtonSounds() {
    document.addEventListener("click", event => {
      const button = event.target.closest("button, .button, .mode-card");
      if (!button || button.disabled) return;

      sound("click");
    });
  }

  function init() {
    setAnimationsEnabled(animationsEnabled);
    bindHoverEffects();
    bindButtonSounds();

    const observer = new MutationObserver(() => {
      bindHoverEffects();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  window.DazurioEffects = {
    init,
    sound,
    setSoundEnabled,
    setAnimationsEnabled,
    animate,
    transitionPage,
    showToast,
    createParticles,
    celebrate,
    setFlightProgress,
    animateFlight,
    pulseTimer,
    bindHoverEffects
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

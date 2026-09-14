/**
 * =========================================================================
 * 🌸 SAKURA PROPOSAL APP CONTROLLER 🌸
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.PROPOSAL_CONFIG;

  // Initialize Engines
  const sakura = new SakuraEngine('petalsCanvas');
  const audio = new RomanticAudio();

  // State
  let currentStage = 1;
  let noEscapeCount = 0;
  let yesScaleMultiplier = 1;

  // DOM Elements - Header & Audio
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicText = document.getElementById('musicText');

  // DOM Elements - Stepper
  const stepIndicators = [
    document.getElementById('stepIndicator1'),
    document.getElementById('stepIndicator2'),
    document.getElementById('stepIndicator3'),
    document.getElementById('stepIndicator4')
  ];
  const stepLines = [
    document.getElementById('stepLine1'),
    document.getElementById('stepLine2'),
    document.getElementById('stepLine3')
  ];

  // DOM Elements - Stages
  const stages = {
    1: document.getElementById('stage1'),
    2: document.getElementById('stage2'),
    3: document.getElementById('stage3'),
    4: document.getElementById('stage4'),
    celebration: document.getElementById('stageCelebration')
  };

  // -------------------------------------------------------------------------
  // 1. Audio Handler
  // -------------------------------------------------------------------------
  const updateAudioUI = (isPlaying) => {
    if (isPlaying) {
      musicToggleBtn.classList.add('playing');
      musicText.textContent = 'Melody Playing 🌸';
    } else {
      musicToggleBtn.classList.remove('playing');
      musicText.textContent = 'Play Melody 🎵';
    }
  };

  musicToggleBtn.addEventListener('click', () => {
    const isPlaying = audio.toggleMusic();
    updateAudioUI(isPlaying);
  });

  // Autostart audio on first user gesture anywhere
  const handleFirstInteraction = () => {
    audio.ensureUnlocked();
    if (!audio.isPlaying && config.music.autoPlayPrompt) {
      audio.play();
      updateAudioUI(true);
    }
    window.removeEventListener('click', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
    window.removeEventListener('touchstart', handleFirstInteraction);
  };
  window.addEventListener('click', handleFirstInteraction);
  window.addEventListener('keydown', handleFirstInteraction);
  window.addEventListener('touchstart', handleFirstInteraction);

  // -------------------------------------------------------------------------
  // 2. Stepper Update Helper
  // -------------------------------------------------------------------------
  const updateStepper = (stageNum) => {
    stepIndicators.forEach((indicator, idx) => {
      const stepIndex = idx + 1;
      indicator.classList.remove('active', 'completed');
      if (stepIndex === stageNum) {
        indicator.classList.add('active');
      } else if (stepIndex < stageNum) {
        indicator.classList.add('completed');
      }
    });

    stepLines.forEach((line, idx) => {
      if (idx + 1 < stageNum) {
        line.classList.add('filled');
      } else {
        line.classList.remove('filled');
      }
    });
  };

  // -------------------------------------------------------------------------
  // 3. String Match Normalizer
  // -------------------------------------------------------------------------
  const normalize = (str) => {
    return (str || '')
      .toLowerCase()
      .replace(/[\s\-_,./\\:]+/g, '')
      .trim();
  };

  const checkAnswer = (userInput, acceptedList) => {
    const normInput = normalize(userInput);
    if (!normInput) return false;

    return acceptedList.some(ans => {
      const normAns = normalize(ans);
      return normInput === normAns || normInput.includes(normAns) || normAns.includes(normInput);
    });
  };

  // -------------------------------------------------------------------------
  // 4. Stage Transition Engine
  // -------------------------------------------------------------------------
  const goToStage = (targetStage) => {
    // Hide current stage
    Object.values(stages).forEach(sec => {
      if (sec) sec.classList.remove('active');
    });

    currentStage = targetStage;

    setTimeout(() => {
      if (typeof targetStage === 'number' && stages[targetStage]) {
        stages[targetStage].classList.add('active');
        updateStepper(targetStage);
      } else if (targetStage === 'celebration' && stages.celebration) {
        stages.celebration.classList.add('active');
        updateStepper(4);
      }

      // If entering Proposal Stage, start the cinematic reveal sequence
      if (targetStage === 4) {
        playProposalNarrative();
      }
    }, 150);
  };

  // -------------------------------------------------------------------------
  // 5. Setup Stage 1 (Date of Birth)
  // -------------------------------------------------------------------------
  const s1 = config.stage1;
  document.getElementById('s1WelcomeText').textContent = s1.welcomeText;
  document.getElementById('s1QuestionText').textContent = s1.question;
  const s1Input = document.getElementById('s1Input');
  s1Input.placeholder = s1.placeholder;
  const s1Form = document.getElementById('s1Form');
  const s1HintBtn = document.getElementById('s1HintBtn');
  const s1HintBox = document.getElementById('s1HintBox');
  const s1Feedback = document.getElementById('s1Feedback');
  const s1SubmitBtn = document.getElementById('s1SubmitBtn');
  const s1NextBtn = document.getElementById('s1NextBtn');

  s1HintBox.textContent = s1.hint;
  s1HintBtn.addEventListener('click', () => {
    s1HintBox.classList.toggle('show');
  });

  s1Form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = s1Input.value.trim();
    if (checkAnswer(value, s1.acceptedAnswers)) {
      // Success
      audio.playSuccessSound();
      sakura.burstHearts(window.innerWidth / 2, window.innerHeight * 0.45, 25);
      sakura.burstPetals(25);

      s1Feedback.textContent = s1.successMessage;
      s1Feedback.className = 'feedback-msg success';
      s1Input.disabled = true;
      s1SubmitBtn.classList.add('hidden');
      s1NextBtn.classList.remove('hidden');
      s1HintBox.classList.remove('show');
    } else {
      // Wrong
      audio.playWrongSound();
      s1Feedback.textContent = s1.errorMessage;
      s1Feedback.className = 'feedback-msg error';
      s1Input.classList.remove('shake');
      void s1Input.offsetWidth; // retrigger animation
      s1Input.classList.add('shake');
    }
  });

  s1NextBtn.addEventListener('click', () => {
    sakura.burstPetals(30);
    goToStage(2);
  });

  // -------------------------------------------------------------------------
  // 6. Setup Stage 2 (Scooty Memory)
  // -------------------------------------------------------------------------
  const s2 = config.stage2;
  document.getElementById('s2QuestionText').textContent = s2.question;
  const s2Input = document.getElementById('s2Input');
  s2Input.placeholder = s2.placeholder;
  const s2Form = document.getElementById('s2Form');
  const s2HintBtn = document.getElementById('s2HintBtn');
  const s2HintBox = document.getElementById('s2HintBox');
  const s2Feedback = document.getElementById('s2Feedback');
  const s2SubmitBtn = document.getElementById('s2SubmitBtn');
  const s2NextBtn = document.getElementById('s2NextBtn');

  s2HintBox.textContent = s2.hint;
  s2HintBtn.addEventListener('click', () => {
    s2HintBox.classList.toggle('show');
  });

  s2Form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = s2Input.value.trim();
    if (checkAnswer(value, s2.acceptedAnswers)) {
      // Success
      audio.playSuccessSound();
      sakura.burstHearts(window.innerWidth / 2, window.innerHeight * 0.45, 25);
      sakura.burstPetals(25);

      s2Feedback.textContent = s2.successMessage;
      s2Feedback.className = 'feedback-msg success';
      s2Input.disabled = true;
      s2SubmitBtn.classList.add('hidden');
      s2NextBtn.classList.remove('hidden');
      s2HintBox.classList.remove('show');
    } else {
      // Wrong
      audio.playWrongSound();
      s2Feedback.textContent = s2.errorMessage;
      s2Feedback.className = 'feedback-msg error';
      s2Input.classList.remove('shake');
      void s2Input.offsetWidth;
      s2Input.classList.add('shake');
    }
  });

  s2NextBtn.addEventListener('click', () => {
    sakura.burstPetals(30);
    goToStage(3);
  });

  // -------------------------------------------------------------------------
  // 7. Setup Stage 3 (When We First Met)
  // -------------------------------------------------------------------------
  const s3 = config.stage3;
  document.getElementById('s3QuestionText').textContent = s3.question;
  const s3Input = document.getElementById('s3Input');
  s3Input.placeholder = s3.placeholder;
  const s3Form = document.getElementById('s3Form');
  const s3HintBtn = document.getElementById('s3HintBtn');
  const s3HintBox = document.getElementById('s3HintBox');
  const s3Feedback = document.getElementById('s3Feedback');
  const s3SubmitBtn = document.getElementById('s3SubmitBtn');
  const s3NextBtn = document.getElementById('s3NextBtn');

  s3HintBox.textContent = s3.hint;
  s3HintBtn.addEventListener('click', () => {
    s3HintBox.classList.toggle('show');
  });

  s3Form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = s3Input.value.trim();
    if (checkAnswer(value, s3.acceptedAnswers)) {
      // Success
      audio.playSuccessSound();
      sakura.burstHearts(window.innerWidth / 2, window.innerHeight * 0.45, 35);
      sakura.burstPetals(35);

      s3Feedback.textContent = s3.successMessage; // "You really remember our memories... 🥹❤️"
      s3Feedback.className = 'feedback-msg success';
      s3Input.disabled = true;
      s3SubmitBtn.classList.add('hidden');
      s3NextBtn.classList.remove('hidden');
      s3HintBox.classList.remove('show');
    } else {
      // Wrong
      audio.playWrongSound();
      s3Feedback.textContent = s3.errorMessage;
      s3Feedback.className = 'feedback-msg error';
      s3Input.classList.remove('shake');
      void s3Input.offsetWidth;
      s3Input.classList.add('shake');
    }
  });

  s3NextBtn.addEventListener('click', () => {
    sakura.burstPetals(50);
    goToStage(4);
  });

  // -------------------------------------------------------------------------
  // 8. FINAL STAGE: Proposal Narrative & Runaway NO Button
  // -------------------------------------------------------------------------
  const proposalConfig = config.proposal;
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  const line3 = document.getElementById('line3');
  const proposalClimax = document.getElementById('proposalClimax');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const noBtnWrapper = document.getElementById('noBtnWrapper');
  const noTooltip = document.getElementById('noTooltip');
  const actionArena = document.getElementById('actionArena');

  line1.textContent = proposalConfig.preludeLines[0];
  line2.textContent = proposalConfig.preludeLines[1];
  line3.textContent = proposalConfig.preludeLines[2];
  document.getElementById('proposalQuestionText').textContent = proposalConfig.question;

  const playProposalNarrative = () => {
    // Reset lines
    line1.classList.remove('visible');
    line2.classList.remove('visible');
    line3.classList.remove('visible');
    proposalClimax.classList.remove('revealed');

    // Step 1: Line 1 fades in
    setTimeout(() => {
      line1.classList.add('visible');
      sakura.burstHearts(window.innerWidth / 2, window.innerHeight * 0.35, 12);
    }, 700);

    // Step 2: Line 2 fades in
    setTimeout(() => {
      line2.classList.add('visible');
      sakura.burstHearts(window.innerWidth / 2, window.innerHeight * 0.42, 16);
    }, 2200);

    // Step 3: Line 3 fades in
    setTimeout(() => {
      line3.classList.add('visible');
      sakura.burstHearts(window.innerWidth / 2, window.innerHeight * 0.48, 20);
    }, 3800);

    // Step 4: Big Climax Reveal
    setTimeout(() => {
      proposalClimax.classList.add('revealed');
      audio.playSuccessSound();
      sakura.burstPetals(40);
      sakura.burstHearts(window.innerWidth / 2, window.innerHeight * 0.5, 30);
    }, 5400);
  };

  // Evasive "Runaway" NO Button Logic
  const runAwayNoButton = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    noEscapeCount++;
    const escapes = proposalConfig.noButtonEscapes;
    const randomMsg = escapes[noEscapeCount % escapes.length];

    // Show tooltip
    noTooltip.textContent = randomMsg;
    noTooltip.classList.remove('hidden');

    // Calculate arena and window bounds to ensure it NEVER leaves the screen
    const arenaRect = actionArena.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Bounds restricted to visible window with safe margins
    const margin = 20;
    const minX = -arenaRect.left + margin;
    const maxX = window.innerWidth - arenaRect.left - btnRect.width - margin;
    const minY = -arenaRect.top + margin + 60; // keep below header
    const maxY = window.innerHeight - arenaRect.top - btnRect.height - margin;

    // Pick random coordinate that is sufficiently distant from current position
    let newX = minX + Math.random() * (maxX - minX);
    let newY = minY + Math.random() * (maxY - minY);

    // Smooth transform
    noBtnWrapper.style.transform = `translate(${newX}px, ${newY}px)`;

    // Playful touch: YES button grows slightly bigger each time!
    yesScaleMultiplier = Math.min(1.45, yesScaleMultiplier + 0.05);
    yesBtn.style.transform = `scale(${yesScaleMultiplier})`;

    // Trigger playful audio sound
    audio.playWrongSound();
  };

  // Trigger escape on desktop hover or mobile touch
  noBtn.addEventListener('mouseenter', runAwayNoButton);
  noBtn.addEventListener('touchstart', runAwayNoButton, { passive: false });
  noBtn.addEventListener('pointerdown', runAwayNoButton);
  noBtn.addEventListener('click', runAwayNoButton);

  // YES Button Celebration
  yesBtn.addEventListener('click', () => {
    audio.playCelebrationFanfare();
    sakura.grandCelebration();

    // Fill Celebration details
    const cel = proposalConfig.celebration;
    document.getElementById('celebrationHeading').textContent = cel.headline;
    document.getElementById('celebrationSubtext').textContent = cel.subtext;
    document.getElementById('letterTitle').textContent = cel.letterTitle;
    document.getElementById('letterBody').textContent = cel.letterBody;
    document.getElementById('letterSign').textContent = `${config.proposerName} ❤️`;

    goToStage('celebration');
  });

  // -------------------------------------------------------------------------
  // 9. Restart Journey
  // -------------------------------------------------------------------------
  const restartBtn = document.getElementById('restartBtn');
  restartBtn.addEventListener('click', () => {
    // Reset inputs & feedback
    [s1Input, s2Input, s3Input].forEach(inp => {
      inp.value = '';
      inp.disabled = false;
    });
    [s1Feedback, s2Feedback, s3Feedback].forEach(f => {
      f.textContent = '';
      f.className = 'feedback-msg';
    });
    [s1SubmitBtn, s2SubmitBtn, s3SubmitBtn].forEach(b => b.classList.remove('hidden'));
    [s1NextBtn, s2NextBtn, s3NextBtn].forEach(b => b.classList.add('hidden'));

    // Reset proposal elements
    noEscapeCount = 0;
    yesScaleMultiplier = 1;
    yesBtn.style.transform = 'scale(1)';
    noBtnWrapper.style.transform = 'translate(0px, 0px)';
    noTooltip.classList.add('hidden');

    goToStage(1);
  });
});

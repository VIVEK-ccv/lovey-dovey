/**
 * =========================================================================
 * 🌸 SAKURA PROPOSAL CONFIGURATION 🌸
 * =========================================================================
 * You can customize all questions, accepted answers, hints, and romantic
 * messages right here without touching any HTML/CSS code!
 */

const CONFIG = {
  // Names to personalize the experience
  partnerName: "My Love",
  proposerName: "Yours Forever",

  // Music Settings
  music: {
    title: "Romantic Sakura Melody",
    autoPlayPrompt: true, // Will start or prompt on first interaction
    synthesizerEnabled: true, // Uses built-in soothing piano & harp synthesizer
    customAudioUrl: "", // Optional: Paste a direct URL or local path to your MP3 file (e.g. "music.mp3")
  },

  // STAGE 1: The Birthday Question
  stage1: {
    welcomeText: "Let's see how well you know me... ❤️",
    question: "What is my Date of Birth? 🎂",
    placeholder: "e.g., 14 September or 14/09/2000",
    // All accepted answers (case-insensitive, spaces & punctuation are automatically handled)
    acceptedAnswers: [
      "14 September",
      "14th September",
      "September 14",
      "Sep 14",
      "14/09",
      "14-09",
      "14/09/2000",
      "14-09-2000",
      "14/9",
      "2000-09-14",
      "14th Sep",
      "14 Sept"
    ],
    hint: "Think about the day a special person entered this world 🎂✨",
    errorMessage: "Oops! Try again 😜❤️",
    successMessage: "Yay! You remembered! That was easy, right? 🌸🥰",
    nextButtonText: "Next Stage 🌸 →"
  },

  // STAGE 2: Scooty Memory
  stage2: {
    question: "Do you remember my Scooty Number? 🛵❤️",
    placeholder: "e.g., MH 12 AB 1234 or 1234",
    // Matches if input contains any of these or matches exactly (spaces removed automatically)
    acceptedAnswers: [
      "MH12AB1234",
      "1234",
      "AB1234",
      "MH12",
      "DL01AB1234",
      "KA01AB1234",
      "HR26AB1234"
    ],
    hint: "Those late-night rides under the breeze... Look closely at the digits! 🛵💨",
    errorMessage: "Hmm, not quite! Don't tell me you forgot our favorite ride! 😜❤️",
    successMessage: "Spot on! Every ride with you is my favorite journey 🛵💕",
    nextButtonText: "Next Memory ✨ →"
  },

  // STAGE 3: When We First Met
  stage3: {
    question: "Do you remember when we first met? ❤️",
    placeholder: "e.g., 12 February or 12/02/2023 or Library",
    acceptedAnswers: [
      "12 February",
      "12th February",
      "February 12",
      "Feb 12",
      "12/02",
      "12-02",
      "12/02/2023",
      "College",
      "Library",
      "Cafe",
      "First Day",
      "2023"
    ],
    hint: "The day my entire world changed for the better... 🥺💫",
    errorMessage: "Almost... think back to that magical first day! 🌸❤️",
    successMessage: "You really remember our memories... 🥹❤️",
    nextButtonText: "Something Special Awaits... 💍 →"
  },

  // FINAL STAGE: The Proposal
  proposal: {
    preludeLines: [
      "From all the little memories...",
      "To every moment that made me smile...",
      "There is something I have wanted to ask you... ❤️"
    ],
    question: "WILL YOU MARRY ME? 💍❤️",
    yesButtonText: "YES ❤️",
    noButtonText: "NO 🙈",
    
    // Playful messages when the user hovers or tries to tap the NO button
    noButtonEscapes: [
      "Are you sure? 🥺",
      "Try again 😜",
      "This button seems a little shy 🙈",
      "Nice try! 💨",
      "You can't catch me! 🌸",
      "Oops, over here! 🏃‍♀️💨",
      "Think again, sweetheart! 💕",
      "Look at that shiny YES button instead! ✨"
    ],

    // Celebration screen after YES
    celebration: {
      headline: "You just made me the happiest person in the world ❤️🥹💍",
      subtext: "Here's to a lifetime of late-night rides, endless giggles, and blooming cherry blossoms together forever.",
      letterTitle: "A Promise From My Heart 💌",
      letterBody: "Every smile we share, every small memory we cherish, has led us to this forever. I promise to love you, cherish you, and hold your hand through every season of life. You are my home, my dream, and my always.",
      restartButtonText: "Relive Our Journey 🌸"
    }
  }
};

window.PROPOSAL_CONFIG = CONFIG;

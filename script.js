const images = [
  { src: "screens/1.gif", link: "https://jachou24.github.io/GreekMythologyPersonalityQuiz/start.html" },
  { src: "screens/2.gif", link: "https://github.com/jachou24/FridayNightFunkin" },
  { src: "screens/3.gif", link: "https://github.com/jachou24/Barista-Simulator-Game/tree/main/countdownbobashop" },
  { src: "screens/4.gif", link: "https://github.com/jachou24/photobooth-with-email-receipts" },
  { src: "screens/5.gif", link: "https://github.com/jachou24/Wordle" },
];


let currentIndex = 0;
let hasTriggered = false;

const galleryImage = document.getElementById("gallery-image");
const joystick = document.getElementById("joystick");
const joystickInner = joystick.querySelector(".joystick-inner");
const actionButton = document.getElementById("action-button");
const coinSlotFace = document.querySelector(".coin-slot-face");

const soundUp = document.getElementById("sound-up");
const soundDown = document.getElementById("sound-down");
const soundSelect = document.getElementById("sound-select");

/* ---------- Constants ---------- */

const MAX_OFFSET = 20; /* 20 */
const TRIGGER_DIST = 10; /* 14 */
const DEAD_ZONE = 6; /* 6 */

const BASE_STICK_HEIGHT = 46;
const COMPRESSED_STICK_HEIGHT = 34;


/* ---------- Helpers ---------- */

function updateGallery() {
  galleryImage.src = images[currentIndex].src;
}

/* ---------- Gallery Movement ---------- */

function moveUp() {
  if (currentIndex > 0) {
    currentIndex--;
    updateGallery();
  }
}

function moveDown() {
  if (currentIndex < images.length - 1) {
    currentIndex++;
    updateGallery();
  }
}

/* ---------- Sound System ---------- */

const SFX = {
  joystickPull: document.getElementById("sfx-joystickPull"),
  select: document.getElementById("sfx-select")
};

function playSFX(sound) {
  if (!sound) return;
  try {
    sound.currentTime = 0;
    sound.play();
  } catch {
    // silent fail (browser autoplay restrictions, no src, etc.)
  }
}

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  playSFX(SFX.joystickPull);
  void coinSlotFace.offsetWidth;
  coinSlotFace.classList.add("animate");
  galleryImage.src = "screens/insertingCoin.gif";
  setTimeout(() => {
    updateGallery();
  }, 2000);
}

/* ---------- Unified Joystick Logic ---------- */

function applyJoystickOffset(offsetY) {
  playSFX(SFX.joystickPull);
  if (!audioUnlocked) {return;}
  offsetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetY));

  const stick = joystickInner.querySelector(".stick");
  const ball = joystickInner.querySelector(".ball");

  // DOWN pull → whole joystick moves
  if (offsetY > 0) {
    joystickInner.style.transform =
      `translateX(-50%) translateY(${offsetY}px)`;

    stick.style.setProperty(
      "--stick-height",
      `${BASE_STICK_HEIGHT}px`
    );

    ball.style.transform =
      "translateX(-50%) translateY(0)";
  }

  // UP pull → stick shrinks from bottom, ball moves up
  if (offsetY < 0) {
    const compressionRatio =
      Math.min(Math.abs(offsetY), MAX_OFFSET) / MAX_OFFSET;

    const newHeight =
      BASE_STICK_HEIGHT -
      compressionRatio *
      (BASE_STICK_HEIGHT - COMPRESSED_STICK_HEIGHT);

    const compressionAmount =
      BASE_STICK_HEIGHT - newHeight;

    joystickInner.style.transform =
      "translateX(-50%) translateY(0)";

    stick.style.setProperty(
      "--stick-height",
      `${newHeight}px`
    );

    ball.style.transform =
      `translateX(-50%) translateY(${-compressionAmount}px)`;
  }

  // Trigger logic
  if (hasTriggered) return;

  if (offsetY < -TRIGGER_DIST) {
    moveUp();
    hasTriggered = true;
  } else if (offsetY > TRIGGER_DIST) {
    moveDown();
    hasTriggered = true;
  }
}

function resetJoystick() {
  hasTriggered = false;
  joystick.classList.remove("dragging");

  joystickInner.style.transform =
    "translateX(-50%) translateY(0)";

  const stick = joystickInner.querySelector(".stick");
  const ball = joystickInner.querySelector(".ball");

  stick.style.setProperty(
    "--stick-height",
    `${BASE_STICK_HEIGHT}px`
  );

  ball.style.transform =
    "translateX(-50%) translateY(0)";
}

/* ---------- Drag / Touch ---------- */

let startY = null;

function startDrag(y) {
  startY = y;
  hasTriggered = false;
  joystick.classList.add("dragging");
}

function moveDrag(y) {
  if (startY === null) return;
  const deltaY = y - startY;
  applyJoystickOffset(deltaY);
}

function endDrag() {
  startY = null;
  resetJoystick();
}

/* Mouse */
joystick.addEventListener("mousedown", e => startDrag(e.clientY));
document.addEventListener("mousemove", e => moveDrag(e.clientY));
document.addEventListener("mouseup", endDrag);

/* Touch */
joystick.addEventListener("touchstart", e =>
  startDrag(e.touches[0].clientY)
);

joystick.addEventListener("touchmove", e =>
  moveDrag(e.touches[0].clientY)
);

joystick.addEventListener("touchend", endDrag);

/* ---------- Keyboard ---------- */

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;

  if (e.key === "ArrowUp") {
    joystick.classList.add("dragging");
    applyJoystickOffset(-MAX_OFFSET);
  }

  if (e.key === "ArrowDown") {
    joystick.classList.add("dragging");
    applyJoystickOffset(MAX_OFFSET);
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    resetJoystick();
  }
});

/* ---------- Button ---------- */

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    playSFX(SFX.select);
    window.location.href = images[currentIndex].link;
  }
});

actionButton.addEventListener("click", () => {
  playSFX(SFX.select);
  window.location.href = images[currentIndex].link;
});
/*
joystick.addEventListener("pointerdown", unlockAudio);
actionButton.addEventListener("pointerdown", unlockAudio);
*/
document.addEventListener("pointerdown", unlockAudio, { once: true });


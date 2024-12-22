document.addEventListener("DOMContentLoaded", function () {
  const clickButton = document.getElementById("clickButton");
  const scoreElement = document.getElementById("score");
  const timerElement = document.getElementById("timer");
  const levelElement = document.getElementById("level");
  const difficultySelect = document.getElementById("difficulty");
  const startGameButton = document.getElementById("startGame");

  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modalMessage");
  const closeModal = document.getElementById("closeModal");
  const nextLevelButton = document.getElementById("nextLevelButton");

  let score = 0;
  let timeLeft = 30;
  let level = 1;
  let gameActive = false;

  const scoreThresholds = { 1: 10, 2: 20, 3: 30 };
  const timeLimits = { 1: 30, 2: 20, 3: 10 };

  function startGame() {
    level = parseInt(difficultySelect.value);
    timeLeft = timeLimits[level];
    score = 0;

    timerElement.textContent = `Час: ${timeLeft}`;
    levelElement.textContent = `Рівень: ${level}`;
    scoreElement.textContent = `Очки: ${score}`;
    gameActive = true;

    clickButton.style.display = "inline-block";
    scoreElement.style.display = "block";
    timerElement.style.display = "block";
    levelElement.style.display = "block";

    startGameButton.style.display = "none";
    difficultySelect.style.display = "none";

    const timerInterval = setInterval(() => {
      if (timeLeft > 0 && gameActive) {
        timeLeft--;
        timerElement.textContent = `Час: ${timeLeft}`;

        if (timeLeft <= 5) {
          timerElement.classList.add("blink");
        }
      } else {
        clearInterval(timerInterval);
        timerElement.classList.remove("blink");
        endLevel();
      }
    }, 1000);
  }

  function playSound() {
    const audio = new Audio("click-sound.mp3");
    audio.play();
  }

  function updateScore() {
    if (gameActive) {
      score++;
      scoreElement.textContent = `Очки: ${score}`;
      playSound();
      scoreElement.classList.add("animate");
      setTimeout(() => {
        scoreElement.classList.remove("animate");
      }, 500);

      clickButton.classList.add("animate");
      setTimeout(() => {
        clickButton.classList.remove("animate");
      }, 300);
    }
  }

  function showModal(message, showNextButton = true) {
    modalMessage.textContent = message;
    modal.style.display = "block";
    nextLevelButton.style.display = showNextButton ? "inline-block" : "none"; // Показываем кнопку только при необходимости
  }

  function endLevel() {
    gameActive = false;
    if (score >= scoreThresholds[level]) {
      if (level < 3) {
        showModal(`Рівень ${level} пройден! Переходимо на наступний рівень.`);
        nextLevelButton.onclick = nextLevel;
      } else {
        showModal("Вітаємо! Ви пройшли всі рівні гри! 🎉", false); // Кнопку скрываем
        nextLevelButton.onclick = null; // Убираем обработчик, чтобы не было ошибок
      }
    } else {
      showModal(
        `Гра завершена! Ви не набрали достатньо очок на рівні ${level}.`,
        false
      );
      resetGame();
    }
  }

  function nextLevel() {
    level++;
    timeLeft = timeLimits[level];
    score = 0;

    document.body.classList.add("level-up");
    setTimeout(() => {
      document.body.classList.remove("level-up");
    }, 1000);

    timerElement.textContent = `Час: ${timeLeft}`;
    levelElement.textContent = `Рівень: ${level}`;
    scoreElement.textContent = `Очки: ${score}`;
    gameActive = true;

    const timerInterval = setInterval(() => {
      if (timeLeft > 0 && gameActive) {
        timeLeft--;
        timerElement.textContent = `Час: ${timeLeft}`;
      } else {
        clearInterval(timerInterval);
        endLevel();
      }
    }, 1000);

    modal.style.display = "none"; // Закрыть модальное окно
  }

  function resetGame() {
    startGameButton.style.display = "inline-block";
    difficultySelect.style.display = "inline-block";
    clickButton.style.display = "none";
    scoreElement.style.display = "none";
    timerElement.style.display = "none";
    levelElement.style.display = "none";

    clickButton.disabled = false;
  }

  startGameButton.addEventListener("click", startGame);
  clickButton.addEventListener("click", updateScore);

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

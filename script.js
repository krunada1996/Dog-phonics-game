document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    const startGameBtn = document.getElementById('start-game-btn');
    const scoreDisplay = document.getElementById('current-score');
    const levelDisplay = document.getElementById('current-level');
    const wordDisplay = document.getElementById('word-display');
    const wordImage = document.getElementById('word-image');
    const optionsContainer = document.getElementById('options-container');
    const feedbackMessage = document.getElementById('feedback-message');
    const audioPlayer = document.getElementById('audio-player');
    const doggyCharacter = document.getElementById('doggy-character'); // เปลี่ยนจาก cattyCharacter
    const enemyCharacter = document.getElementById('enemy-character');

    const quizQuestionsContainer = document.getElementById('quiz-questions');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const finalScoreDisplay = document.getElementById('final-score');
    const masteryMessage = document.getElementById('mastery-message');
    const dogRank = document.getElementById('dog-rank'); // เปลี่ยนจาก catRank
    const restartGameBtn = document.getElementById('restart-game-btn');

    // --- Game State Variables ---
    let currentScore = 0;
    let currentLevelIndex = 0; // 0 for 'Long A', 1 for 'Long E', etc.
    let currentWordIndex = 0;
    let correctAnswersCount = 0; // For final mastery
    let totalWordsAttempted = 0;

    const longVowelCategories = ['a_e', 'ee_ea', 'i_e_ie', 'o_e_oa', 'u_e_ue']; // หมวดหมู่สระเสียงยาว
    // ใน gameData เราจะใช้ key เป็นค่าเหล่านี้ เช่น 'a_e' แทน 'a'

    // --- Game Data (คำศัพท์, เสียง, รูปภาพ) สำหรับสระเสียงยาว ---
    // ผมจะใส่ตัวอย่างไม่กี่คำต่อสระเสียงยาวนะครับ คุณสามารถเพิ่มได้อีกเยอะเลย
    // **สำคัญ:** รูปแบบของ 'missing' อาจจะต้องเป็น String ที่แสดงถึงรูปแบบสระที่หายไป
    const gameData = {
        'a_e': [ // Long A (magic e, ai, ay)
            { word: 'cake', missing: 'a_e', display_missing: 'A_E', meaning: 'เค้ก', image: 'https://via.placeholder.com/100/0000FF/FFFFFF?text=CAKE' },
            { word: 'name', missing: 'a_e', display_missing: 'A_E', meaning: 'ชื่อ', image: 'https://via.placeholder.com/100/0000FF/FFFFFF?text=NAME' },
            { word: 'rain', missing: 'ai', display_missing: 'AI', meaning: 'ฝน', image: 'https://via.placeholder.com/100/0000FF/FFFFFF?text=RAIN' },
            { word: 'play', missing: 'ay', display_missing: 'AY', meaning: 'เล่น', image: 'https://via.placeholder.com/100/0000FF/FFFFFF?text=PLAY' },
            { word: 'gate', missing: 'a_e', display_missing: 'A_E', meaning: 'ประตู', image: 'https://via.placeholder.com/100/0000FF/FFFFFF?text=GATE' }
        ],
        'ee_ea': [ // Long E (ee, ea, y)
            { word: 'tree', missing: 'ee', display_missing: 'EE', meaning: 'ต้นไม้', image: 'https://via.placeholder.com/100/008000/FFFFFF?text=TREE' },
            { word: 'read', missing: 'ea', display_missing: 'EA', meaning: 'อ่าน', image: 'https://via.placeholder.com/100/008000/FFFFFF?text=READ' },
            { word: 'feet', missing: 'ee', display_missing: 'EE', meaning: 'เท้า', image: 'https://via.placeholder.com/100/008000/FFFFFF?text=FEET' },
            { word: 'leaf', missing: 'ea', display_missing: 'EA', meaning: 'ใบไม้', image: 'https://via.placeholder.com/100/008000/FFFFFF?text=LEAF' },
            { word: 'baby', missing: 'y', display_missing: 'Y', meaning: 'เด็กทารก', image: 'https://via.placeholder.com/100/008000/FFFFFF?text=BABY' }
        ],
        'i_e_ie': [ // Long I (magic e, ie, igh, y)
            { word: 'bike', missing: 'i_e', display_missing: 'I_E', meaning: 'จักรยาน', image: 'https://via.placeholder.com/100/800080/FFFFFF?text=BIKE' },
            { word: 'pie', missing: 'ie', display_missing: 'IE', meaning: 'พาย', image: 'https://via.placeholder.com/100/800080/FFFFFF?text=PIE' },
            { word: 'light', missing: 'igh', display_missing: 'IGH', meaning: 'แสง', image: 'https://via.placeholder.com/100/800080/FFFFFF?text=LIGHT' },
            { word: 'five', missing: 'i_e', display_missing: 'I_E', meaning: 'ห้า', image: 'https://via.placeholder.com/100/800080/FFFFFF?text=FIVE' },
            { word: 'fly', missing: 'y', display_missing: 'Y', meaning: 'บิน', image: 'https://via.placeholder.com/100/800080/FFFFFF?text=FLY' }
        ],
        'o_e_oa': [ // Long O (magic e, oa, ow)
            { word: 'boat', missing: 'oa', display_missing: 'OA', meaning: 'เรือ', image: 'https://via.placeholder.com/100/FFA500/FFFFFF?text=BOAT' },
            { word: 'rose', missing: 'o_e', display_missing: 'O_E', meaning: 'กุหลาบ', image: 'https://via.placeholder.com/100/FFA500/FFFFFF?text=ROSE' },
            { word: 'snow', missing: 'ow', display_missing: 'OW', meaning: 'หิมะ', image: 'https://via.placeholder.com/100/FFA500/FFFFFF?text=SNOW' },
            { word: 'goat', missing: 'oa', display_missing: 'OA', meaning: 'แพะ', image: 'https://via.placeholder.com/100/FFA500/FFFFFF?text=GOAT' },
            { word: 'cone', missing: 'o_e', display_missing: 'O_E', meaning: 'กรวย', image: 'https://via.placeholder.com/100/FFA500/FFFFFF?text=CONE' }
        ],
        'u_e_ue': [ // Long U (magic e, ue, ew, oo (sometimes))
            { word: 'flute', missing: 'u_e', display_missing: 'U_E', meaning: 'ขลุ่ย', image: 'https://via.placeholder.com/100/00CED1/FFFFFF?text=FLUTE' },
            { word: 'blue', missing: 'ue', display_missing: 'UE', meaning: 'สีน้ำเงิน', image: 'https://via.placeholder.com/100/00CED1/FFFFFF?text=BLUE' },
            { word: 'cube', missing: 'u_e', display_missing: 'U_E', meaning: 'ลูกบาศก์', image: 'https://via.placeholder.com/100/00CED1/FFFFFF?text=CUBE' },
            { word: 'fruit', missing: 'ui', display_missing: 'UI', meaning: 'ผลไม้', image: 'https://via.placeholder.com/100/00CED1/FFFFFF?text=FRUIT' },
            { word: 'juice', missing: 'ui', display_missing: 'UI', meaning: 'น้ำผลไม้', image: 'https://via.placeholder.com/100/00CED1/FFFFFF?text=JUICE' }
        ]
    };

    // --- Helper Functions --- (ส่วนใหญ่เหมือนเดิม)
    function showScreen(screen) {
        document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    function playAudio(src) {
        audioPlayer.src = src;
        audioPlayer.play();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- NEW: Generate Options for Long Vowels ---
    function generateLongVowelOptions(correctMissing) {
        let options = [correctMissing];
        const allPossibleLongVowels = ['a_e', 'ai', 'ay', 'ee', 'ea', 'ie', 'igh', 'i_e', 'y', 'o_e', 'oa', 'ow', 'u_e', 'ue', 'ew', 'ui']; // เพิ่มรูปแบบสระเสียงยาวที่หลากหลาย
        const otherOptions = allPossibleLongVowels.filter(v => v !== correctMissing);
        shuffleArray(otherOptions);
        // เพิ่ม 2-3 ตัวเลือกที่ไม่ถูกต้อง
        options.push(...otherOptions.slice(0, 2)); // Add 2 random incorrect options
        shuffleArray(options); // Shuffle the options
        return options;
    }

    function resetGame() {
        currentScore = 0;
        currentLevelIndex = 0;
        currentWordIndex = 0;
        correctAnswersCount = 0;
        totalWordsAttempted = 0;
        scoreDisplay.textContent = currentScore;
    }

    // --- Game Logic ---
    function loadLevel() {
        const currentVowelCategory = longVowelCategories[currentLevelIndex];
        levelDisplay.textContent = `Long ${currentVowelCategory.split('_')[0].toUpperCase()}`; // แสดงชื่อหมวดหมู่
        currentWordIndex = 0;
        loadWord();
    }

    function loadWord() {
        feedbackMessage.textContent = '';
        const currentVowelCategory = longVowelCategories[currentLevelIndex];
        const levelWords = gameData[currentVowelCategory];

        if (currentWordIndex >= levelWords.length) {
            // Level completed
            if (currentLevelIndex < longVowelCategories.length - 1) {
                currentLevelIndex++;
                alert(`ยอดเยี่ยม! คุณผ่านด่านสระเสียงยาว '${levelDisplay.textContent}' แล้ว!`);
                loadLevel();
            } else {
                // All main levels completed, go to quiz
                alert('คุณเอาชนะอสูรชอร์ต-วีได้แล้ว! ถึงเวลาทดสอบความรู้สุดท้าย!');
                generateQuiz();
                showScreen(quizScreen);
            }
            return;
        }

        const wordData = levelWords[currentWordIndex];
        // สร้างคำที่แสดงโดยแทนที่ missing part ด้วยขีด
        let displayedWord = wordData.word;
        if (wordData.missing === 'a_e' || wordData.missing === 'i_e' || wordData.missing === 'o_e' || wordData.missing === 'u_e') {
            displayedWord = displayedWord.replace(wordData.missing[0], '_').replace('e', '_'); // For magic e words
        } else {
            displayedWord = displayedWord.replace(wordData.missing, '_'.repeat(wordData.missing.length));
        }
        
        wordDisplay.textContent = displayedWord;
        wordImage.src = wordData.image;
        wordImage.alt = wordData.meaning;

        playAudio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${wordData.word}`);

        optionsContainer.innerHTML = ''; // Clear previous options
        const options = generateLongVowelOptions(wordData.missing);
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.textContent = option.toUpperCase(); // แสดงตัวเลือกเป็นตัวพิมพ์ใหญ่
            btn.dataset.vowel = option;
            btn.addEventListener('click', () => handleOptionClick(option, wordData));
            optionsContainer.appendChild(btn);
        });
    }

    function handleOptionClick(selectedVowel, wordData) {
        totalWordsAttempted++;
        if (selectedVowel === wordData.missing) {
            currentScore += 50;
            correctAnswersCount++;
            feedbackMessage.textContent = 'ถูกต้อง! ยอดเยี่ยมมาก!';
            feedbackMessage.style.color = '#4CAF50';
            scoreDisplay.textContent = currentScore;
            doggyCharacter.classList.add('catty-attack'); // ใช้ animation เดิม
            enemyCharacter.classList.add('enemy-hit');
            playAudio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${wordData.word}`);
        } else {
            feedbackMessage.textContent = `ผิด! คำที่ถูกต้องคือ "${wordData.word}" (${wordData.meaning})`;
            feedbackMessage.style.color = '#F44336';
            setTimeout(() => {
                playAudio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${wordData.word}`);
            }, 1000);
        }

        setTimeout(() => {
            doggyCharacter.classList.remove('catty-attack');
            enemyCharacter.classList.remove('enemy-hit');
            currentWordIndex++;
            loadWord();
        }, 1500);
    }

    // --- Quiz Logic --- (เหมือนเดิมแต่ดึงคำศัพท์จาก longVowelCategories)
    function generateQuiz() {
        quizQuestionsContainer.innerHTML = '';
        const allWords = Object.values(gameData).flat(); // Get all words from all levels
        shuffleArray(allWords);
        const quizWords = allWords.slice(0, 10); // Select 10 random words for quiz

        quizWords.forEach((wordData, index) => {
            const quizItem = document.createElement('div');
            quizItem.classList.add('quiz-item');

            let questionHTML = '';
            questionHTML += `<p>ข้อที่ ${index + 1}. ฟังคำศัพท์แล้วเลือกความหมายที่ถูกต้อง:</p>`;
            questionHTML += `<button class="play-quiz-audio" data-word="${wordData.word}">▶️ ฟัง</button>`;
            questionHTML += `<div class="quiz-options">`;

            let meaningOptions = [wordData.meaning];
            const otherMeanings = allWords
                .filter(w => w.meaning !== wordData.meaning)
                .map(w => w.meaning);
            shuffleArray(otherMeanings);
            meaningOptions.push(otherMeanings[0], otherMeanings[1]);
            shuffleArray(meaningOptions);

            meaningOptions.forEach(m => {
                questionHTML += `
                    <label>
                        <input type="radio" name="quiz-${index}" value="${m}" data-correct="${m === wordData.meaning}">
                        ${m}
                    </label>
                `;
            });
            questionHTML += `</div>`;
            quizItem.innerHTML = questionHTML;
            quizQuestionsContainer.appendChild(quizItem);
        });

        document.querySelectorAll('.play-quiz-audio').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const wordToPlay = event.target.dataset.word;
                playAudio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${wordToPlay}`);
            });
        });
    }

    submitQuizBtn.addEventListener('click', () => {
        let quizScore = 0;
        const quizItems = quizQuestionsContainer.querySelectorAll('.quiz-item');
        quizItems.forEach((item, index) => {
            const selectedOption = item.querySelector(`input[name="quiz-${index}"]:checked`);
            if (selectedOption && selectedOption.dataset.correct === 'true') {
                quizScore += 100;
            }
        });
        currentScore += quizScore;
        showResultScreen();
    });

    // --- Result Screen Logic ---
    function showResultScreen() {
        showScreen(resultScreen);
        finalScoreDisplay.textContent = currentScore;
        masteryMessage.textContent = `คุณสะกดคำศัพท์สระเสียงยาวได้ถูกต้อง ${correctAnswersCount}/${totalWordsAttempted} คำ!`;

        let rank = '';
        if (currentScore >= 2000) {
            rank = 'Dog Phonics Master! (สุดยอดปรมาจารย์สุนัข)';
        } else if (currentScore >= 1000) {
            rank = 'Loyal Dog Warrior! (นักรบสุนัขผู้ซื่อสัตย์)';
        } else if (currentScore >= 500) {
            rank = 'Phonics Pup (ลูกสุนัขฝึกหัด)';
        } else {
            rank = 'Newborn Puppy (ลูกสุนัขแรกเกิด)';
        }
        dogRank.textContent = rank; // เปลี่ยนตรงนี้
    }

    // --- Event Listeners ---
    startGameBtn.addEventListener('click', () => {
        showScreen(gameScreen);
        resetGame();
        loadLevel();
    });

    restartGameBtn.addEventListener('click', () => {
        showScreen(startScreen);
        resetGame();
    });
});
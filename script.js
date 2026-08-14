// 全局变量
let currentSection = 0;
const sections = ['welcome', 'blessings', 'cake', 'wishes', 'balloonGame', 'quiz'];
let blownCandles = 0;
let quizScore = 0;
let currentQuestion = 0;
let easterEggTriggered = false;
let longPressTimer = null;

// 问答题目数据
const quizQuestions = [
    {
        question: "唐润虹的星座是什么？",
        options: ["狮子座", "处女座", "天秤座", "天蝎座"],
        correct: 1,
        type: "默契考验"
    },
    {
        question: "唐润虹今年几岁啦？",
        options: ["18岁", "19岁", "20岁", "21岁"],
        correct: 0,
        type: "默契考验"
    },
    {
        question: "唐润虹最喜欢吃什么？",
        options: ["火锅", "甜食蛋糕", "烧烤", "麻辣烫"],
        correct: 1,
        type: "默契考验"
    },
    {
        question: "唐润虹唱歌怎么样？",
        options: ["五音不全", "一般般", "还不错", "超级好听"],
        correct: 3,
        type: "默契考验"
    },
    {
        question: "唐润虹的性格是怎样的？",
        options: ["内向安静", "活泼开朗", "高冷神秘", "慢热话少"],
        correct: 1,
        type: "默契考验"
    },
    {
        question: "什么东西越洗越脏？",
        options: ["衣服", "手", "水", "碗"],
        correct: 2,
        type: "脑筋急转弯"
    },
    {
        question: "什么路最窄？",
        options: ["羊肠小道", "冤家路窄", "独木桥", "死胡同"],
        correct: 1,
        type: "脑筋急转弯"
    },
    {
        question: "生日快乐歌最早起源于哪个国家？",
        options: ["美国", "英国", "法国", "德国"],
        correct: 0,
        type: "生日知识"
    }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initStarfield();
    initWelcome();
    initBlessings();
    initCake();
    initWishes();
    initBalloonGame(); // 初始化戳气球小游戏
    initQuiz();
    initEasterEgg();
    initScrollObserver();
});

// 星空背景动画
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 星星数组
    const stars = [];
    const shootingStars = [];
    
    // 创建星星
    function createStars() {
        const starCount = Math.floor((canvas.width * canvas.height) / 1000);
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    // 创建流星
    function createShootingStar() {
        if (Math.random() < 0.005) { // 0.5% 概率生成流星
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: 0,
                length: Math.random() * 80 + 50,
                speed: Math.random() * 8 + 5,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
                opacity: 1,
                trail: []
            });
        }
    }
    
    // 绘制星星
    function drawStars() {
        stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            const opacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinklePhase));
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
            
            // 添加光晕效果
            if (star.size > 1.5) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
                ctx.fill();
            }
        });
    }
    
    // 绘制流星
    function drawShootingStars() {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const star = shootingStars[i];
            
            // 更新位置
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            
            // 添加轨迹
            star.trail.push({ x: star.x, y: star.y, opacity: star.opacity });
            if (star.trail.length > 20) {
                star.trail.shift();
            }
            
            // 绘制轨迹
            star.trail.forEach((point, index) => {
                const opacity = point.opacity * (index / star.trail.length);
                const size = (index / star.trail.length) * 2;
                
                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fill();
            });
            
            // 绘制流星头
            ctx.beginPath();
            ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
            
            // 更新透明度
            star.opacity -= 0.01;
            
            // 移除消失的流星
            if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
                shootingStars.splice(i, 1);
            }
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.5, '#1a1a3a');
        gradient.addColorStop(1, '#0a0a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawStars();
        createShootingStar();
        drawShootingStars();
        
        requestAnimationFrame(animate);
    }
    
    createStars();
    animate();
}

// 欢迎屏幕
function initWelcome() {
    const enterBtn = document.getElementById('enterBtn');
    
    enterBtn.addEventListener('click', function() {
        // 隐藏欢迎屏幕
        document.getElementById('welcome').classList.remove('active');
        
        // 显示祝福区域
        setTimeout(() => {
            document.getElementById('blessings').classList.add('active');
            currentSection = 1;
        }, 500);
    });
}

// 祝福语展示
function initBlessings() {
    const blessingCards = document.querySelectorAll('.blessing-card');
    
    // 为每张卡片添加延迟动画
    blessingCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, 300 * (index + 1));
    });
}

// 蛋糕和蜡烛互动
function initCake() {
    const candles = document.querySelectorAll('.candle');
    const candleCount = document.getElementById('candleCount');
    const celebration = document.getElementById('celebration');
    
    // 点击蜡烛吹灭
    candles.forEach(candle => {
        candle.addEventListener('click', function() {
            if (!this.classList.contains('blown')) {
                this.classList.add('blown');
                blownCandles++;
                candleCount.textContent = blownCandles;
                
                // 检查是否所有蜡烛都吹灭了
                if (blownCandles === 5) {
                    setTimeout(showCelebration, 500);
                }
            }
        });
        
        // 长按触发彩蛋
        candle.addEventListener('mousedown', function(e) {
            longPressTimer = setTimeout(() => {
                if (!easterEggTriggered) {
                    showEasterEgg();
                }
            }, 3000);
        });
        
        candle.addEventListener('mouseup', function() {
            clearTimeout(longPressTimer);
        });
        
        candle.addEventListener('mouseleave', function() {
            clearTimeout(longPressTimer);
        });
        
        // 触摸事件支持
        candle.addEventListener('touchstart', function(e) {
            longPressTimer = setTimeout(() => {
                if (!easterEggTriggered) {
                    showEasterEgg();
                }
            }, 3000);
        });
        
        candle.addEventListener('touchend', function() {
            clearTimeout(longPressTimer);
        });
    });
    
    // 麦克风吹气检测
    initMicrophoneBlow();
}

// 麦克风吹气检测
function initMicrophoneBlow() {
    let audioContext;
    let analyser;
    let microphone;
    
    // 检查浏览器是否支持
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // 请求麦克风权限
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                microphone.connect(analyser);
                
                // 检测吹气
                function checkBlow() {
                    analyser.getByteFrequencyData(dataArray);
                    
                    // 计算音量
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    let average = sum / bufferLength;
                    
                    // 如果音量超过阈值，认为是吹气
                    if (average > 50) {
                        blowCandle();
                    }
                    
                    requestAnimationFrame(checkBlow);
                }
                
                checkBlow();
            })
            .catch(function(err) {
                console.log('麦克风访问被拒绝:', err);
            });
    }
}

// 吹灭蜡烛（用于麦克风检测）
function blowCandle() {
    const candles = document.querySelectorAll('.candle:not(.blown)');
    if (candles.length > 0) {
        const randomCandle = candles[Math.floor(Math.random() * candles.length)];
        randomCandle.click();
    }
}

// 显示庆祝动画
function showCelebration() {
    const celebration = document.getElementById('celebration');
    celebration.classList.add('visible');
    
    // 创建五彩纸屑
    createConfetti();
    
    // 3秒后隐藏庆祝动画
    setTimeout(() => {
        celebration.classList.remove('visible');
    }, 3000);
}

// 创建五彩纸屑
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    const colors = ['#ff9a9e', '#a18cd1', '#fad0c4', '#4facfe', '#00f2fe', '#ffdd57'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        confettiContainer.appendChild(confetti);
        
        // 动画结束后移除
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// 添加纸屑下落动画
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 许愿功能
function initWishes() {
    const wishInput = document.getElementById('wishInput');
    const makeWishBtn = document.getElementById('makeWishBtn');
    const wishAnimation = document.getElementById('wishAnimation');
    const wishCard = document.getElementById('wishCard');
    
    makeWishBtn.addEventListener('click', function() {
        const wish = wishInput.value.trim();
        
        if (wish) {
            // 显示许愿动画
            showWishAnimation(wish);
        } else {
            // 如果没有输入愿望，显示默认祝福
            showWishAnimation("愿所有美好都如约而至");
        }
    });
}

// 显示许愿动画
function showWishAnimation(wish) {
    const wishInput = document.getElementById('wishInput');
    const wishAnimation = document.getElementById('wishAnimation');
    const wishCard = document.getElementById('wishCard');
    
    // 隐藏输入区域
    wishInput.style.display = 'none';
    document.getElementById('makeWishBtn').style.display = 'none';
    
    // 显示动画
    wishAnimation.classList.add('visible');
    
    // 创建上升的星星
    createRisingStars();
    
    // 3秒后显示祝福卡片
    setTimeout(() => {
        wishAnimation.classList.remove('visible');
        setTimeout(() => {
            wishCard.classList.add('visible');
        }, 500);
    }, 3000);
}

// 创建上升的星星
function createRisingStars() {
    const starsContainer = document.querySelector('.wish-stars');
    const colors = ['#ffdd57', '#4facfe', '#ff9a9e', '#a18cd1', '#00f2fe'];
    
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            bottom: 0;
            border-radius: 50%;
            animation: riseStar ${Math.random() * 2 + 2}s ease-out forwards;
            animation-delay: ${Math.random() * 1}s;
            opacity: 0;
        `;
        
        starsContainer.appendChild(star);
        
        // 动画结束后移除
        setTimeout(() => {
            star.remove();
        }, 4000);
    }
}

// 添加星星上升动画
const starStyle = document.createElement('style');
starStyle.textContent = `
    @keyframes riseStar {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-200px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(starStyle);

// 问答游戏
function initQuiz() {
    const startQuizBtn = document.getElementById('startQuizBtn');
    const restartQuizBtn = document.getElementById('restartQuizBtn');
    
    startQuizBtn.addEventListener('click', startQuiz);
    restartQuizBtn.addEventListener('click', function() {
        document.getElementById('quizResult').classList.remove('visible');
        setTimeout(() => {
            startQuiz();
        }, 300);
    });
}

// 开始问答游戏
function startQuiz() {
    const quizStart = document.getElementById('quizStart');
    const quizGame = document.getElementById('quizGame');
    const quizResult = document.getElementById('quizResult');
    
    quizStart.style.display = 'none';
    quizGame.classList.add('visible');
    quizResult.classList.remove('visible');
    
    quizScore = 0;
    currentQuestion = 0;
    
    showQuestion();
}

// 显示问题
function showQuestion() {
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('options');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    
    if (currentQuestion >= quizQuestions.length) {
        showQuizResult();
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    
    // 更新进度
    currentQuestionSpan.textContent = currentQuestion + 1;
    totalQuestionsSpan.textContent = quizQuestions.length;
    
    // 显示问题
    questionText.textContent = question.question;
    
    // 清空选项
    optionsContainer.innerHTML = '';
    
    // 添加选项
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        button.addEventListener('click', () => checkAnswer(index, question.correct));
        optionsContainer.appendChild(button);
    });
}

// 检查答案
function checkAnswer(selectedIndex, correctIndex) {
    const options = document.querySelectorAll('.option-btn');
    
    // 禁用所有选项
    options.forEach(option => {
        option.disabled = true;
    });
    
    // 标记正确和错误答案
    options[selectedIndex].classList.add(selectedIndex === correctIndex ? 'correct' : 'wrong');
    options[correctIndex].classList.add('correct');
    
    // 更新分数
    if (selectedIndex === correctIndex) {
        quizScore++;
    }
    
    // 延迟后显示下一题
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
}

// 显示问答结果
function showQuizResult() {
    const quizGame = document.getElementById('quizGame');
    const quizResult = document.getElementById('quizResult');
    const scoreSpan = document.getElementById('score');
    const resultMessage = document.getElementById('resultMessage');
    
    quizGame.classList.remove('visible');
    setTimeout(() => {
        quizResult.classList.add('visible');
    }, 300);
    
    scoreSpan.textContent = quizScore;
    
    // 根据分数显示不同消息
    if (quizScore === quizQuestions.length) {
        resultMessage.textContent = "完美！全部答对！🎉 解锁终极彩蛋！";
        // 2秒后显示终极彩蛋
        setTimeout(() => {
            showUltimateEgg();
        }, 2000);
    } else if (quizScore >= quizQuestions.length * 0.7) {
        resultMessage.textContent = "很棒！你们是很好的朋友！😊";
    } else if (quizScore >= quizQuestions.length * 0.5) {
        resultMessage.textContent = "还不错，继续加油！💪";
    } else {
        resultMessage.textContent = "要多了解唐润虹哦！❤️";
    }
}

// 隐藏彩蛋
function initEasterEgg() {
    const playSongBtn = document.getElementById('playSongBtn');
    const birthdaySong = document.getElementById('birthdaySong');
    const closeEggBtn = document.getElementById('closeEggBtn');
    const easterEgg = document.getElementById('easterEgg');
    const songStatus = document.getElementById('songStatus');
    
    let audioAvailable = true;
    let isPlaying = false;
    
    // 检查音频文件是否可用
    birthdaySong.addEventListener('error', function() {
        audioAvailable = false;
        songStatus.textContent = '(将播放内置旋律)';
    });
    
    // 关闭按钮
    closeEggBtn.addEventListener('click', function() {
        hideEasterEgg();
    });
    
    // 点击背景关闭
    easterEgg.addEventListener('click', function(e) {
        if (e.target === easterEgg) {
            hideEasterEgg();
        }
    });
    
    // 播放按钮点击事件
    playSongBtn.addEventListener('click', function() {
        if (isPlaying) {
            // 停止播放
            if (audioAvailable) {
                birthdaySong.pause();
                birthdaySong.currentTime = 0;
            }
            stopMelody();
            isPlaying = false;
            playSongBtn.textContent = '播放生日歌 🎶';
            return;
        }
        
        isPlaying = true;
        playSongBtn.textContent = '停止播放 ⏹️';
        createFireworks();
        
        if (audioAvailable) {
            birthdaySong.play().then(function() {
                songStatus.textContent = '正在播放...';
            }).catch(function(error) {
                console.log('音频播放失败，使用内置旋律:', error);
                playFallbackMelody();
            });
            
            birthdaySong.addEventListener('ended', function() {
                isPlaying = false;
                playSongBtn.textContent = '播放生日歌 🎶';
                songStatus.textContent = '';
            }, { once: true });
        } else {
            playFallbackMelody();
        }
    });
    
    // 监听蛋糕长按
    const cake = document.querySelector('.cake');
    if (cake) {
        cake.addEventListener('mousedown', function(e) {
            e.preventDefault();
            longPressTimer = setTimeout(() => {
                if (!easterEggTriggered) {
                    showEasterEgg();
                }
            }, 3000);
        });
        
        cake.addEventListener('mouseup', function() {
            clearTimeout(longPressTimer);
        });
        
        cake.addEventListener('mouseleave', function() {
            clearTimeout(longPressTimer);
        });
        
        // 触摸事件
        cake.addEventListener('touchstart', function(e) {
            e.preventDefault();
            longPressTimer = setTimeout(() => {
                if (!easterEggTriggered) {
                    showEasterEgg();
                }
            }, 3000);
        });
        
        cake.addEventListener('touchend', function() {
            clearTimeout(longPressTimer);
        });
    }
}

// 内置生日歌旋律
let melodyOscillator = null;
let melodyTimeout = null;

function playFallbackMelody() {
    const songStatus = document.getElementById('songStatus');
    songStatus.textContent = '正在播放内置旋律...';
    
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // 生日快乐歌音符 (简化版)
    const notes = [
        { freq: 262, dur: 0.3 },  // C
        { freq: 262, dur: 0.3 },  // C
        { freq: 294, dur: 0.6 },  // D
        { freq: 262, dur: 0.6 },  // C
        { freq: 349, dur: 0.6 },  // F
        { freq: 330, dur: 1.0 },  // E
        { freq: 262, dur: 0.3 },  // C
        { freq: 262, dur: 0.3 },  // C
        { freq: 294, dur: 0.6 },  // D
        { freq: 262, dur: 0.6 },  // C
        { freq: 392, dur: 0.6 },  // G
        { freq: 349, dur: 1.0 },  // F
        { freq: 262, dur: 0.3 },  // C
        { freq: 262, dur: 0.3 },  // C
        { freq: 523, dur: 0.6 },  // C2
        { freq: 440, dur: 0.6 },  // A
        { freq: 349, dur: 0.6 },  // F
        { freq: 330, dur: 0.6 },  // E
        { freq: 294, dur: 1.0 },  // D
        { freq: 466, dur: 0.3 },  // Bb
        { freq: 466, dur: 0.3 },  // Bb
        { freq: 440, dur: 0.6 },  // A
        { freq: 349, dur: 0.6 },  // F
        { freq: 392, dur: 0.6 },  // G
        { freq: 349, dur: 1.0 },  // F
    ];
    
    let time = audioCtx.currentTime;
    
    notes.forEach(function(note) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = note.freq;
        
        gainNode.gain.setValueAtTime(0.3, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + note.dur);
        
        oscillator.start(time);
        oscillator.stop(time + note.dur);
        
        time += note.dur;
    });
    
    // 旋律结束后
    melodyTimeout = setTimeout(function() {
        const playSongBtn = document.getElementById('playSongBtn');
        isPlaying = false;
        playSongBtn.textContent = '播放生日歌 🎶';
        songStatus.textContent = '';
        audioCtx.close();
    }, time * 1000);
    
    melodyOscillator = audioCtx;
}

function stopMelody() {
    if (melodyOscillator) {
        melodyOscillator.close();
        melodyOscillator = null;
    }
    if (melodyTimeout) {
        clearTimeout(melodyTimeout);
        melodyTimeout = null;
    }
    const songStatus = document.getElementById('songStatus');
    songStatus.textContent = '';
}

// 显示彩蛋
function showEasterEgg() {
    easterEggTriggered = true;
    const easterEgg = document.getElementById('easterEgg');
    easterEgg.classList.add('visible');
    
    // 隐藏提示
    const hint = document.querySelector('.easter-egg-hint');
    if (hint) {
        hint.style.display = 'none';
    }
}

// 隐藏彩蛋
function hideEasterEgg() {
    const easterEgg = document.getElementById('easterEgg');
    easterEgg.classList.remove('visible');
    
    // 停止音乐
    const birthdaySong = document.getElementById('birthdaySong');
    birthdaySong.pause();
    birthdaySong.currentTime = 0;
    stopMelody();
    
    // 重置按钮状态
    const playSongBtn = document.getElementById('playSongBtn');
    playSongBtn.textContent = '播放生日歌 🎶';
    isPlaying = false;
}

// 创建烟花效果
function createFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    const colors = ['#ff9a9e', '#a18cd1', '#fad0c4', '#4facfe', '#00f2fe', '#ffdd57'];
    
    // 清空之前的烟花
    fireworksContainer.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            firework.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                animation: fireworkBurst 1s ease-out forwards;
                box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
            `;
            
            fireworksContainer.appendChild(firework);
            
            // 创建爆炸粒子
            const particles = [];
            for (let j = 0; j < 8; j++) {
                const particle = document.createElement('div');
                const angle = (j / 8) * Math.PI * 2;
                const distance = Math.random() * 50 + 20;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                particle.style.cssText = `
                    position: absolute;
                    left: ${x}%;
                    top: ${y}%;
                    width: 2px;
                    height: 2px;
                    background: ${color};
                    border-radius: 50%;
                    box-shadow: 0 0 5px ${color};
                    transition: all 1s ease-out;
                    opacity: 1;
                `;
                
                fireworksContainer.appendChild(particle);
                particles.push({ el: particle, tx, ty });
                
                // 触发动画
                requestAnimationFrame(() => {
                    particle.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                    particle.style.opacity = '0';
                });
            }
            
            // 动画结束后移除
            setTimeout(() => {
                firework.remove();
                particles.forEach(p => p.el.remove());
            }, 1100);
        }, i * 200);
    }
}

// 添加烟花动画
const fireworkStyle = document.createElement('style');
fireworkStyle.textContent = `
    @keyframes fireworkBurst {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(3);
            opacity: 0.8;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
    
    @keyframes fireworkParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(
                calc(cos(var(--angle)) * var(--distance)),
                calc(sin(var(--angle)) * var(--distance))
            ) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(fireworkStyle);

// 滚动观察器
function initScrollObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // 观察所有区域
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// 滚动到指定区域
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 添加键盘导航
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        if (currentSection < sections.length - 1) {
            currentSection++;
            scrollToSection(sections[currentSection]);
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentSection > 0) {
            currentSection--;
            scrollToSection(sections[currentSection]);
        }
    }
});

// 添加触摸滑动支持
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向上滑动
            if (currentSection < sections.length - 1) {
                currentSection++;
                scrollToSection(sections[currentSection]);
            }
        } else {
            // 向下滑动
            if (currentSection > 0) {
                currentSection--;
                scrollToSection(sections[currentSection]);
            }
        }
    }
}

// 终极彩蛋
let ultimateIsPlaying = false;

function showUltimateEgg() {
    const ultimateEgg = document.getElementById('ultimateEgg');
    ultimateEgg.classList.add('visible');
    createUltimateStars();
    createUltimateFireworks();
}

function hideUltimateEgg() {
    const ultimateEgg = document.getElementById('ultimateEgg');
    ultimateEgg.classList.remove('visible');
    
    const ultimateSong = document.getElementById('ultimateSong');
    ultimateSong.pause();
    ultimateSong.currentTime = 0;
    stopUltimateMelody();
    
    const playBtn = document.getElementById('playUltimateBtn');
    playBtn.textContent = '播放专属祝福 🎁';
    ultimateIsPlaying = false;
}

function createUltimateStars() {
    const container = document.querySelector('.ultimate-stars');
    if (!container) return;
    container.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 6 + 2;
        star.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: #ffdd57;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: ultimateStarTwinkle ${Math.random() * 2 + 1}s ease-in-out infinite alternate;
            box-shadow: 0 0 ${size * 2}px #ffdd57;
        `;
        container.appendChild(star);
    }
}

function createUltimateFireworks() {
    const container = document.getElementById('ultimateFireworks');
    if (!container) return;
    container.innerHTML = '';
    
    const colors = ['#ffdd57', '#ff6b6b', '#a18cd1', '#4facfe', '#00f2fe', '#ff9a9e'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const fw = document.createElement('div');
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            fw.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                animation: fireworkBurst 1s ease-out forwards;
                box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
            `;
            container.appendChild(fw);
            
            const particles = [];
            for (let j = 0; j < 12; j++) {
                const particle = document.createElement('div');
                const angle = (j / 12) * Math.PI * 2;
                const dist = Math.random() * 60 + 30;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                
                particle.style.cssText = `
                    position: absolute;
                    left: ${x}%;
                    top: ${y}%;
                    width: 3px;
                    height: 3px;
                    background: ${color};
                    border-radius: 50%;
                    box-shadow: 0 0 5px ${color};
                    transition: all 1s ease-out;
                    opacity: 1;
                `;
                container.appendChild(particle);
                particles.push({ el: particle, tx, ty });
                
                requestAnimationFrame(() => {
                    particle.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                    particle.style.opacity = '0';
                });
            }
            
            setTimeout(() => {
                fw.remove();
                particles.forEach(p => p.el.remove());
            }, 1100);
        }, i * 150);
    }
}

// 终极彩蛋内置旋律（更华丽的生日歌）
let ultimateMelodyCtx = null;
let ultimateMelodyTimeout = null;

function playUltimateMelody() {
    const statusEl = document.getElementById('ultimateStatus');
    statusEl.textContent = '正在播放专属祝福旋律...';
    
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const notes = [
        { freq: 523, dur: 0.25 },  // C5
        { freq: 523, dur: 0.25 },  // C5
        { freq: 587, dur: 0.5 },   // D5
        { freq: 523, dur: 0.5 },   // C5
        { freq: 698, dur: 0.5 },   // F5
        { freq: 659, dur: 0.75 },  // E5
        { freq: 523, dur: 0.25 },  // C5
        { freq: 523, dur: 0.25 },  // C5
        { freq: 587, dur: 0.5 },   // D5
        { freq: 523, dur: 0.5 },   // C5
        { freq: 784, dur: 0.5 },   // G5
        { freq: 698, dur: 0.75 },  // F5
        { freq: 523, dur: 0.25 },  // C5
        { freq: 523, dur: 0.25 },  // C5
        { freq: 1047, dur: 0.5 },  // C6
        { freq: 880, dur: 0.5 },   // A5
        { freq: 698, dur: 0.5 },   // F5
        { freq: 659, dur: 0.5 },   // E5
        { freq: 587, dur: 0.75 },  // D5
        { freq: 932, dur: 0.25 },  // Bb5
        { freq: 932, dur: 0.25 },  // Bb5
        { freq: 880, dur: 0.5 },   // A5
        { freq: 698, dur: 0.5 },   // F5
        { freq: 784, dur: 0.5 },   // G5
        { freq: 698, dur: 0.75 },  // F5
    ];
    
    let time = audioCtx.currentTime;
    
    notes.forEach(function(note) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + note.dur);
        osc.start(time);
        osc.stop(time + note.dur);
        time += note.dur;
    });
    
    ultimateMelodyTimeout = setTimeout(function() {
        const btn = document.getElementById('playUltimateBtn');
        btn.textContent = '再听一次 🎁';
        ultimateIsPlaying = false;
        statusEl.textContent = '';
        audioCtx.close();
    }, time * 1000);
    
    ultimateMelodyCtx = audioCtx;
}

function stopUltimateMelody() {
    if (ultimateMelodyCtx) {
        ultimateMelodyCtx.close();
        ultimateMelodyCtx = null;
    }
    if (ultimateMelodyTimeout) {
        clearTimeout(ultimateMelodyTimeout);
        ultimateMelodyTimeout = null;
    }
    const statusEl = document.getElementById('ultimateStatus');
    if (statusEl) statusEl.textContent = '';
}

// 初始化终极彩蛋事件
document.addEventListener('DOMContentLoaded', function() {
    const closeUltBtn = document.getElementById('closeUltimateBtn');
    const ultimateEgg = document.getElementById('ultimateEgg');
    const playUltBtn = document.getElementById('playUltimateBtn');
    const ultimateSong = document.getElementById('ultimateSong');
    
    let ultAudioAvailable = true;
    
    ultimateSong.addEventListener('error', function() {
        ultAudioAvailable = false;
    });
    
    closeUltBtn.addEventListener('click', function() {
        hideUltimateEgg();
    });
    
    ultimateEgg.addEventListener('click', function(e) {
        if (e.target === ultimateEgg) {
            hideUltimateEgg();
        }
    });
    
    playUltBtn.addEventListener('click', function() {
        if (ultimateIsPlaying) {
            ultimateSong.pause();
            ultimateSong.currentTime = 0;
            stopUltimateMelody();
            ultimateIsPlaying = false;
            playUltBtn.textContent = '播放专属祝福 🎁';
            return;
        }
        
        ultimateIsPlaying = true;
        playUltBtn.textContent = '停止播放 ⏹️';
        createUltimateFireworks();
        
        if (ultAudioAvailable) {
            ultimateSong.play().then(function() {
                document.getElementById('ultimateStatus').textContent = '正在播放...';
            }).catch(function() {
                playUltimateMelody();
            });
            
            ultimateSong.addEventListener('ended', function() {
                ultimateIsPlaying = false;
                playUltBtn.textContent = '再听一次 🎁';
                document.getElementById('ultimateStatus').textContent = '';
            }, { once: true });
        } else {
            playUltimateMelody();
        }
    });
});

// ============================================
// 戳气球小游戏模块
// ============================================

// ===== 祝福语数组 - 可自行修改增加 =====
const balloonBlessings = [
    "越来越漂亮！",
    "永远年轻！",
    "花不完的钱！",
    "天天开心！",
    "所有愿望都实现！",
    "平安顺遂！",
    "心想事成！",
    "万事如意！",
    "好运连连！",
    "幸福美满！",
    "青春永驻！",
    "笑口常开！"
];

// 气球颜色配置
const balloonColors = [
    '#ff9a9e', '#a18cd1', '#fad0c4', '#4facfe', '#00f2fe',
    '#ffdd57', '#ff6b6b', '#c084fc', '#67e8f9', '#fbbf24',
    '#f472b6', '#34d399'
];

// 气球游戏全局变量
let totalBalloons = 0;       // 总气球数量
let poppedCount = 0;         // 已戳破数量
let blessingIndex = 0;       // 当前祝福语索引
let blessingTimer = null;    // 祝福弹窗定时器

/**
 * 初始化戳气球小游戏
 */
function initBalloonGame() {
    const startQuizFromBalloon = document.getElementById('startQuizFromBalloon');
    const toBalloonBtn = document.getElementById('toBalloonBtn');
    
    // 点击"继续 → 戳气球"按钮 → 滚动到气球游戏区域并创建气球
    toBalloonBtn.addEventListener('click', function() {
        const balloonSection = document.getElementById('balloonGame');
        // 确保section可见（不依赖IntersectionObserver的延迟）
        balloonSection.classList.add('visible');
        balloonSection.scrollIntoView({ behavior: 'smooth' });
        // 延迟后创建气球（等滚动和渲染完成后）
        setTimeout(() => {
            createBalloons();
        }, 800);
    });
    
    // 点击"开启专属问答小考验"按钮 → 进入问答游戏
    startQuizFromBalloon.addEventListener('click', function() {
        // 滚动到问答区域
        document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
        // 延迟后显示问答开始界面
        setTimeout(() => {
            document.getElementById('quizStart').style.display = 'block';
            document.getElementById('quizGame').classList.remove('visible');
            document.getElementById('quizResult').classList.remove('visible');
        }, 500);
    });
}

/**
 * 创建气球并放入气球区域
 * 在许愿完成后调用此函数
 */
function createBalloons() {
    const balloonArea = document.getElementById('balloonArea');
    if (!balloonArea) return;
    
    balloonArea.innerHTML = ''; // 清空区域
    
    poppedCount = 0;
    blessingIndex = 0;
    
    // 根据屏幕大小决定气球数量（手机少一些，电脑多一些）
    const isMobile = window.innerWidth <= 768;
    totalBalloons = isMobile ? 8 : 12;
    
    // 更新进度显示
    document.getElementById('balloonTotal').textContent = totalBalloons;
    document.getElementById('balloonCount').textContent = '0';
    
    // 隐藏完成界面
    document.getElementById('balloonComplete').classList.remove('visible');
    
    // 获取气球区域尺寸（确保区域已渲染）
    let areaWidth = balloonArea.offsetWidth;
    let areaHeight = balloonArea.offsetHeight;
    
    // 如果尺寸为0（区域尚未渲染），使用fallback尺寸
    if (areaWidth < 100) areaWidth = window.innerWidth - 40;
    if (areaHeight < 100) areaHeight = window.innerHeight * 0.6;
    
    // 气球尺寸（适合手指点击）
    const balloonSize = isMobile ? 90 : 110;
    
    // 生成气球位置（确保不重叠）
    const positions = [];
    for (let i = 0; i < totalBalloons; i++) {
        let x, y, attempts = 0;
        do {
            x = Math.random() * (areaWidth - balloonSize);
            y = Math.random() * (areaHeight - balloonSize - 30);
            attempts++;
        } while (attempts < 50 && positions.some(p => 
            Math.abs(p.x - x) < balloonSize * 0.8 && Math.abs(p.y - y) < balloonSize * 0.8
        ));
        positions.push({ x, y });
    }
    
    // 创建每个气球
    for (let i = 0; i < totalBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = positions[i].x + 'px';
        balloon.style.top = positions[i].y + 'px';
        balloon.style.width = balloonSize + 'px';
        balloon.style.height = (balloonSize * 1.3) + 'px';
        
        // 随机颜色
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        
        // 气球HTML结构
        balloon.innerHTML = `
            <div class="balloon-body" style="background: ${color};"></div>
            <div class="balloon-string"></div>
        `;
        
        // 漂浮动画（每个气球延迟不同，更自然）
        balloon.style.animation = `balloonFloat ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`;
        
        // 点击戳破事件（CSS已设置touch-action: manipulation，移动端click也能正常响应）
        balloon.addEventListener('click', function(e) {
            e.stopPropagation();
            popBalloon(this, color);
        });
        
        balloonArea.appendChild(balloon);
    }
}

/**
 * 戳破气球
 * @param {HTMLElement} balloon - 被戳破的气球元素
 * @param {string} color - 气球颜色
 */
function popBalloon(balloon, color) {
    // 防止重复戳破
    if (balloon.classList.contains('popped')) return;
    balloon.classList.add('popped');
    
    // 停止漂浮动画，播放爆炸动画
    balloon.style.animation = 'balloonPop 0.3s ease forwards';
    
    // 播放爆炸星光碎片动画
    createSparkles(balloon, color);
    
    // 播放音效（使用Web Audio API）
    playPopSound();
    
    // 0.3秒后移除气球
    setTimeout(() => {
        balloon.remove();
    }, 300);
    
    // 更新已戳破数量
    poppedCount++;
    document.getElementById('balloonCount').textContent = poppedCount;
    
    // 显示祝福弹窗
    showBlessingPopup();
    
    // 检查是否全部戳完
    if (poppedCount >= totalBalloons) {
        setTimeout(() => {
            showBalloonComplete();
        }, 800);
    }
}

/**
 * 创建爆炸星光碎片（使用JS动画，兼容所有浏览器）
 * @param {HTMLElement} balloon - 被戳破的气球
 * @param {string} color - 碎片颜色
 */
function createSparkles(balloon, color) {
    const rect = balloon.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.3;
    
    // 创建12个碎片粒子
    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        const angle = (i / 12) * Math.PI * 2;
        const distance = 40 + Math.random() * 60;
        const size = 4 + Math.random() * 6;
        
        sparkle.style.cssText = `
            position: fixed;
            left: ${cx}px;
            top: ${cy}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 2000;
            box-shadow: 0 0 ${size}px ${color};
        `;
        
        document.body.appendChild(sparkle);
        
        // 使用JS动画替代CSS变量keyframes
        const startTime = performance.now();
        const duration = 600;
        (function animateSparkle(el, startTime) {
            function step(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                const tx = Math.cos(angle) * distance * ease;
                const ty = Math.sin(angle) * distance * ease;
                const scale = 1 - progress;
                el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
                el.style.opacity = 1 - progress;
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.remove();
                }
            }
            requestAnimationFrame(step);
        })(sparkle, startTime);
    }
}

/**
 * 播放气球爆炸音效（Web Audio API生成）
 */
function playPopSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.15);
        
        setTimeout(() => audioCtx.close(), 200);
    } catch(e) {
        // 静默处理，不影响游戏
    }
}

/**
 * 显示祝福弹窗
 */
function showBlessingPopup() {
    const popup = document.getElementById('blessingPopup');
    const text = document.getElementById('blessingText');
    
    // 循环使用祝福语数组
    text.textContent = balloonBlessings[blessingIndex % balloonBlessings.length];
    blessingIndex++;
    
    // 显示弹窗
    popup.classList.add('show');
    
    // 清除之前的定时器
    if (blessingTimer) {
        clearTimeout(blessingTimer);
    }
    
    // 1.2秒后自动隐藏
    blessingTimer = setTimeout(() => {
        popup.classList.remove('show');
    }, 1200);
}

/**
 * 所有气球戳完后显示完成界面
 */
function showBalloonComplete() {
    const complete = document.getElementById('balloonComplete');
    const video = document.getElementById('birthdayVideo');
    const quizBtn = document.getElementById('startQuizFromBalloon');
    
    complete.classList.add('visible');
    
    // 播放一波小烟花
    createBalloonFireworks();
    
    // 隐藏问答按钮，显示视频
    quizBtn.style.display = 'none';
    
    // 自动播放视频
    if (video) {
        video.currentTime = 0;
        video.play().catch(function(err) {
            console.log('视频自动播放被阻止，用户需手动点击播放:', err);
            // 自动播放失败时，显示问答按钮
            quizBtn.style.display = 'inline-block';
        });
        
        // 视频播放结束后显示问答按钮
        video.addEventListener('ended', function() {
            quizBtn.style.display = 'inline-block';
            quizBtn.style.animation = 'fadeInUp 0.5s ease';
        }, { once: true });
    } else {
        // 无视频时直接显示按钮
        quizBtn.style.display = 'inline-block';
    }
}

/**
 * 完成界面的烟花效果
 */
function createBalloonFireworks() {
    const container = document.getElementById('balloonFireworks');
    const colors = ['#ff9a9e', '#a18cd1', '#fad0c4', '#4facfe', '#00f2fe', '#ffdd57'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const fw = document.createElement('div');
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            fw.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                animation: fireworkBurst 1s ease-out forwards;
                box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
            `;
            container.appendChild(fw);
            
            const particles = [];
            for (let j = 0; j < 8; j++) {
                const particle = document.createElement('div');
                const angle = (j / 8) * Math.PI * 2;
                const dist = Math.random() * 40 + 20;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                
                particle.style.cssText = `
                    position: absolute;
                    left: ${x}%;
                    top: ${y}%;
                    width: 2px;
                    height: 2px;
                    background: ${color};
                    border-radius: 50%;
                    box-shadow: 0 0 5px ${color};
                    transition: all 1s ease-out;
                    opacity: 1;
                `;
                container.appendChild(particle);
                particles.push({ el: particle, tx, ty });
                
                requestAnimationFrame(() => {
                    particle.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                    particle.style.opacity = '0';
                });
            }
            
            setTimeout(() => {
                fw.remove();
                particles.forEach(p => p.el.remove());
            }, 1100);
        }, i * 150);
    }
}

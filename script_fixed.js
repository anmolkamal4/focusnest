// Global variables
let currentUser = null;
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let waterReminder = null;
let focusTimer = null;
let currentSection = 'dashboard';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUserData();
    initializeWaterReminder();
    initializeFocusMode();
    loadStudyLibrary();
    loadAITools();
    loadGamingZone();
    initializeGamingAnimations();
    createParticleSystem();
    addGamingEffects();
});

// Initialize app
function initializeApp() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-icon').className = 'fas fa-sun';
    }
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

// Authentication functions
function openLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

function openSignup() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signupModal').style.display = 'block';
}

function closeSignup() {
    document.getElementById('signupModal').style.display = 'none';
}

// Login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            fetch('api/auth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'login', email: email, password: password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        currentUser = data.user;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        closeLogin();
                        showNotification('Login successful!', 'success');
                        updateAuthButtons();
                    } else {
                        showNotification(data.error || 'Login failed!', 'error');
                    }
                })
                .catch(error => {
                    console.error('Login error:', error);
                    showNotification('Login failed! Please try again.', 'error');
                });
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }

            fetch('api/auth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'signup', name: name, email: email, password: password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        currentUser = data.user;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        closeSignup();
                        showNotification('Account created successfully!', 'success');
                        updateAuthButtons();
                    } else {
                        showNotification(data.error || 'Signup failed!', 'error');
                    }
                })
                .catch(error => {
                    console.error('Signup error:', error);
                    showNotification('Signup failed! Please try again.', 'error');
                });
        });
    }
});

// Load user data
function loadUserData() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthButtons();
    }
}

// Update authentication buttons
function updateAuthButtons() {
    const authButtons = document.querySelector('.auth-buttons');
    if (currentUser) {
        authButtons.innerHTML = `
            <span>Welcome, ${currentUser.name}</span>
            <button class="btn-logout" onclick="logout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn-login" onclick="openLogin()">Login</button>
            <button class="btn-signup" onclick="openSignup()">Sign Up</button>
        `;
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthButtons();
    showNotification('Logged out successfully!', 'success');
}

// Navigation functions
function openDayPlanner() { showSection('day-planner'); }
function openWaterReminder() { showSection('water-reminder'); }
function openStudyLibrary() { showSection('study-library'); }
function openFocusMode() { showSection('focus-mode'); }
function openGamingZone() { showSection('gaming-zone'); }
function openAITools() { showSection('ai-tools'); }

// Show section function
function showSection(sectionName) {
    document.querySelector('.container').style.display = 'none';

    let sectionPage = document.getElementById(sectionName);
    if (!sectionPage) {
        sectionPage = createSectionPage(sectionName);
        document.body.appendChild(sectionPage);
    }

    sectionPage.classList.add('active');
    currentSection = sectionName;

    if (sectionName === 'study-library') loadStudyLibrary();
    else if (sectionName === 'ai-tools') loadAITools();
    else if (sectionName === 'gaming-zone') loadGamingZone();
}

// Create section pages
function createSectionPage(sectionName) {
    const sectionPage = document.createElement('div');
    sectionPage.id = sectionName;
    sectionPage.className = 'section-page';

    const html = {
        'day-planner': createDayPlannerHTML(),
        'water-reminder': createWaterReminderHTML(),
        'study-library': createStudyLibraryHTML(),
        'focus-mode': createFocusModeHTML(),
        'gaming-zone': createGamingZoneHTML(),
        'ai-tools': createAIToolsHTML()
    };

    sectionPage.innerHTML = html[sectionName] || '';
    return sectionPage;
}

// Day Planner HTML
function createDayPlannerHTML() {
    return `
        <div class="planner-container">
            <button class="back-btn" onclick="goBack()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div class="section-header">
                <h1>Day Planner</h1>
                <p>Organize your daily schedule and track your tasks</p>
            </div>
            <div class="task-form">
                <h3>Add New Task</h3>
                <form id="taskForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="taskTitle">Task Title:</label>
                            <input type="text" id="taskTitle" placeholder="Enter task title" required>
                        </div>
                        <div class="form-group">
                            <label for="taskPriority">Priority:</label>
                            <select id="taskPriority">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="taskStart">Start Time:</label>
                            <input type="time" id="taskStart" required>
                        </div>
                        <div class="form-group">
                            <label for="taskEnd">End Time:</label>
                            <input type="time" id="taskEnd" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="taskDescription">Description:</label>
                        <textarea id="taskDescription" placeholder="Enter task description" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Add Task</button>
                </form>
            </div>
            <div class="task-list">
                <h3>Your Tasks</h3>
                <div id="taskList"></div>
            </div>
        </div>
    `;
}

// Water Reminder HTML
function createWaterReminderHTML() {
    return `
        <div class="water-container">
            <button class="back-btn" onclick="goBack()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div class="section-header">
                <h1>Water Reminder</h1>
                <p>Stay hydrated with smart notifications</p>
            </div>
            <div class="water-glass">
                <div class="water-fill" id="waterFill"></div>
            </div>
            <div class="water-controls">
                <input type="number" id="waterInterval" placeholder="Interval (minutes)" value="60" min="15" max="180">
                <button class="btn-primary" onclick="startWaterReminder()">Start Reminder</button>
                <button class="btn-primary" onclick="stopWaterReminder()">Stop Reminder</button>
                <button class="btn-primary" onclick="drinkWater()">I Drank Water</button>
            </div>
            <div class="water-stats">
                <div class="stat-card">
                    <div class="stat-number" id="glassesToday">0</div>
                    <div class="stat-label">Glasses Today</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalWater">0</div>
                    <div class="stat-label">Total ML</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="nextReminder">--:--</div>
                    <div class="stat-label">Next Reminder</div>
                </div>
            </div>
        </div>
    `;
}

// Study Library HTML
function createStudyLibraryHTML() {
    return `
        <div class="library-container">
            <button class="back-btn" onclick="goBack()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div class="section-header">
                <h1>Study Library</h1>
                <p>Access free programming books and educational resources</p>
            </div>
            <div class="library-grid" id="libraryGrid"></div>
        </div>
    `;
}

// Focus Mode HTML
function createFocusModeHTML() {
    return `
        <div class="focus-container">
            <button class="back-btn" onclick="goBack()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div class="section-header">
                <h1>Focus Mode</h1>
                <p>Concentrate with ambient sounds and productivity music</p>
            </div>
            <div class="focus-timer" id="focusTimer">25:00</div>
            <div class="focus-controls">
                <button class="btn-primary" onclick="startFocus()">Start Focus</button>
                <button class="btn-primary" onclick="pauseFocus()">Pause</button>
                <button class="btn-primary" onclick="resetFocus()">Reset</button>
            </div>
            <div class="sound-options">
                <div class="sound-card" onclick="selectSound('rain')">
                    <div class="sound-icon">🌧️</div>
                    <div class="sound-name">Rain</div>
                    <div class="sound-description">Gentle rain sounds</div>
                </div>
                <div class="sound-card" onclick="selectSound('forest')">
                    <div class="sound-icon">🌲</div>
                    <div class="sound-name">Forest</div>
                    <div class="sound-description">Nature sounds</div>
                </div>
                <div class="sound-card" onclick="selectSound('ocean')">
                    <div class="sound-icon">🌊</div>
                    <div class="sound-name">Ocean</div>
                    <div class="sound-description">Wave sounds</div>
                </div>
                <div class="sound-card" onclick="selectSound('cafe')">
                    <div class="sound-icon">☕</div>
                    <div class="sound-name">Cafe</div>
                    <div class="sound-description">Coffee shop ambience</div>
                </div>
            </div>
        </div>
    `;
}

// Gaming Zone HTML
function createGamingZoneHTML() {
    return `
        <div class="games-container">
            <button class="back-btn" onclick="goBack()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div class="section-header">
                <h1>Gaming Zone</h1>
                <p>Relax with fun games and brain teasers</p>
            </div>
            <div class="games-grid" id="gamesGrid"></div>
        </div>
    `;
}

// AI Tools HTML
function createAIToolsHTML() {
    return `
        <div class="ai-container">
            <button class="back-btn" onclick="goBack()">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div class="section-header">
                <h1>AI Tools</h1>
                <p>Access powerful AI tools for learning and productivity</p>
            </div>
            <div class="ai-grid" id="aiGrid"></div>
        </div>
    `;
}

// Go back function
function goBack() {
    const currentSectionPage = document.getElementById(currentSection);
    if (currentSectionPage) {
        currentSectionPage.classList.remove('active');
    }
    document.querySelector('.container').style.display = 'block';
    currentSection = 'dashboard';
}

// Study Library functions - Enhanced with more languages
const programmingBooks = [
    // JavaScript
    { title: "Eloquent JavaScript", author: "Marijn Haverbeke", description: "A Modern Introduction to Programming", icon: "📚", url: "https://eloquentjavascript.net/", category: "JavaScript", level: "Beginner to Advanced" },
    { title: "You Don't Know JS", author: "Kyle Simpson", description: "Deep dive into JavaScript mechanisms", icon: "🔍", url: "https://github.com/getify/You-Dont-Know-JS", category: "JavaScript", level: "Advanced" },
    { title: "JavaScript.info", author: "Ilya Kantor", description: "The Modern JavaScript Tutorial", icon: "⚡", url: "https://javascript.info/", category: "JavaScript", level: "All Levels" },
    
    // Python
    { title: "Automate the Boring Stuff", author: "Al Sweigart", description: "Learn Python through practical projects", icon: "🐍", url: "https://automatetheboringstuff.com/", category: "Python", level: "Beginner" },
    { title: "Think Python", author: "Allen B. Downey", description: "How to Think Like a Computer Scientist", icon: "🧠", url: "https://greenteapress.com/wp/think-python-2e/", category: "Python", level: "Beginner" },
    { title: "Real Python", author: "Real Python Team", description: "Comprehensive Python tutorials", icon: "🚀", url: "https://realpython.com/", category: "Python", level: "All Levels" },
    
    // Java
    { title: "Oracle Java Tutorials", author: "Oracle Corporation", description: "Official Java programming tutorials", icon: "☕", url: "https://docs.oracle.com/javase/tutorial/", category: "Java", level: "All Levels" },
    { title: "Introduction to Programming Using Java", author: "David J. Eck", description: "Free online Java textbook", icon: "📚", url: "http://math.hws.edu/javanotes/", category: "Java", level: "Beginner" },
    
    // C++
    { title: "Learn C++", author: "LearnCpp.com", description: "Comprehensive C++ tutorial", icon: "🔧", url: "https://www.learncpp.com/", category: "C++", level: "All Levels" },
    { title: "C++ Reference", author: "cppreference.com", description: "Complete C++ language reference", icon: "📖", url: "https://en.cppreference.com/", category: "C++", level: "All Levels" },
    
    // C#
    { title: "C# Tutorial", author: "Microsoft", description: "Official C# programming guide", icon: "🔷", url: "https://learn.microsoft.com/en-us/dotnet/csharp/", category: "C#", level: "All Levels" },
    { title: "C# Yellow Book", author: "Rob Miles", description: "Free C# programming book", icon: "📒", url: "https://www.robmiles.com/c-yellow-book/", category: "C#", level: "Beginner" },
    
    // Go
    { title: "A Tour of Go", author: "Google", description: "Interactive introduction to Go", icon: "🐹", url: "https://tour.golang.org/", category: "Go", level: "Beginner" },
    { title: "Go by Example", author: "Go Community", description: "Hands-on introduction to Go", icon: "📝", url: "https://gobyexample.com/", category: "Go", level: "Beginner" },
    
    // Rust
    { title: "The Rust Programming Language", author: "Rust Team", description: "Official Rust book", icon: "🦀", url: "https://doc.rust-lang.org/book/", category: "Rust", level: "All Levels" },
    { title: "Rust by Example", author: "Rust Community", description: "Learn Rust through examples", icon: "⚡", url: "https://doc.rust-lang.org/rust-by-example/", category: "Rust", level: "Beginner" },
    
    // Swift
    { title: "Swift Programming Language", author: "Apple Inc.", description: "Complete Swift language guide", icon: "🦉", url: "https://docs.swift.org/swift-book/", category: "Swift", level: "All Levels" },
    
    // Kotlin
    { title: "Kotlin Documentation", author: "JetBrains", description: "Official Kotlin documentation", icon: "🎯", url: "https://kotlinlang.org/docs/", category: "Kotlin", level: "All Levels" },
    { title: "Kotlin Koans", author: "JetBrains", description: "Interactive Kotlin exercises", icon: "🧩", url: "https://play.kotlinlang.org/koans/", category: "Kotlin", level: "Beginner" },
    
    // TypeScript
    { title: "TypeScript Handbook", author: "Microsoft", description: "Official TypeScript documentation", icon: "📘", url: "https://www.typescriptlang.org/docs/", category: "TypeScript", level: "All Levels" },
    { title: "TypeScript Deep Dive", author: "Basarat Ali Syed", description: "Comprehensive TypeScript guide", icon: "🔍", url: "https://basarat.gitbook.io/typescript/", category: "TypeScript", level: "Advanced" },
    
    // PHP
    { title: "PHP Manual", author: "PHP Group", description: "Official PHP documentation", icon: "🐘", url: "https://www.php.net/manual/", category: "PHP", level: "All Levels" },
    { title: "PHP: The Right Way", author: "PHP Community", description: "Best practices guide", icon: "📋", url: "https://phptherightway.com/", category: "PHP", level: "Intermediate" },
    
    // Ruby
    { title: "Ruby in Twenty Minutes", author: "Ruby Community", description: "Quick Ruby introduction", icon: "💎", url: "https://www.ruby-lang.org/en/documentation/quickstart/", category: "Ruby", level: "Beginner" },
    { title: "Ruby on Rails Tutorial", author: "Michael Hartl", description: "Learn web development with Rails", icon: "🚂", url: "https://www.railstutorial.org/", category: "Ruby", level: "Intermediate" },
    
    // Dart/Flutter
    { title: "Dart Language Tour", author: "Google", description: "Official Dart programming guide", icon: "🎯", url: "https://dart.dev/guides/language/language-tour", category: "Dart", level: "All Levels" },
    { title: "Flutter Documentation", author: "Google", description: "Learn Dart through Flutter", icon: "📱", url: "https://flutter.dev/docs", category: "Flutter", level: "All Levels" },
    
    // Scala
    { title: "Scala Documentation", author: "Scala Center", description: "Official Scala documentation", icon: "🔺", url: "https://docs.scala-lang.org/", category: "Scala", level: "All Levels" },
    
    // R
    { title: "R for Data Science", author: "Hadley Wickham", description: "Learn R for data analysis", icon: "📊", url: "https://r4ds.had.co.nz/", category: "R", level: "Beginner" },
    
    // Haskell
    { title: "Learn You a Haskell", author: "Miran Lipovača", description: "Fun introduction to Haskell", icon: "λ", url: "http://learnyouahaskell.com/", category: "Haskell", level: "Beginner" },
    
    // Clojure
    { title: "Clojure for the Brave and True", author: "Daniel Higginbotham", description: "Fun Clojure introduction", icon: "🔮", url: "https://www.braveclojure.com/", category: "Clojure", level: "Beginner" },
    
    // Elixir
    { title: "Elixir Getting Started", author: "Elixir Team", description: "Official Elixir guide", icon: "💧", url: "https://elixir-lang.org/getting-started/introduction.html", category: "Elixir", level: "Beginner" },
    
    // SQL
    { title: "SQLBolt", author: "SQLBolt Team", description: "Interactive SQL lessons", icon: "🗃️", url: "https://sqlbolt.com/", category: "SQL", level: "Beginner" },
    
    // Web Development
    { title: "MDN Web Docs", author: "Mozilla", description: "Complete web development documentation", icon: "🌐", url: "https://developer.mozilla.org/en-US/docs/Web", category: "Web Dev", level: "All Levels" },
    { title: "React Documentation", author: "Facebook", description: "Official React library documentation", icon: "⚛️", url: "https://reactjs.org/docs/", category: "React", level: "All Levels" },
    { title: "Vue.js Guide", author: "Vue Team", description: "Official Vue.js framework guide", icon: "💚", url: "https://vuejs.org/guide/", category: "Vue.js", level: "All Levels" },
    { title: "Angular Documentation", author: "Google", description: "Official Angular framework docs", icon: "🅰️", url: "https://angular.io/docs", category: "Angular", level: "All Levels" },
    
    // Machine Learning
    { title: "Machine Learning Yearning", author: "Andrew Ng", description: "ML project strategy guide", icon: "🤖", url: "https://www.deeplearning.ai/machine-learning-yearning/", category: "ML", level: "Intermediate" },
    { title: "Python Data Science Handbook", author: "Jake VanderPlas", description: "Essential data science tools", icon: "📈", url: "https://jakevdp.github.io/PythonDataScienceHandbook/", category: "Data Science", level: "Intermediate" }
];

function loadStudyLibrary() {
    const libraryGrid = document.getElementById('libraryGrid');
    if (!libraryGrid) return;

    libraryGrid.innerHTML = programmingBooks.map(book => `
        <div class="book-card" onclick="openBook('${book.url}')">
            <div class="book-cover">
                <span class="book-icon">${book.icon}</span>
            </div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
                <div class="book-category">${book.category}</div>
                <div class="book-level">${book.level}</div>
                <div class="book-description">${book.description}</div>
                <div class="book-actions">
                    <button class="btn-read" onclick="openBook('${book.url}')">Read Now</button>
                    <button class="btn-download" onclick="downloadBook('${book.title}')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openBook(url) {
    window.open(url, '_blank');
}

function downloadBook(title) {
    showNotification(`Download started for: ${title}`, 'success');
}

// AI Tools functions - 50+ AI tools
const aiTools = [
    // General AI Assistants
    { name: "ChatGPT", description: "Advanced AI assistant for learning and productivity", icon: "🤖", url: "https://chat.openai.com", use: "General conversations, learning, problem-solving, creative writing", features: ["Text generation", "Code help", "Learning assistance"] },
    { name: "Claude", description: "AI assistant by Anthropic", icon: "🧠", url: "https://claude.ai", use: "Research assistance, writing, analysis, coding help", features: ["Long conversations", "Document analysis", "Ethical AI"] },
    { name: "Google Bard", description: "Google's conversational AI", icon: "🎭", url: "https://bard.google.com", use: "Creative writing, research, brainstorming", features: ["Real-time info", "Creative tasks", "Multi-modal"] },
    { name: "Bing Chat", description: "Microsoft's AI-powered search", icon: "🔍", url: "https://www.bing.com/chat", use: "Web search with AI, current events", features: ["Web integration", "Current info", "Citations"] },
    { name: "Perplexity AI", description: "AI-powered search engine", icon: "🔎", url: "https://www.perplexity.ai", use: "Research, fact-checking, academic queries", features: ["Source citations", "Real-time data", "Academic focus"] },
    
    // Code Assistants
    { name: "GitHub Copilot", description: "AI code completion", icon: "💻", url: "https://github.com/features/copilot", use: "Code completion, bug fixes, documentation", features: ["Code completion", "Bug detection", "Documentation"] },
    { name: "Tabnine", description: "AI code completion for multiple languages", icon: "⚡", url: "https://www.tabnine.com", use: "Code autocompletion, function suggestions", features: ["Multi-language", "Team training", "Privacy focused"] },
    { name: "Codeium", description: "Free AI-powered code acceleration", icon: "🚀", url: "https://codeium.com", use: "Code generation, autocomplete, chat assistance", features: ["Free tier", "40+ languages", "IDE integration"] },
    { name: "Amazon CodeWhisperer", description: "AI coding companion by Amazon", icon: "☁️", url: "https://aws.amazon.com/codewhisperer/", use: "Code suggestions, security scanning", features: ["AWS optimized", "Security scan", "Multi-language"] },
    { name: "Replit Ghostwriter", description: "AI pair programmer for Replit", icon: "👻", url: "https://replit.com/site/ghostwriter", use: "Code completion, debugging, explanation", features: ["IDE integrated", "Code explanation", "Debugging help"] },
    
    // Writing Assistants
    { name: "Grammarly", description: "AI-powered writing assistant", icon: "✍️", url: "https://www.grammarly.com", use: "Grammar checking, style improvement", features: ["Grammar check", "Style suggestions", "Plagiarism detection"] },
    { name: "Jasper AI", description: "AI content creation platform", icon: "📝", url: "https://www.jasper.ai", use: "Marketing copy, blog posts, social media", features: ["Templates", "Brand voice", "SEO optimization"] },
    { name: "Copy.ai", description: "AI copywriter for marketing", icon: "📄", url: "https://www.copy.ai", use: "Sales copy, email campaigns, product descriptions", features: ["Marketing focus", "Templates", "Team collaboration"] },
    { name: "Writesonic", description: "AI writing tool for content creation", icon: "🎵", url: "https://writesonic.com", use: "Articles, ads, landing pages", features: ["SEO articles", "Ad copy", "Chatbot creation"] },
    { name: "QuillBot", description: "AI paraphrasing and writing enhancement", icon: "🪶", url: "https://quillbot.com", use: "Paraphrasing, summarizing, grammar checking", features: ["Paraphrasing", "Summarizer", "Citation generator"] },
    
    // Design & Creative
    { name: "Midjourney", description: "AI image generation from text", icon: "🎨", url: "https://www.midjourney.com", use: "Artistic image creation, concept art", features: ["High quality art", "Style variety", "Community"] },
    { name: "DALL-E 2", description: "OpenAI's image generation system", icon: "🖼️", url: "https://openai.com/dall-e-2/", use: "Image creation, editing, variations", features: ["Realistic images", "Inpainting", "Variations"] },
    { name: "Stable Diffusion", description: "Open-source AI image generation", icon: "🌊", url: "https://stability.ai/stablediffusion", use: "Free image generation, custom models", features: ["Open source", "Customizable", "Local deployment"] },
    { name: "Canva AI", description: "AI-powered design tools", icon: "🎭", url: "https://www.canva.com/ai-image-generator/", use: "Design creation, image generation", features: ["Design templates", "Brand kit", "Team collaboration"] },
    { name: "Adobe Firefly", description: "Adobe's creative AI", icon: "🔥", url: "https://www.adobe.com/products/firefly.html", use: "Creative image generation, text effects", features: ["Commercial safe", "Adobe integration", "Text effects"] },
    
    // Video & Audio
    { name: "Runway ML", description: "AI tools for video editing", icon: "🎬", url: "https://runwayml.com", use: "Video editing, AI effects, content creation", features: ["Video generation", "AI effects", "Collaboration"] },
    { name: "Synthesia", description: "AI video generation with virtual presenters", icon: "🎥", url: "https://www.synthesia.io", use: "Training videos, presentations", features: ["AI avatars", "Multiple languages", "Custom avatars"] },
    { name: "Murf AI", description: "AI voice generator for voiceovers", icon: "🎙️", url: "https://murf.ai", use: "Voiceovers, podcasts, presentations", features: ["Natural voices", "Multiple accents", "Voice cloning"] },
    { name: "ElevenLabs", description: "AI voice synthesis and cloning", icon: "🔊", url: "https://elevenlabs.io", use: "Voice cloning, speech synthesis", features: ["Voice cloning", "Multiple languages", "Realistic speech"] },
    { name: "Descript", description: "AI-powered audio and video editing", icon: "🎞️", url: "https://www.descript.com", use: "Podcast editing, transcription", features: ["Overdub", "Transcription", "Screen recording"] },
    
    // Research & Analysis
    { name: "Semantic Scholar", description: "AI-powered academic search", icon: "📚", url: "https://www.semanticscholar.org", use: "Academic research, paper discovery", features: ["Academic focus", "Citation tracking", "Research insights"] },
    { name: "Elicit", description: "AI research assistant", icon: "🔬", url: "https://elicit.org", use: "Literature reviews, research questions", features: ["Research automation", "Paper analysis", "Question answering"] },
    { name: "Consensus", description: "AI-powered scientific research", icon: "📊", url: "https://consensus.app", use: "Scientific research, evidence-based answers", features: ["Evidence-based", "Scientific papers", "Consensus tracking"] },
    { name: "ResearchRabbit", description: "AI tool for academic paper discovery", icon: "🐰", url: "https://www.researchrabbit.ai", use: "Paper recommendations, research mapping", features: ["Paper discovery", "Visual maps", "Collaboration"] },
    
    // Productivity & Organization
    { name: "Notion AI", description: "AI writing assistant for Notion", icon: "📋", url: "https://www.notion.so/product/ai", use: "Note-taking, content generation", features: ["Workspace integration", "Content generation", "Organization"] },
    { name: "Otter.ai", description: "AI meeting transcription", icon: "🦦", url: "https://otter.ai", use: "Meeting transcription, note-taking", features: ["Real-time transcription", "Meeting summaries", "Speaker identification"] },
    { name: "Calendly AI", description: "AI-powered scheduling", icon: "📅", url: "https://calendly.com", use: "Meeting scheduling, calendar management", features: ["Smart scheduling", "Calendar integration", "Automated workflows"] },
    { name: "Reclaim.ai", description: "AI calendar assistant", icon: "⏰", url: "https://reclaim.ai", use: "Time blocking, habit scheduling", features: ["Smart scheduling", "Habit tracking", "Focus protection"] },
    
    // Learning & Education
    { name: "Khan Academy AI", description: "AI tutor for personalized learning", icon: "🎓", url: "https://www.khanacademy.org", use: "Personalized tutoring, homework help", features: ["Personalized learning", "Progress tracking", "Interactive exercises"] },
    { name: "Socratic by Google", description: "AI homework helper", icon: "🤔", url: "https://socratic.org", use: "Homework help, concept explanation", features: ["Photo-based questions", "Step-by-step help", "Multiple subjects"] },
    { name: "Coursera AI", description: "AI-powered course recommendations", icon: "🏫", url: "https://www.coursera.org", use: "Course recommendations, skill assessment", features: ["Personalized courses", "Skill assessment", "Career paths"] },
    { name: "Duolingo AI", description: "AI language learning", icon: "🦜", url: "https://www.duolingo.com", use: "Language learning, pronunciation practice", features: ["Adaptive learning", "Speech recognition", "Gamification"] },
    
    // Data Analysis & Visualization
    { name: "Tableau AI", description: "AI-powered data visualization", icon: "📈", url: "https://www.tableau.com", use: "Data visualization, business intelligence", features: ["Smart visualizations", "Natural language queries", "Automated insights"] },
    { name: "DataRobot", description: "Automated machine learning", icon: "🤖", url: "https://www.datarobot.com", use: "Automated ML, predictive modeling", features: ["AutoML", "Model deployment", "Explainable AI"] },
    { name: "MonkeyLearn", description: "AI text analysis", icon: "🐵", url: "https://monkeylearn.com", use: "Text analysis, sentiment analysis", features: ["Text classification", "Sentiment analysis", "Custom models"] },
    
    // Business & Marketing
    { name: "HubSpot AI", description: "AI-powered CRM", icon: "🎯", url: "https://www.hubspot.com", use: "Lead generation, email marketing", features: ["Lead scoring", "Email automation", "Chatbots"] },
    { name: "Salesforce Einstein", description: "AI for CRM", icon: "⚡", url: "https://www.salesforce.com/products/einstein/", use: "Sales forecasting, lead scoring", features: ["Predictive analytics", "Automated insights", "Personalization"] },
    { name: "Hootsuite AI", description: "AI social media management", icon: "🦉", url: "https://www.hootsuite.com", use: "Social media scheduling, analytics", features: ["Content suggestions", "Best time posting", "Performance analytics"] },
    
    // Development Tools
    { name: "Vercel AI", description: "AI-powered web development", icon: "▲", url: "https://vercel.com/ai", use: "Web development, AI app deployment", features: ["AI templates", "Edge functions", "Performance insights"] },
    { name: "Replicate", description: "Platform for running AI models", icon: "🔄", url: "https://replicate.com", use: "AI model deployment, API access", features: ["Model hosting", "API access", "Custom training"] },
    { name: "Hugging Face", description: "Open-source AI model hub", icon: "🤗", url: "https://huggingface.co", use: "Pre-trained models, model fine-tuning", features: ["Model hub", "Transformers library", "Datasets"] },
    
    // Specialized AI Tools
    { name: "DeepL", description: "AI-powered translation", icon: "🌍", url: "https://www.deepl.com", use: "Document translation, real-time translation", features: ["High accuracy", "Document translation", "API access"] },
    { name: "Loom AI", description: "AI-enhanced screen recording", icon: "📹", url: "https://www.loom.com", use: "Screen recording, video messages", features: ["Auto-transcription", "Video editing", "Analytics"] },
    { name: "Zapier AI", description: "AI-powered workflow automation", icon: "⚡", url: "https://zapier.com", use: "Workflow automation, app integration", features: ["App connections", "Automated workflows", "AI suggestions"] },
    { name: "IFTTT AI", description: "AI automation for smart devices", icon: "🔗", url: "https://ifttt.com", use: "Smart home automation, app triggers", features: ["Device automation", "App triggers", "Smart suggestions"] },
    { name: "Wolfram Alpha", description: "Computational knowledge engine", icon: "🧮", url: "https://www.wolframalpha.com", use: "Mathematical computation, data analysis", features: ["Step-by-step solutions", "Data computation", "Knowledge base"] },
    
    // Additional Specialized Tools
    { name: "Character.AI", description: "AI chatbots with personalities", icon: "🎭", url: "https://character.ai", use: "Creative conversations, role-playing", features: ["Character creation", "Personality simulation", "Creative writing"] },
    { name: "Poe by Quora", description: "Access to multiple AI models", icon: "🔮", url: "https://poe.com", use: "Multi-model AI access, comparisons", features: ["Multiple AI models", "Model comparison", "Subscription access"] },
    { name: "Anthropic Claude", description: "Constitutional AI assistant", icon: "🏛️", url: "https://www.anthropic.com", use: "Safe AI conversations, research", features: ["Constitutional AI", "Safety focused", "Research applications"] },
    { name: "Cohere", description: "Enterprise AI platform", icon: "🏢", url: "https://cohere.ai", use: "Enterprise AI solutions, NLP", features: ["Enterprise focus", "NLP models", "API access"] },
    { name: "AI21 Labs", description: "Advanced language models", icon: "🧬", url: "https://www.ai21.com", use: "Text generation, language understanding", features: ["Advanced models", "API access", "Custom solutions"] }
];

function loadAITools() {
    const aiGrid = document.getElementById('aiGrid');
    if (!aiGrid) return;

    aiGrid.innerHTML = aiTools.map(tool => `
        <div class="ai-card" onclick="openAITool('${tool.url}')">
            <div class="ai-logo">
                <span class="ai-icon">${tool.icon}</span>
            </div>
            <div class="ai-title">${tool.name}</div>
            <div class="ai-description">${tool.description}</div>
            <div class="ai-use"><strong>Use for:</strong> ${tool.use}</div>
            <ul class="ai-features">
                ${tool.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="btn-visit" onclick="openAITool('${tool.url}')">Visit Tool</button>
        </div>
    `).join('');
}

function openAITool(url) {
    window.open(url, '_blank');
}

// Gaming Zone functions - Enhanced with more games
const games = [
    { name: "Typing Speed Test", description: "Improve your typing speed and accuracy with various difficulty levels", icon: "⌨️", category: "Skill Game", features: ["Speed tracking", "Accuracy measurement", "Progress stats", "Multiple texts"] },
    { name: "Chess Master", description: "Play chess against AI or solve tactical puzzles", icon: "♟️", category: "Strategy Game", features: ["AI opponents", "Puzzle mode", "Difficulty levels", "Move analysis"] },
    { name: "Word Search Pro", description: "Find hidden words in themed grids with time challenges", icon: "🔍", category: "Puzzle Game", features: ["Multiple themes", "Timer mode", "Hint system", "Score tracking"] },
    { name: "Memory Match", description: "Test your memory with card matching games", icon: "🧠", category: "Memory Game", features: ["Multiple card sets", "Difficulty levels", "Time tracking", "High scores"] },
    { name: "Math Quiz Challenge", description: "Sharpen your math skills with timed quizzes", icon: "🔢", category: "Educational Game", features: ["Multiple operations", "Difficulty levels", "Progress tracking", "Achievements"] },
    { name: "Code Breaker", description: "Solve programming logic puzzles and algorithms", icon: "💻", category: "Logic Game", features: ["Algorithm puzzles", "Multiple languages", "Hints available", "Learning mode"] },
    { name: "Geography Quiz", description: "Test your knowledge of world geography", icon: "🌍", category: "Educational Game", features: ["Country capitals", "Flag recognition", "Map challenges", "Leaderboard"] },
    { name: "Sudoku Solver", description: "Classic number puzzle game with multiple difficulties", icon: "🔢", category: "Puzzle Game", features: ["Multiple difficulties", "Hint system", "Auto-save", "Statistics"] },
    { name: "Crossword Puzzle", description: "Daily crossword puzzles to expand vocabulary", icon: "📝", category: "Word Game", features: ["Daily puzzles", "Clue hints", "Progress save", "Difficulty levels"] },
    { name: "Snake Game", description: "Classic snake game with modern twists", icon: "🐍", category: "Arcade Game", features: ["Power-ups", "Multiple modes", "High scores", "Customizable"] },
    { name: "Tetris Clone", description: "Block-stacking puzzle game for spatial thinking", icon: "🧩", category: "Puzzle Game", features: ["Classic gameplay", "Speed levels", "Line clearing", "Score system"] },
    { name: "2048 Numbers", description: "Combine numbers to reach the 2048 tile", icon: "🎯", category: "Logic Game", features: ["Swipe controls", "Undo moves", "Best score", "Animations"] },
    { name: "Hangman Game", description: "Guess the word before the drawing is complete", icon: "🎪", category: "Word Game", features: ["Word categories", "Difficulty levels", "Hint system", "Score tracking"] },
    { name: "Trivia Challenge", description: "Test your general knowledge across various topics", icon: "🧠", category: "Quiz Game", features: ["Multiple categories", "Timed questions", "Leaderboard", "Achievements"] },
    { name: "Jigsaw Puzzle", description: "Solve beautiful jigsaw puzzles online", icon: "🧩", category: "Puzzle Game", features: ["Multiple images", "Piece count options", "Progress save", "Timer"] },
    { name: "Bubble Shooter", description: "Match colored bubbles to clear the board", icon: "🎈", category: "Arcade Game", features: ["Power-ups", "Level progression", "High scores", "Combo system"] },
    { name: "Solitaire Cards", description: "Classic card game with multiple variations", icon: "🃏", category: "Card Game", features: ["Multiple variants", "Auto-complete", "Statistics", "Themes"] },
    { name: "Minesweeper", description: "Classic mine detection puzzle game", icon: "💣", category: "Logic Game", features: ["Multiple difficulties", "Custom grids", "Timer", "Flag system"] },
    { name: "Pac-Man Style", description: "Navigate mazes while avoiding enemies", icon: "👻", category: "Arcade Game", features: ["Multiple levels", "Power pellets", "Score system", "Ghost AI"] },
    { name: "Breakout Game", description: "Break bricks with a bouncing ball and paddle", icon: "🏓", category: "Arcade Game", features: ["Power-ups", "Multiple levels", "Brick patterns", "Lives system"] }
];

function loadGamingZone() {
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) return;

    gamesGrid.innerHTML = games.map(game => `
        <div class="game-card" onclick="startGame('${game.name}')">
            <div class="game-preview">
                <span class="game-icon">${game.icon}</span>
            </div>
            <div class="game-info">
                <div class="game-title">${game.name}</div>
                <div class="game-description">${game.description}</div>
                <div class="game-category">${game.category}</div>
                <div class="game-features">
                    ${game.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <button class="btn-play" onclick="startGame('${game.name}')">Play Now</button>
            </div>
        </div>
    `).join('');
}

function startGame(gameName) {
    showNotification(`Starting ${gameName}...`, 'success');
}

// Water reminder functions
let waterStats = { glassesToday: 0, totalML: 0, lastDrink: null, reminderInterval: null };

function initializeWaterReminder() {
    loadWaterStats();
    updateWaterDisplay();
}

function loadWaterStats() {
    const saved = localStorage.getItem('waterStats');
    if (saved) {
        waterStats = JSON.parse(saved);
        updateWaterDisplay();
        updateWaterFill();
    }
}

function startWaterReminder() {
    const interval = parseInt(document.getElementById('waterInterval').value) || 60;
    if (waterReminder) clearInterval(waterReminder);
    
    waterReminder = setInterval(() => {
        showWaterNotification();
    }, interval * 60 * 1000);
    
    showNotification(`Water reminder started! You'll be reminded every ${interval} minutes.`, 'success');
    updateNextReminder(interval);
}

function stopWaterReminder() {
    if (waterReminder) {
        clearInterval(waterReminder);
        waterReminder = null;
        showNotification('Water reminder stopped!', 'success');
        document.getElementById('nextReminder').textContent = '--:--';
    }
}

function drinkWater() {
    waterStats.glassesToday++;
    waterStats.totalML += 250;
    waterStats.lastDrink = new Date().toISOString();
    localStorage.setItem('waterStats', JSON.stringify(waterStats));
    updateWaterDisplay();
    updateWaterFill();
    showNotification('Great! Keep staying hydrated! 💧', 'success');
}

function updateWaterDisplay() {
    const glassesTodayEl = document.getElementById('glassesToday');
    const totalWaterEl = document.getElementById('totalWater');
    if (glassesTodayEl) glassesTodayEl.textContent = waterStats.glassesToday;
    if (totalWaterEl) totalWaterEl.textContent = waterStats.totalML;
}

function updateWaterFill() {
    const waterFill = document.getElementById('waterFill');
    if (waterFill) {
        const percentage = Math.min((waterStats.glassesToday / 8) * 100, 100);
        waterFill.style.height = `${percentage}%`;
    }
}

function updateNextReminder(intervalMinutes) {
    const nextReminderEl = document.getElementById('nextReminder');
    if (nextReminderEl) {
        const nextTime = new Date();
        nextTime.setMinutes(nextTime.getMinutes() + intervalMinutes);
        nextReminderEl.textContent = nextTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

function showWaterNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Time to drink water! 💧', {
            body: 'Stay hydrated for better productivity!',
            icon: '/favicon.ico'
        });
    } else {
        alert('💧 Time to drink water! Stay hydrated!');
    }
}

// Focus mode functions
let focusTime = 25 * 60;
let focusInterval = null;
let isFocusing = false;
let selectedSound = 'rain';

function initializeFocusMode() {
    updateFocusTimer();
}

function startFocus() {
    if (isFocusing) return;
    
    isFocusing = true;
    focusInterval = setInterval(() => {
        focusTime--;
        updateFocusTimer();
        
        if (focusTime <= 0) {
            clearInterval(focusInterval);
            isFocusing = false;
            showNotification('Focus session completed! Take a break.', 'success');
        }
    }, 1000);
    
    showNotification('Focus session started!', 'success');
}

function pauseFocus() {
    if (focusInterval) {
        clearInterval(focusInterval);
        focusInterval = null;
        isFocusing = false;
        showNotification('Focus session paused', 'success');
    }
}

function resetFocus() {
    clearInterval(focusInterval);
    focusInterval = null;
    isFocusing = false;
    focusTime = 25 * 60;
    updateFocusTimer();
    showNotification('Focus session reset', 'success');
}

function updateFocusTimer() {
    const timerEl = document.getElementById('focusTimer');
    if (timerEl) {
        const minutes = Math.floor(focusTime / 60);
        const seconds = focusTime % 60;
        timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function selectSound(sound) {
    selectedSound = sound;
    showNotification(`Selected sound: ${sound}`, 'success');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Gaming animations and effects
function initializeGamingAnimations() {
    // Add gaming-style animations
}

function createParticleSystem() {
    // Create particle effects
}

function addGamingEffects() {
    // Add gaming visual effects
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
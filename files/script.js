// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
let currentSection = 'home';
let previousSection = 'home';

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Get the section name from data attribute
        const sectionName = link.getAttribute('data-section');
        
        // Show the corresponding section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = sectionName;
        }
    });
});

// Set home as active by default
navLinks[0].classList.add('active');

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initializeTheme);

// --- Markdown post rendering & navigation ---
// Handle clicks on any element that has a `data-md` attribute
function attachMarkdownLinks() {
    document.querySelectorAll('[data-md]').forEach(el => {
        el.addEventListener('click', async (e) => {
            e.preventDefault();
            const mdPath = el.getAttribute('data-md');
            if (!mdPath) return;
            previousSection = currentSection || 'home';
            await openAndRenderMarkdown(mdPath);
        });
    });
}

async function openAndRenderMarkdown(path) {
    const postSection = document.getElementById('post');
    const postContent = document.getElementById('post-content');
    // If the site is opened via file://, fetch will fail — give a helpful message
    if (window.location.protocol === 'file:') {
        postContent.innerHTML = '<p><strong>Cannot load markdown files when opening the HTML directly (file://).</strong></p>' +
            '<p>Start a simple local HTTP server from the project root and open <code>http://localhost:8000/</code> instead.</p>' +
            '<pre>python3 -m http.server 8000\n# then open: http://localhost:8000/</pre>';
        contentSections.forEach(s => s.classList.remove('active'));
        postSection.classList.add('active');
        return;
    }
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('Failed to load');
        const md = await res.text();
        const html = marked.parse(md);
        const clean = DOMPurify.sanitize(html);
        postContent.innerHTML = clean;

        // Render LaTeX (KaTeX auto-render)
        if (typeof renderMathInElement === 'function') {
            renderMathInElement(postContent, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ]
            });
        }

        // Show post section, hide others
        contentSections.forEach(s => s.classList.remove('active'));
        postSection.classList.add('active');
    } catch (err) {
        postContent.innerHTML = '<p>Unable to load content.</p>';
        contentSections.forEach(s => s.classList.remove('active'));
        postSection.classList.add('active');
        console.error('Error loading markdown:', err);
    }
}

// Back button for post view
const postBackBtn = document.getElementById('postBack');
if (postBackBtn) {
    postBackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Hide post and show previous section
        document.getElementById('post').classList.remove('active');
        const prev = document.getElementById(previousSection) || document.getElementById('home');
        contentSections.forEach(s => s.classList.remove('active'));
        if (prev) prev.classList.add('active');
        // restore nav active state
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-section') === previousSection));
        currentSection = previousSection;
    });
}

// Attach markdown link handlers on load
document.addEventListener('DOMContentLoaded', () => {
    attachMarkdownLinks();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

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

// Parse frontmatter from markdown
function parseFrontmatter(md) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = md.match(frontmatterRegex);
    
    if (!match) return { meta: {}, content: md };
    
    const frontmatterStr = match[1];
    const content = match[2];
    const meta = {};
    
    // Parse YAML-like frontmatter
    frontmatterStr.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key) {
            meta[key.trim()] = valueParts.join(':').trim();
        }
    });
    
    return { meta, content };
}

// Extract first N lines from markdown content
function getFirstLines(md, lines = 5) {
    const textLines = md.split('\n').filter(line => line.trim().length > 0);
    return textLines.slice(0, lines).join('\n');
}

// Load and render all blogs directly on the page
async function loadAllBlogs() {
    const blogsContainer = document.getElementById('blogs-container');
    if (!blogsContainer) return;

    // Try to load a blog index JSON listing files. If missing, fall back to hardcoded list.
    let blogFiles = ['post1.md', 'post2.md', 'post3.md', 'post4.md', 'post5.md'];
    try {
        const idxRes = await fetch('content/blogs/index.json');
        if (idxRes.ok) {
            const list = await idxRes.json();
            if (Array.isArray(list) && list.length) {
                blogFiles = list;
            }
        }
    } catch (err) {
        // ignore and fall back to default list
        console.warn('Could not load content/blogs/index.json, using fallback list.');
    }
    const blogPosts = [];

    // Fetch and parse each blog file
    for (const file of blogFiles) {
        const path = `content/blogs/${file}`;
        try {
            const res = await fetch(path);
            if (res.ok) {
                const md = await res.text();
                const { meta, content } = parseFrontmatter(md);
                
                // Extract date from frontmatter, fallback to filename
                let date = new Date(meta.date) || new Date(0);
                if (isNaN(date.getTime())) {
                    date = new Date(0);
                }
                
                blogPosts.push({
                    path,
                    file,
                    date,
                    meta,
                    title: meta.title || file.replace('.md', ''),
                    content,
                    fullMd: md
                });
            }
        } catch (err) {
            // Silently skip files that don't exist
            console.error(`Could not load ${path}:`, err);
        }
    }

    // Sort blogs by date (latest first)
    blogPosts.sort((a, b) => b.date - a.date);

    if (blogPosts.length === 0) {
        blogsContainer.innerHTML = '<p>No blog posts available.</p>';
        console.error('No blog posts were loaded. Check that content/blogs/*.md files exist and are accessible.');
        return;
    }

    // Render latest blog fully above the TOC
    let html = '';
    const latest = blogPosts[0];

    // Clean title (remove any accidental 'title:' prefix)
    function cleanTitle(raw) {
        if (!raw) return '';
        return raw.replace(/^title:\s*/i, '').trim();
    }

    // Prefer parsed frontmatter title when available
    const latestTitle = cleanTitle((latest.meta && latest.meta.title) ? latest.meta.title : latest.title);

    // Remove top-level markdown heading from the content if it duplicates the frontmatter title
    function removeLeadingHeading(md, title) {
        const lines = md.split('\n');
        let i = 0;
        // skip empty lines
        while (i < lines.length && lines[i].trim() === '') i++;
        if (i >= lines.length) return md;
        const first = lines[i].trim();
        const headingMatch = first.match(/^\s{0,3}#{1,6}\s+(.*)$/);
        if (headingMatch) {
            const headingText = headingMatch[1].trim().toLowerCase();
            if (headingText === (title || '').toLowerCase()) {
                // remove this line
                lines.splice(i, 1);
            }
        }
        return lines.join('\n');
    }

    // Use parsed content (frontmatter stripped) when rendering
    const latestContentMd = removeLeadingHeading(latest.content, latestTitle);
    const latestHtml = marked.parse(latestContentMd);
    const latestClean = DOMPurify.sanitize(latestHtml);

    html += `\n    <div class="latest-full">\n      <div class="latest-header">\n        <h1 class="latest-title">${latestTitle}</h1>\n        <div class="blog-date">${latest.date.toDateString()}</div>\n      </div>\n      <div class="latest-body">${latestClean}</div>\n    </div>\n`;

    // Add table of contents
    let tocHtml = '<div class="table-of-contents"><h3>All Blog Posts</h3><ul>';
    blogPosts.forEach((blog, index) => {
        const displayTitle = cleanTitle((blog.meta && blog.meta.title) ? blog.meta.title : blog.title);
        tocHtml += `<li><a href="#blog-${index}">${displayTitle}</a></li>`;
    });
    tocHtml += '</ul></div>';

    // Render remaining previews (skip index 0)
    let previews = '';
    blogPosts.slice(1).forEach((blog, idx) => {
        const index = idx + 1;
        const anchorId = `blog-${index}`;
        const firstLines = getFirstLines(blog.content, 2);
        const firstLinesHtml = marked.parse(firstLines);
        const cleanFirstLines = DOMPurify.sanitize(firstLinesHtml);
        const displayTitle = cleanTitle((blog.meta && blog.meta.title) ? blog.meta.title : blog.title);

        previews += `\n        <div class="blog-preview" id="${anchorId}">\n            <div class="preview-header">\n                <h2 class="blog-title">${displayTitle}</h2>\n                <div class="blog-date">${blog.date.toDateString()}</div>\n            </div>\n            <div class="blog-excerpt">${cleanFirstLines}</div>\n            <button class="read-more-btn" data-blog-id="${index}">Read More</button>\n        </div>\n        `;
    });

    blogsContainer.innerHTML = html + tocHtml + previews;

    // Attach read more click handlers
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const blogId = parseInt(btn.getAttribute('data-blog-id'));
            openBlogModal(blogPosts[blogId]);
        });
    });

    // Render LaTeX in excerpts
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(blogsContainer, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ]
        });
    }
}

// Open blog in modal for full reading
function openBlogModal(blog) {
    // Remove existing modal if any
    const existingModal = document.getElementById('blog-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'blog-modal';
    modal.className = 'blog-modal';
    
    // Render parsed content (frontmatter removed)
    const blogHtml = marked.parse(blog.content);
    const cleanHtml = DOMPurify.sanitize(blogHtml);
    
    modal.innerHTML = `
        <div class="blog-modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body">${cleanHtml}</div>
        </div>
    `;
    
    document.body.appendChild(modal);

    // Close button handler
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Render LaTeX in modal
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(modal.querySelector('.modal-body'), {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ]
        });
    }
}

// Attach markdown link handlers on load
document.addEventListener('DOMContentLoaded', () => {
    attachMarkdownLinks();
    loadAllBlogs();
});

// Attach logo click handler
function attachLogoHandler() {
    const logoLink = document.querySelector('.logo-link');
    if (!logoLink) return;
    logoLink.addEventListener('click', async (e) => {
        e.preventDefault();
        openLogoModal();
    });
}

async function openLogoModal() {
    // Remove existing modal if any
    const existing = document.getElementById('logo-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'logo-modal';
    modal.className = 'blog-modal';

    // Larger image
    const logoImg = document.querySelector('.logo-img');
    const logoSrc = logoImg ? logoImg.getAttribute('src') : 'img/logo.png';

    // Try to fetch content/logo_details.md
    let detailsHtml = '';
    try {
        const res = await fetch('content/logo_details.md');
        if (res.ok) {
            const md = await res.text();
            const { meta, content } = parseFrontmatter(md);
            detailsHtml = marked.parse(content);
            detailsHtml = DOMPurify.sanitize(detailsHtml);
        }
    } catch (err) {
        // ignore
    }

    modal.innerHTML = `
        <div class="blog-modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body logo-modal-body">
                <div class="logo-modal-img"><img src="${logoSrc}" alt="logo"></div>
                <div class="logo-modal-text">${detailsHtml}</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    // Render math if present
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(modal.querySelector('.modal-body'), {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ]
        });
    }
}

// Re-attach handlers on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    attachLogoHandler();
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

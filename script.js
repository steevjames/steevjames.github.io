(() => {
    // ==========================================
    // 1. Particle Background Animation (No Lines)
    // ==========================================
    const canvas = document.getElementById('canvas-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 45; // Less dense & Dim, clean density

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = 0;
                this.size = Math.random() * 2.5 + 1;
                this.speedY = Math.random() * 0.4 + 0.1;
                this.speedX = (Math.random() - 0.5) * 0.25;
                this.opacity = Math.random() * 0.35 + 0.15;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                if (this.y > canvas.height) {
                    this.reset();
                }
            }

            draw(isDark) {
                ctx.fillStyle = isDark ? `rgba(129, 140, 248, ${this.opacity})` : `rgba(79, 70, 229, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateBackground() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            particles.forEach(p => {
                p.update();
                p.draw(isDark);
            });
            requestAnimationFrame(animateBackground);
        }
        animateBackground();
    }

    // ==========================================
    // 2. Typing/Cycling Subtitle Effect
    // ==========================================
    const words = [
        "Works On My Machine",
        "Code. Break. Fix.",
        "Turning Ideas Alive",
        "Open Source..."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingTextElement = document.getElementById('typing-text');

    function typeEffect() {
        if (!typingTextElement) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        const cursor = document.createElement('span');
        cursor.className = 'hero-typing-cursor';
        typingTextElement.appendChild(cursor);

        let nextDelay = isDeleting ? 45 : 90;

        if (!isDeleting && charIndex === currentWord.length) {
            nextDelay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            nextDelay = 500;
        }

        setTimeout(typeEffect, nextDelay);
    }
    if (typingTextElement) {
        setTimeout(typeEffect, 800);
    }

    // ==========================================
    // 3. Scroll Reveal Observer
    // ==========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // 4. Posts Fetching & Rendering
    // ==========================================
    const articlesContainer = document.getElementById('articles-container');
    const articleModal = document.getElementById('article-modal');
    const modalArticleBody = document.getElementById('modal-article-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBackdrop = document.getElementById('modal-backdrop-close');

    async function loadArticles() {
        if (!articlesContainer) return;
        try {
            const response = await fetch('articles/manifest.json');
            if (!response.ok) throw new Error('Failed to fetch manifest');
            const posts = await response.json();
            renderArticles(posts);
        } catch (err) {
            console.error('Error loading posts manifest:', err);
            articlesContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-muted);">
                    <p style="font-size: 15px;">Unable to load posts. Please verify you are running a local server or check the console logs.</p>
                </div>
            `;
        }
    }

    function renderArticles(posts) {
        if (!articlesContainer) return;
        articlesContainer.innerHTML = '';

        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'article-card reveal';
            
            if (post.embed) {
                let platformName = "Social Post";
                let postUrl = "#";
                if (post.embed.includes("linkedin.com")) {
                    platformName = "LinkedIn";
                    const m = post.embed.match(/src="([^"]+)"/);
                    if (m) postUrl = m[1].replace("/embed/feed/update/", "/feed/update/");
                } else if (post.embed.includes("twitter.com") || post.embed.includes("x.com")) {
                    platformName = "Twitter / X";
                    const m = post.embed.match(/href="([^"]+)"/);
                    if (m) postUrl = m[1];
                }

                card.innerHTML = `
                    <div class="article-meta-header" style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <span>${post.date}</span>
                        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-indigo); background: var(--accent-glow-indigo); padding: 3px 9px; border-radius: 6px;">${platformName}</span>
                    </div>
                    <div class="post-embed-container" style="min-height: 200px; display: flex; align-items: center; justify-content: center; width: 100%;">
                        ${post.embed}
                    </div>
                    <div class="article-actions" style="margin-top: 14px; display: flex; justify-content: center; width: 100%;">
                        <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px; width: 100%; text-align: center; justify-content: center; gap: 6px;">
                            View on ${platformName}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                    </div>
                `;
            } else {
                const titleDescLen = (post.title || '').length + (post.description || '').length;
                const autoReadTime = Math.max(3, Math.min(10, Math.ceil(titleDescLen / 50))) + ' min read';

                card.innerHTML = `
                    <div class="article-meta-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <span>${post.date}</span>
                        <span class="article-readtime">${autoReadTime}</span>
                    </div>
                    <h3 class="article-title">${post.title}</h3>
                    <p class="article-desc">${post.description}</p>
                    <div class="article-actions" style="margin-top: auto;">
                        <a href="pages/article/index.html?id=${post.id}" class="article-link-btn">
                            Read Post
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>
                `;

                card.addEventListener('click', (e) => {
                    if (e.target.closest('a') || e.target.closest('button')) return;
                    openModal(post);
                });
            }
            articlesContainer.appendChild(card);
        });

        // Observe new elements
        document.querySelectorAll('.reveal').forEach(el => {
            revealObserver.observe(el);
        });

        // Trigger Twitter widget reload
        if (typeof twttr !== 'undefined' && twttr.widgets && twttr.widgets.load) {
            twttr.widgets.load(articlesContainer);
        }
    }

    function openModal(post) {
        if (!articleModal || !modalArticleBody) return;
        modalArticleBody.innerHTML = `
            <div class="article-page-loading">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-indigo)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="30 30"></circle>
                </svg>
                <span>Loading post...</span>
            </div>
        `;
        articleModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const filePath = post.file || `articles/${post.id}.md`;
        fetch(filePath)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch article');
                return res.text();
            })
            .then(mdText => {
                const mdWithoutTitle = mdText.replace(/^#\s+.+\n*/m, '');
                const parsed = marked.parse(mdWithoutTitle);
                
                const wordCount = mdText.split(/\s+/).filter(w => w.length > 0).length;
                const autoReadTimeVal = Math.max(1, Math.ceil(wordCount / 220));
                
                modalArticleBody.innerHTML = `
                    <div class="article-page-meta" style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                        <span class="meta-date" style="font-family: var(--font-mono); font-size: 13px; color: var(--text-muted); display: block; margin-bottom: 8px;">${post.date} &bull; ${autoReadTimeVal} min read</span>
                        <h1 style="font-size: 28px; font-weight: 800; line-height: 1.2; color: var(--text-primary); margin-bottom: 8px;">${post.title}</h1>
                        <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.6;">${post.description}</p>
                    </div>
                    <div class="markdown-body">
                        ${parsed}
                    </div>
                    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                        <a href="pages/article/index.html?id=${post.id}" class="btn btn-primary" style="font-size: 13px; padding: 8px 16px;">Open in Full Page</a>
                        <button class="btn btn-secondary" id="modal-inner-close-btn" style="font-size: 13px; padding: 8px 16px;">Close</button>
                    </div>
                `;
                
                const innerClose = document.getElementById('modal-inner-close-btn');
                if (innerClose) innerClose.addEventListener('click', closeModal);
            })
            .catch(err => {
                console.error('Error rendering modal article:', err);
                let offlineText = `
                    <div class="markdown-body">
                        <h2>${post.title}</h2>
                        <p>${post.description}</p>
                        <p style="margin-top: 20px;"><a href="pages/article/index.html?id=${post.id}" class="btn btn-primary">Open Full Page</a></p>
                    </div>
                `;
                modalArticleBody.innerHTML = offlineText;
            });
    }

    function closeModal() {
        if (articleModal) {
            articleModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    loadArticles();

    // ==========================================
    // 4.5. Projects Fetching & Rendering
    // ==========================================
    const projectsContainer = document.getElementById('projects-container');
    const LINK_ICONS = {
        github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
        external: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`
    };

    async function loadProjects() {
        if (!projectsContainer) return;
        try {
            const response = await fetch('projects/manifest.json');
            if (!response.ok) throw new Error('Failed to fetch project manifest');
            const projects = await response.json();
            renderProjects(projects);
        } catch (err) {
            console.error('Error loading projects manifest:', err);
            projectsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-muted);">
                    <p style="font-size: 15px;">Unable to load projects. Please check connection or console logs.</p>
                </div>
            `;
        }
    }

    function renderProjects(projects) {
        if (!projectsContainer) return;
        projectsContainer.innerHTML = '';

        projects.forEach((project, index) => {
            const card = document.createElement('div');
            const delayIndex = (index % 4) + 1;
            card.className = `project-card reveal reveal-delay-${delayIndex}`;
            card.setAttribute('data-category', project.category);

            const linksHtml = project.links.map(link => {
                const iconSvg = LINK_ICONS[link.icon] || '';
                return `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.title}">
                        ${iconSvg}
                    </a>
                `;
            }).join('');

            const tagsHtml = project.tags.map(tag => `<span>${tag}</span>`).join('');

            card.innerHTML = `
                <div class="project-header">
                    ${project.icon}
                    <div class="project-links">
                        ${linksHtml}
                    </div>
                </div>
                <div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                </div>
                <div class="project-tags">
                    ${tagsHtml}
                </div>
            `;

            projectsContainer.appendChild(card);
        });

        // Observe new elements
        document.querySelectorAll('.reveal').forEach(el => {
            revealObserver.observe(el);
        });
    }

    loadProjects();

    // ==========================================
    // 5. Theme Toggle Logic
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ==========================================
    // 6. Navigation Link Highlighting & Scrolled state
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navlinks a, .navlinks-mobile a');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 7. Mobile Navigation Triggers
    // ==========================================
    const navBtn = document.getElementById('navbtn');
    const closeMobileBtn = document.getElementById('close-mobile-btn');
    const mobileMenu = document.getElementById('nav-menu-mobile');
    const mobileMenuLinks = document.querySelectorAll('.navlinks-mobile a');

    if (navBtn && mobileMenu) {
        navBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMobileBtn && mobileMenu) {
        closeMobileBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (mobileMenuLinks && mobileMenu) {
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // 8. Logo Visibility Observer
    // ==========================================
    const heroName = document.querySelector('.hero-name-gradient');
    const navLogo = document.getElementById('nav-logo');
    if (heroName && navLogo) {
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    navLogo.classList.add('logo-visible');
                } else {
                    navLogo.classList.remove('logo-visible');
                }
            });
        }, {
            threshold: 0,
            rootMargin: '0px 0px 0px 0px'
        });
        logoObserver.observe(heroName);
    }
})();
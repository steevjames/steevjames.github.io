(() => {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    const metaContainer = document.getElementById('article-meta');
    const bodyContainer = document.getElementById('article-body');
    const markdownEl = document.getElementById('article-markdown');

    function updateMeta(idOrName, content, attr = 'name') {
        const byId = document.getElementById(idOrName);
        if (byId) { byId.setAttribute('content', content); return; }
        const byName = document.querySelector(`meta[${attr}="${idOrName}"]`);
        if (byName) byName.setAttribute('content', content);
    }

    function showError(title, message) {
        if (!metaContainer) return;
        metaContainer.innerHTML = `
            <div class="article-page-error">
                <h2>${title}</h2>
                <p>${message}</p>
                <a href="../../index.html" class="btn btn-primary">← Back to Portfolio</a>
            </div>
        `;
    }

    async function loadArticle() {
        if (!articleId) {
            showError('No post specified', 'Please provide a post ID in the URL, e.g. <code>index.html?id=scaling-microservices</code>');
            return;
        }

        let article = null;
        let mdText = '';

        // Step 1: Resolve article metadata
        try {
            const manifestRes = await fetch('../../articles/manifest.json');
            if (!manifestRes.ok) throw new Error('Could not load manifest');
            const articlesList = await manifestRes.json();
            article = articlesList.find(a => a.id === articleId);
        } catch (err) {
            console.error('Error loading manifest:', err);
        }

        if (!article) {
            showError('Post not found', `No post with ID "<code>${articleId}</code>" exists. Check the URL and try again.`);
            return;
        }

        // Handle social post embeds
        if (article.embed) {
            let platformName = "Social Post";
            let postUrl = "#";
            if (article.embed.includes("linkedin.com")) {
                platformName = "LinkedIn";
                const m = article.embed.match(/src="([^"]+)"/);
                if (m) postUrl = m[1].replace("/embed/feed/update/", "/feed/update/");
            } else if (article.embed.includes("twitter.com") || article.embed.includes("x.com")) {
                platformName = "Twitter / X";
                const m = article.embed.match(/href="([^"]+)"/);
                if (m) postUrl = m[1];
            }

            document.title = `${article.title || 'Social Post'} — Steev James`;
            if (metaContainer) {
                metaContainer.innerHTML = `
                    <span class="meta-date">${article.date} &bull; ${platformName}</span>
                    <h1>${article.title || 'Social Post'}</h1>
                `;
            }
            if (markdownEl && bodyContainer) {
                markdownEl.innerHTML = `
                    <div class="post-embed-container" style="margin: 20px auto; max-width: 540px; border-radius: 12px; overflow: hidden; min-height: 200px; display: flex; align-items: center; justify-content: center;">
                        ${article.embed}
                    </div>
                    <div style="margin-top: 30px; text-align: center; display: flex; justify-content: center; gap: 16px;">
                        <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="gap: 6px; display: inline-flex; align-items: center;">
                            View on ${platformName}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                        <a href="../../index.html" class="btn btn-secondary">← Back to Portfolio</a>
                    </div>
                `;
                bodyContainer.style.display = 'block';
                
                if (typeof twttr !== 'undefined' && twttr.widgets && twttr.widgets.load) {
                    twttr.widgets.load(markdownEl);
                }
            }
            return;
        }

        // Step 2: Fetch article body
        try {
            const mdRes = await fetch(`../../${article.file || 'articles/' + article.id + '.md'}`);
            if (!mdRes.ok) throw new Error('Could not load markdown file');
            mdText = await mdRes.text();
        } catch (err) {
            console.error('Error loading markdown file:', err);
        }

        if (!mdText) {
            showError('Content empty', 'The contents of this post could not be loaded.');
            return;
        }

        // Auto-calculate readTime dynamically based on word count
        const wordCount = mdText.split(/\s+/).filter(w => w.length > 0).length;
        const autoReadTimeVal = Math.max(1, Math.ceil(wordCount / 220)); // Assume 220 words per minute average reading speed
        const readTimeDisplay = `${autoReadTimeVal} min read`;

        // Update page headers & metadata
        document.title = `${article.title} — Steev James`;
        updateMeta('description', article.description);
        updateMeta('og-title', article.title + ' — Steev James', 'property');
        updateMeta('og-desc', article.description, 'property');
        updateMeta('tw-title', article.title + ' — Steev James', 'property');
        updateMeta('tw-desc', article.description, 'property');

        if (metaContainer) {
            metaContainer.innerHTML = `
                <span class="meta-date">${article.date} &bull; ${readTimeDisplay}</span>
                <h1>${article.title}</h1>
                <p class="meta-desc">${article.description}</p>
            `;
        }

        // Render content
        if (markdownEl && bodyContainer) {
            // Remove the H1 from markdown since we show it in meta
            const mdWithoutTitle = mdText.replace(/^#\s+.+\n*/m, '');
            markdownEl.innerHTML = marked.parse(mdWithoutTitle);
            bodyContainer.style.display = 'block';
        }
    }

    loadArticle();
})();

import re

# Update HTML
with open('Portfolio.html', 'r', encoding='utf-8') as f:
    html = f.read()

filters_html = """            <div class="project-filters" style="display:flex; gap:1rem; margin-bottom:2rem; flex-wrap:wrap;">
                <button class="filter-btn active" data-filter="all">Todos</button>
                <button class="filter-btn" data-filter="React">React</button>
                <button class="filter-btn" data-filter="Node.js">Node.js</button>
                <button class="filter-btn" data-filter="Python">Python</button>
            </div>
            <div class="projects-grid">"""

html = html.replace('<div class="projects-grid">', filters_html)

with open('Portfolio.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Update CSS
css_append = """
/* === FILTERS === */
.filter-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.2s;
}
.filter-btn:hover, .filter-btn.active {
    background: rgba(55, 138, 221, 0.1);
    border-color: var(--blue-mid);
    color: var(--blue-light);
}
"""
with open('style.css', 'a', encoding='utf-8') as f:
    f.write(css_append)

# Update JS
js_append = """
// Filtro de Projetos
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all') {
                card.style.display = 'block';
            } else {
                const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent);
                if (tags.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});
"""
with open('script.js', 'a', encoding='utf-8') as f:
    f.write(js_append)

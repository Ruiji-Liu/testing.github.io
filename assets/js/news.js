class NewsManager {
    constructor(containerId, initialCount = 3) {
        this.container = document.getElementById(containerId);
        this.initialCount = initialCount;
        this.allNews = [];
        this.isExpanded = false;
        this.loadNews();
    }

    async loadNews() {
        try {
            const response = await fetch('./assets/data/news.json');
            const data = await response.json();
            this.allNews = data.news;
            this.renderNews();
        } catch (error) {
            console.error('Error loading news:', error);
            this.container.innerHTML = '<p style="color: #666;">Failed to load news.</p>';
        }
    }

    renderNews() {
        const newsToShow = this.isExpanded ? this.allNews : this.allNews.slice(0, this.initialCount);
        
        let html = '<ul style="margin-top: -10px;">';
        newsToShow.forEach(item => {
            html += '<li>';
            html += `${item.date}: ${item.content}`;
            if (item.link) {
                html += ` (<a href="${item.link}" target="_blank">link</a>)`;  // 添加链接到最后
            }
            html += '</li>';
        });
        html += '</ul>';

        if (this.allNews.length > this.initialCount) {
            html += `<button class="show-more-btn" id="toggleButton">
                ${this.isExpanded ? 'Show Less' : 'Show More'}
            </button>`;
        }

        this.container.innerHTML = html;
        
        const toggleButton = document.getElementById('toggleButton');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleNews());
        }
    }

    toggleNews() {
        this.isExpanded = !this.isExpanded;
        this.renderNews();
    }
}
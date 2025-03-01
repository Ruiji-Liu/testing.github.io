class PublicationManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.publications = [];
        this.selectedYear = 'all'; // 默认显示所有年份
        this.loadPublications();
    }

    async loadPublications() {
        try {
            const response = await fetch('./assets/data/publications.json');
            const data = await response.json();
            this.publications = data.publications;
            this.renderYearFilter();
            this.renderPublications(this.publications);
        } catch (error) {
            console.error('Error loading publications:', error);
            this.container.innerHTML = '<p style="color: #666;">Failed to load publications.</p>';
        }
    }

    renderYearFilter() {
        // 获取所有不重复的年份
        const years = [...new Set(this.publications.map(pub => pub.year))].sort().reverse();
        
        // 创建筛选器HTML
        const filterHtml = `
            <select id="year-filter">
                <option value="all">All Years</option>
                ${years.map(year => `<option value="${year}">${year}</option>`).join('')}
            </select>
        `;

        // 找到 Publications 标题并添加筛选器
        // const titleElement = document.querySelector('h2');
        const filterContainer = document.getElementById('year-filter-container');
        if (filterContainer) {
            filterContainer.innerHTML = filterHtml;
        }

        // 添加事件监听器
        document.getElementById('year-filter').addEventListener('change', (e) => {
            this.selectedYear = e.target.value;
            this.filterPublications();
        });
    }

    filterPublications() {
        const filteredPubs = this.selectedYear === 'all' 
            ? this.publications 
            : this.publications.filter(pub => pub.year === this.selectedYear);
        this.renderPublications(filteredPubs);
    }

    renderPublications(publications) {
        let html = '';
        publications.forEach(pub => {
            html += `
                <div class="item" style="margin-top: -10px;">
                    <div class="item_inline item_image" style="width:35%; padding-right: 25px; padding-left: 5px; margin-right: 105px; vertical-align: middle;">
                        <img src="${pub.image}" width="100%" style="vertical-align: middle;" />
                    </div>
                    <div class="item_inline" style="width:65%;">
                        <p style="font-size: 90%; margin: 0 0 0.2em 0;"><b>${pub.title}</b></p>
                        <p style="font-size: 90%; margin: 0 0 0 0;">
                            ${this.renderAuthors(pub.authors)}
                        </p>
                        <p style="font-size: 90%; margin: 0;">
                            <i>${pub.venue}</i>, ${pub.year}
                            ${this.renderLinks(pub.links)}
                        </p>
                    </div>
                </div>
            `;
        });
        this.container.innerHTML = html;
    }

    renderAuthors(authors) {
        return authors.map((author, index) => {
            let authorHtml = '';

            const authorName = author.name === "Sizhe Wei" ? 
                "<strong>Sizhe Wei</strong>" : author.name;

            if (author.link) {
                authorHtml += `<a href="${author.link}">${authorName}</a>`;
            } else {
                authorHtml += authorName;
            }

            if (author.isCoFirst) {
                authorHtml += '<sup>*</sup>';
            }
            
            return authorHtml;
        }).join(', ');
    }

    renderLinks(links) {
        let html = '<br>';
        if (links.paper) {
            html += `<a href="${links.paper}">Paper</a> `;
        }
        if (links.code) {
            html += `/ <a href="${links.code}">Code</a> `;
        }
        if (links.project) {
            html += `/ <a href="${links.project}">Project Page</a>`;
        }
        return html;
    }
}
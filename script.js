// ナビゲーション丸のクリックイベント
document.addEventListener('DOMContentLoaded', function() {
    const navCircles = document.querySelectorAll('.nav-circle');

    // 丸クリック時の処理 - スムーズスクロール
    navCircles.forEach(circle => {
        circle.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);

            if (targetSection) {
                // 対象セクションまでスムーズスクロール
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // ホバーエフェクトの強化
        circle.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // 装飾用の丸にランダムな色を付ける
    const decoCircles = document.querySelectorAll('.deco-circle');
    const colors = [
        'rgba(37,99,235,0.15)',
        'rgba(249,115,22,0.15)',
        'rgba(255,255,255,0.1)'
    ];

    decoCircles.forEach((circle, index) => {
        const randomColor = colors[index % colors.length];
        circle.style.background = `radial-gradient(circle, ${randomColor} 0%, transparent 70%)`;
    });
});

// 中央円形ウィンドウのスライドカルーセル
let currentSlide = 0;
const slides = document.querySelectorAll('.intro-slide');
const indicators = document.querySelectorAll('.indicator');
const slideInterval = 5000; // 5秒ごとに切り替え

// ナビゲーション円の要素を取得
const navCircleElements = document.querySelectorAll('.nav-circle');

// 各スライドに対応するナビゲーション円の配置パターン（3パターン）
// 全ての円が大きく動くように配置（特にモバイルでも動きがわかりやすく）

// デスクトップ用パターン
const desktopPatterns = [
    // パターン1: 六角形の配置
    [
        { top: '3%', left: '50%', transform: 'translateX(-50%)' },   // プロフィール - 最上部
        { top: '20%', left: '88%', transform: 'none' },              // ブログ - 右上
        { top: '68%', left: '90%', transform: 'none' },              // 受賞歴 - 右下
        { top: '95%', left: '50%', transform: 'translateX(-50%)' },  // 資格 - 最下部
        { top: '68%', left: '3%', transform: 'none' },               // プロジェクト - 左下
        { top: '20%', left: '3%', transform: 'none' }                // コンタクト - 左上
    ],
    // パターン2: 時計回りに回転
    [
        { top: '15%', left: '80%', transform: 'none' },              // プロフィール - 右上
        { top: '50%', left: '95%', transform: 'none' },              // ブログ - 右中央
        { top: '85%', left: '80%', transform: 'none' },              // 受賞歴 - 右下
        { top: '85%', left: '20%', transform: 'none' },              // 資格 - 左下
        { top: '50%', left: '3%', transform: 'none' },               // プロジェクト - 左中央
        { top: '15%', left: '20%', transform: 'none' }               // コンタクト - 左上
    ],
    // パターン3: ダイアモンド型配置
    [
        { top: '8%', left: '30%', transform: 'none' },               // プロフィール - 上左
        { top: '8%', left: '70%', transform: 'none' },               // ブログ - 上右
        { top: '50%', left: '92%', transform: 'none' },              // 受賞歴 - 右中央
        { top: '92%', left: '70%', transform: 'none' },              // 資格 - 下右
        { top: '92%', left: '30%', transform: 'none' },              // プロジェクト - 下左
        { top: '50%', left: '5%', transform: 'none' }                // コンタクト - 左中央
    ]
];

// モバイル用パターン（上下に分散）
const mobilePatterns = [
    // パターン1: 上下に大きく散らばる
    [
        { top: '2%', left: '50%', transform: 'translateX(-50%)' },   // プロフィール - 最上部中央
        { top: '10%', left: '80%', transform: 'none' },              // ブログ - 上部右
        { top: '10%', left: '20%', transform: 'none' },              // 受賞歴 - 上部左
        { top: '92%', left: '50%', transform: 'translateX(-50%)' },  // 資格 - 最下部中央
        { top: '82%', left: '15%', transform: 'none' },              // プロジェクト - 下部左
        { top: '82%', left: '85%', transform: 'none' }               // コンタクト - 下部右
    ],
    // パターン2: 対角線的に散らばる
    [
        { top: '5%', left: '75%', transform: 'none' },               // プロフィール - 上部右
        { top: '14%', left: '50%', transform: 'translateX(-50%)' },  // ブログ - 上部中央
        { top: '5%', left: '25%', transform: 'none' },               // 受賞歴 - 上部左
        { top: '88%', left: '25%', transform: 'none' },              // 資格 - 下部左
        { top: '78%', left: '50%', transform: 'translateX(-50%)' },  // プロジェクト - 下部中央
        { top: '88%', left: '75%', transform: 'none' }               // コンタクト - 下部右
    ],
    // パターン3: 四隅＋上下中央に散らばる
    [
        { top: '3%', left: '20%', transform: 'none' },               // プロフィール - 上部左端
        { top: '3%', left: '80%', transform: 'none' },               // ブログ - 上部右端
        { top: '20%', left: '50%', transform: 'translateX(-50%)' },  // 受賞歴 - 上部中央やや下
        { top: '72%', left: '50%', transform: 'translateX(-50%)' },  // 資格 - 下部中央やや上
        { top: '90%', left: '20%', transform: 'none' },              // プロジェクト - 下部左端
        { top: '90%', left: '80%', transform: 'none' }               // コンタクト - 下部右端
    ]
];

// 超小型画面用パターン（480px以下）
const smallMobilePatterns = [
    // パターン1: コンパクトに上下配置
    [
        { top: '2%', left: '50%', transform: 'translateX(-50%)' },   // プロフィール - 最上部
        { top: '11%', left: '78%', transform: 'none' },              // ブログ - 上部右
        { top: '11%', left: '22%', transform: 'none' },              // 受賞歴 - 上部左
        { top: '90%', left: '50%', transform: 'translateX(-50%)' },  // 資格 - 最下部
        { top: '79%', left: '22%', transform: 'none' },              // プロジェクト - 下部左
        { top: '79%', left: '78%', transform: 'none' }               // コンタクト - 下部右
    ],
    // パターン2: ジグザグ配置
    [
        { top: '6%', left: '70%', transform: 'none' },               // プロフィール - 上部右
        { top: '15%', left: '50%', transform: 'translateX(-50%)' },  // ブログ - 上部中央
        { top: '6%', left: '30%', transform: 'none' },               // 受賞歴 - 上部左
        { top: '85%', left: '30%', transform: 'none' },              // 資格 - 下部左
        { top: '76%', left: '50%', transform: 'translateX(-50%)' },  // プロジェクト - 下部中央
        { top: '85%', left: '70%', transform: 'none' }               // コンタクト - 下部右
    ],
    // パターン3: 四隅配置
    [
        { top: '4%', left: '25%', transform: 'none' },               // プロフィール - 上部左
        { top: '4%', left: '75%', transform: 'none' },               // ブログ - 上部右
        { top: '22%', left: '50%', transform: 'translateX(-50%)' },  // 受賞歴 - 上部中央
        { top: '70%', left: '50%', transform: 'translateX(-50%)' },  // 資格 - 下部中央
        { top: '88%', left: '25%', transform: 'none' },              // プロジェクト - 下部左
        { top: '88%', left: '75%', transform: 'none' }               // コンタクト - 下部右
    ]
];

// ナビゲーション円の位置を更新する関数
function updateNavCirclePositions(patternIndex) {
    const windowWidth = window.innerWidth;
    let patterns;
    
    // 画面幅に応じてパターンセットを選択
    if (windowWidth <= 480) {
        patterns = smallMobilePatterns;  // 超小型画面用
    } else if (windowWidth <= 768) {
        patterns = mobilePatterns;        // モバイル用
    } else {
        patterns = desktopPatterns;       // デスクトップ用
    }
    
    const pattern = patterns[patternIndex];
    
    navCircleElements.forEach((circle, index) => {
        if (pattern[index]) {
            circle.style.top = pattern[index].top;
            circle.style.left = pattern[index].left;
            circle.style.transform = pattern[index].transform;
        }
    });
}

// スライドを表示する関数
function showSlide(index) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // スライドに対応する配置パターンに更新
    updateNavCirclePositions(index);
}

// 次のスライドへ
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// インジケーターのクリックイベント
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
        // 自動スライドをリセット
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, slideInterval);
    });
});

// 初期表示
showSlide(0);

// 自動スライド開始
let autoSlide = setInterval(nextSlide, slideInterval);

// ウィンドウリサイズ時に配置を再調整
window.addEventListener('resize', function() {
    updateNavCirclePositions(currentSlide);
});

// ===== ブログとプロジェクトのJSON読み込みと動的表示 =====

// ブログの読み込みと表示
let allBlogs = [];
let displayedBlogsCount = 3;

async function loadBlogs() {
    try {
        const response = await fetch('blogs.json');
        allBlogs = await response.json();
        displayBlogs();
    } catch (error) {
        console.error('ブログの読み込みに失敗しました:', error);
    }
}

function displayBlogs() {
    const blogGrid = document.getElementById('blog-grid');
    const viewMoreBtn = document.getElementById('blog-view-more');
    
    if (!blogGrid) return;
    
    // グリッドをクリア
    blogGrid.innerHTML = '';
    
    // データが空の場合
    if (!allBlogs || allBlogs.length === 0) {
        blogGrid.innerHTML = '<div class="no-data-message">📝 データがありません</div>';
        if (viewMoreBtn) {
            viewMoreBtn.classList.add('hidden');
        }
        return;
    }
    
    // 表示する記事を取得
    const blogsToShow = allBlogs.slice(0, displayedBlogsCount);
    
    // 記事を生成
    blogsToShow.forEach(blog => {
        const blogCard = document.createElement('article');
        blogCard.className = 'blog-card';
        
        blogCard.innerHTML = `
            ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" onerror="this.style.display='none'">` : ''}
            <h3>${blog.title}</h3>
            <p class="blog-date">${blog.date}</p>
            <p>${blog.description}</p>
            ${blog.url ? `<a href="${blog.url}" class="project-link" target="_blank">記事を読む</a>` : ''}
        `;
        
        blogGrid.appendChild(blogCard);
    });
    
    // 「もっと見る」ボタンの表示/非表示
    if (viewMoreBtn) {
        if (displayedBlogsCount >= allBlogs.length) {
            viewMoreBtn.classList.add('hidden');
        } else {
            viewMoreBtn.classList.remove('hidden');
        }
    }
}

// ブログの「もっと見る」ボタン
document.addEventListener('DOMContentLoaded', function() {
    const blogViewMoreBtn = document.getElementById('blog-view-more');
    if (blogViewMoreBtn) {
        blogViewMoreBtn.addEventListener('click', function() {
            displayedBlogsCount += 3;
            displayBlogs();
        });
    }
});

// プロジェクトの読み込みと表示
let allProjects = [];
let displayedProjectsCount = 3;

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        allProjects = await response.json();
        displayProjects();
    } catch (error) {
        console.error('プロジェクトの読み込みに失敗しました:', error);
    }
}

function displayProjects() {
    const projectGrid = document.getElementById('project-grid');
    const viewMoreBtn = document.getElementById('project-view-more');
    
    if (!projectGrid) return;
    
    // グリッドをクリア
    projectGrid.innerHTML = '';
    
    // データが空の場合
    if (!allProjects || allProjects.length === 0) {
        projectGrid.innerHTML = '<div class="no-data-message">🚀 データがありません</div>';
        if (viewMoreBtn) {
            viewMoreBtn.classList.add('hidden');
        }
        return;
    }
    
    // 表示するプロジェクトを取得
    const projectsToShow = allProjects.slice(0, displayedProjectsCount);
    
    // プロジェクトを生成
    projectsToShow.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            ${project.image ? `<img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'">` : ''}
            <h3>${project.title}</h3>
            <p class="project-tech">${project.tech}</p>
            <p>${project.description}</p>
            <div class="project-links">
                ${project.url ? `<a href="${project.url === '#' ? 'javascript:void(0)' : project.url}" class="project-link ${project.url === '#' ? 'disabled' : ''}" ${project.url !== '#' ? 'target="_blank"' : ''}>GitHub →</a>` : ''}
                ${project.demo ? `<a href="${project.demo === '#' ? 'javascript:void(0)' : project.demo}" class="project-link ${project.demo === '#' ? 'disabled' : ''}" ${project.demo !== '#' ? 'target="_blank"' : ''}>HP →</a>` : ''}
            </div>
        `;
        
        projectGrid.appendChild(projectCard);
    });
    
    // 「もっと見る」ボタンの表示/非表示
    if (viewMoreBtn) {
        if (displayedProjectsCount >= allProjects.length) {
            viewMoreBtn.classList.add('hidden');
        } else {
            viewMoreBtn.classList.remove('hidden');
        }
    }
}

// プロジェクトの「もっと見る」ボタン
document.addEventListener('DOMContentLoaded', function() {
    const projectViewMoreBtn = document.getElementById('project-view-more');
    if (projectViewMoreBtn) {
        projectViewMoreBtn.addEventListener('click', function() {
            displayedProjectsCount += 3;
            displayProjects();
        });
    }
});

// ページ読み込み時にブログとプロジェクトを読み込む
window.addEventListener('DOMContentLoaded', function() {
    loadBlogs();
    loadProjects();
    loadTimeline();
    loadTravel();
    loadLinks();
    loadNews();
});

// ===== ニュースの読み込みとスライダー表示 =====
let newsData = [];
let newsIndex = 0;
let newsAutoSlide = null;

async function loadNews() {
    try {
        const response = await fetch('news.json');
        newsData = await response.json();
        displayNews();
    } catch (error) {
        console.error('ニュースの読み込みに失敗しました:', error);
    }
}

function displayNews() {
    const slider = document.getElementById('news-slider');
    const indicators = document.getElementById('news-indicators');
    if (!slider || !indicators) return;

    slider.innerHTML = '';
    indicators.innerHTML = '';

    if (!newsData || newsData.length === 0) {
        slider.innerHTML = '<div class="no-data-message">ニュースがありません</div>';
        return;
    }

    newsData.forEach((item, i) => {
        const a = document.createElement('a');
        a.className = 'news-slide';
        a.href = item.url || '#';
        a.target = item.url ? '_blank' : '_self';

        const img = document.createElement('img');
        img.src = item.image || '';
        img.alt = item.title || '';
        img.onerror = function() { this.style.display = 'none'; };

        const overlay = document.createElement('div');
        overlay.className = 'news-overlay';
        overlay.style.background = `linear-gradient(180deg, rgba(0,0,0,0) 20%, ${item.shadowColor || 'rgba(0,0,0,0.6)'} 100%)`;

        const content = document.createElement('div');
        content.className = 'news-content';
        content.innerHTML = `<h3>${item.title || ''}</h3><p>${item.description || ''}</p>`;

        a.appendChild(img);
        a.appendChild(overlay);
        a.appendChild(content);

        // クリックで外部リンクに移動（target属性で新しいタブ）
        slider.appendChild(a);

        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            newsIndex = i;
            updateNewsPosition();
            resetNewsAuto();
        });
        indicators.appendChild(dot);
    });

    // 初期表示
    newsIndex = 0;
    updateNewsPosition();
    resetNewsAuto();

    // ホバーで自動切替を止める
    const wrapper = document.querySelector('.news-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => { clearInterval(newsAutoSlide); });
        wrapper.addEventListener('mouseleave', () => { resetNewsAuto(); });
    }
}

function updateNewsPosition() {
    const slider = document.getElementById('news-slider');
    const indicatorDots = document.querySelectorAll('#news-indicators .dot');
    if (!slider) return;

    const slideWidth = slider.querySelector('.news-slide') ? slider.querySelector('.news-slide').getBoundingClientRect().width + 16 : 0;
    const offset = slideWidth * newsIndex * -1;
    slider.style.transform = `translateX(${offset}px)`;

    indicatorDots.forEach((d, i) => {
        d.classList.toggle('active', i === newsIndex);
    });
}

function resetNewsAuto() {
    clearInterval(newsAutoSlide);
    newsAutoSlide = setInterval(() => {
        newsIndex = (newsIndex + 1) % Math.max(1, newsData.length);
        updateNewsPosition();
    }, 4500);
}


// ===== タイムライン（歩み）の読み込みと表示 =====
let timelineData = [];

async function loadTimeline() {
    try {
        const response = await fetch('timeline.json');
        timelineData = await response.json();
        displayTimeline();
    } catch (error) {
        console.error('タイムラインの読み込みに失敗しました:', error);
    }
}

function displayTimeline() {
    const timelineContainer = document.getElementById('timeline-container');
    
    if (!timelineContainer) return;
    
    // コンテナをクリア
    timelineContainer.innerHTML = '';
    
    // データが空の場合
    if (!timelineData || timelineData.length === 0) {
        timelineContainer.innerHTML = '<div class="no-data-message">📅 データがありません</div>';
        return;
    }
    
    // タイムラインアイテムを生成
    timelineData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        if (item.highlight) {
            timelineItem.classList.add('timeline-highlight');
        }
        
        timelineItem.innerHTML = `
            <div class="timeline-year">${item.year}</div>
            <div class="timeline-dot ${item.highlight ? 'highlight-dot' : ''}"></div>
            <div class="timeline-content">
                <p class="timeline-event">${item.event}</p>
                ${item.description ? `<p class="timeline-description">${item.description}</p>` : ''}
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// ===== 旅行記の読み込みと表示 =====
let travelData = [];

async function loadTravel() {
    try {
        const response = await fetch('travel.json');
        travelData = await response.json();
        displayTravel();
    } catch (error) {
        console.error('旅行記の読み込みに失敗しました:', error);
    }
}

function displayTravel() {
    const travelContainer = document.getElementById('travel-container');
    
    if (!travelContainer) return;
    
    // コンテナをクリア
    travelContainer.innerHTML = '';
    
    // データが空の場合
    if (!travelData || travelData.length === 0) {
        travelContainer.innerHTML = '<div class="no-data-message">✈️ データがありません</div>';
        return;
    }
    
    // タイムラインアイテムを生成
    travelData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        timelineItem.innerHTML = `
            <div class="timeline-year">${item.year}</div>
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <p class="timeline-event">${item.event}</p>
                ${item.description ? `<p class="timeline-description">${item.description}</p>` : ''}
            </div>
        `;
        
        travelContainer.appendChild(timelineItem);
    });
}

// ===== リンクの読み込みと表示 =====
let linksData = [];

async function loadLinks() {
    try {
        const response = await fetch('links.json');
        linksData = await response.json();
        displayLinks();
    } catch (error) {
        console.error('リンクの読み込みに失敗しました:', error);
    }
}

function displayLinks() {
    const linksGrid = document.getElementById('links-grid');
    
    if (!linksGrid) return;
    
    // グリッドをクリア
    linksGrid.innerHTML = '';
    
    // データが空の場合
    if (!linksData || linksData.length === 0) {
        linksGrid.innerHTML = '<div class="no-data-message">🔗 データがありません</div>';
        return;
    }
    
    // リンクカードを生成
    linksData.forEach((link, index) => {
        const linkCard = document.createElement('a');
        linkCard.className = 'link-card';
        linkCard.href = link.url;
        linkCard.target = '_blank';
        linkCard.rel = 'noopener noreferrer';
        
        linkCard.innerHTML = `
            <h3>${link.name}</h3>
            <p class="link-url">${link.url}</p>
            <p class="link-description">${link.description}</p>
        `;
        
        linksGrid.appendChild(linkCard);
    });
}

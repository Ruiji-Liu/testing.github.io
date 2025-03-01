/*
* Zoom Images, Get Date and Shadow
* ========================================================================== */

(function() {
    /* variables */
    var shadow = document.getElementById('shadow');
    var images = document.querySelectorAll('a img');
    var imageHeight = window.innerHeight - 20;
  
    /* events */
    shadow.addEventListener('click', resetShadow, false);
    window.addEventListener('keydown', resetStyles, false);
    window.addEventListener('resize', refreshImageSizes, false);
  
    /* functions */
    setDate();
    toggleImages();
  
  
    function setDate() {
      var currentYear = document.querySelector('.full-year');
      if (currentYear) {
        currentYear.innerHTML = new Date().getFullYear();
      }
    }
  
    function refreshImageSizes() {
      // select all images
      [].forEach.call(images, function(img) {
        // if image zoomed
        if (img.classList.contains('img-popup')) {
          img.style.maxHeight = imageHeight + 'px';
          img.style.marginLeft = '-' + (img.offsetWidth / 2) + 'px';
          img.style.marginTop = '-' + (img.offsetHeight / 2) + 'px';
        }
      });
    }
  
    function resetShadow() {
      shadow.style.display = 'none';
      resetAllImages();
    }
  
    function resetStyles(event) {
      if (event.keyCode == 27) {
        event.preventDefault();
        shadow.style.display = 'none';
        resetAllImages();
      }
    }
  
    function resetAllImages() {
      [].forEach.call(images, function(img) {
        img.classList.remove('img-popup');
        img.style.cursor = 'zoom-in';
        img.style.marginLeft = 'auto';
        img.style.marginTop = 'auto';
      });
    }
  
    function toggleImages() {
      [].forEach.call(images, function(img) {
        img.addEventListener('click', function(event) {
          event.preventDefault();
          img.classList.toggle('img-popup');
          if (img.classList.contains('img-popup')) {
            img.style.cursor = 'zoom-out';
            img.style.maxHeight = imageHeight + 'px';
            img.style.marginLeft = '-' + (img.offsetWidth / 2) + 'px';
            img.style.marginTop = '-' + (img.offsetHeight / 2) + 'px';
            shadow.style.display = 'block';
          } else {
            img.style.cursor = 'zoom-in';
            img.style.maxHeight = '100%';
            img.style.marginLeft = 'auto';
            img.style.marginTop = 'auto';
            shadow.style.display = 'none';
          }
        });
      });
    }
  })();
  
  
  /*
  * Aside Resize
  * ========================================================================== */
  
  (function() {
    var aside = document.querySelector('.sidebar');
    var mainContainer = document.querySelectorAll('.content-wrapper');
    var switcher = document.getElementById('switcher');
  
    // switcher.addEventListener('click', slide, false);
  
  
    function slide() {
      aside.classList.add('transition-divs');
      aside.classList.toggle('aside-left');
      [].forEach.call(mainContainer, function(c) {
        c.classList.add('transition-divs');
        c.classList.toggle('centering');
      });
    }
  })();
  
  /*
  * Theme Switch
  * ========================================================================== */
  // 检测系统颜色主题
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // 更新主题
  function updateTheme(theme, isAuto = false) {
    document.body.setAttribute('data-theme', theme);
    
    // 更新图标
    const icon = document.querySelector('#theme-switch i');
    if (icon) {
        updateThemeIcon(icon, theme);
    }
    
    // 更新地图
    updateMap(theme);
  
    // 保存模式（自动/手动）和主题
    if (isAuto) {
        localStorage.setItem('themeMode', 'auto');
        localStorage.removeItem('theme');
    } else {
        localStorage.setItem('themeMode', 'manual');
        localStorage.setItem('theme', theme);
    }
  }
  
  // 主题切换功能
  function initThemeSwitch() {
    const themeSwitch = document.getElementById('theme-switch');
    
    // 创建系统主题监听器
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 处理主题变化
    function handleThemeChange() {
        const themeMode = localStorage.getItem('themeMode') || 'auto';
        if (themeMode === 'auto') {
            // 自动模式：跟随系统
            updateTheme(getSystemTheme(), true);
        } else {
            // 手动模式：使用保存的设置
            const savedTheme = localStorage.getItem('theme') || 'light';
            updateTheme(savedTheme, false);
        }
    }
  
    // 初始化主题
    handleThemeChange();
    
    // 监听系统主题变化
    systemThemeQuery.addListener(handleThemeChange);
    
    // 点击切换按钮时的行为
    themeSwitch.addEventListener('click', () => {
        const themeMode = localStorage.getItem('themeMode') || 'auto';
        if (themeMode === 'auto') {
            // 如果当前是自动模式，切换到手动模式并设置相反的主题
            const currentTheme = getSystemTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            updateTheme(newTheme, false);
        } else {
            // 如果当前是手动模式，切换回自动模式
            updateTheme(getSystemTheme(), true);
        }
    });
  }
  
  function updateMap(theme) {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;  // 如果找不到容器就退出
  
    const lightSrc = '//cdn.clustrmaps.com/map_v2.js?cl=000000&w=200&t=tt&d=bzdCFkuu7_3o-deAFpA2Ax2i0cSIh_7ZBRiJOKkisxQ&co=ffffff&ct=808080&cmo=3acc3a&cmn=ff5353';
    const darkSrc = '//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=200&t=tt&d=bzdCFkuu7_3o-deAFpA2Ax2i0cSIh_7ZBRiJOKkisxQ&co=252525';
    
    // 清空容器
    mapContainer.innerHTML = '';
    
    // 创建新的脚本
    const newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.id = 'clustrmaps';
    newScript.src = theme === 'dark' ? darkSrc : lightSrc;
    
    // 添加新的脚本
    mapContainer.appendChild(newScript);
  }
  
  function updateThemeIcon(icon, theme) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
  
  // 在 DOMContentLoaded 事件中初始化
  document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitch();
  });
// ===== EDMG项目主页交互脚本 =====

// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 导航栏功能 =====
    initNavigation();
    
    // ===== 视频播放功能 =====
    initVideoPlayer();
    
    // ===== 滚动动画功能 =====
    initScrollAnimations();
    
    // ===== 音乐可视化动画 =====
    initMusicVisualizer();
    
    // ===== 平滑滚动功能 =====
    initSmoothScroll();
    
    console.log('EDMG主页已加载完成 ✨');
});

// ===== 导航栏初始化函数 =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 汉堡菜单点击事件
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // 导航链接点击时关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });
}

// ===== 视频播放器初始化函数 =====
function initVideoPlayer() {
    const video = document.getElementById('mainVideo');
    const playButton = document.getElementById('playButton');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (video && playButton && videoOverlay) {
        // 播放按钮点击事件
        playButton.addEventListener('click', function() {
            playVideo();
        });
        
        // 视频点击播放/暂停
        video.addEventListener('click', function() {
            if (video.paused) {
                playVideo();
            } else {
                pauseVideo();
            }
        });
        
        // 视频播放时隐藏覆盖层
        video.addEventListener('play', function() {
            videoOverlay.classList.add('hidden');
            updatePlayButton('pause');
        });
        
        // 视频暂停时显示覆盖层
        video.addEventListener('pause', function() {
            videoOverlay.classList.remove('hidden');
            updatePlayButton('play');
        });
        
        // 视频结束时重置
        video.addEventListener('ended', function() {
            videoOverlay.classList.remove('hidden');
            updatePlayButton('play');
            video.currentTime = 0;
        });
        
        // 视频加载错误处理
        video.addEventListener('error', function(e) {
            console.warn('视频加载失败:', e);
            showVideoError();
        });
        
        // 视频元数据加载完成
        video.addEventListener('loadedmetadata', function() {
            console.log('视频时长:', formatTime(video.duration));
        });
    }
    
    // 播放视频函数
    function playVideo() {
        if (video) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('视频开始播放');
                }).catch(error => {
                    console.error('视频播放失败:', error);
                    showVideoError();
                });
            }
        }
    }
    
    // 暂停视频函数
    function pauseVideo() {
        if (video) {
            video.pause();
            console.log('视频已暂停');
        }
    }
    
    // 更新播放按钮图标
    function updatePlayButton(state) {
        if (playButton) {
            const icon = playButton.querySelector('i');
            if (icon) {
                if (state === 'play') {
                    icon.className = 'fas fa-play';
                } else {
                    icon.className = 'fas fa-pause';
                }
            }
        }
    }
    
    // 显示视频错误信息
    function showVideoError() {
        if (videoOverlay && playButton) {
            playButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            playButton.style.background = 'rgba(231, 76, 60, 0.9)';
            playButton.style.color = 'white';
            playButton.title = '视频加载失败';
        }
    }
    
    // 格式化时间显示
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// ===== 滚动动画初始化函数 =====
function initScrollAnimations() {
    // 创建Intersection Observer来检测元素进入视口
    const observerOptions = {
        threshold: 0.1, // 当元素10%可见时触发
        rootMargin: '0px 0px -50px 0px' // 提前50px触发
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口时添加动画类
                entry.target.classList.add('fade-in-up');
                
                // 为卡片添加延迟动画效果
                if (entry.target.classList.contains('resource-card')) {
                    const cards = document.querySelectorAll('.resource-card');
                    cards.forEach((card, index) => {
                        if (card === entry.target) {
                            card.style.animationDelay = `${index * 0.2}s`;
                        }
                    });
                }
                
                // 停止观察已动画的元素
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll([
        '.abstract-content',
        '.character-item',
        '.framework-description',
        '.framework-diagram',
        '.resource-card'
    ].join(','));
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== 音乐可视化动画初始化函数 =====
function initMusicVisualizer() {
    const bars = document.querySelectorAll('.bar');
    const video = document.getElementById('mainVideo');
    
    if (bars.length > 0) {
        // 随机化动画延迟以创建更自然的效果
        bars.forEach((bar, index) => {
            const randomDelay = Math.random() * 0.5;
            bar.style.animationDelay = `${randomDelay}s`;
            
            // 根据视频播放状态调整动画速度
            if (video) {
                video.addEventListener('play', function() {
                    bar.style.animationDuration = '0.8s';
                });
                
                video.addEventListener('pause', function() {
                    bar.style.animationDuration = '2s';
                });
            }
        });
        
        // 添加鼠标悬停效果
        const visualizer = document.querySelector('.music-visualizer');
        if (visualizer) {
            visualizer.addEventListener('mouseenter', function() {
                bars.forEach(bar => {
                    bar.style.animationDuration = '0.3s';
                });
            });
            
            visualizer.addEventListener('mouseleave', function() {
                bars.forEach(bar => {
                    bar.style.animationDuration = '1.5s';
                });
            });
        }
    }
}

// ===== 平滑滚动初始化函数 =====
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑固定导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 添加URL历史记录但不跳转
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ===== 工具函数 =====

// 节流函数 - 限制函数执行频率
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 防抖函数 - 延迟执行函数
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// 检查元素是否在视口中
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== 错误处理 =====
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// ===== 性能监控 =====
window.addEventListener('load', function() {
    // 页面加载完成后的性能统计
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`页面加载时间: ${loadTime}ms`);
    }
});

// ===== 响应式处理 =====
window.addEventListener('resize', debounce(function() {
    // 窗口大小改变时的处理
    const isMobile = window.innerWidth <= 768;
    
    // 根据屏幕大小调整视频控制
    const playButton = document.getElementById('playButton');
    if (playButton) {
        if (isMobile) {
            playButton.style.width = '60px';
            playButton.style.height = '60px';
            playButton.style.fontSize = '1.5rem';
        } else {
            playButton.style.width = '80px';
            playButton.style.height = '80px';
            playButton.style.fontSize = '2rem';
        }
    }
}, 250));

// ===== 键盘快捷键支持 =====
document.addEventListener('keydown', function(e) {
    const video = document.getElementById('mainVideo');
    
    if (video && document.activeElement !== document.body) {
        return; // 如果焦点在表单元素上，不处理快捷键
    }
    
    switch(e.key) {
        case ' ': // 空格键播放/暂停
            e.preventDefault();
            if (video) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
            break;
        case 'ArrowLeft': // 左箭头后退10秒
            e.preventDefault();
            if (video) {
                video.currentTime = Math.max(0, video.currentTime - 10);
            }
            break;
        case 'ArrowRight': // 右箭头前进10秒
            e.preventDefault();
            if (video) {
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
            }
            break;
        case 'Home': // Home键回到顶部
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case 'End': // End键滚动到底部
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            break;
    }
});

// ===== 导出函数供其他脚本使用 =====
window.EDMG = {
    throttle,
    debounce,
    isElementInViewport
};

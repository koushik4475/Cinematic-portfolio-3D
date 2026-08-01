$(document).ready(function(){

    $('#menu').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load',function(){
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if(window.scrollY>60){
            document.querySelector('#scroll-top').classList.add('active');
        }else{
            document.querySelector('#scroll-top').classList.remove('active');
        }
    });
});

/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline',{delay: 400});
srtop.reveal('.experience .timeline .container',{interval: 400}); 


/* ============================================
   Tawk.to Live Chat — Custom Cinematic Launcher
   ============================================ */
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
var tawkLoaded = false, tawkOpenPending = false, tawkInjected = false;

// Lazy-load the Tawk embed: inject on first user interaction, or when the
// browser goes idle (rIC with 4s timeout / setTimeout fallback) — whichever
// comes first. Clicking the robo launcher before then forces an immediate load.
function loadTawk() {
    if (tawkInjected) return;
    tawkInjected = true;
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true; s1.src = 'https://embed.tawk.to/65956f8e8d261e1b5f4ec1ab/1hj7rnibr';
    s1.charset = 'UTF-8'; s1.setAttribute('crossorigin', '*');
    if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
    } else {
        (document.head || document.documentElement).appendChild(s1);
    }
}
(function scheduleTawkLoad() {
    function onFirstInteraction() {
        window.removeEventListener('pointerdown', onFirstInteraction);
        window.removeEventListener('scroll', onFirstInteraction);
        window.removeEventListener('keydown', onFirstInteraction);
        loadTawk();
    }
    window.addEventListener('pointerdown', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('scroll', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true, passive: true });
    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(loadTawk, { timeout: 4000 });
    } else {
        setTimeout(loadTawk, 3500);
    }
})();

Tawk_API.onLoad = function () {
    tawkLoaded = true;
    // Hide the default Tawk bubbles to use our cinematic robo-pet.
    // Some Tawk builds render the bubble/attention-grabber shortly AFTER
    // onLoad fires, so re-hide once more after it settles.
    Tawk_API.hideWidget();
    setTimeout(function () {
        if (!document.body.classList.contains('tawk-chat-open')) Tawk_API.hideWidget();
    }, 1000);

    // Set custom personality
    Tawk_API.setAttributes({
        'name': 'Visitor',
        'hash': 'hash_value' // Optional security
    }, function(error){});

    // If the visitor clicked the robot while the widget was still starting,
    // open the chat now.
    if (tawkOpenPending) {
        tawkOpenPending = false;
        document.body.classList.add('tawk-chat-open');
        Tawk_API.showWidget();
        Tawk_API.maximize();
    }
};

// Personality & Auto-Status
Tawk_API.onChatMessageAgent = function(n){
   // Custom logic for when agent sends message
};

// Tawk re-shows its default bubble whenever the chat is minimized or ended —
// re-hide it so the robo-pet stays the only launcher.
Tawk_API.onChatMinimized = function () {
    document.body.classList.remove('tawk-chat-open');
    Tawk_API.hideWidget();
};
Tawk_API.onChatEnded = function () {
    document.body.classList.remove('tawk-chat-open');
    Tawk_API.hideWidget();
};

var masterOrbLauncher = document.getElementById('master-robot-orb');
if (masterOrbLauncher) masterOrbLauncher.addEventListener('click', () => {
    if (!tawkLoaded) {
        // Clicked before the Tawk script finished loading — load it now (if it
        // hasn't been injected yet) and open the chat from onLoad.
        tawkOpenPending = true;
        loadTawk();
        return;
    }
    if (typeof Tawk_API.isChatMaximized === 'function' && Tawk_API.isChatMaximized()) {
        document.body.classList.remove('tawk-chat-open');
        Tawk_API.minimize();
    } else {
        document.body.classList.add('tawk-chat-open');
        Tawk_API.showWidget();
        Tawk_API.maximize();
    }
});

/* ============================================
   ROBO-PET — Interactive Companion Logic
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const robo = document.getElementById('robo');
    const moodEl = document.getElementById('mood');
    const masterOrb = document.getElementById('master-robot-orb');

    if (!robo || !moodEl || !masterOrb) return;

    const LE = { x: 48, y: 48 }, RE = { x: 72, y: 48 };
    const g = id => document.getElementById(id);
    const els = {
        li: g('liris'), ri: g('riris'),
        lp: g('lpup'), rp: g('rpup'),
        lh: g('lhl'), rh: g('rhl'),
        lb: g('lblink'), rb: g('rblink')
    };

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    let rAF = null, blinkLock = false, lastEyeEvt = null;

    // Eye Tracking — store the latest event, process once per frame
    document.addEventListener('mousemove', e => {
        lastEyeEvt = e;
        if (rAF) return;
        rAF = requestAnimationFrame(() => {
            rAF = null;
            const evt = lastEyeEvt;
            if (!evt) return;
            const r = robo.getBoundingClientRect();
            if (!r.width) return;
            const sx = 120 / r.width, sy = 155 / r.height;
            const mx = (evt.clientX - r.left) * sx, my = (evt.clientY - r.top) * sy;

            [[els.li, els.lp, els.lh, LE], [els.ri, els.rp, els.rh, RE]].forEach(([iris, pup, hl, eye]) => {
                const dx = mx - eye.x, dy = my - eye.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
                const ox = clamp(dx / d * Math.min(d * 0.22, 4.5), -4.5, 4.5);
                const oy = clamp(dy / d * Math.min(d * 0.15, 3), -3, 3);
                iris.setAttribute('cx', eye.x + ox); iris.setAttribute('cy', eye.y + oy);
                pup.setAttribute('cx', eye.x + ox); pup.setAttribute('cy', eye.y + oy);
                hl.setAttribute('cx', eye.x + ox - 4); hl.setAttribute('cy', eye.y + oy - 4);
            });
        });
    }, { passive: true });

    // Blink Loop
    const startBlink = () => {
        setTimeout(() => {
            if (blinkLock) { startBlink(); return; }
            blinkLock = true;
            const t0 = performance.now(), dur = 130;
            const animateBlink = (t) => {
                const p = Math.min((t - t0) / dur, 1);
                const ry = p < 0.5 ? p * 2 * 12 : (1 - (p - 0.5) * 2) * 12;
                els.lb.setAttribute('ry', ry); els.rb.setAttribute('ry', ry);
                if (p < 1) requestAnimationFrame(animateBlink);
                else {
                    els.lb.setAttribute('ry', 0); els.rb.setAttribute('ry', 0);
                    blinkLock = false; startBlink();
                }
            };
            requestAnimationFrame(animateBlink);
        }, 1600 + Math.random() * 3200);
    };
    startBlink();

    // Mood & Animations
    const setMood = (txt) => {
        moodEl.style.opacity = '0';
        moodEl.style.transform = 'translateY(5px)';
        setTimeout(() => {
            moodEl.textContent = txt;
            moodEl.style.opacity = '1';
            moodEl.style.transform = 'translateY(0)';
        }, 150);
    };

    robo.addEventListener('mouseenter', () => {
        setMood('◈ hi there! ◈');
        robo.classList.remove('float');
        robo.classList.add('wave-anim');
        setTimeout(() => { robo.classList.add('float'); }, 1400);
    });

    robo.addEventListener('mouseleave', () => {
        setMood('◈ system: active. chat? ◈');
        robo.classList.remove('wave-anim');
    });

    let clickCount = 0;
    const clickMoods = ['◈ ouch! ◈', '◈ hehe ◈', '◈ boop! ◈', '◈ again?! ◈', '◈ beep boop ◈'];

    robo.addEventListener('click', () => {
        robo.classList.remove('float', 'jump-anim');
        void robo.offsetWidth; // Trigger reflow
        robo.classList.add('jump-anim');
        setMood(clickMoods[clickCount % clickMoods.length]);
        clickCount++;
        setTimeout(() => {
            robo.classList.remove('jump-anim');
            robo.classList.add('float');
        }, 550);
    });

    // No About section on this page — keep the robo visible on every viewport.
    masterOrb.classList.remove('mobile-hide');
});


// disable developer mode
document.onkeydown = function(e) {
  if(e.keyCode == 123) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
     return false;
  }
}

document.addEventListener('visibilitychange',
function(){
    if(document.visibilityState === "visible"){
        document.title = "Experience | Portfolio KOUSHIK HY";
        $("#favicon").attr("href","/assets/images/favicon.png");
    }
    else {
        document.title = "TQSM FOR VISITING ";
        $("#favicon").attr("href","/assets/images/favhand.png");
    }
});
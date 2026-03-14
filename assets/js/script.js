/* ============================================
   THREE.JS — Cinematic Professional Hero
   Classic Design with Studio-Grade Lighting
   Enhanced "Welcoming" Cinematic Sequence
   ============================================ */
(function initThreeScene() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    let isHeroVisible = true;
    const scene = new THREE.Scene();

    // Camera starts in "Deep Space" for Fly-In
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // === STUDIO LIGHTING ===
    const ambientLight = new THREE.AmbientLight(0x4040ff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x00e5ff, 0, 20); // Starts at 0 for "Spark" effect
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xffffff, 30, 20);
    rimLight.position.set(-5, 2, -3);
    scene.add(rimLight);

    const moonLight = new THREE.PointLight(0x5a189a, 20, 20);
    moonLight.position.set(0, -5, 2);
    scene.add(moonLight);

    // === CINEMATIC HERO OBJECT ===
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);

    const material = new THREE.MeshPhysicalMaterial({
        color: 0x00e5ff,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0, // Starts at 0 for fade-in
        transmission: 0.9,
        thickness: 1.0,
        emissive: 0x00e5ff,
        emissiveIntensity: 0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0, 0, 0);
    scene.add(mesh);

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 1, // Bright for the "Spark" phase
        blending: THREE.AdditiveBlending
    });
    const lines = new THREE.LineSegments(wireframeGeometry, lineMaterial);
    mesh.add(lines);

    // === ATMOSPHERIC BACKGROUND ===
    const bgNodeCount = isMobile ? 40 : 80;
    const bgGeometry = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgNodeCount * 3);
    for (let i = 0; i < bgNodeCount; i++) {
        bgPositions[i * 3] = (Math.random() - 0.5) * 30;
        bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 15;
    }
    bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    const bgMaterial = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.04, transparent: true, opacity: 0.2 });
    const bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgPoints);

    // Mouse tracking
    let targetMouse = new THREE.Vector2(0, 0);
    let currentMouse = new THREE.Vector2(0, 0);

    window.addEventListener('mousemove', (e) => {
        targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2.0;
        targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2.0;
    });

    // Visibility Observer
    const heroSection = document.getElementById('home');
    if (heroSection) {
        new IntersectionObserver((entries) => {
            isHeroVisible = entries[0].isIntersecting;
        }, { threshold: 0.05 }).observe(heroSection);
    }

    // --- ENHANCED WELCOME SEQUENCE LOGIC ---
    let introStartTime = null;
    let introPhase = 0; // 0: Spark, 1: Fly-In, 2: Settling

    function animate() {
        requestAnimationFrame(animate);

        const time = performance.now() * 0.001;

        // Only animate intensity if the preloader is opening (handled by stage-3 class)
        if (document.getElementById('cinematic-preloader').classList.contains('stage-3')) {
            const easeOut = 1 - Math.exp(-introPhase * 2);
            camera.position.z = 25 - (easeOut * 19);
            const bouncePhase = Math.max(0, introPhase - 0.5) * 2;
            const elastic = 1 - Math.cos(bouncePhase * Math.PI * 1.5) * Math.exp(-bouncePhase * 3);
            mesh.scale.setScalar(elastic * 1.2);
            material.opacity = Math.min(0.35, bouncePhase);
            lineMaterial.opacity = 1.0 - (bouncePhase * 0.6);
            keyLight.intensity = Math.max(1500, 10000 * (1 - introPhase));
            introPhase = Math.min(1.5, introPhase + 0.015);
        } else {
            // Hold camera back while preloading
            camera.position.z = 25;
            mesh.scale.setScalar(0.01);
            keyLight.intensity = 0;
            material.opacity = 0;
            lineMaterial.opacity = 0;
        }

        mesh.rotation.y += 0.003;
        mesh.rotation.x += 0.002;

        // Dynamic Highlight follows mouse
        keyLight.position.x = currentMouse.x * 5 + 5;
        keyLight.position.y = currentMouse.y * 5 + 5;

        mesh.position.y = Math.sin(time) * 0.1;

        // Smooth parallax
        currentMouse.lerp(targetMouse, 0.05);
        scene.rotation.y = currentMouse.x * 0.1;
        scene.rotation.x = currentMouse.y * 0.1;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Dismiss Preloader with Cinematic Stages when 3D is ready
    window.addEventListener('load', () => {
        const preloader = document.getElementById('cinematic-preloader');
        if (!preloader) return;

        // Stage 1: Light Slit Expands
        setTimeout(() => preloader.classList.add('stage-1'), 300);

        // Stage 2: Logo Reveals
        setTimeout(() => preloader.classList.add('stage-2'), 1000);

        // Stage 3: Curtains Open & Scene Starts
        setTimeout(() => {
            preloader.classList.add('stage-3');
            introPhase = 0; // Start 3D Assembly animation
        }, 2200);

        // Clean up DOM
        setTimeout(() => preloader.style.display = 'none', 3800);
    });
})();

/* ============================================
   HERO IMAGE — 3D Mouse Parallax Tilt
   ============================================ */
(function initHeroParallax() {
    const heroImg = document.querySelector('.home .hero-image-wrapper img');
    const heroWrapper = document.querySelector('.home .hero-image-wrapper');
    if (!heroImg || !heroWrapper || window.innerWidth < 768) return;

    let targetRotX = 0, targetRotY = 0, currentRotX = 0, currentRotY = 0;

    heroWrapper.addEventListener('mousemove', (e) => {
        const rect = heroWrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotY = x * 25;
        targetRotX = -y * 20;
    });

    heroWrapper.addEventListener('mouseleave', () => {
        targetRotX = 0;
        targetRotY = 0;
    });

    function animateHeroTilt() {
        currentRotX += (targetRotX - currentRotX) * 0.08;
        currentRotY += (targetRotY - currentRotY) * 0.08;
        heroImg.style.transform = `perspective(800px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) scale(1.02)`;
        requestAnimationFrame(animateHeroTilt);
    }
    animateHeroTilt();
})();

/* ============================================
   MOUSE 3D TILT — Interactive Cards
   ============================================ */
function init3DTilt() {
    document.querySelectorAll('.work .box-container .box, .education .box-container .box').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateZ(20px) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
function initMagneticButtons() {
    if (window.innerWidth < 768) return;
    document.querySelectorAll('.home .btn, .social-icons a').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* ============================================
   jQuery Ready
   ============================================ */
$(document).ready(function () {
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        if (window.scrollY > 20) {
            document.querySelector('header').classList.add('scrolled');
        } else {
            document.querySelector('header').classList.remove('scrolled');
        }

        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');
            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 600, 'swing');
    });

    $("#contact-form").submit(function (event) {
        event.preventDefault();
        emailjs.init("jd3hZ9YTqN4TwLJOJ");
        emailjs.sendForm('service_zbh3lbi', 'template_lj3ljm1', this)
            .then(function () {
                $('#form-message-success').fadeIn();
                setTimeout(function () { $('#form-message-success').fadeOut(); }, 5000);
                document.getElementById("contact-form").reset();
            }, function () {
                alert("Form Submission Failed! Please try again.");
            });
    });

    setTimeout(initMagneticButtons, 500);
});

/* ============================================
   Tab Visibility
   ============================================ */
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === "visible") {
        document.title = "Koushik HY | Full-Stack Developer Portfolio";
    } else {
        document.title = "Thank you 😊";
    }
});

/* ============================================
   Typed.js
   ============================================ */
var typed = new Typed(".typing-text", {
    strings: [
        "Full-Stack Development",
        "UI/UX Design",
        "Android Development",
        "Web Design",
        "Backend Development",
        "Ethical Hacking",
        "AI & Machine Learning"
    ],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 1500,
});

/* ============================================
   Skills & Projects
   ============================================ */
async function fetchData(type = "skills") {
    let response = type === "skills"
        ? await fetch("skills.json")
        : await fetch("./projects/projects.json");
    return await response.json();
}

function showSkills(skills) {
    let container = document.getElementById("skillsContainer");
    let html = "";
    skills.forEach((skill, i) => {
        html += `
        <div class="bar" style="animation-delay: ${i * 0.05}s">
            <div class="info">
                <img src="${skill.icon}" alt="${skill.name} technology icon" loading="lazy" />
                <span>${skill.name}</span>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function showProjects(projects) {
    let container = document.querySelector("#work .box-container");
    let html = "";
    const featured = [
        'OpenAgent — Hybrid AI',
        'Travel GO-INDIA',
        'Android Cipher',
        'Focus Guard',
        'Visiting Profile',
        'Smart City Waste Management'
    ];
    const orderedProjects = featured
        .map(name => projects.find(p => p.name === name))
        .filter(Boolean);

    orderedProjects.forEach(project => {
        const ext = project.imageExt || 'png';
        html += `
        <div class="box">
            <div class="image">
                <img draggable="false" src="/assets/images/projects/${project.image}.${ext}" alt="${project.name} - project by Koushik HY" loading="lazy" />
            </div>
            <div class="content">
                <div class="tag">
                    <h3>${project.name}</h3>
                </div>
                <div class="desc">
                    <p>${project.desc}</p>
                    <div class="btns">
                        <a href="${project.links.view}" class="btn" target="_blank" rel="noopener noreferrer"><i class="fas fa-eye"></i> View</a>
                        <a href="${project.links.code}" class="btn" target="_blank" rel="noopener noreferrer">Code <i class="fas fa-code"></i></a>
                    </div>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
    setTimeout(init3DTilt, 100);
}

fetchData().then(showSkills);
fetchData("projects").then(showProjects);

/* ============================================
   Intersection Observer — Scroll Reveal
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(
        'section:not(.home), .education .box, .skills .container, .experience .container, .work .box-container'
    ).forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});

/* ============================================
   3D Tilt on Skill Bars
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const skillsSection = document.querySelector('.skills .container');
    if (skillsSection && window.innerWidth > 768) {
        skillsSection.addEventListener('mousemove', (e) => {
            const bars = skillsSection.querySelectorAll('.bar');
            bars.forEach(bar => {
                const rect = bar.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
                if (dist < 250) {
                    const x = (e.clientX - centerX) / rect.width;
                    const y = (e.clientY - centerY) / rect.height;
                    const intensity = 1 - (dist / 250);
                    bar.style.transform = `perspective(600px) rotateX(${-y * 15 * intensity}deg) rotateY(${x * 15 * intensity}deg) translateZ(${15 * intensity}px)`;
                } else {
                    bar.style.transform = '';
                }
            });
        });
        skillsSection.addEventListener('mouseleave', () => {
            skillsSection.querySelectorAll('.bar').forEach(bar => bar.style.transform = '');
        });
    }
});

/* ============================================
   Contact Orbs Animation
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const contactAnim = document.querySelector('.contact-animation');
    if (!contactAnim) return;
    const dotCount = 20;
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'contact-dot';
        const angle = (i / dotCount) * Math.PI * 2;
        const radius = 100 + Math.random() * 60;
        dot.style.cssText = `--delay: ${i * 0.15}s; --x: ${Math.cos(angle) * radius}px; --y: ${Math.sin(angle) * radius}px; --size: ${3 + Math.random() * 5}px;`;
        contactAnim.appendChild(dot);
    }
});

/* ============================================
   Tawk.to Live Chat — Custom Cinematic Launcher
   ============================================ */
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true; s1.src = 'https://embed.tawk.to/65956f8e8d261e1b5f4ec1ab/1hj7rnibr';
    s1.charset = 'UTF-8'; s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();

Tawk_API.onLoad = function () {
    // Hide the default Tawk bubbles to use our cinematic orb
    Tawk_API.hideWidget();
};

document.getElementById('master-robot-orb').addEventListener('click', () => {
    Tawk_API.toggle();
});

/* AI Pet Cinematic Blink (Every 5s) */
document.addEventListener('DOMContentLoaded', () => {
    const eyelids = document.querySelector('.pet-eyelids');
    if (!eyelids) return;
    
    setInterval(() => {
        eyelids.classList.add('blink');
        setTimeout(() => eyelids.classList.remove('blink'), 300);
    }, 5000);
});

/* ============================================
   EXPERIENCE SECTION - Scroll Animations
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.experience .container').forEach(container => {
        observer.observe(container);
    });
});
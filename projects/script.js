$(document).ready(function () {

    // Mobile Menu
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
    });

    // Three.js Cinematic Bokeh Starfield
    (function initBackground() {
        const canvas = document.querySelector('#bg-canvas');
        if (!canvas) return;

        const isMobile = window.innerWidth < 768;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));

        // === CINEMATIC BOKEH STARFIELD ===
        // Layers for parallax depth
        const layers = [
            { count: isMobile ? 200 : 400, size: 0.03, opacity: 0.8, speed: 0.0005 }, // Sharp, far
            { count: isMobile ? 100 : 200, size: 0.08, opacity: 0.4, speed: 0.001 },  // Soft, mid
            { count: isMobile ? 30 : 60, size: 0.25, opacity: 0.15, speed: 0.002 }  // Bokeh, near
        ];

        layers.forEach(layer => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(layer.count * 3);
            const colors = new Float32Array(layer.count * 3);

            for (let i = 0; i < layer.count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 30;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

                const brightness = 0.6 + Math.random() * 0.4;
                colors[i * 3] = brightness * 0.4;
                colors[i * 3 + 1] = brightness * 0.8;
                colors[i * 3 + 2] = brightness;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: layer.size,
                vertexColors: true,
                transparent: true,
                opacity: layer.opacity,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            const points = new THREE.Points(geometry, material);
            points.userData = { speed: layer.speed };
            scene.add(points);
        });

        camera.position.z = 8;

        // Subtle mouse parallax
        let targetMouse = new THREE.Vector2(0, 0);
        let currentMouse = new THREE.Vector2(0, 0);

        window.addEventListener('mousemove', (e) => {
            targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 1.0;
            targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 1.0;
        });

        function animate() {
            requestAnimationFrame(animate);

            // Per-layer movement
            scene.children.forEach(child => {
                if (child.type === 'Points') {
                    child.rotation.y += child.userData.speed;
                    child.rotation.x += child.userData.speed * 0.5;
                }
            });

            // Smooth parallax
            currentMouse.lerp(targetMouse, 0.04);
            scene.position.x = currentMouse.x;
            scene.position.y = currentMouse.y;

            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    })();
});

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === "visible") {
        document.title = "Projects | Portfolio KOUSHIK HY";
    } else {
        document.title = "Thank you 😊";
    }
});

async function getProjects() {
    const response = await fetch("/projects/projects.json");
    return await response.json();
}

function showProjects(projects) {
    let projectsContainer = document.querySelector(".work .box-container");
    let projectsHTML = "";

    projects.forEach(project => {
        const ext = project.imageExt || 'png';
        projectsHTML += `
        <div class="grid-item ${project.category}">
            <div class="box tilt">
                <div class="image">
                    <img draggable="false" src="/assets/images/projects/${project.image}.${ext}" alt="${project.name}" loading="lazy" />
                </div>
                <div class="content">
                    <h3>${project.name}</h3>
                    <div class="desc">
                        <p>${project.desc}</p>
                        <div class="btns">
                            <a href="${project.links.view}" class="btn btn--view" target="_blank">
                                <i class="fas fa-eye"></i> View
                            </a>
                            <a href="${project.links.code}" class="btn btn--code" target="_blank">
                                <i class="fas fa-code"></i> GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });

    projectsContainer.innerHTML = projectsHTML;

    if (window.innerWidth > 768) {
        VanillaTilt.init(document.querySelectorAll(".tilt"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.1,
        });
    }

    $('.box-container').imagesLoaded(function () {
        var $grid = $('.box-container').isotope({
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
        });

        $('.button-group').on('click', 'button', function () {
            $('.button-group').find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
            const filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
        });
    });
}

getProjects().then(data => {
    showProjects(data);
});
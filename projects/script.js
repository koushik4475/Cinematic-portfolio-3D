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


});

function initPortfolioGrid() {
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

initPortfolioGrid();
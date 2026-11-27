$(function () {
  $('#menu').on('click', function () {
    $(this).toggleClass('fa-times');
    $('.navbar').toggleClass('nav-toggle');
  });
  $(window).on('scroll load', function () {
    $('#menu').removeClass('fa-times');
    $('.navbar').removeClass('nav-toggle');
    $('#scroll-top').toggleClass('active', window.scrollY > 60);
  });

  // CSS Grid keeps cards aligned at any content length. Filter without
  // Isotope's absolute positioning, which caused uneven and overlapping rows.
  $('.button-group').on('click', 'button', function () {
    $('.button-group .is-checked').removeClass('is-checked');
    $(this).addClass('is-checked');
    const filter = $(this).attr('data-filter');
    $('.work .box-container .grid-item').each(function () {
      this.hidden = filter !== '*' && !$(this).is(filter);
    });
  });
});

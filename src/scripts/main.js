//= parts/_jquery-3.1.0.js
;
//= parts/_owl.carousel.js
;


$(document).ready(function () {
    var carouselSettings = {		// Most important owl features
        items: 2,
        singleItem: true,
        itemsScaleUp: false,

        //Basic Speeds
        slideSpeed: 200,
        paginationSpeed: 800,
        rewindSpeed: 1000,

        //Autoplay
        autoPlay: false,
        stopOnHover: true,

        //Pagination
        pagination: true,
        paginationNumbers: false,

        // Responsive
        responsive: true,
        responsiveRefreshRate: 200,
        responsiveBaseWidth: window
    };

    $(".owl-carousel").owlCarousel(carouselSettings);

});
$(document).ready(function() {

    //////////
    // Global variables
    //////////

    var _window = $(window);
    var _document = $(document);

    var easingSwing = [.02, .01, .47, 1]; // default jQuery easing for anime.js

    ////////////
    // READY - triggered when PJAX DONE
    ////////////
    function pageReady() {
        legacySupport();

        updateHeaderActiveClass();
        initHeaderScroll();

        initMasks();
        initSelectric();
        initDatepicker();

        // development helper
        _window.on('resize', debounce(setBreakpoint, 200))
    }

    pageReady();

    //////////
    // COMMON
    //////////

    function legacySupport() {
        // svg support for laggy browsers
        svg4everybody();

        // Viewport units buggyfill
        window.viewportUnitsBuggyfill.init({
            force: false,
            refreshDebounceWait: 150,
            appendToBody: true
        });
    }

    // Prevent # behavior
    _document
        .on('click', '[href="#"]', function(e) {
            e.preventDefault();
        })
        .on('click', 'a[href^="#section"]', function() { // section scroll
            var el = $(this).attr('href');
            $('body, html').animate({
                scrollTop: $(el).offset().top
            }, 1000);
            return false;
        })

        .on('click', '.open-button', function(e) {
            e.preventDefault();
            $(this).parent().parent().toggleClass('is-open');
        });

    // HEADER SCROLL
    // add .header-static for .page or body
    // to disable sticky header
    function initHeaderScroll() {
        _window.on('scroll', throttle(function(e) {
            if ($(window).scrollTop() > 1) {
                $('.header').addClass('custom');
            } else {
                $('.header').removeClass('custom');
            }
        }, 1));
    }

    // SET ACTIVE CLASS IN HEADER
    // * could be removed in production and server side rendering
    // user .active for li instead
    function updateHeaderActiveClass() {
        $('.header__pages a').each(function(i, val) {
            if ($(val).attr('href') == window.location.pathname.split('/').pop()) {
                $(val).addClass('is-active');
            } else {
                $(val).removeClass('is-active')
            }
        });
    }

    // Fillings steps
    (function() {
        var $steps = $('#steps');
        var $stepsChilds = $steps.children();
        var productStep = parseInt($steps.data('active-step'));

        if (typeof productStep == 'number' && $stepsChilds.length > 1) {
            $($stepsChilds[productStep]).addClass('in-progress')

            for (var i = 0; i <= productStep - 1; i++) {
                $($stepsChilds[i]).addClass('is-active')
            }
        } else {
            console.warn('Ooops! Smth. wrong')
        }
    }());

    ////////////
    // UI
    ////////////

    // selectric
    function initSelectric() {
        $('select').selectric();
    }

    // datepicker
    function initDatepicker() {
        var daysToAdd = 1;
        $("#txtFromDate").datepicker({
            onSelect: function(selected) {
                var dtMax = new Date(selected);
                dtMax.setDate(dtMax.getDate() + daysToAdd);
                var dd = dtMax.getDate();
                var mm = dtMax.getMonth() + 1;
                var y = dtMax.getFullYear();
                var dtFormatted = mm + '/' + dd + '/' + y;
                $("#txtToDate").datepicker("option", "minDate", dtFormatted);
            }
        });

        $("#txtToDate").datepicker({
            onSelect: function(selected) {
                var dtMax = new Date(selected);
                dtMax.setDate(dtMax.getDate() - daysToAdd);
                var dd = dtMax.getDate();
                var mm = dtMax.getMonth() + 1;
                var y = dtMax.getFullYear();
                var dtFormatted = mm + '/' + dd + '/' + y;
                $("#txtFromDate").datepicker("option", "maxDate", dtFormatted)
            }
        });
    }

    // Masked input
    function initMasks() {
        $("[js-dateMask]").mask("99.99.99", {
            placeholder: "ДД.ММ.ГГ"
        });
        $("input[type='tel']").mask("+7 (000) 000-0000", {
            placeholder: "+7 (___) ___-____"
        });
    }

    //////////
    // BARBA PJAX
    //////////
    Barba.Pjax.Dom.containerClass = "page";

    var FadeTransition = Barba.BaseTransition.extend({
        start: function() {
            Promise
                .all([this.newContainerLoading, this.fadeOut()])
                .then(this.fadeIn.bind(this));
        },

        fadeOut: function() {
            var deferred = Barba.Utils.deferred();

            anime({
                targets: this.oldContainer,
                opacity: .5,
                easing: easingSwing, // swing
                duration: 300,
                complete: function(anim) {
                    deferred.resolve();
                }
            })

            return deferred.promise
        },

        fadeIn: function() {
            var _this = this;
            var $el = $(this.newContainer);

            $(this.oldContainer).hide();

            $el.css({
                visibility: 'visible',
                opacity: .5
            });

            anime({
                targets: "html, body",
                scrollTop: 0,
                easing: easingSwing, // swing
                duration: 150
            });

            anime({
                targets: this.newContainer,
                opacity: 1,
                easing: easingSwing, // swing
                duration: 300,
                complete: function(anim) {
                    triggerBody()
                    _this.done();
                }
            });
        }
    });

    Barba.Pjax.getTransition = function() {
        return FadeTransition;
    };

    Barba.Prefetch.init();
    Barba.Pjax.start();

    Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

        pageReady();

    });

    //////////
    // DEVELOPMENT HELPER
    //////////
    function setBreakpoint() {
        var wHost = window.location.host.toLowerCase()
        var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
        if (displayCondition) {
            console.log(displayCondition)
            var wWidth = _window.width();

            var content = "<div class='dev-bp-debug'>" + wWidth + "</div>";

            $('.page').append(content);
            setTimeout(function() {
                $('.dev-bp-debug').fadeOut();
            }, 1000);
            setTimeout(function() {
                $('.dev-bp-debug').remove();
            }, 1500)
        }
    }

    // // PAGINATION

    // let pages = 25;

    // document.getElementById('pagination').innerHTML = createPagination(pages, 12);

    // function createPagination(pages, page) {
    //     let str = '<ul>';
    //     let active;
    //     let pageCutLow = page - 1;
    //     let pageCutHigh = page + 1;
    //     // Show the Previous button only if you are on a page other than the first
    //     if (page > 1) {
    //         str += '<li class="page-item previous no"><a onclick="createPagination(pages, ' + (page - 1) + ')"><</a></li>';
    //     }
    //     // Show all the pagination elements if there are less than 6 pages total
    //     if (pages < 6) {
    //         for (let p = 1; p <= pages; p++) {
    //             active = page == p ? "active" : "no";
    //             str += '<li class="' + active + '"><a onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
    //         }
    //     }
    //     // Use "..." to collapse pages outside of a certain range
    //     else {
    //         // Show the very first page followed by a "..." at the beginning of the
    //         // pagination section (after the Previous button)
    //         if (page > 2) {
    //             str += '<li class="no page-item"><a onclick="createPagination(pages, 1)">1</a></li>';
    //             if (page > 3) {
    //                 str += '<li class="out-of-range"><a onclick="createPagination(pages,' + (page - 2) + ')">...</a></li>';
    //             }
    //         }
    //         // Determine how many pages to show after the current page index
    //         if (page === 1) {
    //             pageCutHigh += 2;
    //         } else if (page === 2) {
    //             pageCutHigh += 1;
    //         }
    //         // Determine how many pages to show before the current page index
    //         if (page === pages) {
    //             pageCutLow -= 2;
    //         } else if (page === pages - 1) {
    //             pageCutLow -= 1;
    //         }
    //         // Output the indexes for pages that fall inside the range of pageCutLow
    //         // and pageCutHigh
    //         for (let p = pageCutLow; p <= pageCutHigh; p++) {
    //             if (p === 0) {
    //                 p += 1;
    //             }
    //             if (p > pages) {
    //                 continue
    //             }
    //             active = page == p ? "active" : "no";
    //             str += '<li class="page-item ' + active + '"><a onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
    //         }
    //         // Show the very last page preceded by a "..." at the end of the pagination
    //         // section (before the Next button)
    //         if (page < pages - 1) {
    //             if (page < pages - 2) {
    //                 str += '<li class="out-of-range"><a onclick="createPagination(pages,' + (page + 2) + ')">...</a></li>';
    //             }
    //             str += '<li class="page-item no"><a onclick="createPagination(pages, pages)">' + pages + '</a></li>';
    //         }
    //     }
    //     // Show the Next button only if you are on a page other than the last
    //     if (page < pages) {
    //         str += '<li class="page-item next no"><a onclick="createPagination(pages, ' + (page + 1) + ')">></a></li>';
    //     }
    //     str += '</ul>';
    //     // Return the pagination string to be outputted in the pug templates
    //     document.getElementById('pagination').innerHTML = str;
    //     return str;
    // }

});

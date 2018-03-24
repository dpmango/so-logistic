$(document).ready(function() {

    $('select').selectric();

    $(".steps").each(function () {
      var countLi = $(this).find('.steps__item').length;
      console.log(countLi);
      if (countLi > 10) {
        $('.steps__item').addClass('responsive--edit');
      }
    })

    $(document).on('click', '.open-button', function(e) {
        e.preventDefault();
        $(this).parent().parent().toggleClass('is-open');
    });

    // Fillings steps
        (function(){
            var $steps = $('#steps');
        var $stepsChilds = $steps.children();
        var productStep = parseInt($steps.data('active-step'));
        
        if (typeof productStep == 'number' && $stepsChilds.length > 1) {
            $($stepsChilds[productStep]).addClass('in-progress')
          
            for (var i = 0; i <= productStep - 1;i++) {
            $($stepsChilds[i]).addClass('is-active')
          }
        } else {
            console.warn('Ooops! Smth. wrong')
        }
      }());

    var daysToAdd = 1;
    $("#txtFromDate").datepicker({
        onSelect: function (selected) {
            var dtMax = new Date(selected);
            dtMax.setDate(dtMax.getDate() + daysToAdd); 
            var dd = dtMax.getDate();
            var mm = dtMax.getMonth() + 1;
            var y = dtMax.getFullYear();
            var dtFormatted = mm + '/'+ dd + '/'+ y;
            $("#txtToDate").datepicker("option", "minDate", dtFormatted);
        }
    });
    
    $("#txtToDate").datepicker({
        onSelect: function (selected) {
            var dtMax = new Date(selected);
            dtMax.setDate(dtMax.getDate() - daysToAdd); 
            var dd = dtMax.getDate();
            var mm = dtMax.getMonth() + 1;
            var y = dtMax.getFullYear();
            var dtFormatted = mm + '/'+ dd + '/'+ y;
            $("#txtFromDate").datepicker("option", "maxDate", dtFormatted)
        }
    });

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


    //////////
    // Global variables
    //////////

    var _window = $(window);
    var _document = $(document);

    // detectors
    function isRetinaDisplay() {
        if (window.matchMedia) {
            var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
            return (mq && mq.matches || (window.devicePixelRatio > 1));
        }
    }

    function isMobile() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true
        } else {
            return false
        }
    }

    function msieversion() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true
        } else {
            return false
        }
    }

    if (msieversion()) {
        $('body').addClass('is-ie');
    }

    if (isMobile()) {
        $('body').addClass('is-mobile');
    }


    // BREAKPOINT SETTINGS
    var bp = {
        mobileS: 375,
        mobile: 568,
        tablet: 768,
        desktop: 1024,
        wide: 1336,
        hd: 1680
    }

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

    ////////////
    // READY - triggered when PJAX DONE
    ////////////
    function pageReady() {
        legacySupport();

        updateHeaderActiveClass();
        initHeaderScroll();

        initPopups();
        initSliders();
        initScrollMonitor();
        initMasks();
        initTeleport();

        revealFooter();
        _window.on('resize', throttle(revealFooter, 100));

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
            force: true,
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

    // FOOTER REVEAL
    function revealFooter() {
        var footer = $('[js-reveal-footer]');
        if (footer.length > 0) {
            var footerHeight = footer.outerHeight();
            var maxHeight = _window.height() - footerHeight > 100;
            if (maxHeight && !msieversion()) {
                $('body').css({
                    'margin-bottom': footerHeight
                });
                footer.css({
                    'position': 'fixed',
                    'z-index': -10
                });
            } else {
                $('body').css({
                    'margin-bottom': 0
                });
                footer.css({
                    'position': 'static',
                    'z-index': 10
                });
            }
        }
    }

    // HEADER SCROLL
    // add .header-static for .page or body
    // to disable sticky header
    function initHeaderScroll(){
      _window.on('scroll', throttle(function(e) {
        if ($(window).scrollTop() > 1) {
          $('.header').addClass('custom');
        } else {
          $('.header').removeClass('custom');
        }

      }, 1));

    }

    // HAMBURGER TOGGLER
    _document.on('click', '[js-hamburger]', function() {
        $(this).toggleClass('is-active');
        $('.header').toggleClass('is-menu-opened')
        $('[js-header-menu]').toggleClass('is-active');
        $('.mobile-navi').toggleClass('is-active');
    });

    function closeMobileMenu() {
        $('[js-hamburger]').removeClass('is-active');
        $('.header').removeClass('is-menu-opened')
        $('[js-header-menu]').removeClass('is-active');
        $('.mobile-navi').removeClass('is-active');
    }

    // SET ACTIVE CLASS IN HEADER
    // * could be removed in production and server side rendering
    // user .active for li instead
    function updateHeaderActiveClass() {
        $('.header__menu li').each(function(i, val) {
            if ($(val).find('a').attr('href') == window.location.pathname.split('/').pop()) {
                $(val).addClass('is-active');
            } else {
                $(val).removeClass('is-active')
            }
        });
    }


    // VIDEO PLAY
    _document.on('click', '.promo-video .icon', function() {
        $(this).closest('.promo-video').toggleClass('playing');
        $(this).closest('.promo-video').find('iframe').attr("src", $("iframe").attr("src").replace("autoplay=0", "autoplay=1"));
    });


    //////////
    // SLIDERS
    //////////

    function initSliders() {
        var slickNextArrow = '<div class="slick-prev"><svg class="ico ico-back-arrow"><use xlink:href="img/sprite.svg#ico-back-arrow"></use></svg></div>';
        var slickPrevArrow = '<div class="slick-next"><svg class="ico ico-next-arrow"><use xlink:href="img/sprite.svg#ico-next-arrow"></use></svg></div>'

        // General purpose sliders
        $('[js-slider]').each(function(i, slider) {
            var self = $(slider);

            // set data attributes on slick instance to control
            if (self && self !== undefined) {
                self.slick({
                    autoplay: self.data('slick-autoplay') !== undefined ? true : false,
                    dots: self.data('slick-dots') !== undefined ? true : false,
                    arrows: self.data('slick-arrows') !== undefined ? true : false,
                    prevArrow: slickNextArrow,
                    nextArrow: slickPrevArrow,
                    infinite: self.data('slick-infinite') !== undefined ? true : true,
                    speed: 300,
                    slidesToShow: 1,
                    accessibility: false,
                    adaptiveHeight: true,
                    draggable: self.data('slick-no-controls') !== undefined ? false : true,
                    swipe: self.data('slick-no-controls') !== undefined ? false : true,
                    swipeToSlide: self.data('slick-no-controls') !== undefined ? false : true,
                    touchMove: self.data('slick-no-controls') !== undefined ? false : true
                });
            }

        })

        // other individual sliders goes here

        // SLICK - UNSLICK EXAMPLE
        // used when slick should be disabled on certain breakpoints

        // var _socialsSlickMobile = $('.socials__wrapper');
        // var socialsSlickMobileOptions = {
        //   mobileFirst: true,
        //   dots: true,
        //   responsive: [
        //     {
        //       breakpoint: 0,
        //       settings: {
        //         slidesToShow: 1,
        //         slidesToScroll: 1,
        //       }
        //     },
        //     {
        //       breakpoint: 568,
        //       settings: {
        //         slidesToShow: 2,
        //         slidesToScroll: 2,
        //       }
        //
        //     },
        //     {
        //       breakpoint: 992,
        //       settings: "unslick"
        //     }
        //
        //   ]
        // }
        // _socialsSlickMobile.slick(socialsSlickMobileOptions);
        //
        // _window.on('resize', debounce(function(e){
        //   if ( _window.width() > 992 ) {
        //     if (_socialsSlickMobile.hasClass('slick-initialized')) {
        //       _socialsSlickMobile.slick('unslick');
        //     }
        //     return
        //   }
        //   if (!_socialsSlickMobile.hasClass('slick-initialized')) {
        //     return _socialsSlickMobile.slick(socialsSlickMobileOptions);
        //   }
        // }, 300));

    }

    //////////
    // MODALS
    //////////

    function initPopups() {
        // Magnific Popup
        var startWindowScroll = 0;
        $('[js-popup]').magnificPopup({
            type: 'inline',
            fixedContentPos: true,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 300,
            mainClass: 'popup-buble',
            callbacks: {
                beforeOpen: function() {
                    startWindowScroll = _window.scrollTop();
                    // $('html').addClass('mfp-helper');
                },
                close: function() {
                    // $('html').removeClass('mfp-helper');
                    _window.scrollTop(startWindowScroll);
                }
            }
        });

        $('[js-popup-gallery]').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Загрузка #%curr%...',
            mainClass: 'popup-buble',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
            }
        });
    }

    function closeMfp() {
        $.magnificPopup.close();
    }

    ////////////
    // UI
    ////////////

    // custom selects
    _document.on('click', '.ui-select__visible', function(e) {
        var that = this
        // hide parents
        $(this).parent().parent().parent().find('.ui-select__visible').each(function(i, val) {
            if (!$(val).is($(that))) {
                $(val).parent().removeClass('active')
            }
        });

        $(this).parent().toggleClass('active');
    });

    _document.on('click', '.ui-select__dropdown span', function() {
        // parse value and toggle active
        var value = $(this).data('val');
        if (value) {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');

            // set visible
            $(this).closest('.ui-select').removeClass('active');
            $(this).closest('.ui-select').find('input').val(value);

            $(this).closest('.ui-select').find('.ui-select__visible span').text(value);
        }

    });

    // textarea autoExpand
    _document
        .one('focus.autoExpand', '.ui-group textarea', function() {
            var savedValue = this.value;
            this.value = '';
            this.baseScrollHeight = this.scrollHeight;
            this.value = savedValue;
        })
        .on('input.autoExpand', '.ui-group textarea', function() {
            var minRows = this.getAttribute('data-min-rows') | 0,
                rows;
            this.rows = minRows;
            rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
            this.rows = minRows + rows;
        });

    // Masked input
    function initMasks() {
        $("[js-dateMask]").mask("99.99.99", { placeholder: "ДД.ММ.ГГ" });
        $("input[type='tel']").mask("+7 (000) 000-0000", { placeholder: "+7 (___) ___-____" });
    }


    ////////////
    // TELEPORT PLUGIN
    ////////////
    function initTeleport() {
        $('[js-teleport]').each(function(i, val) {
            var self = $(val)
            var objHtml = $(val).html();
            var target = $('[data-teleport-target=' + $(val).data('teleport-to') + ']');
            var conditionMedia = $(val).data('teleport-condition').substring(1);
            var conditionPosition = $(val).data('teleport-condition').substring(0, 1);

            if (target && objHtml && conditionPosition) {

                function teleport() {
                    var condition;

                    if (conditionPosition === "<") {
                        condition = _window.width() < conditionMedia;
                    } else if (conditionPosition === ">") {
                        condition = _window.width() > conditionMedia;
                    }

                    if (condition) {
                        target.html(objHtml)
                        self.html('')
                    } else {
                        self.html(objHtml)
                        target.html("")
                    }
                }

                teleport();
                _window.on('resize', debounce(teleport, 100));


            }
        })
    }

    ////////////
    // SCROLLMONITOR - WOW LIKE
    ////////////
    function initScrollMonitor() {
        $('.wow').each(function(i, el) {

            var elWatcher = scrollMonitor.create($(el));

            var delay;
            if ($(window).width() < 768) {
                delay = 0
            } else {
                delay = $(el).data('animation-delay');
            }

            var animationClass = $(el).data('animation-class') || "wowFadeUp"

            var animationName = $(el).data('animation-name') || "wowFade"

            elWatcher.enterViewport(throttle(function() {
                $(el).addClass(animationClass);
                $(el).css({
                    'animation-name': animationName,
                    'animation-delay': delay,
                    'visibility': 'visible'
                });
            }, 100, {
                'leading': true
            }));
            elWatcher.exitViewport(throttle(function() {
                $(el).removeClass(animationClass);
                $(el).css({
                    'animation-name': 'none',
                    'animation-delay': 0,
                    'visibility': 'hidden'
                });
            }, 100));
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
            return $(this.oldContainer).animate({ opacity: .5 }, 200).promise();
        },

        fadeIn: function() {
            var _this = this;
            var $el = $(this.newContainer);

            $(this.oldContainer).hide();

            $el.css({
                visibility: 'visible',
                opacity: .5
            });

            $el.animate({ opacity: 1 }, 200, function() {
                document.body.scrollTop = 0;
                _this.done();
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
        closeMobileMenu();

    });




});
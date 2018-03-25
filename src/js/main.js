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

        setLogDefaultState();
        setStepsClasses();

        initMasks();
        initValidations();
        initSelectric();
        initDatepicker();

        _window.on('resize', debounce(setBreakpoint, 200))
    }

    pageReady();

    //////////
    // COMMON
    //////////

    function legacySupport() {
        svg4everybody();

        window.viewportUnitsBuggyfill.init({
            force: false,
            refreshDebounceWait: 150,
            appendToBody: true
        });
    }

    // CLICK HANDLERS
    _document
        // prevent blank links
        .on('click', '[href="#"]', function(e) {
            e.preventDefault();
        })

        // if item is collapsed - click works on whole row
        // if item is opened, closing func works only on toggler icon
        .on('click', '.log__item', function() {
            var _this = $(this);
            if ( !_this.is('.is-open') ){
              openLog(_this)
            }
        })
        .on('click', '.log__toggler', function(e) {
            var parent = $(this).closest('.log__item');
            parent.is('.is-open') ? closeLog(parent) : openLog(parent)

            e.preventDefault();
            e.stopPropagation();
        });


    function openLog(el){
      var dropdown = el.find('.log__dropdown');

      el.addClass('is-open');
      dropdown.slideDown()
    }

    function closeLog(el){
      var dropdown = el.find('.log__dropdown');

      el.removeClass('is-open');
      dropdown.slideUp()
    }

    // set default state
    function setLogDefaultState(){
      $('.log__item').each(function(i,log){
        if ( $(log).is('.is-open') ){
          openLog($(log))
        }
      })

    }

    // HEADER SCROLL
    function initHeaderScroll() {
        _window.on('scroll', throttle(function(e) {
            if (_window.scrollTop() > 1) {
                $('.header').addClass('is-fixed');
            } else {
                $('.header').removeClass('is-fixed');
            }
        }, 10));
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
    function setStepsClasses(){
        var $steps = $('.js-steps');
        var $stepsChilds = $steps.children();
        var productStep = parseInt($steps.data('active-step'));

        if (typeof productStep == 'number' && $stepsChilds.length > 1) {
            $($stepsChilds[productStep]).addClass('in-progress')

            for (var i = 0; i <= productStep - 1; i++) {
                $($stepsChilds[i]).addClass('is-active')
            }
        }
    }


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
            showAnim: 'show',
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
            showAnim: 'show',
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

    function initValidations(){
      ////////////////
      // FORM VALIDATIONS
      ////////////////

      // jQuery validate plugin
      // https://jqueryvalidation.org


      // GENERIC FUNCTIONS
      ////////////////////

      var validateErrorPlacement = function(error, element) {
        error.addClass('ui-input__validation');
        error.appendTo(element.parent("div"));
      }
      var validateHighlight = function(element) {
        $(element).parent('div').addClass("has-error");
        $(element).parent().parent().addClass("has-error");
      }
      var validateUnhighlight = function(element) {
        $(element).parent('div').removeClass("has-error");
        $(element).parent().parent().removeClass("has-error");
      }
      var validateSubmitHandler = function(form) {
        $(form).addClass('loading');
        $.ajax({
          type: "POST",
          url: $(form).attr('action'),
          data: $(form).serialize(),
          success: function(response) {
            $(form).removeClass('loading');
            var data = $.parseJSON(response);
            if (data.status == 'success') {
              // do something I can't test
            } else {
                $(form).find('[data-error]').html(data.message).show();
            }
          }
        });
      }

      var validatePhone = {
        required: true,
        normalizer: function(value) {
            var PHONE_MASK = '+X (XXX) XXX-XXXX';
            if (!value || value === PHONE_MASK) {
                return value;
            } else {
                return value.replace(/[^\d]/g, '');
            }
        },
        minlength: 11,
        digits: true
      }

      ////////
      // FORMS


      /////////////////////
      // REGISTRATION FORM
      ////////////////////
      $(".login__form").validate({
        errorPlacement: validateErrorPlacement,
        highlight: validateHighlight,
        unhighlight: validateUnhighlight,
        submitHandler: validateSubmitHandler,
        rules: {
          name: "required",
          password: {
            required: true,
            minlength: 6,
          }
        },
        messages: {
          name: "Ошибка! Заполните это поле.",
          password: "Ошибка! Заполните это поле.",
        }
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

    function triggerBody(){
      _window.scroll();
      _window.resize();
    }

    //////////
    // DEVELOPMENT HELPER
    //////////
    function setBreakpoint() {
        var wHost = window.location.host.toLowerCase()
        var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
        if (displayCondition) {
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

});

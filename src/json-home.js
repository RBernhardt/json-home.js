(function($){

    $.getJsonHome = function(options) {

        options = $.extend({
            url: null,
            success: null,
            error: function(xhr, msg, e) {
                if( console && console.log ) {
                    console.log("[ERROR]", xhr, msg, e);
                }
            },
            dataType: "json"
        }, options);

        if(options.url) {
            $.ajax({
                url: options.url,
                mimeType: "application/json-home",
                dataType: options.dataType,
                success: function(data) {
                    if($.isFunction(options.success)) {
                        options.success(new JsonHome(data));
                    }
                },
                error: options.error
            });
        }

    };

    function JsonHome(data) {
        if(data) {
            this.parse(data);
        }
    };

    JsonHome.prototype = {

        href: '',
        data: null,
        parse: function(data) {
            this.data = data;
        }
    };

})(jQuery);

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
            this._parse(data);
        }
    };

    JsonHome.prototype = {

        resources: new Object(),

        _parse: function(data) {
            if(!data["resources"]) {
                console.log("[ERROR] resources property expected");
                return;
            }
            // ~
            var resources = new Array();
            $.each(data["resources"], function(key, value) {
                resources.push(new JsonHomeResource(key, value));
            });
            this.resources = resources;
        },

        listResources: function() {
            return this.resources;
        }

    };

    function JsonHomeResource(id, data) {
        if(id && data) {
            this._parse(id, data);
        }
    }

    JsonHomeResource.prototype = {

        id: null,
        href: null,
        hrefTemplate: null,
        hrefVars: null,

        _parse: function(id, data) {
            this.id = id;
            // ~
            if(data["href"]) {
                this.href = data["href"];
            }
            if(data["href-template"]) {
                this.hrefTemplate = data["href-template"];
            }
            if(data["href-vars"]) {
                this.hrefVars = data["href-vars"];
            }
        },

        getHref: function(vars) {
            // return href
            if(this.href) {
                return this.href;
            }
            // return without href-vars
            if(this.hrefTemplate && !this.hrefVars) {
                return this.hrefTemplate;
            }
            // return with href-vars
            if(this.hrefTemplate && this.hrefVars) {
                var replacedHref = this.hrefTemplate;
                $.each(this.hrefVars, function(key, value) {
                    if(vars && vars[value]) {
                        replacedHref = replacedHref.replace("{" + key + "}", vars[value]);
                    } else {
                        console.log("[ERROR] href-vars with key '" + value + "' expected");
                    }
                });
                return replacedHref;
            }
            // default return
            return null;
        }

    }

})(jQuery);

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
            var resources = new Object();
            $.each(data["resources"], function(key, value) {
                resources[key] = new JsonHomeResource(value);
            });
            this.resources = resources;
        },

        listResources: function() {
            return this.resources;
        },

        get: function(id) {
            return this.resources[id];
        },

        getHref: function(id, vars) {
            var resource = this.resources[id];
            if(resource) {
                return resource.getHref(vars);
            }
            return null;
        }

    };

    function JsonHomeResource(data) {
        if(data) {
            this._parse(data);
        }
    }

    JsonHomeResource.prototype = {

        href: null,
        hrefTemplate: null,
        hrefVars: null,

        _parse: function(data) {
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

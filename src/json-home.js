(function($){
    "use strict";

    function JsonHomeResource(data) {
        this.href = null;
        this.hrefTemplate = null;
        this.hrefVars = null;
        // ~
        if(data) {
            this.parse(data);
        }
    }

    JsonHomeResource.prototype = {



        parse: function(data) {
            if(data.href) {
                this.href = data.href;
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

    };

    function JsonHome(jsonHomeUrl, data) {
        this.jsonHomeUrl = jsonHomeUrl;
        this.resources = {};
        // ~
        if(data) {
            this.parse(data);
        }
    }

    JsonHome.prototype = {

        parse: function(data) {
            if(!data.resources) {
                console.log("[ERROR] resources property expected");
                return;
            }
            // ~
            var self = this;
            $.each(data.resources, function(key, value) {
                self.resources[key] = new JsonHomeResource(value);
            });
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
                var href = resource.getHref(vars);
                return resolve(href, this.jsonHomeUrl);
            }
            return null;
        }

    };

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
                        options.success(new JsonHome(options.url, data));
                    }
                },
                error: options.error
            });
        }

    };

    function resolve(url, base_url) {
        var doc      = document
            , old_base = doc.getElementsByTagName('base')[0]
            , old_href = old_base && old_base.href
            , doc_head = doc.head || doc.getElementsByTagName('head')[0]
            , our_base = old_base || doc_head.appendChild(doc.createElement('base'))
            , resolver = doc.createElement('a')
            , resolved_url
            ;
        our_base.href = base_url;
        resolver.href = url;
        resolved_url  = resolver.href; // browser magic at work here

        if (old_base) old_base.href = old_href;
        else doc_head.removeChild(our_base);
        return resolved_url;
    }

}(jQuery));
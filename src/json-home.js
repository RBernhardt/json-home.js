(function($){
    "use strict";

    function JsonHomeResource(data) {
        if(data) {
            this.parse(data);
        }
    }

    JsonHomeResource.prototype = {

        href: null,
        hrefTemplate: null,
        hrefVars: null,

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
        if(data) {
            this.parse(data);
        }
    }

    JsonHome.prototype = {

        resources: {},

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
                return magicCombine(this.jsonHomeUrl, href);
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

    function magicCombine(a, b){
        if(b.indexOf('://') != -1) return b;

        var backs = 0;
        var lastIndex = b.indexOf('../');

        while(lastIndex != -1){
            backs++;
            lastIndex = b.indexOf('../', lastIndex+3);
        }

        var URL = a.split('/');
        //Remove last part of URL array, which is always either the file name or [BLANK]
        URL.splice(URL.length-1, 1)

        if(b.substr(0,1) == '/')
            b = b.substr(1);
        var toAdd = b.split('/');

        for(var i = 0, c = toAdd.length-backs; i < c; ++i){
            if(i < backs)
                URL[URL.length - (backs-i)] = toAdd[backs+i];
            else
                URL.push(toAdd[backs+i]);
        }

        return URL.join('/');
    }

}(jQuery));

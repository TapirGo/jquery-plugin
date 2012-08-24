(function($){
  var el;
  var settings = {};

  var methods = {
    init: function(options) {
      el = this;

      settings = {
        token: false,
        query_param: 'query',
      };

      if (options) {
        $.extend(settings, options);
      }

      if (!settings.token || settings.query_param == '') {
        return this;
      }

      // Get the query value from the url parsing, or from the argument passed in the method.
      var query = paramValue(settings.query_param);
      if (settings.query) {
        query = settings.query;
      }

      // Call tapir API and display the result.
      $.getJSON(
        createUrl(settings.token, query),
        function(data) {
          displayResult(el, data, settings.complete)
        }
      );

      return this;
    }
  };

  // The function that display the result of the search
  function displayResult(el, data, complete) {
    // Call the complete callback if needed.
    if(complete) { 
      complete(); 
    }
    
    // The result
    $.each(data, function(key, val) {
      el.append('<div class="result"><h3><a href="' + val.link + '">' 
                + val.title + '</a></h3><p>' 
                + val.summary + '</p></div>');
    });
  };

  // The function that create the URL that makes the request to the Tapir API.
  function createUrl(token, query) {
    return 'http://tapirgo.com/api/1/search.json?token=' 
           + token 
           + '&query=' 
           + query 
           + '&callback=?';
  };

  // Extract the param value from the URL.
  function paramValue(query_param) {
    var results = new RegExp('[\\?&]' + query_param + '=([^&#]*)').exec(window.location.href);
    return results ? results[1] : false;
  };

  // Extend jQuery to include the new 'tapir' function.
  $.fn.tapir = function(method) {
    if (methods[method]) {
      return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.tapir');
    }
  };
})( jQuery );
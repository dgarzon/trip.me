// Add modal to allow user to move venues btwn dates.
//
function Itinerary (name, dates) {
    this.name = name;
    this.dates = dates;
};

function ItineraryDate(value) {
    this.value = new Date(value);
    this.venues = new Array();
}

ItineraryDate.prototype.getActualMonth = function getActualMonth() {
   var n = this.value.getMonth();
   n += 1;
   return n;
 };

ItineraryDate.prototype.getActualDay = function getActualDay() {
    var n = this.value.getDate();
    n += 1;
    return n;
};

ItineraryDate.prototype.getCalendarDay = function getCalendarDay() {
    var n = this.value.getDay();
    var d = new Array(7);
    d[0] = "Sunday";
    d[1] = "Monday";
    d[2] = "Tuesday";
    d[3] = "Wednesday";
    d[4] = "Thursday";
    d[5] = "Friday";
    d[6] = "Saturday";
    return d[n];
};

ItineraryDate.prototype.getCalendayMonth = function getCalendarMonth() {
    var n = this.value.getMonth();
    var m = new Array(12);
    m[0] = "January";
    m[1] = "February";
    m[2] = "March";
    m[3] = "April";
    m[4] = "May";
    m[5] = "June";
    m[6] = "July";
    m[7] = "August";
    m[8] = "September";
    m[9] = "October";
    m[10] = "November";
    m[11] = "December";
    return m[n];
};

ItineraryDate.prototype.getCleanDay = function getCleanDay () {
    var d = this.value.getDate();
    if (d < 10) {
        return '0' + d;
    } else {
        return d;
    }
};

ItineraryDate.prototype.getCleanMonth = function getCleanMonth () {
    m = this.getActualMonth();
    if (m < 10) {
        return '0' + m;
    } else {
        return m;
    }
}

function Venue (id, name, address, city, state, country, category, lng, lat, rating) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.city = city;
    this.state = state;
    this.country = country;
    this.category = category;
    this.lng = lng;
    this.lat = lat;
    this.rating = rating;
}

$(document).ready(function(){
    var itineraries = new Array();

    NProgress.configure({ showSpinner: false });

    NProgress.start();

    var $wrap = $('#itinerary-wrapper');

    $wrap.packery({
      itemSelector: '.itinerary',
      gutter: 0,
      isResizeBound: false
    });

    function loadSideBar () {
        temp = new Array();
        for (var i = 0; i < itineraries.length; i++) {
            var itinerary_id = itineraries[i].name.split(' ').join('-').toLowerCase();
            var html =  '<div class="itinerary" id="itinerary-' + itinerary_id + '">';
            html += '<div class="handle"></div>';
            html += '<h4 class="sidebar-heading"><a href="javascript:void(0)" class="itineraryName">' + itineraries[i].name + '</a></h4>';
            html += '<a href="javascript:void(0)" class="edit"><i class="fa fa-pencil"></i></a>';
            html += '<button type="button" class="close">×</button>';
            html += '<hr class="white-divider">';
            html += '<ul id="itinerary-' + itinerary_id + '-dates" class="itinerary-date-list">';
            newDates = new Array();
            for (var j = 0; j < itineraries[i].dates.length; j++) {
                newDate = new Date(itineraries[i].dates[j].value);
                newItinDate = new ItineraryDate(newDate);

                newDates.push(newItinDate);

                day = newItinDate.getCleanDay();
                month = newItinDate.getCleanMonth();
                year = newItinDate.value.getFullYear();

                literal = newItinDate.getCalendarDay();
                id = 'itinerary-' + itinerary_id + '-' + month + '/' + day + '/' + year;

                html += '<li id="' + id + '" class="itinerary-' + itinerary_id + '">' + '<h5>' + literal +'<span class="date pull-right">' + month + '/' + day + '/' +  year + '</span></h5></li>';

                var id = 'itinerary-' + itinerary_id + '-' + month + '/' + day + '/' +  year;
                var list_id = 'list-' + id;

                html += '<ul class="venue-list" id="' + list_id + '">';

                for (var k = 0; k < itineraries[i].dates[j].venues.length; k++){
                    newVenue = new Venue(itineraries[i].dates[j].venues[k].id, itineraries[i].dates[j].venues[k].name, itineraries[i].dates[j].venues[k].address, itineraries[i].dates[j].venues[k].city, itineraries[i].dates[j].venues[k].state, itineraries[i].dates[j].venues[k].country, itineraries[i].dates[j].venues[k].category, itineraries[i].dates[j].venues[k].lng, itineraries[i].dates[j].venues[k].lat, itineraries[i].dates[j].venues[k].rating);
                    newDates[j].venues.push(newVenue);
                    html += '<li><a href="javascript:void(0)" class="venue-detail" data-venueid="' + newVenue.id + '">' + newVenue.name + '</a></li>';
                }
                html += '</ul>';
            }
            newItin = new Itinerary(itineraries[i].name, newDates);
            temp.push(newItin);
            html += '</ul></div>';
            var $item = $(html);
            $wrap.packery()
                .append( $item )
                .packery( 'appended', $item );
        }
        itineraries = new Array();
        itineraries = temp;
        $wrap.find('.itinerary').each( makeEachDraggable );
    }

    if (window.localStorage["itineraries"] != null){
        itineraries = JSON.parse(window.localStorage["itineraries"]);
        loadSideBar();
    }

    $('.basic').fancySelect();

    $('#since').pickadate({
        min: true,
        max: false,
        format: 'dddd, mmmm dd, yyyy.',
        formatSubmit: 'mm/dd/yyyy',
        hiddenSuffix: '-submit'
        });

    $('#until').pickadate({
        min: true,
        max: false,
        format: 'dddd, mmmm dd, yyyy.',
        formatSubmit: 'mm/dd/yyyy',
        hiddenSuffix: '-submit'
        });

    var config = {
        clientId: 'CEOEFXOV22WSYXIWU0RHPC5Q1OWPY4BFHEML5ENAHT4PE0WQ',
        clientSecret: '4KDRHECMZU1QKHP3CDGKU1EFZSYEW4A2TQNWEPBDNZE5QFM5',
        redirectURI: 'http://localhost:3000/',
        apiUrl: 'https://api.foursquare.com/'
    };

    var map = L.mapbox.map('map', 'dgarzon.gc6he475', {
        detectRetina: true,
        zoomControl: false
    });

    var features = [];

    // New for help
    var help = document.getElementById('help');
    help.addEventListener('click', function() {
        $('#helpModal').modal('toggle');
    });

    var search = document.getElementById('search');

    search.addEventListener('click', function() {
        NProgress.configure({ showSpinner: false });

        NProgress.start();

        var venue = $('input[name=venue]').val();
        var city = $('input[name=place]').val();

        var lat = 0, lng = 0;

        $.getJSON(config.apiUrl + 'v2/venues/explore?near=' + city + '&query=' + venue + '&client_id=' + config.clientId + '&client_secret=' + config.clientSecret, {})
        .done(function(data) {
             features = [];
             venues = data['response']['groups'][0]['items'];
             for (var i = 0; i < venues.length; i++) {
                lat += Number(venues[i]['venue']['location']['lat']);
                lng += Number(venues[i]['venue']['location']['lng']);

                if (venues[i]['venue'].hasOwnProperty('categories') && venues[i]['venue']['categories'].length > 0) {
                    features.push({
                        type: 'Feature',
                        geometry: {
                           type: 'Point',
                           coordinates: [venues[i]['venue']['location']['lng'], venues[i]['venue']['location']['lat']]
                        },
                        properties: {
                           id: venues[i]['venue']['id'],
                           title: venues[i]['venue']['name'],
                           city: venues[i]['venue']['location']['city'],
                           state: venues[i]['venue']['location']['state'],
                           country: venues[i]['venue']['location']['country'],
                           address: venues[i]['venue']['location']['address'],
                           category: venues[i]['venue']['categories'][0]['name'],
                           rating: venues[i]['venue']['rating']
                        }

                    });
                }
                else {
                    features.push({
                        type: 'Feature',
                        geometry: {
                           type: 'Point',
                           coordinates: [venues[i]['venue']['location']['lng'], venues[i]['venue']['location']['lat']]
                        },
                        properties: {
                           id: venues[i]['venue']['id'],
                           title: venues[i]['venue']['name'],
                           city: venues[i]['venue']['location']['city'],
                           state: venues[i]['venue']['location']['state'],
                           country: venues[i]['venue']['location']['country'],
                           address: venues[i]['venue']['location']['address'],
                           rating: venues[i]['venue']['rating']
                        }
                    });
                }
            }

            map.setView([lat/venues.length, lng/venues.length], 13);

            map.markerLayer.setGeoJSON({
                type: 'FeatureCollection',
                features: features
            });
        })
        .fail(function(jqXHR, textStatus, errorThrown) { $(".alert").delay(200).addClass("in").fadeOut(4000); })
        .always(function() { NProgress.done(); });

    }, false);

    navigator.geolocation.getCurrentPosition(function(data) {

        var lat = data['coords']['latitude'];
        var lng = data['coords']['longitude'];
        map.setView(new L.LatLng(lat, lng), 14);
        L.mapbox.markerLayer({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            properties: {
                title: 'Current Location',
                'marker-color': '#e67e22'
            }
        }).addTo(map);

        NProgress.done();
    });

    map.markerLayer.on('layeradd', function(e) {
        var marker = e.layer,
            feature = marker.feature;

        var category_text = '';

        var category_content = '';

        if (feature.properties.category) {
            category_text = feature.properties.category;
            category_content = '<div class="popup-body">' + '<p>' + category_text + '</p>' + '</div>' + '<hr>';
        }

        // Create custom popup content
        var popupContent = '<h4 class="popup-title">' + feature.properties.title + '</h4>' +
                            '<h5 class="popup-city">' + feature.properties.city + '</h5>' +
                            '<h5 class="popup-state">' + feature.properties.state + '</h5>' +
                            '<h5 class="popup-country">' + feature.properties.country + '</h5>' +
                            '<hr>' +
                            category_content +
                            '<h5>Rating: <span class="normal">' + Number(feature.properties.rating)/2 + ' / 5' + '</span></h5><hr>' +
                            '<div class="centered"><button type="button" class="btn btn-primary" id="openAddToItineraryModalButton" data-name="' + feature.properties.title +
                                '" data-city="' + feature.properties.city + '" data-venueid="' + feature.properties.id + '" data-address="' + feature.properties.address +
                                '" data-country="' + feature.properties.country + '" data-category="' + category_text + '" data-lng="' + feature.geometry.coordinates[0] +
                                '" data-lat="' + feature.geometry.coordinates[1] + '" data-state="' + feature.properties.state + '" data-rating="' + feature.properties.rating + '">' +
                                '<i class="fa fa-plus add-icon"></i>Add to Itinerary</button></div>';

        marker.bindPopup(popupContent,{
            closeButton: false,
            minWidth: 320
        });
    });


    map.on('move', function() {
        var inBounds = [],
            bounds = map.getBounds();

        map.markerLayer.eachLayer(function(marker) {
            if (bounds.contains(marker.getLatLng())) {
                inBounds.push(marker.options.title);
            }
        });

        // display a list of markers.
        document.getElementById('onscreen').innerHTML = inBounds.join('\n');
    });

    map.markerLayer.on('click', function(e) {
        map.panTo(e.layer.getLatLng());
    });

    $( document ).on( 'click', 'button#openAddToItineraryModalButton', function (e) {
        map.markerLayer.eachLayer(function(marker) {
                marker.closePopup();
            });

        if (itineraries.length === 0) {
            $('#itineraryDatesModal').modal('toggle');
            return;
        }

        sibling = $('#availableDates').siblings();
        childs = $('#availableDates').siblings().children();

        for (var i = 0; i < childs.length; i++) {
            if (childs.eq(i).hasClass('selected')) {
                childs.eq(i).removeClass('selected');
            }
        }
        childs.eq(0).addClass('selected');
        sibling.eq(0).text(childs.eq(0).text());

        sibling = $('#availableItineraries').siblings();
        childs = $('#availableItineraries').siblings().children();

        for (var i = 0; i < childs.length; i++) {
            if (childs.eq(i).hasClass('selected')) {
                childs.eq(i).removeClass('selected');
            }
        }
        childs.eq(0).addClass('selected');
        sibling.eq(0).text(childs.eq(0).text());

        $('#saveVenueToItinerary').attr('data-venueid', this.dataset.venueid);
        $('#saveVenueToItinerary').attr('data-name', this.dataset.name);
        $('#saveVenueToItinerary').attr('data-address', this.dataset.address);
        $('#saveVenueToItinerary').attr('data-city', this.dataset.city);
        $('#saveVenueToItinerary').attr('data-state', this.dataset.state);
        $('#saveVenueToItinerary').attr('data-country', this.dataset.country);
        $('#saveVenueToItinerary').attr('data-category', this.dataset.category);
        $('#saveVenueToItinerary').attr('data-rating', this.dataset.rating);
        $('#saveVenueToItinerary').attr('data-lng', this.dataset.lng);
        $('#saveVenueToItinerary').attr('data-lat', this.dataset.lat);

        $('#addToItineraryModal').modal('toggle');

    });

    $('#addToItineraryModal').on('hidden.bs.modal', function () {
        $('#saveVenueToItinerary').attr('data-venueid', '');
        $('#saveVenueToItinerary').attr('data-name', '');
        $('#saveVenueToItinerary').attr('data-address', '');
        $('#saveVenueToItinerary').attr('data-city', '');
        $('#saveVenueToItinerary').attr('data-state', '');
        $('#saveVenueToItinerary').attr('data-country', '');
        $('#saveVenueToItinerary').attr('data-category', '');
        $('#saveVenueToItinerary').attr('data-rating', '');
        $('#saveVenueToItinerary').attr('data-lng', '');
        $('#saveVenueToItinerary').attr('data-lat', '');
    });

    $( document ).on( 'click', 'button#saveVenueToItinerary', function (e) {
        var venue = new Venue(this.dataset.venueid, this.dataset.name, this.dataset.address, this.dataset.city, this.dataset.state, this.dataset.country, this.dataset.category, this.dataset.lng, this.dataset.lat, this.dataset.rating);
        console.log(venue.rating);
        var itinerary = itineraries.filter(function( itinerary ) {
            if (itinerary.name == $('#availableItineraries').val().titleize())
                return itinerary;
        });

        var date = new Date($('#availableDates').val().slice(-10));

        for (var i = 0; i < itinerary[0].dates.length; i++) {
            if (itinerary[0].dates[i].value.getTime() === date.getTime()) {
                itinerary[0].dates[i].venues.push(venue);

                var itinerary_id = $('#availableItineraries').val().toLowerCase().split(' ').join('-');
                var id = 'itinerary-' + itinerary_id + '-' + $('#availableDates').val().slice(-10);
                var list_id = 'list-' + id;

                document.getElementById(id).innerHTML += '<ul class="venue-list" id="' + list_id + '">' + '</ul>';
                document.getElementById(list_id).innerHTML += '<li><a href="javascript:void(0)" class="venue-detail" data-venueid="' + this.dataset.venueid + '">' + this.dataset.name + '</a></li>';
            }
        }

        window.localStorage["itineraries"] = JSON.stringify(itineraries);

        $wrap.packery();

        $('#addToItineraryModal').modal('hide');

    });

    function removeVenueFromItinerary( name, venueid, date ) {
        for (var i = 0; i < itineraries.length; i++) {
            if (itineraries[i].name === name){
                for (var j = 0; j < itineraries[i].dates.length; j++ ) {
                    if (itineraries[i].dates[j].value.getTime() === date.getTime()) {
                        removeVenueFromDate(itineraries[i].dates[j], venueid);
                    }
                }
            }
        }
    }

    $( document ).on( 'click', '#removeVenueFromItineraryButton', function (e) {
        var venueid = this.dataset.venueid;
        var itinerary_name = this.dataset.itinerary.split('-').join(' ').titleize();
        var date = new Date(this.dataset.date);

        removeVenueFromItinerary(itinerary_name, venueid, date);
        updateSideBar();
        window.localStorage["itineraries"] = JSON.stringify(itineraries);
        $('#venueDetailView').modal('hide');
    });

    $( document ).on( 'click', '.venue-detail', function (e) {
        NProgress.start();

        var venueid = this.dataset.venueid;

        var itinerary_id = $(this).closest('ul').attr('id').substring(15, $(this).closest('ul').attr('id').length - 11);

        var date_id = $(this).closest('ul').attr('id').slice(-10);

        $.getJSON(config.apiUrl + 'v2/venues/' + venueid + '?client_id=' + config.clientId + '&client_secret=' + config.clientSecret + '&v=20131201', {})
        .done(function(data) {
             features = [];
             venue = data['response'];

             $('#venueDetailViewLabel').text(venue['venue']['name']);

             $('#removeVenueFromItineraryButton').attr("data-venueid", venueid);
             $('#removeVenueFromItineraryButton').attr("data-itinerary", itinerary_id);
             $('#removeVenueFromItineraryButton').attr("data-date", date_id);

             if (venue['venue']['photos']['groups'].length > 0) {
                 images = new String();
                 indicator = new String();
                 for (var i = 0; i < venue['venue']['photos']['groups'][0]['items'].length; i++) {
                    if (i > 9) {
                        break;
                    }
                    var prefix = venue['venue']['photos']['groups'][0]['items'][i]['prefix'];
                    var suffix = venue['venue']['photos']['groups'][0]['items'][i]['suffix'];
                    if (i === 0) {
                        indicator += '<li data-target="#venueDetailImageContainer" data-slide-to="'+ i +'" class="active"></li>';
                        images += '<div class="item active"><img src="' + prefix + 'original' + suffix  + '" alt="' + venue['venue']['name'] + '" class="image"></div>';
                    } else {
                        indicator += '<li data-target="#venueDetailImageContainer" data-slide-to="'+ i +'"></li>';
                        images += '<div class="item"><img src="' + prefix + 'original' + suffix  + '" alt="' + venue['venue']['name'] + '" class="image"></div>';
                    }
                 }

                 $("#venueDetailImageContainer").carousel("pause").removeData();

                 $('#carousel-images-indicator').html($(indicator));

                 $('#carousel-images').html($(images));

                 $("#venueDetailImageContainer").carousel(0);
            }

             contact = new String();
             contact += '<hr>';
             contact += '<h4>Contact:</h4>';
             contact += '<hr>';
             contact += '<div class="col-md-6">';
             contact += '<p>' + venue['venue']['location']['address'] + '</p>';
             contact += '<p>' + venue['venue']['location']['city'] + ', ' + venue['venue']['location']['state'] + '</p>';
             contact += '<p>' + venue['venue']['location']['country'] + '</p>';
             contact += '</div>';
             contact += '<div class="col-md-6">';
             contact += '<p><i class="fa fa-phone fa-padding"></i>' + venue['venue']['contact']['formattedPhone'] + '</p>';
             if (venue['venue']['contact'].hasOwnProperty('twitter')) {
                contact += '<p><i class="fa fa-twitter fa-padding"></i>' + '@' + venue['venue']['contact']['twitter'] + '</p>';
             }
             contact += '<span class="bold pull-left">Cost: </span><div id="price" class="pull-left"></div>';
             contact += '</div>';

             $('#venueDetailContact').html(contact);

             var price = 0;

             if (venue['venue'].hasOwnProperty('price')) {
                price = Number(venue['venue']['price']['tier']);
             }
             $('#price').raty({
                readOnly: true,
                number: 4,
                start: 0,
                starHalf    : '../images/dollar-half.png',
                starOff     : '../images/dollar-off.png',
                starOn      : '../images/dollar-on.png',
                score: price
             });

             if (venue['venue'].hasOwnProperty('hours')) {
                 hours = new String();
                 hours += '<hr>';
                 hours += '<h4>Hours:</h4>';
                 hours += '<hr>';
                 for (var h = 0; h < venue['venue']['hours']['timeframes'].length; h++) {
                    hours += '<div class="col-md-4"><p class="bold">' + venue['venue']['hours']['timeframes'][h]['days'] + '</p>';
                    for (var j = 0; j < venue['venue']['hours']['timeframes'][h]['open'].length; j++) {
                        hours += '<p>' + venue['venue']['hours']['timeframes'][h]['open'][j]['renderedTime'] + '</p>';
                    }
                    hours += '</div>';
                 }

                 $('#venueDetailHoursContainer').html(hours);
             }

             if(venue['venue']['tips'].hasOwnProperty('groups')) {

                 tips = new String();
                 tips += '<hr>';
                 tips += '<h4>Reviews:</h4>';
                 tips += '<hr>';
                 tips += '<div class="col-lg-12"><span class="pull-left"><span class="bold">Rating:</span> ' + '<span class="number">' + Number(venue['venue']['rating'])/2 + '</span></span><div id="rating" class="pull-left"></div></div>';
                 tips += '<div class="col-lg-12"><p class="bold comment-header">Comments: </p></div>';
                 for (var i = 0; i < venue['venue']['tips']['groups'][0]['items'].length; i++) {
                    if (i > 4) {
                        break;
                    }
                    tips += '<div class="col-lg-12 comment"><p>' + venue['venue']['tips']['groups'][0]['items'][i]['text'] + '</p><p class="bold pull-right">' + venue['venue']['tips']['groups'][0]['items'][i]['user']['firstName'] + '</p></div>';
                 }

                 $('#venueDetailTipsContainer').html(tips);
            }

            rating = 0;

            if (venue['venue'].hasOwnProperty('rating')) {
                rating = Number(venue['venue']['rating']);
            }

             $('#rating').raty({
                readOnly: true,
                number: 5,
                start: 0,
                starHalf    : '../images/star-half.png',
                starOff     : '../images/star-off.png',
                starOn      : '../images/star-on.png',
                score: rating/2
             });
        })
        .fail(function(jqXHR, textStatus, errorThrown) { $(".alert").delay(200).addClass("in").fadeOut(4000); })
        .always(function() { NProgress.done(); });

        $('#venueDetailView').modal('toggle');
    });


    /**
     * Complete Functions.
     */

    function makeEachDraggable( i, itemElem ) {
        var draggie = new Draggabilly( itemElem, {
            containment: '#itinerary-wrapper'
        });
        $wrap.packery( 'bindDraggabillyEvents', draggie );
    }

    function removeOptions(selectbox) {
        for(var i = selectbox.options.length - 1; i > 0; i--) {
            selectbox.remove(i);
        }
    }

    $('#addToItineraryModal').on('shown.bs.modal', function () {
       str = new String();

       var select = document.getElementById("availableItineraries");

       removeOptions(select);

       for (var i = 0; i < itineraries.length; i++) {
            str += '<option id="option-' + itineraries[i].name.toLowerCase().split(' ').join('-') + '">' + itineraries[i].name + '</option>';
       }
       $('#availableItineraries').append(str);
       $('#availableItineraries').trigger('update');
    });

    $('#availableItineraries').on('change', function() {
        var itinerary_name = this.value.titleize();

        var select = document.getElementById("availableDates");

        removeOptions(select);

        var itinerary = itineraries.filter(function( itinerary ) {
            if (itinerary.name == itinerary_name)
                return itinerary.dates;
        });

        str = new String();

        for (var i = 0; i < itinerary[0].dates.length; i++) {
            day = itinerary[0].dates[i].getCleanDay();
            month = itinerary[0].dates[i].getCleanMonth();
            year = itinerary[0].dates[i].value.getFullYear();
            full = month + '/' + day + '/' + year;
            literal = itinerary[0].dates[i].getCalendarDay();

            str = str + '<option>' + literal + '    -    ' + full + '</option>';
        }

        $('#availableDates').append(str);
        $('#availableDates').trigger('update');
    });

    $( document ).on( 'click', '.itineraryName', function (e) {
         features = [];

         var itinerary_name = $(this).text();

         var itinerary = itineraries.filter(function( itinerary ) {
             if (itinerary.name == itinerary_name)
                 return itinerary;
         });

         var lat = 0;
         var lng = 0;
         var counter = 0;

         for (var i = 0; i < itinerary[0].dates.length; i++) {
            for (var j = 0; j < itinerary[0].dates[i].venues.length; j++){
                lat += Number(itinerary[0].dates[i].venues[j].lat);
                lng += Number(itinerary[0].dates[i].venues[j].lng);
                features.push({
                    type: 'Feature',
                    geometry: {
                       type: 'Point',
                       coordinates: [itinerary[0].dates[i].venues[j].lng, itinerary[0].dates[i].venues[j].lat]
                    },
                    properties: {
                       id: itinerary[0].dates[i].venues[j].venueid,
                       title: itinerary[0].dates[i].venues[j].name,
                       city: itinerary[0].dates[i].venues[j].city,
                       state: itinerary[0].dates[i].venues[j].state,
                       country: itinerary[0].dates[i].venues[j].country,
                       address: itinerary[0].dates[i].venues[j].address,
                       category: itinerary[0].dates[i].venues[j].category,
                       rating: itinerary[0].dates[i].venues[j].rating
                    }
                });
                counter += 1;
            }
        }

        map.setView([lat/counter, lng/counter], 13);

        map.markerLayer.setGeoJSON({
            type: 'FeatureCollection',
            features: features
        });

    });

    function getDateFromItinerary( itinerary, date) {
        temp = new Date(date);
        for (var i = 0; i < itinerary[0].dates.length; i++) {
            if (itinerary[0].dates[i].value.getTime() == temp.getTime())
                return itinerary[0].dates[i];
        }
    }

    function getVenueFromDate( date, venueid) {
        for (var i = 0; i < date.venues.length; i++) {
            if (date.venues[i].id === venueid)
                return date.venues[i];
        }
    }

    function removeVenueFromDate( date, venueid) {
        for (var i = 0; i < date.venues.length; i++) {
            if (date.venues[i].id === venueid)
                date.venues.splice(i, 1);
        }
    }

    function addVenueToDate( date, venue) {
        date.venues.push(venue);
    }

    function updateItineraryAfterDrop( itinerary, source, destination, venue ) {
        for (var i = 0; i < itineraries.length; i++) {
            if (itineraries[i].name === itinerary.name){
                for (var j = 0; j < itineraries[i].dates.length; j++ ) {
                    if (itineraries[i].dates[j].getTime() === source.getTime()) {
                        removeVenueFromDate(itineraries[i].dates[j], venue.id);
                    }
                    if (itineraries[i].dates[j].getTime() === source.getTime()) {
                        itineraries[i].dates.push(venue);
                    }
                }
            }
        }
    }

    function updateSideBar () {
        $('#itinerary-wrapper').html("");
        for (var i = 0; i < itineraries.length; i++) {
            var itinerary_id = itineraries[i].name.split(' ').join('-').toLowerCase();
            var html =  '<div class="itinerary" id="itinerary-' + itinerary_id + '">';
            html += '<div class="handle"></div>';
            html += '<h4 class="sidebar-heading"><a href="javascript:void(0)" class="itineraryName">' + itineraries[i].name + '</a></h4>';
            html += '<a href="javascript:void(0)" class="edit"><i class="fa fa-pencil"></i></a>';
            html += '<button type="button" class="close">×</button>';
            html += '<hr class="white-divider">';
            html += '<ul id="itinerary-' + itinerary_id + '-dates" class="itinerary-date-list">';
            for (var j = 0; j < itineraries[i].dates.length; j++) {
                day = itineraries[i].dates[j].getCleanDay();
                month = itineraries[i].dates[j].getCleanMonth();
                year = itineraries[i].dates[j].value.getFullYear();

                literal = itineraries[i].dates[j].getCalendarDay();
                id = 'itinerary-' + itinerary_id + '-' + month + '/' + day + '/' + year;

                html += '<li id="' + id + '" class="itinerary-' + itinerary_id + '">' + '<h5>' + literal +'<span class="date pull-right">' + month + '/' + day + '/' +  year + '</span></h5></li>';

                var id = 'itinerary-' + itinerary_id + '-' + month + '/' + day + '/' +  year;
                var list_id = 'list-' + id;

                html += '<ul class="venue-list" id="' + list_id + '">';

                for (var k = 0; k < itineraries[i].dates[j].venues.length; k++){
                    html += '<li><a href="javascript:void(0)" class="venue-detail" data-venueid="' + itineraries[i].dates[j].venues[k].id + '">' + itineraries[i].dates[j].venues[k].name + '</a></li>';
                }
                html += '</ul>';
            }
            html += '</ul></div>';
            var $item = $(html);
            $wrap.packery()
                .append( $item )
                .packery( 'appended', $item );
        }
        $wrap.find('.itinerary').each( makeEachDraggable );
        window.localStorage["itineraries"] = JSON.stringify(itineraries);
    }

    $('#editItinerary').on('hidden.bs.modal', function () {
       updateSideBar();
    })

    $( document ).on( 'click', '.edit', function (e) {
        var id = $(this).closest('div').attr('id');
        var name = id.slice(10).split('-').join(' ').titleize();

        var itinerary = itineraries.filter(function( itinerary ) {
            if (itinerary.name == name)
                return itinerary;
        });
        html = new String();
        $('#editItineraryLabel').text('Editing Itinerary: ' + itinerary[0].name);

        for (var i = 0; i < itinerary[0].dates.length; i++) {
            day = itinerary[0].dates[i].getCleanDay();
            month = itinerary[0].dates[i].getCleanMonth();
            year = itinerary[0].dates[i].value.getFullYear();
            literal = itinerary[0].dates[i].getCalendarDay();

            date_id = month + '/' + day + '/' + year;

            html += '<div class="editDateList">';
            html += '<h5><span class="h4-span">' + literal + '</span><span class="date-edit pull-right">' + date_id + '</span></h5><hr class="darker-divider">'
            html += '<ul class="sortable connected" id="editDateList-' + date_id + '">';

            for (var j = 0; j < itinerary[0].dates[i].venues.length; j++){
                venue_id = itinerary[0].dates[i].venues[j].id;
                venue_name = itinerary[0].dates[i].venues[j].name;
                html += '<li class="venueItem" id="' + venue_id +'" data-date="' + date_id + '"><hr>' + venue_name + '<span class="pull-right">' + '<i class="fa fa-align-justify"></i>' + '</span><hr></li>';
            }

            html += '</ul></div>';
        }

        $('#editItineraryBody').html($(html));

        $( ".sortable" ).sortable({
              connectWith: ".connected",
              dropOnEmpty: true,
              items: ".venueItem",
              forcePlaceholderSize: true,
              receive: function(event, ui) {
                var receiver_id = this.id;
                var item_id = ui.item.attr('id');
                var item_orig_date_str = $('#' + item_id).data("date");
                var item_new_date_str = receiver_id.slice(-10);

                var source_date = getDateFromItinerary(itinerary, item_orig_date_str);
                var dest_date = getDateFromItinerary(itinerary, item_new_date_str);

                var venue = getVenueFromDate(source_date, item_id);

                removeVenueFromDate(source_date, venue.id);
                addVenueToDate(dest_date, venue);

                updateItineraryAfterDrop(itinerary, source_date, dest_date);

                $('#' + item_id).data("date", item_new_date_str);

                return true;
              }
        }).disableSelection();

        $('#editItinerary').modal('toggle');
    });

    $( document ).on( 'click', 'button#addItineraryToSidebar', function (e) {
        e.preventDefault();

        $('#itineraryDatesModal').modal('hide');

        var initial = new Date($('input[name=since-submit]').val());
        var last = new Date($('input[name=until-submit]').val());

        var itinerary_id = $('input[name=itinerary-name]').val().split(' ').join('-').toLowerCase();
        var itinerary = new Itinerary($('input[name=itinerary-name]').val().titleize(), getDates(initial, last));

        itineraries.push(itinerary);
        window.localStorage["itineraries"] = JSON.stringify(itineraries);

        var html =  '<div class="itinerary" id="itinerary-' + itinerary_id + '">';
        html += '<div class="handle"></div>';
        html += '<h4 class="sidebar-heading"><a href="javascript:void(0)" class="itineraryName">' + itinerary.name + '</a></h4>';
        html += '<a href="javascript:void(0)" class="edit"><i class="fa fa-pencil"></i></a>';
        html += '<button type="button" class="close">×</button>';
        html += '<hr class="white-divider">';
        html += '<ul id="itinerary-' + itinerary_id + '-dates" class="itinerary-date-list">';

        dates = itinerary.dates;

        for (var i = 0; i < dates.length; i++) {
            day = dates[i].getCleanDay();
            month = dates[i].getCleanMonth();
            year = dates[i].value.getFullYear();

            literal = dates[i].getCalendarDay();
            id = 'itinerary-' + itinerary_id + '-' + month + '/' + day + '/' + year;

            html += '<li id="' + id + '" class="itinerary-' + itinerary_id + '">' + '<h5>' + literal +'<span class="date pull-right">' + month + '/' + day + '/' +  year + '</span></h5></li>';
        }
        html += '<hr class="white-divider">';
        html += '</ul></div>';

        var $item = $(html);
        $wrap.packery()
            .append( $item )
            .packery( 'appended', $item );

        $wrap.find('.itinerary').each( makeEachDraggable );

    });

    $( document ).on( 'click', 'button#addItineraryButton', function (e) {
        $('input[name=itinerary-name]').val("");

        picker_since = $('#since').pickadate('picker');
        picker_until = $('#until').pickadate('picker');

        picker_since.clear();
        picker_until.clear();

        $('#itineraryDatesModal').modal('toggle');
    });

    $( document ).on( 'click', '.close', function (e) {
        var id = $(this).parent().attr('id');
        var name = id.slice(10).split('-').join(' ').titleize();

        $.each(itineraries, function(i){
            if (itineraries[i].name === name) {
                itineraries.splice(i, 1);
                return false;
            }
        });

        var elems = $wrap.packery('getItemElements');

        var elem = elems.filter(function( elem ) {
            if (elem.id == id)
                return elem;
        });

        $wrap.packery()
            .packery('remove', elem);

        $wrap.packery();
        $('#' + id).remove();

        window.localStorage["itineraries"] = JSON.stringify(itineraries);
    });

    Date.prototype.addDays = function(days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };

    function getDates(startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push( new ItineraryDate (currentDate) );
            currentDate = currentDate.addDays(1);
        }
        return dateArray;
    }

    String.prototype.titleize = function() {
      var words = this.split(' ');
      var array = [];
      for (var i=0; i<words.length; ++i) {
        array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1));
      }
      return array.join(' ');
    };
});
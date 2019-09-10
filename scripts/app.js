Vue.config.productionTip = false;
var app = new Vue({
    el: '#app',
    data: {
        historicEvents: [],
        activeEvents: [],
        index: 1,
        nextPage: null,
    },
    methods: {
        loadUpcommingEvents: function() {
            var _this = this;
            var endpoint = 'https://api.meetup.com/KaunasPHP/events?callback=?&photo-host=public&has_ended=false&' +
                            'page=20&sign=true';

            $.getJSON(endpoint).success(function(response) {
                response.data.forEach(function(meetupEvent) {
                    var event = {};

                    event.name = meetupEvent.name;
                    event.meetupLink = meetupEvent.link;
                    event.mapUrl = 'https://www.google.com/maps/search/?api=1&query=' +
                        meetupEvent.venue.lat + '%2C'+ meetupEvent.venue.lon;
                    event.place = meetupEvent.venue.name;
                    event.start_time = meetupEvent.local_date + ' ' + meetupEvent.local_time;
                    event.description = meetupEvent.description;

                    _this.activeEvents.push(event);
                });
            });
        },
        loadEvents: function() {
            var _this = this;
            var endpoint = 'https://api.meetup.com/KaunasPHP/events?callback=?&desc=true&photo-host=public&page=100&' +
                'status=past&sign=true';

            $.getJSON(endpoint).success(function(response) {
                if (typeof response.data !== 'undefined' && typeof  response.data.errors === 'undefined') {
                    response.data.forEach(function(meetupEvent) {
                        var event = {};

                        event.name = meetupEvent.name;
                        event.meetupLink = meetupEvent.link;
                        event.shortDescription = meetupEvent.description;

                        event.collapseRef = "collapse" + _this.index;
                        event.collapseRefId = "#collapse" + _this.index;
                        _this.historicEvents.push(event);
                        _this.index++;
                    });
                }
            });
        }
    },
    mounted() {
        this.loadUpcommingEvents();
        this.loadEvents();
    },

});
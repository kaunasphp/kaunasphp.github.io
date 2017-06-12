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
        loadEvents: function() {
            var _this = this;
            var endpoint = _this.nextPage == null ? "https://graph.facebook.com/v2.8/304049543047071/events?access_token=EAAGI8PMAbmoBAMfHLyqWPoxJioBrFEOSqRamO8r2OcPJWcnFt7ZCYQBq456haKKYWALmUvAkZB3YcNwv7NfmPTmUq5H9Y4HBufbZBHFRQ3ZBIin6uyKeFFjOYQot0DfYo29l3lu8EJO1paAzbnnGG9t94xCZCXosZD&limit=10" : _this.nextPage;
            axios.get(endpoint).then(response => {
                var fbEvents = response.data.data;
                fbEvents.forEach(function(fbEvent) {
                    var description = fbEvent.description;
                    var event = {};

                    event.name = fbEvent.name;
                    event.facebookLink = "https://www.facebook.com/events/" + fbEvent.id;
                    event.gitHubLink = "https://github.com/kaunasphp/kaunasphp-meetups/tree/master/" + event.name.replace(".", "").replace(" ", ".");

                    if (new Date(fbEvent.start_time) > new Date()) {
                        event.start_time = fbEvent.start_time.replace("T", " ").substring(0, 16);
                        event.mapUrl = description.substring(description.indexOf("https://goo.gl"), description.length);
                        event.place = description.substring(description.indexOf("Vieta:") + 7, description.indexOf("Žemėlapis:"));
                        // active events
                        event.description = description.replace(/\n/g, '<br />');
                        _this.activeEvents.push(event);
                    } else {
                        // historic events
                        event.shortDescription = description.substring(description.indexOf("Pranešėja"), description.indexOf("Laikas:")).replace(/\n/g, '<br />');
                        event.collapseRef = "collapse" + _this.index;
                        event.collapseRefId = "#collapse" + _this.index;
                        _this.historicEvents.push(event);

                        _this.index++;
                    }
                });

                if (response.data.paging.next != null)
                    _this.nextPage = response.data.paging.next;
                else {
                    _this.nextPage = null;
                    $('#moreResultsButton').hide();
                }
            });
        }
    },
    mounted() {
        this.loadEvents();
    },

});

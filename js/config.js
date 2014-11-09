define([], function() {
    require.config({
        baseURL: '/js',
        paths: {
            // Libs
            'async': 'lib/async', // for google Map
            'jquery': 'lib/jquery-1.11.1',
            'ko': 'lib/knockout-3.0.0',
            'routie': 'lib/routie',
            'ko-external': 'lib/koExternalTemplateEngine-amd',
            'infuser': 'lib/infuser',
            'traffic-cop': 'lib/TrafficCop',

            //bootstrap
            'bootstrap': 'lib/bootstrap',

            //Less
            'less': 'lib/less',
            // google Chart API
            'jsapi': 'lib/jsapi',

            // View-Models
            'rootVM': 'vm/rootVM',
            'profile': 'vm/profile',
            'session': 'vm/session',
            'user': 'vm/user',
            'group': 'vm/group',
            'admin': 'vm/admin',
            'event': 'vm/event',

            // Classes
            'classProfile': 'Classes/classProfile',
            'classUserEvent': 'Classes/classUserEvent',

            // Rest
            'rest_api': 'api/rest_api',

        },
        shim: {
            'jquery': {
                exports: 'jQuery'
            },
            'traffic-cop': {
                deps: ['jquery']
            },
            'infuser': {
                deps: ['jquery', 'traffic-cop'],
                exports: 'infuser'
            },
            'ko-external': {
                deps: ['jquery', 'ko', 'infuser']
            },
            "bootstrap": {
                deps: ['jquery']
            },
        }
    });
});
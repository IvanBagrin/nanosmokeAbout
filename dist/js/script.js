

var REGIONS_DATA = {
    region: {
        title: 'Регион',
        items: [{
            id: '001',
            title: 'Страны мира'
        }]
    },
    lang: {
        title: 'Язык',
        items: [{
            id: 'ru',
            title: 'Русский'
        }]
    },
    quality: {
        title: 'Точность границ',
        items: [{
            id: '0',
            title: '0'
        }]
    }
}

,
// Шаблон html-содержимого макета.
optionsTemplate = [
    // '<div style="line-height: 34px;" id="regions-params">',
    // '{% for paramName, param in data.params %}',
    // '{% for key, value in state.values %}',
    // '{% if key == paramName %}',
    // '<div class="btn-group btn-group-xs">',
    // '<button{% if state.enabled %}{% else %} disabled{% endif %} type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">',
    // '<span>{{ param.title }}</span>',
    // '<span class="value">: {{ value }}</span>',
    // '&nbsp;<span class="caret"></span>',
    // '</button>',
    // '<ul class="dropdown-menu {{ paramName }}">',
    // '{% for item in param.items %}',
    // '<li{% if item.id == value %} class="active"{% endif %}>',
    // '<a id="regions" href="#" data-param="{{ paramName }}" data-id="{{ item.id }}">',
    // '{{ item.title }}',
    // '</a>',
    // '</li>',
    // '{% endfor %}',
    // '</ul>',
    // '</div>&nbsp;',
    // '{% endif %}',
    // '{% endfor %}',
    // '{% endfor %}',
    // '</div>'
].join('');

ymaps.ready(init);

function init() {
// Создадим собственный макет RegionControl.
var RegionControlLayout = ymaps.templateLayoutFactory.createClass(optionsTemplate, {
        build: function () {
            RegionControlLayout.superclass.build.call(this);
            this.handleClick = ymaps.util.bind(this.handleClick, this);
            $(this.getParentElement)
                .on('click', 'a#regions', this.handleClick);
        },
        clear: function () {
            $(this.getParentElement)
                .off('click', 'a#regions', this.handleClick);
            RegionControlLayout.superclass.clear.call(this);
        },
        handleClick: function (e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            console.log($target)
            
            var state = this.getData().state;
            console.log(state.get('values'))
            var newValues = ymaps.util.extend({}, {region: 'RU', lang: 'ru', quality: '0'});
            if (!$target.hasClass('active')) {
                newValues[$target.data('param')] = $target.data('id');
                state.set('values', newValues);
            }
        }
    }),
    // Наследуем класс нашего контрола от ymaps.control.Button.
    RegionControl = ymaps.util.defineClass(function (parameters) {
        RegionControl.superclass.constructor.call(this, parameters);
    }, ymaps.control.Button, /** @lends ymaps.control.Button */{
        onAddToMap: function (map) {
            RegionControl.superclass.onAddToMap.call(this, map);
            this.setupStateMonitor();
            this.loadRegions({region: '001', lang: 'ru', quality: '0'});
        },

        onRemoveFromMap: function (map) {
            map.geoObjects.remove(this.regions);
            this.clearStateMonitor();
            RegionControl.superclass.onRemoveFromMap.call(this, map);
        },

        setupStateMonitor: function () {
            this.stateMonitor = new ymaps.Monitor(this.state);
            this.stateMonitor.add('values', this.handleStateChange, this);
        },

        clearStateMonitor: function () {
            this.stateMonitor.removeAll();
        },

        handleStateChange: function (params) {
            this.loadRegions({region: '	036', lang: 'ru', quality: '0'});
        },

        handleRegionsLoaded: function (res) {
            let country = res.features
            country = country.filter(item => {
                return item.properties.iso3166 == "RU" 
                || item.properties.iso3166 == "UA" 
                || item.properties.iso3166 == "KZ"
                || item.properties.iso3166 == "JP"
                || item.properties.iso3166 == "AZ"
                || item.properties.iso3166 == "AE"
                || item.properties.iso3166 == "KW"
                || item.properties.iso3166 == "TR"
                || item.properties.iso3166 == "BY"
                || item.properties.iso3166 == "CZ"
                || item.properties.iso3166 == "PL"
                || item.properties.iso3166 == "DE"
            })
            res.features = country
            if(this.regions){
                map.geoObjects.remove(this.regions);
            }

            this.regions = new ymaps.ObjectManager();
            this.regions
                .add(res.features.map(function (feature) {
                    feature.id = feature.properties.iso3166;
                    feature.options = {
                        strokeColor: '#ffffff',
                        strokeOpacity: 0.4,
                        fillColor: '#00ADEF',
                        fillOpacity: 0.8,
                        hintCloseTimeout: 0,
                        hintOpenTimeout: 0
                    };
                    return feature;
                }));
                
            map.geoObjects.add(this.regions);
            
            this.selectedRegionId = '';
            this.regions.events
                .add('mouseenter', function (e) {
                    var id = e.get('objectId');
                    this.regions.objects.setObjectOptions(id, {strokeWidth: 2});
                }, this)
                .add('mouseleave', function (e) {
                    var id = e.get('objectId');
                    if (this.selectedRegionId !== id) {
                        this.regions.objects.setObjectOptions(id, {strokeWidth: 1});
                    }
                }, this)
                .add('click', function (e) {
                    var id = e.get('objectId');
                    if (this.selectedRegionId) {
                        this.regions.objects.setObjectOptions(this.selectedRegionId, {
                            strokeWidth: 1,
                            fillColor: '#00ADEF'
                        });
                    }
                    this.regions.objects.setObjectOptions(id, {strokeWidth: 2, fillColor: '#6961b0'});
                    this.selectedRegionId = id;
                }, this);
            // this.getMap().setBounds(
            //     this.regions.getBounds(),
            //     // {checkZoomRange: true}
            // );
            map.setZoom(2);
            let coords= [
                {
                    country: 'Россия',
                    coords: [61, 99]
                },
                {
                    country: 'Япония',
                    coords: [36.37203967248622,139.48256259219917]
                },
                {
                    country: 'Казахстан',
                    coords: [48.259194685638604,66.99239162499998]
                },
                {
                    country: 'ОАЭ',
                    coords: [23.571172673234525,54.057770656249936]
                }, 
                {
                    country: 'Кувейт',
                    coords: [29.311827753621326,47.78965899999998]
                },
                {
                    country: 'Азербайджан',
                    coords: [40.302606081412435,47.106557875]
                },
                {
                    country: 'Украина',
                    coords: [49.278785029426786,31.336178593749928]
                },
                {
                    country: 'Турция',
                    coords: [39.11692985837424,35.18497499999998]
                },
                {
                    country: 'Беларусь',
                    coords: [53.78897008769592,27.977432000000015]
                },
                {
                    country: 'Чехия',
                    coords: [49.820083277936746,15.47499449999997]
                },
                {
                    country: 'Польша',
                    coords: [52.103280550497686,19.134394]
                },
                {
                    country: 'Германия',
                    coords: [51.400605669555,10.454251999999979]
                },
                ]

                coords.forEach(element => {
                    var pl = new ymaps.Placemark(element.coords, {
                        hintContent: element.country,
                        // balloonContent: element.country,
                    }, {
                        // Опции.
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: './js/placemark.svg',
                    // Размеры метки.
                    // iconImageSize: [30, 42],
                    // Смещение левого верхнего угла иконки относительно
                    // её "ножки" (точки привязки).
                    // iconImageOffset: [-5, -38]
                        
                    });
                    map.geoObjects.add(pl);
                });

            
        },

        loadRegions: function (params) {
            let myParam = {region: '001', lang: 'ru', quality: '0'}
            this.disable();
            return ymaps.borders.load(myParam.region, myParam)
                .then(this.handleRegionsLoaded, this)
                .always(this.enable, this);
        }
    }),

    map = new ymaps.Map('map', {
        center: [61, 99],
        zoom: 10,
        controls: ['typeSelector']
    }, {
        typeSelectorSize: 'small'
    }),

    

    // Создадим экземпляр RegionControl.
    regionControl = new RegionControl({
        state: {
            enabled: true,
            values: {
                region: 'RU',
                lang: 'ru',
                quality: '0'
            }
        },
        data: {
            params: REGIONS_DATA
        },
        options: {
            layout: RegionControlLayout
        },
        float: 'left',
        maxWidth: [300]
    });
   
// Добавим контрол на карту.
map.controls.add(regionControl);


// Узнавать о изменениях параметров RegionControl можно следующим образом.
regionControl.events.add('statechange', function (e) {
    console.log(e.get('target').get('values'));
});
}







//------------------


const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },
  
    // And if we need scrollbar
    // scrollbar: {
    //   el: '.swiper-scrollbar',
    // },
  });
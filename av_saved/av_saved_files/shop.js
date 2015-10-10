$(document).ready(function () {
        shops_controller = {
            //====Типы магазинов====
            av_azbuka: '3344710', // Азбука Вкуса (супермаркет)
            av_daily: '3344711', // АВ Daily
            av_enoteca: '4345600',  // АВ Энотека
            av_market: '4572777', // АВ Маркет
            //====Объект карты=====
            map: {
                DEF_MAP_CENTER: [55.765615, 37.620968],
                SPB_MAP_CENTER: [59.940585, 30.293472],
                DEF_MAP_ZOOM: 10,
                DEF_MAP_SHOP_ZOOM: 15,
                DEF_MAP_BEHAVIORS: ['default', 'scrollZoom'],
                map_points: '',
                msk: {
                    collection: '',
                    collectionAvDaily: '',
                    collectionAvMarket: '',
                    collectionClock: '',
                    collectionEnoteca: '',
                    collectionAvEnoteca: '',
                    collectionCafeteria: ''
                },
                spb: {
                    collection: '',
                    collectionAvDaily: '',
                    collectionAvMarket: '',
                    collectionClock: '',
                    collectionEnoteca: '',
                    collectionAvEnoteca: '',
                    collectionCafeteria: ''
                }
            },
            //====Объект магазины=====
            shop: {
                msk: {
                    shops : Array(),
                    av_azbuka: Array(),
                    av_daily: Array(),
                    av_market: Array(),
                    cafeteria: Array(),
                    av_enoteca: Array(),
                    av_avenoteca: Array(),
                    round_the_clock: Array()
                },
                spb: {
                    shops : Array(),
                    av_azbuka: Array(),
                    av_daily: Array(),
                    av_market: Array(),
                    cafeteria: Array(),
                    av_enoteca: Array(),
                    av_avenoteca: Array(),
                    round_the_clock: Array()
                },
            },
            counters: {
                iMsk: 0,
                iSpb: 0
            },
            //создание карты
            create_map: function () {
                myMap = new ymaps.Map('all_shops_map', {
                    center: shops_controller.map.DEF_MAP_CENTER,
                    zoom: shops_controller.map.DEF_MAP_ZOOM,
                    behaviors: shops_controller.map.DEF_MAP_BEHAVIORS
                });
                //Add Zoom
                myMap.controls.add('zoomControl', { left: 5, top: 2 });
            },
            get_shop_data: function () {
                $.ajax({
                    url: '/shops/shop_list_json/',
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    success: function (data) {
                        shops_controller.map.map_points = data.shop_list;
                        shops_controller.map.map_points.map(
                            shops_controller.get_data_collection
                        );
                    }
                });
            },
            get_data_collection: function (point) {
                switch (point.city_id) {
                    case '1055':
                        shops_controller.shop.msk.shops[shops_controller.counters.iMsk] = {};
                        for (var p in point) {
                            shops_controller.shop.msk.shops[shops_controller.counters.iMsk][p] = point[p];
                        }
                        shops_controller.counters.iMsk++;
                        break;
                    case '1056':
                        shops_controller.shop.spb.shops[shops_controller.counters.iSpb] = {};
                        for (var p in point) {
                            shops_controller.shop.spb.shops[shops_controller.counters.iSpb][p] = point[p];
                        }
                        shops_controller.counters.iSpb++;
                        break;
                }
            },
            create_collections: function (region) {
                region.collection = new ymaps.GeoObjectCollection({}, {
                    preset: 'twirl#greenIcon', //все метки зелёные
                    draggable: false // и их нельзя перемещать
                });
                region.collectionClock = new ymaps.GeoObjectCollection({}, {
                    preset: 'twirl#greenIcon', //все метки зелёные
                    draggable: false // и их нельзя перемещать
                });
                region.collectionAvAzbuka = new ymaps.GeoObjectCollection({}, {
                    preset: 'twirl#greenIcon', //все метки зелёные
                    draggable: false // и их нельзя перемещать
                });
                region.collectionEnoteca = new ymaps.GeoObjectCollection({}, {
                    preset: 'twirl#greenIcon', //все метки зелёные
                    draggable: false // и их нельзя перемещать
                });
                region.collectionCafeteria = new ymaps.GeoObjectCollection({}, {
                    preset: 'twirl#greenIcon', //все метки зелёные
                    draggable: false // и их нельзя перемещать
                });
                region.collectionAvDaily = new ymaps.GeoObjectCollection({}, {
                    preset: 'twirl#greenIcon', //все метки зелёные
                    draggable: false // и их нельзя перемещать
                });
                region.collectionAvMarket = new ymaps.GeoObjectCollection({}, {
                    preset: 'twirl#greenIcon', //все метки зелёные
                    draggable: false // и их нельзя перемещать
                });
                region.collectionAvEnoteca = new ymaps.GeoObjectCollection({}, {
                    preset: 'twirl#greenIcon', //все метки зелёные
                    draggable: false // и их нельзя перемещать
                });
            },
            add_map_points: function(shopRegion, mapRegion) {
                for (var i = 0; i < shopRegion.shops.length; i++) {
                    shopRegion.shops[i].icon = {
                        iconImageHref: '/templates/av/img/4.png',
                        iconImageSize: [37, 35],
                        iconImageOffset: [-18, -35]
                    };
                    //Если круглосуточный то добавить в круглосуточные магазины
                    if (shopRegion.shops[i].props.round_the_clock) {
                        shopRegion.round_the_clock.push(shopRegion.shops[i]);
                    }
                    // АВ-дейли
                    if (shopRegion.shops[i].shop_type == shops_controller.av_daily) {
                        shopRegion.av_daily.push(shopRegion.shops[i]);
                        shopRegion.shops[i].icon = {
                         iconImageHref: '/templates/av/img/2.png',
                         iconImageSize: [37, 35],
                         iconImageOffset: [-18, -35]
                         }
                    }
                    // АВ-Маркет (us-105)
                    if (shopRegion.shops[i].shop_type == shops_controller.av_market) {
                        shopRegion.av_market.push(shopRegion.shops[i]);
                        shopRegion.shops[i].icon = {
                         iconImageHref: '/templates/av/img/6.png',
                         iconImageSize: [37, 35],
                         iconImageOffset: [-18, -35]
                         }
                    }
                    // Азбука Вкуса (супермаркеты) (us-105)
                    if (shopRegion.shops[i].shop_type == shops_controller.av_azbuka) {
                        shopRegion.av_azbuka.push(shopRegion.shops[i]);
                        shopRegion.shops[i].icon = {
                         iconImageHref: '/templates/av/img/4.png',
                         iconImageSize: [37, 35],
                         iconImageOffset: [-18, -35]
                         }
                    }
                    // Энотека
                    if (shopRegion.shops[i].shop_type == shops_controller.av_enoteca) {
                        shopRegion.av_enoteca.push(shopRegion.shops[i]);
                        shopRegion.av_avenoteca.push(shopRegion.shops[i]);
                        shopRegion.shops[i].icon = {
                            iconImageHref: '/templates/av/img/3.png',
                            iconImageSize: [37, 35],
                            iconImageOffset: [-18, -35]
                        }
                    }
                    // Если есть энотека то добавить в магазины с энотекой, и только у супермаркетов
                    if (shopRegion.shops[i].props.enoteca && shopRegion.shops[i].shop_type == shops_controller.av_azbuka) {
                        shopRegion.av_avenoteca.push(shopRegion.shops[i]);
                    }
                    // Если имееться кофетерий то добавить в магазины с кофетерием
                    if (shopRegion.shops[i].props.cafeteria) {
                        shopRegion.cafeteria.push(shopRegion.shops[i]);
                    }
                    mapRegion.collection.add(new ymaps.Placemark(shopRegion.shops[i].coords, {
                            balloonContentBody: '' +
                                '<div class="b-address-baloon">' +
                                '<img class="b-address-baloon__photo" src="'+ shopRegion.shops[i].img_shop +'" >' +
                                '<div class="b-address-baloon__address-box">' +
                                '<div class="b-address-baloon__address fs22">' + shopRegion.shops[i].title + '</div>' +
                                '<a class="b-address-baloon__detail-link green_btn" href="' + shopRegion.shops[i].link + '">Подробнее о магазине</a>' +
                                '</div>' +
                                '</div>',
                            hintContent: shopRegion.shops[i].title
                        },
                        shopRegion.shops[i].icon
                    ));
                }
            },
            get_other_collections: function (shopRegion, mapRegion) {
                function addShopToMap(mapCollection, shop) {
                    mapCollection.add(new ymaps.Placemark(shop.coords, {
                        balloonContentBody: '' +
                            '<div class="b-address-baloon">' +
                            '<img class="b-address-baloon__photo" src="'+ shop.img_shop +'" >' +
                            '<div class="b-address-baloon__address-box">' +
                            '<div class="b-address-baloon__address fs22">' + shop.title + '</div>' +
                            '<a class="b-address-baloon__detail-link green_btn" href="' + shop.link + '">Подробнее о магазине</a>' +
                            '</div>' +
                            '</div>  ',
                        hintContent: shop.title
                    }, shop.icon));
                }
                var j;

                for (j = 0; j < shopRegion.round_the_clock.length; j++)
                    addShopToMap(mapRegion.collectionClock, shopRegion.round_the_clock[j]);

                for (j = 0; j < shopRegion.av_daily.length; j++)
                    addShopToMap(mapRegion.collectionAvDaily, shopRegion.av_daily[j]);

                for (j = 0; j < shopRegion.av_market.length; j++)
                    addShopToMap(mapRegion.collectionAvMarket, shopRegion.av_market[j]);

                for (j = 0; j < shopRegion.av_azbuka.length; j++)
                    addShopToMap(mapRegion.collectionAvAzbuka, shopRegion.av_azbuka[j]);

                for (j = 0; j < shopRegion.av_enoteca.length; j++)
                    addShopToMap(mapRegion.collectionEnoteca, shopRegion.av_enoteca[j]);

                for (j = 0; j < shopRegion.cafeteria.length; j++)
                    addShopToMap(mapRegion.collectionCafeteria, shopRegion.cafeteria[j]);

                for (j = 0; j < shopRegion.av_avenoteca.length; j++) {
                    var shopIcon;
                    if(shopRegion.av_avenoteca[j].shop_type == shops_controller.av_enoteca) {
                        shopIcon = shopRegion.av_avenoteca[j].icon;
                    } else {
                        shopIcon = {
                            iconImageHref: '/templates/av/img/1.png',
                            iconImageSize: [37, 35],
                            iconImageOffset: [-18, -35]
                        };
                    }
                    mapRegion.collectionAvEnoteca.add(new ymaps.Placemark(shopRegion.av_avenoteca[j].coords, {
                        balloonContentBody: '' +
                            '<div class="b-address-baloon">' +
                            '<img class="b-address-baloon__photo" src="'+ shopRegion.av_avenoteca[j].img_shop +'" >' +
                            '<div class="b-address-baloon__address-box">' +
                            '<div class="b-address-baloon__address fs22">' + shopRegion.av_avenoteca[j].title + '</div>' +
                            '<a class="b-address-baloon__detail-link green_btn" href="' + shopRegion.av_avenoteca[j].link + '">Подробнее о магазине</a>' +
                            '</div>' +
                            '</div>  ',
                        hintContent: shopRegion.av_avenoteca[j].title
                    }, shopIcon));
                }
            }
        };
        function create_map_list(obj) {
            var yamap_shop = obj.attr('data-yamap_shop').match(/(.*),(.*)/);
            var enoteca = obj.attr('enoteca');
            var shop_type = obj.attr('shop_type');
            var url_img = '/templates/av/img/4.png';
            if(shop_type == shops_controller.av_enoteca){
                url_img = '/templates/av/img/3.png';
            }else if(shop_type == shops_controller.av_daily){
                url_img = '/templates/av/img/2.png';
            }else if(shop_type == shops_controller.av_market){
                url_img = '/templates/av/img/6.png';
            }
            if (yamap_shop == null) {
                console.log('координаты точки не указаны');
            } else {
                var map_center = [ yamap_shop[1], yamap_shop[2] ];
                var map_id = obj.attr('id');
                var myMap = false;
                obj.height(obj.parent().height());
                //$('body').append('<script src="//api-maps.yandex.ru/2.0/?load=package.standard&lang=ru-RU" type="text/javascript"></scri'+'pt>');
                myMap = new ymaps.Map(map_id, {
                    center: map_center,
                    zoom: shops_controller.map.DEF_MAP_SHOP_ZOOM,
                    behaviors: shops_controller.map.DEF_MAP_BEHAVIORS
                });
                //myMap.controls.add('zoomControl', { left: 5, top: 2 });
                ymaps.geocode(map_center.join(','), { results: 1 }).then(function (res) {
                    var hint_content = res.geoObjects.get(0).properties.get('name');
                    myMap.geoObjects.add(new ymaps.Placemark(map_center, {
                        hintContent: hint_content
                    }, {
                        //iconImageHref: '/templates/av/img/pm2dgm.png'd
                        iconImageHref: url_img
                        // Размеры метки.
                        //iconImageSize: [91, 70],
                        // Смещение левого верхнего угла иконки относительно
                        // её "ножки" (точки привязки).
                        //iconImageOffset: [-45, -32]
                    }));
                });
            }
        }
        function create_map_contacts(obj) {
            //пути
            //Главный офис
            var path = {
                "central_office": [
                    {
                        "coords": [55.740477, 37.533932],
                        "text": "Первый вагон из центра, выход в сторону Бородинской панорамы, двигаться по направлению движения автотранспорта по Кутузовскому проспекту."
                    },
                    {
                        "coords": [55.739156, 37.529338],
                        "text": "Пройти мимо «Райффайзен Банка», памятника Гризодубовой, вдоль белого забора до шлагбаума."
                    },
                    {
                        "coords": [55.738696, 37.526913],
                        "text": "Войти в ворота за шлагбаум и идти прямо, держась левее, вдоль четырехэтажного здания, следуя указателям «Азбука Вкуса»."
                    },
                    {
                        "coords": [55.742201, 37.523598],
                        "text": "<p><strong>Центральный офис компании «Азбука Вкуса»</strong></p><p>Кутузовский проспект, 36, стр. 6</p><p>1-й подъезд, 4 этаж</p>"
                    }
                ],
                "central_warehouse": [
                    {
                        "coords": [55.790119, 37.371732],
                        "text": "С МКАД сворачиваете в область и продолжаете движение по трассе до второго съезда на г.Истра (первый съезд по направлению г. Истра, Санкт-Петербург проезжаете прямо)."
                    },
                    {
                        "coords": [55.852577, 36.785747],
                        "text": "После съезда на г. Истра через 300 метров справа поворот на комплекс «Кулон-Истра»."
                    },
                    {
                        "coords": [55.856668, 36.788654],
                        "text": "Гостевой пропуск оформляется по приезду на КПП комплекса. После въезда через КПП на территорию комплекса необходимо проследовать к корп. №6."
                    }
                ]
            };
            var data_yamap_path = obj.attr('data-yamap_path');
            var yamap_path = path[data_yamap_path];
            if (yamap_path == null) {
                return false;
            }
            if (yamap_path.length > 0) {
                var sq_lal = 0;
                var sq_lng = 0;
                var c_lat = 0;
                var c_lng = 0;
                for (var i in yamap_path) {
                    sq_lal += parseFloat(yamap_path[i]['coords'][0]);
                    sq_lng += parseFloat(yamap_path[i]['coords'][1]);
                }
                c_lat = sq_lal / yamap_path.length;
                c_lng = sq_lng / yamap_path.length;
                var map_center = [c_lat, c_lng];
            }
            var map_id = obj.attr('id');
            var myMap = false;
            obj.height(obj.parent().height());
            myMap = new ymaps.Map(map_id, {
                center: map_center,
                zoom: shops_controller.map.DEF_MAP_ZOOM,
                behaviors: shops_controller.map.DEF_MAP_BEHAVIORS
            });
            myMap.controls.add('zoomControl', { left: 5, top: 2 });
            if (data_yamap_path == 'central_warehouse') {
                ymaps.route([
                    { type: 'wayPoint',
                        point: [55.790819, 37.367732]
                    },
                    { type: 'viaPoint',
                        point: [55.851477, 36.791747]
                    },
                    {   type: 'wayPoint',
                        point: [55.856668, 36.788654]
                    }
                ], {
                    mapStateAutoApply: true
                }).then(function (route) {
                    route.getPaths().options.set({
                        // в балуне выводим только информацию о времени движения с учетом пробок
                        balloonContenBodyLayout: ymaps.templateLayoutFactory.createClass('$[properties.humanJamsTime]'),
                        // можно выставить настройки графики маршруту
                        draggable: false,
                        strokeColor: '#4c721e',
                        strokeWidth: 4,
                        strokeStyle: '1 0'
                    });
                    var points = route.getWayPoints();
                    var viaPoints = route.getViaPoints();
                    points.get(0).properties.set({
                        hintContent: yamap_path[0]['text'],
                        balloonContent: yamap_path[0]['text'],
                        iconContent: 1
                    });
                    points.get(1).properties.set({
                        hintContent: yamap_path[2]['text'],
                        balloonContent: yamap_path[2]['text'],
                        iconContent: ' '
                    });
                    points.get(1).options.set({
                        iconImageHref: '/templates/av/img/map_min_point.png',
                        iconImageSize: [42, 32],
                        iconImageOffset: [-21, -15]
                    });
                    viaPoints.get(0).properties.set({
                        hintContent: yamap_path[1]['text'],
                        balloonContent: yamap_path[1]['text']
                    });
                    // добавляем маршрут на карту
                    myMap.geoObjects.add(route);
                });
            } else {
                // Создаем ломаную линию.
                var line_geometry = [];
                for (var i in yamap_path) {
                    line_geometry.push(yamap_path[i]['coords']);
                }
                var polyline = new ymaps.Polyline(line_geometry, {
                }, {
                    draggable: false,
                    strokeColor: '#4c721e',
                    strokeWidth: 4,
                    strokeStyle: '1 0'
                });
                // Добавляем линию на карту.
                myMap.geoObjects.add(polyline);
                // Устанавливаем карте границы линии.
                myMap.setBounds(polyline.geometry.getBounds());
                for (var i in yamap_path) {
                    if (i < yamap_path.length - 1) {
                        var path_index = parseInt(i) + 1;
                        myMap.geoObjects.add(new ymaps.Placemark(yamap_path[i]['coords'], {
                            hintContent: yamap_path[i]['text'],
                            balloonContent: yamap_path[i]['text'],
                            iconContent: path_index
                        }, {}));
                    } else {
                        myMap.geoObjects.add(new ymaps.Placemark(yamap_path[i]['coords'], {
                            hintContent: yamap_path[i]['text'],
                            balloonContent: yamap_path[i]['text']
                        }, {
                            iconImageHref: '/templates/av/img/map_min_point.png',
                            iconImageSize: [42, 32],
                            iconImageOffset: [-21, -15]
                        }));
                    }
                }
            }
        }
        ymaps.ready(function () {
                if($('div').is('#shop_map') || $('div').is('#shop_map_1')){
                    $('div[data-yamap="yamap_shop"]').each(function () {
                        create_map_list($(this));
                    });
                }
                //Создаём карту для контактов
                create_map_contacts($('div#contacts_path_yamap'));
                if ($('#all_shops_map').length) {
                    // Создание экземпляра карты и его привязка к контейнеру с
                    shops_controller.create_map();
                    //Получение данных по магазинам
                    shops_controller.get_shop_data();
                    //создание Коллекций
                    shops_controller.create_collections(shops_controller.map.msk);
                    shops_controller.create_collections(shops_controller.map.spb);
                    //Добавление магазинов в коллекции
                    shops_controller.add_map_points(shops_controller.shop.msk, shops_controller.map.msk);
                    shops_controller.add_map_points(shops_controller.shop.spb, shops_controller.map.spb);
                    //Добавление в другие коллекции
                    shops_controller.get_other_collections(shops_controller.shop.msk, shops_controller.map.msk);
                    shops_controller.get_other_collections(shops_controller.shop.spb, shops_controller.map.spb);
                    //Выводи коллекции на экран
                    var active_city = $('.shops_search_header_city_toggler a.active span').attr('name');

                    var hash = window.location.hash;
                    if(!hash) hash = '#msk';
                    var city = hash.substring(1,4);
                    var shop_type = hash.substring(5);
                    var filter;

                    if(active_city == 'spb' || city == 'spb'){
                        //mergin with master 1.09.14
                        switch (shop_type) {
                            case 'all_time':
                                shops_in_map = shops_controller.map.spb.collectionClock;
                                filter = 'round-the-clock';
                                break;
                            case 'enoteca':
                                shops_in_map = shops_controller.map.spb.collectionEnoteca;
                                filter = 'enoteca';
                                break;
                            case 'av-enoteca':
                                shops_in_map = shops_controller.map.spb.collectionAvEnoteca;
                                filter = 'av-enoteca';
                                break;
                            case 'av-market':
                                shops_in_map = shops_controller.map.spb.collectionAvMarket;
                                filter = 'av-market';
                                break;
                            case 'azbuka':
                                shops_in_map = shops_controller.map.spb.collectionAvAzbuka;
                                filter = 'azbuka';
                                break;
                            default:
                                shops_in_map = shops_controller.map.spb.collection;
                                filter = 'general';
                                break;
                        }
                        //end block
                        myMap.geoObjects.add(shops_in_map);
                        //myMap.setCenter(shops_controller.map.SPB_MAP_CENTER, shops_controller.map.DEF_MAP_ZOOM);
                        myMap.setBounds( shops_in_map.getBounds(), { checkZoomRange: true} );
                        $('div.shop_menu_spb').show();
                        $('div.shop_menu_msk').hide();
                    }else{
                        switch (shop_type) {
                            case 'all_time':
                                shops_in_map = shops_controller.map.msk.collectionClock;
                                filter = 'round-the-clock';
                                    break;
                            case 'enoteca':
                                shops_in_map = shops_controller.map.msk.collectionEnoteca;
                                filter = 'enoteca';
                                    break;
                            case 'av-enoteca':
                                shops_in_map = shops_controller.map.msk.collectionAvEnoteca;
                                filter = 'av-enoteca';
                                    break;
                            case 'av-daily':
                                shops_in_map = shops_controller.map.msk.collectionAvDaily;
                                filter = 'av-daily';
                                    break;
                            case 'av-market':
                                shops_in_map = shops_controller.map.msk.collectionAvMarket;
                                filter = 'av-market';
                                    break;
                            case 'azbuka':
                                shops_in_map = shops_controller.map.msk.collectionAvAzbuka;
                                filter = 'azbuka';
                                    break;
                            default:
                                shops_in_map = shops_controller.map.msk.collection;
                                filter = 'general';
                                    break;
                        }

                        myMap.geoObjects.add(shops_in_map);
                        myMap.setBounds( shops_in_map.getBounds(), { checkZoomRange: true} );
                        //myMap.setCenter(shops_controller.map.DEF_MAP_CENTER, shops_controller.map.DEF_MAP_ZOOM);
                        $('div.shop_menu_msk').show();
                        $('div.shop_menu_spb').hide();
                    }
                    $('.shop_menu_' + city + ' ul.shops_menu').addClass('display_none');
                    $('.shop_menu_' + city + ' ul.shops_menu.' + filter).removeClass('display_none')
                    $('.shops_search_header_city_filters a').removeClass('simple_green_btn');
                    $('.shops_search_header_city_toggler a').removeClass('active');
                    $('.shops_search_header_city_toggler a[href = #'+city+']').addClass('active');
                    $('.shops_search_header_city_filters a[href = '+hash+']').addClass('simple_green_btn');
                }

                 //Переключение городов
                $('[name="spb_link"]').click(function () {
                    $(this).addClass('active');
                    $('[name="msk_link"]').removeClass('active');
                    myMap.geoObjects.remove(shops_controller.map.msk.collection);
                    myMap.geoObjects.add(shops_controller.map.spb.collection);
                    myMap.setBounds( shops_controller.map.spb.collection.getBounds(), { checkZoomRange: true} );
                    $('div.shop_menu_spb').show();
                    $('div.shop_menu_msk').hide();
                     /*cur_city = city_name.trim();
                     reinit_shops_list();*/
                });

                $('[name="msk_link"]').click(function () {
                    $(this).addClass('active');
                    $('[name="spb_link"]').removeClass('active');
                    var name = $(this).find('span').attr('name');
                    myMap.geoObjects.remove(shops_controller.map.spb.collection);
                    myMap.geoObjects.add(shops_controller.map.msk.collection);
                    myMap.setBounds( shops_controller.map.msk.collection.getBounds(), { checkZoomRange: true} );
                    $('div.shop_menu_msk').show();
                    $('div.shop_menu_spb').hide();
                    /*cur_city = city_name.trim();
                    reinit_shops_list();*/
                });
                $('[data-tab-link="map"]').click(function(){
                    $('[data-block-button="'+$(this).data('block')+'"]').click();
                });
                //переключение фильтров
                $('.shops_search_header_city_filters a').click(function () {
                    $('.shops_search_header_city_filters a').removeClass('simple_green_btn');
                    $(this).toggleClass('simple_green_btn');
                    var city = $('.shops_search_header_city_toggler a.active span').attr('name');
                    var filter = $(this).attr('data-prop');
                    $('.shop_menu_' + city + ' ul.shops_menu').addClass('display_none');
                    $('.shop_menu_' + city + ' ul.shops_menu.' + filter).removeClass('display_none')
                    $('.shops_search_map_menu').jScrollPane({mouseWheelSpeed: 25});
                    var bounds;
                    if (city == 'msk') {
                        myMap.geoObjects.remove(shops_controller.map.msk.collection);
                        myMap.geoObjects.remove(shops_controller.map.msk.collectionAvDaily);
                        myMap.geoObjects.remove(shops_controller.map.msk.collectionAvMarket);
                        myMap.geoObjects.remove(shops_controller.map.msk.collectionAvAzbuka);
                        myMap.geoObjects.remove(shops_controller.map.msk.collectionClock);
                        myMap.geoObjects.remove(shops_controller.map.msk.collectionCafeteria);
                        myMap.geoObjects.remove(shops_controller.map.msk.collectionEnoteca);
                        myMap.geoObjects.remove(shops_controller.map.msk.collectionAvEnoteca);
                        switch (filter) {
                            case 'general':
                                myMap.geoObjects.add(shops_controller.map.msk.collection);
                                bounds = shops_controller.map.msk.collection;
                                break;
                            case 'round-the-clock' :
                                myMap.geoObjects.add(shops_controller.map.msk.collectionClock);
                                bounds = shops_controller.map.msk.collectionClock;
                                break;
                            case 'cafeteria':
                                myMap.geoObjects.add(shops_controller.map.msk.collectionCafeteria);
                                bounds = shops_controller.map.msk.collectionCafeteria;
                                break;
                            case 'enoteca':
                                myMap.geoObjects.add(shops_controller.map.msk.collectionEnoteca);
                                bounds = shops_controller.map.msk.collectionEnoteca;
                                break;
                            case 'av-enoteca':
                                myMap.geoObjects.add(shops_controller.map.msk.collectionAvEnoteca);
                                bounds = shops_controller.map.msk.collectionAvEnoteca;
                                break;

                            case 'av-daily':
                                myMap.geoObjects.add(shops_controller.map.msk.collectionAvDaily);
                                bounds = shops_controller.map.msk.collectionAvDaily;
                                break;
                            case 'av-market':
                                myMap.geoObjects.add(shops_controller.map.msk.collectionAvMarket);
                                bounds = shops_controller.map.msk.collectionAvMarket;
                                break;
                            case 'azbuka':
                                myMap.geoObjects.add(shops_controller.map.msk.collectionAvAzbuka);
                                bounds = shops_controller.map.msk.collectionAvAzbuka;
                                break;
                            case 'av-enoteca':
                                myMap.geoObjects.add(shops_controller.map.msk.collectionAvEnoteca);
                                break;
                        }
                        myMap.setBounds( bounds.getBounds(), { checkZoomRange: true} );
                        //myMap.setCenter(shops_controller.map.DEF_MAP_CENTER, shops_controller.map.DEF_MAP_ZOOM);
                    } else {
                        myMap.geoObjects.remove(shops_controller.map.spb.collection);
                        myMap.geoObjects.remove(shops_controller.map.spb.collectionClock);
                        myMap.geoObjects.remove(shops_controller.map.spb.collectionAvDaily);
                        myMap.geoObjects.remove(shops_controller.map.spb.collectionAvMarket);
                        myMap.geoObjects.remove(shops_controller.map.spb.collectionAvAzbuka);
                        myMap.geoObjects.remove(shops_controller.map.spb.collectionCafeteria);
                        myMap.geoObjects.remove(shops_controller.map.spb.collectionEnoteca);
                        myMap.geoObjects.remove(shops_controller.map.spb.collectionAvEnoteca);
                        switch (filter) {
                            case 'general':
                                myMap.geoObjects.add(shops_controller.map.spb.collection);
                                bounds = shops_controller.map.spb.collection;
                                break;
                            case 'round-the-clock' :
                                myMap.geoObjects.add(shops_controller.map.spb.collectionClock);
                                bounds = shops_controller.map.spb.collectionClock;
                                break;
                            case 'cafeteria':
                                myMap.geoObjects.add(shops_controller.map.spb.collectionCafeteria);
                                bounds = shops_controller.map.spb.collectionCafeteria;
                                break;
                            case 'enoteca':
                                myMap.geoObjects.add(shops_controller.map.spb.collectionEnoteca);
                                bounds = shops_controller.map.spb.collectionEnoteca;
                                break;
                            case 'av-market':
                                myMap.geoObjects.add(shops_controller.map.spb.collectionAvMarket);
                                bounds = shops_controller.map.spb.collectionAvMarket;
                                break;
                            case 'azbuka':
                                myMap.geoObjects.add(shops_controller.map.spb.collectionAvAzbuka);
                                bounds = shops_controller.map.spb.collectionAvAzbuka;
                                break;
                            case 'av-enoteca':
                                myMap.geoObjects.add(shops_controller.map.spb.collectionAvEnoteca);
                                bounds = shops_controller.map.spb.collectionAvEnoteca;
                                break;
                        }
                        myMap.setBounds( bounds.getBounds(), { checkZoomRange: true} );
                        //myMap.setCenter(shops_controller.map.SPB_MAP_CENTER, shops_controller.map.DEF_MAP_ZOOM);
                    }
                });
                $('.shops_menu_item').click(function () {
                    if (!$(this).hasClass('active')) {
                        $('.shops_menu_item').removeClass('active');
                        var shop_id = $(this).attr('shop-id');
                        $(this).addClass('active');
                        var city = $('.shops_search_header_city_toggler a.active span').attr('name');
                        if (city == 'msk') {
                            for (var i = 0; i < shops_controller.shop.msk.shops.length; i++) {
                                if (shops_controller.shop.msk.shops[i].shop_id == shop_id) {
                                    myMap.setCenter(shops_controller.shop.msk.shops[i].coords, 15);
                                    return false;
                                }
                            }
                        } else {
                            for (var i = 0; i < shops_controller.shop.spb.shops.length; i++) {
                                if (shops_controller.shop.spb.shops[i].shop_id == shop_id) {
                                    myMap.setCenter(shops_controller.shop.spb.shops[i].coords, 15);
                                    return false;
                                }
                            }
                        }
                    } else {
                    }
                });
            }
        );
    }
);
import $ from 'jquery';
import mapboxgl from 'mapbox-gl';
import MapboxPopupControl from '../dist/index';
import '../css/styles.css';

$(function(){
    const map = new mapboxgl.Map({
        container: 'map',
        // style: 'mapbox://styles/mapbox/streets-v11',
        style:'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json',
        center: [35.87063, -1.08551],
        zoom: 12,
        hash:true,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const popup = new MapboxPopupControl([
        'meter',
        'flow meter',
        'valve',
        'washout',
        'firehydrant',
        'tank',
        'pipeline'
    ])

    map.addControl(popup);
})
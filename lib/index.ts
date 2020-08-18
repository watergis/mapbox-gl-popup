import { IControl, Map as MapboxMap, Popup } from "mapbox-gl";

export default class MapboxPopupControl implements IControl{

  private controlContainer: HTMLElement | undefined;
  private popupButton: HTMLButtonElement | undefined;
  private map?: MapboxMap;

  constructor(private targets: string[] = []){}
  
  createPopup(e: any){
    let coordinates = e.lngLat;
    const f = e.features[0];
    if (f.geometry.type === 'Point'){
        coordinates = f.geometry.coordinates.slice();
    }
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    if (!this.map){return};

    new Popup().setLngLat(coordinates)
    .setHTML(`<table class="mapboxgl-popup-table">${Object.keys(f.properties).map(k=>{return `<tr><th>${k.replace(/_/g,' ').replace(/-/g,' ')}</th><td>${f.properties[k]}</td></tr>`;}).join('')}</table>`)
    .setMaxWidth("400px")
    .addTo(this.map);
  }

  onAdd(map: MapboxMap): HTMLElement{
    this.map = map;
    if (this.targets.length>0){
      this.targets.forEach(l=>{map.on('click', l, this.createPopup.bind(this));});
    }
    //Below button is just dummy for the control.
    this.controlContainer = document.createElement('div');
    this.controlContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    Object.assign(this.controlContainer, { style: 'display:none' });
    this.popupButton = document.createElement('button');
    this.popupButton.className = 'mapboxgl-ctrl-icon';
    this.popupButton.type = 'button';
    this.controlContainer.appendChild(this.popupButton);
    return this.controlContainer;
  }

  onRemove(): void {
    if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.popupButton){
      return;
    }
    this.controlContainer.parentNode.removeChild(this.controlContainer);
    this.map = undefined;
  }
}
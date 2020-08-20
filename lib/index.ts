import { IControl, Map as MapboxMap, Popup, LngLat } from "mapbox-gl";

class PopupManager{
  private popup: Popup | null;
  private contents: string[];

  constructor(private map: MapboxMap){
    this.contents = [];
  }

  add(lnglat: LngLat, feature: any, layer:string){
    let html = `
    <div class="mapboxgl-popup-layer-name">${layer}</div>
    <div class="mapboxgl-popup-panel_area"><table class="mapboxgl-popup-table">
    ${Object.keys(feature.properties).map(k=>{
      return `<tr><th class="mapboxgl-popup-th">${k.replace(/_/g,' ').replace(/-/g,' ')}</th><td class="mapboxgl-popup-td">${feature.properties[k]}</td></tr>`;
    }).join('')}
    </table></div>`;
    this.contents.push(html);

    let mainContent: string;
    if (this.contents.length === 1){
      mainContent = this.contents[0];
    }else{
      // mainContent = this.contents[0];
      mainContent = `
      <div class="mapboxgl-popup-tab_wrap">
      ${this.contents.map(s=>{
        let index = this.contents.indexOf(s)+ 1;
        let checked = (index===0)?'checked':'';
        return `<input id="mapboxgl-popup-tab${index}" type="radio" name="tab_btn" ${checked}>`
      }).join('')}
      <div class="mapboxgl-popup-tab_area">
      ${this.contents.map(s=>{
        let index = this.contents.indexOf(s) + 1;
        return `<label class="mapboxgl-popup-tab${index}_label" for="mapboxgl-popup-tab${index}">${index}</label>`
      }).join('')}
      </div>
      <div class="mapboxgl-popup-panel_area">
      ${this.contents.map(s=>{
        let index = this.contents.indexOf(s)+ 1;
        return `<div id="mapboxgl-popup-panel${index}" class="mapboxgl-popup-tab_panel">${s}</div>`
      }).join('')}
      </div>
     </div>`
    }

    if (!this.popup){
      this.popup = new Popup().setLngLat(lnglat)
      .setHTML(mainContent)
      .setMaxWidth("400px")
      .addTo(this.map);
    }else{
      this.popup.setHTML(mainContent)
    }
    if (this.contents.length>1){
      const tab1:HTMLInputElement=<HTMLInputElement>document.getElementById('mapboxgl-popup-tab1');
      tab1.checked=true;
    }
    var this_ = this;
    this_.popup?.on('close', function(){
      this_.popup = null;
      this_.contents = [];
    });
  }
}

export default class MapboxPopupControl implements IControl{

  private controlContainer: HTMLElement | undefined;
  private popupButton: HTMLButtonElement | undefined;
  private map?: MapboxMap;
  private popupManager?: PopupManager;

  constructor(private targets: string[] = []){}
  
  createPopup(e: any, layer:string){
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
    
    this.popupManager?.add(coordinates, f, layer);
  }

  onAdd(map: MapboxMap): HTMLElement{
    this.map = map;
    this.popupManager = new PopupManager(this.map);
    if (this.targets.length>0){
      const this_ = this;
      this.targets.forEach(l=>{map.on('click', l, function(e:any){
        this_.createPopup(e, l);
      });});
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
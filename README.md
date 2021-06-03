# mapbox-gl-popup
![](https://github.com/watergis/mapbox-gl-popup/workflows/Node.js%20Package/badge.svg)
![GitHub](https://img.shields.io/github/license/watergis/mapbox-gl-popup)

This module adds popup control which can show attributes of targeted layers to mapbox-gl

## Installation:

```bash
npm i @watergis/mapbox-gl-popup --save
```

## Demo:

Try [codesandbox](https://codesandbox.io/s/mapbox-gl-popup-y8xs9).

See [demo](https://watergis.github.io/mapbox-gl-popup).

## Test:

```
npm run build
npm start
```

open [http://localhost:8080](http://localhost:8080).

## Usage:

```ts
import { MapboxPopupControl } from "mapbox-gl-popup";
import { Map as MapboxMap } from "mapbox-gl";

import "mapbox-gl-popup/css/styles.css";

const map = new MapboxMap();
map.addControl(new MapboxPopupControl([
  'targeted sourceLayer name'
]));
```

Specify your sourceLayer name which you want to show popup for attributes of layer.

If you don't provide a list of layers, the control will not enable popup function.

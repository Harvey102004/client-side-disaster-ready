import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    function control(options?: any): any;
    function osrmv1(): any;

    interface IRoute {
      name: string;
      coordinates: L.LatLng[];
      summary: { totalDistance: number; totalTime: number };
      inputWaypoints: L.Routing.Waypoint[];
      waypoints: L.Routing.Waypoint[];
      instructions: any[];
    }

    interface Waypoint {
      latLng: L.LatLng;
      name?: string;
    }

    interface Control extends L.Control {
      getPlan(): any;
    }
  }
}

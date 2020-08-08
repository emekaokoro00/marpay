import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  constructor() {}

  directions(
    pickUpAddress: string,
    dropOffAddress: string
  ): Observable<any> {
    const request: any = {
      origin: pickUpAddress,
      destination: dropOffAddress,
      travelMode: 'DRIVING'
    };
    const directionsService = new google.maps.DirectionsService();
    return Observable.create(observer => {
      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          observer.next(result);
        } else {
          observer.error('Enter two valid addresses.');
        }
        observer.complete();
      });
    });
  }


  reverseGeocode(lat: number, lng: number): Observable<any> {
       // reverse geocode address
       let geocoder = new google.maps.Geocoder();
       // let latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
       let latlng = { lat: lat, lng: lng};
       let request = { 'location': latlng }; 

       return Observable.create(observer => {
	       geocoder.geocode(request, (results, status) => {
		  if (status == google.maps.GeocoderStatus.OK) {
		    if (results[0] != null) {
		      //this.address = results[0].formatted_address;
		      observer.next(results);
		    } else { 
		      //this.address = "";
                      observer.error('');
		    }
                    observer.complete();
		  }
	       });
       })
  }


}
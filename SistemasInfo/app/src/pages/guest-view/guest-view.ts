import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ReportsPage } from '../reports/reports';

@IonicPage()
@Component({
  selector: 'page-guest-view',
  templateUrl: 'guest-view.html',
})
export class GuestViewPage {


  items: any;

  elements: any = [];
  element: any = [];
  newData: any = [];
  departureData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public http: HttpClient) {
    //controlador del menu lateral
    this.menuCtrl.enable(true, 'rightMenu');

    //Obtener elementos primero 
    this.http.get("http://172.10.20.194/IonicApp/json_read.php").subscribe(data => {
      this.elements = data;

      this.element = [

      ];

      for (let i = 1; i <= this.elements.length; i++) {
        //empujar datos al array
        var item2 = { expandable: false }
        this.element.push(item2)

        console.log(this.element);
      }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuestViewPage');
    this.generateNewJson();
  }

  ionViewWillEnter() {
    this.generateNewJson();
  }

  generateNewJson() {
    this.getData();
    this.getDataDeparture();
    console.log(this.elements.length);

    for (let i = 0; i <= this.elements.length - 1; i++) {
        if (this.elements[i].codigo == this.departureData[i].codigo) {
            var entradas = parseInt(this.elements[i].cantidad);
            var salidas = parseInt(this.departureData[i].Total);

            var nuevo = (entradas - salidas);

            this.newData.push({
                cantidad: nuevo,
                descripcion: this.elements[i].descripcion,
                codigo: this.elements[i].codigo,
                creado: this.elements[i].created_at,
                id: this.elements[i].id,
                nivel: this.elements[i].nivel,
                pasillo: this.elements[i].pasillo,
                rack: this.elements[i].rack,
                proveedor: this.elements[i].provedor,
                nombre: this.elements[i].nombre,
            })

        } else {
            console.log("Error generando JSON dinamico");
        }
    }
}

  getData() {
    this.http.get("http://172.10.20.194/IonicApp/json_read.php").subscribe(data => {
      this.elements = data;
      console.log(data);
    }, err => {
      console.log(err);
    });
  }

  //Obtener Datos
  getDataDeparture() {
    this.http.get("http://172.10.20.194/IonicApp/json_read_departures.php").subscribe(data2 => {
        this.departureData = data2;
        console.log(data2);
    }, err => {
        console.log(err);
    })
}

  expandItem(element) {

    this.elements.map((listItem) => {

      if (element == listItem) {
        listItem.expanded = !listItem.expanded;
      } else {
        listItem.expanded = false;
      }

      return listItem;

    });

  }

  

  refresh(refresher) {
    console.log("Empieza Refresh", refresher);
    this.getData();

    setTimeout(() => {
      console.log("Termina Refresh");
      refresher.complete();
    }, 2000);
  }

  gotoReport(){
    this.navCtrl.push(ReportsPage);
  }

}

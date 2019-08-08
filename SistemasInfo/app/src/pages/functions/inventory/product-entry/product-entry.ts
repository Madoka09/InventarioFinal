import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-product-entry',
  templateUrl: 'product-entry.html',
})
export class ProductEntryPage {

  nombre: any;
  codigo: any;
  cantidad: any;
  id: any;
  providerData: any = [];

  oldCantidad: any;

  incomeCount: any;

  datearr: any = [];
  todayDate: any;

  dia: any;
  mes: any;
  year: any;


  @ViewChild("nuevaCantidad") nuevaCantidad;
  @ViewChild("proveedor") proveedor;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, public alertCtrl: AlertController,
    public loading: LoadingController, public toast: ToastController,
    private httpC: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductEntryPage');
  }

  ngOnInit() {
    //Parametros a Mostrar
    this.nombre = this.navParams.get('nombre');
    this.codigo = this.navParams.get('codigo');
    this.id = this.navParams.get('id');

    //Parametros viejos
    this.oldCantidad = this.navParams.get('cantidad');

    //Inicializar Fecha
    this.todayDate = new Date();
  }

  ionViewWillEnter(){
    //Obtener informacion de los proveedores
    this.getProviders();
  }

  doMath() {
    let result = (parseInt(this.oldCantidad) + parseInt(this.nuevaCantidad.value));
    this.cantidad = result;
    console.log(this.cantidad);

  }

  getProviders(){
    this.httpC.get("http://172.10.20.194/IonicApp/json_fetch_providers.php").subscribe(data =>{
      this.providerData = data;
      console.log(data)
    }, err => {
      console.log(err)
    })
  }

  generateEntry() {
    //Obtener cantidades
    this.doMath();

    //Recibir informacion
    parseInt(this.nuevaCantidad.value);

    //Comprobar los campos
    if (this.nuevaCantidad.value == "" || this.nuevaCantidad.value == String) {
      let alert = this.alertCtrl.create({
        title: "Atención",
        message: "No especificó la cantidad ó el valor es invalido",
        buttons: ['OK']
      });
      alert.present();
    } else if (this.nuevaCantidad.value == 0) {
      let alert = this.alertCtrl.create({
        title: "Atención",
        message: "No puede realizar una entrada por 0",
        buttons: ['OK']
      });
      alert.present();
    } else {
      var headers = new Headers();

      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });

      let data = {
        nombre: this.nombre,
        codigo: this.codigo,
        newCantidad: this.nuevaCantidad.value,
        proveedor: this.proveedor.value,
        id: this.id,
        fecha: (this.todayDate.getFullYear() + '-' + ((this.todayDate.getMonth() + 1)) + '-' + this.todayDate.getDate() + ' ' +this.todayDate.getHours() + ':' + this.todayDate.getMinutes()+ ':' + this.todayDate.getSeconds())
      };

      let loader = this.loading.create({
        content: "Procesando Solicitud..."
      });

      loader.present().then(() => {
        this.http.post('http://172.10.20.194/IonicApp/json_entry_stock.php', data, options)
          .map(res => res.json())
          .subscribe(res => {

            loader.dismiss()
            if (res == "success") {
              this.showToast("Entrada Realizada con Éxito");
              this.navCtrl.popToRoot();
            } else {
              this.showToast("Error Fatal, contacte al desarrollador");
            }
          });
      });
    }
  }

  showToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}

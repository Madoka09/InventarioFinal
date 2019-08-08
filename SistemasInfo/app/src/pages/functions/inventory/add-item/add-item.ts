import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html',
})
export class AddItemPage {
  //Variables en que se guardan los elementos en formato JSON recibidos
  element: any = {};
  elements: any = [];

  //Variables para insertar elemento nuevo
  username: any = [];
  providers: any = [];
  date: any;
  todayDate: any;
  incomeCount: any;
  
  @ViewChild('dateVal') dateVal;
  @ViewChild('nombre') nombre;
  @ViewChild('codigo') codigo;
  @ViewChild('descripcion') desc;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController, public http: Http, public httpC: HttpClient,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemPage');
    //Obtener usuarios en JSON al Inicio
    this.getUsers();

    //Obtener Proveedores en JSON al inicio
    this.getProviders();

    //Obtener lista de stock al inicio
    this.getStock();

    //Inicializar Fecha
  }

  //Metodo para insertar elemento nuevo en la base de datos
  add() {
    this.element.action = "insertItem";
    this.http.post("http://172.10.20.194/IonicApp/post_one.php", this.element).subscribe(data => {
      console.log(data);
      let result = JSON.parse(data["_body"]);
      if (result.status == "success") {
        this.showToast("Insertado con Exito");
        this.navCtrl.popToRoot();
      }
      else {
        this.showToast("Error fatal, contacte al desarrollador , Porfavor");
      }
    }, err => {
      console.log(err);
    });
  }

  //Comprobar Campos
  checkValues() {
    if (this.nombre.value == "" ) {
      let alert = this.alertCtrl.create({
        title: "Atención",
        message: "Debe especificar un nombre",
        buttons: ['OK']
      });
      alert.present();
    } else if(this.codigo.value == "") {
      let alert = this.alertCtrl.create({
        title: "Atención",
        message: "Debe especificar un nombre",
        buttons: ['OK']
      });
      alert.present()
    } else if(this.desc.value == ""){
      let alert = this.alertCtrl.create({
        title: "Atención",
        message: "Debe especificar una descripción",
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.add();
    }
  }
  

  //Obtener lista de usuarios para elemento desplegable "Añadido Por:"
  getUsers() {
    this.httpC.get("http://172.10.20.194/IonicApp/json_fetch_user.php").subscribe(userData => {
      this.username = userData;
      console.log(userData);
    }, err => {
      console.log(err);
    });
  }

  //Obtener lista de proveedores para elemento: "Proveedor"
  getProviders() {
    this.httpC.get("http://172.10.20.194/IonicApp/json_fetch_providers.php").subscribe(providerData => {
      this.providers = providerData;
      console.log(providerData);
    }, err => {
      console.log(err);
    });
  }

  //Obtener todo el stock disponible al momento
  getStock(){
    this.httpC.get("http://172.10.20.194/IonicApp/json_read.php").subscribe(stockData =>{
      this.elements = stockData;
      console.log(stockData);
    }, err => {
      console.log(err);
    })
  }

  //Funcion para invocar una notificacion del tipo Toast, el mensaje se declara al momento de usar
  showToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}

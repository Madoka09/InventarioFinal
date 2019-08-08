import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { DeleteUserPage } from '../delete-user/delete-user';
import { RegisterPage } from '../functions/users/register-user/register-user';
import { AddItemPage } from '../functions/inventory/add-item/add-item';
import { DeparturesPage } from '../departures/departures';
import { HomePage } from '../inventory-view/inventory-view';
import { SearchphysicalPage } from '../searchphysical/searchphysical';
import { ProvidersPage } from '../providers/providers';
import { ReportsPage } from '../reports/reports';
import { MultipleDeparturePage } from '../multiple-departure/multiple-departure';

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin-view.html',
})
export class AdminPage {

  //Variable para establecer pagina de inicio de la vista de administrador
  viewSwitch: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController) {
    //Controlador de menú, sirve para mostrar el menú deslizante del lado derecho, para cerrar sesión
    this.menuCtrl.enable(true, 'rightMenu');

    //Users por defecto
    this.viewSwitch = "users";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  /*
    Metodos para cambiar de vista, son llamados desde el maquetado HTML, mediante
    el evento (tap) de cada tarjeta
  */
  deleteUser() {
    this.navCtrl.push(DeleteUserPage);
  }

  createUser() {
    this.navCtrl.push(RegisterPage);
  }

  newPiece() {
    this.navCtrl.push(AddItemPage);
  }

  departures() {
    this.navCtrl.push(DeparturesPage);
  }

  inventory() {
    this.navCtrl.push(HomePage);
  }

  add() {
    this.navCtrl.push(AddItemPage);
  }


  searchPhysical(){
    this.navCtrl.push(SearchphysicalPage);
  }

  providerManagement(){
    this.navCtrl.push(ProvidersPage);
  }

  generateReport(){
    this.navCtrl.push(ReportsPage);
  }

  multipleDeparture(){
    this.navCtrl.push(MultipleDeparturePage);
  }

}

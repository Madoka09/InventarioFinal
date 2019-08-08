import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-generateqr',
  templateUrl: 'generateqr.html',
})
export class GenerateqrPage {
  pdfObj = null;

  element: any;
  QrCodeVar: any;
  stringQuery: any;
  qr: any;
  imgValue: any;

  nombre: any;
  codigo: any;
  proveedor: any;
  pasillo: any;
  rack: any;
  nivel: any;

  @ViewChild("nuevoNombre") nuevoNombre;
  @ViewChild("qrcode") qrcode;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public loading: LoadingController, public toast: ToastController,
    private plt: Platform, private file: File, private fileOpener: FileOpener) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad GenerateqrPage');
  }

  ngAfterViewInit() {
    this.imgValue = (this.qrcode.nativeElement.childNodes[1].childNodes[0].toDataURL());
  }


  ngOnInit() {
    this.nombre = this.navParams.get('nombre');
    this.codigo = this.navParams.get('codigo');
    this.proveedor = this.navParams.get('proveedor');
    this.pasillo = this.navParams.get('pasillo');
    this.rack = this.navParams.get('rack');
    this.nivel = this.navParams.get('nivel');

    this.QrCodeVar = this.navParams.get('nombre');

    this.stringQuery = this.nombre + "|" + this.codigo;
    console.log(this.stringQuery);

  }

  print() {
    var docDefinition = {
      pageSize: 'A6',
      content: [
        {
          columns: [
            { width: 'auto',
              table:{
                body:[
                  [{ text: `${this.nombre}`, alignment: 'left'}],
                  [{ text: `Codigo: ${this.codigo}`, alignment: 'left'}],
                  [{ text: `Proveedor: ${this.proveedor}`, alignment: 'left'}],
                  [{ text: `Pasillo: ${this.pasillo}`, alignment: 'left'}],
                  [{ text: `Rack: ${this.rack}`, alignment: 'left'}],
                  [{ text: `Nivel: ${this.nivel}`, alignment: 'left'}],
                ]                
              }
            },
            {
              width: 'auto',
              table:{
                headerRows: 1,
                body: [
                  [{ image: this.imgValue, width: 138, height: 138}],
                ]
              }
            },
            //{ width: '*', text: '' }
          ]
        }

      ]
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }


  downloadPDF() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        //Guardar el PDF al directorio "data" de la App
        this.file.writeFile(this.file.dataDirectory, 'QRlabel.pdf', blob, { replace: true }).then(fileEntry => {
          //Abrir el PDF con androide
          this.fileOpener.open(this.file.dataDirectory + 'QRlabel.pdf', 'application/pdf');
        });
      });
    } else {
      //si es el navegador, descargala
      this.pdfObj.download();
    }
  }



}

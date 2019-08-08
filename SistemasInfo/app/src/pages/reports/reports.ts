import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
  pdfObjS = null;
  pdfObjD = null;
  //Elementos a iterar
  elements: any;
  //Arrays para construccion de headers en tabla
  nombre: any = [];
  cantidad: any = [];
  codigo: any = [];
  pasillo: any = [];
  rack: any = [];
  nivel: any = [];
  //Variable temporal para creacion de headers
  jsonExplo: any;
  //Valores de la tabla
  columns: any = [];
  valuesStock: any = [];
  valuesDepart: any = [];
  barsData: any = [];

  departureData: any = [];
  newData: any = [];

  //Grafica
  barChart: any;
  chartVal: any = [];
  chartLabels: any = [];
  bgColor: any = [];
  borderColor: any = [];

  @ViewChild('barCanvas') barCanvas;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient,
    public alertCtrl: AlertController,
    public loading: LoadingController, public toast: ToastController,
    private plt: Platform, private file: File, private fileOpener: FileOpener) {
  }

  ngOnInit(){
    this.generateArrayBars();
  }

  barChartMethod(dataU, labelU, borderC, backgC){
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labelU,
        datasets: [{
          label: 'Productos',
          data: dataU,
          backgroundColor: backgC,
          borderColor: borderC,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  ionViewDidLoad() {
    //Obtener informacion al cargar la vista
    this.getData();
    this.getDataDeparture();

  }

  ionViewWillEnter() {
    //Obtener informacion al regresar a la vista
    this.getData();
    this.getDataDeparture();

  }

  getData() {
    this.http.get("http://172.10.20.194/IonicApp/json_read.php").subscribe(data => {
      this.elements = data;
    }, err => {
      console.log(err)
    })
  }

  getDataDeparture() {
    this.http.get("http://172.10.20.194/IonicApp/json_read_departures.php").subscribe(data2 => {
      this.departureData = data2;      
      console.log(data2);
    }, err => {
      console.log(err);
    })
  }

  generateArrayBars() {
    //Obtener elementos de salidas
    this.http.get("http://172.10.20.194/IonicApp/json_read_departures.php").subscribe(data2 => {
      this.departureData = data2;      
      for (let h = 0; h <= this.departureData.length - 1; h++){
        //Introducir total individual a array
        this.chartVal.push(this.departureData[h].Total);
      }
      for (let k = 0; k <= this.departureData.length - 1; k++){
        //Convertir valores individuales de array a enteros
        var barsValues = parseInt(this.chartVal[k]);

        //Problar array
        this.barsData.push(barsValues);

        //Iterar array de etiquetas de grafica
        this.chartLabels.push(this.departureData[k].nombre)
        let colorCounter = 99;

        //Array con colores de fondo para grafica
        this.bgColor.push('rgba(255,' + (colorCounter + k*1.3) + ', 132, 0.2)');

        //Array con colores de borde para grafica
        this.borderColor.push('rgba(255,'+ (colorCounter + k*1.3) + ',132,1)');
      }
      console.log(data2);
      //Funcion para crear grafica
      this.barChartMethod(this.barsData, this.chartLabels, this.borderColor, this.bgColor);
    }, err => {
      console.log(err);
    })
  }

  generateNewJson() {
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
          nombre: this.elements[i].nombre

        })

      } else {
        console.log("Error Obteniendo Resultados");
      }
    }
    for (let i of this.newData) {
      this.nombre.push(i.nombre);
      this.cantidad.push(i.cantidad);
      this.codigo.push(i.codigo);
      this.pasillo.push(i.pasillo);
      this.rack.push(i.rack);
      this.nivel.push(i.nivel);
    }
    console.log(this.jsonExplo);
  }

  //creador de contenido dinamico para el PDF
  insertColsStock() {
    //Insertar encabezado de la tabla
    this.valuesStock.push(
      [
        { text: 'Articulo' },
        { text: 'Cantidad' },
        { text: 'Codigo' },
        { text: 'Pasillo' },
        { text: 'Rack' },
        { text: 'Nivel' }
      ]
    );
    //Insertar contenidos de la tabla
    for (let k = 0; k <= this.elements.length - 1; k++) {
      this.valuesStock.push(
        [
          { text: this.nombre[k] },
          { text: this.cantidad[k] },
          { text: this.codigo[k] },
          { text: this.pasillo[k] },
          { text: this.rack[k] },
          { text: this.nivel[k] }
        ]
      );
    }
    console.log(this.valuesStock);
  }

  insertColsDepart() {
    this.valuesDepart.push(
      [
        {text: 'Articulo'},
        {text: 'Cantidad'},
        {text: 'Codigo'},
      ]
    );

    for (let l = 0; l <= this.elements.length - 1; l++) {
      this.valuesDepart.push(
        [
          { text: this.departureData[l].nombre },
          { text: this.departureData[l].Total },
          { text: this.departureData[l].codigo },
        ]
      );
    }
  }

  generatePDFStock() {
    if (this.plt.is('cordova')) {
      this.pdfObjS.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' })

        //Guardar el PDF al directorio "data" de la app
        this.file.writeFile(this.file.dataDirectory, 'Stock.pdf', blob, { replace: true }).then(fileEntry => {
          //Abrir el PDF con android
          this.fileOpener.open(this.file.dataDirectory + "Stock.pdf", 'application/pdf');
        });
      });
    } else {
      //si es en navegador, descargar
      this.pdfObjS.download();
    }
  }

  generatePDFDeparture() {
    if (this.plt.is('cordova')) {
      this.pdfObjD.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' })

        //Guardar el PDF al directorio "data" de la app
        this.file.writeFile(this.file.dataDirectory, 'Salidas.pdf', blob, { replace: true }).then(fileEntry => {
          //Abrir el PDF con android
          this.fileOpener.open(this.file.dataDirectory + "Salidas.pdf", 'application/pdf');
        });
      });
    } else {
      //si es en navegador, descargar
      this.pdfObjD.download();
    }
  }

  //Invocar Loader antes de imprimir
  callStock() {
    this.generateNewJson();
    let loader = this.loading.create({
      content: "Generando Reporte...",
    });
    loader.present().then(() => {
      this.printStock();
    });
    loader.dismiss();
    this.showToast("Reporte Creado con Exito");
  }

   //Invocar Loader antes de imprimir
   callDeparture() {
    this.getDataDeparture();
    let loader = this.loading.create({
      content: "Generando Reporte...",
    });
    loader.present().then(() => {
      this.printDeparture();
    });
    loader.dismiss();
    this.showToast("Reporte Creado con Exito");
  }


  printStock() {
    //Construir array para crear la tabla, contiene el body completo
    this.insertColsStock();

    //Crear PDF para impresion
    var docDefiniton = {
      content: [
        { text: 'REPORTE DE STOCK', style: 'header', alignment: 'center' },
        { text: 'Fecha: ' + new Date().toLocaleDateString('ddMMyyyy'), alignment: 'right', style: 'date' },

        { lineHeight: 2, text: 'Firma de Enterado: ____________________________________________', alignment: 'left'},
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                headerRows: 1,
                body: this.valuesStock,
              }
            },
            { width: '*', text: '' }
          ]
        }
      ]
    }
    this.pdfObjS = pdfMake.createPdf(docDefiniton);
  }

  printDeparture() {
    this.insertColsDepart();

    //Crear PDF para impresion
    var docDefinition = {
      content: [
        { text: 'REPORTE DE SALIDAS', style: 'header', alignment: 'center'},
        { text: 'Fecha: ' + new Date().toLocaleDateString('ddMMyyyy'), alignment: 'right', style: 'date' },
        { lineHeight: 2, text: 'Firma de Enterado: ____________________________________________', alignment: 'left'},
        {
          columns: [
            { width: '*', text: ''},
            {
              width: 'auto',
              table: {
                headerRows: 1,
                body: this.valuesDepart,
              }
            },
            { width: '*', text: ''}
          ]
        }
      ]
    }
    this.pdfObjD = pdfMake.createPdf(docDefinition);
  }

  showToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}

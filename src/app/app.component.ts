import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { ConsumirDatosService } from './services/consumir-datos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Ejercicio Tecnico';

  public bloqueado: boolean = true;
  public ocultarBotonConsultar: boolean = false;
  public ocultarBotones: boolean = true;
  public ocultarBotonGuardar: boolean = true;
  public error: boolean = true;
  public mensaje: string = '';
  public danger: string = '';


  public departamentos: any[] = [];
  public clases: any[] = [];
  public familia: any[] = []
  public date = new Date();


  public registerFrom = this.fb.group({
    sku: ['', Validators.maxLength(6)],
    descontinuado: [{ value: false, disabled: this.bloqueado }],
    articulo: [{ value: '', disabled: this.bloqueado }],
    marca: [{ value: '', disabled: this.bloqueado }],
    modelo: [{ value: '', disabled: this.bloqueado }],
    id_departamento: [{ value: '', disabled: this.bloqueado }],
    id_clase: [{ value: '', disabled: this.bloqueado }],
    id_familia: [{ value: '', disabled: this.bloqueado }],
    stock: [{ value: '', disabled: this.bloqueado }],
    cantidad: [{ value: '', disabled: this.bloqueado }],
    fecha_alta: [{ value: this.fecha_actual(), disabled: this.bloqueado }],
    fecha_baja: [{ value: '1900-01-01', disabled: this.bloqueado }]
  });

  constructor(private consumirDatosService: ConsumirDatosService,
    private fb: FormBuilder) { }

  ngOnInit() {


    this.registerFrom.get('id_departamento')?.valueChanges
      .pipe(
        tap(() => this.registerFrom.get('id_clase')?.reset('')),
        switchMap(id => this.consumirDatosService.buscar_clase(id))
      ).subscribe({
        next: (clase: any) => this.clases = clase.result
      })


    this.registerFrom.get('id_clase')?.valueChanges
      .pipe(
        tap(() => {
          this.familia = [];
          this.registerFrom.get('id_familia')?.reset('')
        }),
        switchMap(id => this.consumirDatosService.buscar_familia(id))
      ).subscribe({
        next: (familia: any) => this.familia = familia.result
      })

    this.registerFrom.get('descontinuado')?.valueChanges.subscribe({
      next: valor => {
        if (valor === true) {
          this.registerFrom.get('fecha_baja')?.enable();
        }
        else {
          this.registerFrom.get('fecha_baja')?.disable();
          this.registerFrom.get('fecha_baja')?.setValue('1900-01-01');
        }
      }
    });

  }

  getDatos() {
    this.consumirDatosService.buscar_departamentos().subscribe({
      next: (resp: any) => this.departamentos = resp.result,
      error: err => console.log(err)
    });
  }

  buscador() {
    this.bloqueado = false;
    const text = this.registerFrom.get('sku')?.value;

    if (text.trim() === '') {
      this.bloqueado = true;
      this.registerFrom.get('departamento')?.enabled;
      this.registerFrom.get('clase')?.enabled;
      this.registerFrom.get('familia')?.enabled;
      return;
    }

    this.consumirDatosService.buscar_dato(text).subscribe({
      next: (resp: any) => {

        // console.log(resp.result.length)
        this.getDatos();
        if (resp.result.length != 0) {
          let continuado = true;
          this.ocultarBotonConsultar = true
          this.ocultarBotones = false;
          this.ocultarBotonGuardar = true;
          this.registerFrom.get('articulo')?.enable();
          this.registerFrom.get('descontinuado')?.enable();
          this.registerFrom.get('marca')?.enable();
          this.registerFrom.get('modelo')?.enable();
          this.registerFrom.get('id_departamento')?.enable();
          this.registerFrom.get('id_clase')?.enable();
          this.registerFrom.get('id_familia')?.enable();
          this.registerFrom.get('stock')?.enable();
          this.registerFrom.get('cantidad')?.enable();
          this.registerFrom.get('fecha_alta')?.enable();
          const { sku, descontinuado, articulo, marca, modelo, id_departamento, id_clase, id_familia, stock, cantidad, fecha_alta, fecha_baja } = resp.result[0];

          console.log(resp.result[0]);

          if (descontinuado === 1) {
            continuado = true;
          } else {
            continuado = false;
          }

          this.registerFrom.setValue({
            sku: sku, descontinuado: continuado, articulo: articulo, marca: marca, modelo: modelo, id_departamento: id_departamento,
            id_clase: id_clase, id_familia: id_familia, stock: stock, cantidad: cantidad, fecha_alta: this.fecha(fecha_alta), fecha_baja: this.fecha(fecha_baja)
          });

        } else {
          this.getDatos();
          this.ocultarBotonConsultar = true;
          this.ocultarBotonGuardar = false;
          this.registerFrom.get('articulo')?.enable();
          this.registerFrom.get('descontinuado')?.enable();
          this.registerFrom.get('marca')?.enable();
          this.registerFrom.get('modelo')?.enable();
          this.registerFrom.get('id_departamento')?.enable();
          this.registerFrom.get('id_clase')?.enable();
          this.registerFrom.get('id_familia')?.enable();
          this.registerFrom.get('stock')?.enable();
          this.registerFrom.get('cantidad')?.enable();
          this.registerFrom.get('fecha_alta')?.enable();
        }
      },
      error: err => console.log(err)
    });
  }

  guardar_producto() {
    this.consumirDatosService.ingresar_producto(this.registerFrom.getRawValue()).subscribe({
      next: (result: any) => {
        console.log(result);
        this.danger = 'alert alert-success text-center'
        this.error = false;
        this.mensaje = result.msg;
        setTimeout(() => {
          this.limpiarTodo();
          this.error = true;
        }, 2000);
      },
      error: err => {
        console.log(err.error.msg);
        this.error = false;
        this.mensaje = err.error.msg;
        this.danger = 'alert alert-danger text-center'
      }
    });
  }

  actualizar() {

    this.consumirDatosService.actualizar_producto(this.registerFrom.getRawValue()).subscribe({
      next: (result: any) => {
        console.log(result);
        this.danger = 'alert alert-success text-center'
        this.error = false;
        this.mensaje = result.msg;
        setTimeout(() => {
          this.limpiarTodo();
          this.error = true;
        }, 2000);
      },
      error: err => {
        console.log(err.error.msg);
        this.error = false;
        this.mensaje = err.error.msg;
        this.danger = 'alert alert-danger text-center'
      }
    })

  }

  eliminar() {
    if (confirm('Deseas eliminar este producto')) {
      console.log(this.registerFrom.getRawValue());
      this.consumirDatosService.eliminar_producto(this.registerFrom.getRawValue()).subscribe({
        next: (result: any) => {
          console.log(result);
          this.danger = 'alert alert-success text-center'
          this.error = false;
          this.mensaje = result.msg;
          setTimeout(() => {
            this.limpiarTodo();
            this.error = true;
          }, 2000);
        },
        error: err => {
          console.log(err.error.msg);
          this.error = false;
          this.mensaje = err.error.msg;
          this.danger = 'alert alert-danger text-center'
        }
      });
    }
  }


  limpiarTodo() {
    this.registerFrom.reset();
    this.registerFrom.get('fecha_alta')?.setValue(this.fecha_actual());
    this.registerFrom.get('fecha_baja')?.setValue('1900-01-01');
    this.registerFrom.get('id_departamento')?.setValue('');
    this.registerFrom.get('articulo')?.disable();
    this.registerFrom.get('descontinuado')?.disable();
    this.registerFrom.get('marca')?.disable();
    this.registerFrom.get('modelo')?.disable();
    this.registerFrom.get('id_departamento')?.disable();
    this.registerFrom.get('id_clase')?.disable();
    this.registerFrom.get('id_familia')?.disable();
    this.registerFrom.get('stock')?.disable();
    this.registerFrom.get('cantidad')?.disable();
    this.registerFrom.get('fecha_alta')?.disable();
    this.registerFrom.get('fecha_baja')?.disable();
    this.ocultarBotones = true;
    this.ocultarBotonConsultar = false;
    this.ocultarBotonGuardar = true;

  }


  fecha(fecha: string) {
    return fecha.split('T')[0];
  }

  fecha_actual() {
    let fecha_ = this.date.toLocaleDateString('es-US').split('/');
    return `${fecha_[2]}-${fecha_[1]}-${fecha_[0]}`
  }
}
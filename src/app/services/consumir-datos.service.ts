import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsumirDatosService {

  constructor(private http: HttpClient) { }

  buscar_departamentos() {
    return this.http.get('http://localhost:3000/api/buscar_datos')
  }

  buscar_clase(id: number) {
    return this.http.post('http://localhost:3000/api/buscar_datos/clase', { id: id })
  }

  buscar_familia(id: number) {
    return this.http.post('http://localhost:3000/api/buscar_datos/familia', { id: id });
  }


  buscar_dato(sku: string) {
    return this.http.post('http://localhost:3000/api/buscar_datos/consulta_producto', { sku: sku });
  }

  ingresar_producto(datos: any) {
    return this.http.post('http://localhost:3000/api/buscar_datos/agregar_producto', datos);
  }

  actualizar_producto(datos: any) {
    return this.http.post('http://localhost:3000/api/buscar_datos/actualizar_producto', datos);
  }

  eliminar_producto(datos: any) {
    return this.http.post('http://localhost:3000/api/buscar_datos/eliminar_producto', datos);
  }

}

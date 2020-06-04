import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/products';
import Swal from 'sweetalert2';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
@Component({
  selector: 'app-preview-products',
  templateUrl: './preview-products.component.html',
  styleUrls: ['./preview-products.component.css'],
  providers: [ProductsService],
})
export class PreviewProductsComponent implements OnInit {
  id: String;
  product: Product;
  file: File;
  updateProductForm: FormGroup;
  photoSelected: string | ArrayBuffer;
  pricePattern = /[0-9]/;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    public fb: FormBuilder
  ) {
    this.updateProductForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(7),
          Validators.pattern(this.pricePattern),
        ],
      ],
      inputImage: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this.productService.getProduct(this.id).subscribe(
        (res) => {
          this.product = res;
          this.updateProductForm.controls['description'].setValue(
            res.description
          );
          this.updateProductForm.controls['name'].setValue(res.name);
          this.updateProductForm.controls['price'].setValue(res.price);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }
  //Eliminamos producto
  deleteProduct(id: String) {
    console.log('SE PRESIONO ELIMINAR');
    this.productService.deleteProduct(id).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/home']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  resetForm(form?: FormGroup) {
    if (form) {
      form.reset();
    }
  }
  //VALIDA SI LO QUE ESTOY INGRESANDO SON NUMEROS O LETRAS
  onPriceIntroduced(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    if (!this.pricePattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  onPhotoSelected(event: HtmlInputEvent): void {
    if (event.target.files && event.target.files) {
      this.file = <File>event.target.files[0];
      //Image Preview
      const reader = new FileReader();
      reader.onload = (e) => (this.photoSelected = reader.result);
      reader.readAsDataURL(this.file);
    }
  }

  updateProduct(id: String) {
    console.log('SE PRESIONO actualizar');
    console.log(this.file);
    console.log(this.updateProductForm.value);
    console.log(this.product);
    this.productService
      .updateProduct(id, this.updateProductForm.value, this.file)
      .subscribe(
        (res) => {
          this.resetForm(this.updateProductForm);
          Swal.fire({
            title: 'Actualizacion exitosa!',
            text: 'Juego actualizado correctamente',
            icon: 'success',
            confirmButtonColor: '#6c5ce7',
          });
          this.router.navigate(['/home']);
        },
        (err) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Algo salio mal',
            text: 'No pudimos agregar el juego',
            confirmButtonColor: '#6c5ce7',
          });
        }
      );
  }
}
import { Component } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { Subject } from 'rxjs';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public static updateUserStatus: Subject<boolean> = new Subject();
  user: any;
  constructor(public authService: AuthService) {
    AppComponent.updateUserStatus.subscribe(res => {
      this.traerDatos();
    })
  }

  ngOnInit() {
    this.traerDatos();
  }

  traerDatos(){
    this.user = {
      id:this.authService.decodeToken().id,
      email:this.authService.decodeToken().email,
      nombre_usuario:this.authService.decodeToken().nombre_usuario,
      rol:this.authService.decodeToken().rol
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {UploadService} from '../services/upload.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-fichier',
  templateUrl: './upload-fichier.component.html',
  styleUrls: ['./upload-fichier.component.css']
})
export class UploadFichierComponent implements OnInit {

  fichier: File = null;

  constructor(private uploadService: UploadService, private snack: MatSnackBar) { }

  ngOnInit(): void {
  }

  getFile(event) {
    this.fichier = event.target.files.item(0);
  }

  upload() {
    this.uploadService.uploadFile(this.fichier).subscribe(() => {
      this.snack.open('Fichier envoyé. Les modifications seront effectives dans quelques instants. Vous devrez actualiser pour appliquer ces changements.', 'X', {
        panelClass: 'bg-success',
        duration: 0,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }, () => {
      this.snack.open('Erreur lors de l\'envoi du fichier', 'X', {
        panelClass: 'bg-danger',
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  }
}

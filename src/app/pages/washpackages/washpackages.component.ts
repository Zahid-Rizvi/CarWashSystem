import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WashPackageService } from '../../core/washpackage.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-wash-packages',
  standalone: true,
  imports: [CommonModule,NavbarComponent,FooterComponent],
  templateUrl: './washpackages.component.html',
  styleUrls: ['./washpackages.component.scss']
})
export class WashPackagesComponent implements OnInit {
  washPackages: any[] = [];

  constructor(private washPackageService: WashPackageService) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.washPackageService.getAllWashPackages().subscribe({
      next: (res) => this.washPackages = res,
      error: (err) => console.error(err)
    });
  }
}

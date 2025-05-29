import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { FooterComponent } from '../../layout/footer/footer.component';
// import { ServicesService, WashPackage, AddOn } from '../../core/services.service';
import { WashPackageService,WashPackage } from '../../core/washpackage.service';
import { AddOnService,AddOn } from '../../core/addon.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  washPackages: WashPackage[] = [];
  addOns: AddOn[] = [];
  loading = false;
  errorMessage = '';

  constructor(private washPackageService: WashPackageService, private addOnService: AddOnService) { }

  ngOnInit(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      washPackages: this.washPackageService.getAllWashPackages(),
      addOns: this.addOnService.getAllAddOns()
    }).subscribe({
      next: ({ washPackages, addOns }) => {
        this.washPackages = washPackages;
        this.addOns = addOns;
      },
      error: () => {
        this.errorMessage = 'Failed to load services';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

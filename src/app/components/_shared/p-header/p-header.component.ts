import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../services/site.service';
import { $ } from 'protractor';

@Component({
  selector: 'app-p-header',
  templateUrl: './p-header.component.html',
  styleUrls: ['./p-header.component.css']
})
export class PHeaderComponent implements OnInit {

  constructor(private site: SiteService) { }

  ngOnInit() {
    
  }

  collapseAria() {
    
  }
}

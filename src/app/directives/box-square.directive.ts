import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appBoxSquare]'
})
export class BoxSquareDirective implements OnInit {

  @HostListener('window:resize') onresize() {
    this.setStyle();
  }

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.setStyle();
  }

  setStyle() {
    let nativeElement = this.el.nativeElement;
    let width = nativeElement.offsetWidth;
    let height = nativeElement.offsetHeight;
    if (width) {
      nativeElement.style.height = width + 'px';
    } else {
      nativeElement.style.width = height + 'px';
    }
  }

}

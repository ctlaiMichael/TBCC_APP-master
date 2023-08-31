import { Component, OnInit, Input, ViewChild, ElementRef, HostListener  } from '@angular/core';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.css']
})
export class IframeComponent implements OnInit {
    
    @Input() offsetHeight: number;
    @Input() src: string;
    @ViewChild("frame") frameElement: ElementRef;
    
    containerMinWidth: number = 0;
    containerMinHeight: number = 0;
    containerWidth: number = this.containerMinWidth;
    containerHeight: number = this.containerMinHeight;

    ngOnInit() {
        this.onResize(window.innerWidth, window.innerHeight - this.offsetHeight);
    }

    @HostListener("window:resize", ["$event.target.innerWidth", "$event.target.innerHeight"])
    onResize(width: number, height: number): void {
        let top = this.frameElement.nativeElement.offsetTop;
        let left = this.frameElement.nativeElement.offsetLeft;

        this.containerWidth = Math.max(width - left, this.containerMinWidth);
        this.containerHeight = Math.max(height - top, this.containerMinHeight);
    }

}

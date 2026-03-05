import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: 'input[type="number"]',
})
export class NoScrollInputDirective {

    @HostListener('wheel', ['$event'])
    onWheel(event: Event) {
        event.preventDefault();
    }

}
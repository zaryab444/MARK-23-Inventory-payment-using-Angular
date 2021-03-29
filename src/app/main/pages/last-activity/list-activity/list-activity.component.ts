import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from "@angular/core";
import { LastActivityService } from "../last-activity.service";

@Component({
    selector: "app-list-activity",
    templateUrl: "./list-activity.component.html",
    styleUrls: ["./list-activity.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ListActivityComponent implements OnInit {
    @Input() data: any;
    @Output() fetchMore = new EventEmitter<any>();
    public ActivityLogs: any;
    public Acitivity = [];
    public loadedAll: boolean = false;
    constructor(private readonly _activityLog: LastActivityService) {}

    ngOnInit(): void {
        this._activityLog.activeChange.subscribe((res) => {
            if (res) {
                console.log(res);
            }
        });
        // window.addEventListener("scroll", this.scroll, true); //third parameter
        if (this.data) {
            this.ActivityLogs = this.data.ActivityLogs;
            this.Acitivity.push(this.data.ActivityLogs);
        }
    }
    // scroll = (event): void => {
    //     console.log("caca");
    //     this.detectBottom();
    //     //handle your scroll here
    //     //notice the 'odd' function assignment to a class field
    //     //this is used to be able to remove the event listener
    // };
    detectBottom(): void {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            if (!this.loadedAll) {
                this.fetchMore.emit(true);
            }
        }
    }
}

module objects {
    // MouseControls Class +++++++++++++++
    export class MouseControls {
        // PUBLIC INSTANCE VARIABLES +++++++++
        public sensitivity: number;
        public yaw: number; // look left an right - y-axis
        public pitch: number;// look up and down - x-axis
        public enabled: boolean;
        // CONSTRUCTOR +++++++++++++++++++++++
        constructor() {
            this.sensitivity = 0.1;
            this.yaw = 0;
            this.pitch = 0;
            this.enabled = false;
            
            document.addEventListener('mousemove', this.OnMouseMove.bind(this), false);
        }
        
        //Public Methods
        public OnMouseMove(event: MouseEvent):void{
            this.yaw = -event.movementX * this.sensitivity;
            
            this.pitch = -event.movementY * this.sensitivity * 0.1;
        }
    }
}
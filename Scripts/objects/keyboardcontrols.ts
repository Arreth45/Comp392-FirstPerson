module objects {
    // KeyboardControls Class +++++++++++++++
    export class KeyboardControls {
        // PUBLIC INSTANCE VARIABLES ++++++++++++
        public moveFoward: boolean;
        public moveBackward: boolean;
        public moveLeft: boolean;
        public moveRight: boolean;
        public jump: boolean;
        public enabled : boolean;

        // CONSTRUCTOR ++++++++++++++++++++++++++    
        constructor() {
            this.enabled =false;
            document.addEventListener('keydown', this.onKeyDown.bind(this), false);
            document.addEventListener('keyup', this.onKeyUp.bind(this), false);
        }

       
        //public Methods
        public onKeyDown(event: KeyboardEvent): void {
            switch (event.keyCode) {
                case 38: //up arrow
                case 87: //W keyCode
                    this.moveFoward = true;
                    break;
                case 37: //left arrow
                case 65: //A keyCode
                    this.moveLeft = true;
                    break;
                case 40: //Down arrow
                case 83: //S keyCode
                    this.moveBackward = true;
                    break;
                case 39: //Right arrow
                case 68: //D keyCode
                    this.moveRight = true;
                    break;
                case 32: // spacebar
                    this.jump = true;
                    break
            }
        }

        public onKeyUp(event: KeyboardEvent): void {
            switch (event.keyCode) {
                case 38: //up arrow
                case 87: //W keyCode
                    this.moveFoward = false;
                    break;
                case 37: //left arrow
                case 65: //A keyCode
                    this.moveLeft = false;
                    break;
                case 40: //Down arrow
                case 83: //S keyCode
                    this.moveBackward = false;
                    break;
                case 39: //Right arrow
                case 68: //D keyCode
                    this.moveRight = false;
                    break;
                case 32: //spacebar
                    this.jump = false;
                    break
            }
        }
    }
}
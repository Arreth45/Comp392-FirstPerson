/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = Physijs.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var Material = THREE.Material;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var CScreen = config.Screen;
var Clock = THREE.Clock;
var LineBasic = THREE.LineBasicMaterial;
var Line = THREE.Line;
// Setup a Web Worker for Physijs DON'T TOUCH
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";
// setup an IIFE structure (Immediately Invoked Function Expression)
var game = (function () {
    // declare game objects
    var havePointerLock;
    var element;
    var clock;
    var scene = new Scene(); // Instantiate Scene Object
    var renderer;
    var camera;
    var stats;
    var blocker;
    var instructions;
    var spotLight;
    var groundGeometry;
    var groundMaterial;
    var ground;
    var playerGeometry;
    var playerMaterial;
    var player;
    var sphereGeometry;
    var sphereMaterial;
    var sphere;
    var keyboardControls;
    var isgrounded;
    var velocity = new Vector3(0, 0, 0);
    var prevTime = 0;
    var mouseControls;
    var directionLineMaterial;
    var directionLineGeomerty;
    var directionLine;
    var direction;
    //main wall
    var wallGeometry;
    var wallMaterial;
    var frontWall;
    var backWall;
    var leftWall;
    var rightWall;
    var wall1;
    var wall2;
    var wall3;
    var wall4;
    var wall5;
    var hazardGeometry;
    var hazardMaterial;
    var hazard1;
    var hazard2;
    var hazard3;
    var hazard4;
    var hazard5;
    var goalGeometry;
    var goalMaterial;
    var goal;
    // var assets: createjs.LoadQueue;
    var canvas;
    var stage;
    var liveslabel;
    var livesValue;
    function setupCanvas() {
        canvas = document.getElementById("canvas");
        canvas.setAttribute("width", config.Screen.WIDTH.toString());
        canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
        canvas.style.backgroundColor = "#000000";
        stage = new createjs.Stage(canvas);
    }
    function setupScoreBoard() {
        //init score and lives
        livesValue = 5;
        //lives Label
        liveslabel = new createjs.Text("LIVES: " + livesValue, "40px Consolas", "#ffffff");
        liveslabel.x = config.Screen.WIDTH * 0.1;
        liveslabel.y = (config.Screen.HEIGHT * 0.15) * 0.2;
        stage.addChild(liveslabel);
        console.log("Added Lives Label to Stage");
    }
    function init() {
        // Create to HTMLElements
        blocker = document.getElementById("blocker");
        instructions = document.getElementById("instructions");
        setupCanvas();
        setupScoreBoard();
        //check to see if pointerlock is supported
        havePointerLock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
        //instantate game Controls
        keyboardControls = new objects.KeyboardControls();
        mouseControls = new objects.MouseControls();
        direction = new Vector3(0, 0, 0);
        //Check to see if we have pointer lock
        if (havePointerLock) {
            element = document.body;
            instructions.addEventListener('click', function () {
                //ask the user for pointer lock
                console.log("Requesting PointerLock");
                element.requestPointerLock = element.requestPointerLock ||
                    element.mozRequestPointerLock ||
                    element.webkitRequestPointerLock;
                element.requestPointerLock();
            });
            document.addEventListener('pointerlockchange', pointerLockChange);
            document.addEventListener('mozpointerlockchange', pointerLockChange);
            document.addEventListener('webkitpointerlockchange', pointerLockChange);
            document.addEventListener('pointerlockerror', pointerLockError);
            document.addEventListener('mozpointerlockerror', pointerLockError);
            document.addEventListener('webkitpointerlockerror', pointerLockError);
        }
        //scene changes for Physijs
        scene.name = "Main";
        scene.fog = new THREE.Fog(0xffffff, 0, 750);
        scene.setGravity(new THREE.Vector3(0, -10, 0));
        scene.addEventListener('update', function () {
            scene.simulate(undefined, 2);
        });
        clock = new Clock();
        setupRenderer(); // setup the default renderer
        setupCamera(); // setup the camera
        // Spot Light
        spotLight = new SpotLight(0xffffff);
        spotLight.position.set(0, 40, 0);
        spotLight.castShadow = true;
        spotLight.intensity = 2;
        spotLight.lookAt(new Vector3(0, 0, 0));
        spotLight.shadowCameraNear = 2;
        spotLight.shadowCameraFar = 200;
        spotLight.shadowCameraLeft = -5;
        spotLight.shadowCameraRight = 5;
        spotLight.shadowCameraTop = 5;
        spotLight.shadowCameraBottom = -5;
        spotLight.shadowMapWidth = 2048;
        spotLight.shadowMapHeight = 2048;
        spotLight.shadowDarkness = 0.5;
        spotLight.name = "Spot Light";
        scene.add(spotLight);
        console.log("Added spotLight to scene");
        //Ground
        groundGeometry = new BoxGeometry(32, 1, 32);
        groundMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xe75d14 }), 0, 0);
        ground = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
        ground.receiveShadow = true;
        ground.name = "Ground";
        scene.add(ground);
        console.log("Added Burnt Ground to scene");
        //Outer Walls
        wallGeometry = new BoxGeometry(32, 5, 1);
        wallMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff00ff }), 0, 0);
        backWall = new Physijs.BoxMesh(wallGeometry, wallMaterial, 0);
        backWall.position.set(0, 3, -16);
        backWall.receiveShadow = true;
        backWall.name = "wall";
        scene.add(backWall);
        wallGeometry = new BoxGeometry(32, 5, 1);
        wallMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff00ff }), 0, 0);
        frontWall = new Physijs.BoxMesh(wallGeometry, wallMaterial, 0);
        frontWall.position.set(0, 3, 16);
        frontWall.receiveShadow = true;
        frontWall.name = "wall";
        scene.add(frontWall);
        wallGeometry = new BoxGeometry(1, 5, 32);
        wallMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff00ff }), 0, 0);
        rightWall = new Physijs.BoxMesh(wallGeometry, wallMaterial, 0);
        rightWall.position.set(16, 3, 0);
        rightWall.receiveShadow = true;
        rightWall.name = "wall";
        scene.add(rightWall);
        wallGeometry = new BoxGeometry(1, 5, 32);
        wallMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff00ff }), 0, 0);
        leftWall = new Physijs.BoxMesh(wallGeometry, wallMaterial, 0);
        leftWall.position.set(-16, 3, 0);
        leftWall.receiveShadow = true;
        leftWall.name = "wall";
        scene.add(leftWall);
        //Actual Maze
        wallGeometry = new BoxGeometry(16, 5, 1);
        wallMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff00ff }), 0, 0);
        wall1 = new Physijs.BoxMesh(wallGeometry, wallMaterial, 0);
        wall1.position.set(8, 3, -12);
        wall1.receiveShadow = true;
        wall1.name = "wall";
        scene.add(wall1);
        wall2 = new Physijs.BoxMesh(wallGeometry, wallMaterial, 0);
        wall2.position.set(-8, 3, -8);
        wall2.receiveShadow = true;
        wall2.name = "wall";
        scene.add(wall2);
        wall3 = new Physijs.BoxMesh(wallGeometry, wallMaterial, 0);
        wall3.position.set(8, 3, -4);
        wall3.receiveShadow = true;
        wall3.name = "wall";
        scene.add(wall3);
        wall4 = new Physijs.BoxMesh(wallGeometry, wallMaterial, 0);
        wall4.position.set(-8, 3, 0);
        wall4.receiveShadow = true;
        wall4.name = "wall";
        scene.add(wall4);
        wall5 = new Physijs.BoxMesh(wallGeometry, wallMaterial, 0);
        wall5.position.set(8, 3, 4);
        wall5.receiveShadow = true;
        wall5.name = "wall";
        scene.add(wall5);
        //"electric hazards"
        hazardGeometry = new BoxGeometry(1, 2, 8);
        hazardMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xffff00 }), 0, 0);
        hazard1 = new Physijs.BoxMesh(hazardGeometry, hazardMaterial, 0);
        hazard1.position.set(0.5, 1, -12);
        hazard1.receiveShadow = true;
        hazard1.name = "hazard";
        scene.add(hazard1);
        hazard2 = new Physijs.BoxMesh(hazardGeometry, hazardMaterial, 0);
        hazard2.position.set(0.5, 1, -8);
        hazard2.receiveShadow = true;
        hazard2.name = "hazard";
        scene.add(hazard2);
        hazard3 = new Physijs.BoxMesh(hazardGeometry, hazardMaterial, 0);
        hazard3.position.set(0.5, 1, -4);
        hazard3.receiveShadow = true;
        hazard3.name = "hazard";
        scene.add(hazard3);
        hazard4 = new Physijs.BoxMesh(hazardGeometry, hazardMaterial, 0);
        hazard4.position.set(0.5, 1, 0);
        hazard4.receiveShadow = true;
        hazard4.name = "hazard";
        scene.add(hazard4);
        hazard5 = new Physijs.BoxMesh(hazardGeometry, hazardMaterial, 0);
        hazard5.position.set(0.5, 1, 4);
        hazard5.receiveShadow = true;
        hazard5.name = "hazard";
        scene.add(hazard4);
        //End Goal
        goalGeometry = new BoxGeometry(4, 1, 4);
        goalMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff0000 }), 0, 0);
        goal = new Physijs.BoxMesh(goalGeometry, goalMaterial, 0);
        goal.position.set(15, 1, -15);
        goal.name = "goal";
        scene.add(goal);
        //Player Object
        playerGeometry = new BoxGeometry(2, 2, 2, 2, 2, 2);
        playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
        player = new Physijs.BoxMesh(playerGeometry, playerMaterial, 1);
        player.position.set(0, 5, 10);
        player.receiveShadow = true;
        player.castShadow = true;
        player.name = "Player";
        scene.add(player);
        console.log("Added Player to Scene");
        player.addEventListener('collision', function (event) {
            if (event.name === "Ground") {
                console.log("Hit Ground");
                isgrounded = true;
            }
            if (event.name === "Sphere") {
                console.log("Hit Sphere");
            }
            if (event.name === "hazard") {
                livesValue -= 1;
                liveslabel.text = "Lives: " + livesValue;
            }
            if (event.name === "goal") {
                console.log("Hit goal");
                scene.remove(player);
                player.position.set(0, 5, 10);
                scene.add(player);
            }
        });
        directionLineMaterial = new LineBasic({ color: 0xffff00 });
        directionLineGeomerty = new Geometry();
        directionLineGeomerty.vertices.push(new Vector3(0, 0, 0)); // line origin
        directionLineGeomerty.vertices.push(new Vector3(0, 0, -50)); //end of line
        directionLine = new Line(directionLineGeomerty, directionLineMaterial);
        player.add(directionLine);
        console.log("Added Direction line");
        player.add(camera);
        camera.position.set(0, 1, 0);
        // Add framerate stats
        addStatsObject();
        console.log("Added Stats to scene...");
        document.body.appendChild(renderer.domElement);
        gameLoop(); // render the scene	
        scene.simulate();
        window.addEventListener('resize', onWindowResize, false);
    }
    //PointerLockChange Event Handler
    function pointerLockChange(event) {
        if (document.pointerLockElement === element) {
            keyboardControls.enabled = true;
            mouseControls.enabled = true;
            blocker.style.display = 'none';
        }
        else {
            keyboardControls.enabled = false;
            mouseControls.enabled = false;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            instructions.style.display = '';
            console.log("PointerLock Disabled");
        }
    }
    //PointerLockError Event Handler
    function pointerLockError(event) {
        instructions.style.display = '';
        console.log("PointerLock Error Detected!!");
    }
    // Window Resize Event Handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    // Add Frame Rate Stats to the Scene
    function addStatsObject() {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }
    // Setup main game loop
    function gameLoop() {
        stats.update();
        checkControls();
        stage.update();
        if (livesValue == 0 || livesValue < 0) {
            livesValue = 5;
            liveslabel.text = "LIVES: " + livesValue;
            scene.remove(player);
            player.position.set(0, 5, 10);
            scene.add(player);
        }
        // render using requestAnimationFrame
        requestAnimationFrame(gameLoop);
        // render the scene
        renderer.render(scene, camera);
    }
    //check controls
    function checkControls() {
        if (keyboardControls.enabled) {
            velocity = new Vector3();
            var time = performance.now();
            var delta = (time - prevTime) / 1000;
            if (isgrounded) {
                var direction = new Vector3(0, 0, 0);
                if (keyboardControls.moveFoward) {
                    velocity.z -= 400.0 * delta;
                }
                if (keyboardControls.moveBackward) {
                    velocity.z += 400.0 * delta;
                }
                if (keyboardControls.moveLeft) {
                    velocity.x -= 400.0 * delta;
                }
                if (keyboardControls.moveRight) {
                    velocity.x += 400.0 * delta;
                }
                if (keyboardControls.jump) {
                    velocity.y += 4000.0 * delta;
                    if (player.position.y > 5) {
                        isgrounded = false;
                    }
                }
                player.setDamping(0.7, 0.1);
                //Chaging Rotation
                player.setAngularVelocity(new Vector3(0, mouseControls.yaw, 0));
                direction.addVectors(direction, velocity);
                direction.applyQuaternion(player.quaternion);
                if (Math.abs(player.getLinearVelocity().x) < 20 && Math.abs(player.getLinearVelocity().y) < 10) {
                    player.applyCentralForce(direction);
                }
                cameraLook();
            } // isGrounded finishes
            mouseControls.pitch = 0;
            mouseControls.yaw = 0;
            prevTime = time;
        } // controls enabled ends
        else {
            player.setAngularVelocity(new Vector3(0, 0, 0));
        }
    }
    //camera look
    function cameraLook() {
        var zenith = THREE.Math.degToRad(90);
        var nadir = THREE.Math.degToRad(-90);
        var cameraPitch = camera.rotation.x + mouseControls.pitch;
        //constran the camera pitch
        camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
    }
    // Setup default renderer
    function setupRenderer() {
        renderer = new Renderer({ antialias: true });
        renderer.setClearColor(0x404040, 1.0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
        renderer.shadowMap.enabled = true;
        console.log("Finished setting up Renderer...");
    }
    // Setup main camera for the scene
    function setupCamera() {
        camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.1, 100);
        /*
        camera.position.set(0, 10, 30);
        camera.lookAt(new Vector3(0, 0, 0));
        */
        console.log("Finished setting up Camera...");
    }
    window.onload = init;
    return {
        scene: scene
    };
})();

//# sourceMappingURL=game.js.map

var sceneWidth  = window.innerWidth;
var sceneHeight = window.innerHeight;
var sceneAspect = sceneWidth / sceneHeight;

// Create new scene
const scene = new THREE.Scene();



// Set up camera
const camera = new THREE.PerspectiveCamera( 90, sceneAspect, 1, 10000 );
camera.position.set( 0, -params.cameraPosition, params.cameraPosition );
camera.lookAt( new THREE.Vector3( 0, 0, params.cameraPosition) );



// Setup renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( sceneWidth, sceneHeight );
renderer.render( scene, camera );



// Set renderer to DOM element
const canvas = document.getElementsByTagName('main')[0];
canvas.appendChild( renderer.domElement );



// Setup stats block
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );



// Set up Backdrop
const backdrop = new Backdrop( sceneWidth, sceneHeight );



// Set up The Grid
const theGrid = new Grid();



// Set up Post FX
const lighting = new Lighting();



// Set up Post FX
const postFX = new PostFX( sceneWidth, sceneHeight );



// Animation loop
(function animate(){
	stats.begin();
	// renderer.render( scene, camera );
	postFX.render();
	stats.end();
	requestAnimationFrame( animate );
}());



// Window resize listener
window.addEventListener( 'resize', function(){
	sceneWidth  = window.innerWidth;
	sceneHeight = window.innerHeight;
	sceneAspect = sceneWidth / sceneHeight;

	camera.aspect = sceneAspect;
	camera.updateProjectionMatrix();
	renderer.setSize( sceneWidth, sceneHeight );
	backdrop.setSize( sceneWidth, sceneHeight );
	postFX.setSize( sceneWidth, sceneHeight );
	// composer.setSize( sceneWidth, sceneHeight );
}, false );
class Controller {
	constructor( vals ){
		this.setParameters( vals );
	}
	setParameters = function( vals ){
		for( let k in vals ){
			if( vals.hasOwnProperty(k) ){
				this[k] = vals[k];
			}
		}
	}
	reset = function() {
		this.setParameters( defaults );
	}
}

const params = new Controller( defaults );


(function() {
	let gui = new dat.GUI({width: 300});
	let folder = Array();

	folder[0] = gui.addFolder( 'The Grid' );
		folder[1] = folder[0].addFolder( 'Dimensions' );
			folder[1].add( params, 'terrainWidth' ).name('Width').min(10).max(200).step(1).onChange(function(){ theGrid.updateGeometry(); theGrid.updateRepeat(); });
			folder[1].add( params, 'terrainLength' ).name('Length').min(10).max(MAX_GRID_LENGTH).step(1).onChange(function(){ theGrid.updateGeometry(); theGrid.updateRepeat(); lighting.updateSunLight(); });
			folder[1].add( params, 'terrainHeight' ).name('Altitude').min(0).max(100).step(1).onChange(function(){ theGrid.updateGeometry(); });
		folder[2] = folder[0].addFolder( 'Appearance' );
			folder[2].add( params, 'gridThickness' ).name('Stroke Weight').min(0).max(GRID_TEXTURE_SIZE).step(1).onChange(function(){ theGrid.updateMaterial(); });
			folder[2].add( params, 'gridIntensity' ).name('Glow Brightness').min(0).max(10).step(.1).onChange(function(){ theGrid.updateMaterial(); });
			folder[2].add( params, 'showHorizontalLines' ).name('Horizontal Lines').onChange(function(){ theGrid.updateMaterial(); });
			folder[2].add( params, 'showVerticalLines' ).name('Vertical Lines').onChange(function(){ theGrid.updateMaterial(); });
			folder[2].add( params, 'surfaceMetalness' ).name('Metalness').min(0).max(100).step(1).onChange(function(){ theGrid.updateMaterial(); });
			folder[2].addColor( params, 'gridLineColor' ).name('Glow Color').onChange(function(){ theGrid.updateMaterial(); });
			folder[2].addColor( params, 'terrainSurfaceColor' ).name('Surface Color').onChange(function(){ theGrid.updateMaterial(); });
		folder[3] = folder[0].addFolder( 'Terrain' );
			folder[3].add( params, 'canyonWallsStart' ).name('Canyon Width').min(0).max(100).step(1).onChange(function(){ theGrid.updateGeometry(); });
			folder[3].add( params, 'canyonWallsEnd' ).name('Canyon Wall Slope').min(0).max(100).step(1).onChange(function(){ theGrid.updateGeometry(); });
			folder[3].add( params, 'mountainBase' ).name('Mountain Floor').min(0).max(100).step(1).onChange(function(){ theGrid.updateGeometry(); });
			folder[3].add( params, 'plateauStart' ).name('Front Start').min(0).max(100).step(1).onChange(function(){ theGrid.updateGeometry(); });
			folder[3].add( params, 'plateauLength' ).name('Front Slope').min(1).max(100).step(1).onChange(function(){ theGrid.updateGeometry(); });
			folder[3].add( params, 'farMountainsStart' ).name('Far Hills Start').min(0).max(100).step(1).onChange(function(){ theGrid.updateGeometry(); });
			folder[3].add( params, 'farMountainsLength' ).name('Far Hills Slope').min(0).max(100).step(1).onChange(function(){ theGrid.updateGeometry(); });
		folder[4] = folder[0].addFolder( 'Random Noise' );
			folder[4].add( params, 'terrainNoiseSeed' ).name('Seed').onChange(function(){ theGrid.updateGeometry(); });
			folder[4].add( params, 'terrainNoiseScaleX' ).name('Roughness X').min(.001).max(.2).step(.001).onChange(function(){ theGrid.updateGeometry(); });
			folder[4].add( params, 'terrainNoiseScaleY' ).name('Roughness Y').min(.001).max(.2).step(.001).onChange(function(){ theGrid.updateGeometry(); });

	folder[10] = gui.addFolder( 'Background' );
		folder[11] = folder[10].addFolder( 'The Sun' );
			folder[11].add( params, 'sunSize' ).name('Size').min(0).max(200).step(1).onChange(function(){ backdrop.updateScene(); });
			folder[11].add( params, 'sunPosition' ).name('Position').min(-100).max(100).step(1).onChange(function(){ backdrop.updateScene(); });
			folder[11].add( params, 'sunLinesStart' ).name('Lines Start').min(0).max(100).step(1).onChange(function(){ backdrop.updateScene(); });
			folder[11].add( params, 'sunLinesEnd' ).name('Lines End').min(0).max(100).step(1).onChange(function(){ backdrop.updateScene(); });
			folder[11].add( params, 'sunLines' ).name('Number of Lines').min(0).max(50).step(1).onChange(function(){  backdrop.updateScene(); });
			folder[11].addColor( params, 'sunGradientTop' ).name('Color Top').onChange(function(){ backdrop.updateScene(); });
			folder[11].addColor( params, 'sunGradientBottom' ).name('Color Bottom').onChange(function(){ backdrop.updateScene(); });
		folder[12] = folder[10].addFolder( 'Stars' );
			folder[12].add( params, 'numberOfStars' ).min(0).max(10000).step(100).onChange(function(){ backdrop.updateScene(); });
			folder[12].add( params, 'maxStarSize' ).min(0).max(5).step(.1).onChange(function(){ backdrop.updateScene(); });

	folder[20] = gui.addFolder( 'Camera and Lighting' );
		folder[20].add( params, 'cameraPosition' ).name('Camera Height').min(1).max(20).step(.1).onChange(function(){
			camera.position.set( 0, -params.cameraPosition, params.cameraPosition );
			camera.lookAt( new THREE.Vector3( 0, 0, params.cameraPosition) );
		});
		folder[20].add( params, 'sunLightIntensity' ).min(0).max(100).step(1).onChange(function(){ lighting.updateSunLight(); });
		folder[20].add( params, 'skyLightIntensity' ).min(0).max(100).step(1).onChange(function(){ lighting.updateSkyLight(); });
		folder[20].addColor( params, 'sunLightGlow' ).onChange(function(){ lighting.updateSunLight(); });

	folder[30] = gui.addFolder( 'Visual Effects' );
		folder[31] = folder[30].addFolder( 'Tilt Shift' );
			folder[31].add( params, 'enableTiltShift' ).name('Enable Tilt Shift').onChange(function(){ postFX.recompose(); });
			folder[31].add( params, 'tiltShiftBlur' ).min(0).max(20).step(.1).onChange(function(){ postFX.setTiltShiftBlur(); });
			folder[31].add( params, 'tiltShiftFocus' ).min(0).max(1).step(.01).onChange(function(){ postFX.setTiltShiftFocus(); });
		folder[32] = folder[30].addFolder( 'Bloom' );
			folder[32].add( params, 'enableBloom' ).name('Enable Bloom').onChange(function(){ postFX.recompose(); });
			folder[32].add( params, 'bloomStrength' ).min(0).max(3).step(.1).onChange(function(){ postFX.setBloomStrength(); });
			folder[32].add( params, 'bloomThreshold' ).min(0).max(1).step(.01).onChange(function(){ postFX.setBloomThreshold(); });
			folder[32].add( params, 'bloomRadius' ).min(0).max(1).step(.01).onChange(function(){ postFX.setBloomRadius(); });
		folder[33] = folder[30].addFolder( 'Anti Aliassing' );
			folder[33].add( params, 'enableAntiAliasing' ).onChange(function(){ postFX.recompose(); });
			folder[33].add( params, 'antiAliasingPasses' ).min(0).max(5).step(1).onChange(function(){ postFX.setSSAASamples() });



	folder[30].open();
	folder[32].open();
}());
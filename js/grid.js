class Grid {

	constructor() {
		this.createGenerator();
		this.mesh = new THREE.Mesh();
		this.mesh.position.y = params.terrainLength / 2;
		this.updateGeometry();
		this.updateMaterial();
		scene.add( this.mesh );
	}

	createGenerator = function() {
		this.noiseGenerator = new Noise( params.terrainNoiseSeed );
	}

	updateGeometry = function() {
		this.noiseArray = Grid.createNoiseArray( this.noiseGenerator );
		this.mesh.geometry = Grid.createGridGeometry( this.noiseArray );
		this.mesh.position.y = params.terrainLength / 2;
	}

	updateRepeat = function() {
		this.mesh.material.emissiveMap.repeat.x = params.terrainWidth;
		this.mesh.material.emissiveMap.repeat.y = params.terrainLength;
	}

	updateMaterial = function() {
		this.mesh.material = Grid.createGridMaterial();
	}



	static createNoiseArray = function( ng ) {
		let gl = params.terrainLength;
		let gw = params.terrainWidth;
		let mh = params.terrainHeight / (1 - (0.01 * params.mountainBase));
		let noiseArray = new Array( gw + 1);
		for( let x = 0; x <= gw; x++ ){
			noiseArray[x] = new Array( gl + 1 );
			let canyon   = params.canyonWallsEnd > 0 ? THREE.Math.clamp( THREE.Math.mapLinear( Math.abs( x - gw/2 ), params.canyonWallsStart, params.canyonWallsStart + params.canyonWallsEnd, 0, 1 ), 0, 1 ) : 1;
			for( let y = 0; y <=  gl ; y++ ){
				let backMnt  = params.farMountainsLength > 0 ? THREE.Math.clamp( THREE.Math.mapLinear( y,  gl  - params.farMountainsStart,  gl  - (params.farMountainsStart + params.farMountainsLength), 1, 0 ), 0, 1 ) : 0;
				let frontMnt = THREE.Math.clamp( THREE.Math.mapLinear( y, params.plateauStart, params.plateauStart + params.plateauLength, 0, 1 ), 0, 1 );
				let scale    = Math.max(canyon, backMnt) * frontMnt;

				let u = x * params.terrainNoiseScaleX;
				let v = y * params.terrainNoiseScaleY;
				let n = THREE.Math.clamp((( Grid.getOctaveNoise( ng, u, v, 10, 0.5 ) * scale) - (params.mountainBase/100)), 0, 1) * mh;
				noiseArray[x][y] = n;
			}
		}
		return noiseArray;
	}

	static getOctaveNoise = function( ng, x, y, num_octaves, lacunarity ){
		let n = 0;
		for( let octave = 0; octave < num_octaves; octave++ ){
			let frequency = Math.pow(  2, octave );
			let amplitude = Math.pow( lacunarity, octave );
			n += amplitude * ng.perlin2( x * frequency, y * frequency );
		}
		return (n + 1) / 2;
	}

	static createGridGeometry = function( noise_array ) {
		let gridGeometry = new THREE.PlaneGeometry( params.terrainWidth, params.terrainLength, params.terrainWidth, params.terrainLength );
		for( let x = 0; x <= params.terrainWidth; x++ ){
			for( let y = 0; y <= params.terrainLength; y++ ){
				let i = (params.terrainLength-y) * (params.terrainWidth+1) + x;
				gridGeometry.vertices[i].z = noise_array[x][y];
			}
		}
		return gridGeometry;
	}

	static createGridMaterial = function() {
		return new THREE.MeshStandardMaterial({
			color: new THREE.Color(params.terrainSurfaceColor),
			flatShading: true,
			metalness: params.surfaceMetalness/100,
			emissiveMap: Grid.createGridTexture(),
			emissive: new THREE.Color(params.gridLineColor),
			emissiveIntensity: params.gridIntensity,
		});
	}

	static createGridTexture = function() {
		let textureResolution = GRID_TEXTURE_SIZE;
		let textureData = new Uint8Array( 3 * textureResolution * textureResolution );
		let halfResolution = textureResolution/2;
		let strokeWidth = params.gridThickness * 0.5;
		let px = 0;
		for( let y = 0; y < textureResolution; y++ ){
			for( let x = 0; x < textureResolution; x++ ){
				let dx = params.gridThickness % 2 == 0 ? Math.min( x, textureResolution-x-1 ) : Math.min( x, textureResolution-x );
				let dy = params.gridThickness % 2 == 0 ? Math.min( y, textureResolution-y-1 ) : Math.min( y, textureResolution-y );
				if( params.showVerticalLines && dx < strokeWidth || params.showHorizontalLines && dy < strokeWidth ){
					textureData[px++] = 255;
					textureData[px++] = 255;
					textureData[px++] = 255;
				}else{
					textureData[px++] = 0;
					textureData[px++] = 0;
					textureData[px++] = 0;
				}
			}
		}
		let gridTexture = new THREE.DataTexture( textureData, textureResolution, textureResolution, THREE.RGBFormat );
		gridTexture.needsUpdate     = true;
		gridTexture.generateMipmaps = true;
		gridTexture.anisotropy      = renderer.capabilities.getMaxAnisotropy();
		gridTexture.wrapS           = THREE.RepeatWrapping;
		gridTexture.wrapT           = THREE.RepeatWrapping;
		gridTexture.minFilter       = THREE.LinearMipMapLinearFilter;
		gridTexture.repeat.x        = params.terrainWidth;
		gridTexture.repeat.y        = params.terrainLength;
		return gridTexture;
	}
}
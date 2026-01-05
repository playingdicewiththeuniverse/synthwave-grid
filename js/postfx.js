class PostFX {
	constructor( w, h ) {

		this.sceneWidth = w;
		this.sceneHeight = h;

		this.render_pass = new THREE.RenderPass( scene, camera );
		
		this.ssaa_pass = new THREE.SSAARenderPass( scene, camera );
		this.setSSAASamples();

		// Build Bloom Pass
		this.bloom_pass = new THREE.UnrealBloomPass( new THREE.Vector2( this.sceneWidth, this.sceneHeight ), params.bloomStrength, params.bloomRadius, params.bloomThreshold );

		// Build Tilt Shift Passes
		this.hplur_pass = new THREE.ShaderPass( THREE.HorizontalTiltShiftShader );
		this.vblur_pass = new THREE.ShaderPass( THREE.VerticalTiltShiftShader );
		this.setTiltShiftBlur();
		this.setTiltShiftFocus();


		// const rgbshift_pass = new THREE.ShaderPass( THREE.RGBShiftShader );
		// rgbshift_pass.uniforms.angle.value  = 0.0 * Math.PI;
		// rgbshift_pass.uniforms.amount.value = params.chromaShift;

		// const vhs_pass = new THREE.ShaderPass( THREE.BadTVShader );
		// vhs_pass.uniforms[ 'distortion' ].value  = 0.1;
		// vhs_pass.uniforms[ 'distortion2' ].value = 3.0;
		// vhs_pass.uniforms[ 'speed' ].value       = 1.0;
		// vhs_pass.uniforms[ 'rollSpeed' ].value   = 0.04;

		// const scanlines_pass = new THREE.ShaderPass( THREE.FilmShader );
		// scanlines_pass.uniforms[ 'grayscale'].value   = 0;
		// scanlines_pass.uniforms[ 'sCount' ].value     = 525;
		// scanlines_pass.uniforms[ 'sIntensity' ].value = 0.9;
		// scanlines_pass.uniforms[ 'nIntensity' ].value = 0.4;

		this.recompose();
	}


	setSSAASamples = function() {
		this.ssaa_pass.sampleLevel = params.antiAliasingPasses;
	}


	setTiltShiftBlur = function() {
		this.hplur_pass.uniforms.h.value = params.tiltShiftBlur / ( this.sceneWidth );
		this.vblur_pass.uniforms.v.value = params.tiltShiftBlur / ( this.sceneHeight );
	}
	setTiltShiftFocus = function() {
		this.hplur_pass.uniforms.r.value = params.tiltShiftFocus;
		this.vblur_pass.uniforms.r.value = params.tiltShiftFocus;
	}


	setBloomStrength = function() {
		this.bloom_pass.strength  = params.bloomStrength;
	}
	setBloomThreshold = function() {
		this.bloom_pass.threshold = params.bloomThreshold;
	}
	setBloomRadius = function() {
		this.bloom_pass.radius = params.bloomRadius;
	}


	recompose = function() {
		this.setSize();
		this.composer = new THREE.EffectComposer( renderer );
		this.composer.addPass( this.render_pass );
		
		if( params.enableAntiAliasing ) {
			this.composer.addPass( this.ssaa_pass );
		}
		
		if( params.enableBloom ) {
			this.composer.addPass( this.bloom_pass );
		}
		
		if( params.enableTiltShift ) {
			this.composer.addPass( this.hplur_pass );
		}
		
		if( params.enableTiltShift ) {
			this.composer.addPass( this.vblur_pass );
		}
		
		if( params.enableChromaShift ) {
			this.composer.addPass( this.rgbshift_pass );
		}
		
		if( params.enableScanlines ) {
			this.composer.addPass( this.scanlines_pass );
		}
		
		if( params.enableVHSRoll ) {
			this.composer.addPass( this.vhs_pass );
		}
	}


	render = function() {
		this.composer.render();
	}


	setSize = function() {
		if( params.enableAntiAliasing ) {
			this.ssaa_pass.setSize( this.sceneWidth, this.sceneHeight );
		}
		if( params.enableBloom ) {
			this.bloom_pass.setSize( this.sceneWidth, this.sceneHeight );
		}
		if( params.enableTiltShift ) {
			this.hplur_pass.uniforms[ 'h' ].value = params.tiltShiftBlur / ( this.sceneWidth );
			this.vblur_pass.uniforms[ 'v' ].value = params.tiltShiftBlur / ( this.sceneHeight );
		}
	}
}
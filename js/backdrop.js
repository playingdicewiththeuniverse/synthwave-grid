class Backdrop {

	constructor( w, h ) {
		this.calculateDimensions( w, h );
		this.updateScene();
	}

	updateScene = function() {
		scene.background = this.getBackdropTexture();
		scene.background.center = new THREE.Vector2( 0.5, 0.5 );
		scene.background.repeat = new THREE.Vector2( sceneAspect / this.canvasAspect, 1 );
	}

	calculateDimensions = function( w, h ) {
		this.canvasAspect = Math.pow( 2, Math.ceil( Math.log2( w / h ) ) );
		this.canvasHeight = Math.pow( 2, Math.ceil( Math.log2( h ) ) );
		this.canvasWidth  = this.canvasHeight * this.canvasAspect;
	}

	setSize = function( w, h ) {
		let newCanvasAspect = Math.pow( 2, Math.ceil( Math.log2( w / h ) ) );
		let newCanvasHeight = Math.pow( 2, Math.ceil( Math.log2( h ) ) );
		if( newCanvasHeight != this.canvasHeight || newCanvasAspect != this.canvasAspect ){
			this.calculateDimensions( w, h );
			this.updateScene();
		}else{
			this.calculateDimensions( w, h );
			scene.background.repeat = new THREE.Vector2( sceneAspect / this.canvasAspect, 1 );
		}
	}

	getBackdropTexture = function() {
		console.log( "New backdrop rendered at " + this.canvasWidth + "x" + this.canvasHeight );
		let canvas = document.createElement('canvas');
		canvas.width  = this.canvasWidth;
		canvas.height = this.canvasHeight;
		let ctx = canvas.getContext('2d');

		// Sky background
		let skyGradient = ctx.createLinearGradient( 0, 0, 0, canvas.height/2 );
		skyGradient.addColorStop( 0, params.skyGradientTop );
		skyGradient.addColorStop( 1, params.skyGradientBottom );
		ctx.fillStyle = skyGradient;
		ctx.fillRect( 0, 0, canvas.width, canvas.height );

		// Stars
		if( params.maxStarSize > 0 && params.numberOfStars > 0 ){
			let prng = new Random(42);
			ctx.fillStyle = 'white';
			let centerX = this.canvasWidth / 2;
			let halfHeight = this.canvasHeight / 2;
			for( let ar = 0; ar < this.canvasAspect; ar++ ){
				for( let i = 0; i < params.numberOfStars; i++ ){
					let r1 = prng.nextFloat();
					let r2 = prng.nextFloat();
					let r3 = prng.nextFloat();
					let displacement = ar * Math.sign(r1-0.5) * this.canvasHeight * 0.5;
					let randomX    = Math.round( THREE.Math.mapLinear( r1, 0, 1, centerX - halfHeight, centerX + halfHeight ) ) + displacement;
					let randomY    = Math.round( r2 * halfHeight );
					let randomSize = r3 * params.maxStarSize;
					ctx.beginPath();
					ctx.arc( randomX, randomY, randomSize, 0, 2 * Math.PI );
					ctx.closePath();
					ctx.fill();
				}
			}
		}
		
		// Sun disc
		let sunDiameter    = canvas.height * params.sunSize / 200;
		let sunCenter      = (canvas.height / 2) - (canvas.height * params.sunPosition / 100);
		let sunTop         = sunCenter - (sunDiameter / 2);
		let sunBtm         = sunCenter + (sunDiameter / 2);
		let sunLinesStart  = sunTop + (sunDiameter * params.sunLinesStart / 100);
		let sunLinesEnd    = Math.max( sunLinesStart, sunBtm - (sunDiameter * (100 - params.sunLinesEnd) / 100) );
		let sunLinesHeight = sunLinesEnd - sunLinesStart;
		let sunLineSize    = sunLinesHeight / params.sunLines;
		let sunGradient    = ctx.createLinearGradient( 0, sunTop, 0, sunBtm );
		sunGradient.addColorStop( 0, params.sunGradientTop );
		sunGradient.addColorStop( 1, params.sunGradientBottom );
		let bars = new Path2D();
		bars.rect(0, sunTop, canvas.width, sunDiameter);
		for( let i = 0; i <= params.sunLines; i++ ){
			let y = THREE.Math.mapLinear( i, 0, params.sunLines, sunLinesStart, sunLinesEnd );
			let h = THREE.Math.mapLinear( i, 0, params.sunLines, 0, sunLineSize );
			if( i == params.sunLines ) h = sunBtm - y;
			bars.rect(0, y, canvas.width, h);
		}
		ctx.clip( bars, "evenodd" );
		ctx.fillStyle = sunGradient;
		ctx.beginPath();
		ctx.arc( canvas.width/2, sunCenter, sunDiameter/2, 0, Math.PI*2 );
		ctx.fill();

		// Output texture
		let texture = new THREE.Texture( canvas );
		texture.needsUpdate = true;
		return texture;
	}
}


class Random {
	constructor( seed ) {
		this._seed = seed % 2147483647;
		if (this._seed <= 0) this._seed += 2147483646;
	}
	next = function () {
		return this._seed = this._seed * 16807 % 2147483647;
	};
	nextFloat = function (opt_minOrMax, opt_max) {
		return (this.next() - 1) / 2147483646;
	};
}

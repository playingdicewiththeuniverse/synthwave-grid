class Lighting {
	constructor() {
		this.skyLight = new THREE.AmbientLight( 0xffffff, params.skyLightIntensity / 100 );
		scene.add( this.skyLight );
		this.sunLight = new THREE.PointLight( params.sunLightGlow, params.sunLightIntensity / 100, params.terrainLength * 2 );
		this.sunLight.position.set( 0, params.terrainLength * Math.sin( Math.PI/3 ), params.terrainLength * Math.cos( Math.PI/3 ) );
		scene.add( this.sunLight );
	}
	updateSunLight = function() {
		this.sunLight.position.set( 0, params.terrainLength * Math.sin( Math.PI/3 ), params.terrainLength * Math.cos( Math.PI/3 ) );
		this.sunLight.color = new THREE.Color( params.sunLightGlow );
		this.sunLight.intensity = params.sunLightIntensity / 100;
	}
	updateSkyLight = function() {
		this.skyLight.intensity = params.skyLightIntensity / 100;
	}
}
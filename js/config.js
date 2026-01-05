const GRID_TEXTURE_SIZE = 2048;
const MAX_GRID_LENGTH   = 200;


const defaults = {

	// Terrain
	terrainNoiseSeed:    42,
	terrainNoiseScaleX:  0.03,
	terrainNoiseScaleY:  0.03,
	terrainWidth:        120,
	terrainLength:       120,
	canyonWallsStart:    0,
	canyonWallsEnd:      20,
	farMountainsStart:   20,
	farMountainsLength:  10,
	mountainBase:        25,
	terrainHeight:       32,
	plateauStart:        0,
	plateauLength:       8,

	// Grid
	gridThickness:       Math.round(GRID_TEXTURE_SIZE/32),
	gridIntensity:       2.5,
	surfaceMetalness:    50,
	showHorizontalLines: true,
	showVerticalLines:   true,
	gridLineColor:       "#2fbab3",
	terrainSurfaceColor: "#490c4f",

	// Backdrop
	skyGradientTop:      "#000000",
	skyGradientBottom:   "#402080",
	// SunGradientTop:      "#690d15",
	// SunGradientBottom:   "#827b17",
	sunGradientTop:      "#f83847",
	sunGradientBottom:   "#fff452",
	sunSize:             75,
	sunPosition:         25,
	sunLines:            5,
	sunLinesStart:       45,
	sunLinesEnd:         80,
	numberOfStars:       1000,
	maxStarSize:         1.5,

	// Lighting
	skyLightIntensity:   10,
	sunLightIntensity:   50,
	sunLightGlow:        "#f83847",

	// Post Processing
	enableAntiAliasing:  false,
	enableBloom:         false,
	enableTiltShift:     false,
	enableChromaShift:   false,
	enableScanlines:     false,
	antiAliasingPasses:  1,
	bloomStrength:       0.6,
	bloomThreshold:      0.5,
	bloomRadius:         0.1,
	tiltShiftBlur:       5.0,
	tiltShiftFocus:      0.5,
	chromaShift:         0.002,

	cameraPosition: 1.5,

};
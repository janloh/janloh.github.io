var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Gray();

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, 3 * (Math.PI / 4), 15, BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(-5, 5, 0));
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.95;
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 15;
    camera.upperRadiusLimit = 50;

    // Add lights to the scene
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = BABYLON.Color3.White();
    light.specular = BABYLON.Color3.Black();
    light.intensity = 0.6;

    var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
    light2.position = new BABYLON.Vector3(0, 5, 5);

    // Shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;

    // The first parameter can be used to specify which mesh to import. Here we import all meshes
    var deltaObj = BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "Delta.obj", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        camera.target = newMeshes[0];

        shadowGenerator.addShadowCaster(scene.meshes[0], true);
        for (var index = 0; index < newMeshes.length; index++) {
            newMeshes[index].receiveShadows = false;;
        }

        var helper = scene.createDefaultEnvironment({
            enableGroundShadow: true
        });
        helper.setMainColor(BABYLON.Color3.Gray());
        helper.ground.position.y += 0.01;

        var deltaMaterial = new BABYLON.StandardMaterial("deltaMat", scene);
        deltaMaterial.diffuseTexture = new BABYLON.Texture("./assets/textures/chrome.jpg", scene);
        deltaMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        deltaMaterial.specularColor = new BABYLON.Color3(0, 1, 0);

        newMeshes[0].material = deltaMaterial;
    });

    return scene;
};
/******* End of the create scene function ******/

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
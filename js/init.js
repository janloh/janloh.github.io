const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// create scene async
const delayCreateScene = async () => {

    // Create the scene space
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Gray();

    // Add a camera to the scene and attach it to the canvas
    const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, 3 * (Math.PI / 4), 15, BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(-5, 5, 0));
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.95;
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 50;
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.5;

    // Add lights to the scene
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = BABYLON.Color3.White();
    light.specular = BABYLON.Color3.Black();
    light.intensity = 0.6;

    const light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
    light2.position = new BABYLON.Vector3(0, 5, 5);

    // Shadows
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;

    // Create parent node -> bounding box
    const nightVisionParent = new BABYLON.Mesh.CreateBox("nightVisionParent", 1, scene);

    // async mesh import
    await importMesh(nightVisionParent, "./assets/models/nachtsicht/", "200325_dj8_1x48.obj")

    camera.target = nightVisionParent;
    shadowGenerator.addShadowCaster(nightVisionParent, true);

    return scene;
};

// The first parameter can be used to specify which mesh to import. Here we import all meshes
//var deltaObj = BABYLON.SceneLoader.ImportMesh("", "./assets/models/nachtsicht/", "200325_dj8_1x48.obj", scene, function (newMeshes) {
    // Set the target of the camera to the first imported mesh
    //camera.target = newMeshes[0];

    //shadowGenerator.addShadowCaster(scene.meshes[0], true);
    //for (var index = 0; index < newMeshes.length; index++) {
    //    newMeshes[index].receiveShadows = false;;
    //}

    //var helper = scene.createDefaultEnvironment({
    //    enableGroundShadow: true
    //});
    //helper.setMainColor(new BABYLON.Color3(46 / 255, 46 / 255, 48 / 255));
    //helper.ground.position.y += 0.01;

    //var deltaMaterial = new BABYLON.StandardMaterial("deltaMat", scene);
    //deltaMaterial.diffuseTexture = new BABYLON.Texture("./assets/textures/chrome.jpg", scene);
    //deltaMaterial.diffuseColor = new BABYLON.Color3(249 / 255, 69 / 255, 58 / 255);
    //deltaMaterial.specularColor = new BABYLON.Color3(73 / 255, 226 / 255, 187 / 255);

    //newMeshes[0].material = deltaMaterial;
//});

async function importMesh(root, url, name) {
    const objs = await BABYLON.SceneLoader.ImportMeshAsync("", url, name, BABYLON.EngineStore.LastCreatedScene, null);
    const meshRoots = objs.meshes.filter(m => m.parent == null);
    if (meshRoots.length == 0) console.log("Imported object does not have a root!");
    else if (meshRoots.length > 1) console.log("Multiple roots detected!");
    meshRoots.forEach(m => m.parent = root);
}

//Call the createScene function
const scene = delayCreateScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
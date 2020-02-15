var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

/******* Add the create scene function ******/
var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 5), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // The first parameter can be used to specify which mesh to import. Here we import all meshes
    BABYLON.SceneLoader.ImportMesh("", "./assets/models", "Delta.obj", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        camera.target = newMeshes[0];
    });

    // Add and manipulate meshes in the scene
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 4 }, scene);

    // Create a material with our land texture.
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("./assets/textures/ground.jpg", scene);

    // This shows how we would apply this material to a plane. In our later
    // example we'll replace this with CreateGroundFromHeightMap.
    var groundPlane = BABYLON.Mesh.CreatePlane("groundPlane", 200.0, scene);

    // When our new mesh is read, apply our material.
    groundPlane.material = groundMaterial;

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
var drag = false;
var mouseDown = false;
var lastMouseX, lastMouseY;

document.onkeydown = function(e) {
    switch (e.which) {
        case KEYS.PLUS: mesh.subdivide(); updateMesh(); break;
        case KEYS.MINUS: mesh.merge(); updateMesh(); 	break;
    }
};

document.onmousedown = function(e) {
    mouseDown = true;

    lastMouseX = e.x;
    lastMouseY = e.y;
};

function getMouseVector(e) {
    // scale mouse position to [-1, 1]
    var x = 2 * (e.x / window.innerWidth) - 1;
    var y = 1 - 2 * (e.y / window.innerHeight);

    return new THREE.Vector3(x, y);
}

function pickIntersectedObjects(mouseVector) {
    var raycaster = new THREE.Projector().pickingRay(mouseVector.clone(), camera);
    return raycaster.intersectObjects(parent.children);
}

function getCornersOfFace3(face) {
    return [face.a, face.b, face.c]
}

document.onmouseup = function(e) {
    if (!drag) {
        var intersectedObjects = pickIntersectedObjects(getMouseVector(e));
        if (intersectedObjects.length > 0) {
            var faceCorners = getCornersOfFace3(intersectedObjects[0].face);
            console.log(faceCorners);
            mesh.selectFaces(faceCorners);
            updateMesh();
        }
    }

    mouseDown = false;
    drag = false;
};

function rotateScene(xAxisRotation, yAxisRotation) {
    var q = new THREE.Quaternion();

    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yAxisRotation);
    parent.quaternion.multiplyQuaternions(q, parent.quaternion);

    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), xAxisRotation);
    parent.quaternion.multiplyQuaternions(q, parent.quaternion);
}

var DRAG_THRESHOLD = 0.01;
function isDragThresholdReached(deltaX, deltaY) {
    return (Math.abs(deltaX) + Math.abs(deltaY) > DRAG_THRESHOLD);
}

var ROTATION_SPEED = 0.005;
document.onmousemove = function(e) {
    if (!mouseDown) { return }

    var deltaX = e.x - lastMouseX;
    var deltaY = e.y - lastMouseY;

    if (!drag && !isDragThresholdReached(deltaX, deltaY)) { return; }

    drag = true;

    lastMouseX = e.x;
    lastMouseY = e.y;

    rotateScene(deltaY * ROTATION_SPEED, deltaX * ROTATION_SPEED);
};
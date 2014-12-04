var dragTreshold = 0.01;
var drag = false;
var mouseDown = false;
var mouseX, mouseY;

document.onkeydown = function(e) {
    switch (e.which) {
        case 187: mesh.subdivide(); updateMesh(); break;
        case 189: mesh.merge(); updateMesh(); 	break;
    }
};

document.onmousedown = function(e) {
    mouseDown = true;

    mouseX = e.x;
    mouseY = e.y;
};

function getMouseVector(e) {
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

function isDragTresholdReached(deltaX, deltaY) {
    return (Math.abs(deltaX) + Math.abs(deltaY) > dragTreshold);
}

document.onmousemove = function(e) {
    if (!mouseDown) { return }

    var deltaX = e.x - mouseX;
    var deltaY = e.y - mouseY;

    if (!drag && !isDragTresholdReached(deltaX, deltaY)) { return; }

    drag = true;

    mouseX = e.x;
    mouseY = e.y;

    rotateScene(deltaY * 0.005, deltaX * 0.005);
};
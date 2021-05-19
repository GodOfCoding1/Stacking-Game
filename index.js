import * as THREE from "https://cdn.skypack.dev/three@0.128.0";

function checkuseragent() {
    let check = false;
    (function(a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

let camera, scene, renderer;
//okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk below real shit
let HeightBox = 1;
let all_boxes = [];
let started = false;
let mobile = checkuseragent();
//mobile fixing
let scale = mobile ? 2 : 0.8;
let startingPosition = mobile ? 15 : 22;
//score
let score = 0;
//gameover
let gameover = false;

//first colour
let first_colour = Math.floor(Math.random() * 13) * 30;
//angle
let angle = 0;

function reset() {
    location.reload();
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    //first box
    addBox(0, 0, 3, 3);
    //next
    addBox(-startingPosition, 0, 3, 3, "x");

    //lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dLight.position.set(10, 20, 0);
    scene.add(dLight);

    //camera
    const width = 10;
    const height = width * (window.innerHeight / window.innerWidth);
    camera = new THREE.OrthographicCamera(
        width / -scale, // left
        width / scale, // right
        height / scale, // top
        height / -scale, // bottom
        -10, // near
        100 // far
    );

    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    //renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, (window.innerHeight * 97) / 100);
    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement);
}

function makeBox(x, y, z, width, depth) {
    const geometry = new THREE.BoxGeometry(width, HeightBox, depth);
    const color = new THREE.Color(
        `hsl(${first_colour + all_boxes.length * 4},100%,50%)`
    );
    const material = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return {
        box: mesh,
        width,
        depth,
    };
}

function addBox(x, z, width, depth, direction) {
    const y = HeightBox * all_boxes.length;
    const box = makeBox(x, y, z, width, depth);
    box.direction = direction;
    all_boxes.push(box);
}

window.addEventListener("click", () => {
    if (!gameover) {
        if (!started) {
            if (mobile) {
                requestFullScreen(document.getElementById("main-body"));
            }

            renderer.setAnimationLoop(animate);
            started = true;
        } else {
            const topBox = all_boxes[all_boxes.length - 1];
            const oldBox = all_boxes[all_boxes.length - 2];
            const direction = topBox.direction;

            const diff_centers =
                topBox.box.position[direction] - oldBox.box.position[direction];
            const abs_diff = Math.abs(diff_centers);

            const size = direction === "x" ? topBox.width : topBox.depth;
            const overlap = size - abs_diff;
            if (overlap > 0) {
                const newWidth = direction === "x" ? overlap : topBox.width;
                const newDepth = direction === "z" ? overlap : topBox.depth;

                topBox.width = newWidth;
                topBox.depth = newDepth;

                topBox.box.scale[direction] = overlap / size;
                topBox.box.position[direction] -= diff_centers / 2;

                const X = direction === "x" ? topBox.box.position.x : -startingPosition;
                const Z = direction === "z" ? topBox.box.position.z : -startingPosition;
                const newDirection = direction === "x" ? "z" : "x";
                //add box and play sound
                playSound();
                addBox(X, Z, newWidth, newDepth, newDirection);
                document.getElementById("score").innerHTML = `<p id="score-p">SCORE : ${
          all_boxes.length - 2
        }</p>`;
            } else {
                //show game over
                if (all_boxes.length - 2 > 0) {
                    document.getElementById("score-p").classList.toggle("score-hidden");
                }

                document
                    .getElementById("GAMEOVER-p")
                    .classList.toggle("GAMEOVER-hidden");
                const score_gameover = document.getElementById("GAMEOVER-score");

                score_gameover.classList.toggle("GAMEOVER-hidden");
                score_gameover.innerHTML = `SCORE : ${all_boxes.length - 2}`;
                //gameover updating
                gameover = true;

                //show play again
                document.getElementById("playagain").classList.toggle("show");
                document.getElementById("playagain-conatiner").classList.toggle("show");
                document.getElementById("playagain-btn").classList.toggle("show");
                document.getElementById("text-playagain").classList.toggle("show");
            }
        }
    }
});

function animate() {
    const speed = 0.15;
    renderer.setSize(window.innerWidth, window.innerHeight);
    const topBox = all_boxes[all_boxes.length - 1];
    topBox.box.position[topBox.direction] += speed;
    const direction = topBox.direction;
    if (camera.position.y < HeightBox * (all_boxes.length - 2) + 4) {
        camera.position.y += speed;
    }
    if (
        topBox.box.position.x > startingPosition ||
        topBox.box.position.z > startingPosition
    ) {
        topBox.box.position.x =
            direction === "x" ? -startingPosition + 3 : topBox.box.position.x;
        topBox.box.position.z =
            direction === "z" ? -startingPosition + 3 : topBox.box.position.z;
    }
    //make camera rotate
    if (gameover) {
        camera.position.z = Math.sqrt(2) * (4 - all_boxes.length) * Math.cos(angle);
        camera.position.x = Math.sqrt(2) * (4 - all_boxes.length) * Math.sin(angle);

        camera.position.y = HeightBox * (all_boxes.length - 2);
        camera.lookAt(0, 0, 0);
        angle += 0.015;
    }
    renderer.render(scene, camera);
}

function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod =
        element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen;

    if (requestMethod) {
        // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
        // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function playSound() {
    new Audio(`./sounds/wood${Math.floor(Math.random() * 4) + 1}.ogg`).play();
}
document.getElementById("playagain-btn").addEventListener("click", reset);

init();
let video;
let facemesh;
let predictions = [];
const indices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
const indices2 = [76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];

function setup() {
  // 置中畫布
  let canvas = createCanvas(640, 480);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', gotResults);
}

function modelReady() {
  console.log('Facemesh model loaded!');
}

function gotResults(results) {
  predictions = results;
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);
  drawFaceLines();
}

function drawFaceLines() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 取得第一組與第二組的所有點
    let allIndices = indices.concat(indices2);
    // 避免重複
    allIndices = [...new Set(allIndices)];

    // 畫粉紅色填充
    beginShape();
    fill(255, 102, 204, 150); // 半透明粉紅色
    noStroke();
    for (let i = 0; i < allIndices.length; i++) {
      const idx = allIndices[i];
      if (keypoints[idx]) {
        const [x, y] = keypoints[idx];
        vertex(x, y);
      }
    }
    endShape(CLOSE);

    // 畫第二組陣列的黃色填充（覆蓋在粉紅色上）
    beginShape();
    fill(255, 255, 0, 200); // 半透明黃色
    noStroke();
    for (let i = 0; i < indices2.length; i++) {
      const idx = indices2[i];
      if (keypoints[idx]) {
        const [x, y] = keypoints[idx];
        vertex(x, y);
      }
    }
    endShape(CLOSE);

    // 第一組紅色線條
    stroke(255, 0, 0);
    strokeWeight(15);
    noFill();
    for (let i = 0; i < indices.length - 1; i++) {
      const idxA = indices[i];
      const idxB = indices[i + 1];
      if (keypoints[idxA] && keypoints[idxB]) {
        const [x1, y1] = keypoints[idxA];
        const [x2, y2] = keypoints[idxB];
        line(x1, y1, x2, y2);
      }
    }
    // 第二組線條
    stroke(255, 204, 0);
    strokeWeight(4);
    noFill();
    for (let i = 0; i < indices2.length - 1; i++) {
      const idxA = indices2[i];
      const idxB = indices2[i + 1];
      if (keypoints[idxA] && keypoints[idxB]) {
        const [x1, y1] = keypoints[idxA];
        const [x2, y2] = keypoints[idxB];
        line(x1, y1, x2, y2);
      }
    }
  }
}

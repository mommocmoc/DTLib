let button3, input3, canvas;


function setup() {
  canvas = createCanvas(1000, 500);
  presentImageSprites = new Group();
  button3 = select("#submitC");
  input3 = select("#bookNameInputC");
  canvas.parent("presentationSketch");
  button3.mousePressed(addImgUrl);
}

function draw() {
  background(211, 211, 211);
  presentImageSprites.bounce(presentImageSprites);
  for (let i = 0; i < allSprites.length; i++) {
    const s = allSprites[i];
    if (s.position.x < 0) {
      s.position.x = 1;
      s.velocity.x = abs(s.velocity.x);
    }

    if (s.position.x > width) {
      s.position.x = width - 1;
      s.velocity.x = -abs(s.velocity.x);
    }

    if (s.position.y < 0) {
      s.position.y = 1;
      s.velocity.y = abs(s.velocity.y);
    }

    if (s.position.y > height) {
      s.position.y = height - 1;
      s.velocity.y = -abs(s.velocity.y);
    }
    drawSprites();
  }
}

function addImgUrl() {
    const usrInput = input3.value();
    loadImage(usrInput,img=>{
    var imageSprite = createSprite(random(0, width), random(0, height));
    imageSprite.addAnimation("normal", img, img);
    imageSprite.setCollider("rectangle", 2, 2, 150, 200);
    imageSprite.setSpeed(random(2, 3), random(0, 360));
    imageSprite.scale = random(0.5, 1);
    imageSprite.mass = imageSprite.scale;
    presentImageSprites.add(imageSprite);
    })
    input3.value('');
}
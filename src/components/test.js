// eslint-disable-next-line no-var
var pos = {
  drawable: false,
  x: -1,
  y: -1,
};

// eslint-disable-next-line no-var
var canvas;
// eslint-disable-next-line no-var
var ctx;

function getPosition(event) {
  const x = event.pageX - canvas.offsetLeft;
  const y = event.pageY - canvas.offsetTop;
  return { X: x, Y: y };
}

function initDraw(event) {
  ctx.beginPath();
  pos.drawable = true;
  const coors = getPosition(event);
  pos.X = coors.X;
  pos.Y = coors.Y;
  ctx.moveTo(pos.X, pos.Y);
}

function draw(event) {
  const coors = getPosition(event);
  ctx.lineTo(coors.X, coors.Y);
  pos.X = coors.X;
  pos.Y = coors.Y;
  ctx.stroke();
}

function finishDraw() {
  pos.drawable = false;
  pos.X = -1;
  pos.Y = -1;
}

function listener(event) {
  // eslint-disable-next-line default-case
  switch (event.type) {
    case 'mousedown':
      initDraw(event);
      break;

    case 'mousemove':
      if (pos.drawable) { draw(event); }
      break;

    case 'mouseout':
      break;

    case 'mouseup':
      finishDraw();
      break;
  }
}

window.onload = () => {
  canvas = document.getElementById('canvas');
  // eslint-disable-next-line no-unused-vars
  ctx = canvas.getContext('2d');

  canvas.addEventListener('mousedown', listener);
  canvas.addEventListener('mousemove', listener);
  canvas.addEventListener('mouseup', listener);
  canvas.addEventListener('mouseout', listener);
};

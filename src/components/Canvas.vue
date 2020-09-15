<template>
  <canvas id='canvas' />
</template>

<script>
export default {
  data() {
    return {
      canvas: document.getElementById(''),
      ctx: [],
      scroll: 1,
      pos: {
        drawable: false,
        x: -1,
        y: -1,
      },
      startPos: { x: -1, y: -1 },
      maxPos: {
        T: -1, B: -1, L: -1, R: -1,
      },

      nodes: [
      ],

      edges: [
      ],
    };
  },
  mounted() {
    window.onload = () => {
      this.canvas = document.getElementById('canvas');
      this.ctx.push(this.canvas.getContext('2d'));

      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;

      this.ctx[0].scale(1, 1);

      this.canvas.addEventListener('touchstart', (e) => {
        this.initDraw(e);
      }, false);
      this.canvas.addEventListener('touchmove', (e) => {
        if (this.pos.drawable) this.draw(e);
      }, false);
      // eslint-disable-next-line no-unused-vars
      this.canvas.addEventListener('touchend', (e) => {
        this.finishDraw(e);
      }, false);
      this.canvas.addEventListener('mousewheel', (e) => {
        if (e.deltaY < 0) this.scroll = Math.min(this.scroll + 0.1, 3);
        else this.scroll = Math.max(this.scroll - 0.1, 0.1);
        // this.reDraw();
      });

      this.ctx[0].beginPath();
      this.ctx[0].arc(this.canvas.width / 2, this.canvas.height / 2, 50, 0, Math.PI * 2);
      this.ctx[0].stroke();
      const bookText = '흥부와 놀부';
      this.ctx.font = '20px Calibri';
      const labelLength = bookText.length;
      // eslint-disable-next-line max-len
      this.ctx[0].fillText(bookText, this.canvas.width / 2 - labelLength * 5, this.canvas.height / 2);
      this.nodes.push({
        id: 1, label: '흥부와 놀부', T: this.canvas.height + 50, B: this.canvas.height + 50, L: this.canvas.width / 2 - 50, R: this.canvas.width / 2 + 50,
      });
    };
  },

  methods: {
    reDraw() {
      this.ctx[0].save();
      this.ctx[0].clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx[0].restore();
      this.ctx[0].scale(this.scroll, this.scroll);
    },

    initDraw(event) {
      this.ctx[0].beginPath();
      this.pos.drawable = true;
      const coors = this.getPosition(event);
      this.pos.X = coors.X;
      this.pos.Y = coors.Y;
      this.ctx[0].moveTo(this.pos.X, this.pos.Y);
      this.startPos.x = coors.X;
      this.startPos.y = coors.Y;
      this.maxPos.T = coors.Y;
      this.maxPos.B = coors.Y;
      this.maxPos.L = coors.X;
      this.maxPos.R = coors.X;
    },

    draw(event) {
      const coors = this.getPosition(event);
      this.ctx[0].lineTo(coors.X, coors.Y);
      this.pos.X = coors.X;
      this.pos.Y = coors.Y;
      this.ctx[0].stroke();
      if (coors.X > this.maxPos.R) this.maxPos.R = coors.X;
      else if (coors.X < this.maxPos.L) this.maxPos.L = coors.X;
      if (coors.Y > this.maxPos.T) this.maxPos.T = coors.Y;
      else if (coors.Y < this.maxPos.B) this.maxPos.B = coors.Y;
    },

    finishDraw(event) {
      this.pos.drawable = false;
      this.pos.X = -1;
      this.pos.Y = -1;

      const coors = this.getPosition(event);
      // eslint-disable-next-line max-len
      const thresh = (this.startPos.x - coors.X) * (this.startPos.x - coors.X) + (this.startPos.y - coors.Y) * (this.startPos.y - coors.Y);

      if (thresh > 800) {
        let edgeFrom = -1;
        let edgeTo = -1;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.nodes.length; i++) {
          // eslint-disable-next-line max-len
          if ((this.nodes[i].T + 200 > this.startPos.y && this.nodes[i].B - 200 < this.startPos.y) && (this.nodes[i].L - 200 < this.startPos.x && this.nodes[i].R + 200 > this.startPos.x)) {
            edgeFrom = this.nodes[i].id;
          }
        }

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.nodes.length; i++) {
          // eslint-disable-next-line max-len
          if ((this.nodes[i].T + 200 > coors.Y && this.nodes[i].B - 200 < coors.Y) && (this.nodes[i].L - 200 < coors.X && this.nodes[i].R + 200 > coors.X)) {
            edgeTo = this.nodes[i].id;
          }
        }

        this.edges.push({ from: edgeFrom, to: edgeTo });
      } else {
        const inputLabel = prompt('단어를 입력하세요.');
        this.ctx.font = '20px Calibri';
        const labelLength = inputLabel.length;
        // eslint-disable-next-line max-len
        this.ctx[0].fillText(inputLabel, (this.maxPos.L + this.maxPos.R) / 2 - labelLength * 5, (this.maxPos.T + this.maxPos.B) / 2);
        const newid = new Date().getTime();
        this.nodes.push({
          // eslint-disable-next-line max-len
          id: newid, label: inputLabel, T: this.maxPos.T, B: this.maxPos.B, L: this.maxPos.L, R: this.maxPos.R,
        });
      }
      this.startPos.x = -1;
      this.startPos.y = -1;
      this.maxPos.T = -1;
      this.maxPos.B = -1;
      this.maxPos.L = -1;
      this.maxPos.R = -1;
      console.log('nodes: ', this.nodes);
      console.log('edges: ', this.edges);
    },

    getPosition(event) {
      const touches = event.changedTouches;
      const x = (touches[0].screenX - this.canvas.offsetLeft);
      // console.log(this.canvas.offsetLeft, this.canvas.offsetTop);
      const y = (touches[0].screenY - this.canvas.offsetTop);
      return { X: x, Y: y };
    },
  },

};
</script>

<style scoped>
#canvas {
  width: 100%;
  height: 100%;
  margin: 0;
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: block;
}
</style>

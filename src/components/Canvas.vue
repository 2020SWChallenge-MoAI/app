<template>
  <canvas id='canvas' />
</template>

<script>
export default {
  data() {
    return {
      canvas: document.getElementById(''),
      ctx: [],
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
        {
          id: 1, label: '', T: -1, B: -1, L: -1, R: -1,
        },
      ],

      edges: [
        { from: 1, to: 2 },
      ],
    };
  },
  mounted() {
    window.onload = () => {
      this.canvas = document.getElementById('canvas');
      this.ctx.push(this.canvas.getContext('2d'));

      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;

      this.canvas.addEventListener('mousedown', (e) => {
        this.initDraw(e);
      });
      this.canvas.addEventListener('mousemove', (e) => {
        if (this.pos.drawable) this.draw(e);
      });
      // eslint-disable-next-line no-unused-vars
      this.canvas.addEventListener('mouseup', (e) => {
        this.finishDraw(e);
      });
    };
  },

  methods: {

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
      console.log(this.nodes);
      console.log(this.edges);
    },

    getPosition(event) {
      // eslint-disable-next-line no-var
      var x = event.pageX - this.canvas.offsetLeft;
      // eslint-disable-next-line no-var
      var y = event.pageY - this.canvas.offsetTop;
      return { X: x, Y: y };
    },
  },

};
</script>

<style scoped>
#canvas {
  border: 4px solid black;
  width: 100vw;
  height: 100vh;
}
</style>

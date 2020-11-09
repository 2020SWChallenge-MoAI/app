<template>
  <sub-layout title="마인드맵" tooltip="떠오르는 단어를 적어 커다란 나무를 완성해보자!">
    <template v-slot:left>
      <left-menu-button icon="mdi-check-bold" text="완료" id="canvas-finish" />
    </template>

    <!-- 캔버스 -->
    <canvas id="center-canvas" />

    <input id="input-test" v-model="selectedNodeLabel" @keyup.enter="enter">

    <div id="mindmap-tool-bar">
      <div class="mindmap-tools" v-ripple><div id="mindmap-tool-pen" /></div>
      <div class="mindmap-tools" v-ripple><div id="mindmap-tool-select" /></div>
      <div class="mindmap-tools" v-ripple><div id="mindmap-tool-zoomin" /></div>
      <div class="mindmap-tools" v-ripple><div id="mindmap-tool-zoomout" /></div>
      <div class="mindmap-tools" v-ripple><div id="mindmap-tool-delete" /></div>
    </div>

    <!-- TODO: Implementation -->
    <div id="center-recommend" v-show="!finish && aiHelp">
      <div id="ai-background" v-ripple>
        <div id="ai-img" />
        <div id="ai-space" />
        <div id="ai-dotline">
          <div id="ai-dot" />
          <div id="ai-dot" />
          <div id="ai-dot" />
          <div id="ai-dot" />
          <div id="ai-dot" />
          <div id="ai-dot" />
          <div id="ai-dot" />
        </div>
      </div>

      <div id="recommend-words" v-show="recommendClicked && recommendLoaded">
        <div id="recommend-words-top">
          <div class="recommend-word" id="recommend1" v-ripple>
          </div>
          <div class="recommend-word" id="recommend2" v-ripple>
          </div>
          <div class="recommend-word" id="recommend3" v-ripple>
          </div>
        </div>
        <div id="recommend-words-bot">
          <div class="recommend-word" id="recommend4" v-ripple>
          </div>
          <div class="recommend-word" id="recommend5" v-ripple>
          </div>
          <div class="recommend-word" id="recommend6" v-ripple>
          </div>
        </div>
      </div>

      <div id="recommend-start" v-if="!recommendClicked">
        내 도움이 필요하면 버튼을 누르면 돼!
      </div>

      <div id="recommend-loading" v-if="recommendClicked && !recommendLoaded" />

      <div id="right-btn" v-show="recommendClicked && recommendLoaded">
      </div>
    </div>
  </sub-layout>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      aiHelp: false,
      canvas: document.getElementById(''),
      ctx: [],
      templateType: this.$route.params.template,
      scale: 1,
      canvasScale: 1,
      touchmode: 'drag',
      padding: { x: 0, y: 0 },
      startPos: { x: -1, y: -1 },
      maxPos: {
        T: -1, B: -1, L: -1, R: -1,
      },

      nodes: [
      ],

      edges: [
      ],

      words: [
      ],

      wordIndex: 0,
      selectedNode: -1,
      doubleSelectedNode: -1,
      doubleSelectedTime: false,

      edgePos: { x: 0, y: 0 },
      edgeId: -1,

      lightPos: { x: 0, y: 0 },

      wordSelected: '',
      wordCanSelect: true,
      recommendClicked: false,
      recommendLoaded: false,
      finish: false,

      popup: false,
      selectedNodeLabel: '',
      popupNodeId: -1,

      bookImg: new Image(),
      leaf1Img: new Image(),
      leaf2Img: new Image(),

      bookThumbnail: this.$route.params.thumbnail,
      bookTitle: '',

      intervals: [],
      timeouts: [],

      aiSupportCount: 0,
    };
  },

  async mounted() {
    this.canvas = document.getElementById('center-canvas');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    // 책 제목 알아내기
    // eslint-disable-next-line
    axios.get('/api/book/' + this.$route.params.bookId, {})
      .then((res) => {
        this.bookTitle = res.data.title;
      });

    this.bookImg.src = this.bookThumbnail;
    // eslint-disable-next-line
    this.leaf1Img.src = require('../../../assets/img/views/activity/mindmap/grape-leaf1.png');
    // eslint-disable-next-line
    this.leaf2Img.src = require('../../../assets/img/views/activity/mindmap/grape-leaf2.png');

    this.canvas.addEventListener('touchstart', (e) => {
      this.startDraw(e);
    }, false);
    this.canvas.addEventListener('touchmove', (e) => {
      this.draw(e);
    }, false);
    // eslint-disable-next-line no-unused-vars
    this.canvas.addEventListener('touchend', (e) => {
      this.finishDraw(e);
    }, false);

    const penBtn = document.querySelector('#mindmap-tool-pen');
    const selectBtn = document.querySelector('#mindmap-tool-select');
    const zoomin = document.querySelector('#mindmap-tool-zoomin');
    const zoomout = document.querySelector('#mindmap-tool-zoomout');
    const deleteBtn = document.querySelector('#mindmap-tool-delete');
    const finishBtn = document.querySelector('#canvas-finish');
    const aiSupportBtn = document.querySelector('#ai-background');
    const aiHelp = document.querySelector('#aiHelp');
    const recommendWords = document.querySelectorAll('.recommend-word');
    const nextBtn = document.querySelector('#right-btn');
    if (penBtn) {
      penBtn.addEventListener('click', this.modePen);
    }
    if (selectBtn) {
      selectBtn.addEventListener('click', this.modeSelect);
    }
    if (zoomin) {
      zoomin.addEventListener('click', this.zoomin);
    }
    if (zoomout) {
      zoomout.addEventListener('click', this.zoomout);
    }
    if (deleteBtn) {
      deleteBtn.addEventListener('click', this.deleteNode);
    }
    if (finishBtn) {
      finishBtn.addEventListener('click', this.finishBtnClicked);
    }
    if (aiSupportBtn) {
      aiSupportBtn.addEventListener('click', this.aiSupportBtnClicked);
    }
    if (aiHelp) {
      aiHelp.addEventListener('click', this.aiHelpSelected);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', this.nextBtnClicked);
    }
    recommendWords.forEach((word) => {
      // eslint-disable-next-line no-unused-vars
      word.addEventListener('click', (e) => {
        this.recommendWordClicked(e);
        this.touchmode = 'word';
        this.wordSelected = word.innerText;
      });
    }, true);

    this.ctx[0].lineJoin = 'round';
    this.ctx[0].scale(0.9, 0.9);
    this.ctx[0].scale(0.9, 0.9);
    this.ctx[0].scale(1, 1);
    this.scale = 0.9 * 0.9;
    this.canvasScale = 0.8;
    this.padding.x = this.canvas.width / 2 - this.canvas.width / (0.9 * 0.9 * 2);
    this.padding.y = this.canvas.height / 2 - this.canvas.height / (0.9 * 0.9 * 2);

    this.edges.push({
      id: 1, from: 0, to: 1,
    });
    this.edges.push({
      id: 2, from: 0, to: 2,
    });
    this.edges.push({
      id: 3, from: 0, to: 3,
    });
    this.edges.push({
      id: 4, from: 0, to: 4,
    });

    const width = this.canvas.width / 2;
    const height = this.canvas.height / 2;

    if (this.templateType === 1) {
      this.nodes.push({
        id: 0, x: width, y: height, size: 125, type: -1, link: true, parent: -1,
      });

      this.nodes.push({
        // eslint-disable-next-line max-len
        id: 1, label: '등장인물', x: width - 240, y: height - 100, size: 80, type: 0, link: true, parent: 0,
      });
      this.nodes.push({
        // eslint-disable-next-line max-len
        id: 2, label: '줄거리', x: width + 240, y: height - 100, size: 80, type: 1, link: true, parent: 0,
      });
      this.nodes.push({
        // eslint-disable-next-line max-len
        id: 3, label: '느낀점', x: width - 240, y: height + 100, size: 80, type: 2, link: true, parent: 0,
      });
      this.nodes.push({
        // eslint-disable-next-line max-len
        id: 4, label: '인상장면', x: width + 240, y: height + 100, size: 80, type: 3, link: true, parent: 0,
      });
    } else if (this.templateType === 2) {
      this.nodes.push({
        id: 0, x: width, y: 0 + 100, size: 150, type: -1, link: true, parent: -1,
      });

      this.nodes.push({
        // eslint-disable-next-line max-len
        id: 1, label: '등장인물', x: width - 320, y: 120, size: 80, type: 0, link: true, parent: 0,
      });
      this.nodes.push({
        // eslint-disable-next-line max-len
        id: 2, label: '줄거리', x: width - 150, y: 300, size: 80, type: 1, link: true, parent: 0,
      });
      this.nodes.push({
        // eslint-disable-next-line max-len
        id: 3, label: '느낀점', x: width + 120, y: 250, size: 80, type: 2, link: true, parent: 0,
      });
      this.nodes.push({
        // eslint-disable-next-line max-len
        id: 4, label: '인상장면', x: width + 300, y: 150, size: 80, type: 3, link: true, parent: 0,
      });
    }

    setTimeout(() => {
      this.reDrawAll(this.padding.x, this.padding.y);
    }, 100);
  },

  methods: {
    enter() {
      this.intervals.forEach(clearInterval);
      this.intervals.length = 0;
      for (let t = 0; t < this.timeouts.length; t += 1) {
        clearTimeout(this.timeouts[t]);
        this.timeouts.splice(t, 1);
      }
      const index = this.nodes.findIndex((element) => element.id === this.popupNodeId);
      this.nodes[index].label = this.selectedNodeLabel;
      // eslint-disable-next-line
      if (this.nodes[index].size / (Math.min(this.nodes[index].label.length - 1, 8)) < 20) {
        this.nodes[index].size = (Math.min(this.nodes[index].label.length - 1, 8)) * 20;
      }
      this.reDrawAll(this.padding.x, this.padding.y);
      this.selectedNodeLabel = '';
      this.popupNodeId = -1;
      const htmlInput = document.querySelector('#input-test');
      htmlInput.value = '';
      htmlInput.blur();
    },
    initSetting(changeX, changeY) {
      const paddingX = changeX + this.padding.x;
      const paddingY = changeY + this.padding.y;

      // 나무 템플릿
      if (this.templateType === 1) {
        const width = this.canvas.width / 2;
        const height = this.canvas.height / 2;

        // 종료시 배경 그리기 (땅, 구름)
        if (this.finish) {
          // 땅 그리기
          this.ctx[0].fillStyle = '#44A508';
          this.ctx[0].beginPath();
          this.ctx[0].moveTo(width - 1500 - paddingX, height + 1000 - paddingY);
          this.ctx[0].lineTo(width - 1500 - paddingX, height + 400 - paddingY);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(width - 500 - paddingX, height + 100 - paddingY, width + 500 - paddingX, height + 100 - paddingY, width + 1500 - paddingX, height + 400 - paddingY);
          this.ctx[0].lineTo(width + 1500 - paddingX, height + 1000 - paddingY);
          this.ctx[0].closePath();
          this.ctx[0].fill();

          // 구름 1 그리기
          this.drawCloud(400, 300, paddingX, paddingY);

          // 구름 2 그리기
          this.drawCloud(-400, 600, paddingX, paddingY);
        }

        // 템플릿(나무) 그리기
        this.ctx[0].beginPath();
        // eslint-disable-next-line max-len
        this.ctx[0].moveTo(width - paddingX, height - 80 - paddingY);
        this.ctx[0].strokeStyle = '#7ed221';
        this.ctx[0].fillStyle = '#7ed221';
        // eslint-disable-next-line max-len
        this.ctx[0].bezierCurveTo(width - 250 - paddingX, height - 200 - paddingY, width - 250 - paddingX, height + 180 - paddingY, width - paddingX, height + 120 - paddingY);
        // eslint-disable-next-line max-len
        this.ctx[0].moveTo(width - 5 - paddingX, height + 120 - paddingY);
        // eslint-disable-next-line max-len
        this.ctx[0].bezierCurveTo(width + 200 - paddingX, height + 180 - paddingY, width + 200 - paddingX, height - 150 - paddingY, width - 5 - paddingX, height - 80 - paddingY);
        this.ctx[0].fill();

        // 나무 줄기 그리기
        this.ctx[0].beginPath();
        this.ctx[0].fillStyle = '#836d4b';
        // eslint-disable-next-line max-len
        this.ctx[0].fillRect(width - 20 - paddingX, height * 0.9 - paddingY + height / 3, 40, 140);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#836d4b';
        // eslint-disable-next-line max-len
        this.ctx[0].arc(width - paddingX, height * 0.9 - paddingY, height / 3, Math.PI * 0.25, Math.PI * 0.75);
        this.ctx[0].stroke();

        // 책 이미지 넣기
        // eslint-disable-next-line
        this.ctx[0].drawImage(this.bookImg, width - 80 - paddingX, height - 150 - paddingY, 150, 200);
        // 포도 템플릿
      } else if (this.templateType === 2) {
        const width = this.canvas.width / 2;
        // const height = this.canvas.height / 2;
        // 잎2
        // eslint-disable-next-line
        this.ctx[0].drawImage(this.leaf1Img, width - paddingX - 450, 0 - paddingY - 300, 700, 600);

        // 잎2
        // eslint-disable-next-line
        this.ctx[0].drawImage(this.leaf2Img, width - paddingX - 150, 0 - paddingY - 300, 700, 600);

        // eslint-disable-next-line
        this.ctx[0].drawImage(this.bookImg, width - paddingX - 75, 0 - paddingY, 150, 200);
      }
    },

    startDraw(event) {
      this.ctx[0].shadowOffsetX = 0;
      this.ctx[0].shadowOffsetY = 0;
      this.intervals.forEach(clearInterval);
      this.intervals.length = 0;
      for (let t = 0; t < this.timeouts.length; t += 1) {
        clearTimeout(this.timeouts[t]);
        this.timeouts.splice(t, 1);
      }
      const htmlInput = document.querySelector('#input-test');
      this.popupNodeId = -1;
      htmlInput.blur();
      if (this.touchmode === 'pen') {
        this.reDrawAll(this.padding.x, this.padding.y);
        this.selectedNode = -1;
        this.ctx[0].beginPath();
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '836d4b';
        const coors = this.getPosition(event);
        this.ctx[0].moveTo(coors.X, coors.Y);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
        this.maxPos.T = coors.Y;
        this.maxPos.B = coors.Y;
        this.maxPos.L = coors.X;
        this.maxPos.R = coors.X;
      } else if (this.touchmode === 'drag') {
        this.selectedNode = -1;
        const coors = this.getPosition(event);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
      } else if (this.touchmode === 'select') {
        this.selectedNode = -1;
        this.selectedNodeLabel = '';
        // 노드에 연결 안돼있는 엣지 제거
        if (this.edgeId !== -1) {
          const index = this.edges.findIndex((element) => element.id === this.edgeId);
          this.edges.splice(index, 1);
          this.edgeId = -1;
        }
        this.reDrawAll(this.padding.x, this.padding.y);
        const coors = this.getPosition(event);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;

        for (let i = 1; i < this.nodes.length; i += 1) {
          // eslint-disable-next-line max-len
          if ((this.nodes[i].x - this.nodes[i].size - this.padding.x < coors.X && coors.X < this.nodes[i].x + this.nodes[i].size - this.padding.x) && (this.nodes[i].y - this.nodes[i].size - this.padding.y < coors.Y && coors.Y < this.nodes[i].y + this.nodes[i].size - this.padding.y)) {
            if (this.selectedNode !== -1) {
              // eslint-disable-next-line max-len
              const loc1 = (Math.abs(this.nodes[i].x - this.padding.x - coors.X)) / 2 + (Math.abs(this.nodes[i].y - this.padding.y - coors.Y)) / 2;
              // eslint-disable-next-line max-len
              const loc2 = (Math.abs(this.nodes[this.selectedNode].x - this.padding.x - coors.X)) / 2 + Math.abs((this.nodes[this.selectedNode].y - this.padding.y - coors.Y)) / 2;
              if (loc1 < loc2) {
                this.selectedNode = this.nodes[i].id;
              }
            }
            this.selectedNode = this.nodes[i].id;
          }
        }
        if (this.selectedNode !== -1) {
          const node = this.nodes.find((element) => element.id === this.selectedNode);
          this.reDrawAll(this.padding.x, this.padding.y);
          // eslint-disable-next-line max-len
          this.highlightNode(node.x - this.padding.x, node.y - this.padding.y, node.size, node.type);
        }
      } else if (this.touchmode === 'word') {
        const coors = this.getPosition(event);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
      }
    },

    draw(event) {
      if (this.touchmode === 'pen') {
        const coors = this.getPosition(event);
        this.ctx[0].lineTo(coors.X, coors.Y);
        this.ctx[0].stroke();

        if (coors.X > this.maxPos.R) this.maxPos.R = coors.X;
        else if (coors.X < this.maxPos.L) this.maxPos.L = coors.X;
        if (coors.Y > this.maxPos.T) this.maxPos.T = coors.Y;
        else if (coors.Y < this.maxPos.B) this.maxPos.B = coors.Y;
      } else if (this.touchmode === 'drag') {
        const coors = this.getPosition(event);
        const changeX = this.startPos.x - coors.X;
        const changeY = this.startPos.y - coors.Y;

        this.reDrawAll(this.padding.x + changeX, this.padding.y + changeY);
      } else if (this.touchmode === 'select') {
        if (this.selectedNode !== -1) {
          const coors = this.getPosition(event);
          const index = this.nodes.findIndex((element) => element.id === this.selectedNode);
          const node = this.nodes.find((element) => element.id === this.selectedNode);

          this.nodes[index].x = coors.X + this.padding.x;
          this.nodes[index].y = coors.Y + this.padding.y;

          this.reDrawAll(this.padding.x, this.padding.y);

          // eslint-disable-next-line max-len
          this.highlightNode(node.x - this.padding.x, node.y - this.padding.y, node.size, node.type);
        }
      } else if (this.touchmode === 'word') {
        this.reDrawAll(this.padding.x, this.padding.y);
        const coors = this.getPosition(event);
        const nodex = (coors.X + this.startPos.x) / 2;
        const nodey = (coors.Y + this.startPos.y) / 2;
        // eslint-disable-next-line max-len
        const nodesize = Math.abs(coors.X - this.startPos.x) / 2 + Math.abs(coors.Y - this.startPos.y) / 2;
        const nodetype = Math.floor(this.startPos.x + this.startPos.y) % 4;
        this.makeNode(nodex, nodey, nodesize, nodetype, this.wordSelected);
      }
    },

    finishDraw(event) {
      if (this.touchmode === 'pen') {
        // 초기화
        const htmlInput = document.querySelector('#input-test');
        htmlInput.value = '';
        this.selectedNodeLabel = '';
        this.popupNodeId = -1;

        const coors = this.getPosition(event);
        // eslint-disable-next-line max-len
        const thresh = (this.startPos.x - coors.X) * (this.startPos.x - coors.X) + (this.startPos.y - coors.Y) * (this.startPos.y - coors.Y);

        if (thresh > 3000) {
          let edgeFrom = -1;
          let edgeTo = -1;

          // 노드에 연결 안돼있는 엣지 제거
          if (this.edgeId !== -1) {
            const index = this.edges.findIndex((element) => element.id === this.edgeId);
            this.edges.splice(index, 1);
            this.edgeId = -1;
          }

          // edgeFrom 검사
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < this.nodes.length; i++) {
            const nodesize = this.nodes[i].size;
            // eslint-disable-next-line max-len
            if ((this.nodes[i].y + nodesize > this.startPos.y + this.padding.y && this.nodes[i].y - nodesize < this.startPos.y + this.padding.y) && (this.nodes[i].x - nodesize < this.startPos.x + this.padding.x && this.nodes[i].x + nodesize > this.startPos.x + this.padding.x)) {
              edgeFrom = this.nodes[i].id;
            }
          }

          // edgeTo 검사
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < this.nodes.length; i++) {
            const nodesize = this.nodes[i].size;
            // eslint-disable-next-line max-len
            if ((this.nodes[i].y + nodesize > coors.Y + this.padding.y && this.nodes[i].y - nodesize < coors.Y + this.padding.y) && (this.nodes[i].x - nodesize < coors.X + this.padding.x && this.nodes[i].x + nodesize > coors.X + this.padding.x)) {
              edgeTo = this.nodes[i].id;
            }
          }

          // edge가 아닐때
          if (edgeFrom === -1 && edgeTo === -1) {
            this.reDrawAll(this.padding.x, this.padding.y);

            // 하나만 연결된 edge일 때
          } else if (edgeFrom === -1 || edgeTo === -1) {
            const newid = new Date().getTime();
            this.edges.push({ id: newid, from: edgeFrom, to: edgeTo });
            this.edgeId = newid;
            this.edgePos.x = coors.X + this.padding.x;
            this.edgePos.y = coors.Y + this.padding.y;
            this.reDrawAll(this.padding.x, this.padding.y);
            // edge일 때
          } else {
            const newid = new Date().getTime();
            this.edges.push({ id: newid, from: edgeFrom, to: edgeTo });

            const nodeindex1 = this.nodes.findIndex((element) => element.id === edgeFrom);
            const nodeindex2 = this.nodes.findIndex((element) => element.id === edgeTo);
            if (this.nodes[nodeindex1].link === false) {
              this.nodes[nodeindex1].link = true;
              this.nodes[nodeindex1].parent = edgeTo;
            } else {
              this.nodes[nodeindex2].link = true;
              this.nodes[nodeindex2].parent = edgeFrom;
            }
            this.reDrawAll(this.padding.x, this.padding.y);
          }

          // edge 없는 노드 삭제
          for (let i = 1; i < this.nodes.length; i += 1) {
            if (this.nodes[i].link === false) {
              // 노드 삭제
              const deleteNodeid = this.nodes[i].id;
              this.nodes.splice(i, 1);

              for (let j = 0; j < this.edges.length; j += 1) {
                if (this.edges[j].to === deleteNodeid || this.edges[j].from === deleteNodeid) {
                  this.edges.splice(j, 1);
                  j -= 1;
                }
              }
              i -= 1;
            }
          }
          this.reDrawAll(this.padding.x, this.padding.y);
          // 노드일 때
        } else {
          // edge 없는 노드 삭제
          for (let i = 1; i < this.nodes.length; i += 1) {
            if (this.nodes[i].link === false) {
              // 노드 삭제
              const deleteNodeid = this.nodes[i].id;
              this.nodes.splice(i, 1);

              for (let j = 0; j < this.edges.length; j += 1) {
                if (this.edges[j].to === deleteNodeid || this.edges[j].from === deleteNodeid) {
                  this.edges.splice(j, 1);
                  j -= 1;
                }
              }
              i -= 1;
            }
          }
          htmlInput.focus();

          let nodesize = 50;
          const size = (this.maxPos.R - this.maxPos.L) / 2 + (this.maxPos.T - this.maxPos.B) / 2;

          // 원처럼 그렸을 때
          if (size > 60) {
            nodesize = Math.max(size / 2, 80);

            const newid = new Date().getTime();
            this.popupNodeId = newid;
            this.nodes.push({
              // eslint-disable-next-line max-len
              id: newid, label: ' ', x: (this.maxPos.L + this.maxPos.R) / 2 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, size: nodesize, type: newid % 4, link: false, parent: -1,
            });

            // 노드에 연결 안돼있는 엣지 제거
            if (this.edgeId !== -1) {
              // eslint-disable-next-line max-len
              if (((this.maxPos.L + this.maxPos.R) / 2 + this.padding.x - nodesize < this.edgePos.x && this.edgePos.x < (this.maxPos.L + this.maxPos.R) / 2 + this.padding.x + nodesize) && ((this.maxPos.T + this.maxPos.B) / 2 + this.padding.y - nodesize < this.edgePos.y && this.edgePos.y < (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y + nodesize)) {
                const index = this.edges.findIndex((element) => element.id === this.edgeId);
                const nodeindex = this.nodes.findIndex((element) => element.id === newid);
                if (this.edges[index].to === -1) {
                  this.edges[index].to = newid;
                  this.nodes[nodeindex].parent = this.edges[index].from;
                  this.nodes[nodeindex].link = true;
                } else {
                  this.edges[index].from = newid;
                  this.nodes[nodeindex].parent = this.edges[index].to;
                  this.nodes[nodeindex].link = true;
                }
              } else {
                const index = this.edges.findIndex((element) => element.id === this.edgeId);
                this.edges.splice(index, 1);
              }
            }
            this.edgeId = -1;

            this.reDrawAll(this.padding.x, this.padding.y);

            const index = this.nodes.findIndex((element) => element.id === this.popupNodeId);
            const node = this.nodes[index];
            const fontsize = Math.max(node.size / 8, 20);

            this.ctx[0].beginPath();
            this.ctx[0].strokeStyle = 'black';
            this.ctx[0].lineWidth = 3;
            this.ctx[0].setLineDash([5, 2]);
            // eslint-disable-next-line
            this.ctx[0].rect(node.x - node.size / 1.5 - this.padding.x - fontsize, node.y - this.padding.y - fontsize * 1.5, node.size * (4 / 3) + fontsize * 2, fontsize * 1.5 * 1.8);
            this.ctx[0].stroke();

            this.inputNodeLabel('');
          } else {
            this.reDrawAll(this.padding.x, this.padding.y);
          }
        }
        this.startPos.x = -1;
        this.startPos.y = -1;
        this.maxPos.T = -1;
        this.maxPos.B = -1;
        this.maxPos.L = -1;
        this.maxPos.R = -1;
        this.ctx[0].strokeStyle = '#836d4b';
        this.ctx[0].lineWidth = 12;
        console.log('nodes: ', this.nodes);
        console.log('edges: ', this.edges);
      } else if (this.touchmode === 'drag') {
        const coors = this.getPosition(event);
        this.padding.x += this.startPos.x - coors.X;
        this.padding.y += this.startPos.y - coors.Y;
      } else if (this.touchmode === 'word') {
        const htmlInput = document.querySelector('#input-test');
        htmlInput.value = '';
        this.selectedNodeLabel = '';
        this.popupNodeId = -1;

        this.reDrawAll(this.padding.x, this.padding.y);
        const coors = this.getPosition(event);
        const nodex = (coors.X + this.startPos.x) / 2;
        const nodey = (coors.Y + this.startPos.y) / 2;
        // eslint-disable-next-line max-len
        let nodesize = Math.max(Math.abs(coors.X - this.startPos.x) / 2 + Math.abs(coors.Y - this.startPos.y) / 2, 80);
        console.log(nodesize, (Math.min(this.wordSelected.length - 1, 8)));

        // nodesize 조정
        if (nodesize / (Math.min(this.wordSelected.length - 1, 8)) < 20) {
          nodesize = (Math.min(this.wordSelected.length - 1, 8)) * 20;
        }
        console.log(nodesize);
        const nodetype = Math.floor(this.startPos.x + this.startPos.y) % 4;
        const newid = new Date().getTime();

        // edge 없는 노드 삭제
        for (let i = 1; i < this.nodes.length; i += 1) {
          if (this.nodes[i].link === false) {
            // 노드 삭제
            const deleteNodeid = this.nodes[i].id;
            this.nodes.splice(i, 1);

            for (let j = 0; j < this.edges.length; j += 1) {
              if (this.edges[j].to === deleteNodeid || this.edges[j].from === deleteNodeid) {
                this.edges.splice(j, 1);
                j -= 1;
              }
            }
            i -= 1;
          }
        }

        this.nodes.push({
          // eslint-disable-next-line max-len
          id: newid, label: this.wordSelected, x: nodex + this.padding.x, y: nodey + this.padding.y, size: nodesize, type: nodetype, link: false, parent: -1,
        });
        this.aiSupportCount += 1;

        // 노드에 연결 안돼있는 엣지 제거
        if (this.edgeId !== -1) {
          // eslint-disable-next-line max-len
          if ((nodex + this.padding.x - nodesize < this.edgePos.x && this.edgePos.x < nodex + this.padding.x + nodesize) && (nodey + this.padding.y - nodesize < this.edgePos.y && this.edgePos.y < nodey + this.padding.y + nodesize)) {
            const index = this.edges.findIndex((element) => element.id === this.edgeId);
            const nodeindex = this.nodes.findIndex((element) => element.id === newid);
            if (this.edges[index].to === -1) {
              this.edges[index].to = newid;
              this.nodes[nodeindex].parent = this.edges[index].from;
              this.nodes[nodeindex].link = true;
            } else {
              this.edges[index].from = newid;
              this.nodes[nodeindex].parent = this.edges[index].to;
              this.nodes[nodeindex].link = true;
            }
          } else {
            const index = this.edges.findIndex((element) => element.id === this.edgeId);
            this.edges.splice(index, 1);
          }
        }
        this.reDrawAll(this.padding.x, this.padding.y);

        this.edgeId = -1;
        this.wordSelected = false;
        this.wordSelected = '';
        this.touchmode = 'drag';
        // tool reset
        const pen = document.querySelector('#mindmap-tool-pen');
        const select = document.querySelector('#mindmap-tool-select');
        pen.parentElement.style.border = '3px solid rgba(184, 182, 172, 0.8)';
        select.parentElement.style.border = '3px solid rgba(184, 182, 172, 0.8)';

        this.resetWordBackground();
      } else if (this.touchmode === 'select') {
        if (this.doubleSelectedNode === this.selectedNode) {
          if (this.doubleSelectedTime) {
            const node = this.nodes.find((element) => element.id === this.selectedNode);
            const htmlInput = document.querySelector('#input-test');
            htmlInput.focus();
            this.popupNodeId = this.selectedNode;
            this.inputNodeLabel('');
            this.selectedNodeLabel = node.label;

            this.doubleSelectedTime = false;
          } else {
            this.doubleSelectedTime = true;
            this.doubleSelectedNode = this.selectedNode;
            setTimeout(() => {
              if (this.popupNodeId !== -1) {
                const htmlInput = document.querySelector('#input-test');
                htmlInput.focus();
              }
              this.doubleSelectedTime = false;
            }, 200);
          }
        } else {
          this.doubleSelectedTime = true;
          this.doubleSelectedNode = this.selectedNode;
          setTimeout(() => {
            if (this.popupNodeId !== -1) {
              const htmlInput = document.querySelector('#input-test');
              htmlInput.focus();
            }
            this.doubleSelectedTime = false;
          }, 200);
        }
      }
    },

    reDrawAll(paddingX, paddingY) {
      this.ctx[0].clearRect(0, 0, 100000, 100000);
      this.ctx[0].beginPath();
      this.ctx[0].setLineDash([]);
      this.ctx[0].shadowOffsetX = 0;
      this.ctx[0].shadowOffsetY = 0;

      if (this.templateType === 1) {
        // edge 먼저 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.edges.length; i++) {
          let from = this.nodes.find((element) => element.id === this.edges[i].from);
          let to = this.nodes.find((element) => element.id === this.edges[i].to);
          if (this.edges[i].from === -1) from = { x: this.edgePos.x, y: this.edgePos.y };
          else if (this.edges[i].to === -1) to = { x: this.edgePos.x, y: this.edgePos.y };
          // eslint-disable-next-line max-len
          this.drawEdge(from.x - paddingX, from.y - paddingY, to.x - paddingX, to.y - paddingY);
        }

        // 템플릿 그리기
        this.initSetting(paddingX - this.padding.x, paddingY - this.padding.y);

        // node 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.nodes.length; i++) {
          // eslint-disable-next-line max-len
          this.makeNode(this.nodes[i].x - paddingX, this.nodes[i].y - paddingY, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
        }
      } else if (this.templateType === 2) {
        this.lightPos.x = this.canvas.width / 2 - paddingX;
        this.lightPos.y = -100 - paddingY;
        // 템플릿 그리기
        this.initSetting(paddingX - this.padding.x, paddingY - this.padding.y);

        // edge 먼저 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.edges.length; i++) {
          let from = this.nodes.find((element) => element.id === this.edges[i].from);
          let to = this.nodes.find((element) => element.id === this.edges[i].to);
          if (this.edges[i].from === -1) from = { x: this.edgePos.x, y: this.edgePos.y };
          else if (this.edges[i].to === -1) to = { x: this.edgePos.x, y: this.edgePos.y };
          // eslint-disable-next-line max-len
          this.drawEdge(from.x - paddingX, from.y - paddingY, to.x - paddingX, to.y - paddingY);
        }

        // eslint-disable-next-line
        this.ctx[0].drawImage(this.bookImg, this.canvas.width / 2 - paddingX - 75, 0 - paddingY, 150, 200);

        // node 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.nodes.length; i++) {
          // eslint-disable-next-line max-len
          this.makeNode(this.nodes[i].x - paddingX, this.nodes[i].y - paddingY, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
        }
      }
    },

    getPosition(event) {
      const touches = event.changedTouches;
      const x = (touches[0].clientX - this.canvas.offsetLeft);
      const y = (touches[0].clientY - this.canvas.offsetTop);
      const bound = this.canvas.getBoundingClientRect();
      return { X: (x - bound.left) / this.scale, Y: (y - bound.top) / this.scale };
    },

    makeNode(x, y, size, type, text) {
      let fontsize = size / 4;
      let linesize = 1;
      let textLength = 0;
      if (text !== undefined) {
        textLength = this.getTextLength(text);
        if (textLength > 16) fontsize /= 2;
        else if (textLength > 10) fontsize = size / (textLength / 2 - 1);
        linesize = Math.floor(textLength / 20) + 1;
        if (textLength % 20 === 0) linesize -= 1;
      }

      if (this.templateType === 1) {
        if (type === 0) {
          // 나뭇잎1 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].fillStyle = '#7ed221';

          this.ctx[0].moveTo(x, y - size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size / 2, y - size * 0.9, x - size * 1.2, y - size * 0.7, x - size * 0.8, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1.2, y + size * 0.6, x, y + size * 0.8, x + size / 4, y + size * 0.4);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.8, y + size * 0.6, x + size * 0.9, y + size / 8, x + size * 0.75, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size, y - size * 0.8, x, y - size * 0.8, x, y - size * 0.6);
          this.ctx[0].fill();

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 20 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 19 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
          }
        } else if (type === 1) {
          // 나뭇잎2 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].fillStyle = '#7ed221';

          this.ctx[0].moveTo(x, y - size / 2);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size / 4, y - size * 0.9, x - size, y - size * 0.6, x - size * 0.8, y - size * 0.2);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1.3, y + size / 4, x - size / 2, y + size * 0.8, x - size / 4, y + size / 2);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size / 2, y + size * 0.9, x + size * 1, y + size * 0.3, x + size * 0.75, y - 5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size, y - size / 2, x + size * 0.2, y - size * 0.9, x, y - size / 2);
          this.ctx[0].fill();

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 20 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 19 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
          }
        } else if (type === 2) {
          // 나뭇잎3 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].fillStyle = '#7ed221';

          this.ctx[0].moveTo(x + size * 0.2, y - size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x, y - size * 0.8, x - size * 0.4, y - size * 0.8, x - size * 0.5, y - size * 0.6);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1, y - size * 0.7, x - size * 1.2, y, x - size * 0.7, y + size * 0.1);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 0.9, y + size * 0.6, x - size * 0.2, y + size * 0.8, x, y + size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.7, y + size * 0.7, x + size * 0.9, y + size * 0.2, x + size * 0.7, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 1.1, y - size * 0.3, x + size * 0.35, y - size * 0.9, x + size * 0.2, y - size * 0.6);
          this.ctx[0].fill();

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 20 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 19 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
          }
        } else if (type === 3) {
          // 나뭇잎4 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].fillStyle = '#7ed221';

          this.ctx[0].moveTo(x + size * 0.3, y - size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.1, y - size * 0.75, x - size * 0.2, y - size * 0.75, x - size * 0.4, y - size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 0.8, y - size * 0.7, x - size * 1, y - size * 0.2, x - size * 0.7, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1.1, y + size * 0.4, x - size * 0.3, y + size * 0.8, x - size * 0.1, y + size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.15, y + size * 0.65, x + size * 0.3, y + size * 0.55, x + size * 0.4, y + size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.9, y + size * 0.7, x + size * 1.2, y, x + size * 0.8, y - size * 0.1);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 1.0, y - size * 0.8, x + size * 0.2, y - size * 0.7, x + size * 0.3, y - size * 0.6);
          this.ctx[0].fill();

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 20 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 19 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
          }
        }
      } else if (this.templateType === 2) {
        // eslint-disable-next-line
        var lightRad = Math.atan2(y - this.lightPos.y, this.lightPos.x - x);
        const r = size * 0.8;
        if (type === 0) {
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 4;
          this.ctx[0].shadowColor = 'rgba(0, 0, 0, 0.25)';
          this.ctx[0].shadowBlur = 4;
          this.ctx[0].fillStyle = '#7159BA';
          this.ctx[0].beginPath();
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].fill();

          this.ctx[0].fillStyle = 'white';
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 0;
          this.ctx[0].shadowBlur = 0;
          this.ctx[0].beginPath();
          // eslint-disable-next-line max-len
          this.ctx[0].translate(x + r * Math.cos(lightRad), y - r * Math.sin(lightRad));
          this.ctx[0].rotate(-lightRad);
          this.ctx[0].moveTo(0, -size * 0.15);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.05, -size * 0.15, -size * 0.1, -size * 0.075, -size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.1, size * 0.075, -size * 0.05, size * 0.15, 0, size * 0.15);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.05, size * 0.15, size * 0.1, size * 0.075, size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.1, -size * 0.075, size * 0.05, -size * 0.15, 0, -size * 0.15);
          this.ctx[0].fill();
          this.ctx[0].rotate(+lightRad);
          // eslint-disable-next-line max-len
          this.ctx[0].translate(-(x + r * Math.cos(lightRad)), -(y - r * Math.sin(lightRad)));

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 20 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 19 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
          }
        } else if (type === 1) {
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 4;
          this.ctx[0].shadowColor = 'rgba(0, 0, 0, 0.25)';
          this.ctx[0].shadowBlur = 4;
          this.ctx[0].fillStyle = '#AC92EB';
          this.ctx[0].beginPath();
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].fill();

          this.ctx[0].fillStyle = 'white';
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 0;
          this.ctx[0].shadowBlur = 0;
          this.ctx[0].beginPath();
          // eslint-disable-next-line max-len
          this.ctx[0].translate(x + r * Math.cos(lightRad), y - r * Math.sin(lightRad));
          this.ctx[0].rotate(-lightRad);
          this.ctx[0].moveTo(0, -size * 0.18);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.05, -size * 0.18, -size * 0.1, -size * 0.15, -size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.1, size * 0.15, -size * 0.05, size * 0.18, 0, size * 0.18);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.05, size * 0.18, size * 0.1, size * 0.15, size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.1, -size * 0.15, size * 0.05, -size * 0.18, 0, -size * 0.18);
          this.ctx[0].fill();
          this.ctx[0].rotate(+lightRad);
          // eslint-disable-next-line max-len
          this.ctx[0].translate(-(x + r * Math.cos(lightRad)), -(y - r * Math.sin(lightRad)));

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 20 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 19 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
          }
        } else if (type === 2) {
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 4;
          this.ctx[0].shadowColor = 'rgba(0, 0, 0, 0.25)';
          this.ctx[0].shadowBlur = 4;
          this.ctx[0].fillStyle = '#B8AAD1';
          this.ctx[0].beginPath();
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].fill();

          this.ctx[0].fillStyle = 'white';
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 0;
          this.ctx[0].shadowBlur = 0;
          this.ctx[0].beginPath();
          // eslint-disable-next-line max-len
          this.ctx[0].translate(x + r * Math.cos(lightRad), y - r * Math.sin(lightRad));
          this.ctx[0].rotate(-lightRad);
          this.ctx[0].moveTo(0, -size * 0.18);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.05, -size * 0.18, -size * 0.1, -size * 0.15, -size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.1, size * 0.15, -size * 0.05, size * 0.18, 0, size * 0.18);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.05, size * 0.18, size * 0.1, size * 0.15, size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.1, -size * 0.15, size * 0.05, -size * 0.18, 0, -size * 0.18);
          this.ctx[0].fill();
          this.ctx[0].rotate(+lightRad);
          // eslint-disable-next-line max-len
          this.ctx[0].translate(-(x + r * Math.cos(lightRad)), -(y - r * Math.sin(lightRad)));

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 20 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 19 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
          }
        } else if (type === 3) {
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 4;
          this.ctx[0].shadowColor = 'rgba(0, 0, 0, 0.25)';
          this.ctx[0].shadowBlur = 4;
          this.ctx[0].fillStyle = '#784DFF';
          this.ctx[0].beginPath();
          this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
          this.ctx[0].fill();

          this.ctx[0].fillStyle = 'white';
          this.ctx[0].shadowOffsetX = 0;
          this.ctx[0].shadowOffsetY = 0;
          this.ctx[0].shadowBlur = 0;
          this.ctx[0].beginPath();
          // eslint-disable-next-line max-len
          this.ctx[0].translate(x + r * Math.cos(lightRad), y - r * Math.sin(lightRad));
          this.ctx[0].rotate(-lightRad);
          this.ctx[0].moveTo(0, -size * 0.15);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.05, -size * 0.15, -size * 0.1, -size * 0.075, -size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(-size * 0.1, size * 0.075, -size * 0.05, size * 0.15, 0, size * 0.15);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.05, size * 0.15, size * 0.1, size * 0.075, size * 0.1, 0);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(size * 0.1, -size * 0.075, size * 0.05, -size * 0.15, 0, -size * 0.15);
          this.ctx[0].fill();
          this.ctx[0].rotate(+lightRad);
          // eslint-disable-next-line max-len
          this.ctx[0].translate(-(x + r * Math.cos(lightRad)), -(y - r * Math.sin(lightRad)));

          let stringLine = 0;
          let stringSIndex = 0;
          let stringLength = 0;

          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';

          if (linesize !== 1) {
            for (let i = 0; i < text.length; i += 1) {
              if (escape(text.charAt(i)).length === 6) stringLength += 1;
              stringLength += 1;
              if (stringLength === 20 || i === text.length - 1) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              } else if (stringLength === 19 && escape(text.charAt(i + 1).length === 6)) {
                // eslint-disable-next-line
                this.ctx[0].fillText(text.substring(stringSIndex, i + 1), x - size / 1.5 + fontsize / 2, y - ((linesize - 1) * 1.5 * fontsize) / 2 + fontsize * 1.5 * stringLine + fontsize / 4);
                stringLength = 0;
                stringSIndex = i + 1;
                stringLine += 1;
              }
            }
          } else {
            this.ctx[0].fillText(text, x - (fontsize / 2) * (textLength / 2), y + fontsize / 4);
          }
        }
      }
    },

    highlightNode(x, y, size, type) {
      if (this.templateType === 1) {
        if (type === 0) {
          // 나뭇잎1 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].strokeStyle = '#649a28';
          this.ctx[0].lineWidth = size / 10;

          this.ctx[0].moveTo(x, y - size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size / 2, y - size * 0.9, x - size * 1.2, y - size * 0.7, x - size * 0.8, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1.2, y + size * 0.6, x, y + size * 0.8, x + size / 4, y + size * 0.4);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.8, y + size * 0.6, x + size * 0.9, y + size / 8, x + size * 0.75, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size, y - size * 0.8, x, y - size * 0.8, x, y - size * 0.6);
          this.ctx[0].stroke();
        } else if (type === 1) {
          // 나뭇잎2 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].strokeStyle = '#649a28';
          this.ctx[0].lineWidth = size / 10;

          this.ctx[0].moveTo(x, y - size / 2);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size / 4, y - size * 0.9, x - size, y - size * 0.6, x - size * 0.8, y - size * 0.2);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1.3, y + size / 4, x - size / 2, y + size * 0.8, x - size / 4, y + size / 2);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size / 2, y + size * 0.9, x + size * 1, y + size * 0.3, x + size * 0.75, y - 5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size, y - size / 2, x + size * 0.2, y - size * 0.9, x, y - size / 2);
          this.ctx[0].stroke();
        } else if (type === 2) {
          // 나뭇잎3 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].strokeStyle = '#649a28';
          this.ctx[0].lineWidth = size / 10;

          this.ctx[0].moveTo(x + size * 0.2, y - size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x, y - size * 0.8, x - size * 0.4, y - size * 0.8, x - size * 0.5, y - size * 0.6);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1, y - size * 0.7, x - size * 1.2, y, x - size * 0.7, y + size * 0.1);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 0.9, y + size * 0.6, x - size * 0.2, y + size * 0.8, x, y + size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.7, y + size * 0.7, x + size * 0.9, y + size * 0.2, x + size * 0.7, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 1.1, y - size * 0.3, x + size * 0.35, y - size * 0.9, x + size * 0.2, y - size * 0.6);
          this.ctx[0].stroke();
        } else if (type === 3) {
          // 나뭇잎4 그리기
          this.ctx[0].beginPath();
          // 기본 세팅
          this.ctx[0].strokeStyle = '#649a28';
          this.ctx[0].lineWidth = size / 10;

          this.ctx[0].moveTo(x + size * 0.3, y - size * 0.6);
          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.1, y - size * 0.75, x - size * 0.2, y - size * 0.75, x - size * 0.4, y - size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 0.8, y - size * 0.7, x - size * 1, y - size * 0.2, x - size * 0.7, y);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x - size * 1.1, y + size * 0.4, x - size * 0.3, y + size * 0.8, x - size * 0.1, y + size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.15, y + size * 0.65, x + size * 0.3, y + size * 0.55, x + size * 0.4, y + size * 0.5);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 0.9, y + size * 0.7, x + size * 1.2, y, x + size * 0.8, y - size * 0.1);

          // eslint-disable-next-line max-len
          this.ctx[0].bezierCurveTo(x + size * 1.0, y - size * 0.8, x + size * 0.2, y - size * 0.7, x + size * 0.3, y - size * 0.6);
          this.ctx[0].stroke();
        }
      } else if (this.templateType === 2) {
        if (type === 0) this.ctx[0].strokeStyle = '#5c4a92';
        else if (type === 1) this.ctx[0].strokeStyle = '#866bc6';
        else if (type === 2) this.ctx[0].strokeStyle = '#917fb0';
        else if (type === 3) this.ctx[0].strokeStyle = '#5d37d3';
        this.ctx[0].beginPath();
        this.ctx[0].lineWidth = size / 10;
        this.ctx[0].arc(x, y, size, 0, Math.PI * 2);
        this.ctx[0].stroke();
      }
    },

    drawEdge(x1, y1, x2, y2) {
      this.ctx[0].setLineDash([0, 0]);
      if (this.templateType === 1) {
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(x1, y1);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#baad93';
        this.ctx[0].lineTo(x2, y2);
        this.ctx[0].stroke();
      } else if (this.templateType === 2) {
        this.ctx[0].beginPath();
        this.ctx[0].moveTo(x1, y1);
        this.ctx[0].lineWidth = 12;
        this.ctx[0].strokeStyle = '#9A8653';
        this.ctx[0].lineTo(x2, y2);
        this.ctx[0].stroke();
      }
    },

    modePen() {
      this.resetWordBackground();
      this.ctx[0].lineWidth = 12;
      this.ctx[0].strokeStyle = '#836d4b';

      const pen = document.querySelector('#mindmap-tool-pen');
      if (this.touchmode === 'pen') {
        this.touchmode = 'drag';
        pen.parentElement.style.border = '3px solid rgba(184, 182, 172, 0.8)';
      } else {
        this.touchmode = 'pen';
        pen.parentElement.style.border = '3px solid rgba(255, 255, 255, 0.8)';
        const select = document.querySelector('#mindmap-tool-select');
        select.parentElement.style.border = '3px solid rgba(184, 182, 172, 0.8)';
      }
    },

    modeSelect() {
      this.resetWordBackground();

      const select = document.querySelector('#mindmap-tool-select');
      if (this.touchmode === 'select') {
        this.touchmode = 'drag';
        select.parentElement.style.border = '3px solid rgba(184, 182, 172, 0.8)';
      } else {
        this.touchmode = 'select';
        select.parentElement.style.border = '3px solid rgba(255, 255, 255, 0.8)';
        const pen = document.querySelector('#mindmap-tool-pen');
        pen.parentElement.style.border = '3px solid rgba(184, 182, 172, 0.8)';
      }
    },

    deleteNode() {
      if (this.selectedNode !== -1 && this.selectedNode !== 0) {
        const index = this.nodes.findIndex((element) => element.id === this.selectedNode);
        this.nodes.splice(index, 1);
      }

      for (let i = 0; i < this.edges.length; i += 1) {
        if (this.edges[i].to === this.selectedNode || this.edges[i].from === this.selectedNode) {
          this.edges.splice(i, 1);
          i -= 1;
        }
      }

      // 모든 노드 link false로 바꾸기
      for (let i = 0; i < this.nodes.length; i += 1) {
        this.nodes[i].link = false;
      }

      // 연결 안돼있는 노드 link 검사
      for (let i = 0; i < this.edges.length; i += 1) {
        const toindex = this.nodes.findIndex((element) => element.id === this.edges[i].to);
        const fromindex = this.nodes.findIndex((element) => element.id === this.edges[i].from);
        if (toindex !== -1) this.nodes[toindex].link = true;
        if (fromindex !== -1) this.nodes[fromindex].link = true;
        if (toindex === -1 || fromindex === -1) {
          this.edges.splice(i, 1);
          i -= 1;
        }
      }

      this.reDrawAll(this.padding.x, this.padding.y);
      this.selectedNode = -1;
    },

    zoomin() {
      if (this.canvasScale < 3) {
        this.canvasScale += 0.1;
        this.scale *= 1.1;
        this.ctx[0].scale(1.1, 1.1);
        this.reDrawAll(this.padding.x, this.padding.y);
      }
    },

    zoomout() {
      if (this.canvasScale > 0.1) {
        this.canvasScale -= 0.1;
        this.scale *= 0.9;
        this.ctx[0].scale(0.9, 0.9);
        this.reDrawAll(this.padding.x, this.padding.y);
      }
    },

    nextBtnClicked() {
      this.wordIndex += 6;
      this.wordIndex %= 60;
      const word1 = document.querySelector('#recommend1');
      const word2 = document.querySelector('#recommend2');
      const word3 = document.querySelector('#recommend3');
      const word4 = document.querySelector('#recommend4');
      const word5 = document.querySelector('#recommend5');
      const word6 = document.querySelector('#recommend6');

      word1.innerHTML = this.words[this.wordIndex].word;
      word2.innerHTML = this.words[this.wordIndex + 1].word;
      word3.innerHTML = this.words[this.wordIndex + 2].word;
      word4.innerHTML = this.words[this.wordIndex + 3].word;
      word5.innerHTML = this.words[this.wordIndex + 4].word;
      word6.innerHTML = this.words[this.wordIndex + 5].word;

      this.wordCanSelect = false;
      this.wordSelected = '';
      this.resetWordBackground();

      word1.style.fontSize = '2.5vw'; word1.style.paddingTop = '1vw';
      word2.style.fontSize = '2.5vw'; word2.style.paddingTop = '1vw';
      word3.style.fontSize = '2.5vw'; word3.style.paddingTop = '1vw';
      word4.style.fontSize = '2.5vw'; word4.style.paddingTop = '1vw';
      word5.style.fontSize = '2.5vw'; word5.style.paddingTop = '1vw';
      word6.style.fontSize = '2.5vw'; word6.style.paddingTop = '1vw';

      // eslint-disable-next-line brace-style
      if (word1.innerHTML.length > 5) { word1.style.fontSize = '1.5vw'; word1.style.paddingTop = '1.5vw'; }
      // eslint-disable-next-line brace-style
      else if (word2.innerHTML.length > 5) { word2.style.fontSize = '1.5vw'; word2.style.paddingTop = '1.5vw'; }
      // eslint-disable-next-line brace-style
      else if (word3.innerHTML.length > 5) { word3.style.fontSize = '1.5vw'; word3.style.paddingTop = '1.5vw'; }
      // eslint-disable-next-line brace-style
      else if (word4.innerHTML.length > 5) { word4.style.fontSize = '1.5vw'; word4.style.paddingTop = '1.5vw'; }
      // eslint-disable-next-line brace-style
      else if (word5.innerHTML.length > 5) { word5.style.fontSize = '1.5vw'; word5.style.paddingTop = '1.5vw'; }
      // eslint-disable-next-line brace-style
      else if (word6.innerHTML.length > 5) { word6.style.fontSize = '1.5vw'; word6.style.paddingTop = '1.5vw'; }
      // eslint-disable-next-line brace-style
    },

    aiSupportBtnClicked() {
      this.recommendClicked = true;
      this.recommendLoaded = false;
      const node = this.nodes.find((element) => element.id === this.selectedNode);
      const ancWord = [];
      if (this.selectedNode >= 5) ancWord.push(node.label);
      if (node !== undefined) {
        if (node.parent >= 5) {
          const parentNode = this.nodes.find((element) => element.id === node.parent);
          ancWord.push(parentNode.label);
        }
      }

      // eslint-disable-next-line
      axios.get('/api/book/' + this.$route.params.bookId + '/keyword', {
        params: {
          num: 60, anc: JSON.stringify(ancWord),
        },
      }).then((res) => {
        this.words = res.data.keywords;
        this.wordIndex = 0;

        const word1 = document.querySelector('#recommend1');
        const word2 = document.querySelector('#recommend2');
        const word3 = document.querySelector('#recommend3');
        const word4 = document.querySelector('#recommend4');
        const word5 = document.querySelector('#recommend5');
        const word6 = document.querySelector('#recommend6');

        word1.innerHTML = this.words[0].word;
        word2.innerHTML = this.words[1].word;
        word3.innerHTML = this.words[2].word;
        word4.innerHTML = this.words[3].word;
        word5.innerHTML = this.words[4].word;
        word6.innerHTML = this.words[5].word;

        // eslint-disable-next-line brace-style
        if (word1.innerHTML.length > 5) { word1.style.fontSize = '1.5vw'; word1.style.paddingTop = '1.5vw'; }
        // eslint-disable-next-line brace-style
        else if (word2.innerHTML.length > 5) { word2.style.fontSize = '1.5vw'; word2.style.paddingTop = '1.5vw'; }
        // eslint-disable-next-line brace-style
        else if (word3.innerHTML.length > 5) { word3.style.fontSize = '1.5vw'; word3.style.paddingTop = '1.5vw'; }
        // eslint-disable-next-line brace-style
        else if (word4.innerHTML.length > 5) { word4.style.fontSize = '1.5vw'; word4.style.paddingTop = '1.5vw'; }
        // eslint-disable-next-line brace-style
        else if (word5.innerHTML.length > 5) { word5.style.fontSize = '1.5vw'; word5.style.paddingTop = '1.5vw'; }
        // eslint-disable-next-line brace-style
        else if (word6.innerHTML.length > 5) { word6.style.fontSize = '1.5vw'; word6.style.paddingTop = '1.5vw'; }
        // eslint-disable-next-line brace-style

        this.recommendLoaded = true;
      }).catch((err) => {
        console.warn('ERROR!!!!: ', err);
      });
    },

    recommendWordClicked(e) {
      const word1 = document.querySelector('#recommend1');
      const word2 = document.querySelector('#recommend2');
      const word3 = document.querySelector('#recommend3');
      const word4 = document.querySelector('#recommend4');
      const word5 = document.querySelector('#recommend5');
      const word6 = document.querySelector('#recommend6');

      if (this.wordCanSelect) {
        // eslint-disable-next-line brace-style
        if (e.target.id === 'recommend1') { word1.style.background = '#b6b6b6'; this.wordSelected = word1.innerHTML; }
        // eslint-disable-next-line brace-style
        else if (e.target.id === 'recommend2') { word2.style.background = '#b6b6b6'; this.wordSelected = word2.innerHTML; }
        // eslint-disable-next-line brace-style
        else if (e.target.id === 'recommend3') { word3.style.background = '#b6b6b6'; this.wordSelected = word3.innerHTML; }
        // eslint-disable-next-line brace-style
        else if (e.target.id === 'recommend4') { word4.style.background = '#b6b6b6'; this.wordSelected = word4.innerHTML; }
        // eslint-disable-next-line brace-style
        else if (e.target.id === 'recommend5') { word5.style.background = '#b6b6b6'; this.wordSelected = word5.innerHTML; }
        // eslint-disable-next-line brace-style
        else if (e.target.id === 'recommend6') { word6.style.background = '#b6b6b6'; this.wordSelected = word6.innerHTML; }
        this.wordCanSelect = false;
      } else {
        // eslint-disable-next-line no-lonely-if
        if (e.target.id === 'recommend1') {
          this.resetWordBackground();
          word1.style.background = '#b6b6b6';
          this.wordSelected = word1.innerText;
        } else if (e.target.id === 'recommend2') {
          this.resetWordBackground();
          word2.style.background = '#b6b6b6';
          this.wordSelected = word2.innerText;
        } else if (e.target.id === 'recommend3') {
          this.resetWordBackground();
          word3.style.background = '#b6b6b6';
          this.wordSelected = word3.innerText;
        } else if (e.target.id === 'recommend4') {
          this.resetWordBackground();
          word4.style.background = '#b6b6b6';
          this.wordSelected = word4.innerText;
        } else if (e.target.id === 'recommend5') {
          this.resetWordBackground();
          word5.style.background = '#b6b6b6';
          this.wordSelected = word5.innerText;
        } else if (e.target.id === 'recommend6') {
          this.resetWordBackground();
          word6.style.background = '#b6b6b6';
          this.wordSelected = word6.innerText;
        }
      }
    },

    resetWordBackground() {
      const word1 = document.querySelector('#recommend1');
      const word2 = document.querySelector('#recommend2');
      const word3 = document.querySelector('#recommend3');
      const word4 = document.querySelector('#recommend4');
      const word5 = document.querySelector('#recommend5');
      const word6 = document.querySelector('#recommend6');

      word1.style.background = '#F0EBD7';
      word2.style.background = '#F0EBD7';
      word3.style.background = '#F0EBD7';
      word4.style.background = '#F0EBD7';
      word5.style.background = '#F0EBD7';
      word6.style.background = '#F0EBD7';
    },

    finishBtnClicked() {
      // interval, timeout 모두 제거
      this.intervals.forEach(clearInterval);
      this.intervals.length = 0;
      for (let t = 0; t < this.timeouts.length; t += 1) {
        clearTimeout(this.timeouts[t]);
        this.timeouts.splice(t, 1);
      }

      // 연결 안돼있는 edge 제거
      for (let i = 0; i < this.edges.length; i += 1) {
        if (this.edges[i].from === -1 || this.edges[i].to === -1) {
          this.edges.splice(i, 1);
          i -= 1;
        }
      }

      // 연결 안돼있는 node 제거
      for (let i = 0; i < this.nodes.length; i += 1) {
        if (this.nodes[i].link === false) {
          this.nodes.splice(i, 1);
          i -= 1;
        }
      }

      this.$router.replace({
        name: 'FinishMindMap',
        // eslint-disable-next-line
        params: {
          // eslint-disable-next-line
          nodes: this.nodes, edges: this.edges, template: this.templateType, bookId: this.$route.params.bookId, thumbnail: this.bookThumbnail, bookTitle: this.bookTitle, aiSupportCount: this.aiSupportCount,
        },
      });
    },

    aiHelpSelected() {
      this.aiHelp = !this.aiHelp;
      this.recommendClicked = false;
      this.recommendLoaded = false;
    },

    inputNodeLabel(str) {
      this.intervals.forEach(clearInterval);
      this.intervals.length = 0;
      for (let t = 0; t < this.timeouts.length; t += 1) {
        clearTimeout(this.timeouts[t]);
        this.timeouts.splice(t, 1);
      }

      // 초기 실행
      const index = this.nodes.findIndex((element) => element.id === this.popupNodeId);
      const node = this.nodes[index];
      this.reDrawAll(this.padding.x, this.padding.y);

      // eslint-disable-next-line
      this.makeNode(node.x - this.padding.x, node.y - this.padding.y, node.size, node.type, '');

      // 작은 노드에서 위치 조정하기 위한 변수
      let textpadding = 0;

      const fontsize = Math.max(node.size / 8, 20);
      if (node.size < 160 && node.size > 120) textpadding = 0.5;
      else if (node.size <= 120) textpadding = 1;
      const labelLength = this.getTextLength(str);
      let linesize = Math.floor(labelLength / 20) + 1;
      if (labelLength % 20 === 0 && labelLength !== 0) linesize -= 1;

      this.ctx[0].beginPath();
      this.ctx[0].strokeStyle = 'black';
      this.ctx[0].lineWidth = 3;
      this.ctx[0].setLineDash([5, 2]);
      // eslint-disable-next-line
      this.ctx[0].rect(node.x - node.size / 1.5 - this.padding.x - fontsize, node.y - this.padding.y - fontsize * 1.5, node.size * (4 / 3) + fontsize * 2, fontsize * 1.5 * (linesize + 0.8));
      this.ctx[0].stroke();

      let stringLine = 0;
      let stringSIndex = 0;
      let stringLength = 0;

      this.ctx[0].fillStyle = 'black';
      // eslint-disable-next-line
      this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';

      if (str.length > 0) {
        for (let i = 0; i < str.length; i += 1) {
          if (escape(str.charAt(i)).length === 6) {
            stringLength += 1;
          }
          stringLength += 1;
          if (stringLength === 20) {
            // eslint-disable-next-line
            this.ctx[0].fillText(str.substring(stringSIndex, i + 1), node.x - node.size / 1.5 - this.padding.x, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 1.5 - fontsize * 0.5 * textpadding);

            stringLength = 0;
            stringSIndex = i + 1;
            stringLine += 1;
          } else if (i === str.length - 1) {
            // eslint-disable-next-line
            this.ctx[0].fillText(str.substring(stringSIndex, i + 1), node.x - node.size / 1.5 - this.padding.x, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 1.5 - fontsize * 0.5 * textpadding);

            // 점선 그리기
            // eslint-disable-next-line
            const time = setTimeout(() => {
              this.ctx[0].beginPath();
              // eslint-disable-next-line
              this.ctx[0].moveTo(node.x - node.size / 1.5 - this.padding.x + fontsize * stringLength / 2 + fontsize / 4, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 0.6 - fontsize * 0.5 * textpadding);
              // eslint-disable-next-line
              this.ctx[0].lineTo(node.x - node.size / 1.5 - this.padding.x + fontsize * stringLength / 2 + fontsize / 4, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 1.6 - fontsize * 0.5 * textpadding);
              this.ctx[0].stroke();
            }, 300);
            this.timeouts.push(time);
          } else if (stringLength === 19 && escape(str.charAt(i + 1).length === 6)) {
            // eslint-disable-next-line
            this.ctx[0].fillText(str.substring(stringSIndex, i + 1), node.x - node.size / 1.5 - this.padding.x, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 1.5 - fontsize * 0.5 * textpadding);
            stringLength = 0;
            stringSIndex = i + 1;
            stringLine += 1;
          }
        }

        // 위치 표시를 위한 점선 깜빡임
        const interval = setInterval(() => {
          for (let t = 0; t < this.timeouts.length; t += 1) {
            clearTimeout(this.timeouts[t]);
            this.timeouts.splice(t, 1);
          }
          this.reDrawAll(this.padding.x, this.padding.y);

          // eslint-disable-next-line
          this.makeNode(node.x - this.padding.x, node.y - this.padding.y, node.size, node.type, '');

          this.ctx[0].beginPath();
          this.ctx[0].strokeStyle = 'black';
          this.ctx[0].lineWidth = 3;
          this.ctx[0].setLineDash([5, 2]);
          // eslint-disable-next-line
          this.ctx[0].rect(node.x - node.size / 1.5 - this.padding.x - fontsize, node.y - this.padding.y - fontsize * 1.5, node.size * (4 / 3) + fontsize * 2, fontsize * 1.5 * (linesize + 0.8));
          this.ctx[0].stroke();

          stringLine = 0;
          stringSIndex = 0;
          stringLength = 0;

          this.ctx[0].fillStyle = 'black';
          // eslint-disable-next-line
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';

          for (let i = 0; i < str.length; i += 1) {
            if (escape(str.charAt(i)).length === 6) {
              stringLength += 1;
            }
            stringLength += 1;
            if (stringLength === 20) {
              // eslint-disable-next-line
              this.ctx[0].fillText(str.substring(stringSIndex, i + 1), node.x - node.size / 1.5 - this.padding.x, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 1.5 - fontsize * 0.5 * textpadding);

              stringLength = 0;
              stringSIndex = i + 1;
              stringLine += 1;
            } else if (i === str.length - 1) {
              // eslint-disable-next-line
              this.ctx[0].fillText(str.substring(stringSIndex, i + 1), node.x - node.size / 1.5 - this.padding.x, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 1.5 - fontsize * 0.5 * textpadding);

              // 점선 그리기
              // eslint-disable-next-line
              const time = setTimeout(() => {
                this.ctx[0].beginPath();
                // eslint-disable-next-line
                this.ctx[0].moveTo(node.x - node.size / 1.5 - this.padding.x + fontsize * stringLength / 2 + fontsize / 4, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 0.6 - fontsize * 0.5 * textpadding);
                // eslint-disable-next-line
                this.ctx[0].lineTo(node.x - node.size / 1.5 - this.padding.x + fontsize * stringLength / 2 + fontsize / 4, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 1.6 - fontsize * 0.5 * textpadding);
                this.ctx[0].stroke();
              }, 300);
              this.timeouts.push(time);
            } else if (stringLength === 19 && escape(str.charAt(i + 1).length === 6)) {
              // eslint-disable-next-line
              this.ctx[0].fillText(str.substring(stringSIndex, i + 1), node.x - node.size / 1.5 - this.padding.x, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 1.5 - fontsize * 0.5 * textpadding);
              stringLength = 0;
              stringSIndex = i + 1;
              stringLine += 1;
            }
          }
        }, 1000);
        this.intervals.push(interval);
        // eslint-disable-next-line
      } else if (str.length == 0) {
        stringLength = 0;

        const firsttime = setTimeout(() => {
          this.ctx[0].beginPath();
          this.ctx[0].strokeStyle = 'black';
          this.ctx[0].lineWidth = 3;
          this.ctx[0].setLineDash([5, 2]);
          // eslint-disable-next-line
          this.ctx[0].moveTo(node.x - node.size / 1.5 - this.padding.x + fontsize * stringLength / 2 + fontsize / 4, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 0.6 - fontsize * 0.5 * textpadding);
          // eslint-disable-next-line
          this.ctx[0].lineTo(node.x - node.size / 1.5 - this.padding.x + fontsize * stringLength / 2 + fontsize / 4, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 1.6 - fontsize * 0.5 * textpadding);
          this.ctx[0].stroke();
        }, 300);
        this.timeouts.push(firsttime);

        const interval = setInterval(() => {
          for (let t = 0; t < this.timeouts.length; t += 1) {
            clearTimeout(this.timeouts[t]);
            this.timeouts.splice(t, 1);
          }
          this.reDrawAll(this.padding.x, this.padding.y);

          // eslint-disable-next-line
          this.makeNode(node.x - this.padding.x, node.y - this.padding.y, node.size, node.type, '');

          this.ctx[0].beginPath();
          this.ctx[0].strokeStyle = 'black';
          this.ctx[0].lineWidth = 3;
          this.ctx[0].setLineDash([5, 2]);
          // eslint-disable-next-line
          this.ctx[0].rect(node.x - node.size / 1.5 - this.padding.x - fontsize, node.y - this.padding.y - fontsize * 1.5, node.size * (4 / 3) + fontsize * 2, fontsize * 1.5 * (linesize + 0.8));
          this.ctx[0].stroke();

          const time = setTimeout(() => {
            this.ctx[0].beginPath();
            // eslint-disable-next-line
            this.ctx[0].moveTo(node.x - node.size / 1.5 - this.padding.x + fontsize * stringLength / 2 + fontsize / 4, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 0.6 - fontsize * 0.5 * textpadding);
            // eslint-disable-next-line
            this.ctx[0].lineTo(node.x - node.size / 1.5 - this.padding.x + fontsize * stringLength / 2 + fontsize / 4, node.y - node.size / 6 + fontsize * 1.5 * stringLine - this.padding.y + fontsize * 1.6 - fontsize * 0.5 * textpadding);
            this.ctx[0].stroke();
          }, 300);
          this.timeouts.push(time);
        }, 1000);
        this.intervals.push(interval);
      }
    },

    getTextLength(str) {
      let len = 0;
      for (let i = 0; i < str.length; i += 1) {
        if (escape(str.charAt(i)).length === 6) {
          len += 1;
        }
        len += 1;
        if (len % 10 === 9 && i < str.length - 1) {
          if (escape(str.charAt(i)).length === 6) {
            len += 1;
          }
        }
      }
      return len;
    },
  },

  watch: {
    selectedNodeLabel() {
      // eslint-disable-next-line
      if (this.popupNodeId != -1) {
        this.inputNodeLabel(this.selectedNodeLabel);
        const htmlInput = document.querySelector('#input-test');
        htmlInput.focus();
      }
    },
  },

  beforeDestroy() {
    // interval, timeout 모두 제거
    this.intervals.forEach(clearInterval);
    this.intervals.length = 0;
    for (let t = 0; t < this.timeouts.length; t += 1) {
      clearTimeout(this.timeouts[t]);
      this.timeouts.splice(t, 1);
    }
  },
};
</script>

<style scoped>
#center-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fffdf2;
  z-index: 5;
  border-radius: 1vw;
  top: 0;
  left: 0;
}

#mindmap-tool-bar {
  position: absolute;
  width: 6vw;
  height: 31vw;
  background: rgba(184, 182, 172, 0.5);
  z-index: 20;
  border-radius: 1vw;
  top: calc(50% - 15.5vw);
  left: calc(100% - 7vw);
}
.mindmap-tools {
  width: 5vw;
  height: 5vw;
  padding: calc(0.5vw - 1.5px);
  margin: 0.5vw;
  margin-top: 1vw;
  margin-bottom: 1vw;
  background: rgba(184, 182, 172, 0.8);
  border: 3px solid rgba(184, 182, 172, 0.8);
  border-radius: 1vw;
}

#mindmap-tool-pen {
  width: 4vw;
  height: 4vw;
  background-image: url('../../../assets/img/views/activity/mindmap/pen.png');
  background-size: cover;
  background-repeat: no-repeat;
}
#mindmap-tool-select {
  width: 4vw;
  height: 4vw;
  background-image: url('../../../assets/img/views/activity/mindmap/select.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
#mindmap-tool-zoomin {
  width: 4vw;
  height: 4vw;
  background-image: url('../../../assets/img/views/activity/mindmap/zoom-in.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
#mindmap-tool-zoomout {
  width: 4vw;
  height: 4vw;
  background-image: url('../../../assets/img/views/activity/mindmap/zoom-out.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
#mindmap-tool-delete {
  width: 4vw;
  height: 4vw;
  background-image: url('../../../assets/img/views/activity/mindmap/delete.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

#center-recommend {
  position: relative;
  width: 95%;
  height: 22%;
  background: lightgray;
  border-radius: 20px;
  z-index: 15;
  top: 72%;
  left: 2.5%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
#ai-img {
  position: absolute;
  background-image: url('../../../assets/img/views/activity/mindmap/ai-recommend.png');
  background-size: cover;
  width: 12vw;
  height: 18vh;
  z-index: 18;
  display: inline-block;
  margin-left: 0.5vw;
}
#ai-background {
  position: absolute;
  width: 12vw;
  height: 100%;
  border-radius: 20px;
  background: #FFAE00;
  display: inline-block;
}
#ai-space {
  position: absolute;
  width: 2vw;
  height: 100%;
  left: 10.5vw;
  background: #FFAE00;
  display: inline-block
}
#ai-dotline {
  position: absolute;
  width: 0.5vw;
  height: 100%;
  left: 12.5vw;
}
#ai-dot {
  width: 100%;
  height: 1.8vh;
  background: #8BA9A3;
  margin-bottom: 0.72vw;
}

#recommend-words {
  position: absolute;
  width: 65%;
  height: 100%;
  margin-left: 20%;
}
#recommend-start {
  position: absolute;
  width: 80%;
  height: 100%;
  margin-left: 18%;
  font-size: 2.8vw;
  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: 900;
  text-align: center;
  padding-top: 4vw;
  color: black;
}
#recommend-loading {
  position: absolute;
  margin-left: 50%;
  margin-top: 5%;
  width: 7vw;
  height: 7vw;
  border: 10px solid rgba(255,174,0,.3);
  border-radius: 50%;
  border-top-color: #FFAE00;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}

#recommend-words-top {
  position: absolute;
  width: 100%;
  height: 50%;
}
#recommend-words-bot {
  position: absolute;
  width: 100%;
  height: 50%;
  margin-top: 15%;
}
#recommend1 {
  position: absolute;
  width: 12vw;
  height: 5.5vw;
  background: #F0EBD7;
  border-radius: 10px;
  margin-top: 0.6vw;
  text-align: center;
  font-size: 2.5vw;
  padding-top: 1vw;
  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: 900;
  display: inline-block;
  margin-left: 2vw;
  margin-right: 2vw;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}
#recommend2 {
  position: absolute;
  width: 12vw;
  height: 5.5vw;
  background: #F0EBD7;
  border-radius: 10px;
  margin-top: 0.6vw;
  text-align: center;
  font-size: 2.5vw;
  padding-top: 1vw;
  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: 900;
  display: inline-block;
  margin-left: 18vw;
  margin-right: 2vw;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}
#recommend3 {
  position: absolute;
  width: 12vw;
  height: 5.5vw;
  background: #F0EBD7;
  border-radius: 10px;
  margin-top: 0.6vw;
  text-align: center;
  font-size: 2.5vw;
  padding-top: 1vw;
  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: 900;
  display: inline-block;
  margin-left: 34vw;
  margin-right: 2vw;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}
#recommend4 {
  position: absolute;
  width: 12vw;
  height: 5.5vw;
  background: #F0EBD7;
  border-radius: 10px;
  margin-top: 0.6vw;
  text-align: center;
  font-size: 2.5vw;
  padding-top: 1vw;
  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: 900;
  display: inline-block;
  margin-left: 2vw;
  margin-right: 2vw;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}
#recommend5 {
  position: absolute;
  width: 12vw;
  height: 5.5vw;
  background: #F0EBD7;
  border-radius: 10px;
  margin-top: 0.6vw;
  text-align: center;
  font-size: 2.5vw;
  padding-top: 1vw;
  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: 900;
  display: inline-block;
  margin-left: 18vw;
  margin-right: 2vw;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}
#recommend6 {
  position: absolute;
  width: 12vw;
  height: 5.5vw;
  background: #F0EBD7;
  border-radius: 10px;
  margin-top: 0.6vw;
  text-align: center;
  font-size: 2.5vw;
  padding-top: 1vw;
  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: 900;
  display: inline-block;
  margin-left: 34vw;
  margin-right: 2vw;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
}
#right-btn {
  position: absolute;
  width: 12vw;
  height: 18vh;
  margin-left: 83%;
  padding: 0;
  background-image: url('../../../assets/img/views/activity/mindmap/next.png');
  background-size: cover;
}

#input-test {
  position: absolute;
  background: orange;
  top: 20vh;
  left: 20vw;
  z-index: 1;
}
</style>

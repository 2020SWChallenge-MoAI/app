<template>
  <div id="main">
    <div id="background-forest" />

    <div id="first">
      <div style="position: relative; margin-top: 10%; height: 1vw;" />
      <div id="left-btn" >
        <div id="btn-back-img" />
        <span id="btn-string" >뒤로가기</span>
      </div>
      <div id="left-btn" >
        <div id="btn-save-img" />
        <span id="btn-string" >저장</span>
      </div>
      <div id="left-btn" >
        <div id="btn-reset-img" />
        <span id="btn-string" >초기화</span>
      </div>
      <div id="left-btn" >
        <div id="btn-share-img" />
        <span id="btn-string" >공유하기</span>
      </div>

      <div id="left-menu">
        <div style="width: 1vw; height: 2vw;" />
        <div id="left-menu-pen" />
        <div id="left-menu-move" />
        <div id="left-menu-select" />
        <div id="left-menu-delete" />
        <div id="left-menu-zoomin" />
        <div id="left-menu-zoomout" />
      </div>
    </div>

    <div id="second">

      <div id="center-box">

        <div id="center-tab">
          생각펼치기
        </div>

        <div id="center-comment">
          떠오르는 단어를 적어 커다란 나무를 완성해보자!
        </div>

        <div id="center-note">
          <div id="punch-holes">
            <div id="holes" style="left: 0vw;" />
            <div id="holes" style="left: 6vw;" />
            <div id="holes" style="left: 12vw;" />
            <div id="holes" style="left: 18vw;" />
            <div id="holes" style="left: 24vw;" />
            <div id="holes" style="left: 30vw;" />
            <div id="holes" style="left: 36vw;" />
            <div id="holes" style="left: 42vw;" />
            <div id="holes" style="left: 48vw;" />
            <div id="holes" style="left: 54vw;" />
            <div id="holes" style="left: 60vw;" />
          </div>

          <canvas id="center-canvas" />
        </div>

        <div id="center-recommend">
          <div id="ai-background">
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
              <div class="recommend-word" id="recommend1">
              </div>
              <div class="recommend-word" id="recommend2">
              </div>
              <div class="recommend-word" id="recommend3">
              </div>
            </div>
            <div id="recommend-words-bot">
              <div class="recommend-word" id="recommend4">
              </div>
              <div class="recommend-word" id="recommend5">
              </div>
              <div class="recommend-word" id="recommend6">
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
      </div>

    </div>

    <div id="third">
      <div id="menu-text">
        MENU
      </div>
      <div id="right-menu">
        <div id="menu-ai" />
        <div id="menu-mindmap" />
        <div id="menu-activity" />
        <div id="menu-quiz" />
        <div id="menu-filtering" />
        <div id="menu-mypage" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      canvas: document.getElementById(''),
      ctx: [],
      doubleTabTimer: false,
      scale: 1,
      canvasScale: 1,
      touchmode: 'pen',
      commandHistory: [],
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

      wordSelected: '',
      wordCanSelect: true,
      recommendClicked: false,
      recommendLoaded: false,
    };
  },

  mounted() {
    this.canvas = document.getElementById('center-canvas');
    this.ctx.push(this.canvas.getContext('2d'));

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

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

    const penBtn = document.querySelector('#left-menu-pen');
    const dragBtn = document.querySelector('#left-menu-move');
    const selectBtn = document.querySelector('#left-menu-select');
    const zoomin = document.querySelector('#left-menu-zoomin');
    const zoomout = document.querySelector('#left-menu-zoomout');
    const deleteBtn = document.querySelector('#left-menu-delete');
    const nextBtn = document.querySelector('#right-btn');
    const recommendWords = document.querySelectorAll('.recommend-word');
    const aiSupportBtn = document.querySelector('#ai-background');

    if (penBtn) {
      penBtn.addEventListener('click', this.penBtnClicked);
    }
    if (dragBtn) {
      dragBtn.addEventListener('click', this.dragBtnClicked);
    }
    if (selectBtn) {
      selectBtn.addEventListener('click', this.selectBtnClicked);
    }
    if (zoomin) {
      zoomin.addEventListener('click', this.zoominClicked);
    }
    if (zoomout) {
      zoomout.addEventListener('click', this.zoomoutClicked);
    }
    if (deleteBtn) {
      deleteBtn.addEventListener('click', this.deleteBtnClicked);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', this.nextBtnClicked);
    }
    if (aiSupportBtn) {
      aiSupportBtn.addEventListener('click', this.aiSupportBtnClicked);
    }
    recommendWords.forEach((word) => {
      // eslint-disable-next-line no-unused-vars
      word.addEventListener('click', (e) => {
        this.recommendWordClicked(e);
      });

      this.touchmode = 'word';
      this.wordSelected = word.innerText;
    }, true);

    this.ctx[0].scale(0.9, 0.9);
    this.ctx[0].scale(0.9, 0.9);
    this.ctx[0].scale(1, 1);
    this.padding.x = -100;
    this.padding.y = -95;
    this.scale = 0.9 * 0.9;
    this.canvasScale = 0.8;

    this.edges.push({
      id: 1, from: 0, to: 1,
    });
    this.edges.push({
      id: 1, from: 0, to: 2,
    });
    this.edges.push({
      id: 1, from: 0, to: 3,
    });
    this.edges.push({
      id: 1, from: 0, to: 4,
    });

    this.nodes.push({
      id: 0, x: this.canvas.width / 2, y: this.canvas.height / 2, size: 125, type: -1, link: true,
    });

    this.nodes.push({
      // eslint-disable-next-line max-len
      id: 1, label: '등장인물', x: 120, y: 120, size: 80, type: 0, link: true,
    });
    this.nodes.push({
      // eslint-disable-next-line max-len
      id: 2, label: '줄거리', x: this.canvas.width - 120, y: 120, size: 80, type: 1, link: true,
    });
    this.nodes.push({
      // eslint-disable-next-line max-len
      id: 3, label: '느낀점', x: 120, y: this.canvas.height - 120, size: 80, type: 2, link: true,
    });
    this.nodes.push({
      // eslint-disable-next-line max-len
      id: 4, label: '인상장면', x: this.canvas.width - 120, y: this.canvas.height - 120, size: 80, type: 3, link: true,
    });

    this.reDrawAll();
  },

  methods: {
    initSetting(changeX, changeY) {
      const paddingX = changeX + this.padding.x;
      const paddingY = changeY + this.padding.y;

      // 템플릿(나무) 그리기
      this.ctx[0].beginPath();
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(this.canvas.width / 2 - paddingX, this.canvas.height / 2 - 80 - paddingY);
      this.ctx[0].strokeStyle = '#7ed221';
      this.ctx[0].fillStyle = '#7ed221';
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(this.canvas.width / 2 - 250 - paddingX, this.canvas.height / 2 - 200 - paddingY, this.canvas.width / 2 - 250 - paddingX, this.canvas.height / 2 + 180 - paddingY, this.canvas.width / 2 - paddingX, this.canvas.height / 2 + 120 - paddingY);
      // eslint-disable-next-line max-len
      this.ctx[0].moveTo(this.canvas.width / 2 - 5 - paddingX, this.canvas.height / 2 + 120 - paddingY);
      // eslint-disable-next-line max-len
      this.ctx[0].bezierCurveTo(this.canvas.width / 2 + 200 - paddingX, this.canvas.height / 2 + 180 - paddingY, this.canvas.width / 2 + 200 - paddingX, this.canvas.height / 2 - 150 - paddingY, this.canvas.width / 2 - 5 - paddingX, this.canvas.height / 2 - 80 - paddingY);
      this.ctx[0].fill();

      // 나무 줄기 그리기
      this.ctx[0].beginPath();
      this.ctx[0].fillStyle = '#836d4b';
      // eslint-disable-next-line max-len
      this.ctx[0].fillRect(this.canvas.width / 2 - 20 - paddingX, this.canvas.height - 120 - paddingY, 40, 120);
      this.ctx[0].lineWidth = 12;
      this.ctx[0].strokeStyle = '#836d4b';
      // eslint-disable-next-line max-len
      this.ctx[0].arc(this.canvas.width * 0.5 - paddingX, this.canvas.height * 0.4 - paddingY, 130, Math.PI * 0.25, Math.PI * 0.75);
      this.ctx[0].stroke();

      // 책 이미지 넣기
      const bookImg = new Image();
      // eslint-disable-next-line
      bookImg.src = require('../../assets/left-book-menu/book3.png');
      // eslint-disable-next-line
      this.ctx[0].drawImage(bookImg, this.canvas.width / 2 - 80 - paddingX, this.canvas.height / 2 - 150 - paddingY, 150, 200);
    },

    startDraw(event) {
      if (this.touchmode === 'pen') {
        this.reDrawAll();
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
        // eslint-disable-next-line max-len
        this.commandHistory.push({
          x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'lineStart',
        });
      } else if (this.touchmode === 'drag') {
        this.selectedNode = -1;
        const coors = this.getPosition(event);
        this.startPos.x = coors.X;
        this.startPos.y = coors.Y;
      } else if (this.touchmode === 'select') {
        this.selectedNode = -1;
        // 노드에 연결 안돼있는 엣지 제거
        if (this.edgeId !== -1) {
          const index = this.edges.findIndex((element) => element.id === this.edgeId);
          this.edges.splice(index, 1);
          this.edgeId = -1;
        }
        this.reDrawAll();
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
                this.doubleSelectedNode = this.selectedNode;
              }
            }
            this.selectedNode = this.nodes[i].id;
            this.doubleSelectedNode = this.selectedNode;
          }
        }
        if (this.selectedNode !== -1) {
          const node = this.nodes.find((element) => element.id === this.selectedNode);
          this.reDrawAll();
          // eslint-disable-next-line max-len
          this.highlightNode(node.x - this.padding.x, node.y - this.padding.y, node.size, node.type);
        }
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
        this.commandHistory.push({
          x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'line',
        });
      } else if (this.touchmode === 'drag') {
        const coors = this.getPosition(event);
        const changeX = this.startPos.x - coors.X;
        const changeY = this.startPos.y - coors.Y;

        this.ctx[0].clearRect(0, 0, 100000, 100000);
        this.ctx[0].beginPath();

        // edge 먼저 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.edges.length; i++) {
          let from = this.nodes.find((element) => element.id === this.edges[i].from);
          let to = this.nodes.find((element) => element.id === this.edges[i].to);
          if (this.edges[i].from === -1) from = { x: this.edgePos.x, y: this.edgePos.y };
          else if (this.edges[i].to === -1) to = { x: this.edgePos.x, y: this.edgePos.y };
          // eslint-disable-next-line max-len
          this.drawEdge(from.x - this.padding.x - changeX, from.y - this.padding.y - changeY, to.x - this.padding.x - changeX, to.y - this.padding.y - changeY);
        }

        // 템플릿 그리기
        this.initSetting(changeX, changeY);

        // node 그리기
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.nodes.length; i++) {
          // eslint-disable-next-line max-len
          this.makeNode(this.nodes[i].x - this.padding.x - changeX, this.nodes[i].y - this.padding.y - changeY, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
        }
      } else if (this.touchmode === 'select') {
        if (this.selectedNode !== -1) {
          const coors = this.getPosition(event);
          const index = this.nodes.findIndex((element) => element.id === this.selectedNode);
          const node = this.nodes.find((element) => element.id === this.selectedNode);

          this.nodes[index].x = coors.X + this.padding.x;
          this.nodes[index].y = coors.Y + this.padding.y;

          this.ctx[0].clearRect(0, 0, 100000, 100000);
          this.ctx[0].beginPath();

          // edge 먼저 그리기
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < this.edges.length; i++) {
            let from = this.nodes.find((element) => element.id === this.edges[i].from);
            let to = this.nodes.find((element) => element.id === this.edges[i].to);
            if (this.edges[i].from === -1) from = { x: this.edgePos.x, y: this.edgePos.y };
            else if (this.edges[i].to === -1) to = { x: this.edgePos.x, y: this.edgePos.y };
            // eslint-disable-next-line max-len
            this.drawEdge(from.x - this.padding.x, from.y - this.padding.y, to.x - this.padding.x, to.y - this.padding.y);
          }

          // 템플릿 그리기
          this.initSetting(0, 0);

          // node 그리기
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < this.nodes.length; i++) {
            // eslint-disable-next-line max-len
            this.makeNode(this.nodes[i].x - this.padding.x, this.nodes[i].y - this.padding.y, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
          }

          // eslint-disable-next-line max-len
          this.highlightNode(node.x - this.padding.x, node.y - this.padding.y, node.size, node.type);
        }
      }
    },

    finishDraw(event) {
      if (this.touchmode === 'pen') {
        const coors = this.getPosition(event);
        // eslint-disable-next-line max-len
        const thresh = (this.startPos.x - coors.X) * (this.startPos.x - coors.X) + (this.startPos.y - coors.Y) * (this.startPos.y - coors.Y);

        if (thresh > 800) {
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
            this.commandHistory.push({
              x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'lineFinish',
            });
            let lastPoint = this.commandHistory.pop();
            while (lastPoint.mode !== 'lineStart') {
              lastPoint = this.commandHistory.pop();
            }
            this.reDrawAll();

            // 하나만 연결된 edge일 때
          } else if (edgeFrom === -1 || edgeTo === -1) {
            const newid = new Date().getTime();
            this.edges.push({ id: newid, from: edgeFrom, to: edgeTo });
            this.edgeId = newid;
            this.edgePos.x = coors.X + this.padding.x;
            this.edgePos.y = coors.Y + this.padding.y;
            this.reDrawAll();
            // edge일 때
          } else {
            const newid = new Date().getTime();
            this.edges.push({ id: newid, from: edgeFrom, to: edgeTo });
            this.commandHistory.push({
              x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'edge', id: newid,
            });
            const nodeindex1 = this.nodes.findIndex((element) => element.id === edgeFrom);
            const nodeindex2 = this.nodes.findIndex((element) => element.id === edgeTo);
            this.nodes[nodeindex1].link = true;
            this.nodes[nodeindex2].link = true;
            this.reDrawAll();
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
          this.reDrawAll();
        } else {
          const inputLabel = prompt('단어를 입력하세요.');
          let nodesize = 50;
          const size = (this.maxPos.R - this.maxPos.L) / 2 + (this.maxPos.T - this.maxPos.B) / 2;
          nodesize = size / 2;

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

          if (inputLabel != null) {
            const newid = new Date().getTime();
            this.nodes.push({
            // eslint-disable-next-line max-len
              id: newid, label: inputLabel, x: (this.maxPos.L + this.maxPos.R) / 2 + this.padding.x, y: (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y, size: nodesize, type: newid % 4, link: false,
            });

            // 노드에 연결 안돼있는 엣지 제거
            if (this.edgeId !== -1) {
              // eslint-disable-next-line max-len
              if (((this.maxPos.L + this.maxPos.R) / 2 + this.padding.x - nodesize < this.edgePos.x && this.edgePos.x < (this.maxPos.L + this.maxPos.R) / 2 + this.padding.x + nodesize) && ((this.maxPos.T + this.maxPos.B) / 2 + this.padding.y - nodesize < this.edgePos.y && this.edgePos.y < (this.maxPos.T + this.maxPos.B) / 2 + this.padding.y + nodesize)) {
                const index = this.edges.findIndex((element) => element.id === this.edgeId);
                if (this.edges[index].to === -1) this.edges[index].to = newid;
                else this.edges[index].from = newid;
                const nodeindex = this.nodes.findIndex((element) => element.id === newid);
                this.nodes[nodeindex].link = true;
              } else {
                const index = this.edges.findIndex((element) => element.id === this.edgeId);
                this.edges.splice(index, 1);
              }
            }

            this.edgeId = -1;
            this.reDrawAll();
          } else {
            this.commandHistory.push({
              x: coors.X + this.padding.x, y: coors.Y + this.padding.y, size: this.brushSize, color: this.strokeColor, mode: 'lineFinish',
            });
            let lastPoint = this.commandHistory.pop();
            while (lastPoint.mode !== 'lineStart') {
              lastPoint = this.commandHistory.pop();
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
            this.reDrawAll();
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
        const coors = this.getPosition(event);

        this.ctx[0].beginPath();
        this.ctx[0].strokeStyle = this.strokeColor;
        this.ctx[0].lineWidth = this.brushSize;
        // eslint-disable-next-line max-len
        this.ctx[0].arc(coors.X, coors.Y, 50, 0, Math.PI * 2);
        this.ctx[0].stroke();

        const inputLabel = this.wordSelected;
        this.ctx[0].font = '15px Calibri';

        if (inputLabel != null) {
          const labelLength = inputLabel.length;
          this.ctx[0].strokeStyle = 'black';
          this.ctx[0].fillStyle = 'black';
          // eslint-disable-next-line max-len
          this.ctx[0].fillText(inputLabel, coors.X - labelLength * 5, coors.Y);
          this.commandHistory.push({
            x: coors.X - labelLength * 5 + this.padding.x, y: coors.Y + this.padding.y, color: 'black', mode: 'text', text: inputLabel, font: this.ctx[0].font,
          });
          this.ctx[0].strokeStyle = this.strokeColor;
          const newid = new Date().getTime();
          this.nodes.push({
          // eslint-disable-next-line max-len
            id: newid, label: inputLabel, T: coors.Y + 50 + this.padding.y, B: coors.Y - 50 + this.padding.y, L: coors.X - 50 + this.padding.x, R: coors.X + 50 + this.padding.x,
          });
          this.commandHistory.push({
            x: coors.X + this.padding.x, y: coors.Y + this.padding.y, r: 50, size: this.brushSize, color: this.strokeColor, mode: 'circle', text: 'node',
          });
        } else {
          this.commandHistory.push({
            x: coors.X + this.padding.x, y: coors.Y + this.padding.y, r: 50, size: this.brushSize, color: this.strokeColor, mode: 'circle', text: 'empty',
          });
        }
        const recommendWords = document.querySelectorAll('.recommend');
        recommendWords.forEach((word) => {
          if (word.innerText === this.wordSelected) {
            word.classList.remove('recommend-selected');
          }
        }, true);
        this.wordSelected = '';
        this.touchmode = '';
        this.wordCanSelect = true;
      } else if (this.touchmode === 'select') {
        if (this.doubleSelectedNode === this.selectedNode) {
          if (this.doubleSelectedTime) {
            const index = this.nodes.findIndex((element) => element.id === this.selectedNode);
            const inputLabel = prompt('단어를 입력하세요.', this.nodes[index].label);

            if (inputLabel != null) {
              this.nodes[index].label = inputLabel;
              this.reDrawAll();
              this.doubleSelectedTime = false;
            }
          } else {
            this.doubleSelectedTime = true;
            setTimeout(() => {
              this.doubleSelectedTime = false;
            }, 200);
          }
        } else {
          this.doubleSelectedTime = true;
          setTimeout(() => {
            this.doubleSelectedTime = false;
          }, 200);
        }
      }
    },

    reDrawAll() {
      this.ctx[0].clearRect(0, 0, 100000, 100000);
      this.ctx[0].beginPath();

      // edge 먼저 그리기
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.edges.length; i++) {
        let from = this.nodes.find((element) => element.id === this.edges[i].from);
        let to = this.nodes.find((element) => element.id === this.edges[i].to);
        if (this.edges[i].from === -1) from = { x: this.edgePos.x, y: this.edgePos.y };
        else if (this.edges[i].to === -1) to = { x: this.edgePos.x, y: this.edgePos.y };
        // eslint-disable-next-line max-len
        this.drawEdge(from.x - this.padding.x, from.y - this.padding.y, to.x - this.padding.x, to.y - this.padding.y);
      }

      // 템플릿 그리기
      this.initSetting(0, 0);

      // node 그리기
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.nodes.length; i++) {
        // eslint-disable-next-line max-len
        this.makeNode(this.nodes[i].x - this.padding.x, this.nodes[i].y - this.padding.y, this.nodes[i].size, this.nodes[i].type, this.nodes[i].label);
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
      if (text !== undefined) {
        if (text.length > 8) fontsize /= 2;
        else if (text.length > 5) fontsize = size / (text.length - 1);
        linesize = Math.floor(text.length / 10) + 1;
        if (text.length % 10 === 0) linesize -= 1;
      }
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
        let textloc = ((linesize - 1) / 2) * -1;
        for (let i = 0; i < linesize; i += 1) {
          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';
          // eslint-disable-next-line max-len
          this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
          textloc += 1;
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
        let textloc = ((linesize - 1) / 2) * -1;
        for (let i = 0; i < linesize; i += 1) {
          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';
          // eslint-disable-next-line max-len
          this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
          textloc += 1;
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
        let textloc = ((linesize - 1) / 2) * -1;
        for (let i = 0; i < linesize; i += 1) {
          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';
          // eslint-disable-next-line max-len
          this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2), y + textloc * (fontsize + (fontsize / 3)));
          textloc += 1;
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
        let textloc = ((linesize - 1) / 2) * -1;
        for (let i = 0; i < linesize; i += 1) {
          // eslint-disable-next-line prefer-template
          this.ctx[0].font = 'bold ' + fontsize + 'px Calibri';
          this.ctx[0].fillStyle = 'white';
          // eslint-disable-next-line max-len
          this.ctx[0].fillText(text.substring(i * 10, (i + 1) * 10), x - fontsize * (text.substring(i * 10, (i + 1) * 10).length / 2 - 0.2), y + textloc * (fontsize + (fontsize / 3)));
          textloc += 1;
        }
      }
    },

    highlightNode(x, y, size, type) {
      if (type === 0) {
        // 나뭇잎1 그리기
        this.ctx[0].beginPath();
        // 기본 세팅
        this.ctx[0].strokeStyle = '#649a28';
        this.ctx[0].lineWidth = 8;

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
        this.ctx[0].lineWidth = 8;

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
        this.ctx[0].lineWidth = 8;

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
        this.ctx[0].lineWidth = 8;

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
    },

    drawEdge(x1, y1, x2, y2) {
      this.ctx[0].beginPath();
      this.ctx[0].moveTo(x1, y1);
      this.ctx[0].lineWidth = 12;
      this.ctx[0].strokeStyle = '#baad93';
      this.ctx[0].lineTo(x2, y2);
      this.ctx[0].stroke();
    },

    penBtnClicked() {
      this.touchmode = 'pen';
      this.ctx[0].lineWidth = 12;
      this.ctx[0].strokeStyle = '836d4b';
    },

    dragBtnClicked() {
      this.touchmode = 'drag';
    },

    selectBtnClicked() {
      this.touchmode = 'select';
    },

    deleteBtnClicked() {
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
        this.nodes[toindex].link = true;
        this.nodes[fromindex].link = true;
      }

      this.reDrawAll();
      this.selectedNode = -1;
    },

    zoominClicked() {
      if (this.canvasScale < 3) {
        this.canvasScale += 0.1;
        this.scale *= 1.1;
        this.ctx[0].scale(1.1, 1.1);
        this.reDrawAll();
      }
    },

    zoomoutClicked() {
      if (this.canvasScale > 0.1) {
        this.canvasScale -= 0.1;
        this.scale *= 0.9;
        this.ctx[0].scale(0.9, 0.9);
        this.reDrawAll();
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
      word1.style.background = '#F0EBD7';
      word2.style.background = '#F0EBD7';
      word3.style.background = '#F0EBD7';
      word4.style.background = '#F0EBD7';
      word5.style.background = '#F0EBD7';
      word6.style.background = '#F0EBD7';

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

      axios.get('/api/book/3/keyword', {
        params: {
          num: 60, anc: [this.wordSelected],
        },
        headers: {
          'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjEsImV4cCI6MTYzMjA1MzYyMX0.Qj4k0qGouoYABTAGF_WWJLSfmxrDw9i87ZB2HM-ZiGU',
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
          word1.style.background = '#b6b6b6';
          this.wordSelected = word1.innerHTML;
          word2.style.background = '#F0EBD7';
          word3.style.background = '#F0EBD7';
          word4.style.background = '#F0EBD7';
          word5.style.background = '#F0EBD7';
          word6.style.background = '#F0EBD7';
        } else if (e.target.id === 'recommend2') {
          word2.style.background = '#b6b6b6';
          this.wordSelected = word2.innerHTML;
          word1.style.background = '#F0EBD7';
          word3.style.background = '#F0EBD7';
          word4.style.background = '#F0EBD7';
          word5.style.background = '#F0EBD7';
          word6.style.background = '#F0EBD7';
        } else if (e.target.id === 'recommend3') {
          word3.style.background = '#b6b6b6';
          this.wordSelected = word3.innerHTML;
          word1.style.background = '#F0EBD7';
          word2.style.background = '#F0EBD7';
          word4.style.background = '#F0EBD7';
          word5.style.background = '#F0EBD7';
          word6.style.background = '#F0EBD7';
        } else if (e.target.id === 'recommend4') {
          word4.style.background = '#b6b6b6';
          this.wordSelected = word4.innerHTML;
          word1.style.background = '#F0EBD7';
          word2.style.background = '#F0EBD7';
          word3.style.background = '#F0EBD7';
          word5.style.background = '#F0EBD7';
          word6.style.background = '#F0EBD7';
        } else if (e.target.id === 'recommend5') {
          word5.style.background = '#b6b6b6';
          this.wordSelected = word5.innerHTML;
          word1.style.background = '#F0EBD7';
          word2.style.background = '#F0EBD7';
          word3.style.background = '#F0EBD7';
          word4.style.background = '#F0EBD7';
          word6.style.background = '#F0EBD7';
        } else if (e.target.id === 'recommend6') {
          word6.style.background = '#b6b6b6';
          this.wordSelected = word6.innerHTML;
          word1.style.background = '#F0EBD7';
          word2.style.background = '#F0EBD7';
          word3.style.background = '#F0EBD7';
          word4.style.background = '#F0EBD7';
          word5.style.background = '#F0EBD7';
        }
      }
    },
  },

};
</script>

<style scoped>
#main {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #A6D6CD 0%, rgba(166, 214, 205, 0) 100%);
}

#first {
  width: 10%;
  height: 100%;
  display: inline-block;
}

#second {
  width: 80%;
  height: 100%;
  display: inline-block;
}

#third {
  width: 10%;
  height: 100%;
  display: inline-block;
}

#background-forest {
  background-image: url('../../assets/background-forest.svg');
  background-size: cover;
  width: 100%;
  height: 50%;
  position: absolute;
  top: 50%;
  z-index: 1;
}

#center-box {
  position: relative;
  width: 100%;
  height: 90%;
  background: rgba(255, 253, 242, 0.6);
  border-radius: 20px;
  z-index: 10;
  margin-top: 5%;
}

#center-tab {
  position: absolute;
  background: #EE8F89;
  border-radius: 15px;
  width: 18vw;
  height: 6vw;
  z-index: 12;
  left: 8vw;
  top: 2vw;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: bold;
  font-size: 2.5vw;
  line-height: 30px;
  letter-spacing: 0.1vw;
  text-align: center;
  padding-top: 1vw;

  color: #FFFFFF;
}

#center-comment {
  position: absolute;
  width: 45vw;
  height: 3.5vw;
  left: 32vw;
  top: 2.2vw;
  z-index: 12;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: bold;
  font-size: 1.5vw;
  line-height: 20px;
  letter-spacing: 0.1vw;

  color: #000000;

  padding-left: 3vw;
  padding-top: 0.8vw;
}

#center-recommend {
  position: relative;
  width: 95%;
  height: 22%;
  background: #FFFDF2;
  border-radius: 20px;
  z-index: 15;
  top: 74%;
  left: 2.5%;
}
#ai-img {
  position: absolute;
  background-image: url('../../assets/mindmap/ai-recommend.png');
  background-size: cover;
  width: 14vw;
  height: 14vw;
  z-index: 18;
  display: inline-block
}
#ai-background {
  position: absolute;
  width: 12vw;
  height: 100%;
  border-radius: 20px;
  background: #FFAE00;
  display: inline-block
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
  height: 1.5vw;
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
  font-size: 3vw;
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
}
#right-btn {
  position: absolute;
  width: 13vw;
  height: 100%;
  margin-left: 82%;
  padding: 0;
  background-image: url('../../assets/mindmap/next.png');
  background-size: cover;
}

#center-note {
  position: absolute;
  width: 95%;
  height: 60%;
  background: #FFFDF2;
  border-radius: 20px;
  z-index: 15;
  top: 10%;
  left: 2.5%;
}

#punch-holes {
  position: absolute;
  width: 65vw;
  height: 3vw;
  top: 2vw;
  left: 6vw;
  z-index: 20;
}

#holes {
  position: absolute;
  width: 3vw;
  height: 3vw;
  background: #D2EADE;
  border-radius: 3vw;
  z-index: 20;
}

#center-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #FFFDF2;
  z-index: 15;
  border-radius: 20px;
}

#left-btn {
  position: relative;
  width: 6vw;
  height: 6vw;
  background: rgba(107, 152, 159, 0.6);
  border-radius: 15px;
  margin-left: 20%;
  margin-top: 20%;
  z-index: 10;
}
#btn-back-img {
  position: relative;
  width: 5.5vw;
  height: 4.5vw;
  background: url('../../assets/left-btn/btn-back.svg');
  background-size: cover;
}
#btn-save-img {
  position: relative;
  width: 6vw;
  height: 4.5vw;
  background: url('../../assets/left-btn/btn-save.svg');
  background-size: cover;
}
#btn-reset-img {
  position: relative;
  width: 6vw;
  height: 4.5vw;
  background: url('../../assets/left-btn/btn-reset.svg');
  background-size: cover;
}
#btn-share-img {
  position: relative;
  width: 6vw;
  height: 4.5vw;
  background: url('../../assets/left-btn/btn-share.svg');
  background-size: cover;
}
#btn-string {
  position: absolute;
  width: 5vw;
  height: 3vw;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: normal;
  font-size: 0.5em;
  line-height: 12px;

  text-align: center;
  letter-spacing: 0.1em;

  text-align: center;
  margin-left: 0.5vw;

  color: #FFFFFF;
}
#left-menu {
  position: relative;
  width: 8vw;
  height: 30vw;
  background: rgba(255, 253, 242, 0.6);
  border-radius: 15px;
  margin-left: 10%;
  z-index: 10;
  margin-top: 50%;
}
#left-menu-pen {
  position: relative;
  width: 4vw;
  height: 4vw;
  background: url('../../assets/drawing-tool/pen.svg');
  background-size: cover;
  border-radius: 15px;
  margin-left: 2vw;
}
#left-menu-move {
  position: relative;
  width: 4vw;
  height: 4vw;
  background: url('../../assets/drawing-tool/drag.svg');
  background-size: cover;
  border-radius: 15px;
  margin-top: 2vw;
  margin-left: 2vw;
}
#left-menu-select {
  position: relative;
  width: 4vw;
  height: 4vw;
  background: url('../../assets/drawing-tool/select.png');
  background-size: cover;
  border-radius: 15px;
  margin-top: 2vw;
  margin-left: 2vw;
}
#left-menu-zoomin {
  position: relative;
  width: 4vw;
  height: 4vw;
  background: url('../../assets/drawing-tool/zoomin.svg');
  background-size: cover;
  border-radius: 15px;
  margin-top: 2vw;
  margin-left: 2vw;
}
#left-menu-zoomout {
  position: relative;
  width: 4vw;
  height: 4vw;
  background: url('../../assets/drawing-tool/zoomout.svg');
  background-size: cover;
  border-radius: 15px;
  margin-top: 2vw;
  margin-left: 2vw;
}
#left-menu-delete {
  position: relative;
  width: 4vw;
  height: 4vw;
  background: url('../../assets/drawing-tool/delete.png');
  background-size: cover;
  border-radius: 15px;
  margin-top: 2vw;
  margin-left: 2vw;
}

#top-bar {
  position: absolute;
  margin-top: calc(8% - 3.5vw);
  margin-left: 2%;
}

#right-menu {
  position: absolute;
  width: 8%;
  height: 75%;
  z-index: 10;
  background: rgba(255, 253, 242, 0.6);
  border-radius: 10px;
  margin-left: 1%;
  margin-top: 12%;
}
#menu-text {
  position: absolute;
  width: 6vw;
  height: 2vw;
  margin-left: 1.8vw;
  margin-top: 9vw;

  font-family: BM HANNA_TTF;
  font-style: normal;
  font-weight: bold;
  font-size: 2vw;
  line-height: 20px;
  /* identical to box height */

  text-align: center;

  color: #FFFFFF;
}
#menu-ai {
  position: relative;
  width: 6vw;
  height: 8vw;
  background-image: url('../../assets/right-menu/ai.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
#menu-mindmap {
  position: relative;
  width: 6vw;
  height: 7.8vw;
  background-image: url('../../assets/right-menu/mindmap.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 3vw;
}
#menu-activity {
  position: relative;
  width: 6vw;
  height: 7.7vw;
  background-image: url('../../assets/right-menu/activity.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
#menu-quiz {
  position: relative;
  width: 6vw;
  height: 7.8vw;
  background-image: url('../../assets/right-menu/quiz.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
#menu-filtering {
  position: relative;
  width: 6.4vw;
  height: 7.6vw;
  background-image: url('../../assets/right-menu/filtering.svg');
  background-size: cover;
  margin-left: 0.8vw;
  margin-top: 1vw;
}
#menu-mypage {
  position: relative;
  width: 6vw;
  height: 7.8vw;
  background-image: url('../../assets/right-menu/mypage.svg');
  background-size: cover;
  margin-left: 1vw;
  margin-top: 1vw;
}
</style>

<template>
  <body>
    <div id="app">
      <Network
        id="ddd"
        ref="network"
        :nodes="nodes"
        :edges="edges"
        :options="options"
        @select-node="selectNode"
      />
    </div>
    <button @click="addNode">
      ADD
    </button>
    <button @click="deleteNode">
      DELETE
    </button>
    <input
      id="inputText"
      v-model="inputText"
      type="text"
      placeholder="내용을 입력해주세요"
    >
    <button>
      HINT
    </button>
    <br>
    {{ selectedID }}
  </body>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { Network } from 'vue-vis-network';

export default {
  components: {
    Network,
  },

  data() {
    return {
      selectedID: '',
      inputText: '',
      nodes: [
        {
          id: 1, group: 'class', label: '   흥부와 놀부  ', shape: 'circle', fixed: { x: true, y: true },
        },
        {
          id: 2, group: 'class0', label: '   등장인물   ', shape: 'circle',
        },
        {
          id: 3, group: 'class0', label: '     사건     ', shape: 'circle',
        },
        {
          id: 4, group: 'class0', label: '    느낀점    ', shape: 'circle',
        },
        {
          id: 5, group: 'class1', label: '44444', parent: 4,
        },
        {
          id: 6, group: 'class1', label: '66666', parent: 2,
        },
        {
          id: 7, group: 'class1', label: '77777', parent: 2,
        },
        {
          id: 8, group: 'class2', label: '88888', parent: 6,
        },
      ],
      edges: [
        {
          from: 1, to: 2, width: 50, length: 800,
        },
        {
          from: 1, to: 3, width: 50, length: 800,
        },
        {
          from: 1, to: 4, width: 50, length: 800,
        },
        {
          from: 4, to: 5, width: 30, length: 400,
        },
        {
          from: 2, to: 6, width: 30, length: 400,
        },
        {
          from: 2, to: 7, width: 30, length: 400,
        },
        {
          from: 6, to: 8, width: 20, length: 200,
        },
      ],
      options: {
        manipulation: {
          enabled: true,
        },
        nodes: {
          shape: 'circle',
          scaling: {
          },

          locale: 'en',
          clickToUse: false,
          configure: {
            showButton: true,
          },
          borderWidth: 3,
          borderWidthSelected: 100,

          color: {
            border: 'white',
            highlight: {
              background: '#fffacd',
              border: '#fff171',
              borderWidth: 10,
            },
            hover: {
              background: '#fffacd',
              border: '#fff171',
            },
          },

        },
        edges: {
          color: 'lightgray',
          selectionWidth: 0,
          smooth: true,
          scaling: {
            value: {
              min: 4,
              max: 8,
            },
          },
        },
        layout: {
          randomSeed: 0,
          nodeSpacing: 180,
        },
        interaction: {
          hover: true,
        },
        groups: {
          class: {
            color: {
              background: 'gray',
            },
            font: {
              size: 150,
            },
            mass: 60,
          },
          class0: {
            color: {
              background: 'beige',
            },
            font: {
              size: 100,
            },
            mass: 50,
          },
          class1: {
            color: {
              background: '#ddf5fc',
            },
            font: {
              size: 80,
            },
            mass: 40,
          },
          class2: {
            color: {
              background: '#e1dced',
            },
            font: {
              size: 70,
            },
            mass: 30,
          },
          class3: {
            color: {
              background: '#ffb6c1',
            },
            font: {
              size: 60,
            },
            mass: 20,
          },
          class4: {
            color: {
              background: '#d9f6d9',
            },
            font: {
              size: 50,
            },
            mass: 10,
          },
        },
      },
    };
  },

  methods: {
    selectNode(params) {
      if (this.selectedID.length > 0) this.selectedID = '';
      this.selectedID += JSON.stringify(params.nodes[0]);
    },
    addNode() {
      // eslint-disable-next-line eqeqeq
      const idx = this.nodes.findIndex((item) => item.id == this.selectedID);
      // eslint-disable-next-line eqeqeq
      if (idx > 0) {
        if (this.inputText.length < 4) this.inputText = `   ${this.inputText}   `;
        const newid = new Date().getTime();
        if (this.nodes[idx].group === 'class0') {
          this.nodes.push({
            id: newid, label: ` ${this.inputText} `, group: 'class1', parent: this.selectedID,
          });
          this.edges.push({
            from: this.selectedID, to: newid, width: 30, length: 400,
          });
        } else if (this.nodes[idx].group === 'class1') {
          this.nodes.push({
            id: newid, label: ` ${this.inputText} `, group: 'class2', parent: this.selectedID,
          });
          this.edges.push({
            from: this.selectedID, to: newid, width: 20, length: 200,
          });
        } else if (this.nodes[idx].group === 'class2') {
          this.nodes.push({
            id: newid, label: ` ${this.inputText} `, group: 'class3', parent: this.selectedID,
          });
          this.edges.push({
            from: this.selectedID, to: newid, width: 15, length: 150,
          });
        } else {
          this.nodes.push({
            id: newid, label: ` ${this.inputText} `, group: 'class4', parent: this.selectedID,
          });
          this.edges.push({
            from: this.selectedID, to: newid, width: 10, length: 100,
          });
        }
      }

      this.inputText = '';
    },
    deleteNode() {
      // eslint-disable-next-line eqeqeq
      if (this.selectedID != 1) {
        // eslint-disable-next-line eqeqeq
        const idx = this.nodes.findIndex((item) => item.id == this.selectedID);
        const parentList = [this.nodes[idx].id];
        if (idx > 3) this.nodes.splice(idx, 1);
        // eslint-disable-next-line eqeqeq
        let childidx = this.nodes.findIndex((item) => item.parent == parentList[0]);

        while (parentList.length !== 0) {
          while (childidx > -1) {
            parentList.push(this.nodes[childidx].id);
            this.nodes.splice(childidx, 1);
            // eslint-disable-next-line eqeqeq
            childidx = this.nodes.findIndex((item) => item.parent == parentList[0]);
          }
          parentList.shift();
          // eslint-disable-next-line eqeqeq
          childidx = this.nodes.findIndex((item) => item.parent == parentList[0]);
        }
      }
    },
  },

};
</script>

<style scoped>
#ddd {
    height: 800px;
    background-color: #4A655A;
}
button {
  border: 1px solid black;
  margin: 10px;
  background-color: burlywood;
}
#inputText {
  border: 1px solid black;
  margin: 10px;
}
</style>
